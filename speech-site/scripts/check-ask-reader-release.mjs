// Bounded production verification. No user sign-in, OTP, messages or lead submissions.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const origin=process.argv[2]||'https://pinnacleblooms.org';
const receipt=process.argv[3]||'deployment/ask-google-reader-public-check-20261003.json';
const checks=[];
const read=async(path,options={})=>fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(20000),...options});
const session=await read('/ask/auth/session');assert.equal(session.status,200);
for(const h of ['cache-control','cdn-cache-control','cloudflare-cdn-cache-control'])assert.match(session.headers.get(h),/no-store/);
assert.equal(session.headers.get('x-robots-tag'),'noindex, nofollow');
const state=await session.json();assert.equal(state.profile,null);assert.match(state.csrf,/^[0-9a-f-]{36}$/);assert.deepEqual(Object.keys(state).sort(),['csrf','profile']);
const cookie=session.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
checks.push({name:'anonymous private session',status:200,profile:null,noStore:true,noindex:true,csrf:true});
for(const path of ['/ask','/ask/lens/entity%3Atherapy_modality/ot','/ask/what-happens-during-occupational-therapy-sessions']){
 const r=await read(path),html=await r.text();assert.equal(r.status,200);assert.match(r.headers.get('x-pinnacle-ask-release'),/google-gate/);assert.equal(r.headers.get('referrer-policy'),'strict-origin');assert.equal(r.headers.get('set-cookie'),null);
 assert.match(html,/id="ask-reader-gate"/);assert.match(html,/class="ask-registration-content"/);assert.match(html,/action="\/ask\/auth\/google"/);assert.match(html,/data-ask-profile/);assert.match(html,/isAccessibleForFree":false/);
 assert.doesNotMatch(html,/action="\/ask\/auth\/(apple|x|azure|phone|verify)"/);
 const graph=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m=>JSON.parse(m[1])['@graph']||[]);
 assert(graph.some(g=>g.hasPart?.cssSelector==='.ask-registration-content'));
 if(path.includes('what-happens-during')){assert.match(html,/rel="alternate" type="text\/markdown"/);assert.match(html,/rel="alternate" type="application\/json"/);assert(graph.some(g=>g.mainEntity?.['@type']==='Question'&&g.mainEntity.acceptedAnswer?.text));}
 const withCookie=await read(path,{headers:{cookie}});assert.equal(withCookie.headers.get('set-cookie'),null);assert.equal(await withCookie.text(),html,'Session cookie must not personalise public HTML');
 checks.push({name:'public content and registration markup',path,status:200,sharedHTML:true,googleOnly:true,hash:createHash('sha256').update(html).digest('hex')});
}
const returnTo='/ask/lens/entity%3Atherapy_modality/ot?page=2';
const account=await read('/ask/account?returnTo='+encodeURIComponent(returnTo));assert.equal(account.status,303);assert.equal(account.headers.get('location'),returnTo);assert.match(account.headers.get('cache-control'),/no-store/);
const start=await read('/ask/auth/google',{method:'POST',headers:{origin,cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:state.csrf,returnTo})});assert.equal(start.status,303);
const supabase=new URL(start.headers.get('location'));assert.equal(supabase.hostname,'lyjwsaiqvgwyautowhlx.supabase.co');assert.equal(supabase.searchParams.get('provider'),'google');assert.equal(supabase.searchParams.get('code_challenge_method'),'s256');assert.equal(supabase.searchParams.get('redirect_to'),origin+'/ask/auth/callback');
const google=await fetch(supabase,{redirect:'manual'});assert.equal(google.status,302);assert.equal(new URL(google.headers.get('location')).hostname,'accounts.google.com');
checks.push({name:'Google PKCE start and old account redirect',returnPreserved:true,googleReached:true});
for(const originHeader of [origin,'https://example.invalid']){const bad=await read('/ask/auth/google',{method:'POST',headers:{origin:originHeader,cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:'wrong'})});assert.equal(bad.status,403);}
for(const provider of ['apple','x','azure']){const r=await read('/ask/auth/'+provider,{method:'POST',headers:{origin,cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:state.csrf,returnTo})});assert.equal(r.status,503);}
checks.push({name:'invalid CSRF rejected; future provider starts hidden and disabled',pass:true});
for(const suffix of ['.json','.md']){const r=await read('/ask/what-happens-during-occupational-therapy-sessions'+suffix);assert.equal(r.status,200);const body=await r.text();assert(body.length>100);if(suffix==='.json')JSON.parse(body);assert.doesNotMatch(body,/ask-reader-gate/);}
const sitemap=await read('/ask/sitemap-topics.xml');assert.equal(sitemap.status,200);const count=[...(await sitemap.text()).matchAll(/<loc>/g)].length;assert(count>0);
checks.push({name:'public machine exports and topic sitemap',pass:true,topicURLs:count});
const report={at:new Date().toISOString(),origin,scope:'Anonymous HTTP and OAuth start; completed browser login recorded separately',checks};
await fs.writeFile(receipt,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
