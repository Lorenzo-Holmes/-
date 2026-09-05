(()=>{
const ING_ATLAS='./assets/ingredients/day1/day1_ingredients_atlas.webp';
const ING_SPRITES={
  egg:{1:[0,0],2:[1,0],3:[2,0]},
  tomato:{1:[3,0],2:[0,1]},
  luncheon_meat:{1:[1,1],2:[2,1]},
  milk:{1:[3,1]},
  carrot:{1:[0,2]},
  onion:{1:[1,2]},
  rice:{1:[2,2]}
};
const DISH_ATLAS='./assets/dishes/day1/day1_dishes_atlas.webp';
const DISH_SPRITES={te:[0,0],fr:[1,0],me:[0,1],oe:[1,1]};

function pickSprite(id,qty=1){
  const states=ING_SPRITES[id];if(!states)return null;
  const keys=Object.keys(states).map(Number).sort((a,b)=>a-b);
  const key=keys.filter(k=>k<=qty).pop()||keys[0];
  return states[key];
}
function ingredientSprite(id,qty=1){
  const p=pickSprite(id,qty);if(!p)return null;
  const x=p[0]*100/3,y=p[1]*100/2;
  return `<span class="formal-ing-sprite" aria-hidden="true" style="background-image:url('${ING_ATLAS}');background-position:${x}% ${y}%"></span>`;
}
function formalIngredientVisual(id,qty=1){return ingredientSprite(id,qty)||(I[id]?.asset?`<img class="asset" src="${I[id].asset}" alt="">`:emoji(id))}
function dishSprite(id){
  const p=DISH_SPRITES[id];if(!p)return null;
  return `<span class="formal-dish-sprite" aria-hidden="true" style="background-image:url('${DISH_ATLAS}');background-position:${p[0]*100}% ${p[1]*100}%"></span>`;
}
function formalDishThumb(id){return dishSprite(id)||Object.keys(R[id][1]).slice(0,2).map(emoji).join('')}

renderIngredients=function(){
  const fridge=el('fridge'),reserved=counts(S.sel),isDay1=Q[0]===1;
  fridge.innerHTML=Object.keys(Q[3]).map((i,j)=>{
    const q=S.inv[i]||0;if(!q)return'';
    const fixed=isDay1&&DAY1_LAYOUT[i],highlight=S.highlightIngredients?.includes(i);
    return`<button class="ingredient ${fixed?'day1-pos':'p'+(j%12)} ${(Q[4][i]||0)>0?'urgent-food':''} ${reserved[i]?'reserved':''} ${highlight?'recipe-highlight':''}" ${fixed?`style="${day1Position(i)}"`:''} data-ing="${i}" aria-label="${name(i)}，剩余 ${q}"><span class="icon">${isDay1?formalIngredientVisual(i,q):ingredientVisual(i)}</span><span class="label">${name(i)}</span><span class="qty">×${q}</span></button>`
  }).join('');
  fridge.querySelectorAll('[data-ing]').forEach(bindIngredientInput);
};

bindIngredientInput=function(btn){
  const id=btn.dataset.ing;
  btn.addEventListener('click',e=>{if(Date.now()<suppressIngredientClickUntil){e.preventDefault();return}addIngredient(id)});
  btn.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;dragState={id,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,dragging:false,button:btn,ghost:null};btn.setPointerCapture?.(e.pointerId)});
  btn.addEventListener('pointermove',e=>{
    if(!dragState||dragState.pointerId!==e.pointerId||dragState.button!==btn)return;
    const dx=e.clientX-dragState.startX,dy=e.clientY-dragState.startY;
    if(!dragState.dragging&&Math.hypot(dx,dy)<8)return;
    if(!dragState.dragging){dragState.dragging=true;suppressIngredientClickUntil=Date.now()+450;btn.classList.add('dragging');const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.innerHTML=`${Q?.[0]===1?formalIngredientVisual(id,1):ingredientVisual(id)}<small>${name(id)}</small>`;document.body.appendChild(ghost);dragState.ghost=ghost}
    e.preventDefault();moveDragGhost(e.clientX,e.clientY)
  });
  btn.addEventListener('pointerup',finishIngredientPointer);btn.addEventListener('pointercancel',finishIngredientPointer);
};

renderSlots=function(){
  const slots=el('slots');
  slots.innerHTML=Array.from({length:4},(_,j)=>S.sel[j]?`<div class="slot">${Q[0]===1?formalIngredientVisual(S.sel[j],1):emoji(S.sel[j])}<button class="slot-x" aria-label="移除${name(S.sel[j])}" data-remove="${j}">×</button></div>`:'<div class="slot empty"></div>').join('');
  slots.querySelectorAll('[data-remove]').forEach(x=>x.addEventListener('click',()=>{S.sel.splice(+x.dataset.remove,1);update()}));
};

renderMenu=function(){
  el('doneCount').textContent=S.done.length+' 道';
  el('doneList').innerHTML=S.done.map(id=>`<button type="button" class="done-dish" data-done-recipe="${id}"><span class="done-thumb">${Q[0]===1?formalDishThumb(id):Object.keys(R[id][1]).slice(0,2).map(emoji).join('')}</span><span class="done-name">${R[id][0]}</span></button>`).join('');
  el('possible').textContent=`还能做 ${possibleIds().length} 道 ＞`;
  el('doneList').querySelectorAll('[data-done-recipe]').forEach(btn=>btn.addEventListener('click',()=>showCompletedDish(btn.dataset.doneRecipe)));
};
showCompletedDish=function(id){
  const r=R[id],visual=Q[0]===1?formalDishThumb(id):Object.keys(r[1]).slice(0,2).map(emoji).join('');
  showModal(`<div class="dish-detail-thumb">${visual}</div><h2>${r[0]}</h2><p>👥 ${r[2]} 人份 · ⏱ ${r[3]} 分钟 · 🔥 ${r[5]} kcal</p><div class="modal-actions"><button class="primary" id="closeDishDetail">知道了</button></div>`);
  el('closeDishDetail').addEventListener('click',closeModal);
};
showDishReward=function(id){
  clearTimeout(rewardTimer);
  let reward=app.querySelector('.dish-reward');
  if(!reward){reward=document.createElement('div');reward.className='dish-reward';app.querySelector('.game')?.appendChild(reward)}
  const visual=Q[0]===1?formalDishThumb(id):Object.keys(R[id][1]).slice(0,2).map(emoji).join('');
  reward.innerHTML=`<div class="reward-thumb">${visual}</div><b>${R[id][0]}</b><small>完成一道菜</small>`;
  requestAnimationFrame(()=>reward.classList.add('show'));
  rewardTimer=setTimeout(()=>reward.classList.remove('show'),700);
};

const style=document.createElement('style');
style.textContent=`
.formal-ing-sprite{display:block;width:100%;height:100%;background-repeat:no-repeat;background-size:400% 300%;background-color:transparent;filter:drop-shadow(0 3px 3px #31505b40)}
.ingredient .formal-ing-sprite{min-width:100%;min-height:100%}
.drag-ghost .formal-ing-sprite{width:58px;height:58px;flex:none}
.slot .formal-ing-sprite{width:38px;height:38px;flex:none}
.formal-dish-sprite{display:block;width:100%;height:100%;background-repeat:no-repeat;background-size:200% 200%;background-color:transparent}
.done-thumb .formal-dish-sprite,.reward-thumb .formal-dish-sprite,.dish-detail-thumb .formal-dish-sprite{width:100%;height:100%}
`;
document.head.appendChild(style);
})();
