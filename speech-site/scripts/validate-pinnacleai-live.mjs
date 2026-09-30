import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {PINNACLEAI_PATHS} from '../deployment/speech-handler.mjs';

const origin='https://www.pinnacleblooms.org';
const staged=path.resolve(process.argv[2]||'release-pinnacleai-wave-20260930');
const output=path.resolve(process.argv[3]||'deployment/pinnacleai-wave-live-20260930.json');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const get=(url,options={})=>fetch(url,{headers:{'cache-control':'no-cache',...(options.headers||{})},redirect:options.redirect||'follow'});
const pages=[];

for(const route of PINNACLEAI_PATHS){
 const response=await get(origin+route,{headers:{accept:'text/html'}});
 assert.equal(response.status,200,route+' HTML');
 assert(response.headers.get('content-type')?.includes('text/html'),route+' HTML type');
 const html=await response.text();
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
 const social=html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
 const hero=html.match(/<figure class="wave2-hero-art">\s*<img[^>]*\bsrc="([^"]+)"/i)?.[1];
 assert.equal(canonical,origin+route,route+' canonical');
 assert(social?.startsWith(origin+'/pinnacle-pages-assets/'),route+' social image');
 assert(hero?.startsWith('/pinnacle-pages-assets/'),route+' editorial image');
 assert(html.includes('portal-header')&&html.includes('portal-footer'),route+' shared shell');
 assert.equal((html.match(/<main\b/g)||[]).length,1,route+' one main');
 assert(html.includes('tel:+919100181181'),route+' call');
 assert(html.includes('application/ld+json'),route+' schema');
 const imagePath=new URL(social).pathname;
 const imageResponse=await get(social);
 const image=Buffer.from(await imageResponse.arrayBuffer());
 const stagedImage=await readFile(path.join(staged,imagePath.slice(1)));
 assert.equal(imageResponse.status,200,route+' social HTTP');
 assert.equal(imageResponse.headers.get('content-type'),'image/jpeg',route+' social MIME');
 assert.equal(sha(image),sha(stagedImage),route+' social bytes');
 const heroResponse=await get(origin+hero);
 const heroImage=Buffer.from(await heroResponse.arrayBuffer());
 assert.equal(heroResponse.status,200,route+' editorial HTTP');
 assert(heroResponse.headers.get('content-type')?.includes('image/webp'),route+' editorial MIME');
 assert.equal(sha(heroImage),sha(await readFile(path.join(staged,hero.slice(1)))),route+' editorial bytes');
 const slug=route.slice(1);
 const exports=[];
 for(const extension of ['json','txt']){
  const asset='/pinnacle-pages-data/'+slug+'-sources.'+extension;
  const source=await get(origin+asset);
  const bytes=Buffer.from(await source.arrayBuffer());
  assert.equal(source.status,200,asset);
  assert.equal(sha(bytes),sha(await readFile(path.join(staged,asset.slice(1)))),asset+' bytes');
  if(extension==='json'){
   const sourceMap=JSON.parse(bytes.toString('utf8'));
   assert(Array.isArray(sourceMap.claimSourceMap)&&sourceMap.claimSourceMap.length>=3,asset+' claim/source map');
  }
  exports.push(asset);
 }
 const markdown=await get(origin+route,{headers:{accept:'text/markdown'}});
 const md=Buffer.from(await markdown.arrayBuffer());
 assert.equal(markdown.status,200,route+' Markdown');
 assert(markdown.headers.get('content-type')?.includes('text/markdown'),route+' Markdown MIME');
 assert.equal(sha(md),sha(await readFile(path.join(staged,'pinnacle-pages-data',slug+'-reading.md'))),route+' Markdown bytes');
 pages.push({route,status:response.status,canonical,social:imagePath,socialBytes:image.length,socialSha256:sha(image),editorial:hero,editorialBytes:heroImage.length,editorialSha256:sha(heroImage),exports,markdownBytes:md.length});
}
assert.equal(new Set(pages.map(page=>page.social)).size,PINNACLEAI_PATHS.length,'distinct social images');

const aliases=[];
for(const [oldRoute,newRoute] of [['/pinnacle-ai','/pinnacleai'],['/ability-score','/abilityscore'],...PINNACLEAI_PATHS.map(route=>[route+'/',route])]){
 const response=await get(origin+oldRoute+'?ref=validation',{redirect:'manual'});
 assert.equal(response.status,301,oldRoute+' redirect');
 assert.equal(response.headers.get('location'),origin+newRoute+'?ref=validation',oldRoute+' destination');
 aliases.push({oldRoute,newRoute,status:response.status});
}
const discovery=[];
for(const route of ['/pinnacleai/sitemap.xml','/pinnacleai/llms.txt','/sitemap.xml','/llms.txt','/robots.txt','/verify/','/verify/evidence/records/fsc.html','/national-autism-helpline']){
 const response=await get(origin+route);
 assert.equal(response.status,200,route+' protected or discovery route');
 const body=await response.text();
 if(route==='/pinnacleai/sitemap.xml')for(const page of pages)assert(body.includes(origin+page.route),page.route+' in product sitemap');
 if(route==='/sitemap.xml')assert(body.includes(origin+'/pinnacleai/sitemap.xml'),'product sitemap in root');
 discovery.push({route,status:response.status,contentType:response.headers.get('content-type')});
}
const originControls=[];
for(const route of ['/abilityscore-global-study','/therapeuticai-effectiveness-study','/pinnacle-ai-innovations-revolutionizing-autism-history']){
 const response=await get(origin+route);
 const html=await response.text();
 assert.equal(response.status,200,route+' origin page');
 assert(!html.includes('wave-page'),route+' must not be replaced by product wave');
 originControls.push({route,status:response.status,managedWave:false});
}
const receipt={checkedAt:new Date().toISOString(),pages,aliases,discovery,originControls,meaning:'Public delivery, source and social bytes verified; search indexing and AI citation are separate observations.'};
await writeFile(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({pages:pages.length,aliases:aliases.length,discovery:discovery.length,originControls:originControls.length,status:'passed',output}));
