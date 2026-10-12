// Deterministic checkpointed public-fixture proof; never sends an enquiry.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {parse} from 'parse5';import {LegacyIndentationCompactor} from '../deployment/legacy-social-metadata/compact.mjs';
const dir=process.env.LEGACY_PROOF_DIR||'outputs/legacy-markup-performance-20261012';
const save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n'),hash=x=>createHash('sha256').update(x).digest('hex');
await fs.mkdir(dir+'/before',{recursive:true});await fs.mkdir(dir+'/after',{recursive:true});
const cohort=JSON.parse(await fs.readFile(dir+'/cohort.json','utf8'));
assert.equal(cohort.uniqueUrls,1533);
for(const u of cohort.urls)assert(/^\/(?:ma|skills|abilities|b|c|t|m|abs|a)\/[^/]+\/?$/.test(new URL(u).pathname),u);
export function signature(html){
 const scripts=[],styles=[],links=[],forms=[],headings=[],text=[],elements=[];
 function walk(n){
  if(n.nodeName==='#text'){if(n.value.trim()&& !['script','style'].includes(n.parentNode?.tagName))text.push(n.value);return;}
  if(n.tagName){elements.push({tag:n.tagName,attrs:n.attrs});if(n.tagName==='script'||n.tagName==='style'){const x=hash((n.childNodes||[]).map(x=>x.value||'').join(''));(n.tagName==='script'?scripts:styles).push({attrs:n.attrs,hash:x});}if(n.tagName==='a')links.push(n.attrs);if(['form','input','select','option','textarea','button'].includes(n.tagName))forms.push({tag:n.tagName,attrs:n.attrs});if(/^h[1-6]$/.test(n.tagName))headings.push({tag:n.tagName,attrs:n.attrs});}
  for(const c of n.childNodes||[])walk(c);if(n.content)walk(n.content);
 }walk(parse(html));return{scripts,styles,links,forms,headings,text,elements};
}
const observations=[];
for(const [family,url]of Object.entries(cohort.families)){
 const file=dir+'/before/'+family+'.html';let input;
 try{input=await fs.readFile(file,'utf8');}catch{const r=await fetch(url,{signal:AbortSignal.timeout(45000)});assert.equal(r.status,200,url);input=await r.text();await fs.writeFile(file,input);await save(dir+'/before/'+family+'.receipt.json',{url,status:r.status,finalUrl:r.url,headers:Object.fromEntries(r.headers),at:new Date().toISOString(),sha256:hash(input)});}
 const c=new LegacyIndentationCompactor();let output='';for(let i=0;i<input.length;i+=16384)output+=c.push(input.slice(i,i+16384));output+=c.push('',true);
 assert.deepEqual(signature(output),signature(input),'Meaning/content/attributes changed '+family);
 const beforeBytes=Buffer.byteLength(input),afterBytes=Buffer.byteLength(output);assert(afterBytes<beforeBytes*.85,'Insufficient shared byte reduction '+family);
 await fs.writeFile(dir+'/after/'+family+'.html',output);
 const s=signature(input);observations.push({family,url,beforeBytes,afterBytes,savedBytes:beforeBytes-afterBytes,reductionPercent:Math.round((1-afterBytes/beforeBytes)*10000)/100,beforeGzipBytes:gzipSync(input).length,afterGzipBytes:gzipSync(output).length,gzipKind:'local same-setting estimate; not observed wire bytes',links:s.links.length,formsAndControls:s.forms.length,scripts:s.scripts.length,styles:s.styles.length,semanticSignatureEqual:true,beforeSha256:hash(input),afterSha256:hash(output)});
}
const proof={at:new Date().toISOString(),cohortUniqueUrls:cohort.uniqueUrls,scope:'nine current public fixtures plus complete saved-cohort selector coverage; not 1533 live fetches or vendor clearance',observations};await save(dir+'/fixture-proof.json',proof);console.log(JSON.stringify(proof,null,2));
