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

export function desktopScreenResolution(config){
  // A 1024px CSS height needs room for Windows/Edge browser chrome. The
  // 1080px VM otherwise clamps the window and silently delivers 961px.
  return config.height>900?'1920x1200':'1920x1080';
}

export async function fitCssViewport(config,{viewport,rect,resize}){
  for(let attempt=0;attempt<3;attempt++){
    const view=await viewport();
    if(Math.abs(view.width-config.width)<=1&&Math.abs(view.height-config.height)<=1)return view;
    // Use actual outer bounds. Drivers may clamp the requested window or
    // change browser chrome after the first real navigation.
    const actual=await rect();
    await resize({width:actual.width+config.width-view.width,height:actual.height+config.height-view.height});
  }
  const view=await viewport();
  if(Math.abs(view.width-config.width)>1||Math.abs(view.height-config.height)>1)throw Error('Requested CSS viewport unavailable: actual '+view.width+'x'+view.height);
  return view;
}
