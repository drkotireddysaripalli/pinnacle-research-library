// Compare the same approved UI state. Current-page highlighting and the
// anonymous reader backdrop are intentional states, not neutral headers.
export function headerReferenceName(identity,{gate=false,activePath=''}={}){
  const variant=gate?'reader-gate':activePath?'active-'+activePath.replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,''):'';
  return 'pinnacle-common-v159-'+identity+(variant?'-'+variant:'');
}

// Self-contained for actual browser execution. Native closed details can
// retain child geometry even though the images are not presented to a reader.
export function imageInViewport(n){
  if(n.closest('[hidden]'))return false;
  const closed=n.closest('details:not([open])');
  if(closed&&!closed.querySelector(':scope > summary')?.contains(n))return false;
  const r=n.getBoundingClientRect();
  return r.width>0&&r.height>0&&r.left<innerWidth&&r.right>0&&r.top<innerHeight&&r.bottom>0;
}
