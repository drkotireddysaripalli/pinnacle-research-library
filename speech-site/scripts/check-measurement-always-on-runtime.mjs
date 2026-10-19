import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),parent=path.dirname(root);
const forbidden=/(?:website-preferences|data-measurement-choice|data-ad-call-choice|optional analytics preferences|keep analytics off|allow analytics|optional advertising call measurement|keep call measurement off|allow call measurement|analytics is off until|call measurement is off)/i;
const walk=async dir=>{
 const out=[];
 for(const entry of await fs.readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())out.push(...await walk(file));
  else if(/\.(?:html|js|mjs)$/.test(entry.name))out.push(file);
 }
 return out;
};
const files=[
 ...await walk(path.join(root,'dist')),
 ...await walk(path.join(parent,'verify-site','dist')),
 ...['page.html','preview.html','phone-analytics.js','worker.mjs'].map(name=>path.join(parent,'helpline-site',name)),
 ...['src/components/SiteFooter.astro','src/components/PolicyPage.astro','src/lib/google-ads-call-consent.mjs',
   'public/pinnacle-pages-scripts/speech-measurement.js','public/pinnacle-pages-scripts/cheq-protection.js',
   'deployment/book-attribution-assets.mjs','deployment/public-ad-call.mjs','deployment/public-ad-call-handler.mjs',
   'deployment/contact-receipt.mjs','deployment/contact-receipt-assets.mjs',
   'deployment/pinnacle-route-v12.mjs','deployment/shared-navigation.mjs'].map(name=>path.join(root,name))
];
const violations=[];
for(const file of files){const text=await fs.readFile(file,'utf8');if(forbidden.test(text))violations.push(path.relative(parent,file));}
assert.deepEqual(violations,[],'Visitor measurement choices remain in active runtime files');
const hashes={};
for(const name of [
 'public/pinnacle-pages-scripts/speech-measurement.js',
 'public/pinnacle-pages-scripts/cheq-protection.js',
 'public/pinnacle-pages-scripts/protection-consumer.mjs',
 'public/pinnacle-pages-scripts/centre-operating-holds.mjs',
 'deployment/book-attribution-assets.mjs',
 'deployment/contact-receipt.mjs',
 'deployment/contact-receipt-assets.mjs',
 'deployment/legacy-measurement.runtime.mjs',
 'deployment/public-ad-call.mjs'
]){const bytes=await fs.readFile(path.join(root,name));hashes[name]=createHash('sha256').update(bytes).digest('hex');}
const collector=await fs.readFile(path.join(root,'public/pinnacle-pages-scripts/speech-measurement.js'),'utf8');
for(const required of ["measurement_mode:'automatic'","analytics_storage:'granted'","ad_storage:'granted'","ad_user_data:'granted'","ad_personalization:'denied'","gtag('set','ads_data_redaction',false)"])assert(collector.includes(required),required);
for(const unwanted of ['navigator.globalPrivacyControl','data-measurement-choice','website-preferences'])assert(!collector.includes(unwanted),unwanted);
console.log(JSON.stringify({passed:true,scannedFiles:files.length,violations,hashes},null,2));
