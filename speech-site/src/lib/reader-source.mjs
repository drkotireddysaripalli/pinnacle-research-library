// Shared reader-entry context. Store a section label, not browsing history or query values.
export const READER_SECTIONS=Object.freeze(['ask','faq','sunshine','mirracles','materials','interventions']);
const origins=Object.freeze({materials:'https://materials.pinnacleblooms.org',interventions:'https://interventions.pinnacleblooms.org'});
export function readerSection(path){
 if(typeof path!=='string')return null;
 if(/^\/mirracles\/\d+(?:\/|$)/.test(path))return 'mirracles';
 const key=path.match(/^\/(ask|faq|sunshine|allmirracles|materials|interventions)(?:\/|[?#]|$)/)?.[1];
 return key==='allmirracles'?'mirracles':key||null;
}
export function libraryReturn(value){
 if(typeof value!=='string'||value.length>2048||!/^\/(materials|interventions)(?:\/|#|$)/.test(value)||/[\\\x00-\x1f\x7f]/.test(value))return null;
 try{
  const raw=value.split(/[?#]/)[0],decoded=decodeURIComponent(raw);
  if(/%(?:2f|5c)/i.test(raw)||/[\\<>\x00-\x1f\x7f]/.test(decoded)||decoded.replace(/\/$/,'').split('/').some((s,i)=>i>0&&(!s||s==='.'||s==='..')))return null;
  const u=new URL(value,'https://www.pinnacleblooms.org');
  if(u.origin!=='https://www.pinnacleblooms.org'||u.search||u.hash&&!/^#[a-zA-Z0-9_-]+$/.test(u.hash))return null;
  return u.pathname+u.hash;
 }catch{return null;}
}
export function readerDestination(value){
 const target=libraryReturn(value);
 if(!target)return value;
 const section=readerSection(target);
 return origins[section]+(target.slice(section.length+1)||'/');
}
export function readerSignInPath(value,reason){
 const target=libraryReturn(value);
 const u=new URL('/ask','https://www.pinnacleblooms.org');
 if(target)u.searchParams.set('reader_return',target);
 if(reason)u.searchParams.set('ask_signin',reason);
 return u.pathname+u.search;
}
export function registrationSection(library,returnTo){
 return readerSection(returnTo)|| (READER_SECTIONS.includes(library)?library:'unknown');
}
export function readerContext(url){
 const entry=new URL(url,'https://www.pinnacleblooms.org');
 const forwarded=entry.pathname==='/ask'?libraryReturn(entry.searchParams.get('reader_return')):null;
 entry.searchParams.delete('reader_return');
 const returnTo=forwarded||entry.pathname+entry.search+entry.hash;
 return {library:readerSection(returnTo)||'unknown',returnTo,forwarded:!!forwarded,destination:readerDestination(returnTo)};
}
