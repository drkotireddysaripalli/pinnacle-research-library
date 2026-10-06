import {ASK,SITE,contact,therapyLinks,dimensions} from './content';
import {renderMarkdown} from './markdown';
import {parseFragment} from 'parse5';

const plain=(node:any):string=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(plain).join('');
export function answerReading(markdown:string){
 const outline:{id:string;title:string}[]=[];
 const html=renderMarkdown(markdown).replace(/<h([1-3])>([\s\S]*?)<\/h\1>/g,(_,level,content)=>{
  const id='answer-section-'+(outline.length+1);const title=plain(parseFragment(content));
  outline.push({id,title});const heading=level==='1'?'2':level;
  return `<h${heading} id="${id}">${content}</h${heading}>`;
 });
 return {html,outline};
}
const serviceValues:Record<string,string>={speech:'speech',aac:'speech',ot:'occupational',occupational:'occupational',aba:'aba',special_education:'education',autism:'autism'};
const entityIndex:Record<string,number>={speech:0,aac:0,speech_therapy:0,speech_language_therapy:0,ot:1,occupational_therapy:1,aba:2,behaviour_therapy:2,behavior_therapy:2,special_education:3,autism:4};
export function answerContext(a:any){
 const e=a.entity||{};const prefix=a.lang==='te'?ASK+'/te':ASK;
 const topic=typeof e.kind==='string'&&typeof e.key==='string'&&/^[\w-]+$/.test(e.kind)&&/^[\w-]+$/.test(e.key)?{label:e.name||e.key,url:prefix+'/lens/'+encodeURIComponent('entity:'+e.kind)+'/'+encodeURIComponent(e.key)}:null;
 const exact=entityIndex[e.key];const matches=exact!==undefined?[therapyLinks[exact]]:therapyLinks.filter(t=>t.terms.test(a.title+' '+(e.name||''))).slice(0,2);
 const enrolValue=serviceValues[e.key]||({'0':'speech','1':'occupational','2':'aba','3':'education','4':'autism'} as any)[therapyLinks.indexOf(matches[0])];
 const parent=dimensions.find(d=>d.slug===(a.parent?.key==='lifeskills'?'life-skills':a.parent?.key));
 return {topic,parent:parent?{label:parent.title,url:prefix+'/'+parent.slug}:null,services:matches.map(t=>({...t,url:SITE+t.url})),enrol:contact.enrol+(enrolValue?'?service='+enrolValue:'')};
}
export const pathway=[
 {title:'Understand abilities',detail:'A starting picture of your child’s capabilities.',url:'/abilityscore',icon:'measure'},
 {title:'Choose meaningful goals',detail:'Readiness and a plan shaped around the child.',url:'/seven-readiness-indexes',icon:'compass'},
 {title:'Bring the right support together',detail:'Suitable therapies and people for those goals.',url:'/autism-therapy',icon:'people'},
 {title:'Carry practice into everyday life',detail:'Guidance for family, home and school.',url:'/everyday-therapy',icon:'home'},
 {title:'Track and correct',detail:'Use observations to adjust the plan.',url:'/fusion-module',icon:'track'},
 {title:'Reassess and review',detail:'Decide what to continue, change or do next.',url:'/reassess-review-repeat',icon:'loop'},
 {title:'Grow independence and participation',detail:'The child’s life gives each step its purpose.',url:'/self-sufficient',icon:'sun'}
];
export function answerCitation(a:any){
 const raw=a.content_updated_at||a.last_reviewed_at||a.published_at;const valid=raw&&Number.isFinite(Date.parse(raw));
 const date=valid?new Date(raw).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}):'';
 return `Pinnacle Blooms Network. “${a.title}”. Ask Pinnacle.${date?' '+(a.content_updated_at||a.last_reviewed_at?'Record updated':'Published')+' '+date+'.':''} ${a.canonical}`;
}
export function answerNavigation(a:any){
 const prefix=a.lang==='te'?ASK+'/te':ASK;
 const labels:Record<string,string>={stakeholder:'For people in your child’s life',age:'Age & stage',dev_age:'Developmental stage',domain:'Developmental domain',readiness:'Readiness',intent:'What you want to understand',lifecycle:'Journey stage',route:'Support pathway',component:'PinnacleAI component',empowerment:'Family participation',score_band:'AbilityScore range'};
 const links=(Array.isArray(a.lenses)?a.lenses:[]).filter(x=>typeof x.kind==='string'&&typeof x.value==='string'&&x.value.length&&x.kind.length<80&&x.value.length<240).map(x=>({kind:x.kind,label:x.kind==='route'?String(x.label||x.value).replaceAll('-',' '):x.label||x.value,group:labels[x.kind]||'Other connected perspectives',url:prefix+'/lens/'+encodeURIComponent(x.kind)+'/'+encodeURIComponent(x.value)}));
 const topics=(Array.isArray(a.dimensions)?a.dimensions:[]).map(d=>{const slug=d.key==='lifeskills'?'life-skills':d.key;return dimensions.some(x=>x.slug===slug)?{label:d.label,url:prefix+'/'+slug}:null}).filter(Boolean);
 return {links,topics};
}
