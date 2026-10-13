"""Refresh the approved feed from complete public-source evidence, never storage alone.

Private candidate/checkpoint files only. No source DB/care writes or engine calls.
"""
from __future__ import annotations
import argparse,concurrent.futures,csv,datetime as dt,hashlib,json,sqlite3,urllib.request,urllib.error,urllib.parse,subprocess
from pathlib import Path
from html.parser import HTMLParser
import manager as m
from public_media_snapshot import MediaHTML,MAX_BODY

def packed(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(x):return hashlib.sha256(packed(x).encode()).hexdigest()
def canonical(slug):return m.normal('https://pinnacleblooms.org/ask/'+slug)
def validated_snapshot(doc):
 if doc.get('complete') is not True or doc.get('stable') is not True:raise ValueError('Incomplete/unstable source cannot imply deletion')
 rows=doc['rows'];keys={(r['lang'],r['slug']) for r in rows}
 if len(rows)!=doc['eligibleTotal'] or len(keys)!=len(rows):raise ValueError('Incomplete or duplicate membership')
 for r in rows:
  if len(r['publisher_source_fingerprint'])!=64 or any(c not in '0123456789abcdef' for c in r['publisher_source_fingerprint']):raise ValueError('Missing actual source fingerprint')
 return {canonical(r['slug']):r for r in rows}

class PublicHTML(MediaHTML):
 def __init__(self,url):super().__init__(url);self.ignored=[];self.body=False;self.text=[]
 def handle_starttag(self,tag,attrs):
  super().handle_starttag(tag,attrs)
  if tag=='body':self.body=True
  if tag in ('script','style','template','noscript','header','footer','nav'):self.ignored.append(tag)
 def handle_endtag(self,tag):
  super().handle_endtag(tag)
  for i in range(len(self.ignored)-1,-1,-1):
   if self.ignored[i]==tag:del self.ignored[i:];break
  if tag=='body':self.body=False
 def handle_data(self,data):
  super().handle_data(data)
  if self.body and not self.ignored:self.text.append(data)
 def current(self,header=''):
  row=self.snapshot(header);row['reading_text_sha256']=hashlib.sha256(' '.join(' '.join(self.text).split()).encode()).hexdigest()
  row['content_sha256']=digest({k:row[k] for k in ('title','h1','description','canonical_normalized','robots','reading_text_sha256','media_references','video_objects')})
  return row

def public_resource(url,prior=None):
 if urllib.parse.urlsplit(url).hostname not in ('materials.pinnacleblooms.org','interventions.pinnacleblooms.org','www.pinnacleblooms.org'):raise ValueError('Unknown public resource host')
 headers={'User-Agent':'PinnaclePublisherRefresh/1.0'}
 if prior and prior.get('etag'):headers['If-None-Match']=prior['etag']
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=30) as r:
   data=r.read(MAX_BODY+1);status=r.status;final=r.url;kind=r.headers.get('Content-Type','');robots=r.headers.get('X-Robots-Tag','');etag=r.headers.get('ETag')
  if len(data)>MAX_BODY or not kind.lower().startswith('text/html'):raise ValueError('Bounded HTML source unavailable')
  parser=PublicHTML(url);parser.feed(data.decode('utf8','replace'));parser.close();row=parser.current(robots)
  row.update(status=status,final_url=final,body_sha256=hashlib.sha256(data).hexdigest(),etag=etag,observed_at=dt.datetime.now(dt.timezone.utc).isoformat(),conditional=False)
  row['publication_qualified']=status==200 and m.normal(final)==m.normal(url) and not row['canonical_conflict'] and not row['noindex']
  return row
 except urllib.error.HTTPError as e:
  if e.code==304 and prior:
   row=dict(prior);row.update(conditional=True,observed_at=dt.datetime.now(dt.timezone.utc).isoformat());return row
  return {'page_url':url,'status':e.code,'publication_qualified':False,'error':'public source HTTP '+str(e.code)}
 except (OSError,ValueError) as e:return {'page_url':url,'status':None,'publication_qualified':False,'error':str(e)}

