import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const cssPath='/pinnacle-pages-assets/SpeechPage.zM65lw-_.css';
export const cssSHA='357809959b12c5e7dfd0f3c26338aca1d299384e162658083d8f417857da07c5';
export const sha=b=>createHash('sha256').update(b).digest('hex');
export function assertEmbeddedCssDelta(before,after,css){
 assert.equal(css.length,11576);assert.equal(sha(css),cssSHA);
 const match=before.match(/const records=(\{[^\n]+\});/);assert(match);
 const old=JSON.parse(match[1]);assert(!Object.hasOwn(old,cssPath));
 const literal=JSON.stringify(cssPath)+':'+JSON.stringify({hash:cssSHA.slice(0,16),body:css.toString('base64')});
 const at=match.index+match[0].indexOf(match[1])+match[1].length-1;
 assert.equal(after,before.slice(0,at)+','+literal+before.slice(at),'Only one exact immutable CSS record may change');
 return {status:'passed',cssPath,cssSHA,bytes:css.length,existingRecords:Object.keys(old).length};
}
