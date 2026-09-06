/* Lumen navigation — game cards open a real standalone page, never a popup. */
(function(){
  function go(card){
    const id=card?.dataset?.id;
    if(!id)return;
    window.location.href=`/game.html?id=${encodeURIComponent(id)}`;
  }
  window.addEventListener('load',()=>{
    document.addEventListener('click',e=>{
      const card=e.target.closest('.card,.best');
      if(!card || e.target.closest('[data-fav]'))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      go(card);
    },true);
  });
})();
