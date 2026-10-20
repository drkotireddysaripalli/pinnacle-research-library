import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {patchReceiverContactAcquisition, assertReceiverContactAcquisitionPatch} from '../deployment/receiver-acquisition-patch.mjs';

const phase = process.argv[2] || 'all';
const phases = ['prepare', 'assemble', 'upload', 'promote', 'verify', 'rollback'];
assert(phase === 'all' || phases.includes(phase), `Use all or ${phases.join(', ')}`);
const portalOnly = process.argv.includes('--portal-only');
const portalAndReceiver = process.argv.includes('--portal-and-receiver');
const cspOnly = process.argv.includes('--csp-only');
assert([portalOnly,portalAndReceiver,cspOnly].filter(Boolean).length<=1,'Choose one release scope');
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(site, '..');
const id = cspOnly ? 'ga4-primary-csp-live-20261020' : portalOnly ? 'contact-packaging-live-20261020' : 'contact-source-live-20261020';
const releaseDir = path.resolve(process.env.PINNACLE_RELEASE_DIR || path.join(root, `artifacts/${id}/release`));
const receiptPath = path.join(releaseDir, 'receipt.json');
const beforePath = path.join(releaseDir, 'before.json');
const account = '862998def1cd610fdb86b8e5c1d6ed4d';
const zone = '8b13f18e0589996b5d6512552372b434';
const targets = {
  receiver: {name: 'pbn-planetscale', main: 'index.js'},
  ask: {name:'pinnacle-ask',main:'public-measurement-entry.mjs',keepAssets:true},
  call: {name: 'pinnacle-google-ads-call-measurement', main: 'index.mjs'},
  portal: {name: 'pinnacle-verify-route', main: 'public-document-recovery-entry.mjs', keepAssets: true},
  helpline: {name: 'pinnacle-helpline', main: 'worker.mjs'}
};
const releaseTargets = portalOnly ? {portal: targets.portal} : portalAndReceiver ? {portal:targets.portal,receiver:targets.receiver} : cspOnly ? {portal:targets.portal,ask:targets.ask,call:targets.call,helpline:targets.helpline} : targets;
const protectedNames = ['pinnacle-legacy-social-metadata', 'pinnacle-root-sitemap', 'materials-mobile-desktop-tracker', 'pinnacle-ask-mcp', 'pinnacle-centre-search-repair',
  ...Object.entries(targets).filter(([key])=>!releaseTargets[key]).map(([,target])=>target.name)];
