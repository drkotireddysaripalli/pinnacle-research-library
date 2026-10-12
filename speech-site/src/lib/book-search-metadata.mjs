import catalogue from '../data/book-catalog.json' with {type:'json'};
import native from '../data/book-locales.json' with {type:'json'};
import presentations from '../data/book-merchant-editions.json' with {type:'json'};
const labels={speech:'Speech',ot:'OT',aba:'ABA', 'special-education':'Special Education'};
const full={speech:'Speech & Communication',ot:'Occupational Therapy',aba:'ABA Parent Education','special-education':'Special Education'};
const keys={speech:'speech',occupational:'ot',behaviour:'aba',learning:'special-education'};
const local={hi:{speech:'बातचीत',ot:'रोज़मर्रा के काम',aba:'व्यवहार','special-education':'सीखना',all:'रोज़मर्रा के विकास पर 4 किताबें',edition:'हिंदी PDF'},te:{speech:'మాటలు',ot:'రోజువారీ పనులు',aba:'ప్రవర్తన','special-education':'నేర్చుకోవడం',all:'రోజువారీ పనులకు 4 పుస్తకాలు',edition:'తెలుగు PDF'}};
const subject=items=>items.length===4?'Four Parent Books':items.length===1?full[items[0]]+' 101':items.map(x=>labels[x]).join(' + ')+' Parent Books';
export const bookSearchMetadataMap={};
for(const b of catalogue){const items=(b.bundle?b.memberKeys:[b.bookKey]).map(x=>keys[x]),format={PDF:'PDF',PB:'Softcover',HB:'Hardbound'}[b.formatCode];if(items.some(x=>!x)||!format)throw Error('Unknown maintained book metadata inputs');const s=subject(items);bookSearchMetadataMap[b.path]={title:s+' · '+format+' | Pinnacle Blooms',description:'Preview '+s+'. '+format+' edition for everyday family reading; individual support is separate. Pinnacle Blooms: 9100 181 181.'};}
for(const b of native){const l=local[b.locale];if(!l)throw Error('Unknown native book locale');const s=b.bookCount===4?l.all:b.bookCount===1?b.title:b.bookKeys.map(k=>l[k]).join(' + ');const description=b.locale==='hi'?l.edition+': '+b.bookKeys.map(k=>l[k]).join(', ')+'. Preview देखकर चुनें। रोज़मर्रा की सीख के लिए; व्यक्तिगत सहायता अलग है। Pinnacle: 9100 181 181.':l.edition+': '+b.bookKeys.map(k=>l[k]).join(', ')+'. Preview చదివి ఎంచుకోండి. ఇంట్లో కలిసి Practice కోసం; వ్యక్తిగత సపోర్ట్ వేరు. Pinnacle: 9100 181 181.';bookSearchMetadataMap[b.path]={title:s+' · '+l.edition+' | Pinnacle Blooms',description};}
for(const p of presentations){const b=native.find(x=>x.sku===p.sku);if(!b)throw Error('Missing native book source');const language={hi:'Hindi',te:'Telugu'}[b.locale],s=subject(b.bookKeys);bookSearchMetadataMap[p.path]={title:s+' · '+language+' PDF | Pinnacle Blooms',description:'Preview '+s+' in '+language+'. PDF family reading; individual support is separate. Pinnacle Blooms: 9100 181 181.'};}
export const bookSearchMetadata=path=>bookSearchMetadataMap[path]||null;
