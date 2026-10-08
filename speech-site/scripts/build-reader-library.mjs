import fs from 'node:fs/promises';import {parse,serialize} from 'parse5';import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4330';
const response=await fetch(base+'/ask/reader-shell?assembly=knowledge-journey-20261008');assert.equal(response.status,200);
const doc=parse(await response.text()),find=(node,p)=>p(node)?node:(node.childNodes||[]).map(n=>find(n,p)).find(Boolean);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const head=find(doc,n=>n.tagName==='head'),reader=find(doc,n=>attr(n,'data-reader-shell')!==undefined),journey=find(doc,n=>attr(n,'data-reader-journey')!==undefined),asset=find(doc,n=>attr(n,'data-reader-measurement')!==undefined);
assert(head&&reader&&journey&&asset);const measurement=attr(asset,'href');assert(measurement.startsWith('/ask/_assets/'));
const headHTML=(head.childNodes||[]).filter(n=>n.tagName==='style'||n.tagName==='link').map(n=>serialize({childNodes:[n]})).join('');
const value={head:headHTML,html:serialize(reader),journey:serialize(journey),measurement};
assert(value.html.includes('ask-reader-gate')&&value.html.includes('data-ask-profile')&&value.html.includes('type="module"'));assert(!value.html.includes('profile.name'));
await fs.mkdir('ask-private/knowledge-journey-20261008',{recursive:true});await fs.writeFile('ask-private/knowledge-journey-20261008/reader.json',JSON.stringify(value));
// Keep the generated runtime module reproducible from its maintained source.
await fs.writeFile('deployment/mirracles-library.mjs',(await fs.readFile('deployment/mirracles-library-20261008/library.mjs','utf8')).replace("from './assets.mjs'","from './mirracles-library-assets.mjs'"));
console.log(JSON.stringify({readerBytes:Buffer.byteLength(JSON.stringify(value)),measurement,sharedGoogle:true}));
