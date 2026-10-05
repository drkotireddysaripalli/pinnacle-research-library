import {pdkContent} from './pdk-content.ts';
import {abilityContent} from './abilityscore-content.ts';
import {readinessContent} from './readiness-content.ts';
export const waveSources = {
  model: '/verify/evidence/pinnacle-paradigm-shift.html',
  workflow: '/verify/#how-pinnacleai-works',
  md5: '/verify/evidence/records/md5.html',
  bis: '/verify/evidence/records/bis.html',
  fsc: '/verify/evidence/records/fsc.html',
  research: '/verify/evidence/research-library.html',
  methods: '/verify/evidence/records/methodology.html',
  dossier: '/verify/evidence/records/dossier.html',
  validation: '/verify/evidence/records/external-validation.html',
  scale: '/verify/evidence/scale-and-mission.html',
  studies: '/verify/evidence/records/study-portfolio.html',
  citation: '/verify/evidence/cite.html'
};

export const pinnacleWave = [
  {
    slug:'pinnacleai', updatedOn:'2026-10-02', includeReadingFaqs:true, short:'PinnacleAI®', label:'PinnacleAI® system', title:'PinnacleAI® | Abilities, Therapies & Everyday Life',
    description:'Discover PinnacleAI: ability measurement, child-specific planning, integrated therapies and family practice towards self-sufficiency and inclusion. 9100 181 181.',
    eyebrow:'Pinnacle Blooms Network · The whole system. One purpose.', headline:'One system. Your child’s whole life.',
    lead:'Your child’s self-sufficient, mainstream-included life is the purpose from the beginning. PinnacleAI® brings ability measurement, a child-specific plan, integrated therapies, everyday practice and review into one system built around that purpose.',
    direct:'PinnacleAI GPT-OS v1.0.0 is licensed in India as Class B non-diagnostic developmental-support software for children aged 0–12. It supports ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support. Families and qualified professionals make care decisions.',
    purpose:'Your child’s self-sufficient, mainstream-included life is the purpose: doing more with growing independence and taking part at home, school and in the community. That purpose shapes the abilities, goals, methods, people, practice and review.',
    question:'How does one everyday goal move through the whole system?',
    exampleTitle:'“I want my child to ask for help—and join in.”',
    exampleLead:'Imagine a child who loves building with blocks. Their family wants that enjoyment to become shared play at home and school. Here is how PinnacleAI connects that priority to a plan people can act on. This is an illustrative example, not a patient result.',
    example:[
      ['Begin with a strength','The child chooses a favourite block with a gesture or picture. The family explains what the child enjoys and which shared activity they would like to make easier.'],
      ['Agree a useful next goal','Assessment and professional discussion help identify an accessible help request. The family understands what is being worked on, why, and which support makes it possible.'],
      ['Choose the right contributions','The responsible professional selects suitable communication, movement or learning support. The goal guides the team; every child does not need every therapy.'],
      ['Practise where life happens','A familiar adult offers manageable block play at home. With consent and the teacher’s agreement, a similar opportunity may fit a comfortable classroom activity. The child can pause or decline.'],
      ['Notice what made it possible','Was the request understood? Which cue helped? Did noise, group size or comfort affect joining in? Family and professional observations give these details a place in review.'],
      ['Change something specific','If asking is comfortable at home but harder in a noisy group, consider a quieter opportunity, a clearer cue or different support. Record why the plan changes; compare the next observations and reassess as appropriate.']
    ],
    mechanismTitle:'The PinnacleAI® mechanism: the whole system working towards the child’s life.',
    mechanism:['AbilityScore® and seven Readiness Indexes: relevant assessment and context → an explained starting picture.','Personal Development Kernel: starting picture, family priorities and setting → child-specific context for authorised review.','Prognose: child context and a meaningful goal → a revisable plan and checkpoint.','TherapeuticAI®: professionally selected goals → suitable guided activities.','Everyday Therapy™: agreed guidance → manageable practice in everyday routines.','Fusion: consented observations from relevant settings → information for family and professional review.','Review and reassessment: assessment plus everyday observations → continue, change the cue, environment or support, or reconsider the goal. The next decision returns to the child’s context and plan.'],
    limit:'The device is non-diagnostic. A licence, a software forecast or a network count does not prove what will happen for one child. Every child’s route, pace and needs differ.',
    takeaway:'The destination remains growing independence and participation. The technology helps people see whether the work is serving that direction.',
    sourceKeys:['model','workflow','md5','bis','fsc','research','methods','dossier','validation','studies','scale','citation'],
    faqs:[
      {question:'What is the PinnacleAI Paradigm Shift?',answer:'The PinnacleAI Paradigm Shift begins with the child’s self-sufficient, mainstream-included life as the purpose. That purpose determines the abilities to understand, goals to choose, therapies and people to involve, everyday practice, tracking, correction and reassessment. The family helps shape the journey with qualified professionals.'},
      {question:'How does Everyday Therapy connect home and the professional team?',answer:'A professional demonstrates suitable practice and explains its purpose. Your family agrees what fits familiar routines, notices the child’s response and shares relevant observations. Everyday Therapy and Fusion connect this practice and information to professional review; the team can change support, the setting or the next goal.'},
      {question:'What is PinnacleAI?',answer:'PinnacleAI GPT-OS v1.0.0 is Class B non-diagnostic developmental-support software documented on an Indian Form MD-5 licence for children aged 0–12. It supports ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support.'},
      {question:'How do the PinnacleAI parts work together?',answer:'AbilityScore and the seven Readiness Indexes inform a starting picture. The Personal Development Kernel brings child context into a revisable Prognose plan. Professionals choose suitable TherapeuticAI activities and Everyday Therapy practice. Fusion brings consented observations into review and reassessment, which can change the child’s next plan.'},
      {question:'How does an everyday priority become a plan?',answer:'For example, a child who enjoys blocks may need an accessible way to ask for help and join shared play. The family and professional agree a suitable request, choose support, consider manageable practice and review where the request is understood. A quieter setting or clearer cue may become the next adjustment. This is an illustrative example, not an observed patient result.'},
      {question:'What is my family’s role?',answer:'You help choose priorities, explain what your child enjoys, agree manageable guided practice and share observations. You can question the plan and discuss what needs to change. Relevant school observations are included with appropriate consent. Qualified professionals remain responsible for clinical decisions.'},
      {question:'Does every child need every therapy?',answer:'No. The responsible professionals recommend the contributions relevant to the child’s assessed abilities, priorities and needs. Speech therapy, occupational therapy, behavioural support and special education can work together where appropriate; the family discusses the proposed plan and reviews it with the team.'},
      {question:'What happens when I call or send an enquiry?',answer:'Tell us one everyday priority. Our team can explain the suitable professional and centre, what a first visit involves, appointment availability and fees. Telephone guidance is free. Assessment and therapy fees are confirmed separately before you decide. Sending the form starts an enquiry, not a confirmed appointment or admission.'},
      {question:'Does PinnacleAI diagnose autism or replace a clinician?',answer:'No. The licensed software is non-diagnostic. A suitable qualified professional evaluates the child, chooses relevant supports and reviews decisions with the family.'},
      {question:'Does PinnacleAI guarantee mainstream school or independence?',answer:'No. Growing self-sufficiency and participation set the direction; individual outcomes depend on the child and context and cannot be promised.'}
    ]
  },
  {
    slug:'abilityscore', updatedOn:abilityContent.updated, includeReadingFaqs:true, short:'AbilityScore®', label:'AbilityScore®', title:abilityContent.title,
    description:abilityContent.description,
    eyebrow:'Start with what your child can do', headline:'Measure the starting picture. Keep your child bigger than any score.',
    lead:abilityContent.lead,
    direct:abilityContent.direct,
    purpose:abilityContent.purpose,
    question:'What can a starting measurement help a family see?',
    exampleTitle:abilityContent.example.title,
    exampleLead:abilityContent.example.intro,
    example:abilityContent.example.steps,
    mechanismTitle:'A useful score starts a conversation; it cannot finish one.',
    mechanism:['The display summarises assessed abilities on a 0–1000 scale; its meaning depends on the instrument, age band and professional interpretation.','Seven Readiness Indexes remain distinct views; they are not substitutes for a child’s goals or an outcome guarantee.','The next assessment and everyday observations can reveal change, no change or a new need for support.'],
    limit:'AbilityScore does not diagnose autism, ADHD or another condition. The published external-validation protocol is not proof that a completed independent validation result is available.',
    takeaway:'Ask what an ability means for your child’s communication, routine, learning and participation—and what the team will do next.',
    sourceKeys:['workflow','methods','validation','md5','bis','dossier','research'],
    faqs:abilityContent.faqs
  },
  {
    slug:'seven-readiness-indexes', updatedOn:readinessContent.updated, includeReadingFaqs:true, short:'7 Readiness Indexes', label:'Seven Readiness Indexes', title:readinessContent.title,
    description:readinessContent.description,
    eyebrow:'Seven views · One child', headline:'See different kinds of readiness without reducing your child to one label.',
    lead:'A child may be ready to do one thing with less support while another part of life still needs a different approach. Seven separate views help a team ask better questions about communication, movement, learning, routines and participation.',
    direct:readinessContent.direct,
    purpose:readinessContent.purpose,
    question:'Why look at seven views instead of one broad judgement?',
    exampleTitle:readinessContent.example.title,
    exampleLead:readinessContent.example.intro,
    example:readinessContent.example.steps,
    mechanismTitle:'The seven named views can guide a question, not dictate a child’s future.',
    mechanism:['School Readiness and Speech Readiness consider relevant abilities for learning access and communication.','Motor Readiness, Study IQ Readiness and Behavior Readiness are named report areas, not claims of an IQ test or a behaviour diagnosis.','Self Sufficiency Index and Mainstream Inclusion Index keep daily independence and participation visible as directions for review.'],
    limit:'The names are those printed in the BIS schedule. They should not be read as a formal school admission decision or a promise of mainstream placement. Report versions have used different display scales; use the current report and professional explanation.',
    takeaway:'Ask which view matters for your child’s current goal, what was actually assessed and how the next step will be reviewed.',
    sourceKeys:['workflow','bis','dossier','methods','md5'],
    faqs:readinessContent.faqs
  },
  {
    slug:'personal-development-kernel', updatedOn:pdkContent.updatedOn, includeReadingFaqs:true, short:'Personal Development Kernel', label:'Personal Development Kernel', title:'Personal Development Kernel (PDK) | PinnacleAI Child Context',
    description:'How PinnacleAI connects a child’s home and school observations with professional review and the next support. Explore PDK, its sources and a practical example.',
    eyebrow:'PinnacleAI® · Keep the context behind the next step', headline:pdkContent.opening,
    lead:pdkContent.lead, direct:pdkContent.direct, purpose:pdkContent.purpose,
    question:'What can the team learn when a routine feels different at home and school?',
    exampleTitle:pdkContent.example.title, exampleLead:pdkContent.example.intro,
    example:[['Compare the observations',pdkContent.example.observations.map(o=>o.setting+': '+o.context+' '+o.observed+' '+o.meaning).join(' ')],['Choose a specific adaptation',pdkContent.example.decision],['Keep a checkpoint',pdkContent.example.checkpoint],...pdkContent.example.reviews.map(r=>[r.title,r.text])],
    mechanismTitle:'Useful information in. An explained next step out.',
    mechanism:pdkContent.architecture.map(a=>a.title+': '+a.text),
    limit:'PDK is an internal architecture concept, not a separately approved medical device or an autonomous decision-maker. This public example contains no child data. Verify publishes evidence about the system, not individual child records. Described consent and access roles do not independently establish operational security.',
    takeaway:'Tell us one routine that feels different at home and school. Ask how a professional would use those observations to plan and review the next step.',
    sourceKeys:['workflow','dossier','methods','md5'], faqs:pdkContent.faqs
  },
  {
    slug:'prognose', short:'Prognose', label:'Prognose', title:'Prognose | A Revisable Forecast for Child-Specific Planning',
    description:'Prognose supports a revisable next goal and checkpoint. Follow a playground example and see how observation can change the plan.',
    eyebrow:'A forecast is a question to test', headline:'Plan ahead. Keep listening to what your child actually does.',
    lead:'A useful plan looks forward, but it also leaves room for surprise. Prognose supports progress forecasting and a child-specific planning conversation; each estimate needs to be checked against later observation and professional judgement.',
    direct:'Prognose is the named forecasting function in the PinnacleAI/BIS module map. It can support goal selection and checkpoints based on assessed information. It does not foretell a child’s future, prescribe a fixed therapy dose or guarantee a score by a date.',
    purpose:'The forecast matters only if it helps the team choose a meaningful next step and notice early when the plan needs to change.',
    question:'How can a forecast help without becoming a promise?',
    exampleTitle:'Preparing for a playground invitation.',
    exampleLead:'Illustrative example only. A child wants to join a familiar game with another child.',
    example:[['Describe now','The team understands the child’s communication, motor access, preferences and environment.'],['Set a testable next step','A short goal might be a comfortable way to initiate or accept one invitation.'],['Choose checkpoints','Family and professionals agree what they will observe in relevant real settings.'],['Revise the estimate','If the child responds differently than forecast, the team changes support or timing instead of blaming the child.']],
    mechanismTitle:'A forecast needs checkpoints and humility.',
    mechanism:['Starting measures and goals inform a possible path.','The plan names what to observe and when to review it.','New information can strengthen, narrow or overturn the estimate.'],
    limit:'Current public Verify records do not establish a completed external predictive-validation result. A forecast is decision support, not an independently proven prediction for an individual child.',
    takeaway:'Ask which assumptions the forecast uses, what would change the plan and who makes that decision.',
    sourceKeys:['workflow','bis','validation','md5'],
    faqs:[
      {question:'Can Prognose predict when my child will be independent?',answer:'No. It supports a revisable planning estimate; no individual endpoint or date can be guaranteed.'},
      {question:'Who changes the plan if the forecast is wrong?',answer:'The responsible professional reviews new assessment and everyday observations with the family and adjusts the plan as appropriate.'},
      {question:'Is the forecast a diagnosis?',answer:'No. PinnacleAI is licensed as non-diagnostic developmental-support software.'}
    ]
  },
  {
    slug:'therapeuticai', short:'TherapeuticAI®', label:'TherapeuticAI®', title:'TherapeuticAI® | Connect a Child’s Goal to Guided Therapy',
    description:'TherapeuticAI connects a child’s life goal to professionally chosen activity, guided use and response review. Follow one play-box example.',
    eyebrow:'The right activity has a reason', headline:'Therapy should serve the life your child is growing into.',
    lead:'A technique may help a child practise a skill. The important question is why that skill matters to the child and how it will become useful beyond the session. TherapeuticAI helps organise suitable activities around professionally chosen goals.',
    direct:'The BIS schedule describes Everyday Therapy delivered through TherapeuticAI and an adaptive therapy-plan support function. Professional assessment and family priorities determine what is suitable. The software supports selection, delivery and tracking; it does not independently prescribe treatment.',
    purpose:'Speech, occupational, behavioural and educational contributions may each be useful when they serve a particular child’s daily participation; no fixed combination is assumed.',
    question:'How does a goal become the right kind of practice?',
    exampleTitle:'From requesting help to joining play.',
    exampleLead:'Illustrative example only. A child wants help opening a play box so a shared game can begin.',
    example:[['Name the life moment','The child’s wish to join play gives the activity its purpose.'],['Select with judgement','A relevant professional chooses an accessible communication or motor support and checks comfort and preference.'],['Practise with meaning','The technique is used in the session and an agreed natural moment, rather than repeated for a score alone.'],['Review response','Family and therapist discuss what the child used, what support remained and whether to adapt.']],
    mechanismTitle:'The activity is one part of an accountable plan.',
    mechanism:['A real-life goal determines what ability matters.','Qualified professionals select appropriate support and coordinate with family and other disciplines as relevant.','Observed response returns through Fusion and later reassessment.'],
    limit:'A BIS licence and module name do not certify an individual therapist, establish treatment effectiveness or mean every therapy is appropriate for every child.',
    takeaway:'Ask why each suggested activity belongs in your child’s life, who chose it and how it will be reviewed.',
    sourceKeys:['workflow','bis','md5','model','research'],
    faqs:[
      {question:'Does TherapeuticAI replace my child’s therapist?',answer:'No. It supports a professionally selected, family-informed plan; clinicians and families remain responsible for care decisions.'},
      {question:'Must my child receive speech, occupational, ABA and special education together?',answer:'No. Suitable disciplines and activities depend on assessment, family priorities and the child’s needs.'},
      {question:'Does the BIS record prove an activity will work?',answer:'No. It documents the product and quality-system scope, not an individual clinical result.'}
    ]
  },
  {
    slug:'everyday-therapy', updatedOn:'2026-10-05', short:'Everyday Therapy™', label:'Everyday Therapy™', title:'Everyday Therapy™ | Carry Meaningful Practice into Real Life',
    description:'Guided practice, family observations and professional review: follow one table-setting goal from the child’s plan into a meaningful everyday moment.',
    eyebrow:'Life happens between appointments', headline:'Make the day itself part of the child’s opportunity to grow.',
    lead:'A child learns in play, mealtime, getting dressed, travel, school and conversation. Everyday Therapy brings agreed, manageable practice into those moments with family guidance and professional review.',
    direct:'Pinnacle’s documented Everyday Therapy workflow links goal-specific activities to family practice and feedback. The source method describes a four-day look-ahead in one version; the actual plan and pace should be selected for the child rather than treated as a fixed daily quota.',
    purpose:'Home is not a second clinic. The family helps a skill become useful in ordinary life without carrying the professional’s responsibility alone.',
    question:'What does supported everyday practice feel like?',
    exampleTitle:'Getting ready to eat together.',
    exampleLead:'Illustrative example only. A child wants to take part in a family meal but finds one step difficult.',
    example:[['Choose one moment','The family and professional agree on a small, worthwhile participation goal.'],['Demonstrate an approach','The professional explains an accessible cue, adaptation or activity and checks that it suits the child.'],['Try it in normal life','The family uses it briefly in a natural mealtime when appropriate; comfort and consent matter.'],['Bring back observations','What worked, what felt hard and what the child preferred guide the next review.']],
    mechanismTitle:'Short, relevant practice travels through real settings.',
    mechanism:['Goals and professional selection determine the activity.','Family-guided use helps test whether it transfers to daily life.','Feedback tells the team to continue, adapt, pause or change the approach.'],
    limit:'The described programme does not mean all children receive the same number of techniques or that parents must deliver therapy themselves. No particular improvement or schedule is guaranteed.',
    takeaway:'Ask for a manageable activity you understand, why it matters and an easy way to report what happens.',
    sourceKeys:['workflow','methods','bis','model'],
    faqs:[
      {question:'Is Everyday Therapy homework for parents?',answer:'It is guided use of suitable skills in natural moments. Families should agree on manageable practice with the professional; they are not responsible for replacing therapy.'},
      {question:'Does every child receive the same daily activities?',answer:'No. The child-specific plan determines relevant activities and their frequency. A source description of a four-day look-ahead is not a universal prescription.'},
      {question:'What if an activity is uncomfortable or does not help?',answer:'Share that observation with the professional. The plan should be reviewed and adapted rather than continued mechanically.'}
    ]
  },
  {
    slug:'fusion-module', updatedOn:'2026-10-01', includeReadingFaqs:true, short:'Fusion', label:'Fusion tracking and correction', title:'Fusion | Bring Family, School and Clinical Observations into Review',
    description:'Fusion brings relevant therapy, home and consented school observations into human review, so the child’s next support can change with evidence.',
    eyebrow:'You see more than a session can see', headline:'Bring the child’s whole day into the next decision.',
    lead:'A professional sees a child at an appointment. Parents, caregivers and teachers may see a different picture in meals, play and learning. Fusion is the tracking-and-correction part of the system that helps relevant observations return to professional review.',
    direct:'The BIS scope names a Clinical Tracking/Correction Fusion module. Pinnacle’s method describes activity ratings and relevant input from authorised roles. It helps people ask what is working and what to change; it is not automatic clinical correction without human oversight.',
    purpose:'A child’s progress should be understood in the places where the skill matters, including when it is not transferring as hoped.',
    question:'How does a family observation become a better next step?',
    exampleTitle:'A request works in therapy, but not yet in the school playground.',
    exampleLead:'Illustrative example only. The child makes a request in a familiar room; outdoors, the same approach is hard to use.',
    example:[['Notice the difference','The family reports the setting, support and child’s response without blaming anyone.'],['Bring relevant voices','A therapist and, with consent, a teacher may add what they observed. Not every child needs every rater role.'],['Review the reason','The professional considers noise, timing, communication method, motivation and comfort.'],['Correct the plan','A different cue or environment may be tried, then checked again in real life.']],
    mechanismTitle:'Feedback closes the loop when it changes an accountable decision.',
    mechanism:['Observations include context, not only a star or score.','Relevant people contribute through authorised, consent-aware roles.','The professional explains whether to continue, adapt, pause or refer.'],
    limit:'The source paper describes several possible rater roles; that does not mean six people observe every child. Individual records and ratings remain private.',
    takeaway:'Bring one observation from daily life and ask what it changes in the plan.',
    sourceKeys:['workflow','bis','dossier','methods','md5'],
    faqs:[
      {question:'What is PinnacleAI Fusion?',answer:'Fusion is the named clinical tracking and correction module. It helps relevant observations return to the child-specific professional review.'},
      {question:'Does the system change therapy automatically?',answer:'No. Professionals review the child’s response and explain appropriate changes with the family.'},
      {question:'Will school information be shared without permission?',answer:'School and other external observations should be shared only through appropriate consent and authorised roles.'}
    ]
  },
  {
    slug:'reassess-review-repeat', short:'Reassess · Review · Repeat', label:'Reassess, Review and Repeat', title:'Reassess, Review and Repeat | Keep the Child’s Plan Accountable',
    description:'Reassess, Review and Repeat compares a child’s everyday skill over time and helps the family and team decide what to keep or change.',
    eyebrow:'A plan is allowed to change', headline:'Keep what helps. Change what does not. Keep your child’s life in view.',
    lead:'A new ability may appear, a support may stop helping or a setting may change. Reassessment gives the child’s team a reason to compare today with the starting picture and choose the next step with the family.',
    direct:'Pinnacle’s documented workflow describes periodic reassessment, updated AbilityScore and Readiness views, and plan correction. The methods preprint discusses monthly review in one programme; the right schedule for a child is a professional decision, not a universal promise.',
    purpose:'Review asks whether a skill is becoming useful in life and whether the child’s comfort, goals and context still fit the plan.',
    question:'What should a useful review actually decide?',
    exampleTitle:'The child can now pack a bag—with one important exception.',
    exampleLead:'Illustrative example only. At home the child completes most steps, while a busy school arrival still needs support.',
    example:[['Compare fairly','Look at the same ability with the support and environment clearly described.'],['Listen to life','Family and teacher observations show where the skill transfers and where it does not.'],['Make a real decision','The team may keep a useful support, change a cue, address the setting or choose a new goal.'],['Check again','Later measurement and observation test whether that decision helped.']],
    mechanismTitle:'Measure → listen → decide → adapt → measure again.',
    mechanism:['Change, no change and decline all deserve an honest explanation.','A meaningful review connects assessed abilities to participation outside the assessment setting.','The child and family remain active partners in deciding what matters next.'],
    limit:'Repeated reassessment does not guarantee a child will become independent or receive school placement. A score change alone is not proof of a particular life outcome.',
    takeaway:'Ask what changed in everyday life, what remains difficult, what the team decided and when that decision will be revisited.',
    sourceKeys:['workflow','methods','bis','studies','model'],
    faqs:[
      {question:'How often should a child be reassessed?',answer:'A source method describes monthly reassessment in one programme. The suitable schedule depends on the child and should be agreed with the responsible professional.'},
      {question:'What if the score stays the same or goes down?',answer:'Review the measure, setting, supports, health and everyday observations. A professional and family can then decide whether to adapt the goal or support.'},
      {question:'Is repeating therapy until independence guaranteed?',answer:'No. Growing independence and participation are directions for planning. Each child’s outcomes, pace and supports differ.'}
    ]
  }
] as const;

export type PinnacleWavePage = (typeof pinnacleWave)[number];
