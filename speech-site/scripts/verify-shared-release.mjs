import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const workerPath='deployment/pinnacle-route-v12.mjs';
const worker=await fs.readFile(workerPath,'utf8');
const release=path.resolve(process.argv[2]||'release-special-education-v116-20260929');

function parseInventory(name){
  const match=worker.match(new RegExp(`const ${name} ?= ?(\\{[^\\n]+\\});`));
  assert(match,`${name} must be embedded in the Worker`);
  return JSON.parse(match[1]);
}

async function verifyInventory(name,inventory){
  let count=0;
  for(const [publicPath,expected] of Object.entries(inventory)){
    const file=path.join(release,...publicPath.split('/').filter(Boolean));
    const bytes=await fs.readFile(file);
    const actual=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16);
    assert.equal(actual,expected,`${name}: ${publicPath}`);
    count++;
  }
  return count;
}

const staticFiles=parseInventory('STATIC_FILES');
const speechInventory=parseInventory('SPEECH_INVENTORY');
const staticCount=await verifyInventory('STATIC_FILES',staticFiles);
const speechCount=await verifyInventory('SPEECH_INVENTORY',speechInventory);

for(const required of [
  '/pinnacle-pages-html/special-education.html',
  '/pinnacle-pages-data/special-education-machine.md',
  '/pinnacle-pages-data/special-education-evidence.json',
  '/pinnacle-pages-data/special-education-evidence.txt',
  '/pinnacle-pages-html/assessment.html',
  '/pinnacle-pages-data/assessment-machine.md',
  '/pinnacle-pages-data/assessment-evidence.json',
  '/pinnacle-pages-data/assessment-evidence.txt'
]) assert(required in speechInventory,`Missing Special Education release asset: ${required}`);

assert(worker.includes("import {serveRootDiscovery} from './discovery-handler.mjs';"),'Root discovery handler must remain connected');
assert(worker.includes('serveRootDiscovery(request,env)'),'Root discovery must run in the request path');
assert(worker.includes('serveSpeech(request,env,SPEECH_INVENTORY)'),'Managed therapy routes must remain connected');
assert(worker.includes('serveEnrolmentApi(request,env)'),'Enrolment API route must remain connected');
assert(worker.includes('serveSpeechEnquiry(request,env)'),'Speech enquiry route must remain connected');

const socialImages=Object.keys(speechInventory).filter(key=>/special-education-share-20260929.*\.jpg$/.test(key));
assert.equal(socialImages.length,1,'Exactly one Special Education social image must ship');

console.log(JSON.stringify({
  release:path.basename(release),
  workerSha256:crypto.createHash('sha256').update(worker).digest('hex'),
  staticAssetsMatched:staticCount,
  managedAssetsMatched:speechCount,
  specialEducationAssetsVerified:5,
  sharedRouteContract:true
},null,2));
