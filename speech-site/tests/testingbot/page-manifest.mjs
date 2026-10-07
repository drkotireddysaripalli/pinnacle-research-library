import fs from 'node:fs/promises';
import {pageContracts} from '../../scripts/page-quality-contracts.mjs';

const origin='https://www.pinnacleblooms.org';
export const suites=['bvt','p1','p2','p3'];
const row=(id,path,family,priority,extra={})=>({id,path,canonical:origin+path,family,priority,published:true,...extra});
export async function pageManifest(){
  const centres=JSON.parse(await fs.readFile(new URL('../../src/data/centre-page-releases.json',import.meta.url)));
  const institutional=JSON.parse(await fs.readFile(new URL('../../src/data/institutional-content.json',import.meta.url)));
  const policies=JSON.parse(await fs.readFile(new URL('../../src/data/policy-content.json',import.meta.url)));
  const books=JSON.parse(await fs.readFile(new URL('../../src/data/book-catalog.json',import.meta.url)));
  const editions=JSON.parse(await fs.readFile(new URL('../../src/data/book-merchant-editions.json',import.meta.url)));
  const verify=JSON.parse(await fs.readFile(new URL('./verify-paths.json',import.meta.url)));
  const primary=['speech','pinnacleai','enrolment','shop'];
  const records=Object.entries(pageContracts).filter(([id])=>!['ask','delhi'].includes(id)).map(([id,p])=>row(id,p.canonical,'portal',primary.includes(id)?'bvt':'p1',{buildPath:p.path,kind:id}));
  records.push(row('centre-suchitra',centres.find(c=>c.id==='suchitra').path,'centre','bvt',{kind:'centre',centre:'suchitra',buildPath:centres.find(c=>c.id==='suchitra').path}));
  records.push(row('ask-answer','/ask/what-is-a-deic-and-what-services-does-it-offer','ask-answer','bvt',{canonical:'https://pinnacleblooms.org/ask/what-is-a-deic-and-what-services-does-it-offer',kind:'knowledge',gate:true}));
  records.push(row('verify','/verify/','verify','bvt',{kind:'verify',shell:'evidence',knownGap:'Current Verify uses its separate evidence shell; common Astro-shell migration is not delivered'}));
  records.push(row('ask-home','/ask','knowledge-index','p1',{canonical:'https://pinnacleblooms.org/ask',kind:'knowledge',gate:true}));
  for(const [id,p] of [['faq','/faq'],['faq-answer','/faq/english/speech-therapy/autism-speech-therapy'],['sunshine','/sunshine'],['sunshine-category','/sunshine/techniques'],['stories','/allmirracles'],['faq-telugu','/faq/telugu']])records.push(row(id,p,id.includes('answer')?'knowledge-answer':'knowledge-index','p1',{kind:'knowledge',gate:true,native:id==='faq-telugu'}));
  records.push(row('books','/books','book-collection','p1',{kind:'books'}));
  records.push(row('book-resource','/books/resources/first-conversation','book-resource','p2',{kind:'books'}));
  records.push(row('reassess-review-repeat','/reassess-review-repeat','pinnacleai-module','p1',{kind:'portal',buildPath:'/reassess-review-repeat'}));
  records.push(row('helpline','/national-autism-helpline','helpline','p1',{kind:'helpline',shell:'helpline',knownGap:'National helpline currently has its dedicated shell; this suite preserves and tests that actual shell'}));
  for(const slug of ['first-visit-guide','teacher-observation-guide','service-information'])records.push(row('speech-'+slug,'/speech-therapy/'+slug,'reading-guide','p2',{kind:'portal',buildPath:'/speech-therapy/'+slug}));
  for(const item of books)records.push(row('book-'+item.slug,item.path,item.physical?'book-print-offer':item.bundle?'book-bundle':'book-digital-offer','p3',{kind:'books',buildPath:item.path}));
  for(const item of editions)records.push(row('edition-'+item.locale+'-'+item.slug,item.path,'book-language-offer','p3',{kind:'books',buildPath:item.path}));
  for(const locale of ['hi','te']){
    records.push(row('books-'+locale,'/books/'+locale,'native-collection','p2',{kind:'books',native:locale,buildPath:'/books/'+locale}));
    const seen=new Set();
    for(const item of editions.filter(e=>e.locale===locale))for(const b of item.included_books){
      const p=new URL(b.native_canonical_url).pathname;if(seen.has(p))continue;seen.add(p);
      records.push(row('native-'+locale+'-'+p.split('/').pop(),p,'native-book','p2',{kind:'books',native:locale,buildPath:p}));
    }
  }
  const priorityVerify=['/verify/evidence/cite.html','/verify/evidence/records/md5.html','/verify/guides/everyday-practice.html','/verify/guides/te/everyday-practice.html'];
  for(const p of verify.paths)if(!records.some(r=>r.path===p))records.push(row('verify-'+p.replace('/verify/','').replaceAll('/','-').replace(/\.html$/,''),p,'verify-document',priorityVerify.includes(p)?'p2':'p3',{kind:'verify',shell:'evidence',native:p.includes('/te/')?'te':p.includes('/hi/')?'hi':false}));
  records.push(row('self-sufficient','/self-sufficient','life-outcome','p1',{kind:'portal'}),row('mainstream','/mainstream','life-outcome','p1',{kind:'portal'}),row('seva','/seva','service','p2',{kind:'portal'}));
  for(const item of institutional)if(item.path&&!records.some(r=>r.path===item.path))records.push(row('institutional-'+item.slug,item.path,'institutional','p2',{kind:'portal'}));
  for(const item of policies){const slug=item.slug||item.path?.replace(/^\//,'');if(slug&&!records.some(r=>r.path==='/'+slug))records.push(row('policy-'+slug,'/'+slug,'policy','p2',{kind:'portal'}));}
  for(const item of centres)if(!records.some(r=>r.path===item.path))records.push(row('centre-'+item.id,item.path,item.status==='centre-enquiry'?'centre':'centre-status','p3',{kind:'centre',centre:item.id,status:item.status}));
  // Known unpublished libraries remain explicitly pending, never silently green.
  records.push(row('materials','/materials','html-library','p2',{published:false,reason:'Migration/source intake pending'}),row('interventions','/interventions','html-library','p2',{published:false,reason:'Migration/source intake pending'}));
  if(new Set(records.map(r=>r.id)).size!==records.length)throw Error('Duplicate TestingBot case ID');
  if(new Set(records.map(r=>r.canonical)).size!==records.length)throw Error('Duplicate TestingBot canonical');
  return records;
}

export function selectCases(manifest,suite,{build=false,ids=[]}={}){
  if(![...suites,'all','daily'].includes(suite))throw Error('Unknown TestingBot suite '+suite);
  const priority=suite==='daily'||suite==='p1'?['bvt','p1']:suite==='p2'?['bvt','p1','p2']:suite==='all'?suites:[suite];
  let selected=manifest.filter(r=>priority.includes(r.priority));
  if(ids.length){if(ids.some(id=>!manifest.some(r=>r.id===id)))throw Error('Unknown case ID');selected=manifest.filter(r=>ids.includes(r.id));}
  if(build)selected=selected.filter(r=>r.buildPath);
  return selected;
}

export const matrix={
  chrome:{id:'chrome',kind:'desktop',browserName:'chrome',platformName:'WIN11',version:'latest',width:1440,height:900},
  firefox:{id:'firefox',kind:'desktop',browserName:'firefox',platformName:'WIN11',version:'latest',width:1440,height:900},
  safari:{id:'safari',kind:'desktop',browserName:'safari',platformName:'TAHOE',version:'latest',width:1440,height:900},
  edge:{id:'edge',kind:'desktop',browserName:'MicrosoftEdge',platformName:'WIN11',version:'latest',width:768,height:1024},
  ios:{id:'ios',kind:'physical',platformName:'iOS',browserName:'safari',preferred:[22,44,33]},
  android:{id:'android',kind:'physical',platformName:'Android',browserName:'chrome',preferred:[29,32,40]},
  ipad:{id:'ipad',kind:'physical',platformName:'iOS',browserName:'safari',preferred:[41],devicePattern:'iPad'},
  iosSmall:{id:'iosSmall',kind:'physical',platformName:'iOS',browserName:'safari',preferred:[31],devicePattern:'iPhone SE'}
};
