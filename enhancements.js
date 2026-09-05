/* Lumen progressive enhancements — safe to load after app.js */
(function(){
  const stores={'1':'Steam','2':'GamersGate','3':'GreenManGaming','4':'Amazon','5':'GameStop','6':'Direct2Drive'};
  const $=s=>document.querySelector(s);
  function addStyle(){if($('#lumenEnhStyle'))return;const s=document.createElement('style');s.id='lumenEnhStyle';s.textContent=`
    .lumenTools{display:flex;gap:8px;overflow:auto;padding:10px 0;scrollbar-width:none}.lumenTools::-webkit-scrollbar{display:none}
    .lumenTools button{white-space:nowrap;border:1px solid rgba(255,255,255,.12);background:#15111f;color:#fff;border-radius:999px;padding:9px 13px}.lumenTools button.active{background:#7c3aed;border-color:#a78bfa}
    .lumenDrop{display:inline-flex;align-items:center;gap:6px}.lumenDrop select{background:#15111f;color:#fff;border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:8px}
    .lumenBadge{display:inline-block;font-size:11px;border-radius:999px;padding:3px 7px;margin-inline-start:5px;background:rgba(34,197,94,.15);color:#86efac}
  `;document.head.appendChild(s)}
  function setup(){addStyle();const host=$('#deals');if(!host||$('#lumenFilters'))return;const box=document.createElement('div');box.id='lumenFilters';box.innerHTML=`<div class="lumenTools"><button class="active" data-store="all">كل المتاجر</button>${Object.entries(stores).map(([id,n])=>`<button data-store="${id}">${n}</button>`).join('')}</div><label class="lumenDrop">ترتيب <select id="lumenSort"><option value="DealRating">الأفضل</option><option value="Savings">أعلى خصم</option><option value="Price">الأرخص</option><option value="Recent">الأحدث</option></select></label>`;host.parentNode.insertBefore(box,host)}
  function filter(){const store=$('#lumenFilters [data-store].active')?.dataset.store||'all';document.querySelectorAll('#deals .deal').forEach(el=>{const text=el.querySelector('.dealInfo small')?.textContent||'';el.hidden=store!=='all'&&!text.includes(stores[store]||'')})}
  document.addEventListener('click',e=>{const b=e.target.closest('#lumenFilters [data-store]');if(!b)return;document.querySelectorAll('#lumenFilters [data-store]').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter()});
  document.addEventListener('change',e=>{if(e.target.id!=='lumenSort')return;const v=e.target.value;try{localStorage.setItem('lumen:sort',v);if(window.S)window.S.sort=v;location.reload()}catch{location.reload()}});
  const oldRender=window.render; if(typeof oldRender==='function')window.render=function(){oldRender();setup();filter()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
  new MutationObserver(()=>{if($('#lumenFilters'))filter()}).observe(document.body,{childList:true,subtree:true});
})();
