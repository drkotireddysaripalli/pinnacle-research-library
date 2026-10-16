const path='/tactile-sensory-kit-texture-exploration';
export function removePlaceholderVideo(value){
 if(Array.isArray(value))return value.map(removePlaceholderVideo).filter(v=>v!==undefined);
 if(!value||typeof value!=='object')return value;
 const type=Array.isArray(value['@type'])?value['@type']:[value['@type']];
 if(type.includes('VideoObject')&&typeof value.embedUrl==='string'&&value.embedUrl.includes('/embed/VIDEO_ID'))return undefined;
 return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,removePlaceholderVideo(v)]).filter(([,v])=>v!==undefined));
}
export function repairMaterialsPlaceholder(request,response,Rewriter=globalThis.HTMLRewriter){
 const u=new URL(request.url);
 if(u.origin!=='https://materials.pinnacleblooms.org'||u.pathname!==path||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||!Rewriter)return response;
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','digest','content-digest','content-md5'])headers.delete(k);
 headers.set('x-pinnacle-video-schema-repair','tactile-placeholder-20261016');let text='',script;
 return new Rewriter().on('script[type="application/ld+json"]',{element(e){text='';script=e;},text(t){text+=t.text;t.remove();if(t.lastInTextNode){try{const data=JSON.parse(text),next=removePlaceholderVideo(data);if(next===undefined||Array.isArray(next)&&!next.length)script.remove();else t.before(JSON.stringify(next).replace(/</g,'\\u003c'),{html:true});}catch{t.before(text,{html:true});}text='';}}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
