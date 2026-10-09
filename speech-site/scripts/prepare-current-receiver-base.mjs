// Emergency restoration of the existing receipt/analytics interface only.
// No Slack import, startup dependency, hook, credential, journal or activation.
import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';import {build} from 'esbuild';
import {patchCurrentReceiver} from './prepare-current-receiver-slack.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const slackImport='import {attachAcceptedEnrolmentSlack as attachWebsiteEnrolmentSlack} from "./website-enrolment-slack.mjs";\n';
const slackHook=`  // Operational adapter/configuration is deliberately disabled until its
  // existing approved runtime reference and journal readiness are supplied.
  // This hook remains outside the intake/accept error boundary.
  await attachWebsiteEnrolmentSlack(result,{body:data,idempotencyKey,execute,enabled:false,waitUntil:task=>this.ctx.waitUntil(task)});
`;
export function patchCurrentReceiverBase(bytes){
 let source=patchCurrentReceiver(bytes);
 for(const exact of [slackImport,slackHook]){
  if(source.split(exact).length!==2)throw Error('Optional dependency boundary changed');
  source=source.replace(exact,'');
 }
 if(source.includes('attachWebsiteEnrolmentSlack')||source.includes('website-enrolment-slack.mjs'))throw Error('Optional dependency remains');
 return source;
}
export async function prepareCurrentReceiverBase({input='ask-private/slack-integration-20261009/live/index.js',output='ask-private/slack-integration-20261009/base-candidate'}={}){
 const bytes=await fs.readFile(input),candidate=patchCurrentReceiverBase(bytes);await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'index.js'),candidate);
 const modules=[{name:'index.js',sha256:sha(candidate),bytes:Buffer.byteLength(candidate)}];
 for(const [input,name]of [['deployment/enrolment-receipt.mjs','website-enrolment-receipt.mjs'],['deployment/enrolment-analytics.mjs','website-enrolment-analytics.mjs']]){
  const compiled=await build({entryPoints:[input],bundle:true,format:'esm',platform:'browser',target:'es2022',write:false,legalComments:'none'});const content=compiled.outputFiles[0].contents;await fs.writeFile(path.join(output,name),content);modules.push({name,sha256:sha(content),bytes:content.length});
 }
 const receipt={status:'base_only_candidate',at:new Date().toISOString(),worker:'pbn-planetscale',baselineSha256:sha(bytes),baselineVersion:'55197371-f210-4c51-8fa2-8bce1d934305',modules,receiverContractRestoration:true,slackEnabled:false,slackImported:false,otherLiveExportsPreserved:true,existingDatabaseOnly:true,bindingsChanged:false,migrationApplied:false,liveTest:false};
 await fs.writeFile(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await prepareCurrentReceiverBase()));
