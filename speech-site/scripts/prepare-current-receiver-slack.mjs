// Candidate generation only. Never deploys, edits bindings or migrates a DB.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const sha=b=>createHash('sha256').update(b).digest('hex');
export const CURRENT_RECEIVER_SHA256='23ae2e8c4d14887c620409542fdd2401773cb1082cc1a24e1acd52047c671845';
const entrypoint=`
// Private service-binding RPC only; no new public fetch handler.
class WebsiteEnrolmentReceipts extends WebsiteReceiptWorkerEntrypoint {
 async analytics(cohort){
  await getPSConnection(this.env);
  const connection=globalConnection;
  if(!connection)throw Error("Receiving database unavailable");
  return readWebsiteEnquiryAnalytics((sql,params)=>connection.execute(sql,params),cohort);
 }
 async receive(data,idempotencyKey){
  await getPSConnection(this.env);
  globalEnv=this.env;globalEvent=this.ctx;
  const connection=globalConnection;
  const execute=connection?(sql,params)=>connection.execute(sql,params):null;
  const result=await receiveWebsiteEnrolmentReceipt(data,{
   idempotencyKey,ledger:execute?websiteEnrolmentSqlLedger(execute):null,
   handoff:async(legacy)=>{
    const write={};
    const user=await HandleLead(legacy.FormType,legacy.MobileNumber,legacy.Name,legacy.Message,"","",legacy.Title+"{#}"+legacy.Languages+"{#}"+legacy.FacilityIds,"","",legacy.Services+"","",legacy.EmailId,null,undefined,write);
    if(!write.reference)throw Error("Website enquiry write unconfirmed");
    if(this.ctx&&user?.IsNewLead==="NEWLEAD")this.ctx.waitUntil(ProcessWhatsAppMessages({AT:"WEBENROLL",TOId:user.Id,F7:user.Id,data:legacy},user));
    return write.reference;
   }
  });
  // Operational adapter/configuration is deliberately disabled until its
  // existing approved runtime reference and journal readiness are supplied.
  // This hook remains outside the intake/accept error boundary.
  await attachWebsiteEnrolmentSlack(result,{body:data,idempotencyKey,execute,enabled:false,waitUntil:task=>this.ctx.waitUntil(task)});
  return result;
 }
}
export {WebsiteEnrolmentReceipts};
`;
export function patchCurrentReceiver(bytes,expected=CURRENT_RECEIVER_SHA256){
 if(sha(bytes)!==expected)throw Error('Receiver changed: reconcile before preparing');
 let source=bytes.toString('utf8');
 if(source.includes('class WebsiteEnrolmentReceipts')||source.includes('websiteReceiptWrite'))throw Error('Receiver boundary already present');
 const start=source.indexOf('async function HandleLead('),end=source.indexOf('__name(HandleLead,',start);
 if(start<0||end<start)throw Error('HandleLead boundary changed');
 const original=source.slice(start,end);
 let lead=original.replace('FIds, wholeLog) {','FIds, wholeLog, websiteReceiptWrite) {');
 if(lead===original)throw Error('HandleLead signature changed');
 for(const [anchor,count,reference]of [
  ['var gReach = await DataCreateOrUpdate([gr], "GENERALREACH");',1,'if (websiteReceiptWrite && gReach?.[0]?.Id) websiteReceiptWrite.reference = "peoplenote_v1:" + gReach[0].Id;'],
  ['var createdLead = await DataCreateOrUpdate([lh], "lead");',3,'if (websiteReceiptWrite && createdLead?.[0]?.Id) websiteReceiptWrite.reference = "lead_v1:" + createdLead[0].Id;']
 ]){
  if(lead.split(anchor).length!==count+1)throw Error('Existing write boundary changed');
  lead=lead.replaceAll(anchor,anchor+'\n      '+reference);
 }
 source=source.slice(0,start)+lead+source.slice(end);
 const anchor='    if (data2.FormType.toLowerCase() == "enroll") {';
 if(source.split(anchor).length!==2)throw Error('Static form boundary changed');
 source=source.replace(anchor,'    if (Object.hasOwn(data2, "WebsiteReceipt")) return new Response(JSON.stringify({status:"rejected"}),{status:422,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});\n'+anchor);
 return 'import {WorkerEntrypoint as WebsiteReceiptWorkerEntrypoint} from "cloudflare:workers";\nimport {receiveReceiptEnrolment as receiveWebsiteEnrolmentReceipt,sqlReceiptLedger as websiteEnrolmentSqlLedger} from "./website-enrolment-receipt.mjs";\nimport {readEnquiryAnalytics as readWebsiteEnquiryAnalytics} from "./website-enrolment-analytics.mjs";\nimport {attachAcceptedEnrolmentSlack as attachWebsiteEnrolmentSlack} from "./website-enrolment-slack.mjs";\n'+source+entrypoint;
}
export async function prepareCurrentReceiver({input='ask-private/slack-integration-20261009/live/index.js',output='ask-private/slack-integration-20261009/candidate'}={}){
 const bytes=await fs.readFile(input),candidate=patchCurrentReceiver(bytes);
 await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'index.js'),candidate);
 const modules=[{name:'index.js',sha256:sha(candidate),bytes:Buffer.byteLength(candidate)}];
 for(const [input,name]of [['deployment/enrolment-receipt.mjs','website-enrolment-receipt.mjs'],['deployment/enrolment-analytics.mjs','website-enrolment-analytics.mjs'],['deployment/enrolment-slack-attachment.mjs','website-enrolment-slack.mjs']]){
  const compiled=await build({entryPoints:[input],bundle:true,format:'esm',platform:'browser',target:'es2022',write:false,legalComments:'none'});
  const content=compiled.outputFiles[0].contents;await fs.writeFile(path.join(output,name),content);modules.push({name,sha256:sha(content),bytes:content.length});
 }
 const receipt={status:'inactive_candidate',at:new Date().toISOString(),worker:'pbn-planetscale',baselineSha256:sha(bytes),baselineVersion:'55197371-f210-4c51-8fa2-8bce1d934305',modules,receiverContractRestoration:true,slackEnabled:false,otherLiveExportsPreserved:true,existingDatabaseOnly:true,bindingsChanged:false,migrationApplied:false,liveTest:false,remaining:['Current backend release-owner reconciliation and compatibility/runtime acceptance','Existing server-side Slack adapter configuration reference and posting membership','Journal schema readback/migration review in existing database','Existing RAM question 6 internal TEST reference and authenticated member acceptance']};
 await fs.writeFile(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await prepareCurrentReceiver()));
