// Public configuration and OAuth redirect check. Does not sign in or send an OTP.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin='https://pinnacleblooms.org';
const providers=(process.argv[2]||'google,x').split(',');
const receiptFile=process.argv[3];
const result={at:new Date().toISOString(),scope:'Anonymous account controls and OAuth redirects; no completed identity or OTP test',checks:[]};
const response=await fetch(origin+'/ask/account',{redirect:'manual'});
assert.equal(response.status,200);
assert.match(response.headers.get('cache-control'),/no-store/);
assert.match(response.headers.get('x-robots-tag'),/noindex/);
const html=await response.text();
const rendered=[...html.matchAll(/action="\/ask\/auth\/(google|apple|azure|x)"/g)].map(m=>m[1]);
assert.deepEqual(rendered,providers);
const csrf=html.match(/name="csrf" value="([^"]+)"/)?.[1];
assert(csrf,'CSRF field must be present');
const cookie=response.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
result.checks.push({name:'private account page',status:response.status,providers:rendered,noStore:true,noindex:true});
const hosts={google:'accounts.google.com',x:'x.com',apple:'appleid.apple.com',azure:'login.microsoftonline.com'};
for(const provider of providers){
 const start=await fetch(origin+'/ask/auth/'+provider,{method:'POST',redirect:'manual',headers:{origin,cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,returnTo:'/ask'})});
 assert.equal(start.status,303);
 const supabase=new URL(start.headers.get('location'));
 assert.equal(supabase.hostname,'lyjwsaiqvgwyautowhlx.supabase.co');
 assert.equal(supabase.searchParams.get('provider'),provider);
 assert.equal(supabase.searchParams.get('code_challenge_method'),'s256');
 assert.equal(supabase.searchParams.get('redirect_to'),origin+'/ask/auth/callback');
 const redirect=await fetch(supabase,{redirect:'manual'});
 assert.equal(redirect.status,302);
 const destination=new URL(redirect.headers.get('location'));
 assert.equal(destination.hostname,hosts[provider]);
 assert.equal(destination.searchParams.get('redirect_uri'),'https://lyjwsaiqvgwyautowhlx.supabase.co/auth/v1/callback');
 result.checks.push({name:provider+' OAuth start',askStatus:303,supabaseStatus:302,destination:destination.origin+destination.pathname,pkce:true,callbackExact:true,scopes:destination.searchParams.get('scope')});
}
const ask=await fetch(origin+'/ask');assert.equal(ask.status,200);
const askHtml=await ask.text();assert.match(askHtml,/href="\/ask\/account"/);
result.checks.push({name:'public Ask and Account link',status:ask.status});
if(receiptFile)await fs.writeFile(receiptFile,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
