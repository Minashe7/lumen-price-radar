export default async function handler(req,res){
  if(process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ok:false});
  const base=`https://${req.headers.host}`;
  try{
    const r=await fetch(`${base}/api/deals?pageSize=60&sortBy=DealRating&desc=0`);
    res.status(r.ok?200:502).json({ok:r.ok,warmed:true});
  }catch(e){res.status(502).json({ok:false,warmed:false});}
}
