import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import editions from '../src/data/book-merchant-editions.json' with {type:'json'};
import {bookEditionDescription} from '../src/data/book-edition-search.mjs';
const entries=Object.fromEntries(editions.filter(e=>bookEditionDescription(e)!==e.seo_description).map(e=>[e.path,{before:e.seo_description,after:bookEditionDescription(e)}]));
assert.equal(Object.keys(entries).length,20);assert.equal(new Set(Object.values(entries).map(e=>e.after)).size,20);
await fs.writeFile(new URL('../deployment/book-edition-search-content.mjs',import.meta.url),'// Generated from book-edition-search.mjs and the unchanged edition catalogue.\nexport const editionSearch='+JSON.stringify(entries)+';\n');
console.log(JSON.stringify({editionDescriptions:Object.keys(entries).length}));
