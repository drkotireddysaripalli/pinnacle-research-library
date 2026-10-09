import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {storeRows,storePaths,storeRowForPath,storeChoicePanel,addStoreChoices} from '../src/lib/book-store-choices.mjs';
import {addStoreChoices as deployed} from '../deployment/book-store-choices.mjs';
import {parse} from 'parse5';
const nodes=html=>{const out=[];function walk(n){out.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));return out;};
const links=html=>nodes(html).filter(n=>n.tagName==='a').map(n=>Object.fromEntries(n.attrs).href);
const attrs=n=>Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
const anchors=html=>nodes(html).filter(n=>n.tagName==='a').map(attrs);
test('33 exact buying mappings; no guessed language, physical stock, or variant',()=>{
 assert.equal(storeRows.length,33);assert.equal(new Set(storeRows.map(r=>r.sku)).size,33);
 for(const lang of ['en','hi','te'])assert.equal(storeRows.filter(r=>r.lang===lang).length,11);
 for(const row of storeRows){const panel=storeChoicePanel(row),a=anchors(panel);assert.equal(a.find(a=>a['data-store']==='pinnacle').href,'/shop/cart?cart_sku='+row.sku+'&quantity=1');assert.equal(a.find(a=>a['data-store']==='google-play').href,row.play);assert(!panel.includes('undefined'));assert(!panel.includes('null'));assert(!panel.includes('merchantcenter.google'));if(row.lang!=='en')assert(!a.some(a=>a['data-store']==='amazon'||a['data-store']==='flipkart'));}
});
test('Speech PDF and paperback retain exact separate formats and both approved paperback retailers',()=>{
 const pdf=storeRowForPath('/books/speech-communication-101-my-message-matters'),pb=storeRowForPath('/books/speech-communication-101-my-message-matters-softcover');assert.equal(pdf,pb);
 const panel=storeChoicePanel(pdf);assert(panel.includes('9798178590706'));assert(panel.includes('44 interior pages'));assert(panel.includes('separate 46-page'));assert(panel.includes('B0HLZPP118'));assert(panel.includes('pid=9798178590706'));assert(panel.includes('out of stock'));assert(!panel.includes('Kindle'));
});
test('Kindle and combined hardcovers keep genuine edition identity',()=>{
 const ot=storeChoicePanel(storeRows.find(r=>r.sku==='PBN-OT-101-EN-PDF'));assert(ot.includes('Amazon Kindle'));assert(!ot.includes('ISBN undefined'));
 for(const [sku,pages,isbn,count] of [['PBN-SP-OT-101-EN-PDF-SET2',96,'9798160026138',2],['PBN-101-EN-PDF-SET4',188,'9798160027036',4]]){const panel=storeChoicePanel(storeRows.find(r=>r.sku===sku));assert(panel.includes(pages+'-page hardcover'));assert(panel.includes(isbn));assert(panel.includes(count+' separate books'));}
});
test('Exact canonical, private routes, idempotency and retained unrelated HTML',()=>{
 const row=storeRows[0],body='<main><h1>Book</h1><aside class="pbn-play-purchase"><a href="'+row.play+'">Play</a></aside><div class="pbn-book-actions"><a href="#preview">Free sample</a></div><p>₹799 · Out of stock</p><a href="tel:+919100181181">Call</a></main>',html='<html><head><link rel="canonical" href="'+row.page+'"></head><body>'+body+'</body></html>';
 const result=addStoreChoices(html,row.path);assert.equal(result,addStoreChoices(result,row.path));assert.equal(result,deployed(html,row.path));assert(result.includes('<p>₹799 · Out of stock</p>'));assert(result.includes('href="#preview"'));assert(result.includes('href="tel:+919100181181"'));assert.equal(addStoreChoices(html,'/shop/cart'),html);assert.equal(addStoreChoices(html.replace(row.page,'https://example.com'),row.path),html.replace(row.page,'https://example.com'));
});
test('Discovery adapter handles nested page article and separate book cards',()=>{
 const row=storeRows[0],html='<html><head><link rel="canonical" href="https://www.pinnacleblooms.org/books"></head><body><article class="page"><h1>Library</h1><section><article><a href="'+row.path+'">Speech</a><nav><a href="'+row.path+'-softcover">Softcover</a></nav></article></section></article></body></html>';
 const out=addStoreChoices(html,'/books');assert.equal((out.match(/data-store-choices=/g)||[]).length,1);assert(out.includes('pid=9798178590706'));assert.equal(out,addStoreChoices(out,'/books'));
});
test('Previously captured public pages preserve every existing destination',async t=>{
 const file='ask-private/book-store-choices-20261009/public-before.json';let records;try{records=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT'){t.skip('Private public snapshot not installed on CI');return;}throw e;}
 for(const record of records){const out=addStoreChoices(record.html,record.path),previous=new Set(anchors(record.html).map(a=>a.href)),after=new Set(anchors(out).map(a=>a.href));for(const href of previous)assert(after.has(href),record.path+' lost '+href);assert(out.includes('data-store-choices='),record.path);assert(out===addStoreChoices(out,record.path),'Idempotency '+record.path);assert(out===deployed(record.html,record.path),'Compiled parity '+record.path);}
});