def apply_ask(db,snapshot,baseline,metadata_reader=None):
 current=validated_snapshot(snapshot);before={m.normal(r['canonical']):r for r in baseline if r['public_state']=='published-public' and r['indexable'].lower()=='true'}
 changes=[];exceptions=[];owned={}
 for record in db.execute('SELECT * FROM pages'):
  row=dict(record);meta=json.loads(row['metadata_json']);native=meta.get('native_source',{});url=row['url']
  if url not in before and native.get('source')!='public_ask_RPC':continue
  old=native.get('publisher_source_fingerprint') or before[url]['publisher_source_fingerprint'];owned[url]=(row,meta,old)
 for url,(row,meta,old) in owned.items():
  source=current.get(url);native=meta.setdefault('native_source',{});native.update(source='public_ask_RPC',publisher_source_fingerprint=old)
  if not source:
   if row['decision']=='INCLUDE':
    native['prior_include']=meta['eligibility'];meta['eligibility']={'decision':'HOLD','source':'two matching complete public publisher snapshots','reason':'absent_or_no_longer_indexable','evidence_date':snapshot['completedAt'][:10]};row['decision']='HOLD';row['llm_approved']=0;changes.append({'url':url,'kind':'source_withdrawal'})
  elif source['publisher_source_fingerprint']!=old or row['decision']=='HOLD' and native.get('prior_include'):
   if metadata_reader is None:exceptions.append({'url':url,'condition':'Fresh serving metadata/renderer proof required before promotion','owner':'website publisher'});continue
   actual=metadata_reader(url,source)
   if not actual.get('publication_qualified'):exceptions.append({'url':url,'condition':actual.get('error','Current canonical/indexability/serving proof failed'),'owner':'website publisher'});continue
   row['title']=actual['title'];row['description']=actual['description'];row['language']=source['lang'];row['canonical_url']=url
   if native.get('prior_include'):row['decision']='INCLUDE';meta['eligibility']=native.pop('prior_include')
   native.update(publisher_source_fingerprint=source['publisher_source_fingerprint'],serving_content_sha256=actual['content_sha256']);meta['eligibility']['evidence_date']=snapshot['completedAt'][:10]
   m.invalidate_approval(row,meta);changes.append({'url':url,'kind':'source_content_or_indexability_change'})
  row['metadata_json']=m.dump(meta);m.upsert(db,m.refresh_digest(row))
 for url in sorted(set(current)-set(owned)):exceptions.append({'url':url,'condition':'New public publisher identity lacks an approved feed/rights/parent association; held, not automatically included','owner':'source qualification owner'})
 return changes,exceptions

def video_values(v):return v.get('values',v)

def validate_resource_labels(release,records,feed):
 """Every approved resource navigation label must match its actual head title."""
 db=m.connect(feed)
 try:included={r[0] for r in db.execute("SELECT url FROM pages WHERE decision='INCLUDE'")}
 finally:db.close()
 expected={m.normal(r['page_url']):r['title'] for r in records if r.get('publication_qualified') and m.normal(r['page_url']) in included}
 seen=set();checked=0
 class Links(HTMLParser):
  def __init__(self):super().__init__(convert_charrefs=True);self.href=None;self.text=[];self.main=False
  def handle_starttag(self,tag,attrs):
   if tag=='main':self.main=True
   if tag=='a' and self.main:self.href=dict(attrs).get('href');self.text=[]
  def handle_data(self,data):
   if self.href:self.text.append(data)
  def handle_endtag(self,tag):
   nonlocal checked
   if tag=='main':self.main=False
   if tag!='a' or not self.href:return
   if urllib.parse.urlsplit(self.href).scheme not in ('http','https'):
    self.href=None;return
   url=m.normal(self.href)
   if url in expected:
    actual=''.join(self.text).strip()
    if actual!=expected[url].strip():raise ValueError('Resource label does not equal authoritative document head title: '+url)
    seen.add(url);checked+=1
   self.href=None
 release=Path(release);manifest=json.loads((release/'manifest.json').read_text())
 for f in manifest['files']:
  if f['kind']=='html':parser=Links();parser.feed((release/f['path']).read_text(encoding='utf8'));parser.close()
 if seen!=set(expected):raise ValueError('Generated resource navigation coverage differs from approved source: '+str(len(set(expected)-seen)))
 return {'authoritativeResourceTitles':len(expected),'distinctResourceLabelsMatched':len(seen),'renderedLabelOccurrencesMatched':checked,'mismatches':0,'comparison':'exact document-head title text by approved parent URL'}

