import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {parse} from 'parse5';
import {storePaths,storeRowForPath,STORE_CHOICE_RELEASE} from '../deployment/book-store-choices.mjs';
const nodes=html=>{const out=[];function walk(n){out.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));return out;};
const attrs=n=>Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
const origin='https://www.pinnacleblooms.org',rows=[],pending=[...storePaths];
const before=JSON.parse(await fs.readFile('ask-private/book-store-choices-20261009/public-before.json','utf8'));
const previousLinks=new Map(before.map(row=>[row.path,nodes(row.html).filter(n=>n.tagName==='a').map(n=>attrs(n).href)]));
await Promise.all(Array.from({length:4},async()=>{while(pending.length){const path=pending.shift();try{
 const r=await fetch(origin+path,{signal:AbortSignal.timeout(30000)}),html=await r.text(),all=nodes(html),links=all.filter(n=>n.tagName==='a').map(attrs),panels=all.filter(n=>attrs(n)['data-store-choices']).map(attrs),row=storeRowForPath(path);
 assert.equal(r.status,200);assert.equal(r.headers.get('x-pinnacle-store-choices'),STORE_CHOICE_RELEASE);
 assert(all.some(n=>n.tagName==='link'&&attrs(n).rel==='canonical'&&attrs(n).href===origin+path));
 assert(panels.length>0);if(row){assert(panels.some(a=>a['data-store-choices']===row.sku));assert(links.some(a=>a.href==='/shop/cart?cart_sku='+row.sku+'&quantity=1'));assert(links.some(a=>a.href===row.play));}
 else assert.equal(panels.length,11,path+' must expose all 11 discovery offers');
 assert(links.some(a=>a.href==='tel:+919100181181'));for(const href of previousLinks.get(path)||[])assert(links.some(a=>a.href===href),path+' lost destination '+href);
 for(const script of all.filter(n=>n.tagName==='script'&&attrs(n).type==='application/ld+json'))JSON.parse(script.childNodes.map(n=>n.value||'').join(''));
 rows.push({path,url:origin+path,status:r.status,storePanels:panels.length,etag:r.headers.get('etag'),sha256:crypto.createHash('sha256').update(html).digest('hex'),result:'pass'});
 }catch(e){rows.push({path,url:origin+path,result:'fail',error:e.message});}}}));
rows.sort((a,b)=>a.path.localeCompare(b.path));
const receipt={at:new Date().toISOString(),release:STORE_CHOICE_RELEASE,total:rows.length,passed:rows.filter(r=>r.result==='pass').length,failed:rows.filter(r=>r.result==='fail').length,priorDestinationComparisons:before.length,rows,limits:'Public HTML and exact links verified. No cart, purchase, analytics conversion, sign-in, call or customer record created. Marketplace stock/delivery and search indexing are separate.'};
await fs.writeFile('deployment/book-store-choices-public-20261009.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({total:receipt.total,passed:receipt.passed,failed:rows.filter(r=>r.result==='fail')}));if(receipt.failed)process.exitCode=1;
