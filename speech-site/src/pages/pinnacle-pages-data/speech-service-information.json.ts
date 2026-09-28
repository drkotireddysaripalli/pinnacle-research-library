import { speechServiceFacts } from '../../data/speech-service-facts';
export const GET = () => new Response(JSON.stringify(speechServiceFacts,null,2)+'\n',{headers:{'Content-Type':'application/json; charset=utf-8'}});
