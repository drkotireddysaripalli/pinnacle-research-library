// Two source-reviewed, already-indexable treatment pages. Other centre copy,
// operating status, advertising holds and the seven comparison pages are intact.
export const centreSearchSnippetExperiment='centre-local-speech-snippets-20261015';
export const centreSearchSnippets=Object.freeze({
 '/centers/best-autism-speech-aba-occupational-therapy-center-jayanagar-bengaluru-india':Object.freeze({
  title:'Speech Therapy Enquiries in Jayanagar | Pinnacle Blooms',
  description:'Ask Pinnacle Blooms about speech and child-development support in Jayanagar, Bengaluru. Speak with the team to confirm services, availability and your next step.'
 }),
 '/centers/best-autism-speech-aba-occupational-therapy-center-nad-vizag-ap-india':Object.freeze({
  title:'Speech Therapy Enquiries, NAD Vizag | Pinnacle Blooms',
  description:'Ask Pinnacle Blooms about speech and child-development support near NAD, Visakhapatnam. Speak with the team to confirm services, availability and your next step.'
 })
});
export const centreSearchSnippet=path=>Object.hasOwn(centreSearchSnippets,path)?centreSearchSnippets[path]:null;
