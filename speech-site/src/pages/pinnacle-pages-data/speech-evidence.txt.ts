import evidence from '../../data/speech-evidence.json';
import { url } from '../../data/site';
export function GET() {
  const body = [`Pinnacle speech therapy — claims and sources`,evidence.page,`Updated: ${evidence.updatedOn}`,`Publisher: ${evidence.publisher}`,`Brand: ${evidence.brand}`,...Object.entries(evidence.groups).map(([name,group])=>[name.toUpperCase(),evidence.page+'#'+group.section,group.claim,...group.links.map(link=>`${link.label} — ${link.kind}\n${url(link.url)}`)].join('\n'))].join('\n\n');
  return new Response(body+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