def video_location(v):
 v=video_values(v);return v.get('content_loc') or v.get('player_loc')

def apply_resources(db,records,previous,aliases=None):
 changes=[];exceptions=[];current={}
 for url,data in records.items():
  row=db.execute('SELECT * FROM pages WHERE url=?',(m.normal(url),)).fetchone()
  if not row:exceptions.append({'url':url,'condition':'Not in the approved feed','owner':'source qualification owner'});continue
  row=dict(row);meta=json.loads(row['metadata_json']);old=previous.get(url,{});current[url]=data
  if not data.get('publication_qualified'):
   # Transient errors and missing coverage never become deletions.
   if data.get('noindex') or data.get('canonical_conflict'):
    meta['native_source_hold']={'condition':'current public robots/canonical withdrawal','observed':data.get('observed_at')};row['decision']='HOLD';row['llm_approved']=0;changes.append({'url':url,'kind':'source_indexability_withdrawal'})
   else:exceptions.append({'url':url,'condition':data.get('error','Current serving evidence incomplete; last-valid parent preserved'),'owner':'resource publisher'});continue
  else:
   # Only reviewed associations can survive/re-enter this feed. New references are explicit holds.
   alias={m.normal(k):m.normal(v) for k,v in (aliases or {}).get(url,{}).items()}
   mapped=lambda x:alias.get(m.normal(x),m.normal(x))
   refs={mapped(r['source_image_url'] if r['media_kind']=='image' else r['media_url']) for r in data['media_references'] if r['media_kind'] in ('image','video')}
   images=json.loads(row['images_json']);videos=json.loads(row['videos_json']);known={m.normal(i['loc']) for i in images}|{m.normal(video_location(v)) for v in videos}
   for obj in data.get('video_objects',[]):
    for key in ('contentUrl','embedUrl','thumbnailUrl'):
     value=obj.get(key);values=value if isinstance(value,list) else [value]
     for address in values:
      if isinstance(address,str) and address.startswith('https://'):refs.add(mapped(address))
   previous_refs={mapped(r['source_image_url'] if r['media_kind']=='image' else r['media_url']) for r in old.get('media_references',[]) if r['media_kind'] in ('image','video')}
   for obj in old.get('video_objects',[]):
    for key in ('contentUrl','embedUrl','thumbnailUrl'):
     value=obj.get(key);values=value if isinstance(value,list) else [value]
     for address in values:
      if isinstance(address,str) and address.startswith('https://'):previous_refs.add(mapped(address))
   new=refs-known-previous_refs
   for item in sorted(new):exceptions.append({'url':url,'media_url':item,'condition':'New/unmapped media reference needs existing R2/rights association; not promoted','owner':'resource publisher'})
   removed_images=[i for i in images if m.normal(i['loc']) not in refs];removed_videos=[v for v in videos if m.normal(video_location(v)) not in refs]
   # A fetched complete DOM can retire a previously approved reference from this parent.
   if removed_images or removed_videos:
    row['images_json']=m.dump([i for i in images if i not in removed_images]);row['videos_json']=m.dump([v for v in videos if v not in removed_videos]);changes.append({'url':url,'kind':'rendered_media_reference_removed','images':len(removed_images),'videos':len(removed_videos)})
   if old.get('body_sha256')!=data['body_sha256'] or old.get('content_sha256') and old['content_sha256']!=data['content_sha256']:
    row['title']=data['title'] or row['title'];row['description']=data['description'] or row['description'];m.invalidate_approval(row,meta)
    if row['title']!=db.execute('SELECT title FROM pages WHERE url=?',(url,)).fetchone()[0] or row['description']!=db.execute('SELECT description FROM pages WHERE url=?',(url,)).fetchone()[0]:changes.append({'url':url,'kind':'public_resource_metadata_change'})
   meta.setdefault('native_source',{}).update(source='public_resource_DOM',content_sha256=data['content_sha256'],body_sha256=data['body_sha256'],observed_at=data['observed_at'])
  row['metadata_json']=m.dump(meta);m.upsert(db,m.refresh_digest(row))
 return changes,exceptions,current

