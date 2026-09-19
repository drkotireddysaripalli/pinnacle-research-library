'use strict';
module.exports=({e,write,origin})=>{
 const data=require('../content/editorial-policy.json');
 const canonical=origin+'/#editorial-policy';
 const owner=data.evidenceOwner;
 write('evidence/editorial-policy.json',JSON.stringify({...data,canonical},null,2));
 return `<details class="review-disclosure" id="editorial-policy"><summary>Clinical review confirmed & editorial responsibility</summary><h3>Evidence owner</h3><p><strong>${e(owner.name)}</strong> · ${e(owner.jobTitle)}<br><a href="mailto:${e(owner.email)}">${e(owner.email)}</a> · <a href="tel:${e(owner.telephone)}">${e(owner.displayTelephone)}</a></p><p>${e(owner.responsibility)}</p><h3>${e(data.responsibleBody)}</h3><p>The designated committee brings together paediatric speech therapists, occupational therapists, ABA therapists, special education therapists, data scientists, technology experts and statisticians. Additional qualified specialists may contribute where needed.</p><p>${e(data.remit)}</p><p><strong>Current review status:</strong> ${e(data.status)}</p><p>${e(data.publicationRule)}</p><p><strong>Coverage confirmation:</strong> Pinnacle confirms its organisational coverage is complete. Confirmation recorded: 19 September 2026. Individual records retain their source dates and the exact scope of the documents inspected.</p><p>Document inspection, a live issuer match and clinical review are recorded separately. <a href="/evidence/editorial-policy.json">Read the editorial record</a> · <a href="mailto:${e(data.corrections)}">Send a source or correction</a></p></details>`;
};
