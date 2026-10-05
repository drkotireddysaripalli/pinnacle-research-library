// Public English Amazon paperbacks verified on 5 October 2026.
// These editions are separate from Pinnacle's own softcover stock and PDF offers.
export const PAPERBACK_LINK_RELEASE='paperback-links-20261005';
export const paperbackEditions=[
 {sku:'PBN-SP-101-EN-PB',groupKey:'speech',path:'/books/speech-communication-101-my-message-matters-softcover',asin:'B0HLZPP118',url:'https://www.amazon.com/dp/B0HLZPP118',isbn:'9798178590706',title:'My Message Matters'},
 {sku:'PBN-OT-101-EN-PB',groupKey:'occupational',path:'/books/occupational-therapy-101-i-belong-in-everyday-life-softcover',asin:'B0HLZKRV9J',url:'https://www.amazon.com/dp/B0HLZKRV9J',isbn:'9798178588741',title:'I Belong in Everyday Life'},
 {sku:'PBN-SE-101-EN-PB',groupKey:'learning',path:'/books/special-education-101-learning-through-everyday-play-softcover',asin:'B0HLZJ9WKJ',url:'https://www.amazon.com/dp/B0HLZJ9WKJ',isbn:'9798178764794',title:'Learning Through Everyday Play'}
];
export const paperbackForPath=pathname=>paperbackEditions.find(e=>e.path===pathname);
export const paperbackForGroup=group=>paperbackEditions.find(e=>e.groupKey===group);
export const hasPaperbackEdition=pathname=>pathname==='/books'||!!paperbackForPath(pathname);
export function paperbackPanel(e,compact=false){
 if(!e)return '';
 return `<aside data-paperback-panel="${e.asin}" aria-label="${e.title}: Amazon paperback" style="box-sizing:border-box;max-width:100%;margin:1rem 0;padding:1rem;border:1px solid #d7c8e2;border-radius:.75rem;background:#fff;color:#253e55;font-size:1rem;line-height:1.65">${compact?'':'<h2 style="font-size:1.25rem;line-height:1.4;margin:0 0 .5rem;color:#742091">Explore the Amazon paperback</h2>'}<p style="margin:0 0 .5rem;font-weight:700">English paperback · 44 interior pages</p><a href="${e.url}" target="_blank" rel="noopener noreferrer" data-paperback-purchase="${e.asin}" style="display:flex;align-items:center;min-height:44px;max-width:100%;padding:.25rem 0;color:#642082;font-size:1rem;font-weight:700;text-decoration:underline;text-underline-offset:.2em;line-height:1.5;overflow-wrap:anywhere">Paperback on Amazon.com<span aria-hidden="true"> ↗</span></a><p style="margin:.5rem 0 0">A separate Amazon edition. Pinnacle’s own softcover remains out of stock.</p>${compact?'':`<p style="margin:.5rem 0 0">Landscape illustrations are printed sideways in the 8.5 × 11-inch book; turn it to read. ISBN ${e.isbn}. The PDF ebook is a separate 46-page edition.</p>`}<p style="margin:.5rem 0 0">Check Amazon for current price, shipping/import charges and delivery to your address.</p></aside>`;
}
// The current-asset adapter and future Astro builds share the same edition data.
// Exact path/canonical checks keep all other pages and offers unchanged.
export function addPaperbackLinks(html,pathname){
 if(!hasPaperbackEdition(pathname))return html;
 const canonical=html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g)||[];
 if(canonical.length!==1||!canonical[0].includes('href="https://www.pinnacleblooms.org'+pathname+'"'))return html;
 if(pathname==='/books')return html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g,card=>{
  const e=paperbackEditions.find(e=>card.includes('href="'+e.path+'"'));
  if(!e||card.includes('data-paperback-panel="'+e.asin+'"'))return card;
  return card.replace(/<\/nav>(\s*<\/article>)$/,'</nav>'+paperbackPanel(e,true)+'$1');
 });
 const e=paperbackForPath(pathname);
 if(html.includes('data-paperback-panel="'+e.asin+'"'))return html;
 return html.replace('<div class="pbn-book-actions">',paperbackPanel(e)+'<div class="pbn-book-actions">');
}