def refresh(feed,snapshot,baseline,resource_baseline,output,metadata_reader=None,aliases=None,reuse_resources=None):
 output=Path(output)
 if output.exists():raise ValueError('Use a new immutable source refresh checkpoint')
 output.mkdir(parents=True);candidate=output/'candidate.sqlite3';source=sqlite3.connect('file:'+str(Path(feed).resolve())+'?mode=ro',uri=True);target=m.connect(candidate)
 try:source.backup(target)
 finally:source.close()
 prior={r['page_url']:r for r in resource_baseline};urls=sorted(prior);resources={}
 raw=output/'resource-checkpoint.jsonl'
 if reuse_resources:
  saved=[json.loads(line) for line in Path(reuse_resources).read_text(encoding='utf8').splitlines() if line]
  resources={r['page_url']:r for r in saved}
  if set(resources)!=set(urls) or len(resources)!=len(saved):raise ValueError('Reusable resource snapshot incomplete or duplicate')
  raw.write_text(''.join(packed(resources[u])+'\n' for u in urls))
 else:
  with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool,raw.open('w',encoding='utf8') as checkpoint:
   for url,result in zip(urls,pool.map(lambda u:public_resource(u,prior[u] if prior[u].get('content_sha256') else None),urls)):
    resources[url]=result;checkpoint.write(packed(result)+'\n');checkpoint.flush()
    if len(resources)%100==0:print(packed({'resourceSnapshots':len(resources),'expected':len(urls)}),flush=True)
 try:
  target.execute('BEGIN IMMEDIATE');changes,exceptions=apply_ask(target,snapshot,baseline,metadata_reader);rchanges,rexceptions,current=apply_resources(target,resources,prior,aliases);changes+=rchanges;exceptions+=rexceptions
  target.execute('INSERT OR REPLACE INTO receipts VALUES(?,?,?)',('native-source-refresh','source_refresh',packed({'snapshot_sha256':snapshot['sourceSHA256'],'resource_source_pages':len(resources),'changes':changes,'exceptions':exceptions})));target.commit()
 finally:target.close()
 (output/'resource-snapshot.jsonl').write_text(''.join(packed(current.get(u,resources[u]))+'\n' for u in urls))
 result={'candidate_feed':str(candidate.resolve()),'source_snapshot_sha256':snapshot['sourceSHA256'],'ask_eligible_checked':snapshot['eligibleTotal'],'resources_checked':len(resources),'changes':changes,'exceptions':exceptions,'source_rows_modified':False,'private_objects_inventoried':False,'observation_is_not_lastmod':True}
 (output/'source-delta.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');return result

