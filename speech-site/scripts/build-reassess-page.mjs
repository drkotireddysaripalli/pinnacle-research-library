// Scoped page build reuses the maintained shared shell and complete native creative.
import fs from 'node:fs/promises';
import {build} from 'astro';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {writeReassessMachine} from './build-reassess-machine.mjs';
import {reassessContent as c} from '../src/data/reassess-content.ts';
const root=new URL('../',import.meta.url),stage=new URL('ask-private/reassess-build/',root);
await fs.mkdir(new URL('pages/',stage),{recursive:true});
await fs.writeFile(new URL('pages/reassess-review-repeat.astro',stage),'---\nimport ReassessPage from "../../../src/components/ReassessPage.astro";\n---\n<ReassessPage/>\n');
await writeReassessMachine(fileURLToPath(new URL('public/pinnacle-pages-data/',root)));
// Update only this existing entry; preserve every other page's current sitemap date.
const sitemap=new URL('public/pinnacle-pages-data/pinnacleai-sitemap.xml',root);
const prior=await fs.readFile(sitemap,'utf8');
const revised=prior.replace(/(<url><loc>https:\/\/www\.pinnacleblooms\.org\/reassess-review-repeat<\/loc><lastmod>)[^<]+/, (_,prefix)=>prefix+'2026-10-15');
assert(revised.includes('<loc>https://www.pinnacleblooms.org/reassess-review-repeat</loc><lastmod>2026-10-15</lastmod>'),'Missing canonical sitemap entry');
await fs.writeFile(sitemap,revised);
const readingGuide=new URL('public/pinnacle-pages-data/pinnacleai-llms.txt',root),readingText=await fs.readFile(readingGuide,'utf8');
const revisedReading=readingText.split('\n').map(line=>line.includes('](https://www.pinnacleblooms.org/reassess-review-repeat)')?'- [Reassess · Review · Repeat](https://www.pinnacleblooms.org/reassess-review-repeat): '+c.description+' [Sources](https://www.pinnacleblooms.org/pinnacle-pages-data/reassess-review-repeat-sources.json).':line).join('\n');
assert(revisedReading.includes(c.description));await fs.writeFile(readingGuide,revisedReading);
process.env.PINNACLE_RELEASE='production';
await build({root,srcDir:fileURLToPath(stage),outDir:fileURLToPath(new URL('dist/',root)),site:'https://www.pinnacleblooms.org',output:'static',trailingSlash:'never',build:{assets:'pinnacle-pages-assets',format:'file'}});
const manifest=JSON.parse(await fs.readFile(new URL('og-release-20260930/manifest.json',root),'utf8'));
for(const entry of manifest.assets){const target=new URL('dist/'+entry.target,root);if(!(await fs.stat(target).catch(()=>null)))continue;const b=await fs.readFile(new URL('og-release-20260930/'+entry.replacement,root));assert.equal(createHash('sha256').update(b).digest('hex'),entry.sha256);await fs.writeFile(target,b);}
