import type { ServiceContent } from './service-content';
import campaign from '../assets/speech-life-campaign.png';
import everyday from '../assets/speech-everyday-story.png';
import { speechPath, url } from './site';
import { careStages } from './speech';

export const serviceInformationPath = '/speech-therapy/service-information';
export const speechContent: ServiceContent = {
  id:'speech', path:speechPath, label:'Speech Therapy',
  name:'Speech and language therapy for children', type:'Speech and language therapy',
  title:'Speech Therapy for Children: Assessment & Care | Pinnacle Blooms',
  description:'Begin with a FREE speech and language assessment at Pinnacle Blooms. Connect therapy, family practice and PinnacleAI support to everyday life. Call 9100 181 181.',
  assessmentOffer:{name:'Speech and language assessment',price:0,priceCurrency:'INR',url:url('/enroll#contact-form-title')},
  citations:[
    '/verify/','/verify/evidence/pinnacle-paradigm-shift.html','/verify/evidence/pinnacleai-regulatory-journey.html',
    '/verify/evidence/records/md5.html','/verify/evidence/bis.pdf#page=2','/verify/evidence/records/fsc.html',
    '/verify/evidence/research-library.html','/question-comprehension-study',serviceInformationPath
  ].map(url).concat(['https://www.asha.org/njc/communication-bill-of-rights/','https://www.asha.org/public/early-identification-of-speech-language-and-hearing-disorders/']),
  image:{source:campaign,alt:'Illustrative scene of a mother listening as her child points during play, with a school participation vignette.',caption:'Everyday communication, family participation and growing independence.'},
  hero:{heading:'Help your child',emphasis:'be understood.',lead:'And take part in more of life.',copy:'Asking for help. Making a choice. Joining in. At Pinnacle, everyday goals connect assessment, speech therapy, home practice and review.',moments:[{icon:'voice',label:'Be heard'},{icon:'heart',label:'Make choices'},{icon:'people',label:'Join in'}]},
  pathway:{stages:careStages,image:everyday,alt:'Illustrated everyday communication: a child choosing at breakfast, playing with a sibling and participating in class.',caption:'Communication that becomes part of everyday life.'},
  concerns:[
    {icon:'voice',title:'Be understood',copy:'Your child has something to say. Discuss speech that others find difficult to understand.'},
    {icon:'heart',title:'Express a need',copy:'Help. A favourite toy. A break. Explore suitable ways to share needs and choices.'},
    {icon:'book',title:'Understand language',copy:'A familiar instruction. A question in class. Discuss how your child understands words and meaning.'},
    {icon:'people',title:'Join in',copy:'Sharing an interest. Taking a turn. Joining play. Explore communication with other people.'}
  ],
  faqs:[
    {question:'Can I call before I know which therapy my child needs?',answer:'Yes. Share what you are noticing and what you would like help with. The Pinnacle team can explain its services and the assessment process, and help you find a centre. The call does not replace a professional assessment.'},
    {question:'How much will the assessment and therapy cost?',answer:'The speech and language assessment is FREE under this Pinnacle offer, with a listed value of ₹25,999. Call 9100 181 181 to arrange your appointment. Ongoing therapy is priced separately; the team explains the plan, fees and schedule before you enrol.'},
    {question:'Is speech therapy available at my nearest Pinnacle centre?',answer:'Ask the team to confirm speech therapy, clinician availability and assessment appointments at your preferred centre. Services and availability may differ by location.'},
    {question:'How does the family take part?',answer:'Pinnacle’s pathway includes parent-guided everyday practice, progress tracking and review. Discuss with the care team how communication goals can fit into familiar routines at home and school.'},
    {question:'What role does PinnacleAI play?',answer:'PinnacleAI GPT-OS v1.0.0 is non-diagnostic developmental-support software. Its documented functions include ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support, with human and professional review.'},
    {question:'What does speech and language therapy support?',answer:'Speech and language therapy supports communication: understanding language, expressing needs and ideas, and using speech or other appropriate communication methods. Goals and progress depend on the individual child.'}
  ]
};
