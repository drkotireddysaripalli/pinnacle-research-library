import fs from 'node:fs/promises';import http from 'node:http';import assert from 'node:assert/strict';import {chromium,webkit} from '@playwright/test';
import {createMirraclesLibrary} from '../deployment/mirracles-library.mjs';import {safeReturn} from '../src/lib/ask/auth.mjs';
const out='deployment/knowledge-journey-browser-20261008';await fs.mkdir(out,{recursive:true});
const reader=JSON.parse(await fs.readFile('ask-private/knowledge-journey-20261008/reader.json'));
const loadJson=async name=>JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/'+name+'.json','utf8'));
const catalogue=await loadJson('catalogue'),shell=await loadJson('shell');
const library=createMirraclesLibrary({loadJson,shell:{...shell,reader},responseHeaders:{'Content-Security-Policy':"object-src 'none'; base-uri 'self'"}});
const posts=[];const server=http.createServer(async(req,res)=>{
 try{const url=new URL(req.url,'http://127.0.0.1:4359');
 if(url.pathname==='/ask/auth/session'){res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');return res.end(JSON.stringify({csrf:'12345678-1234-1234-1234-123456789012',profile:req.headers.cookie?.includes('qa_reader=1')?{name:'QA Reader',avatar:null,whatsappVerified:false}:null}));}
 if(req.method==='POST'&&['/ask/auth/google','/ask/auth/logout'].includes(url.pathname)){let body='';for await(const chunk of req)body+=chunk;const form=new URLSearchParams(body);assert.equal(req.headers.origin,url.origin);posts.push({path:url.pathname,origin:req.headers.origin,returnTo:form.get('returnTo'),library:form.get('library'),provider:'local-fixture-only'});res.writeHead(303,{Location:safeReturn(form.get('returnTo')),'Set-Cookie':url.pathname.endsWith('logout')?'qa_reader=; Path=/; Max-Age=0':'qa_reader=1; Path=/; HttpOnly; SameSite=Lax'});return res.end();}
 const fresh=new URL(req.url,'http://127.0.0.1:4330');fresh.searchParams.set('assembly','knowledge-journey-20261008');
 const response=await library(new Request('https://www.pinnacleblooms.org'+req.url))||await fetch(fresh);
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error));}
});await new Promise(resolve=>server.listen(4359,'127.0.0.1',resolve));
const recovered=JSON.parse(await fs.readFile('src/data/sunshine-recovered.json'));
let paths=['/ask/what-is-an-iep-individualised-education-plan','/ask/pincer-grasp','/faq/hindi/occupational-therapy','/faq/english/speech-therapy/autism-speech-therapy','/sunshine/techniques',recovered.find(x=>x.id===3394).url,'/allmirracles','/allmirracles/category/'+encodeURIComponent(catalogue.categories[0].key),catalogue.records.find(r=>r.id===catalogue.order[0]).path];
if(process.env.JOURNEY_FOCUS==='changed')paths=paths.filter(p=>/hindi|allmirracles|mirracles\//.test(p));
const rows=[];
try{for(const [engine,name,widths]of [[chromium,'chromium',[320,768,1440]],[webkit,'webkit',[390]]]){
 const browser=await engine.launch();for(const width of widths)for(const path of paths){
 const context=await browser.newContext({viewport:{width,height:900}});await context.route(/https:\/\/(?:accounts\.google|www\.googletagmanager|.*google-analytics|ob\.aseasky)/,r=>r.abort());const page=await context.newPage();
 try{const response=await page.goto('http://127.0.0.1:4359'+path,{waitUntil:'networkidle'});assert.equal(response.status(),200,path);
 await page.locator('#ask-reader-gate').waitFor({state:'visible'});assert.equal(await page.locator('[data-ask-google-form] [name=returnTo]').inputValue(),path);
 await page.locator('[data-ask-google-form] button').click();await page.locator('[data-ask-profile]').waitFor({state:'visible'});assert.equal(new URL(page.url()).pathname,decodeURI(new URL(path,'http://local').pathname)===path?path:new URL(path,'http://local').pathname);
 assert.equal(await page.locator('#ask-reader-gate').isVisible(),false);const rail=page.locator('[data-knowledge-journey]').first();await rail.scrollIntoViewIfNeeded();assert.equal(await rail.locator('a[href="tel:+919100181181"]').count(),1);
 const enquiry=await rail.locator('a[data-cta="knowledge-enrol"]').getAttribute('href');assert.equal(new URL(enquiry).pathname,'/enroll-autism-speech-aba-therapies-india');
 const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,gateVisible:!!document.querySelector('#ask-reader-gate')?.open,h1:document.querySelector('main h1')?.textContent,readerProfile:document.querySelector('[data-ask-profile-name]')?.textContent,font:getComputedStyle(document.querySelector('[data-knowledge-journey] h2')).fontFamily,weight:getComputedStyle(document.querySelector('[data-knowledge-journey] h2')).fontWeight}));assert(!geometry.overflow,path+' '+name+' '+width);if(path.includes('/hindi/')){assert(geometry.font.includes('Pinnacle Anek'));assert(Number(geometry.weight)>=800);}
 const screenshot=path.replace(/[^a-z0-9]/gi,'-')+'-'+name+'-'+width+'.png';await page.screenshot({path:out+'/'+screenshot});
 await page.locator('[data-ask-logout]').evaluate(form=>form.requestSubmit());await page.locator('#ask-reader-gate').waitFor({state:'visible'});
 rows.push({path,engine:name,width,physicalDevice:false,google:'local signed-in fixture; no real Google account created',registrationReturn:true,logoutGate:true,nativePostOrigin:true,enquiry,geometry,screenshot});
 }finally{await context.close();}
 }await browser.close();}
 await fs.writeFile(out+'/result.json',JSON.stringify({cases:rows.length,passed:rows.length,realRegistrations:0,realEnquiries:0,posts,rows},null,2));console.log(JSON.stringify({cases:rows.length,passed:rows.length,realRegistrations:0,realEnquiries:0,nativePosts:posts.length}));
}finally{server.close();}
