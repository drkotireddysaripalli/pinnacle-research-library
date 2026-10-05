import type { ServiceContent } from './service-content';
import earlyPlay from '../assets/occupational-everyday-steps-20261005.png';
import lifeInView from '../assets/occupational-life-in-view-20260930.png';
import { occupationalPath, url } from './site';

export const occupationalEnquiry = url('/enroll-autism-speech-aba-therapies-india?service=occupational');

export const occupationalRoutes = [
  {icon:'heart', title:'Play and exploration', short:'Reach, handle and share familiar play materials.', detail:'Tell us what your child enjoys and where joining play is difficult. An OT can assess the activity, the setting and the support that may help.'},
  {icon:'home', title:'Meals and self-care', short:'Join a family meal or use everyday utensils.', detail:'The useful goal may involve sitting comfortably, handling a spoon, following a routine or changing the mealtime setting. The assessment decides what fits your child.'},
  {icon:'loop', title:'Dressing and routines', short:'Take part in fasteners, shoes, grooming or transitions.', detail:'The therapist can look at the task steps, materials and support needed so practice can connect to a familiar day.'},
  {icon:'book', title:'Hand use and learning', short:'Draw, handle learning materials or write when appropriate.', detail:'A school activity can be adapted to your child’s age, abilities and environment. A useful classroom goal is more than a repeated exercise.'},
  {icon:'people', title:'Sensory comfort and participation', short:'Understand the effect of touch, movement, sound or a busy place.', detail:'An OT can consider how the child experiences an activity or setting and whether a change could support participation. No single sensory technique suits every child.'}
] as const;

const occupationalStages = [
  ['measure','Understand capabilities','The OT considers the child, activity and setting; AbilityScore® can help record a structured starting picture.'],
  ['compass','Look ahead and plan','Family priorities and readiness views help the professional team choose a meaningful, child-specific goal.'],
  ['people','Give suitable support','OT and other disciplines contribute only when the child’s assessed goal indicates their role.'],
  ['home','Practise in everyday life','The family can try manageable, agreed activities in familiar routines with professional guidance.'],
  ['track','Track and correct','Notice whether participation changes, where it happens and what support is still needed.'],
  ['loop','Reassess and repeat','Review the goal, activity, environment or support as the child’s needs change.'],
  ['sun','Work toward a fuller life','Keep growing independence, school readiness and mainstream participation in view, with appropriate supports.']
];

export const occupationalContent: ServiceContent = {
  id:'occupational', path:occupationalPath, label:'Occupational Therapy',
  name:'Occupational therapy for children', type:'Paediatric occupational therapy',
  title:'Occupational Therapy for Children in India | Pinnacle Blooms',
  description:'Occupational therapy for dressing, play and school routines. Learn about assessment, goals and progress, then find a Pinnacle centre or call 9100 181 181.',
  enquiry:{url:occupationalEnquiry,label:'Begin enrolment',mobileLabel:'Find a centre'},
  guidanceNote:'Free telephone guidance is staffed 24/7. We help confirm the suitable centre, OT professional, appointment and current fees before you visit.',
  discover:{label:'See the activities we can discuss',href:'#family-moments'},
  citations:[
    '/verify/evidence/pinnacle-paradigm-shift.html',
    '/verify/evidence/assurance-map.html',
    '/verify/evidence/records/md5.html',
    '/verify/evidence/records/bis.html',
    '/verify/evidence/research-library.html',
    '/verify/evidence/centre-entity-reference.html',
    '/national-autism-helpline'
  ].map(url).concat([
    'https://www.ghc.nhs.uk/our-teams-and-services/children-and-young-people/physical-health/childrens-occupational-therapy/',
    'https://www.chesterfieldroyal.nhs.uk/all-services-and-wards/childrens-occupational-therapy/getting-dressed',
    'https://wfot.org/about/about-occupational-therapy',
    'https://www.aota.org/practice/domain-and-process/occupations-everyday-activities'
  ]),
  image:{source:earlyPlay,alt:'Pinnacle Blooms Occupational Therapy creative: a child, mother and therapist explore a jacket zip. Small everyday steps. More life to join.',caption:'Begin with the activity your child wants to join.'},
  hero:{heading:'More ways to take part in everyday life.',emphasis:'The child’s life gives every step its direction.',lead:'Play, mealtimes, dressing and learning with others can all matter.',copy:'Tell us one moment you would like your child to enjoy or manage more confidently.',moments:[{icon:'heart',label:'Play'},{icon:'home',label:'Daily routines'},{icon:'book',label:'Learning'}]},
  pathway:{stages:occupationalStages,image:lifeInView,alt:'Illustrated family and school moments: a child manages a bag, joins a friend and takes part in learning.',caption:'One child’s wider life guides the steps we choose and review.'},
  concerns:occupationalRoutes.map(route=>({icon:route.icon,title:route.title,copy:route.short})),
  faqs:[
    {question:'What can occupational therapy help my child do?',answer:'Occupational therapy can support participation in meaningful activities such as play, self-care, hand use, learning and routines. A professional assessment identifies what is suitable for your child.'},
    {question:'Can I ask about OT for an autistic child, a child with ADHD or developmental delay?',answer:'Yes. Tell us the everyday activity you are concerned about. A diagnosis can provide context, but it does not automatically determine whether OT or any particular method is appropriate.'},
    {question:'Can OT address sensory difficulties?',answer:'An OT can consider how a child experiences touch, movement, sound or other features of an activity or setting, then assess whether changes or support may help participation.'},
    {question:'What happens at the first visit?',answer:'The professional listens to your priorities, learns about daily routines, observes your child in age-appropriate activities and explains a suitable next step. The centre confirms appointment details and fees before you visit.'},
    {question:'How will we know whether therapy is helping?',answer:'Agree on an observable activity goal and a starting point, then review what your child does in daily life, where it works, what support is needed and what should change.'},
    {question:'Will my child need speech, behavioural support or special education too?',answer:'Only when the individual assessment and shared goal indicate that another professional may contribute. Every child does not need every therapy.'},
    {question:'Which Pinnacle centre has an OT and what will it cost?',answer:'Availability and fees can change by location. Use the directory to choose a centre, then call 9100 181 181 so the team can help confirm the current professional, appointment and price before you travel.'},
    {question:'Does PinnacleAI decide my child’s care?',answer:'No. PinnacleAI GPT-OS is licensed as non-diagnostic developmental-support software for children aged 0–12. Its scope supports ability measurement, readiness tracking, progress forecasting and plan support. Qualified professionals and your family use that information to discuss care and review progress.'}
  ]
};
