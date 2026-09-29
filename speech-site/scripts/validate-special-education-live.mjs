import {writeFile} from 'node:fs/promises';

const origin='https://www.pinnacleblooms.org';
const canonical='/best-special-education-center-call-9100181181';
const releaseCheck='release_check='+Date.now();
const protectedPaths=[canonical,'/top-speech-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/enroll-autism-speech-aba-therapies-india','/verify/','/national-autism-helpline','/payonline'];

const pages=[];
for(const path of protectedPaths){
  const response=await fetch(origin+path,{headers:{accept:'text/html','cache-control':'no-cache'}});
  const body=await response.text();
  pages.push({path,status:response.status,type:response.headers.get('content-type'),bytes:Buffer.byteLength(body),canonical:path===canonical?body.match(/<link rel="canonical" href="([^"]+)"/)?.[1]:undefined,hasPhone:body.includes('9100 181 181')||body.includes('9100181181'),hasSharedHeader:path===canonical?body.includes('Pinnacle approach, products and evidence'):undefined,hasSharedFooter:path===canonical?body.includes('Your confidence.')&&body.includes('Evidence, citations &amp; recognition'):undefined,hasFaq:path===canonical?body.includes('FAQPage'):undefined,hasEvidence:path===canonical?body.includes('special-education-evidence.json'):undefined,hasIndexDirective:path===canonical?body.includes('index, follow, max-image-preview:large'):undefined});
}

const aliases=[];
for(const path of ['/special-education','/special-education/','/Special-Education','/Special-Education/','/t/special-education','/t/special-education/',canonical+'/']){
  const response=await fetch(origin+path+'?'+releaseCheck,{redirect:'manual',headers:{'cache-control':'no-cache'}});
  aliases.push({path,status:response.status,location:response.headers.get('location')});
}

const discovery=[];
for(const path of ['/sitemap.xml','/speech-therapy/sitemap.xml','/llms.txt','/speech-therapy/llms.txt']){
  const response=await fetch(origin+path,{headers:{'cache-control':'no-cache'}});const body=await response.text();
  discovery.push({path,status:response.status,type:response.headers.get('content-type'),bytes:Buffer.byteLength(body),hasSpecialEducation:body.includes(canonical),hasSpeechChild:path==='/sitemap.xml'?body.includes('/speech-therapy/sitemap.xml'):undefined,hasVerify:path==='/llms.txt'?body.includes('Pinnacle Verification Centre'):undefined});
}

const markdownResponse=await fetch(origin+canonical,{headers:{accept:'text/markdown','cache-control':'no-cache'}});const markdown=await markdownResponse.text();
const machine={status:markdownResponse.status,type:markdownResponse.headers.get('content-type'),contentSignal:markdownResponse.headers.get('content-signal'),isMarkdown:!markdown.startsWith('<!DOCTYPE')&&!markdown.startsWith('<html'),bytes:Buffer.byteLength(markdown),hasOperator:markdown.includes('Bharath Healthcare Laboratories Private Limited'),hasPhone:markdown.includes('9100 181 181')};
const page=pages.find(item=>item.path===canonical);
const liveHtml=await (await fetch(origin+canonical,{headers:{'cache-control':'no-cache'}})).text();
const ogUrl=liveHtml.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
const og=ogUrl?await fetch(ogUrl,{headers:{'cache-control':'no-cache'}}):null;
const report={checkedAt:new Date().toISOString(),pages,aliases,discovery,machine,openGraph:{url:ogUrl,status:og?.status,type:og?.headers.get('content-type'),bytes:og?Number(og.headers.get('content-length')||0):0}};
await writeFile(new URL('../deployment/special-education-live-20260929.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

const expected=origin+canonical+'?'+releaseCheck;
// A legacy zone-level redirect owns only the exact no-slash alias and predates the
// managed Worker. It reaches the same canonical but drops query parameters. Every
// Worker-owned alias must preserve the release-check query.
const aliasesOk=aliases.every(item=>item.status===301&&item.location===(item.path==='/special-education'?origin+canonical:expected));
const coreOk=pages.every(item=>item.status===200)&&page.canonical===origin+canonical&&page.hasPhone&&page.hasSharedHeader&&page.hasSharedFooter&&page.hasFaq&&page.hasEvidence&&page.hasIndexDirective&&aliasesOk&&discovery.every(item=>item.status===200)&&discovery.find(item=>item.path==='/sitemap.xml')?.hasSpeechChild&&discovery.find(item=>item.path==='/speech-therapy/sitemap.xml')?.hasSpecialEducation&&discovery.find(item=>item.path==='/llms.txt')?.hasSpecialEducation&&discovery.find(item=>item.path==='/speech-therapy/llms.txt')?.hasSpecialEducation&&machine.status===200&&machine.type?.startsWith('text/markdown')&&machine.contentSignal==='search=yes, ai-input=yes'&&machine.isMarkdown&&machine.hasOperator&&machine.hasPhone&&og?.status===200&&og?.headers.get('content-type')?.startsWith('image/jpeg');
if(!coreOk)process.exitCode=1;
