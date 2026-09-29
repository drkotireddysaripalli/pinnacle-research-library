import centres from '../../data/centre-directory.json';
export function GET(){
 const data={title:'Pinnacle Blooms Network centre directory',operator:'Bharath Healthcare Laboratories Private Limited',checkedOn:'2026-09-28',source:'https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7',canonical:'https://www.pinnacleblooms.org/centers',nationalTelephone:'+919100181181',note:'Dated directory of published locations. Confirm current premises, professional and appointment availability with Pinnacle. The national number is not a distinct branch number. Registry references have their own status and scope.',centres:centres.map(({facilityId,images,emblem,...c})=>({...c,shareUrl:'https://www.pinnacleblooms.org/centers#centre-'+c.id,registrationReferences:'https://www.pinnacleblooms.org/verify/evidence/centre-entity-reference.html'}))};
 return new Response(JSON.stringify(data,null,2)+'\n',{headers:{'content-type':'application/json; charset=utf-8'}});
}
