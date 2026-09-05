(()=>{
const DAY1_DISH_ATLAS='./assets/dishes/day1/day1_dishes_atlas.webp';
const DAY1_DISH_CELLS={te:[0,0],fr:[1,0],me:[0,1],oe:[1,1]};

function dishAtlasVisual(id){
  const cell=DAY1_DISH_CELLS[id];
  if(!cell)return Object.keys(R[id][1]).slice(0,2).map(emoji).join('');
  const [x,y]=cell;
  return `<span class="formal-dish-sprite formal-dish-img-sprite" aria-hidden="true"><img class="formal-dish-atlas-image" src="${DAY1_DISH_ATLAS}" alt="" draggable="false" style="left:-${x*100}%;top:-${y*100}%"></span>`;
}
function dishVisual(id){
  return Q?.[0]===1?dishAtlasVisual(id):Object.keys(R[id][1]).slice(0,2).map(emoji).join('');
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
.formal-dish-img-sprite{position:relative;display:block;width:100%;height:100%;overflow:hidden;background-image:none!important;background-color:transparent}
.formal-dish-atlas-image{position:absolute;display:block;width:200%;height:200%;max-width:none!important;max-height:none!important;object-fit:fill;pointer-events:none;user-select:none}
.done-thumb .formal-dish-img-sprite,.reward-thumb .formal-dish-img-sprite,.dish-detail-thumb .formal-dish-img-sprite{width:100%;height:100%}
`;
document.head.appendChild(style);
})();
