"""Current maintained image selection, source ownership and metadata-only delivery.

Runs inside the existing source transaction; accepted state travels with its feed.
No patient data, media bodies, new credentials or source database mutations.
"""
import concurrent.futures,datetime as dt,hashlib,importlib.util,json,tempfile,urllib.request,urllib.error,zipfile
from pathlib import Path
from types import SimpleNamespace
import manager as m

HERE=Path(__file__).resolve().parent
CATALOGUE='https://materials.pinnacleblooms.org/'
KNOWLEDGE='maintained_knowledge_images_v1'
CAT_SOURCE='materials_catalogue_pb_card_v1'
SOURCES={KNOWLEDGE,CAT_SOURCE}
PERMISSION=HERE/'managed-media-permission.json'
BOOTSTRAP=HERE/'knowledge-media/bootstrap/qualified-media-bootstrap-20261015.zip'
def packed(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def sha(b):return hashlib.sha256(b).hexdigest()
def header_values(headers,name):
 if hasattr(headers,'get_all'):return headers.get_all(name,[])
 return [v for k,v in headers.items() if k.lower()==name.lower()]
def load_module(name,file):
 spec=importlib.util.spec_from_file_location(name,file);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);return mod
def stamp(v):return dt.datetime.fromisoformat(v.replace('Z','+00:00')).astimezone(dt.timezone.utc)
def fresh(v,now):
 try:return -300<=(now-stamp(v)).total_seconds()<=86400
 except (ValueError,TypeError,AttributeError):return False
def read_state(db):
 found=db.execute("SELECT payload FROM receipts WHERE id='managed-media-sources-v1'").fetchone()
 return json.loads(found[0]) if found else {'heads':{}}
def protected_images(meta):
 return {url for url,proof in meta.get('managed_image_ownership',{}).items() if set(proof.get('owners',[]))&SOURCES}
def preserve_transient(db,desired,observed,heads):
 """An uncertain transport is not evidence that an existing use disappeared."""
 retained=0
 for source,pairs in observed.items():
  selected={(r['page_url'],r['image_url']) for r in desired[source]}
  for parent,image in pairs:
   if (parent,image) in selected:continue
   head=heads[image]
   status=head.get('status')
   if definitively_disqualified(head) or not (status is None or status==429 or isinstance(status,int) and 500<=status<=599):continue
   row=db.execute('SELECT metadata_json FROM pages WHERE url=?',(m.normal(parent),)).fetchone()
   owned=json.loads(row[0]).get('managed_image_ownership',{}).get(image,{}) if row else {}
   if source in owned.get('owners',[]):desired[source].append({'page_url':parent,'image_url':image,'source_sha256':owned['source_sha256'][source]});retained+=1
 return retained
def robots_restricted(row):
 values=[row.get('x_robots') or ''];values += [v or '' for k,v in row.items() if k.lower()=='x-robots-tag']
 for key in ('headers','response_headers'):values += [v or '' for k,v in (row.get(key) or {}).items() if k.lower()=='x-robots-tag']
 return bool({'noindex','none','noimageindex'}&set(__import__('re').findall(r'[a-z_]+',' '.join(values).lower())))
def head_ok(row):
 return row.get('method')=='HEAD' and row.get('status')==200 and row.get('direct_image_delivery_verified') is True and row.get('content_type','').lower().startswith('image/') and not row.get('location') and row.get('final_url',row.get('url'))==row.get('url') and not robots_restricted(row)
def definitively_disqualified(row):
 status=row.get('status')
 return robots_restricted(row) or isinstance(status,int) and 200<=status<=499 and status!=429 and not head_ok(row)
def resolve_qualified_exceptions(db,exceptions):
 """Clear only an exact newly admitted image's earlier DOM qualification hold."""
 heads={m.normal(u):h for u,h in read_state(db).get('heads',{}).items()};remaining=[];resolved=0
 condition='New/unmapped media reference needs existing R2/rights association; not promoted'
 for item in exceptions:
  url=item.get('url');image=item.get('media_url');admitted=False
  if item.get('condition')==condition and url and image and head_ok(heads.get(m.normal(image),{})):
   parent=db.execute('SELECT decision,images_json,metadata_json FROM pages WHERE url=?',(m.normal(url),)).fetchone()
   if parent and parent['decision']=='INCLUDE':
    owned=json.loads(parent['metadata_json']).get('managed_image_ownership',{});admitted=any(m.normal(u)==m.normal(image) and set(p.get('owners',[]))&SOURCES for u,p in owned.items()) and any(m.normal(i['loc'])==m.normal(image) for i in json.loads(parent['images_json']))
  if admitted:resolved+=1
  else:remaining.append(item)
 return remaining,resolved
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
def probe(url,now):
 result={'url':url,'method':'HEAD','checked_at':now.isoformat(),'credentials_sent':False,'redirects_followed':False,'media_bodies_downloaded':False,'direct_image_delivery_verified':False}
 try:
  req=urllib.request.Request(url,method='HEAD',headers={'User-Agent':'PinnaclePublisherRefresh/1.0'})
  with urllib.request.build_opener(NoRedirect()).open(req,timeout=25) as r:
   result.update(status=r.status,content_type=r.headers.get('Content-Type',''),content_length=r.headers.get('Content-Length'),etag=r.headers.get('ETag'),x_robots=', '.join(header_values(r.headers,'X-Robots-Tag')))
  result['direct_image_delivery_verified']=result['status']==200 and result['content_type'].lower().startswith('image/')
 except urllib.error.HTTPError as e:result.update(status=e.code,x_robots=', '.join(header_values(e.headers,'X-Robots-Tag')),content_type=e.headers.get('Content-Type',''));e.close()
 except (OSError,ValueError):result.update(status=None,error='delivery-unavailable')
 return result
