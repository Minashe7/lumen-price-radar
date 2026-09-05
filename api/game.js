const API='https://www.cheapshark.com/api/1.0';
const ALLOWED=new Set(['1','2','3','4','5','6']);
export default async function handler(req,res){
  const id=String(req.query.id||'').trim();
  if(!id) return res.status(400).json({ok:false,error:'id_required'});
  try{
    const r=await fetch(`${API}/games?id=${encodeURIComponent(id)}`,{headers:{'User-Agent':'LumenPriceRadar/1.0'}});
    if(!r.ok) throw new Error();
    const game=await r.json();
    if(Array.isArray(game.deals)) game.deals=game.deals.filter(d=>ALLOWED.has(String(d.storeID)));
    res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=3600');
    res.status(200).json({ok:true,game});
  }catch(e){res.status(502).json({ok:false,error:'upstream_unavailable'});}
}
