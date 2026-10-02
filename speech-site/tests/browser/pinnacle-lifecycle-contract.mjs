// Geometry contract shared by local Playwright and remote WebDriver checks.
// Uses the accessible landmark so it also detects the original class-collision defect.
export function measurePinnacleLifecycle() {
  const nav=document.querySelector('nav[aria-label="The PinnacleAI circle in seven readable stages"]');
  if(!nav)return {passed:false,failures:['Lifecycle landmark missing']};
  const list=nav.querySelector('ol'),items=[...list.children];
  const rect=element=>{const r=element.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
  const navBox=rect(nav),listBox=rect(list),columns=innerWidth<=600?2:innerWidth<=1100?4:7;
  const gap=parseFloat(getComputedStyle(list).columnGap)||0;
  const expectedWidth=(listBox.width-gap*(columns-1))/columns;
  const cards=items.map(li=>{
    const link=li.querySelector('a'),heading=li.querySelector('strong'),copy=li.querySelector('small');
    const lines=e=>Math.round(e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight));
    return {...rect(li),link:rect(link),headingLines:lines(heading),copyLines:lines(copy),textWidth:rect(heading).width};
  });
  const failures=[];
  if(items.length!==7)failures.push('Expected seven lifecycle cards');
  if(Math.abs(listBox.width-navBox.width)>2)failures.push('List does not fill lifecycle container');
  for(let i=0;i<cards.length;i++){
    const c=cards[i],wideLast=columns===2&&i===6;
    const wanted=wideLast?listBox.width:expectedWidth;
    if(Math.abs(c.width-wanted)>2)failures.push('Incorrect card width '+(i+1));
    if(c.width<120||c.textWidth<90)failures.push('Collapsed readable area '+(i+1));
    if(c.headingLines>5||c.copyLines>6||c.height>340)failures.push('Excessive vertical text wrapping '+(i+1));
    if(c.x<listBox.x-1||c.x+c.width>listBox.x+listBox.width+1)failures.push('Card outside list '+(i+1));
    if(i%columns!==0&&Math.abs(c.y-cards[i-1].y)>2)failures.push('Unexpected card row '+(i+1));
  }
  return {passed:failures.length===0,failures,viewport:innerWidth,columns,nav:navBox,list:listBox,cards};
}

