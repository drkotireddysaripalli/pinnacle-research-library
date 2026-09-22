'use strict';

// Reusable, dependency-free opening. `route` is the canonical URL of the page
// hosting this instance; idPrefix keeps slide/share anchors unique per page.
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const fullStory = 'https://www.pinnacleblooms.org/verify/evidence/pinnacle-paradigm-shift.html';
const data = {
  title: 'Your child’s life. The purpose behind everything.',
  eyebrow: 'The PinnacleAI® paradigm shift',
  purpose: 'A self-sufficient, mainstream life for your child.',
  introduction: 'Seven pictures. One change in where the work begins.',
  slides: [
    {
      id: 'moon-mission', label: 'Moon', image: 'moon', width: 1200, height: 800,
      alt: 'A rocket, a luminous flight path and the Moon illustrate a mission that determines the means.',
      title: ['First, the Moon.', 'Then, the rocket.'],
      copy: 'A mission gives the engineering its purpose. The rocket, the instruments, the people and every decision must serve the destination.',
      connection: 'At Pinnacle, your child’s self-sufficient, mainstream life is the mission. Therapy is one of the means.',
      signature: 'The purpose decides the work.'
    },
    {
      id: 'home-before-bricks', label: 'Home', image: 'home', width: 1200, height: 800,
      alt: 'A family home illustrates planning around the life a family wants to live.',
      title: ['First, the life at home.', 'Then, the bricks.'],
      copy: 'You imagine a place to live, learn, rest and belong. Those needs shape the rooms, the materials and the people who build it.',
      connection: 'PinnacleAI® begins with what matters in your child’s life. The abilities and support that life needs guide what comes next.',
      signature: 'Begin with what the whole is for.'
    },
    {
      id: 'child-life-before-therapy', label: 'Child', image: 'hero', width: 900, height: 600,
      alt: 'A mother and child share a warm moment, representing the child and family at the centre of developmental support.',
      title: ['First, your child’s life.', 'Then, the therapy.'],
      copy: 'Communicating a need. Making a choice. Learning with others. Growing independence. These are reasons to choose the work—not questions to leave until the sessions are over.',
      connection: 'PinnacleAI® starts with that purpose, understands the child’s abilities and helps select the goals, methods and people to serve it.',
      signature: 'Life first. From the first conversation.'
    },
    {
      id: 'car-before-parts', label: 'Car', image: 'car', width: 1200, height: 800,
      alt: 'A car and its parts illustrate how each component serves the purpose of the whole vehicle.',
      title: ['You want a car', 'you can drive.'],
      copy: 'An engine, wheels and a steering system matter because of what they enable together: a car that takes you where you want to go. A collection of parts leaves the bigger job with you.',
      connection: 'PinnacleAI® asks what each goal contributes to your child’s life before choosing the technique. Every specialist’s contribution has a purpose.',
      signature: 'The whole gives each part its job.'
    },
    {
      id: 'child-abilities-for-life', label: 'Child', image: 'practice', width: 900, height: 600,
      alt: 'An adult and child practise together, illustrating an ability being used in a meaningful interaction.',
      title: ['“Help.” “More.” “Stop.”', 'A child has a say.'],
      copy: 'A word matters when it helps a child ask, choose or refuse. Holding a pencil matters through participation in learning. The purpose reaches beyond completing the task.',
      connection: 'PinnacleAI® links the child’s priorities with observable goals and practice. The supplied communication example shows how a life ability can shape a session.',
      signature: 'An ability matters through what it makes possible.'
    },
    {
      id: 'home-rooms-for-life', label: 'Home', image: 'home', width: 1200, height: 800,
      alt: 'A family home represents different spaces designed to support the same family’s daily life.',
      title: ['Different rooms.', 'The life you imagined.'],
      copy: 'The kitchen, bedroom and doorway do different jobs. You judge them by how they support living in the home—not by how impressive each looks on its own.',
      connection: 'At Pinnacle, speech, movement, learning, behaviour support and home practice serve the child’s life priorities. Each contribution must have a reason.',
      signature: 'Different expertise. A purpose in the child’s life.'
    },
    {
      id: 'child-life-from-minute-one', label: 'Child', image: 'learning', width: 900, height: 600,
      alt: 'A child participates in learning with an adult, representing abilities in use beyond an isolated task.',
      title: ['Your child’s life.', 'The purpose from minute one.'],
      copy: 'Understand the abilities. Set meaningful goals. Choose the methods and people. Practise where life happens. Review what the child can use, and adapt the work.',
      connection: 'A self-sufficient, mainstream life for your child is Pinnacle’s purpose. PinnacleAI® brings that purpose to each decision, with people guiding the work and the child’s needs shaping the next step.',
      signature: 'Because every child deserves a wonderful life.'
    }
  ],
  history: {
    title: '160 years. The child’s life must lead.',
    attribution: 'Pinnacle’s historical challenge',
    introduction: 'Children need abilities they can use to communicate, learn, participate and grow in independence. Pinnacle challenges an approach that starts with a technique, then leaves families to discover how separate gains add up to the life they want for their child.',
    issues: [
      { title: 'A task improves. The life question remains.', text: 'A child may perform an exercise more successfully while the family still needs to understand what it enables in learning, communication, choice or participation.' },
      { title: 'The family is left to join the parts.', text: 'When recommendations are fragmented, parents must work out how separate assessments, specialists and sessions serve the same child’s life.' },
      { title: 'Progress needs a place in real life.', text: 'A review needs to ask where an ability is useful, which support the child needs and what to work on next—not only which tasks were completed.' }
    ],
    independentContext: 'WHO and UNICEF’s 2023 report documents unmet needs, fragmented systems, waiting lists and exclusion. It calls for people-centred services and support for caregivers.',
    sourceTitle: '160 Years Without a Unified Metric — Pinnacle’s AbilityScore® monograph',
    sourceUrl: 'https://doi.org/10.5281/zenodo.19482123',
    contextUrl: 'https://www.who.int/news/item/15-09-2023-new-reports-highlights-neglected-health-needs-of-children-with-developmental-disabilities',
    boundary: 'The 160-year framing is Pinnacle’s historical argument. These are care problems and decision models, not a finding that every provider failed. WHO–UNICEF documents care gaps; it does not endorse PinnacleAI® or establish its comparative superiority.'
  },
  philosophy: {
    title: 'Your child’s life decides the work.',
    introduction: 'Self-sufficiency and mainstream participation give the work its direction. At Pinnacle, the life purpose comes first; abilities, goals, methods, specialists, everyday practice and review follow from it.',
    steps: [
      { title: 'Name what matters in life', text: 'Understand the child and family’s priorities for communication, choice, learning, participation and growing independence.' },
      { title: 'Understand the abilities', text: 'Use AbilityScore® and the child’s everyday observations to understand the starting point and the support needed.' },
      { title: 'Give each goal a purpose', text: 'Make the intended ability observable, so the family can understand what the goal would mean in the child’s life.' },
      { title: 'Choose the people and practice', text: 'Select the methods, specialist contributions and everyday programme around those goals, with human guidance.' },
      { title: 'Bring learning into daily life', text: 'Parents, caregivers, educators and therapists contribute through the child-specific programme and feedback.' },
      { title: 'Review. Learn. Adapt.', text: 'The Personal Development Kernel brings the child’s information and feedback into review. Ask what is becoming useful and let that guide the next decision.' }
    ],
    close: 'The measure of the work is what it helps make possible in the child’s life.',
    scope: 'Self-sufficiency and participation are the purpose of support. Each child’s progress, support needs and outcomes are individual.'
  }
};

