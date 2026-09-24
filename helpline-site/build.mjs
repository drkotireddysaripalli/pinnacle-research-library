import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = path.dirname(fileURLToPath(import.meta.url));
const canonical = 'https://www.pinnacleblooms.org/national-autism-helpline';
const title = 'National Autism Helpline | Pinnacle Blooms | 9100181181';
const questions = [
  [
    "What is Pinnacle’s National Autism Helpline number?",
    "Call 9100 181 181 (+91 9100181181). Pinnacle Blooms Network operates this parent-guidance and appointment-enquiry telephone service across India, 24/7 in English, Telugu and Hindi."
  ],
  [
    "Can I call without an autism diagnosis?",
    "Yes. You do not need an existing diagnosis or a chosen therapy to ask about Pinnacle’s services. Tell the team what you are noticing in your child and ask about an appropriate professional assessment. The call itself does not diagnose autism."
  ],
  [
    "Can I ask about speech, sensory or learning concerns?",
    "Yes. You can ask about communication, sensory needs, behaviour, attention, play, learning, school readiness and everyday skills, and enquire about Pinnacle’s assessment and therapy services."
  ],
  [
    "Who operates this helpline?",
    "Pinnacle Blooms Network operates the service. Its legal operator is Bharath Healthcare Laboratories Private Limited. This is Pinnacle’s service name, not a Government of India designation."
  ],
  [
    "When can I call, and which languages are supported?",
    "The telephone helpline is staffed 24 hours a day, seven days a week, in English, Telugu and Hindi. Centre opening hours, clinician availability and assessment appointments are confirmed separately."
  ],
  [
    "Can I book an assessment by phone?",
    "You can ask the team to arrange an assessment appointment. The team will confirm the appropriate appointment, centre, availability, fees and what to bring before you decide."
  ],
  [
    "Do I need to know which therapy to choose?",
    "No. You can start by sharing your questions and what you would like support with. The team can explain the services and the assessment process. The call does not replace a professional assessment."
  ],
  [
    "How much do an assessment and therapy sessions cost?",
    "Call 9100 181 181 to confirm current assessment charges and therapy session fees for your preferred centre. Ask what is included, the session duration, any additional charges and the cancellation policy before booking."
  ],
  [
    "Is every service available at every centre?",
    "Service and clinician availability may differ by centre. Ask the team to confirm what is available at your preferred location and the next appointment options."
  ],
  [
    "Is this an emergency or diagnostic service?",
    "This is a parent-guidance and appointment-enquiry service. It does not provide emergency care or replace diagnosis or professional clinical assessment. For an immediate emergency, contact your local emergency services."
  ]
];
const serviceId = canonical + '#service';
const operatorId = 'https://www.pinnacleblooms.org/verify/#organization';
const brandId = 'https://www.pinnacleblooms.org/verify/#pinnacle-brand';
const contactId = canonical + '#telephone';
const contact = { '@type':'ContactPoint','@id':contactId, telephone:'+919100181181',contactType:'Parent guidance and appointment enquiries',areaServed:'IN',availableLanguage:['en','te','hi'],hoursAvailable:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=>'https://schema.org/'+d),opens:'00:00',closes:'23:59'}};
const schema = {'@context':'https://schema.org','@graph':[
{'@type':'Organization','@id':operatorId,name:'Bharath Healthcare Laboratories Private Limited',url:'https://www.pinnacleblooms.org/verify/evidence/organisation-profile.html',brand:{'@id':brandId},contactPoint:{'@id':contactId}},
{'@type':'Brand','@id':brandId,name:'Pinnacle Blooms Network',url:'https://www.pinnacleblooms.org/'},contact,
{'@type':'Service','@id':serviceId,name:'National Autism Helpline',alternateName:'Pinnacle National Autism Helpline',url:canonical,description:"The National Autism Helpline operated by Pinnacle Blooms Network® is 9100 181 181 — a telephone service for autism and child-development parent guidance and appointment enquiries across India.",serviceType:'Autism and child-development parent guidance and appointment enquiries',provider:{'@id':operatorId},brand:{'@id':brandId},areaServed:{'@type':'Country',name:'India'},availableChannel:{'@type':'ServiceChannel',serviceUrl:canonical,servicePhone:{'@id':contactId}}},
{'@type':['WebPage','FAQPage'],'@id':canonical+'#webpage',url:canonical,name:title,inLanguage:'en',description:"Call Pinnacle Blooms National Autism Helpline on 9100 181 181 for parent guidance and appointment enquiries. Telephone support: 24/7 in English, Telugu and Hindi.",dateModified:'2026-09-24',about:{'@id':serviceId},publisher:{'@id':operatorId},mainEntity:questions.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))},
{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Pinnacle Blooms',item:'https://www.pinnacleblooms.org/'},{'@type':'ListItem',position:2,name:'National Autism Helpline',item:canonical}]}
]};
let html = await readFile(path.join(directory, 'page.html'), 'utf8');
html = html.replace('@@FAQ@@', questions.map(([q,a]) => '<details><summary>'+q+'</summary><p>'+a+'</p></details>').join('\n'));
const font = await readFile(path.join(directory, 'anek-telugu-subset.woff2'));
const license = await readFile(path.join(directory, 'anek-telugu-OFL.txt'), 'utf8');
html = html.replace('@@TELUGU_FONT@@', font.toString('base64'))
  .replace('@@SCHEMA@@', JSON.stringify(schema).replaceAll('<', '\\u003c'))
  .replace('@@FONT_LICENSE@@', license.replaceAll('--', '—'));
