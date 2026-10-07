export function recordShards(records,size=28){
  if(!Number.isInteger(size)||size<1||size>28)throw Error('Record shards must have 1–28 cases');
  const ids=records.filter(r=>r.published).map(r=>r.id);
  if(new Set(ids).size!==ids.length)throw Error('Duplicate record would inflate coverage');
  const result=[];for(let i=0;i<ids.length;i+=size)result.push(ids.slice(i,i+size));return result;
}
