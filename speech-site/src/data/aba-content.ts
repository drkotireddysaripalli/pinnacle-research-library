import type { ServiceContent } from './service-content';
import abaPoster from '../assets/aba-therapy-complete-poster-20261010.png';
import communicationJourney from '../assets/aba-transition-choice-20260930.png';
import { abaPath, url } from './site';

export const abaEnquiry = url('/enroll-autism-speech-aba-therapies-india?service=aba');

export const abaContent: ServiceContent = {
  id:'aba', path:abaPath, label:'ABA Therapy',
  name:'ABA therapy and behavioural support for children', type:'ABA therapy and child behavioural support',
  title:'ABA Therapy for Children in India | Pinnacle Blooms Network',
  description:'ABA and behavioural support for communication, choice and participation in everyday life. See how Pinnacle begins, find a centre and call 9100 181 181.',
  enquiry:{url:abaEnquiry,label:'Start a conversation',mobileLabel:'Start a conversation'},
  guidanceNote:'Free, staffed telephone guidance 24/7. We help check the suitable professional, centre, appointment and current fees before you visit; visits and therapy are priced separately.',
  discover:{label:'Find a Pinnacle Centre',href:'#centres'},
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/paradigm/04-one-shared-direction.html',
    '/verify/evidence/paradigm/05-practice-in-everyday-life.html','/verify/evidence/paradigm/06-feedback-that-shapes-care.html',
    '/verify/evidence/records/md5.html','/verify/evidence/records/bis.html','/verify/evidence/research-library.html',
    '/verify/evidence/centre-entity-reference.html'
  ].map(url).concat([
    'https://www.nice.org.uk/guidance/cg170/chapter/recommendations',
    'https://www.cdc.gov/autism/treatment/index.html',
    'https://www.who.int/news-room/fact-sheets/detail/rehabilitation',
  ]),
  image:{source:abaPoster,alt:'Pinnacle Blooms Network ABA Therapy for Children poster showing an Indian child choosing a play activity with his mother and a behavioural-support professional in a full-sleeve white Pinnacle coat. Communication, everyday skills and participation lead to a first conversation, assessment and centre search. Call 9100 181 181.',caption:'ABA Therapy for Children: communication, everyday skills and participation, beginning with the child’s individual needs.'},
  hero:{
    heading:'Communication. Choices. Everyday skills.',
    emphasis:'Help your child take part.',
    lead:'Understand what is happening. A busy transition. A request for a break. A moment in play or class.',
    copy:'Your child’s self-sufficient, mainstream-included life gives our work its direction. At Pinnacle, we connect behavioural support, communication, everyday practice and review around the abilities your child needs to take part.',
    moments:[{icon:'voice',label:'Be heard'},{icon:'home',label:'Make choices'},{icon:'people',label:'Take part'}]
  },
  pathway:{stages:[
    ['measure','Understand the starting picture','Notice the child’s choices, communication and context. In our example, pointing already works for choosing blocks; a noisy transition is harder. AbilityScore® may contribute to the professional’s starting picture.'],
    ['compass','Choose the next useful ability','Can the child request a pause in a manageable setting? Readiness and progress forecasts can inform that question. The professional and family agree the goal, suitable support and review point.'],
    ['people','Connect the right support','The behavioural professional examines the transition; speech support may help establish an accessible request, and occupational therapy may consider the activity or environment. The child’s needs determine the combination.'],
    ['home','Practise where life happens','Use the agreed communication support in a familiar routine. Parents and, with consent, teachers know how to recognise the request, respond and offer a manageable next choice.'],
    ['track','Compare what actually happened','Was the pause requested with a cue or independently? Did the same support help at home and during group play? Track the setting, the child’s response and the adult help alongside the outcome.'],
    ['loop','Change the plan and reassess','If a request works only with an adult cue, keep that help visible in the record. Adjust the next step, check comfort and review again before increasing demands or reducing support.'],
    ['sun','Keep the whole life in view','Being heard, making choices and joining everyday life are steps toward growing self-sufficiency and mainstream participation. The direction stays clear; the route and pace remain individual.']
  ],image:communicationJourney,alt:'A child communicates a need for a pause while his mother and a white-coated professional respond, then chooses a play activity with a peer.',caption:'An illustrative process: the child communicates a choice, adults respond and the team reviews participation.'},
  concerns:[
    {icon:'voice',title:'Communicating needs',copy:'Asking for help, saying no, requesting a break or showing discomfort may need a communication method the child can use and others can respect.'},
    {icon:'home',title:'Transitions and routines',copy:'Preparation, predictability, choices and environmental support may help a child move through familiar everyday moments.'},
    {icon:'book',title:'Learning and play',copy:'Support can focus on beginning, continuing or finishing an activity that matters to the child’s learning or participation.'},
    {icon:'heart',title:'Safety and participation',copy:'When a moment risks the child or others, assessment can help identify contributing factors and a useful, acceptable alternative.'}
  ],
  faqs:[
    {question:'What is ABA therapy?',answer:'Applied Behavior Analysis, also written Applied Behaviour Analysis, uses careful observation and learning principles to understand behaviour and support useful abilities. Appropriate goals should matter in the child’s life, respect communication and preferences, and be reviewed in relevant settings.'},
    {question:'Is ABA only for autistic children?',answer:'Behavioural approaches can be considered for different children and needs. Whether ABA or another form of support is appropriate depends on individual assessment, the child’s priorities and professional judgement. A diagnosis alone does not determine the plan.'},
    {question:'What makes a behavioural goal meaningful?',answer:'A meaningful goal helps the child communicate, choose, participate, stay safe or manage an important everyday routine. The goal should connect to quality of life rather than obedience or appearance.'},
    {question:'Does respectful ABA require forced eye contact or stopping harmless differences?',answer:'Forced eye contact, suppressing harmless self-regulation and compliance for its own sake are not meaningful default goals. Ask why a proposed goal matters to your child and how comfort, choice and communication will be respected.'},
    {question:'What is a functional assessment?',answer:'A functional assessment examines patterns around a behaviour, including what happens before and after, communication, health, sensory or environmental factors, task demands and the need the child may be trying to meet. The professional decides what assessment is appropriate.'},
    {question:'How are health, communication, sensory and environmental factors considered?',answer:'Behaviour can have several contributing factors. The team should consider communication, pain or health concerns, emotional needs, sensory context, routines and environmental demands, and involve or refer to relevant professionals when indicated.'},
    {question:'How does the family take part?',answer:'Families help choose meaningful routines and review what happens. Ask the professional team to show you an agreed way to support communication or a manageable task at home, with room for your child to choose, refuse or ask for a break. Bring observations of comfort and support back to review. This partnership does not replace professional care or confirm that home visits are available.'},
    {question:'How can school observations inform review?',answer:'When relevant and consented, teachers can share what happens during classroom activities, transitions and participation. The team can compare those observations with home and therapy information while protecting the child’s privacy.'},
    {question:'How can ABA, speech therapy, occupational therapy and special education work together?',answer:'Each discipline contributes a distinct perspective. A child-specific plan may connect behavioural support with communication, routines, sensory-motor access or learning. Every child does not need every therapy.'},
    {question:'What does PinnacleAI support?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support software for ability measurement, readiness tracking, progress forecasting and adaptive plan support within its licensed scope. Professionals and families interpret the information and remain responsible for care decisions.'},
    {question:'What happens at the first ABA conversation or assessment?',answer:'Begin with one everyday moment, your questions and any relevant reports you already have. Before a visit, the team confirms the suitable professional, centre, appointment and fees. The professional may observe communication, play or a routine, discuss what needs further assessment and explain a proposed next step. Ask how the goal will be reviewed before deciding.'},
    {question:'What will ABA support cost, and how is the schedule decided?',answer:'The team confirms current fees, appointment options and the proposed process with you before enrolment. The assessed need, meaningful goal and professional review guide the plan; no fixed programme, number of sessions or outcome suits every child. Free telephone guidance is separate from assessment and therapy fees.'},
    {question:'Is ABA available at every Pinnacle centre?',answer:'Service and professional availability can differ by location. Call 9100 181 181 or use the centre directory so the team can confirm a suitable centre, professional, appointment and current fees before you travel.'}
  ]
};
