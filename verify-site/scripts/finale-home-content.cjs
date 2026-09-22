'use strict';

// The homepage establishes the argument; the complete campaign carries its depth.
const legacyStory = require('../content/paradigm-story.json');
const route = '/evidence/pinnacle-paradigm-shift.html';
const publicRoute = 'https://www.pinnacleblooms.org/verify' + route;

module.exports = ({e, icon}) => {
  // Compatibility anchors preserve earlier authored and automatically generated links.
  const oldIds = ['section-your-child-s-path-toward-self-sufficiency-and-mainstream-life', 'block-about-the-story-and-its-evidence',
    ...Array.from({length:9}, (_,i) => ['block-read-the-card', 'block-card-sources'].map(x => x + (i ? '-' + (i+1) : ''))).flat(),
    'paradigm-story-track', ...legacyStory.cards.flatMap(card => [
      'paradigm-story-card-' + card.id,
      'paradigm-story-card-' + card.id + '-title'
    ])];
  const compatibility = oldIds.map(id => `<span class="finale-home-compat" id="${e(id)}" aria-hidden="true"></span>`).join('');
  const model = (kind, title, steps) => `<div class="finale-home-model finale-home-${kind}"><h3>${e(title)}</h3><ol>${steps.map((step,i) => `<li><span class="finale-home-step-number" aria-hidden="true">${i+1}</span><span>${e(step)}</span></li>`).join('')}</ol></div>`;
  const share = 'The outcome belongs at the beginning. PinnacleAI® starts with the child’s self-sufficient, mainstream life, then selects abilities, goals, methods and support to serve it. Explore the historical challenge, the reversal in starting order, a supplied planning example and original sources.\n\n' + publicRoute;
  const html = `<section class="finale-home wrap" id="pinnacle-paradigm-story" data-share-managed="true" aria-labelledby="paradigm-story-heading">
${compatibility}
<div class="finale-home-frame">
  <div class="finale-home-history"><p class="finale-home-eyebrow">PinnacleAI® Paradigm Shift</p><a href="/evidence/publications/zenodo-19482123.html"><strong>“160 Years Without a Unified Metric”</strong><span>The historical challenge in Pinnacle’s AbilityScore® monograph ${icon('arrow-up-right')}</span></a></div>
  <header class="finale-home-heading"><h2 id="paradigm-story-heading">The outcome belongs<br><em>at the beginning.</em></h2><p>When the work begins with a technique, families can be left to connect the parts to the life they want for their child.</p><p class="finale-home-family-question">“After all these sessions, what is becoming possible in my child’s life?”</p></header>
  <div class="finale-home-models" aria-label="Two decision models: the change in starting order">
    ${model('method', 'Method-first decision model', ['Choose a specialty or technique', 'Set its exercises and sessions', 'Record task performance', 'Ask how it adds up to life'])}
    ${model('life', 'PinnacleAI®: life first', ['Start with self-sufficiency and participation', 'Measure abilities. Identify priorities.', 'Choose goals, methods and people', 'Review everyday use. Adapt the work.'])}
  </div>
  <p class="finale-home-model-note">These paths illustrate different starting orders; individual care models vary.</p>
  <div class="finale-home-application"><figure class="finale-home-visual"><img src="/images/paradigm-finale/moon-600.webp" width="600" height="400" loading="lazy" decoding="async" alt="Illustrated rocket following a luminous route toward the Moon."><figcaption>The Moon was the mission.<br><strong>The rocket was the means.</strong></figcaption></figure><div class="finale-home-life-example"><p class="finale-home-eyebrow">Life sets the direction. Therapy serves the purpose.</p><h3>From completing a task<br>to using an ability.</h3><a class="finale-home-example-link" href="${route}#documented-example">Help. More. Stop. ${icon('arrow-up-right')}</a><p>A way to ask. A choice that is heard. See how a life ability shapes a written goal, the practice selected and what to review.</p><span class="finale-home-example-label">Explore an anonymised supplied planning example.</span></div></div>
  <div class="finale-home-close"><div><strong>A self-sufficient, mainstream life for your child.</strong><span>The purpose at Pinnacle. The starting point for PinnacleAI®.</span></div><a class="finale-home-primary" href="${route}">See the paradigm shift ${icon('arrow-up-right')}</a></div>
  <div class="finale-home-foot"><a href="${route}#the-historical-challenge">Read the historical argument and its sources ${icon('file-search')}</a><a class="finale-home-share" href="https://wa.me/?text=${e(encodeURIComponent(share))}" target="_blank" rel="noopener noreferrer" aria-label="Share the PinnacleAI paradigm shift on WhatsApp">Share on WhatsApp ${icon('arrow-up-right')}</a></div>
</div></section>`;

  const css = `
.finale-home .section-permalink{display:none}
.finale-home{position:relative;padding-block:20px 34px;color:#14204d}
.finale-home .finale-home-compat{position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.finale-home .finale-home-frame{padding:35px 38px 18px;border:1px solid #cbdfe2;border-radius:23px;background:#fff;box-shadow:0 12px 32px rgb(20 32 77 / 4%)}
.finale-home .finale-home-eyebrow{margin:0 0 10px;color:#007d83;font-size:11px;font-weight:750;line-height:1.5;letter-spacing:.095em;text-transform:uppercase}
.finale-home .finale-home-history{padding-bottom:23px;border-bottom:1px solid #dce8e9}
.finale-home .finale-home-history a{display:inline-flex;flex-direction:column;gap:7px;text-decoration:none;color:#14204d}
.finale-home .finale-home-history strong{font-size:clamp(23px,2.5vw,31px);line-height:1.2;font-weight:750;letter-spacing:-.02em;color:#bc234c}
.finale-home .finale-home-history a>span{display:flex;align-items:center;gap:7px;font-size:13px;line-height:1.5;color:#496371}
.finale-home .finale-home-heading{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:13px 34px;padding-top:27px}
.finale-home .finale-home-heading h2{grid-row:1/3;margin:0;font-size:clamp(33px,4vw,50px);font-weight:750;line-height:1.07;letter-spacing:-.035em;color:#14204d}
.finale-home .finale-home-heading em{font-style:normal;color:#007d83}
.finale-home .finale-home-heading>p{margin:0;font-size:17px;line-height:1.6;color:#496371}
.finale-home .finale-home-heading .finale-home-family-question{font-size:19px;line-height:1.45;font-weight:650;color:#14204d}
.finale-home .finale-home-models{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px;margin-top:26px}
.finale-home .finale-home-model{border:1px solid #e4d5db;border-radius:13px;overflow:hidden;background:#fff}
.finale-home .finale-home-model h3{margin:0;padding:15px 20px;font-size:18px;font-weight:750;line-height:1.3;letter-spacing:-.01em;color:#a72c4a;background:#fcf6f8;border-bottom:1px solid #eadde2}
.finale-home .finale-home-model ol{list-style:none;margin:0;padding:8px 20px 10px;display:grid;gap:0}
.finale-home .finale-home-model li{position:relative;display:flex;align-items:center;gap:13px;min-height:57px;padding:9px 0;margin:0;font-size:17px;font-weight:600;line-height:1.35;color:#496371}
.finale-home .finale-home-model li+li{border-top:1px solid #edf0f1}
.finale-home .finale-home-step-number{display:grid;place-items:center;flex:0 0 27px;height:27px;border:1px solid #dce1e4;border-radius:50%;font-size:12px;font-weight:650;color:#647580;background:#fff}
.finale-home .finale-home-life{border-color:#a9ced0;background:#f8fcfb}
.finale-home .finale-home-life h3{background:#eaf6f3;border-color:#c7e2df;color:#006e73}
.finale-home .finale-home-life li{color:#14204d}
.finale-home .finale-home-life .finale-home-step-number{background:#007d83;color:#fff;border-color:#007d83}
.finale-home .finale-home-model-note{margin:10px 0 0;font-size:12px;line-height:1.5;color:#5c6c79}
.finale-home .finale-home-application{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1.25fr);gap:30px;align-items:center;padding:24px 0 27px;margin-top:13px;border-top:1px solid #dce8e9}
.finale-home .finale-home-visual{margin:0;min-width:0}
.finale-home .finale-home-visual img{display:block;width:100%;max-height:193px;height:auto;object-fit:contain}
.finale-home .finale-home-visual figcaption{margin-top:0;text-align:center;font-size:15px;line-height:1.5;color:#496371}
.finale-home .finale-home-visual strong{color:#14204d;font-weight:700}
.finale-home .finale-home-life-example h3{margin:0 0 11px;font-size:28px;line-height:1.15;font-weight:700;color:#14204d;letter-spacing:-.02em}
.finale-home .finale-home-life-example>p:not(.finale-home-eyebrow){margin:10px 0 7px;font-size:17px;line-height:1.55;color:#496371;max-width:53ch}
.finale-home .finale-home-example-link{display:inline-flex;align-items:center;gap:10px;min-height:44px;font-size:25px;font-weight:750;line-height:1.2;text-decoration:none;color:#007d83}
.finale-home .finale-home-example-label{font-size:12px;line-height:1.5;color:#5c6c79}
.finale-home .finale-home-close{display:flex;align-items:center;justify-content:space-between;gap:22px;padding:20px 0;border-top:1px solid #cbdfe2}
.finale-home .finale-home-close>div{display:grid;gap:7px}
.finale-home .finale-home-close strong{font-size:20px;line-height:1.3;color:#14204d;font-weight:700}
.finale-home .finale-home-close span{font-size:14px;line-height:1.5;color:#496371}
.finale-home .finale-home-primary{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:47px;padding:12px 19px;border:1px solid #007d83;border-radius:9px;background:#007d83;color:#fff;font-size:16px;line-height:1.3;font-weight:650;text-decoration:none;flex-shrink:0}
.finale-home .finale-home-primary:hover{background:#00636a}
.finale-home .finale-home-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:10px;border-top:1px solid #e5edef}
.finale-home .finale-home-foot a{display:inline-flex;align-items:center;gap:7px;min-height:44px;color:#006e73;font-size:13px;line-height:1.4;text-decoration:none}
.finale-home .finale-home-foot a:hover,.finale-home .finale-home-history a:hover strong,.finale-home .finale-home-example-link:hover{text-decoration:underline;text-underline-offset:4px}
.finale-home .finale-home-share{flex-shrink:0;font-weight:650}
.finale-home a svg{width:18px;height:18px;flex:0 0 18px}
.finale-home a:focus-visible{outline:3px solid #8a3bb0;outline-offset:4px}
@media(max-width:760px){.finale-home .finale-home-frame{padding:25px 22px 14px}.finale-home .finale-home-heading{grid-template-columns:1fr;gap:13px;padding-top:22px}.finale-home .finale-home-heading h2{grid-row:auto;font-size:38px}.finale-home .finale-home-models{gap:10px;margin-top:22px}.finale-home .finale-home-model h3{padding:12px 13px;font-size:16px;min-height:65px;display:flex;align-items:center}.finale-home .finale-home-model ol{padding-inline:12px}.finale-home .finale-home-model li{font-size:15px;gap:9px;min-height:69px}.finale-home .finale-home-step-number{flex-basis:22px;height:22px;font-size:10px}.finale-home .finale-home-application{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:18px}.finale-home .finale-home-life-example h3{font-size:24px}.finale-home .finale-home-life-example>p:not(.finale-home-eyebrow){font-size:15px}.finale-home .finale-home-close{flex-direction:column;align-items:stretch;gap:16px}.finale-home .finale-home-primary{align-self:flex-start}.finale-home .finale-home-foot{align-items:flex-start;gap:8px}.finale-home .finale-home-foot a{font-size:12px}}
@media(max-width:480px){.finale-home{padding-block:13px 27px}.finale-home .finale-home-frame{padding:22px 15px 12px;border-radius:17px}.finale-home .finale-home-history{padding-bottom:18px}.finale-home .finale-home-eyebrow{font-size:10px}.finale-home .finale-home-history strong{font-size:23px}.finale-home .finale-home-history a>span{font-size:11px;align-items:flex-start}.finale-home .finale-home-heading h2{font-size:35px}.finale-home .finale-home-heading>p{font-size:16px}.finale-home .finale-home-heading .finale-home-family-question{font-size:18px}.finale-home .finale-home-models{gap:8px}.finale-home .finale-home-model h3{padding:11px 10px;font-size:14px;min-height:62px}.finale-home .finale-home-model ol{padding:3px 9px 7px}.finale-home .finale-home-model li{align-items:flex-start;font-size:13px;min-height:82px;padding-block:13px;gap:6px}.finale-home .finale-home-step-number{flex-basis:19px;height:19px;font-size:9px;margin-top:1px}.finale-home .finale-home-model-note{font-size:11px;margin-top:9px}.finale-home .finale-home-application{grid-template-columns:1fr;gap:19px;margin-top:16px;padding-block:19px 23px}.finale-home .finale-home-visual img{max-height:138px}.finale-home .finale-home-visual figcaption{font-size:13px}.finale-home .finale-home-life-example h3{font-size:26px}.finale-home .finale-home-life-example>p:not(.finale-home-eyebrow){font-size:16px}.finale-home .finale-home-example-link{font-size:25px}.finale-home .finale-home-close strong{font-size:19px}.finale-home .finale-home-close span{font-size:13px}.finale-home .finale-home-primary{align-self:stretch;font-size:15px}.finale-home .finale-home-foot{flex-direction:column;gap:0}.finale-home .finale-home-foot a{min-height:43px}}
@media(max-width:360px){.finale-home .finale-home-frame{padding-inline:12px}.finale-home .finale-home-heading h2{font-size:31px}.finale-home .finale-home-model h3{font-size:13px;padding-inline:8px}.finale-home .finale-home-model ol{padding-inline:7px}.finale-home .finale-home-model li{font-size:12px;min-height:88px;gap:5px}.finale-home .finale-home-step-number{flex-basis:17px;height:17px}}
@media(max-width:620px){.finale-home .finale-home-models{grid-template-columns:1fr;gap:14px}.finale-home .finale-home-model h3{font-size:18px;min-height:55px;padding:13px 16px}.finale-home .finale-home-model ol{padding:4px 15px 8px}.finale-home .finale-home-model li{align-items:center;font-size:16px;min-height:57px;padding-block:11px;gap:12px}.finale-home .finale-home-step-number{flex-basis:27px;height:27px;font-size:12px;margin-top:0}}
@media print{.finale-home .finale-home-frame{box-shadow:none}.finale-home .finale-home-primary,.finale-home .finale-home-share{display:none}.finale-home .finale-home-visual img{max-height:120px}.finale-home .finale-home-models{break-inside:avoid}}
`;
  return {html, css};
};