const portalLocalModules = [
  'book-attribution-handler.mjs', 'first-conversation-handler.mjs', 'seva-handler.mjs',
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
const gitBytes = args => execFileSync('git', args, {cwd: root, windowsHide: true, maxBuffer: 64 * 1024 * 1024});
const gh = args => execFileSync('gh', args, {cwd: root, encoding: 'utf8', windowsHide: true}).trim();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const treeOf = commit => {
  try { return git(['rev-parse', `${commit}^{tree}`]); }
  catch { return null; }
};

async function readToken() {
  const raw = await fs.readFile(process.env.HOME + '/Library/Preferences/.wrangler/config/default.toml', 'utf8');
  const token = raw.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1] || raw.match(/^api_token\s*=\s*"([^"]+)"/m)?.[1];
  assert(token, 'Wrangler token missing');
  return token;
}
const token = await readToken();
const capturedMainModules={};
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
  const form=await response.formData();
  let metadata;try{const raw=form.get('metadata');metadata=typeof raw==='string'?JSON.parse(raw):raw?JSON.parse(await raw.text()):null;}catch{}
  capturedMainModules[name]=response.headers.get('cf-entrypoint')||metadata?.main_module||null;
  for (const [key, value] of form) if (key!=='metadata'&&typeof value !== 'string') {
    const moduleName = value.name || key;
    assert(/^(?:[\w.@-]+\/)*[\w.@-]+$/.test(moduleName)&&moduleName.split('/').every(part=>part!=='.'&&part!=='..'), `Unsafe module name ${moduleName}`);
    out.push({name: moduleName, contentType:value.type||(/\.wasm$/.test(moduleName)?'application/wasm':'application/javascript+module'), bytes: Buffer.from(await value.arrayBuffer())});
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
const cleanRoutes = routes => routes.map(({id: routeId, pattern, script}) => ({id: routeId, pattern, script})).sort((a, b) => a.pattern.localeCompare(b.pattern));
const stableSettings = value => Object.fromEntries(['compatibility_date', 'compatibility_flags', 'bindings', 'placement', 'tail_consumers', 'logpush', 'observability', 'limits', 'usage_model'].filter(key => value[key] !== undefined).map(key => [key, value[key]]));
async function snapshot() {
  const names = [...new Set([...Object.values(releaseTargets).map(target => target.name), ...protectedNames])];
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
  for (const module of workerModules) {const target=path.join(directory,module.name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,module.bytes);}
  return {sourceMain:capturedMainModules[name],contentTypes:Object.fromEntries(workerModules.map(module=>[module.name,module.contentType])),moduleCount: workerModules.length, hashes: Object.fromEntries(workerModules.map(module => [module.name, sha(module.bytes)]))};
}
async function captured(name) {
 const directory=path.join(releaseDir,'captured',name),receipt=await load(receiptPath),capture=receipt.captures[name],hashes=capture.hashes;
 return Promise.all(Object.keys(hashes).sort().map(async name=>{const bytes=await fs.readFile(path.join(directory,name));assert.equal(sha(bytes),hashes[name],'Captured module changed: '+name);return {name,bytes,contentType:capture.contentTypes?.[name]};}));
}
async function assertDrift(receipt, allowPromoted = true) {
  const before = await load(beforePath);
  const now = await snapshot();
  assert.deepEqual(now.routes, before.routes, 'Cloudflare route drift');
  for (const name of protectedNames) {
    assert.deepEqual(now.workers[name].versions, before.workers[name].versions, `${name} version drift`);
    assert.deepEqual(stableSettings(now.workers[name].settings), stableSettings(before.workers[name].settings), `${name} settings drift`);
  }
  for (const target of Object.values(releaseTargets)) {
    const promoted = receipt.promotions?.[target.name];
    const expected = allowPromoted && promoted && !receipt.rollback?.[target.name] ? [{version_id: receipt.candidates[target.name].version, percentage: 100}] : before.workers[target.name].versions;
    assert.deepEqual(now.workers[target.name].versions, expected, `${target.name} version drift`);
    assert.deepEqual(stableSettings(now.workers[target.name].settings), stableSettings(before.workers[target.name].settings), `${target.name} settings drift`);
  }
  return now;
}
async function writeCandidate(name, main, workerModules) {
  const directory = path.join(releaseDir, 'candidate', name);
  await fs.rm(directory, {recursive: true, force: true});
  await fs.mkdir(directory, {recursive: true});
  for (const module of workerModules) {const target=path.join(directory,module.name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,module.bytes);}
  const manifest = {main, contentTypes:Object.fromEntries(workerModules.map(module=>[module.name,module.contentType||'application/javascript+module'])), moduleCount: workerModules.length, hashes: Object.fromEntries(workerModules.map(module => [module.name, sha(module.bytes)]))};
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
  for (const {source, target, external} of [
    {source: 'shared-assets-repair.mjs', target: 'shared-assets-repair.mjs'},
    {source: 'shared-navigation.mjs', target: 'shared-navigation.mjs', external: ['./public-ad-call.mjs']},
    {source: 'shared-clearance.mjs', target: 'shared-clearance-runtime.mjs'}
  ]) {
    const bundled = await build({
      entryPoints: [path.join(site, 'deployment', source)], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: source === 'shared-clearance.mjs', charset: 'utf8', write: false, logLevel: 'silent',
      ...(external ? {external} : {})
    });
    byName.set(target, {name: target, bytes: Buffer.from(bundled.outputFiles[0].contents)});
  }
  for (const name of ['public-document-recovery-entry.mjs', 'managed-sitemap-entry.mjs', 'shared-clearance-entry-20261012.mjs', 'faq-navigation-entry.mjs', 'shared-assets-entry.mjs']) assert(byName.has(name), `Captured composition module missing: ${name}`);
  const portalModules = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  const fixture = path.join(releaseDir, 'candidate', targets.portal.name);
  const portalManifest = await writeCandidate(targets.portal.name, targets.portal.main, portalModules);
  await build({entryPoints: [path.join(fixture, targets.portal.main)], bundle: true, format: 'esm', platform: 'browser', write: false, logLevel: 'silent'});

  const manifests = {[targets.portal.name]: portalManifest};
  if (!portalOnly) {
    if(releaseTargets.receiver){
    const receiverModules = await captured(targets.receiver.name);
    const receiverByName = new Map(receiverModules.map(module => [module.name, module]));
    for (const name of ['website-enrolment-receipt.mjs', 'website-enrolment-analytics.mjs']) {
      const module = receiverByName.get(name);
      assert(module, `Captured receiver module missing: ${name}`);
      const before = module.bytes.toString('utf8');
      const after = patchReceiverContactAcquisition(before);
      assertReceiverContactAcquisitionPatch(before, after);
      receiverByName.set(name, {name, bytes: Buffer.from(after)});
    }
    const receiverCandidate = [...receiverByName.values()].sort((a, b) => a.name.localeCompare(b.name));
    const receiverManifest = await writeCandidate(targets.receiver.name, targets.receiver.main, receiverCandidate);
    manifests[targets.receiver.name] = receiverManifest;
    execFileSync(process.execPath, [path.join(site, 'scripts/verify-contact-source-receiver-candidate.mjs'), path.join(releaseDir, 'candidate', targets.receiver.name, 'website-enrolment-receipt.mjs')], {cwd: site, stdio: 'inherit', windowsHide: true});
    }

    if(releaseTargets.call){
    const callSource = path.join(site, 'workers/google-ads-call-measurement/index.mjs');
    assert.equal(sha(await fs.readFile(callSource)), sha(gitBytes(['show', `${commit}:speech-site/workers/google-ads-call-measurement/index.mjs`])), 'Uncommitted call worker');
    const callBuild = await build({entryPoints: [callSource], bundle: true, format: 'esm', platform: 'browser', write: false, logLevel: 'silent'});
    manifests[targets.call.name] = await writeCandidate(targets.call.name, targets.call.main, [{name: targets.call.main, bytes: callBuild.outputFiles[0].contents}]);

    }
    if(releaseTargets.helpline){
    const helplineSource = path.join(root, 'helpline-site/worker.mjs');
    assert.equal(sha(await fs.readFile(helplineSource)), sha(gitBytes(['show', `${commit}:helpline-site/worker.mjs`])), 'Uncommitted helpline worker');
    manifests[targets.helpline.name] = await writeCandidate(targets.helpline.name, targets.helpline.main, [{name: targets.helpline.main, bytes: await fs.readFile(helplineSource)}]);
    }
  }
  if(releaseTargets.ask){
    const originals=await captured(targets.ask.name);
    const info=await load(receiptPath);let originalMain=info.captures[targets.ask.name].sourceMain;
    if(originalMain===targets.ask.main){
      const current=originals.find(module=>module.name===originalMain)?.bytes.toString('utf8');
      originalMain=/import original from ["']\.\/([^"']+)["']/.exec(current||'')?.[1];
      assert(originalMain&&originalMain!==targets.ask.main,'Existing Ask wrapper original entry missing');
    }
    if(!originalMain){
      const imported=new Set(originals.flatMap(m=>[...m.bytes.toString().matchAll(/(?:from\s*|import\s*)['"]\.\/([^'"]+)['"]/g)].map(v=>v[1])));
      const roots=originals.filter(m=>/\.(?:mjs|js)$/.test(m.name)&&!imported.has(m.name)&&/export\s*(?:default|\{[^}]*\bdefault\b)/s.test(m.bytes.toString()));
      assert.equal(roots.length,1,'Ask original main module is ambiguous');originalMain=roots[0].name;
    }
    assert(originals.some(m=>m.name===originalMain),'Captured Ask main missing');
    const wrapper=await build({stdin:{contents:`import original from './${originalMain}';import{createPublicMeasurementWrapper}from'./public-measurement-wrapper.mjs';export default createPublicMeasurementWrapper(original);`,resolveDir:path.join(site,'deployment')},bundle:true,format:'esm',platform:'browser',write:false,external:['./'+originalMain],logLevel:'silent'});
    manifests[targets.ask.name]=await writeCandidate(targets.ask.name,targets.ask.main,[...originals.filter(module=>module.name!==targets.ask.main),{name:targets.ask.main,bytes:wrapper.outputFiles[0].contents}]);
  }
  return manifests;
}
async function waitForCi(commit) {
  const deadline = Date.now() + 35 * 60 * 1000;
  const releaseTree = treeOf(commit);
  assert(releaseTree, `Release tree missing for ${commit}`);
  while (Date.now() < deadline) {
    const runs = JSON.parse(gh(['run', 'list', '--workflow', 'portal-quality.yml', '--event', 'push', '--limit', '50', '--json', 'databaseId,headSha,status,conclusion,url']));
    const exact = runs.find(item => item.headSha === commit);
    if (exact?.status === 'completed' && exact.conclusion !== 'success') throw Error(`Portal quality failed: ${exact.url}`);
    const equivalent = runs.find(item => item.status === 'completed' && item.conclusion === 'success' && treeOf(item.headSha) === releaseTree);
    const run = exact?.status === 'completed' && exact.conclusion === 'success' ? exact : equivalent;
    if (run) {
      const testedTree = treeOf(run.headSha);
      assert.equal(testedTree, releaseTree, 'Trusted CI tree differs from release tree');
      const directory = path.join(releaseDir, 'ci');
      await fs.rm(directory, {recursive: true, force: true});
      await fs.mkdir(directory, {recursive: true});
      execFileSync('gh', ['run', 'download', String(run.databaseId), '--name', 'testingbot-build-verification', '--dir', directory], {cwd: root, stdio: 'inherit', windowsHide: true});
      const report = path.join(directory, 'report.json');
      execFileSync(process.execPath, [path.join(site, 'scripts/assert-testingbot-release.mjs'), report], {cwd: site, stdio: 'inherit', windowsHide: true, env: {...process.env, GITHUB_SHA: run.headSha}});
      return {...run, releaseCommit: commit, testedCommit: run.headSha, releaseTree, testedTree, identicalTreeReuse: run.headSha !== commit, reportSha256: sha(await fs.readFile(report))};
    }
    console.log(JSON.stringify({waitingFor: 'Portal quality', commit, releaseTree, status: exact?.status || 'not-started', at: new Date().toISOString()}));
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
  for (const moduleName of Object.keys(manifest.hashes)) form.set(moduleName, new Blob([await fs.readFile(path.join(directory, moduleName))], {type:manifest.contentTypes?.[moduleName]||'application/javascript+module'}), moduleName);
  return api(base(target.name) + '/versions?bindings_inherit=strict', 'POST', form);
}
async function retryFetch(url, options = {}, accept) {
  let last;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const response = await fetch(url, {...options, headers: {'cache-control': 'no-cache', pragma: 'no-cache', ...(options.headers || {})}, signal: AbortSignal.timeout(45000)});
      if (response.ok && (!accept || await accept(response.clone()))) return response;
      last = Error(`${response.status} response did not meet live acceptance for ${new URL(url).pathname}`);
    } catch (error) { last = error; }
    console.log(JSON.stringify({waitingFor: 'live acceptance', pathname: new URL(url).pathname, attempt: attempt + 1, at: new Date().toISOString()}));
    await sleep(1500 * (attempt + 1));
  }
  throw last;
}
async function verifyLive(receipt) {
  if(cspOnly)return verifyCspLive(receipt);
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
    const query = pathname === '/contact-national-autism-helpline-24-7'
      ? `utm_source=google&utm_medium=cpc&utm_campaign=contact_release_acceptance&utm_content=release_${nonce}&gclid=EAIaIQobChMIrelease${nonce}`
      : `release_readback=${nonce}`;
    const response = await retryFetch(`https://www.pinnacleblooms.org${pathname}${pathname.includes('?') ? '&' : '?'}${query}`, {}, pathname === '/contact-national-autism-helpline-24-7'
      ? candidate => candidate.headers.get('x-pinnacle-contact-receipt') === 'durable-contact-v1' && candidate.headers.get('x-pinnacle-legacy-measurement') === 'helpline'
      : undefined);
    const text = await response.text();
    for (const token of ['data-analytics-choice', 'data-analytics-settings', 'data-ad-call-preferences', 'data-speech-measurement']) assert(!text.includes(token), `${token} remains on ${pathname}`);
    if (pathname.startsWith('/verify/')) {
      assert.equal(response.headers.get('x-pinnacle-verify-measurement'), 'automatic-20261019', pathname);
      assert.equal((text.match(/google-ads-call\.js\?module=verify-reader&v=4/g) || []).length, 1, pathname);
    }
    if (pathname === '/verify/evidence/privacy.html') assert(text.includes('The Google tag starts automatically on production Verify pages.'));
    if (pathname === '/verify/guides/abilityscore.html') assert.equal(response.headers.get('x-pinnacle-google-ads-call-measurement'), 'v4-call-measurement');
    if (pathname.includes('best-aba-therapy')) assert((response.headers.get('content-security-policy') || '').includes('https://protect.pinnacleblooms.org'));
    if (pathname === '/contact-national-autism-helpline-24-7') {
      assert.equal(response.headers.get('x-pinnacle-contact-receipt'), 'durable-contact-v1');
      assert.equal(response.headers.get('x-pinnacle-legacy-measurement'), 'helpline');
      assert(text.includes('data-contact-contract="durable-contact-v1"'));
      assert(text.includes('action="/api/enrolment"'));
      assert.equal((text.match(/contact-receipt\.js\?v=contact-source-20261020/g) || []).length, 1);
      assert.equal((text.match(/speech-measurement\.js\?v=measurement-completion-20261020/g) || []).length, 1);
    }
    pages.push({pathname, variant: pathname === '/contact-national-autism-helpline-24-7' ? 'google-ads-tagged' : 'default', status: response.status, marker: response.headers.get('x-pinnacle-verify-measurement'), callMarker: response.headers.get('x-pinnacle-google-ads-call-measurement'), contactMarker: response.headers.get('x-pinnacle-contact-receipt'), sha256: sha(Buffer.from(text))});
  }
  const cleanContactPath = '/contact-national-autism-helpline-24-7';
  const cleanContactResponse = await retryFetch(`https://www.pinnacleblooms.org${cleanContactPath}`, {}, candidate => candidate.headers.get('x-pinnacle-contact-receipt') === 'durable-contact-v1' && candidate.headers.get('x-pinnacle-legacy-measurement') === 'helpline');
  const cleanContactText = await cleanContactResponse.text();
  assert(cleanContactText.includes('data-contact-contract="durable-contact-v1"'));
  assert(cleanContactText.includes('action="/api/enrolment"'));
  pages.push({pathname: cleanContactPath, variant: 'untagged', status: cleanContactResponse.status, marker: cleanContactResponse.headers.get('x-pinnacle-verify-measurement'), callMarker: cleanContactResponse.headers.get('x-pinnacle-google-ads-call-measurement'), contactMarker: cleanContactResponse.headers.get('x-pinnacle-contact-receipt'), sha256: sha(Buffer.from(cleanContactText))});
  const expectedAssets = [
    ['/pinnacle-pages-scripts/contact-receipt.js', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/contact-receipt.js'))],
    ['/pinnacle-pages-scripts/contact-api.mjs', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/contact-api.mjs'))],
    ['/pinnacle-pages-scripts/contact-options.mjs', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/contact-options.mjs'))],
    ['/pinnacle-pages-scripts/enrolment-api.mjs', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/enrolment-api.mjs'))],
    ['/pinnacle-pages-scripts/enrolment-source.mjs', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/enrolment-source.mjs'))],
    ['/pinnacle-pages-scripts/speech-measurement.js', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/speech-measurement.js'))],
    ['/pinnacle-pages-scripts/cheq-protection.js', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/cheq-protection.js'))],
    ['/pinnacle-pages-scripts/protection-consumer.mjs', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/protection-consumer.mjs'))],
    ['/pinnacle-pages-scripts/centre-operating-holds.mjs', await fs.readFile(path.join(site, 'public/pinnacle-pages-scripts/centre-operating-holds.mjs'))]
  ];
  const assets = [];
  for (const [pathname, expected] of expectedAssets) {
    assert(pathname, 'Expected shared asset route missing');
    const response = await retryFetch(`https://www.pinnacleblooms.org${pathname}?release_readback=${nonce}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.match(response.headers.get('content-type') || '', /javascript/);
    assert.equal(sha(bytes), sha(expected), pathname);
    assets.push({pathname, status: response.status, sha256: sha(bytes), contentType: response.headers.get('content-type'), contactMarker: response.headers.get('x-pinnacle-contact-assets')});
  }
  const bootstrap = await (await retryFetch(`https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js?v=4&release_readback=${nonce}`)).text();
  const canonicalBootstrap = (await fs.readFile(path.join(site, 'src/lib/google-ads-call-consent.mjs'), 'utf8')).replace(/^export /gm, '');
  assert.equal(bootstrap, canonicalBootstrap);
  const reader = await (await retryFetch(`https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js?module=verify-reader&v=4&release_readback=${nonce}`)).text();
  assert.equal(reader, await fs.readFile(path.join(root, 'verify-site/dist/reader-extras.js'), 'utf8'));
  execFileSync(process.execPath, [path.join(site, 'scripts/verify-measurement-always-on-live-browser.mjs'), path.join(releaseDir, 'live-browser.json')], {cwd: site, stdio: 'inherit', windowsHide: true});
  execFileSync(process.execPath, [path.join(site, 'scripts/verify-google-click-wire.mjs'), path.join(releaseDir, 'google-click-wire.json')], {cwd: site, stdio: 'inherit', windowsHide: true});

  const moduleEvidence = {};
  for (const target of Object.values(releaseTargets)) {
    const live = await modules(target.name);
    const manifest = receipt.candidates[target.name].manifest;
    assert.equal(live.length, manifest.moduleCount, `${target.name} module count`);
    for (const module of live) assert.equal(sha(module.bytes), manifest.hashes[module.name], `${target.name}/${module.name}`);
    moduleEvidence[target.name] = {version: receipt.candidates[target.name].version, moduleCount: live.length, hashes: Object.fromEntries(live.map(module => [module.name, sha(module.bytes)]))};
  }
  return {at: new Date().toISOString(), pages, assets, bootstrapSha256: sha(Buffer.from(bootstrap)), readerSha256: sha(Buffer.from(reader)), workers: moduleEvidence, browser: 'live-browser.json'};
}
async function verifyCspLive(receipt){
 const pages=[];
 for(const [host,pathname]of [['www.pinnacleblooms.org','/autism-therapy'],['pinnacleblooms.org','/ask'],['www.pinnacleblooms.org','/verify/guides/abilityscore.html'],['www.pinnacleblooms.org','/national-autism-helpline']]){
  for(const method of ['GET','HEAD']){
   const response=await retryFetch('https://'+host+pathname,{method}),policy=response.headers.get('content-security-policy')||'',connect=policy.split(';').find(part=>part.trim().startsWith('connect-src '))||'';
   if(method==='GET')for(const origin of ['https://analytics.google.com','https://stats.g.doubleclick.net'])assert(connect.split(/\s+/).some(source=>source===origin||source===origin+'/g/collect'),origin+' absent from '+pathname);
   pages.push({host,pathname,method,status:response.status,contentSecurityPolicy:policy});await response.body?.cancel();
  }
 }
 const output=path.join(releaseDir,'csp-google-wire.json');
 execFileSync(process.execPath,[path.join(site,'scripts/verify-google-click-wire.mjs'),output,'--csp-probe'],{cwd:site,stdio:'inherit',windowsHide:true});
 const browser=await load(output);assert(browser.passed&&browser.pages.length===4,'Affected real Google CSP browser cases failed');
 const workers={};
 for(const target of Object.values(releaseTargets)){
  const actual=await modules(target.name),expected=receipt.candidates[target.name].manifest;
  assert.equal(actual.length,expected.moduleCount,target.name+' module count');
  for(const module of actual)assert.equal(sha(module.bytes),expected.hashes[module.name],target.name+' module mismatch '+module.name);
  workers[target.name]={version:receipt.candidates[target.name].version,moduleCount:actual.length,allModuleHashesMatch:true};
 }
 return {at:new Date().toISOString(),pages,workers,browser:{path:output,passed:true,cases:4},scope:'CSP collection only; unchanged UI/source/receipt suites retained from PR141 packets'};
}

async function prepare() {
  await fs.mkdir(releaseDir, {recursive: true});
  assert.equal(git(['status', '--porcelain', '--untracked-files=no']), '', 'Tracked worktree must be clean');
  const commit = git(['rev-parse', 'HEAD']);
  assert.equal(git(['rev-parse', 'origin/main']), commit, 'Release only the merged origin/main commit');
  const before = await snapshot();
  const captures = {};
  for (const target of Object.values(releaseTargets)) captures[target.name] = await saveCaptured(target.name, await modules(target.name));
  await save(beforePath, before);
  const receipt = {id, phase: 'prepared', portalOnly, portalAndReceiver, cspOnly, preparedAt: new Date().toISOString(), commit, beforeVersions: Object.fromEntries(Object.values(releaseTargets).map(target => [target.name, before.workers[target.name].versions])), captures, candidates: {}, promotions: {}};
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
  for (const target of Object.values(releaseTargets)) if (!receipt.candidates[target.name].version) {
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
  assert(!Object.keys(receipt.rollback || {}).length, 'Cannot promote a partially rolled-back release');
  await assertDrift(receipt, true);
  for (const key of Object.keys(releaseTargets)) {
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
async function rollback() {
  const receipt = await load(receiptPath);
  assert(['uploaded', 'promoted', 'verified-live'].includes(receipt.phase) && Object.keys(receipt.promotions || {}).length, `Cannot roll back ${receipt.phase}`);
  await assertDrift(receipt, true);
  // Restore the public producer before its private receiver so there is no
  // rollback interval where the newer public envelope reaches the older guard.
  for (const target of Object.values(releaseTargets).reverse()) {
    if (!receipt.promotions[target.name] || receipt.rollback?.[target.name]) continue;
    const versions = receipt.beforeVersions[target.name];
    assert(Array.isArray(versions) && versions.length, `Missing rollback versions for ${target.name}`);
    const result = await api(base(target.name) + '/deployments', 'POST', {strategy: 'percentage', versions});
    receipt.rollback ||= {};
    receipt.rollback[target.name] = {deployment: result.id, versions, at: new Date().toISOString()};
    await save(receiptPath, receipt);
  }
  await assertDrift(receipt, false);
  receipt.phase = 'rolled-back'; receipt.rolledBackAt = new Date().toISOString();
  await save(receiptPath, receipt);
  console.log(JSON.stringify({phase: receipt.phase, rollback: receipt.rollback}));
}

const operations = {prepare, assemble, upload, promote, verify, rollback};
if (phase === 'all') {
  let receipt = await fs.stat(receiptPath).then(() => load(receiptPath)).catch(() => null);
  if (!receipt) { await prepare(); receipt = await load(receiptPath); }
  if (receipt.phase === 'prepared') { await assemble(); receipt = await load(receiptPath); }
  if (receipt.phase === 'assembled') { await upload(); receipt = await load(receiptPath); }
  if (receipt.phase === 'uploaded') { await promote(); receipt = await load(receiptPath); }
  if (receipt.phase === 'promoted') await verify();
  else assert(['verified-live', 'rolled-back'].includes(receipt.phase));
} else await operations[phase]();
