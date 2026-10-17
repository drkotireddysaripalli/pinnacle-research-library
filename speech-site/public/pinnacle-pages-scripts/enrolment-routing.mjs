// Functional navigation only: no storage, event, source-envelope or intake mutation.
export const PAID_LOCALITY_CONTRACT='native-paid-locality-20261017-regional';
const heldMarkets=new Set(['himayatnagar','kondapur','gachibowli']);
const services={speech:'speech',ot:'occupational',aba:'aba'};
export function nativePaidCentre(search,{service='help',centres}={}){
 const params=new URLSearchParams(search);
 if(params.has('centre'))return null; // Explicit family choice, including help-me-choose.
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content'])if(params.getAll(key).length!==1)return null;
 if(params.get('utm_source')!=='google'||params.get('utm_medium')!=='cpc')return null;
 const campaign=params.get('utm_campaign'),content=params.get('utm_content');
 if(campaign!=='pbn_network_hyderabad'&&(!Object.hasOwn(regionalPaidContent,campaign)||!regionalPaidContent[campaign].includes(content)))return null;
 const match=/^([a-z0-9]+(?:-[a-z0-9]+)*)_(speech|ot|aba)$/.exec(params.get('utm_content'));
 if(!match||/^paradise(?:-|$)/.test(match[1])||service!=='help'&&services[match[2]]!==service)return null;
 if(!Object.hasOwn(paidCentreAliases,match[1]))return null;
 const centre=paidCentreAliases[match[1]];
 if(!centre||heldMarkets.has(centre)||centres&&!centres.has(centre))return null;
 return {centre,service:services[match[2]]};
}
export function applyPaidEnquiryLinks(document,currentURL,options){
 const current=new URL(currentURL),one=key=>current.searchParams.getAll(key).length===1?current.searchParams.get(key):null;
 const explicitService=one('service'),knownServices=new Set(['help','speech','occupational','aba','autism','education','other']);
 const service=knownServices.has(explicitService)?explicitService:options?.service;
 const hint=nativePaidCentre(current.search,{...options,service});
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

// Existing paid Search routes only; do not infer new centres or markets from a prefix.
const regionalPaidContent={
 "pbn_network_anantapur":["anathapuram-ap_aba","anathapuram-ap_ot","anathapuram-ap_speech"],
 "pbn_network_bhimavaram":["bhimavaram-ap_aba","bhimavaram-ap_ot","bhimavaram-ap_speech"],
 "pbn_network_eluru":["eluru-ap_aba","eluru-ap_ot","eluru-ap_speech"],
 "pbn_network_guntur":["lakshmipuram-guntur-ap_aba","lakshmipuram-guntur-ap_ot","lakshmipuram-guntur-ap_speech"],
 "pbn_network_kadapa":["kadapa-ap_aba","kadapa-ap_ot","kadapa-ap_speech"],
 "pbn_network_kakinada":["kakinada-ap_aba","kakinada-ap_ot","kakinada-ap_speech"],
 "pbn_network_karimnagar":["karimnagar-telangana_aba","karimnagar-telangana_ot","karimnagar-telangana_speech"],
 "pbn_network_khammam":["khammam-telangana_aba","khammam-telangana_ot","khammam-telangana_speech"],
 "pbn_network_kurnool":["kurnool-ap_aba","kurnool-ap_ot","kurnool-ap_speech"],
 "pbn_network_mahbubnagar":["mahbubnagar-telangana_aba","mahbubnagar-telangana_ot","mahbubnagar-telangana_speech"],
 "pbn_network_miryalaguda":["miryalaguda-ts_aba","miryalaguda-ts_ot","miryalaguda-ts_speech"],
 "pbn_network_nandyala":["nandyala-ap_aba","nandyala-ap_ot","nandyala-ap_speech"],
 "pbn_network_nellore":["nellore-ap_aba","nellore-ap_ot","nellore-ap_speech"],
 "pbn_network_ongole":["ongole-ap_aba","ongole-ap_ot","ongole-ap_speech"],
 "pbn_network_rajahmundry":["rajahmundry-ap_aba","rajahmundry-ap_ot","rajahmundry-ap_speech"],
 "pbn_network_srikakulam":["srikakulam-ap_aba","srikakulam-ap_ot","srikakulam-ap_speech"],
 "pbn_network_tirupati":["tirupati-ap_aba","tirupati-ap_ot","tirupati-ap_speech"],
 "pbn_network_vijayawada":["gurunanak-road-vijayawada-ap_aba","gurunanak-road-vijayawada-ap_ot","gurunanak-road-vijayawada-ap_speech","labbipet-vijayawada-ap_aba","labbipet-vijayawada-ap_ot","labbipet-vijayawada-ap_speech"],
 "pbn_network_vizag":["gajuwaka-vizag-ap_aba","gajuwaka-vizag-ap_ot","gajuwaka-vizag-ap_speech","jagadamba-vizag-ap_aba","jagadamba-vizag-ap_ot","jagadamba-vizag-ap_speech","madhurawada-ap_aba","madhurawada-ap_ot","madhurawada-ap_speech","nad-vizag-ap_aba","nad-vizag-ap_ot","nad-vizag-ap_speech"],
 "pbn_network_warangal":["warangal-ts_aba","warangal-ts_ot","warangal-ts_speech"]
};
