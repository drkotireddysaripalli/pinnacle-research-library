import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.resolve(process.argv[2]||path.join(root,'dist'));
const source=path.join(root,'og-release-20260930');
const manifest=JSON.parse(await fs.readFile(path.join(source,'manifest.json'),'utf8'));
const copies=[];
for(const entry of manifest.assets){
  assert(/^pinnacle-pages-assets\/[a-zA-Z0-9_.-]+\.jpg$/.test(entry.target),'Only named OG JPEG assets may be replaced.');
  const target=path.join(directory,entry.target);
  await fs.access(target); // Fail if upstream source changes its generated path; review the manifest.
  const bytes=await fs.readFile(path.join(source,entry.replacement));
  const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(sha256,entry.sha256,'Replacement must match the reviewed image.');
  copies.push({target,bytes,asset:entry.target,sha256});
}
for(const copy of copies)await fs.writeFile(copy.target,copy.bytes);
console.log(JSON.stringify({replaced:copies.map(({asset,sha256})=>({asset,sha256})),htmlChanged:false},null,2));
