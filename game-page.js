/* Lumen Game Page — turns the old modal into a real in-site game details page. */
(function(){
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stores={'1':'Steam','2':'GamersGate','3':'GreenManGaming','4':'Amazon','5':'GameStop','6':'Direct2Drive'};
  const money=(v,rate=51)=>Number.isFinite(Number(v))&&Number(v)>0?`${Math.round(Number(v)*rate).toLocaleString('en-US')} ج.م`:'—';
  const style=`
    .overlay.lumenGamePage{position:fixed;inset:0;width:100vw;height:100dvh;background:#08080d;padding:0;display:block;overflow-y:auto;overflow-x:hidden;z-index:60}
    .overlay.lumenGamePage .modalBox{width:100%;max-width:1180px;min-height:100dvh;max-height:none;margin:0 auto;border:0;border-radius:0;background:#08080d;padding:22px 18px 70px;overflow:visible;box-shadow:none}
    .overlay.lumenGamePage .close{position:fixed;top:14px;left:14px;z-index:8;width:40px;height:40px;border-radius:12px}
    .lumenGameTop{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,.8fr);gap:22px;margin-top:30px}
    .lumenAbout{background:#111119;border:1px solid #292936;border-radius:18px;padding:22px}
    .lumenAbout h2{font-size:28px;margin:4px 0 10px}.lumenAbout p{color:#aaa6b4;line-height:1.75;margin:8px 0}
    .lumenCover{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:15px;display:block;background:#171720}
    .lumenPriceHero{background:#111119;border:1px solid #292936;border-radius:18px;padding:18px}
    .lumenPriceHero h3{margin:0 0 15px}.lumenLow{font-size:30px;font-weight:800}.lumenMeta{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.lumenMeta span{background:#171720;border:1px solid #292936;border-radius:999px;padding:7px 10px;font-size:11px;color:#aaa6b4}
    .lumenSection{margin-top:22px}.lumenSection h3{margin:0 0 12px}
    .lumenStoreTabs{display:flex;gap:8px;overflow:auto;padding-bottom:5px}.lumenStoreTabs button{white-space:nowrap;border:1px solid #292936;background:#12121a;color:#aaa6b4;border-radius:999px;padding:9px 13px}.lumenStoreTabs button.active{background:#6d39c8;color:#fff;border-color:#8956df}
    .lumenOffers{display:grid;gap:10px}.lumenOffer{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:14px;background:#111119;border:1px solid #292936;border-radius:14px;padding:14px}.lumenOffer b{display:block}.lumenOffer small{display:block;color:#85818f;margin-top:4px;font-size:11px}.lumenOffer .lumenOfferPrice{text-align:center}.lumenOffer .current{font-size:20px;font-weight:800}.lumenOffer s{color:#686573;font-size:11px}.lumenBuy{background:#6d39c8;color:#fff;text-decoration:none;border-radius:9px;padding:10px 13px;font-size:12px;white-space:nowrap}
    .lumenAboutBox{background:#111119;border:1px solid #292936;border-radius:14px;padding:16px;color:#aaa6b4;line-height:1.8}
    @media(max-width:700px){.overlay.lumenGamePage .modalBox{padding:16px 10px 60px}.lumenGameTop{grid-template-columns:1fr;gap:12px;margin-top:24px}.lumenAbout{padding:15px}.lumenAbout h2{font-size:23px}.lumenPriceHero{padding:15px}.lumenLow{font-size:25px}.lumenOffer{grid-template-columns:minmax(0,1fr) auto;gap:9px}.lumenOffer .lumenOfferPrice{grid-column:1/-1;text-align:right}.lumenOffer .lumenBuy{grid-column:2;grid-row:1}.lumenOffer .lumenStore{grid-column:1;grid-row:1}}
  `;
  function addStyle(){if(document.getElementById('lumenGamePageStyle'))return;const s=document.createElement('style');s.id='lumenGamePageStyle';s.textContent=style;document.head.appendChild(s)}
  function enhance(id){
    const modal=document.getElementById('modal');
    if(!modal)return;
    modal.classList.add('lumenGamePage');
    const box=modal.querySelector('.modalBox');
    if(box) box.scrollTop=0;
    const close=modal.querySelector('#closeModal');
    if(close) close.onclick=()=>{modal.classList.remove('lumenGamePage');modal.classList.add('hidden')};
    fetch(`/api/game?id=${encodeURIComponent(id)}`).then(r=>r.json()).then(j=>{
      const g=j.game||{},i=g.info||{},ds=(Array.isArray(g.deals)?g.deals:[]).filter(d=>Number(d.salePrice)>0);
      const rate=Number(window.S?.fx)||51;
      if(!ds.length)return;
      const low=Math.min(...ds.map(d=>Number(d.salePrice)));
      const hist=[];ds.forEach(d=>Array.isArray(d.priceHistory)&&d.priceHistory.forEach(p=>Array.isArray(p)&&p.length>1&&hist.push(Number(p[1]))));
      const histLow=hist.length?Math.min(...hist):null;
      const original=ds[0]?.normalPrice;
      const title=i.title||'Game';
      const cover=i.thumb||ds[0]?.thumb||'';
      const storesCount=new Set(ds.map(d=>String(d.storeID))).size;
      const hero=document.querySelector('#modalContent .gameHero');
      if(hero) hero.innerHTML=`<div class="gameCover"><img src="${esc(cover)}" alt="${esc(title)}"></div><div><small>LUMEN GAME RADAR</small><h2>${esc(title)}</h2><p>${ds.length} عرض متاح عبر ${storesCount} متجر · أقل سعر حالي <b>${money(low,rate)}</b></p><div class="gameActions"><button class="heart" data-fav="${esc(id)}">♡</button><button class="buy alertBtn" data-alert="${esc(id)}">🔔 تنبيه سعر</button></div></div>`;
      const stats=document.querySelector('#modalContent .gameStats');
      if(stats) stats.innerHTML=`<div><small>Current Low</small><b>${money(low,rate)}</b></div><div><small>Historical Low</small><b>${histLow!==null?money(histLow,rate):'—'}</b></div><div><small>Stores</small><b>${storesCount}</b></div>`;
      const content=document.getElementById('modalContent');
      const oldTabs=content.querySelector('.tabs');
      if(oldTabs)oldTabs.remove();
      const oldPanel=content.querySelector('#detailPanel');
      if(oldPanel)oldPanel.remove();
      const note=content.querySelector('.detailNote');if(note)note.remove();
      const top=document.createElement('div');top.className='lumenGameTop';
      const about=document.createElement('section');about.className='lumenAbout';about.innerHTML=`<small>LUMEN GAME RADAR</small><h2>${esc(title)}</h2><p>قارن أسعار اللعبة بين المتاجر المتاحة وشوف أقل سعر حالي قبل ما تشتري.</p><div class="lumenMeta"><span>PC</span><span>${storesCount} متاجر</span><span>${ds.length} عروض</span>${original?`<span>السعر الأصلي ${money(original,rate)}</span>`:''}</div>`;
      const price=document.createElement('section');price.className='lumenPriceHero';price.innerHTML=`<h3>أفضل سعر حالي</h3><div class="lumenLow">${money(low,rate)}</div><div class="lumenMeta"><span>Historical Low: ${histLow!==null?money(histLow,rate):'غير متاح'}</span><span>خصم حتى ${Math.round(Math.max(...ds.map(d=>Number(d.savings)||0)))}%</span></div>`;
      top.append(about,price);
      content.append(top);
      const section=document.createElement('section');section.className='lumenSection';section.innerHTML='<h3>الأسعار والمتاجر</h3><div class="lumenStoreTabs"><button class="active" data-store-filter="all">كل المتاجر</button>'+[...new Set(ds.map(d=>String(d.storeID)))].map(id=>`<button data-store-filter="${esc(id)}">${esc(stores[id]||'Store')}</button>`).join('')+'</div><div class="lumenOffers"></div>';
      content.append(section);
      const offers=section.querySelector('.lumenOffers');
      function renderOffers(filter='all'){offers.innerHTML=ds.filter(d=>filter==='all'||String(d.storeID)===filter).slice().sort((a,b)=>Number(a.salePrice)-Number(b.salePrice)).map(d=>{const q=encodeURIComponent(d.title||title);let target=d.storeID==='1'&&d.steamAppID?`https://store.steampowered.com/app/${encodeURIComponent(d.steamAppID)}/?cc=eg`:({2:`https://www.gamersgate.com/search?q=${q}`,3:`https://www.greenmangaming.com/search/?query=${q}`,4:`https://www.amazon.com/s?k=${q}+pc+game`,5:`https://www.gamestop.com/search/?q=${q}`,6:`https://www.direct2drive.com/search?q=${q}`})[String(d.storeID)]||'#';return `<article class="lumenOffer"><div class="lumenStore"><b>${esc(stores[d.storeID]||'Store')}</b><small>${d.storeID==='1'?'Official Store':'متجر خارجي'} · Deal rating ${Number(d.dealRating||0).toFixed(1)}</small></div><div class="lumenOfferPrice"><div class="current">${money(d.salePrice,rate)}</div><s>${money(d.normalPrice,rate)}</s><small>خصم ${Math.round(d.savings||0)}%</small></div><a class="lumenBuy" href="${target}" target="_blank" rel="noopener">عرض المتجر ↗</a></article>`}).join('')||'<div class="lumenAboutBox">لا توجد عروض بهذا المتجر حاليًا.</div>'}
      renderOffers();section.querySelectorAll('[data-store-filter]').forEach(b=>b.onclick=()=>{section.querySelectorAll('[data-store-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderOffers(b.dataset.storeFilter)});
      const note=document.createElement('div');note.className='lumenAboutBox';note.style.marginTop='16px';note.textContent='💡 الأسعار بالجنيه المصري تقديرية حسب سعر الصرف، والسعر النهائي يظهر في المتجر.';content.append(note);
      content.querySelector('[data-fav]')?.addEventListener('click',e=>{e.stopPropagation();if(window.toggle)window.toggle(id)});
      content.querySelector('[data-alert]')?.addEventListener('click',()=>{if(window.priceAlert)window.priceAlert(id,title)});
    }).catch(()=>{});
  }
  function watch(){
    addStyle();
    document.addEventListener('click',e=>{
      const card=e.target.closest('.card,.best');
      if(!card||e.target.closest('[data-fav]'))return;
      const id=card.dataset.id;
      setTimeout(()=>enhance(id),40);
    },true);
  }
  window.addEventListener('load',watch);
})();
