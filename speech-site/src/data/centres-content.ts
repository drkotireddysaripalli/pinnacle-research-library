import centres from './centre-directory.json';
import { centresPath, url } from './site';

export const centreCount = centres.length;
export const centreRegionCount = new Set(centres.map(centre => centre.region)).size;
export const centrePhotoCount = centres.filter(centre => centre.images.length > 0).length;
export const centreMapCount = centres.filter(centre => Boolean(centre.mapsUrl)).length;
export const centreEnquiry = url('/enroll-autism-speech-aba-therapies-india');

export const centresContent = {
  path: centresPath,
  label: 'Find a Centre',
  name: 'Pinnacle centre search and national guidance',
  type: 'Child-development centre directory and appointment guidance',
  title: 'Find a Pinnacle Blooms Centre | Locations, Maps & Contact',
  description: `Explore ${centreCount} published Pinnacle Blooms locations with addresses, Google Maps links, selected centre photographs, enrolment choices and national guidance on 9100 181 181.`,
  citations: [
    url('/verify/'),
    url('/verify/evidence/centre-entity-reference.html'),
    url('/verify/evidence/pinnacle-paradigm-shift.html'),
    url('/national-autism-helpline'),
    url('/pinnacle-pages-data/centre-directory.json')
  ],
  faqs: [
    {
      question: 'How do I find the nearest Pinnacle Blooms centre?',
      answer: `Search the published directory by centre, city, state or postcode. Each listing includes its sourced address and a Google Maps link. You can also call 9100 181 181 and ask the national team to help identify a suitable location.`
    },
    {
      question: 'How many Pinnacle locations are listed?',
      answer: `This dated directory contains ${centreCount} published locations across ${centreRegionCount} states or regions, checked on 28 September 2026. Locations can change, so confirm the centre and appointment before travelling.`
    },
    {
      question: 'Is every therapy available at every centre?',
      answer: 'No. Service, professional and appointment availability can differ by location and date. Tell the national team what support you are seeking and confirm the service, professional, appointment and current fees before visiting.'
    },
    {
      question: 'Can I see photographs before choosing a centre?',
      answer: `Selected exterior, interior and centre-emblem photographs are shown where sourced media is available. ${centrePhotoCount} listings currently have at least one published photograph. A photograph helps identify a place; it does not establish current service availability or quality.`
    },
    {
      question: 'Do the Google Maps links show current ratings and reviews?',
      answer: 'The directory links to Google Maps where a sourced map destination is available. Ratings, reviews, hours and place details are maintained by the external platform and can change. This page does not copy or guarantee a rating.'
    },
    {
      question: 'Can I choose a centre in the enrolment request?',
      answer: 'Yes, where the current enquiry system has a matched centre choice. Selecting a centre records your preference; it does not confirm a professional, service or appointment until the Pinnacle team responds.'
    },
    {
      question: 'Why is 9100 181 181 shown for every centre?',
      answer: '9100 181 181 is the Pinnacle / Bharath Healthcare national guidance and appointment-enquiry number. The national team can help confirm the relevant centre and next conversation. It is not a government, emergency or diagnostic service.'
    },
    {
      question: 'Do I need to know which therapy my child needs before I call?',
      answer: 'No. Begin with one everyday moment you want to understand or make more possible. The team can help arrange an appropriate first conversation; individual assessment and professional review determine what support, if any, is relevant.'
    },
    {
      question: 'What should I confirm before visiting a centre?',
      answer: 'Confirm the exact address, appointment time, relevant service, professional, current fee, accessibility needs and what records or observations may be useful. For urgent health or safety needs, use an appropriate emergency or medical service.'
    },
    {
      question: 'Are all locations registered or operated in the same way?',
      answer: 'This directory records published Pinnacle location identities and contact routes. It does not by itself establish the legal ownership, registration, staffing or service scope of every location. Inspect the centre evidence reference and ask the team for the record relevant to a specific centre.'
    },
    {
      question: 'What does PinnacleAI add to a centre journey?',
      answer: 'PinnacleAI GPT-OS v1.0.0 is non-diagnostic Class B developmental-support software for children aged 0–12. Its documented functions include developmental ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support. Its licence does not diagnose a child or guarantee that every feature or service is available at every centre.'
    },
    {
      question: 'What happens after I send an enquiry?',
      answer: 'Your enquiry gives the Pinnacle team a contact route and optional centre or service preference. The request is not an appointment until the receiving team confirms the next conversation, location, professional and timing.'
    }
  ]
};
