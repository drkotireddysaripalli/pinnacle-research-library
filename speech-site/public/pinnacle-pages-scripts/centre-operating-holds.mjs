// Exact existing website identities. The open 212/B GBP identity is not this
// Grace Tower record; this register does not establish a move or replacement.
export const CENTRE_HOLD_CONTRACT='centre-operating-holds-20261017';
export const CENTRE_HOLD_MESSAGE='This centre is temporarily closed. Call 9100 181 181 for help finding an available Pinnacle centre.';
const prefix='/centers/best-autism-speech-aba-occupational-therapy-center-';
export const CENTRE_OPERATING_HOLDS=Object.freeze([
 {id:'vanasthalipuram',name:'Vanasthalipuram',facilityId:'3062523213',profileId:'2051938666471292348',path:prefix+'vanasthalipuram-hyderabad-telangana-india',directTelephone:'+918247233774'},
 {id:'annanagar',name:'Anna Nagar',facilityId:'20708282153',profileId:'17043982149826713076',path:prefix+'anna-nagar-chennai-tamilnadu-india',directTelephone:'+919100155381'},
 {id:'bnreddynagar',name:'BN Reddy Nagar',facilityId:'20709979215',profileId:'5021287366840391890',path:prefix+'bn-reddy-nagar-hyderabad-telangana-india',directTelephone:'+919100945515'},
 {id:'gachibowli',name:'Gachibowli — Grace Tower location',facilityId:'20711116107',profileId:'14181567949098472996',path:prefix+'gachibowli-hyderabad-telangana-india',directTelephone:'+919100110280'}
].map(h=>Object.freeze({...h,status:'temporarily_closed',checkedOn:'2026-10-17'})));
export const centreOperatingHold=id=>typeof id==='string'?CENTRE_OPERATING_HOLDS.find(h=>h.id===id)||null:null;
export const facilityOperatingHold=id=>typeof id==='string'?CENTRE_OPERATING_HOLDS.find(h=>h.facilityId===id)||null:null;
export function centrePathOperatingHold(value){try{const u=new URL(value,'https://www.pinnacleblooms.org');return ['www.pinnacleblooms.org','pinnacleblooms.org'].includes(u.hostname)&&!u.port&&!u.username&&!u.password?CENTRE_OPERATING_HOLDS.find(h=>h.path===u.pathname.replace(/\/$/,''))||null:null;}catch{return null;}}
export function applyHeldCentreOptions(select){let changed=0,heldSelection=false;for(const option of select?.options||[]){const hold=centreOperatingHold(option.value)||facilityOperatingHold(option.value);if(!hold)continue;heldSelection=heldSelection||option.selected===true;option.disabled=true;option.selected=false;if(!option.dataset?.centreOperatingHold){option.setAttribute('data-centre-operating-hold',hold.id);option.textContent+=' — Temporarily closed';}changed++;}if(heldSelection){if([...select.options].some(o=>o.value===''))select.value='';else select.selectedIndex=-1;}return changed;}
export function heldEnquiryAssignment(body){return centreOperatingHold(body?.preferences?.centre)||facilityOperatingHold(body?.preferences?.facilityId)||null;}
