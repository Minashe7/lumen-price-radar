(function(){
  const storeNames={'1':'Steam','2':'GamersGate','3':'GreenManGaming','4':'Amazon','5':'GameStop','6':'Direct2Drive'};
  let deals=[];
  async function loadDeals(){
    try{const r=await fetch('/api/deals?pageSize=100&sortBy=DealRating&desc=0');const j=await r.json();deals=Array.isArray(j.deals)?j.deals:[];patch()}catch{}
  }
  function patch(){
    document.querySelectorAll('.dealRight a').forEach(a=>{
      const row=a.closest('.deal');
      if(!row)return;
      const title=row.querySelector('.dealInfo b')?.textContent?.trim()||'';
      const storeText=(row.querySelector('.dealInfo small')?.textContent||'').split('·')[0].trim();
      const d=deals.find(x=>x.title===title && storeNames[String(x.storeID)]===storeText) || deals.find(x=>x.title===title);
      if(d?.dealID){
        a.href=`https://www.cheapshark.com/redirect?dealID=${d.dealID}`;
        a.target='_blank';
        a.rel='noopener noreferrer';
        a.title='فتح العرض الفعلي في المتجر';
      }
    });
  }
  window.addEventListener('load',()=>{loadDeals();new MutationObserver(patch).observe(document.body,{childList:true,subtree:true})});
})();
