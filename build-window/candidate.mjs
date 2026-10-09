import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const generated = p => /^speech-site\/deployment\/(?:[a-z0-9-]+-assets|public-ad-call|therapy-reading-content)\.mjs$/.test(p)
  || p === 'speech-site/workers/google-ads-call-measurement/index.mjs'
  || /^speech-site\/public\/pinnacle-pages-data\/.*(?:-machine\.md|-evidence\.(?:json|txt)|sitemap\.xml)$/.test(p);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function paths(root) {
  return execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', 'speech-site', 'verify-site'], {cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024})
    .split('\0').filter(Boolean).sort();
}
export function generatedHashes(root) {
  return Object.fromEntries(paths(root).filter(generated).filter(p => fs.existsSync(path.join(root, p))).map(p => [p, digest(fs.readFileSync(path.join(root, p)))]));
}
export function inputFingerprint(root, snapshots = {}) {
  const hash = createHash('sha256');
  for (const p of paths(root)) {
    // Local Playwright cases are not inputs to the Astro/Worker build. Their
    // separate hash is recorded on browser receipts, so assertion-only fixes
    // can reuse the unchanged built candidate without hiding test changes.
    if (p.startsWith('speech-site/tests/browser/')) continue;
    const full = path.join(root, p);
    const value = fs.existsSync(full) ? digest(fs.readFileSync(full)) : '(deleted)';
    const expected = snapshots[p];
    if (generated(p) && expected && [expected.before, expected.after].includes(value)) continue;
    hash.update(p + '\0' + value + '\n');
  }
  return hash.digest('hex');
}
export function browserTestFingerprint(root) {
  const hash = createHash('sha256');
  for (const p of paths(root).filter(p=>p.startsWith('speech-site/tests/browser/'))) {
    const full=path.join(root,p);
    hash.update(p+'\0'+(fs.existsSync(full)?digest(fs.readFileSync(full)):'(deleted)')+'\n');
  }
  return hash.digest('hex');
}
export function makeSnapshots(before, after) {
  return Object.fromEntries([...new Set([...Object.keys(before), ...Object.keys(after)])].map(p => [p, {before: before[p], after: after[p]}]));
}
export function requireCandidate(root, results) {
  const file = path.join(results, 'candidate.json');
  if (!fs.existsSync(file)) throw new Error('No verified candidate receipt. Run build first.');
  const candidate = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (candidate.status !== 'passed' || candidate.fingerprint !== inputFingerprint(root, candidate.generatedSnapshots)) {
    throw new Error('Build inputs changed: rebuild before preview/browser checks.');
  }
  return candidate;
}
