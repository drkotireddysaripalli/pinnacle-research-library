import {test,expect} from '@playwright/test';
import {measurePinnacleLifecycle} from './pinnacle-lifecycle-contract.mjs';

test('PinnacleAI lifecycle fills its section with readable cards',async({page},testInfo)=>{
  await page.goto('/pinnacleai',{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  const nav=page.getByRole('navigation',{name:'The PinnacleAI circle in seven readable stages'});
  await nav.scrollIntoViewIfNeeded();
  const geometry=await page.evaluate(measurePinnacleLifecycle);
  await testInfo.attach('lifecycle-geometry',{body:JSON.stringify(geometry,null,2),contentType:'application/json'});
  await testInfo.attach('lifecycle-section',{body:await nav.screenshot(),contentType:'image/png'});
  expect(geometry.failures).toEqual([]);
  // The original failure was hidden by min-width:0 and emergency word wrapping.
  // Blocking fonts must not bring back narrow or overflowing cards.
  await page.route('**/*.woff2',route=>route.abort());
  await page.reload({waitUntil:'load'});
  expect((await page.evaluate(measurePinnacleLifecycle)).failures).toEqual([]);
});

