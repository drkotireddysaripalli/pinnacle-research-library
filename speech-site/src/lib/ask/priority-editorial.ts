import {ASK, SITE} from './content';

// Source-checked public guidance, updated 8 October 2026. This date records
// a content update; it is not a claim of an individual clinician's review.
type Source = {label:string;url:string};
type Copy = {title:string;h1:string;meta_title:string;meta_description:string;summary:string;answer_md:string;faq:{q:string;a:string}[];everyday_tip:string;what_to_watch:string;authority_links:Source[]};
const source = {
 ncert:{label:'NCERT · Foundational Stage framework: individual education planning',url:'https://ncert.nic.in/flipbook/NCF/National_Curriculum_Framework_for_Foundational_Stage_2022/files/basic-html/page196.html'},
 idea:{label:'US eCFR · 34 CFR 300.320: US IDEA IEP requirements',url:'https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-300/subpart-D/section-300.320'},
 act:{label:'Government of India · Rights of Persons with Disabilities Act, 2016',url:'https://cdnbbsr.s3waas.gov.in/s3e58aea67b01fa747687f038dfde066f6/uploads/2023/10/202310161053958942.pdf'},
 cdc:{label:'CDC · Developmental milestones by one year',url:'https://www.cdc.gov/act-early/milestones/1-year.html'},
 smallParts:{label:'US Consumer Product Safety Commission · Small parts and choking hazards',url:'https://www.cpsc.gov/FAQ/Small-Parts-and-Choking-Hazard-Labeling-FAQs'},
 food:{label:'NHS · Foods to avoid giving babies and young children',url:'https://www.nhs.uk/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/'},
 udid:{label:'Government of India · UDID application and medical-board process',url:'https://swavlambancard.gov.in/Applyforudid'},
 udidFaq:{label:'Government of India · UDID documents, validity, renewal and support FAQs',url:'https://swavlambancard.gov.in/faqs'},
 authorities:{label:'Government of India · UDID: Know your Medical Authority',url:'https://swavlambancard.gov.in/?type=swavlambancard'},
 telangana:{label:'Telangana Government · State directory: official SADAREM route',url:'https://www.telangana.gov.in/state-web-directory/'},
 andhra:{label:'Andhra Pradesh Government · SADAREM portal',url:'https://sadarem.ap.gov.in/SADAREM/mainPage.do'},
 apDistrict:{label:'Andhra Pradesh Government · Konaseema district disability-certificate access',url:'https://konaseema.ap.gov.in/service/disability-commission-5/'},
 stimming:{label:'Leicestershire Partnership NHS Trust · Stimming and autism',url:'https://www.leicspart.nhs.uk/autism-space/health-and-lifestyle/stimming/'},
 nice:{label:'NICE · Autism under 19: assess causes of distress and behaviour that challenges',url:'https://www.nice.org.uk/guidance/cg170/chapter/key-priorities-for-implementation'},
 media:{label:'American Academy of Pediatrics · Screen time, development and autism evidence',url:'https://www.aap.org/en/patient-care/media-and-children/center-of-excellence-on-social-media-and-youth-mental-health/qa-portal/qa-portal-library/qa-portal-library-questions/early-childhood-screen-time-brain-development-and-autism/'},
 autism:{label:'NHS · What autism is and the range of support needs',url:'https://www.nhs.uk/conditions/autism/what-is-autism/'},
 language:{label:'Newcastle Hospitals NHS Foundation Trust · Why functioning labels miss support needs',url:'https://www.newcastle-hospitals.nhs.uk/resources/the-language-we-use/'},
 oxford:{label:'Oxford Health NHS Foundation Trust · Current autism terminology',url:'https://oxfordhealth.nhs.uk/baadis/autism/what-is-it/'}
} satisfies Record<string,Source>;
const speech=SITE+'/top-speech-therapy-center-india-proven-improvement-rate';
const occupational=SITE+'/best-occupational-therapy-center-india-proven-improvement-rate';
const education=SITE+'/best-special-education-center-call-9100181181';
const behaviour=SITE+'/best-aba-therapy-center-india-proven-improvement-rate';
const contact=(service:string)=>`Call [9100 181 181](tel:+919100181181), [find a centre](${SITE}/centers) or [send a first-visit enquiry](${SITE}/enroll-autism-speech-aba-therapies-india${service?'?service='+service:''}). Ask about the suitable professional, local availability, what the visit includes and fees.`;

export const specifiedDisabilities = [
 'Blindness','Low vision','Leprosy-cured persons','Hearing impairment (deaf and hard of hearing)','Locomotor disability','Dwarfism','Intellectual disability','Mental illness','Autism spectrum disorder','Cerebral palsy','Muscular dystrophy','Chronic neurological conditions','Specific learning disabilities','Multiple sclerosis','Speech and language disability','Thalassemia','Haemophilia','Sickle cell disease','Multiple disabilities, including deafblindness','Acid attack victims',"Parkinson’s disease"
] as const;

