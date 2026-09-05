/* Lumen Price Drop Radar — UI-only layer.
   Reads rendered deal cards, so it does not depend on private app.js state.
   It intentionally says "current strong discounts", not historical drops.
*/
(function(){
  function render(){
    const host=document.getElementById('priceDropList');
    const source=document.querySelectorAll('#deals .deal');
    if(!host||!source.length)return;
    const rows=[...source].map(el=>{
      const text=[...el.querySelectorAll('small')].map(x=>x.textContent||'').join(' ');
      const m=text.match(/([0-9]+)%/);
      return {el,pct:Number(m?.[1]||0)};
    }).filter(x=>x.pct>=50).sort((a,b)=>b.pct-a.pct).slice(0,6);
    host.innerHTML=rows.length?rows.map(({el})=>{
      const clone=el.cloneNode(true);
      const a=clone.querySelector('a');
      if(a){a.textContent='عرض ↗';a.className='buy';}
      return clone.outerHTML;
    }).join(''):'<p class="muted">مفيش تخفيضات قوية كفاية دلوقتي.</p>';
  }
  function install(){
    if(document.getElementById('priceDropRadar'))return;
    const main=document.querySelector('main');
    if(!main)return;
    const section=document.createElement('section');
    section.id='priceDropRadar';
    section.innerHTML='<div class="sectionHead"><h2>Price Drop Radar</h2><span class="muted">أقوى التخفيضات الحالية</span></div><div id="priceDropList" class="dealList"></div>';
    const best=document.getElementById('best')?.parentElement;
    if(best)best.after(section);else main.appendChild(section);
    render();
  }
  window.addEventListener('load',()=>{
    install();
    const target=document.getElementById('deals');
    if(target)new MutationObserver(render).observe(target,{childList:true,subtree:true});
  });
})();
