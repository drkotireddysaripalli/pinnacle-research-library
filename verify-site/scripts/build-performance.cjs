'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),assets=path.join(dist,'_assets');fs.mkdirSync(assets,{recursive:true});
const fingerprint=(name,body,ext)=>{const hash=crypto.createHash('sha256').update(body).digest('hex').slice(0,16),file=name+'.'+hash+'.'+ext;fs.writeFileSync(path.join(assets,file),body);return '/_assets/'+file;};
const css=['styles.css','upgrade.css','evidence-design.css','impact.css','semantic.css','world.css','share.css'];
const bundle=fingerprint('site',css.map(p=>fs.readFileSync(path.join(dist,p),'utf8')).join('\n'),'css');
const js={};for(const file of ['share.js','evidence-data.js','centre-data.js','app.js','hfr-register.js'])js[file]=fingerprint(path.basename(file,'.js'),fs.readFileSync(path.join(dist,file),'utf8'),'js');
for(const file of fs.readdirSync(dist,{recursive:true}).filter(p=>p.endsWith('.html'))){const full=path.join(dist,file);let html=fs.readFileSync(full,'utf8'),added=false;html=html.replace(/<link rel="stylesheet" href="\/(styles|upgrade|evidence-design|impact|semantic|world|share)\.css">/g,()=>{if(added)return '';added=true;return `<link rel="stylesheet" href="${bundle}">`;});for(const [name,target]of Object.entries(js))html=html.replaceAll('src="/'+name+'"','src="'+target+'"');fs.writeFileSync(full,html);}
console.log(JSON.stringify({stylesheetBundle:bundle,scripts:Object.keys(js).length}));
