(function(){
  const root=document.getElementById('gameRoot');
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const qs=new URLSearchParams(location.search);
  const id=qs.get('id');
  let fx=51;
  const stores={'1':'Steam','2':'GamersGate','3':'GreenManGaming','4':'Amazon','5':'GameStop','6':'Direct2Drive'};
  const money=v=>Number(v)>0?`${Math.round(Number(v)*fx).toLocaleString('en-US')} ج.م`:'—';
  const buy=d=>d.dealID?`https://www.cheapshark.com/redirect?dealID=${d.dealID}`:'#';
  async function get(url){const r=await fetch(url,{headers:{Accept:'application/json'}});if(!r.ok)throw Error(r.status);return r.json()}
  function render(j){
    const g=j.game||{},i=g.info||{},ds=(Array.isArray(g.deals)?g.deals:[]).filter(d=>Number(d.salePrice)>0).sort((a,b)=>Number(a.salePrice)-Number(b.salePrice));
    if(!ds.length)throw Error('NO_DEALS');
    const steam=g.steam||{};
    const low=Number(ds[0].salePrice);
    const retail=Math.max(...ds.map(d=>Number(d.normalPrice)||0));
    const bestDiscount=Math.max(...ds.map(d=>Number(d.savings)||0));
    const historical=g.cheapestPriceEver?.price?Number(g.cheapestPriceEver.price):null;
    const about=steam.shortDescription||'بيانات وصف اللعبة غير متاحة من المصدر الحالي. لكن الأسعار والمتاجر المعروضة هنا مأخوذة من بيانات المقارنة الحية.';
    const genres=Array.isArray(steam.genres)?steam.genres:[];
    const dev=Array.isArray(steam.developers)?steam.developers.join('، '):'';
    const pub=Array.isArray(steam.publishers)?steam.publishers.join('، '):'';
    const release=steam.releaseDate||'';
    const cover=steam.headerImage||i.thumb||ds[0].thumb||'';
    root.innerHTML=`
      <a class="gameBack" href="/">→ العودة إلى Lumen</a>
      <div class="gameHeader">
        <section class="gameHeroCard">
          ${cover?`<img class="gameHeroImg" src="${esc(cover)}" alt="${esc(i.title||steam.name||'Game')}">`:''}
          <div class="gameHeroBody">
            <div class="eyebrow">LUMEN GAME RADAR</div>
            <h1 class="gameTitle">${esc(i.title||steam.name||'Game')}</h1>
            <div class="muted">${ds.length} عروض حالية عبر ${new Set(ds.map(d=>String(d.storeID))).size} متجر</div>
            <div class="chips"><span class="chip">PC</span>${genres.slice(0,5).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>
          </div>
        </section>
        <aside class="gamePriceCard">
          <div class="priceLabel">أقل سعر حالي</div>
          <div class="bigPrice">${money(low)}</div>
          <div class="subPrice">السعر الأصلي الظاهر في العروض حتى ${money(retail)}</div>
          <div class="gameStats">
            <div class="stat"><small>خصم حتى</small><b>${Math.round(bestDiscount)}%</b></div>
            <div class="stat"><small>Historical Low</small><b>${historical?money(historical):'—'}</b></div>
            <div class="stat"><small>المتاجر</small><b>${new Set(ds.map(d=>String(d.storeID))).size}</b></div>
          </div>
        </aside>
      </div>
      <section class="gameSection">
        <h2>About اللعبة</h2>
        <div class="gameAbout">
          <p>${esc(about)}</p>
          <div class="aboutMeta">
            <div class="metaBox"><small>المطور</small><b>${esc(dev||'غير متاح')}</b></div>
            <div class="metaBox"><small>الناشر</small><b>${esc(pub||'غير متاح')}</b></div>
            <div class="metaBox"><small>تاريخ الإصدار</small><b>${esc(release||'غير متاح')}</b></div>
            <div class="metaBox"><small>Metacritic</small><b>${steam.metacritic||'—'}</b></div>
          </div>
        </div>
      </section>
      <section class="gameSection">
        <h2>الأسعار والمتاجر</h2>
        <div class="offerList">${ds.map(d=>`<article class="offerRow">
          <div class="storeBlock"><div class="storeName">${esc(stores[d.storeID]||`Store #${d.storeID}`)}</div><div class="storeNote">${d.storeID==='1'?'Official Store':'متجر ضمن بيانات CheapShark'} · Deal rating ${Number(d.dealRating||0).toFixed(1)}</div></div>
          <div class="offerPrice"><strong>${money(d.salePrice)}</strong><s>${money(d.normalPrice)}</s><div class="discount">خصم ${Math.round(Number(d.savings)||0)}%</div></div>
          <a class="buyBtn" href="${buy(d)}" target="_blank" rel="noopener noreferrer">شراء ↗</a>
        </article>`).join('')}</div>
        <div class="sourceNote">الأسعار المصدرية من CheapShark بالدولار ويتم تحويلها تقديريًا للجنيه المصري. زر الشراء يفتح العرض نفسه عبر رابط التحويل الخاص بـ CheapShark، وليس رابط بحث عام.</div>
      </section>`;
  }
  async function boot(){
    if(!id){root.innerHTML='<div class="errorBox"><h2>اللعبة غير محددة</h2><a href="/">العودة للرئيسية</a></div>';return}
    try{const f=await fetch('https://open.er-api.com/v6/latest/USD').then(r=>r.json());if(f?.rates?.EGP)fx=Number(f.rates.EGP)}catch{}
    try{render(await get(`/api/game?id=${encodeURIComponent(id)}`));document.title=`Lumen — ${root.querySelector('.gameTitle')?.textContent||'Game'}`}
    catch(e){root.innerHTML=`<div class="errorBox"><h2>مفيش عروض متاحة حاليًا</h2><p class="muted">البيانات الخاصة باللعبة غير متاحة من المصدر في اللحظة دي.</p><a href="/">العودة للرئيسية</a></div>`}
  }
  boot();
})();