const iepSummary='An IEP (Individualised Education Plan) is a written plan for a child’s learning and participation: their starting abilities, meaningful goals, classroom support and a review date. In India, families can plan it with the school and relevant professionals. US IDEA gives IEP a separate legal meaning; those US rules do not automatically apply to an Indian school.';
const pincerSummary='A pincer grasp uses the thumb and index finger to pick up an item. Support it through relaxed, age-appropriate play and suitable self-feeding, with close adult supervision. Small loose objects can choke a young child. The CDC lists thumb-and-finger pickup by one year as a milestone; concerns or lost skills deserve a developmental conversation.';
const certificateSummary='For a child’s disability certificate and UDID card in India, apply through the official UDID portal and follow the assigned notified medical authority’s assessment process. The medical board decides the disability category, percentage and certificate validity. Pinnacle does not issue government disability certificates. Check state arrangements and each scheme’s rules separately.';
const stimmingSummary='No. Hand-flapping, rocking, humming and other stimming can help a child feel comfortable, regulate sensations or express joy. Harmless stimming does not need to be stopped just because it looks different. Seek support for injury, distress or serious interference with everyday participation; understand the need and make the situation safer.';
const shadowSummary='A shadow teacher is a term schools use for an adult who supports a child’s participation in the classroom, often one to one. Whether this is useful depends on the child, the classroom and the support already available. Agree the role with the school, set clear goals and review how the child participates and uses help.';

