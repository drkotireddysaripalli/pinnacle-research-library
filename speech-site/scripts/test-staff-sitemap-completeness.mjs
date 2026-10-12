import test from 'node:test';import assert from 'node:assert/strict';
import worker from '../deployment/root-sitemap/index.mjs';
import {currentStaffPaths,retiredStaffIds} from '../deployment/legacy-social-metadata/staff-records.mjs';
const origin='https://www.pinnacleblooms.org',canonical=Object.values(currentStaffPaths)[0],id=canonical.split('/').at(-1);
const originalFetch=globalThis.fetch;
const fixture='<urlset><url><loc>'+origin+'/staff/wrong-case/'+id+'</loc><image:image><image:loc>https://example.org/photo.jpg</image:loc></image:image><lastmod>2020-01-01</lastmod></url><url><loc>'+origin+canonical+'</loc></url><url><loc>'+origin+'/staff/Unknown/999999999999999</loc></url><url><loc>'+origin+'/staff/Retired/'+[...retiredStaffIds][0]+'</loc></url></urlset>';
async function run(path,body=fixture,method='GET',status=200){globalThis.fetch=async()=>new Response(body,{status});try{return await worker.fetch(new Request(origin+path,{method}));}finally{globalThis.fetch=originalFetch;}}
test('dedicated staff map includes all maintained paths once and keeps unknown entries/images',async()=>{const r=await run('/sitemaps/staff.xml'),xml=await r.text(),locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);assert.equal(r.status,200);assert.equal(locs.length,Object.keys(currentStaffPaths).length+1);assert.equal(new Set(locs).size,locs.length);for(const p of Object.values(currentStaffPaths))assert(locs.includes(origin+p));assert(xml.includes('photo.jpg'));assert(xml.includes('/staff/Unknown/'));assert(!xml.includes('/staff/Retired/'));assert(!xml.includes('<lastmod>'));});
test('bots feed does not acquire another complete staff inventory',async()=>{const xml=await(await run('/sitemaps/bots.xml')).text();assert.equal([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].length,2);});
test('invalid and failed upstream remain failures',async()=>{assert.equal((await run('/sitemaps/staff.xml','<html>fallback</html>')).status,502);assert.equal((await run('/sitemaps/staff.xml','unavailable','GET',503)).status,502);});
test('HEAD exposes correct XML status with no response body',async()=>{const r=await run('/sitemaps/staff.xml',fixture,'HEAD');assert.equal(r.status,200);assert.equal(await r.text(),'');assert(r.headers.get('content-type').includes('xml'));});

