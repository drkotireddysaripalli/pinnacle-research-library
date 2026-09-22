'use strict';
// Read-only validation of built story pages and actual image headers.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const origin='https://pinnacle-verify.saripalli.chatgpt.site',publicBase='https://www.pinnacleblooms.org/verify';
const overview='/evidence/pinnacle-paradigm-shift.html',failures=[];
const stats={storyPages:0,customCards:0,posters:0,previews:0,socialImages:0,localTargets:0,storyScriptPages:0,sessionActivities:0};
const check=(ok,message)=>{if(!ok)failures.push(message);};
const read=file=>fs.readFileSync(path.join(dist,file),'utf8');
const decode=value=>String(value??'').replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n]));
const plain=value=>decode(value.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1],decode(m[2]??m[3])]));
const hasClass=(node,name)=>(node.attrs.class||'').split(/\s+/).includes(name);
const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
function parse(html){
 const nodes=[],stack=[];
 for(const match of html.matchAll(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/?([a-z][\w:-]*)\b[^>]*>/gi)){
  if(!match[2])continue;const tag=match[2].toLowerCase();
  if(match[0].startsWith('</')){const i=stack.findLastIndex(n=>n.tag===tag);if(i>=0){stack[i].close=match.index;stack[i].end=match.index+match[0].length;stack.splice(i);}continue;}
  const node={tag,attrs:attributes(match[0]),start:match.index,inner:match.index+match[0].length,parent:stack.at(-1),children:[]};node.parent?.children.push(node);nodes.push(node);if(!voids.has(tag)&&!match[0].endsWith('/>'))stack.push(node);
 }
 const ids=new Map(nodes.filter(n=>n.attrs.id).map(n=>[n.attrs.id,n]));
 const descendants=node=>nodes.filter(n=>n.start>node.start&&(n.end??n.inner)<=(node.close??node.inner));
 const text=node=>plain(html.slice(node.inner,node.close??node.inner));
 const graph=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const j=JSON.parse(m[1]);return j['@graph']||[j];});
 return {html,nodes,ids,descendants,text,graph,bodyText:plain(html)};
}
const cache=new Map(),fileFor=route=>route==='/'?'index.html':route.replace(/^\//,'');
const pageAt=route=>{const file=fileFor(route);if(!cache.has(file))cache.set(file,parse(read(file)));return cache.get(file);};
function localFile(href,from,label){
 let url;try{url=new URL(decode(href),origin+from);}catch{check(false,label+' invalid URL: '+href);return null;}
 let pathname;
 if(url.origin===origin)pathname=url.pathname;
 else if(url.origin==='https://www.pinnacleblooms.org'&&/^\/verify(?:\/|$)/.test(url.pathname))pathname=url.pathname.replace(/^\/verify/,'')||'/';
 else return null;
 const relative=fileFor(decodeURIComponent(pathname)),file=path.resolve(dist,relative);stats.localTargets++;
 if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)){check(false,label+' missing local target: '+href);return null;}
 if(url.hash&&relative.endsWith('.html'))check(pageAt(relative).ids.has(decodeURIComponent(url.hash.slice(1))),label+' missing fragment: '+href);
 return file;
}
function headerDimensions(buffer){
 if(buffer.length>=24&&buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20),format:'png'};
 if(buffer[0]===0xff&&buffer[1]===0xd8){
  let p=2;const sof=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
  while(p+4<buffer.length){while(buffer[p]===0xff)p++;const marker=buffer[p++];if(marker===0xd9||marker===0xda)break;if(marker===0x01||(marker>=0xd0&&marker<=0xd8))continue;const size=buffer.readUInt16BE(p);if(size<2||p+size>buffer.length)break;if(sof.has(marker))return {height:buffer.readUInt16BE(p+3),width:buffer.readUInt16BE(p+5),format:'jpeg'};p+=size;}
 }
 if(buffer.subarray(0,4).toString()==='RIFF'&&buffer.subarray(8,12).toString()==='WEBP'){
  for(let p=12;p+8<=buffer.length;){const kind=buffer.subarray(p,p+4).toString(),size=buffer.readUInt32LE(p+4),start=p+8;if(start+size>buffer.length)break;
   if(kind==='VP8X'&&size>=10)return {width:buffer.readUIntLE(start+4,3)+1,height:buffer.readUIntLE(start+7,3)+1,format:'webp'};
   if(kind==='VP8 '&&size>=10)return {width:buffer.readUInt16LE(start+6)&0x3fff,height:buffer.readUInt16LE(start+8)&0x3fff,format:'webp'};
   if(kind==='VP8L'&&size>=5&&buffer[start]===0x2f){const bits=buffer.readUInt32LE(start+1);return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1,format:'webp'};}
   p=start+size+(size%2);
  }
 }
 throw Error('Unsupported or invalid image header');
}
let sharp;try{sharp=require('sharp');}catch{}
const images=new Map();
async function dimensions(file,label){
 if(!file)return null;
 if(!images.has(file))images.set(file,(async()=>{try{return sharp?await sharp(file).metadata():headerDimensions(fs.readFileSync(file));}catch(error){check(false,label+' cannot inspect image: '+error.message);return null;}})());
 return images.get(file);
}
function metadata(page,name){return page.nodes.filter(n=>n.tag==='meta'&&(n.attrs.name===name||n.attrs.property===name));}
async function validatePage(route){
 const page=pageAt(route),canonical=origin+route;
 check(!page.html.includes('[object Object]'),route+' must not contain an unserialized object');
 check(page.nodes.filter(n=>n.tag==='h1').length===1,route+' must have one H1');
 const ids=page.nodes.filter(n=>n.attrs.id).map(n=>n.attrs.id);check(ids.length===new Set(ids).size,route+' duplicate HTML IDs');
 const graphIds=page.graph.map(n=>n['@id']).filter(Boolean);check(graphIds.length===new Set(graphIds).size,route+' duplicate graph IDs');
 const links=page.nodes.filter(n=>n.tag==='link'&&n.attrs.rel==='canonical');check(links.length===1&&links[0].attrs.href===canonical,route+' self-canonical');
 for(const name of ['description','og:title','og:description','og:url','og:image','og:image:width','og:image:height','twitter:image'])check(metadata(page,name).length===1&&metadata(page,name)[0].attrs.content,route+' unique '+name);
 check(metadata(page,'og:url')[0]?.attrs.content===canonical,route+' OG canonical');
 check(metadata(page,'robots').some(n=>/^index,follow(?:,|$)/.test(n.attrs.content)),route+' indexable robots');
 const image=metadata(page,'og:image')[0]?.attrs.content;check(image===metadata(page,'twitter:image')[0]?.attrs.content,route+' social image consistency');
 if(image){const size=await dimensions(localFile(image,route,route+' OG image'),route+' OG image');if(size){check(size.width===Number(metadata(page,'og:image:width')[0]?.attrs.content)&&size.height===Number(metadata(page,'og:image:height')[0]?.attrs.content),route+' OG dimensions must match actual image');check(size.width>=600&&size.height>=315,route+' social image resolution');stats.socialImages++;}}
 for(const node of page.nodes)if(node.attrs.href)localFile(node.attrs.href,route,route);
 return page;
}
async function main(){
 const data=JSON.parse(fs.readFileSync(path.join(root,'content/paradigm-story.json'),'utf8'));
 const assets=JSON.parse(fs.readFileSync(path.join(root,'content/paradigm-story-assets.json'),'utf8')).cards;
 check(data.cards?.length===9,'Exactly nine authored story cards');check(assets?.length===9,'Exactly nine poster manifest entries');
 const routes=data.cards.map(card=>'/evidence/paradigm/'+card.id+'.html');check(new Set(routes).size===9,'Nine unique story routes');
 const exportData=JSON.parse(read('evidence/paradigm-story.json')),exportText=read('evidence/paradigm-story.txt');
 check(exportData.cards?.length===9,'Nine exported story records');check(!exportText.includes('[object Object]'),'Readable story export must not contain an unserialized object');
 const sitemap=read('sitemap.xml'),llms=read('llms.txt');
 for(const [index,card]of data.cards.entries()){
  const route=routes[index],page=await validatePage(route),asset=assets.find(a=>a.id===card.id),exported=exportData.cards.find(c=>c.id===card.id);
  check(!!asset,card.id+' poster manifest entry');if(!asset)continue;
  check(asset.number===index+1&&asset.artKey===card.artKey,card.id+' ordered poster identity');
  const posterFile=localFile(asset.poster,route,card.id+' poster'),previewFile=localFile(asset.preview,route,card.id+' preview');localFile(asset.art,route,card.id+' artwork');
  const poster=await dimensions(posterFile,card.id+' poster'),preview=await dimensions(previewFile,card.id+' preview');
  if(poster){check(poster.format==='jpeg'&&poster.width===1080&&poster.height===1920,card.id+' actual JPEG poster must be 1080 × 1920');check(asset.width===poster.width&&asset.height===poster.height,card.id+' manifest dimensions match poster');stats.posters++;}
  if(preview){check(preview.format==='webp'&&preview.width*16===preview.height*9,card.id+' preview must retain 9:16 aspect ratio');check(preview.width>=270&&preview.width<1080,card.id+' preview should be smaller than full poster');stats.previews++;}
  check(page.nodes.some(n=>n.tag==='a'&&n.attrs.href===asset.poster&&n.attrs.download),route+' actual poster download');
  check(page.nodes.some(n=>n.tag==='img'&&n.attrs.src===asset.preview),route+' poster preview is rendered');
  for(const copy of [card.lead,card.disconnected,card.connected,card.lifeMeaning])check(page.bodyText.includes(plain(copy)),route+' visible card copy is complete');
  for(const id of card.sourceIds){const href='/evidence/records/'+id+'.html';check(page.nodes.some(n=>n.tag==='a'&&n.attrs.href===href),route+' visible source '+id);localFile(href,route,route+' source');}
  check(exported?.canonical===origin+route&&exported?.poster===origin+asset.poster,route+' exported canonical/poster');
  check(sitemap.includes('<loc>'+origin+route+'</loc>'),route+' sitemap discovery');check(llms.includes(']('+origin+route+')'),route+' source-index discovery');
  const pageBars=page.nodes.filter(n=>hasClass(n,'fact-share')&&n.attrs['data-share-url']===publicBase+route);check(pageBars.length>=1,route+' canonical page sharing');
  stats.storyPages++;
 }
 const homePage=await validatePage('/'),finale=await validatePage(overview);
 const approved=JSON.parse(fs.readFileSync(path.join(root,'content/paradigm-finale/story.json'),'utf8'));
 const published=JSON.parse(read('evidence/pinnacle-paradigm-shift.json'));
 const intro=homePage.ids.get('pinnacle-paradigm-story');check(!!intro,'Homepage compact life-first introduction');
 if(intro){
  const inside=homePage.descendants(intro);
  check(intro.attrs['data-share-managed']==='true','Homepage introduction owns its sharing');
  check(homePage.text(intro).includes(plain(approved.headline)),'Homepage approved mission-first headline');
  check(!inside.some(n=>n.attrs['data-story-card']),'Homepage does not duplicate the retired nine-card carousel');
  for(const card of data.cards)for(const suffix of ['', '-title'])check(homePage.ids.has('paradigm-story-card-'+card.id+suffix),'Homepage legacy anchor '+card.id+suffix);
  for(const href of [overview,overview+'#documented-example'])check(inside.some(n=>n.tag==='a'&&n.attrs.href===href),'Homepage story/example destination '+href);
  check(inside.some(n=>n.tag==='a'&&n.attrs.href?.startsWith('https://wa.me/')&&new URL(n.attrs.href).searchParams.get('text')?.includes(publicBase+overview)),'Homepage custom WhatsApp destination');
  const img=inside.find(n=>n.tag==='img');check(img?.attrs.src==='/images/paradigm-finale/moon-600.webp'&&img.attrs.loading==='lazy','Homepage deferred Moon illustration');
 }
 check(approved.cards.length===18&&published.perspectives?.length===18,'Eighteen approved and exported finale perspectives');
 const chapters=finale.nodes.filter(n=>n.tag==='article'&&hasClass(n,'chapter'));
 check(chapters.length===18,'Eighteen indexable finale chapters');
 check(finale.ids.get('complete-story')?.tag==='details','Full story remains available through native disclosure');
 for(const [index,card]of approved.cards.entries()){
  const node=chapters.find(n=>n.attrs.id===card.id);check(!!node,'Finale card '+card.id);if(!node)continue;
  check(node.attrs['data-card']===String(index+1)&&card.number===index+1,'Finale card order '+card.id);
  check(!/\bhidden(?:\s|=|>)/.test(finale.html.slice(node.start,node.inner)),'Finale card static content available without JavaScript '+card.id);
  for(const key of ['title','hook','pinnacle','contrast','punch'])check(finale.text(node).includes(plain(card[key])),'Finale visible '+key+' '+card.id);
  for(const key of ['narration','mechanism','proof'])for(const value of card[key])check(finale.text(node).includes(plain(value)),'Finale preserved '+key+' '+card.id);
  const child=finale.descendants(node),url=publicBase+overview+'#'+card.id;
  for(const source of card.sources)check(child.some(n=>n.tag==='a'&&n.attrs.href===source[1]),'Finale source link '+card.id+' '+source[1]);
  check(JSON.stringify(published.perspectives[index])===JSON.stringify(card),'Finale exported card matches approved source '+card.id);
  const wa=child.find(n=>n.tag==='a'&&n.attrs.href?.startsWith('https://wa.me/')),x=child.find(n=>n.tag==='a'&&n.attrs.href?.startsWith('https://twitter.com/intent/tweet'));
  check(wa&&new URL(wa.attrs.href).searchParams.get('text')?.includes(url),'Finale WhatsApp direct fragment '+card.id);
  check(x&&new URL(x.attrs.href).searchParams.get('url')===url,'Finale X direct fragment '+card.id);
  check(child.some(n=>n.tag==='button'&&n.attrs['data-copy']===String(card.number)),'Finale copy control '+card.id);
  check(child.some(n=>n.tag==='a'&&n.attrs.href==='#'+card.id),'Finale direct card link '+card.id);
  stats.customCards++;
 }
 const example=published.goalSessionExample,sourceExample=require('../content/paradigm-finale/goal-session-example.cjs');
 check(example?.suppliedGoalCount===7&&example.selectedGoals?.length===3&&example.activities?.length===6,'Supplied and selected example counts');
 check(example?.activities?.reduce((sum,a)=>sum+a.minutes,0)===40&&example.sessionMinutes===40&&example.separateFamilyMinutes===5,'Forty-minute plan and separate five-minute handover');
 check(JSON.stringify(example?.selectedGoals)===JSON.stringify(sourceExample.goals)&&JSON.stringify(example?.activities)===JSON.stringify(sourceExample.activities),'Published example equals anonymised approved excerpts');
 const exampleNode=finale.ids.get('documented-example'),timeline=finale.ids.get('session-timeline');check(!!exampleNode&&!!timeline,'Visible supplied goal/session example');
 const activities=timeline?finale.descendants(timeline).filter(n=>n.attrs['data-activity-goal']):[];check(activities.length===6,'Six visible session activities');
 for(const [i,activity]of (example?.activities||[]).entries()){
  const node=activities[i];check(node?.attrs.href==='#goal-panel-'+activity.goal&&node.attrs['data-activity-goal']===activity.goal,'Activity-to-goal link '+(i+1));
  check(node&&finale.text(node).includes(activity.name)&&node.attrs['aria-label']?.includes(activity.minutes+' minutes'),'Visible activity name and duration '+(i+1));stats.sessionActivities++;
 }
 for(const goal of example?.selectedGoals||[]){
  const node=finale.ids.get('goal-panel-'+goal.id);check(!!node,'Goal panel '+goal.id);
  check(activities.filter(n=>n.attrs['data-activity-goal']===goal.id).length===2,'Two activities for selected goal '+goal.id);
  check(goal.steps.map(s=>s[0]).join(',')==='10%,25%,45%,70%,90%,100%','Preserved plan milestone labels '+goal.id);
  for(const [label,value]of goal.steps)check(node&&finale.text(node).includes(label)&&finale.text(node).includes(plain(value)),'Visible planning criterion '+goal.id+' '+label);
 }
 check(exampleNode&&finale.text(exampleNode).includes('not completed-session feedback, observed progress or a promised result'),'Example keeps planning-versus-result boundary');
 for(const file of [fileFor(overview),'evidence/pinnacle-paradigm-shift.json','evidence/pinnacle-paradigm-shift.txt','llms.txt','llms-full.txt'])check(!/Vishwanath|VISH-[A-Z0-9]|72742/i.test(read(file)),'Private example identifiers excluded from '+file);
 for(const card of approved.cards)check(plain(read('evidence/pinnacle-paradigm-shift.txt')).includes(plain(card.pinnacle)),'Full-text finale claim '+card.id);
 check(llms.includes(origin+overview+'#documented-example'),'Source index links to supplied example');
 for(const img of finale.nodes.filter(n=>n.tag==='img')){
  const file=localFile(img.attrs.src,overview,'Finale image');const size=await dimensions(file,'Finale image');check(!!size,'Finale image is inspectable '+img.attrs.src);
  if(img.attrs.srcset)for(const entry of img.attrs.srcset.split(','))localFile(entry.trim().split(/\s+/)[0],overview,'Finale responsive image');
 }
 const home=pageAt('/'),hero=home.nodes.find(n=>n.tag==='section'&&hasClass(n,'world-intro')),deck=home.ids.get('pinnacle-paradigm-story'),scale=home.ids.get('scale-for-every-child');
 check(hero&&deck&&scale&&hero.end<=deck.start&&deck.end<=scale.start,'Homepage order must be hero → compact life-first story → scale');
 const jump=home.nodes.find(n=>n.tag==='nav'&&hasClass(n,'reading-jump-bar'));
 check(jump&&home.descendants(jump).some(n=>n.tag==='a'&&n.attrs.href==='#reading-journey'&&home.text(n)==='Journey'),'Reading navigation retains Journey label and destination');
 const files=fs.readdirSync(dist,{recursive:true}).filter(f=>f.endsWith('.html'));
 const scriptPages=[],globalDefinitions=new Map();
 for(const file of files){const page=pageAt(file);for(const node of page.graph)if(node['@id'])globalDefinitions.set(node['@id'],node);
  const scripts=[...page.html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].map(m=>decode(m[1])).filter(src=>/\/finale(?:\.[a-f0-9]{16})?\.js$/.test(src));
  if(scripts.length){scriptPages.push(file.replaceAll('\\','/'));check(scripts.length===1,file+' one finale script');check(/^\/_assets\/finale\.[a-f0-9]{16}\.js$/.test(scripts[0]),file+' fingerprinted finale script');const scriptFile=localFile(scripts[0],'/'+file.replaceAll('\\','/'),file+' finale script');if(scriptFile)try{new Function(fs.readFileSync(scriptFile,'utf8'));}catch(error){check(false,file+' invalid finale script: '+error.message);}}
 }
 check(JSON.stringify(scriptPages.sort())===JSON.stringify([fileFor(overview)]),'Finale script must load only on its complete story page');stats.storyScriptPages=scriptPages.length;
 for(const route of ['/',overview,...routes]){
  const page=pageAt(route),local=new Map(page.graph.map(n=>[n['@id'],n]));
  for(const node of page.graph){
   if(node.isPartOf?.['@id'])check(globalDefinitions.has(node.isPartOf['@id']),route+' schema parent resolves: '+node.isPartOf['@id']);
   for(const part of node.hasPart||[])check(globalDefinitions.has(part['@id']),route+' schema part resolves: '+part['@id']);
   if(node['@type']==='WebPageElement'){check(local.has(node.isPartOf?.['@id']),route+' section parent is local');check(page.ids.has(node.cssSelector?.replace(/^#/,'')),route+' section selector resolves');}
   for(const property of ['mainEntityOfPage','mainEntity','primaryImageOfPage','publisher'])if(node[property]?.['@id'])check(globalDefinitions.has(node[property]['@id']),route+' '+property+' resolves: '+node[property]['@id']);
  }
 }
 console.log(JSON.stringify({pass:failures.length===0,...stats,imageInspection:sharp?'sharp':'JPEG/PNG/WebP headers',sitePages:files.length,failures},null,2));
 if(failures.length)process.exitCode=1;
}
main().catch(error=>{console.error(JSON.stringify({pass:false,error:error.message},null,2));process.exitCode=1;});
