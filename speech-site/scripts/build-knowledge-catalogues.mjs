// Reproducible import of public legacy content. No production database writes.
// Input is the owner's read-only PlanetScale export plus the public archive captures.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse,parseFragment,serialize} from 'parse5';
import {marked} from 'marked';
import sanitize from 'sanitize-html';
const input=path.resolve(process.argv[2]||'../../pinnacle-growth-system/faq-sunshine-20261005');
const output=path.resolve('ask-public/knowledge-data');
await fs.mkdir(output,{recursive:true});
const read=async name=>JSON.parse(await fs.readFile(path.join(input,name),'utf8'));
const write=async(name,value)=>fs.writeFile(path.join(output,name+'.json'),JSON.stringify(value));
const text=value=>{const doc=parse(sanitize(String(value||''),{allowedTags:[],allowedAttributes:{}}));let result='';const visit=n=>{if(n.nodeName==='#text')result+=n.value;n.childNodes?.forEach(visit);};visit(doc);return result.replace(/\s+/g,' ').trim();};
const safeURL=(value,base='https://www.pinnacleblooms.org')=>{try{const u=new URL(value,base);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
const safeLink=value=>/^tel:9100181181$/i.test(String(value||''))?'tel:+919100181181':/^(?:tel:\+?[\d ()-]{7,25}|mailto:[^\s<>]+@[^\s<>]+)$/i.test(String(value||''))?value:safeURL(value);
// Legacy answers contain authored line breaks inside raw <p> HTML. Preserve
// those breaks; Markdown's breaks option applies only to Markdown paragraphs.
const preserveLines=html=>{const doc=parseFragment(html);const visit=n=>{if(n.tagName==='p')n.childNodes=n.childNodes.flatMap(c=>c.nodeName==='#text'?c.value.split('\n').flatMap((part,i)=>[...(i?[{nodeName:'br',tagName:'br',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[],childNodes:[],parentNode:n}]:[]),{nodeName:'#text',value:(i?'\n':'')+part,parentNode:n}]):[c]);n.childNodes?.forEach(visit);};visit(doc);return serialize(doc);};
const categories=await read('faq-categories-source.json');
const slugs=Object.fromEntries(categories.filter(c=>c.Language==='english').map(c=>[c.ShortCode,c.Category]));
// These source categories lack category-table entries but have published URLs.
Object.assign(slugs,{AUTISM:'autism',SE:'special-education'});
const langs={english:'en',telugu:'te',hindi:'hi',tamil:'ta',kannada:'kn',malayalam:'ml',marathi:'mr'};
const rows=await read('faq-all-source.json');
assert.equal(rows.length,4564,'Reconcile a changed source inventory before importing');
const index=[];const bySlug=new Map();const claimCorrections=[];
for(const source of rows){
 const category=slugs[source.Category];assert(category,'Unknown category '+source.Category);
 assert(/^[a-zA-Z0-9_-]+$/.test(source.Slug),'Unexpected source slug '+source.Id);
 const url='/faq/'+source.Language+'/'+category+'/'+source.Slug;
 let answer=String(source.Answer||'').replaceAll("''","'");
 if(source.Language==='english'){
  const old=answer;
  answer=answer.replace(/world[’']s greatest/gi,'experienced').replace(/patented technology/gi,'technology');
  if(old!==answer)claimCorrections.push({id:source.Id,url,reason:'Remove unsupported superlative or patent-grant implication'});
 }
 const html=sanitize(marked.parse(answer,{breaks:true}),{allowedTags:['p','br','strong','b','em','i','u','ul','ol','li','h2','h3','h4','blockquote','a','table','thead','tbody','tr','th','td'],allowedAttributes:{a:['href','title'],th:['scope']},allowedSchemes:['https','http','tel','mailto'],transformTags:{a:(_tag,a)=>({tagName:'a',attribs:{...(safeLink(a.href)?{href:safeLink(a.href)}:{}),...(a.title?{title:a.title}:{})}})}});
 const item={id:source.Id,language:source.Language,lang:langs[source.Language],category,categoryCode:source.Category,slug:source.Slug,url,title:text(source.Question),metaTitle:text(source.MetaTitle)||text(source.Question),description:text(source.MetaDescription)||text(answer).slice(0,200),image:safeURL(source.ImageURL||''),video:/^[\w-]{11}$/.test(source.YTId||'')?source.YTId:null,published:source.CDT?.slice(0,10),hasImprovementClaim:/97\s*%/.test(answer)};
 // Empty source image is not the home-page URL.
 if(!source.ImageURL)item.image=null;
 assert(item.title&&text(html),'Missing published answer');
 index.push(item);await write('faq-'+source.Language+'-'+source.Id,{...item,html:preserveLines(html),text:text(html)});
 const equivalents=bySlug.get(item.slug)||[];equivalents.push({lang:item.lang,url:item.url,language:item.language});bySlug.set(item.slug,equivalents);
}
for(const item of index){const group=bySlug.get(item.slug);item.alternates=group.filter(x=>group.filter(y=>y.lang===x.lang).length===1);}
await write('faq-index',index);
await write('faq-categories',categories.map(c=>({language:c.Language,slug:c.Category,code:c.ShortCode,label:c.DisplayName,title:c.DisplayTitle,description:c.DisplayDescription})));

// Sunshine: link only records matched to an actual published archive link.
const sunshine=await read('sunshine-source.json');
const doc=parse(await fs.readFile(path.join(input,'live-sunshine.html'),'utf8'));
const published=new Set();
function walk(node){if(node.tagName==='a'){const href=node.attrs.find(a=>a.name==='href')?.value;try{const u=new URL(href,'https://www.pinnacleblooms.org');if(u.hostname==='www.pinnacleblooms.org')published.add(u.pathname);}catch{}}node.childNodes?.forEach(walk)}walk(doc);
const prefixes={CONDITION:'c',BEHAVIOR:'b',MILESTONE:'m',TECHNIQUE:'t',MATERIAL:'ma',ASSESSMENT:'a',ABILITYASSESSMENT:'abs',ABILITIES:'abilities',SKILLS:'skills'};
const sunIndex=[];
for(const row of sunshine){
 const prefix=prefixes[row.Type];if(!prefix)continue;
 let slug;try{slug=new URL(row.URL).pathname.split('/').filter(Boolean).at(-1);}catch{continue;}
 const url='/'+prefix+'/'+slug;if(!published.has(url))continue;
 let data;try{const parsed=JSON.parse(row.Response);data=parsed.PinnacleBloomsNetwork||parsed;}catch{continue;}
 const synopsis=text(data.forparentsfamilies?.what||data.forparentsfamilies?.synopsis||data.seo?.htmldescription);
 sunIndex.push({id:row.Id,url,title:text(row.Name),type:row.Type,description:synopsis.slice(0,260),image:row.ImgURL?safeURL(row.ImgURL):null});
}
await write('sunshine-index',[...new Map(sunIndex.map(x=>[x.url,x])).values()]);
// Mirracles is an existing public video archive. Keep its titles and exact URLs;
// no private child data, new outcome claims or testimonials are imported.
const mirracles=await read('mirracles-public-links.json');
const stories=mirracles.filter(x=>/^\/mirracles\/\d+\/[^?#]+$/.test(x.url)).map(x=>({...x,title:text(x.title)||text(decodeURIComponent(x.url.split('/').at(-1)).replaceAll('-',' ')),image:x.image?safeURL(x.image):null}));
const unique=[...new Map(stories.map(x=>[x.url,x])).values()];
for(let i=0;i<unique.length;i+=1000)await write('mirracles-'+Math.floor(i/1000),unique.slice(i,i+1000));
await write('manifest',{version:'20261005-knowledge-v1',faqCount:index.length,sunshineCount:new Set(sunIndex.map(x=>x.url)).size,mirraclesCount:unique.length,mirraclesChunkSize:1000,languages:langs,source:'Public PlanetScale FAQ records and existing public Sunshine/Mirracles archives',importedAt:new Date().toISOString()});
await fs.writeFile(path.join(input,'import-report.json'),JSON.stringify({faq:index.length,sunshine:new Set(sunIndex.map(x=>x.url)).size,mirracles:unique.length,claimCorrections,sourceOnlySunshineRows:sunshine.length-sunIndex.length},null,2));
console.log(JSON.stringify({faq:index.length,sunshine:new Set(sunIndex.map(x=>x.url)).size,mirracles:unique.length,claimCorrections:claimCorrections.length}));
