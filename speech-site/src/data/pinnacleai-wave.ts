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
    slug:'pinnacleai', short:'PinnacleAI®', label:'PinnacleAI® system', title:'PinnacleAI® | A Life-First Child Development System',
    description:'See how PinnacleAI connects a child’s everyday goal to assessment, relevant support, home practice and review. Explore each module and its Verify source.',
    eyebrow:'One child · One life to take part in', headline:'Your child’s life sets the direction. PinnacleAI helps keep the work connected.',
    lead:'What would your child like to communicate, do, learn and enjoy with more confidence? Begin there. Understand current abilities, choose meaningful goals with professionals, practise in real life, listen to the people who know the child and keep reviewing the next step.',
    direct:'PinnacleAI GPT-OS v1.0.0 is licensed in India as Class B non-diagnostic developmental-support software for children aged 0–12. It supports ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support. Families and qualified professionals make care decisions.',
    purpose:'A score is useful only when it helps people understand what to do next for the child’s everyday life. The life goal determines what to observe, which support to choose and what to review.',
    question:'How does one everyday goal move through the whole system?',
    exampleTitle:'Imagine joining the school morning with more confidence.',
    exampleLead:'This is an illustrative example, not a patient result. The family names one desired moment; relevant professionals decide which measures and supports fit.',
    example:[['Listen first','A family describes the child’s strengths, preferences and what makes the morning hard or possible.'],['Build a starting picture','A clinician-governed assessment and relevant Readiness views help identify abilities and support needs.'],['Choose and practise','The team connects suitable therapy and manageable everyday activities to that goal, at the centre and beyond.'],['Observe and correct','Family, teacher and clinicians share relevant observations with consent; the plan changes when evidence from life requires it.']],
    mechanismTitle:'One life-first loop, with human decisions at every turn.',
    mechanism:['AbilityScore® and seven Readiness Indexes describe a starting picture and areas to discuss.','The Personal Development Kernel carries relevant child-specific context into a revisable forecast and plan.','TherapeuticAI® and Everyday Therapy™ connect professional choices to suitable activities and family-guided practice.','Fusion brings observations back into review; reassessment compares change, no change or decline and helps correct the next step.'],
    limit:'The device is non-diagnostic. A licence, a software forecast or a network count does not prove what will happen for one child. Every child’s route, pace and needs differ.',
    takeaway:'The destination remains growing independence and participation. The technology helps people see whether the work is serving that direction.',
    sourceKeys:['model','workflow','md5','bis','research','scale'],
    faqs:[
      {question:'What is PinnacleAI?',answer:'PinnacleAI GPT-OS v1.0.0 is Class B non-diagnostic developmental-support software documented on an Indian Form MD-5 licence for children aged 0–12. It supports ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support.'},
      {question:'Does PinnacleAI diagnose autism or replace a clinician?',answer:'No. The licensed software is non-diagnostic. A suitable qualified professional evaluates the child, chooses relevant supports and reviews decisions with the family.'},
      {question:'Does PinnacleAI guarantee mainstream school or independence?',answer:'No. Growing self-sufficiency and participation set the direction; individual outcomes depend on the child and context and cannot be promised.'}
    ]
  },
  {
    slug:'abilityscore', updatedOn:'2026-10-01', includeReadingFaqs:true, short:'AbilityScore®', label:'AbilityScore®', title:'AbilityScore® | Understand Abilities, Plan for Everyday Life',
    description:'AbilityScore helps a professional discuss what a child can do now and which everyday goal may come next. See a toy-choice example, 0–1000 limits and sources.',
    eyebrow:'Start with what your child can do', headline:'Measure the starting picture. Keep your child bigger than any score.',
    lead:'You notice what your child understands, chooses, tries and enjoys. AbilityScore gives the care team a structured way to discuss current abilities and change over time, so the next goal can serve a real moment in life.',
    direct:'AbilityScore is the developmental ability-measurement component of PinnacleAI. A clinically governed assessment produces a displayed composite on a 0–1000 scale and separate Readiness views. The score is context for professional and family discussion, not a diagnosis or an intelligence label.',
    purpose:'The important question is not “How high is the number?” It is “What can the child use in everyday life, with what support, and what should become more possible next?”',
    question:'What can a starting measurement help a family see?',
    exampleTitle:'A request at home becomes a useful goal.',
    exampleLead:'Illustrative example only. A parent notices a child wants a favourite toy but needs help communicating the choice.',
    example:[['Observe a real moment','Record what the child already does to indicate a choice and what support makes it understandable.'],['Assess appropriately','A professional uses suitable measures to describe the relevant abilities; a caregiver questionnaire is not automatically the clinical score.'],['Choose a goal','The team agrees on an accessible way for the child to make the choice at home and, if relevant, in another setting.'],['Compare use over time','Later assessment considers whether the skill is becoming more usable, not merely whether a number moved.']],
    mechanismTitle:'A useful score starts a conversation; it cannot finish one.',
    mechanism:['The display summarises assessed abilities on a 0–1000 scale; its meaning depends on the instrument, age band and professional interpretation.','Seven Readiness Indexes remain distinct views; they are not substitutes for a child’s goals or an outcome guarantee.','The next assessment and everyday observations can reveal change, no change or a new need for support.'],
    limit:'AbilityScore does not diagnose autism, ADHD or another condition. The published external-validation protocol is not proof that a completed independent validation result is available.',
    takeaway:'Ask what an ability means for your child’s communication, routine, learning and participation—and what the team will do next.',
    sourceKeys:['workflow','methods','validation','md5','research'],
    faqs:[
      {question:'What does an AbilityScore of 0–1000 mean?',answer:'It is the displayed scale for a structured developmental ability measure. A clinician must interpret the current assessment and the child’s age and context; a single number does not describe the child’s whole life.'},
      {question:'Is AbilityScore an autism or IQ test?',answer:'No. The licensed software is non-diagnostic, and the score is not presented as an autism diagnosis or a stand-alone IQ result.'},
      {question:'Can a parent complete the clinical score alone?',answer:'No. AbilityScore is clinician-administered and clinically governed. Family questionnaires and everyday observations contribute essential context; they do not replace clinical administration or let a parent complete the clinical score alone.'}
    ]
  },
  {
    slug:'seven-readiness-indexes', short:'7 Readiness Indexes', label:'Seven Readiness Indexes', title:'Seven Readiness Indexes | A Fuller View of Your Child’s Next Step',
    description:'Explore seven PinnacleAI Readiness views through a child’s peer-play goal. See what each view can help discuss, its limits and the BIS source.',
    eyebrow:'Seven views · One child', headline:'See different kinds of readiness without reducing your child to one label.',
    lead:'A child may be ready to do one thing with less support while another part of life still needs a different approach. Seven separate views help a team ask better questions about communication, movement, learning, routines and participation.',
    direct:'The BIS record names School, Speech, Motor, Study IQ, Behavior, Self Sufficiency and Mainstream Inclusion Readiness Indexes. These are separate software views that support discussion and planning; they do not certify school entry, intelligence, social worth or future independence.',
    purpose:'Readiness is useful when it points to a meaningful next opportunity in the child’s life and the support needed to try it.',
    question:'Why look at seven views instead of one broad judgement?',
    exampleTitle:'A classroom goal has more than one doorway.',
    exampleLead:'Illustrative example only. A child enjoys group play but needs help asking a peer to join.',
    example:[['Notice strengths','The child may already follow a routine and enjoy peers.'],['Look at relevant views','Communication and school participation might matter here; the other views remain context rather than automatic targets.'],['Choose suitable support','A professional and family agree on an accessible invitation method and what the school can do.'],['Review in real life','The team asks whether the child could join and enjoy play, not whether an index alone improved.']],
    mechanismTitle:'The seven named views can guide a question, not dictate a child’s future.',
    mechanism:['School Readiness and Speech Readiness consider relevant abilities for learning access and communication.','Motor Readiness, Study IQ Readiness and Behavior Readiness are named report areas, not claims of an IQ test or a behaviour diagnosis.','Self Sufficiency Index and Mainstream Inclusion Index keep daily independence and participation visible as directions for review.'],
    limit:'The names are those printed in the BIS schedule. They should not be read as a formal school admission decision or a promise of mainstream placement. Report versions have used different display scales; use the current report and professional explanation.',
    takeaway:'Ask which view matters for your child’s current goal, what was actually assessed and how the next step will be reviewed.',
    sourceKeys:['workflow','bis','methods','md5'],
    faqs:[
      {question:'What are the seven PinnacleAI Readiness Indexes?',answer:'The BIS schedule names School, Speech, Motor, Study IQ, Behavior, Self Sufficiency and Mainstream Inclusion Readiness Indexes.'},
      {question:'Does a School Readiness Index guarantee admission?',answer:'No. It is a planning and review view, not a school admission decision or guarantee.'},
      {question:'Does Study IQ Readiness mean PinnacleAI provides an IQ diagnosis?',answer:'No. It is the name of a software report area. The licensed device is non-diagnostic.'}
    ]
  },
  {
    slug:'personal-development-kernel', updatedOn:'2026-10-01', short:'Personal Development Kernel', label:'Personal Development Kernel', title:'Personal Development Kernel | Keep Your Child’s Context Connected',
    description:'See how PinnacleAI’s Personal Development Kernel keeps a child’s home and school context available for authorised professional review.',
    eyebrow:'Continuity for a real child', headline:'Your child’s story should not reset at every appointment.',
    lead:'What helps at home may be different from what helps at school. The Personal Development Kernel, or PDK, is the child-specific record concept that keeps relevant observations, priorities and responses available for authorised review.',
    direct:'The PDK is Pinnacle’s child-specific record concept for organising measurements, goals, developmental history, environments and responses to activities. It is a record and planning aid within the broader system, not an autonomous decision-maker or a separately claimed diagnostic device.',
    purpose:'Continuity matters when a child’s team needs to see what was tried, where it worked, where it did not and what the family wants to change.',
    question:'How does one observation stay useful over time?',
    exampleTitle:'A routine works at home but not yet at school.',
    exampleLead:'Illustrative example only. The family sees a child put on shoes with a picture sequence; the teacher sees a different need at a busy school doorway.',
    example:[['Record with context','Document the support, setting and child response rather than a bare “can/cannot” label.'],['Respect access','Share relevant school observations only through appropriate consent and authorised roles.'],['Compare settings','The team sees what transfers and what needs an environmental adjustment.'],['Use it in review','A professional changes the next support and records why.']],
    mechanismTitle:'One child-specific record can connect facts that otherwise drift apart.',
    mechanism:['Inputs are selected because they matter to the child and the agreed goal.','Context includes the setting and help provided, not only the activity result.','The professional uses the record to review the plan; families can question and correct their observations.'],
    limit:'The PDK name describes an internal architecture layer in the source methods. It is not a claim of a stand-alone regulatory approval, a public child dossier or automatic clinical judgement. Child records remain private.',
    takeaway:'Ask how family observations enter review, who can see them and how a change in the plan is explained.',
    sourceKeys:['workflow','dossier','methods','md5'],
    faqs:[
      {question:'What is the Personal Development Kernel?',answer:'It is Pinnacle’s child-specific record concept for keeping relevant assessed abilities, goals, settings and responses connected over time for authorised professional review.'},
      {question:'Does the PDK decide therapy for my child by itself?',answer:'No. The record supports a professional and family discussion; it does not replace human judgement or consent.'},
      {question:'Are children’s individual records public on Verify?',answer:'No. Verify publishes evidence about methods and scope, not private child records.'}
    ]
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
    slug:'everyday-therapy', short:'Everyday Therapy™', label:'Everyday Therapy™', title:'Everyday Therapy™ | Carry Meaningful Practice into Real Life',
    description:'Everyday Therapy brings one professionally guided step into an ordinary family routine. See a mealtime example and how observations return to review.',
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
