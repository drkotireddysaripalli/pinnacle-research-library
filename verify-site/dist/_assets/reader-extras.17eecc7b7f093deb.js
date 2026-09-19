'use strict';
(() => {
 const banner=document.querySelector('.analytics-choice');
 const status=document.querySelector('.analytics-choice-status');
 const settings=[...document.querySelectorAll('[data-analytics-settings]')];
 const measurement=document.querySelector('meta[name="pinnacle-analytics-id"]')?.content;
 const key='pinnacle-verify-analytics-choice-v1',expiry=180*24*60*60*1000;
 const production=location.hostname==='www.pinnacleblooms.org'&&location.pathname.startsWith('/verify/');
 const blocked=navigator.globalPrivacyControl===true;
 let choice=null,loaded=false,enabled=false;
 try {const saved=JSON.parse(localStorage.getItem(key));if(saved&&Date.now()-saved.at<expiry&&['accepted','declined'].includes(saved.value))choice=saved.value;}catch{}
 const tell=text=>{if(status)status.textContent=text;};
 const canonical=()=>{
  const url=new URL(document.querySelector('link[rel="canonical"]')?.href||location.href);
  url.search='';url.hash='';return url.href;
 };
 const pageKind=()=>location.pathname.includes('/records/')?'evidence':location.pathname.includes('/publications/')?'publication':location.pathname.endsWith('/verify/')?'home':'library';
 const send=(name,parameters={})=>{if(!enabled||blocked)return;window.gtag('event',name,{...parameters,page_location:canonical(),page_title:'Pinnacle Verify',page_referrer:'',send_to:measurement});};
 const clearCookies=()=>{
  for(const cookie of document.cookie.split(';')){
   const name=cookie.trim().split('=')[0];if(!name.startsWith('pv_ga'))continue;
   for(const domain of ['',location.hostname,'.pinnacleblooms.org'])document.cookie=name+'=; Max-Age=0; path=/verify/;'+(domain?' domain='+domain+';':'')+' SameSite=Lax; Secure';
  }
 };
 const start=()=>{
  if(!production||blocked||!/^G-[A-Z0-9]+$/.test(measurement||''))return;
  enabled=true;window['ga-disable-'+measurement]=false;
  window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  if(loaded){window.gtag('consent','update',{analytics_storage:'granted'});return;}
  loaded=true;
  window.gtag('js',new Date());
  window.gtag('config',measurement,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:'pv',cookie_path:'/verify/',cookie_domain:'www.pinnacleblooms.org',cookie_flags:'SameSite=Lax;Secure',page_location:canonical(),page_title:'Pinnacle Verify',page_referrer:''});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurement;document.head.append(script);
  send('page_view',{content_group:pageKind()});
 };
 const choose=value=>{
  choice=value;try{localStorage.setItem(key,JSON.stringify({value,at:Date.now()}));}catch{}
  banner.hidden=true;
  if(value==='accepted'&&!blocked){start();tell('Analytics allowed. You can change this in Analytics choices.');}
  else {enabled=false;window['ga-disable-'+measurement]=true;if(loaded)window.gtag('consent','update',{analytics_storage:'denied'});clearCookies();tell(blocked?'Analytics stays off because Global Privacy Control is enabled.':'Analytics is off.');}
 };
 if(banner&&measurement){
  settings.forEach(button=>{button.hidden=false;button.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button')?.focus();});});
  document.querySelectorAll('[data-analytics-choice]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.analyticsChoice)));
  if(blocked){enabled=false;clearCookies();banner.hidden=true;document.querySelector('[data-analytics-choice="accepted"]').disabled=true;}
  else if(choice==='accepted')start();else if(choice!=='declined')banner.hidden=false;
 }
 const publicId=value=>/^[a-z0-9][a-z0-9-]{0,90}$/.test(value||'')?value:undefined;
 document.addEventListener('click',event=>{
  const target=event.target.closest('a,button');if(!target)return;
  if(target.matches('[data-copy-citation]')){send('verify_citation_copy',{reference_id:publicId(target.dataset.copyCitation.replace(/^citation-/,''))});return;}
  const channel=target.matches('.share-wa')?'whatsapp':target.matches('.share-x')?'x':target.matches('.copy-share')?'copy':target.matches('.device-share')?'native':null;
  if(channel){send('verify_share',{channel});return;}
  if(target.tagName!=='A')return;
  const href=target.getAttribute('href')||'';
  if(href.startsWith('mailto:')||href.startsWith('tel:')){send('verify_contact',{channel:href.startsWith('mailto:')?'email':'phone'});return;}
  let url;try{url=new URL(href,location.href);}catch{return;}
  if(url.hostname!==location.hostname)return;
  const record=url.pathname.match(/\/evidence\/records\/([a-z0-9-]+)\.html$/);
  if(record)send('verify_evidence_open',{reference_id:record[1]});
   const download=url.pathname.match(/\/([^/]+)\.(pdf|bib|ris|txt|csv|jpg)$/);
  if(download)send('verify_download',{format:download[2],reference_id:publicId(download[1])});
 });
 document.querySelectorAll('.reader-chapter').forEach(chapter=>chapter.addEventListener('toggle',()=>{if(chapter.open)send('verify_topic_open',{topic_id:publicId(chapter.id)});}));
 // Translation always starts from the public English source. Google may rewrite
 // links and form actions in its proxy; the encoded data attribute is inert.
 // Keep the pure URL functions independent of document state for regression tests.
 function cleanVerifyURL(value){
  let url;try{url=new URL(value);}catch{return null;}
  for(let depth=0;depth<4&&url.hostname==='translate.google.com'&&url.searchParams.has('u');depth++){
   try{url=new URL(url.searchParams.get('u'));}catch{return null;}
  }
  if(url.hostname==='www-pinnacleblooms-org.translate.goog'||url.hostname==='pinnacleblooms-org.translate.goog')url=new URL('https://www.pinnacleblooms.org'+url.pathname);
  if(!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(url.hostname)||!/^\/verify(?:\/|$)/.test(url.pathname))return null;
  url.protocol='https:';url.hostname='www.pinnacleblooms.org';url.port='';url.username='';url.password='';url.search='';url.hash='';
  if(url.pathname==='/verify')url.pathname='/verify/';
  url.pathname=url.pathname.replace(/^\/verify\/guides\/(?:te|hi)\//,'/verify/guides/');
  return url.href;
 }
 function languageDestination(source,language){
  const original=cleanVerifyURL(source);if(!original||!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(language||''))return null;
  if(language==='en')return original;
  const url=new URL(original),guide=url.pathname.match(/^\/verify\/guides\/(abilityscore|everyday-practice|licences-and-scope)\.html$/);
  if(guide&&['te','hi'].includes(language))return url.origin+'/verify/guides/'+language+'/'+guide[1]+'.html';
  const translated=new URL('https://translate.google.com/translate');
  translated.searchParams.set('sl','auto');translated.searchParams.set('tl',language);translated.searchParams.set('u',original);
  return translated.href;
 }
 function languageNavigationURL(source,language,currentURL){
  const destination=languageDestination(source,language);if(!destination)return null;
  const current=new URL(currentURL),next=new URL(destination);
  if(!['www-pinnacleblooms-org.translate.goog','pinnacleblooms-org.translate.goog'].includes(current.hostname)||next.hostname!=='translate.google.com')return destination;
  // An existing translated page must change the proxy's target language itself.
  // Re-entering translate.google.com here can retain the current wrapper language.
  const canonical=new URL(cleanVerifyURL(source));
  const proxy=new URL('https://www-pinnacleblooms-org.translate.goog'+canonical.pathname);
  proxy.searchParams.set('_x_tr_sl','auto');proxy.searchParams.set('_x_tr_tl',language);
  const interfaceLanguage=current.searchParams.get('_x_tr_hl');
  proxy.searchParams.set('_x_tr_hl',/^[a-z]{2}(?:-[A-Za-z]{2})?$/.test(interfaceLanguage||'')?interfaceLanguage:'en');
  return proxy.href;
 }
 function originalShareURL(value,channel){
  let url;try{url=new URL(value);}catch{return null;}
  if(url.hostname!=='translate.google.com')return null;
  for(let depth=0;depth<4&&url.hostname==='translate.google.com'&&['/website','/translate'].includes(url.pathname);depth++){
   const original=url.searchParams.get('u');if(!original)return null;
   try{url=new URL(original);}catch{return null;}
  }
  if(url.protocol!=='https:'||url.username||url.password||url.port)return null;
  const permitted=channel==='whatsapp'?['wa.me','api.whatsapp.com']:channel==='x'?['twitter.com','x.com']:[];
  if(!permitted.includes(url.hostname))return null;
  if(channel==='whatsapp'&&!['/','/send'].includes(url.pathname))return null;
  if(channel==='x'&&url.pathname!=='/intent/tweet')return null;
  return url.href;
 }
 // Google can replace translated controls after the script runs. Never retain
 // a form, select, status node or size button across a user action.
 const announce=text=>{const status=document.querySelector('[data-reader-status]');if(status)status.textContent=text;};
 const liveLanguageForm=from=>from?.matches?.('[data-translate-form]')?from:from?.closest?.('.reader-language-bar')?.querySelector('[data-translate-form]')||document.querySelector('[data-translate-form]');
 const originalSource=from=>{
  const form=liveLanguageForm(from);
  let encoded;try{encoded=decodeURIComponent(form?.dataset.originalUrl||'');}catch{}
  return cleanVerifyURL(encoded)||cleanVerifyURL(document.querySelector('link[rel="canonical"]')?.href)||cleanVerifyURL(location.href);
 };
 const navigateLanguage=destination=>{
  if(!destination)return;
  // Location navigation avoids window.open hooks in translated website views.
  // A user gesture may navigate an ancestor; if that is denied, use this frame.
  if(window.top===window){location.assign(destination);return;}
  try{window.top.location.href=destination;}catch{location.assign(destination);}
 };
 const preparedSelects=new WeakSet();
 let chosenLanguage=null;
 const initialiseLanguageSelect=from=>{
  const form=liveLanguageForm(from),select=form?.querySelector('select');
  if(!select||preparedSelects.has(select))return;
  const current=new URL(location.href),translated=current.searchParams.get('_x_tr_tl')||current.searchParams.get('tl');
  const language=chosenLanguage||translated||form.dataset.nativeLanguage||'en';
  if([...select.options].some(option=>option.value===language))select.value=language;
  preparedSelects.add(select);
 };
 const submitLanguage=form=>{
  const language=form.querySelector('select')?.value,destination=languageNavigationURL(originalSource(form),language,location.href);
  if(!destination){announce('This page cannot be translated. Please open the English original.');return;}
  send('verify_language',{language});navigateLanguage(destination);
 };
 document.addEventListener('submit',event=>{
  const form=event.target?.closest?.('[data-translate-form]');if(!form)return;
  event.preventDefault();submitLanguage(form);
 },true);
 document.addEventListener('change',event=>{
  const select=event.target;if(!select?.matches?.('[data-translate-form] select'))return;
  chosenLanguage=select.value;preparedSelects.add(select);
 },true);
 document.addEventListener('click',event=>{
  const target=event.target?.closest?.('a,button');if(!target)return;
  if(target.matches('[data-reader-size]')){
   event.preventDefault();const value=target.dataset.readerSize;applyReadingSize(value);
   try{localStorage.setItem(sizeKey,readingSize);}catch{}
   announce(readingSize==='1'?'Standard text size selected.':readingSize==='1.12'?'Larger text size selected.':'Largest text size selected.');return;
  }
  // Google may strip form input attributes and alter native submission. Handle
  // its current Read button directly; prevent default avoids a second submit.
  const form=target.closest('[data-translate-form]');
  if(form&&target.tagName==='BUTTON'){event.preventDefault();submitLanguage(form);return;}
  if(target.tagName!=='A')return;
  if(target.matches('.share-wa,.share-x')){
   const channel=target.matches('.share-wa')?'whatsapp':'x',destination=originalShareURL(target.href,channel);
   if(destination){event.preventDefault();window.open(destination,'_blank','noopener,noreferrer');}
   return;
  }
  if(target.matches('[data-read-original]')){event.preventDefault();navigateLanguage(originalSource(target));return;}
  const nativeLanguage=target.dataset.nativeLanguageLink||(target.closest('.guide-lang-nav')?target.hreflang?.split('-')[0]:null);
  if(nativeLanguage){const destination=languageNavigationURL(originalSource(target),nativeLanguage,location.href);if(destination){event.preventDefault();send('verify_language',{language:nativeLanguage});navigateLanguage(destination);}return;}
  if(target.matches('[data-more-languages]')){event.preventDefault();navigateLanguage(languageNavigationURL(originalSource(target),'te',location.href));}
 },true);
 // Reader preference stays in this browser and is not sent to analytics.
 const sizeKey='pinnacle-reader-size-v1',sizes=['1','1.12','1.25'];
 let readingSize='1';
 const applyReadingSize=value=>{
  readingSize=sizes.includes(value)?value:'1';document.documentElement.style.setProperty('--reader-scale',readingSize);
  document.querySelectorAll('[data-reader-size]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.readerSize===readingSize)));
 };
 try{applyReadingSize(localStorage.getItem(sizeKey));}catch{applyReadingSize('1');}
 const refreshControls=from=>{initialiseLanguageSelect(from);applyReadingSize(readingSize);};
 // Action-time initialisation survives replaced nodes without observing the
 // long translated document or running timers while the reader is idle.
 for(const eventName of ['pointerdown','focusin'])document.addEventListener(eventName,event=>{
  if(event.target?.closest?.('.reader-language-bar'))refreshControls(event.target);
 },true);
 document.addEventListener('toggle',event=>{if(event.target?.matches?.('.language-menu'))refreshControls(event.target);},true);
 document.addEventListener('DOMContentLoaded',()=>refreshControls(),{once:true});
 refreshControls();

})();
