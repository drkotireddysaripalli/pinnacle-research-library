import assert from'node:assert/strict';
export const PUBLISHER_ACCOUNT='862998def1cd610fdb86b8e5c1d6ed4d';
// Publishing changes only the root Worker's release-message annotation.
// Preserve every binding, resource limit, security setting and other annotation.
export function publisherSettings(settings,{root=false}={}){
 const value=structuredClone(settings);
 if(root&&value.annotations){delete value.annotations['workers/message'];if(!Object.keys(value.annotations).length)delete value.annotations;}
 if(value.bindings)value.bindings.sort((a,b)=>a.name.localeCompare(b.name));
 return value;
}
// Cloudflare sets triggered_by itself; it is readable but not an upload input.
export function publisherUploadAnnotations(annotations,id){const next={...(annotations||{}),'workers/message':id};delete next['workers/triggered_by'];return next;}
export async function publisherAccountPreflight({env=process.env,readResource,whoami,probeLegacy=false}){
 if(env.CLOUDFLARE_API_TOKEN){
  if(env.CLOUDFLARE_ACCOUNT_ID)assert.equal(env.CLOUDFLARE_ACCOUNT_ID,PUBLISHER_ACCOUNT);
  const settings=await readResource();assert(Array.isArray(settings.bindings)&&settings.bindings.some(b=>b.type==='assets'&&b.name==='ASSETS'),'Existing publisher Worker resource not verified');
  const proof={mode:'scoped-token-resource-read',account:PUBLISHER_ACCOUNT,worker:'pinnacle-verify-route',verified:true};
  if(probeLegacy){const old=await whoami();proof.legacyWhoamiExitCode=old.status;proof.legacyWhoamiAccountVisible=old.status===0&&old.stdout.includes(PUBLISHER_ACCOUNT);}
  return proof;
 }
 const local=await whoami();assert.equal(local.status,0,'Existing local publisher login unavailable');assert(local.stdout.includes(PUBLISHER_ACCOUNT),'Existing authorised Cloudflare account required');return{mode:'existing-local-login',account:PUBLISHER_ACCOUNT,verified:true};
}
