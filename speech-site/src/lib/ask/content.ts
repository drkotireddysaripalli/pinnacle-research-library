export const ASK='https://pinnacleblooms.org/ask';
export const SITE='https://www.pinnacleblooms.org';
export const contact={phone:'9100 181 181',tel:'tel:+919100181181',enrol:SITE+'/enroll-autism-speech-aba-therapies-india',centres:SITE+'/centers'};
export const dimensions=[
 ['conditions','Conditions','condition','Understand a condition and the questions families ask.','heart'],
 ['behaviours','Everyday behaviours','phenomenon','Understand experiences at home, school and in the community.','people'],
 ['skills','Skills','skill','Communication, play, learning and everyday skills.','spark'],
 ['abilities','Abilities','ability','Strengths that support a child’s growing independence.','chart'],
 ['domains','Developmental domains','domain','See how different areas of development work together.','layers'],
 ['ages','Ages & stages','age','Explore questions around a child’s age and stage.','clock'],
 ['life-skills','Life skills','lifeskill','Eating, dressing, routines and participation in everyday life.','home'],
 ['assessments','Assessments','assessment','Understand the purpose and limits of different assessments.','clipboard'],
 ['readiness','Readiness','readiness','Explore participation, learning and the next step.','compass'],
 ['therapies','Therapies','route','Understand how appropriate therapies can contribute.','people'],
 ['techniques','Techniques','technique','Explore professional methods and their purpose.','layers'],
 ['people','For parents & professionals','stakeholder','Find the questions that matter in your role.','people'],
 ['standards-icf','ICF classifications','icf','Explore answers connected with functioning and participation.','book'],
 ['standards-icd','ICD-11 classifications','icd11','Explore answers by mapped classification codes.','book']
].map(([slug,title,kind,description,icon])=>({slug,title,kind,description,icon}));
export const guides:any={
 abilityscore:{title:'Understand AbilityScore®',intro:'Understand the starting point. Connect measurement with the abilities that matter in your child’s everyday life.',kind:'score_band',question:'AbilityScore',service:'/abilityscore'},
 'how-to':{title:'Everyday practice, with purpose',intro:'Explore ideas for bringing communication, play and growing independence into everyday routines. Discuss suitable activities with your child’s professional.',kind:'intent',value:'home_support',service:'/everyday-therapy'},
 materials:{title:'Materials that make practice meaningful',intro:'Find questions about choosing and using materials around the skill, the child and the activity—not a toy in isolation.',kind:'intent',value:'find_materials',service:'/autism-speech-aba-parent-family-resources'},
 myths:{title:'Clarity beyond myths',intro:'Start with a clear question. Look at the explanation and its sources, then choose an informed next step.',kind:'intent',value:'clarify',question:'myth',service:'/autism-therapy'},
 compare:{title:'Understand the difference',intro:'Similar words can describe different experiences. Explore the distinctions families ask about and where a professional can help.',question:'difference',service:'/speech-aba-autism-assessments'},
 'parents/wellbeing':{title:'Support for parents and caregivers',intro:'Your questions and wellbeing matter too. Explore family support, daily routines and participation in your child’s journey.',kind:'intent',value:'family_support',service:'/national-autism-helpline'},
 'access/financial':{title:'Finding financial support',intro:'Explore published information about support and access. Check current eligibility with the responsible scheme or authority.',kind:'intent',value:'navigate_access',question:'financial',service:'/contact-information'},
 'access/legal':{title:'Understanding rights and access',intro:'Explore questions about rights, inclusion and support, with links to the sources behind each answer.',kind:'intent',value:'navigate_access',question:'rights',service:'/policies'}
};
export const therapyLinks=[
 {title:'Speech therapy',url:'/top-speech-therapy-center-india-proven-improvement-rate',terms:/speech|communication|language/i},
 {title:'Occupational therapy',url:'/best-occupational-therapy-center-india-proven-improvement-rate',terms:/occupational|sensory|motor|feeding|dressing/i},
 {title:'ABA / behaviour therapy',url:'/best-aba-therapy-center-india-proven-improvement-rate',terms:/behaviour|behavior|\baba\b/i},
 {title:'Special education',url:'/best-special-education-center-call-9100181181',terms:/school|learning|education/i},
 {title:'Integrated autism support',url:'/autism-therapy',terms:/autism|development/i}
];
export function safeAskLink(slug:string){return typeof slug==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,240}$/.test(slug)?ASK+'/'+slug:null}
export const pretty=(s:string)=>String(s||'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
