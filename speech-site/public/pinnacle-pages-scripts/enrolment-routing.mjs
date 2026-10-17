// Functional navigation only: no storage, event, source-envelope or intake mutation.
export const PAID_LOCALITY_CONTRACT='native-paid-locality-20261016';
const heldMarkets=new Set(['himayatnagar','kondapur','gachibowli']);
const services={speech:'speech',ot:'occupational',aba:'aba'};
export function nativePaidCentre(search,{service='help',centres}={}){
 const params=new URLSearchParams(search);
 if(params.has('centre'))return null; // Explicit family choice, including help-me-choose.
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content'])if(params.getAll(key).length!==1)return null;
 if(params.get('utm_source')!=='google'||params.get('utm_medium')!=='cpc'||params.get('utm_campaign')!=='pbn_network_hyderabad')return null;
 const match=/^([a-z0-9]+(?:-[a-z0-9]+)*)_(speech|ot|aba)$/.exec(params.get('utm_content'));
 if(!match||/^paradise(?:-|$)/.test(match[1])||service!=='help'&&services[match[2]]!==service)return null;
 if(!Object.hasOwn(paidCentreAliases,match[1]))return null;
 const centre=paidCentreAliases[match[1]];
 if(!centre||heldMarkets.has(centre)||centres&&!centres.has(centre))return null;
 return {centre,service:services[match[2]]};
}
export function applyPaidEnquiryLinks(document,currentURL,options){
 const current=new URL(currentURL),hint=nativePaidCentre(current.search,options),one=key=>current.searchParams.getAll(key).length===1?current.searchParams.get(key):null;
 const explicitService=one('service'),knownServices=new Set(['help','speech','occupational','aba','autism','education','other']);
 const service=knownServices.has(explicitService)?explicitService:options?.service;
 const raw=one('centre'),alias=raw==='suchitra2'?'suchitraii':raw;
 const centre=current.searchParams.has('centre')?options?.centres?.has(alias)?alias:null:hint?.centre;
 if(!knownServices.has(service)&&!centre)return 0;
 let updated=0;
 for(const link of document.querySelectorAll('a[href]')){
  let target;try{target=new URL(link.getAttribute('href'),current.origin);}catch{continue;}
  if(target.origin!==current.origin||!['/enroll-autism-speech-aba-therapies-india','/speech-therapy/service-information'].includes(target.pathname)||target.searchParams.has('centre'))continue;
  const existingService=target.searchParams.get('service');if(existingService&&existingService!==service)continue;
  if(centre)target.searchParams.set('centre',centre);
  if(target.pathname==='/enroll-autism-speech-aba-therapies-india'&&!target.searchParams.has('service')&&!target.searchParams.has('entry'))target.searchParams.set('service',service);
  link.href=target.href;link.dataset.paidLocality=PAID_LOCALITY_CONTRACT;updated++;
 }
 if(document.body)document.body.dataset.paidLocality=PAID_LOCALITY_CONTRACT;
 return updated;
}
// Exact locality aliases from the existing published profile paths; checked by test.
export const paidCentreAliases={"anathapuram-ap":"ananthapuram","anna-nagar-chennai-tamilnadu":"annanagar","asraonagar-hyderabad-telangana":"asraonagar","attapur-hyderabad-telangana":"attapur","begumpet-hyderabad-telangana":"begumpet","bhimavaram-ap":"bhimavaram","bn-reddy-nagar-hyderabad-telangana":"bnreddynagar","chanda-nagar-hyderabad-telangana":"chandanagar","dilsukhnagar-hyderabad-telangana":"dilsukhnagar","eluru-ap":"eluru","gachibowli-hyderabad-telangana":"gachibowli","gajuwaka-vizag-ap":"gajuwaka","gurunanak-road-vijayawada-ap":"gurunanak","habsiguda-hyderabad-telangana":"habsiguda","hayathnagar-hyderabad-telangana":"hayathnagar","himayatnagar-hyderabad-telangana":"himayatnagar","hydernagar-hyderabad-telangana":"hydernagar","indiranagar-bengaluru":"indiranagar","jagadamba-vizag-ap":"jagadamba","jayanagar-bengaluru":"jayanagar","jntu-hyderabad-telangana":"nizampet","jubilee-hills-hyderabad-telangana":"jublieehills","kachiguda-hyderabad-telangana":"kachiguda","kadapa-ap":"kadapa","kakinada-ap":"kakinada","karimnagar-telangana":"karimnagar","khajaguda-mehdipatnam-hyderabad-telangana":"khajaguda","khammam-telangana":"khammam","kondapur-hyderabad-telangana":"kondapur","kukatpally-hyderabad-telangana":"kukatpally","kurnool-ap":"kurnool","labbipet-vijayawada-ap":"labbipet","lakshmipuram-guntur-ap":"guntur","lbnagar-hyderabad-telangana":"lbnagar","madhapur-hyderabad-telangana":"madhapur","madhurawada-ap":"madhurawada","mahbubnagar-telangana":"mahbubnagar","marathalli-bengaluru":"marathahalli","miryalaguda-ts":"miryalaguda","mvp-vizag-ap":"mvp","nad-vizag-ap":"nad","nallagandla-hyderabad-telangana":"nallagandla","nandyala-ap":"nandyala","nellore-ap":"nellore","nizamabad-telangana":"nizamabad","ongole-ap":"ongole","paradise-hyderabad-telangana":"eastmarredpally","pragathi-nagar-hyderabad-telangana":"pragathinagar","rajahmundry-ap":"rajahmundry","santosh-nagar-hyderabad-telangana":"santoshnagar","south-extension-newdelhi":"delhi","srikakulam-ap":"srikakulam","srnagar-hyderabad-telangana":"srnagar","suchitra-hyderabad-telangana":"suchitra","suchitra2-hyderabad-telangana":"suchitraii","tirupati-ap":"tirupati","uppal-hyderabad-telangana":"uppal","vanasthalipuram-hyderabad-telangana":"vanasthalipuram","vidyanagar-telangana":"vidyanagar","vikrampuri-hyderabad-telangana":"vikrampuri","warangal-ts":"warangal"};
