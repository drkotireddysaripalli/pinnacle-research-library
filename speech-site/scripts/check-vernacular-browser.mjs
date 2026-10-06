// Isolated presentation review of real public HTML. No sign-in, lead, or purchase.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import {VERNACULAR_STYLE,ANEK_SCRIPTS} from '../deployment/vernacular-typography.mjs';
const out='audits/vernacular-20261006';await fs.mkdir(out,{recursive:true});
const rows=[['books-te','https://www.pinnacleblooms.org/books/te'],['books-hi','https://www.pinnacleblooms.org/books/hi'],...['telugu','hindi','tamil','kannada','malayalam','marathi'].map(x=>['faq-'+x,'https://www.pinnacleblooms.org/faq/'+x]),['ask-te','https://pinnacleblooms.org/ask/te'],['speech-en','https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate']];
const texts={te:'మీ బిడ్డ పూర్తి నమ్మకంతో',hi:'आपके बच्चे का विकास',bn:'শিশুর বিকাশ',pa:'ਬੱਚੇ ਦਾ ਵਿਕਾਸ',gu:'બાળકનો વિકાસ',or:'ଶିଶୁର ବିକାଶ',ta:'குழந்தையின் வளர்ச்சி',kn:'ಮಗುವಿನ ಬೆಳವಣಿಗೆ',ml:'കുട്ടിയുടെ വളർച്ച'};
const pages=await Promise.all(rows.map(async([id,url])=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);const html=await r.text();await fs.writeFile(path.join(out,id+'-source.html'),html);return{id,url,html};}));
pages.push({id:'nine-script-proof',url:'https://www.pinnacleblooms.org/',html:'<html lang="en"><head></head><body style="padding:24px;background:white;color:#183052"><main>'+Object.entries(texts).map(([lang,text])=>`<section lang="${lang}"><h1>${text}</h1><p>${text}</p><button>${text}</button></section>`).join('')+'</main></body></html>'});
const report={at:new Date().toISOString(),scope:'Isolated public HTML with candidate typography; scripts and sign-in dialog excluded from presentation-only fixtures. Does not test authentication.',results:[]};
for(const [name,engine,width] of [['chromium-phone',chromium,390],['chromium-tablet',chromium,768],['chromium-desktop',chromium,1440],['webkit-phone',webkit,390]]){
 let browser;try{browser=await engine.launch({headless:true});}catch(e){report.results.push({engine:name,status:'skipped',reason:e.message.slice(0,140)});continue;}
 try{const page=await browser.newPage({viewport:{width,height:1000}});
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname.startsWith('/verify/fonts/')){const file=path.join('../verify-site/dist/fonts',path.basename(url.pathname));return route.fulfill({body:await fs.readFile(file),contentType:'font/woff2',headers:{'access-control-allow-origin':'*'}});}
  if(route.request().resourceType()==='script')return route.abort();
  return route.continue();
 });
 for(const row of pages){
  if(name==='chromium-tablet'&&!['books-te','books-hi','faq-tamil','nine-script-proof'].includes(row.id))continue;
  if(name==='webkit-phone'&&!['books-te','books-hi','faq-malayalam','nine-script-proof'].includes(row.id))continue;
  const html=row.html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<dialog\b[^>]*>[\s\S]*?<\/dialog>/gi,'').replace(/<style data-pinnacle-vernacular="[^"]+">[\s\S]*?<\/style>/g,'').replace(/<head(\s[^>]*)?>/i,`<head><base href="${row.url}">`).replace('</head>',`${VERNACULAR_STYLE}</head>`);
  await page.goto('about:blank');await page.setContent(html,{waitUntil:'networkidle',timeout:45000});await page.evaluate(()=>document.fonts.ready);
  const result=await page.evaluate(()=>{const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;const native=/[\u0900-\u0D7F]/;const els=[...document.querySelectorAll('main :is(h1,h2,h3,p,a,button),section[lang] :is(h1,p,button)')].filter(e=>native.test(e.textContent)&&visible(e));return{lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,typography:els.slice(0,45).map(e=>{const s=getComputedStyle(e);return{tag:e.tagName,text:e.textContent.trim().slice(0,65),font:s.fontFamily,weight:s.fontWeight,lineHeight:s.lineHeight,spacing:s.letterSpacing};}),loaded:[...document.fonts].filter(x=>x.status==='loaded').map(x=>({family:x.family,weight:x.weight,range:x.unicodeRange})),englishHeading:getComputedStyle(document.querySelector('h1')||document.body).fontFamily};});
  const item={page:row.id,engine:name,width,...result};report.results.push(item);
  if(result.overflow>1){await page.screenshot({path:path.join(out,'failure.png')});console.log(JSON.stringify(await page.evaluate(()=>({styles:[...document.styleSheets].map(s=>s.href),wide:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().width>innerWidth).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,w:e.getBoundingClientRect().width}))}))));}assert(result.overflow<=1,row.id+' overflow '+result.overflow);
  if(row.id==='nine-script-proof')assert.equal(result.loaded.filter(x=>x.family==='Pinnacle Anek').length,9,'All nine real font files must load');
  if(row.id!=='speech-en'){
   assert(result.typography.length>0,row.id+' missing native text');
   assert(result.typography.every(x=>/Pinnacle Anek|Sintony/.test(x.font)),row.id+' wrong font');
   assert(result.typography.filter(x=>/^H\d$/.test(x.tag)).every(x=>x.weight==='800'),row.id+' heading weight');
  }else assert(result.englishHeading.includes('Sintony'),'Approved English heading must retain Sintony');
  if(['books-te','books-hi','faq-tamil','faq-malayalam','nine-script-proof'].includes(row.id)){
   if(row.id!=='nine-script-proof')await page.locator('main').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(out,name+'-'+row.id+'.png'),fullPage:row.id==='nine-script-proof'});
  }
  item.status='passed';console.log(JSON.stringify({page:row.id,engine:name,status:item.status}));
 }
 }finally{await browser.close();}
}
await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
