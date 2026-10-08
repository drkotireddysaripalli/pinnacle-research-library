// Public reading context selects optional service information, never a diagnosis.
export const enrolPath='/enroll-autism-speech-aba-therapies-india';
export const serviceChoices=[
 {key:'speech',label:'Speech & communication',path:'/top-speech-therapy-center-india-proven-improvement-rate',match:/speech|language|communication|aac/i},
 {key:'occupational',label:'Everyday skills & occupational therapy',path:'/best-occupational-therapy-center-india-proven-improvement-rate',match:/occupational|sensory|motor|pincer|grasp|dressing|feeding/i},
 {key:'education',label:'Learning & special education',path:'/best-special-education-center-call-9100181181',match:/education|learning|school|iep|shadow teacher/i},
 {key:'aba',label:'Behavioural support',path:'/best-aba-therapy-center-india-proven-improvement-rate',match:/aba|behavio[u]?r/i},
 {key:'autism',label:'Integrated developmental support',path:'/autism-therapy',match:/autism|developmental delay/i}
];
export function readerLibrary(path){
 if(typeof path!=='string')return null;
 if(/^\/mirracles\/\d+(?:\/|$)/.test(path))return 'mirracles';
 const key=path.match(/^\/(ask|faq|sunshine|allmirracles|materials|interventions)(?:\/|$)/)?.[1];
 return key==='allmirracles'?'mirracles':key||null;
}
/** @param {{title?:string, category?:string, service?:string}} [context] */
export function knowledgeJourney({title='',category='',service}={}){
 const text=String(category)+' '+String(title);
 const selected=serviceChoices.filter(x=>service?x.key===service:x.match.test(text)).slice(0,2);
 return {services:selected,enrol:enrolPath+(selected[0]?'?service='+selected[0].key:''),business:category==='franchise'||/\bfranchise\b/i.test(title)};
}
