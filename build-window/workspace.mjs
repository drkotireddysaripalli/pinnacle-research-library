// Development entry point. Reuses the portal's existing builders and tests.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn, spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const site = path.join(root, 'speech-site');
const results = path.join(here, 'results');
const action = process.argv[2] || 'doctor';
const localNode = path.join(here, '.toolchain', 'node_modules', 'node', 'bin', process.platform === 'win32' ? 'node.exe' : 'node');
if (Number(process.versions.node.split('.')[0]) !== 24 && fs.existsSync(localNode)) {
  const run = spawnSync(localNode, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {stdio: 'inherit', env: process.env});
  if (run.error) throw run.error;
  process.exit(run.status ?? 1);
}

function git(...args) {
  const run = spawnSync('git', args, {cwd: root, encoding: 'utf8', windowsHide: true});
  if (run.error || run.status !== 0) throw new Error(run.error?.message || run.stderr.trim());
  return run.stdout.trim();
}
function npmCli() {
  if (process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) return process.env.npm_execpath;
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    for (const name of ['npm', 'npm.cmd']) {
      const candidate = path.join(dir, name);
      if (!fs.existsSync(candidate)) continue;
      const real = fs.realpathSync(candidate);
      if (real.endsWith('npm-cli.js')) return real;
      for (const cli of [path.join(dir, 'node_modules', 'npm', 'bin', 'npm-cli.js'), path.resolve(dir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')]) {
        if (fs.existsSync(cli)) return cli;
      }
    }
  }
  throw new Error('npm CLI not found. Add the installed npm runtime to PATH.');
}

const recipes = {
  install: ['npm', 'ci', '--no-audit', '--no-fund'],
  build: ['npm', 'run', 'build'],
  unit: ['npm', 'run', 'test:unit'],
  contracts: ['npm', 'run', 'test:testingbot-contract'],
  'ask-build': ['npm', 'run', 'build:ask'],
  browser: ['npm', 'exec', '--', 'playwright', 'test', 'tests/browser/portal-smoke.spec.mjs', 'tests/browser/pinnacleai-layout.spec.mjs', '--project=phone-320', '--project=phone-390', '--project=tablet-768', '--project=desktop-1440'],
  'browser-webkit': ['npm', 'exec', '--', 'playwright', 'test', 'tests/browser/portal-smoke.spec.mjs', 'tests/browser/pinnacleai-layout.spec.mjs', '--project=webkit'],
  preview: ['node', 'scripts/serve-quality-preview.mjs']
};
const branch = git('branch', '--show-current');
const source = git('rev-parse', 'HEAD');
const siteSourceTree = git('rev-parse', 'HEAD:speech-site');
if (action === 'doctor') {
  const pkg = JSON.parse(fs.readFileSync(path.join(site, 'package.json'), 'utf8'));
  console.log(JSON.stringify({root, site, branch: branch || '(detached)', source,
    originMain: git('rev-parse', 'origin/main'), node: process.version,
    ciNodeMajor: 24, nodeMatchesCI: Number(process.versions.node.split('.')[0]) === 24,
    dependenciesInstalled: fs.existsSync(path.join(site, 'node_modules', 'astro', 'package.json')),
    npmCli: npmCli(), scripts: Object.keys(pkg.scripts), commands: ['doctor', 'sync', ...Object.keys(recipes)],
    previewURL: 'http://127.0.0.1:4340/',
    cloudTests: 'Use existing trusted CI / Windows coordinator. Local launcher starts no cloud sessions.'}, null, 2));
  process.exit(0);
}
if (action === 'sync') {
  const run = spawnSync('git', ['fetch', '--no-tags', 'origin', 'main'], {cwd: root, stdio: 'inherit'});
  if (run.error) throw run.error;
  if (run.status !== 0) process.exit(run.status ?? 1);
  console.log('Fetched main. Review the diff and reconcile your branch explicitly; no merge or rebase was performed.');
  process.exit(0);
}
if (!recipes[action]) throw new Error('Choose: doctor, sync, ' + Object.keys(recipes).join(', '));
if (!branch || ['main', 'master'].includes(branch)) throw new Error('Use a dedicated feature branch for this development launcher.');
if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Use Node 24 to match the existing CI. See build-window/README.md.');

fs.mkdirSync(results, {recursive: true});
const [kind, ...args] = recipes[action];
const env = {...process.env, PINNACLE_RELEASE: 'production'};
env.PATH = path.dirname(process.execPath) + path.delimiter + (process.env.PATH || '');
// Always use the loopback candidate. Ambient shell configuration cannot select production.
delete env.PORTAL_ORIGIN;
env.QUALITY_PREVIEW_PORT = '4340';
if (action.startsWith('browser')) {
  if (!fs.existsSync(path.join(site, 'dist', 'index.html'))) throw new Error('Build the static candidate first.');
  const previewRecord = path.join(results, 'preview.json');
  if (fs.existsSync(previewRecord)) {
    const record = JSON.parse(fs.readFileSync(previewRecord, 'utf8'));
    try {
      process.kill(record.childPid, 0);
      if (record.siteSourceTree !== siteSourceTree) throw new Error('Running preview belongs to another portal source tree; restart it.');
      env.PORTAL_ORIGIN = 'http://127.0.0.1:4340';
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
}
if (action === 'preview' && !fs.existsSync(path.join(site, 'dist', 'index.html'))) throw new Error('Build the static candidate first.');
const actualArgs = kind === 'npm' ? [npmCli(), ...args] : args;
const startedAt = new Date().toISOString();
const trackedSiteChangesBefore = git('status', '--porcelain', '--', 'speech-site');
// These byte-parity fixtures must be regenerated from this checkout's source,
// including its actual line endings. Reuse the existing small builders.
if (action === 'unit') {
  for (const script of ['build-public-ad-call.mjs', 'build-ad-call-bootstrap.mjs', 'build-book-attribution.mjs']) {
    const prep = spawnSync(process.execPath, ['scripts/' + script], {cwd: site, stdio: 'inherit', env});
    if (prep.error) throw prep.error;
    if (prep.status !== 0) throw new Error(script + ' failed before unit execution.');
  }
}
const child = spawn(process.execPath, actualArgs, {cwd: site, stdio: 'inherit', env});
const record = {action, branch, source, siteSourceTree, node: process.version, startedAt, childPid: child.pid,
  trackedSiteChangesBefore,
  scope: action.startsWith('browser') ? 'Existing static portal smoke + PinnacleAI layout cases on selected emulated projects' : action,
  establishedByThisRun: 'Only the selected local command; no cloud, physical-device, deployment or business result is implied'};
const save = data => fs.writeFileSync(path.join(results, action + '.json'), JSON.stringify({...record, ...data}, null, 2) + '\n');
save({status: 'running'});
let receivedSignal;
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {receivedSignal = signal; child.kill(signal);});
child.on('error', error => {save({status: 'failed', error: error.message, completedAt: new Date().toISOString()}); process.exitCode = 1;});
child.on('exit', (code, signal) => {
  save({status: action === 'preview' && (signal || receivedSignal) ? 'stopped' : code === 0 ? 'passed' : 'failed',
    exitCode: code, signal: signal || receivedSignal || null, completedAt: new Date().toISOString(),
    trackedSiteChangesAfter: git('status', '--porcelain', '--', 'speech-site')});
  process.exitCode = action === 'preview' && (signal || receivedSignal) ? 0 : code ?? 1;
});
