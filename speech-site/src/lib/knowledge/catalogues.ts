export const ORIGIN='https://www.pinnacleblooms.org';
export const improvementQualifier='97% proven improvement, measured across 31 Million+ therapy services and validated across 12 clinical studies.';
export const improvementLimitation='The network evidence does not predict an individual child’s result.';
export const languages={english:{code:'en',label:'English'},telugu:{code:'te',label:'తెలుగు'},hindi:{code:'hi',label:'हिन्दी'},tamil:{code:'ta',label:'தமிழ்'},kannada:{code:'kn',label:'ಕನ್ನಡ'},malayalam:{code:'ml',label:'മലയാളം'},marathi:{code:'mr',label:'मराठी'}};
export const themes=[
 {slug:'speech-therapy',label:'Speech Therapy',icon:'voice',path:'/top-speech-therapy-center-india-proven-improvement-rate',purpose:'Communication that becomes useful in your child’s day.'},
 {slug:'occupational-therapy',label:'Occupational Therapy',icon:'home',path:'/best-occupational-therapy-center-india-proven-improvement-rate',purpose:'Comfort, everyday routines and growing independence.'},
 {slug:'aba-therapy',label:'Behavioural Therapy',icon:'heart',path:'/best-aba-therapy-center-india-proven-improvement-rate',purpose:'Understand a need, support communication and build useful skills.'},
 {slug:'special-education',label:'Special Education',icon:'book',path:'/best-special-education-center-call-9100181181',purpose:'Access to learning, school and participation.'},
 {slug:'autism',label:'Autism & integrated support',icon:'people',path:'/autism-therapy',purpose:'The relevant therapies working around one child’s life.'},
 {slug:'pinnacle',label:'Pinnacle & your family',icon:'sun',path:'/pinnacleai',purpose:'Understand measurement, the plan, practice and review.'},
 {slug:'franchise',label:'Franchise enquiries',icon:'pin',path:'/franchises',purpose:'Explore the published business questions.'}
];
export const sunshineTypes=[
 {key:'CONDITION',slug:'conditions',label:'Conditions',icon:'heart',intro:'Understand a developmental condition and the questions to bring to a professional.'},
 {key:'BEHAVIOR',slug:'behaviours',label:'Behaviours',icon:'people',intro:'Look beyond an action to communication, comfort and useful support.'},
 {key:'MILESTONE',slug:'milestones',label:'Developmental milestones',icon:'track',intro:'Explore emerging capabilities and everyday observations.'},
 {key:'SKILLS',slug:'skills',label:'Skills',icon:'plan',intro:'Connect an emerging skill to something useful in your child’s day.'},
 {key:'ABILITIES',slug:'abilities',label:'Abilities',icon:'measure',intro:'Understand the capabilities that help shape meaningful goals.'},
 {key:'TECHNIQUE',slug:'techniques',label:'Therapy techniques',icon:'loop',intro:'Explore methods as part of a child-specific plan.'},
 {key:'MATERIAL',slug:'materials',label:'Therapy materials',icon:'book',intro:'Understand how a material can support a purposeful activity.'},
 {key:'ASSESSMENT',slug:'assessments',label:'Assessments',icon:'compass',intro:'Read about assessment tools and their purpose.'},
 {key:'ABILITYASSESSMENT',slug:'ability-assessments',label:'Ability assessments',icon:'measure',intro:'Explore the questions used to understand abilities.'}
];
const shared=new Map<string,Promise<any>>();
export async function data(env:any,name:string){
 if(!/^[a-z0-9-]+$/.test(name))throw Error('Invalid catalogue');
 const load=async()=>{const r=await env.ASSETS.fetch('https://assets.internal/knowledge-data/'+name+'.json');if(!r.ok)throw Error('Catalogue unavailable: '+name);return r.json();};
 if(!['manifest','faq-index','faq-categories','sunshine-index'].includes(name))return load();
 if(!shared.has(name))shared.set(name,load().catch(e=>{shared.delete(name);throw e;}));
 return shared.get(name);
}
export function requestedPage(value:string|null){if(value===null)return 1;return /^[1-9]\d{0,3}$/.test(value)?Number(value):0;}
export function paged(items:any[],page:number,size=24){const pages=Math.max(1,Math.ceil(items.length/size));return {items:items.slice((page-1)*size,page*size),total:items.length,pages,valid:page>=1&&page<=pages};}
export function pageURL(base:string,page:number,q=''){const params=new URLSearchParams();if(page>1)params.set('page',String(page));if(q)params.set('q',q);return base+(params.size?'?'+params:'');}
export function matchesSearch(item:any,q:string){return !q||(item.title+' '+(item.description||'')).toLocaleLowerCase().includes(q.toLocaleLowerCase());}
export function cleanPath(value:string){try{const result=value.split('/').map(s=>decodeURIComponent(s)).join('/');return /[\\\x00-\x20\x7f?#]/.test(result)||result.split('/').some(s=>s==='.'||s==='..')?null:result.replace(/\/$/,'');}catch{return null;}}
export function faqRoute(index:any[],path:string){
 const parts=path.split('/').filter(Boolean);if(!parts.length)return {mode:'home',language:'english'};
 const [language,category,slug]=parts;if(!Object.hasOwn(languages,language)||parts.length>3)return null;
 if(parts.length===1)return {mode:'listing',language};
 if(parts.length===2&&themes.some(t=>t.slug===category))return {mode:'listing',language,category};
 const found=index.filter(x=>x.language===language&&x.slug===(slug||category));
 const exact=found.find(x=>x.category===category);
 const item=exact||found.length===1&&found[0];
 return item?{mode:'answer',language,item,redirect:'/faq/'+path!==item.url?item.url:null}:null;
}
