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
    await expect(item.locator('.portal-nav-detail')).toHaveText(locked.main[i].lines.join(' '));
    await expect(item.locator('.portal-nav-detail>span')).toHaveCount(0);
    await expect(item.locator('.portal-nav-detail')).toBeVisible();
  }
  await expect(page.locator('.portal-authority-context,.portal-source-context')).toHaveCount(0);
  await expect(page.locator('.verify-card')).toHaveCount(36);
  for(const copy of await page.locator('.verify-card-copy').all())await expect(copy).toBeVisible();
  await expect(page.locator('nav.portal-locations li a')).toHaveCount(16);
  await expect(page.locator('nav.portal-community>a')).toHaveCount(8);
  await expect(page.locator('footer a[href$="/policies"]')).toHaveCount(1);
  const width=page.viewportSize().width;
  if(width<=620){
    const cards=await page.locator('.verify-card').evaluateAll(nodes=>nodes.slice(0,2).map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};}));
    expect(cards[0].width).toBeGreaterThanOrEqual(260);
    expect(cards[1].left-cards[0].right).toBeGreaterThanOrEqual(10);
  }
  if(width>600)for(const list of await page.locator('nav.portal-footer-group ul').all())await expect(list).toBeVisible();
  else {
    for(const list of await page.locator('nav.portal-footer-group ul').all())await expect(list).toBeVisible();
    const toggle=page.locator('.footer-group-toggle').first();
    await expect(toggle).toBeVisible();
    const list=page.locator('#'+await toggle.getAttribute('aria-controls'));
    await expect(list).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-label',/^Hide /);
    await toggle.click();await expect(list).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-label',/^Show /);
    await toggle.click();await expect(list).toBeVisible();
  }
  const enrol=await page.locator('.portal-enrol').boundingBox();
  const search=await page.locator('.portal-search').boundingBox();
  expect(enrol.x).toBeGreaterThan(search.x);
  if(width<=900){
    const rail=page.locator('#portal-authority-rail');
    // Native focus must reveal the final link even without the removed arrows.
    // Mobile WebKit does not expose a mouse-wheel input in Playwright.
    await rail.locator('a').last().focus();
    await expect.poll(()=>rail.evaluate(e=>e.scrollLeft)).toBeGreaterThan(40);
    await expect(rail.locator('a').last()).toBeInViewport();
    await expect(page.locator('.shared-rail-authority')).toHaveCount(0);
    const search=page.locator('.portal-search>summary');
    await search.click();await expect(page.locator('#portal-search-input')).toBeVisible();
    await page.keyboard.press('Escape');await expect(search).toBeFocused();
    await expect(page.locator('.portal-therapy-menu').first()).toBeHidden();
    const menu=page.locator('.portal-mobile-menu-trigger');
    await menu.click();
    const panel=page.locator('.portal-directory-panel');
    await expect(panel).toHaveAttribute('aria-modal','true');
    await expect(page.locator('main')).toHaveAttribute('inert','');
    const close=page.locator('.portal-menu-close');
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await panel.evaluate(e=>e.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Tab');await expect(close).toBeFocused();
    const destinations=await panel.locator('a').evaluateAll(nodes=>nodes.map(a=>a.href));
    const therapyDestinations=await page.locator('.portal-therapy-menu a').evaluateAll(nodes=>nodes.map(a=>a.href));
    expect(therapyDestinations.every(href=>destinations.includes(href))).toBe(true);
    const therapy=panel.locator('.portal-compact-therapy').nth(1);
    await therapy.locator('summary').click();
    await expect(therapy.locator('li a').first()).toBeVisible();
    await expect(panel).toHaveAttribute('aria-modal','true');
    const about=panel.locator('.portal-about-priority .portal-menu-group-toggle');
    await about.click();await expect(about).toHaveAttribute('aria-expanded','true');
    await panel.evaluate(e=>e.scrollTop=e.scrollHeight);
    await close.click();await menu.click();
    await expect(panel).toHaveAttribute('aria-modal','true');
    await expect.poll(()=>panel.evaluate(e=>e.scrollTop)).toBe(0);
    await expect(therapy).not.toHaveAttribute('open','');
    await expect(about).toHaveAttribute('aria-expanded','false');
    await page.keyboard.press('Escape');await expect(menu).toBeFocused();
    await expect(page.locator('main')).not.toHaveAttribute('inert','');
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
