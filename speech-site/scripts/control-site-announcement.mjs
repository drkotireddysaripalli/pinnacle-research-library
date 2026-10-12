// Protected local control. No public write endpoint, scheduler or customer data.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {validAnnouncement,announcementActive} from '../deployment/site-announcement.mjs';
const dir=process.env.ANNOUNCEMENT_CONTROL_DIR||'ask-private/site-announcement-control';await fs.mkdir(dir,{recursive:true});
const args=process.argv.slice(2),command=args[0]||'--read';assert(['--read','--publish','--disable','--enable'].includes(command));
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare deployment login required');
const base='https://api.cloudflare.com/client/v4/accounts/862998def1cd610fdb86b8e5c1d6ed4d/storage/kv/namespaces';
async function api(url,method='GET',body){const r=await fetch(url,{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});const j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,errors:j.errors}));return j.result;}
const lockFile=path.join(dir,'write.lock');let lock;
try{
 if(command!=='--read')lock=await fs.open(lockFile,'wx');
 const namespaces=await api(base+'?per_page=1000');let namespace=namespaces.find(n=>n.title==='pinnacle-site-announcements');
 if(!namespace){assert.equal(command,'--publish','No existing announcement namespace; publish the approved configuration first');namespace=await api(base,'POST',{title:'pinnacle-site-announcements'});await fs.writeFile(path.join(dir,'namespace-created.json'),JSON.stringify(namespace,null,2)+'\n');}
 await fs.writeFile(path.join(dir,'namespace.json'),JSON.stringify({id:namespace.id,title:namespace.title,binding:'PINNACLE_ANNOUNCEMENTS'},null,2)+'\n');
 const valueUrl=base+'/'+namespace.id+'/values/active';
 const read=async()=>{const r=await fetch(valueUrl,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});if(r.status===404)return null;assert(r.ok,'Configuration read failed '+r.status);return JSON.parse(await r.text());};
 const before=await read();let config=before;
 if(command!=='--read'){
  const expectedIndex=args.indexOf('--expect-id');if(before){assert(expectedIndex>=0,'Supply --expect-id for an existing announcement');assert.equal(before.id,args[expectedIndex+1],'Different announcement is active; reconcile before overwriting');}
  if(command==='--publish'){assert(args[1]&&!args[1].startsWith('--'),'Supply approved JSON configuration');config=JSON.parse(await fs.readFile(args[1],'utf8'));}else{assert(before,'No announcement configuration to change');config={...before,enabled:command==='--enable'};}
  config=validAnnouncement(config);assert(config,'Invalid announcement configuration');assert(Date.parse(config.expiresAt)>Date.now(),'Expired announcement cannot be republished or enabled');
  const expiration=Math.floor(Date.parse(config.expiresAt)/1000);const r=await fetch(valueUrl+'?expiration='+expiration,{method:'PUT',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(config),signal:AbortSignal.timeout(30000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify(j.errors));const after=await read();assert.deepEqual(after,config,'API readback differs from the requested configuration');
  await fs.writeFile(path.join(dir,'last-change.json'),JSON.stringify({at:new Date().toISOString(),command,namespace:namespace.id,before,after,expiration,apiReadbackVerified:true},null,2)+'\n');
 }
 console.log(JSON.stringify({namespace:namespace.id,id:config?.id,enabled:config?.enabled,active:announcementActive(config),expiresAt:config?.expiresAt,scope:'Protected configuration readback; public edge propagation is verified separately'}));
}finally{if(lock){await lock.close();await fs.unlink(lockFile);}}
