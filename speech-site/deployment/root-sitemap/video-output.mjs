// Streaming repair at the maintained sitemap generator boundary. Page URLs
// remain discoverable even when the underlying video has incomplete metadata.
const plain=value=>value?.trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/,'$1').replace(/&(amp|lt|gt|quot|apos);/g,(_,e)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[e]));
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const field=(s,k)=>plain(s.match(new RegExp('<video:'+k+'>([\\s\\S]*?)</video:'+k+'>','i'))?.[1]);
const publicUrl=s=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}};
export function repairVideoEntry(entry){
 const location=plain(entry.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]);
 if(!/^https:\/\/www\.pinnacleblooms\.org\/mirracles\/\d+\//.test(location||''))return entry;
 return entry.replace(/<video:video\b[^>]*>[\s\S]*?<\/video:video>/gi,video=>{
  const title=field(video,'title'),description=field(video,'description'),thumbnail=field(video,'thumbnail_loc');
  const content=field(video,'content_loc'),player=field(video,'player_loc');
  // The three supplied examples have no useful visible title. Do not invent one.
  if(!title||!description||!publicUrl(thumbnail)||!publicUrl(player||content)||thumbnail===location||(player||content)===location)return '';
  if(content){
   let u;try{u=new URL(content);}catch{return '';}
   if(['www.youtube.com','youtube.com','youtu.be'].includes(u.hostname)){
    const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v');
    if(!/^[\w-]{11}$/.test(id||''))return '';
    // A YouTube watch page is HTML, not a video media content URL.
    video=video.replace(/<video:content_loc>[\s\S]*?<\/video:content_loc>/i,'<video:player_loc>https://www.youtube.com/embed/'+id+'</video:player_loc>');
   }
  }
  if(description.length>2048){const slice=description.slice(0,2048),end=slice.lastIndexOf(' ');video=video.replace(/<video:description>[\s\S]*?<\/video:description>/i,'<video:description>'+escape(end>1800?slice.slice(0,end):slice)+'</video:description>');}
  // These optional counters/subscription flags are not backed by this output's
  // current source, and the publicly viewable pages require no subscription.
  return video.replace(/<video:(rating|view_count|requires_subscription)>[\s\S]*?<\/video:\1>/gi,'').replace(/<video:tag>\s*<\/video:tag>/gi,'');
 });
}
export function repairVideoSitemap(response,method='GET'){
 if(response.status!==200||!response.body||!/(?:application|text)\/xml/i.test(response.headers.get('content-type')||'')||response.headers.has('set-cookie')||/private|no-store|no-transform/.test(response.headers.get('cache-control')||''))return response;
 const decoder=new TextDecoder(),encoder=new TextEncoder();let buffer='',passthrough=false;
 const body=response.body.pipeThrough(new TransformStream({
  transform(chunk,controller){
   buffer+=decoder.decode(chunk,{stream:true});
   if(passthrough){controller.enqueue(encoder.encode(buffer));buffer='';return;}
   let end;while((end=buffer.indexOf('</url>'))>=0){const item=buffer.slice(0,end+6);buffer=buffer.slice(end+6);controller.enqueue(encoder.encode(item.replace(/<url\b[^>]*>[\s\S]*?<\/url>/gi,repairVideoEntry)));}
   // Unknown oversized entries pass through unchanged rather than exhausting
   // memory or truncating any of the remaining XML.
   if(buffer.length>128*1024){passthrough=true;controller.enqueue(encoder.encode(buffer));buffer='';}
  },flush(controller){controller.enqueue(encoder.encode(buffer+decoder.decode()));}
 }));
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(k);
 headers.set('x-pinnacle-video-sitemap','required-fields-player-20261007');
 return new Response(method==='HEAD'?null:body,{status:200,headers});
}
