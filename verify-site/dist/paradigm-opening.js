(function(){'use strict';
function initialise(root){
  if(root.dataset.poReady)return;
  var track=root.querySelector('[data-po-track]');
  var slides=Array.from(root.querySelectorAll('[data-po-slide]'));
  var controls=root.querySelector('[data-po-controls]');
  var previous=root.querySelector('[data-po-previous]');
  var next=root.querySelector('[data-po-next]');
  var position=root.querySelector('[data-po-position]');
  var jumps=Array.from(root.querySelectorAll('[data-po-jump]'));
  if(!track||!slides.length||!controls||!previous||!next||!position)return;
  root.dataset.poReady='true';controls.hidden=false;
  var current=0,frame=0;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update(index){
    current=index;previous.disabled=index===0;next.disabled=index===slides.length-1;
    var label=slides[index].getAttribute('aria-label').split(': ').slice(1).join(': ');
    var text=(index+1)+' / '+slides.length+' · '+label;
    if(position.textContent!==text)position.textContent=text;
    jumps.forEach(function(jump,i){if(i===index)jump.setAttribute('aria-current','step');else jump.removeAttribute('aria-current');});
  }
  function go(index,instant){
    index=Math.max(0,Math.min(slides.length-1,index));
    var target=slides[index].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
    track.scrollTo({left:target,behavior:instant||reduced?'auto':'smooth'});update(index);
  }
  function closest(){
    frame=0;var left=track.getBoundingClientRect().left,best=0,distance=Infinity;
    slides.forEach(function(slide,index){var delta=Math.abs(slide.getBoundingClientRect().left-left);if(delta<distance){distance=delta;best=index;}});update(best);
  }
  function jumpToHash(){
    var hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch(error){return;}
    var index=slides.findIndex(function(slide){return slide.id===hash;});if(index>=0)go(index,true);
  }
  previous.addEventListener('click',function(){go(current-1,false);});
  next.addEventListener('click',function(){go(current+1,false);});
  jumps.forEach(function(jump,index){jump.addEventListener('click',function(event){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();go(index,false);try{history.replaceState(history.state,'','#'+slides[index].id);}catch(error){}
  });});
  track.addEventListener('scroll',function(){if(!frame)frame=requestAnimationFrame(closest);},{passive:true});
  track.addEventListener('keydown',function(event){
    if(event.target!==track)return;
    var index=current;if(event.key==='ArrowRight')index++;else if(event.key==='ArrowLeft')index--;else if(event.key==='Home')index=0;else if(event.key==='End')index=slides.length-1;else return;
    event.preventDefault();go(index,false);
  });
  window.addEventListener('hashchange',jumpToHash);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(function(){go(current,true);}).observe(track);
  update(0);requestAnimationFrame(jumpToHash);
}
function start(){document.querySelectorAll('[data-paradigm-opening]').forEach(initialise);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();