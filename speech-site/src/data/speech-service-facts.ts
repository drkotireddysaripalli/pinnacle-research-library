import { speechOffer } from './speech-offer';
export const speechServiceFacts = {
  "title": "Pinnacle speech-service information",
  "url": "https://www.pinnacleblooms.org/speech-therapy/service-information",
  "checkedOn": "2026-09-27",
  "publisher": "Bharath Healthcare Laboratories Private Limited",
  "brand": "Pinnacle Blooms Network",
  "sourceType": "Pinnacle service information and current assessment offer",
  "process": "We listen to family observations, review relevant documents and use formal and informal assessment activities.",
  "assessmentDuration": "About one hour, depending on the child's needs; confirm with the centre.",
  "reportTiming": "We confirm when the written report will be ready. Our service guide allows a couple of days; timing is agreed for the appointment.",
  "therapySession": "Our service guide describes 40 minutes of therapy plus five minutes of parent review. We confirm the applicable session structure with the centre.",
  "feeStatus": "Speech and language assessment: listed value INR 25999, current offer FREE. Ongoing therapy is priced separately.",
  "sources": [
    {
      "url": "https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate",
      "retrievedOn": "2026-09-27",
      "scope": "Previous edition: assessment process, duration, report and session structure",
      "archivedSha256": "6d3837ea17f54046c5abdfc3adb564eb85d6dea48be3a79def66ac25e33b5dc9"
    }
  ],
  "phone": "+919100181181",
  "assessmentOffer": {
    "name": "Speech and language assessment",
    "price": 0,
    "priceCurrency": "INR",
    "listedValue": 25999,
    "confirmedOn": "2026-09-27",
    "confirmedBy": "Pinnacle Blooms Network",
    "bookingUrl": "https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?entry=speech-assessment#speech-assessment-enquiry",
    "scope": "Assessment only; ongoing therapy is priced separately."
  },
  "offerHistory": "Current offer and listed value confirmed by Pinnacle on 27 September 2026; supersedes earlier campaign price information.",
  "updatedOn": "2026-09-28",
  "appointmentConfirmation": "The team contacts the family to confirm the centre and appointment. An enquiry is not a confirmed appointment."
};
speechServiceFacts.assessmentOffer.bookingUrl=speechOffer.url;
speechServiceFacts.assessmentOffer.price=speechOffer.price;
speechServiceFacts.assessmentOffer.listedValue=speechOffer.listedValue;
