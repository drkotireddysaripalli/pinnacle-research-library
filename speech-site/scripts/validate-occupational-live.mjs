import {writeFile} from 'node:fs/promises';

const origin='https://www.pinnacleblooms.org';
const canonical='/best-occupational-therapy-center-india-proven-improvement-rate';
const protectedPaths=[
  canonical,
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/verify/',
  '/verify/evidence/records/fsc.html',
  '/verify/evidence/pinnacleai-regulatory-journey.html',
  '/national-autism-helpline'
];

const pages=[];
for(const path of protectedPaths){
  const response=await fetch(origin+path,{headers:{accept:'text/html','cache-control':'no-cache'}});
  const body=await response.text();
  pages.push({
    path,status:response.status,type:response.headers.get('content-type'),bytes:Buffer.byteLength(body),
    canonical:path===canonical?body.match(/<link rel="canonical" href="([^"]+)"/)?.[1]:undefined,
    hasPhone:body.includes('9100 181 181')||body.includes('9100181181'),
    hasSharedHeader:path===canonical?body.includes('Pinnacle approach, products and evidence'):undefined,
    hasSharedFooter:path===canonical?body.includes('Your confidence.')&&body.includes('Evidence, citations &amp; recognition'):undefined,
    hasFaq:path===canonical?body.includes('FAQPage'):undefined,
    hasEvidence:path===canonical?body.includes('occupational-therapy-evidence.json'):undefined
  });
}

const aliases=[];
for(const path of ['/occupational-therapy','/t/occupational-therapy']){
  const response=await fetch(origin+path,{redirect:'manual'});
  aliases.push({path,status:response.status,location:response.headers.get('location')});
}

const discovery=[];
for(const path of ['/sitemap.xml','/speech-therapy/sitemap.xml','/llms.txt']){
  const response=await fetch(origin+path,{headers:{'cache-control':'no-cache'}});
  const body=await response.text();
  discovery.push({
    path,status:response.status,type:response.headers.get('content-type'),bytes:Buffer.byteLength(body),
    hasOccupational:body.includes(canonical),
    hasSpeechChild:path==='/sitemap.xml'?body.includes('/speech-therapy/sitemap.xml'):undefined,
    hasVerify:path==='/llms.txt'?body.includes('Pinnacle Verification Centre'):undefined
  });
}

const machine=[];
for(const path of ['/top-speech-therapy-center-india-proven-improvement-rate','/enroll-autism-speech-aba-therapies-india',canonical]){
  const response=await fetch(origin+path,{headers:{accept:'text/markdown','cache-control':'no-cache'}});
  const body=await response.text();
  machine.push({path,status:response.status,type:response.headers.get('content-type'),contentSignal:response.headers.get('content-signal'),isMarkdown:!body.startsWith('<!DOCTYPE')&&!body.startsWith('<html'),bytes:Buffer.byteLength(body)});
}

const ot=pages.find(page=>page.path===canonical);
const report={checkedAt:new Date().toISOString(),pages,aliases,discovery,machine};
await writeFile(new URL('../deployment/occupational-live-20260929.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

const coreOk=pages.every(page=>page.status===200)&&ot.canonical===origin+canonical&&ot.hasPhone&&ot.hasSharedHeader&&ot.hasSharedFooter&&ot.hasFaq&&ot.hasEvidence&&aliases.every(item=>item.status===301&&item.location===origin+canonical)&&discovery.every(item=>item.status===200)&&discovery.find(item=>item.path==='/sitemap.xml')?.hasSpeechChild&&discovery.find(item=>item.path==='/speech-therapy/sitemap.xml')?.hasOccupational&&discovery.find(item=>item.path==='/llms.txt')?.hasOccupational&&machine.every(item=>item.status===200&&item.type?.startsWith('text/markdown')&&item.contentSignal==='search=yes, ai-input=yes'&&item.isMarkdown);
if(!coreOk)process.exitCode=1;
