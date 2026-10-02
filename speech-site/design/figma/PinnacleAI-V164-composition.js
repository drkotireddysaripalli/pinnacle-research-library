await Promise.all([figma.loadFontAsync({family:'Sintony',style:'Bold'}),figma.loadFontAsync({family:'Sintony',style:'Regular'})]);
if(figma.root.children.some(p=>p.name==='PinnacleAI / V164 product story')) throw Error('Already exists; inspect before retry');
const ids=[]; const add=n=>{ids.push(n.id);return n};
const page=add(figma.createPage());page.name='PinnacleAI / V164 product story';await figma.setCurrentPageAsync(page);
const C={navy:'#17345f',teal:'#006d76',pink:'#b62177',purple:'#842599',line:'#dce7ec',pale:'#f1f8f8',white:'#ffffff'};
function rgb(hex){return {r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255}}
function fill(hex){return [{type:'SOLID',color:rgb(hex)}]}
function box(name,w,direction='VERTICAL',gap=20,pad=0,bg=C.white){
 const n=add(figma.createAutoLayout());n.name=name;n.layoutMode=direction;n.resize(w,100);n.primaryAxisSizingMode=direction==='HORIZONTAL'?'FIXED':'AUTO';n.counterAxisSizingMode=direction==='HORIZONTAL'?'AUTO':'FIXED';n.itemSpacing=gap;n.paddingLeft=n.paddingRight=pad;n.paddingTop=n.paddingBottom=pad;n.fills=fill(bg);return n;
}
function txt(parent,s,w,size=18,bold=false,color=C.navy){
 const t=add(figma.createText());t.fontName={family:'Sintony',style:bold?'Bold':'Regular'};t.fontSize=size;t.lineHeight={unit:'PERCENT',value:bold?118:155};t.fills=fill(color);t.characters=s;t.resize(w,10);t.textAutoResize='HEIGHT';parent.appendChild(t);return t;
}
function picture(parent,hash,w,h,name){const r=add(figma.createRectangle());r.name=name;r.resize(w,h);r.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];r.cornerRadius=18;parent.appendChild(r);return r}
const call=await figma.getNodeByIdAsync('3313:12');
function cta(p){const n=add(call.createInstance());p.appendChild(n);return n}
function title(p,label,heading,w,mobile){txt(p,label.toUpperCase(),w,12,true,C.purple);txt(p,heading,w,mobile?29:42,true)}
function note(p,s,w){txt(p,s,w,14,false,C.teal)}
const card=add(figma.createComponent());card.name='PinnacleAI / Module';card.layoutMode='VERTICAL';card.resize(520,100);card.primaryAxisSizingMode='AUTO';card.counterAxisSizingMode='FIXED';card.paddingLeft=card.paddingRight=24;card.paddingTop=card.paddingBottom=24;card.itemSpacing=16;card.fills=fill(C.white);card.strokes=fill(C.line);card.cornerRadius=18;
txt(card,'AbilityScore® + Readiness',472,23,true);
txt(card,'Understand the child. Make the starting picture clear.',472,18,true,C.teal);
txt(card,'For your family: understand what was assessed and why it matters for your child’s life.',472,16);
txt(card,'What goes in. What comes next.  +',472,15,true,C.purple);
txt(card,'Explore the module →   •   Verify its scope ↗',472,14,true,C.purple);
card.x=-700;
const modules=[
['AbilityScore® + Readiness','Understand the child. Make the starting picture clear.','Understand what was assessed and why it matters for your child’s life.'],
['Personal Development Kernel','Keep this child’s story connected.','Bring the details that matter into the next discussion.'],
['Prognose','Plan towards the life purpose. Set a point for review.','Understand the priority, proposed support and review point.'],
['TherapeuticAI® + integrated therapies','Give each activity a reason in your child’s life.','See why the recommended therapies belong in this child’s plan.'],
['Everyday Therapy™','Bring guided practice into the child’s everyday world.','Know what to try, what support helps and what to share with the team.'],
['Fusion','Track. Review. Correct—with the people who know the child.','Bring what you notice into the decision about what changes next.'],
['Reassess. Adjust. Repeat.','Let the child’s changing abilities shape the next decision.','Understand the next plan and the reasons behind it.']];
function module(parent,data,w){const i=add(card.createInstance());parent.appendChild(i);i.resize(w,i.height);i.primaryAxisSizingMode='AUTO';const t=i.findAll(n=>n.type==='TEXT');for(const n of t)n.resize(w-48,n.height);t[0].characters=data[0];t[1].characters=data[1];t[2].characters='For your family: '+data[2];return i}
const hash={hero:'ccdc61d69181445792c5b2cca85ad7cd7bf9b026',example:'2de2db3a47d873d25c31805a4b747ba8f2043f0e',home:'5b56032202f1101153beab36492af8eb279a0265',self:'430e368c4a6f65669cd156812426aa54b84df845',main:'f84809fb8ae0729ea27643b98f8557025cce1d52'};
const boards=[];
for(const mobile of [false,true]){
 const width=mobile?390:1440,pad=mobile?24:100,w=width-2*pad;
 const b=box(mobile?'Phone / 390 / Product story':'Desktop / 1440 / Product story',width,'VERTICAL',0);b.x=mobile?1510:0;boards.push(b);
 const shell=box('Existing common shell / preserved in Astro',width,'VERTICAL',8,24,C.pale);b.appendChild(shell);txt(shell,'APPROVED COMMON HEADER + NINE AUTHORITY LINKS',width-48,12,true,C.teal);note(shell,'Uses the shared production component. Page composition begins below.',width-48);
 const hero=box('Hero / PinnacleAI owns the story',width,mobile?'VERTICAL':'HORIZONTAL',32,pad);b.appendChild(hero);
 const tw=mobile?w:510;const copy=box('Opening + call',tw,'VERTICAL',22);hero.appendChild(copy);
 title(copy,'Pinnacle Blooms Network · The whole system. One purpose.','PinnacleAI®\nOne system. Your child’s whole life.',tw,mobile);
 txt(copy,'Your child’s self-sufficient, mainstream-included life is the purpose from the beginning. PinnacleAI® brings ability measurement, a child-specific plan, integrated therapies, everyday practice and review into one system built around that purpose.',tw,mobile?17:20);
 txt(copy,'Understand the starting point. Know why each step matters. Help shape what happens next.',tw,17,true,C.pink);cta(copy);note(copy,'Ask about a first visit →   Find a Pinnacle centre →',tw);
 picture(hero,hash.hero,mobile?w:698,mobile?w:698,'Approved PinnacleAI circle creative');
 function section(name,label,h,bg=C.white){const s=box(name,width,'VERTICAL',24,pad,bg);b.appendChild(s);title(s,label,h,w,mobile);return s}
 const def=section('Definition / source beside claim','What PinnacleAI brings together','The purpose sets the plan. PinnacleAI connects the work.');
 txt(def,'We built PinnacleAI around your child’s self-sufficient, mainstream-included life. It connects what we understand about your child with the goals, people, therapies, practice and review that serve that life.',w,18);
 note(def,'PinnacleAI GPT-OS · Class B non-diagnostic developmental-support software · MD-5 licence ↗ · BIS scope ↗',w);
 const ex=section('Concrete child example','PinnacleAI in a child’s day','“I want my child to ask for help—and join in.”',C.pale);
 const er=box('Example image + decisions',w,mobile?'VERTICAL':'HORIZONTAL',28,0,C.pale);ex.appendChild(er);picture(er,hash.example,mobile?w:450,(mobile?w:450)*1.25,'Approved illustrative help-request journey');
 const ec=box('Three understandable decisions',mobile?w:w-478,'VERTICAL',24,0,C.pale);er.appendChild(ec);
 for(const [h,t]of [['The family’s goal gives the work direction.','Begin with what the child can already do and the life opportunity the family wants to work towards.'],['The plan gives each contribution a reason.','Suitable therapy and guided family practice connect around an accessible request for help.'],['What happens in life changes the next step.','Fusion brings home and school observations into review, then the team reassesses what helped.']]){txt(ec,h,mobile?w:w-478,22,true);txt(ec,t,mobile?w:w-478,17)}
 note(ex,'Illustrative example, not a patient result. Full example expands on the page.',w);
 const life=section('One numbered lifecycle','One family journey','Seven stages. The child and family at the centre.');
 txt(life,'1  Measure abilities\n2  Readiness & plan\n3  Integrated therapies\n4  Everyday Therapy\n5  Track & correct\n6  Reassess & review\n7  Independence & inclusion',w,mobile?19:24,true,C.teal);
 const system=section('Unnumbered architecture','Inside PinnacleAI®','A clear job for every part. A shared direction for the whole.',C.pale);
 note(system,'Understand the child → Plan & practise → Observe & review ↻ The next decision',w);
 for(let j=0;j<modules.length;j+=mobile?1:2){const row=box('Module row',w,mobile?'VERTICAL':'HORIZONTAL',20,0,C.pale);system.appendChild(row);module(row,modules[j],mobile?w:(w-20)/2);if(!mobile&&modules[j+1])module(row,modules[j+1],(w-20)/2)}
 const therapies=section('Connected therapies','Multi-sensory · Multi-disciplinary · Integrated','Different expertise. Your child’s whole life as the purpose.');
 for(const [a,z]of [['Speech therapy','Communicate a choice. Ask for help.'],['Occupational therapy','Access the activity. Take part comfortably.'],['ABA therapy','Understand behaviour. Support participation.'],['Special education','Access learning. Build useful routines.'],['Integrated autism support','Bring the relevant contributions together.']]){txt(therapies,a+' →',w,22,true,C.purple);txt(therapies,z,w,18)}cta(therapies);
 for(const o of [
 ['Every home. Every parent.','PinnacleAI carries the plan beyond the centre.',hash.home,'Everyday Therapy brings professional guidance into family life; Fusion brings family observations back into review.'],
 ['PinnacleAI® → Self-Sufficient','More choice. More ability. More of their own life.',hash.self,'AbilityScore and readiness inform the next goal. Guided practice gives it a place in daily routines. Fusion and reassessment bring real-world use back into review.'],
 ['PinnacleAI® → Mainstream Included','A place to learn. People to belong with.',hash.main,'Connect the child’s abilities and readiness with participation goals, appropriate support and school observations shared with consent.']]){
 const s=section(o[0],o[0],o[1]);txt(s,o[3],w,18);picture(s,o[2],w,w*2/3,o[0]+' / approved branded creative');note(s,'Explore the full page →   Read the relevant Verify source ↗',w)}
 const proof=section('Evidence / original records','Licences. Documented scale. Original evidence.','Confidence you can see. Evidence you can verify.',C.pale);
 txt(proof,'31M+ defined services   •   792,614 beneficiary / family registrations   •   2.7B+ structured records and events',w,24,true);
 note(proof,'Dated 17 July 2026. Defined operating measures, not individual child outcomes. Original MD-5, BIS and practitioner reports remain linked.',w);
 txt(proof,'UDIN: 26200027GMBLXU4868\nUDIN: 26200027HCNFEI9138',w,17,true,C.teal);
 const close=section('First visit / FAQ / conversion','Let’s make the first step simple','Begin with the life you want your child to build. Begin with Pinnacle.');
 txt(close,'Tell us about your child → Understand the suitable next step → Choose with clarity',w,21,true);cta(close);note(close,'10 source-aligned questions expand on the page. Complete common Verify footer and navigation are preserved in Astro.',w);
}
return {pageId:page.id,boards:boards.map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),componentId:card.id,createdIds:ids,count:ids.length};