def bootstrap_heads(now):
 with zipfile.ZipFile(BOOTSTRAP) as z:seed=json.loads(z.read('qualified-media-bootstrap.json'))
 result={}
 for r in seed['knowledge']['records']:
  d=r['delivery'];result[r['image_url']]={**d,'checked_at':seed['created_at'],'direct_image_delivery_verified':d.get('passed') is True}
 for r in seed['catalogue']['records']:result[r['image_url']]={'url':r['image_url'],**r['delivery']}
 return {u:r for u,r in result.items() if fresh(r.get('checked_at'),now)}
def reconcile(db,desired,blocked=None):
 """Complete source sets withdraw only their own pairs; prior other uses survive."""
 blocked=blocked or set();changes=[];counts={'added':0,'removed':0,'retained':0}
 existing={r['url']:dict(r) for r in db.execute('SELECT * FROM pages')}
 by_parent={}
 for source,rows in desired.items():
  if source not in SOURCES:raise ValueError('Unknown managed source')
  for r in rows:
   url=m.normal(r['page_url']);image=r['image_url'];parent=existing.get(url)
   if not parent or parent['decision']!='INCLUDE' or m.normal(parent['canonical_url'])!=url:raise ValueError('Approved exact parent required')
   if not image.startswith('https://') or not r.get('source_sha256'):raise ValueError('Exact media/provenance required')
   by_parent.setdefault(url,{}).setdefault(image,{})[source]=r['source_sha256']
 for url,row in existing.items():
  meta=json.loads(row['metadata_json']);prior=meta.get('managed_image_ownership',{});wanted=by_parent.get(url,{})
  if not prior and not wanted and url not in blocked and not any(i['loc'] in blocked for i in json.loads(row['images_json'])):continue
  images={i['loc']:i for i in json.loads(row['images_json'])};old_images=dict(images);next_owned={}
  for image in sorted(set(prior)|set(wanted)):
   old=prior.get(image,{});other=set(old.get('owners',[]))-set(desired);owners=other|set(wanted.get(image,{}));retain=old.get('retain_unmanaged',image in images and not old)
   if owners:
    next_owned[image]={'owners':sorted(owners),'retain_unmanaged':retain,'source_sha256':{**{s:h for s,h in old.get('source_sha256',{}).items() if s in other},**wanted.get(image,{})}}
   if image in blocked or url in blocked:images.pop(image,None)
   elif owners:images.setdefault(image,{'loc':image})
   elif not retain:images.pop(image,None)
  images={u:i for u,i in images.items() if u not in blocked and url not in blocked}
  if len(images)>1000:raise ValueError('Per-parent 1000-image limit exceeded; no truncation')
  if images!=old_images:
   added=len(set(images)-set(old_images));removed=len(set(old_images)-set(images));counts['added']+=added;counts['removed']+=removed
   changes.append({'url':url,'kind':'managed_source_image_reconciliation','images_added':added,'images_removed':removed})
  counts['retained']+=len(images);meta['managed_image_ownership']=next_owned;row['images_json']=m.dump([images[u] for u in sorted(images)]);row['metadata_json']=m.dump(meta);m.upsert(db,m.refresh_digest(row))
 return changes,counts