const priorityCopy:Record<string,Copy> = {
 'what-is-an-iep-individualised-education-plan':{
  title:'What is an IEP? A practical parent guide for India',h1:'What is an IEP (Individualised Education Plan)?',meta_title:'IEP in India: Goals, School Support & Review | Ask Pinnacle',meta_description:'Understand an Individualised Education Plan, prepare for a school meeting and choose useful learning goals. India guidance with US IDEA rights clearly separated.',summary:iepSummary,
  everyday_tip:'Before a school meeting, write down one strength, one everyday situation where help is needed and one priority your child or family wants to work on.',
  what_to_watch:'Ask for a review if the plan names activities but no clear goal, nobody owns the support, or school participation is becoming more difficult. A school plan is not a medical diagnosis.',
  authority_links:[source.ncert,source.act,source.idea],
  faq:[{q:'Who develops an IEP in India?',a:'The school’s teachers and relevant special educator can plan with parents, caregivers and, where useful, the child and their other professionals. Agree who will coordinate the plan and review it.'},{q:'Does an IEP diagnose autism or a learning disability?',a:'No. An IEP is an education plan. Diagnosis requires an appropriately qualified healthcare professional. PinnacleAI and AbilityScore are non-diagnostic developmental-support tools.'},{q:'Do US IDEA rules apply to schools in India?',a:'US IDEA IEP requirements belong to the United States. In India, use applicable Indian education and disability law, school and board policies, and local guidance.'},{q:'How often should we review the plan?',a:'Write a review date into the plan with the school. Ask for an earlier discussion if the support is not working or needs change. Do not assume a US review timetable is an Indian legal rule.'}],
  answer_md:`## What the plan is for
${iepSummary}

The useful question is: **what will help your child learn, join in and do more for themselves in this school day?** An IEP connects that purpose with the support adults agree to provide. NCERT’s [Foundational Stage framework](${source.ncert.url}) describes a documented child profile, regular assessment and an IEP prepared with parents and caregivers.

## What to put in a useful school plan
Use this as a discussion checklist, adapted to your child’s age and school:

| Part of the plan | A question to ask |
| --- | --- |
| Starting picture | What can our child already do, what do they enjoy, and what helps? |
| Priorities | Which learning or participation goals matter most now? |
| Support | What instruction, communication tools, adjustments or adult help will be provided? |
| Responsibility | Who will do what, in which part of the school day? |
| Progress | What will we observe, and how will home and school share examples? |
| Review | When will we meet, and what would prompt an earlier review? |

Include your child’s preferences and ways of communicating. A goal should help their life, rather than simply make them appear more like other children.

## Turn a broad wish into an observable goal
“Improve communication” gives adults little direction. An **illustrative discussion goal**, not a target prescribed for every child, is: “During snack time, our child will ask for a preferred item using their agreed speech, gesture or communication aid; the teacher will record how much help was needed.”

The team can then agree a realistic starting point, teaching approach, review period and signs of progress. Ask whether the skill appears with different adults and in ordinary routines, as well as during a practice session.

## India guidance and US legal rights are different
In India, [section 16 of the RPwD Act](${source.act.url}) addresses inclusive education, reasonable accommodation, support and monitoring for educational institutions funded or recognised by government. Ask the school about the applicable board and state arrangements for your child.

In the United States, an IEP is a legal document under IDEA. [34 CFR 300.320](${source.idea.url}) specifies content including current performance, measurable annual goals, services and progress reporting. Those requirements describe the US system. Do not copy them into a claim that every Indian school must follow the same procedure.

## Prepare for the meeting and the review
Bring previous school plans and relevant reports, alongside two or three ordinary examples. Share what your child can do at home and what is hard at school without assuming either account is wrong. The environment, people and demands may differ.

Leave with a copy of the agreed plan, the named contact and the review date. If a goal is not helping, discuss the support and setting as well as the child’s skill. The IEP should guide useful action throughout the term.

## Connect learning with everyday life at Pinnacle
At Pinnacle, [special education](${education}) can contribute to learning priorities. [Speech therapy](${speech}) may support classroom communication, and [occupational therapy](${occupational}) may support participation in school routines when appropriate. Bring the school plan so goals can be discussed together, with your consent. Our purpose is your child’s growing independence and participation; no single plan guarantees a school outcome.

${contact('education')}
`},
 'how-can-i-work-on-pincer-grasp-with-my-child-at-home':{
  title:'Pincer grasp: age, safe practice and when to ask for help',h1:'How can I support my child’s pincer grasp at home?',meta_title:'Pincer Grasp: Development & Safe Practice | Ask Pinnacle',meta_description:'What a pincer grasp means, the one-year milestone, safer everyday practice and when to seek advice. Includes small-object and choking precautions.',summary:pincerSummary,
  everyday_tip:'Notice hand use during ordinary, safe play. Offer an age-rated toy without detachable small parts, model a turn and let your child try without forcing their fingers.',
  what_to_watch:'Discuss a missing milestone, marked difference between hands, difficulty using the hands in daily activities or any loss of a skill with your child’s doctor. Ask about developmental screening.',
  authority_links:[source.cdc,source.smallParts,source.food],
  faq:[{q:'What is a pincer grasp?',a:'It is using the thumb and index finger together to pick up an item. It is one part of fine motor development, rather than a test that diagnoses a condition.'},{q:'At what age is it expected?',a:'The CDC lists picking up things between the thumb and pointer finger among milestones most children can do by one year. Children vary; a checklist is not a diagnosis. Raise concerns with your child’s doctor rather than waiting for a fixed deadline.'},{q:'Can we use coins, beads or dried pulses to practise?',a:'Keep choking-size loose objects away from children under three and from children who mouth objects. Adult supervision does not make a choking-size object safe. Choose age-appropriate materials and get professional advice if unsure.'},{q:'When should I seek help?',a:'Speak with your child’s doctor about missing milestones, significant differences between hands, difficulty with everyday hand use or lost skills. A professional can consider the whole developmental picture and suitable support.'}],
  answer_md:`## What a pincer grasp is
${pincerSummary}

Think of the small pinch used to lift an item between thumb and finger. Children first use other ways of holding and exploring. Look at what your child can do and how hand use is developing, rather than repeatedly testing one movement.

## The one-year milestone is a guide
The [CDC’s one-year checklist](${source.cdc.url}) includes thumb-and-pointer-finger pickup. Its milestones describe what most children do; the checklist does not replace developmental screening. Share concerns and any lost skills with your doctor. If your child was born prematurely, ask how to interpret their development in that context.

## Put safety before smaller objects
The [US Consumer Product Safety Commission](${source.smallParts.url}) explains the choking, swallowing and inhalation risk from small parts for children under three. Keep coins, loose beads, buttons, dried pulses and other choking-size objects away from young children and children who mouth objects. Supervision does not remove the hazard. Check age labels and detachable parts.

For self-feeding, choose food prepared for your child’s age, feeding ability and any professional advice. Have your child seated upright and stay beside them. [NHS food-safety guidance](${source.food.url}) identifies whole nuts and raw jelly cubes as choking hazards. Do not turn feeding practice into a task if your child is distressed, coughing or struggling; discuss feeding concerns with a healthcare professional.

## Make practice part of a relaxed day
Try these discussion ideas using suitable, safe materials:

- Let your child explore an age-rated toy with large, secure parts and offer time to try.
- Share a sturdy board book, allowing them to help with page turns.
- During suitable self-feeding, model the action and allow an attempt without repositioning their fingers.
- Pause when they turn away or become frustrated. Play and meals should remain comfortable.

These are opportunities to use the hands, not a prescribed programme or a promise to develop a pincer grasp by a date. An occupational therapist can select materials and practice for the child’s actual abilities.

## When to ask for a developmental conversation
Discuss missing milestones, a marked difference between hands, difficulty using the hands in ordinary activities or lost skills with your child’s doctor. Describe what you have noticed and ask whether screening or a referral would help. A single grasp pattern cannot tell you whether a child has autism or another condition.

## Support the skill that matters in your child’s life
At Pinnacle, [occupational therapy](${occupational}) can help assess everyday hand-use priorities and discuss suitable practice. The goal may be easier self-feeding, handling learning materials or participating in dressing, depending on the child. Ask how the starting picture, home practice and review will connect to that goal. PinnacleAI and AbilityScore are non-diagnostic developmental-support tools; diagnosis requires an appropriately qualified healthcare professional.

${contact('occupational')}
`},
 'how-do-i-get-a-disability-certificate-for-my-child-in-india':{
  title:'Disability certificate and UDID for a child in India: parent guide',h1:'How do I get a disability certificate for my child in India?',meta_title:'Child Disability Certificate & UDID in India | Ask Pinnacle',meta_description:'Official UDID steps, documents, medical-board assessment, 21 disability categories and renewal. Telangana and Andhra Pradesh routes plus the national authority directory.',summary:certificateSummary,
  everyday_tip:'Keep the application acknowledgement, existing certificate and relevant reports in one secure folder. Use the acknowledgement to identify the assigned hospital and follow up.',
  what_to_watch:'Check the certificate’s type, percentage, personal details and validity date. Ask the issuing authority about correction, reassessment or appeal when needed. Check each benefit’s separate eligibility rules.',
  authority_links:[source.udid,source.udidFaq,source.act,source.authorities,source.telangana,source.andhra,source.apDistrict],
  faq:[{q:'Who issues a government disability certificate?',a:'A competent medical authority notified by the State or Union Territory issues it after the official assessment process. Pinnacle, a private child-development network, does not issue this government certificate.'},{q:'Does every certificate require 40% disability?',a:'No. Do not treat 40% as a universal threshold for certificate issuance. Benchmark-disability provisions and individual benefit schemes have their own rules; the certifying authority determines the assessed percentage.'},{q:'Do autism and ADHD qualify in the same way?',a:'Autism spectrum disorder is specified in the RPwD Act’s Schedule. ADHD is not separately named in that Schedule. An ADHD diagnosis alone is not equivalent to automatic certification in a specified category; ask the notified medical authority about the child’s actual condition and assessment.'},{q:'Does every child need renewal?',a:'Check the certificate’s validity. Temporary certificates and UDID cards require renewal according to the official process. The medical authority determines whether reassessment is needed; do not assume every child receives a permanent certificate.'},{q:'Must we wait for a certificate to discuss developmental support?',a:'You can discuss your child’s needs with an appropriate healthcare or rehabilitation professional while the administrative application is being processed. Certification and a suitable support plan serve different purposes.'}],
  answer_md:`## Start with the official route
${certificateSummary}

A certificate records the assessed disability and its extent. A UDID card provides the national disability identity linked to that process. Obtaining either does not automatically enrol a family in every benefit scheme.

## Apply, follow up and attend assessment
The [official UDID application guide](${source.udid.url}) describes the route:

1. Complete and submit the application on the government portal. Check names, contact details and uploaded information before submission.
2. Save the acknowledgement and check the assigned hospital or medical authority. Follow its instructions for verification and an assessment appointment.
3. Attend the assessment with the child and requested documents. Specialist doctors assess the condition; the medical board decides category, extent and certificate validity.
4. Check the decision and generated documents through the official process. Keep copies and confirm any next instruction with the issuing authority.

Ask the hospital about access needs before travelling. Appointment arrangements depend on the authority; this guide does not promise a waiting time.

## Prepare documents without guessing local requirements
The [UDID FAQs](${source.udidFaq.url}) list a colour photograph, Aadhaar details, proof of address and an existing disability certificate if available. Follow the current portal fields. For a child, confirm parent or guardian details and any additional requirements with the assigned authority. Bring relevant diagnostic, treatment and assessment reports as requested; therapy records are supporting information, not a government certificate.

If you already have a certificate, declare it in the application. The authority decides whether reassessment is needed. Ask the official service or hospital about documents, any applicable charges and assistance; avoid relying on an agent’s guarantee of approval.

## Which disabilities are specified in India?
The [RPwD Act, 2016 Schedule](${source.act.url}) sets out specified disabilities, commonly listed as the following 21 categories. Clinical definitions and official assessment criteria still apply:

${specifiedDisabilities.map((name,i)=>`${i+1}. ${name}`).join('\n')}

**Autism and ADHD are not equivalent certification categories.** Autism spectrum disorder is named in the Schedule. ADHD is not separately named. An ADHD diagnosis alone does not automatically establish certification under a specified category. Explain the child’s actual condition and any coexisting conditions to the notified authority.

**40% is not a universal certificate threshold.** The Act’s benchmark-disability provisions and benefit schemes have specific eligibility rules. Do not assume that a certificate, a diagnostic label or an assessed percentage guarantees a scholarship, pension, concession or reservation.

## Telangana: confirm the district assessment arrangement
The [Telangana Government’s state directory](${source.telangana.url}) links to [official SADAREM](https://sadarem.telangana.gov.in/). Check that route and the district’s notified medical authority for current assessment arrangements. Ask how local SADAREM assessment and the child’s UDID application are coordinated, where to attend and what to bring. Confirm before travelling; do not infer a current camp date from an old announcement.

## Andhra Pradesh: use the official SADAREM route
Use [Andhra Pradesh SADAREM](${source.andhra.url}) for current state notices. The [Konaseema district government guidance](${source.apDistrict.url}) directs families to the nearest Grama/Ward Sachivalayam and SADAREM for disability-certificate access. Ask your own district about the appropriate assistance point, current slot arrangements, notified assessment hospital and UDID coordination. A district example does not establish identical arrangements throughout the state.

## Every other State or Union Territory: find the responsible authority
Use **Know your Medical Authority** on the [national UDID portal](${source.authorities.url}) and select your State or Union Territory and district. This provides a practical official starting point for families across India. Contact the listed authority about the child’s condition, appointment, documents and available help. State procedures and individual schemes should be checked there.

## Validity, renewal and a delayed application
Check whether the document is temporary or permanent and note any expiry date. The [official UDID FAQs](${source.udidFaq.url}) explain renewal through the PwD dashboard for expired temporary documents, with the hospital’s reassessment instructions. They also identify the assigned medical authority or CMO/DMO as the follow-up contact when assessment has not been arranged. Keep your acknowledgement available.

If details or the assessment decision need review, ask the issuing authority about the appropriate correction, reassessment or appeal route and its current requirements.

## Keep administrative access and developmental support connected
At Pinnacle, we can discuss your child’s communication, learning and everyday participation alongside the reports you already have. [Speech therapy](${speech}), [occupational therapy](${occupational}) or [special education](${education}) may be relevant according to individual needs. A suitable plan and progress review can continue alongside the certificate application. PinnacleAI is non-diagnostic developmental-support software; the notified government medical authority makes the certification decision.

${contact('')}
`},
 'is-stimming-always-a-bad-sign-that-must-be-stopped':{
  title:'Is stimming bad? Hand-flapping, comfort and when to seek help',h1:'Does hand-flapping or stimming need to be stopped?',meta_title:'Stimming & Hand-Flapping: When Support Helps | Ask Pinnacle',meta_description:'Harmless stimming can support comfort and regulation. Understand hand-flapping, safety, school participation and when a professional conversation is useful.',summary:stimmingSummary,
  everyday_tip:'Notice when the movement happens and whether your child seems comfortable or distressed. Ask what they need, using their usual way of communicating.',
  what_to_watch:'Get appropriate healthcare advice for injury, pain, sudden changes or distress. If serious injury or immediate danger occurs, seek urgent medical help.',
  authority_links:[source.stimming,source.nice],
  faq:[{q:'Should I stop harmless hand-flapping?',a:'Usually no. If it is safe and your child is comfortable, hand-flapping may express enjoyment or help regulation. Looking different is not a reason to suppress it.'},{q:'Does stimming prove my child is autistic?',a:'No single movement establishes an autism diagnosis. If you have broader developmental concerns, discuss the whole picture with an appropriately qualified healthcare professional.'},{q:'What if stimming causes injury?',a:'Protect immediate safety and seek healthcare advice. A professional can assess pain, distress, communication and environmental factors, and discuss a safer way to meet the need.'},{q:'What should we discuss with school?',a:'Discuss what helps the child remain comfortable, communicate and participate. Agree safe space or breaks where useful, and review the setting and support before treating harmless movement as a problem.'}],
  answer_md:`## What stimming can mean
${stimmingSummary}

[Leicestershire Partnership NHS Trust](${source.stimming.url}) explains that repetitive movement or sound can provide comfort, sensory regulation and enjoyment. The same visible movement can mean different things in different moments. Hand-flapping alone does not establish a diagnosis.

## Respond to the child’s experience
Before intervening, ask: is my child comfortable, hurt, overwhelmed or trying to communicate? If the movement is harmless, make room for it. Avoid punishment or forcing still hands merely to look more typical.

For a parent or teacher, a useful observation is an ordinary sequence: what was happening, what the child did and what seemed to help. For example, ask whether a noisy transition could become quieter or more predictable. An observation is a clue for a conversation, not proof of a single cause.

## When support is useful
Injury, distress or serious difficulty eating, sleeping or participating deserve attention. [NICE guidance](${source.nice.url}) recommends considering communication, physical or mental health needs, routines and the social and sensory environment when assessing behaviour that challenges.

If a child is hurting themselves, protect immediate safety and obtain healthcare advice. Sudden changes may warrant a medical conversation about pain or illness. A professional can consider the function of the behaviour and a safer alternative that fits the child. Seek urgent medical help for serious injury or immediate danger.

## A practical conversation with school
Bring the discussion back to access and participation:

- When does our child appear comfortable, and when do they become distressed?
- Can we adjust noise, the transition or the amount of instruction?
- How can our child request help or a break?
- What would useful participation look like, while allowing safe movement?
- When will we review whether the support is helping?

These questions help adults agree a response that respects the child. A target to stop every stim does not tell you whether the child feels safe or can learn.

## Where Pinnacle support can fit
At Pinnacle, [occupational therapy](${occupational}) may help explore sensory and daily-participation needs. [Speech therapy](${speech}) may support ways to ask for help, and [behavioural support](${behaviour}) may be useful where safety or participation needs careful assessment. Discuss the child’s priorities and acceptable approaches; harmless stimming itself does not create a need for therapy. The goal is comfort, communication and growing independence, with review of what helps in real life.

${contact('occupational')}
`},
 'what-is-a-shadow-teacher-and-does-my-child-need-one':{
  title:'Shadow teacher: role, school questions and support decisions',h1:'What is a shadow teacher, and does my child need one?',meta_title:'Shadow Teacher: Role, Goals & School Planning | Ask Pinnacle',meta_description:'Decide what classroom support your child needs. Ask about a shadow teacher’s duties, supervision, goals, fees, alternatives and review with the school.',summary:shadowSummary,
  everyday_tip:'Ask the class teacher for two examples: a part of the day your child manages well and a part where they need help. Plan support around those situations.',
  what_to_watch:'Review support if the adult is speaking for the child, doing the work or separating them from peers. Also review if reducing help makes participation or safety worse.',
  authority_links:[source.ncert,source.act],
  faq:[{q:'Does every autistic child need a shadow teacher?',a:'No. A diagnosis alone does not tell you what classroom support is suitable. Consider the individual child, classroom demands, existing adjustments and the school’s plan.'},{q:'Is a shadow teacher automatically a qualified special educator?',a:'No. The job title alone does not establish qualifications. Ask about the person’s training, relevant credentials, experience and supervision, and the duties they will perform.'},{q:'Should support always be reduced?',a:'Review the amount and type of support against participation, wellbeing and safety. Reduce prompts or adult proximity when the child can manage successfully, while retaining accommodations and help they still need.'},{q:'Who should agree the role?',a:'Agree it with the school and family, involving the child and relevant professionals where useful. Document responsibilities, supervision, safeguarding, costs, communication and review.'}],
  answer_md:`## Understand the role before choosing a person
${shadowSummary}

Duties vary. Ask whether the proposed person will help with communication, transitions, participation, personal care or access to learning. The title alone does not establish a special-education qualification or a clinical role. Clarify training, credentials, relevant experience and who supervises their work.

## Start with the classroom situation
Ask your child’s teacher to describe specific moments: joining an activity, understanding instructions, moving between rooms, communicating a need or managing lunchtime. Include what already works and your child’s preferences. Compare these observations with home and relevant professional information.

An [IEP or individual school plan](${ASK}/what-is-an-iep-individualised-education-plan) helps put support around the child’s priorities. [NCERT’s framework](${source.ncert.url}) describes planning with families, a documented child profile and regular assessment. Decide what help is required in this setting; an autism diagnosis alone does not answer that question.

## Consider the school’s support as well as one-to-one help
Discuss classroom adjustments, accessible instructions, communication tools, predictable transitions, a quieter space, small-group teaching or support for particular parts of the day. These are options to examine with the school, not a promise that one will suit every child.

[Section 16 of India’s RPwD Act](${source.act.url}) addresses inclusive education, reasonable accommodation and necessary support for institutions funded or recognised by government. A shadow teacher should be discussed within the school’s inclusive-education responsibilities and the child’s actual needs.

## Questions to settle before starting
Use this meeting checklist:

| Question | What to agree |
| --- | --- |
| What is the purpose? | Specific learning, communication, wellbeing or participation priorities. |
| What will the adult do? | Tasks, boundaries and when the class teacher remains the lead. |
| Who supervises? | Named school contact and how suitable professional guidance is used. |
| How is safety managed? | Safeguarding, privacy, personal-care boundaries and escalation arrangements. |
| Who pays? | Fees, hours, absence cover and the written arrangement. |
| What will we review? | The child’s participation, comfort, help needed and access to peers. |

Avoid an arrangement defined only as “sit beside the child all day.” The adult should make the lesson more accessible and create opportunities for the child to act and communicate for themselves.

## Review independence without removing needed help
An **illustrative review question** is: “Can our child join the morning activity with the agreed visual cue, and what help is still needed?” Notice participation with the teacher and peers, not just compliance with the aide.

Where the child manages comfortably, the team can consider less prompting or more space. Where help remains necessary, keep it and improve how it is offered. Growing independence does not mean removing useful communication aids, accommodations or support on a fixed timetable.

## Connect school priorities with Pinnacle support
At Pinnacle, [special education](${education}) can help discuss learning priorities and a school plan. [Speech therapy](${speech}) or [occupational therapy](${occupational}) may contribute to classroom communication and routines where appropriate. Bring the school’s examples and proposed role so the team can discuss goals and everyday practice with you. Confirm the preferred centre’s actual service availability; this answer does not promise a shadow-teacher placement.

${contact('education')}
`}
};

