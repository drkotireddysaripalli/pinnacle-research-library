import directory from './centre-directory.json' with {type:'json'};
import {assessmentContent} from './assessment-content.ts';

const origin='https://www.pinnacleblooms.org';
const briefs=[
 {
  id:'dilsukhnagar',label:'Dilsukhnagar',city:'Hyderabad',region:'Telangana',postcode:'500060',
  street:'No. 13-2-42/6/E/201 NR, Sai Nagar, Satyanarayanapuram, Vijeta Classic Empire, Chaitanyapuri, Dilsukhnagar',
  headline:'A choice today.',headlineAccent:'More possibilities in everyday life.',
  lead:'Asking for a favourite toy. Joining play. Getting ready for the day. Start with what matters to your child—and a first conversation in Dilsukhnagar.',
  landmark:'Vijeta Classic Empire, Chaitanyapuri · Find us',
  arrival:'Use the Dilsukhnagar directions and confirm the entrance and floor before travelling. The published address includes Vijeta Classic Empire in Chaitanyapuri; ask about lift, parking and access arrangements for your family.',
  exampleTitle:'From choosing a toy to joining everyday play.',
  exampleQuestion:'“My child reaches for a favourite toy. How can we help them make a choice and share that choice with us?”',
  exampleSteps:[['Start with what your child already does.','Bring an example of how your child chooses, asks or takes part. A suitable professional can observe the communication and support involved.'],['Choose a useful life goal.','Discuss a way to express a choice during a familiar game. The goal comes first; relevant communication, play or other support follows.'],['Try it in a familiar setting.','Agree a manageable opportunity at home, the help to offer and what to notice. The aim is useful participation outside the centre.'],['Review what changed.','Bring back what happened with different people or activities. The professional and family use those observations to adjust the next step.']],
  hero:'dilsukhnagar-interior-42-2.jpg',exterior:'dilsukhnagar-exterior-14.jpg',emblem:'dilsukhnagar-profile-50.jpg',
  photos:[{file:'dilsukhnagar-exterior-14.jpg',title:'Recognise the building',alt:'Published Dilsukhnagar street photograph with Pinnacle signage on the building.'},{file:'dilsukhnagar-interior-42-2.jpg',title:'Activity space',alt:'Published Dilsukhnagar activity-room photograph with mats, equipment and professionals at the side.'}],
  review:'https://g.page/r/CXbwD41tm_4IEBM/review',hfr:'IN3610023028',certificateDate:'2026-03-09',certificatePage:67,
  localQuestion:'Is this the Dilsukhnagar location in Chaitanyapuri?',localAnswer:'Yes. This page retains the published Dilsukhnagar profile at Vijeta Classic Empire, Sai Nagar, Satyanarayanapuram, Chaitanyapuri. Confirm the exact appointment address and entrance with the team before travelling.'
 },
 {
  id:'gurunanak',label:'Gurunanak Road, Vijayawada',city:'Vijayawada',region:'Andhra Pradesh',postcode:'520008',
  street:'59A,4-6, 2nd Floor, beside McDonald’s, Gurunanak Road',
  headline:'Everyday steps.',headlineAccent:'A life with more possibilities.',
  lead:'Packing a bag. Getting ready. Taking part in learning. Bring the everyday moment you want to make easier, and ask about a useful first visit in Vijayawada.',
  landmark:'Gurunanak Road, beside McDonald’s · Find us',
  arrival:'The published centre is on the second floor beside McDonald’s on Gurunanak Road. The existing directions link opens a coordinate/place destination; confirm the entrance, floor, lift and appointment address with the team.',
  exampleTitle:'A schoolbag can give the work a direction.',
  exampleQuestion:'“My child enjoys choosing what to take. How can getting the bag ready become something they take part in?”',
  exampleSteps:[['Notice the starting ability.','Share how your child recognises, chooses or handles a familiar item. Discuss what they do themselves and what help they use.'],['Agree one everyday priority.','Choose a meaningful part of getting ready. Relevant communication, movement, sequencing or learning support can follow that goal.'],['Make practice manageable.','Ask for a short, suitable routine with clear guidance. Family observations show whether it fits the real morning, not just the therapy room.'],['Review participation.','Discuss what became easier, which support still helps and whether the next step needs changing. Progress is individual.']],
  hero:'gurunanak-interior-1-2.jpg',exterior:null,emblem:'gurunanak-profile-4.jpg',
  photos:[{file:'gurunanak-interior-1-2.jpg',title:'Activity room',alt:'Published Vijayawada Gurunanak Road activity room with colourful mats and play equipment.'},{file:'gurunanak-interior-1-1.jpg',title:'Another view inside',alt:'Another published interior view of the Gurunanak Road, Vijayawada centre.'}],
  review:'https://g.page/r/Ce448AxFeXpcEBM/review',hfr:'IN2810050793',certificateDate:'2026-03-10',certificatePage:88,
  localQuestion:'How can I recognise the Vijayawada entrance?',localAnswer:'Use the published second-floor address beside McDonald’s on Gurunanak Road and confirm arrival instructions with the team. The gallery shows released interiors; it does not include an exterior or entrance photograph.'
 },
 {
  id:'delhi',label:'South Extension, New Delhi',city:'New Delhi',region:'Delhi',postcode:'110049',
  street:'Ground, E17, Main Market, South Extension–1, near AIIMS',
  headline:'A clearer first step.',headlineAccent:'More room for your child to grow.',
  lead:'A shared look. A request. A moment of play together. Tell us what you notice and what you hope to make possible—then ask about a first conversation in South Extension.',
  landmark:'E17, Main Market, South Extension–1 · Find us',
  arrival:'The published address is E17, Main Market, South Extension–1, near AIIMS. The frontage photograph includes steps; ask about the entrance and access your family needs. The existing map resolves to a coordinate/place destination, so confirm the address before travelling.',
  exampleTitle:'Start with one shared moment of play.',
  exampleQuestion:'“My child brings me a toy. What could help us enjoy more moments together?”',
  exampleSteps:[['Recognise the connection.','Tell the professional how your child brings you into an activity—through a look, movement, sound, gesture or words.'],['Understand before choosing support.','Discuss present abilities and a meaningful next priority. An autism or ADHD label alone does not determine every therapy a child needs.'],['Carry the idea into home life.','Agree a suitable way to respond and practise during an activity your child enjoys. Your observations help keep the work relevant.'],['Return to the life goal.','Review shared participation and the help involved. The next step follows what your child and family need, rather than a compulsory bundle.']],
  hero:'delhi-interior-8-2.jpg',exterior:'delhi-exterior-38.jpg',emblem:'delhi-profile-18.jpg',
  photos:[{file:'delhi-exterior-38.jpg',title:'Frontage and entrance',alt:'Published Pinnacle South Extension frontage photograph showing the sign and entrance steps.'},{file:'delhi-interior-8-2.jpg',title:'Inside the centre',alt:'Published interior photograph of the Pinnacle South Extension, New Delhi centre.'}],
  review:'https://g.page/r/CfNm4B-rnAt1EBM/review',hfr:'IN0710006582',certificateDate:'2026-03-15',certificatePage:68,sourceFlag:'INACTIVE',
  localQuestion:'Is the South Extension entrance step-free?',localAnswer:'The published entrance photograph shows steps. This page does not establish step-free access, parking or other accessibility arrangements. Describe what your family needs and confirm suitable arrival arrangements before booking or travelling.'
 },
 {
  id:'ananthapuram',label:'Ananthapuram',city:'Anantapur',region:'Andhra Pradesh',postcode:'515001',
  street:'2nd Cross Road, opposite SIU Church, beside BABY Hospital, Ashoknagar, Sai Nagar',
  headline:'Growing confidence.',headlineAccent:'Greater participation in everyday life.',
  lead:'Taking a turn. Making a choice. Learning alongside others. Start with the part of life you want to open up for your child, and ask about a first visit in Ananthapuram.',
  landmark:'Ashoknagar, beside BABY Hospital · Find us',
  arrival:'Use the published address on 2nd Cross Road, opposite SIU Church and beside BABY Hospital, Ashoknagar. The directions resolve to a named Pinnacle Anantapur place. Confirm your appointment address, entrance and access arrangements before travelling.',
  exampleTitle:'A turn in a game can connect with life beyond it.',
  exampleQuestion:'“My child loves this game. What might help them take part with another child?”',
  exampleSteps:[['Begin with an interest.','Bring a game your child enjoys or describe what makes it engaging. Notice the communication, movement and help already involved.'],['Choose participation as the goal.','Discuss a suitable way to share a turn or express a choice. Relevant support follows that individual priority.'],['Connect practice across settings.','Ask how a family member can guide a familiar activity, and whether teacher observations would be useful with your consent.'],['Review, then decide.','Compare what happened with different people and support. Keep, adjust or reconsider the plan with the professional rather than assuming the activity alone proves an outcome.']],
  hero:'ananthapuram-interior-47-1.jpg',exterior:'ananthapuram-exterior-19.jpg',emblem:'ananthapuram-profile-58.jpg',
  photos:[{file:'ananthapuram-exterior-19.jpg',title:'Recognise the building',alt:'Published Ananthapuram exterior photograph with Pinnacle signage.'},{file:'ananthapuram-interior-47-1.jpg',title:'Inside the centre',alt:'Published small-room interior view from Pinnacle Ananthapuram.'}],
  review:'https://g.page/r/CftPqlkpCzqlEAI/review',hfr:'IN2810053167',certificateDate:'2026-04-14',certificatePage:93,
  localQuestion:'Where is Pinnacle Ananthapuram in Ashoknagar?',localAnswer:'The published centre is on 2nd Cross Road, opposite SIU Church and beside BABY Hospital, Ashoknagar, Sai Nagar, Anantapur 515001. Use the linked directions and confirm the appointment address and entrance with the team before travelling.'
 },
 {
  id:'nandyala',sourceFlag:'ACTIVE',label:'Nandyala',city:'Nandyala',region:'Andhra Pradesh',postcode:'518501',
  street:'Second Floor, Padmavati Nagar Road, above Domino’s, beside GSR Hospital, Srinivasa Nagar',
  headline:'Ready for the day.',headlineAccent:'More room for life.',
  lead:'Getting dressed. Putting on shoes. Going out together. Bring one everyday moment you want your child to take part in—and start a useful first conversation in Nandyala.',
  landmark:'Above Domino’s, beside GSR Hospital · Find us',
  arrival:'The published centre is on the second floor on Padmavati Nagar Road, above Domino’s and beside GSR Hospital. Use the existing directions and confirm the entrance, floor access and appointment address before travelling.',
  exampleTitle:'Getting ready can be a step toward greater independence.',
  exampleQuestion:'“My child wants to come outside with us. How can putting on shoes become something they take part in?”',
  exampleSteps:[['Start with what your child can do.','Describe how your child chooses shoes, sits, reaches or asks for help. The starting picture includes the support that makes the moment possible.'],['Choose an everyday priority.','Agree a meaningful part of getting ready. Communication, movement, sensory comfort or sequencing support follows that individual goal.'],['Make the idea work at home.','Ask for a manageable opportunity during a real outing routine, with clear guidance on what to offer and what to notice.'],['Review the help and participation.','Bring back what happened. Discuss what your child took part in, what help still mattered and which next step would be useful.']],
  hero:'nandyala-interior-17-1.jpg',exterior:'nandyala-exterior-33.jpg',emblem:'nandyala-profile-1.jpg',
  photos:[{file:'nandyala-exterior-33.jpg',title:'Recognise the building',alt:'Published Nandyala building photograph with Pinnacle centre signage.'},{file:'nandyala-interior-17-1.jpg',title:'Inside the centre',alt:'Published first-party photograph of an interior room at Pinnacle Nandyala.'},{file:'nandyala-interior-17-2.jpg',title:'Another interior view',alt:'Another published premises photograph matched to Pinnacle Nandyala.'}],
  review:'https://g.page/r/CTf5y3e6J9gOEAI/review',hfr:'IN2810065160',certificateDate:'2026-05-08',certificatePage:73,
  localQuestion:'How do we find the Nandyala entrance?',localAnswer:'The published address is on the second floor above Domino’s, beside GSR Hospital on Padmavati Nagar Road. The gallery includes a building photograph. Confirm the entrance, floor access and appointment address with the receiving team before travelling.',releaseLabel:'centre-v134-nandyala-20261001'
 },
 {
  id:'ongole',sourceFlag:'ACTIVE',label:'Ongole',city:'Ongole',region:'Andhra Pradesh',postcode:'523001',
  street:'Sundaraiah Bhavan Road, near Gummadi Chest Hospital, Brundavan Nagar, Pandaripuram',
  headline:'A little more participation.',headlineAccent:'A life with more possibilities.',
  lead:'Choosing a snack. Asking for help. Sharing a meal. Start with the everyday possibility you want to open up for your child, and ask about a first conversation in Ongole.',
  landmark:'Sundaraiah Bhavan Road, near Gummadi Chest Hospital · Find us',
  arrival:'Use the published address on Sundaraiah Bhavan Road near Gummadi Chest Hospital, Brundavan Nagar, Pandaripuram. The gallery includes a frontage photograph; confirm the exact appointment address, entrance and access arrangements before travelling.',
  exampleTitle:'A family meal can give the work a direction.',
  exampleQuestion:'“My child has a favourite snack. How can choosing it and joining us become easier?”',
  exampleSteps:[['Recognise a useful starting point.','Describe how your child chooses, reaches, communicates or stays with the family during a familiar meal. Include what already helps.'],['Choose a meaningful next step.','Discuss one way your child could participate more. Relevant communication, daily-routine or sensory support follows the goal; no compulsory therapy bundle is assumed.'],['Keep practice familiar.','Ask for a suitable, manageable idea for your own family routine. Comfort, choice and the child’s participation guide what you try.'],['Bring real observations into review.','Discuss what happened with familiar food, people and support. The family and professional decide whether to keep, adapt or reconsider the next step.']],
  hero:'ongole-exterior-37.jpg',exterior:'ongole-exterior-37.jpg',emblem:'ongole-profile-15.jpg',
  photos:[{file:'ongole-exterior-37.jpg',title:'Frontage and arrival',alt:'Published first-party frontage photograph of the Pinnacle Ongole centre.'},{file:'ongole-interior-13-2.jpg',title:'Inside the centre',alt:'Published premises photograph matched to Pinnacle Ongole.'}],
  review:'https://g.page/r/CQjVSY0Cz3EtEAE/review',hfr:'IN2810050814',certificateDate:'2026-03-09',certificatePage:89,
  localQuestion:'Which landmark helps us find Pinnacle Ongole?',localAnswer:'The published location is on Sundaraiah Bhavan Road near Gummadi Chest Hospital, Brundavan Nagar, Pandaripuram, Ongole 523001. Use the frontage photograph and existing directions, then confirm the appointment address and entrance with the team.',releaseLabel:'centre-v134-ongole-20261001'
 },
 {
  id:'tirupati',sourceFlag:'ACTIVE',label:'Tirupati',city:'Tirupati',region:'Andhra Pradesh',postcode:'517502',
  street:'Air Bypass Road, near ICICI Bank, Shanthi Nagar, New Balaji Colony',
  headline:'Curiosity today.',headlineAccent:'More ways to join in.',
  lead:'Looking at a picture. Sharing an interest. Joining a familiar activity. Tell us what your child enjoys and what you want to make possible, then ask about a first visit in Tirupati.',
  landmark:'Air Bypass Road, near ICICI Bank · Find us',
  arrival:'The published location is on Air Bypass Road near ICICI Bank, Shanthi Nagar, New Balaji Colony. The released gallery shows an interior, without an entrance photograph. Confirm the exact building, entrance, floor and appointment arrangements before travelling.',
  exampleTitle:'An interest in pictures can open a shared moment.',
  exampleQuestion:'“My child loves this picture book. What could help us enjoy it together?”',
  exampleSteps:[['Notice the interest and ability.','Share how your child looks, points, turns a page, makes a sound or brings someone into the activity. Communication takes more than one form.'],['Give the work an everyday purpose.','Choose a meaningful shared moment. Relevant communication, attention, movement or learning support follows the child’s own starting picture.'],['Try an idea the family can use.','Ask for suitable guidance during a short, enjoyable activity at home. The idea should fit your child and family rather than becoming another lesson to finish.'],['Review connection and participation.','Bring observations from different people or familiar books. Decide with the professional which support helps and what to adjust next.']],
  hero:'tirupati-interior-4-1.jpg',exterior:null,emblem:'tirupati-profile-8.jpg',
  photos:[{file:'tirupati-interior-4-1.jpg',title:'Inside the centre',alt:'Published first-party interior photograph of Pinnacle Tirupati.'}],
  review:'https://g.page/r/CRwGxQipR6QJEAI/review',hfr:'IN2810065148',certificateDate:'2026-05-10',certificatePage:71,
  localQuestion:'Can I see the Tirupati entrance before travelling?',localAnswer:'The released gallery contains an interior photograph, not a verified reusable entrance photograph. Use the published Air Bypass Road address near ICICI Bank and ask the team for current arrival, entrance and floor instructions.',releaseLabel:'centre-v134-tirupati-20261001'
 },
 {
  id:'srikakulam',sourceFlag:'ACTIVE',label:'Srikakulam',city:'Srikakulam',region:'Andhra Pradesh',postcode:'532001',
  street:'Above Indian Bank, Sana Street, Rama Laxmana Road, Illisipuram, Meher Nager',
  headline:'Make a choice.',headlineAccent:'Take part in more of life.',
  lead:'Choosing a game. Taking a turn. Joining family time. Bring the everyday moment that matters to your child, and ask about a useful first conversation in Srikakulam.',
  landmark:'Above Indian Bank, Sana Street · Find us',
  arrival:'The published centre is above Indian Bank on Sana Street, Rama Laxmana Road, Illisipuram, Meher Nager. Use the matched building photograph and directions; confirm the entrance, floor access and appointment address with the team.',
  exampleTitle:'An interest at home can shape a useful learning goal.',
  exampleQuestion:'“My child enjoys drawing at home. What could help them join a short activity with another person?”',
  exampleSteps:[['Begin with your child’s interest.','Describe what your child enjoys, how they choose materials and what helps them stay involved. Notice communication, movement, comfort and support.'],['Define useful participation.','Discuss a suitable next step, such as sharing a choice or joining part of an activity. Relevant support follows that everyday purpose.'],['Connect family and learning settings.','Ask for manageable guidance. With your consent, relevant teacher observations can add another perspective.'],['Review the experience.','Discuss participation, comfort and the support involved before deciding whether to continue or adjust the plan.']],
  hero:'srikakulam-interior-7-0.jpg',exterior:'srikakulam-exterior-50.jpg',emblem:'srikakulam-profile-10.jpg',
  photos:[{file:'srikakulam-exterior-50.jpg',title:'Recognise the building',alt:'Published first-party building photograph with Pinnacle Srikakulam signage.'},{file:'srikakulam-interior-7-0.jpg',title:'Inside the centre',alt:'Published premises photograph matched to Pinnacle Srikakulam.'},{file:'srikakulam-interior-7-1.jpg',title:'Another room view',alt:'Another published interior photograph matched to Pinnacle Srikakulam.'}],
  review:'https://g.page/r/CfJdk9tbQh35EBM/review',hfr:'IN2810039040',certificateDate:'2026-03-11',certificatePage:'79–80',
  localQuestion:'Where is the Srikakulam centre above Indian Bank?',localAnswer:'The published location is above Indian Bank on Sana Street, Rama Laxmana Road, Illisipuram, Meher Nager, Srikakulam 532001. The gallery includes a matched building photograph. Confirm the entrance, floor access and appointment address before travelling.',releaseLabel:'centre-v134-srikakulam-20261001'
 }
];
export const centreDetails=briefs.map(brief=>{
 const branch=directory.find(c=>c.id===brief.id);if(!branch)throw new Error('Missing sourced centre '+brief.id);
 const address=`${brief.street}, ${brief.city}, ${brief.region} ${brief.postcode}, India`;
 const operatingNote=brief.sourceFlag==='INACTIVE'?' The source workbook flags this published location INACTIVE; current operation and appointments are not verified by this page. Confirm with the receiving team before travelling.':'';
 const facilityScope=`Workbook plus certificate copy dated ${brief.certificateDate}, recognition bundle p${brief.certificatePage}. The recorded authenticated dashboard check was Approved on 19 September 2026; this is a facility-register status, distinct from current operation, therapy availability and individual outcomes.`+operatingNote;
 const facilityDisplay=`Facility identifier ${brief.hfr}. A certificate copy dated ${brief.certificateDate} is available in the source trail; the recorded portal check showed Approved on 19 September 2026. Confirm current appointments and available services with the team.`+operatingNote;
 const sources=[
  {id:'location',name:'Published '+brief.label+' contact and location',url:branch.sourceUrl,scope:'First-party address, landmarks and national contact. Appointment and access arrangements are confirmed separately.'},
  {id:'maps',name:'Existing '+brief.label+' directions',url:branch.mapsUrl,scope:brief.arrival},
  {id:'hfr',name:'Facility-source trail · '+brief.hfr,url:origin+'/verify/evidence/hfr-register.html#hfr-'+brief.hfr,scope:facilityScope,displayScope:facilityDisplay},
  {id:'purpose',name:'Pinnacle’s life-first direction',url:origin+'/verify/evidence/pinnacle-paradigm-shift.html',scope:'Purpose and mechanism: the child’s self-sufficient, mainstream-included life shapes abilities, goals, methods, people, everyday practice and review. Individual outcomes are not guaranteed.'},
  {id:'identity',name:'Brand and legal operator evidence',url:origin+'/verify/#organization',scope:'Pinnacle Blooms Network is the brand; Bharath Healthcare Laboratories Private Limited is the legal operator.'},
  {id:'md5',name:'Original MD-5 licence',url:origin+'/verify/evidence/md5.pdf#page=1',scope:'PinnacleAI GPT-OS v1.0.0 is Class B non-diagnostic developmental-support software for children aged 0–12. It is not a therapist credential or an outcome guarantee.'},
  {id:'bis',name:'Original BIS licence and scope',url:origin+'/verify/evidence/bis.pdf#page=2',scope:'Named software and quality-system scope; not approval of every centre, therapy or child outcome.'}
 ];
 return {...brief,branch,path:new URL(branch.profileUrl).pathname,address,updatedOn:'2026-10-01',
  title:`Pinnacle Blooms ${brief.label} | Child Development & Therapy Enquiries`,
  description:`Explore Pinnacle Blooms ${brief.label}: real centre photos, directions, life-first support, visit questions and dated evidence. Call 9100 181 181.`,
  enquiry:origin+'/enroll-autism-speech-aba-therapies-india?service=help&centre='+brief.id,
  direct:`Pinnacle Blooms Network’s ${brief.label} centre is published at ${address}. Call 9100 181 181 to discuss your child’s everyday priorities and confirm the suitable professional, available service, appointment and fee before visiting.`,
  shareFile:brief.id+'-social-20261001.png',releaseLabel:brief.releaseLabel||'centre-v132-'+brief.id+'-20261001',callMotivation:({nandyala:'Tell us which part of getting ready matters most. Bring your observations and ask about a suitable next step for your child in Nandyala.',ongole:'You already know moments that matter to your child. Bring one of them to the conversation and ask what an Ongole visit would include.',tirupati:'Start with what your child enjoys and what you want it to make possible. Ask about a suitable first conversation and professional in Tirupati.',srikakulam:'An interest at home can be the beginning of a useful learning goal. Tell us what your child enjoys and ask about a suitable first visit in Srikakulam.'} as Record<string,string>)[brief.id],sources,stages:assessmentContent.stages,
  facilityRecord:{identifier:brief.hfr,sourceLevel:'Workbook plus certificate copy',certificateDate:brief.certificateDate,certificateBundlePage:brief.certificatePage,recordedPortalStatus:'Approved',portalCheckedOn:'2026-09-19',sourceWorkbookFlag:brief.sourceFlag||null,currentOperationVerified:false,currentServiceAvailabilityVerified:false},
  faqs:[
   {question:'Where is Pinnacle Blooms '+brief.label+'?',answer:'The published address is '+address+'. '+brief.arrival},
   {question:'How do I contact this centre?',answer:'Call 9100 181 181 or send an enquiry with '+brief.label+' selected. This is Pinnacle’s national guidance and enquiry number; no separately verified direct branch number is listed here.'},
   {question:brief.localQuestion,answer:brief.localAnswer},
   {question:'Can I discuss speech, occupational, ABA or autism support here?',answer:'Yes, use the national team to discuss your child’s priorities and ask which assessment, support and professional can be arranged at '+brief.label+'. The page links the therapy explanations; it does not establish every service or practitioner’s current availability. Every child does not need every therapy.'},
   {question:'What will a first conversation help me understand?',answer:'You can describe a meaningful everyday moment, discuss present abilities and ask about an appropriate assessment or support. Confirm who will meet your child, what the visit includes, how the family participates and how progress would be reviewed before deciding.'},
   {question:'What are the appointment hours and fees?',answer:'The receiving team confirms current appointments, the professional, assessment or therapy fees, what is included and cancellation terms. Free 24/7 telephone guidance is separate from centre opening hours and paid services; this page does not advertise a general free assessment.'},
   {question:'Can I see photographs of this centre?',answer:'Yes. The premises gallery contains first-party photographs matched to this branch. Ask the team about current rooms, equipment and access arrangements. The branded campaign scene is illustrative.'},
   {question:'What does the facility and software evidence establish?',answer:facilityScope+' The MD-5 and BIS records describe the named non-diagnostic software and their printed scopes. Facility records, professional qualifications and individual child outcomes are different things.'}
  ]
 };
});
