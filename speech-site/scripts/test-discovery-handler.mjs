import test from 'node:test';
import assert from 'node:assert/strict';
import {serveRootDiscovery} from '../deployment/discovery-handler.mjs';
const request=(path,method='GET')=>new Request('https://www.pinnacleblooms.org'+path,{method});
const env={ASSETS:{fetch:async()=>new Response('# Pinnacle Verification Centre\n',{headers:{'content-type':'text/plain'}})}};
test('root sitemap preserves the portal indexes and includes the managed child once',async()=>{const r=await serveRootDiscovery(request('/sitemap.xml'),env);const body=await r.text();assert.equal(r.status,200);assert.equal((body.match(/speech-therapy\/sitemap\.xml/g)||[]).length,1);assert(body.includes('<sitemapindex'));assert(body.includes('/sitemaps/core.xml'));assert(body.includes('/verify/sitemap.xml'));});
test('root llms retains Verify and adds service discovery',async()=>{const r=await serveRootDiscovery(request('/llms.txt'),env);const body=await r.text();assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'text/plain; charset=utf-8');assert(body.includes('# Pinnacle Verification Centre'));assert(body.includes('Occupational therapy for children'));assert(body.includes('Enrol at Pinnacle'));});
test('HEAD is bodyless and unrelated paths pass through',async()=>{const r=await serveRootDiscovery(request('/llms.txt','HEAD'),env);assert.equal(await r.text(),'');assert.equal(await serveRootDiscovery(request('/verify/'),env),null);});