def main():
 if '--validate-resource-labels' in __import__('sys').argv:
  p=argparse.ArgumentParser();p.add_argument('--validate-resource-labels',type=Path,required=True);p.add_argument('--resource-source',type=Path,required=True);p.add_argument('--feed',type=Path,required=True);p.add_argument('--proof',type=Path,required=True);a=p.parse_args();records=[json.loads(l) for l in a.resource_source.read_text(encoding='utf8').splitlines() if l];proof=validate_resource_labels(a.validate_resource_labels,records,a.feed);a.proof.write_text(json.dumps(proof,indent=2)+'\n');print(packed(proof));return
 if '--r2-source' in __import__('sys').argv:
  p=argparse.ArgumentParser();p.add_argument('--r2-source',required=True,type=Path);p.add_argument('--delta',required=True,type=Path);a=p.parse_args();r2=json.loads(a.r2_source.read_text());delta=json.loads(a.delta.read_text());db=m.connect(delta['candidate_feed'])
  try:
   db.execute('BEGIN IMMEDIATE')
   for change in r2['changes']:
    for use in change['parents']:
     found=db.execute('SELECT * FROM pages WHERE url=?',(m.normal(use['parent']),)).fetchone()
     if not found:continue
     row=dict(found);meta=json.loads(row['metadata_json']);meta.setdefault('native_asset_observations',{})[change['bucket']+'/'+change['key']]={'etag':change['etag'],'size':change['size'],'present':change['present'],'observed_at':change['observed_at'],'object_time_is_not_page_lastmod':True}
     selected=m.normal(use['selected'])
     if not change['present'] or use['kind']=='video':
      if use['kind']=='image':row['images_json']=m.dump([i for i in json.loads(row['images_json']) if m.normal(i['loc'])!=selected])
      else:
       row['videos_json']=m.dump([v for v in json.loads(row['videos_json']) if m.normal(video_location(v))!=selected]);delta['exceptions'].append({'url':row['url'],'condition':'Changed/deleted video storage requires current title, description and thumbnail qualification; stale optional facts were not retained','owner':'resource publisher'})
     row['metadata_json']=m.dump(meta);m.upsert(db,m.refresh_digest(row));delta['changes'].append({'url':row['url'],'kind':'storage_reference_deleted' if not change['present'] else 'referenced_storage_metadata_changed'})
   delta['exceptions']+=r2['holds'];db.commit();a.delta.write_text(json.dumps(delta,ensure_ascii=False,indent=2)+'\n')
  except BaseException:db.rollback();raise
  finally:db.close()
  print(packed({'referenced_storage_changes':len(r2['changes']),'held_storage_signals':len(r2['holds']),'source_records_modified':False}));return
 if '--generate-feed' in __import__('sys').argv:
  a=argparse.ArgumentParser();a.add_argument('--generate-feed',required=True,type=Path);a.add_argument('--policy',required=True,type=Path);a.add_argument('--generated',required=True,type=Path);v=a.parse_args();db=m.connect(v.generate_feed)
  try:r=m.build_release(db,v.generated,json.loads(v.policy.read_text()));print(packed({'release':r['release_id'],'pages':r['page_urls'],'files':len(r['files'])}))
  finally:db.close()
  return
 if '--package-release' in __import__('sys').argv:
  import zipfile
  a=argparse.ArgumentParser();a.add_argument('--package-release',required=True,type=Path);a.add_argument('--archive',required=True,type=Path);v=a.parse_args();m.validate_release(v.package_release);manifest=json.loads((v.package_release/'manifest.json').read_text());v.archive.parent.mkdir(parents=True,exist_ok=True)
  if v.archive.exists():raise ValueError('Archive already exists; reconcile the checkpoint')
  with zipfile.ZipFile(v.archive,'w',zipfile.ZIP_DEFLATED) as z:
   for name in ['manifest.json']+[f['path'] for f in manifest['files']]:z.write(v.package_release/name,name)
  print(packed({'archive_sha256':m.digest_file(v.archive),'release':manifest['release_id']}));return
 p=argparse.ArgumentParser();p.add_argument('--feed',required=True,type=Path);p.add_argument('--snapshot',required=True,type=Path);p.add_argument('--baseline-publisher',required=True,type=Path);p.add_argument('--resource-baseline',required=True,type=Path);p.add_argument('--output',required=True,type=Path);p.add_argument('--node',required=True);p.add_argument('--bindings',required=True);p.add_argument('--aliases',type=Path);p.add_argument('--reuse-resources',type=Path);a=p.parse_args()
 snapshot=json.loads(a.snapshot.read_text());baseline=list(csv.DictReader(a.baseline_publisher.open(encoding='utf-8-sig')));resources=[json.loads(line) for line in a.resource_baseline.read_text(encoding='utf8').splitlines() if line]
 def reader(url,source):
  target=a.output/'answer-readbacks'/('source-'+hashlib.sha256(url.encode()).hexdigest()+'.json');target.parent.mkdir(parents=True,exist_ok=True)
  r=subprocess.run([a.node,'scripts/current-public-answer.mjs','--url',url,'--bindings',a.bindings,'--output',str(target)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf8')
  if r.returncode:return {'publication_qualified':False,'error':'Current maintained-reader comparison failed; see private source exception'}
  return json.loads(target.read_text())
 result=refresh(a.feed,snapshot,baseline,resources,a.output,reader,json.loads(a.aliases.read_text()) if a.aliases else None,a.reuse_resources);print(packed({k:result[k] for k in ('candidate_feed','ask_eligible_checked','resources_checked','source_rows_modified','private_objects_inventoried')}|{'changes':len(result['changes']),'exceptions':len(result['exceptions'])}))

if __name__=='__main__':main()
