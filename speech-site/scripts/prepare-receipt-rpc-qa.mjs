// Extends only the private prepared candidate for an isolated actual RPC check.
import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import {prepareEnrolmentReceiver} from './prepare-enrolment-receiver.mjs';
const out='ask-private/completion-receiver-20261007';await prepareEnrolmentReceiver({output:out});
const base=await fs.readFile(path.join(out,'index.js'),'utf8');await fs.writeFile(path.join(out,'production-index.js'),base);
const qa=await fs.readFile('deployment/enrolment-receipt-qa.mjs');await fs.writeFile(path.join(out,'enrolment-receipt-qa.mjs'),qa);
const entry='import {verifyMysqlReceiptContract} from "./enrolment-receipt-qa.mjs";\n'+base+`\nclass WebsiteEnrolmentReceiptQA extends WebsiteReceiptWorkerEntrypoint {async run(runId){await getPSConnection(this.env);return verifyMysqlReceiptContract((sql,params)=>globalConnection.execute(sql,params),runId);}}\nexport {WebsiteEnrolmentReceiptQA};\n`;
await fs.writeFile(path.join(out,'index.js'),entry);console.log(JSON.stringify({candidateOnly:true,modules:3,privateQA:true,sha256:createHash('sha256').update(entry).digest('hex')}));
