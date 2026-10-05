// Keep link, canonical and alternate representations identical.
export const encodedAskPath=(path:string)=>path.split('/').map(encodeURIComponent).join('/');
export function languageAlternates(items:any[],robots:string,canonical:string){
 if(/(?:^|[ ,])noindex(?:$|[ ,])/.test(robots))return [];
 const valid=items.filter(x=>x.indexable&&['en','te'].includes(x.lang)&&/^https:\/\/pinnacleblooms\.org\/ask\//.test(x.href||''));
 if(!valid.some(x=>x.href===canonical)||valid.length<2)return [];
 const english=valid.find(x=>x.lang==='en');
 return [...valid,...(english?[{lang:'x-default',href:english.href}]:[])];
}