export const priorityEditorialSlugs=Object.freeze(Object.keys(priorityCopy));
export function priorityEditorialAnswer(a:any){
 if(!a||a.lang!=='en'||!Object.hasOwn(priorityCopy,a.slug))return a;
 return {...a,...priorityCopy[a.slug],content_updated_at:'2026-10-08'};
}

const virtualSummary='“Virtual autism” is an informal label sometimes used for developmental concerns in children with heavy screen exposure. It is not a substitute for a recognised autism assessment. The American Academy of Pediatrics says evidence does not establish that screen use causes autism. Support healthier routines and seek assessment for concerns without waiting for a screen break to explain everything.';
const functioningSummary='“High-functioning autism” is an older informal label, often used when an autistic person speaks fluently or has average or higher intellectual ability. It is not a separate current diagnosis and can hide important support needs. Describe the child’s strengths and the help needed in each situation, rather than assuming a label tells the whole story.';
const curatedCopy:Record<string,Copy>={
 'what-is-virtual-autism':{
 title:'What is “virtual autism”? Screen time, evidence and next steps',h1:'What does “virtual autism” mean, and what should parents do?',meta_title:'Virtual Autism: Screen Time Evidence & Next Steps | Ask Pinnacle',meta_description:'Understand the informal virtual-autism label, what screen-time evidence can show, healthier routines and why developmental assessment should not be delayed.',summary:virtualSummary,
 everyday_tip:'Choose one ordinary daily routine for shared conversation or play. Make the change workable for your family and notice communication, comfort and sleep.',
 what_to_watch:'Discuss concerns about communication, social interaction, play or lost skills with your child’s doctor. Do not use improvement after a screen break as proof that autism was caused or ruled out.',
 authority_links:[source.media,source.autism],
 faq:[{q:'Is virtual autism a separate autism diagnosis?',a:'The phrase is an informal label. It should not replace a recognised developmental or autism assessment by an appropriately qualified healthcare professional.'},{q:'Does screen time cause autism?',a:'The American Academy of Pediatrics says evidence does not establish that screen media use causes autism. An association in a study does not prove causation, and screening scores are not the same as a diagnosis.'},{q:'Should I wait after reducing screens before seeking help?',a:'You can make supportive changes to routines and seek professional assessment at the same time. Do not delay a conversation about concerns or lost skills to complete a self-prescribed screen-break trial.'},{q:'Does improved interaction after reducing screens rule out autism?',a:'No. A change in routine can influence a child’s daily experience. Improvement does not, by itself, establish a cause or rule out autism.'}],
 answer_md:`## A label needs a careful explanation
${virtualSummary}

Families may hear the phrase after noticing speech, interaction or play concerns. It can sound like a diagnosis with a simple cause and cure. That conclusion goes beyond what the term or current evidence establishes. The [NHS explanation of autism](${source.autism.url}) describes a difference in brain development with varied communication, sensory and support needs.

## What the screen-time evidence can and cannot show
The [American Academy of Pediatrics’ evidence discussion](${source.media.url}) distinguishes studies of autism-like screening scores from autism diagnoses. It also explains that an observed association does not establish which came first or prove screens caused autism. A child’s developmental differences can influence their media use too.

Screen habits still matter. Time spent with a device can displace shared play, conversation, sleep or other useful experiences. Discuss the pattern in your family and choose practical changes. This is a reason to support a balanced day, not to blame a parent for a developmental condition.

## Act on the concern and support the routine together
If you are concerned about communication, social interaction, play or lost skills, speak with your child’s doctor and ask about developmental assessment. Bring ordinary examples and existing reports. Ask what else should be considered, including hearing or other needs when relevant.

At the same time, discuss a realistic family media plan. For example, choose one daily meal or play period for device-free time together, respond to the child’s interests and make changes predictably. Keep necessary communication aids and accessibility needs in mind; all screen use is not the same.

There is no self-test in which a set number of days without screens proves or disproves autism. Better interaction after a routine change is useful information to share with a professional, not proof of the cause or a cure.

## Questions for a professional conversation
- What does the label mean in our child’s case, and is it a recognised diagnosis?
- Which developmental abilities and everyday concerns need assessment?
- What support can begin while assessment is being arranged?
- What media changes suit our child’s age, needs and family routines?
- What will we review, and when should we seek help sooner?

## A useful next step at Pinnacle
At Pinnacle, we can discuss developmental-support priorities such as communication, play and participation. [Speech therapy](${speech}), [occupational therapy](${occupational}) or [integrated autism support](${SITE}/autism-therapy) may be appropriate for an individual child. We connect the starting picture with meaningful goals, suitable support, everyday practice and review toward growing independence. PinnacleAI and AbilityScore are non-diagnostic developmental-support tools; diagnosis requires an appropriately qualified healthcare professional.

${contact('')}
`},
 'what-is-high-functioning-autism':{
 title:'What is “high-functioning autism”? Strengths and support needs',h1:'What does “high-functioning autism” mean?',meta_title:'High-Functioning Autism: Meaning & Support Needs | Ask Pinnacle',meta_description:'Understand the older high-functioning-autism label, why fluent speech can hide support needs, and how families and schools can plan practical help.',summary:functioningSummary,
 everyday_tip:'Ask your child and teacher which parts of the day feel easy and which need effort or support. Include recovery after school, as well as visible classroom performance.',
 what_to_watch:'Take distress, exhaustion, pain, difficulty with daily routines or unmet communication needs seriously, even when a child speaks fluently or performs well academically.',
 authority_links:[source.language,source.oxford,source.autism],
 faq:[{q:'Is high-functioning autism a separate current diagnosis?',a:'No. It is an older informal label. Current assessment describes autism and the individual’s needs and coexisting conditions; the label should not substitute for that information.'},{q:'Does fluent speech mean little support is needed?',a:'No. Speech or academic ability does not describe sensory needs, wellbeing, daily living, social understanding or the support needed in different settings.'},{q:'What wording helps parents and schools?',a:'Describe concrete strengths and needs: what the child can do, what helps, what is difficult in a particular setting, and which accommodations or assistance support participation.'},{q:'Can a child’s support needs change?',a:'Yes. Needs can differ across environments, demands and stages of life. Review the school and home plan when participation, wellbeing or demands change.'}],
 answer_md:`## Understand the word without letting it define the child
${functioningSummary}

[Oxford Health NHS Foundation Trust](${source.oxford.url}) explains that older labels such as High Functioning Autism are no longer used in its current description of autism. A past report may still contain that wording. Ask the assessing professional to explain the current diagnosis and the child’s individual needs.

## Why the label can miss what matters
[Newcastle Hospitals NHS Foundation Trust](${source.language.url}) explains that autism does not run along a single line from high to low functioning. Children with more language have sometimes had other needs overlooked. A child may be strong in one area and need substantial help in another.

The [NHS autism guide](${source.autism.url}) describes differences in communication, learning and sensory experience. Intelligence varies, and other physical or mental health needs can coexist. Fluent conversation or good marks do not measure every part of everyday life.

## Make a practical strengths-and-support picture
Use these **discussion prompts**, rather than a home diagnostic checklist:

| Part of the day | What to understand |
| --- | --- |
| Communication | How does our child ask for help, clarify meaning or explain discomfort? |
| Learning | Which instructions, materials or ways of responding make learning accessible? |
| Sensory experience | What feels comfortable or overwhelming in this setting? |
| Daily routines | What helps with meals, dressing, transitions or organisation? |
| Relationships | How does our child prefer to join others, and what support helps? |
| Wellbeing | What does our child tell us, and what do we notice before or after demanding situations? |

Listen to the child’s own account, including their usual communication method. “They managed at school” and “they are exhausted at home” can both be useful observations. Explore the demands and support in each place.

## Plan help around participation
Discuss clear school goals in an [Individualised Education Plan](${ASK}/what-is-an-iep-individualised-education-plan) where appropriate. Agree useful adjustments and a review date. Avoid removing support just because speech or academic performance looks strong.

The aim is for the child to learn, communicate, feel comfortable and do more for themselves with the help they need. Review when the setting or demands change. Independence and receiving appropriate support can coexist.

## Connect the right support at Pinnacle
At Pinnacle, we discuss the child’s actual priorities rather than choosing a therapy bundle from a functioning label. [Speech therapy](${speech}), [occupational therapy](${occupational}), [special education](${education}) or [integrated autism support](${SITE}/autism-therapy) may contribute where appropriate. We connect assessment of abilities, goals, everyday practice and review toward growing independence and participation. PinnacleAI is non-diagnostic developmental-support software; diagnosis requires an appropriately qualified healthcare professional.

${contact('autism')}
`}
};

export const curatedPrioritySlugs=Object.freeze(Object.keys(curatedCopy));
// Manually curated public records: no claimed database row or human reviewer.
// The release owner must add these real editorial routes to publication/sitemap
// handling and supply the shared social-image/QR policy at that boundary.
export function curatedPriorityAnswer(slug:string){
 if(!Object.hasOwn(curatedCopy,slug))return null;
 return {slug,lang:'en',canonical:ASK+'/'+slug,meta_robots:'index, follow, max-image-preview:large',...curatedCopy[slug],content_updated_at:'2026-10-08',editorial:{developed_by:'Pinnacle Blooms Network',reviewed_by:null},related:[],alternates:[],dimensions:[],lenses:[],related_materials:[],related_techniques:[]};
}
