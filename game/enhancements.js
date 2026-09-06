const DISH_ASSETS={te:null,fr:null,lcr:null,me:null,oe:null,ce:null,ten:null,cmo:null,ccs:null,pc:null,ct:null,tt:null,cut:null,ecs:null,cst:null,bm:null,ay:null,bs:null,cse:null,se:null};
let rewardTimer=null,cookTimer=null;
const recipeThumb=id=>DISH_ASSETS[id]?`<img src="${DISH_ASSETS[id]}" alt="">`:Object.keys(R[id][1]).slice(0,2).map(emoji).join('');
const baseHome=home;
levelPage=function(){
  page('关卡','首次推进至少完成 1 道菜；三星不是门槛。',`<div class="levels">${L.map(l=>`<button class="level" data-day="${l[0]}" ${l[0]>P.un?'disabled':''}><span class="day-box">DAY<br>${l[0]}</span><span><h3>${l[1]}</h3><p>${l[2]}</p></span><span class="stars">${stars(P.best['d'+l[0]]||0)}</span></button>`).join('')}</div>`);
  app.querySelectorAll('[data-day]').forEach(x=>x.addEventListener('click',()=>start(+x.dataset.day)));
};
home=function(){
  if(!P.completed){baseHome();return}
  S=Q=null;
  const totalStars=Object.values(P.best||{}).reduce((sum,n)=>sum+(Number(n)||0),0);
  app.innerHTML=`<section class="screen home"><div class="door"><div class="note"><h1>冰箱清空计划</h1><p>你的冰箱里没有剩菜，<br>只有还没被想出来的晚饭。</p></div><div class="completion-card"><div class="big">8 / 8</div><h2>冰箱清空计划完成</h2><p>八个晚上都已经结算。当前最好成绩合计 ${totalStars} / 24 星。</p></div><div class="completion-actions"><button class="primary" id="completedLevels">查看关卡</button><button class="secondary" id="replayDay8">重玩 DAY 8</button></div><div class="home-links"><button id="resetComplete">重置进度</button></div></div></section>`;
  el('completedLevels').addEventListener('click',levelPage);
  el('replayDay8').addEventListener('click',()=>start(8));
  el('resetComplete').addEventListener('click',()=>{if(window.confirm('重置全部关卡进度？')){localStorage.removeItem('fridge_clear_v1');location.reload()}});
};
renderMenu=function(){
  el('doneCount').textContent=S.done.length+' 道';
  el('doneList').innerHTML=S.done.map(id=>`<button type="button" class="done-dish" data-done-recipe="${id}"><span class="done-thumb">${recipeThumb(id)}</span><span class="done-name">${R[id][0]}</span></button>`).join('');
  el('possible').textContent=`还能做 ${possibleIds().length} 道 ＞`;
  el('doneList').querySelectorAll('[data-done-recipe]').forEach(btn=>btn.addEventListener('click',()=>showCompletedDish(btn.dataset.doneRecipe)));
};
function showCompletedDish(id){
  const r=R[id];
  showModal(`<div class="dish-detail-thumb">${recipeThumb(id)}</div><h2>${r[0]}</h2><p>👥 ${r[2]} 人份 · ⏱ ${r[3]} 分钟 · 🔥 ${r[5]} kcal</p><div class="modal-actions"><button class="primary" id="closeDishDetail">知道了</button></div>`);
  el('closeDishDetail').addEventListener('click',closeModal);
}
function setCookingUI(on){
  S.cooking=on;
  const game=app.querySelector('.game'),fireBtn=el('fire'),pot=app.querySelector('.pot');
  if(game)game.classList.toggle('cooking',on);if(pot)pot.classList.toggle('cooking',on);
  if(fireBtn){fireBtn.disabled=on;if(on)fireBtn.textContent='烹饪中…'}
}
function showDishReward(id){
  clearTimeout(rewardTimer);
  let reward=app.querySelector('.dish-reward');
  if(!reward){reward=document.createElement('div');reward.className='dish-reward';const game=app.querySelector('.game');if(game)game.appendChild(reward)}
  reward.innerHTML=`<div class="reward-thumb">${recipeThumb(id)}</div><b>${R[id][0]}</b><small>完成一道菜</small>`;
  requestAnimationFrame(()=>reward.classList.add('show'));
  rewardTimer=setTimeout(()=>reward.classList.remove('show'),700);
}
function commitCookEnhanced(id){
  if(!S||!S.cooking)return;
  const r=R[id];
  if(!r||matchedId()!==id||!canMake(r)){setCookingUI(false);update();return}
  const beforeInv=Object.assign({},S.inv),before=possibleIds(beforeInv),nextInv=Object.assign({},S.inv);
  for(const[i,n]of Object.entries(r[1])){if((nextInv[i]||0)<n){setCookingUI(false);update();return}nextInv[i]-=n}
  S.inv=nextInv;S.done.push(id);S.sel=[];S.m.t+=r[3];S.m.s+=r[2];S.m.k+=r[5];
  const after=possibleIds(nextInv),closed=before.filter(x=>x!==id&&!after.includes(x));
  const depleted=Object.keys(r[1]).filter(i=>(beforeInv[i]||0)>0&&(nextInv[i]||0)===0);
  const causalClosed=closed.filter(recipeId=>missingForRecipe(recipeId,nextInv).some(i=>depleted.includes(i)));
  const causalDepleted=depleted.filter(i=>causalClosed.some(recipeId=>missingForRecipe(recipeId,nextInv).includes(i)));
  if(S.tutorial&&S.tutorial.phase==='fire'){P.tutorial.basicDone=true;save();S.tutorial=null}
  setCookingUI(false);update();showDishReward(id);
  if(causalClosed.length&&causalDepleted.length)showToast(`${causalDepleted.map(name).join('、')}用完了`,`${causalClosed.length} 道菜暂时做不了了`);else showToast(`${r[0]}完成`);
}
cook=function(){
  if(S&&S.cooking)return;
  const id=matchedId();if(!id)return;
  const r=R[id];if(!canMake(r))return;
  setCookingUI(true);
  clearTimeout(cookTimer);cookTimer=setTimeout(()=>commitCookEnhanced(id),800);
};
finishGame=function(){
  const s=stats(),day=Q[0],day1Perfect=day===1&&s.c===1;
  const p=day1Perfect?['精算规划型','三个鸡蛋，一个都没白用。']:s.c===1?['极限清库存型','今天要救的食材，一个都没浪费。']:['明天再说型','差一点，冰箱里还有个小尾巴。'];
  const participated=s.d>0;
  const nextWasUnlocked=day<8&&day<P.un;
  P.best['d'+day]=Math.max(P.best['d'+day]||0,s.star);
  if(participated&&day<8)P.un=Math.max(P.un,day+1);
  if(day===8&&participated)P.completed=true;
  const canGoNext=day<8&&(nextWasUnlocked||participated||day<P.un);
  P.last=canGoNext?day+1:day;
  save();
  const wasteText=s.waste==null?'—':`¥${s.waste.toFixed(2)}`;
  const leftover=s.left.length?`<div class="leftover">今晚留下：${s.left.join('、')}</div>`:'';
  const mvp=day1Perfect?'今晚 MVP：鸡蛋':s.left.length?'今晚留下：'+s.left.join('、'):'今天要救的食材，一个都没浪费。';
  const blocked=!participated&&((day<8&&!nextWasUnlocked)||(day===8&&!P.completed));
  const unlockNote=blocked?`<div class="unlock-note">${day<8?'至少完成 1 道菜后，才能首次解锁下一关。':'至少完成 1 道菜后，才能完成整个计划。'}</div>`:'';
  const retryClass=(s.c<1||blocked)?'primary':'secondary';
  const nextClass=(s.c<1||blocked)?'secondary':'primary';
  const nextLabel=day===8?(P.completed?'完成计划':'返回关卡'):(canGoNext?'下一关':'返回关卡');
  showModal(`<div>今晚的冰箱报告 · DAY ${day}</div><div class="score">${Math.round(s.c*100)}%</div><b>冰箱清空率</b><div class="stats"><div class="stat">浪费<b>${wasteText}</b></div><div class="stat">菜品<b>${s.d}道</b></div><div class="stat">营养<b>${s.g}</b></div><div class="stat">星级<b>${stars(s.star)}</b></div></div>${leftover}${unlockNote}<div class="personality">${p[0]}</div><p>${p[1]}</p><div class="mvp">${mvp}</div><div class="modal-actions"><button class="${retryClass}" id="retryLevel">重新规划</button><button class="${nextClass}" id="nextLevel">${nextLabel}</button></div>`);
  el('retryLevel').addEventListener('click',()=>start(day));
  el('nextLevel').addEventListener('click',()=>{
    if(day<8&&canGoNext)start(day+1);
    else if(day===8&&P.completed)home();
    else levelPage();
  });
};

home();
