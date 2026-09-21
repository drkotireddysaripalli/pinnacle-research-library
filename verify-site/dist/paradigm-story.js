'use strict';
(()=>{
 document.querySelectorAll('[data-paradigm-story]').forEach(section=>{
  if(section.dataset.storyReady==='true')return;
  const track=section.querySelector('[data-story-track]');
  const cards=[...section.querySelectorAll('[data-story-card]')];
  const previous=section.querySelector('[data-story-prev]'),next=section.querySelector('[data-story-next]');
  const position=section.querySelector('[data-story-position]'),progress=section.querySelector('[data-story-progress]');
  const status=section.querySelector('[data-story-status]'),modeButtons=[...section.querySelectorAll('[data-story-view]')];
  const navigation=section.querySelector('.ps-navigation'),hint=section.querySelector('[data-story-hint]');
  const transcripts=[...section.querySelectorAll('[data-story-transcript]')];
  if(!track||!cards.length||!previous||!next)return;
  section.dataset.storyReady='true';
  section.querySelectorAll('[data-story-enhancement]').forEach(node=>node.hidden=false);
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let mode='story',first=0,last=0,frame=0,settleTimer=0,pendingAnnouncement=false;
  let savedDetails=[],savedFirst=0,printState=null;
  const announce=message=>{if(status)status.textContent=message;};
  const visiblePosition=()=>{
   const viewport=track.getBoundingClientRect();
   const visible=cards.map((card,index)=>({index,rect:card.getBoundingClientRect()})).filter(({rect})=>Math.min(rect.right,viewport.right)-Math.max(rect.left,viewport.left)>=Math.min(rect.width*.55,viewport.width*.55));
   if(visible.length){first=visible[0].index;last=visible.at(-1).index;}
   else{let closest=0,distance=Infinity;cards.forEach((card,index)=>{const delta=Math.abs(card.getBoundingClientRect().left-viewport.left);if(delta<distance){closest=index;distance=delta;}});first=last=closest;}
  };
  const label=()=>first===last?'Story '+(first+1)+' of '+cards.length:'Stories '+(first+1)+'–'+(last+1)+' of '+cards.length;
  const update=()=>{
   if(mode!=='story')return;
   visiblePosition();
   if(position)position.textContent=label();
   if(progress){progress.max=cards.length;progress.value=last+1;}
   const limit=Math.max(0,track.scrollWidth-track.clientWidth);
   previous.disabled=track.scrollLeft<=2;
   next.disabled=track.scrollLeft>=limit-2;
  };
  const finish=()=>{
   clearTimeout(settleTimer);update();
   if(pendingAnnouncement){pendingAnnouncement=false;announce(label()+'.');}
  };
  const scheduleUpdate=()=>{
   if(!frame)frame=requestAnimationFrame(()=>{frame=0;update();});
   clearTimeout(settleTimer);settleTimer=setTimeout(finish,180);
  };
  const moveTo=(index,announceMove=true,instant=false)=>{
   if(mode!=='story')return;
   const target=cards[Math.max(0,Math.min(cards.length-1,index))];
   const inset=parseFloat(getComputedStyle(track).paddingLeft)||0;
   const left=target.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-inset;
   pendingAnnouncement=announceMove;
   track.scrollTo({left:Math.max(0,left),behavior:instant||reducedMotion.matches?'auto':'smooth'});
   clearTimeout(settleTimer);settleTimer=setTimeout(finish,200);
  };
  previous.addEventListener('click',()=>{update();moveTo(first-1);});
  next.addEventListener('click',()=>{update();moveTo(first+1);});
  // Keyboard commands belong to the navigation controls only. They never
  // intercept reading, a source link, a disclosure, or the rest of the page.
  navigation.addEventListener('keydown',event=>{
   if(!event.target.matches('[data-story-prev],[data-story-next]')||mode!=='story')return;
   let target;
   if(event.key==='ArrowLeft')target=first-1;
   else if(event.key==='ArrowRight')target=first+1;
   else if(event.key==='Home')target=0;
   else if(event.key==='End')target=cards.length-1;
   else return;
   event.preventDefault();moveTo(target);
  });
  const setMode=(nextMode,speak=true)=>{
   if(!['story','read'].includes(nextMode)||mode===nextMode)return;
   clearTimeout(settleTimer);pendingAnnouncement=false;
   if(nextMode==='read'){
    update();savedFirst=first;savedDetails=transcripts.map(node=>node.open);transcripts.forEach(node=>node.open=true);
   }else transcripts.forEach((node,index)=>node.open=!!savedDetails[index]);
   mode=nextMode;section.dataset.storyMode=mode;
   modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.storyView===mode)));
   navigation.hidden=mode==='read';if(hint)hint.hidden=mode==='read';
   if(mode==='story')requestAnimationFrame(()=>{moveTo(savedFirst,false,true);update();});
   if(speak)announce(mode==='read'?'Read all view. All '+cards.length+' story texts are open.':'Story view. Use the previous and next controls, or swipe through the stories.');
  };
  modeButtons.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.storyView)));
  track.addEventListener('scroll',scheduleUpdate,{passive:true});
  track.addEventListener('scrollend',finish);
  // A swipe changes the visual position, without announcing each scroll event.
  track.addEventListener('pointerdown',()=>pendingAnnouncement=false,{passive:true});
  track.addEventListener('wheel',()=>pendingAnnouncement=false,{passive:true});
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(scheduleUpdate).observe(track);
  else window.addEventListener('resize',scheduleUpdate,{passive:true});
  const reveal=()=>{
   let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=document.getElementById(id),card=target?.closest('[data-story-card]');
   const index=cards.indexOf(card);if(index<0)return;
   for(let node=target;node&&node!==card;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
   if(mode==='story')requestAnimationFrame(()=>moveTo(index,false,true));
  };
  window.addEventListener('hashchange',reveal);window.addEventListener('pinnacle:reveal',reveal);
  window.addEventListener('beforeprint',()=>{
   printState={mode,details:transcripts.map(node=>node.open)};
   if(mode!=='read')setMode('read',false);transcripts.forEach(node=>node.open=true);
  });
  window.addEventListener('afterprint',()=>{
   if(!printState)return;const saved=printState;printState=null;
   if(saved.mode!==mode)setMode(saved.mode,false);transcripts.forEach((node,index)=>node.open=saved.details[index]);
  });
  requestAnimationFrame(()=>{update();reveal();});
 });
})();