const arrow = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
function createMarkup(options = {}) {
  const prefix = String(options.idPrefix || 'pinnacle-paradigm-opening').replace(/[^A-Za-z0-9_-]/g, '-');
  const headingId = String(options.headingId || prefix + '-title');
  const route = String(options.route || fullStory).split('#')[0];
  const ids = data.slides.map(slide => prefix + '-' + slide.id);
  const shared = encodeURIComponent('PinnacleAI® Paradigm Shift: your child’s self-sufficient, mainstream life is the purpose. See how that purpose shapes the abilities, goals, methods, people and everyday practice.\n\n' + fullStory);
  const slideMarkup = data.slides.map((slide, index) => {
    const share = encodeURIComponent('PinnacleAI® Paradigm Shift — ' + slide.title.join(' ') + '\n' + slide.connection + '\n\n' + route + '#' + ids[index]);
    return `<article class="po-slide" id="${escape(ids[index])}" data-po-slide role="group" aria-roledescription="slide" aria-label="${index + 1} of ${data.slides.length}: ${escape(slide.label)}" aria-labelledby="${escape(ids[index])}-title" tabindex="-1" data-share-managed="true">
      <div class="po-art"><img src="/images/paradigm-finale/${slide.image}-600.webp" srcset="/images/paradigm-finale/${slide.image}-600.webp 600w, /images/paradigm-finale/${slide.image}-1200.webp ${slide.width}w" sizes="(max-width: 760px) 94vw, (max-width: 1280px) 48vw, 610px" width="${slide.width}" height="${slide.height}" alt="${escape(slide.alt)}" loading="lazy" decoding="async"></div>
      <div class="po-slide-copy"><p class="po-kicker"><span>${String(index + 1).padStart(2, '0')} / 07</span> ${escape(slide.label)} · PinnacleAI®</p><h3 id="${escape(ids[index])}-title">${escape(slide.title[0])}<br><em>${escape(slide.title[1])}</em></h3><p class="po-analogy">${escape(slide.copy)}</p><p class="po-connection">${escape(slide.connection)}</p><p class="po-signature">${escape(slide.signature)}</p><a class="po-slide-share" href="https://wa.me/?text=${share}" target="_blank" rel="noopener" aria-label="Share slide ${index + 1} on WhatsApp: ${escape(slide.title.join(' '))}">Share this idea on WhatsApp ${arrow}</a></div>
    </article>`;
  }).join('\n');
  const output = `<section class="pinnacle-visual-opening" id="${escape(prefix)}" aria-labelledby="${escape(headingId)}" data-paradigm-opening data-share-managed="true">
    <header class="po-heading"><p class="po-kicker">${escape(data.eyebrow)}</p><h2 id="${escape(headingId)}">${escape(data.title)}</h2><p>${escape(data.introduction)}</p></header>
    <div class="po-carousel" role="region" aria-roledescription="carousel" aria-label="PinnacleAI paradigm shift in seven pictures">
      <div class="po-track" id="${escape(prefix)}-slides" data-po-track tabindex="0" aria-label="Seven illustrated ideas. Use left and right arrow keys or swipe to move between slides.">${slideMarkup}</div>
      <div class="po-navigation"><div class="po-controls" data-po-controls hidden><button type="button" class="po-arrow po-previous" data-po-previous aria-label="Previous idea" aria-controls="${escape(prefix)}-slides" disabled>${arrow}</button><p class="po-position" data-po-position aria-live="polite" aria-atomic="true">1 / 7 · Moon</p><button type="button" class="po-arrow" data-po-next aria-label="Next idea" aria-controls="${escape(prefix)}-slides">${arrow}</button></div><nav class="po-jumps" aria-label="Choose an illustrated idea">${data.slides.map((slide, index) => `<a href="#${escape(ids[index])}" data-po-jump="${index}"${index === 0 ? ' aria-current="step"' : ''} aria-label="Idea ${index + 1}: ${escape(slide.title.join(' '))}"><span>${index + 1}</span>${escape(slide.label)}</a>`).join('')}</nav></div>
    </div>
    <section class="po-history" id="${escape(prefix)}-history" aria-labelledby="${escape(prefix)}-history-title" data-share-managed="true"><div class="po-block-heading"><p class="po-kicker">${escape(data.history.attribution)}</p><h3 id="${escape(prefix)}-history-title">${escape(data.history.title)}</h3><p>${escape(data.history.introduction)}</p></div><div class="po-issues">${data.history.issues.map((issue, index) => `<article><span class="po-issue-number" aria-hidden="true">0${index + 1}</span><h4>${escape(issue.title)}</h4><p>${escape(issue.text)}</p></article>`).join('')}</div><div class="po-external"><strong>WHO &amp; UNICEF · 2023</strong><p>${escape(data.history.independentContext)}</p><a href="${data.history.contextUrl}" target="_blank" rel="noopener">Read the independent context ↗</a></div><details class="po-sources"><summary>Historical source and comparison scope</summary><p><a href="${data.history.sourceUrl}" target="_blank" rel="noopener">${escape(data.history.sourceTitle)} ↗</a></p><p>${escape(data.history.boundary)}</p></details></section>
    <section class="po-philosophy" id="${escape(prefix)}-philosophy" aria-labelledby="${escape(prefix)}-philosophy-title" data-share-managed="true"><div class="po-block-heading"><p class="po-kicker">The PinnacleAI® philosophy</p><h3 id="${escape(prefix)}-philosophy-title">${escape(data.philosophy.title)}</h3><p>${escape(data.philosophy.introduction)}</p></div><ol class="po-purpose-steps">${data.philosophy.steps.map((step, index) => `<li><span class="po-step-number" aria-hidden="true">${index + 1}</span><div><h4>${escape(step.title)}</h4><p>${escape(step.text)}</p></div></li>`).join('')}</ol><p class="po-conclusion">${escape(data.philosophy.close)}</p><p class="po-scope">${escape(data.philosophy.scope)}</p></section>
    <div class="po-finale"><div><p class="po-kicker">See the philosophy inside the work</p><h3>“Help.” “More.” “Stop.”</h3><p>Follow a life ability into the supplied goal and session example. Explore the complete story and its evidence at your pace.</p></div><div class="po-actions"><a class="po-button po-primary" href="/evidence/pinnacle-paradigm-shift.html">Explore the complete PinnacleAI® story ${arrow}</a><a class="po-button" href="/evidence/pinnacle-paradigm-shift.html#documented-example">See the goal and session example ${arrow}</a><a class="po-share" href="https://wa.me/?text=${shared}" target="_blank" rel="noopener">Share the paradigm shift on WhatsApp ↗</a></div></div>
  </section>`;
  return output.replace(/(<div class="po-track"[\s\S]*?<\/article>\s*<\/div>)\s*(<div class="po-navigation">[\s\S]*?<\/nav><\/div>)/, '$2$1');
}

