// Produces a private candidate, never a deployment. Refuses a different source.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const RECEIVER_SOURCE_SHA256='96d69dee450a771b6bc546bffdc63dd5804e3667d95c9147ea3e48a823ab5380';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export function patchEnquiryAnalyticsReceiver(bytes,expectedSha256){
 if(digest(bytes)!==expectedSha256)throw new Error('Live receiver differs from the recorded release');
 const anchor='class WebsiteEnrolmentReceipts extends WebsiteReceiptWorkerEntrypoint {';
 let source=bytes.toString();if(source.split(anchor).length!==2||source.includes('readWebsiteEnquiryAnalytics'))throw new Error('Private receipt entrypoint boundary changed');
 const method=`\n  async analytics(cohort) {\n    await getPSConnection(this.env);\n    if (!globalConnection) throw new Error("Receiving database unavailable");\n    return readWebsiteEnquiryAnalytics((sql, params) => globalConnection.execute(sql, params), cohort);\n  }\n`;
 return 'import {readEnquiryAnalytics as readWebsiteEnquiryAnalytics} from "./website-enrolment-analytics.mjs";\n'+source.replace(anchor,anchor+method);
}
export function isolateLegacySitemapWriter(source){
 const anchor='var XMLObj = xmlWriter;';
 for(const name of ['GenarateSiteMap','GenarateVideoSiteMap']){
  const start=source.indexOf('function '+name+'('),end=source.indexOf('__name('+name+',',start);
  if(start<0||end<start)throw new Error('Sitemap function boundary changed');
  const scoped=source.slice(start,end);
  if(scoped.split(anchor).length!==2)throw new Error('Sitemap writer boundary changed');
  // Inherited static methods mutate only this response's arrays.
  source=source.slice(0,start)+scoped.replace(anchor,'var XMLObj = class extends xmlWriter { static XML = []; static Nodes = []; static State = ""; };')+source.slice(end);
 }
 return source;
}
export function patchEnrolmentReceiver(bytes){
 if(digest(bytes)!==RECEIVER_SOURCE_SHA256)throw new Error('Receiver source has changed; review the new version before preparing a patch.');
 let source=bytes.toString('utf8');
 const start=source.indexOf('async function HandleLead('),end=source.indexOf('__name(HandleLead, "HandleLead");',start);
 if(start<0||end<start)throw new Error('HandleLead scope missing');
 const original=source.slice(start,end);
 let lead=original.replace('FIds, wholeLog) {','FIds, wholeLog, websiteReceiptWrite) {');
 const reach='var gReach = await DataCreateOrUpdate([gr], "GENERALREACH");';
 if(lead.split(reach).length!==2)throw new Error('GENERALREACH write boundary changed');
 lead=lead.replace(reach,reach+'\n      if (websiteReceiptWrite && gReach?.[0]?.Id) websiteReceiptWrite.reference = "peoplenote_v1:" + gReach[0].Id;');
 const history='var createdLead = await DataCreateOrUpdate([lh], "lead");';
 if(lead.split(history).length!==4)throw new Error('Lead-history write boundaries changed');
 lead=lead.replaceAll(history,history+'\n      if (websiteReceiptWrite && createdLead?.[0]?.Id) websiteReceiptWrite.reference = "lead_v1:" + createdLead[0].Id;');
 if(lead===original)throw new Error('No bounded HandleLead patch');
 source=source.slice(0,start)+lead+source.slice(end);
 const anchor='    if (data2.FormType.toLowerCase() == "enroll") {';
 if(source.split(anchor).length!==2)throw new Error('Static form branch changed');
 const branch=`    if (Object.hasOwn(data2, "WebsiteReceipt")) {
      // Receipt intake is available only through the named private binding.
      return new Response(JSON.stringify({status:"rejected"}), {status:422,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
    }
`;
 source=source.replace(anchor,branch+anchor);
 const entrypoint=`
// Private RPC entrypoint on the existing Worker. No public fetch handler.
class WebsiteEnrolmentReceipts extends WebsiteReceiptWorkerEntrypoint {
  async analytics(cohort) {
    await getPSConnection(this.env);
    if (!globalConnection) throw new Error("Receiving database unavailable");
    return readWebsiteEnquiryAnalytics((sql, params) => globalConnection.execute(sql, params), cohort);
  }
  async receive(data, idempotencyKey) {
    await getPSConnection(this.env);
    globalEnv = this.env;
    globalEvent = this.ctx;
    return receiveWebsiteEnrolmentReceipt(data, {
        idempotencyKey,
        ledger: globalConnection ? websiteEnrolmentSqlLedger((sql, params) => globalConnection.execute(sql, params)) : null,
        handoff: async (legacy) => {
          const write = {};
          const user = await HandleLead(legacy.FormType, legacy.MobileNumber, legacy.Name, legacy.Message, "", "", legacy.Title + "{#}" + legacy.Languages + "{#}" + legacy.FacilityIds, "", "", legacy.Services + "", "", legacy.EmailId, null, undefined, write);
          if (!write.reference) throw new Error("Website enquiry write unconfirmed");
          if (this.ctx && user?.IsNewLead === "NEWLEAD") {
            this.ctx.waitUntil(ProcessWhatsAppMessages({AT:"WEBENROLL",TOId:user.Id,F7:user.Id,data:legacy}, user));
          }
          return write.reference;
        }
    });
  }
}
export {WebsiteEnrolmentReceipts};
`;
 source='import {WorkerEntrypoint as WebsiteReceiptWorkerEntrypoint} from "cloudflare:workers";\nimport {readEnquiryAnalytics as readWebsiteEnquiryAnalytics} from "./website-enrolment-analytics.mjs";\nimport {receiveReceiptEnrolment as receiveWebsiteEnrolmentReceipt,sqlReceiptLedger as websiteEnrolmentSqlLedger} from "./website-enrolment-receipt.mjs";\n'+source+entrypoint;
 // Deduplicate only the observed staff sitemap's repeated generated page URLs.
 const staffAnchor='var rssResponse = GenarateSiteMap(data2, "STAFF", true);';
 if(source.split(staffAnchor).length!==2)throw Error('Staff sitemap generator changed');
 source=source.replace(staffAnchor,'const seenStaffUrls = new Set();\n    data2 = data2.filter(item => {const location=CreateHyperlink(item,"STAFF");if(seenStaffUrls.has(location))return false;seenStaffUrls.add(location);return true;});\n    '+staffAnchor);
 return isolateLegacySitemapWriter(source);
}
export async function prepareEnrolmentReceiver({input='ask-private/acquisition-receiver-20261007/index.js',output='ask-private/acquisition-receiver-candidate-20261007'}={}){
 const bytes=await fs.readFile(input),candidate=patchEnrolmentReceiver(bytes),helper=await fs.readFile('deployment/enrolment-receipt.mjs');
 await fs.mkdir(output,{recursive:true});
 await fs.writeFile(path.join(output,'index.js'),candidate);
 await fs.writeFile(path.join(output,'website-enrolment-receipt.mjs'),helper);
 await fs.writeFile(path.join(output,'website-enrolment-analytics.mjs'),await fs.readFile('deployment/enrolment-analytics.mjs'));
 const receipt={candidateOnly:true,worker:'pbn-planetscale',sourceSha256:digest(bytes),modules:[{module:'index.js',sha256:digest(candidate),bytes:Buffer.byteLength(candidate)},{module:'website-enrolment-receipt.mjs',sha256:digest(helper),bytes:helper.length}],modifiedFunctions:['HandleStaticWebForms: deny versioned receipts on public route','HandleLead: optional actual write reference capture','WebsiteEnrolmentReceipts: private RPC entrypoint'],legacyBranchesPreserved:true,requiresReviewedMigration:'deployment/website-enrolment-receipts.sql',requiresBinding:{type:'service',name:'PINNACLE_ENROLMENT_RECEIPTS',service:'pbn-planetscale',entrypoint:'WebsiteEnrolmentReceipts'},activation:'Website Worker ENROLMENT_RECEIPT_VERSION=1 only after receiver and private binding deployment'};
 await fs.writeFile(path.join(output,'candidate.json'),JSON.stringify(receipt,null,2)+'\n');
 return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await prepareEnrolmentReceiver()));
