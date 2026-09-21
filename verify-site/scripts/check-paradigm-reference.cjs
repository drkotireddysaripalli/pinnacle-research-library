'use strict';
// Validate published artifacts, independently of the content builders. No build or writes.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const origin='https://pinnacle-verify.saripalli.chatgpt.site';
const publicBase='https://www.pinnacleblooms.org/verify';
const routes=['/evidence/pinnacle-paradigm-shift.html','/evidence/organisation-profile.html'];
const failures=[],stats={pages:0,localTargets:0,faqAnswers:0,sectionNodes:0,priorHomepageIds:0};
const check=(condition,message)=>{if(!condition)failures.push(message);};
const read=relative=>fs.readFileSync(path.join(dist,relative),'utf8');
const decode=value=>String(value).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n]));
const text=value=>decode(value.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1],decode(m[2]??m[3])]));
const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
function parse(html){
 const nodes=[],stack=[];
 for(const match of html.matchAll(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/?([a-z][\w:-]*)\b[^>]*>/gi)){
  if(!match[2])continue;
  const tag=match[2].toLowerCase();
  if(match[0].startsWith('</')){const i=stack.findLastIndex(n=>n.tag===tag);if(i>=0){stack[i].close=match.index;stack[i].end=match.index+match[0].length;stack.splice(i);}continue;}
  const node={tag,attrs:attrs(match[0]),start:match.index,inner:match.index+match[0].length,parent:stack.at(-1),children:[]};
  node.parent?.children.push(node);nodes.push(node);
  if(!voidTags.has(tag)&&!match[0].endsWith('/>'))stack.push(node);
 }
 const ids=new Map();for(const node of nodes)if(node.attrs.id)ids.set(node.attrs.id,node);
 const content=node=>text(html.slice(node.inner,node.close??node.inner));
 const descendants=node=>nodes.filter(n=>n.start>node.start&&(n.end??n.inner)<=(node.close??node.inner));
 const graphs=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const data=JSON.parse(m[1]);return data['@graph']||[data];});
 return {html,nodes,ids,content,descendants,graph:graphs};
}
const cache=new Map();
const pageAt=relative=>{if(!cache.has(relative))cache.set(relative,parse(read(relative)));return cache.get(relative);};
const hasClass=(node,name)=>(node.attrs.class||'').split(/\s+/).includes(name);
const routeFile=route=>route==='/'?'index.html':route.replace(/^\//,'');
function localTarget(href,from,label){
 let url;try{url=new URL(decode(href),origin+from);}catch{check(false,label+' invalid URL: '+href);return;}
 let pathname;
 if(url.origin===origin)pathname=url.pathname;
 else if(url.origin==='https://www.pinnacleblooms.org'&&/^\/verify(?:\/|$)/.test(url.pathname))pathname=url.pathname.replace(/^\/verify/,'')||'/';
 else return;
 const relative=routeFile(decodeURIComponent(pathname)),file=path.resolve(dist,relative);
 check(file.startsWith(dist+path.sep),label+' target escapes dist: '+href);
 if(!file.startsWith(dist+path.sep))return;
 stats.localTargets++;
 if(!fs.existsSync(file)){check(false,label+' missing file: '+href);return;}
 if(url.hash&&relative.endsWith('.html'))check(pageAt(relative).ids.has(decodeURIComponent(url.hash.slice(1))),label+' missing fragment: '+href);
}
function allSourceValues(value,from){
 if(Array.isArray(value)){value.forEach(v=>allSourceValues(v,from));return;}
 if(!value||typeof value!=='object')return;
 for(const [key,item]of Object.entries(value)){
  if(/^(source|sourceHref|sourceHrefs|canonical|url)$/.test(key))for(const href of Array.isArray(item)?item:[item])if(typeof href==='string')localTarget(href,from,'Export '+from);
  allSourceValues(item,from);
 }
}
const cards=JSON.parse(fs.readFileSync(path.join(root,'content/social-images.json'),'utf8')).cards;
const shareIndex=JSON.parse(read('evidence/share-index.json'));
const sitemap=read('sitemap.xml'),llms=read('llms.txt'),fullText=read('llms-full.txt');
const sitemapEntries=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>m[1]);
const sitemapRoutes=sitemapEntries.map(entry=>decode(entry.match(/<loc>([^<]+)<\/loc>/)?.[1]||''));
check(new Set(sitemapRoutes).size===sitemapRoutes.length,'Duplicate sitemap URLs');
const htmlFiles=fs.readdirSync(dist,{recursive:true}).filter(p=>p.endsWith('.html'));
check(sitemapRoutes.length===htmlFiles.length,'Sitemap count differs from generated HTML count');
check(cards.length===htmlFiles.length,'Share-card count differs from generated HTML count');
// Inspect the bundles actually linked by generated pages, not stale asset files.
// The public /verify route rewrites unquoted url(/fonts/...) references.
const stylesheetBundles=new Set(htmlFiles.flatMap(relative=>pageAt(relative).nodes.filter(n=>n.tag==='link'&&n.attrs.rel==='stylesheet'&&/^\/_assets\/[^?]+\.css$/.test(n.attrs.href||'')).map(n=>n.attrs.href)));
check(stylesheetBundles.size>0,'Generated pages must reference a stylesheet bundle');
for(const href of stylesheetBundles){
 const css=read(routeFile(href));
 check(!/url\(\s*['"]\/fonts\//i.test(css),href+' contains quoted root font URLs that the public route cannot rewrite');
}
stats.stylesheetBundles=stylesheetBundles.size;

for(const route of routes){
 const page=pageAt(routeFile(route)),{html,nodes,graph}=page,canonical=origin+route;
 const named=(tag,key,value)=>nodes.filter(n=>n.tag===tag&&n.attrs[key]===value);
 const metadata=name=>named('meta','name',name).concat(named('meta','property',name));
 const canonicals=named('link','rel','canonical');
 check(canonicals.length===1&&canonicals[0].attrs.href===canonical,route+' self-canonical');
 check(nodes.filter(n=>n.tag==='h1').length===1,route+' exactly one H1');
 const titles=nodes.filter(n=>n.tag==='title');check(titles.length===1&&page.content(titles[0]).length>10,route+' meaningful title');
 for(const name of ['description','og:title','og:description','og:url','og:image','og:image:alt','twitter:card','twitter:title','twitter:description','twitter:image'])check(metadata(name).length===1&&metadata(name)[0].attrs.content,route+' unique '+name);
 check(metadata('og:url')[0]?.attrs.content===canonical,route+' Open Graph canonical');
 check(metadata('robots').some(n=>/^index,follow(?:,|$)/.test(n.attrs.content)),route+' indexable robots metadata');
 const ids=nodes.filter(n=>n.attrs.id).map(n=>n.attrs.id);check(ids.length===new Set(ids).size,route+' duplicate HTML IDs');
 const graphIds=graph.map(n=>n['@id']).filter(Boolean);check(graphIds.length===new Set(graphIds).size,route+' duplicate graph IDs');
 const pageNodes=graph.filter(n=>['WebPage','CollectionPage','AboutPage'].includes(n['@type'])&&n.url===canonical);
 check(pageNodes.length===1,route+' exactly one page entity');
 for(const node of nodes)if(node.attrs.href)localTarget(node.attrs.href,route,route);
 const card=cards.find(c=>c.route===route);check(!!card,route+' share-card inventory');
 if(card){
  check(metadata('og:image')[0]?.attrs.content===origin+card.image&&metadata('twitter:image')[0]?.attrs.content===origin+card.image,route+' dedicated social image');
  check(metadata('og:image:width')[0]?.attrs.content==='1200'&&metadata('og:image:height')[0]?.attrs.content==='630',route+' social image dimensions');
  check(fs.existsSync(path.join(dist,card.image)),route+' social image file');
  check(!nodes.some(n=>n.tag==='img'&&n.attrs.src===card.image),route+' share image is not an extra page image');
  const entry=sitemapEntries.find(item=>item.includes('<loc>'+canonical+'</loc>'));check(entry?.includes('<image:loc>'+origin+card.image+'</image:loc>'),route+' sitemap image');
  const sharePage=shareIndex.pages.find(p=>p.url===canonical);check(!!sharePage,route+' share index page');
  for(const item of sharePage?.items||[]){check(item.image===publicBase+card.image,route+' share item image: '+item.id);localTarget(item.url,route,'Share '+item.id);}
  check(sharePage?.items.some(item=>item.id==='page'&&item.url===publicBase+route),route+' canonical page sharing');
  check(nodes.some(n=>n.attrs['data-share-url']===publicBase+route),route+' visible canonical share target');
  check(nodes.some(n=>n.tag==='a'&&hasClass(n,'share-wa')&&new URL(n.attrs.href).searchParams.get('text')?.includes(publicBase+route)),route+' WhatsApp includes canonical target');
 }
 check(sitemapRoutes.includes(canonical),route+' sitemap canonical');
 check(llms.includes(']('+canonical+')'),route+' source-index link');
 const dataFile=routeFile(route).replace(/\.html$/,'.json'),data=JSON.parse(read(dataFile));
 check(data.canonical===canonical,route+' export canonical');allSourceValues(data,route);
 check(fs.existsSync(path.join(dist,routeFile(route).replace(/\.html$/,'.txt'))),route+' text export');
 const faq=graph.find(n=>n['@type']==='FAQPage'),faqSection=page.ids.get('quick-answers');
 check(!!faq&&!!faqSection,route+' visible and structured FAQ');
 const details=faqSection?page.descendants(faqSection).filter(n=>n.tag==='details'&&hasClass(n,'faq-item')):[];
 check(details.length===(faq?.mainEntity||[]).length&&details.length>0,route+' FAQ count matches');
 for(const node of details){
  const summary=node.children.find(n=>n.tag==='summary'),paragraph=page.descendants(node).find(n=>n.tag==='p');
  const question=summary?page.content(summary):'',answer=paragraph?page.content(paragraph):'';
  const matches=(faq?.mainEntity||[]).filter(q=>text(q.name)===question);
  check(matches.length===1,route+' FAQ question matches: '+question);
  check(matches[0]&&text(matches[0].acceptedAnswer?.text||'')===answer,route+' FAQ answer matches: '+question);
  check(matches[0]?.url===canonical+'#'+node.attrs.id,route+' FAQ permalink matches visible answer: '+question);
  stats.faqAnswers++;
 }
 stats.pages++;
}

const paradigm=pageAt(routeFile(routes[0])),stages=JSON.parse(read('evidence/pinnacle-paradigm-shift.json')).stages;
for(const [label,page]of [['homepage',pageAt('index.html')],['paradigm page',paradigm]]){
 const lists=page.nodes.filter(n=>n.tag==='ol'&&hasClass(n,'paradigm-path'));check(lists.length===1,label+' one seven-stage pathway');
 const items=lists[0]?.children.filter(n=>n.tag==='li')||[];check(items.length===7,label+' seven visible stages');
 check(stages.length===7&&stages.every((s,i)=>s.position===i+1),'Seven ordered stage records');
 items.forEach((node,i)=>{const heading=page.descendants(node).find(n=>/^h[2-6]$/.test(n.tag));check(heading&&page.content(heading)===stages[i]?.name,label+' stage order/name '+(i+1));});
}
check(fullText.includes('Seven stages')||stages.every(s=>fullText.includes(s.name)),'Full text includes the connected pathway');
check(fullText.includes('Pinnacle Blooms Network: organisation profile'),'Full text includes organisation profile');
const profile=pageAt(routeFile(routes[1]));
const legal=profile.graph.find(n=>n['@type']==='Organization'&&n.legalName==='Bharath Healthcare Laboratories Private Limited');
const brand=profile.graph.find(n=>n['@type']==='Brand'&&n.name==='Pinnacle Blooms Network');
check(legal&&brand&&legal['@id']!==brand['@id']&&legal.brand?.['@id']===brand['@id'],'Profile legal entity and Brand are distinct and linked');
check(legal?.identifier?.some(n=>n.propertyID==='CIN'&&n.value==='U74999TG2016PTC113063'),'Profile CIN matches legal identity');
check(legal?.identifier?.some(n=>n.propertyID==='LEI'&&n.value==='894500OJYBVC18BUDN89'),'Profile LEI matches legal identity');
check(!(brand?.sameAs||[]).some(url=>url.includes('gleif.org')),'Legal registry identity must not be assigned to the Brand');
const homeShare=shareIndex.pages.find(p=>p.url===origin+'/')?.items.find(i=>i.id==='pinnacle-paradigm-shift');
const paradigmCard=cards.find(c=>c.route===routes[0]);
check(homeShare?.url===publicBase+routes[0]&&homeShare?.image===publicBase+paradigmCard?.image,'Homepage paradigm sharing uses dedicated route and card');

// Check references throughout the built site: reducing section schema must never
// leave a page/section pointing to an omitted disclosure or table row node.
for(const relative of htmlFiles){
 const page=pageAt(relative),byId=new Map(page.graph.map(n=>[n['@id'],n]));
 const ids=page.graph.map(n=>n['@id']).filter(Boolean);check(ids.length===new Set(ids).size,relative+' duplicate graph IDs');
 for(const node of page.graph){
  if(node['@type']==='WebPageElement'){
   stats.sectionNodes++;check(page.ids.get(node.cssSelector?.replace(/^#/,''))?.tag==='section',relative+' section selector: '+node.cssSelector);
   check(byId.has(node.isPartOf?.['@id']),relative+' section parent resolves: '+node['@id']);
   const visited=new Set([node['@id']]);let parent=byId.get(node.isPartOf?.['@id']);
   while(parent?.['@type']==='WebPageElement'){if(visited.has(parent['@id'])){check(false,relative+' section parent cycle');break;}visited.add(parent['@id']);parent=byId.get(parent.isPartOf?.['@id']);}
  }
  if(['WebPageElement','WebPage','CollectionPage','AboutPage'].includes(node['@type']))for(const part of node.hasPart||[]){
   const child=byId.get(part['@id']);check(!!child,relative+' hasPart resolves: '+part['@id']);
   if(child?.['@type']==='WebPageElement')check(child.isPartOf?.['@id']===node['@id'],relative+' reciprocal section relation: '+part['@id']);
  }
 }
}

// Fail explicitly if no baseline can be read; do not silently skip anchor compatibility.
const gitCandidates=[process.env.PINNACLE_GIT,'git',path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe')].filter(Boolean);
let previousHtml,gitUsed,lastError;
for(const git of [...new Set(gitCandidates)])try{
 const options={cwd:root,encoding:'utf8',maxBuffer:8*1024*1024,stdio:['ignore','pipe','pipe']};
 const prefix=execFileSync(git,['rev-parse','--show-prefix'],options).trim();
 previousHtml=execFileSync(git,['show','HEAD:'+prefix+'dist/index.html'],options);gitUsed=path.basename(git);break;
}catch(error){lastError=error;}
if(previousHtml){
 const old=parse(previousHtml),current=pageAt('index.html');
 for(const node of old.nodes.filter(n=>n.attrs.id)){
  let icon=['svg','symbol','use'].includes(node.tag)||/^(truth-|share-icon-)/.test(node.attrs.id);
  for(let parent=node.parent;parent;parent=parent.parent)if(['svg','symbol'].includes(parent.tag))icon=true;
  if(!icon){stats.priorHomepageIds++;check(current.ids.has(node.attrs.id),'Prior homepage ID missing: '+node.attrs.id);}
 }
}else check(false,'Cannot read git HEAD homepage baseline: '+(lastError?.message||'No Git executable'));

console.log(JSON.stringify({pass:failures.length===0,...stats,sitePages:htmlFiles.length,git:gitUsed,failures},null,2));
if(failures.length)process.exitCode=1;
