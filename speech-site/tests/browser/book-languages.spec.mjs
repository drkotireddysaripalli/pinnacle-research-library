import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {VERNACULAR_RELEASE} from '../../deployment/vernacular-typography.mjs';
for(const locale of ['hi','te'])test(`native ${locale} books preserve language, navigation and readable layouts`,async({page},info)=>{
 test.skip(process.env.PAGE_PATH!=='/shop','Bookshop acceptance only');
 await page.goto(`/books/${locale}/speech-101`);
 await expect(page.locator('html')).toHaveAttribute('lang',locale+'-IN');
 await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('.pbn-native-contents li')).toHaveCount(31);
 await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('style[data-pinnacle-vernacular]')).toHaveAttribute('data-pinnacle-vernacular',VERNACULAR_RELEASE);
 expect(await page.locator('.pbn-native h1').evaluate(el=>getComputedStyle(el).fontFamily.includes('Pinnacle Anek'))).toBe(true);
 expect(await page.locator('.pbn-native h1').evaluate(el=>getComputedStyle(el).fontWeight)).toBe('800');
 const range=locale==='hi'?'U+900-97F':'U+C00-C7F';
 expect(await page.evaluate(r=>[...document.fonts].some(f=>f.family==='Pinnacle Anek'&&f.status==='loaded'&&f.unicodeRange.toUpperCase().includes(r)),range)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.locator('.pbn-commerce-nav a').nth(2)).toHaveAttribute('href',`/books/${locale}#pairs`);
 await page.locator('.pbn-native-product img').first().evaluate(img=>img.decode());
 await fs.mkdir('audits/books-languages',{recursive:true});
 await page.locator('.pbn-native-product').screenshot({path:`audits/books-languages/${info.project.name}-${locale}-book.png`});
 await page.locator('[data-cart-open]').click();await expect(page.locator('dialog')).toBeVisible();
 await expect(page.locator('[data-cart-checkout]')).toHaveText(locale==='hi'?'सुरक्षित भुगतान की ओर बढ़ें →':'సురక్షిత చెల్లింపుకు వెళ్లండి →');
 await page.locator('[data-cart-close]').click();
 await page.goto(`/books/${locale}`);await expect(page.locator('#singles .pbn-native-card')).toHaveCount(4);await expect(page.locator('#pairs .pbn-native-card')).toHaveCount(6);
 await page.locator('.pbn-native-library img').evaluate(img=>img.decode());
 await page.locator('.pbn-native-library').screenshot({path:`audits/books-languages/${info.project.name}-${locale}-library.png`});
});

for(const locale of ['hi','te'])test(`English purchase information preserves the ${locale} book edition`,async({page},info)=>{
 test.skip(process.env.PAGE_PATH!=='/shop','Bookshop acceptance only');
 await page.goto(`/books/editions/${locale}/speech-101`);await expect(page.locator('.pbn-commerce-nav a').nth(3)).toHaveAttribute('href','#preview');await expect(page.locator('html')).toHaveAttribute('lang','en-IN');await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('.pbn-native-offer')).toContainText(locale==='hi'?'Hindi edition':'Telugu edition');await expect(page.locator('.pbn-native-actions a').last()).toHaveAttribute('href',`/books/${locale}/speech-101`);await page.locator('.pbn-native-product img').first().evaluate(img=>img.decode());expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await fs.mkdir('audits/books-languages',{recursive:true});await page.locator('.pbn-native-product').screenshot({path:`audits/books-languages/${info.project.name}-${locale}-english-purchase.png`});await page.locator('[data-cart-open]').click();await expect(page.locator('dialog')).toBeVisible();await expect(page.locator('[data-cart-checkout]')).toHaveText('Continue to secure checkout →');
});
