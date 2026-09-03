const STORES = {
  '1': { name:'Steam', url: id => id ? `https://store.steampowered.com/app/${encodeURIComponent(id)}/` : 'https://store.steampowered.com/' },
  '2': { name:'GamersGate', url: () => 'https://www.gamersgate.com/' },
  '3': { name:'Green Man Gaming', url: () => 'https://www.greenmangaming.com/' },
  '4': { name:'Amazon', url: () => 'https://www.amazon.com/' },
  '5': { name:'GameStop', url: () => 'https://www.gamestop.com/' },
  '6': { name:'Direct2Drive', url: () => 'https://www.direct2drive.com/' }
};

function isAllowedHost(url){
  try {
    const u=new URL(url);
    return ['store.steampowered.com','www.gamersgate.com','gamersgate.com','www.greenmangaming.com','greenmangaming.com','www.amazon.com','amazon.com','www.gamestop.com','gamestop.com','www.direct2drive.com','direct2drive.com'].includes(u.hostname);
  } catch { return false; }
}

export default async function handler(req,res){
  const id=String(req.query.storeID||'');
  const steamAppID=req.query.steamAppID ? String(req.query.steamAppID) : '';
  const target=STORES[id]?.url(steamAppID);
  if(!target || !isAllowedHost(target)) return res.status(400).json({ok:false,error:'invalid_store'});
  res.setHeader('Cache-Control','no-store');
  res.redirect(302,target);
}
