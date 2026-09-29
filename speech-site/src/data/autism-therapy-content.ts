import type { ServiceContent } from './service-content';
import hero from '../assets/autism-life-journey-20260929.png';
import pathway from '../assets/autism-integrated-support-20260929.png';
import { autismTherapyPath, url } from './site';

export const autismEnquiry=url('/enroll-autism-speech-aba-therapies-india?service=autism');

const stages = [
  ['measure','Understand strengths, abilities and support needs','Begin with what the child already does, prefers and communicates, alongside the moments that need support.'],
  ['compass','Agree an everyday-life direction','Choose priorities with the family around communication, routines, learning, play, safety and participation.'],
  ['people','Select relevant contributions','Bring in only the professionals and supports indicated by the child-specific picture.'],
  ['plan','Build one connected plan','Give goals, methods, people and review points one shared direction rather than separate therapy lists.'],
  ['home','Practise in meaningful moments','Use manageable, agreed supports in suitable home, school and community routines.'],
  ['track','Track, review and correct','Ask what the child could use, where it worked, what support remained and what should change.'],
  ['loop','Reassess and continue','Update the plan as abilities, needs, contexts and participation change.']
];

export const autismTherapyContent: ServiceContent = {
  id:'autism-therapy', path:autismTherapyPath, label:'Autism Therapy',
  name:'Autism therapy and developmental support for children', type:'Child-specific coordinated developmental support',
  title:'Autism Therapy & Developmental Support for Children | Pinnacle Blooms',
  description:'Child-specific autism support for communication, routines, learning, play and participation. Explore the life-first pathway, find a centre or call 9100 181 181.',
  enquiry:{url:autismEnquiry,label:'Start my child’s first conversation',mobileLabel:'First conversation'},
  guidanceNote:'Free guidance, 24/7. You do not need to choose a therapy before you call.',
  discover:{label:'See how the connected pathway works',href:'#pinnacle-difference'},
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/paradigm/04-one-shared-direction.html',
    '/verify/evidence/paradigm/05-practice-in-everyday-life.html','/verify/evidence/paradigm/06-feedback-that-shapes-care.html',
    '/verify/evidence/records/md5.html','/verify/evidence/records/bis.html','/verify/evidence/records/fsc.html',
    '/verify/evidence/research-library.html','/verify/evidence/centre-entity-reference.html'
  ].map(url).concat([
    'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
    'https://www.nice.org.uk/guidance/cg170/chapter/Recommendations',
    'https://www.nice.org.uk/guidance/cg128/chapter/Recommendations',
    'https://www.cdc.gov/autism/diagnosis/index.html',
    'https://rehabcouncil.nic.in/norms-guidelines/'
  ]),
  image:{source:hero,alt:'An Indian child communicates and plays with family, manages an everyday routine, participates in class and plays with peers, linked by a colourful developmental pathway.',caption:'See the whole child. Connect support with communication, routines, learning, play and participation.'},
  hero:{
    heading:'See your whole child.',
    emphasis:'Build abilities for everyday life.',
    lead:'Communicate. Manage daily routines. Learn. Play. Take part.',
    copy:'Autism can affect different children in different ways. Tell us what your child enjoys, what feels difficult and what you want to become more possible. We bring family knowledge, child-specific assessment and the right professional contributions into one life-first direction.',
    moments:[{icon:'voice',label:'Communicate needs and choices'},{icon:'home',label:'Navigate everyday routines'},{icon:'people',label:'Learn, play and participate'}]
  },
  pathway:{stages,image:pathway,alt:'An Indian child and family at the centre of connected communication, daily-routine, learning and participation support, with the child joining peers.',caption:'Distinct professional contributions, family-guided practice and review connected to one child-specific direction.'},
  concerns:[
    {icon:'voice',title:'Communication',copy:'Understanding, expressing needs, making choices, asking for help and sharing ideas may need an accessible communication approach.'},
    {icon:'home',title:'Everyday routines',copy:'Dressing, eating, sleep, transitions, hygiene or preparing for school may need child-specific support and environmental changes.'},
    {icon:'heart',title:'Comfort and regulation',copy:'Sensory conditions, predictability, pain, health, emotional needs and the environment can affect comfort and participation.'},
    {icon:'people',title:'Play and interaction',copy:'Shared attention, play, interests and interaction can be supported without forcing a child to hide harmless differences.'},
    {icon:'book',title:'Learning access',copy:'Instructions, activities, communication, materials and classroom routines may need to be made more accessible.'},
    {icon:'sun',title:'Strengths and interests',copy:'What the child enjoys and already does can help shape engagement, useful goals and meaningful ways to participate.'}
  ],
  faqs:[
    {question:'What is autism therapy?',answer:'Autism therapy is not one fixed programme. Depending on assessment, a child may benefit from support for communication, play, learning, everyday routines, sensory-motor participation or behaviours affecting daily life. Relevant goals and professionals should be chosen for the individual child with the family.'},
    {question:'Does every autistic child need Speech, Occupational Therapy, ABA and Special Education?',answer:'No. A child may need one contribution, several or a different professional route. Individual assessment, family priorities and professional judgement determine what is relevant. Pinnacle does not prescribe every therapy to every child.'},
    {question:'Do I need a diagnosis before I call?',answer:'No. You can call and describe one everyday moment you want to understand or make more possible. The team can explain a suitable first conversation and whether assessment or another professional is appropriate. The call and PinnacleAI do not diagnose autism.'},
    {question:'Who can diagnose autism?',answer:'Autism diagnosis requires an appropriately qualified professional or multidisciplinary diagnostic pathway using developmental history and clinical observation. Ask who is conducting any diagnostic assessment, what qualification applies and whether current registration is required.'},
    {question:'What should an assessment consider?',answer:'A child-specific assessment may consider strengths, communication, play, learning, everyday living, sensory-motor access, health, sleep, feeding, behaviour, environments and family priorities. Relevant health or diagnostic professionals should be involved when indicated.'},
    {question:'How are meaningful goals chosen?',answer:'The child and family’s everyday priorities should guide goals. A useful goal connects an ability with something the child wants or needs to do in daily life and includes a clear way to review what changed and what support remains.'},
    {question:'What if my child uses little or no spoken language?',answer:'Communication is broader than speech. A suitable professional can consider gestures, signs, pictures, communication devices or other accessible ways to express needs, choices, refusal, comfort and ideas.'},
    {question:'Is the goal to make my child appear normal?',answer:'No. Support should build useful abilities, comfort, communication, autonomy and participation while respecting the child’s dignity and harmless differences. Forced eye contact, suppression for appearance or aversive practices are not the purpose described here.'},
    {question:'Can autism therapy cure autism or guarantee independence?',answer:'No. Pinnacle does not promise a cure, speech, independence, school admission, mainstream placement, a timetable or a particular outcome. The programme direction is toward growing self-sufficiency and participation, with progress reviewed for the individual child.'},
    {question:'How do parents, caregivers and teachers take part?',answer:'Families share priorities, strengths and observations. With appropriate consent and privacy safeguards, teachers may share what happens in learning and classroom routines. Manageable agreed practice can be used in natural moments without turning the family into the therapist.'},
    {question:'What should happen if behaviour changes suddenly or abilities are lost?',answer:'Seek appropriate medical or qualified professional review. Sudden change or loss of abilities can require assessment of health, pain, sleep, hearing, neurological, mental-health or other factors. Behavioural or therapy support should not delay relevant healthcare.'},
    {question:'What does PinnacleAI support?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support Class B Software as a Medical Device for children aged 0–12. Its documented functions include developmental ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support. People remain responsible for decisions.'},
    {question:'What do the PinnacleAI licences prove?',answer:'The MD-5 and BIS records define the licensed software and management-system scope. The Free Sale Certificate records Indian marketability and export eligibility subject to importing-country law. They do not diagnose autism, credential every professional, register every centre or guarantee a child’s outcome.'},
    {question:'How long will support take and what will it cost?',answer:'Duration, frequency and fees depend on the child-specific need, professional recommendation, centre and service. Ask the team to confirm the proposed next step, professional, appointment, current fees and review point before you begin.'},
    {question:'Is every service available at every centre?',answer:'No. Service, professional and appointment availability can differ by location. Call 9100 181 181 or use the centre directory so the team can confirm the suitable centre before you travel.'}
  ]
};
