const STORES = {
  '1': { name:'Steam', build: ({steamAppID}) => steamAppID ? `https://store.steampowered.com/app/${encodeURIComponent(steamAppID)}/?cc=eg` : 'https://store.steampowered.com/' },
  '2': { name:'GamersGate', build: ({title}) => `https://www.gamersgate.com/search?q=${encodeURIComponent(title||'game')}` },
  '3': { name:'Green Man Gaming', build: ({title}) => `https://www.greenmangaming.com/search/?query=${encodeURIComponent(title||'game')}` },
  '4': { name:'Amazon', build: ({title}) => `https://www.amazon.com/s?k=${encodeURIComponent((title||'game')+' pc game')}` },
  '5': { name:'GameStop', build: ({title}) => `https://www.gamestop.com/search/?q=${encodeURIComponent(title||'game')}` },
  '6': { name:'Direct2Drive', build: ({title}) => `https://www.direct2drive.com/search?q=${encodeURIComponent(title||'game')}` }
};
function validHost(url){try{return ['store.steampowered.com','www.gamersgate.com','gamersgate.com','www.greenmangaming.com','greenmangaming.com','www.amazon.com','amazon.com','www.gamestop.com','gamestop.com','www.direct2drive.com','direct2drive.com'].includes(new URL(url).hostname)}catch{return false}}
function affiliate(storeID,ctx){const raw=process.env[`STORE_${storeID}_AFFILIATE_URL`];if(!raw)return null;return raw.replaceAll('{title}',encodeURIComponent(ctx.title||'game')).replaceAll('{steamAppID}',encodeURIComponent(ctx.steamAppID||''))}
export default async function handler(req,res){const storeID=String(req.query.storeID||''),store=STORES[storeID];if(!store)return res.status(400).json({ok:false,error:'invalid_store'});const ctx={title:String(req.query.title||''),steamAppID:String(req.query.steamAppID||'')};const target=affiliate(storeID,ctx)||store.build(ctx);if(!validHost(target))return res.status(400).json({ok:false,error:'invalid_destination'});res.setHeader('Cache-Control','no-store');res.redirect(302,target)}
