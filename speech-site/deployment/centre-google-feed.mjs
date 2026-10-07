import identityRegister from '../src/data/centre-google-locations.json' with {type:'json'};

const DAY=86400000;
const REVIEW_FIELDS='location_id,review_id,review_comment,review_reviewer,review_star_rating,review_create_time,review_update_time,review_average_rating_total,review_total_count,data_fetched_at';
const POST_FIELDS='location_id,post_id,post_summary,post_state,post_search_url,post_create_time,post_media_google_url,data_fetched_at';
const RESOURCE=/^locations\/\d+$/;
const CONTACT=/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){9,}/i;
const centres=new Map(identityRegister.centres.map(c=>[c.centreId,c]));

function publicGoogleUrl(value,media=false){
 try{
  const u=new URL(value);
  const host=u.hostname.toLowerCase();
  const google=host==='google.com'||host.endsWith('.google.com');
  const allowed=media?host==='googleusercontent.com'||host.endsWith('.googleusercontent.com'):google||host==='g.page'||host==='maps.app.goo.gl'||host==='posts.gle'||host==='goo.gl'&&u.pathname.startsWith('/maps/');
  return u.protocol==='https:'&&!u.username&&!u.password&&allowed?u.href:null;
 }catch{return null;}
}
function exactPublicText(value,max,allowContact=false){return typeof value==='string'&&value.trim()&&value.length<=max&&(allowContact||!CONTACT.test(value))&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)?value:null;}
function date(value){const n=Date.parse(value);return typeof value==='string'&&Number.isFinite(n)?new Date(n).toISOString():null;}
function fresh(row,now){const n=Date.parse(row.data_fetched_at);return Number.isFinite(n)&&now-n<=30*DAY&&n<=now+300000;}
function recentPublication(value,now){const n=Date.parse(value);return Number.isFinite(n)&&n>=now-30*DAY&&n<=now+300000;}
function stars(value){return value==='FIVE'||value==='STAR_RATING_FIVE'?5:Number(value);}
function bodyRows(body){return Array.isArray(body)?body:Array.isArray(body?.data)?body.data:[];}

/** Project only the public fields needed by the page; upstream rows never enter the cache. */
export function selectPublicGoogleContent(reviewRows,postRows,locationResource,now=Date.now()){
 const reviewSource=reviewRows.filter(r=>r&&r.location_id===locationResource&&fresh(r,now));
 const totals=reviewSource.filter(r=>Number.isFinite(Number(r.review_average_rating_total))&&Number(r.review_average_rating_total)>0&&Number(r.review_average_rating_total)<=5&&Number.isSafeInteger(Number(r.review_total_count))&&Number(r.review_total_count)>=0).sort((a,b)=>Date.parse(b.data_fetched_at)-Date.parse(a.data_fetched_at));
 const total=totals[0];
 const overall=total?{rating:Number(total.review_average_rating_total),count:Number(total.review_total_count)}:null;
 const seenReviews=new Set();
 const reviews=reviewSource.sort((a,b)=>Date.parse(b.review_update_time||b.review_create_time)-Date.parse(a.review_update_time||a.review_create_time)).flatMap(r=>{
  const text=exactPublicText(r.review_comment,12000),author=exactPublicText(r.review_reviewer,160),createdAt=date(r.review_create_time),updatedAt=date(r.review_update_time);
  if(stars(r.review_star_rating)!==5||!text||!author||!createdAt||!recentPublication(updatedAt||createdAt,now)||Date.parse(createdAt)>now+300000||typeof r.review_id!=='string'||seenReviews.has(r.review_id))return [];
  seenReviews.add(r.review_id);
  return [{text,author,stars:5,createdAt,updatedAt:updatedAt||createdAt}];
 }).slice(0,6);
 const seenPosts=new Set();
 const posts=postRows.filter(r=>r&&r.location_id===locationResource&&fresh(r,now)&&r.post_state==='LIVE').sort((a,b)=>Date.parse(b.post_create_time)-Date.parse(a.post_create_time)).flatMap(r=>{
  const text=exactPublicText(r.post_summary,12000,true),createdAt=date(r.post_create_time),url=publicGoogleUrl(r.post_search_url),imageUrl=publicGoogleUrl(r.post_media_google_url,true);
  if(!text||!createdAt||!recentPublication(createdAt,now)||!url||typeof r.post_id!=='string'||seenPosts.has(r.post_id))return [];
  seenPosts.add(r.post_id);
  return [{text,createdAt,url,imageUrl}];
 }).slice(0,3);
 const sourceDates=[...reviewSource,...postRows.filter(r=>r&&r.location_id===locationResource&&fresh(r,now))].map(r=>date(r.data_fetched_at)).filter(Boolean).sort();
 // The least recent provider fetch date avoids presenting an older source row as freshly fetched.
 return {overall,reviews,posts,sourceFetchedAt:sourceDates[0]||null};
}

