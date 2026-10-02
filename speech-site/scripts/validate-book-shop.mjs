import fs from 'node:fs';
import assert from 'node:assert/strict';
import books from '../src/data/book-catalog.json' with {type:'json'};
import {BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const shop=fs.readFileSync('dist/shop.html','utf8');
assert.equal((shop.match(/<h1\b/g)||[]).length,1);
assert(shop.includes('https://www.pinnacleblooms.org/shop'));
assert(shop.includes('index, follow, max-image-preview:large'));
assert.equal((shop.match(/data-book-sku=/g)||[]).length,11);
assert.equal(BOOK_ROUTES['/shop'],'shop-index');
assert.equal(books.length,33);
assert.equal(books.filter(b=>b.acceptOrders&&!b.physical).length,11);
assert.equal(books.filter(b=>b.physical&&!b.acceptOrders).length,22);
for(const book of books){
 const html=fs.readFileSync('dist'+book.path+'.html','utf8');
 assert(html.includes(book.sku));
 assert(html.includes('https://schema.org/'+(book.physical?'OutOfStock':'InStock')));
 if(!book.physical){assert(shop.includes(book.sku));assert(html.includes('data-book-sku="'+book.sku+'"'));}
}
for(const name of ['speech','ot','aba','special-education'])assert(shop.includes('/pinnacle-pages-assets/book-samples-sales-v2-20261002/'+name+'-sample.pdf'));
assert(!shop.includes('orders are not open yet'));
assert(!shop.includes('private-digital-delivery'));
assert(shop.includes('Softcover')&&shop.includes('Hardbound'));
const feed=fs.readFileSync('public/pinnacle-pages-data/books-merchant-feed.xml','utf8');
assert.equal((feed.match(/<g:availability>in_stock/g)||[]).length,11);
assert.equal((feed.match(/<g:availability>out_of_stock/g)||[]).length,22);
console.log('PASS: shop,33 editions,11 purchasable PDFs,22 unavailable print editions, samples and feed.');

await import('./validate-book-languages.mjs');
