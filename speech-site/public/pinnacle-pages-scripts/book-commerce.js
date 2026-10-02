/* Public Shopify catalogue and cart only. No customer, child or payment data is collected here. */
(() => {
  const root = document.querySelector('[data-book-commerce]');
  if (!root) return;
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
  let cart = null, busy = false, opener;
  const fields = 'id checkoutUrl totalQuantity cost { totalAmount { amount currencyCode } } lines(first:50) { nodes { id quantity cost { totalAmount { amount currencyCode } } merchandise { ... on ProductVariant { id sku title product { title } } } } }';
  const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:value.currencyCode,maximumFractionDigits:2}).format(Number(value.amount));
  const saved = () => { try { return localStorage.getItem(storageKey); } catch { return null; } };
  function remember(id) { try { id ? localStorage.setItem(storageKey,id) : localStorage.removeItem(storageKey); } catch {} }
  async function api(query, variables = {}) {
    const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(18000)});
    if (!response.ok) throw new Error('The book bag could not connect. Please try again, or call 9100 181 181.');
    const body = await response.json();
    if (body.errors?.length) throw new Error('The shop is temporarily unavailable. Please try again.');
    return body.data;
  }
  function element(tag, text, className) { const el=document.createElement(tag); el.textContent=text; if(className)el.className=className; return el; }
  function render() {
    items.replaceChildren();
    const lines=cart?.lines.nodes || [];
    root.querySelector('[data-cart-count]').textContent=String(cart?.totalQuantity || 0);
    root.querySelector('[data-cart-total]').textContent=cart ? money(cart.cost.totalAmount) : '₹0';
    const fileCount=lines.reduce((sum,line)=>sum+(catalogue[line.merchandise.sku]?.books.length || 1)*line.quantity,0);
    root.querySelector('[data-cart-file-count]').textContent=fileCount ? `${fileCount} complete PDF ${fileCount===1?'ebook':'ebooks'} · Email delivery after payment` : 'Select a book to begin.';
    checkout.hidden=true;
    checkout.removeAttribute('href');
    if (!lines.length) items.append(element('p','Your book bag is empty. Start with one book or save with a collection.','pbn-cart-note'));
    const selected=new Set(), repeated=new Set();
    for (const line of lines) {
      const entry=catalogue[line.merchandise.sku];
      const row=element('article','','pbn-cart-item');
      const covers=element('div','','pbn-cart-covers');
      for(const book of entry?.books || []) {
        const cover=document.createElement('img');
        cover.src=book.cover;cover.alt=book.title+' — front cover';cover.width=1492;cover.height=1054;cover.loading='lazy';
        covers.append(cover);
        if(selected.has(book.sku))repeated.add(book.title);selected.add(book.sku);
      }
      const copy=element('div','');
      const title=element('h3','');
      if(entry){const link=element('a',entry.title);link.href=entry.path;title.append(link);}else title.textContent=line.merchandise.product.title;
      const meta=element('div','','pbn-cart-item-meta');
      meta.append(element('p',(entry?.books.length>1?entry.books.length+' PDF ebooks':'PDF ebook')+' · Quantity '+line.quantity),element('strong',money(line.cost.totalAmount)));
      copy.append(title,meta);
      if(entry?.books.length){
        const included=element('ul','','pbn-cart-included');
        for(const book of entry.books){
          const item=element('li','');
          if(entry.books.length>1)item.append(element('span',book.title,'pbn-cart-sample-title'));
          const sample=element('a','Read the free six-page sample ↗');sample.href=book.sample;sample.target='_blank';sample.rel='noopener';sample.setAttribute('aria-label','Read the free six-page sample of '+book.title);
          item.append(sample);included.append(item);
        }
        copy.append(included);
      }
      const remove=element('button','Remove'); remove.type='button'; remove.dataset.removeLine=line.id;
      remove.setAttribute('aria-label','Remove '+line.merchandise.product.title);
      copy.append(remove); row.append(covers,copy); items.append(row);
    }
    if(repeated.size)items.append(element('p','These books appear in more than one selection: '+[...repeated].join(', ')+'. You can remove a selection to avoid buying the same ebook twice.','pbn-cart-overlap'));
    if (lines.length) {
      const link=element('a','Compare collections for better value →'); link.href='/shop#pbn-collections'; link.className='pbn-cart-compare'; items.append(link);
      try {const url=new URL(cart.checkoutUrl);
        if (url.protocol==='https:' && ['pinnacleblooms.myshopify.com','qg10s5-ie.myshopify.com'].includes(url.hostname)) { checkout.href=url.href; checkout.hidden=false; }
      } catch { message.textContent='Your checkout link could not load. Please refresh your book bag.'; }
    }
  }
  function open(button) { opener=button; if(!dialog.open)dialog.showModal(); }
  root.querySelector('[data-cart-open]').addEventListener('click',e=>{render();open(e.currentTarget);});
  root.querySelector('[data-cart-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  async function change(query,variables,key) {
    const result=(await api(query,variables))[key];
    if (result.userErrors?.length) throw new Error(result.userErrors.map(e=>e.message).join(' '));
    if (!result.cart) throw new Error('Please refresh your book bag and try again.');
    cart=result.cart; remember(cart.id); render();
    if(result.warnings?.length) message.textContent='Your book bag was updated. Please check the items and total before continuing.';
  }
  for (const button of buttons) button.addEventListener('click', async()=>{
    if(busy) return;
    const variant=variants.get(button.dataset.bookSku);
    if(!variant?.availableForSale || variant.requiresShipping) return;
    busy=true; button.disabled=true; message.textContent='';
    try {
      if (cart?.lines.nodes.some(line=>line.merchandise.id===variant.id)) {render();message.textContent='This ebook or collection is already in your bag.';}
      else if (cart) await change(`mutation Add($id:ID!,$lines:[CartLineInput!]!){cartLinesAdd(cartId:$id,lines:$lines){cart{${fields}} userErrors{message} warnings{code message}}}`,{id:cart.id,lines:[{merchandiseId:variant.id,quantity:1}]},'cartLinesAdd');
      else await change(`mutation Create($input:CartInput!){cartCreate(input:$input){cart{${fields}} userErrors{message} warnings{code message}}}`,{input:{lines:[{merchandiseId:variant.id,quantity:1}],buyerIdentity:{countryCode:'IN'}}},'cartCreate');
      open(button);
    } catch(e) {status.textContent=e.message;message.textContent=e.message;}
    finally {busy=false;button.disabled=false;}
  });
  items.addEventListener('click',async e=>{
    if(e.target.closest('.pbn-cart-compare')) { dialog.close(); return; }
    const button=e.target.closest('[data-remove-line]'); if(!button || busy || !cart)return;
    busy=true;button.disabled=true;message.textContent='';
    try {await change(`mutation Remove($id:ID!,$lines:[ID!]!){cartLinesRemove(cartId:$id,lineIds:$lines){cart{${fields}} userErrors{message} warnings{code message}}}`,{id:cart.id,lines:[button.dataset.removeLine]},'cartLinesRemove');}
    catch(e){message.textContent=e.message;} finally{busy=false;if(button.isConnected)button.disabled=false;}
  });
  // Revalidate the cart immediately before redirect so stale or unavailable items cannot be silently purchased.
  checkout.addEventListener('click',async e=>{
    e.preventDefault(); if(busy||!cart)return;busy=true;message.textContent='Checking your book bag…';
    try {const data=await api(`query Cart($id:ID!){cart(id:$id){${fields}}}`,{id:cart.id});cart=data.cart;render();if(!cart?.totalQuantity){remember(null);message.textContent='Your book bag has expired. Please add your books again.';return;}if(!checkout.hidden)location.assign(checkout.href);}
    catch(e){message.textContent=e.message;}finally{busy=false;}
  });
  async function init(){
    try {
      const data=await api('{products(first:50){nodes{variants(first:10){nodes{id sku availableForSale requiresShipping price{amount currencyCode}}}}}}');
      for(const product of data.products.nodes)for(const variant of product.variants.nodes)variants.set(variant.sku,variant);
      for(const button of buttons){const v=variants.get(button.dataset.bookSku);button.disabled=!(v?.availableForSale&&!v.requiresShipping&&v.price.currencyCode==='INR'&&Number(v.price.amount)===Number(button.dataset.bookPrice));if(button.disabled)button.textContent='Currently unavailable';}
    }catch(e){status.textContent=e.message;buttons.forEach(b=>b.textContent='Shop temporarily unavailable');}
    const id=saved();if(id){try{cart=(await api(`query Cart($id:ID!){cart(id:$id){${fields}}}`,{id})).cart;if(!cart)remember(null);}catch{remember(null);}}
    render();
  }
  init();
})();
