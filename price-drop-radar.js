/* Lumen Price Drop Radar
 * Client-side enhancement: highlights unusually strong current discounts.
 * It intentionally does NOT claim a historical price drop unless history data exists.
 */
(function(){
  function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function money(v,rate){const n=Number(v);return Number.isFinite(n)?`${Math.round(n*rate).toLocaleString('en-US')} ج.م`:'—';}
  function install(){
    const main=document.querySelector('main');
    if(!main||document.getElementById('priceDropRadar')) return;
    const section=document.createElement('section');
    section.id='priceDropRadar';
    section.innerHTML='<div class="sectionHead"><h2>Price Drop Radar</h2><span class="muted">أقوى التخفيضات الحالية</span></div><div class="dealList" id="priceDropList"></div>';
    const software=document.getElementById('software')?.parentElement;
    if(software) software.before(section); else main.appendChild(section);
    render();
  }
  function render(){
    const list=document.getElementById('priceDropList');
    const S=window.S;
    if(!list||!S||!Array.isArray(S.deals)) return;
    const rate=Number(S.fx)||51;
    const deals=S.deals.filter(d=>Number(d.savings)>=50).sort((a,b)=>Number(b.savings)-Number(a.savings)).slice(0,8);
    list.innerHTML=deals.length?deals.map((d,i)=>`<article class="deal"><div class="thumb">${d.thumb?`<img src="${esc(d.thumb)}" alt="">`:'◈'}</div><div class="dealInfo"><b>${esc(d.title)}</b><small>${esc(window.stores?.[String(d.storeID)]||'Store')} · خصم ${Math.round(Number(d.savings)||0)}%</small><strong>${money(d.salePrice,rate)}</strong></div><a class="buy" href="/api/track?storeID=${encodeURIComponent(d.storeID||'')}&title=${encodeURIComponent(d.title||'game')}&steamAppID=${encodeURIComponent(d.steamAppID||'')}" target="_blank" rel="noopener">عرض ↗</a></article>`).join(''):'<p class="muted">مفيش تخفيضات قوية كفاية دلوقتي.</p>';
  }
  function boot(){install();setInterval(()=>{install();render()},1500);}
  window.addEventListener('load',boot);
})();
