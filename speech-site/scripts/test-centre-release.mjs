import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {selectedCentre} from '../deployment/speech-enquiry-handler.mjs';
import {centreFacilities} from '../deployment/centre-facilities.mjs';
const data=JSON.parse(await fs.readFile('src/data/centre-directory.json','utf8'));
const html=await fs.readFile('dist/index.html','utf8');
const links=[...html.matchAll(/href="([^"]+)"/g)].map(x=>x[1].replaceAll('&amp;','&'));
const choose=links.filter(x=>x.includes('entry=speech-assessment')&&x.includes('centre='));
assert.equal(data.length,62);assert.equal(Object.keys(centreFacilities).length,59);assert.equal(choose.length,59);
for(const link of choose){const u=new URL(link),c=selectedCentre(new Request(link));assert(c,'Every centre link must reach its routing ID');assert.equal(u.hash,'#speech-assessment-enquiry');assert.equal(c.id,data.find(d=>d.id===u.searchParams.get('centre')).facilityId);}
for(const q of ['centre=missing','centre=__proto__','centre=suchitra&centre=uppal','centre=9353254807'])assert.equal(selectedCentre(new Request('https://www.pinnacleblooms.org/?'+q)),null);
assert.notEqual(centreFacilities.uppal.id,centreFacilities.habsiguda.id);assert.notEqual(centreFacilities.suchitra.id,centreFacilities.suchitraii.id);
assert.equal(data.find(c=>c.id==='kakinada').region,'Andhra Pradesh');
assert.notEqual(data.find(c=>c.id==='madhurawada').mapsUrl,data.find(c=>c.id==='tirupati').mapsUrl);
const exported=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/centre-directory.json','utf8'));
assert.equal(exported.centres.length,62);assert(!JSON.stringify(exported).includes('facilityId'));assert(exported.centres.every(c=>c.nationalTelephone==='+919100181181'));
for(const c of data){const raw=await fs.readFile('dist/pinnacle-pages-data/centre-contacts/'+c.id+'.vcf','utf8');assert(raw.split('\r\n').every(l=>Buffer.byteLength(l)<=75));const v=raw.replace(/\r\n /g,'');assert(v.includes('N:;'));assert(v.includes('TEL;TYPE=WORK,VOICE:+919100181181'));assert(v.includes('#centre-'+c.id));}
const records=[...html.matchAll(/data-record-id="([^"]+)"/g)].map(x=>x[1]);assert.equal(records.length,36);assert.equal(new Set(records).size,36);
const images=[...html.matchAll(/(?:src|href)="(\/pinnacle-pages-assets\/[^"?]+)"/g)].map(x=>x[1]);for(const image of images)await fs.access('dist'+image);
const report={checkedAt:new Date().toISOString(),locations:62,routedCentres:59,recordCards:36,contactFiles:62,assetReferences:images.length,liveFormSubmitted:false,pass:true};await fs.writeFile('reviews/CENTRE-RELEASE-VALIDATION-20260928.json',JSON.stringify(report,null,2)+'\n');console.log(report);
