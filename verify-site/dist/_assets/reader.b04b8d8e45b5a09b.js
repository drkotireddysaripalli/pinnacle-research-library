'use strict';
(()=>{
 const mobileMenu=document.querySelector('.mobile-navigation');
 mobileMenu?.addEventListener('click',event=>{if(event.target.closest('a'))mobileMenu.open=false;});
 mobileMenu?.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileMenu.open){mobileMenu.open=false;mobileMenu.querySelector('summary')?.focus();}});
 const groups=[...document.querySelectorAll('.reading-group')],links=[...document.querySelectorAll('.reading-jump-bar a')];
 const chapters=[...document.querySelectorAll('.reader-chapter')];
 const open=document.getElementById('reader-open'),close=document.getElementById('reader-close'),all=document.getElementById('reader-all');
 if(!chapters.length)return;
 let current=groups[0],readAll=false,scrollFrame;
 const showGroups=()=>{
  groups.forEach(group=>group.hidden=!readAll&&group!==current);
  links.forEach(link=>{if(link.hash==='#'+current?.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  if(all){all.setAttribute('aria-pressed',String(readAll));all.textContent=readAll?'Show selected section':'Read all sections';}
 };
 const scrollTo=node=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{if(node?.getClientRects().length)node.scrollIntoView({block:'start',behavior:'instant'});});};
 const hashNode=()=>{try{return document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return null;}};
 // Other components prepare filtered records and panels; this is the only scroll owner.
 const reveal=()=>{
  window.dispatchEvent(new Event('pinnacle:reveal'));
  const node=hashNode();if(!node)return;
  const group=node.closest('.reading-group');
  if(group){current=group;if(node===group)readAll=false;showGroups();}
  for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
  scrollTo(node);
 };
 const navigate=hash=>{if(location.hash!==hash)history.pushState(null,'',hash);reveal();};
 [open,close,all].forEach(button=>{if(button)button.hidden=false;});
 all?.addEventListener('click',()=>{readAll=!readAll;showGroups();scrollTo(current);});
 open?.addEventListener('click',()=>{readAll=true;showGroups();chapters.forEach(chapter=>chapter.open=true);scrollTo(current);});
 close?.addEventListener('click',()=>{chapters.forEach(chapter=>chapter.open=false);readAll=false;showGroups();scrollTo(document.getElementById('reader-guide'));});
 document.getElementById('reader-jump')?.addEventListener('change',event=>{if(event.target.value){navigate('#'+event.target.value);event.target.value='';}});
 window.addEventListener('hashchange',reveal);
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const a=event.target.closest('a[href]');if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
  let node;try{node=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{return;}if(!node)return;
  event.preventDefault();navigate(url.hash);
 });
 // A two-column card grows to the reading width. Keep its clicked heading in view.
 chapters.forEach(chapter=>chapter.querySelector(':scope>summary')?.addEventListener('click',event=>{if(!event.defaultPrevented)scrollTo(chapter);}));
 showGroups();if(location.hash)reveal();
 let printState=[],groupState=[];
 window.addEventListener('beforeprint',()=>{groupState=groups.map(n=>[n,n.hidden]);groups.forEach(n=>n.hidden=false);printState=[...document.querySelectorAll('details')].map(n=>[n,n.open]);printState.forEach(([n])=>n.open=true);});
 window.addEventListener('afterprint',()=>{printState.forEach(([n,value])=>n.open=value);groupState.forEach(([n,value])=>n.hidden=value);});
})();
