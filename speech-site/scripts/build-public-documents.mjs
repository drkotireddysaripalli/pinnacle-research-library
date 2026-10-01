import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import policies from '../src/data/policy-presentation.ts';
import {policyContact} from '../src/data/policy-current.ts';
import {lifePages} from '../src/data/life-outcomes.ts';
import institutional from '../src/data/institutional-content.json' with {type:'json'};
import {specialEducationStages} from '../src/data/special-education-stages.ts';
import {assessmentContent} from '../src/data/assessment-content.ts';
const origin='https://www.pinnacleblooms.org',dir='public/pinnacle-pages-data';
await fs.mkdir(dir,{recursive:true});
const specialFile=dir+'/special-education-evidence.json',specialRecord=JSON.parse(await fs.readFile(specialFile,'utf8'));specialRecord.updatedOn='2026-10-01';specialRecord.lifecycle=specialEducationStages.map(([icon,title,text],i)=>({stage:i+1,title,text}));await fs.writeFile(specialFile,JSON.stringify(specialRecord,null,2)+'\n');
for(const suffix of ['-evidence.txt','-machine.md']){const file=dir+'/special-education'+suffix;let text=await fs.readFile(file,'utf8');text=text.replace(/\n\n## The seven-stage Pinnacle lifecycle[\s\S]*$/,'');text+='\n\n## The seven-stage Pinnacle lifecycle\n\n'+specialEducationStages.map(([icon,title,body],i)=>(i+1)+'. '+title+' — '+body).join('\n\n')+'\n';await fs.writeFile(file,text);}
for(const page of policies){
 const source={url:origin+page.path,title:page.label,version:page.version,effectiveOn:page.effectiveOn,operator:policyContact.operator,ownerAuthorisedEdition:true,independentLegalReviewClaimed:false,privacyGrievanceOfficer:policyContact.grievanceOfficer,contact:{email:policyContact.email,phone:policyContact.phone},text:page.text,markdown:page.markdown,legalSources:page.legalSources,policyTextSha256:crypto.createHash('sha256').update(page.text).digest('hex'),htmlSha256:crypto.createHash('sha256').update(page.html).digest('hex'),historicalSource:page.originalText?{status:'Historical prior public wording; not the current edition',url:page.sourceUrl,retrievedAt:page.sourceRetrievedAt,htmlSha256:page.sourceHtmlSha256,textSha256:page.policyTextSha256,printedRevision:page.historicalPrintedRevision,text:page.originalText}:null};
 await fs.writeFile(dir+'/'+page.slug+'-policy-source.json',JSON.stringify(source,null,2)+'\n');
 await fs.writeFile(dir+'/'+page.slug+'-policy.md','# '+page.label+'\n\nCanonical: '+source.url+'\nEffective: '+page.printedRevision+'\nVersion: '+page.version+'\nOperator: '+policyContact.operator+'\n\n'+page.markdown+'\n');
}
const hub={url:origin+'/policies',title:'Policies and your rights',effectiveOn:'2026-10-01',operator:policyContact.operator,policies:policies.map(page=>({name:page.label,url:origin+page.path,group:page.group,summary:page.summary,version:page.version})),privacyGrievanceOfficer:policyContact.grievanceOfficer,email:policyContact.email,telephone:policyContact.phone};
await fs.writeFile(dir+'/policies-policy-source.json',JSON.stringify(hub,null,2)+'\n');
await fs.writeFile(dir+'/policies-policy.md','# Policies and your rights\n\nCanonical: '+hub.url+'\nEffective: 1 October 2026\nOperator: '+hub.operator+'\n\n'+hub.policies.map(page=>'## ['+page.name+']('+page.url+')\n'+page.summary+'\nVersion: '+page.version).join('\n\n')+'\n\nPrivacy Grievance Officer: '+policyContact.grievanceOfficer+'\nContact: '+policyContact.email+' / '+policyContact.phone+'\n');
for(const page of lifePages){
 const record={url:origin+page.path,title:page.title,description:page.description,updatedOn:page.updatedOn,scope:'Parent-facing programme-purpose explanation. Illustrative examples; no guaranteed child outcomes.',directAnswer:page.answer,activities:page.activities,example:{title:page.exampleTitle,question:page.exampleQuestion,steps:page.example,...(page.exampleArt?{art:page.exampleArt,alt:page.exampleArtAlt,caption:page.exampleCaption,scope:page.exampleScope}:{})},review:page.review,stages:page.stages,questions:page.faqs,sources:page.sources};
 const text=page.title+'\n'+origin+page.path+'\n\n'+page.answer+'\n\n'+page.exampleTitle+'\n'+(page.exampleArt?page.exampleQuestion+'\n'+page.exampleCaption+'\n':'')+page.example.map((s,i)=>(i+1)+'. '+s.title+' — '+s.text).join('\n')+(page.exampleArt?'\n'+page.exampleScope:'')+'\n\n'+page.stages.map((s,i)=>(i+1)+'. '+s.title+' — '+s.text+' '+origin+s.path).join('\n')+'\n\n'+page.faqs.map(f=>f.question+'\n'+f.answer).join('\n\n')+'\n\nSources\n'+page.sources.map(s=>s.title+'\n'+s.url+'\n'+s.meaning).join('\n\n')+'\n';
 await fs.writeFile(dir+'/'+page.slug+'-evidence.json',JSON.stringify(record,null,2)+'\n');
 await fs.writeFile(dir+'/'+page.slug+'-evidence.txt',text);
 await fs.writeFile(dir+'/'+page.slug+'-machine.md','# '+text);
}
for(const page of institutional){
 const record={...page,url:origin+page.path,...(page.kind==='framework'?{stages:assessmentContent.stages,report:{doi:'10.5281/zenodo.15487405',date:'2025-05-22',version:'1.0',type:'Institution-authored report',author:'Koti Reddy Saripalli',editor:'Sreeja Reddy Saripalli'}}:{}),scope:'Pinnacle programme, organisation and leadership explanation. Illustrative campaign creative; real leader portraits and exact roles are sourced separately.'};
 const blocks=[page.title,record.url,page.lead,page.directAnswer,...(page.journeyIntro?[page.journeyIntro]:[]),...(page.journeyCaption?[page.journeyCaption]:[]),...(page.journey||[]).map(p=>p.title+' — '+p.text+' '+origin+p.path),...(page.concerns||[]).map(p=>p.title+' — '+p.text+' '+origin+p.path),...(page.exampleIntro?[page.exampleIntro]:[]),...(page.priorities||[]).map(p=>p.title+' — '+p.text),...(page.people||[]).map(p=>p.name+'\n'+p.role+'\n'+p.profile+(p.biography?'\n'+p.contributionTitle+'\n'+p.biography+'\n'+p.contribution:'')+(p.credit?'\n'+p.credit+'\n'+p.creditText+'\n'+p.creditUrl:'')),...(page.example||[]).map((p,i)=>(i+1)+'. '+p.title+' — '+p.text),...(page.exampleScope?[page.exampleScope]:[]),...page.values.map(p=>p.title+' — '+p.text),...(record.stages||[]).map((s,i)=>(i+1)+'. '+s.title+' — '+s.text+' '+origin+s.path),...page.faqs.map(f=>f.question+'\n'+f.answer),'Sources',...page.sources.map(s=>s.title+'\n'+s.url+'\n'+s.meaning)];
 await fs.writeFile(dir+'/'+page.slug+'-evidence.json',JSON.stringify(record,null,2)+'\n');
 await fs.writeFile(dir+'/'+page.slug+'-evidence.txt',blocks.join('\n\n')+'\n');
 await fs.writeFile(dir+'/'+page.slug+'-machine.md','# '+blocks.join('\n\n')+'\n');
}
const urls=[{path:'/policies'},...policies,...lifePages,...institutional].map(p=>'<url><loc>'+origin+p.path+'</loc><lastmod>2026-10-01</lastmod></url>').join('');
await fs.writeFile(dir+'/public-documents-sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>\n');
console.log(JSON.stringify({policies:policies.length,lifePages:lifePages.length,institutional:institutional.length,policyTextHashes:policies.map(p=>({id:p.slug,sha256:crypto.createHash('sha256').update(p.text).digest('hex')}))}));
