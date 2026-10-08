// Public reading templates only. Keep enquiry, authentication and private app
// routes independent. Preserve every video destination; load players on intent.
import {addReadingDirectory} from './reading-directory.mjs';
const playScript=`<script data-pinnacle-video-intent>document.addEventListener('click',function(e){var b=e.target.closest('[data-pinnacle-video]');if(!b)return;var f=document.createElement('iframe');f.src=b.dataset.pinnacleVideo;f.title=b.getAttribute('aria-label');f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;f.style='position:absolute;inset:0;width:100%;height:100%;border:0';b.parentNode.replaceChild(f,b);f.focus();});</script>`;
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
class StaffTitle {
 element(){this.buffer='';}
 text(chunk){this.buffer+=chunk.text;if(!chunk.lastInTextNode){chunk.remove();return;}const known=['Best Speech Therapy Center in Hyderabad - Pinnacle Blooms','Pinnacle Blooms Network Staff - Best Speech Therapy Center in India'];chunk.replace(known.includes(this.buffer.trim())?'Pinnacle Blooms Network Team and Staff':this.buffer);this.buffer='';}
}
export function repairMissingRatingCounter(text){
 const assignment="document.getElementById('votesupdate').innerText = (sData.aggregateRating.reviewCount) +\"\";";
 if(!text.includes('getsunshinerating?')||!text.includes('jSuites.rating')||text.split(assignment).length!==3)return text;
 const value="document.getElementById('ratingvalueupdate').innerText = (sData.aggregateRating.ratingValue) ;";
 return text.replaceAll(assignment,"document.getElementById('votesupdate') && (document.getElementById('votesupdate').innerText = (sData.aggregateRating.reviewCount) +\"\");")
  .replaceAll(value,"document.getElementById('ratingvalueupdate') && (document.getElementById('ratingvalueupdate').innerText = (sData.aggregateRating.ratingValue));");
}
class RatingScript {
 element(e){
  this.pass=!!e.getAttribute('src')||!['','text/javascript','application/javascript'].includes(e.getAttribute('type')||'');this.buffer='';this.streaming=false;
  if(!this.pass){this.open='<script'+[...e.attributes].map(([k,v])=>' '+k+'="'+escape(v)+'"').join('')+'>';e.removeAndKeepContent();}
 }
 text(chunk){
  if(this.pass)return;
  if(this.streaming){if(chunk.lastInTextNode)chunk.after('</script>',{html:true});return;}
  this.buffer+=chunk.text;
  if(this.buffer.length>32768){chunk.replace(this.open+this.buffer+(chunk.lastInTextNode?'</script>':''),{html:true});this.streaming=!chunk.lastInTextNode;this.buffer='';}
  else if(!chunk.lastInTextNode)chunk.remove();
  else{chunk.replace(this.open+repairMissingRatingCounter(this.buffer)+'</script>',{html:true});this.buffer='';}
 }
}
export function videoButton(src,{eager=false}={}){
 let u;try{u=new URL(src);}catch{return null;}
 if(!['www.youtube.com','www.youtube-nocookie.com'].includes(u.hostname)||!/^\/embed\/[\w-]{11}$/.test(u.pathname))return null;
 const id=u.pathname.split('/').pop();u.hostname='www.youtube-nocookie.com';u.search='?autoplay=1&rel=0';
 return '<div class="pinnacle-intent-video" style="position:relative;width:100%;aspect-ratio:16/9;background:#142348;overflow:hidden;border-radius:12px"><button type="button" data-pinnacle-video="'+escape(u.href)+'" aria-label="Play Pinnacle video" style="display:block;position:absolute;inset:0;width:100%;height:100%;border:0;padding:0;background:#142348;color:white;cursor:pointer"><img src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="" width="480" height="360" loading="'+(eager?'eager':'lazy')+'" '+(eager?'fetchpriority="high" ':'')+'decoding="async" style="width:100%;height:100%;object-fit:cover"><span style="position:absolute;inset:0;display:grid;place-content:center"><span style="background:#9e258f;padding:14px 22px;border-radius:50px;font:700 18px sans-serif">&#9654; Play video</span></span></button></div>';
}
export function repairKnownLegacyPerformance(response,request){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||!/^\/(?:(?:ma|abilities|b|c|m|t|a|abs|skills)\/[^/]+|staff\/?|mirracles\/\d+\/[^/]+)\/?$/.test(u.pathname))return response;
 let hero=false,video=false;
 const dimensions=new Map([['https://images.pinnacleblooms.org/Ability/Sections/1220.jpg',[1024,1024]],['https://www.pinnacleblooms.org/Assets/Materials/20707165309.jpg',[300,300]],['https://www.pinnacleblooms.org/Images/pinnacle-about.webp',[415,250]]]);
 const rewrite=new HTMLRewriter()
 .on('head',{element(e){e.append('<style data-pinnacle-reading-layout>.youtube-container>.pinnacle-intent-video{position:absolute!important;inset:0;width:100%;height:100%;aspect-ratio:auto}@media(max-width:600px){.all-staff-container .bottom-b-scroll>ul>li:nth-child(n+9){content-visibility:auto;contain-intrinsic-block-size:auto 200px}.scroll-container-1>.award-holder.mirracle-holder:nth-child(n+5){content-visibility:auto;contain-intrinsic-block-size:auto 682px}}@media print{.all-staff-container .bottom-b-scroll>ul>li,.scroll-container-1>.award-holder.mirracle-holder{content-visibility:visible!important}}</style>',{html:true});}})
 .on('img',{element(e){
  if(hero)return;let src;try{src=new URL(e.getAttribute('src')||'',u.origin).href;}catch{return;}
  if(!/^https:\/\/(?:images\.pinnacleblooms\.org\/(?:Ability|Materials)\/Sections\/|www\.pinnacleblooms\.org\/(?:Assets\/Materials\/\d+\.(?:jpg|png)|Images\/pinnacle-about\.webp))/i.test(src))return;
  hero=true;e.setAttribute('loading','eager');e.setAttribute('fetchpriority','high');e.setAttribute('decoding','async');
  const key=src.split('?')[0],size=dimensions.get(key);if(size){e.setAttribute('width',String(size[0]));e.setAttribute('height',String(size[1]));e.setAttribute('style',(e.getAttribute('style')||'')+';height:auto');}
  if(u.pathname==='/staff')e.setAttribute('alt','Pinnacle Blooms Network team and child development services');
 }})
 .on('iframe',{element(e){const button=videoButton(e.getAttribute('src')||'',{eager:!video&&u.pathname.startsWith('/mirracles/')});if(button){e.replace(button,{html:true});video=true;}}})
 .on('body',{element(e){e.onEndTag(tag=>{if(video)tag.before(playScript,{html:true});});}});
 rewrite.on('script:not([src])',new RatingScript());
 rewrite.on('a[href]',{element(e){if(['tel:9100181181','tel:+919100181181'].includes(e.getAttribute('href')))e.setAttribute('href','tel:+919100181181');}});
 addReadingDirectory(rewrite);
 if(u.pathname.replace(/\/$/,'')==='/staff'){
  let heading=0;
  rewrite.on('head title',new StaffTitle()).on('h1',{element(e){if(++heading>1)e.tagName='h2';}});
 }
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])h.delete(k);h.set('x-pinnacle-reading-performance','native-topic-directory-20261008');
 return rewrite.transform(new Response(response.body,{status:response.status,headers:h}));
}
