import type { ServiceContent } from './service-content';
import {specialEducationStages} from './special-education-stages';
import lifeJourney from '../assets/special-education-life-journey-20260929.png';
import learningCycle from '../assets/special-education-learning-cycle-20260929.png';
import { specialEducationPath, url } from './site';

export const specialEducationEnquiry = url('/enroll-autism-speech-aba-therapies-india?service=education');

const learningStages = specialEducationStages;

export const specialEducationContent: ServiceContent = {
  id:'special-education', path:specialEducationPath, label:'Special Education',
  name:'Special education support for children', type:'Child-specific educational support',
  title:'Special Education Support for Children in India | Pinnacle Blooms',
  description:'Explore child-specific special education for learning access, communication and school participation. Find a Pinnacle centre or call 9100 181 181.',
  enquiry:{url:specialEducationEnquiry,label:'Arrange a first conversation',mobileLabel:'Start a conversation'},
  guidanceNote:'The team confirms the suitable professional, centre, appointment and current fees before you travel.',
  discover:{label:'See what to bring to the first conversation',href:'#first-conversation'},
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/paradigm/04-one-shared-direction.html',
    '/verify/evidence/paradigm/05-practice-in-everyday-life.html','/verify/evidence/paradigm/06-feedback-that-shapes-care.html',
    '/verify/evidence/records/md5.html','/verify/evidence/records/bis.html','/verify/evidence/research-library.html',
    '/verify/evidence/centre-entity-reference.html'
  ].map(url).concat([
    'https://www.unesco.org/en/inclusion-education',
    'https://www.unicef.org/education/inclusive-education',
    'https://rehabcouncil.nic.in/categories-u-s-19/'
  ]),
  image:{source:lifeJourney,alt:'An Indian child works with a special educator, practises a learning routine with family and participates in an inclusive classroom, connected by a colourful developmental pathway.',caption:'Child-specific teaching connected with family, school and everyday participation.'},
  hero:{
    heading:'Help your child access learning.',
    emphasis:'And take part in more of school and life.',
    lead:'Understand an instruction. Ask for help. Begin an activity. Learn with others.',
    copy:'We connect child-specific teaching, family and teacher knowledge, suitable professional support and regular review around the life your child is growing toward.',
    moments:[{icon:'book',label:'Access learning'},{icon:'voice',label:'Communicate during learning'},{icon:'people',label:'Participate with others'}]
  },
  pathway:{stages:learningStages,image:learningCycle,alt:'A special educator breaks a learning activity into accessible steps, an Indian child practises with family, participates in class and returns to review with the adults.',caption:'Understand the learning moment, adapt the teaching, practise where it matters and review what the child can use.'},
  concerns:[
    {icon:'compass',title:'Understanding what comes next',copy:'Visual cues, clearer instructions, predictable steps or adapted materials may help a child enter and continue a learning activity.'},
    {icon:'voice',title:'Communicating during learning',copy:'Asking for help, showing a choice, answering or sharing an idea may need a communication method the child can use.'},
    {icon:'book',title:'Early learning abilities',copy:'Concepts, reading, writing, numeracy and problem-solving can be taught in a child-specific way and connected to use.'},
    {icon:'people',title:'Classroom participation',copy:'Starting work, learning with peers, moving between activities and taking part in routines can become meaningful goals.'},
    {icon:'heart',title:'Strengths and interests',copy:'What already engages the child can help the educator choose accessible activities, materials and ways to respond.'},
    {icon:'home',title:'Using learning in daily life',copy:'A developing ability gains value when it helps the child communicate, manage a routine or participate beyond one teaching session.'}
  ],
  faqs:[
    {question:'What is special education support for children?',answer:'Special education is child-specific educational support. A qualified professional may adapt teaching, communication, materials, activities, pace or the learning environment so a child can access learning and participate. The approach and goals depend on individual assessment.'},
    {question:'Is special education the same as tutoring?',answer:'Tutoring usually focuses on helping a learner with academic content. Special education considers how the child accesses, communicates and participates in learning, and may adapt the teaching method, material, environment and support around an individual educational need.'},
    {question:'Does my child need a diagnosis before I call?',answer:'You can call and describe the learning or participation moments that concern you. The team can explain a suitable first conversation and whether assessment or another professional should be involved. The call and the PinnacleAI software do not diagnose a child.'},
    {question:'What can I discuss in the first conversation?',answer:'Bring one learning moment you would like to become more possible, such as following an instruction, asking for help, beginning an activity, early reading or writing, or joining a classroom routine. Ask about the professional, approach, centre, appointment and current fees.'},
    {question:'How are goals chosen?',answer:'Goals should reflect the child’s abilities, learning access, communication and the participation that matters to the child and family. The educator and family can agree what to work toward and how progress will be observed and reviewed.'},
    {question:'How do parents and caregivers take part?',answer:'Families share priorities, strengths and observations from everyday life. When appropriate, they may use manageable strategies in natural routines and bring what happened back into review. Family participation is partnership, not blame or a substitute for professional work.'},
    {question:'How can teachers contribute?',answer:'With appropriate consent and privacy safeguards, teachers can describe classroom activities, supports, barriers and participation. Their observations can help the family and professional understand whether an ability is being used where it matters.'},
    {question:'How can special education work with speech, occupational or behavioural support?',answer:'Each discipline contributes a distinct perspective. A child-specific plan may connect educational support with communication, everyday activities, sensory-motor access or behavioural support when indicated. Every child does not need every service.'},
    {question:'What does PinnacleAI support?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support software for children aged 0–12. Its licensed scope includes developmental ability measurement, readiness tracking, progress forecasting and adaptive plan support. Professionals and families remain responsible for educational and care decisions.'},
    {question:'Does a PinnacleAI licence prove that special education will work for my child?',answer:'No. The MD-5 and BIS records define the licensed software and management-system scope. They do not certify a special educator, guarantee school admission, prove an individual outcome or replace professional assessment and review.'},
    {question:'Is this school admission or school placement?',answer:'No. A Pinnacle centre conversation or appointment is not school admission, placement or a guarantee of mainstream inclusion. Ask the centre what educational support is available and discuss school decisions with the relevant school and professionals.'},
    {question:'Is special education available at every Pinnacle centre?',answer:'Service and professional availability can differ by location. Call 9100 181 181 or use the centre directory so the team can confirm the suitable professional, centre, appointment and current fees before you travel.'}
  ]
};
