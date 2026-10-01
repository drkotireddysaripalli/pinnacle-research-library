import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route=process.env.PAGE_PATH || '/best-occupational-therapy-center-india-proven-improvement-rate';
const expectedCanonical=process.env.CANONICAL_PATH || route;
test('usable public page, shared shell, source and call paths',async({page},testInfo)=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto(route,{waitUntil:'load'});
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/.{15,}/);
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).not.toMatch(/noindex/i);
  expect(response?.headers()['x-robots-tag'] || '').not.toMatch(/noindex/i);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.portal-header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.pinnacleblooms.org'+expectedCanonical);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/.{40,}/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/^https:\/\/www\.pinnacleblooms\.org\//);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  expect(await page.locator('a[href="tel:+919100181181"]').count()).toBeGreaterThan(0);
  expect(await page.locator('.portal-header a[href*="/verify"]').count()).toBeGreaterThan(0);
  expect(await page.locator('footer a[href*="/verify"]').count()).toBeGreaterThan(0);
  const imageErrors=await page.locator('main img').evaluateAll(nodes=>nodes.filter(n=>!n.hasAttribute('alt')||!n.getAttribute('width')||!n.getAttribute('height')).length);
  expect(imageErrors).toBe(0);
  // Decode only images already in view; lazy images are covered by each page's visual contract.
  const brokenVisibleImages=await page.locator('main img').evaluateAll(async nodes=>{
    const visible=nodes.filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;});
    await Promise.all(visible.map(n=>n.decode().catch(()=>{})));
    return visible.filter(n=>!n.complete||n.naturalWidth===0).map(n=>n.getAttribute('src'));
  });
  expect(brokenVisibleImages).toEqual([]);
  const schema=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(n=>JSON.parse(n.textContent)));
  expect(schema.length).toBeGreaterThan(0);
  const menu=page.locator('.portal-mobile-menu-trigger');
  if(await menu.isVisible()){
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded','true');
    await page.locator('.portal-menu-close').click();
    await expect(menu).toHaveAttribute('aria-expanded','false');
    await expect(menu).toBeFocused();
  }
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await testInfo.attach('accessibility-findings',{body:JSON.stringify(audit.violations,null,2),contentType:'application/json'});
  expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.length}))).toEqual([]);
  expect(errors).toEqual([]);
});
