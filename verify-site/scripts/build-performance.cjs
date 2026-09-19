'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),assets=path.join(dist,'_assets');fs.mkdirSync(assets,{recursive:true});
const fingerprint=(name,body,ext)=>{const hash=crypto.createHash('sha256').update(body).digest('hex').slice(0,16),file=name+'.'+hash+'.'+ext;fs.writeFileSync(path.join(assets,file),body);return '/_assets/'+file;};
const css=['fonts/fonts.css','styles.css','upgrade.css','evidence-design.css','impact.css','semantic.css','world.css','share.css','reader.css'];
const bundle=fingerprint('site',css.map(p=>fs.readFileSync(path.join(dist,p),'utf8')).join('\n'),'css');
const js={};for(const file of ['share.js','app.js','reader.js','hfr-register.js'])js[file]=fingerprint(path.basename(file,'.js'),fs.readFileSync(path.join(dist,file),'utf8'),'js');
for(const file of fs.readdirSync(dist,{recursive:true}).filter(p=>p.endsWith('.html'))){
 const full=path.join(dist,file);let html=fs.readFileSync(full,'utf8'),added=false;
 const previousSymbols=new Map([...html.matchAll(/<symbol id="(truth-[^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g)].map(m=>[m[1],m[2]]));
 html=html.replace(/<svg class="truth-symbols"[\s\S]*?<\/svg>/g,'').replace(/<use href="#(truth-[^"]+)"><\/use>/g,(all,id)=>previousSymbols.get(id)||all);
 html=html.replace(/<link rel="stylesheet" href="\/(styles|upgrade|evidence-design|impact|semantic|world|share|reader)\.css">/g,()=>{if(added)return '';added=true;return `<link rel="stylesheet" href="${bundle}">`;});
 for(const [name,target]of Object.entries(js))html=html.replaceAll('src="/'+name+'"','src="'+target+'"');
 // One definition per icon retains the same artwork without repeating SVG paths.
 const symbols=new Map();html=html.replace(/<svg class="truth-icon([^"]*)"[^>]*>([\s\S]*?)<\/svg>/g,(all,extra,inner)=>{
  if(inner.includes('<use '))return all;
  const id='truth-'+crypto.createHash('sha256').update(inner).digest('hex').slice(0,12);symbols.set(id,inner);
  return `<svg class="truth-icon${extra}" aria-hidden="true" focusable="false"><use href="#${id}"></use></svg>`;
 });
 if(symbols.size)html=html.replace('</body>',`<svg class="truth-symbols" aria-hidden="true" width="0" height="0"><defs>${[...symbols].map(([id,inner])=>`<symbol id="${id}" viewBox="0 0 24 24">${inner}</symbol>`).join('')}</defs></svg></body>`);
 fs.writeFileSync(full,html);
}
console.log(JSON.stringify({stylesheetBundle:bundle,scripts:Object.keys(js).length}));
