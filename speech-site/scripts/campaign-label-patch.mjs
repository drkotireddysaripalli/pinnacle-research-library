import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
export const oldLabelPattern='/^[A-Za-z0-9][A-Za-z0-9._~ -]*$/';
export const labelPattern="/^(?![A-Za-z][A-Za-z0-9+.-]*:\\/\\/)(?![Ww][Ww][Ww]\\.)(?![A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+\\/)[\\p{L}\\p{N}][\\p{L}\\p{M}\\p{N} ._~:()&,+\\/'’–—-]*$/u";
const sha=value=>createHash('sha256').update(value).digest('hex');
export function assertLabelSourceDelta(before,after){
 assert.equal(before.split(oldLabelPattern).length,2);
 assert.equal(after,before.replace(oldLabelPattern,"key==='utm_id'?"+oldLabelPattern+':'+labelPattern));
}
export function patchCompiledLabels(source,{numericInventory=false}={}){
 const pattern=/!\((\w+)\s*\?\s*\/\^\[A-Za-z0-9\._~-\]\+\$\/\s*:\s*\/\^\[A-Za-z0-9\]\[A-Za-z0-9\._~ -\]\*\$\/\)\.test\((\w+)\)\)\s*return null;\s*if\s*\((\w+)\s*===\s*"utm_id"/g;
 const matches=[...source.matchAll(pattern)];assert.equal(matches.length,1,'One compiled metadata validator required');
 const m=matches[0],replacement=m[0].replace(oldLabelPattern,m[3]+"==='utm_id'?"+oldLabelPattern+':'+labelPattern);
 let next=source.slice(0,m.index)+replacement+source.slice(m.index+m[0].length);
 if(numericInventory){const old='knownGoogleAdsCampaignIds.has('+m[2]+')';assert.equal(next.split(old).length,2);next=next.replace(old,'/^[1-9][0-9]{0,19}$/.test('+m[2]+')');}
 return next;
}
export function patchCompiledAsset(source,key,before,after){
 assertLabelSourceDelta(before,after);
 const marker=JSON.stringify(key)+':{body:';let start=source.indexOf(marker);assert(start>=0);assert.equal(source.indexOf(marker,start+1),-1);
 start+=marker.length;const tail=source.slice(start);const match=tail.match(/^(`(?:\\[\s\S]|[^`\\])*`)(,sha256:")([a-f0-9]{64})("\})/);assert(match,'Compiled asset string required');
 assert.equal(vm.runInNewContext(match[1]),before);assert.equal(match[3],sha(before));
 const literal=match[1].replace(oldLabelPattern,("key==='utm_id'?"+oldLabelPattern+':'+labelPattern).replaceAll('\\','\\\\'));
 assert.equal(vm.runInNewContext(literal),after);
 return source.slice(0,start)+literal+match[2]+sha(after)+match[4]+tail.slice(match[0].length);
}
export function assertGeneratedLabels(beforeBytes,afterBytes,name,pairs){
 const pattern=new RegExp('export const '+name+'=(\\{[^\\n]+\\});'),before=beforeBytes.toString(),after=afterBytes.toString();
 const old=JSON.parse(before.match(pattern)[1]),next=JSON.parse(after.match(pattern)[1]);
 for(const [key,oldSource,newSource,bodyKey] of pairs){assertLabelSourceDelta(oldSource,newSource);assert.equal(old[key][bodyKey],oldSource);old[key]={...old[key],[bodyKey]:newSource,sha256:sha(newSource)};}
 assert.deepEqual(old,next);assert.equal(after,before.replace(pattern,'export const '+name+'='+JSON.stringify(old)+';'));
}
