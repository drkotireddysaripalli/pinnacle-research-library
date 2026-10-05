const portal='https://www.pinnacleblooms.org';
const ask='https://pinnacleblooms.org/ask';
// Reviewed replacements for legacy destinations that currently return 404,
// plus the published canonical therapy URLs (5 October 2026).
const destinations:Record<string,string>={
 '/speech-therapy':portal+'/top-speech-therapy-center-india-proven-improvement-rate',
 '/occupational-therapy':portal+'/best-occupational-therapy-center-india-proven-improvement-rate',
 '/book-assessment':portal+'/enroll-autism-speech-aba-therapies-india',
 '/enroll':portal+'/enroll-autism-speech-aba-therapies-india',
 '/parent-child-program':portal+'/everyday-therapy',
 '/child-development':portal+'/pinnacleai',
 ...Object.fromEntries(['hearing-impairment','tourette-syndrome','not-following-instructions-3y6m','prematurity-developmental-risk','fetal-alcohol-spectrum-disorder','developmental-coordination-disorder'].map(slug=>['/'+slug,ask+'/'+slug]))
};
export function canonicalContentLink(href:string){
 let url:URL;try{url=new URL(href,portal)}catch{return href}
 if(!['pinnacleblooms.org','www.pinnacleblooms.org'].includes(url.hostname)||url.protocol!=='https:')return href;
 const target=destinations[url.pathname];return target?target+url.search+url.hash:href;
}
export function repairContentLinks(markdown:string){
 return markdown.replace(/\]\((<?)([^\s)]+)(>?)\)/g,(_,open,href,close)=>']('+open+canonicalContentLink(href.replace(/>$/,''))+close+')');
}