async function providerRows(fetcher,key,resource,fields,timeoutMs,sleep){
 // Windsor's connector endpoint takes locations/{id}; the google_my_business__ prefix is for /all.
 const url=new URL('https://connectors.windsor.ai/google_my_business');
 url.search=new URLSearchParams({api_key:key,select_accounts:resource,date_preset:'last_30d',fields,_max_rows:'200'}).toString();
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  for(let attempt=0;attempt<2;attempt++){
   // Workers supports manual/follow only. A redirect is a non-OK response here,
   // so the API key is never forwarded to a second host.
   const response=await fetcher(url.href,{signal:controller.signal,headers:{Accept:'application/json'},redirect:'manual'});
   if(response.status===202){if(attempt===0){await sleep(750);continue;}return {state:'pending',rows:[]};}
   if(!response.ok)return {state:'unavailable',rows:[]};
   const body=await response.json();
   return {state:'ready',rows:bodyRows(body)};
  }
 }catch{
  // Do not include provider errors, response bodies or request URLs: they may contain the API key.
  return {state:'unavailable',rows:[]};
 }finally{clearTimeout(timer);}
 return {state:'unavailable',rows:[]};
}

function fallback(centre,state='unavailable'){
 return {centreId:centre.centreId,googleUrl:publicGoogleUrl(centre.googleUrl),reviewUrl:publicGoogleUrl(centre.reviewUrl),state,overall:null,reviews:[],posts:[],sourceFetchedAt:null,retrievedAt:null,expiresAt:null,reviewsState:state,postsState:state};
}
function json(data,status=200,ttl=300){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':`public, max-age=0, s-maxage=${ttl}`,'X-Content-Type-Options':'nosniff'}});}

/** Dependency injection keeps the real route, cache and failure paths testable without credentials. */
export function createCentreGoogleHandler({fetcher=(...args)=>fetch(...args),cache=()=>globalThis.caches?.default,now=()=>Date.now(),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),timeoutMs=12000}={}){
 const inFlight=new Map();
 return async function serve(request,env={},ctx){
  const url=new URL(request.url),match=url.pathname.match(/^\/centers\/_google\/([a-z0-9-]+)\/?$/);
  if(!match)return null;
  if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:{Allow:'GET','Cache-Control':'no-store'}});
  const centre=centres.get(match[1]);
  if(!centre)return json({state:'unknown',reviews:[],posts:[]},404,0);
  if(centre.status!=='matched')return json(fallback(centre,centre.status),200,86400);
  if(typeof env.CENTRE_GOOGLE_WINDSOR_KEY!=='string'||!env.CENTRE_GOOGLE_WINDSOR_KEY.trim()||!RESOURCE.test(centre.locationResource))return json(fallback(centre),200,0);
  const store=typeof cache==='function'?cache():cache;
  const key=new Request(`${url.origin}/centers/_google/${centre.centreId}?public-feed-v=1`);
  if(store){
   try{
    const hit=await store.match(key);
    if(hit){const data=await hit.clone().json();if(data.centreId===centre.centreId&&Date.parse(data.expiresAt)>now()&&now()-Date.parse(data.retrievedAt)<DAY)return hit;await store.delete?.(key);}
   }catch{/* Cache failure must not prevent a working Google link. */}
  }
  if(!inFlight.has(centre.centreId)){
   const work=(async()=>{
    const [reviews,posts]=await Promise.all([
     providerRows(fetcher,env.CENTRE_GOOGLE_WINDSOR_KEY.trim(),centre.locationResource,REVIEW_FIELDS,timeoutMs,sleep),
     providerRows(fetcher,env.CENTRE_GOOGLE_WINDSOR_KEY.trim(),centre.locationResource,POST_FIELDS,timeoutMs,sleep)
    ]);
    const content=selectPublicGoogleContent(reviews.rows,posts.rows,centre.locationResource,now());
    const available=reviews.state==='ready'||posts.state==='ready',ttl=available?86400:300,time=now();
    const data={...fallback(centre),...content,state:available?'ready':reviews.state==='pending'||posts.state==='pending'?'pending':'unavailable',reviewsState:reviews.state,postsState:posts.state,retrievedAt:new Date(time).toISOString(),expiresAt:new Date(time+ttl*1000).toISOString()};
    const response=json(data,200,ttl);
    if(store){try{await store.put(key,response.clone());}catch{/* Cache is optional; content still returns. */}}
    return response;
   })();
   inFlight.set(centre.centreId,work);
  }
  try{return (await inFlight.get(centre.centreId)).clone();}
  catch{return json(fallback(centre),200,0);}
  finally{inFlight.delete(centre.centreId);}
 };
}

const defaultHandler=createCentreGoogleHandler();
export async function serveCentreGoogle(request,env,ctx){return defaultHandler(request,env,ctx);}
