import {test,expect} from '@playwright/test';
const examples=[
 ['/books/speech-communication-101-my-message-matters','PBN-SP-101-EN-PDF',4],
 ['/books/speech-communication-101-my-message-matters-softcover','PBN-SP-101-EN-PDF',4],
 ['/books/te/speech-101','PBN-SP-101-TE-PDF',2]
];
for(const [path,sku,count]of examples)test('clear exact store choices '+path,async({page},testInfo)=>{
 await page.route(/google-analytics\.com|googletagmanager\.com|aseasky\.link|cloudflareinsights\.com/,r=>r.abort());
 await page.goto(path);const block=page.locator('[data-store-choices="'+sku+'"]');await expect(block).toBeVisible();
 await expect(block.locator('a.pbn-store-choice')).toHaveCount(count);
 await expect(block.locator('[data-store="pinnacle"]')).toHaveAttribute('href','/shop/cart?cart_sku='+sku+'&quantity=1');
 await expect(page.locator('a[href="tel:+919100181181"]').first()).toHaveAttribute('href','tel:+919100181181');
 await block.locator('summary').click();await expect(block.locator('details')).toHaveAttribute('open','');
 expect(await block.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBeTruthy();
 for(const link of await block.locator('a').all()){const box=await link.boundingBox();expect(box?.height).toBeGreaterThanOrEqual(44);}
 if(path.includes('/te/'))expect(await block.locator('h2').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Anek');
 await block.screenshot({path:testInfo.outputPath('store-choices.png')});
});
test('all discovery cards retain exact choices without starting checkout',async({page})=>{
 await page.route(/google-analytics\.com|googletagmanager\.com|aseasky\.link|cloudflareinsights\.com/,r=>r.abort());
 for(const path of ['/books','/shop']){await page.goto(path);await expect(page.locator('[data-store-choices]')).toHaveCount(11);await expect(page.locator('[data-store-choices="PBN-SP-101-EN-PDF"] [data-store="flipkart"]')).toHaveAttribute('href',/pid=9798178590706/);}
});
