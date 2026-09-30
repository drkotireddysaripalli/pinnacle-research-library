import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const origin='https://www.pinnacleblooms.org',release='release-shared-shell-v133-20261001';
const local=JSON.parse(await fs.readFile('deployment/shared-shell-responsive-local-v133-20261001.json','utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const knownAdsTags=['<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>'];
const owned=text=>knownAdsTags.reduce((value,tag)=>value.replace(tag,''),text);
const controls=['/verify/','/verify/evidence/records/fsc.html','/verify/evidence/fsc.pdf','/national-autism-helpline','/robots.txt','/sitemap.xml','/sitemaps/core.xml','/pinnacle-ai-innovations-revolutionizing-autism-history','/abilityscore-global-study','/therapeuticai-effectiveness-study','/centers/best-autism-speech-aba-occupational-therapy-center-suchitra2-hyderabad-telangana-india','/centers/best-autism-speech-aba-occupational-therapy-center-jntu-hyderabad-telangana-india'];
const baseline='deployment/shared-shell-protected-before-v133-20261001.json';
async function get(path){const response=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(45000),headers:{'cache-control':'no-cache'}});const bytes=Buffer.from(await response.arrayBuffer());assert.equal(response.status,200,path);return{response,bytes,text:bytes.toString('utf8')};}
if(process.argv.includes('--before')){
 const results=[];for(const path of controls){const result=await get(path);results.push({path,status:result.response.status,bytes:result.bytes.length,sha256:sha(result.bytes)});}
 await fs.writeFile(baseline,JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');console.log(JSON.stringify({baseline,protected:results.length}));process.exit(0);
}
const shells=[],assets=new Set();let firstHeader,firstFooter;
for(const record of local.bodyResults){
 const result=await get(record.path),candidate=await fs.readFile(release+'/pinnacle-pages-html/'+record.file);
 assert.equal(sha(Buffer.from(owned(result.text))),sha(candidate),record.path+' owned HTML');
 const main=result.text.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];assert.equal(sha(main),record.acceptedMainSha256,record.path+' accepted body');
 const header=result.text.match(/<header\b[\s\S]*?<\/header>/)[0].replace(/ aria-current="page"/g,'').replace(/ is-current/g,'');
 const footer=result.text.match(/<footer\b[\s\S]*?<\/footer>/)[0];assert(footer.includes('verify-footer'));
 firstHeader??=header;firstFooter??=footer;assert.equal(header,firstHeader,record.path+' common header');assert.equal(footer,firstFooter,record.path+' common footer');
 assert.equal((footer.match(/data-record-id=/g)||[]).length,36);
 for(const match of result.text.matchAll(/<link\b[^>]*href="(\/pinnacle-pages-assets\/[^"?]+\.css)"/g))assets.add(match[1]);
 shells.push({path:record.path,status:200,ownedStagedHtmlMatched:true,acceptedBodyUnchanged:true,commonHeader:true,commonFooter:true,knownExternalAdsTags:knownAdsTags.filter(tag=>result.text.includes(tag)).length});
}
const matches=[];for(const path of assets){const result=await get(path);assert.equal(sha(result.bytes),sha(await fs.readFile(release+path)),path);matches.push({path,status:200,sha256:sha(result.bytes)});}
const previous=JSON.parse(await fs.readFile(baseline,'utf8')),protectedResults=[];
for(const old of previous.results){const result=await get(old.path);assert.equal(sha(result.bytes),old.sha256,old.path+' protected bytes');protectedResults.push({...old,unchanged:true});}
const output='deployment/shared-shell-live-v133-20261001.json';await fs.writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),shells,matches,protectedResults,knownAdsTagsAccountedFor:true,noEnquirySubmitted:true,noIndexNowRepeat:true},null,2)+'\n');
console.log(JSON.stringify({output,sharedPagesMatched:shells.length,acceptedBodiesUnchanged:shells.length,stylesMatched:matches.length,protectedUnchanged:protectedResults.length}));
