'use strict';
// Source content lives in JSON. This renderer writes nine static language pages,
// their matching text/JSON exports and a small shared stylesheet. It does not
// change the main page, sitemap, share-image catalogue or source evidence.
const data = require('../content/parent-guides.json');
const evidenceOwner=require('../content/editorial-policy.json').evidenceOwner;
const languageKeys = Object.keys(data.languages);
const pathIcons = ['scan-eye','clipboard-list','users','house','chart-no-axes-combined','rotate-ccw','network'];
const routeFor = (id, language) => `/guides/${language === 'en' ? '' : language + '/'}${id}.html`;
const style = `
@font-face{font-family:'Anek Telugu';src:url(/fonts/anek-telugu.woff2) format('woff2');font-weight:100 800;font-style:normal;font-display:swap}
@font-face{font-family:'Noto Sans Devanagari';src:url(/fonts/noto-sans-devanagari.woff2) format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
.parent-guide{max-width:1180px;margin-inline:auto;padding-block:24px 60px;color:#10194e}
.guide-lang-nav{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-block:18px 30px;font-size:14px}
.guide-lang-nav a{padding:9px 15px;border:1px solid #cbdde0;border-radius:24px;text-decoration:none;color:#006a72;min-height:44px;display:inline-flex;align-items:center}
.guide-lang-nav a[aria-current=page]{background:#007f86;border-color:#007f86;color:white}
.guide-languages a[lang^=te],.guide-lang-nav a[lang^=te],.parent-guide:lang(te),.parent-guide:lang(te) h1,.parent-guide:lang(te) h2,.parent-guide:lang(te) h3{font-family:'Anek Telugu','Nirmala UI',sans-serif}
.guide-languages a[lang^=hi],.guide-lang-nav a[lang^=hi],.parent-guide:lang(hi),.parent-guide:lang(hi) h1,.parent-guide:lang(hi) h2,.parent-guide:lang(hi) h3{font-family:'Noto Sans Devanagari','Nirmala UI',sans-serif}
.guide-hero{display:grid;gap:14px;align-items:center;border-bottom:1px solid #dbe7e9;padding-bottom:28px}
.guide-hero h1{font-size:clamp(30px,5.2vw,54px);line-height:1.18;letter-spacing:-.025em;margin:12px 0 22px;max-width:24ch}
.parent-guide:lang(te) .guide-hero h1,.parent-guide:lang(hi) .guide-hero h1{line-height:1.4;letter-spacing:0}
.parent-guide .guide-answer{font-size:clamp(18px,2vw,21px);line-height:1.75;color:#264858;max-width:64ch}
.guide-hero figure{margin:0}.guide-hero img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:contain}
.guide-hero figcaption{font-size:12px;line-height:1.5;color:#536675;text-align:center}
.guide-toc{margin-block:28px;padding:20px 22px;border-left:3px solid #007f86;background:#f4faf9;border-radius:0 12px 12px 0}
.guide-toc h2{font-size:18px;margin:0 0 10px}.guide-toc ol{margin:0;padding-inline-start:23px;display:grid;gap:9px}
.guide-toc a{color:#006a72;text-underline-offset:4px;line-height:1.7}
.guide-path{padding-block:22px 24px;border-bottom:1px solid #dbe7e9;margin-bottom:12px}
.guide-path h2{font-size:20px;line-height:1.6}.guide-path ol{list-style:none;padding:0;margin:16px 0 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 14px}
.guide-path li{display:flex;align-items:flex-start;gap:10px;line-height:1.55;font-size:14px}.guide-path svg{flex:none;width:22px;height:22px;color:#007f86}.guide-path li:nth-child(3n+1) svg{color:#8c40b0}.guide-path li:nth-child(3n+2) svg{color:#089da7}
.guide-section{scroll-margin-top:22px;padding-block:24px;border-bottom:1px solid #e1ebee;max-width:78ch}
.guide-section h2{font-size:clamp(23px,3vw,29px);line-height:1.5;margin:0 0 16px;display:flex;gap:12px;align-items:flex-start}
.guide-section h2 svg{flex:none;margin-top:9px;color:#007f86}.guide-section p{font-size:17px;line-height:1.85;color:#30485b;margin:12px 0}
.guide-source-links{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:18px;font-size:13px;line-height:1.7}
.guide-source-links a{color:#006a72;text-underline-offset:3px}.guide-questions{margin-block:28px;padding:22px 25px;border:1px solid #b7d7d9;border-radius:16px;max-width:78ch}
.guide-questions h2{font-size:23px;line-height:1.5;margin-top:0}.guide-questions ul{padding-inline-start:22px;display:grid;gap:14px;line-height:1.85}
.guide-faq{max-width:78ch;margin-block:30px}.guide-faq h2{font-size:23px;line-height:1.5}.guide-faq details{border-top:1px solid #dbe7e9;padding-block:15px}.guide-faq summary{font-size:17px;font-weight:650;line-height:1.7;cursor:pointer}.guide-faq p{line-height:1.85;color:#30485b}
.guide-source-list{padding:24px 0;max-width:88ch}.guide-source-list h2{font-size:24px;line-height:1.5}.guide-source-list ol{padding-inline-start:22px;display:grid;gap:14px}.guide-source-list li{padding-inline-start:6px;line-height:1.7}.guide-source-list a{color:#006a72}.guide-source-list small{display:block;color:#536675}
.guide-review{font-size:13px;line-height:1.8;color:#536675;border-top:1px solid #dbe7e9;padding-top:18px;max-width:92ch}.guide-review p{margin:8px 0}
.guide-related{margin-block:32px}.guide-related h2{font-size:25px;line-height:1.5}.guide-cards{display:grid;gap:14px}.guide-card{display:flex;align-items:flex-start;gap:14px;border:1px solid #bdd8db;border-radius:14px;padding:20px;text-decoration:none;line-height:1.6;color:#10194e;min-width:0}.guide-card svg{flex:none;color:#007f86;margin-top:4px}.guide-card strong{display:block;font-size:18px}.guide-card small{display:block;color:#496172;margin-top:6px}.guide-contact{padding-top:20px;border-top:1px solid #dbe7e9;max-width:78ch;line-height:1.8}.guide-contact h2{font-size:23px}.guide-contact a{color:#006a72;overflow-wrap:anywhere}
.guide-teaser{padding-block:28px}.guide-teaser h2{font-size:clamp(25px,4vw,38px)}.guide-teaser .guide-languages{font-size:14px;color:#496172;margin-top:16px}.guide-scope{font-size:13px;color:#536675;line-height:1.7;margin:18px 0 0}
.parent-guide a:focus-visible,.guide-teaser a:focus-visible,.parent-guide summary:focus-visible{outline:3px solid #007f86;outline-offset:4px}
@media(min-width:720px){.guide-hero{grid-template-columns:1.35fr 1fr;gap:26px}.guide-path ol{grid-template-columns:repeat(4,minmax(0,1fr))}.guide-cards{grid-template-columns:repeat(3,minmax(0,1fr))}.guide-related .guide-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.guide-toc ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 32px}.guide-toc li:last-child{grid-column:1/-1}}
@media(min-width:1050px){.guide-path ol{grid-template-columns:repeat(7,minmax(0,1fr))}.guide-path li{flex-direction:column;gap:8px}.guide-hero h1{font-size:48px}}
@media print{.guide-lang-nav,.guide-toc{display:none}.guide-hero{display:block}.guide-hero figure{max-width:300px}.guide-section{break-inside:avoid}.guide-faq details>*{display:block!important}}
`;

