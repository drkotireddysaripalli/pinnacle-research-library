import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {assets as sharedAssets} from '../deployment/shared-assets-repair-assets.mjs';

const phase = process.argv[2] || 'all';
const phases = ['prepare', 'assemble', 'upload', 'promote', 'verify'];
assert(phase === 'all' || phases.includes(phase), `Use all or ${phases.join(', ')}`);
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(site, '..');
const releaseDir = path.resolve(process.env.PINNACLE_RELEASE_DIR || path.join(root, 'artifacts/measurement-always-on-live-20261019/release'));
const receiptPath = path.join(releaseDir, 'receipt.json');
const beforePath = path.join(releaseDir, 'before.json');
const account = '862998def1cd610fdb86b8e5c1d6ed4d';
const zone = '8b13f18e0589996b5d6512552372b434';
const id = 'measurement-always-on-live-20261019';
const targets = {
  call: {name: 'pinnacle-google-ads-call-measurement', main: 'index.mjs'},
  portal: {name: 'pinnacle-verify-route', main: 'pinnacle-route-v12.mjs', keepAssets: true},
  helpline: {name: 'pinnacle-helpline', main: 'worker.mjs'}
};
const protectedNames = ['pinnacle-legacy-social-metadata', 'pinnacle-ask', 'pinnacle-root-sitemap', 'materials-mobile-desktop-tracker', 'pbn-planetscale', 'pinnacle-ask-mcp', 'pinnacle-centre-search-repair'];
const portalLocalModules = [
  'aba-assets.mjs', 'abilityscore-assets.mjs', 'about-assets.mjs', 'autism-assets.mjs',
  'book-attribution-assets.mjs', 'enrolment-assets.mjs', 'everyday-assets.mjs', 'first-conversation-assets.mjs',
  'fusion-assets.mjs', 'legacy-measurement.runtime.mjs', 'occupational-assets.mjs', 'pdk-assets.mjs',
  'pinnacle-route-v12.mjs', 'prognose-assets.mjs', 'public-ad-call.mjs',
  'public-policy-assets.mjs', 'public-policy-runtime-assets.mjs', 'readiness-assets.mjs', 'seva-assets.mjs',
  'shared-assets-repair.mjs', 'shared-navigation.mjs',
  'special-education-assets.mjs', 'speech-handler.mjs', 'suchitra-assets.mjs', 'therapeuticai-assets.mjs',
  'therapy-reading-content.mjs', 'verify-measurement-handler.mjs', 'verify-measurement-repair.mjs'
];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const git = args => execFileSync('git', args, {cwd: root, encoding: 'utf8', windowsHide: true}).trim();
const gitBytes = args => execFileSync('git', args, {cwd: root, windowsHide: true});
const gh = args => execFileSync('gh', args, {cwd: root, encoding: 'utf8', windowsHide: true}).trim();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function readToken() {
  const raw = await fs.readFile(process.env.HOME + '/Library/Preferences/.wrangler/config/default.toml', 'utf8');
  const token = raw.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1] || raw.match(/^api_token\s*=\s*"([^"]+)"/m)?.[1];
  assert(token, 'Wrangler token missing');
  return token;
}
const token = await readToken();
async function api(resource, method = 'GET', body) {
  const form = body instanceof FormData;
  const response = await fetch('https://api.cloudflare.com/client/v4' + resource, {
    method,
    headers: {authorization: 'Bearer ' + token, ...(!form ? {'content-type': 'application/json'} : {})},
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
    signal: AbortSignal.timeout(60000)
  });
  const json = await response.json();
  assert(response.ok && json.success, JSON.stringify({status: response.status, resource, errors: json.errors}));
  return json.result;
}
const base = name => `/accounts/${account}/workers/scripts/${name}`;
async function versions(name) {
  const deployments = (await api(base(name) + '/deployments')).deployments.sort((a, b) => b.created_on.localeCompare(a.created_on));
  return deployments[0]?.versions || [];
}
async function settings(name) { return api(base(name) + '/settings'); }
async function modules(name) {
  const response = await fetch('https://api.cloudflare.com/client/v4' + base(name) + '/content/v2', {headers: {authorization: 'Bearer ' + token}, signal: AbortSignal.timeout(60000)});
  assert(response.ok, `${name} content ${response.status}`);
  const out = [];
  for (const [key, value] of await response.formData()) if (typeof value !== 'string') {
    const moduleName = value.name || key;
    assert(/^[\w.-]+\.mjs$/.test(moduleName), `Unsafe module name ${moduleName}`);
    out.push({name: moduleName, bytes: Buffer.from(await value.arrayBuffer())});
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
const cleanRoutes = routes => routes.map(({id: routeId, pattern, script}) => ({id: routeId, pattern, script})).sort((a, b) => a.pattern.localeCompare(b.pattern));
const stableSettings = value => Object.fromEntries(['compatibility_date', 'compatibility_flags', 'bindings', 'placement', 'tail_consumers', 'logpush', 'observability', 'limits', 'usage_model'].filter(key => value[key] !== undefined).map(key => [key, value[key]]));
async function snapshot() {
  const names = [...Object.values(targets).map(target => target.name), ...protectedNames];
  const [routes, entries] = await Promise.all([
    api(`/zones/${zone}/workers/routes`),
    Promise.all(names.map(async name => [name, {versions: await versions(name), settings: await settings(name)}]))
  ]);
  return {at: new Date().toISOString(), routes: cleanRoutes(routes), workers: Object.fromEntries(entries)};
}
async function save(file, value) {
  await fs.mkdir(path.dirname(file), {recursive: true});
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
}
async function load(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
async function saveCaptured(name, workerModules) {
  const directory = path.join(releaseDir, 'captured', name);
  await fs.mkdir(directory, {recursive: true});
  for (const module of workerModules) await fs.writeFile(path.join(directory, module.name), module.bytes);
  return {moduleCount: workerModules.length, hashes: Object.fromEntries(workerModules.map(module => [module.name, sha(module.bytes)]))};
}
async function captured(name) {
  const directory = path.join(releaseDir, 'captured', name);
  return Promise.all((await fs.readdir(directory)).filter(file => file.endsWith('.mjs')).sort().map(async file => ({name: file, bytes: await fs.readFile(path.join(directory, file))})));
}
async function assertDrift(receipt, allowPromoted = true) {
  const before = await load(beforePath);
  const now = await snapshot();
  assert.deepEqual(now.routes, before.routes, 'Cloudflare route drift');
  for (const name of protectedNames) {
    assert.deepEqual(now.workers[name].versions, before.workers[name].versions, `${name} version drift`);
    assert.deepEqual(stableSettings(now.workers[name].settings), stableSettings(before.workers[name].settings), `${name} settings drift`);
  }
  for (const target of Object.values(targets)) {
    const promoted = receipt.promotions?.[target.name];
    const expected = allowPromoted && promoted ? [{version_id: receipt.candidates[target.name].version, percentage: 100}] : before.workers[target.name].versions;
    assert.deepEqual(now.workers[target.name].versions, expected, `${target.name} version drift`);
    assert.deepEqual(stableSettings(now.workers[target.name].settings), stableSettings(before.workers[target.name].settings), `${target.name} settings drift`);
  }
  return now;
}
async function writeCandidate(name, main, workerModules) {
  const directory = path.join(releaseDir, 'candidate', name);
  await fs.rm(directory, {recursive: true, force: true});
  await fs.mkdir(directory, {recursive: true});
  for (const module of workerModules) await fs.writeFile(path.join(directory, module.name), module.bytes);
  const manifest = {main, moduleCount: workerModules.length, hashes: Object.fromEntries(workerModules.map(module => [module.name, sha(module.bytes)]))};
  await save(path.join(directory, 'manifest.json'), manifest);
  return manifest;
}
async function assembleCandidates(commit) {
  const portal = await captured(targets.portal.name);
  const byName = new Map(portal.map(module => [module.name, module]));
  for (const name of portalLocalModules) {
    const bytes = await fs.readFile(path.join(site, 'deployment', name));
    byName.set(name, {name, bytes});
    const committed = gitBytes(['show', `${commit}:speech-site/deployment/${name}`]);
    assert.equal(sha(bytes), sha(committed), `Uncommitted portal source ${name}`);
  }
  for (const name of ['shared-assets-repair.mjs', 'shared-navigation.mjs']) {
    const bundled = await build({
      entryPoints: [path.join(site, 'deployment', name)], bundle: true, format: 'esm', platform: 'browser', write: false, logLevel: 'silent',
      ...(name === 'shared-navigation.mjs' ? {external: ['./public-ad-call.mjs']} : {})
    });
    byName.set(name, {name, bytes: Buffer.from(bundled.outputFiles[0].contents)});
  }
  const portalModules = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  const fixture = path.join(releaseDir, 'candidate', targets.portal.name);
  const portalManifest = await writeCandidate(targets.portal.name, targets.portal.main, portalModules);
  await build({entryPoints: [path.join(fixture, targets.portal.main)], bundle: true, format: 'esm', platform: 'browser', write: false, logLevel: 'silent'});

  const callSource = path.join(site, 'workers/google-ads-call-measurement/index.mjs');
  assert.equal(sha(await fs.readFile(callSource)), sha(gitBytes(['show', `${commit}:speech-site/workers/google-ads-call-measurement/index.mjs`])), 'Uncommitted call worker');
  const callBuild = await build({entryPoints: [callSource], bundle: true, format: 'esm', platform: 'browser', write: false, logLevel: 'silent'});
  const callManifest = await writeCandidate(targets.call.name, targets.call.main, [{name: targets.call.main, bytes: callBuild.outputFiles[0].contents}]);

  const helplineSource = path.join(root, 'helpline-site/worker.mjs');
  assert.equal(sha(await fs.readFile(helplineSource)), sha(gitBytes(['show', `${commit}:helpline-site/worker.mjs`])), 'Uncommitted helpline worker');
  const helplineManifest = await writeCandidate(targets.helpline.name, targets.helpline.main, [{name: targets.helpline.main, bytes: await fs.readFile(helplineSource)}]);
  return {[targets.portal.name]: portalManifest, [targets.call.name]: callManifest, [targets.helpline.name]: helplineManifest};
}
async function waitForCi(commit) {
  const deadline = Date.now() + 35 * 60 * 1000;
  while (Date.now() < deadline) {
    const runs = JSON.parse(gh(['run', 'list', '--workflow', 'portal-quality.yml', '--commit', commit, '--event', 'push', '--limit', '10', '--json', 'databaseId,headSha,status,conclusion,url']));
    const run = runs.find(item => item.headSha === commit);
    if (run?.status === 'completed') {
      assert.equal(run.conclusion, 'success', `Portal quality failed: ${run.url}`);
      const directory = path.join(releaseDir, 'ci');
      await fs.rm(directory, {recursive: true, force: true});
      await fs.mkdir(directory, {recursive: true});
      execFileSync('gh', ['run', 'download', String(run.databaseId), '--name', 'testingbot-build-verification', '--dir', directory], {cwd: root, stdio: 'inherit', windowsHide: true});
      const report = path.join(directory, 'report.json');
      execFileSync(process.execPath, [path.join(site, 'scripts/assert-testingbot-release.mjs'), report], {cwd: site, stdio: 'inherit', windowsHide: true, env: {...process.env, GITHUB_SHA: commit}});
      return {...run, reportSha256: sha(await fs.readFile(report))};
    }
    console.log(JSON.stringify({waitingFor: 'Portal quality', commit, status: run?.status || 'not-started', at: new Date().toISOString()}));
    await sleep(20000);
  }
  throw Error(`Timed out waiting for Portal quality on ${commit}`);
}
async function uploadWorker(target, before, manifest) {
  const directory = path.join(releaseDir, 'candidate', target.name);
  const workerSettings = before.workers[target.name].settings;
  const metadata = {
    main_module: target.main,
    ...(target.keepAssets ? {keep_assets: true} : {}),
    compatibility_date: workerSettings.compatibility_date,
    compatibility_flags: workerSettings.compatibility_flags || [],
    bindings: (workerSettings.bindings || []).map(binding => binding.type === 'assets' ? {name: binding.name, type: 'assets'} : {name: binding.name, type: 'inherit'}),
    annotations: {'workers/message': id}
  };
  for (const key of ['placement', 'tail_consumers', 'logpush', 'observability', 'limits', 'usage_model']) if (workerSettings[key] !== undefined) metadata[key] = workerSettings[key];
  const form = new FormData();
  form.set('metadata', JSON.stringify(metadata));
  for (const moduleName of Object.keys(manifest.hashes)) form.set(moduleName, new Blob([await fs.readFile(path.join(directory, moduleName))], {type: 'application/javascript+module'}), moduleName);
  return api(base(target.name) + '/versions?bindings_inherit=strict', 'POST', form);
}
async function retryFetch(url, options = {}) {
  let last;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const response = await fetch(url, {...options, headers: {'cache-control': 'no-cache', pragma: 'no-cache', ...(options.headers || {})}, signal: AbortSignal.timeout(45000)});
      if (response.ok) return response;
      last = Error(`${response.status} ${url}`);
    } catch (error) { last = error; }
    await sleep(1500 * (attempt + 1));
  }
  throw last;
}
async function verifyLive(receipt) {
  const nonce = Date.now();
  const htmlPaths = [
    '/', '/best-aba-therapy-center-india-proven-improvement-rate', '/enroll-autism-speech-aba-therapies-india',
    '/privacy-policy', '/cookie-policy', '/policies',
    '/national-autism-helpline', '/contact-national-autism-helpline-24-7', '/verify/',
    '/verify/evidence/privacy.html', '/verify/evidence/records/md5.html', '/verify/evidence/publications/voice-of-the-unheard.html',
    '/verify/evidence/paradigm/01-life-in-view.html', '/verify/guides/abilityscore.html', '/verify/guides/te/abilityscore.html'
  ];
  const pages = [];
  for (const pathname of htmlPaths) {
    const response = await retryFetch(`https://www.pinnacleblooms.org${pathname}${pathname.includes('?') ? '&' : '?'}release_readback=${nonce}`);
    const text = await response.text();
    for (const token of ['data-analytics-choice', 'data-analytics-settings', 'data-ad-call-preferences', 'data-speech-measurement']) assert(!text.includes(token), `${token} remains on ${pathname}`);
    if (pathname.startsWith('/verify/')) {
      assert.equal(response.headers.get('x-pinnacle-verify-measurement'), 'automatic-20261019', pathname);
      assert.equal((text.match(/google-ads-call\.js\?module=verify-reader&v=4/g) || []).length, 1, pathname);
    }
    if (pathname === '/verify/evidence/privacy.html') assert(text.includes('The Google tag starts automatically on production Verify pages.'));
    if (pathname === '/verify/guides/abilityscore.html') assert.equal(response.headers.get('x-pinnacle-google-ads-call-measurement'), 'v4-call-measurement');
    if (pathname.includes('best-aba-therapy')) assert((response.headers.get('content-security-policy') || '').includes('https://protect.pinnacleblooms.org'));
    pages.push({pathname, status: response.status, marker: response.headers.get('x-pinnacle-verify-measurement'), callMarker: response.headers.get('x-pinnacle-google-ads-call-measurement'), sha256: sha(Buffer.from(text))});
  }
  const assetKeys = Object.keys(sharedAssets);
  const expectedAssets = [
    ['/pinnacle-pages-scripts/speech-measurement.js', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/speech-measurement.js'))],
    ['/pinnacle-pages-scripts/cheq-protection.js', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/cheq-protection.js'))],
    [assetKeys.find(key => key.includes('protection-consumer')), Buffer.from(sharedAssets[assetKeys.find(key => key.includes('protection-consumer'))].body)],
    [assetKeys.find(key => key.includes('centre-operating-holds')), Buffer.from(sharedAssets[assetKeys.find(key => key.includes('centre-operating-holds'))].body)]
  ];
  const assets = [];
  for (const [pathname, expected] of expectedAssets) {
    assert(pathname, 'Expected shared asset route missing');
    const response = await retryFetch(`https://www.pinnacleblooms.org${pathname}?release_readback=${nonce}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.match(response.headers.get('content-type') || '', /javascript/);
    assert.equal(sha(bytes), sha(expected), pathname);
    assets.push({pathname, status: response.status, sha256: sha(bytes), contentType: response.headers.get('content-type')});
  }
  const bootstrap = await (await retryFetch(`https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js?v=4&release_readback=${nonce}`)).text();
  const canonicalBootstrap = (await fs.readFile(path.join(site, 'src/lib/google-ads-call-consent.mjs'), 'utf8')).replace(/^export /gm, '');
  assert.equal(bootstrap, canonicalBootstrap);
  const reader = await (await retryFetch(`https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js?module=verify-reader&v=4&release_readback=${nonce}`)).text();
  assert.equal(reader, await fs.readFile(path.join(root, 'verify-site/dist/reader-extras.js'), 'utf8'));
  execFileSync(process.execPath, [path.join(site, 'scripts/verify-measurement-always-on-live-browser.mjs'), path.join(releaseDir, 'live-browser.json')], {cwd: site, stdio: 'inherit', windowsHide: true});

  const moduleEvidence = {};
  for (const target of Object.values(targets)) {
    const live = await modules(target.name);
    const manifest = receipt.candidates[target.name].manifest;
    assert.equal(live.length, manifest.moduleCount, `${target.name} module count`);
    for (const module of live) assert.equal(sha(module.bytes), manifest.hashes[module.name], `${target.name}/${module.name}`);
    moduleEvidence[target.name] = {version: receipt.candidates[target.name].version, moduleCount: live.length, hashes: Object.fromEntries(live.map(module => [module.name, sha(module.bytes)]))};
  }
  return {at: new Date().toISOString(), pages, assets, bootstrapSha256: sha(Buffer.from(bootstrap)), readerSha256: sha(Buffer.from(reader)), workers: moduleEvidence, browser: 'live-browser.json'};
}

async function prepare() {
  await fs.mkdir(releaseDir, {recursive: true});
  assert.equal(git(['status', '--porcelain', '--untracked-files=no']), '', 'Tracked worktree must be clean');
  const commit = git(['rev-parse', 'HEAD']);
  assert.equal(git(['rev-parse', 'origin/main']), commit, 'Release only the merged origin/main commit');
  const before = await snapshot();
  const captures = {};
  for (const target of Object.values(targets)) captures[target.name] = await saveCaptured(target.name, await modules(target.name));
  await save(beforePath, before);
  const receipt = {id, phase: 'prepared', preparedAt: new Date().toISOString(), commit, beforeVersions: Object.fromEntries(Object.values(targets).map(target => [target.name, before.workers[target.name].versions])), captures, candidates: {}, promotions: {}};
  await save(receiptPath, receipt);
  console.log(JSON.stringify({phase: receipt.phase, commit, captures}));
}
async function assemble() {
  const receipt = await load(receiptPath);
  assert(['prepared', 'assembled'].includes(receipt.phase));
  assert.equal(git(['rev-parse', 'HEAD']), receipt.commit);
  await assertDrift(receipt, false);
  const manifests = await assembleCandidates(receipt.commit);
  receipt.candidates = Object.fromEntries(Object.entries(manifests).map(([name, manifest]) => [name, {manifest}]));
  receipt.phase = 'assembled'; receipt.assembledAt = new Date().toISOString();
  await save(receiptPath, receipt);
  console.log(JSON.stringify({phase: receipt.phase, candidates: Object.fromEntries(Object.entries(manifests).map(([name, value]) => [name, value.moduleCount]))}));
}
async function upload() {
  const receipt = await load(receiptPath);
  assert(['assembled', 'uploaded'].includes(receipt.phase));
  assert.equal(git(['rev-parse', 'HEAD']), receipt.commit);
  assert.equal(git(['ls-remote', 'origin', 'refs/heads/main']).split(/\s/)[0], receipt.commit, 'Merged commit is not remote main');
  await assertDrift(receipt, false);
  if (!receipt.ci) receipt.ci = await waitForCi(receipt.commit);
  for (const target of Object.values(targets)) if (!receipt.candidates[target.name].version) {
    const result = await uploadWorker(target, await load(beforePath), receipt.candidates[target.name].manifest);
    receipt.candidates[target.name].version = result.id;
    receipt.candidates[target.name].uploadedAt = new Date().toISOString();
    await save(receiptPath, receipt);
  }
  receipt.phase = 'uploaded'; await save(receiptPath, receipt);
  console.log(JSON.stringify({phase: receipt.phase, versions: Object.fromEntries(Object.entries(receipt.candidates).map(([name, value]) => [name, value.version]))}));
}
async function promote() {
  const receipt = await load(receiptPath);
  assert(['uploaded', 'promoted'].includes(receipt.phase));
  await assertDrift(receipt, true);
  for (const key of ['call', 'portal', 'helpline']) {
    const target = targets[key];
    if (receipt.promotions[target.name]) continue;
    const result = await api(base(target.name) + '/deployments', 'POST', {strategy: 'percentage', versions: [{version_id: receipt.candidates[target.name].version, percentage: 100}]});
    receipt.promotions[target.name] = {deployment: result.id, at: new Date().toISOString()};
    await save(receiptPath, receipt);
  }
  receipt.phase = 'promoted'; receipt.promotedAt = new Date().toISOString(); await save(receiptPath, receipt);
  console.log(JSON.stringify({phase: receipt.phase, promotions: receipt.promotions}));
}
async function verify() {
  const receipt = await load(receiptPath);
  assert.equal(receipt.phase, 'promoted');
  await assertDrift(receipt, true);
  receipt.live = await verifyLive(receipt);
  receipt.phase = 'verified-live'; receipt.verifiedAt = receipt.live.at;
  await save(receiptPath, receipt);
  console.log(JSON.stringify({phase: receipt.phase, commit: receipt.commit, verifiedAt: receipt.verifiedAt, workers: Object.fromEntries(Object.entries(receipt.live.workers).map(([name, value]) => [name, value.version]))}));
}

const operations = {prepare, assemble, upload, promote, verify};
if (phase === 'all') {
  let receipt = await fs.stat(receiptPath).then(() => load(receiptPath)).catch(() => null);
  if (!receipt) { await prepare(); receipt = await load(receiptPath); }
  if (receipt.phase === 'prepared') { await assemble(); receipt = await load(receiptPath); }
  if (receipt.phase === 'assembled') { await upload(); receipt = await load(receiptPath); }
  if (receipt.phase === 'uploaded') { await promote(); receipt = await load(receiptPath); }
  if (receipt.phase === 'promoted') await verify();
  else assert.equal(receipt.phase, 'verified-live');
} else await operations[phase]();
