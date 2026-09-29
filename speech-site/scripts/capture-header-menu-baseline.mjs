import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin = 'https://www.pinnacleblooms.org';
const outputPath = path.resolve(
  process.argv[2] || 'deployment/production-before-header-menu-v104-20260929.json'
);
const productionVersion = Number(process.argv[3] || 103);
const paths = [
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/speech-therapy/service-information',
  '/speech-therapy/first-visit-guide',
  '/speech-therapy/teacher-observation-guide',
  '/',
  '/verify/',
  '/verify/evidence/evidence.json',
  '/verify/evidence/fsc.pdf',
  '/verify/evidence/pinnacleai-regulatory-journey.html',
  '/national-autism-helpline',
  '/robots.txt'
];

const results = [];
for (const route of paths) {
  const response = await fetch(origin + route, {headers: {'cache-control': 'no-cache'}});
  const body = Buffer.from(await response.arrayBuffer());
  results.push({
    path: route,
    status: response.status,
    contentType: response.headers.get('content-type'),
    bodySha256: crypto.createHash('sha256').update(body).digest('hex'),
    bytes: body.length
  });
}

await fs.mkdir(path.dirname(outputPath), {recursive: true});
await fs.writeFile(
  outputPath,
  JSON.stringify({checkedAt: new Date().toISOString(), productionVersion, results}, null, 2) + '\n'
);

console.log(JSON.stringify({productionVersion, routes: results.length, output: path.relative(process.cwd(), outputPath).replaceAll('\\', '/')}, null, 2));
