// Inserted into the existing Ask Worker; uses its shell and escaping helpers.
async function searchResultsResponse(ctx, url) {
  const query = (url.searchParams.get('q') || '').trim().slice(0, 200);
  ctx.title = 'Search Ask Pinnacle | Child development answers';
  ctx.desc = 'Find published answers about speech, development, everyday routines and therapies from Ask Pinnacle.';
  ctx.canonical = ctx.env.CANONICAL_ORIGIN + ctx.env.ASK_BASE + '/search';
  ctx.path = ctx.canonical;
  ctx.noindex = true;
  ctx.showAboutFaq = false;
  ctx.pageSchema = [];
  let rows = [], failed = false;
  if (query.length >= 2) {
    try {
      const data = await checkedAskJson(ctx.env, 'rpc/ask_public_search', { p_q: query, p_k: 10 });
      if (!data || !Array.isArray(data.results)) throw new Error('Invalid search response');
      rows = data.results.filter(row => typeof row.slug === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(row.slug));
    } catch { failed = true; }
  }
  const form = `<form role="search" method="get" action="${attr(ctx.canonical)}" class="ask-search-form">
    <label for="ask-query">Search a topic or question</label>
    <div><input id="ask-query" name="q" type="search" maxlength="200" minlength="2" value="${attr(query)}" placeholder="For example, speech delay or everyday routines" required aria-describedby="ask-search-help"><button type="submit">Search answers</button></div>
    <p id="ask-search-help">Use a topic or general question. Keep names and contact details out of your search.</p></form>`;
  const excerpt = text => text.length > 380 ? text.slice(0, 380).replace(/\s+\S*$/, '') + '…' : text;
  const cards = rows.map(row => `<li><article><h2><a href="${attr(ctx.env.CANONICAL_ORIGIN + ctx.env.ASK_BASE + '/' + row.slug)}"${row.lang ? ' lang="' + attr(row.lang) + '"' : ''}>${esc(row.title || row.slug)}</a></h2><p>${esc(excerpt(row.summary || ''))}</p><a class="ask-read-answer" href="${attr(ctx.env.CANONICAL_ORIGIN + ctx.env.ASK_BASE + '/' + row.slug)}">Read the answer <span aria-hidden="true">→</span></a></article></li>`).join('');
  const state = failed ? '<p role="alert">Search is temporarily unavailable. Please try again, or browse the topics below.</p>'
    : query.length < 2 ? '<p>Enter at least two characters to find published answers.</p>'
    : rows.length ? `<p class="ask-result-count">${rows.length} relevant answers for <strong>${esc(query)}</strong></p><ol class="ask-search-results">${cards}</ol>`
    : `<h2>No published answers matched “${esc(query)}”.</h2><p>Try a shorter phrase such as speech delay, eating, sleep or school readiness.</p>`;
  ctx.main = `<style>.ask-search-page{max-width:960px;margin:auto;padding:40px 20px 64px;color:#182e56}.ask-search-page h1{font-size:clamp(32px,5vw,48px);line-height:1.15}.ask-search-form{margin:24px 0 32px}.ask-search-form label{display:block;font-weight:700;font-size:18px;margin-bottom:10px}.ask-search-form>div{display:flex;gap:12px}.ask-search-form input{min-width:0;flex:1;font:inherit;font-size:18px;padding:14px;border:2px solid #64748b;border-radius:10px;background:#fff;color:#182e56}.ask-search-form button{border:0;border-radius:10px;padding:14px 22px;background:#8b2688;color:#fff;font:inherit;font-weight:700;cursor:pointer;min-height:48px}.ask-search-form input:focus-visible,.ask-search-form button:focus-visible,.ask-search-page a:focus-visible{outline:3px solid #007f85;outline-offset:4px}.ask-search-form p{font-size:15px;color:#46566b}.ask-search-results{list-style:none;padding:0;display:grid;gap:18px}.ask-search-results li{padding:22px;border:1px solid #dce3ec;border-radius:16px;background:#fff}.ask-search-results h2{margin:0 0 12px;font-size:23px;line-height:1.3}.ask-search-page p{line-height:1.6}.ask-search-page a{color:#76227e;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}.ask-read-answer{font-weight:700}.ask-search-browse{display:flex;flex-wrap:wrap;gap:18px;margin-top:30px}@media(max-width:520px){.ask-search-form>div{flex-direction:column}.ask-search-results li{padding:18px}.ask-search-results h2{font-size:21px}}</style>
    <section class="ask-search-page"><p class="kicker">Ask Pinnacle</p><h1>Find an answer. Understand your next step.</h1><p>Explore published child-development guidance for families, teachers and professionals.</p>${form}${state}<nav class="ask-search-browse" aria-label="Browse Ask topics"><a href="${attr(ctx.env.ASK_BASE + '/conditions')}">Browse conditions</a><a href="${attr(ctx.env.ASK_BASE + '/skills')}">Browse skills</a><a href="${attr(ctx.env.ASK_BASE + '/ages')}">Ages and stages</a><a href="tel:+919100181181">Call 9100 181 181</a></nav></section>`;
  const page = shell(ctx).replace('content="noindex, nofollow"', 'content="noindex, follow"');
  const response = html(page, false, failed ? 503 : 200);
  response.headers.set('cache-control', 'private, no-store');
  response.headers.set('x-robots-tag', 'noindex, follow');
  response.headers.set('referrer-policy', 'no-referrer');
  response.headers.set('x-pinnacle-private-search', '1');
  if (failed) response.headers.set('retry-after', '60');
  return response;
}
