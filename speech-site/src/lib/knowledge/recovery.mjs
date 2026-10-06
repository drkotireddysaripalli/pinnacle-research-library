import recovered from '../../data/sunshine-recovered.json' with {type:'json'};
export {recovered};
export function sunshineRecords(records){
 const replacements=new Map(recovered.map(x=>[x.id,x]));
 return [...records.map(x=>replacements.get(x.id)||x),...recovered.filter(x=>!records.some(r=>r.id===x.id))];
}
export function sunshineTopic(path){return recovered.find(x=>x.url==='/sunshine/'+path)||null;}
