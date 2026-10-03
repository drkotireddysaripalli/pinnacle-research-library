import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Run the actual controller with deferred network responses, without real OTPs.
const source=ts.transpileModule(fs.readFileSync(new URL('../src/scripts/ask-verification.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
const tick=()=>new Promise(r=>setImmediate(r));
function fixture(){
 class Element{
  listeners={};dataset={};hidden=false;open=false;disabled=false;textContent='';fields={};nodes={};lists={};
  addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
  async fire(name){for(const fn of this.listeners[name]||[])await fn({preventDefault(){}});}
  querySelector(s){return this.nodes[s]||null;}querySelectorAll(s){return this.lists[s]||[];}
  reset(){}focus(){}setAttribute(){}showModal(){this.open=true;}close(){this.open=false;}
 }
 const dialog=new Element(),profile=new Element(),phone=new Element(),code=new Element(),message=new Element(),verify=new Element(),cancel=new Element(),call=new Element(),whatsapp=new Element(),change=new Element(),badge=new Element(),button=new Element();
 call.dataset.askContact='call';whatsapp.dataset.askContact='whatsapp';phone.fields.phone='+919999999999';code.fields.token='123456';code.nodes.input=new Element();
 dialog.nodes={'[data-ask-phone-form]':phone,'[data-ask-code-form]':code,'[data-ask-verification-status]':message,'[data-ask-phone-change]':change};
 dialog.lists={'[data-ask-verification-cancel]':[cancel],'form button':[button]};
 const document={querySelector:s=>({'#ask-whatsapp-verification':dialog,'[data-ask-profile]':profile,'[data-ask-verify-open]':verify,'[data-ask-verify-text]':new Element(),'[data-ask-verification-label]':new Element()}[s]||null),querySelectorAll:s=>({'[data-ask-contact]':[call,whatsapp],'[data-ask-verified-badge]':[badge]}[s]||[])};
 const requests=[],navigations=[],refresh=deferred();let refreshes=0;
 const sandbox={exports:{},document,location:{assign:url=>navigations.push(url)},URLSearchParams,AbortSignal,FormData:class{constructor(form){this.form=form;}get(k){return this.form.fields[k];}},fetch:(url)=>{const d=deferred();requests.push({url,finish:(body={status:'ok'})=>d.resolve({ok:true,json:async()=>body})});return d.promise;}};
 vm.runInNewContext(source,sandbox);
 const controller=sandbox.exports.setupAskVerification(()=>{refreshes++;return refresh.promise;});controller.update(false,'synthetic-csrf');
 return {controller,dialog,profile,phone,code,verify,cancel,call,whatsapp,button,requests,navigations,refresh,get refreshes(){return refreshes;}};
}
test('cancel while verification is pending suppresses refresh and contact',async()=>{
 const f=fixture();await f.call.fire('click');const pending=f.code.fire('submit');await f.cancel.fire('click');f.requests[0].finish();await pending;
 assert.equal(f.refreshes,0);assert.equal(f.requests.length,1);assert.deepEqual(f.navigations,[]);assert.equal(f.dialog.open,false);assert.equal(f.profile.open,false);
});
test('cancel during profile refresh cannot launch the remembered contact',async()=>{
 const f=fixture();await f.whatsapp.fire('click');const pending=f.code.fire('submit');f.requests[0].finish();await tick();assert.equal(f.refreshes,1);
 await f.cancel.fire('click');f.controller.update(true,'synthetic-csrf');f.refresh.resolve();await pending;
 assert.equal(f.requests.length,1);assert.deepEqual(f.navigations,[]);assert.equal(f.profile.open,false);
});
test('late contact response is ignored after cancellation; normal response navigates once',async()=>{
 for(const mode of ['call','whatsapp']){
  const f=fixture();f.controller.update(true,'synthetic-csrf');await f[mode].fire('click');f.controller.close();f.requests[0].finish({url:mode==='call'?'tel:+919100181181':'https://wa.me/919100181181'});await tick();assert.deepEqual(f.navigations,[]);
  await f[mode].fire('click');const url=mode==='call'?'tel:+919100181181':'https://wa.me/919100181181';f.requests[1].finish({url});await tick();assert.deepEqual(f.navigations,[url]);
 }
});
test('cancel/reopen serializes phone mutations and ignores the old response',async()=>{
 const f=fixture();await f.verify.fire('click');const first=f.phone.fire('submit');await f.cancel.fire('click');await f.verify.fire('click');await f.phone.fire('submit');assert.equal(f.requests.length,1);assert.equal(f.button.disabled,true);
 f.requests[0].finish();await first;assert.equal(f.phone.hidden,false);assert.equal(f.code.hidden,true);assert.equal(f.button.disabled,false);
 const second=f.phone.fire('submit');assert.equal(f.requests.length,2);f.requests[1].finish();await second;assert.equal(f.phone.hidden,true);assert.equal(f.code.hidden,false);
});
