import type { ServiceContent } from './service-content';
import everydayLife from '../assets/aba-hero-life-first-20260930.png';
import communicationJourney from '../assets/aba-transition-choice-20260930.png';
import { abaPath, url } from './site';

export const abaEnquiry = url('/enroll-autism-speech-aba-therapies-india?service=aba');

export const abaContent: ServiceContent = {
  id:'aba', path:abaPath, label:'ABA Therapy',
  name:'ABA therapy and behavioural support for children', type:'Child behavioural support',
  title:'ABA Therapy for Children in India | Pinnacle Blooms Network',
  description:'ABA and behavioural support for communication, choice and participation in everyday life. See how Pinnacle begins, find a centre and call 9100 181 181.',
  enquiry:{url:abaEnquiry,label:'Start a conversation',mobileLabel:'Start a conversation'},
  guidanceNote:'Free, staffed telephone guidance 24/7. We help check the suitable professional, centre, appointment and current fees before you visit; visits and therapy are priced separately.',
  discover:{label:'How behavioural support begins',href:'#service-fit'},
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/paradigm/04-one-shared-direction.html',
    '/verify/evidence/paradigm/05-practice-in-everyday-life.html','/verify/evidence/paradigm/06-feedback-that-shapes-care.html',
    '/verify/evidence/records/md5.html','/verify/evidence/records/bis.html','/verify/evidence/research-library.html',
    '/verify/evidence/centre-entity-reference.html'
  ].map(url).concat([
    'https://www.nice.org.uk/guidance/cg170/chapter/recommendations',
    'https://www.aap.org/en/patient-care/autism/considerations-for-prescribing-recommending-common-supports-and-services-for-children-on-the-autism-spectrum/',
    'https://www.who.int/news-room/fact-sheets/detail/rehabilitation',
    'https://www.bacb.com/about-behavior-analysis/'
  ]),
  image:{source:everydayLife,alt:'An Indian child chooses a play activity while his mother and a behavioural-support professional in a full-sleeve white Pinnacle coat listen.',caption:'Begin with the child’s communication and choices.'},
  hero:{
    heading:'Understand what is happening.',
    emphasis:'Help your child take part.',
    lead:'A busy transition. A request for a break. A moment in play or class.',
    copy:'We ask what your child may need, agree a useful goal with you and review whether support helps in everyday life.',
    moments:[{icon:'voice',label:'Be heard'},{icon:'home',label:'Make choices'},{icon:'people',label:'Take part'}]
  },
  pathway:{stages:[
    ['measure','Understand the starting picture','A professional begins with the child’s communication, abilities, context and family observations. AbilityScore® may support the picture when used.'],
    ['compass','Choose a meaningful direction','Together, choose a goal linked to communication, comfort, safety or participation. Readiness views may inform the discussion when relevant.'],
    ['people','Connect suitable people and support','If behavioural support fits, the professional explains the goal, approach and any roles for other disciplines.'],
    ['home','Practise in everyday settings','Try a manageable communication or routine support where it matters, with family and school involvement when appropriate.'],
    ['track','Observe and adjust','Ask what the child communicates, how comfortable participation feels and what support still helps; change the plan if needed.'],
    ['loop','Reassess and repeat','Review the child’s needs and agreed goals again as everyday life changes.'],
    ['sun','Grow participation in life','Keep growing self-sufficiency, school readiness and mainstream participation as the direction of support—not a guaranteed result.']
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
    {question:'How does the family take part?',answer:'Families help identify the everyday moments that matter, describe what happens across routines and review what is becoming easier, what support remains and what the team should change. Family participation is informed partnership, not blame or a substitute for professional care.'},
    {question:'How can school observations inform review?',answer:'When relevant and consented, teachers can share what happens during classroom activities, transitions and participation. The team can compare those observations with home and therapy information while protecting the child’s privacy.'},
    {question:'How can ABA, speech therapy, occupational therapy and special education work together?',answer:'Each discipline contributes a distinct perspective. A child-specific plan may connect behavioural support with communication, routines, sensory-motor access or learning. Every child does not need every therapy.'},
    {question:'What does PinnacleAI support?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support software for ability measurement, readiness tracking, progress forecasting and adaptive plan support within its licensed scope. Professionals and families interpret the information and remain responsible for care decisions.'},
    {question:'Is ABA available at every Pinnacle centre?',answer:'Service and professional availability can differ by location. Call 9100 181 181 or use the centre directory so the team can confirm a suitable centre, professional, appointment and current fees before you travel.'}
  ]
};
