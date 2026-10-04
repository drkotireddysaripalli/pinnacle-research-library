import {editionSearch} from './book-edition-search-content.mjs';
export const EDITION_SEARCH_RELEASE='edition-search-20261004';
export const editionSearchEntry=path=>Object.hasOwn(editionSearch,path)?editionSearch[path]:null;
const escapeAttribute=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// Replace only the known search/social summaries and the exact WebPage description.
// All visible content, Product/Book/Offer records and canonical/language links stay byte-identical.
export function rewriteEditionSearch(html,path){
 const entry=editionSearchEntry(path);if(!entry)return html;
 const canonical=html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g)||[];
 if(canonical.length!==1||!canonical[0].includes('href="https://www.pinnacleblooms.org'+path+'"'))return html;
 const headEnd=html.indexOf('</head>');if(headEnd<0)return html;
 let head=html.slice(0,headEnd),changed=0;
 head=head.replace(/<meta\b[^>]*(?:name="(?:description|twitter:description)"|property="og:description")[^>]*>/g,tag=>{
  const expected='content="'+escapeAttribute(entry.before)+'"';
  if(!tag.includes(expected))return tag;changed++;return tag.replace(expected,'content="'+escapeAttribute(entry.after)+'"');
 });
 head=head.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,(tag,text)=>{
  // The current shared layout serialises the WebPage record with name, description, inLanguage in this order.
  // Use the exact prior description; the product uses its distinct subject-specific short_description.
  const expected='"description":'+JSON.stringify(entry.before),target='"description":'+JSON.stringify(entry.after);
  try{const data=JSON.parse(text),nodes=data['@graph']||[data];
   const page=nodes.find(n=>n['@id']==='https://www.pinnacleblooms.org'+path+'#page');
   if(!page||page.description!==entry.before||text.split(expected).length!==2)return tag;
   changed++;return tag.replace(expected,target);
  }catch{return tag;}
 });
 return changed===4?head+html.slice(headEnd):html;
}
