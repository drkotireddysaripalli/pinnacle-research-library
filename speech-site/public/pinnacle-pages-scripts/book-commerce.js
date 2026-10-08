/* Public Shopify catalogue and cart only. No customer, child or payment data is collected here. */
(() => {
  const root = document.querySelector('[data-book-commerce]');
  if (!root) return;
  let strings = {};
  try { strings = JSON.parse(root.dataset.cartStrings || '{}'); } catch {}
  const bagMessages = {
    en: {
      incompleteBag:'Your full book bag could not be checked. Please refresh and try again. Your saved bag is retained.',
      itemUnavailable:'“{title}” is no longer available as this PDF edition. Remove it or contact book support before continuing.',
      itemChanged:'The edition or price of “{title}” has changed. Please remove it and choose the current offer, or contact book support.',
      invalidBag:'An item in your bag could not be verified. Please remove it or contact book support before continuing.',
      reviewBag:'Your book bag changed. Review the items, quantities and total, then choose checkout again.'
    },
    hi: {
      incompleteBag:'आपके पूरे ईबुक बैग की जाँच नहीं हो सकी। पेज रीफ़्रेश करके फिर कोशिश करें। आपका सेव किया हुआ बैग सुरक्षित है।',
      itemUnavailable:'“{title}” का यह PDF संस्करण अब उपलब्ध नहीं है। आगे बढ़ने से पहले इसे हटाएँ या पुस्तक सहायता से संपर्क करें।',
      itemChanged:'“{title}” का संस्करण या कीमत बदल गई है। इसे हटाकर मौजूदा ऑफ़र चुनें या पुस्तक सहायता से संपर्क करें।',
      invalidBag:'आपके बैग में एक पुस्तक की पुष्टि नहीं हो सकी। आगे बढ़ने से पहले उसे हटाएँ या पुस्तक सहायता से संपर्क करें।',
      reviewBag:'आपका ईबुक बैग बदल गया है। पुस्तकें, उनकी संख्या और कुल कीमत जाँचें, फिर दोबारा चेकआउट चुनें।'
    },
    te: {
      incompleteBag:'మీ బుక్ బ్యాగ్ మొత్తాన్ని చెక్ చేయలేకపోయాం. పేజీ రిఫ్రెష్ చేసి మళ్లీ ప్రయత్నించండి. మీ సేవ్ చేసిన బ్యాగ్ అలాగే ఉంది.',
      itemUnavailable:'“{title}” పుస్తకం ఈ PDF ఎడిషన్‌లో ఇప్పుడు అందుబాటులో లేదు. ముందుకు వెళ్లే ముందు దీన్ని తీసేయండి లేదా బుక్ సపోర్ట్‌ను సంప్రదించండి.',
      itemChanged:'“{title}” పుస్తకం ఎడిషన్ లేదా ధర మారింది. దీన్ని తీసేసి ఇప్పటి ఆఫర్ ఎంచుకోండి లేదా బుక్ సపోర్ట్‌ను సంప్రదించండి.',
      invalidBag:'మీ బ్యాగ్‌లోని ఒక పుస్తకాన్ని చెక్ చేయలేకపోయాం. ముందుకు వెళ్లే ముందు దాన్ని తీసేయండి లేదా బుక్ సపోర్ట్‌ను సంప్రదించండి.',
      reviewBag:'మీ బుక్ బ్యాగ్‌లో మార్పులు వచ్చాయి. పుస్తకాలు, వాటి సంఖ్య, మొత్తం ధర చూసి మళ్లీ చెక్‌అవుట్ ఎంచుకోండి.'
    }
  };
  strings = {...bagMessages[root.dataset.cartLocale] || bagMessages.en,...strings};
  const t = (key,values={}) => Object.entries(values).reduce((text,[name,value])=>text.replaceAll('{'+name+'}',String(value)),strings[key] || key);
  const endpoint = 'https://pinnacleblooms.myshopify.com/api/2026-10/graphql.json';
  const storageKey = 'pinnacle-book-cart-v1';
  const dialog = root.querySelector('dialog');
  const message = root.querySelector('[data-cart-message]');
  const status = root.querySelector('[data-shop-status]');
  const checkout = root.querySelector('[data-cart-checkout]');
  const items = root.querySelector('[data-cart-items]');
  const buttons = [...document.querySelectorAll('[data-book-sku]')];
  let catalogue = {};
  try { catalogue = JSON.parse(root.dataset.cartCatalogue || '{}'); } catch {}
  const variants = new Map();
  let cart = null, busy = false, ready = false, opener;
  // A Merchant link opens our existing bag. Only one known PDF may be selected;
  // a URL never changes the quantity of an item already in the customer's bag.
  const incoming = new URL(location.href);
  const directBag = incoming.pathname === '/shop/cart' && incoming.searchParams.has('cart_sku');
  const requestedSku = incoming.searchParams.get('cart_sku');
  const validBagLink = directBag && incoming.searchParams.getAll('cart_sku').length === 1
    && incoming.searchParams.getAll('quantity').length <= 1
    && (!incoming.searchParams.has('quantity') || incoming.searchParams.get('quantity') === '1')
    && Object.hasOwn(catalogue, requestedSku) && /-(?:EN|HI|TE)-PDF(?:-SET[24])?$/.test(requestedSku);
  const lineFields = 'nodes { id quantity cost { totalAmount { amount currencyCode } } merchandise { ... on ProductVariant { id sku title availableForSale requiresShipping price { amount currencyCode } product { title } } } } pageInfo { hasNextPage endCursor }';
  const cartFields = 'id checkoutUrl totalQuantity cost { totalAmount { amount currencyCode } }';
  const fields = `${cartFields} lines(first:50) { ${lineFields} }`;
  const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:value.currencyCode,maximumFractionDigits:2}).format(Number(value.amount));
  const saved = () => { try { return localStorage.getItem(storageKey); } catch { return null; } };
  function remember(id) { try { id ? localStorage.setItem(storageKey,id) : localStorage.removeItem(storageKey); } catch {} }
  async function api(query, variables = {}) {
    const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(18000)});
    if (!response.ok) throw new Error(t('connectionError'));
    const body = await response.json();
    if (body.errors?.length) throw new Error(t('shopUnavailableError'));
    return body.data;
  }
  async function completeCart(value) {
    if (!value) return null;
    if (!Number.isInteger(value.totalQuantity) || value.totalQuantity<0) throw new Error(t('incompleteBag'));
    const lines=[],ids=new Set(),cursors=new Set();
    let page=value.lines;
    for (;;) {
      if (!Array.isArray(page?.nodes) || typeof page.pageInfo?.hasNextPage !== 'boolean') throw new Error(t('incompleteBag'));
      for (const line of page.nodes) {
        if (!line.id || ids.has(line.id) || !Number.isInteger(line.quantity) || line.quantity<1) throw new Error(t('incompleteBag'));
        ids.add(line.id);lines.push(line);
      }
      if (!page.pageInfo.hasNextPage) break;
      const after=page.pageInfo.endCursor;
      if (!after || cursors.has(after) || !page.nodes.length) throw new Error(t('incompleteBag'));
      cursors.add(after);
      const next=(await api(`query CartLines($id:ID!,$after:String!){cart(id:$id){${cartFields} lines(first:50,after:$after){${lineFields}}}}`,{id:value.id,after})).cart;
      if (!next || next.id!==value.id || next.totalQuantity!==value.totalQuantity || JSON.stringify(next.cost)!==JSON.stringify(value.cost)) throw new Error(t('incompleteBag'));
      page=next.lines;
    }
    if (lines.reduce((sum,line)=>sum+line.quantity,0)!==value.totalQuantity) throw new Error(t('incompleteBag'));
    return {...value,lines:{nodes:lines,pageInfo:{hasNextPage:false,endCursor:page.pageInfo.endCursor}}};
  }
  const readCart = async id => completeCart((await api(`query Cart($id:ID!){cart(id:$id){${fields}}}`,{id})).cart);
  function bagProblem() {
    if (!cart?.totalQuantity) return '';
    if (!ready) return t('shopUnavailableError');
    if (cart.cost?.totalAmount?.currencyCode!=='INR' || !Number.isFinite(Number(cart.cost?.totalAmount?.amount)) || Number(cart.cost.totalAmount.amount)<0) return t('invalidBag');
    for (const line of cart.lines.nodes) {
      const v=line.merchandise,entry=catalogue[v?.sku],current=variants.get(v?.sku);
      if (!entry || !Number.isInteger(line.quantity) || line.quantity<1 || line.cost?.totalAmount?.currencyCode!=='INR' || !Number.isFinite(Number(line.cost?.totalAmount?.amount)) || Number(line.cost.totalAmount.amount)<0) return t('invalidBag');
      if (v.availableForSale!==true) return t('itemUnavailable',{title:entry.title});
      if (!current || v.id!==current.id || v.requiresShipping!==false || v.price?.currencyCode!=='INR' || Number(v.price?.amount)!==Number(entry.price)) return t('itemChanged',{title:entry.title});
    }
    return '';
  }
  const bagSignature = value => JSON.stringify({total:value.cost?.totalAmount,lines:value.lines.nodes.map(line=>[line.id,line.merchandise?.id,line.merchandise?.sku,line.quantity,line.cost?.totalAmount]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))});
  function element(tag, text, className) { const el=document.createElement(tag); el.textContent=text; if(className)el.className=className; return el; }
  if(!root.querySelector('[data-book-order-policy]')){
    const policy=element('p','','pbn-cart-note');
    const link=element('a','Book refunds and digital delivery');
    link.href='/books/refund-and-delivery-policy';link.setAttribute('data-book-order-policy','');
    policy.append(link);root.querySelector('.pbn-cart-delivery')?.append(policy);
  }
  if(directBag){
    const policies=element('p','','pbn-cart-note');
    for(const [i,[label,path]] of [['Terms of use','/terms-of-use']].entries()){
      if(i)policies.append(document.createTextNode(' · '));
      const link=element('a',label);link.href=path;link.target='_blank';link.rel='noopener';policies.append(link);
    }
    root.querySelector('.pbn-cart-delivery')?.append(policies);
  }
  function render() {
    items.replaceChildren();
    const lines=cart?.lines.nodes || [];
    root.querySelector('[data-cart-count]').textContent=String(cart?.totalQuantity || 0);
    root.querySelector('[data-cart-total]').textContent=cart ? money(cart.cost.totalAmount) : '₹0';
    const fileCount=lines.reduce((sum,line)=>sum+(catalogue[line.merchandise?.sku]?.books.length || 1)*line.quantity,0);
    root.querySelector('[data-cart-file-count]').textContent=fileCount ? t(fileCount===1?'fileCountSingular':'fileCountPlural',{count:fileCount}) : t('selectBook');
    checkout.hidden=true;
    checkout.removeAttribute('href');
    if (!lines.length) items.append(element('p',t('emptyBag'),'pbn-cart-note'));
    const selected=new Set(), repeated=new Set();
    for (const line of lines) {
      const merchandise=line.merchandise || {};
      const entry=catalogue[merchandise.sku];
      const row=element('article','','pbn-cart-item');
      const covers=element('div','','pbn-cart-covers');
      for(const book of entry?.books || []) {
        const cover=document.createElement('img');
        cover.src=book.cover;cover.alt=t('frontCoverAlt',{title:book.title});cover.width=1492;cover.height=1054;cover.loading='lazy';
        covers.append(cover);
        if(selected.has(book.sku))repeated.add(book.title);selected.add(book.sku);
      }
      const copy=element('div','');
      const title=element('h3','');
      if(entry){const link=element('a',entry.title);link.href=entry.path;title.append(link);}else title.textContent=merchandise.product?.title || t('invalidBag');
      const meta=element('div','','pbn-cart-item-meta');
      const language = {EN:'English',HI:'हिन्दी / Hindi',TE:'తెలుగు / Telugu'}[merchandise.sku?.match(/-(EN|HI|TE)-PDF/)?.[1]];
      meta.append(element('p',(language?language+' · ':'')+(entry?.books.length>1?t('pdfPlural',{count:entry.books.length}):t('pdfSingular'))+' · '+t('quantity',{count:line.quantity})),element('strong',money(line.cost.totalAmount)));
      copy.append(title,meta);
      if(entry?.books.length){
        const included=element('ul','','pbn-cart-included');
        for(const book of entry.books){
          const item=element('li','');
          if(entry.books.length>1)item.append(element('span',book.title,'pbn-cart-sample-title'));
          const sample=element('a',t('sampleLink'));sample.href=book.sample;sample.target='_blank';sample.rel='noopener';sample.setAttribute('aria-label',t('sampleAria',{title:book.title}));
          item.append(sample);included.append(item);
        }
        copy.append(included);
      }
      const remove=element('button',t('remove')); remove.type='button'; remove.dataset.removeLine=line.id;
      remove.setAttribute('aria-label',t('removeAria',{title:merchandise.product?.title || t('invalidBag')}));
      copy.append(remove); row.append(covers,copy); items.append(row);
    }
    if(repeated.size)items.append(element('p',t('duplicateWarning',{titles:[...repeated].join(', ')}),'pbn-cart-overlap'));
    if (lines.length) {
      const link=element('a',t('compareCollections')); link.href=root.dataset.cartCollections || '/shop#pbn-collections'; link.className='pbn-cart-compare'; items.append(link);
      const problem=bagProblem();
      if (problem) { message.textContent=problem;return; }
      try {const url=new URL(cart.checkoutUrl);
        if (url.protocol==='https:' && !url.username && !url.password && !url.port && ['pinnacleblooms.myshopify.com','qg10s5-ie.myshopify.com'].includes(url.hostname)) { checkout.href=url.href; checkout.hidden=false; }
      } catch { message.textContent=t('checkoutMissing'); }
    }
  }
  function measure(name, lines = cart?.lines.nodes || []) {
    try {
      if (!lines.length || lines.some(line => line.cost.totalAmount.currencyCode !== 'INR')) return;
      document.dispatchEvent(new CustomEvent('pinnacle:commerce', {detail:{name,items:lines.map(line => ({
        sku:line.merchandise.sku,quantity:line.quantity,price:Number(line.cost.totalAmount.amount)/line.quantity
      }))}}));
    } catch {}
  }
  function open(button) { opener=button; if(!dialog.open){dialog.showModal();measure('view_cart');} }
  root.querySelector('[data-cart-open]').addEventListener('click',e=>{render();open(e.currentTarget);});
  root.querySelector('[data-cart-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  async function change(query,variables,key) {
    const result=(await api(query,variables))[key];
    if (result.userErrors?.length) throw new Error(t('cartUpdateFailed'));
    if (!result.cart) throw new Error(t('refreshBag'));
    cart=await completeCart(result.cart); remember(cart.id); render();
    if(result.warnings?.length && !bagProblem()) message.textContent=t('updatedWarning');
  }
  const validVariant = sku => {
    const v=variants.get(sku),entry=catalogue[sku];
    return entry && v?.sku===sku && v.availableForSale===true && v.requiresShipping===false
      && v.price?.currencyCode==='INR' && Number(v.price.amount)===Number(entry.price) ? v : null;
  };
  async function add(variant) {
    const existing = cart?.lines.nodes.some(line=>line.merchandise.id===variant.id);
    if (existing) {render();message.textContent=t('alreadyAdded');}
    else if (cart) await change(`mutation Add($id:ID!,$lines:[CartLineInput!]!){cartLinesAdd(cartId:$id,lines:$lines){cart{${fields}} userErrors{message} warnings{code message}}}`,{id:cart.id,lines:[{merchandiseId:variant.id,quantity:1}]},'cartLinesAdd');
    else await change(`mutation Create($input:CartInput!){cartCreate(input:$input){cart{${fields}} userErrors{message} warnings{code message}}}`,{input:{lines:[{merchandiseId:variant.id,quantity:1}],buyerIdentity:{countryCode:'IN'}}},'cartCreate');
    const added = !existing && cart?.lines.nodes.find(line=>line.merchandise.id===variant.id);
    if (added) measure('add_to_cart', [added]);
    if(!cart?.lines.nodes.some(line=>line.merchandise.id===variant.id))throw new Error(t('cartUpdateFailed'));
  }
  for (const button of buttons) button.addEventListener('click', async()=>{
    if(busy || !ready) return;
    const variant=validVariant(button.dataset.bookSku);
    if(!variant) return;
    busy=true; button.disabled=true; message.textContent='';
    try {
      await add(variant);
      open(button);
    } catch(e) {status.textContent=e.message;message.textContent=e.message;}
    finally {busy=false;button.disabled=false;}
  });
  items.addEventListener('click',async e=>{
    if(e.target.closest('.pbn-cart-compare')) { dialog.close(); return; }
    const button=e.target.closest('[data-remove-line]'); if(!button || busy || !cart)return;
    busy=true;button.disabled=true;message.textContent='';
    const removed = cart.lines.nodes.find(line=>line.id===button.dataset.removeLine);
    try {await change(`mutation Remove($id:ID!,$lines:[ID!]!){cartLinesRemove(cartId:$id,lineIds:$lines){cart{${fields}} userErrors{message} warnings{code message}}}`,{id:cart.id,lines:[button.dataset.removeLine]},'cartLinesRemove');
      if (removed && !cart.lines.nodes.some(line=>line.id===removed.id)) measure('remove_from_cart', [removed]);
    }
    catch(e){message.textContent=e.message;} finally{busy=false;if(button.isConnected)button.disabled=false;}
  });
  // Revalidate the cart immediately before redirect so stale or unavailable items cannot be silently purchased.
  checkout.addEventListener('click',async e=>{
    e.preventDefault(); if(busy||!cart)return;busy=true;message.textContent=t('checkingBag');
    try {
      const before=bagSignature(cart);
      const fresh=await readCart(cart.id);
      // Google's document click listener has now had the original click. Keep
      // only its linker value before render replaces the outgoing href.
      const linker = new URL(checkout.href).searchParams.get('_gl');
      cart=fresh;render();
      if(!cart?.totalQuantity){remember(null);message.textContent=t('expiredBag');return;}
      if (bagProblem()) return;
      if (bagSignature(cart)!==before) { message.textContent=t('reviewBag');return; }
      if(!checkout.hidden){
        const destination=new URL(checkout.href);
        destination.searchParams.delete('_gl');
        if(window.pinnacleBookAnalyticsAllowed?.() && linker && linker.length<=4096 && /^[A-Za-z0-9_*~.\-]+$/.test(linker)) destination.searchParams.set('_gl',linker);
        measure('begin_checkout');location.assign(destination.href);
      }
    }
    catch(e){checkout.hidden=true;checkout.removeAttribute('href');message.textContent=e.message;}finally{busy=false;}
  });
  async function init(){
    busy=true;
    if(directBag){render();open(root.querySelector('[data-cart-open]'));message.textContent=t('checkingBag');dialog.setAttribute('aria-busy','true');}
    let catalogueReady=false,bagReady=!saved();
    try {
      const data=await api('{products(first:50){nodes{variants(first:10){nodes{id sku availableForSale requiresShipping price{amount currencyCode}}}}}}');
      for(const product of data.products.nodes)for(const variant of product.variants.nodes)variants.set(variant.sku,variants.has(variant.sku)?null:variant);
      catalogueReady=true;
    }catch(e){status.textContent=e.message;buttons.forEach(b=>b.textContent=t('shopUnavailableShort'));}
    const id=saved();if(id){try{cart=await readCart(id);bagReady=true;if(!cart)remember(null);}catch(e){status.textContent=e.message;}}
    ready=catalogueReady&&bagReady;
    render();
    for(const button of buttons){button.disabled=!ready||!validVariant(button.dataset.bookSku);if(catalogueReady&&button.disabled)button.textContent=t('currentlyUnavailable');}
    if(directBag){
      try {
        if(!ready)throw new Error(t('connectionError'));
        const variant=validBagLink&&validVariant(requestedSku);
        if(!variant)throw new Error('This link does not select an available PDF edition. Please choose a book below or call 9100 181 181.');
        message.textContent='';await add(variant);measure('view_cart');
      }catch(e){status.textContent=e.message;message.textContent=e.message;}
      finally{dialog.removeAttribute('aria-busy');}
    }
    busy=false;
  }
  init();
})();
