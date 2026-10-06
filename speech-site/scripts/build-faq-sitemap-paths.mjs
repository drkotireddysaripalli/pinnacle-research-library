import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const rows=JSON.parse(await fs.readFile('ask-public/knowledge-data/faq-index.json','utf8'));
const names={english:'en',telugu:'te',hindi:'hi',kannada:'kn',marathi:'mr',tamil:'ta',malayalam:'ml'};
const paths=Object.fromEntries(Object.entries(names).map(([language,code])=>[code,[...new Set(rows.filter(r=>r.language===language).map(r=>r.url))].sort()]));
assert.equal(Object.values(paths).flat().length,4564);
assert(Object.entries(paths).every(([code,items])=>items.length===652&&items.every(p=>p.startsWith('/faq/'+Object.keys(names).find(k=>names[k]===code)+'/')&&!/[<>&"']/.test(p))));
await fs.writeFile('deployment/root-sitemap/faq-paths.mjs','// Generated from the maintained FAQ catalogue; original published canonical paths.\nexport const faqPaths='+JSON.stringify(paths)+';\n');
console.log('Generated seven canonical FAQ sitemaps / 4,564 answers.');
