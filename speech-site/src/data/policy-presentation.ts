import sourcePolicies from './policy-content.json' with {type:'json'};
import {currentPolicyVersions} from './policy-current.ts';
import {parseFragment,serialize} from 'parse5';

const basic=new Set(['privacy-policy','terms-of-service','cookie-policy','copyright-and-intellectual','age-restriction-policy','contact-information','disclaimer-and-limitations-of-liabilities','endorsement-and-testimonial','governing-and-jurisdiction','third-party-inegration','refund-policy']);
const subCookies=new Set(['policy-section-4','policy-section-5','policy-section-6']);
const repairs:Record<string,[string,string][]>={
 'privacy-policy':[['Pinancle','Pinnacle'],['forefiet','forfeit'],['refering','referring'],['triump','triumph']],
 'terms-of-use':[['VI. AGREEMENT TO BE BOUND','VII. AGREEMENT TO BE BOUND']],
 'cookie-policy':[['respective third partie','respective third parties.']],
 'copyright-and-intellectual':[['Section 19:Protection','Section 19: Protection'],['21.1. For inquiries','20.1. For inquiries']],
 'contact-information':[["- World's #1 Autism Therapy Centers Network",'']],
 'endorsement-and-testimonial':[['Pinancle','Pinnacle']],
 'governing-and-jurisdiction':[['implications.l laws.','implications.'],['Hyderabad,IN','Hyderabad, IN']],
 'refund-policy':[['hourss','hours'],['challege','challenge'],['forefiet','forfeit']],
 'staff-declaration':[['www.pinnacleblooms.or','www.pinnacleblooms.org']]
};
type Node=any;
const attr=(n:Node,name:string)=>n.attrs?.find((a:Node)=>a.name===name)?.value;
const children=(n:Node)=>n.childNodes||[];
const plain=(n:Node):string=>n.nodeName==='#text'?n.value:children(n).map(plain).join('');
function walk(n:Node,fn:(n:Node)=>void){fn(n);for(const child of children(n))walk(child,fn);}
const blocks=new Set(['p','div','section','article','blockquote','address']);
function plainReading(n:Node):string{
 if(n.nodeName==='#text')return n.value;
 if(n.nodeName==='#comment'||['script','style'].includes(n.tagName))return '';
 const body=children(n).map(plainReading).join('');
 return blocks.has(n.tagName)||/^h[1-6]$/.test(n.tagName||'')||['li','ul','ol','br','tr'].includes(n.tagName)?'\n'+body+'\n':body;
}
function reading(n:Node):string{
 if(n.nodeName==='#text')return n.value.replace(/\s+/g,' ');
 if(n.nodeName==='#comment'||['script','style'].includes(n.tagName))return '';
 if(n.tagName==='table'){
  const rows:Node[]=[];walk(n,x=>{if(x.tagName==='tr')rows.push(x);});
  const cells=rows.map(r=>children(r).filter((c:Node)=>['td','th'].includes(c.tagName)));
  const values=cells.map(row=>row.map((c:Node)=>reading(c).replace(/\s+/g,' ').trim().replaceAll('|','\\|')));
  const columns=Math.max(0,...values.map(row=>row.length));if(!columns)return '';
  const line=(row:string[])=>'| '+Array.from({length:columns},(_,i)=>row[i]||'').join(' | ')+' |';
  const hasHeader=cells[0]?.length&&cells[0].every((c:Node)=>c.tagName==='th');
  return '\n\n'+[line(hasHeader?values.shift()!:[]),line(Array(columns).fill('---')),...values.map(line)].join('\n')+'\n\n';
 }
 if(n.tagName==='br')return '\n';
 const body=children(n).map(reading).join('');
 if(/^h[1-6]$/.test(n.tagName||''))return '\n\n'+'#'.repeat(Number(n.tagName[1]))+' '+body.trim()+'\n\n';
 if(n.tagName==='a'){const href=attr(n,'href');return href?'['+body.trim()+']('+href+')':body;}
 if(n.tagName==='li'){const ordered=n.parentNode?.tagName==='ol';const siblings=children(n.parentNode).filter((c:Node)=>c.tagName==='li');let depth=0;for(let parent=n.parentNode;parent;parent=parent.parentNode)if(['ul','ol'].includes(parent.tagName))depth++;const indent='    '.repeat(Math.max(0,depth-1));const lines=body.trim().split('\n').map((line,i)=>i===0||!line.trim()?line:line.startsWith(indent+'    ')?line:indent+'    '+line);return '\n'+indent+(ordered?siblings.indexOf(n)+1+'. ':'- ')+lines.join('\n')+'\n';}
 if(['ul','ol'].includes(n.tagName))return '\n'+body+'\n';
 return blocks.has(n.tagName)?'\n\n'+body.trim()+'\n\n':body;
}
export function presentPolicy(page:any):any{
 const current=currentPolicyVersions.find(policy=>policy.slug===page.slug);
 if(current){
  const document=parseFragment(current.html),markdown=reading(document).replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+'\n';
  return {...page,...current,historicalPrintedRevision:page.historicalPrintedRevision??page.printedRevision??null,text:plainReading(document).replace(/\s+/g,' ').trim(),originalText:page.originalText??page.text??null,markdown,presentationText:markdown,presentationVersion:current.version,
   changes:['New owner-authorised policy edition for the Pinnacle/BHCL website and services','Prior source retained as historical provenance; current wording replaces it prospectively']};
 }
 const document=parseFragment(page.html),changes:string[]=[];
 function cleanMarkers(parent:Node){
  const nodes=children(parent);for(let i=nodes.length-1;i>=0;i--){const n=nodes[i];cleanMarkers(n);let next=i+1;while(next<nodes.length&&nodes[next].nodeName==='#text'&&!nodes[next].value.trim())next++;
   if((n.nodeName==='#text'||n.tagName==='p')&&/^#{1,6}$/.test(plain(n).trim())&&/^h[1-6]$/.test(nodes[next]?.tagName||'')){nodes.splice(i,1);changes.push('Detached heading marker removed');}
  }
 }cleanMarkers(document);
 walk(document,n=>{
  const id=attr(n,'id');if(basic.has(page.slug)&&page.toc.some(t=>t.id===id)&&/^h[1-6]$/.test(n.tagName||'')){const level=page.slug==='cookie-policy'&&subCookies.has(id)?3:2;if(n.tagName!=='h'+level){n.tagName=n.nodeName='h'+level;changes.push('Heading '+id+' to H'+level);}}
  if(n.nodeName==='#text')for(const [from,to]of repairs[page.slug]||[]){
   // Exact source tokens only: do not turn correct "third parties" or .org into typos.
   const pattern=from==='respective third partie'?/respective third partie(?!s)\b/g:from==='www.pinnacleblooms.or'?/www\.pinnacleblooms\.or(?!g)\b/g:from==='triump'?/\btriump\b/g:null;
   const after=pattern?n.value.replace(pattern,to):n.value.split(from).join(to);if(after!==n.value){n.value=after;changes.push(from+' → '+to);}
  }
  if(page.slug==='ethics-charter'&&n.tagName==='p'){
   const text=plain(n).trim();let replacement='';
   if(text.startsWith('With this section, Pinnacle becomes one of the first therapeutic institutions globally'))replacement='This section sets out how ethics connects with scientific risk mapping.';
   if(text.startsWith('Through this, Pinnacle becomes the first therapeutic network globally'))replacement='This section describes predictive analytics, AI triggers, human audit loops and clinical context for identifying high-risk ethical behaviour.';
   if(replacement){n.childNodes=parseFragment(replacement).childNodes;for(const child of n.childNodes)child.parentNode=n;changes.push('Unsupported global comparison replaced with document description');}
  }
 });
 const destinations:Record<string,string>={'Contact Information':'/contact-information','Privacy Policy':'/privacy-policy','Age Restriction Policy':'/age-restriction-policy','Governing Law and Jurisdiction':'/governing-and-jurisdiction'};
 function linkReferences(parent:Node,excluded=false){const blocked=excluded||parent.tagName==='a'||/^h[1-6]$/.test(parent.tagName||'');const nodes=children(parent);for(let i=nodes.length-1;i>=0;i--){const n=nodes[i];if(n.nodeName==='#text'&&!blocked){
   let html=n.value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
   for(const [label,href]of Object.entries(destinations))if(href!==page.path)html=html.replaceAll(label,'<a href="'+href+'">'+label+'</a>');
   if(['contact-information','refund-policy'].includes(page.slug))html=html.replaceAll('9100 181 181','<a href="tel:+919100181181">9100 181 181</a>');
   if(page.slug==='contact-information')html=html.replaceAll('care@pinnacleblooms.org','<a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a>');
   if(page.slug==='staff-declaration')html=html.replaceAll('www.pinnacleblooms.org','<a href="https://www.pinnacleblooms.org/">www.pinnacleblooms.org</a>');
   const inserted=parseFragment(html).childNodes;if(inserted.some((x:Node)=>x.tagName==='a')){for(const c of inserted)c.parentNode=parent;nodes.splice(i,1,...inserted);changes.push('Existing reference made actionable');}
  }else linkReferences(n,blocked);}}
 linkReferences(document);
 const headings=new Map<string,Node>();walk(document,n=>{if(/^h[1-6]$/.test(n.tagName||''))headings.set(attr(n,'id'),n);});
 const toc=page.toc.map(t=>({...t,title:plain(headings.get(t.id)).trim(),level:Number(headings.get(t.id).tagName[1])}));
 const markdown=reading(document).replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+'\n';
 return {...page,html:serialize(document),toc,originalText:page.text,markdown,presentationText:markdown,presentationVersion:'2026-10-01-v148',changes:[...new Set(changes)]};
}
export const policies=currentPolicyVersions.map(current=>presentPolicy(sourcePolicies.find(policy=>policy.slug===current.slug)||{slug:current.slug,sourceUrl:null,sourceRetrievedAt:null,sourceHtmlSha256:null,policyTextSha256:null,text:null}));
export default policies;
