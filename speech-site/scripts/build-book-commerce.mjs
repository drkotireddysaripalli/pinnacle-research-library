// Regenerate discovery surfaces and factual two-cover product composites.
// Full paid book files must never be copied into public assets.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import books from '../src/data/book-catalog.json' with {type:'json'};
const root=path.resolve(import.meta.dirname,'..');
const origin='https://www.pinnacleblooms.org';
const assets=path.join(root,'public/pinnacle-pages-assets/books-20261002');
assert.equal(books.length,33);
assert.equal(new Set(books.map(b=>b.sku)).size,33);
assert.equal(new Set(books.map(b=>b.path)).size,33);
assert(books.every(b=>b.availability==='out_of_stock'&&!b.acceptOrders));
for(const pair of books.filter(b=>b.bookCount===2&&b.formatCode==='PDF')){
 const panels=[];
 for(const [i,key] of pair.memberKeys.entries()){
  const book=books.find(b=>b.bookKey===key&&!b.bundle);
  const input=await sharp(path.join(root,'public',book.front)).resize(750,570,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
  panels.push({input:input.data,left:25+i*800,top:Math.floor((650-input.info.height)/2)});
 }
 const target=path.join(assets,pair.assetId+'.jpg');
 await sharp({create:{width:1600,height:650,channels:3,background:'#ffffff'}}).composite(panels).jpeg({quality:90,mozjpeg:true}).toFile(target);
 await fs.copyFile(target,path.join(root,'src/assets/books',pair.assetId+'.jpg'));
}
await fs.copyFile(path.join(assets,'four-book-collection.png'),path.join(assets,'collection.png'));
const routes={'/books':'books-index',...Object.fromEntries(books.map(b=>[b.path,'book-'+b.slug]))};
const handler=path.join(root,'deployment/speech-handler.mjs');
const previous=await fs.readFile(handler,'utf8');
assert(previous.startsWith('export const BOOK_ROUTES='));
await fs.writeFile(handler,previous.replace(/^export const BOOK_ROUTES=.*;\n/,'export const BOOK_ROUTES='+JSON.stringify(routes)+';\n'));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const el=(key,value)=>`<g:${key}>${escape(value)}</g:${key}>`;
const structured=(key,value)=>`<g:${key}>${el('digital_source_type','trained_algorithmic_media')}${el('content',value)}</g:${key}>`;
const items=books.map(b=>'<item>'+Object.entries({id:b.sku,link:origin+b.path,image_link:origin+b.front,availability:b.availability,price:b.price.toFixed(2)+' INR',condition:'new',brand:'Pinnacle Blooms Network',google_product_category:'Media > Books',product_type:'Books > Parent Education > '+b.format,identifier_exists:'no'}).map(([k,v])=>el(k,v)).join('')+structured('structured_title',b.feedTitle)+structured('structured_description',b.description+'\n'+b.statusDetail)+(b.back?el('additional_image_link',origin+b.back):'')+(!b.physical?el('excluded_destination','Shopping_ads'):'')+'</item>');
await fs.writeFile(path.join(root,'public/pinnacle-pages-data/books-merchant-feed.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Pinnacle 101 Parent Visual Library</title><link>'+origin+'/books</link><description>Four books, eleven combinations and three formats. Ordering is currently unavailable.</description>'+items.join('\n')+'</channel></rss>\n');
await fs.writeFile(path.join(root,'public/pinnacle-pages-data/books-sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(routes).map(p=>'<url><loc>'+origin+p+'</loc></url>').join('')+'</urlset>\n');
console.log(JSON.stringify({offers:books.length,routes:Object.keys(routes).length,pairImages:6,ordersEnabled:false}));
