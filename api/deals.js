const ALLOWED_STORES = new Set(['1','2','3','4','5','6']);
const API = 'https://www.cheapshark.com/api/1.0';

async function upstream(path) {
  const r = await fetch(`${API}${path}`, { headers: { 'User-Agent': 'LumenPriceRadar/1.0' } });
  if (!r.ok) throw new Error(`CheapShark ${r.status}`);
  return r.json();
}

function normalize(d) {
  return {
    gameID: String(d.gameID ?? ''), title: d.title ?? '', storeID: String(d.storeID ?? ''),
    salePrice: Number(d.salePrice ?? 0), normalPrice: Number(d.normalPrice ?? 0),
    savings: Number(d.savings ?? 0), dealRating: Number(d.dealRating ?? 0),
    steamAppID: d.steamAppID ? String(d.steamAppID) : '', thumb: d.thumb ?? '', dealID: d.dealID ? String(d.dealID) : ''
  };
}

export default async function handler(req, res) {
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 60), 1), 100);
  const sortBy = ['DealRating','Savings','Price','Recent'].includes(req.query.sortBy) ? req.query.sortBy : 'DealRating';
  try {
    const data = await upstream(`/deals?pageSize=${pageSize}&sortBy=${sortBy}&desc=0`);
    const deals = Array.isArray(data) ? data.filter(d => ALLOWED_STORES.has(String(d.storeID))).map(normalize) : [];
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.status(200).json({ ok:true, source:'cheapshark', updatedAt:new Date().toISOString(), deals });
  } catch (e) {
    res.setHeader('Cache-Control','no-store');
    res.status(502).json({ ok:false, error:'upstream_unavailable' });
  }
}
