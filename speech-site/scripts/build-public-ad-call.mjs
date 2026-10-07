// Deliver the shared source to existing public HTML without rebuilding page bodies.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {preferencesMarkup} from '../src/lib/google-ads-call-consent.mjs';
const source = await fs.readFile(new URL('../src/lib/google-ads-call-consent.mjs', import.meta.url), 'utf8');
const register = JSON.parse(await fs.readFile(new URL('../src/data/centre-register.json', import.meta.url), 'utf8'));
const pages = ['/', '/centers', '/autism-therapy', '/best-occupational-therapy-center-india-proven-improvement-rate', '/best-aba-therapy-center-india-proven-improvement-rate', '/best-special-education-center-call-9100181181', '/speech-aba-autism-assessments', '/enroll-autism-speech-aba-therapies-india', '/about-us', '/contact', '/top-speech-therapy-center-india-proven-improvement-rate', '/speech-therapy/service-information', ...register.centres.map(c => new URL(c.profileUrl).pathname)];
const hash = createHash('sha256').update(source).digest('hex').slice(0,16);
const output = `// Generated from the common consent source and centre register; no private data.\nexport const PUBLIC_AD_CALL_PATH='/pinnacle-pages-scripts/portal-ad-call-${hash}.mjs';\nexport const publicAdCallMarkup=${JSON.stringify(preferencesMarkup)};\nconst pages=new Set(${JSON.stringify([...new Set(pages)])});\nconst source=${JSON.stringify(source)};\nexport function publicAdCallPage(path){return pages.has(path);}\nexport function servePublicAdCall(request){const u=new URL(request.url);if(u.hostname!=='www.pinnacleblooms.org'||u.pathname!==PUBLIC_AD_CALL_PATH)return null;return new Response(['GET','HEAD'].includes(request.method)&&request.method!=='HEAD'?source:null,{status:['GET','HEAD'].includes(request.method)?200:405,headers:{'content-type':'application/javascript; charset=utf-8','cache-control':'public, max-age=31536000, immutable','x-content-type-options':'nosniff',allow:'GET, HEAD'}});}\n`;
await fs.writeFile(new URL('../deployment/public-ad-call.mjs', import.meta.url), output);
console.log(JSON.stringify({publicPages:new Set(pages).size,sourceHash:hash}));