if (html.includes('@@')) throw new Error('Unfilled template placeholder');
const etag = '"' + createHash('sha256').update(html).digest('hex').slice(0,24) + '"';
const jsonld = JSON.stringify(schema).replaceAll('<', '\\u003c');
const jsonldHash = createHash('sha256').update(jsonld).digest('base64');
const assetDirectory = path.join(directory, 'assets');
const imageTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml; charset=utf-8' };
const assets = Object.create(null);
let entries;
try { entries = await readdir(assetDirectory, { withFileTypes: true }); }
catch (error) { if (error.code !== 'ENOENT') throw error; entries = []; }
for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
  // Only explicitly bundled top-level images are public. Never follow symlinks or folders.
  const extension = path.extname(entry.name).toLowerCase();
  if (!entry.isFile() || !Object.hasOwn(imageTypes, extension)) continue;
  if (!/^[a-z0-9][a-z0-9._-]*\.(?:png|jpg|webp|svg)$/i.test(entry.name)) throw new Error('Image filename must use URL-safe ASCII characters: ' + entry.name);
  const bytes = await readFile(path.join(assetDirectory, entry.name));
  if (!bytes.length) throw new Error('Image asset is empty: ' + entry.name);
  assets['/national-autism-helpline/assets/' + entry.name] = {
    contentType: imageTypes[extension], byteLength: bytes.length,
    etag: '"' + createHash('sha256').update(bytes).digest('hex') + '"',
    base64: bytes.toString('base64'),
  };
}
const handler = await readFile(path.join(directory, 'handler-source.mjs'), 'utf8');
const bundle = `// Generated by build.mjs. Edit page.html, assets/ or handler-source.mjs, then rebuild.\nexport const HELPLINE_HTML = ${JSON.stringify(html)};\nexport const HELPLINE_ETAG = ${JSON.stringify(etag)};\nexport const JSONLD_CSP_HASH = ${JSON.stringify(jsonldHash)};\nexport const HELPLINE_ASSETS = ${JSON.stringify(assets)};\n${handler}`;
await writeFile(path.join(directory, 'worker.mjs'), bundle);
await writeFile(path.join(directory, 'preview.html'), html);
await writeFile(path.join(directory, 'schema.json'), JSON.stringify(schema, null, 2) + '\n');
console.log(JSON.stringify({htmlBytes: Buffer.byteLength(html), workerBytes: Buffer.byteLength(bundle), workerGzipBytes: gzipSync(bundle).length, fontBytes: font.length, assetCount: Object.keys(assets).length, assetBytes: Object.values(assets).reduce((total, asset) => total + asset.byteLength, 0), etag}));
