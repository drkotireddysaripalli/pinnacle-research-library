import test from 'node:test';
import assert from 'node:assert/strict';
import {evidenceShell} from '../tests/testingbot/evidence-shell.mjs';
function fixture({parent='https://www.pinnacleblooms.org/verify/',section='records',footer=true,footerLinks=31}={}) {
 const links=[{href:parent},{href:parent+'#'+section}];
 return {querySelector(selector){if(selector==='header')return {querySelectorAll:()=>links};if(selector==='footer.evidence-footer'&&footer)return {querySelectorAll:()=>Array(footerLinks).fill({})};return null;}};
}
test('Maintained compact evidence and native parent guides retain their actual parent links',()=>{
 for(const path of ['/verify/evidence/research-library.html','/verify/evidence/scale-register.html','/verify/evidence/scale-and-mission.html',...['','te/','hi/'].flatMap(lang=>['abilityscore','everyday-practice','licences-and-scope'].map(name=>'/verify/guides/'+lang+name+'.html'))])assert(evidenceShell(fixture(),path),path);
 assert(evidenceShell(fixture({section:'study-portfolio'}),'/verify/evidence/study-index.html'));
 assert(evidenceShell(fixture({section:'appreciations'}),'/verify/evidence/recognition-register.html'));
 assert(evidenceShell(fixture(),'/verify/evidence/records/md5.html'));
});
test('Missing or misdirected evidence navigation still fails',()=>{
 for(const options of [{footer:false},{footerLinks:0},{parent:'https://unrelated.example/'},{section:'wrong'}])assert.equal(evidenceShell(fixture(options),'/verify/guides/abilityscore.html'),false);
 assert.equal(evidenceShell(fixture(),'/unrelated'),false);
 assert.equal(evidenceShell(fixture(),'/verify/guides/unknown.html'),false);
});
