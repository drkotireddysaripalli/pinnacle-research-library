'use strict';

// Compact homepage introduction. The complete campaign has its own public page.
const legacyStory = require('../content/paradigm-story.json');
const route = '/evidence/pinnacle-paradigm-shift.html';
const publicRoute = 'https://www.pinnacleblooms.org/verify' + route;

module.exports = ({e, icon}) => {
  // Compatibility anchors keep previously shared homepage fragments useful.
  // They identify the updated introduction; the original reference pages remain available.
  const oldIds = ['section-your-child-s-path-toward-self-sufficiency-and-mainstream-life','block-about-the-story-and-its-evidence',...Array.from({length:9},(_,i)=>['block-read-the-card','block-card-sources'].map(x=>x+(i?'-'+(i+1):''))).flat(),'paradigm-story-track', ...legacyStory.cards.flatMap(card => [
    'paradigm-story-card-' + card.id,
    'paradigm-story-card-' + card.id + '-title'
  ])];
  const compatibility = oldIds.map(id => `<span class="finale-home-compat" id="${e(id)}" aria-hidden="true"></span>`).join('');
  const share = 'PinnacleAI® begins with the life a child is growing toward: self-sufficiency and mainstream participation. See how that purpose shapes goals, practice and review, with an anonymised supplied session example and source records.\n\n' + publicRoute;
  const html = `<section class="finale-home wrap" id="pinnacle-paradigm-story" data-share-managed="true" aria-labelledby="paradigm-story-heading">
${compatibility}
<div class="finale-home-frame">
  <header class="finale-home-heading"><p class="finale-home-eyebrow">PinnacleAI® Paradigm Shift</p><h2 id="paradigm-story-heading">Your child’s life is the mission.<br><em>PinnacleAI® puts it first.</em></h2></header>
  <figure class="finale-home-visual"><img src="/images/paradigm-finale/moon-600.webp" width="600" height="400" loading="lazy" decoding="async" alt="Illustrated rocket and a luminous route toward the Moon."><figcaption>The Moon was the mission.<br><strong>The rocket was the means.</strong></figcaption></figure>
  <div class="finale-home-copy"><p class="finale-home-purpose">A self-sufficient, mainstream life for your child.</p><p>That purpose comes first at Pinnacle. It guides which abilities to build, which goals to set, and which techniques, people and practice to bring into the work.</p><p class="finale-home-thesis">Life sets the direction.<br>Therapy serves the purpose.</p><div class="finale-home-actions"><a class="finale-home-primary" href="${route}">Explore the full story ${icon('arrow-up-right')}</a><a class="finale-home-secondary" href="${route}#documented-example">See a goal become a session ${icon('file-search')}</a></div></div>
  <div class="finale-home-example"><div class="finale-home-example-heading"><h3>See what the session is for.<br>Before it begins.</h3><p>Inside one supplied planning example:</p></div><ul class="finale-home-facts"><li><a href="${route}#documented-example"><strong>7</strong><span>supplied goals</span></a></li><li><a href="${route}#session-timeline"><strong>6</strong><span>activities linked to 3 goals</span></a></li><li><a href="${route}#session-timeline"><strong>40 <small>+ 5 min</small></strong><span>planned therapy + family handover</span></a></li></ul><p class="finale-home-example-note">Anonymised planning excerpts. Targets and activities show the proposed work; they are not completed-session results.</p></div>
  <div class="finale-home-foot"><p>Pinnacle’s AbilityScore® monograph frames its historical challenge as <a href="/evidence/publications/zenodo-19482123.html">“160 Years Without a Unified Metric.”</a> Explore the thesis, the approach and their sources.</p><a class="finale-home-share" href="https://wa.me/?text=${e(encodeURIComponent(share))}" target="_blank" rel="noopener noreferrer" aria-label="Share the PinnacleAI paradigm shift on WhatsApp">Share on WhatsApp ${icon('arrow-up-right')}</a></div>
</div></section>`;

  const css = `
.finale-home{position:relative;padding-block:22px 36px;color:#14204d}
.finale-home .finale-home-compat{position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.finale-home .finale-home-frame{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:20px 38px;padding:36px;border:1px solid #cce2e3;border-radius:24px;background:#fff;box-shadow:0 12px 34px rgb(20 32 77 / 4%)}
.finale-home .finale-home-heading{grid-column:1/-1;max-width:950px}
.finale-home .finale-home-eyebrow{margin:0 0 13px;color:#007d83;font-size:12px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}
.finale-home .finale-home-heading h2{margin:0;font-size:clamp(30px,3.4vw,46px);font-weight:750;line-height:1.12;letter-spacing:-.025em;color:#14204d}
.finale-home .finale-home-heading em{font-style:normal;color:#007d83}
.finale-home .finale-home-visual{margin:0;align-self:center;min-width:0}
.finale-home .finale-home-visual img{display:block;width:100%;height:auto;max-height:310px;object-fit:contain}
.finale-home .finale-home-visual figcaption{text-align:center;color:#496371;font-size:17px;line-height:1.45;margin-top:3px}
.finale-home .finale-home-visual strong{color:#14204d;font-weight:700}
.finale-home .finale-home-copy{align-self:center;min-width:0}
.finale-home .finale-home-copy p{font-size:18px;line-height:1.6;margin:0 0 18px;color:#496371}
.finale-home .finale-home-copy .finale-home-purpose{font-size:23px;line-height:1.3;font-weight:700;color:#14204d}
.finale-home .finale-home-copy .finale-home-thesis{font-size:25px;line-height:1.2;font-weight:750;letter-spacing:-.015em;color:#007d83;margin-block:22px}
.finale-home .finale-home-actions{display:flex;flex-wrap:wrap;gap:8px 15px;align-items:center}
.finale-home .finale-home-actions a{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;font-size:16px;font-weight:650;line-height:1.3;text-decoration:none}
.finale-home .finale-home-primary{padding:12px 17px;border:1px solid #007d83;border-radius:9px;color:#fff;background:#007d83}
.finale-home .finale-home-primary:hover{background:#00656c}
.finale-home .finale-home-secondary{color:#006c73;padding-block:8px}
.finale-home .finale-home-secondary:hover{text-decoration:underline}
.finale-home .finale-home-actions svg,.finale-home .finale-home-share svg{flex:0 0 18px;width:18px;height:18px}
.finale-home .finale-home-example{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:18px 24px;padding-top:26px;margin-top:6px;border-top:1px solid #d6e6e8}
.finale-home .finale-home-example-heading h3{margin:0 0 9px;font-size:23px;line-height:1.2;color:#14204d;font-weight:700;letter-spacing:-.015em}
.finale-home .finale-home-example-heading p{margin:0;font-size:15px;line-height:1.5;color:#496371}
.finale-home .finale-home-facts{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;min-width:0}
.finale-home .finale-home-facts li{margin:0;min-width:0}
.finale-home .finale-home-facts a{display:flex;flex-direction:column;gap:7px;height:100%;min-height:110px;padding:14px;border:1px solid #d6e6e8;border-radius:12px;text-decoration:none;background:#f5faf9;color:#496371}
.finale-home .finale-home-facts a:hover{border-color:#007d83}
.finale-home .finale-home-facts strong{font-size:37px;line-height:1.1;font-weight:750;color:#007d83;letter-spacing:-.025em;white-space:nowrap}
.finale-home .finale-home-facts small{font-size:17px;font-weight:650;letter-spacing:0}
.finale-home .finale-home-facts span{font-size:15px;line-height:1.3}
.finale-home .finale-home-example-note{grid-column:1/-1;font-size:12px;line-height:1.6;color:#496371;margin:0}
.finale-home .finale-home-foot{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:18px;border-top:1px solid #e0ecec;padding-top:18px}
.finale-home .finale-home-foot p{font-size:13px;line-height:1.6;margin:0;max-width:76ch;color:#496371}
.finale-home .finale-home-foot a{color:#006c73;text-underline-offset:3px}
.finale-home .finale-home-share{display:inline-flex;align-items:center;gap:7px;min-height:44px;flex-shrink:0;font-size:14px;font-weight:650;text-decoration:none}
.finale-home .finale-home-share:hover{text-decoration:underline}
.finale-home a:focus-visible{outline:3px solid #8a3bb0;outline-offset:4px}
@media(max-width:900px){.finale-home .finale-home-frame{padding:26px;gap:22px}.finale-home .finale-home-example{grid-template-columns:1fr}.finale-home .finale-home-foot{align-items:flex-start;flex-direction:column;gap:6px}.finale-home .finale-home-copy p{font-size:17px}}
@media(max-width:620px){.finale-home{padding-block:12px 28px}.finale-home .finale-home-frame{grid-template-columns:1fr;padding:23px 18px;gap:19px;border-radius:17px}.finale-home .finale-home-heading h2{font-size:30px;line-height:1.12}.finale-home .finale-home-eyebrow{font-size:10px;letter-spacing:.09em;margin-bottom:11px}.finale-home .finale-home-visual img{max-height:205px}.finale-home .finale-home-visual figcaption{font-size:15px}.finale-home .finale-home-copy .finale-home-purpose{font-size:21px}.finale-home .finale-home-copy .finale-home-thesis{font-size:24px;margin-block:18px}.finale-home .finale-home-actions{align-items:stretch;flex-direction:column;gap:3px}.finale-home .finale-home-actions a{font-size:15px}.finale-home .finale-home-example{padding-top:22px;gap:15px}.finale-home .finale-home-example-heading h3{font-size:23px}.finale-home .finale-home-facts{gap:7px}.finale-home .finale-home-facts a{padding:12px 9px;min-height:111px;gap:7px}.finale-home .finale-home-facts strong{font-size:31px}.finale-home .finale-home-facts small{font-size:12px}.finale-home .finale-home-facts span{font-size:12px;line-height:1.4}.finale-home .finale-home-example-note{font-size:11px}.finale-home .finale-home-foot p{font-size:12px}}
@media(max-width:380px){.finale-home .finale-home-frame{padding-inline:14px}.finale-home .finale-home-heading h2{font-size:27px}.finale-home .finale-home-facts strong{font-size:27px}.finale-home .finale-home-facts small{font-size:10px}.finale-home .finale-home-facts a{padding-inline:7px}}
@media print{.finale-home .finale-home-frame{box-shadow:none;break-inside:avoid}.finale-home .finale-home-actions,.finale-home .finale-home-share{display:none}.finale-home .finale-home-visual img{max-height:160px}}
`;
  return {html, css};
};
