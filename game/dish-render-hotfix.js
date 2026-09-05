(()=>{
const DAY1_DISH_ATLAS='./assets/dishes/day1/day1_dishes_atlas.webp';
const DAY1_DISH_CELLS={te:[0,0],fr:[1,0],me:[0,1],oe:[1,1]};
function dishVisual(id){
  if(Q?.[0]!==1||!DAY1_DISH_CELLS[id])return Object.keys(R[id][1]).slice(0,2).map(emoji).join('');
  const [x,y]=DAY1_DISH_CELLS[id];
  const ox=x*128,oy=y*128;
  return `<svg class="formal-dish-svg" viewBox="0 0 128 128" aria-hidden="true" focusable="false"><image href="${DAY1_DISH_ATLAS}" x="${-ox}" y="${-oy}" width="256" height="256" preserveAspectRatio="none"/></svg>`;
}
renderMenu=function(){
  el('doneCount').textContent=S.done.length+' 道';
  el('doneList').innerHTML=S.done.map(id=>`<button type="button" class="done-dish" data-done-recipe="${id}"><span class="done-thumb">${dishVisual(id)}</span><span class="done-name">${R[id][0]}</span></button>`).join('');
  el('possible').textContent=`还能做 ${possibleIds().length} 道 ＞`;
  el('doneList').querySelectorAll('[data-done-recipe]').forEach(btn=>btn.addEventListener('click',()=>showCompletedDish(btn.dataset.doneRecipe)));
};
showCompletedDish=function(id){
  const r=R[id];
  showModal(`<div class="dish-detail-thumb">${dishVisual(id)}</div><h2>${r[0]}</h2><p>👥 ${r[2]} 人份 · ⏱ ${r[3]} 分钟 · 🔥 ${r[5]} kcal</p><div class="modal-actions"><button class="primary" id="closeDishDetail">知道了</button></div>`);
  el('closeDishDetail').addEventListener('click',closeModal);
};
showDishReward=function(id){
  clearTimeout(rewardTimer);
  let reward=app.querySelector('.dish-reward');
  if(!reward){reward=document.createElement('div');reward.className='dish-reward';app.querySelector('.game')?.appendChild(reward)}
  reward.innerHTML=`<div class="reward-thumb">${dishVisual(id)}</div><b>${R[id][0]}</b><small>完成一道菜</small>`;
  requestAnimationFrame(()=>reward.classList.add('show'));
  rewardTimer=setTimeout(()=>reward.classList.remove('show'),700);
};
const style=document.createElement('style');
style.textContent=`
.formal-dish-svg{display:block;width:100%;height:100%;overflow:hidden}
.done-thumb .formal-dish-svg,.reward-thumb .formal-dish-svg,.dish-detail-thumb .formal-dish-svg{width:100%;height:100%}
`;
document.head.appendChild(style);
})();