def refresh(db,repo,approved_release,resources,output,now=None):
 now=now or dt.datetime.now(dt.timezone.utc);output=Path(output);output.mkdir(parents=True,exist_ok=True)
 permit=json.loads(PERMISSION.read_bytes())
 if permit.get('scope')!='current_public_sitemap_references' or not permit.get('direct_user_request'):raise ValueError('Recorded reference permission required')
 state=read_state(db);cache={**bootstrap_heads(now),**state.get('heads',{})};desired={KNOWLEDGE:[],CAT_SOURCE:[]};held=[]
 knowledge=load_module('knowledge_media_export',HERE/'knowledge-media/export_knowledge_media.py');catalogue=load_module('catalogue_media_export',HERE/'materials-catalogue/catalogue_source_adapter.py')
 # Export checks current maintained readers and exact approved parents. Temporary
 # data is outside the source tree, as the established exporter requires.
 with tempfile.TemporaryDirectory(prefix='pinnacle-managed-media-') as td:
  kd=Path(td)/'knowledge';knowledge.export(Path(repo),Path(approved_release),kd)
  rows=[json.loads(l) for l in (kd/'source-backed-relationships.jsonl').read_text(encoding='utf8').splitlines() if l]
  root=resources.get(CATALOGUE);capture=(root or {}).get('catalogue_capture')
  if not capture:raise ValueError('Complete current catalogue capture unavailable; accepted media preserved')
  body=bytes.fromhex(capture['body_hex']);parser=catalogue.CatalogueHTML();parser.feed(body.decode('utf8'));parser.close()
  catalogue_urls={image['source_url'] for card in parser.cards if card['renderer_scope_recognized'] for image in card['images'] if image['is_pb_image'] and catalogue.IMAGE.fullmatch(image['source_url'])}
  urls=sorted({r['image_url'] for r in rows}|catalogue_urls);pending=[u for u in urls if not fresh(cache.get(u,{}).get('checked_at'),now)]
  with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
   for url,result in zip(pending,pool.map(lambda u:probe(u,now),pending)):cache[url]=result
  for r in rows:
   if head_ok(cache[r['image_url']]):desired[KNOWLEDGE].append({'page_url':r['canonical_parent'],'image_url':r['image_url'],'source_sha256':r['source']['sha256']})
   else:held.append({'source':KNOWLEDGE,'page_url':r['canonical_parent'],'media_url':r['image_url'],'condition':'current-image-delivery-not-qualified','status':cache[r['image_url']].get('status')})
  html=Path(td)/'catalogue.html';html.write_bytes(body);proof=Path(td)/'page-proof.json';proof.write_text(packed(capture['proof']),encoding='utf8')
  heads=Path(td)/'heads.jsonl';heads.write_text(''.join(packed(cache[u])+'\n' for u in sorted(catalogue_urls)),encoding='utf8')
  hr=Path(td)/'heads-receipt.json';oldest=min(cache[u]['checked_at'] for u in catalogue_urls);hr.write_text(packed({'checked_at':oldest,'credentials_sent':False,'redirects_followed':False,'media_bodies_downloaded':False}),encoding='utf8')
  if not any(root.get(k) for k in ('noindex','noimageindex','canonical_conflict')):
   co=Path(td)/'catalogue';catalogue.export(SimpleNamespace(output=co,html=html,page_proof=proof,heads=heads,heads_receipt=hr,permit=PERMISSION,approved_release=Path(approved_release),previous_candidates=None,as_of=now.isoformat(),max_age_hours=24))
   for r in [json.loads(l) for l in (co/'catalogue-use-qualified-candidates.jsonl').read_text(encoding='utf8').splitlines() if l]:desired[CAT_SOURCE].append({'page_url':CATALOGUE,'image_url':r['media_url'],'source_sha256':capture['proof']['body_sha256']})
   held += [json.loads(l) for l in (co/'held-relationships.jsonl').read_text(encoding='utf8').splitlines() if l]
  transient_retained=preserve_transient(db,desired,{KNOWLEDGE:{(r['canonical_parent'],r['image_url']) for r in rows},CAT_SOURCE:{(CATALOGUE,u) for u in catalogue_urls}},cache)
  blocked={u for u,r in resources.items() if r.get('noimageindex') or r.get('noindex') or r.get('canonical_conflict')}
  blocked|={u for u in urls if definitively_disqualified(cache[u])}
  eligible={r[0] for r in db.execute("SELECT url FROM pages WHERE decision='INCLUDE'")}
  desired={s:[r for r in items if m.normal(r['page_url']) in eligible] for s,items in desired.items()}
  changes,counts=reconcile(db,desired,blocked)
  result={'schema':1,'sourceCounts':{s:len(r) for s,r in desired.items()},'headsQueried':len(pending),'headsReused':len(urls)-len(pending),'heldRelationships':len(held),'transientExistingPairsRetained':transient_retained,'counts':counts,'source_inputs_sha256':sha((kd/'source-inputs.json').read_bytes()),'permission_sha256':sha(PERMISSION.read_bytes()),'source_rows_modified':False,'media_bodies_downloaded':False}
  db.execute('INSERT OR REPLACE INTO receipts VALUES(?,?,?)',('managed-media-sources-v1','managed-media-sources',packed({'heads':{u:cache[u] for u in urls},'proof':result})))
  (output/'managed-media-proof.json').write_text(packed(result)+'\n',encoding='utf8');(output/'managed-media-holds.jsonl').write_text(''.join(packed(r)+'\n' for r in held),encoding='utf8')
 return changes,result
