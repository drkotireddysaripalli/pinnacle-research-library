"""Qualify the two exact selected reference sets from current public HTML.

Called inside the existing public-feed transaction. No clinical/source DB writes.
Unknown evidence preserves prior source ownership; it never implies deletion.
"""
import concurrent.futures,datetime as dt,functools,hashlib,importlib.util,json,zipfile
from html.parser import HTMLParser
from pathlib import Path
import manager as m
HERE=Path(__file__).resolve().parent
ABILITY='ability_reference_illustrations_v1';GURU='guru_selected_reference_galleries_v1'
ABILITY_PACKET=HERE/'ability-reference-assets/bootstrap/ability-reference-publication-bootstrap-20261016.zip'
GURU_PACKET=HERE/'guru-selected-galleries/guru-selected-galleries-bootstrap-20261016.zip'
GURU_SHA='4b8f2c17221066c4483af541fbc2d55de62628189cbaeb000c85b5dcfe7b520f'
def packed(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))
@functools.lru_cache(maxsize=1)
def parents():
 data=json.loads((HERE.parents[1]/'speech-site/deployment/selected-reference-data.json').read_bytes())
 if len(data)!=193:raise ValueError('Exact193 selected parents required')
 return frozenset(data)
def ability_module():
 spec=importlib.util.spec_from_file_location('pinnacle_observed_ability',HERE/'ability-reference-assets/observed-use/qualify_observed_ability_uses.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);return mod
def guru_packet():
 if hashlib.sha256(GURU_PACKET.read_bytes()).hexdigest()!=GURU_SHA:raise ValueError('Guru selection packet changed')
 with zipfile.ZipFile(GURU_PACKET) as z:
  plans={r['manifest']['existing_parent_url']:r for r in (json.loads(s) for s in z.read('plan/parent-render-manifests.jsonl').decode().splitlines())}
  heads=[json.loads(s) for s in z.read('preflight/image-HEAD-preflight.jsonl').decode().splitlines()]
 if len(plans)!=146 or sum(len(r['manifest']['assets']) for r in plans.values())!=150:raise ValueError('Exact Guru selection required')
 return plans,heads
class GuruHTML(HTMLParser):
 def __init__(self,plan):
  super().__init__(convert_charrefs=True);self.plan=plan;self.depth=0;self.sections=0;self.current=None;self.images={};self.errors=[];self.cta=0;self.section_depth=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.depth+=tag not in ('img','br','hr','meta','link','input','source','wbr','area','base','embed','param','track','col')
  if 'data-guru-gallery-source' in a:
   self.sections+=1;self.section_depth=self.depth
   expected=self.plan['manifest']
   if (a.get('data-guru-gallery-source'),a.get('data-guru-id'),a.get('data-guru-render-manifest-sha256'),a.get('data-guru-selection-sha256'))!=(GURU,str(expected['guru_id']),self.plan['sha256'],expected['selection_scope_sha256']):self.errors.append('selection-marker-mismatch')
  if not self.section_depth:return
  if tag in ('template','script','style','iframe','form','input','details') or 'hidden' in a or 'inert' in a or a.get('aria-hidden')=='true' or any(x in a.get('style','').replace(' ','').lower() for x in ('display:none','visibility:hidden','opacity:0')):self.errors.append('hidden-or-active-reference')
  if tag=='figure':
   self.current=a.get('data-guru-gallery-asset');self.sequence=a.get('data-guru-gallery-sequence')
   if self.current in self.images:self.errors.append('duplicate-figure')
  if tag=='img':
   if not self.current or self.current in self.images or any(k in a for k in ('srcset','data-src','data-srcset')):self.errors.append('ambiguous-image')
   self.images[self.current]={'src':a.get('src'),'alt':a.get('alt'),'sequence':self.sequence}
  if tag=='a' and a.get('href')=='tel:+919100181181':self.cta+=1
 def handle_endtag(self,tag):
  if tag=='figure':self.current=None
  if tag=='section' and self.depth==self.section_depth:self.section_depth=0
  self.depth=max(0,self.depth-1)
 def qualified(self):
  expected={r['asset_id']:{'src':r['selected_url'],'alt':r['purpose_alt'],'sequence':str(r['sequence'])} for r in self.plan['manifest']['assets']}
  return self.sections==1 and not self.errors and self.images==expected and self.cta==1
def prior_guru(db,allowed):
 result={}
 for row in db.execute('SELECT url,metadata_json FROM pages WHERE instr(metadata_json,?)>0',(GURU,)):
  for image,proof in json.loads(row['metadata_json']).get('managed_image_ownership',{}).items():
   if GURU not in proof.get('owners',[]):continue
   pair=(row['url'],image)
   if pair not in allowed:raise ValueError('Prior Guru ownership outside current explicit selection')
   result[pair]={'page_url':row['url'],'image_url':image,'source_sha256':proof['source_sha256'][GURU]}
 return result
def refresh(db,resources,cache,now,probe,head_ok,fresh):
 from managed_media_sources import definitively_disqualified
 ability=ability_module();packet=ability.load_packet(ABILITY_PACKET);plans,guru_heads=guru_packet()
 expected=set(packet['parents'])|set(plans)
 if not expected.issubset(resources):return {},{'status':'capture-pending','requiredParents':193,'capturedParents':len(expected&set(resources))},[]
 with zipfile.ZipFile(ABILITY_PACKET) as z:
  raw=z.read('ability-delivery/delivery.jsonl');summary=json.loads(z.read('ability-delivery/summary.json'))
  if hashlib.sha256(raw).hexdigest()!=summary['delivery_receipt_sha256'] or summary['source_asset_sha256']!=packet['asset_metadata_sha256'] or summary['media_bodies_downloaded']!=0:raise ValueError('Ability delivery proof binding changed')
  seed=[json.loads(s) for s in raw.decode().splitlines()]
 seeds=seed+guru_heads
 for row in seeds:
  u=row['url'];stamp=row.get('checked_at') or row.get('observed_at')
  if u not in cache and fresh(stamp,now):cache[u]={**row,'checked_at':stamp,'direct_image_delivery_verified':row.get('delivery_verified') is True or row.get('direct_image_delivery_verified') is True,'x_robots':', '.join(row.get('x_robots_tags') or row.get('x_robots') or [])}
 urls=sorted({im['image_url'] for p in packet['parents'].values() for im in p['images'].values()}|{im['selected_url'] for p in plans.values() for im in p['manifest']['assets']})
 pending=[u for u in urls if not fresh(cache.get(u,{}).get('checked_at'),now)]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for u,r in zip(pending,pool.map(lambda u:probe(u,now),pending)):cache[u]=r
 observations={'source':ABILITY,'consent_sha256':packet['consent_sha256'],'render_index_sha256':packet['index_sha256'],'complete_observed_parent_set':True,'parents':[]}
 for u in packet['parents']:
  cap=resources[u].get('reference_capture')
  if cap:observations['parents'].append({**cap['proof'],'body_hex':cap['body_hex']})
 state=ability.feed_state_from_db(db,packet);qualified=ability.qualify(packet,observations,cache,state,now)
 desired={};holds=[]
 if qualified['can_reconcile']:
  ability.assert_feed_state_unchanged(db,packet,qualified);desired[ABILITY]=qualified['desired']
 holds.extend(qualified['held'])
 allowed={(u,im['selected_url']) for u,p in plans.items() for im in p['manifest']['assets']};wanted=prior_guru(db,allowed);guru_qualified=0
 for u,p in plans.items():
  row=resources[u];cap=row.get('reference_capture');valid=False;observed=False
  if cap and fresh(cap['proof'].get('observed_at'),now):
   proof=cap['proof'];body=bytes.fromhex(cap['body_hex'])
   observed=proof.get('method')=='GET' and proof.get('status')==200 and proof.get('final_url')==u and proof.get('body_complete') is True and hashlib.sha256(body).hexdigest()==proof['body_sha256'] and len(body)==proof['body_bytes']
   if observed and row.get('publication_qualified') and not any(row.get(k) for k in ('noindex','noimageindex','canonical_conflict')):
    parser=GuruHTML(p);parser.feed(body.decode('utf8'));parser.close();valid=parser.qualified()
  for im in p['manifest']['assets']:
   pair=(u,im['selected_url'])
   if valid and head_ok(cache[im['selected_url']]):wanted[pair]={'page_url':u,'image_url':im['selected_url'],'source_sha256':cap['proof']['body_sha256']};guru_qualified+=1
   else:
    head=cache[im['selected_url']]
    if observed and not valid or fresh(head.get('checked_at'),now) and definitively_disqualified(head):wanted.pop(pair,None)
    holds.append({'source':GURU,'page_url':u,'media_url':im['selected_url'],'condition':'current-render-or-delivery-not-qualified'})
 desired[GURU]=list(wanted.values())
 result={'status':'qualified-complete' if not holds else 'qualified-with-source-holds','ability':qualified['counts'],'guru':{'parents':146,'selectedPairs':150,'qualifiedPairs':guru_qualified,'desiredPairs':len(wanted)},'held':len(holds),'headsQueried':len(pending),'headsReused':len(urls)-len(pending),'unknownLicenceRetained':True,'clinicalSourceRowsModified':False,'mediaBodiesDownloaded':False}
 return desired,result,holds
