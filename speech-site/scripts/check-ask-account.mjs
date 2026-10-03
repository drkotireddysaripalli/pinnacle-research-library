import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

// Run against a local candidate with authentication disabled. Never sends an OTP.
const base=process.argv[2]||'http://127.0.0.1:4330';
assert.match(base,/^http:\/\/127\.0\.0\.1:\d+$/);
const checks=[];
for(const suffix of ['', '?status=verified', '?status=code-sent']){
 const r=await fetch(base+'/ask/account'+suffix);
 const html=await r.text();
 assert.equal(r.status,200);
 for(const name of ['cache-control','cdn-cache-control','cloudflare-cdn-cache-control'])assert.match(r.headers.get(name)||'',/no-store/);
 assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
 assert.equal(r.headers.get('referrer-policy'),'no-referrer');
 assert.match(r.headers.get('set-cookie')||'',/HttpOnly/);
 assert.match(html,/Account sign-in is not available yet/);
 assert.doesNotMatch(html,/Your Google account and WhatsApp number are connected\.|Your code has been accepted for sending/);
 assert.doesNotMatch(html,/<script[^>]+type="application\/ld\+json"/);
 assert.match(html,/tel:\+919100181181/);
 checks.push({path:'/ask/account'+suffix,status:r.status,result:'pass',scope:'private headers, disabled state, no false verification, call link'});
}
const post=await fetch(base+'/ask/auth/google',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',origin:base},body:'csrf=synthetic'});
assert.equal(post.status,503);assert.match(post.headers.get('cache-control')||'',/no-store/);
checks.push({path:'/ask/auth/google',method:'POST',status:post.status,result:'pass',scope:'disabled endpoint fails closed'});
const crossSite=await fetch(base+'/ask/auth/google',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',origin:'https://example.invalid'},body:'csrf=synthetic'});
assert.equal(crossSite.status,403);assert.match(crossSite.headers.get('cache-control')||'',/no-store/);
checks.push({path:'/ask/auth/google',method:'POST',status:crossSite.status,result:'pass',scope:'cross-origin form rejected and not cached'});
const report={checkedAt:new Date().toISOString(),base,mode:'local authentication-disabled candidate',checks,providerDeliveryTested:false};
await writeFile('reviews/ask-account-local-20261003.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
