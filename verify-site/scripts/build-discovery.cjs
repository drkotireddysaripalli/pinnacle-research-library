'use strict';
// Maintain public routing inventory from the same published HTML files.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const paths=fs.readdirSync(path.join(root,'dist'),{recursive:true}).filter(p=>p.endsWith('.html')).map(p=>'/'+p.replaceAll('\\','/')).sort();
const worker=path.join(root,'pinnacle-route-v10.mjs');
const source=fs.readFileSync(worker,'utf8').replace(/const HTML_PATHS = (?:__HTML_PATHS__|\[[^\n]*\]);/,'const HTML_PATHS = '+JSON.stringify(paths)+';');
fs.writeFileSync(worker,source);
console.log(JSON.stringify({htmlRoutes:paths.length}));
