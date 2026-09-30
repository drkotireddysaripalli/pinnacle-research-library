const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const policies=JSON.parse(fs.readFileSync('src/data/policy-content.json'));
const entries=[...policies.map(p=>({id:p.slug,path:p.path,policy:p})),...['self-sufficient','mainstream'].map(id=>({id,path:'/'+id}))];
const origin=process.env.PORTAL_ORIGIN||'http://127.0.0.1:4338',phase=origin.startsWith('http://127.')?'local':'live';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const norm=s=>s.replace(/\s+/g,' ').trim();
(async()=>{
 const runs=[],launched=[];let posts=0;
 try{for(const channel of ['chrome','msedge']){
  const b=await chromium.launch({channel,headless:true});launched.push(b);
  for(const e of entries)for(const width of (channel==='chrome'?[390,1440]:[390])){
   const p=await b.newPage({viewport:{width,height:900}}),errors=[];p.on('pageerror',x=>errors.push(x.message));
   await p.route('**/api/enrolment',r=>{posts++;return r.abort();});
   await p.goto(origin+e.path,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
   const facts=await p.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(x=>x.id),article=document.querySelector('.policy-document');
    let text=null;if(article){const parts=[],w=document.createTreeWalker(article,NodeFilter.SHOW_TEXT);while(w.nextNode()){const t=w.currentNode.textContent.replace(/\s+/g,' ').trim();if(t)parts.push(t);}text=parts.join(' ');}
    return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,duplicates:ids.filter((x,i)=>ids.indexOf(x)!==i),missing:[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href').slice(1)).filter(x=>x&&!document.getElementById(x)),policyText:text,tableCount:article?.querySelectorAll('table').length||0,policyImages:article?.querySelectorAll('img').length||0,tocOpen:document.querySelector('.policy-navigation details')?.open,header:!!document.querySelector('.portal-header'),footer:!!document.querySelector('.portal-site-footer .verify-footer'),stages:document.querySelectorAll('.life-stages>li').length,faqs:document.querySelectorAll('#questions details').length,phone:document.querySelector('[data-cta="hero-call"]')?.getAttribute('href'),canonical:document.querySelector('link[rel=canonical]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,bodyAuthForms:document.querySelectorAll('main form').length};
   });
   assert.equal(facts.width,facts.scrollWidth,e.id+' overflow');assert.equal(facts.h1,1,e.id+' h1');assert.equal(facts.duplicates.length,0,e.id+' duplicates');assert.equal(facts.missing.length,0,e.id+' missing');assert(facts.header&&facts.footer);assert.equal(facts.canonical,'https://www.pinnacleblooms.org'+e.path);assert(facts.og);assert.equal(facts.bodyAuthForms,0);assert.equal(errors.length,0);
   if(e.policy){assert.equal(sha(facts.policyText),e.policy.policyTextSha256,e.id+' preserved policy words');if(e.policy.toc.length>25)assert.equal(facts.tocOpen,false);}
   else{assert.equal(facts.stages,7);assert.equal(facts.faqs,6);assert.equal(facts.phone,'tel:+919100181181');await p.waitForFunction(()=>document.querySelector('.life-poster img')?.naturalWidth);}
   if(width===390){await p.locator('.portal-mobile-menu-trigger').click();assert(await p.locator('.portal-directory').evaluate(x=>x.open));await p.keyboard.press('Escape');assert.equal(await p.locator('.portal-directory').evaluate(x=>x.open),false);}
   if(channel==='chrome'&&['privacy-policy','terms-of-service','staff-declaration','ethics-charter','self-sufficient','mainstream'].includes(e.id))await p.screenshot({path:`audits/policy-life-v135-${phase}-${e.id}-${width}.png`});
   if(channel==='chrome'&&width===390&&['staff-declaration','ethics-charter'].includes(e.id)){await p.locator('.policy-document table').first().scrollIntoViewIfNeeded();await p.screenshot({path:`audits/policy-life-v135-${phase}-${e.id}-table-390.png`});}
   delete facts.policyText;runs.push({id:e.id,channel,width,...facts,policyTextHash:e.policy?.policyTextSha256,errors});await p.close();
  }
  await b.close();
 }
 const b=await chromium.launch({channel:'chrome',headless:true});launched.push(b);
 for(const id of ['self-sufficient','mainstream','staff-declaration','ethics-charter'])for(const width of [320,768,1024]){const p=await b.newPage({viewport:{width,height:900}});await p.goto(origin+'/'+id,{waitUntil:'networkidle'});const x=await p.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));assert.equal(x.width,x.scrollWidth,id+' additional width');runs.push({id,channel:'chrome',...x});await p.close();}await b.close();
 assert.equal(posts,0);const out=`deployment/policy-life-responsive-${phase}-v135-20261001.json`;fs.writeFileSync(out,JSON.stringify({at:new Date().toISOString(),origin,runs,policyWordingPreserved:true,noAuthOrEnquirySubmitted:true,physicalIOS:false},null,2)+'\n');console.log(JSON.stringify({out,runs:runs.length,policyWordingPreserved:true,noAuthOrEnquirySubmitted:true}));
 }finally{await Promise.allSettled(launched.map(b=>b.close()));}
})().catch(e=>{console.error(e);process.exitCode=1});
