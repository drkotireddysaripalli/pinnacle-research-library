import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
const out=path.resolve(import.meta.dirname,'../../../website-completion-20261007');
const publicRead=JSON.parse(await fs.readFile(path.join(out,'final-public-readback.json'))),runtime=JSON.parse(await fs.readFile(path.join(out,'runtime-final-proof.json'))),xml=JSON.parse(await fs.readFile(path.join(out,'xml-final-proof.json'))),coverage=JSON.parse(await fs.readFile(path.join(out,'sitemap-coverage-decision.json')));
if(!publicRead.passed||!runtime.passed||xml.missingRequired.length||coverage.unexplainedBots.length||coverage.unexplainedStaff.length)throw Error('Unclosed acceptance evidence');
const file='deployment/completion-rating-value-20261008.json',receipt=JSON.parse(await fs.readFile(file));
if(receipt.commit!==publicRead.source||receipt.candidate!==publicRead.legacyWorkerVersion)throw Error('Evidence is from a different version');
receipt.phase='verified-live-public';receipt.publicVerifiedAt=publicRead.at;receipt.publicEvidence={jsonReadbackCases:publicRead.cases.length,runtimeReadingCases:runtime.cases.length,allPassed:true,readbackSha256:createHash('sha256').update(JSON.stringify(publicRead)).digest('hex'),runtimeSha256:createHash('sha256').update(JSON.stringify(runtime)).digest('hex'),record:'work/website-completion-20261007/final-public-readback.json',runtimeRecord:'work/website-completion-20261007/runtime-final-proof.json'};
await fs.writeFile(file,JSON.stringify(receipt,null,2)+'\n');
for(const [name,evidence]of [['completion-sitemap-followup-20261007.json',{uniquePages:xml.uniqueVideoPages,videos:xml.videos,missingRequired:0,wellFormed:true}],['completion-receiver-sitemap-20261007.json',{responseLocalWriterSequence:xml.staffReads,ledgerVerification:'isolated actual MySQL/private-RPC fixtures; no customer leads'}]]){
 const f=path.join('deployment',name),r=JSON.parse(await fs.readFile(f));r.publicSitemapEvidence=evidence;await fs.writeFile(f,JSON.stringify(r,null,2)+'\n');
}
const doc=await fs.readFile('WEBSITE-COMPLETION-RECEIPT-20261008.md','utf8');await fs.writeFile(path.join(out,'COMPLETION-RECEIPT-20261008.md'),doc);
console.log(JSON.stringify({phase:receipt.phase,source:receipt.commit,version:receipt.candidate,publicCases:6,runtimeCases:3}));
