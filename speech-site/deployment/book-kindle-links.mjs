// Public storefront identity verified 5 October 2026. These are Kindle editions,
// not replacements for the PDF/print catalogue or its identifiers and prices.
export const KINDLE_LINK_RELEASE='kindle-links-20261005';
export const kindleEditions=[
 {sku:'PBN-OT-101-EN-PDF',path:'/books/occupational-therapy-101-i-belong-in-everyday-life',asin:'B0HLYKFDQ9',url:'https://www.amazon.in/dp/B0HLYKFDQ9'},
 {sku:'PBN-SE-101-EN-PDF',path:'/books/special-education-101-learning-through-everyday-play',asin:'B0HLYFTT36',url:'https://www.amazon.in/dp/B0HLYFTT36'}
];
export const kindleForSku=sku=>kindleEditions.find(x=>x.sku===sku);
export const hasKindleEdition=pathname=>pathname==='/books'||kindleEditions.some(x=>x.path===pathname);
export const kindleLinkStyle='min-height:44px;display:flex;align-items:center';
export const kindleDetail='English Kindle edition, read in Kindle. The Pinnacle bag option provides a downloadable PDF.';
const link=(e,attrs='')=>`<a href="${e.url}" target="_blank" rel="noopener noreferrer" data-kindle-purchase="${e.asin}" style="${kindleLinkStyle}"${attrs}>Buy on Amazon Kindle<span aria-hidden="true"${attrs}> ↗</span></a>`;
// Keep the existing static asset and every unrelated byte. The Astro templates
// below already emit these links on future full builds; this adapter is idempotent.
export function addKindleLinks(html,pathname){
 if(!hasKindleEdition(pathname))return html;
 const canonical=html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g)||[];
 if(canonical.length!==1||!canonical[0].includes('href="https://www.pinnacleblooms.org'+pathname+'"'))return html;
 if(pathname==='/books')return html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g,card=>{
  const entry=kindleEditions.find(x=>card.includes('href="'+x.path+'"'));
  if(!entry||card.includes('data-kindle-purchase='))return card;
  return card.replace(/<\/nav>(\s*<\/article>)$/,link(entry)+'</nav>$1');
 });
 const entry=kindleEditions.find(x=>x.path===pathname);
 return html.replace(/<aside\b(?=[^>]*class="pbn-play-purchase")[^>]*>[\s\S]*?<\/aside>/g,block=>{
  if(block.includes('data-kindle-purchase='))return block;
  const scope=block.match(/\bdata-astro-cid-[a-z0-9-]+(?:="")?/i)?.[0];
  const attrs=scope?' '+scope:'';
  return block.replace('</aside>',`<p data-kindle-detail${attrs}>${link(entry,attrs)}<br${attrs}><span${attrs}>${kindleDetail}</span></p></aside>`);
 });
}
