const API = 'https://www.cheapshark.com/api/1.0';
export default async function handler(req,res){
  const title=String(req.query.title||'').trim();
  if(!title) return res.status(400).json({ok:false,error:'title_required'});
  try{
    const r=await fetch(`${API}/games?title=${encodeURIComponent(title)}&limit=12`,{headers:{'User-Agent':'LumenPriceRadar/1.0'}});
    if(!r.ok) throw new Error();
    const data=await r.json();
    res.setHeader('Cache-Control','s-maxage=1800, stale-while-revalidate=7200');
    res.status(200).json({ok:true,results:Array.isArray(data)?data:[]});
  }catch(e){res.status(502).json({ok:false,error:'upstream_unavailable'});}
}
