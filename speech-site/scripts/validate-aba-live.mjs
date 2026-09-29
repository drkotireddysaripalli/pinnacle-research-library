import {writeFile} from 'node:fs/promises';

const origin='https://www.pinnacleblooms.org';
const canonical='/best-aba-therapy-center-india-proven-improvement-rate';
const protectedPaths=[
  canonical,
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/best-occupational-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/verify/',
  '/verify/evidence/records/fsc.html',
  '/verify/evidence/pinnacleai-regulatory-journey.html',
  '/national-autism-helpline',
  '/payonline'
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
    hasEvidence:path===canonical?body.includes('aba-therapy-evidence.json'):undefined,
    hasIndexDirective:path===canonical?body.includes('index, follow, max-image-preview:large'):undefined
  });
}

const aliases=[];
for(const path of ['/aba-therapy','/aba-therapy/','/t/aba-therapy','/t/aba-therapy/',canonical+'/']){
  const response=await fetch(origin+path+'?utm_source=release-check',{redirect:'manual'});
  aliases.push({path,status:response.status,location:response.headers.get('location')});
}

const discovery=[];
for(const path of ['/sitemap.xml','/speech-therapy/sitemap.xml','/llms.txt','/speech-therapy/llms.txt']){
  const response=await fetch(origin+path,{headers:{'cache-control':'no-cache'}});
  const body=await response.text();
  discovery.push({
    path,status:response.status,type:response.headers.get('content-type'),bytes:Buffer.byteLength(body),
    hasAba:body.includes(canonical),
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

const page=pages.find(item=>item.path===canonical);
const og=page?.status===200?(await (await fetch(origin+(await (await fetch(origin+canonical)).text()).match(/<meta property="og:image" content="([^"]+)"/)?.[1]?.replace(origin,'')||'/missing')).arrayBuffer()).byteLength:0;
const report={checkedAt:new Date().toISOString(),pages,aliases,discovery,machine,openGraphBytes:og};
await writeFile(new URL('../deployment/aba-live-20260929.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

const expected=origin+canonical+'?utm_source=release-check';
const coreOk=pages.every(item=>item.status===200)&&page.canonical===origin+canonical&&page.hasPhone&&page.hasSharedHeader&&page.hasSharedFooter&&page.hasFaq&&page.hasEvidence&&page.hasIndexDirective&&aliases.every(item=>item.status===301&&item.location===expected)&&discovery.every(item=>item.status===200)&&discovery.find(item=>item.path==='/sitemap.xml')?.hasSpeechChild&&discovery.find(item=>item.path==='/speech-therapy/sitemap.xml')?.hasAba&&discovery.find(item=>item.path==='/llms.txt')?.hasAba&&discovery.find(item=>item.path==='/speech-therapy/llms.txt')?.hasAba&&machine.every(item=>item.status===200&&item.type?.startsWith('text/markdown')&&item.contentSignal==='search=yes, ai-input=yes'&&item.isMarkdown)&&og>0;
if(!coreOk)process.exitCode=1;
