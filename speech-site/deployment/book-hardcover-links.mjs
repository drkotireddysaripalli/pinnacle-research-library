// Two public Amazon combined English hardcovers verified 5 October 2026.
// These are separate editions from the existing two/four-volume Pinnacle sets.
export const HARDCOVER_LINK_RELEASE='hardcover-links-20261005';
export const hardcoverEditions=[
 {sku:'PBN-SP-OT-101-EN-HB-SET2',groupKey:'pair-speech-occupational',path:'/books/pinnacle-101-speech-occupational-hardbound-pair',asin:'B0HLYGDP86',url:'https://www.amazon.com/dp/B0HLYGDP86',isbn:'9798160026138',pages:96,books:2,title:'Speech + Occupational Therapy'},
 {sku:'PBN-101-EN-HB-SET4',groupKey:'collection',path:'/books/pinnacle-101-four-book-hardbound-collection',asin:'B0HLY917FC',url:'https://www.amazon.com/dp/B0HLY917FC',isbn:'9798160027036',pages:188,books:4,title:'The four-book Pinnacle 101 library'}
];
export const hardcoverForPath=pathname=>hardcoverEditions.find(e=>e.path===pathname);
export const hardcoverForGroup=group=>hardcoverEditions.find(e=>e.groupKey===group);
export const hasHardcoverEdition=pathname=>pathname==='/books'||!!hardcoverForPath(pathname);
export const hardcoverCardStyle='min-width:0;padding:1.5rem;background:#faf3ff;border-radius:.7rem';
export const hardcoverHubStock='Pinnacle’s separate printed editions are out of stock. Combined Amazon hardcovers are offered separately; check delivery there.';
export function hardcoverPanel(e,compact=false){
 if(!e)return '';
 const label=compact?'Combined hardcover on Amazon.com':'Buy combined hardcover on Amazon.com';
 return `<aside data-hardcover-panel="${e.asin}" aria-label="${e.title}: combined Amazon hardcover" style="box-sizing:border-box;max-width:100%;margin:1rem 0;padding:1rem;border:1px solid #d7c8e2;border-radius:.75rem;background:#fff;color:#253e55;font-size:1rem;line-height:1.65">${compact?'':'<h2 style="font-size:1.25rem;line-height:1.4;margin:0 0 .5rem;color:#742091">Prefer one combined hardcover?</h2>'}<p style="margin:0 0 .5rem;font-weight:700">One English hardcover · ${e.pages} pages</p><a href="${e.url}" target="_blank" rel="noopener noreferrer" data-hardcover-purchase="${e.asin}" style="display:flex;align-items:center;min-height:44px;max-width:100%;padding:.25rem 0;color:#642082;font-size:1rem;font-weight:700;text-decoration:underline;text-underline-offset:.2em;line-height:1.5;overflow-wrap:anywhere">${label}<span aria-hidden="true"> ↗</span></a><p style="margin:.5rem 0 0">Amazon combines ${e.books} complete books in one volume. The Pinnacle set contains ${e.books} separate hardbound books.</p>${compact?'':`<p style="margin:.5rem 0 0">Landscape illustrations are sideways within the portrait book; turn it to read. ISBN ${e.isbn}.</p>`}<p style="margin:.5rem 0 0">Check Amazon for current price and delivery to your address.</p></aside>`;
}
export function wrapHardcoverCard(e,card){
 return e?`<!--pbn-hardcover-card-start--><div data-hardcover-card style="${hardcoverCardStyle}">${card}${hardcoverPanel(e,true)}</div><!--pbn-hardcover-card-end-->`:card;
}
// Current-asset adapter preserves the rest of each published page. Astro uses
// the same render helpers, so a later source build retains these exact editions.
export function addHardcoverLinks(html,pathname){
 if(!hasHardcoverEdition(pathname))return html;
 const canonical=html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g)||[];
 if(canonical.length!==1||!canonical[0].includes('href="https://www.pinnacleblooms.org'+pathname+'"'))return html;
 if(pathname==='/books'){
  const four=hardcoverEditions[1],pair=hardcoverEditions[0];
  if(!html.includes('data-hardcover-panel="'+four.asin+'"')){
   const anchor=new RegExp('<a href="'+four.path+'"><h3>Hardbound<\\/h3>[\\s\\S]*?<\\/a>');
   html=html.replace(anchor,card=>wrapHardcoverCard(four,card));
  }
  html=html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g,card=>{
   if(!card.includes('href="'+pair.path+'"')||card.includes('data-hardcover-panel="'+pair.asin+'"'))return card;
   return card.replace(/<\/nav>(\s*<\/article>)$/,'</nav>'+hardcoverPanel(pair,true)+'$1');
  });
  return html.replace('Printed editions are out of stock.',hardcoverHubStock);
 }
 const e=hardcoverForPath(pathname);
 if(html.includes('data-hardcover-panel="'+e.asin+'"'))return html;
 return html.replace('<div class="pbn-book-actions">',hardcoverPanel(e)+'<div class="pbn-book-actions">');
}

