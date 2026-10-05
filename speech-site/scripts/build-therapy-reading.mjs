// Compile the actual Astro component into a bounded compatibility addition.
// Future full-union builds already contain the component and are idempotent.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {parse} from 'parse5';
import {therapyReading} from '../src/data/therapy-reading.mjs';
const root=process.cwd(),entries={};
for(const [kind,item]of Object.entries(therapyReading)){
 const file=kind==='speech'?'index.html':item.path.slice(1)+'.html';
 const html=await fs.readFile(path.join(root,'dist',file),'utf8');const nodes=[];
 function walk(n){if(n.attrs?.some(a=>a.name==='data-therapy-reading'&&a.value===kind))nodes.push(n);for(const c of n.childNodes||[])walk(c);}
 walk(parse(html,{sourceCodeLocationInfo:true}));assert.equal(nodes.length,1);const location=nodes[0].sourceCodeLocation;assert(location?.startOffset&&location.endOffset);
 let fragment=html.slice(location.startOffset,location.endOffset);if(!fragment.includes('<style>')&&!fragment.includes('<style ')){const css=await fs.readFile(path.join(root,'src/styles/therapy-reading.css'),'utf8');fragment=fragment.replace(/(<section[^>]*>)/,'$1<style>'+css.trim()+'</style>');}assert(fragment.includes('<style>')||fragment.includes('<style '));assert(!fragment.includes('<script'));assert(fragment.includes(item.book.path+'#preview'));
 const markdown='\n\n## '+item.heading+'\n\n'+item.copy+'\n\n'+item.book.title+' — '+item.book.discipline+'\n\n[Read the free English sample](https://www.pinnacleblooms.org'+item.book.path+'#preview).\n\nChoose your PDF book language: '+item.languages.map(l=>'['+l.label+'](https://www.pinnacleblooms.org'+l.path+')').join(' · ')+'.\n\n'+item.note+'\n';
 entries[kind]={path:item.path,anchor:item.anchor,html:fragment,markdown};
 const name=kind==='speech'?'speech-llms.txt':'occupational-therapy-machine.md';
 // Both source reading aid and build output keep the same visible links.
 for(const dir of ['public','dist']){const target=path.join(root,dir,'pinnacle-pages-data',name);const prior=await fs.readFile(target,'utf8');const marker='\n\n## '+item.heading;await fs.writeFile(target,prior.split(marker)[0].trimEnd()+markdown);}
}
await fs.writeFile(path.join(root,'deployment/therapy-reading-content.mjs'),'// Generated from TherapyBookCompanion.astro; do not edit.\nexport const readingContent='+JSON.stringify(entries)+';\n');
console.log(JSON.stringify({therapyReading:Object.keys(entries),bytes:Object.values(entries).reduce((n,e)=>n+Buffer.byteLength(e.html),0)}));
