import {writeFile} from 'node:fs/promises';

const origin='https://www.pinnacleblooms.org';
const paths=[
  '/autism-therapy',
  '/autism-therapy/',
  '/t/autism-therapy',
  '/pinnacle-pages-data/autism-therapy-evidence.json',
  '/pinnacle-pages-data/autism-therapy-evidence.txt',
  '/pinnacle-pages-data/autism-therapy-machine.md',
  '/sitemap.xml',
  '/speech-therapy/sitemap.xml',
  '/llms.txt',
  '/speech-therapy/llms.txt'
];

const results=[];
for(const path of paths){
  const response=await fetch(origin+path,{redirect:'manual',headers:{'cache-control':'no-cache'}});
  const body=await response.arrayBuffer();
  results.push({
    path,
    status:response.status,
    location:response.headers.get('location'),
    contentType:response.headers.get('content-type'),
    bytes:body.byteLength
  });
}

const page=await fetch(origin+'/autism-therapy',{headers:{accept:'text/html','cache-control':'no-cache'}});
const html=await page.text();
const markdownResponse=await fetch(origin+'/autism-therapy',{headers:{accept:'text/markdown','cache-control':'no-cache'}});
const markdown=await markdownResponse.text();
const report={
  checkedAt:new Date().toISOString(),
  results,
  page:{
    status:page.status,
    title:(html.match(/<title>(.*?)<\/title>/s)||[])[1],
    canonical:(html.match(/<link rel="canonical" href="([^"]+)"/)||[])[1],
    robots:(html.match(/<meta name="robots" content="([^"]+)"/)||[])[1],
    hasPhone:html.includes('9100 181 181'),
    hasVerify:html.includes('/verify/'),
    hasEvidenceJson:html.includes('autism-therapy-evidence.json'),
    faqCount:(html.match(/"@type":"Question"/g)||[]).length,
    legacyUnsafe:['temporary cure',"world's no.1",'patented in 160'].filter((text)=>html.toLowerCase().includes(text))
  },
  markdown:{
    status:markdownResponse.status,
    contentType:markdownResponse.headers.get('content-type'),
    vary:markdownResponse.headers.get('vary'),
    contentSignal:markdownResponse.headers.get('content-signal'),
    bytes:Buffer.byteLength(markdown),
    hasDirectAnswer:markdown.includes('It is not one fixed programme or a compulsory bundle'),
    hasPhone:markdown.includes('9100181181')
  }
};

await writeFile('deployment/autism-therapy-live-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

if(
  page.status!==200 ||
  report.page.canonical!==origin+'/autism-therapy' ||
  !report.page.hasPhone ||
  !report.page.hasVerify ||
  !report.page.hasEvidenceJson ||
  report.page.faqCount!==15 ||
  report.page.legacyUnsafe.length ||
  markdownResponse.status!==200 ||
  !report.markdown.contentType?.includes('text/markdown') ||
  report.markdown.contentSignal!=='search=yes, ai-input=yes' ||
  !report.markdown.hasDirectAnswer ||
  !report.markdown.hasPhone
) process.exitCode=1;
