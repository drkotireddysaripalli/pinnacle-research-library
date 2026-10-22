import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {assertEmbeddedCssDelta,cssPath} from './embedded-css-patch.mjs';
const after=fs.readFileSync(new URL('../deployment/enrolment-assets.mjs',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../public'+cssPath,import.meta.url));
const records=JSON.parse(after.match(/const records=(\{[^\n]+\});/)[1]),literal=','+JSON.stringify(cssPath)+':'+JSON.stringify(records[cssPath]);
const before=after.replace(literal,'');
test('only the exact known immutable CSS record is added',()=>assert.equal(assertEmbeddedCssDelta(before,after,css).existingRecords,9));
test('rejects changed surrounding runtime or missing insertion',()=>{assert.throws(()=>assertEmbeddedCssDelta(before,after+' ',css));assert.throws(()=>assertEmbeddedCssDelta(before,before,css));});
test('rejects a changed CSS payload',()=>assert.throws(()=>assertEmbeddedCssDelta(before,after,Buffer.concat([css,Buffer.from(' ')]))));
