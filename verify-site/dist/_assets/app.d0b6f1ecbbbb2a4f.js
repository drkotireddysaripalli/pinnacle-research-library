'use strict';
(() => {
  const list = document.getElementById('evidence-list');
  if (!list) return;
  const categoryButtons = [...document.querySelectorAll('#category-list [data-category]')];
  const mobileCategory = document.getElementById('mobile-category');
  const search = document.getElementById('search');
  const status = document.getElementById('evidence-status');
  const clear = document.getElementById('clear-search');
  let category = 'All evidence';
  const cards = [...list.querySelectorAll('.evidence-record')];
  const records=cards.map(card=>({id:card.id,category:card.dataset.category,status:card.dataset.status,originalReviewed:card.dataset.original==='true',reviewConclusion:card.dataset.scoped==='true',search:(card.textContent+' '+card.dataset.search).toLocaleLowerCase()}));
  const recordFor = id => records.find(r => r.id === id);
  const matches = (r, query, selected) => {
    const haystack = r.search;
    return (category === 'All evidence' || r.category === category) && (!query || haystack.includes(query)) && (selected === 'all' || (selected === 'matched' && r.status === 'matched') || (selected === 'original' && r.originalReviewed) || (selected === 'published' && r.status === 'published') || (selected === 'scoped' && Boolean(r.reviewConclusion)));
  };
  const updateCategories = () => categoryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  const updateExpandLabel = () => {
    const visible = cards.filter(card => !card.hidden);
    const expand = document.getElementById('expand-all');
    if (!expand) return;
    expand.hidden = visible.length === 0;
    expand.textContent = visible.length && visible.every(card => card.open) ? 'Collapse all' : 'Expand all';
  };
  const render = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    const selected = status?.value || 'all';
    cards.forEach(card => { const r = recordFor(card.id); card.hidden = !r || !matches(r, query, selected); });
    const count = cards.filter(card => !card.hidden).length;
    const result = document.getElementById('result-count');
    if (result) result.textContent = `${count} ${count === 1 ? 'record' : 'records'}${category === 'All evidence' ? '' : ' · ' + category}`;
    const empty = document.getElementById('empty-state');
    if (empty) empty.hidden = count > 0;
    if (clear) clear.hidden = !search?.value;
    updateExpandLabel();
  };
  categoryButtons.forEach(button => button.addEventListener('click', () => { category = button.dataset.category || 'All evidence'; if (mobileCategory) mobileCategory.value = category; updateCategories(); render(); }));
  mobileCategory?.addEventListener('change', () => { category = mobileCategory.value; updateCategories(); render(); });
  search?.addEventListener('input', render);
  status?.addEventListener('change', render);
  clear?.addEventListener('click', () => { search.value = ''; render(); search.focus(); });
  document.getElementById('reset-filters')?.addEventListener('click', () => { category = 'All evidence'; if(search) search.value = ''; if(status) status.value = 'all'; if(mobileCategory) mobileCategory.value = 'All evidence'; updateCategories(); render(); search?.focus(); });
  document.getElementById('expand-all')?.addEventListener('click', () => { const visible = cards.filter(card => !card.hidden); const shouldOpen = !visible.length || !visible.every(card => card.open); visible.forEach(card => card.open = shouldOpen); updateExpandLabel(); });
  cards.forEach(card => card.addEventListener('toggle', updateExpandLabel));
  const revealHash = () => {
    const id = location.hash.slice(1), card = document.getElementById(id);
    if (!card) return;
    if (recordFor(id)) { category = 'All evidence'; if(search) search.value = ''; if(status) status.value = 'all'; if(mobileCategory) mobileCategory.value='All evidence'; updateCategories(); render(); }
    for(let item=card;item;item=item.parentElement)if(item.tagName==='DETAILS')item.open=true;
    if(!card.hidden)card.scrollIntoView({block:'start'});
  };
  updateCategories(); render(); revealHash(); window.addEventListener('hashchange', revealHash);

  const centreList = document.getElementById('centre-list');
  const centreData = [...(centreList?.querySelectorAll('.centre-card')||[])].map(card=>({kind:card.dataset.kind,search:card.textContent.toLocaleLowerCase()}));
  if (centreList && centreData.length) {
    const centreCards = [...centreList.querySelectorAll('.centre-card')];
    const centreSearch = document.getElementById('centre-search');
    const centreType = document.getElementById('centre-type');
    const centreMore = document.getElementById('centre-more');
    const centreEmpty = document.getElementById('centre-empty');
    const centreCount = document.getElementById('centre-count');
    const centreRender = () => {
      const q = (centreSearch?.value || '').trim().toLocaleLowerCase();
      const kind = centreType?.value || 'all';
      const rows = centreData.map((row,index) => ({row,card:centreCards[index]})).filter(({row}) => (kind === 'all' || row.kind === kind) && (!q || row.search.includes(q)));
      const expanded = centreMore?.dataset.expanded === 'true';
      const limit = expanded ? rows.length : (window.innerWidth < 761 ? 6 : 10);
      centreCards.forEach(card => card.hidden = true); rows.slice(0,limit).forEach(({card}) => card.hidden = false);
      if (centreCount) centreCount.textContent = `${rows.length} ${rows.length === 1 ? 'evidence entry' : 'evidence entries'}${kind === 'all' && !q ? ` · ${centreData.filter(row => row.kind === 'hfr').length} HFR IDs + ${centreData.filter(row => row.kind === 'district').length} district summaries` : ' · ' + (kind === 'hfr' ? 'HFR identifiers' : kind === 'district' ? 'district summaries' : 'matching sources')}`;
      if (centreEmpty) centreEmpty.hidden = rows.length > 0;
      if (centreMore) { centreMore.hidden = rows.length <= limit && !expanded; centreMore.textContent = expanded ? 'Show fewer records' : 'Show more records'; }
    };
    centreSearch?.addEventListener('input', () => { if(centreMore) centreMore.dataset.expanded='false'; centreRender(); });
    centreType?.addEventListener('change', centreRender);
    document.getElementById('centre-reset')?.addEventListener('click', () => { if(centreSearch) centreSearch.value=''; if(centreType) centreType.value='all'; if(centreMore) centreMore.dataset.expanded='false'; centreRender(); centreSearch?.focus(); });
    centreMore?.addEventListener('click', () => { centreMore.dataset.expanded = centreMore.dataset.expanded === 'true' ? 'false' : 'true'; centreRender(); });
    centreRender();
    const revealCentreHash = () => {
      const card=document.getElementById(location.hash.slice(1));
      if(!card?.classList.contains('centre-card'))return;
      if(centreSearch)centreSearch.value='';if(centreType)centreType.value='all';
      if(centreMore)centreMore.dataset.expanded='true';centreRender();card.scrollIntoView({block:'start'});
    };
    revealCentreHash();window.addEventListener('hashchange',revealCentreHash);
  }
  document.getElementById('print-review')?.addEventListener('click', () => window.print());
})();
