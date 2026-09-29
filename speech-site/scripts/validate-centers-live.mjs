import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const origin='https://www.pinnacleblooms.org';
const aliases=['/centers/','/Centers','/Centers/','/centres','/centres/','/Centres','/Centres/','/locations','/locations/','/Locations','/Locations/'];
const assetPaths=['/pinnacle-pages-data/centers-evidence.json','/pinnacle-pages-data/centers-evidence.txt','/pinnacle-pages-data/centers-machine.md','/pinnacle-pages-data/centre-directory.json','/sitemap.xml','/sitemaps/centres.xml','/llms.txt','/speech-therapy/llms.txt'];
const results=[];
for(const path of ['/centers',...aliases,...assetPaths]){
  const useQuery=path==='/centers'||aliases.includes(path);
  const response=await fetch(origin+path+(useQuery?'?release_check=1':''),{redirect:'manual',headers:{'cache-control':'no-cache'}});
  const body=await response.arrayBuffer();
  results.push({path,status:response.status,location:response.headers.get('location'),contentType:response.headers.get('content-type'),bytes:body.byteLength});
}
const page=await fetch(origin+'/centers',{headers:{accept:'text/html','cache-control':'no-cache'}});
const html=await page.text();
const markdownResponse=await fetch(origin+'/centers',{headers:{accept:'text/markdown','cache-control':'no-cache'}});
const markdown=await markdownResponse.text();
const profile=await fetch(origin+'/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india',{redirect:'manual',headers:{'cache-control':'no-cache'}});
const report={checkedAt:new Date().toISOString(),results,page:{status:page.status,title:(html.match(/<title>(.*?)<\/title>/s)||[])[1],canonical:(html.match(/<link rel="canonical" href="([^"]+)"/)||[])[1],robots:(html.match(/<meta name="robots" content="([^"]+)"/)||[])[1],hasPhone:html.includes('9100 181 181'),hasVerify:html.includes('/verify/'),hasEvidenceJson:html.includes('centers-evidence.json'),faqCount:(html.match(/"@type":"Question"/g)||[]).length,cards:(html.match(/data-centre-name=/g)||[]).length},markdown:{status:markdownResponse.status,contentType:markdownResponse.headers.get('content-type'),vary:markdownResponse.headers.get('vary'),contentSignal:markdownResponse.headers.get('content-signal'),bytes:Buffer.byteLength(markdown),hasDirectory:markdown.includes('62 published Pinnacle location records'),hasPhone:markdown.includes('9100181181')},originProfile:{status:profile.status,location:profile.headers.get('location')}};
await writeFile('deployment/centers-live-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
assert.equal(page.status,200);assert.equal(report.page.canonical,origin+'/centers');assert(report.page.hasPhone&&report.page.hasVerify&&report.page.hasEvidenceJson);assert.equal(report.page.faqCount,12);assert.equal(report.page.cards,62);
for(const alias of aliases){const row=results.find(item=>item.path===alias);assert.equal(row.status,301,alias);assert.equal(row.location,origin+'/centers?release_check=1',alias);}
for(const path of assetPaths)assert.equal(results.find(item=>item.path===path).status,200,path);
assert.equal(markdownResponse.status,200);assert(markdownResponse.headers.get('content-type')?.includes('text/markdown'));assert.equal(report.markdown.contentSignal,'search=yes, ai-input=yes');assert(report.markdown.hasDirectory&&report.markdown.hasPhone);assert.equal(profile.status,200,'Existing centre profile must remain origin-owned');