const styles = `
.pinnacle-visual-opening .po-slide:focus{outline:none}.pinnacle-visual-opening .po-slide:focus-visible{outline:2px solid #9a48c1;outline-offset:-3px}

.pinnacle-visual-opening{--po-navy:#121b50;--po-teal:#007f87;--po-red:#c7234d;--po-muted:#4b6074;--po-line:#d7e4e8;max-width:1280px;margin-inline:auto;padding:42px 0 12px;color:var(--po-navy);background:#fff;min-width:0;text-align:left;overflow-wrap:break-word}
.pinnacle-visual-opening,.pinnacle-visual-opening *{box-sizing:border-box}.pinnacle-visual-opening [hidden]{display:none!important}.pinnacle-visual-opening .section-permalink{display:none}.pinnacle-visual-opening a{color:var(--po-teal);text-underline-offset:4px}.pinnacle-visual-opening a:focus-visible,.pinnacle-visual-opening button:focus-visible,.pinnacle-visual-opening summary:focus-visible,.pinnacle-visual-opening .po-track:focus-visible{outline:3px solid #9a48c1;outline-offset:4px}.pinnacle-visual-opening h2,.pinnacle-visual-opening h3,.pinnacle-visual-opening h4{font-family:inherit;color:var(--po-navy);font-weight:750}.pinnacle-visual-opening em{font-style:normal;color:var(--po-teal)}.pinnacle-visual-opening .po-kicker{font-size:12px;line-height:1.5;letter-spacing:.09em;text-transform:uppercase;font-weight:750;color:var(--po-teal);margin:0 0 14px}.pinnacle-visual-opening .po-heading{max-width:900px;padding:0 24px 24px}.pinnacle-visual-opening .po-heading h2{font-size:clamp(31px,3.7vw,48px);line-height:1.1;letter-spacing:-.025em;margin:0 0 14px}.pinnacle-visual-opening .po-heading>p:last-child{color:var(--po-muted);font-size:17px;margin:0;line-height:1.6}
.pinnacle-visual-opening .po-carousel{min-width:0;border:1px solid var(--po-line);border-radius:24px;background:#fff;overflow:hidden}.pinnacle-visual-opening .po-track{display:grid;grid-auto-flow:column;grid-auto-columns:100%;gap:0;width:100%;min-width:0;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:#b6d3d7 #f3f9fa;overscroll-behavior-x:contain;scroll-padding:0}.pinnacle-visual-opening .po-slide{display:grid;grid-template-columns:minmax(0,1.07fr) minmax(0,1fr);align-items:center;gap:26px;min-width:0;padding:36px 34px 34px 14px;scroll-snap-align:start;scroll-snap-stop:always;scroll-margin-top:95px;background:#fff}.pinnacle-visual-opening .po-art{min-width:0;display:flex;align-items:center;justify-content:center}.pinnacle-visual-opening .po-art img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:contain;max-height:480px;margin:0}.pinnacle-visual-opening .po-slide-copy{min-width:0;padding:12px 0}.pinnacle-visual-opening .po-slide-copy .po-kicker{font-size:11px;letter-spacing:.07em}.pinnacle-visual-opening .po-slide-copy .po-kicker>span{display:inline-block;margin-right:12px;color:var(--po-red)}.pinnacle-visual-opening .po-slide-copy h3{font-size:clamp(31px,3.55vw,49px);line-height:1.08;letter-spacing:-.035em;margin:0 0 21px}.pinnacle-visual-opening .po-analogy{font-size:19px;line-height:1.6;color:var(--po-muted);margin:0 0 17px}.pinnacle-visual-opening .po-connection{font-size:17px;line-height:1.6;color:var(--po-navy);margin:0 0 19px}.pinnacle-visual-opening .po-signature{font-size:19px;line-height:1.4;font-weight:750;color:var(--po-teal);padding-left:16px;border-left:3px solid #06a9b4;margin:0 0 15px}.pinnacle-visual-opening .po-slide-share{display:inline-flex;align-items:center;gap:10px;min-height:44px;font-size:13px;line-height:1.5;text-decoration:none;font-weight:650}.pinnacle-visual-opening .po-slide-share svg{width:17px;height:17px;flex:0 0 17px}
.pinnacle-visual-opening .po-navigation{padding:16px 22px;border-bottom:1px solid var(--po-line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;background:#f7fbfb}.pinnacle-visual-opening .po-controls{display:flex;align-items:center;gap:12px;min-width:0}.pinnacle-visual-opening .po-arrow{display:grid;place-items:center;width:44px;height:44px;border:1px solid #adcdd2;border-radius:50%;background:#fff;color:var(--po-teal);cursor:pointer;padding:0;flex:0 0 44px}.pinnacle-visual-opening .po-previous svg{transform:rotate(180deg)}.pinnacle-visual-opening .po-arrow:hover:not(:disabled){background:#e4f4f3;border-color:var(--po-teal)}.pinnacle-visual-opening .po-arrow:disabled{opacity:.4;cursor:default}.pinnacle-visual-opening .po-position{font-size:13px;font-weight:700;line-height:1.4;color:var(--po-navy);margin:0;min-width:92px;text-align:center}.pinnacle-visual-opening .po-jumps{display:flex;gap:5px;flex-wrap:wrap;align-items:center}.pinnacle-visual-opening .po-jumps a{display:inline-flex;min-height:44px;align-items:center;gap:6px;font-size:12px;line-height:1.3;text-decoration:none;padding:7px 10px;border:1px solid transparent;border-radius:9px;color:var(--po-muted);font-weight:650}.pinnacle-visual-opening .po-jumps a>span{font-size:10px;opacity:.8}.pinnacle-visual-opening .po-jumps a[aria-current]{border-color:#92c5c9;background:#fff;color:var(--po-teal)}.pinnacle-visual-opening .po-jumps a:hover{background:#fff;border-color:#c3dce0}
.pinnacle-visual-opening .po-history,.pinnacle-visual-opening .po-philosophy{margin-top:55px;padding:0 24px;scroll-margin-top:95px}.pinnacle-visual-opening .po-block-heading{max-width:870px}.pinnacle-visual-opening .po-block-heading h3{font-size:clamp(31px,3.6vw,46px);line-height:1.12;letter-spacing:-.03em;margin:0 0 18px}.pinnacle-visual-opening .po-block-heading>p:last-child{font-size:19px;line-height:1.7;color:var(--po-muted);margin:0 0 27px}.pinnacle-visual-opening .po-history .po-kicker{color:var(--po-red)}.pinnacle-visual-opening .po-issues{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}.pinnacle-visual-opening .po-issues article{border-top:2px solid #df7890;padding-top:20px;min-width:0}.pinnacle-visual-opening .po-issue-number{font-size:12px;letter-spacing:.09em;font-weight:750;color:var(--po-red)}.pinnacle-visual-opening .po-issues h4{font-size:23px;line-height:1.22;margin:12px 0 13px}.pinnacle-visual-opening .po-issues p{font-size:16px;line-height:1.65;color:var(--po-muted);margin:0}.pinnacle-visual-opening .po-external{display:grid;grid-template-columns:190px minmax(0,1fr);gap:6px 24px;margin-top:29px;padding:23px 0 10px;border-top:1px solid var(--po-line)}.pinnacle-visual-opening .po-external strong{font-size:12px;letter-spacing:.035em;line-height:1.6;color:var(--po-teal)}.pinnacle-visual-opening .po-external p{font-size:15px;line-height:1.65;margin:0;color:var(--po-muted)}.pinnacle-visual-opening .po-external a{grid-column:2;display:inline-flex;align-items:center;min-height:44px;font-size:13px;font-weight:650}.pinnacle-visual-opening .po-sources{border-top:1px solid var(--po-line);color:var(--po-muted);font-size:13px;line-height:1.65}.pinnacle-visual-opening .po-sources summary{padding:12px 0;min-height:46px;cursor:pointer;font-weight:650;color:var(--po-teal)}.pinnacle-visual-opening .po-sources p{max-width:950px;margin:0 0 15px}.pinnacle-visual-opening .po-sources p:first-of-type a{min-height:44px;display:inline-flex;align-items:center}
.pinnacle-visual-opening .po-philosophy{padding-top:32px;border-top:1px solid var(--po-line)}.pinnacle-visual-opening .po-purpose-steps{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:27px 28px;padding:0;margin:0}.pinnacle-visual-opening .po-purpose-steps li{display:flex;align-items:flex-start;gap:13px;min-width:0}.pinnacle-visual-opening .po-step-number{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;border-radius:50%;border:1px solid #aed9dc;background:#f0fafa;color:var(--po-teal);font-size:13px;font-weight:750}.pinnacle-visual-opening .po-purpose-steps h4{font-size:20px;line-height:1.25;margin:5px 0 10px}.pinnacle-visual-opening .po-purpose-steps p{font-size:15px;line-height:1.65;color:var(--po-muted);margin:0}.pinnacle-visual-opening .po-conclusion{font-size:clamp(24px,2.4vw,32px);line-height:1.3;letter-spacing:-.015em;font-weight:750;color:var(--po-teal);margin:34px 0 14px;max-width:950px}.pinnacle-visual-opening .po-scope{font-size:13px;line-height:1.6;color:var(--po-muted);margin:0;max-width:840px}.pinnacle-visual-opening .po-finale{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:35px;margin:39px 0 0;padding:30px 25px;border-block:1px solid var(--po-line);background:#f5faf9;border-radius:20px}.pinnacle-visual-opening .po-finale h3{font-size:36px;line-height:1.2;letter-spacing:-.025em;margin:0 0 13px}.pinnacle-visual-opening .po-finale p:last-child{font-size:17px;line-height:1.65;color:var(--po-muted);margin:0}.pinnacle-visual-opening .po-actions{display:flex;flex-direction:column;align-items:stretch;gap:10px}.pinnacle-visual-opening .po-button{display:flex;align-items:center;justify-content:space-between;gap:13px;min-height:50px;border:1px solid #b5d4d6;border-radius:11px;padding:12px 17px;font-size:15px;font-weight:700;line-height:1.5;text-decoration:none;background:#fff}.pinnacle-visual-opening .po-button svg{flex:0 0 22px}.pinnacle-visual-opening .po-primary{background:var(--po-teal);border-color:var(--po-teal);color:#fff}.pinnacle-visual-opening .po-button:hover{box-shadow:0 3px 12px #005d6b12}.pinnacle-visual-opening .po-share{display:inline-flex;align-items:center;min-height:44px;font-size:13px;line-height:1.5}
@media(max-width:1000px){.pinnacle-visual-opening .po-slide{gap:15px;padding:25px 25px 22px 8px}.pinnacle-visual-opening .po-slide-copy h3{font-size:36px}.pinnacle-visual-opening .po-analogy{font-size:17px}.pinnacle-visual-opening .po-connection{font-size:16px}.pinnacle-visual-opening .po-signature{font-size:17px}.pinnacle-visual-opening .po-navigation{justify-content:center}.pinnacle-visual-opening .po-issues{gap:20px}.pinnacle-visual-opening .po-purpose-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.pinnacle-visual-opening .po-finale{gap:25px}}
@media(max-width:760px){.pinnacle-visual-opening{padding-top:28px}.pinnacle-visual-opening .po-heading{padding:0 7px 19px}.pinnacle-visual-opening .po-heading h2{font-size:32px}.pinnacle-visual-opening .po-heading>p:last-child{font-size:15px}.pinnacle-visual-opening .po-kicker{font-size:10px;margin-bottom:12px}.pinnacle-visual-opening .po-carousel{border-radius:18px}.pinnacle-visual-opening .po-slide{grid-template-columns:minmax(0,1fr);align-content:start;gap:0;padding:0 19px 18px}.pinnacle-visual-opening .po-art{margin-inline:-12px;padding-top:9px}.pinnacle-visual-opening .po-art img{max-height:285px}.pinnacle-visual-opening .po-slide-copy{padding-top:10px}.pinnacle-visual-opening .po-slide-copy h3{font-size:34px;line-height:1.1;margin-bottom:17px}.pinnacle-visual-opening .po-slide-copy .po-kicker{font-size:10px;margin-bottom:12px}.pinnacle-visual-opening .po-analogy{font-size:16px;line-height:1.6;margin-bottom:13px}.pinnacle-visual-opening .po-connection{font-size:16px;line-height:1.6;margin-bottom:16px}.pinnacle-visual-opening .po-signature{font-size:17px;padding-left:12px;margin-bottom:9px}.pinnacle-visual-opening .po-slide-share{font-size:12px}.pinnacle-visual-opening .po-navigation{padding:12px 10px;gap:11px}.pinnacle-visual-opening .po-controls{justify-content:space-between;width:100%;max-width:280px;gap:15px}.pinnacle-visual-opening .po-position{font-size:12px}.pinnacle-visual-opening .po-jumps{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;width:100%;max-width:490px}.pinnacle-visual-opening .po-jumps a{flex-direction:column;justify-content:center;gap:2px;padding:6px 2px;font-size:10px;min-height:46px;border-radius:7px}.pinnacle-visual-opening .po-jumps a>span{font-size:9px}.pinnacle-visual-opening .po-history,.pinnacle-visual-opening .po-philosophy{margin-top:36px;padding-inline:7px}.pinnacle-visual-opening .po-block-heading h3{font-size:31px;margin-bottom:16px}.pinnacle-visual-opening .po-block-heading>p:last-child{font-size:17px;line-height:1.65;margin-bottom:23px}.pinnacle-visual-opening .po-issues{grid-template-columns:1fr;gap:24px}.pinnacle-visual-opening .po-issues article{padding-top:16px}.pinnacle-visual-opening .po-issues h4{font-size:23px;margin:9px 0 12px}.pinnacle-visual-opening .po-issues p{font-size:16px}.pinnacle-visual-opening .po-external{grid-template-columns:1fr;gap:9px;margin-top:25px;padding-top:19px}.pinnacle-visual-opening .po-external a{grid-column:auto}.pinnacle-visual-opening .po-sources{font-size:12px}.pinnacle-visual-opening .po-philosophy{padding-top:26px}.pinnacle-visual-opening .po-purpose-steps{grid-template-columns:1fr;gap:23px}.pinnacle-visual-opening .po-purpose-steps h4{font-size:21px;margin-top:4px}.pinnacle-visual-opening .po-purpose-steps p{font-size:16px}.pinnacle-visual-opening .po-conclusion{font-size:26px;margin-top:28px}.pinnacle-visual-opening .po-finale{grid-template-columns:1fr;padding:24px 19px;margin-top:29px;gap:20px;border-radius:16px}.pinnacle-visual-opening .po-finale h3{font-size:32px}.pinnacle-visual-opening .po-finale p:last-child{font-size:16px}.pinnacle-visual-opening .po-button{font-size:14px;padding:12px 14px}.pinnacle-visual-opening .po-share{font-size:12px}}
@media(prefers-reduced-motion:reduce){.pinnacle-visual-opening .po-track{scroll-behavior:auto}}
@media print{.pinnacle-visual-opening .po-track{display:block;overflow:visible}.pinnacle-visual-opening .po-slide{display:grid;grid-template-columns:1fr 1fr;break-inside:avoid;padding:20px 0;border-bottom:1px solid #ccc}.pinnacle-visual-opening .po-slide-copy h3{font-size:26px}.pinnacle-visual-opening .po-art img{max-height:240px}.pinnacle-visual-opening .po-navigation,.pinnacle-visual-opening .po-slide-share,.pinnacle-visual-opening .po-actions{display:none}.pinnacle-visual-opening .po-history,.pinnacle-visual-opening .po-philosophy{break-before:auto}.pinnacle-visual-opening .po-sources{display:block}}
`;

