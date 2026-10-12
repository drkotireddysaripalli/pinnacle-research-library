import {brandedTitle} from '../shared-page-titles.mjs';
const BRAND='Pinnacle Blooms';
const SUFFIX=' | Pinnacle Blooms · 9100 181 181';
const brandNames=[
 'Pinnacle Blooms Network','Pinnacle Blooms',
 'पिनेकल ब्लूम्स नेटवर्क','पिनेकल ब्लूम्स','पिनाकल ब्लूम्स नेटवर्क',
 'పినాకిల్ బ్లూమ్స్ నెట్‌వర్క్','పినాకిల్ బ్లూమ్స్','పినాకిల్ బ్లూమ్స్ నెట్‌వర్క్‌లో',
 'ಪಿನಾಕಲ್ ಬ್ಲೂಮ್ಸ್ ನೆಟ್ವರ್ಕ್','ಪಿನಾಕಲ್ ಬ್ಲೂಮ್ಸ್ ನೆಟ್‌ವರ್ಕ್',
 'பினாக்கிள் ப்ளூம்ஸ் நெட்வொர்க்','பினாக்கிள் ப்ளூம்ஸ்',
 'പിനാക്കിൾ ബ്ലൂംസ് നെറ്റ്‌വർക്ക്','पिनॅकल ब्लूम्स नेटवर्क'
];
const escapeRE=s=>s.replace(/[.*+?^$()|[\]\\]/g,'\\$&');
const tailBrand=new RegExp('\\s*(?:[|–—-]\\s*)?(?:'+brandNames.sort((a,b)=>b.length-a.length).map(escapeRE).join('|')+')\\s*[®™]?\\s*$','iu');
const clean=value=>String(value||'').replace(/\s+/gu,' ').trim();
// Reviewed distinctions hidden by the old generic prefixes. These describe
// their actual source topic, not a record ID or an invented outcome.
const editorial={
 'hindi/online-speech-therapy-work':'ऑनलाइन स्पीच थेरेपी कैसे काम करती है?',
 'hindi/effective-speech-therapy':'ऑटिज्म में स्पीच थेरेपी कितनी प्रभावी है?',
 'hindi/emotional-resilience-through-speech-therapy':'स्पीच थेरेपी और बच्चे का भावनात्मक विकास',
 'hindi/social-acceptance-improvement-speech-therapy':'स्पीच थेरेपी और सामाजिक मेलजोल',
 'malayalam/autism-speech-clarity-improvement':'ഓട്ടിസവും സംസാരത്തിലെ വ്യക്തതയും',
 'malayalam/improving-eating-habits-autism-speech-therapy-pinnacle-blooms':'ഭക്ഷണ ശീലങ്ങളും സ്പീച്ച് തെറാപ്പിയും',
 'malayalam/speech-therapy-for-adults':'മുതിർന്നവർക്കുള്ള സ്പീച്ച് തെറാപ്പി',
 'malayalam/occupational-therapy-for-adults-pinnacle-autism':'മുതിർന്നവർക്കുള്ള ഒക്യുപേഷണൽ തെറാപ്പി',
 'malayalam/pinnacleblooms-concentration-skills-occupational-therapy':'ഏകാഗ്രതയും ഒക്യുപേഷണൽ തെറാപ്പിയും',
 'malayalam/occupational-therapy-enhance-child-attention-concentration-':'കുട്ടികളുടെ ശ്രദ്ധയും ഒക്യുപേഷണൽ തെറാപ്പിയും',
 'telugu/autism-speech-therapy':'ఆటిజం ఉన్న పిల్లలకు స్పీచ్ థెరపీ ఎలా ఉపయోగపడుతుంది?',
 'telugu/speech-therapy-idioms-figurative-language-pinnacle-blooms':'పదాల వెనుక అర్థం: పిల్లలకు స్పీచ్ థెరపీ',
 'telugu/social-skill-development':'ఇతరులతో కలిసిపోవడానికి Occupational Therapy'
};
const editorialDescriptions={
 'telugu/autism-speech-therapy':'మీ బిడ్డ మాటలు, అర్థం చేసుకోవడం, తన అవసరాలు చెప్పడం గురించి తెలుసుకోండి.',
 'telugu/speech-therapy-idioms-figurative-language-pinnacle-blooms':'రోజూ వినే మాటల వెనుక అర్థం పిల్లలకు ఎలా అర్థమవుతుంది? స్పీచ్ థెరపీ గురించి చదవండి.',
 'telugu/social-skill-development':'ఆటల్లో, ఇంట్లో, స్కూల్లో ఇతరులతో కలిసిపోవడం గురించి చదవండి. Occupational Therapy ఎలా తోడ్పడుతుందో తెలుసుకోండి.'
};
// Full questions/answers stay intact. Remove only a repeated publisher suffix.
function subject(answer){
 let value=clean(answer.metaTitle||answer.title);
 value=value.replace(tailBrand,'').replace(/\s+(?:at|by|from)\s*$/i,'').replace(/[|–—:\-\s]+$/u,'');
 if(answer.language==='english'){
  const match=/^(Speech Therapy|Occupational Therapy|ABA Therapy) for (.+)$/i.exec(value);
  if(match)value=match[2].replace(/^(?:Understanding|Improving|Enhancing|Building|Supporting)\s+/i,'')+': '+match[1];
 }
 return value||clean(answer.title);
}
function snippet(value,limit){
 const text=clean(value);if(text.length<=limit)return text;
 const seg=new Intl.Segmenter(undefined,{granularity:'grapheme'});
 let out='';for(const {segment} of seg.segment(text)){if((out+segment+'…').length>limit)break;out+=segment;}
 const boundary=out.lastIndexOf(' ');
 if(boundary>=Math.floor(limit*.55))out=out.slice(0,boundary);
 return out.replace(/[,:;|\-\s]+$/u,'')+'…';
}
export function faqMetadata(answer,{question=false,questionDescription=false}={}){
 const topic=editorial[answer.language+'/'+answer.slug]||(question?clean(answer.title):subject(answer));
 const title=brandedTitle(topic,BRAND);
 // Keep the published synopsis; do not manufacture clinical/availability claims.
 const description=snippet(questionDescription?answer.title:editorialDescriptions[answer.language+'/'+answer.slug]||answer.description||answer.title,160-SUFFIX.length)+SUFFIX;
 return {title,description};
}
const maps=new WeakMap();
export function faqMetadataMap(index){
 if(maps.has(index))return maps.get(index);
 const map=new Map(index.map(x=>[x.url,faqMetadata(x)]));
 const groups=new Map();for(const x of index){const key=map.get(x.url).title;const group=groups.get(key)||[];group.push(x);groups.set(key,group);}
 for(const group of groups.values())if(group.length>1)for(const x of group)map.set(x.url,faqMetadata(x,{question:true}));
 const descriptions=new Map();for(const x of index){const key=map.get(x.url).description;const group=descriptions.get(key)||[];group.push(x);descriptions.set(key,group);}
 for(const group of descriptions.values())if(group.length>1)for(const x of group)map.set(x.url,{...map.get(x.url),description:faqMetadata(x,{questionDescription:true}).description});
 maps.set(index,map);return map;
}

