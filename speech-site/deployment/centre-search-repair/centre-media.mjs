// Shared, bounded media optimisation for the four identity-guarded centre journeys.
// Existing source images, card destinations, wrappers and approved shell are retained.
export const MEDIA_RELEASE='centre-media-20261004';
export const PLAY_SVG="<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"32px\" height=\"32px\" viewBox=\"0 0 32 32\"><g transform=\"translate(0, 0)\"><path fill=\"#ffffff\" d=\"M29.52,15.146l-23-14C6.212,0.959,5.825,0.953,5.51,1.128C5.195,1.306,5,1.639,5,2v28 c0,0.361,0.195,0.694,0.51,0.872C5.662,30.957,5.831,31,6,31c0.181,0,0.36-0.049,0.52-0.146l23-14C29.818,16.673,30,16.349,30,16 S29.818,15.327,29.52,15.146z\"></path></g></svg>";
const SYMBOL_ID='pinnacle-centre-play-20261004';
const PLAY_USE='<svg width="32px" height="32px" viewBox="0 0 32 32" aria-hidden="true"><use href="#'+SYMBOL_ID+'"/></svg>';
const getAttr=(tag,name)=>tag.match(new RegExp('(?:^|\\s)'+name+'=(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'))?.slice(1).find(v=>v!==undefined);
function setAttr(tag,name,value){const re=new RegExp('\\s'+name+'=(?:"[^"]*"|\'[^\']*\'|[^\\s>]+)','i');return re.test(tag)?tag.replace(re,' '+name+'="'+value+'"'):tag.replace(/\s*\/?>(?=$)/,' '+name+'="'+value+'">');}
export function replaceCentreIntroduction(html,label,markup,videoId){
 const matches=[...html.matchAll(/<div class="center-about-description">/g)];if(matches.length!==1)return null;
 const start=matches[0].index,bodyStart=start+matches[0][0].length;let depth=1,end;
 const divs=/<\/?div\b[^>]*>/gi;divs.lastIndex=bodyStart;
 for(let m;(m=divs.exec(html));){depth+=m[0].startsWith('</')?-1:1;if(depth===0){end=m.index+m[0].length;break;}}
 if(!end)return null;const inner=html.slice(bodyStart,end-6);
 if(!inner.includes(label)||!/<h1>[\s\S]*?<\/h1>/.test(inner))return null;
 let video='';
 if(inner.includes('<div')){
  const mobile=inner.match(/^\s*<h1>[\s\S]*?<\/h1>\s*<div class="pinncle-round">\s*(<div class="youtube-container" style="padding-bottom: 57%;">\s*<iframe[\s\S]*?<\/iframe>\s*<\/div>)([\s\S]*?)<\/div>\s*$/);
  if(!mobile||!mobile[1].includes('https://www.youtube.com/embed/'+videoId)||/<(?:div|script|iframe|h1|section)\b/i.test(mobile[2]))return null;
  video='<div class="pinncle-round" data-preserved-centre-video="'+videoId+'">'+mobile[1]+'</div>';
 }
 return html.slice(0,start)+markup+video+html.slice(end);
}
export function optimiseCentreMediaHtml(html,facilityId){
 let changed=html.replace(/<img\b[^>]*>/gi,tag=>{
  const src=getAttr(tag,'src');if(!src)return tag;let u;try{u=new URL(src,'https://www.pinnacleblooms.org');}catch{return tag;}
  if(u.origin!=='https://www.pinnacleblooms.org')return tag;
  const profile=u.pathname==='/Images/ProfileImages/'+facilityId+'.jpg';
  const review=/^\/images\/reviews\/[1-6]\.png$/i.test(u.pathname);
  if(!profile&&!review)return tag;
  if([...u.searchParams.keys()].some(k=>k!=='v'))return tag;
  const imageUrl='/cdn-cgi/image/format=auto,quality=90,onerror=redirect'+u.pathname+u.search;
  tag=setAttr(tag,'src',imageUrl);tag=setAttr(tag,'decoding','async');
  if(profile){tag=setAttr(tag,'loading','eager');tag=setAttr(tag,'fetchpriority','high');}
  else tag=setAttr(tag,'loading','lazy');
  return tag;
 });
 changed=changed.replace(/<iframe\b[^>]*>/gi,tag=>{
  const src=getAttr(tag,'src')||'';
  if(!/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(?:\?|$)/.test(src))return tag;
  tag=setAttr(tag,'loading','lazy');if(!getAttr(tag,'title'))tag=setAttr(tag,'title','Pinnacle centre introduction video');return tag;
 });
 // Only the known repeated article icon, never arbitrary SVGs or shared-shell artwork.
 changed=changed.replace(/(<section class="blogs-section c-section">)([\s\S]*?)(<\/section>)/g,(whole,open,body,close)=>{
  if(body.includes(SYMBOL_ID)||body.split(PLAY_SVG).length<3)return whole;
  const definition='<svg width="0" height="0" aria-hidden="true" style="position:absolute;overflow:hidden"><defs><symbol id="'+SYMBOL_ID+'" viewBox="0 0 32 32">'+PLAY_SVG.match(/<g[\s\S]*<\/g>/)[0]+'</symbol></defs></svg>';
  return open+definition+body.replaceAll(PLAY_SVG,PLAY_USE)+close;
 });
 return changed;
}
