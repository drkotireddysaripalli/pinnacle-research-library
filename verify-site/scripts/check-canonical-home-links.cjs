const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const files=['recognition-register.html','district-register.html','study-index.html'];
const home=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
for(const name of files){
 const html=fs.readFileSync(path.join(root,'dist/evidence',name),'utf8');
 assert(!html.includes('href="../index.html'),name+' has a redirecting home link');
 for(const match of html.matchAll(/href="\/#([^"]+)"/g))assert(home.includes('id="'+match[1]+'"'),name+' links to absent section '+match[1]);
}
for(const relative of ['pinnacle-route-v11.mjs','../speech-site/deployment/pinnacle-route-v12.mjs']){
 const source=fs.readFileSync(path.join(root,relative),'utf8');
 const fn=source.slice(source.indexOf('function publicBody('),source.indexOf('function canonicalPath('));
 const render=new Function('ORIGIN','PUBLIC',fn+';return publicBody;')('https://pinnacle-verify.saripalli.chatgpt.site','https://www.pinnacleblooms.org/verify');
 assert.equal(render('<a href="../index.html#appreciations">Sources</a>'),'<a href="/verify/#appreciations">Sources</a>');
 assert.equal(render('<a href="/verify/">Sources</a>'),'<a href="/verify/">Sources</a>');
 assert.equal(render('<a href="https://example.com/index.html">External</a>'),'<a href="https://example.com/index.html">External</a>');
}
console.log(JSON.stringify({passed:true,pages:3,workerTransforms:2,externalLinksPreserved:true}));
