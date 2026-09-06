const API='https://www.cheapshark.com/api/1.0';
const ALLOWED=new Set(['1','2','3','4','5','6']);

async function upstream(path){
  const r=await fetch(`${API}${path}`,{headers:{'User-Agent':'LumenPriceRadar/1.0'}});
  if(!r.ok) throw new Error(`CheapShark ${r.status}`);
  return r.json();
}

function normalizeDeal(d){
  return {
    ...d,
    storeID:String(d.storeID??''),
    dealID:String(d.dealID??''),
    salePrice:Number(d.salePrice ?? d.price ?? 0),
    normalPrice:Number(d.normalPrice ?? d.retailPrice ?? 0),
    savings:Number(d.savings ?? 0),
    dealRating:Number(d.dealRating ?? 0)
  };
}

export default async function handler(req,res){
  const id=String(req.query.id||'').trim();
  if(!id) return res.status(400).json({ok:false,error:'id_required'});
  try{
    const game=await upstream(`/games?id=${encodeURIComponent(id)}`);
    if(Array.isArray(game?.deals)) game.deals=game.deals.map(normalizeDeal).filter(d=>ALLOWED.has(d.storeID)&&d.salePrice>0);
    if(!Array.isArray(game?.deals) || !game.deals.length) return res.status(404).json({ok:false,error:'no_supported_deals'});

    const steamAppID=String(game?.info?.steamAppID||'');
    if(steamAppID){
      try{
        const sr=await fetch(`https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(steamAppID)}&cc=us&l=en`,{headers:{'User-Agent':'LumenPriceRadar/1.0'}});
        if(sr.ok){
          const sj=await sr.json();
          const data=sj?.[steamAppID]?.data;
          if(sj?.[steamAppID]?.success && data){
            game.steam={
              appid:steamAppID,
              name:data.name||game.info.title,
              shortDescription:data.short_description||'',
              about:data.about_the_game||'',
              headerImage:data.header_image||'',
              developers:Array.isArray(data.developers)?data.developers:[],
              publishers:Array.isArray(data.publishers)?data.publishers:[],
              genres:Array.isArray(data.genres)?data.genres.map(x=>x.description).filter(Boolean):[],
              releaseDate:data.release_date?.date||'',
              metacritic:data.metacritic?.score||null,
              website:data.website||''
            };
          }
        }
      }catch{}
    }

    res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=3600');
    res.status(200).json({ok:true,source:'cheapshark',game});
  }catch(e){
    res.status(502).json({ok:false,error:'upstream_unavailable'});
  }
}
