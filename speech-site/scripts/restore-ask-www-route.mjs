// Route-only repair: activate the canonical redirect already present in production.
// Does not upload Worker code, assets, secrets, or database changes.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const apply = process.argv.includes('--apply');
const account = '862998def1cd610fdb86b8e5c1d6ed4d';
const zone = '8b13f18e0589996b5d6512552372b434';
const route = {pattern: 'www.pinnacleblooms.org/ask*', script: 'pinnacle-verify-route'};
const auth = process.env.CLOUDFLARE_API_TOKEN || (await fs.readFile(path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml'), 'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
assert(auth, 'Existing Cloudflare authentication required; refresh using wrangler whoami if expired.');
async function api(suffix, method = 'GET', data) {
  const response = await fetch('https://api.cloudflare.com/client/v4' + suffix, {
    method, headers: {authorization: 'Bearer ' + auth, 'content-type': 'application/json'},
    body: data ? JSON.stringify(data) : undefined, signal: AbortSignal.timeout(30000)
  });
  const result = await response.json();
  assert(response.ok && result.success, `Cloudflare ${method} failed: ${response.status}`);
  return result.result;
}
const routePath = '/zones/' + zone + '/workers/routes';
const normalise = routes => routes.map(({id,pattern,script}) => ({id,pattern,script:script||null})).sort((a,b) => a.pattern.localeCompare(b.pattern));
async function state() {
  const routes = normalise(await api(routePath));
  const workers = {};
  for (const name of ['pinnacle-verify-route', 'pinnacle-ask']) {
    const base = '/accounts/' + account + '/workers/scripts/' + name;
    const [settings, deployments] = await Promise.all([api(base + '/settings'), api(base + '/deployments')]);
    workers[name] = {
      bindings: settings.bindings.map(({name,type,service,environment}) => ({name,type,service:service||null,environment:environment||null})).sort((a,b)=>a.name.localeCompare(b.name)),
      deployment: deployments.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0]
    };
  }
  return {routes, workers};
}
const before = await state();
assert(before.routes.some(r => r.pattern === 'pinnacleblooms.org/ask*' && r.script === 'pinnacle-ask'), 'Preserve the original separate Ask application.');
const existing = before.routes.find(r => r.pattern === route.pattern);
assert(!existing || existing.script === route.script, 'An unexpected owner already handles this route.');
if (!apply || existing) {
  console.log(JSON.stringify({action:existing?'already-restored':'planned',route,currentRoutes:before.routes.length}));
} else {
  const sourceResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/' + account + '/workers/scripts/pinnacle-verify-route', {headers:{authorization:'Bearer '+auth}});
  assert(sourceResponse.ok, 'Live Worker source must be readable before routing traffic to it.');
  const source = await sourceResponse.text();
  assert(source.includes("if(incoming.hostname==='www.pinnacleblooms.org'&&(incoming.pathname==='/ask'||incoming.pathname.startsWith('/ask/'))&&['GET','HEAD'].includes(request.method))return Response.redirect('https://pinnacleblooms.org'+incoming.pathname+incoming.search,308);"), 'Expected path/query-preserving redirect must already exist in the live Worker.');
  const receipt = {at:new Date().toISOString(),route,before};
  await fs.writeFile('deployment/ask-route-restoration-20261003.json',JSON.stringify(receipt,null,2)+'\n');
  const created = await api(routePath, 'POST', route);
  receipt.created = created;
  await fs.writeFile('deployment/ask-route-restoration-20261003.json',JSON.stringify(receipt,null,2)+'\n');
  receipt.after = await state();
  assert.deepEqual(receipt.after.routes.filter(r => r.id !== created.id), before.routes, 'All pre-existing routes must be preserved.');
  assert.deepEqual(receipt.after.workers, before.workers, 'Worker versions and bindings must be preserved.');
  receipt.verified = true;
  await fs.writeFile('deployment/ask-route-restoration-20261003.json',JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({action:'restored',routeId:created.id,route,existingRoutesPreserved:before.routes.length,workerVersionsAndBindingsUnchanged:true}));
}
