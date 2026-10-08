// Preserve the server-rendered link graph. Native details defer offscreen layout
// without a JavaScript dependency or approximate height placeholders.
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
export function fontFaceKey(css){
 const blocks=css.match(/@font-face\s*\{[^{}]*\}/gi);
 if(!blocks?.length||css.replace(/@font-face\s*\{[^{}]*\}/gi,'').trim())return null;
 return blocks.map(x=>x.replace(/\s+/g,' ').trim()).sort().join('\n');
}
export class RepeatedFontFaces{
 constructor(){this.seen=new Set();}
 element(e){this.buffer='';this.streaming=false;this.open='<style'+[...e.attributes].map(([k,v])=>' '+k+'="'+escape(v)+'"').join('')+'>';e.removeAndKeepContent();}
 text(c){
  if(this.streaming){if(c.lastInTextNode)c.after('</style>',{html:true});return;}
  this.buffer+=c.text;
  if(this.buffer.length>32768){c.replace(this.open+this.buffer+(c.lastInTextNode?'</style>':''),{html:true});this.streaming=!c.lastInTextNode;this.buffer='';return;}
  if(!c.lastInTextNode){c.remove();return;}
  const key=fontFaceKey(this.buffer);
  if(key&&this.seen.has(key))c.remove();
  else{if(key)this.seen.add(key);c.replace(this.open+this.buffer+'</style>',{html:true});}
  this.buffer='';
 }
}
export const directoryStyles=`.sunshine-all-sections{display:block!important;width:100%;border-top:2px solid #169d91;padding:24px 0}.pinnacle-directory-heading{font-size:24px!important;color:#142348!important;margin:0 0 8px}.pinnacle-directory-intro{font-size:16px;color:#34465a;margin:0 0 18px}.pinnacle-topic-directory{display:block!important;width:100%;border:1px solid #dce8ed;border-radius:12px;margin:10px 0;background:#fff;overflow:hidden}.pinnacle-topic-directory>summary{display:list-item!important;cursor:pointer;font-size:18px!important;font-weight:700!important;line-height:1.5!important;color:#142348!important;padding:16px 18px;margin:0!important;list-style-position:inside}.pinnacle-topic-directory>summary:focus-visible{outline:3px solid #9e258f;outline-offset:-4px}.pinnacle-topic-directory[open]>summary{background:#eff9f7}.pinnacle-topic-directory .content-sunshine{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:8px;padding:18px!important;margin:0!important;width:auto!important;float:none!important}.pinnacle-topic-directory .content-sunshine a{display:block!important;color:#633078!important;font-size:16px!important;line-height:1.5!important;padding:8px;border-radius:6px;overflow-wrap:anywhere}.pinnacle-topic-directory .content-sunshine a:hover{background:#f6f0fa}.pinnacle-topic-directory .content-sunshine :is(h3,h4){grid-column:1/-1;margin:8px 0;font-size:18px}.pinnacle-topic-directory .content-sunshine a:focus-visible{outline:2px solid #9e258f}`;
export function addReadingDirectory(rewrite){
 rewrite.on('style:not([src])',new RepeatedFontFaces());
 rewrite.on('head',{element(e){e.append('<style data-pinnacle-topic-directory>'+directoryStyles+'</style>',{html:true});}});
 rewrite.on('.sunshine-all-sections',{element(e){e.setAttribute('data-pinnacle-topic-directory','20261008');e.prepend('<h2 class="pinnacle-directory-heading">Explore the Pinnacle knowledge library</h2><p class="pinnacle-directory-intro">Choose a topic to see its guides. Each guide remains available at its existing address.</p>',{html:true});}});
 rewrite.on('.sunshine-all-sections > .sunshine-block',{element(e){e.tagName='details';e.setAttribute('class','pinnacle-topic-directory');e.removeAttribute('style');}});
 rewrite.on('.sunshine-all-sections .cm-section-main, .sunshine-all-sections .expandable-section',{element(e){e.removeAndKeepContent();}});
 rewrite.on('.sunshine-all-sections h2.pinnacle-title',{element(e){e.tagName='summary';e.removeAttribute('class');e.removeAttribute('style');e.removeAttribute('onclick');e.removeAttribute('role');e.removeAttribute('tabindex');}});
 rewrite.on('.sunshine-all-sections .content-sunshine div',{element(e){e.removeAndKeepContent();}});
 return rewrite;
}
