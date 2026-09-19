'use strict';
(()=>{
 const mobileMenu=document.querySelector('.mobile-navigation');
 mobileMenu?.addEventListener('click',event=>{if(event.target.closest('a'))mobileMenu.open=false;});
 mobileMenu?.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileMenu.open){mobileMenu.open=false;mobileMenu.querySelector('summary')?.focus();}});
 const readingGroups=[...document.querySelectorAll('.reading-group')],sectionLinks=[...document.querySelectorAll('.reading-jump-bar a')];
 if(readingGroups.length){
  let scheduled=false;
  const markSection=()=>{scheduled=false;let current='';for(const group of readingGroups)if(group.getBoundingClientRect().top<Math.max(120,innerHeight*.3))current=group.id;for(const link of sectionLinks){if(link.hash==='#'+current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}};
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(markSection);}},{passive:true});
  window.addEventListener('resize',markSection);markSection();
 }
 const chapters=[...document.querySelectorAll('.reader-chapter')];
 const open=document.getElementById('reader-open'),close=document.getElementById('reader-close');
 if(!chapters.length)return;
 [open,close].forEach(b=>{if(b)b.hidden=false;});
 open?.addEventListener('click',()=>chapters.forEach(c=>c.open=true));
 close?.addEventListener('click',()=>{chapters.forEach(c=>c.open=false);document.getElementById('reader-guide')?.scrollIntoView({block:'start'});});
 const reveal=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const node=document.getElementById(id);if(!node)return;for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;requestAnimationFrame(()=>node.scrollIntoView({block:'start'}));};
 document.getElementById('reader-jump')?.addEventListener('change',event=>{if(event.target.value){location.hash=event.target.value;reveal();event.target.value='';}});
 window.addEventListener('hashchange',reveal);
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(a&&a.hash===location.hash)reveal();});
 if(location.hash)reveal();
 let printState=[];
 window.addEventListener('beforeprint',()=>{printState=[...document.querySelectorAll('details')].map(n=>[n,n.open]);printState.forEach(([n])=>n.open=true);});
 window.addEventListener('afterprint',()=>printState.forEach(([n,value])=>n.open=value));
})();
