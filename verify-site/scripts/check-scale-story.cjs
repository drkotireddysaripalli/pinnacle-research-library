const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dist=path.resolve(__dirname,'../dist'),read=p=>fs.readFileSync(path.join(dist,p),'utf8');
const html=read('index.html'),data=JSON.parse(read('evidence/scale-story.json'));
assert(/<\/section>\s*<section\b[^>]*\bclass="[^"]*\bscale-story\b[^\"]*"/.test(html),'Scale story follows a completed section');
assert(html.indexOf('id="scale-for-every-child"')<html.indexOf('class="evidence-snapshot'));
assert.equal(data.metrics[0].value,'2.7B+');assert.equal(1_300_000*8,10_400_000);
assert(data.aggregate.basis.includes('do not reproduce 400 billion'));
assert(html.includes('900 million is the mission population, not people already served'));
assert(html.includes('Pinnacle aggregate estimate'));
assert(html.includes('26200027GMBLXU4868')&&html.includes('26200027HCNFEI9138'));
const {tree}=require('./semantic-content.cjs'),nodes=tree(html),section=nodes.find(n=>n.open.includes('id="scale-for-every-child"'));
const hero=nodes.find(n=>n.tag==='section'&&/class="[^"]*\bworld-intro\b/.test(n.open)),intro=nodes.find(n=>n.open.includes('id="pinnacle-paradigm-story"'));
assert(hero&&intro&&section&&hero.end<=intro.start&&intro.end<=section.start,'Homepage order: hero, life-first introduction, scale story');
const block=html.slice(section.start,section.close);
assert(block.includes('1.3M assessments × 8 report types'));assert(block.includes('7.9 lakh+'));
assert.equal((block.match(/id="scale-for-every-child"/g)||[]).length,1);
for(const m of block.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)){
 const file=m[1]==='/'?'index.html':m[1].slice(1);assert(fs.existsSync(path.join(dist,file)),file);
 if(m[2]&&file.endsWith('.html'))assert(read(file).includes('id="'+m[2].slice(1)+'"'),m[0]);
}
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert(graph.some(n=>n['@type']==='WebPageElement'&&n.cssSelector==='#scale-for-every-child'));
assert(read('llms-full.txt').includes(data.aggregate.basis));
assert(JSON.parse(read('evidence/share-index.json')).pages[0].items.some(i=>i.id==='scale-for-every-child'&&i.whatsapp.includes('counting methods')));
console.log(JSON.stringify({pass:true,afterHeroAndLifeFirstIntroduction:true,countsAndAttribution:true,sourceLinks:true,structuredData:true,sharing:true}));
