import {test,expect} from '@playwright/test';

const entry='/?utm_source=google&utm_medium=cpc&utm_campaign=pbn_network_hyderabad&utm_content=kondapur-hyderabad-telangana_speech';

test('Speech locality search reaches the existing directory and preserves the paid URL',async({page})=>{
  const posts=[];
  page.on('request',request=>{if(request.method()==='POST')posts.push(request.url());});
  await page.goto(entry);
  const finder=page.locator('.speech-location-finder');
  await expect(finder.getByRole('heading',{name:'Looking for speech therapy near you?'})).toBeVisible();
  const original=page.url();
  await finder.getByLabel('Area, city or postcode').fill('Kukatpally');
  await finder.getByLabel('Area, city or postcode').press('Enter');
  await expect(page.locator('#centre-search')).toHaveValue('Kukatpally');
  await expect(page.locator('#centre-search')).toBeFocused();
  const cards=page.locator('.directory-card:visible');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('Kukatpally');
  await expect(page).toHaveURL(original);
  await expect(cards.getByRole('link',{name:'Choose this centre',exact:true})).toHaveAttribute('href',/centre=kukatpally/);
  expect(posts).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});

test('Hyderabad shortcut, no-match guidance and all-location recovery work',async({page})=>{
  await page.goto(entry);
  const finder=page.locator('.speech-location-finder');
  await finder.getByRole('link',{name:'Browse Hyderabad locations'}).click();
  await expect(page.locator('#centre-search')).toHaveValue('Hyderabad');
  await expect(page.locator('#centre-region')).toHaveValue('all');
  expect(await page.locator('.directory-card:visible').count()).toBeGreaterThan(0);
  await finder.getByLabel('Area, city or postcode').fill('no-matching-location');
  await finder.getByRole('button',{name:'Find centres'}).click();
  await expect(page.locator('#centre-count')).toContainText('call 9100 181 181');
  await expect(page.locator('.directory-card:visible')).toHaveCount(0);
  await finder.getByRole('link',{name:'Browse all locations'}).click();
  await expect(page.locator('#centre-search')).toHaveValue('');
  expect(await page.locator('.directory-card:visible').count()).toBeGreaterThan(0);
});

test('Without JavaScript the directory links retain a usable fallback',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});
  const page=await context.newPage();
  await page.goto(entry);
  await expect(page.locator('[data-speech-location-form]')).toBeHidden();
  await page.getByRole('link',{name:'Browse Hyderabad locations'}).click();
  await expect(page).toHaveURL(/utm_campaign=pbn_network_hyderabad.*#centres$/);
  await expect(page.locator('#centres')).toBeVisible();
  expect(await page.locator('.directory-card:visible').count()).toBeGreaterThan(0);
  await context.close();
});
