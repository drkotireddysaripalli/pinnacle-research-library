import test from 'node:test';import assert from 'node:assert/strict';
import {staffRoute} from '../deployment/legacy-social-metadata/staff-routes.mjs';
import {retiredStaffIds,currentStaffPaths} from '../deployment/legacy-social-metadata/staff-records.mjs';
import sitemap from '../deployment/root-sitemap/index.mjs';
const origin='https://www.pinnacleblooms.org';
test('retired public-profile records use Gone without redirecting to unrelated pages',async()=>{
 assert.equal(retiredStaffIds.size,1505);
 for(const id of retiredStaffIds){const r=staffRoute(new Request(origin+'/staff/old-profile/'+id));assert.equal(r.status,410);assert.equal(r.headers.get('location'),null);assert(r.headers.get('x-robots-tag').includes('noindex'));}
 const r=staffRoute(new Request(origin+'/staff/old-profile/72107'));const text=await r.text();assert(text.includes('href="/staff"'));assert(text.includes('tel:+919100181181'));assert(!text.includes('DELETEACTIVITY'));
 assert.equal(await staffRoute(new Request(origin+'/staff/old-profile/72107',{method:'HEAD'})).text(),'');
});
test('current profiles and one source conflict stay live; duplicate slugs canonicalise by current directory',()=>{
 assert.equal(Object.keys(currentStaffPaths).length,241);assert(!retiredStaffIds.has(45748));
 for(const path of Object.values(currentStaffPaths))assert.equal(staffRoute(new Request(origin+path)),null);
 const alias=staffRoute(new Request(origin+'/staff/-B-Naveen-Harshavardhan-/72543'));assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),origin+currentStaffPaths['72543']);
 for(const path of ['/staff','/staff-declaration','/staff/unknown/99999999','/staff/Sonia-honey/1954','/staff/72107','/ask','/verify'])assert.equal(staffRoute(new Request(origin+path)),null);
 assert.equal(staffRoute(new Request(origin+'/staff/old/72107',{method:'POST'})),null);
});
test('core sitemap removes redirect alias and adds the useful recovered collections',async()=>{
 const r=await sitemap.fetch(new Request(origin+'/sitemaps/core.xml'));assert.equal(r.status,200);const xml=await r.text();
 assert(xml.includes('/physiotherapy</loc>'));assert(!xml.includes('/physio-therapy</loc>'));assert(xml.includes('/franchise-autism-therapy-center</loc>'));
 for(const p of ['/faq','/sunshine','/allmirracles','/self-sufficient','/mainstream'])assert(xml.includes(p+'</loc>'));assert.equal([...xml.matchAll(/<loc>/g)].length,49);
});
