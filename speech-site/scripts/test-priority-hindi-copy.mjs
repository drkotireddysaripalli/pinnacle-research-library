import test from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/lib/knowledge/hindi-category-copy.ts'],bundle:true,format:'esm',platform:'node',write:false});
const {hindiFAQCategories,reviewedHindiCategoryCopy}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
test('Hindi copy is confined to seven Hindi listings and supplies meaningful native introductions',()=>{
 assert.equal(Object.keys(hindiFAQCategories).length,7);
 for(const category of Object.keys(hindiFAQCategories)){const c=reviewedHindiCategoryCopy({language:'hindi',mode:'listing',category});assert(c);assert(/[\u0900-\u097f]/.test(c.heading));assert(c.intro.length>160);assert(c.title.includes('Pinnacle Blooms'));assert.equal(reviewedHindiCategoryCopy({language:'english',mode:'listing',category}),null);assert.equal(reviewedHindiCategoryCopy({language:'hindi',mode:'answer',category}),null);}
 assert.equal(reviewedHindiCategoryCopy({language:'hindi',mode:'listing',category:'unknown'}),null);
 assert(hindiFAQCategories['speech-therapy'].intro.includes('मदद कर सकती है'));assert(hindiFAQCategories['occupational-therapy'].intro.includes('मदद कर सकती है'));
});
