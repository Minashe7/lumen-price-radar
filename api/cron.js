const API='https://www.cheapshark.com/api/1.0';
const FALLBACK_USD_EGP=51;

function authOk(req){
  return !process.env.CRON_SECRET || req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
}

async function cheap(path){
  const r=await fetch(`${API}${path}`,{headers:{'User-Agent':'LumenPriceRadar/1.0'}});
  if(!r.ok) throw new Error(`CheapShark ${r.status}`);
  return r.json();
}

async function fx(){
  try{
    const r=await fetch('https://open.er-api.com/v6/latest/USD');
    const j=await r.json();
    const v=Number(j?.rates?.EGP);
    return Number.isFinite(v)&&v>0?v:FALLBACK_USD_EGP;
  }catch{return FALLBACK_USD_EGP;}
}

async function supabase(path,options={}){
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) throw new Error('SUPABASE_ENV_MISSING');
  return fetch(`${url.replace(/\\/$/,'')}/rest/v1/${path}`,{
    ...options,
    headers:{
      apikey:key,
      Authorization:`Bearer ${key}`,
      'Content-Type':'application/json',
      ...(options.headers||{})
    }
  });
}

async function checkAlerts(){
  if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY) return {configured:false,checked:0,triggered:0};
  const r=await supabase('price_alerts?active=eq.true&select=id,user_id,game_id,title,target_egp');
  if(!r.ok) throw new Error(`Supabase alerts ${r.status}`);
  const alerts=await r.json();
  const rate=await fx();
  let checked=0,triggered=0;

  for(const a of alerts){
    try{
      const game=await cheap(`/games?id=${encodeURIComponent(a.game_id)}`);
      const deals=Array.isArray(game?.[0]?.deals)?game[0].deals:[];
      const prices=deals.map(d=>Number(d.salePrice)).filter(n=>Number.isFinite(n)&&n>0);
      if(!prices.length) continue;
      checked++;
      const usd=Math.min(...prices);
      const egp=usd*rate;
      if(egp<=Number(a.target_egp)){
        const now=new Date().toISOString();
        const patch=await supabase(`price_alerts?id=eq.${encodeURIComponent(a.id)}`,{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({active:false,triggered_at:now})
        });
        if(!patch.ok) throw new Error(`Supabase update ${patch.status}`);
        try{
          await supabase('alert_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({alert_id:a.id,user_id:a.user_id,game_id:a.game_id,title:a.title||game?.[0]?.info?.title||'Game',price_usd:usd,price_egp:egp,created_at:now})});
        }catch{}
        triggered++;
      }
    }catch(e){
      console.warn('alert check failed',a.game_id,e?.message||e);
    }
  }
  return {configured:true,checked,triggered,rate,alerts:alerts.length};
}

export default async function handler(req,res){
  if(!authOk(req)) return res.status(401).json({ok:false});
  try{
    const base=`https://${req.headers.host}`;
    const warm=await fetch(`${base}/api/deals?pageSize=60&sortBy=DealRating&desc=0`);
    const alerts=await checkAlerts();
    res.status(warm.ok?200:502).json({ok:warm.ok,warmed:warm.ok,alerts});
  }catch(e){
    res.status(502).json({ok:false,error:e?.message||'cron_failed'});
  }
}
