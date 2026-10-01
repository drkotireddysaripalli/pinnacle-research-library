import type { ServiceContent } from './service-content';
import campaign from '../assets/speech-life-campaign.png';
import everyday from '../assets/speech-life-direction-20260928.png';
import { speechOffer } from './speech-offer';
import { speechPath, url } from './site';
import { careStages } from './speech';
import evidence from './speech-evidence.json';
import {governmentSpeechResources} from './speech-resources';

export const serviceInformationPath = '/speech-therapy/service-information';
export const speechContent: ServiceContent = {
  id:'speech', path:speechPath, label:'Speech Therapy',
  name:'Speech and language therapy for children', type:'Speech and language therapy',
  title:'Speech Therapy for Children Across India | Pinnacle Blooms',
  description:'Speech therapy shaped around your child’s everyday life. Explore PinnacleAI, centres, evidence and a FREE speech assessment. Call 9100 181 181.',
  enquiry:{url:speechOffer.url,label:'Arrange your FREE assessment',mobileLabel:'FREE assessment'},
  assessmentOffer:speechOffer,
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/pinnacleai-regulatory-journey.html',
    '/verify/evidence/records/md5.html','/verify/evidence/bis.pdf#page=2','/verify/evidence/records/fsc.html',
    '/verify/evidence/research-library.html',serviceInformationPath
  ].map(url).concat(Object.values(evidence.groups).flatMap(group => group.links.map(link => url(link.url)))).filter((value,index,all) => all.indexOf(value) === index).concat(governmentSpeechResources.map(resource=>resource.href)),
  image:{source:campaign,alt:'Illustrative scene of a mother listening as her child points during play, with a school participation vignette.',caption:'Everyday communication, family participation and growing independence.'},
  hero:{heading:'Help your child',emphasis:'be understood.',lead:'And take part in more of life.',copy:'Asking for help. Making a choice. Joining in. We start with the life your child is working toward, then shape assessment, speech therapy, home practice and review around it.',moments:[{icon:'voice',label:'Be heard'},{icon:'heart',label:'Make choices'},{icon:'people',label:'Join in'}]},
  pathway:{stages:careStages,image:everyday,alt:'Illustrated family goals: a child makes a choice, prepares a school bag and participates with others; mother and professional review the plan.',caption:'Communication that becomes part of everyday life.'},
  concerns:[
    {icon:'voice',title:'Be understood',copy:'Your child has something to say. We work with you to understand what makes their speech difficult for others to follow.'},
    {icon:'heart',title:'Express a need',copy:'Help. A favourite toy. A break. We explore ways for your child to share needs, make choices and be heard.'},
    {icon:'book',title:'Understand language',copy:'A familiar instruction. A question in class. We assess understanding and agree meaningful language goals with you.'},
    {icon:'people',title:'Join in',copy:'Sharing an interest. Taking a turn. Joining play. We connect communication goals to the people and moments that matter.'}
  ],
  faqs:[
    {question:'What happens at the first speech assessment?',answer:'We listen to your priorities and explore how your child communicates through play, conversation, structured tasks and observation. The assessment usually takes about one hour, depending on your child. We explain the findings and next steps, and confirm when your written report will be ready.'},
    {question:'How will we know whether communication is becoming more useful?',answer:'We agree a meaningful goal and observe where your child uses it, with whom and with how much help. Your family’s observations join the professional review. We adjust the activity, communication method or support when needed and reassess; progress and pace are individual.'},
    {question:'Can I call before I know which therapy my child needs?',answer:'Yes. Share what you are noticing and what you would like help with. We’ll explain our services and assessment process, and help you find a centre. The call does not replace a professional assessment.'},
    {question:'How much will the assessment and therapy cost?',answer:'The speech and language assessment is FREE under this Pinnacle offer, with a listed value of ₹25,999. Call 9100 181 181 to arrange your appointment. Ongoing therapy is priced separately; we explain the plan, fees and schedule before you enrol.'},
    {question:'Is speech therapy available at my nearest Pinnacle centre?',answer:'Call us with your preferred location. We’ll confirm speech therapy, clinician availability and assessment appointments. Services and availability may differ by location.'},
    {question:'How does the family take part?',answer:'We work with you on manageable practice in familiar routines. Your observations help us review where your child uses an ability, what support helps and what the plan needs next.'},
    {question:'What role does PinnacleAI play?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support software. It supports ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support. Our professionals review the information with your family and guide care decisions.'},
    {question:'What does speech and language therapy support?',answer:'Speech and language therapy supports communication: understanding language, expressing needs and ideas, and using speech or other appropriate communication methods. Goals and progress depend on the individual child.'}
  ]
};

export const speechStages = [
  {icon:'measure',title:'Understand abilities',question:'How does my child communicate now?',text:'In our toy-box example, observe how the child asks for help and which support works. Assessment and AbilityScore® help describe the starting point.',path:'/abilityscore',link:'Understand AbilityScore'},
  {icon:'compass',title:'Agree the next goal',question:'What would make everyday life easier?',text:'Consider readiness and agree a useful next step, such as asking for help with a familiar activity.',path:'/seven-readiness-indexes',link:'Explore readiness'},
  {icon:'people',title:'Connect the right support',question:'Which people and methods will help?',text:'Choose an accessible way to ask—speech, a gesture or a communication aid—and involve other disciplines if assessment shows a need.',path:'/autism-therapy',link:'How therapies work together'},
  {icon:'home',title:'Practise in everyday life',question:'How can we try this at home?',text:'Try the agreed request during a familiar play routine. Notice the cue or prompt your child needs to ask for help.',path:'/everyday-therapy',link:'Everyday Therapy'},
  {icon:'track',title:'Track and correct',question:'Where is it working—and where is it not?',text:'The child asks one adult after a prompt. We review what happens with another adult and adjust the cue, activity or support.',path:'/fusion-module',link:'How feedback shapes the plan'},
  {icon:'loop',title:'Reassess and repeat',question:'What has changed? What comes next?',text:'Check whether the request is useful with another person or activity, and how much help is still needed. Use that information to choose the next step.',path:'/verify/#monthly-readiness-review',link:'Read the review process'},
  {icon:'sun',title:'Grow into participation',question:'How does this help my child’s life?',text:'Asking for help can open more chances to play, learn and join others. That everyday use serves growing independence and mainstream participation.',path:'/verify/evidence/pinnacle-paradigm-shift.html',link:'The life-first purpose'}
];
