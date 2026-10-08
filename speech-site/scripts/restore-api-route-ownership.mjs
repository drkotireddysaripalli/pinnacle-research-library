import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const RESTORE_HOSTS = ['www.pinnacleblooms.org', 'mirracle.pinnacleblooms.org'];
const escapeRegex = value => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

// An exact-host catch-all outranks older wildcard-host routes. Preserve each
// registered API/WebSocket owner explicitly on the two affected hosts.
export function planApiRestoration(routes) {
  const result = [];
  for (const host of RESTORE_HOSTS) {
    if (!routes.some(r => r.pattern === `${host}/*`)) throw new Error(`Missing expected catch-all: ${host}`);
    const candidates = new Map();
    for (const route of routes) {
      const match = route.pattern.match(/^(?:(https?):\/\/)?([^/]+)(\/.*)$/);
      if (!match) continue;
      const [, scheme, hostPattern, routePath] = match;
      if (!hostPattern.includes('*') || !/^\/(api\/|ws)/.test(routePath)) continue;
      const matcher = new RegExp(`^${escapeRegex(hostPattern).replaceAll('*', '.*')}$`);
      if (!matcher.test(host)) continue;
      const pattern = `${scheme ? scheme + '://' : ''}${host}${routePath}`;
      const specificity = hostPattern.replaceAll('*', '').length;
      const candidate = { pattern, script: route.script ?? null, request_limit_fail_open: route.request_limit_fail_open ?? false,
        sourcePattern: route.pattern, sourceId: route.id, specificity };
      const current = candidates.get(pattern);
      if (current && current.specificity === specificity && current.script !== candidate.script) throw new Error(`Ambiguous original owner: ${pattern}`);
      if (!current || specificity > current.specificity) candidates.set(pattern, candidate);
    }
    for (const candidate of candidates.values()) {
      const existing = routes.find(r => r.pattern === candidate.pattern);
      if (existing) {
        if ((existing.script ?? null) !== candidate.script) throw new Error(`Exact API owner conflict: ${candidate.pattern}`);
        continue;
      }
      result.push(candidate);
    }
  }
  return result.sort((a,b) => {
    const critical = r => r.pattern.endsWith('/api/gl/*') ? 0 : 1;
    return critical(a) - critical(b) || a.pattern.localeCompare(b.pattern);
  });
}

async function main() {
  const apply = process.argv.includes('--apply');
  const output = process.env.PINNACLE_ROUTE_RECEIPT || 'deployment/api-route-restoration-20261009.json';
  const token = (await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
  if (!token) throw new Error('Existing Cloudflare OAuth session unavailable');
  const routeUrl = 'https://api.cloudflare.com/client/v4/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
  async function api(method, body) {
    const response = await fetch(routeUrl, { method, headers: { authorization: `Bearer ${token}`, 'content-type':'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000) });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(`Cloudflare ${method}: HTTP ${response.status}; ${JSON.stringify(data.errors)}`);
    return data.result;
  }
  const before = await api('GET');
  const plan = planApiRestoration(before);
  if (!apply) { console.log(JSON.stringify({ mode:'plan', existingRoutes:before.length, additions:plan }, null, 2)); return; }
  // A rerun reads current ownership and only adds genuinely absent patterns.
  const receipt = { startedAt:new Date().toISOString(), kind:'configuration-only-api-ownership-repair', before, plan, added:[], status:'in_progress' };
  try { receipt.previousReceipt = JSON.parse(await fs.readFile(output, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  await fs.mkdir(path.dirname(output), {recursive:true});
  const save = () => fs.writeFile(output, JSON.stringify(receipt,null,2)+'\n');
  await save();
  for (const candidate of plan) {
    const { pattern, script, request_limit_fail_open } = candidate;
    receipt.added.push(await api('POST', {pattern, script, request_limit_fail_open}));
    await save();
  }
  const after = await api('GET');
  for (const original of before) {
    const retained = after.find(r => r.id === original.id);
    if (!retained || retained.pattern !== original.pattern || retained.script !== original.script || retained.request_limit_fail_open !== original.request_limit_fail_open) throw new Error(`Original route changed: ${original.pattern}`);
  }
  for (const expected of plan) if (!after.some(r => r.pattern === expected.pattern && r.script === expected.script)) throw new Error(`Missing restored route: ${expected.pattern}`);
  receipt.after = after;
  receipt.status = 'configuration_verified_runtime_checks_pending';
  receipt.completedAt = new Date().toISOString();
  receipt.rollback = {instruction:'Remove only the newly added route IDs listed here if rollback is required; retain every pre-existing route.', routeIds:receipt.added.map(r=>r.id)};
  await save();
  console.log(JSON.stringify({status:receipt.status,added:receipt.added.length,before:before.length,after:after.length,receipt:output}));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
