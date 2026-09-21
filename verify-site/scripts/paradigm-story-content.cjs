'use strict';
const fs=require('node:fs'),path=require('node:path');
const content=path.resolve(__dirname,'../content');
const PUBLIC='https://www.pinnacleblooms.org/verify';
const FALLBACK='/images/family-journey-600.webp';
const sourceNames={md5:'MD-5 intended use',bis:'BIS licence and scope',methodology:'Measurement and review methodology',dossier:'Documented system and approach','sovereign-walkthrough':'Developmental measurement framework','september-handout':'Published programme description',sae3000:'Independent limited-assurance report',srs4400:'Independent factual-findings report','external-validation':'External-validation research record','study-portfolio':'Study portfolio and scope'};
const asText=value=>Array.isArray(value)?value.filter(Boolean).join(' '):String(value??'');
const validAsset=value=>typeof value==='string'&&/^\/images\/[a-zA-Z0-9_./-]+\.(?:jpe?g|webp|png)$/i.test(value)&&!value.includes('..');

module.exports=({e,icon,origin})=>{
 const data=JSON.parse(fs.readFileSync(path.join(content,'paradigm-story.json'),'utf8'));
 const assetPath=path.join(content,'paradigm-story-assets.json');
 const assets=fs.existsSync(assetPath)?JSON.parse(fs.readFileSync(assetPath,'utf8')).cards||[]:[];
 const cards=data.cards||[];
 if(cards.length!==9)throw Error('Pinnacle paradigm story requires nine complete cards.');
 if(new Set(cards.map(c=>c.id)).size!==cards.length||cards.some((c,i)=>!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id)||Number(c.number)!==i+1))throw Error('Story cards need unique URL-safe IDs and ordered numbers 1–9.');
 const title=asText(data.title),headline=asText(data.headline),description=asText(data.description);
 const comparisonNote=asText(data.comparisonNote)||'Illustrative comparison: what coordination can change, not a ranking of all providers.';
 const missionData=data.mission&&typeof data.mission==='object'&&!Array.isArray(data.mission)?data.mission:{text:asText(data.mission)};
 const mission=[missionData.value,missionData.text].filter(Boolean).join(' · '),evidenceNote=asText(data.evidenceNote);
 if(missionData.sourceId&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(missionData.sourceId))throw Error('Invalid mission source ID.');
 const missionSource=missionData.sourceId?'/evidence/records/'+missionData.sourceId+'.html':null;
 const trackId='paradigm-story-track',headingId='paradigm-story-heading';
 const cardRoutes=cards.map(c=>'/evidence/paradigm/'+c.id+'.html');
 const cardMarkup=cards.map((card,index)=>{
  const number=String(index+1).padStart(2,'0'),name=asText(card.title),route=cardRoutes[index],url=PUBLIC+route;
  const asset=assets.find(a=>a.id===card.id)||assets.find(a=>String(a.artKey)===String(card.artKey));
  const poster=validAsset(asset?.poster)?asset.poster:null;
  const preview=validAsset(asset?.preview)?asset.preview:poster||FALLBACK;
  const sources=(card.sourceIds||[]).map(id=>{
   if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error('Invalid story source ID: '+id);
   return {href:'/evidence/records/'+id+'.html',label:sourceNames[id]||id.replace(/-/g,' ')};
  });
  const shareText=asText(card.shareText)||name+'. '+asText(card.lead);
  const weighted=value=>Array.from(value).reduce((sum,c)=>sum+(c.codePointAt(0)>0x10ff?2:1),0);
  const xText=weighted(shareText)<=250?shareText:name+'. Explore the connected approach, with sources and context.';
  const whatsapp='https://wa.me/?text='+encodeURIComponent(shareText+'\n\n'+asText(card.sourceNote)+'\n\n'+url);
  const x='https://twitter.com/intent/tweet?text='+encodeURIComponent(xText)+'&url='+encodeURIComponent(url);
  const nodeId='paradigm-story-card-'+card.id,titleId=nodeId+'-title';
  return `<li class="ps-slide"><article class="ps-card" id="${e(nodeId)}" data-story-card="${e(card.id)}" data-story-number="${index+1}" role="group" aria-roledescription="slide" aria-labelledby="${e(titleId)}">
   <a class="ps-poster" href="${e(route)}" aria-label="Read story ${index+1}: ${e(name)}"><img src="${e(preview)}" width="1080" height="1920" alt="${e(name)}. Poster text is available below." loading="${index===0?'eager':'lazy'}" decoding="async"></a>
   <header class="ps-card-heading"><p class="ps-card-number"><span>${number}</span><span>${e(card.eyebrow)}</span></p><h3 id="${e(titleId)}">${(Array.isArray(card.title)?card.title:[card.title]).map(line=>`<span>${e(line)}</span>`).join('')}</h3></header>
   <div class="ps-card-body"><details class="ps-transcript" data-story-transcript><summary>Read the card ${icon('plus')}</summary><div class="ps-card-copy"><p class="ps-card-lead">${e(card.lead)}</p><dl><div><dt>When care is disconnected</dt><dd>${e(card.disconnected)}</dd></div><div><dt>The PinnacleAI® approach</dt><dd>${e(card.connected)}</dd></div><div class="ps-life-meaning"><dt>What changes in the system</dt><dd>${e(card.lifeMeaning)}</dd></div></dl></div></details>
    <details class="ps-sources"><summary>Card sources ${icon('file-search')}</summary><div><ul>${sources.map(source=>`<li><a href="${e(source.href)}">${e(source.label)}</a></li>`).join('')}</ul></div></details>
    <div class="ps-card-actions"><a href="${e(poster||FALLBACK)}" download="${e(poster?'pinnacle-'+card.id+'.jpg':'pinnacle-family-illustration.webp')}">${icon('download')}${poster?'Download poster':'Download illustration'}</a><a href="${e(route)}">Read story ${icon('arrow-up-right')}</a></div>
    <div class="fact-share ps-share" data-share-url="${e(url)}" data-share-title="${e(name)}"><a class="share-wa" href="${e(whatsapp)}" target="_blank" rel="noopener noreferrer" aria-label="Share story ${index+1} on WhatsApp">WhatsApp</a><a class="share-x" href="${e(x)}" target="_blank" rel="noopener noreferrer" aria-label="Share story ${index+1} on X">X</a><button type="button" class="copy-share" aria-label="Copy link to story ${index+1}: ${e(name)}">${icon('link')}Copy link</button></div>
   </div>
  </article></li>`;
 }).join('\n');
 const html=`<section class="paradigm-story-deck wrap" id="pinnacle-paradigm-story" data-paradigm-story data-share-managed="true" data-story-mode="story" aria-labelledby="${headingId}">
  <header class="ps-intro"><p class="ps-eyebrow">${e(title)}</p><h2 id="${headingId}">${e(headline)}</h2><p class="ps-description">${e(description)}</p></header><ol class="ps-simple-steps" aria-label="The paradigm shift in three steps">${data.simpleSteps.map((step,i)=>`<li><span class="ps-step-number">${i+1}</span><div><h3>${icon(step.icon)}${e(step.title)}</h3><p>${e(step.text)}</p></div></li>`).join('')}</ol><p class="ps-nine-intro">See the difference, side by side.</p>
  <div class="ps-toolbar"><div class="ps-mode" role="group" aria-label="Choose how to read the story" data-story-enhancement hidden><button type="button" data-story-view="story" aria-pressed="true" aria-controls="${trackId}">Story view</button><button type="button" data-story-view="read" aria-pressed="false" aria-controls="${trackId}">Read all</button></div><p class="ps-swipe-hint" data-story-hint>Swipe or scroll through nine stories.</p></div>
  <div class="ps-navigation" data-story-enhancement hidden><button type="button" class="ps-previous" data-story-prev aria-label="Previous story" aria-controls="${trackId}">${icon('arrow-left')}<span>Previous</span></button><div class="ps-position"><p data-story-position>Story 1 of 9</p><progress data-story-progress value="1" max="9" aria-label="Story position" aria-hidden="true"></progress></div><button type="button" class="ps-next" data-story-next aria-label="Next story" aria-controls="${trackId}"><span>Next</span>${icon('chevron-right')}</button></div>
  <div class="ps-carousel" role="group" aria-roledescription="carousel" aria-label="PinnacleAI architecture of care: nine comparisons"><ol class="ps-track" id="${trackId}" data-story-track>${cardMarkup}</ol></div>
  <p class="ps-announcement" data-story-status role="status" aria-live="polite" aria-atomic="true"></p>
  <div class="ps-footer"><p class="ps-mission">${icon('network')}<span>${missionData.value?`<strong>${e(missionData.value)}</strong> · `:''}${e(missionData.text)}${missionSource?` <a href="${e(missionSource)}">Read the stated mission ${icon('arrow-up-right')}</a>`:''}</span></p><details class="ps-evidence-note"><summary>About the story and its evidence ${icon('plus')}</summary><p>${e(comparisonNote)}</p><p>${e(evidenceNote)}</p><a href="/evidence/pinnacle-paradigm-shift.html">Read the connected pathway and its sources ${icon('arrow-up-right')}</a></details></div>
 </section>`;
 const text=['# '+title,headline,description,...data.simpleSteps.map((step,i)=>(i+1)+'. '+step.title+' '+step.text),comparisonNote,...cards.map((card,index)=>['## '+String(index+1).padStart(2,'0')+' · '+asText(card.title),asText(card.lead),'When care is disconnected: '+asText(card.disconnected),'The PinnacleAI® approach: '+asText(card.connected),'What changes in the system: '+asText(card.lifeMeaning),'Read the story: '+origin+cardRoutes[index],...(card.sourceIds||[]).map(id=>'Source: '+origin+'/evidence/records/'+id+'.html')].join('\n\n')),mission,missionSource?'Mission source: '+origin+missionSource:'',evidenceNote].filter(Boolean).join('\n\n');
 // Card statements are not silently converted into question-and-answer claims.
 return {html,text,questions:[],cardRoutes};
};
