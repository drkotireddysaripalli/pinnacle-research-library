import {expect} from '@playwright/test';
import fs from 'node:fs';
const locked=JSON.parse(fs.readFileSync(new URL('../fixtures/shared-authority-owner-approved.json',import.meta.url),'utf8'));

// Assert the owner's visible design, rather than just counting hidden DOM links.
export async function checkSharedShell(page){
  const authority=page.locator('.portal-main-list>a');
  await expect(authority).toHaveCount(9);
  for(let i=0;i<locked.main.length;i++){
    const item=authority.nth(i);
    await expect(item.locator('.portal-nav-label')).toHaveText(locked.main[i].label);
    await expect(item.locator('.portal-nav-detail>span')).toHaveText(locked.main[i].lines);
    await expect(item.locator('.portal-nav-detail')).toBeVisible();
  }
  await expect(page.locator('.portal-authority-context,.portal-source-context')).toHaveCount(0);
  await expect(page.locator('.verify-card')).toHaveCount(36);
  for(const copy of await page.locator('.verify-card-copy').all())await expect(copy).toBeVisible();
  await expect(page.locator('nav.portal-locations li a')).toHaveCount(16);
  await expect(page.locator('nav.portal-community>a')).toHaveCount(8);
  await expect(page.locator('footer a[href$="/policies"]')).toHaveCount(1);
  const width=page.viewportSize().width;
  if(width>600)for(const list of await page.locator('nav.portal-footer-group ul').all())await expect(list).toBeVisible();
  else for(const toggle of await page.locator('.footer-group-toggle').all()){
    await expect(toggle).toBeVisible();
    const list=page.locator('#'+await toggle.getAttribute('aria-controls'));
    await toggle.click();await expect(list).toBeVisible();
    await toggle.click();await expect(list).toBeHidden();
  }
  if(width===1440){
    await page.evaluate(()=>document.fonts.ready);
    const values=await page.evaluate(()=>{
      const size=s=>parseFloat(getComputedStyle(document.querySelector(s)).fontSize);
      return {topHeight:document.querySelector('.portal-top').getBoundingClientRect().height,brandWidth:document.querySelector('.portal-brand').getBoundingClientRect().width,labelSize:size('.portal-nav-label'),detailSize:size('.portal-nav-detail'),cardIcon:document.querySelector('.verify-card-icon').getBoundingClientRect().width,cardValueSize:size('.verify-card-value'),cardTitleSize:size('.verify-card h3'),cardCopySize:size('.verify-card-copy'),footerColumns:getComputedStyle(document.querySelector('.portal-footer-columns')).gridTemplateColumns.split(' ').length};
    });
    expect(values).toEqual(locked.desktop.typography);
  }
}
