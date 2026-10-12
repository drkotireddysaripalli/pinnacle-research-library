// Stream away template indentation, retaining one separator and every useful
// text/attribute byte. Raw code, preformatted content and unknown markup stay
// untouched. No whole-response buffering, origin/cache changes or DOM removal.
const FAMILIES=/^\/(?:ma|skills|abilities|b|c|t|m|abs|a)\/[^/]+\/?$/;
const VOID=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const RAW=new Set(['script','style','textarea','title','xmp','iframe','noembed','noframes']);
const KEEP=new Set(['pre','textarea','script','style','code','svg','math','xmp','listing']);

export class LegacyIndentationCompactor {
 constructor(){this.pending='';this.raw=null;this.stack=[];this.literal=false;}
 text(value){
  return !this.literal&&!this.stack.some(x=>x.keep)&&/^[\t\r\n ]+$/.test(value)&&/[\r\n]/.test(value)?' ':value;
 }
 token(value){
  const match=/^<\s*(\/?)\s*([a-z][\w:-]*)\b/i.exec(value);
  if(!match)return;
  const closing=!!match[1],tag=match[2].toLowerCase();
  if(closing){const i=this.stack.findLastIndex(x=>x.tag===tag);if(i>=0)this.stack.length=i;return;}
  // A trailing slash does not close an ordinary HTML non-void element.
  if(VOID.has(tag))return;
  const preserve=KEEP.has(tag)||/\b(?:style\s*=\s*["'][^"']*white-space\s*:|xml:space\s*=\s*["']preserve|contenteditable(?:\s|=|>))/i.test(value);
  this.stack.push({tag,keep:preserve});
  if(RAW.has(tag))this.raw=tag;
 }
 push(value,final=false){
  this.pending+=value;let output='';
  while(this.pending){
   if(this.raw){
    const close=new RegExp('</'+this.raw+'(?:[\\t\\r\\n />])','i').exec(this.pending);
    if(!close){const count=final?this.pending.length:Math.max(0,this.pending.length-(this.raw.length+5));output+=this.pending.slice(0,count);this.pending=this.pending.slice(count);break;}
    output+=this.pending.slice(0,close.index);this.pending=this.pending.slice(close.index);this.raw=null;
   }
   if(this.pending[0]!=='<'){
    const end=this.pending.indexOf('<');
    if(end<0){if(final){output+=this.literal?this.pending:this.text(this.pending);this.pending='';this.literal=false;}else if(this.pending.length>65536){output+=this.pending;this.pending='';this.literal=true;}break;}
    output+=this.literal?this.pending.slice(0,end):this.text(this.pending.slice(0,end));this.pending=this.pending.slice(end);this.literal=false;continue;
   }
   let end=-1;
   if(this.pending.startsWith('<!--')){const i=this.pending.indexOf('-->');if(i>=0)end=i+2;}
   else if(this.pending.startsWith('<![CDATA[')){const i=this.pending.indexOf(']]>');if(i>=0)end=i+2;}
   else {
    if(this.pending.length<2&&!final)break;
    if(!/^<(?:[a-z!/?]|$)/i.test(this.pending)){output+='<';this.pending=this.pending.slice(1);continue;}
    let quote=null;
    for(let i=1;i<this.pending.length;i++){const c=this.pending[i];if(quote){if(c===quote)quote=null;}else if(c==='"'||c==="'")quote=c;else if(c==='>'){end=i;break;}}
   }
   if(end<0){if(final){output+=this.pending;this.pending='';}break;}
   const token=this.pending.slice(0,end+1);output+=token;this.pending=this.pending.slice(end+1);this.token(token);
  }
  return output;
 }
}

export function compactLegacyIndentation(request,response){
 const u=new URL(request.url);
 if(request.method!=='GET'||u.origin!=='https://www.pinnacleblooms.org'||!FAMILIES.test(u.pathname)||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!response.body||response.headers.has('x-pinnacle-legacy-compact')||response.headers.has('set-cookie')||/no-store|no-transform/i.test(response.headers.get('cache-control')||'')||/noindex/i.test(response.headers.get('x-robots-tag')||'')||!/^text\/html(?:\s*;|$)/i.test(response.headers.get('content-type')||''))return response;
 if(/charset\s*=\s*(?!utf-8(?:\s|;|$))/i.test(response.headers.get('content-type')||''))return response;
 const decoder=new TextDecoder('utf-8',{fatal:true}),encoder=new TextEncoder(),compact=new LegacyIndentationCompactor();
 const headers=new Headers(response.headers);
 for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(k);
 headers.set('x-pinnacle-legacy-compact','indentation-20261012');
 const body=response.body.pipeThrough(new TransformStream({transform(chunk,c){const text=compact.push(decoder.decode(chunk,{stream:true}));if(text)c.enqueue(encoder.encode(text));},flush(c){const text=compact.push(decoder.decode(),true);if(text)c.enqueue(encoder.encode(text));}}));
 return new Response(body,{status:response.status,statusText:response.statusText,headers});
}
