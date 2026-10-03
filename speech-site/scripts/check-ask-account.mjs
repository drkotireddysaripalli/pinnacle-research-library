import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4330';
assert.match(base,/^http:\/\/127\.0\.0\.1:\d+$/);
const account=await fetch(base+'/ask/account?returnTo=%2Fask%2Flens%2Fentity%253Atherapy_modality%2Fot',{redirect:'manual'});
assert.equal(account.status,303);assert.equal(account.headers.get('location'),'/ask/lens/entity%3Atherapy_modality/ot');assert.match(account.headers.get('cache-control'),/no-store/);
const page=await fetch(base+'/ask');assert.equal(page.status,200);const html=await page.text();assert.match(html,/id="ask-reader-gate"/);assert.match(html,/action="\/ask\/auth\/google"/);assert.doesNotMatch(html,/action="\/ask\/auth\/(phone|apple|x|azure)"/);assert.match(html,/isAccessibleForFree":false/);
const session=await fetch(base+'/ask/auth/session');assert.equal(session.status,503);assert.match(session.headers.get('cache-control'),/no-store/);
console.log('PASS: local account compatibility redirect, Google-only overlay, registration markup and disabled private session. No provider request or OTP sent.');
