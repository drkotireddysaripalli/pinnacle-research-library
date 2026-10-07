import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir=path.resolve('ask-private/completion-20261007');await fs.mkdir(dir,{recursive:true});
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const base='https://api.cloudflare.com/client/v4/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/';
const names=['pbn-planetscale','pinnacle-verify-route','pinnacle-legacy-social-metadata','pinnacle-root-sitemap'];
const result={at:new Date().toISOString(),workers:{}};
for(const name of names){
 const [s,d,c]=await Promise.all(['settings','deployments','content/v2'].map(p=>fetch(base+name+'/'+p,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)})));assert(s.ok&&d.ok&&c.ok,'Cloudflare read failed '+name);
 const settings=(await s.json()).result,deploy=(await d.json()).result.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
 await fs.writeFile(path.join(dir,name+'-settings.json'),JSON.stringify(settings));
 const mods=[];for(const [key,v]of await c.formData())if(typeof v!=='string'){const bytes=Buffer.from(await v.arrayBuffer()),module=v.name||key;assert(/^[\w.-]+\.(?:m?js|wasm)$/.test(module));await fs.writeFile(path.join(dir,name+'-'+module),bytes);mods.push({name:module,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
 result.workers[name]={deployment:deploy.id,versions:deploy.versions,bindings:settings.bindings?.map(x=>({name:x.name,type:x.type,service:x.service,entrypoint:x.entrypoint})),modules:mods};
}
const routes=await fetch('https://api.cloudflare.com/client/v4/zones/8b13f18e0589996b5d6512552372b434/workers/routes',{headers:{authorization:'Bearer '+token}});assert(routes.ok);const routeList=(await routes.json()).result;await fs.writeFile(path.join(dir,'routes.json'),JSON.stringify(routeList,null,2));
result.routes=routeList.length;await fs.writeFile(path.join(dir,'snapshot.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({at:result.at,routes:result.routes,workers:Object.fromEntries(Object.entries(result.workers).map(([n,v])=>[n,{versions:v.versions,modules:v.modules.map(m=>({name:m.name,sha256:m.sha256})),bindingNames:v.bindings.map(b=>b.name)}]))},null,2));
