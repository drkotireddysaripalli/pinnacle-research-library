import fs from 'node:fs';
import assert from 'node:assert/strict';
import editions from '../src/data/book-locales.json' with {type:'json'};
import strings from '../src/data/book-cart-locales.json' with {type:'json'};
import {BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org';
assert.equal(editions.length,22);assert.equal(new Set(editions.map(b=>b.sku)).size,22);
for(const book of editions){
 const html=fs.readFileSync('dist'+book.path+'.html','utf8');
 assert(html.includes('<html lang="'+book.language+'"'),book.path+' lang');
 assert(html.includes('rel="canonical" href="'+origin+book.path+'"'),book.path+' canonical');
 assert(html.includes('hreflang="hi-IN"')&&html.includes('hreflang="te-IN"')&&html.includes('hreflang="en-IN"'));
 const script=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);assert(script);
 const graph=JSON.parse(script[1])['@graph'];const product=graph.find(n=>n['@id']===origin+book.path+'#product');
 assert.equal(product.offers.price,book.price);assert.equal(product.offers.availability,'https://schema.org/'+(book.available?'InStock':'OutOfStock'));assert.equal(product.inLanguage,book.language);
 assert.equal(html.includes('data-book-sku="'+book.sku+'"'),book.available);
 assert(html.includes('tel:+919100181181')&&html.includes('https://wa.me/919100181181'));
 for(const member of book.members){assert(html.includes(member.sample));assert.equal(member.contents.length,31);assert(fs.existsSync('public'+member.sample));}
 assert(html.includes(strings[book.locale].checkout));assert(BOOK_ROUTES[book.path]);
 assert(!html.includes('/publication/')&&!html.includes('/digital-delivery/'),'Paid assets private');
 for(const asset of [book.front,book.back].filter(Boolean)){assert(fs.statSync('public'+asset).size<25*1024*1024);}
}
for(const locale of ['hi','te']){const html=fs.readFileSync('dist/books/'+locale+'.html','utf8');assert(html.includes('id="singles"')&&html.includes('id="pairs"'));}
for(const font of ['anek-devanagari','anek-telugu'])assert(fs.statSync('public/pinnacle-pages-fonts/'+font+'.woff2').size>10000);
assert.equal((fs.readFileSync('public/pinnacle-pages-data/books-sitemap.xml','utf8').match(/<loc>/g)||[]).length,59);
console.log('PASS:22 native offers,2 hubs,locale cart copy,hreflang,prices,assets,contact routes and private-file boundary.');
