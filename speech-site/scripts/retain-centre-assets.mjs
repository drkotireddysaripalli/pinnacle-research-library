import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const proof=JSON.parse(await fs.readFile('../../../work/website-completion-20261008/centre-preserved-assets.json','utf8'));
assert(proof.mismatches.length<=10,'Reconcile a larger asset drift');
for(const row of proof.mismatches){assert(/^\/pinnacle-pages-assets\/[\w.-]+\.css$/.test(row.path));const response=await fetch('https://www.pinnacleblooms.org'+row.path);assert(response.ok);const bytes=Buffer.from(await response.arrayBuffer());assert.equal(createHash('sha256').update(bytes).digest('hex').slice(0,16),row.expected,'Exact live retained asset');await fs.writeFile(path.join('release-centre-service-enquiries-20261008',row.path),bytes);}
console.log(JSON.stringify({retainedLiveCss:proof.mismatches.length}));
