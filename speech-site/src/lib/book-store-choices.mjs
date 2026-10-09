import registry from '../data/book-store-choices.json' with {type:'json'};

export const STORE_CHOICE_RELEASE='book-store-choices-20261009';
const origin='https://www.pinnacleblooms.org';
const escape=s=>String(s??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const storeRows=registry.rows.map(row=>({...row,path:new URL(row.page).pathname}));
export const storeRowForSku=sku=>storeRows.find(row=>row.sku===sku);
export function storeRowForPath(path){
 const direct=storeRows.find(row=>row.path===path);if(direct)return direct;
 const summary=storeRows.find(row=>row.lang!=='en'&&row.path.replace('/books/','/books/editions/')===path);
 if(summary)return summary;
 const printed=registry.amazon.find(edition=>edition.path===path);
 return printed&&storeRows.find(row=>row.amazon.includes(printed.id));
}
export const storePaths=[...new Set([...storeRows.map(row=>row.path),...storeRows.filter(row=>row.lang!=='en').map(row=>row.path.replace('/books/','/books/editions/')),...registry.amazon.filter(e=>!e.format.startsWith('Kindle')).map(e=>e.path),'/books','/books/hi','/books/te','/shop'])];
export const hasStoreChoices=path=>storePaths.includes(path);
const labels={en:'Choose where to read',hi:'पढ़ने का अपना तरीका चुनें',te:'మీకు నచ్చిన విధంగా చదవండి'};
const icon=(kind)=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${kind==='print'?'<path d="M4 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4zM14 7a3 3 0 0 1 3-3h3v14h-2a4 4 0 0 0-4 3"/>':'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 17h6M9 7h6M9 10h6"/>'}</svg>`;
export const storeChoiceStyles=`<style data-book-store-styles>.pbn-stores{box-sizing:border-box;min-width:0;margin:1.25rem 0;padding:1.2rem;border:1px solid #dcd5e2;border-left:4px solid #a11987;border-radius:16px;background:#fff;color:#19374d}.pbn-stores *{box-sizing:border-box}.pbn-stores h2,.pbn-stores h4{margin:0 0 .3rem;font-size:1.25rem;line-height:1.4;color:#19374d}.pbn-stores .pbn-store-note{margin:.5rem 0 0;font-size:1rem;line-height:1.6;color:#364858}.pbn-store-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:.65rem;margin:.8rem 0}.pbn-stores a.pbn-store-choice{display:flex;align-items:center;gap:.7rem;min-height:76px;min-width:0;padding:.8rem;text-decoration:none;border:1px solid #ddd5e2;border-radius:10px;background:#fff;color:#19374d;font-size:1rem;line-height:1.4}.pbn-stores a.pbn-store-choice:hover{border-color:#a11987;background:#fcf6fb}.pbn-stores a.pbn-store-choice:focus-visible{outline:3px solid #a11987;outline-offset:3px}.pbn-stores .pbn-store-choice svg{flex-shrink:0;color:#a11987}.pbn-store-choice strong,.pbn-store-choice small{display:block;white-space:normal;overflow-wrap:anywhere}.pbn-store-choice small{font-size:1rem;color:#435365}.pbn-store-arrow{margin-left:auto;color:#a11987}.pbn-stores .pbn-store-details{margin:.8rem 0 0}.pbn-stores .pbn-store-details summary{cursor:pointer;font-weight:700;color:#7c176f;min-height:44px;line-height:1.5;padding:.5rem 0}.pbn-stores .pbn-store-details p{font-size:1rem;line-height:1.65;margin:.5rem 0}.pbn-stores[data-compact] .pbn-store-options{grid-template-columns:1fr}.pbn-stores[data-compact]{padding:.9rem}.pbn-stores a.pbn-store-choice[data-store="pinnacle"]{border-color:#a11987}@media(max-width:400px){.pbn-stores{padding:.85rem}.pbn-stores h2{font-size:1.2rem}.pbn-stores a.pbn-store-choice{padding:.65rem}}</style>`;

export function storeChoicePanel(row,{compact=false,contentLocale=row?.lang||'en',styles=true}={}){
 if(!row)return '';
 const count=row.bookCount;
 const editions=row.amazon.map(id=>registry.amazon.find(e=>e.id===id)).filter(Boolean);
 const options=[{store:'pinnacle',url:'/shop/cart?cart_sku='+row.sku+'&quantity=1',name:'Pinnacle',detail:count===1?'Downloadable PDF':count+' separate PDF books',kind:'digital'},
 {store:'google-play',url:row.play,name:'Google Play Books',detail:count===1?'Read in Google Play':'One combined ebook',kind:'digital'},
 ...editions.map(e=>({store:'amazon',url:e.url,name:e.format.startsWith('Kindle')?'Amazon Kindle':'Amazon',detail:e.format.startsWith('Kindle')?'Read in Kindle':e.format.toLowerCase().includes('hard')?'Combined hardcover · '+e.pages+' pages':'Paperback · '+e.pages+' pages',kind:e.format.startsWith('Kindle')?'digital':'print',edition:e.id,asin:e.asin,format:e.format})),
 ...(row.flipkart?[{store:'flipkart',url:registry.flipkart.url,name:'Flipkart',detail:'Paperback · 44 pages',kind:'print',edition:row.flipkart}]:[])];
 const links=options.map(o=>`<a class="pbn-store-choice" href="${escape(o.url)}" data-store="${o.store}" data-book-source="${escape(row.sku)}"${o.edition?' data-book-edition="'+o.edition+'"':''}${o.asin?' data-'+(o.format.startsWith('Kindle')?'kindle':o.format.toLowerCase().includes('hard')?'hardcover':'paperback')+'-purchase="'+o.asin+'"':''}${o.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''} lang="en-IN">${icon(o.kind)}<span><strong>${o.name}</strong><small>${o.detail}</small></span><span class="pbn-store-arrow" aria-hidden="true">${o.url.startsWith('https:')?'↗':'→'}</span></a>`).join('');
 const detail=[count===1?'Pinnacle supplies the complete 46-page PDF after successful payment.':`Pinnacle supplies ${count} separate PDF books. Google Play is a combined ${row.playPages}-page volume.`,
 ...editions.filter(e=>!e.format.startsWith('Kindle')).map(e=>e.format.toLowerCase().includes('hard')?`Amazon’s ${e.pages}-page hardcover combines ${count} guides in one volume. Pinnacle’s hardbound set contains ${count} separate books. Landscape illustrations are sideways within the portrait book; turn it to read. ISBN ${e.isbn13}.`:`The English paperback has 44 interior pages; the PDF is a separate 46-page edition. Landscape illustrations are printed sideways in the 8.5 × 11-inch book; turn it to read. ISBN ${e.isbn13}.`),
 'Pinnacle’s own printed editions remain out of stock. Retailers set their own price, availability, shipping/import charges and delivery. Check your address before ordering.'];
 const heading=compact?'h4':'h2';
 return `${styles?storeChoiceStyles:''}<aside class="pbn-stores" data-store-choices="${row.sku}"${compact?' data-compact':''} lang="${contentLocale}-IN" aria-label="${escape(labels[contentLocale]||labels.en)}"><${heading}>${labels[contentLocale]||labels.en}</${heading}><p class="pbn-store-note" lang="en-IN">${row.lang==='hi'?'Hindi':row.lang==='te'?'Telugu':'English'} edition · Choose your format and store.</p><div class="pbn-store-options">${links}</div><details class="pbn-store-details" lang="en-IN"><summary>Format, delivery &amp; edition details</summary>${detail.map(t=>'<p>'+escape(t)+'</p>').join('')}</details></aside>`;
}

// Replace only known retailer panels; retain every other page byte and exact canonical.
const oldPanels=/<aside\b(?=[^>]*(?:class="pbn-play-purchase"|data-paperback-panel=|data-hardcover-panel=))[^>]*>[\s\S]*?<\/aside>/g;
function stripPanels(html){return html.replace(oldPanels,'');}
function removeCoveredPanels(html){
 const replacements=[...html.matchAll(/<aside\b(?=[^>]*data-store-choices=)[^>]*>[\s\S]*?<\/aside>/g)].map(x=>x[0]).join('');
 const destinations=new Set([...replacements.matchAll(/href="([^"]+)"/g)].map(x=>x[1]));
 return html.replace(oldPanels,panel=>[...panel.matchAll(/href="([^"]+)"/g)].every(x=>destinations.has(x[1]))?'':panel);
}
export function addStoreChoices(html,path){
 if(!hasStoreChoices(path))return html;
 const canonical=html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g)||[];
 if(canonical.length!==1||!canonical[0].includes('href="'+origin+path+'"'))return html;
 // Future Astro builds already contain this component. Do not duplicate or remove it.
 if(html.includes('data-store-choices='))return removeCoveredPanels(html);
 const row=storeRowForPath(path);
 if(row){
  const contentLocale=path.startsWith('/books/editions/')?'en':row.lang;
  let replaced=false;
  html=html.replace(oldPanels,()=>{if(replaced)return '';replaced=true;return storeChoicePanel(row,{contentLocale,styles:false});});
  if(!replaced)html=html.replace('<div class="pbn-book-actions">',storeChoicePanel(row,{contentLocale,styles:false})+'<div class="pbn-book-actions">');
 }else{
  // Match individual non-nested discovery cards, never the enclosing page article.
  html=html.replace(/<article\b[^>]*>(?:(?!<article\b|<\/article>)[\s\S])*<\/article>/g,card=>{
   const row=storeRows.find(r=>card.includes('href="'+r.path+'"'));if(!row)return card;
   return stripPanels(card).replace('</article>',storeChoicePanel(row,{compact:true,styles:false})+'</article>');
  });
  // The four-book featured section is not an article card.
  if(path==='/shop'||path==='/books'){
   const four=storeRows.find(r=>r.sku==='PBN-101-EN-PDF-SET4');
   if(four){const panel=storeChoicePanel(four,{compact:true,styles:false});html=path==='/shop'?html.replace(/(<p class="pbn-small-note">Softcover set[\s\S]*?<\/p>)/,'$1'+panel):html.replace('<div class="pbn-book-sets">',panel+'<div class="pbn-book-sets">');}
  }
 }
 return html.includes('data-store-choices=')?removeCoveredPanels(html).replace('</head>',storeChoiceStyles+'</head>'):html;
}
