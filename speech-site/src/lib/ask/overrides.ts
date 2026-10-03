import {ASK,SITE} from './content';
export function institution(slug:string){
 if(!['what-is-pinnacle-blooms-network','what-is-pinnacle-blooms-network-and-how-does-it-help-my-child'].includes(slug))return null;
 const title=slug.endsWith('my-child')?'What is Pinnacle Blooms Network, and how can it help my child?':'What is Pinnacle Blooms Network?';
 return {slug,title,h1:title,lang:'en',canonical:ASK+'/'+slug,meta_robots:'index, follow, max-image-preview:large',content_updated_at:'2026-09-23',
 summary:'Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited.',
 answer_md:`## Your child’s whole life gives the work its direction
At Pinnacle, the purpose is your child’s self-sufficient, mainstream-included life. Assessment, appropriate therapies, family participation, everyday practice and review work together around that purpose.

## Services parents can ask about
- [Speech therapy](${SITE}/top-speech-therapy-center-india-proven-improvement-rate): communication in everyday life.
- [Occupational therapy](${SITE}/best-occupational-therapy-center-india-proven-improvement-rate): participation in daily activities.
- [ABA / behaviour therapy](${SITE}/best-aba-therapy-center-india-proven-improvement-rate): understanding behaviour and building useful skills.
- [Special education](${SITE}/best-special-education-center-call-9100181181): learning and participation.
- [Integrated autism support](${SITE}/autism-therapy): appropriate disciplines working around the child’s needs.

Ask the preferred centre which services are suitable and available, who will provide them, how goals and progress will be reviewed, and what the fees include.

## Understand the evidence and scope
PinnacleAI GPT-OS is a **non-diagnostic developmental-support Class B software as a medical device**. Its stated scope does not replace assessment or diagnosis by an appropriately qualified healthcare professional.

Find current locations in the [centre directory](${SITE}/centers). Institutional measures have particular dates, definitions and inclusion criteria. Use the [Verify claim and source ledger](${SITE}/verify/evidence/claim-ledger.html) for those definitions and accountant report-page pointers; dated counts are not a current practitioner or centre roster.

## Talk through your next step
Call **9100 181 181** for parent guidance and appointment enquiries. Confirm local services, assessment charges, therapy fees and appointments before booking. Telephone guidance availability does not mean centres or clinicians are available around the clock.`,
 faq:[{q:'Which services can parents ask about?',a:'Parents can ask about autism support, speech therapy, ABA/behaviour therapy, occupational therapy and special education. Confirm suitable services, practitioner availability and fees with the preferred centre.'},{q:'How do I contact the parent helpline?',a:'Call 9100 181 181 for parent guidance and appointment enquiries. The Pinnacle-operated helpline is available 24/7. Confirm assessment charges and therapy fees before booking. Helpline availability does not mean centres or clinicians are available around the clock.'},{q:'Who operates Pinnacle Blooms Network?',a:'Bharath Healthcare Laboratories Private Limited (BHCL) operates Pinnacle Blooms Network.'},{q:'Does PinnacleAI provide a medical diagnosis?',a:'PinnacleAI GPT-OS is non-diagnostic developmental-support software. Assessment or diagnosis requires an appropriately qualified healthcare professional.'},{q:'Where can I find current locations and network figures?',a:'Use the centre directory for locations and the dated Verify claim and source ledger for institutional measures and their definitions.'}],
 authority_links:[{label:'Organisation profile and legal operator',url:SITE+'/verify/evidence/organisation-profile.html'},{label:'Dated claim and source ledger',url:SITE+'/verify/evidence/claim-ledger.html'},{label:'PinnacleAI regulatory journey',url:SITE+'/verify/evidence/pinnacleai-regulatory-journey.html'}],related:[],alternates:[]};
}
