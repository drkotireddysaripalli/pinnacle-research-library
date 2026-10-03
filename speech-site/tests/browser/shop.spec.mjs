import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('shop previews, responsive shelves and live digital cart',async({page},info)=>{
 test.skip(process.env.PAGE_PATH!=='/shop','Bookshop acceptance only');
 await page.goto('/shop');
 await expect(page.locator('.pbn-book-card')).toHaveCount(4);
 await expect(page.locator('.pbn-pair-offer')).toHaveCount(6);
 await expect(page.locator('[data-book-sku]')).toHaveCount(11);
 await fs.mkdir('audits/shop-20261002',{recursive:true});
 for(const [name,selector] of [['hero','.pbn-hero'],['shelf','.pbn-shelf'],['collections','.pbn-collections'],['inside','.pbn-inside']]){
  const target=page.locator(selector);await target.scrollIntoViewIfNeeded();
  await target.locator('img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode().catch(()=>{}))));
  await target.screenshot({path:`audits/shop-20261002/${info.project.name}-${name}.png`});
 }
 {
  const add=page.locator('[data-book-sku="PBN-SP-101-EN-PDF"]');await expect(add).toBeEnabled({timeout:20000});
  await add.click();await expect(page.locator('.pbn-cart')).toBeVisible();
  await expect(page.locator('.pbn-cart-item')).toHaveCount(1);
  await expect(page.locator('[data-cart-total]')).toContainText('799');
  await expect(page.locator('[data-cart-checkout]')).toHaveAttribute('href',/^https:\/\/pinnacleblooms\.myshopify\.com\//);
  await expect(page.locator('.pbn-cart-covers img')).toHaveCount(1);
  await expect(page.locator('.pbn-cart-proof-links a')).toHaveCount(2);
  await page.locator('.pbn-cart-covers img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode())));
  await page.locator('.pbn-cart').screenshot({path:`audits/shop-20261002/${info.project.name}-cart.png`});
  await page.locator('.pbn-cart-proof').scrollIntoViewIfNeeded();
  await page.locator('.pbn-cart').screenshot({path:`audits/shop-20261002/${info.project.name}-cart-evidence.png`});
  await page.locator('.pbn-cart-compare').click();await expect(page.locator('.pbn-cart')).not.toBeVisible();await add.click();await expect(page.locator('.pbn-cart-item')).toHaveCount(1);
  await page.locator('[data-remove-line]').click();await expect(page.locator('.pbn-cart-item')).toHaveCount(0);
  await expect(page.locator('[data-cart-checkout]')).toBeHidden();
 }
});
