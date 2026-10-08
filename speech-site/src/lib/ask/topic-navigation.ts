import {safeAskLink,ASK} from './content';
import topics from '../../data/ask-indexed-topics.json';
import topicGroups from '../../data/ask-topic-groups.json';
const families=[/^(speech|language|communication|listening|hearing|aac)(-|$)/,/^(school|learning|reading|writing|literacy|cognitive|memory|attention|planning|executive)(-|$)/,/^(fine-motor|gross-motor|motor|pincer|hand-eye|coordination|balance|movement)(-|$)/,/^(adaptive|self-care|self-help|feeding|dressing|toilet|independence|daily-living)(-|$)/,/^(social|friendship|peer|turn-taking|emotional|emotion)(-|$)/,/^(sensory|stimming|hand-flapping)(-|$)/];
export function topicQuestionPaths(items:any[],lang='en') {
 const groups=new Map<string,any>(),seen=new Set<string>();
 for(const item of Array.isArray(items)?items:[]){const safe=safeAskLink(item?.slug),href=safe&&lang==='te'?safe.replace('/ask/','/ask/te/'):safe,title=item?.title||item?.question||item?.q;if(!href||!title||seen.has(href))continue;seen.add(href);
  const key=String(item.cluster_key||'questions'),label=String(item.cluster_label||'Questions to explore');
  if(!groups.has(key))groups.set(key,{key,label,order:Number(item.cluster_sort)||99,items:[]});groups.get(key).items.push({href,title:String(title)});
 }
 return [...groups.values()].sort((a,b)=>a.order-b.order).map((g,i)=>({...g,id:'topic-question-path-'+(i+1),items:g.items.slice(0,3)})).slice(0,7);
}
export function topicGroupId(key:string){return 'questions-'+String(key).replace(/[^a-z0-9_-]/gi,'');}
// Dated public membership snapshot. Never use a mismatched total to send a
// reader to a stale page; current-page links remain available as the fallback.
export function completeTopicGroups(canonical:string,total:number,page=1,lang='en'){
 let slug;try{const u=new URL(canonical);if(u.origin!==ASK.replace('/ask','')||!new RegExp('^/ask/'+(lang==='te'?'te/':'')+'[^/]+$').test(u.pathname))return [];slug=decodeURIComponent(u.pathname.split('/').pop()!);}catch{return [];}
 const entry=(topicGroups as any)[lang+'/'+slug];if(!entry||entry[0]!==total)return [];
 return entry[1].map(([key,label,count,firstPage])=>({key,label,count,href:(firstPage===page?'':canonical+(firstPage>1?'?page='+firstPage:''))+'#'+topicGroupId(key)}));
}
export function relatedPublishedTopics(canonical:string){
 let slug;try{const u=new URL(canonical);if(u.origin!==ASK.replace('/ask','')||!/^\/ask\/[^/]+$/.test(u.pathname))return [];slug=decodeURIComponent(u.pathname.split('/').pop()!);}catch{return [];}
 const family=families.find(f=>f.test(slug));
 return topics.filter(t=>t.slug!==slug&&(t.slug.startsWith(slug+'-')||slug.startsWith(t.slug+'-')||!!family&&family.test(t.slug))).sort((a,b)=>a.slug.length-b.slug.length||a.slug.localeCompare(b.slug)).slice(0,6);
}
