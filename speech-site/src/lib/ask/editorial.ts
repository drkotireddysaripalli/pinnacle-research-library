import {SITE} from './content';
// Reviewed public copy. Applied at the common answer boundary so HTML, text
// and JSON have one source, while the original database record is retained.
const deicSlug='what-is-a-deic-and-what-services-does-it-offer';
const guidelines='https://www.nhm.gov.in/images/pdf/programmes/RBSK/Operational_Guidelines/Operational-Guidelines-DEIC-RBSK.pdf';
const programme='https://rbsk.mohfw.gov.in/rbsk/ImportantInfo.aspx';
export function reviewedAnswer(a:any){
 if(a?.slug!==deicSlug||a.lang!=='en')return a;
 const summary='A District Early Intervention Centre (DEIC) is a government child-health service under RBSK. It helps assess concerns identified through screening, coordinate early support, arrange referrals and follow up, with a primary focus on children up to six years. Ask your district hospital about local access and services.';
 return {...a,title:'What is a DEIC? Services, access and your child’s next step',h1:'What is a DEIC, and how can it help your child?',meta_title:'DEIC: Services, Age & How to Visit | Ask Pinnacle',summary,meta_description:'Understand District Early Intervention Centre services under RBSK, who they support, how to ask about a visit and what to bring. Official government sources.',content_updated_at:'2026-10-06',authority_links:[{label:'Government of India · DEIC operational guidelines',url:guidelines},{label:'Ministry of Health & Family Welfare · RBSK programme',url:programme}],faq:[{q:'What does DEIC stand for?',a:'DEIC stands for District Early Intervention Centre, a government child-health service under Rashtriya Bal Swasthya Karyakram (RBSK).'}, {q:'How can I arrange a DEIC visit?',a:'Contact your district hospital or local RBSK team. Ask where the DEIC is, its appointment process, documents, available professionals and the referral arrangements for your child’s age.'},{q:'Is Pinnacle a government DEIC?',a:'No. Pinnacle Blooms Network is operated by Bharath Healthcare Laboratories Private Limited. A Pinnacle visit is a separate choice; ask about its professional, availability, fees and plan before booking.'}],answer_md:`## What a DEIC does
${summary}

RBSK addresses birth defects, deficiencies, diseases and developmental delays including disabilities. A DEIC links screening with assessment, management, referral and follow-up. Its team may include medical, hearing, speech, movement, developmental and family-support services. The available professionals and arrangements must be checked locally. See the [DEIC operational guidelines](${guidelines}) and [official RBSK programme](${programme}).

## How to find your first step
Contact your district hospital or local RBSK team. Explain your child’s age and the concern you want help understanding. Ask:

- Where is the DEIC, and how is a visit arranged?
- Is a referral needed, and which documents should we bring?
- Which professional will meet our child?
- What services are available for our child’s age, and what is the next referral if needed?
- What is provided through the programme, and what should we confirm before travelling?

## Make the conversation about your child’s life
Bring existing reports and one or two everyday examples: how your child asks for help, joins play, gets ready or participates in learning. Describe what they already do, what support helps and what you would like to understand. Ask the professional to explain their observations and the next step in words your family can use.

Before leaving, write down the agreed plan, who to contact, any referral and when to review. Ask how home and school observations can inform that review.

## Where Pinnacle can fit
Pinnacle is a separate child-development network operated by Bharath Healthcare Laboratories Private Limited. It is not a government DEIC. If you want to discuss additional developmental support, bring your existing reports and agreed priorities so the team can understand what is already being done.

Your child’s self-sufficient, mainstream-included life gives the work its purpose. [PinnacleAI®](${SITE}/pinnacleai) connects ability measurement, a child-specific plan, appropriate integrated support, everyday practice and review. [Speech therapy](${SITE}/top-speech-therapy-center-india-proven-improvement-rate), [occupational therapy](${SITE}/best-occupational-therapy-center-india-proven-improvement-rate), [behavioural support](${SITE}/best-aba-therapy-center-india-proven-improvement-rate) and [special education](${SITE}/best-special-education-center-call-9100181181) each have a role when appropriate for the child.

AbilityScore® supports developmental understanding; PinnacleAI is non-diagnostic software. Diagnosis requires an appropriately qualified healthcare professional. [Verify the software and evidence scope](${SITE}/verify/evidence/claim-ledger.html).

## Talk through a Pinnacle visit
Call [9100 181 181](tel:+919100181181), [choose a centre](${SITE}/centers) or [send a first-visit enquiry](${SITE}/enroll-autism-speech-aba-therapies-india). Ask which professional is suitable, what the visit includes, the fees and how progress will be reviewed. Telephone guidance is free; this is not an offer of a free assessment.
`};
}
