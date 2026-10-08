// One evidenced legacy destination. Unknown records and private responses pass through.
export const HAND_FLAPPING_PATH = '/c/hand-flapping-therapy';
export const HAND_FLAPPING_TITLE = 'Hand Flapping in Children: Meaning & Support | Pinnacle Blooms';
export const HAND_FLAPPING_HEADING = 'Hand flapping in children: what it means and when support helps';
export const HAND_FLAPPING_SUMMARY = 'Hand flapping can express excitement or help a child regulate sensations and feelings. The movement alone does not diagnose autism or automatically need treatment. Pinnacle Blooms Network helps families discuss support when distress, safety or everyday participation is affected.';
const oldHeading = 'Understanding and Managing Hand Flapping in Children | Pinnacle Blooms Network';
const oldSummary = 'Hand flapping in children can significantly impact their ability to engage socially and perform daily tasks. Pinnacle Blooms Network provides comprehensive, personalized therapies to help children manage hand flapping and improve their quality of life.';
const guidance = `<section data-pinnacle-priority-content style="padding:24px 0;max-width:72ch;color:#242a2e;font:400 18px/1.65 system-ui,sans-serif"><h2 style="font-size:26px;line-height:1.25">Understand your child before choosing support</h2><p>Notice when the movement happens, what your child enjoys or finds difficult, and whether they are comfortable. Harmless stimming can serve a useful purpose. Support should address the child’s needs rather than require them to hide a safe movement.</p><h2 style="font-size:26px;line-height:1.25">When should a family ask for help?</h2><p>Discuss pain, injury, distress, loss of skills or difficulties with communication, play, learning or everyday activities with an appropriately qualified professional. A sudden change or injury needs medical advice. Hand flapping alone cannot establish a diagnosis.</p><h2 style="font-size:26px;line-height:1.25">Connect the question to everyday life</h2><p>Pinnacle Blooms Network starts with the child’s abilities and the family’s priorities. Explore <a href="https://www.pinnacleblooms.org/occupational-therapy">occupational therapy</a>, <a href="https://pinnacleblooms.org/ask/is-stimming-always-a-bad-sign-that-must-be-stopped">the explanation of stimming</a> and <a href="https://www.pinnacleblooms.org/centers">your nearest Pinnacle centre</a>. Call <a href="tel:+919100181181">9100 181 181</a> to discuss the relevant professional, appointment and fees. The aim is useful participation and growing independence; support depends on the individual child.</p><p style="font-size:16px">Source: <a href="https://www.autism.org.uk/advice-and-guidance/about-autism/repeated-movements-and-behaviour-stimming">National Autistic Society: stimming and repetitive movements</a>. Page updated 8 October 2026. General information, not an individual assessment.</p></section>`;

export async function repairPriorityContent(request, response) {
 const u = new URL(request.url);
 if (u.origin !== 'https://www.pinnacleblooms.org' || u.pathname.replace(/\/$/,'') !== HAND_FLAPPING_PATH || request.method !== 'GET' || request.headers.has('authorization') || request.headers.has('range') || response.status !== 200 || response.headers.has('set-cookie') || /noindex/i.test(response.headers.get('x-robots-tag') || '') || /no-store|no-transform/i.test(response.headers.get('cache-control') || '') || !/^text\/html/i.test(response.headers.get('content-type') || '')) return response;
 const body = await response.text();
 const headings = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
 const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].filter(m => m[1].trim() === oldSummary);
 // Require the captured public record, never a generic error page or adjacent record.
 if (body.length > 1024*1024 || headings.length !== 1 || headings[0][1].trim() !== oldHeading || paragraphs.length !== 1 || !body.includes('rel="canonical" href="https://www.pinnacleblooms.org'+HAND_FLAPPING_PATH+'"')) return new Response(body,response);
 let changed = body.replace(headings[0][0], headings[0][0].replace(headings[0][1], HAND_FLAPPING_HEADING)).replace(paragraphs[0][0], '<p class="pinnacle-paragraph">'+HAND_FLAPPING_SUMMARY+'</p>'+guidance);
 const headers = new Headers(response.headers);
 for (const name of ['content-length','content-encoding','etag','last-modified','content-md5','digest']) headers.delete(name);
 headers.set('x-pinnacle-priority-content','20261008-hand-flapping');
 return new HTMLRewriter().on('head > title',{element(el){el.setInnerContent(HAND_FLAPPING_TITLE);}}).on('head > meta',{element(el){
  const name=(el.getAttribute('name')||el.getAttribute('property')||'').toLowerCase();
  if(['description','og:description','twitter:description'].includes(name))el.setAttribute('content',HAND_FLAPPING_SUMMARY);
  if(['og:title','twitter:title'].includes(name))el.setAttribute('content',HAND_FLAPPING_TITLE);
 }}).transform(new Response(changed,{status:response.status,statusText:response.statusText,headers}));
}
