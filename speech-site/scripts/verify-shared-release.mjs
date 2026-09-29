import fs from 'node:fs/promises';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const before=await fs.readFile('deployment/live-before-20260928/exact-pinnacle-route-v12.mjs','utf8'),after=await fs.readFile('deployment/pinnacle-route-v12.mjs','utf8');
const shared=s=>s.replace(/^import \{serveSpeechEnquiry\}[^\n]*\n/m,'').replace(/^import \{serveSpeech\}[^\n]*\n/m,'').replace(/^import \{serveEnrolmentApi\}[^\n]*\n/m,'').replace(/^const SPEECH_INVENTORY=[^\n]*\n/m,'').replace('  const enrolmentApiResponse=await serveEnrolmentApi(request,env);if(enrolmentApiResponse)return enrolmentApiResponse;\n','').replace('  const enquiryResponse=await serveSpeechEnquiry(request,env);if(enquiryResponse)return enquiryResponse;\n','').replace('  const speechResponse=await serveSpeech(request,env,SPEECH_INVENTORY);if(speechResponse)return speechResponse;\n','');
assert.equal(shared(after),shared(before),'Existing shared Worker code must remain identical');
const inventory=JSON.parse(after.match(/const STATIC_FILES = (\{[^\n]+\})/)[1]);
const stage=process.argv[2]||'../.cloudflare-static-assets-private/speech-stage-20260928/files';let count=0;
for(const [p,hash]of Object.entries(inventory)){const bytes=await fs.readFile(stage+p);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16),hash,p);count++;}
console.log(JSON.stringify({sharedWorkerUnchanged:true,verifyAssetsMatched:count}));
