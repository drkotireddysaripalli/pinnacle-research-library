import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const centres=JSON.parse(fs.readFileSync('src/data/centre-directory.json','utf8'));
const guntur=centres.find(c=>c.id==='guntur');
const centrePath=new URL(guntur.profileUrl).pathname;
const pages=[['directory','/centers','','help'],['speech','/speech-therapy/service-information','','speech'],['centre',centrePath,'guntur','help']];
test.beforeEach(async({context})=>{
 await context.route(/google-analytics|googletagmanager|doubleclick|googleadservices|aseasky/,r=>r.abort());
 await context.route('**/api/enrolment',r=>r.abort('blockedbyclient'));
});
for(const [name,path,centre,service]of pages)test(name+' callback has correct editable preferences and usable layout',async({page})=>{
 await page.goto(path);await expect(page.locator('#enrol-submit')).toBeEnabled();
 await expect(page.locator('#preferred-centre')).toHaveValue(centre);await expect(page.locator('[name=service]:checked')).toHaveValue(service);
 await expect(page.locator('#enrol-preferences')).not.toHaveAttribute('open','');
 await expect(page.locator('#callback a[data-cta="callback-call"][href="tel:+919100181181"]')).toHaveCount(1);
 await page.locator('#callback').scrollIntoViewIfNeeded();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 for(const id of ['parent-name','parent-phone','enrol-submit'])expect((await page.locator('#'+id).boundingBox()).height).toBeGreaterThanOrEqual(44);
 await page.screenshot({path:test.info().outputPath(name+'-callback.png'),fullPage:false});
 await page.locator('#enrol-preferences summary').click();await expect(page.locator('#preferred-centre')).toBeVisible();
 await page.locator('#preferred-centre').selectOption('suchitra');await page.locator('[name=service][value=occupational]').check();
 await expect(page.locator('#callback-selection')).toContainText('Occupational');await expect(page.locator('#callback-selection')).toContainText('Suchitra');
 await page.screenshot({path:test.info().outputPath(name+'-preferences.png'),fullPage:false});
});
test('explicit incoming service and blank centre override the centre template safely',async({page})=>{
 await page.goto(centrePath+'?service=speech&centre=');await expect(page.locator('#enrol-submit')).toBeEnabled();
 await expect(page.locator('[name=service]:checked')).toHaveValue('speech');await expect(page.locator('#preferred-centre')).toHaveValue('');
 await expect(page.locator('#enrol-preferences')).toHaveAttribute('open','');
});
test('invalid details stay local and validation focus remains readable',async({page})=>{
 await page.goto('/speech-therapy/service-information');await page.locator('#enrol-submit').click();
 await expect(page.locator('#enrol-error-summary')).toBeVisible();await expect(page.locator('#enrol-error-summary')).toBeFocused();
 await expect(page.locator('#parent-name')).toHaveAttribute('aria-invalid','true');
 await page.locator('#parent-phone').fill('+91 00000 00000');await page.locator('#parent-phone').focus();
 await expect(page.locator('#parent-phone')).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
for(const state of ['accepted','unknown'])test(state+' callback receipt survives reload without a second post or acceptance',async({page,context})=>{
 let posts=0;await context.unroute('**/api/enrolment');
 await context.route('**/api/enrolment',async r=>{posts++;const body=r.request().postDataJSON();expect(body.preferences).toEqual({centre:'guntur',service:'help'});
 await r.fulfill({status:state==='accepted'?202:502,contentType:'application/json',body:JSON.stringify({status:state,...(state==='accepted'?{contractVersion:1,receipt:{schemaVersion:1,requestId:body.requestId,id:'qa-inline-callback-receipt'}}:{})})});});
 await page.addInitScript(()=>{window.qaCallbacks=0;document.addEventListener('pinnacle:enquiry-accepted',()=>window.qaCallbacks++);});
 await page.goto(centrePath);await page.locator('#parent-name').fill('ISOLATED CALLBACK QA');await page.locator('#parent-phone').fill('+91 00000 00000');
 await page.locator('#enrol-submit').evaluate(b=>{b.click();b.click();});
 await expect(page.locator('#enrol-submit')).toBeDisabled();await expect(page.locator('#enrol-status')).toContainText(state==='accepted'?'Your request has been received':'could not confirm');
 expect(posts).toBe(1);expect(await page.evaluate(()=>window.qaCallbacks)).toBe(state==='accepted'?1:0);
 await page.reload();await expect(page.locator('#enrol-submit')).toBeDisabled();expect(posts).toBe(1);expect(await page.evaluate(()=>window.qaCallbacks)).toBe(0);
});
