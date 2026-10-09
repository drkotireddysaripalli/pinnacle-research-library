import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
const dir=process.env.PINNACLE_RECEIVER_CANDIDATE_DIR;
assert(dir&&path.isAbsolute(dir),'Explicit private candidate directory required');
const receipt=JSON.parse(await fs.readFile(path.join(dir,'receipt.json'),'utf8'));
const modules=[],actualHashes=[];for(const file of receipt.modules){
 const bytes=await fs.readFile(path.join(dir,file.name));
 const actual=createHash('sha256').update(bytes).digest('hex');
 assert.equal(actual,file.sha256,'Actual module differs from receipt: '+file.name);
 assert.equal(bytes.length,file.bytes,'Actual module size differs: '+file.name);
 actualHashes.push({name:file.name,sha256:actual});
 modules.push({type:'ESModule',path:file.name,contents:bytes.toString('utf8')});
}
let outbound=0;const deny=()=>{outbound++;throw Error('External access prohibited in offline receiver acceptance');};
const runtime=new Miniflare(convertV4MiniflareOptions({workers:[
 {name:'receiver',compatibilityDate:'2023-04-05',compatibilityFlags:[],modules,
  bindings:{DATABASE_HOST:'offline.invalid',DATABASE_USERNAME:'OFFLINE_ONLY',DATABASE_PASSWORD:'OFFLINE_ONLY'},
  kvNamespaces:['PINNACLE_AUTHSTORE_KV','PINNACLE_DB','PINNACLE_KV'],r2Buckets:['PBN_BUCKET'],outboundService:deny},
 {name:'probe',compatibilityDate:'2026-10-08',modules:true,
  script:'export default {async fetch(req,env){return Response.json(await env.RECEIVER.receive({},"offline-invalid-request"));}}',
  serviceBindings:{RECEIVER:{name:'receiver',entrypoint:'WebsiteEnrolmentReceipts'}},outboundService:deny}
]}));
try{
 await runtime.ready;
 const probe=await runtime.getWorker('probe'),response=await probe.fetch('https://offline.invalid/'),result=await response.json();
 assert.deepEqual(result,{httpStatus:422,status:'rejected'});assert.equal(outbound,0);
 const proof={at:new Date().toISOString(),status:'passed',scope:'Actual full current receiver candidate, private named service-binding RPC with invalid offline input',compatibilityDate:'2023-04-05',compatibilityFlags:[],modules:actualHashes,hashesRecomputedFromLoadedBytes:true,outboundRequests:outbound,databaseReads:0,databaseWrites:0,customerIntakes:0,slackRequests:0,rpcResult:result,notTested:['live authentication/member access','production MySQL readback','valid customer submission','Slack adapter/delivery']};
 await fs.writeFile(path.join(dir,'offline-runtime-receipt.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
}finally{await runtime.dispose();}
