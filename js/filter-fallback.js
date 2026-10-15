/* Independent filter fallback: keep the visible catalog filter usable even if another storefront script fails. */
(function(){
 const bar=document.getElementById('filters');
 if(!bar)return;
 bar.addEventListener('click',function(event){
  const button=event.target.closest('button[data-filter]');
  if(!button||!bar.contains(button))return;
  event.preventDefault();
  const chosen=button.getAttribute('data-filter');
  bar.querySelectorAll('button[data-filter]').forEach(function(item){
   const active=item===button;
   item.classList.toggle('active',active);
   item.setAttribute('aria-pressed',active?'true':'false');
  });
  const cards=document.querySelectorAll('#products .product[data-heat]');
  let shown=0;
  cards.forEach(function(card){
   const visible=chosen==='all'||card.getAttribute('data-heat')===chosen;
   card.style.display=visible?'':'none';
   if(visible)shown++;
  });
  const status=document.getElementById('filterStatus');
  if(status)status.textContent=chosen==='all'?'Showing all '+shown+' sauces':'Showing '+shown+' '+({mild:'easy heat',medium:'medium heat',hot:'bring the heat'}[chosen]||'')+' '+(shown===1?'sauce':'sauces');
 });
})();
