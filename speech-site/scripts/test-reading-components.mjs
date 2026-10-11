import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {READING_COMPONENTS} from '../deployment/reading-paint.mjs';
test('missing news components do not request the full archive; existing components retain their real arguments',()=>{
 let ready,calls=[];const window={GetHomeArticles(...args){calls.push(args);return 'original';}},document={getElementById:id=>id==='present'?{}:null,addEventListener(name,fn,options){assert.equal(name,'DOMContentLoaded');assert.equal(options.once,true);ready=fn;}};
 vm.runInNewContext(READING_COMPONENTS,{window,document});ready();assert.equal(window.GetHomeArticles('cm-latestnews',0),undefined);assert.equal(calls.length,0);assert.equal(window.GetHomeArticles('present',2),'original');assert.deepEqual(calls,[['present',2]]);
});
test('a page without a legacy news loader keeps working',()=>{let ready;vm.runInNewContext(READING_COMPONENTS,{window:{},document:{addEventListener(_n,fn){ready=fn;}}});assert.doesNotThrow(ready);});
