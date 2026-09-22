'use strict';
const fs=require('node:fs'),path=require('node:path');
const {tree,plain}=require('./semantic-content.cjs');
const copy=require('../content/share-copy.json');
const metrics=require('../content/metrics.json').metrics;
const hfr=require('../content/hfr-register.json').rows;
const hfrReview=require('./hfr-review-summary.cjs');
const social=require('./social-content.cjs');
const PUBLIC='https://www.pinnacleblooms.org/verify';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ascii=s=>s.normalize('NFC').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7e\u00ae]/g,' ').replace(/\s+/g,' ').trim();
const snippet=s=>{const text=ascii(s),short=text.length>115?text.slice(0,115).replace(/\s+\S*$/,''):text;return short.replace(/[.!?]+$/,'');};
const attr=(n,k)=>n.open.match(new RegExp('\\b'+k+'="([^"]*)"'))?.[1];
module.exports=function addSharing(html,page,records){
 const nodes=tree(html),edits=[],rows=[];
 const managedSections=nodes.filter(n=>n.tag==='section'&&attr(n,'data-share-managed')==='true');
 const withinManagedSection=(position,includeStart=false)=>managedSections.some(n=>(includeStart?position>=n.start:position>n.start)&&position<n.close);
 const guideLanguage=page.url.includes('/guides/')?(html.match(/<html lang="(te|hi)-IN"/)?.[1]||'en'):null;
 const guideCopy={en:{intro:'A source-linked parent guide: ',tail:' Read the guide and its evidence.',share:'Share',more:'More',copy:'Copy link',image:'Share image'},te:{intro:'తల్లిదండ్రుల కోసం: ',tail:' గైడ్‌తో పాటు ఆధారాలూ చదవండి.',share:'షేర్ చేయండి',more:'మరిన్ని',copy:'లింక్ కాపీ',image:'షేర్ చిత్రం'},hi:{intro:'माता-पिता के लिए: ',tail:' गाइड और उसके स्रोत पढ़ें।',share:'शेयर करें',more:'और विकल्प',copy:'लिंक कॉपी करें',image:'शेयर तस्वीर'}};
 const shareLabels=guideCopy[guideLanguage]||guideCopy.en;
 const weighted=s=>Array.from(s).reduce((sum,c)=>sum+(c.codePointAt(0)>0x10ff?2:1),0);
 const publicUrl=url=>url.replace('https://pinnacle-verify.saripalli.chatgpt.site',PUBLIC);
 const recordById=new Map(records.map(r=>[r.id,r]));
 const sections=[{id:'page',name:plain(html.match(/<title>(.*?)<\/title>/)[1]),url:page.url,kind:'page'},...page.sections];
 for(const b of sections){
  const node=b.kind==='page'?null:nodes.find(n=>attr(n,'id')===b.id);
  if(b.kind!=='page'&&!node?.end)continue;
  // Components with their own share controls own both their section and descendants.
  if(node&&withinManagedSection(node.start,true))continue;
  if(node?.tag==='details'&&/(?:^|\s)hfr-source-details(?:\s|$)/.test(attr(node,'class')||''))continue;
  // The connected story is shared as one sourced explanation, not as repeated UI labels.
  if(b.kind!=='page'&&b.id!=='pinnacle-paradigm-shift'&&node&&nodes.some(n=>attr(n,'id')==='pinnacle-paradigm-shift'&&n.start<node.start&&n.end>node.end))continue;
  if(node?.tag==='section'&&nodes.some(n=>n.tag==='h1'&&n.start>node.start&&n.end<node.end))continue;
  const record=recordById.get(b.id)||records.find(r=>page.url.endsWith('/records/'+r.id+'.html')&&(b.kind==='article'||b.kind==='page'));
  const metric=metrics.find(m=>m.id===b.id);
  const centre=hfr.find(r=>b.id==='hfr-'+r.id)||(node&&/centre-card/.test(attr(node,'class')||'')?hfr.find(r=>html.slice(node.openEnd,node.end).includes(r.id)):null);
  const target=social.shareTarget(page.url,b.id);
  let url=publicUrl(record?record.url:centre?'https://pinnacle-verify.saripalli.chatgpt.site/evidence/hfr-register.html#hfr-'+centre.id:target||b.url);
  const card=social.cardFor(url),image=PUBLIC+card.image;
  let short=copy[record?.id||b.id]||`Explore Pinnacle's evidence on ${snippet(b.name)}. Read the source, review date and scope before drawing conclusions.`;
  if(centre)short=`${snippet(centre.name)}: HFR ${centre.id}. ${hfrReview.statusFor(centre.id)==='Approved'?'Approved status verified in the reviewed NHPR account.':'HFR ID recorded; dated account details available.'} Checked 19 Sep 2026. Explore the source.`;
  if(b.kind==='page'&&!record)short=page.url.endsWith('/')?copy.page:`Explore ${snippet(b.name.split(' | ')[0])}. Read the source records, review dates and evidence scope.`;
  short=ascii(short);if(short.length+24>280)short=`Explore Pinnacle's evidence on ${snippet(b.name)}. Read the source and scope.`;
  if(guideLanguage){let subject=plain(b.name.split(' | ')[0]);while(weighted(shareLabels.intro+subject+shareLabels.tail)+24>270)subject=subject.slice(0,-1);short=shareLabels.intro+subject.trim()+shareLabels.tail;}
  if(short.length+24>280)throw Error('Share draft too long: '+b.id);
  let full=short;
  if(record)full+='\n\nReview: '+record.statusLabel+'.\n'+record.reviewStatusNote+'\nScope: '+record.limits;
  if(metric)full+='\n\n'+metric.basis+'\n'+metric.boundary;
  if(centre)full+='\nSource level: '+centre.sourceLevel+'. Exact ID matched in the authenticated NHPR account reviewed on '+hfrReview.dateLabel+'. Workflow status: '+(hfrReview.statusFor(centre.id)||'not matched')+'. Other accounts have not been reconciled here. An ID match is separate from approval, present operations and clinical quality.';
  const wa='https://wa.me/?text='+encodeURIComponent(full+'\n\n'+url);
  const x='https://twitter.com/intent/tweet?text='+encodeURIComponent(short)+'&url='+encodeURIComponent(url);
  const bar=`<!-- share:start --><div class="fact-share" data-share-icons="css" data-share-url="${e(url)}" data-share-title="${e(b.name)}"><span class="share-context">${guideLanguage?shareLabels.share:'Share '+(record?'evidence':b.kind==='page'?'this page':'this')}</span><a class="share-wa" href="${e(wa)}" target="_blank" rel="noopener noreferrer" aria-label="Share ${e(b.name)} on WhatsApp">WhatsApp</a><button type="button" class="share-toggle" hidden aria-expanded="false" aria-label="More ways to share ${e(b.name)}">${shareLabels.more}</button><div class="share-options"><a class="share-x" href="${e(x)}" target="_blank" rel="noopener noreferrer" aria-label="Share ${e(b.name)} on X">X</a><button type="button" class="copy-share" aria-label="Copy link to ${e(b.name)}">${shareLabels.copy}</button><a class="share-image" href="${e(image)}" download="${e(card.id)}.jpg" aria-label="Download share image for ${e(card.title)}">${shareLabels.image}</a><button type="button" class="device-share" hidden aria-label="More sharing options for ${e(b.name)}">${shareLabels.share}</button></div></div><!-- share:end -->`;
  let at;
  if(b.kind==='page'){const slot=nodes.find(n=>/hero-share-slot/.test(attr(n,'class')||'')),h=nodes.find(n=>n.tag==='h1');at=slot?.end||h?.close;}
  else if(node.tag==='tr'){const td=nodes.filter(n=>n.tag==='td'&&n.start>node.start&&n.end<node.end).at(-1);at=td?.end;}
  else if(node.tag==='section'){at=node.end;}
  else if(/(?:^|\s)(?:queue-item|lifecycle-scope)(?:\s|$)/.test(attr(node,'class')||'')){at=node.children.find(n=>n.tag==='div')?.end??node.end;}
  else if(node.children.some(n=>/(?:^|\s)stage-content(?:\s|$)/.test(attr(n,'class')||''))){at=node.children.find(n=>/(?:^|\s)stage-content(?:\s|$)/.test(attr(n,'class')||''))?.end??node.end;}
  else at=node.end;
  // A page-level share slot or H1 may also live inside a managed component.
  if(at&&(b.kind==='page'||!withinManagedSection(at))){edits.push({at,value:bar});rows.push({id:b.id,url,image,text:short,whatsapp:full,xLength:short.length+24});}
 }
 edits.sort((a,b)=>b.at-a.at);for(const edit of edits)html=html.slice(0,edit.at)+edit.value+html.slice(edit.at);
 html=html.replace('</body>','<p class="share-status" role="status" aria-live="polite"></p><dialog class="share-fallback" aria-labelledby="share-fallback-title"><h2 id="share-fallback-title">Copy this evidence link</h2><p>Select and copy the link below.</p><input readonly aria-label="Evidence link"><form method="dialog"><button>Close</button></form></dialog></body>');
 return {html,rows};
};
