// Public route recovery: reuse the approved assessment and child-counselling
// enquiry contracts; do not infer current clinicians, availability or fees.
export const recoveryServices = {
 directory: {
  path:'/top-autism-therapy-services-india-proven-improvement-rate', label:'Therapy services',
  title:'Therapy Services for Children | Pinnacle Blooms Network',
  description:'Find speech, occupational, ABA, autism and special education support. Connect the right service with your child’s everyday life. Call 9100 181 181.',
  opening:'The right support.', emphasis:'For the life your child is growing toward.',
  lead:'Your child’s communication, learning, routines and participation belong together. Begin with what your child already does, what your family wants to make possible and a useful professional conversation.',
  question:'Which service should we start with?',
  answer:'You do not need to choose every therapy before calling. Tell us one everyday question and your preferred location. We will help you check the suitable service, professional, appointment and fee.',
  moments:['Being understood at home and school','Taking part in play, learning and daily routines','Growing independence with support that fits the child'],
  next:'Choose a service below, explore its role and discuss the appropriate next step with us.'
 },
 physiotherapy: {
  path:'/physiotherapy',label:'Physiotherapy enquiries',
  title:'Child Physiotherapy Enquiries | Pinnacle Blooms Network',
  description:'Discuss your child’s movement and everyday activity questions. Confirm suitable physiotherapy, professional, location, appointment and fees. Call 9100 181 181.',
  opening:'Movement has a purpose.',emphasis:'Your child’s everyday life.',
  lead:'Bring the movement or everyday activity you want to discuss: joining play, moving around school or taking part in a family routine. We will help check the suitable professional conversation before you arrange a visit.',
  question:'Can I arrange physiotherapy for my child?',
  answer:'Call 9100 181 181 with your question and preferred location. Confirm whether physiotherapy is suitable, who would conduct the appointment, their qualifications, the format, current availability and fees before travelling.',
  moments:['The activity your child wants to take part in','What you observe at home, in play or at school','A clear explanation of the appropriate professional and next step'],
  next:'A child does not automatically need every therapy. The professional and family discuss relevant support around the child’s needs and priorities.'
 },
 psychology: {
  path:'/child-psychological-counseling',label:'Child psychology and counselling',
  title:'Child Psychologist & Psychological Counselling | Pinnacle Blooms',
  description:'Child psychology and counselling guidance for children and families. Confirm the suitable professional, centre, appointment and fee. Call 9100 181 181.',
  opening:'Understand your child.',emphasis:'Find a clearer next step together.',
  lead:'Talk through concerns about emotions, behaviour, learning or participation. We will help you identify an appropriate centre and confirm the available qualified professional, appointment and fee before you visit.',
  question:'Who should I speak with about my child?',
  answer:'Describe your question to the receiving team. Ask which professional is suitable, their relevant qualifications and registration, the appointment format and fee. An enquiry or this page does not diagnose your child.',
  moments:['Emotions, relationships and everyday participation','Learning or behaviour questions you want to understand','Your child’s strengths and the family priorities you want to discuss'],
  next:'Keep detailed child information for the private professional conversation. Your first enquiry can begin with a question and preferred location.'
 }
} as const;
export const assessmentCategories = {
 speech:{label:'Speech and language',opening:'Speech & language assessment.',question:'Help your child be understood.',service:'speech',related:'/top-speech-therapy-center-india-proven-improvement-rate'},
 'special-education':{label:'Special education',opening:'Learning & special education assessment.',question:'Understand the next step for learning and participation.',service:'education',related:'/best-special-education-center-call-9100181181'},
 psychological:{label:'Psychological',opening:'Psychological assessment enquiries.',question:'Bring your question. Confirm the appropriate professional.',service:'help',related:'/child-psychological-counseling'},
 personality:{label:'Personality',opening:'Personality assessment enquiries.',question:'Confirm the purpose, age range and suitable professional.',service:'help',related:'/speech-aba-autism-assessments'},
 occupational:{label:'Occupational therapy',opening:'Occupational therapy assessment.',question:'Connect everyday activities with a useful next step.',service:'occupational',related:'/best-occupational-therapy-center-india-proven-improvement-rate'},
 lifestyle:{label:'Everyday life',opening:'Lifestyle & everyday-life assessment enquiries.',question:'Discuss the routines and participation that matter to your family.',service:'help',related:'/everyday-therapy'},
 autism:{label:'Autism',opening:'Autism-related assessment enquiries.',question:'Understand abilities and the appropriate assessment pathway.',service:'autism',related:'/autism-therapy'},
 adhd:{label:'ADHD',opening:'ADHD-related assessment enquiries.',question:'Discuss your question and the appropriate professional pathway.',service:'help',related:'/child-psychological-counseling'}
} as const;
