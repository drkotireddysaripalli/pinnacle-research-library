const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{chromium}=require('playwright');
const phase=process.argv[2]||'local',stage='release-navigation-v134a-final-20261001',previous='release-centre-batch-v134-final-20261001',origin=phase==='live'?'https://www.pinnacleblooms.org':'http://127.0.0.1:4338';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),main=s=>s.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
const base='https://www.pinnacleblooms.org',aba='/best-aba-therapy-center-india-proven-improvement-rate';
const replacements=[
['/aba-therapy#what-section',aba+'#service-fit'],
['/aba-therapy#why-section',aba+'#pinnacle-difference'],
['/aba-therapy#Advantages-section',aba+'#everyday-example'],
['/aba-therapy#ChildrenServices-section',aba+'#integrated-support'],
['/aba-therapy#adultservices-section','/contact-national-autism-helpline-24-7'],
['/contact-national-autism-helpline-24-7#vijayawada','/contact-national-autism-helpline-24-7#Vijayawada'],
['/contact-national-autism-helpline-24-7#vanasthalipuram','/contact-national-autism-helpline-24-7#Vanasthalipuram'],
['/contact-national-autism-helpline-24-7#gachibowli','/contact-national-autism-helpline-24-7#Gachibowli'],
['/verify/#organization','/verify/#chapter-identity']
];
const bodies=[];
for(const file of fs.readdirSync(stage+'/pinnacle-pages-html').filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(stage+'/pinnacle-pages-html/'+file,'utf8');if(html.includes('noindex, nofollow'))continue;
 const before=fs.readFileSync(previous+'/pinnacle-pages-html/'+file,'utf8');assert.equal(sha(main(html)),sha(main(before)),file+' body');
 const shell=html.match(/<header\b[\s\S]*?<\/header>/)[0]+html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
 for(const[old,next]of replacements){assert(!shell.includes('href="'+base+old+'"'),file+' old '+old);assert(shell.includes('href="'+base+next+'"'),file+' next '+next);}
 bodies.push({file,acceptedMainSha256:sha(main(html)),nineSharedLinksCorrected:true});
}
assert.equal(bodies.length,29);
const launched=[];
(async()=>{
 const cases=[];
 for(const channel of ['chrome','msedge']){
  const browser=await chromium.launch({channel,headless:true});launched.push(browser);
  for(const width of [390,1440]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+(phase==='live'?'/top-speech-therapy-center-india-proven-improvement-rate':'/'),{waitUntil:'networkidle'});
   const metrics=await page.evaluate(()=>({overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),phone:document.querySelector('[data-cta="header-call"]').getAttribute('href'),records:document.querySelectorAll('[data-record-id]').length}));
   assert.equal(metrics.overflow,0);assert.equal(metrics.phone,'tel:+919100181181');assert.equal(metrics.records,36);
   await page.locator(width===390?'.portal-mobile-menu-trigger':'.portal-directory > summary').click();assert(await page.locator('.portal-directory').evaluate(e=>e.open));
   assert(await page.locator('a[href="'+base+aba+'#everyday-example"]').count()>0);await page.keyboard.press('Escape');assert(!(await page.locator('.portal-directory').evaluate(e=>e.open)));assert.equal(errors.length,0);
   cases.push({channel,width,...metrics,pageErrors:errors.length,menuOpenAndEscape:true});await page.close();
  }
  await browser.close();
 }
 const targetChecks=[];
 if(phase==='live'){
  const grouped=new Map();for(const[,next]of replacements){const url=new URL(base+next),key=url.origin+url.pathname;if(!grouped.has(key))grouped.set(key,[]);if(url.hash)grouped.get(key).push(decodeURIComponent(url.hash.slice(1)));}
  for(const[url,fragments]of grouped){const r=await fetch(url,{headers:{'cache-control':'no-cache'}});assert.equal(r.status,200,url);const html=await r.text();const ids=new Set([...html.matchAll(/(?:id|name)=["']([^"']+)["']/g)].map(m=>m[1]));for(const fragment of fragments)assert(ids.has(fragment),url+'#'+fragment);targetChecks.push({url,status:r.status,fragmentsPresent:fragments});}
 }
 const report={checkedAt:new Date().toISOString(),phase,acceptedBodiesUnchanged:bodies.length,bodies,replacements,cases,targetChecks,cssChanged:false,noEnquirySubmitted:true};
 const output='deployment/navigation-'+phase+'-v134a-20261001.json';fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({output,bodies:bodies.length,browserCases:cases.length,targets:targetChecks.length}));
})().catch(async error=>{for(const browser of launched)await browser.close().catch(()=>{});console.error(error);process.exitCode=1;});