const script = `(function(){'use strict';
function initialise(root){
  if(root.dataset.poReady)return;
  var track=root.querySelector('[data-po-track]');
  var slides=Array.from(root.querySelectorAll('[data-po-slide]'));
  var controls=root.querySelector('[data-po-controls]');
  var previous=root.querySelector('[data-po-previous]');
  var next=root.querySelector('[data-po-next]');
  var position=root.querySelector('[data-po-position]');
  var jumps=Array.from(root.querySelectorAll('[data-po-jump]'));
  if(!track||!slides.length||!controls||!previous||!next||!position)return;
  root.dataset.poReady='true';controls.hidden=false;
  var current=0,frame=0;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update(index){
    current=index;previous.disabled=index===0;next.disabled=index===slides.length-1;
    var label=slides[index].getAttribute('aria-label').split(': ').slice(1).join(': ');
    var text=(index+1)+' / '+slides.length+' · '+label;
    if(position.textContent!==text)position.textContent=text;
    jumps.forEach(function(jump,i){if(i===index)jump.setAttribute('aria-current','step');else jump.removeAttribute('aria-current');});
  }
  function go(index,instant){
    index=Math.max(0,Math.min(slides.length-1,index));
    var target=slides[index].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
    track.scrollTo({left:target,behavior:instant||reduced?'auto':'smooth'});update(index);
  }
  function closest(){
    frame=0;var left=track.getBoundingClientRect().left,best=0,distance=Infinity;
    slides.forEach(function(slide,index){var delta=Math.abs(slide.getBoundingClientRect().left-left);if(delta<distance){distance=delta;best=index;}});update(best);
  }
  function jumpToHash(){
    var hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch(error){return;}
    var index=slides.findIndex(function(slide){return slide.id===hash;});if(index>=0)go(index,true);
  }
  previous.addEventListener('click',function(){go(current-1,false);});
  next.addEventListener('click',function(){go(current+1,false);});
  jumps.forEach(function(jump,index){jump.addEventListener('click',function(event){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();go(index,false);try{history.replaceState(history.state,'','#'+slides[index].id);}catch(error){}
  });});
  track.addEventListener('scroll',function(){if(!frame)frame=requestAnimationFrame(closest);},{passive:true});
  track.addEventListener('keydown',function(event){
    if(event.target!==track)return;
    var index=current;if(event.key==='ArrowRight')index++;else if(event.key==='ArrowLeft')index--;else if(event.key==='Home')index=0;else if(event.key==='End')index=slides.length-1;else return;
    event.preventDefault();go(index,false);
  });
  window.addEventListener('hashchange',jumpToHash);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(function(){go(current,true);}).observe(track);
  update(0);requestAnimationFrame(jumpToHash);
}
function start(){document.querySelectorAll('[data-paradigm-opening]').forEach(initialise);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();`;

