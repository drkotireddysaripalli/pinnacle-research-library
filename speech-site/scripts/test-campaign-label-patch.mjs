import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {oldLabelPattern,labelPattern,assertLabelSourceDelta,patchCompiledLabels,patchCompiledAsset} from './campaign-label-patch.mjs';
const before='function value(a,key){return '+oldLabelPattern+'.test(a)}';
const after=before.replace(oldLabelPattern,"key==='utm_id'?"+oldLabelPattern+':'+labelPattern);
test('campaign patch rejects unrelated source changes and preserves compiled asset surroundings',()=>{
 assertLabelSourceDelta(before,after);assert.throws(()=>assertLabelSourceDelta(before,after+'other();'));
 const quote=s=>'`'+s.replaceAll('\\','\\\\').replaceAll('`','\\`')+'`',key='/pinnacle-pages-scripts/speech-measurement.js';
 const compiled='prefix();var map={'+JSON.stringify(key)+':{body:'+quote(before)+',sha256:"'+createHash('sha256').update(before).digest('hex')+'"}};suffix();';
 const result=patchCompiledAsset(compiled,key,before,after);assert(result.startsWith('prefix();'));assert(result.endsWith(';suffix();'));assert.throws(()=>patchCompiledAsset(compiled,key,before+'changed',after));
});
test('compiled metadata patch preserves click IDs and numeric campaign IDs',()=>{
 const code='function safe(value,key){const click=key==="gclid";if(!value||value.length>(click?256:128)||!(click?/^[A-Za-z0-9._~-]+$/:/^[A-Za-z0-9][A-Za-z0-9._~ -]*$/).test(value))return null;if(key==="utm_id"&&knownGoogleAdsCampaignIds.has(value))return value;return key==="utm_id"?null:value;}';
 const patched=patchCompiledLabels(code,{numericInventory:true}),fn=new Function(patched+';return safe')();
 assert.equal(fn('Pinnacle: Hyderabad','utm_campaign'),'Pinnacle: Hyderabad');assert.equal(fn('పిన్నాకిల్ హైదరాబాద్','utm_campaign'),'పిన్నాకిల్ హైదరాబాద్');assert.equal(fn('31415926535','utm_id'),'31415926535');assert.equal(fn('not/an/id','utm_id'),null);assert.equal(fn('not:click','gclid'),null);for(const url of ['https://example.com/path','www.example.com/path','example.com/path'])assert.equal(fn(url,'utm_campaign'),null);assert.throws(()=>patchCompiledLabels(code+code));
});
