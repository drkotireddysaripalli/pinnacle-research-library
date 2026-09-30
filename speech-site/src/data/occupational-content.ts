import type { ServiceContent } from './service-content';
import everydayLife from '../assets/occupational-family-everyday-life-20260929.png';
import schoolbagJourney from '../assets/occupational-schoolbag-journey-20260929.png';
import { careStages } from './speech';
import { occupationalPath, url } from './site';

export const occupationalEnquiry = url('/enroll-autism-speech-aba-therapies-india?service=occupational');

export const occupationalContent: ServiceContent = {
  id:'occupational', path:occupationalPath, label:'Occupational Therapy',
  name:'Occupational therapy for children', type:'Paediatric occupational therapy',
  title:'Occupational Therapy for Children in India | Pinnacle Blooms',
  description:'Explore occupational therapy for everyday routines, play, learning, self-care and participation. Find a Pinnacle centre or call 9100 181 181.',
  enquiry:{url:occupationalEnquiry,label:'Arrange a first conversation',mobileLabel:'Start a conversation'},
  guidanceNote:'Our team confirms the centre, occupational-therapy professional, appointment and fees before you visit.',
  discover:{label:'See how the first conversation works',href:'#first-conversation'},
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/pinnacleai-regulatory-journey.html',
    '/verify/evidence/records/md5.html','/verify/evidence/records/bis.html','/verify/evidence/records/fsc.html',
    '/verify/evidence/research-library.html','/verify/evidence/centre-entity-reference.html'
  ].map(url).concat([
    'https://wfot.org/about/about-occupational-therapy',
    'https://www.aota.org/practice/domain-and-process/occupations-everyday-activities',
    'https://www.who.int/news-room/fact-sheets/detail/rehabilitation'
  ]),
  image:{source:everydayLife,alt:'An Indian family and an occupational-therapy professional connect a child’s practice with dressing, play and school participation.',caption:'Everyday routines, family participation and growing independence.'},
  hero:{heading:'Start with one daily activity.',emphasis:'Build toward more of life.',lead:'Getting ready. Playing. Learning. Joining in.',copy:'Your child’s growing self-sufficiency and participation give the work its direction. We look at what helps today, connect occupational therapy with family-guided practice, and review what changes in real life.',moments:[{icon:'home',label:'Manage routines'},{icon:'heart',label:'Play and choose'},{icon:'book',label:'Take part in school'}]},
  pathway:{stages:careStages,image:schoolbagJourney,alt:'An Indian child practises packing a school bag with professional and family guidance, then carries it while joining another child at school.',caption:'A useful ability is practised, observed and carried into everyday participation.'},
  concerns:[
    {icon:'home',title:'Daily routines',copy:'Dressing, eating, washing, packing or moving through a routine can become clearer goals for growing participation.'},
    {icon:'heart',title:'Play and regulation',copy:'We explore the child, activity and environment to understand what may help engagement, comfort and purposeful play.'},
    {icon:'book',title:'Learning and school',copy:'Sitting, handling learning materials, moving between tasks and joining classroom routines can be considered in context.'},
    {icon:'people',title:'Participation with others',copy:'We connect developing abilities with the people and places where your child wants and needs to take part.'}
  ],
  faqs:[
    {question:'What does occupational therapy support for a child?',answer:'Occupational therapy supports participation in meaningful everyday activities. For a child, these may include self-care, play, learning, school routines and social participation. Assessment and goals are individual.'},
    {question:'Do I need a diagnosis before I contact Pinnacle?',answer:'You can call and describe the everyday activities that are difficult or important to your family. The team can explain the assessment process and help identify a suitable first professional conversation. The call does not diagnose your child.'},
    {question:'What happens during an occupational therapy assessment?',answer:'The occupational therapist gathers information about the activities that matter, observes the child’s participation and considers the child, task and environment. Ask the centre which tools, reports, timings and fees apply to your appointment.'},
    {question:'How does the family take part?',answer:'Your knowledge of routines, interests and everyday situations helps define useful goals. The therapist may guide manageable practice or environmental changes and review your observations with you.'},
    {question:'How is progress reviewed?',answer:'The team reviews what the child can do, where the ability is being used, what support helps and what still gets in the way. Goals, practice or support can then be adjusted with the family.'},
    {question:'What role does PinnacleAI play?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support software. It supports ability measurement, readiness tracking, progress forecasting and adaptive plan support. Professionals and families review the information and guide care decisions.'},
    {question:'Is occupational therapy available at every Pinnacle centre?',answer:'Service and professional availability may differ by location. Use the centre directory or call 9100 181 181 so the team can confirm the appropriate centre, professional, appointment and fees before you travel.'}
  ]
};
