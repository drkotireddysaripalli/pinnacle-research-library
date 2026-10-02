// Local build locations and their unchanged public canonical paths.
export const pageContracts = {
  shop:{path:'/shop',canonical:'/shop',static:'scripts/validate-book-shop.mjs'},
  pinnacleai:{path:'/pinnacleai',canonical:'/pinnacleai'},
  occupational: {path: '/best-occupational-therapy-center-india-proven-improvement-rate', canonical: '/best-occupational-therapy-center-india-proven-improvement-rate'},
  speech: {path: '/', canonical: '/top-speech-therapy-center-india-proven-improvement-rate'},
  enrolment: {path: '/enrolment', canonical: '/enroll-autism-speech-aba-therapies-india'},
  aba: {path: '/best-aba-therapy-center-india-proven-improvement-rate', canonical: '/best-aba-therapy-center-india-proven-improvement-rate'},
  autism: {path: '/autism-therapy', canonical: '/autism-therapy'}
  ,delhi: {path:'/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india',canonical:'/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india',static:'scripts/validate-centre-status.mjs'}
  ,policies:{path:'/policies',canonical:'/policies',static:'scripts/validate-current-policies.mjs'}
};
// CI follows the page currently in acceptance; change this only when the next page candidate is ready.
export const activeQualityPage='shop';
