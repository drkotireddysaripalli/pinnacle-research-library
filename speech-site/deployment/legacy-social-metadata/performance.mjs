// Public reading templates only. Keep enquiry, authentication and private app
// routes independent. Preserve every video destination; load players on intent.
const playScript=`<script data-pinnacle-video-intent>document.addEventListener('click',function(e){var b=e.target.closest('[data-pinnacle-video]');if(!b)return;var f=document.createElement('iframe');f.src=b.dataset.pinnacleVideo;f.title=b.getAttribute('aria-label');f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;f.style='position:absolute;inset:0;width:100%;height:100%;border:0';b.parentNode.replaceChild(f,b);f.focus();});</script>`;
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
export function videoButton(src){
 let u;try{u=new URL(src);}catch{return null;}
 if(!['www.youtube.com','www.youtube-nocookie.com'].includes(u.hostname)||!/^\/embed\/[\w-]{11}$/.test(u.pathname))return null;
 const id=u.pathname.split('/').pop();u.hostname='www.youtube-nocookie.com';u.search='?autoplay=1&rel=0';
 return '<div class="pinnacle-intent-video" style="position:relative;width:100%;aspect-ratio:16/9;background:#142348;overflow:hidden;border-radius:12px"><button type="button" data-pinnacle-video="'+escape(u.href)+'" aria-label="Play Pinnacle video" style="display:block;position:absolute;inset:0;width:100%;height:100%;border:0;padding:0;background:#142348;color:white;cursor:pointer"><img src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover"><span style="position:absolute;inset:0;display:grid;place-content:center"><span style="background:#9e258f;padding:14px 22px;border-radius:50px;font:700 18px sans-serif">&#9654; Play video</span></span></button></div>';
}
export function repairKnownLegacyPerformance(response,request){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||!/^\/(?:ma\/[^/]+|abilities\/[^/]+|b\/[^/]+|staff\/?|mirracles\/\d+\/[^/]+)\/?$/.test(u.pathname))return response;
 let hero=false,video=false;
 const rewrite=new HTMLRewriter()
 .on('img',{element(e){
  if(hero)return;const src=e.getAttribute('src')||'';
  if(!/^https:\/\/(?:images\.pinnacleblooms\.org\/(?:Ability|Materials)\/Sections\/|www\.pinnacleblooms\.org\/(?:Assets\/Materials\/\d+\.(?:jpg|png)|Images\/pinnacle-about\.webp))/i.test(src))return;
  hero=true;e.setAttribute('loading','eager');e.setAttribute('fetchpriority','high');e.setAttribute('decoding','async');
  if(u.pathname==='/staff')e.setAttribute('alt','Pinnacle Blooms Network team and child development services');
 }})
 .on('iframe',{element(e){const button=videoButton(e.getAttribute('src')||'');if(button){e.replace(button,{html:true});video=true;}}})
 .on('body',{element(e){e.onEndTag(tag=>{if(video)tag.before(playScript,{html:true});});}});
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])h.delete(k);h.set('x-pinnacle-reading-performance','image-video-intent-20261007');
 return rewrite.transform(new Response(response.body,{status:response.status,headers:h}));
}
