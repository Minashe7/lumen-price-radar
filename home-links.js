(function(){
  const storeNames={'1':'Steam','2':'GamersGate','3':'GreenManGaming','4':'Amazon','5':'GameStop','6':'Direct2Drive'};
  let deals=[];
  function directUrl(d){const id=String(d?.storeID||''),q=encodeURIComponent(d?.title||'game');if(id==='1'&&d?.steamAppID)return `https://store.steampowered.com/app/${encodeURIComponent(d.steamAppID)}/?cc=eg`;return ({'2':`https://www.gamersgate.com/search?q=${q}`,'3':`https://www.greenmangaming.com/search/?query=${q}`,'4':`https://www.amazon.com/s?k=${q}+pc+game`,'5':`https://www.gamestop.com/search/?q=${q}`,'6':`https://www.direct2drive.com/search?q=${q}`})[id]||'#'}
  async function loadDeals(){try{const r=await fetch('/api/deals?pageSize=100&sortBy=DealRating&desc=0');const j=await r.json();deals=Array.isArray(j.deals)?j.deals:[];patch()}catch{}}
  function patch(){document.querySelectorAll('.dealRight a').forEach(a=>{const row=a.closest('.deal');if(!row)return;const title=row.querySelector('.dealInfo b')?.textContent?.trim()||'',storeText=(row.querySelector('.dealInfo small')?.textContent||'').split('·')[0].trim(),d=deals.find(x=>x.title===title&&storeNames[String(x.storeID)]===storeText)||deals.find(x=>x.title===title);if(d){a.href=directUrl(d);a.target='_blank';a.rel='noopener noreferrer';a.title='فتح المتجر الرسمي مباشرة'}})}
  window.addEventListener('load',()=>{loadDeals();new MutationObserver(patch).observe(document.body,{childList:true,subtree:true})});
})();
