type Review={text:string;author:string;stars:number;createdAt:string;updatedAt:string};
type Post={text:string;createdAt:string;url:string;imageUrl:string|null};
type Feed={state:string;overall:{rating:number;count:number}|null;reviews:Review[];posts:Post[];sourceFetchedAt:string|null;retrievedAt:string|null;expiresAt:string|null;reviewsState:string;postsState:string};
const dateFormat=new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
function displayDate(value:string){return dateFormat.format(new Date(value));}
function node<K extends keyof HTMLElementTagNameMap>(tag:K,className:string,text?:string){const el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;}
function safeLink(value:string,media=false){try{const u=new URL(value),h=u.hostname.toLowerCase(),allowed=media?h==='googleusercontent.com'||h.endsWith('.googleusercontent.com'):h==='google.com'||h.endsWith('.google.com')||['g.page','maps.app.goo.gl','posts.gle'].includes(h)||h==='goo.gl'&&u.pathname.startsWith('/maps/');return u.protocol==='https:'&&!u.username&&!u.password&&allowed?u.href:null;}catch{return null;}}
function sourceLink(url:string,label:string){const link=node('a','local-text-link',label);link.href=url;link.target='_blank';link.rel='noopener';return link;}
function render(section:HTMLElement,feed:Feed){
 const status=section.querySelector<HTMLElement>('[data-google-status]'),overall=section.querySelector<HTMLElement>('[data-google-overall]'),rail=section.querySelector<HTMLElement>('[data-google-review-rail]'),posts=section.querySelector<HTMLElement>('[data-google-posts]'),listing=section.querySelector<HTMLAnchorElement>('.google-feed-source a');
 if(!status||!overall||!rail||!posts||!listing)return;
 if(feed.state!=='ready'){status.textContent='Recent feedback is temporarily unavailable here. The Google listing remains available.';return;}
 if(!feed.expiresAt||Date.parse(feed.expiresAt)<=Date.now()){status.textContent='Open Google for the current feedback and centre updates.';return;}
 if(feed.overall&&feed.overall.rating>0&&feed.overall.rating<=5&&Number.isSafeInteger(feed.overall.count)){
  const rating=node('strong','google-overall-rating',feed.overall.rating.toFixed(1)+' / 5');
  overall.replaceChildren(rating,document.createTextNode(' overall Google rating · '+feed.overall.count.toLocaleString('en-IN')+' ratings and reviews.'));
 }
 const reviews=Array.isArray(feed.reviews)?feed.reviews.filter(r=>r.stars===5&&typeof r.text==='string'&&typeof r.author==='string'&&Number.isFinite(Date.parse(r.createdAt))):[];
 rail.replaceChildren(...reviews.slice(0,6).map(review=>{
  const card=node('article','google-review-card'),stars=node('span','google-review-stars','★★★★★'),quote=node('blockquote','',review.text),author=node('div','google-review-author',review.author),time=node('time','google-review-date',displayDate(review.createdAt));
  stars.setAttribute('aria-label','5 out of 5 stars');time.dateTime=review.createdAt;
  card.append(stars,quote,author,time);
  if(review.updatedAt&&review.updatedAt!==review.createdAt&&Number.isFinite(Date.parse(review.updatedAt))){const updated=node('time','google-review-date','Updated '+displayDate(review.updatedAt));updated.dateTime=review.updatedAt;card.append(updated);}
  card.append(sourceLink(listing.href,'Review published on Google'));
  return card;
 }));
 const reviewSection=section.querySelector<HTMLElement>('[data-google-review-section]');if(reviewSection)reviewSection.hidden=reviews.length===0;
 const publicPosts=Array.isArray(feed.posts)?feed.posts.filter(p=>typeof p.text==='string'&&safeLink(p.url)&&Number.isFinite(Date.parse(p.createdAt))):[];
 posts.replaceChildren(...publicPosts.slice(0,3).map(post=>{
  const card=node('article','google-post-card'),time=node('time','',displayDate(post.createdAt));time.dateTime=post.createdAt;
  const imageUrl=post.imageUrl&&safeLink(post.imageUrl,true);
  if(imageUrl){const image=node('img','');image.src=imageUrl;image.alt='Image accompanying the centre’s public Google update';image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';image.addEventListener('error',()=>image.remove(),{once:true});card.append(image);}
  card.append(time);
  // A preview is an exact opening excerpt. Expanding retains the entire original post text.
  const preview=node('p','',post.text.length>260?post.text.slice(0,260)+'…':post.text);card.append(preview);
  if(post.text.length>260){const details=node('details',''),summary=node('summary','','Read the full update'),body=node('p','',post.text);details.append(summary,body);card.append(details);}
  card.append(sourceLink(safeLink(post.url)!,'View update on Google'));return card;
 }));
 const postSection=section.querySelector<HTMLElement>('[data-google-post-section]');if(postSection)postSection.hidden=publicPosts.length===0;
 if(feed.retrievedAt&&Number.isFinite(Date.parse(feed.retrievedAt))){status.textContent='Website feed retrieved '+displayDate(feed.retrievedAt)+'.';if(feed.sourceFetchedAt&&Number.isFinite(Date.parse(feed.sourceFetchedAt)))status.textContent+=' Google source data fetched '+displayDate(feed.sourceFetchedAt)+'.';status.textContent+=' Reviews created or updated, and updates published, in the past 30 days are shown.';if(feed.reviewsState!=='ready'||feed.postsState!=='ready')status.textContent+=' Some recent entries are temporarily unavailable; explore the full Google listing.';else if(!reviews.length&&!publicPosts.length)status.textContent+=' No recent entries are available in this selection.';}
 const previous=section.querySelector<HTMLButtonElement>('[data-google-previous]'),next=section.querySelector<HTMLButtonElement>('[data-google-next]');
 const controls=()=>{if(previous)previous.disabled=rail.scrollLeft<=2;if(next)next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2;};
 const step=(direction:number)=>rail.scrollBy({left:direction*(rail.clientWidth*.85),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 previous?.addEventListener('click',()=>step(-1));next?.addEventListener('click',()=>step(1));rail.addEventListener('scroll',controls,{passive:true});new ResizeObserver(controls).observe(rail);controls();
}
export function initCentreGoogleFeeds(){
 document.querySelectorAll<HTMLElement>('[data-centre-google]').forEach(section=>{
  if(section.dataset.googleInitialized)return;section.dataset.googleInitialized='true';
  let requested=false;
  const load=async()=>{
   if(requested)return;requested=true;
   const controller=new AbortController(),timer=window.setTimeout(()=>controller.abort(),16000);
   try{const response=await fetch('/centers/_google/'+encodeURIComponent(section.dataset.centreGoogle||''),{headers:{Accept:'application/json'},credentials:'omit',cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('Google feed unavailable');render(section,await response.json());}
   catch{const status=section.querySelector<HTMLElement>('[data-google-status]');if(status)status.textContent='Recent feedback is temporarily unavailable here. Read reviews and updates on Google.';}
   finally{window.clearTimeout(timer);}
  };
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();void load();}},{rootMargin:'150px'});observer.observe(section);}
  else{section.querySelector('a')?.addEventListener('focus',()=>void load(),{once:true});}
 });
}
