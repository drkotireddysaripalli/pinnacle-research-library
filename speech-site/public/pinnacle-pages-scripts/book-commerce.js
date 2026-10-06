/* Public Shopify catalogue and cart only. No customer, child or payment data is collected here. */
(() => {
  const root = document.querySelector('[data-book-commerce]');
  if (!root) return;
  let strings = {};
  try { strings = JSON.parse(root.dataset.cartStrings || '{}'); } catch {}
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
  const fields = 'id checkoutUrl totalQuantity cost { totalAmount { amount currencyCode } } lines(first:50) { nodes { id quantity cost { totalAmount { amount currencyCode } } merchandise { ... on ProductVariant { id sku title product { title } } } } }';
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
  function element(tag, text, className) { const el=document.createElement(tag); el.textContent=text; if(className)el.className=className; return el; }
  if(directBag){
    const policies=element('p','','pbn-cart-note');
    for(const [i,[label,path]] of [['Terms of use','/terms-of-use'],['Refund policy','/refund-policy']].entries()){
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
    const fileCount=lines.reduce((sum,line)=>sum+(catalogue[line.merchandise.sku]?.books.length || 1)*line.quantity,0);
    root.querySelector('[data-cart-file-count]').textContent=fileCount ? t(fileCount===1?'fileCountSingular':'fileCountPlural',{count:fileCount}) : t('selectBook');
    checkout.hidden=true;
    checkout.removeAttribute('href');
    if (!lines.length) items.append(element('p',t('emptyBag'),'pbn-cart-note'));
    const selected=new Set(), repeated=new Set();
    for (const line of lines) {
      const entry=catalogue[line.merchandise.sku];
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
      if(entry){const link=element('a',entry.title);link.href=entry.path;title.append(link);}else title.textContent=line.merchandise.product.title;
      const meta=element('div','','pbn-cart-item-meta');
      const language = {EN:'English',HI:'हिन्दी / Hindi',TE:'తెలుగు / Telugu'}[line.merchandise.sku?.match(/-(EN|HI|TE)-PDF/)?.[1]];
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
      remove.setAttribute('aria-label',t('removeAria',{title:line.merchandise.product.title}));
      copy.append(remove); row.append(covers,copy); items.append(row);
    }
    if(repeated.size)items.append(element('p',t('duplicateWarning',{titles:[...repeated].join(', ')}),'pbn-cart-overlap'));
    if (lines.length) {
      const link=element('a',t('compareCollections')); link.href=root.dataset.cartCollections || '/shop#pbn-collections'; link.className='pbn-cart-compare'; items.append(link);
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
    cart=result.cart; remember(cart.id); render();
    if(result.warnings?.length) message.textContent=t('updatedWarning');
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
      const data=await api(`query Cart($id:ID!){cart(id:$id){${fields}}}`,{id:cart.id});
      // Google's document click listener has now had the original click. Keep
      // only its linker value before render replaces the outgoing href.
      const linker = new URL(checkout.href).searchParams.get('_gl');
      cart=data.cart;render();
      if(!cart?.totalQuantity){remember(null);message.textContent=t('expiredBag');return;}
      if(!checkout.hidden){
        const destination=new URL(checkout.href);
        destination.searchParams.delete('_gl');
        if(window.pinnacleBookAnalyticsAllowed?.() && linker && linker.length<=4096 && /^[A-Za-z0-9_*~.\-]+$/.test(linker)) destination.searchParams.set('_gl',linker);
        measure('begin_checkout');location.assign(destination.href);
      }
    }
    catch(e){message.textContent=e.message;}finally{busy=false;}
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
    const id=saved();if(id){try{cart=(await api(`query Cart($id:ID!){cart(id:$id){${fields}}}`,{id})).cart;bagReady=true;if(!cart)remember(null);}catch(e){status.textContent=e.message;}}
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
