import fs from 'node:fs/promises';
import {transform} from 'esbuild';
const files={script:'public/pinnacle-pages-scripts/site-announcement.js',style:'public/pinnacle-pages-styles/site-announcement.css',enrolment:'public/pinnacle-pages-scripts/enrolment.js'};
const assets={};for(const [key,file]of Object.entries(files))assets[key]=(await transform(await fs.readFile(file,'utf8'),{loader:key==='style'?'css':'js',minify:true,charset:'utf8',target:'es2022'})).code;
const centres=JSON.parse(await fs.readFile('src/data/centre-directory.json')),releases=JSON.parse(await fs.readFile('src/data/centre-page-releases.json'));
const centrePaths=Object.fromEntries(centres.map(c=>[new URL(c.profileUrl).pathname,c.id]));
const excludedCentres=releases.filter(c=>c.pageStatus==='location-status'||c.status==='location-status').map(c=>c.path);
await fs.writeFile('deployment/site-announcement-assets.mjs','// Generated owned assets; no remote dependencies.\nexport const assets='+JSON.stringify(assets)+';\nexport const centrePaths='+JSON.stringify(centrePaths)+';\nexport const excludedCentres='+JSON.stringify(excludedCentres)+';\n');
console.log(JSON.stringify({announcementAssets:2,centrePaths:centres.length,excludedCentres}));
