import evidence from '../../data/speech-evidence.json';
import { url } from '../../data/site';
export function GET() {
  const groups = Object.fromEntries(Object.entries(evidence.groups).map(([key, group]) => [key, {...group, sectionUrl:evidence.page+'#'+group.section, links:group.links.map(link => ({...link,url:url(link.url)}))}]));
  return new Response(JSON.stringify({...evidence,groups},null,2)+'\n',{headers:{'Content-Type':'application/json; charset=utf-8'}});
}
