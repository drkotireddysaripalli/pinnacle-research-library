import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const endpoint='https://api.cloudflare.com/client/v4/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
async function api(method='GET',body,id){const r=await fetch(endpoint+(id?'/'+id:''),{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:body?JSON.stringify(body):undefined}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,errors:j.errors}));return j.result;}
const baseline=JSON.parse(await fs.readFile('ask-private/completion-20261007/routes.json','utf8')),before=await api(),added=[];
for(const b of baseline)assert.deepEqual(before.find(r=>r.id===b.id),b,'Existing route changed');
for(const [pattern,script]of [['www.pinnacleblooms.org/guru/*','pinnacle-legacy-social-metadata'],['www.pinnacleblooms.org/mirraclesitemap*','pinnacle-root-sitemap'],['www.pinnacleblooms.org/therapeuticai-effectiveness-study*','pinnacle-legacy-social-metadata']]){
 const existing=before.find(r=>r.pattern===pattern),draft=pattern.endsWith('mirraclesitemap*')?before.find(r=>r.pattern==='www.pinnacleblooms.org/mirraclesitemap'):null;if(existing){assert.equal(existing.script,script);added.push(existing);}else if(draft){assert(!baseline.some(r=>r.id===draft.id));assert.equal(draft.script,script);added.push(await api('PUT',{pattern,script},draft.id));}else added.push(await api('POST',{pattern,script}));
}
const after=await api();for(const b of baseline)assert.deepEqual(after.find(r=>r.id===b.id),b);assert.equal(after.length,baseline.length+3);for(const a of added)assert(after.some(r=>r.pattern===a.pattern&&r.script===a.script));
await fs.writeFile('deployment/completion-routes-20261007.json',JSON.stringify({at:new Date().toISOString(),previous:baseline.length,current:after.length,existingRoutesPreserved:true,additions:added},null,2));console.log(JSON.stringify({existingRoutesPreserved:baseline.length,added:3,current:after.length}));