module.exports = ({e, icon, origin, date = data.updated, head, footer, breadcrumb, crumbsHTML, write}) => {
  const absolute = route => origin + route;
  const sourceLink = key => { const source=data.sources[key]; if(!source)throw Error('Unknown parent-guide source '+key);return source; };
  const localizedCards = (lang, exclude) => data.guides.filter(g=>g.id!==exclude).map(g=>`<a class="guide-card" href="${routeFor(g.id,lang)}">${icon(g.icon)}<span><strong>${e(g.translations[lang].shortTitle)}</strong><small>${e(g.translations[lang].title)}</small></span></a>`).join('');
  const pages=[];
  for (const guide of data.guides) {
    for (const language of languageKeys) {
      const originalLanguage=data.languages[language];
      const l={...originalLanguage,contactText:originalLanguage.contactText.replaceAll('{evidenceOwnerName}',evidenceOwner.name).replaceAll('{evidenceOwnerRole}',evidenceOwner.jobTitle)}, copy=guide.translations[language];
      if(copy.sections.length!==guide.sections.length)throw Error('Guide section mismatch: '+guide.id+'/'+language);
      const route=routeFor(guide.id,language), url=absolute(route), englishUrl=absolute(routeFor(guide.id,'en'));
      const crumbs=[[l.home,'/'],[copy.shortTitle,route]];
      const citations=guide.sources.map(key=>absolute(sourceLink(key).url));
      const article={'@type':'Article','@id':url+'#article',url,headline:copy.title,description:copy.description,inLanguage:l.lang,datePublished:date,dateModified:date,author:{'@type':'Organization','name':'Pinnacle Blooms Network','url':'https://www.pinnacleblooms.org/'},publisher:{'@id':origin+'/#organization'},mainEntityOfPage:{'@id':url+'#page'},citation:citations,image:origin+'/images/'+guide.image+'-1000.webp',...(language!=='en'?{translationOfWork:{'@id':englishUrl+'#article'}}:{workTranslation:languageKeys.filter(k=>k!=='en').map(k=>({'@id':absolute(routeFor(guide.id,k))+'#article',inLanguage:data.languages[k].lang}))})};
      const organization={'@type':'Organization','@id':origin+'/#organization',name:'Bharath Healthcare Laboratories Private Limited',brand:{'@type':'Brand',name:'Pinnacle Blooms Network'},url:'https://www.pinnacleblooms.org/'};
      const graph=[organization,{'@type':'WebPage','@id':url+'#page',url,name:copy.title,description:copy.description,inLanguage:l.lang,dateModified:date,mainEntity:{'@id':article['@id']},breadcrumb:{'@id':url+'#breadcrumb'},isPartOf:{'@id':origin+'/#website'}},article,breadcrumb(crumbs,url),{'@type':'FAQPage','@id':url+'#faq',inLanguage:l.lang,isPartOf:{'@id':url+'#page'},mainEntity:copy.faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}];
      const alternates=languageKeys.map(k=>`<link rel="alternate" hreflang="${data.languages[k].lang}" href="${absolute(routeFor(guide.id,k))}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${englishUrl}">`;
      const extraHead=alternates+`<link rel="stylesheet" href="/parent-guides.css"><link rel="alternate" type="text/plain" href="${url.replace(/\.html$/,'.txt')}" title="${e(copy.title)}">`;
      const pageHead=head(copy.title+' | Pinnacle',copy.description,url,graph).replace('<meta property="og:locale" content="en_IN">',`<meta property="og:locale" content="${l.locale}">${languageKeys.filter(k=>k!==language).map(k=>`<meta property="og:locale:alternate" content="${data.languages[k].locale}">`).join('')}`).replace('</head>',extraHead+'</head>');
      const localHeader=`<div class="review-strip"><span>${e(l.guideLabel)}</span> ${e(l.updated)}: ${date}</div><header class="wrap site-header"><a href="/" class="brand" aria-label="${e(l.home)}"><span class="logo-crop"><img src="/images/pinnacle-logo.webp" alt="Pinnacle Blooms Network" width="420" height="158"></span></a><a class="outline-link" href="/#records">${icon('arrow-left')}${e(l.library)}</a></header>`;
      const languageNav=`<nav class="guide-lang-nav" aria-label="${e(l.readIn)}"><span>${e(l.readIn)}</span>${languageKeys.map(k=>`<a href="${routeFor(guide.id,k)}" lang="${data.languages[k].lang}" hreflang="${data.languages[k].lang}"${language===k?' aria-current="page"':''}>${e(data.languages[k].name)}</a>`).join('')}</nav>`;
      const sections=guide.sections.map((s,i)=>`<section class="guide-section" id="${s.id}"><h2>${icon(s.icon)}<span>${e(copy.sections[i].title)}</span></h2>${copy.sections[i].paragraphs.map(p=>`<p>${e(p)}</p>`).join('')}<div class="guide-source-links" aria-label="${e(l.sources)}">${s.sources.map(key=>`<a href="${e(sourceLink(key).url)}"><span>${e(l.sourceLink)}:</span> <span lang="en">${e(sourceLink(key).title)}</span></a>`).join('')}</div></section>`).join('');
      const figure=`<figure><img src="/images/${guide.image}-600.webp" srcset="/images/${guide.image}-600.webp 600w, /images/${guide.image}-1000.webp 1000w" sizes="(min-width:720px) 440px, calc(100vw - 40px)" width="1536" height="1024" alt="${e(copy.imageAlt)}" loading="eager" decoding="async"><figcaption>${e(l.illustration)}</figcaption></figure>`;
      const sourceList=`<section class="guide-source-list" id="sources"><h2>${e(l.sources)}</h2><ol>${guide.sources.map(key=>`<li lang="en"><a href="${e(sourceLink(key).url)}">${e(sourceLink(key).title)}</a><small>${e(sourceLink(key).pinpoint)}</small></li>`).join('')}</ol></section>`;
      const faqTitle={en:'Quick answers',te:'చిన్న ప్రశ్నలకు స్పష్టమైన జవాబులు',hi:'छोटे सवाल, स्पष्ट जवाब'}[language];
      const content=`<main class="wrap parent-guide" lang="${l.lang}">${crumbsHTML(crumbs)}${languageNav}<article class="h-entry"><div class="guide-hero"><div><p class="eyebrow">${e(l.guideLabel)} · PINNACLEAI®</p><h1 class="p-name">${e(copy.title)}</h1><p class="guide-answer p-summary">${e(copy.answer)}</p></div>${figure}</div><nav class="guide-toc" aria-label="${e(l.contents)}"><h2>${e(l.contents)}</h2><ol>${guide.sections.map((s,i)=>`<li><a href="#${s.id}">${e(copy.sections[i].title)}</a></li>`).join('')}</ol></nav><div class="guide-path"><h2>${e(l.pathTitle)}</h2><ol>${l.path.map((stage,i)=>`<li>${icon(pathIcons[i])}<span>${e(stage)}</span></li>`).join('')}</ol></div><div class="e-content">${sections}<section class="guide-questions" id="questions-for-your-team"><h2>${e(l.questions)}</h2><ul>${copy.questions.map(q=>`<li>${e(q)}</li>`).join('')}</ul></section><section class="guide-faq" id="quick-answers"><h2>${faqTitle}</h2>${copy.faq.map((f,i)=>`<details id="answer-${i+1}"><summary>${e(f.q)}</summary><p>${e(f.a)}</p></details>`).join('')}</section>${sourceList}<div class="guide-review"><p><time datetime="${date}">${e(l.updated)}: ${date}</time>. ${e(l.review)} <a href="/#editorial-policy" lang="en">Clinical review record</a></p>${l.translation?`<p>${e(l.translation)}</p>`:''}<p>${e(l.scope)}</p></div></div></article><aside class="guide-related"><h2>${e(l.related)}</h2><div class="guide-cards">${localizedCards(language,guide.id)}</div></aside><section class="guide-contact" id="ask-about-evidence"><h2>${e(l.contact)}</h2><p>${e(l.contactText).replace('care@pinnacleblooms.org','<a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a>').replace('9100 181 181','<a href="tel:+919100181181">9100 181 181</a>')}</p><p><strong>${e(l.purpose)}</strong></p></section></main>`;
      const html='<!doctype html><html lang="'+l.lang+'">'+pageHead+'<body>'+localHeader+content+footer+'</body></html>';
      write(route.slice(1),html);
      const text=[copy.title,url,'Language: '+l.lang,'Updated: '+date,'',copy.answer,'',...guide.sections.flatMap((s,i)=>[copy.sections[i].title,...copy.sections[i].paragraphs,...s.sources.map(key=>'Source: '+sourceLink(key).title+' — '+absolute(sourceLink(key).url)), '']),l.questions,...copy.questions,'',...copy.faq.flatMap(f=>[f.q,f.a,'']),l.review,l.translation,l.scope,l.contactText].filter(Boolean).join('\n\n');
      write(route.slice(1).replace(/\.html$/,'.txt'),text+'\n');
      pages.push({id:guide.id+'-'+language,topic:guide.id,language,lang:l.lang,route,url,title:copy.title,description:copy.description,answer:copy.answer,icon:guide.icon,image:'/images/'+guide.image+'-1000.webp',sources:guide.sources.map(key=>({...sourceLink(key),url:absolute(sourceLink(key).url)})),text});
    }
  }
  write('parent-guides.css',style);
  write('evidence/parent-guides.json',JSON.stringify({updated:date,editorialBasis:data.editorialBasis,evidenceOwner,pages:pages.map(({text,...p})=>p)},null,2));
  const teaser=`<section class="guide-teaser wrap" id="parent-guides"><p class="eyebrow">UNDERSTAND THE EVIDENCE IN EVERYDAY LIFE</p><h2>Three questions. A clearer next step.</h2><div class="guide-cards">${localizedCards('en')}</div><p class="guide-languages">Read each guide in English, <a href="${routeFor('abilityscore','te')}" lang="te">తెలుగు</a> or <a href="${routeFor('abilityscore','hi')}" lang="hi">हिन्दी</a>. Source links accompany every topic.</p></section>`;
  return {pages,teaser,style,text:pages.map(p=>p.text).join('\n\n---\n\n'),indexText:pages.map(p=>`- [${p.title}](${p.url}): ${p.description}`).join('\n')};
};
module.exports.data=data;
module.exports.routeFor=routeFor;
