import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin = 'https://www.pinnacleblooms.org';
const baselinePath = path.resolve(process.argv[2] || 'deployment/production-before-navigation-v103-20260929.json');
const outputPath = path.resolve(process.argv[3] || 'deployment/production-navigation-v103-20260929.json');
const expectedVersion = Number(process.argv[4] || 103);
const managedPaths = new Set([
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/speech-therapy/service-information',
  '/speech-therapy/first-visit-guide',
  '/speech-therapy/teacher-observation-guide'
]);

const baseline = JSON.parse(await fs.readFile(baselinePath, 'utf8'));
const trustedRouteSnapshot = JSON.parse(await fs.readFile('deployment/shared-routes-after.json', 'utf8'));
const trustedRobots = trustedRouteSnapshot.find(({path: routePath}) => routePath === '/robots.txt');
const results = [];

for (const previous of baseline.results) {
  const response = await fetch(origin + previous.path, {headers: {'cache-control': 'no-cache'}});
  const body = Buffer.from(await response.arrayBuffer());
  const current = {
    path: previous.path,
    status: response.status,
    contentType: response.headers.get('content-type'),
    bodySha256: crypto.createHash('sha256').update(body).digest('hex'),
    bytes: body.length
  };
  assert.equal(current.status, 200, `${previous.path} must return 200`);
  if (managedPaths.has(previous.path)) {
    assert.notEqual(current.bodySha256, previous.bodySha256, `${previous.path} must contain the new shared shell`);
  } else if (previous.path === '/robots.txt') {
    assert(trustedRobots, 'Trusted robots snapshot is required');
    assert.equal(current.bodySha256, trustedRobots.sha256, '/robots.txt changed from the trusted pre-release route snapshot');
    assert.match(current.contentType || '', /^text\/plain/i, '/robots.txt must be plain text');
    assert(body.toString('utf8').includes('https://www.pinnacleblooms.org/speech-therapy/sitemap.xml'), 'Speech sitemap must remain in robots.txt');
  } else {
    assert.equal(current.bodySha256, previous.bodySha256, `${previous.path} changed outside this release scope`);
    assert.equal(current.bytes, previous.bytes, `${previous.path} byte length changed outside this release scope`);
  }
  results.push(current);
}

const report = {
  checkedAt: new Date().toISOString(),
  baselineVersion: baseline.productionVersion,
  productionVersion: expectedVersion,
  managedPagesChanged: [...managedPaths],
  preservedPathsUnchanged: results.filter(({path}) => !managedPaths.has(path)).map(({path}) => path),
  results
};
await fs.writeFile(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  checkedAt: report.checkedAt,
  productionVersion: report.productionVersion,
  managedPagesChanged: report.managedPagesChanged.length,
  preservedPathsUnchanged: report.preservedPathsUnchanged.length,
  output: path.relative(process.cwd(), outputPath).replaceAll('\\', '/')
}, null, 2));
