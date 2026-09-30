import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import policies from '../src/data/policy-content.json' with {type:'json'};
import {lifePages} from '../src/data/life-outcomes.ts';
const origin='https://www.pinnacleblooms.org',dir='public/pinnacle-pages-data';
await fs.mkdir(dir,{recursive:true});
for(const page of policies){
 const source={url:origin+page.path,title:page.label,sourceUrl:page.sourceUrl,sourceRetrievedAt:page.sourceRetrievedAt,sourceHtmlSha256:page.sourceHtmlSha256,policyTextSha256:page.policyTextSha256,printedRevision:page.printedRevision,legalApprovalVerified:false,presentation:'Existing policy text preserved; typography, navigation and semantic headings changed.',text:page.text};
 await fs.writeFile(dir+'/'+page.slug+'-policy-source.json',JSON.stringify(source,null,2)+'\n');
 await fs.writeFile(dir+'/'+page.slug+'-policy.md','# '+page.label+'\n\nCanonical: '+source.url+'\n\n'+(page.printedRevision?'Revision printed in the original: '+page.printedRevision+'\n\n':'')+page.text+'\n');
}
for(const page of lifePages){
 const record={url:origin+page.path,title:page.title,description:page.description,updatedOn:page.updatedOn,scope:'Parent-facing programme-purpose explanation. Illustrative examples; no guaranteed child outcomes.',directAnswer:page.answer,activities:page.activities,example:{title:page.exampleTitle,question:page.exampleQuestion,steps:page.example},review:page.review,stages:page.stages,questions:page.faqs,sources:page.sources};
 const text=page.title+'\n'+origin+page.path+'\n\n'+page.answer+'\n\n'+page.exampleTitle+'\n'+page.example.map((s,i)=>(i+1)+'. '+s.title+' — '+s.text).join('\n')+'\n\n'+page.stages.map((s,i)=>(i+1)+'. '+s.title+' — '+s.text+' '+origin+s.path).join('\n')+'\n\n'+page.faqs.map(f=>f.question+'\n'+f.answer).join('\n\n')+'\n\nSources\n'+page.sources.map(s=>s.title+'\n'+s.url+'\n'+s.meaning).join('\n\n')+'\n';
 await fs.writeFile(dir+'/'+page.slug+'-evidence.json',JSON.stringify(record,null,2)+'\n');
 await fs.writeFile(dir+'/'+page.slug+'-evidence.txt',text);
 await fs.writeFile(dir+'/'+page.slug+'-machine.md','# '+text);
}
const urls=[...policies,...lifePages].map(p=>'<url><loc>'+origin+p.path+'</loc><lastmod>2026-10-01</lastmod></url>').join('');
await fs.writeFile(dir+'/public-documents-sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>\n');
console.log(JSON.stringify({policies:policies.length,lifePages:lifePages.length,policyTextHashes:policies.map(p=>({id:p.slug,sha256:crypto.createHash('sha256').update(p.text).digest('hex')}))}));
