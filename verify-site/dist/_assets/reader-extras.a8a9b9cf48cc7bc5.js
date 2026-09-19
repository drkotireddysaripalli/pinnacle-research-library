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
 document.querySelector('[data-translate-form]')?.addEventListener('submit',event=>{const language=event.target.querySelector('select')?.value;if(/^[a-z]{2}(?:-[A-Z]{2})?$/.test(language||''))send('verify_language',{language});});
 const languageMenu=document.querySelector('.language-menu');
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&languageMenu?.open){languageMenu.open=false;languageMenu.querySelector('summary').focus();}});
 document.addEventListener('click',event=>{if(languageMenu?.open&&!languageMenu.contains(event.target))languageMenu.open=false;});
})();
