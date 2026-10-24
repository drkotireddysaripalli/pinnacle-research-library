import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const cssPath='/pinnacle-pages-assets/centers.DUTsoQ8n.css';
export const sharedCssPath='/pinnacle-pages-assets/PageLayout.C7sOKZ93.css';
export const sharedCssSHA='9e69cabb3eb3e4b9b04e3def6c25611ad8030337501241ffc82ffb9496aa3a7b';
export const oldCssPath='/pinnacle-pages-assets/centers.CpSarG70.css';
export const cssSHA='085bce33b44c4632b3122f72c441ca2c6dd7c0ae59b88ad1f9f68f454925c6be';
export const fixtureSHA='18be1e6346d1eaafde8959797b6fbb7c2805d5eba93381013d33679455c24bfa';
export const sha=b=>createHash('sha256').update(b).digest('hex');
export function repairAssets(before,css){
 assert.equal(css.length,9933);assert.equal(sha(css),cssSHA);
 const marker='export const enrolmentHash=';assert.equal(before.split(marker).length,2);assert(!before.includes(cssPath));
 const record={hash:cssSHA.slice(0,16),body:css.toString('base64')};
 return before.replace(marker,'// Restore the existing centre-directory stylesheet under its actual built URL.\nrecords['+JSON.stringify(cssPath)+']='+JSON.stringify(record)+';\n'+marker);
}
export function repairHandler(before){
 const a=" const etag='\"speech-'",e="+(storeChoices?'-'+STORE_CHOICE_RELEASE:'')+'\"';headers.set('etag',etag);",b=" let body=request.method==='HEAD'?null:source.body;\n",c=" if(!preview&&!privateResponse&&request.headers.get('if-none-match')===etag)";
 for(const marker of [a,e,b,c])assert.equal(before.split(marker).length,2,'Expected one source insertion point');
 return before.replace(a,' const directoryStyles=isHtml&&u.pathname===CENTERS_CANONICAL;\n'+a)
 .replace(e,"+(storeChoices?'-'+STORE_CHOICE_RELEASE:'')+(directoryStyles?'-centres-css-20261024':'')+'\"';headers.set('etag',etag);")
 .replace(c," if(directoryStyles){\n  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);\n  headers.set('x-pinnacle-centres-css','centres-css-20261024');\n }\n"+c)
 .replace(b,b+" if(directoryStyles&&body)body=(await source.text()).replaceAll('<link rel=\"stylesheet\" href=\""+oldCssPath+"\">','<link rel=\"stylesheet\" href=\""+sharedCssPath+"\"><link rel=\"stylesheet\" href=\""+cssPath+"\">');\n");
}
export function assertDelta(before,after,css){
 assert.equal(after['enrolment-assets.mjs'],repairAssets(before['enrolment-assets.mjs'],css),'Only the new stylesheet record may be added');
 assert.equal(after['speech-handler.mjs'],repairHandler(before['speech-handler.mjs']),'Only the scoped stylesheet/ETag repair may change');
 return {status:'PASS',cssPath,cssSHA,bytes:css.length};
}
