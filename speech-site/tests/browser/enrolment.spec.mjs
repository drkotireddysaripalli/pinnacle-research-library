import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import {services} from '../../public/pinnacle-pages-scripts/enrolment-api.mjs';
const path='/enroll-autism-speech-aba-therapies-india';
// No customer request reaches a server: intercepted responses exercise the UI contract.
test.beforeEach(async({page,context})=>{
 // Exercise this source revision while the owner performs the single final build.
 for(const file of ['enrolment.js','enrolment-api.mjs'])await context.route('**/pinnacle-pages-scripts/'+file,route=>route.fulfill({contentType:'text/javascript; charset=utf-8',body:fs.readFileSync('public/pinnacle-pages-scripts/'+file,'utf8')}));
 await page.route('**/api/enrolment',r=>r.abort('blockedbyclient'));
});
test('each supported service survives an incoming enquiry link, with centre choice',async({page})=>{
 await page.goto(path);const centre=await page.locator('#preferred-centre option').nth(1).getAttribute('value');
 for(const service of services){
  await page.goto(path+'?service='+service+'&centre='+encodeURIComponent(centre));
  await expect(page.locator('#enrol-submit')).toBeEnabled();
  await expect(page.locator('input[name=service]:checked')).toHaveValue(service);
  await expect(page.locator('#preferred-centre')).toHaveValue(centre);
  await expect(page.locator('#enrol-centre-card')).toBeVisible();
  await expect(page.locator('#enrol-centre-card a[href="tel:+919100181181"]')).toHaveCount(1);
 }
});
test('actual Autism page CTA retains its preference at enrolment',async({page})=>{
 await page.goto('/autism-therapy');
 const link=page.locator('main a[href*="service=autism"]').first();await expect(link).toHaveCount(1);
 const href=await link.getAttribute('href');const u=new URL(href,'https://www.pinnacleblooms.org');
 await link.evaluate((el,destination)=>el.setAttribute('href',destination),u.pathname+u.search+u.hash);
 await link.click();await expect(page.locator('input[name=service]:checked')).toHaveValue('autism');
});
test('empty submission stays local; readable whole-word service labels',async({page})=>{
 await page.goto(path);await page.locator('#enrol-submit').click();
 await expect(page.locator('#enrol-error-summary')).toBeVisible();await expect(page.locator('#parent-name')).toHaveAttribute('aria-invalid','true');
 const broken=await page.locator('.enrol-service-choice span').evaluateAll(nodes=>nodes.flatMap(n=>{
  const text=n.firstChild;if(!text||text.nodeType!==Node.TEXT_NODE)return ['Missing label'];
  return [...text.textContent.matchAll(/\S+/g)].filter(m=>{const r=document.createRange();r.setStart(text,m.index);r.setEnd(text,m.index+m[0].length);return new Set([...r.getClientRects()].map(x=>Math.round(x.top))).size>1;}).map(m=>m[0]);
 }));expect(broken).toEqual([]);
});
for(const state of ['accepted','rejected','unknown'])test('intercepted '+state+' response shows the appropriate next step',async({page})=>{
 let calls=0,body;
 await page.unroute('**/api/enrolment');await page.route('**/api/enrolment',async route=>{calls++;body=route.request().postDataJSON();await route.fulfill({status:state==='accepted'?202:state==='rejected'?422:502,contentType:'application/json',body:JSON.stringify({status:state,...(state==='accepted'?{receipt:{schemaVersion:1,requestId:body.requestId,id:'qa-browser-receipt'},contractVersion:1}:{})})});});
 await page.goto(path+'?service=autism');await page.locator('#parent-name').fill('Browser contract test');await page.locator('#parent-phone').fill('+91 00000 00000');await page.locator('#enrol-submit').click();
 await expect(page.locator('#enrol-status')).toContainText(state==='accepted'?'Your request has been received':state==='rejected'?'Your request was not accepted':'could not confirm');
 expect(calls).toBe(1);expect(body.preferences.service).toBe('autism');
 if(state==='accepted'){await expect(page.locator('#enrol-submit')).toBeDisabled();await expect(page.locator('#parent-name')).toHaveValue('');}
 else{await expect(page.locator('#parent-name')).toHaveValue('Browser contract test');if(state==='unknown')await expect(page.locator('#enrol-submit')).toBeDisabled();else await expect(page.locator('#enrol-submit')).toBeEnabled();}
});

for(const state of ['accepted','unknown'])test('reload holds '+state+' request and never reposts or repeats acceptance',async({page})=>{
 let calls=0,firstKey;
 await page.addInitScript(()=>{window.qaAcceptanceEvents=0;document.addEventListener('pinnacle:enquiry-accepted',()=>window.qaAcceptanceEvents++);});
 await page.unroute('**/api/enrolment');await page.route('**/api/enrolment',async route=>{calls++;firstKey=route.request().postDataJSON().requestId;await route.fulfill({status:state==='accepted'?202:502,contentType:'application/json',body:JSON.stringify({status:state,...(state==='accepted'?{receipt:{schemaVersion:1,requestId:firstKey,id:'qa-browser-reload-receipt'},contractVersion:1}:{})})});});
 await page.goto(path);await page.locator('#parent-name').fill('ISOLATED BROWSER QA');await page.locator('#parent-phone').fill('+91 00000 00000');await page.locator('#enrol-submit').click();
 await expect(page.locator('#enrol-submit')).toBeDisabled();expect(calls).toBe(1);
 expect(await page.evaluate(()=>window.qaAcceptanceEvents)).toBe(state==='accepted'?1:0);
 const stored=await page.evaluate(()=>localStorage.getItem('pbn-enrolment-request-v1'));expect(stored).toContain(firstKey);for(const text of ['ISOLATED BROWSER QA','00000','contact','message','preferences'])expect(stored).not.toContain(text);
 await page.reload();await expect(page.locator('#enrol-submit')).toBeDisabled();expect(calls).toBe(1);expect(await page.evaluate(()=>window.qaAcceptanceEvents)).toBe(0);
 await expect(page.locator('#enrol-status')).toContainText(state==='accepted'?'Your request has been received':'previous request is awaiting confirmation');
 if(state==='accepted'){await page.getByRole('button',{name:'Start a different enquiry'}).click();await expect(page.locator('#enrol-submit')).toBeEnabled();expect(await page.evaluate(()=>localStorage.getItem('pbn-enrolment-request-v1'))).toBeNull();}
 else await expect(page.getByRole('button',{name:'Start a different enquiry'})).toBeHidden();
});

test('double tap and a second browser tab cannot submit the same in-progress enquiry twice',async({page,context})=>{
 let calls=0,release;const delay=new Promise(resolve=>{release=resolve;});
 await page.unroute('**/api/enrolment');await context.route('**/api/enrolment',async route=>{calls++;const key=route.request().postDataJSON().requestId;await delay;await route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({status:'accepted',receipt:{schemaVersion:1,requestId:key,id:'qa-browser-two-tabs'},contractVersion:1})});});
 await page.goto(path);const other=await context.newPage();await other.goto(path);
 for(const tab of [page,other]){await tab.locator('#parent-name').fill('ISOLATED BROWSER QA');await tab.locator('#parent-phone').fill('+91 00000 00000');}
 await page.locator('#enrol-submit').evaluate(button=>{button.click();button.click();});
 await expect.poll(()=>calls).toBe(1);await other.locator('#enrol-submit').click();release();
 await expect(page.locator('#enrol-status')).toContainText('Your request has been received');await expect(other.locator('#enrol-submit')).toBeDisabled();expect(calls).toBe(1);
});