const markdown = [
  '## ' + data.eyebrow,
  data.title,
  data.purpose,
  data.introduction,
  ...data.slides.map((slide, index) => '### ' + (index + 1) + '. ' + slide.label + ' — ' + slide.title.join(' ') + '\n\n' + slide.copy + '\n\n' + slide.connection + '\n\n' + slide.signature),
  '## ' + data.history.title,
  data.history.attribution + '\n\n' + data.history.introduction,
  ...data.history.issues.map(issue => '### ' + issue.title + '\n\n' + issue.text),
  'WHO and UNICEF · 2023\n\n' + data.history.independentContext + '\n\nSource: ' + data.history.contextUrl,
  'Historical source: ' + data.history.sourceTitle + '\n' + data.history.sourceUrl,
  data.history.boundary,
  '## The PinnacleAI® philosophy: ' + data.philosophy.title,
  data.philosophy.introduction,
  ...data.philosophy.steps.map((step, index) => (index + 1) + '. ' + step.title + '\n\n' + step.text),
  data.philosophy.close,
  data.philosophy.scope,
  '## See the philosophy inside the work',
  '“Help.” “More.” “Stop.” Follow a life ability into the supplied goal and session example: ' + fullStory + '#documented-example',
  'Explore the complete PinnacleAI® story: ' + fullStory
].join('\n\n') + '\n\n';

module.exports = { data, createMarkup, markup: createMarkup(), styles, script, markdown };
