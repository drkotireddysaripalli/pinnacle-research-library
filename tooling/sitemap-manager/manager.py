"""Repeatable website URL catalogue and sitemap release builder (Python 3.11+).

Public audit exports are inputs, never credentials. Builds are offline. Output
promotion and network notifications are explicit separate commands.
"""
from __future__ import annotations
import argparse, collections, csv, datetime as dt, hashlib, html, json, os
from pathlib import Path
import math, re, shutil, sqlite3, tempfile, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from discovery_policy import exclusion_reason

SM='http://www.sitemaps.org/schemas/sitemap/0.9'
IM='http://www.google.com/schemas/sitemap-image/1.1'
VI='http://www.google.com/schemas/sitemap-video/1.1'
XH='http://www.w3.org/1999/xhtml'
NW='http://www.google.com/schemas/sitemap-news/0.9'
ET.register_namespace('',SM);ET.register_namespace('image',IM);ET.register_namespace('video',VI);ET.register_namespace('xhtml',XH);ET.register_namespace('news',NW)
MAX_URLS=50000;MAX_BYTES=50*1024*1024
VIDEO_FIELDS=('thumbnail_loc','title','description','content_loc','player_loc','duration','expiration_date','rating','view_count','publication_date','tag','family_friendly','restriction','requires_subscription','uploader','platform','live')
UTC=dt.timezone.utc
def now():return dt.datetime.now(UTC).isoformat(timespec='seconds')
def dump(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def sha(x):return hashlib.sha256(x.encode() if isinstance(x,str) else x).hexdigest()
def normal(url):
 # CSV/JSON addresses and ElementTree text are already decoded at their boundary.
 p=urllib.parse.urlsplit((url or '').strip())
 if p.scheme not in ('http','https') or not p.hostname or p.username or p.password:raise ValueError('Invalid or credential-bearing URL')
 if p.port not in (None,443 if p.scheme=='https' else 80):raise ValueError('Unexpected URL port')
 if any(ord(c)<32 for c in url) or '\\' in url:raise ValueError('Unsafe URL characters')
 return urllib.parse.urlunsplit((p.scheme,p.hostname.lower(),urllib.parse.quote(p.path or '/',safe="/:@-._~!$&'()*+,;=%"),urllib.parse.quote(p.query,safe="/:@-._~!$&'()*+,;=%?"),''))
def family_name(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-') or 'other'
def valid_date(s):
 if not isinstance(s,str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?',s):return False
 try:
  if len(s)==10:dt.date.fromisoformat(s)
  else:dt.datetime.fromisoformat(s.replace('Z','+00:00'))
  return True
 except ValueError:return False
def connect(p):
 Path(p).parent.mkdir(parents=True,exist_ok=True)
 db=sqlite3.connect(p);db.row_factory=sqlite3.Row
 db.executescript('''CREATE TABLE IF NOT EXISTS pages (
 url_hash TEXT PRIMARY KEY,url TEXT NOT NULL UNIQUE,host TEXT NOT NULL,
 module_type TEXT NOT NULL,decision TEXT NOT NULL,title TEXT,description TEXT,
 keywords_json TEXT,canonical_url TEXT,language TEXT,content_modified_at TEXT,
 priority_hint REAL,change_frequency_hint TEXT,relevance REAL,og_image TEXT,
 images_json TEXT NOT NULL DEFAULT '[]',videos_json TEXT NOT NULL DEFAULT '[]',
 links_json TEXT NOT NULL DEFAULT '[]',llm_text TEXT,llm_approved INTEGER NOT NULL DEFAULT 0,
 metadata_json TEXT NOT NULL,row_sha256 TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS pages_host_decision ON pages(host,decision);
 CREATE TABLE IF NOT EXISTS receipts (id TEXT PRIMARY KEY,kind TEXT NOT NULL,payload TEXT NOT NULL);
 ''');return db
def upsert(db,row):
 columns=list(row);sql='INSERT INTO pages ('+','.join(columns)+') VALUES ('+','.join('?' for _ in columns)+') ON CONFLICT(url_hash) DO UPDATE SET '+','.join(c+'=excluded.'+c for c in columns if c!='url_hash')
 db.execute(sql,[row[k] for k in columns])
def refresh_digest(row):
 row['row_sha256']=sha(dump({k:v for k,v in row.items() if k!='row_sha256'}));return row
def reference_text(row):
 label='Canonical source' if row['decision']=='INCLUDE' else 'URL record'
 return '# '+(row['title'] or row['url'])+'\n\n'+label+': '+row['url']+'\n\n'+(row['description'] or '')+'\n'

def approval_hash(row):
 return sha(dump({k:row.get(k) for k in ('url','canonical_url','language','title','description','llm_text')}))

def invalidate_approval(row,metadata):
 review=metadata.get('curation',{})
 if row['llm_approved'] and review.get('approved_sha256')!=approval_hash(row):
  row['llm_approved']=0;review['approval_invalidated']='Public reference or source metadata changed'

def digest_file(path):
 with Path(path).open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()

def import_register(db,register,snapshot=False,commit=True):
 count=collections.Counter()
 db.execute('CREATE TEMP TABLE IF NOT EXISTS imported_urls (url_hash TEXT PRIMARY KEY)');db.execute('DELETE FROM imported_urls')
 with Path(register).open(encoding='utf-8') as f:
  for line in f:
   x=json.loads(line);url=normal(x['url']);decision=x['decision']
   if decision not in ('INCLUDE','HOLD','EXCLUDE'):raise ValueError('Unknown eligibility decision')
   row=dict(url_hash=sha(url),url=url,host=urllib.parse.urlsplit(url).hostname,module_type=family_name(x['family']),decision=decision,title=None,description=None,keywords_json='[]',canonical_url=url if decision=='INCLUDE' else None,language=None,content_modified_at=None,priority_hint=None,change_frequency_hint=None,relevance=None,og_image=None,images_json='[]',videos_json='[]',links_json='[]',llm_text=None,llm_approved=0,metadata_json=dump({'eligibility':x,'fields':{},'media_provenance':[]}),row_sha256='')
   # A repeated baseline import does not overwrite later metadata or curation.
   prior=db.execute('SELECT * FROM pages WHERE url_hash=?',(row['url_hash'],)).fetchone()
   if prior:
    old=dict(prior);m=json.loads(old['metadata_json']);m['eligibility']=x;m.pop('snapshot_tombstone',None)
    if old['decision']!=decision:old['llm_approved']=0
    old.update(url=url,host=row['host'],module_type=row['module_type'],decision=decision,metadata_json=dump(m));row=old
   if not row['llm_text']:row['llm_text']=reference_text(row)
   db.execute('INSERT INTO imported_urls VALUES (?)',(row['url_hash'],))
   upsert(db,refresh_digest(row));count[decision]+=1
 if snapshot:
  # Snapshot omissions are retained as explicit tombstones, never silently removed.
  register_digest=digest_file(register)
  for prior in db.execute('SELECT * FROM pages WHERE url_hash NOT IN (SELECT url_hash FROM imported_urls)').fetchall():
   row=dict(prior);metadata=json.loads(row['metadata_json']);metadata['snapshot_tombstone']={'register_sha256':register_digest,'reason':'absent_from_authoritative_register_snapshot'}
   row.update(decision='HOLD',llm_approved=0,metadata_json=dump(metadata));upsert(db,refresh_digest(row))
 if commit:db.commit()
 return dict(count)

def enrich(db,path,source,source_date=None,commit=True):
 changed=0;source_digest=digest_file(path)
 with Path(path).open(encoding='utf-8-sig',newline='') as f:
  reader=csv.DictReader(f)
  for item in reader:
   raw=item.get('Address') if source=='screaming_frog' else item.get('URL')
   try:url=normal(raw)
   except (ValueError,TypeError):continue
   found=db.execute('SELECT * FROM pages WHERE url_hash=?',(sha(url),)).fetchone()
   if not found:continue
   r=dict(found);m=json.loads(r['metadata_json']);fields=m.setdefault('fields',{})
   mapping={'title':'Title 1','description':'Meta Description 1','keywords':'Meta Keywords 1','og_image':'OG image 1','language':'HTML language 1','inlinks':'Unique Inlinks'} if source=='screaming_frog' else {'title':'Title','description':'Meta description','inlinks':'No. of href inlinks'}
   for key,col in mapping.items():
    value=(item.get(col) or '').strip()
    if not value:continue
    evidence_date=next((e.get('date') for e in m['eligibility'].get('evidence',[]) if e.get('source')==source),None)
    fields[key]={'value':value,'source':source,'input_sha256':source_digest,'observed_on':item.get('Crawl Timestamp') or source_date or evidence_date,'observation_is_not_content_lastmod':True}
    if key=='keywords':r['keywords_json']=dump([v.strip() for v in value.split(',') if v.strip()])
    elif key=='inlinks':m['known_inlink_count']=value
    else:r[key]=value
   if not m.get('curation',{}).get('custom_llm_text'):r['llm_text']=reference_text(r)
   invalidate_approval(r,m);r['metadata_json']=dump(m);upsert(db,refresh_digest(r));changed+=1
 if commit:db.commit()
 return changed

def media_import(db,census_path,commit=True):
 p=Path(census_path);c=json.loads(p.read_text());images=collections.defaultdict(dict);videos=collections.defaultdict(dict);observed=set();source_docs=set()
 for d in c['documents']:
  if d.get('kind')!='urlset':continue
  digest=d.get('sha256','')
  if not re.fullmatch('[0-9a-f]{64}',digest):raise ValueError('Invalid media source hash')
  source=(p.parent/(digest+'.source')).resolve()
  if not source.is_relative_to(p.parent.resolve()) or digest_file(source)!=digest:raise ValueError('Media source hash or path mismatch')
  source_url=normal(d['url']);observed_at=d.get('fetchedAtUTC')
  if d.get('status')!=200 or not valid_date(observed_at):raise ValueError('Unverified public media source')
  source_docs.add(source_url);blob=source.read_bytes()
  if b'<!DOCTYPE' in blob or b'<!ENTITY' in blob:raise ValueError('Unsafe source XML')
  root=ET.fromstring(blob)
  if root.tag!='{'+SM+'}urlset':raise ValueError('Unexpected media source XML root')
  for u in root:
   loc=u.find('{'+SM+'}loc')
   if loc is None:continue
   try:url=normal(loc.text)
   except ValueError:continue
   observed.add(url)
   provenance={'publication_basis':'existing_public_sitemap','source_sha256':digest,'source_url':source_url,'observed_at':observed_at}
   for image in u.findall('{'+IM+'}image'):
    v=image.find('{'+IM+'}loc')
    if v is not None and v.text:
     try:asset=normal(v.text)
     except ValueError:continue
     images[url][asset]={'loc':asset,**provenance}
   for video in u.findall('{'+VI+'}video'):
    values={}
    for v in video:
     name=v.tag.split('}')[-1]
     if name=='tag':values.setdefault('tag',[]).append((v.text or '').strip())
     else:values[name]={'text':(v.text or '').strip(),'attributes':dict(v.attrib)} if v.attrib else (v.text or '').strip()
    identity=values.get('content_loc') or values.get('player_loc')
    if isinstance(identity,dict):identity=identity['text']
    if identity:videos[url][str(identity)]={'values':values,**provenance}
 # This is a declared snapshot of these successfully fetched source documents.
 # Missing/empty entries clear this source's former media; unrelated curated
 # media remains. Failed source documents are outside the replacement scope.
 media_parents={url for url,value in images.items() if value}|{url for url,value in videos.items() if value};touched=set(observed)
 for old in db.execute("SELECT url,images_json,videos_json FROM pages WHERE images_json!='[]' OR videos_json!='[]'"):
  if any(v.get('source_url') in source_docs for key in ('images_json','videos_json') for v in json.loads(old[key])):touched.add(old['url'])
 for url in touched:
  old=db.execute('SELECT * FROM pages WHERE url_hash=?',(sha(url),)).fetchone()
  if not old:continue
  row=dict(old)
  for key,new in (('images_json',list(images[url].values())),('videos_json',list(videos[url].values()))):
   keep=[v for v in json.loads(row[key]) if v.get('source_url') not in source_docs and not (url in observed and v.get('publication_basis')=='existing_public_sitemap' and not v.get('source_url'))]
   def identity(v):
    if key=='images_json':return normal(v['loc'])
    value=v['values'].get('content_loc') or v['values'].get('player_loc')
    return normal(value.get('text') if isinstance(value,dict) else value)
   row[key]=dump(list({identity(v):v for v in keep+new}.values()))
  upsert(db,refresh_digest(row))
 if commit:db.commit()
 return {'media_pages':len(media_parents),'media_reconciled_pages':len(touched),'media_source_documents':len(source_docs)}

def policy_load(db,path,commit=True):
 policy=json.loads(Path(path).read_text())
 for entry in policy.get('pages',[]):
  url=normal(entry['url']);old=db.execute('SELECT * FROM pages WHERE url_hash=?',(sha(url),)).fetchone()
  if not old:raise ValueError('Curation URL is absent from catalogue: '+url)
  row=dict(old)
  if row['decision']!='INCLUDE' and entry.get('llm_approved'):raise ValueError('Held/excluded content cannot be curated for public LLM output')
  for key in ('content_modified_at','language','llm_approved','llm_text','priority_hint','change_frequency_hint','relevance','links_json'):
   if key in entry:row[key]=dump(entry[key]) if key=='links_json' else entry[key]
  if row['content_modified_at'] and not valid_date(row['content_modified_at']):raise ValueError('Invalid verified content date')
  if row['content_modified_at'] and (not policy.get('source') or not policy.get('reviewed_by') or not valid_date(policy.get('reviewed_at'))):raise ValueError('Content date requires publishing evidence and review')
  if row['priority_hint'] is not None and not 0<=row['priority_hint']<=1:raise ValueError('Invalid internal priority')
  if row['change_frequency_hint'] not in (None,'always','hourly','daily','weekly','monthly','yearly','never'):raise ValueError('Invalid internal frequency')
  if 'llm_approved' not in entry:row['llm_approved']=0
  if row['llm_approved'] and (not policy.get('source') or not policy.get('reviewed_by') or not valid_date(policy.get('reviewed_at')) or not row['llm_text']):raise ValueError('LLM approval needs source, reviewer, review date and text')
  if row['llm_approved'] and entry.get('reviewed_sha256')!=approval_hash(row):raise ValueError('Curation approval does not match the reviewed reference/source hash')
  m=json.loads(row['metadata_json']);m['curation']={'source':policy.get('source'),'reviewed_by':policy.get('reviewed_by'),'reviewed_at':policy.get('reviewed_at'),'custom_llm_text':'llm_text' in entry,'approved_sha256':approval_hash(row) if row['llm_approved'] else None}
  if 'alternates' in entry:m['alternates']=entry['alternates']
  row['metadata_json']=dump(m)
  upsert(db,refresh_digest(row))
 if commit:db.commit()
 return policy

def tag(parent,ns,key,value):return ET.SubElement(parent,'{'+ns+'}'+key) if value is None else text_tag(parent,ns,key,value)
def text_tag(parent,ns,key,value):e=ET.SubElement(parent,'{'+ns+'}'+key);e.text=str(value);return e
def video_element(data,warnings,page):
 v=dict(data['values']);required=('thumbnail_loc','title','description')
 def text(key):value=v.get(key);return value.get('text','') if isinstance(value,dict) else value
 if any(not text(k) for k in required) or not(text('content_loc') or text('player_loc')):
  warnings.append({'url':page,'type':'video_missing_required'});return None
 title=text('title')
 if len(title)>100:
  short=title[:100];short=short.rsplit(' ',1)[0] if ' ' in short else short
  warnings.append({'url':page,'type':'video_title_shortened','original':title,'exported':short});v['title']=short
 if len(text('description'))>2048: warnings.append({'url':page,'type':'video_description_too_long'});return None
 for k in ('thumbnail_loc','content_loc','player_loc'):
  if text(k):v[k]=normal(text(k))
 if any(v.get(k)==page for k in ('content_loc','player_loc')):raise ValueError('Video/player URL must differ from page URL')
 if text('duration') and not 1<=int(text('duration'))<=28800:raise ValueError('Invalid video duration')
 for k in ('publication_date','expiration_date'):
  if text(k) and not valid_date(text(k)):raise ValueError('Invalid video date')
 for k in ('family_friendly','requires_subscription','live'):
  if text(k) and text(k) not in ('yes','no'):raise ValueError('Invalid video access flag')
 if text('rating') and not 0<=float(text('rating'))<=5:raise ValueError('Invalid video rating')
 if text('view_count') and int(text('view_count'))<0:raise ValueError('Invalid view count')
 if not isinstance(v.get('tag',[]),list) or len(v.get('tag',[]))>32:raise ValueError('Invalid video tags')
 if 'tag' in v:
  clean=[t.strip() for t in v['tag'] if isinstance(t,str) and t.strip()]
  if len(clean)!=len(v['tag']):warnings.append({'url':page,'type':'video_empty_tags_omitted'})
  v['tag']=clean
 for k in ('restriction','platform'):
  if v.get(k) and (not isinstance(v[k],dict) or v[k].get('attributes',{}).get('relationship') not in ('allow','deny')):raise ValueError('Restriction relationship required')
 if v.get('restriction') and not all(re.fullmatch('[A-Z]{2}',c) for c in v['restriction']['text'].split()):raise ValueError('Invalid country restriction')
 if v.get('platform') and not set(v['platform']['text'].split())<=set(('web','mobile','tv')):raise ValueError('Invalid platform')
 if text('uploader') and len(text('uploader'))>255:raise ValueError('Uploader too long')
 info=v.get('uploader',{}).get('attributes',{}).get('info') if isinstance(v.get('uploader'),dict) else None
 if info and urllib.parse.urlsplit(normal(info)).hostname!=urllib.parse.urlsplit(page).hostname:raise ValueError('Uploader info must be on page host')
 result=ET.Element('{'+VI+'}video')
 for key in VIDEO_FIELDS:
  value=v.get(key)
  if value in (None,'',[]):continue
  if key=='tag':
   for item in value:text_tag(result,VI,key,item)
  elif isinstance(value,dict):
   allowed={'relationship'} if key in ('restriction','platform') else {'info'} if key=='uploader' else set()
   if not set(value['attributes'])<=allowed:raise ValueError('Unsupported video attribute')
   if key in ('restriction','platform') and value['attributes'].get('relationship') not in ('allow','deny'):raise ValueError('Restriction relationship required')
   e=text_tag(result,VI,key,value['text']);e.attrib.update(value['attributes'])
  else:text_tag(result,VI,key,value)
 return result

def optional_page_profile(profile):
 if not profile:return []
 if not profile.get('source_evidence_id') or not re.fullmatch('[a-f0-9]{64}',profile.get('source_version_sha256','')):raise ValueError('Page profile requires versioned evidence')
 fields=[];freq=profile.get('change_frequency');priority=profile.get('priority')
 if freq is not None:
  if freq not in ('always','hourly','daily','weekly','monthly','yearly','never'):raise ValueError('Invalid change frequency')
  fields.append(('changefreq',freq))
 if priority is not None:
  if isinstance(priority,bool) or not isinstance(priority,(float,int)) or not math.isfinite(priority) or not 0<=priority<=1:raise ValueError('Invalid sitemap priority')
  fields.append(('priority',priority))
 return fields

def news_element(profile,as_of,window=True):
 if not profile or profile.get('qualifies_as_news')!=1:return None
 if not profile.get('source_evidence_id') or not re.fullmatch('[a-f0-9]{64}',profile.get('source_version_sha256','')):raise ValueError('News profile requires versioned evidence')
 if not all(isinstance(profile.get(k),str) and profile[k].strip() for k in ('publication_name','publication_language','article_title')):raise ValueError('Missing News metadata')
 if not re.fullmatch('zh-cn|zh-tw|[a-z]{2,3}',profile['publication_language']):raise ValueError('Invalid News language')
 value=profile.get('original_publication_value')
 if not valid_date(value):raise ValueError('Invalid original News publication date')
 pub=dt.datetime.fromisoformat(value.replace('Z','+00:00'));pub=pub.replace(tzinfo=UTC) if pub.tzinfo is None else pub
 reference=dt.datetime.fromisoformat(as_of.replace('Z','+00:00'))
 if reference.tzinfo is None:raise ValueError('News cutoff requires timezone')
 if window and not reference-dt.timedelta(days=2)<=pub<=reference:return None
 result=ET.Element('{'+NW+'}news');publication=ET.SubElement(result,'{'+NW+'}publication')
 text_tag(publication,NW,'name',profile['publication_name']);text_tag(publication,NW,'language',profile['publication_language'])
 text_tag(result,NW,'publication_date',value);text_tag(result,NW,'title',profile['article_title']);return result

def eligible(row,hosts,max_age_days=None):
 if row['decision']!='INCLUDE':return False
 if exclusion_reason(row['url']):return False
 if row['host'] not in hosts:raise ValueError('Unapproved host: '+row['host'])
 if not row['url'].startswith('https://') or normal(row['canonical_url'] or row['url'])!=row['url']:raise ValueError('Included noncanonical/insecure URL')
 if max_age_days is not None:
  date=json.loads(row['metadata_json']).get('eligibility',{}).get('evidence_date')
  if not valid_date(date) or (dt.datetime.now(UTC).date()-dt.date.fromisoformat(date[:10])).days>max_age_days:raise ValueError('Eligibility evidence expired: '+row['url'])
 if row['content_modified_at'] and (not valid_date(row['content_modified_at']) or not json.loads(row['metadata_json']).get('curation',{}).get('source')):raise ValueError('Unverified content date')
 return True

def alternate_groups(rows):
 by_url={r['url']:r for r in rows}
 for row in rows:
  alts=json.loads(row['metadata_json']).get('alternates',[])
  if not alts:continue
  expected={(a['language'],normal(a['url'])) for a in alts}
  if len(expected)!=len(alts) or row['url'] not in {u for _,u in expected}:raise ValueError('Hreflang needs unique entries and a self reference')
  for lang,url in expected:
   if lang!='x-default' and not re.fullmatch('[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*',lang):raise ValueError('Invalid hreflang')
   if url not in by_url:raise ValueError('Hreflang target is not eligible')
   reciprocal={(a['language'],normal(a['url'])) for a in json.loads(by_url[url]['metadata_json']).get('alternates',[])}
   if reciprocal!=expected:raise ValueError('Hreflang group must be reciprocal')

def build_release(db,output,policy):
 out=Path(output);previous=json.loads((out/'manifest.json').read_text()) if (out/'manifest.json').exists() else {}
 prev={f['path']:f for f in previous.get('files',[])};stamp=now();warnings=[];files=[];groups=collections.defaultdict(list);news_as_of=policy.get('news_as_of',stamp)
 if not valid_date(news_as_of) or len(news_as_of)<=10:raise ValueError('News cutoff requires a W3C datetime')
 hosts=set(policy['hosts']);counts=collections.Counter()
 rows=[dict(r) for r in db.execute("SELECT * FROM pages WHERE decision='INCLUDE' ORDER BY url") if eligible(r,hosts,policy.get('eligibility_max_age_days'))]
 for row in rows:
  if eligible(row,hosts,policy.get('eligibility_max_age_days')):groups[(row['host'],row['module_type'])].append(row);counts[row['host']]+=1
 if not isinstance(policy.get('html_page_size',500),int) or policy.get('html_page_size',500)<1:raise ValueError('Invalid HTML page size')
 if out.exists() and not (out/'manifest.json').is_file():raise ValueError('Destination is not a prior managed release')
 alternate_groups(rows)
 out.parent.mkdir(parents=True,exist_ok=True);stage=Path(tempfile.mkdtemp(prefix='sitemap-build-',dir=out.parent))
 def save(host,relative,body,kind,entries=0):
  path=host+'/'+relative;blob=body.encode() if isinstance(body,str) else body;digest=sha(blob)
  prior=prev.get(path);modified=prior['modified_at'] if prior and prior['sha256']==digest else stamp
  p=stage/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(blob)
  files.append({'path':path,'host':host,'public_url':'https://'+host+'/'+relative,'kind':kind,'entries':entries,'bytes':len(blob),'sha256':digest,'modified_at':modified})
 def leaf(host,family,kind,bucket,items):
  root=ET.Element('{'+SM+'}urlset');accepted=0
  for row in items:
   media=json.loads(row['images_json'] if kind=='images' else row['videos_json']) if kind in ('images','videos') else None
   metadata=json.loads(row['metadata_json'])
   article=news_element(metadata.get('news_profile'),news_as_of) if kind=='news' else None
   if kind=='news' and article is None:continue
   if media==[]:continue
   u=ET.Element('{'+SM+'}url');text_tag(u,SM,'loc',row['url'])
   if row['content_modified_at']:text_tag(u,SM,'lastmod',row['content_modified_at'])
   if kind=='pages':
    for key,value in optional_page_profile(metadata.get('sitemap_profile')):text_tag(u,SM,key,value)
    for alternate in json.loads(row['metadata_json']).get('alternates',[]):ET.SubElement(u,'{'+XH+'}link',{'rel':'alternate','hreflang':alternate['language'],'href':normal(alternate['url'])})
   if kind=='images':
    if len(media)>1000:raise ValueError('Too many image references for page')
    for image in media:
     image_tag=ET.SubElement(u,'{'+IM+'}image');text_tag(image_tag,IM,'loc',normal(image['loc']))
   if kind=='videos':
    for video in media:
     elem=video_element(video,warnings,row['url'])
     if elem is not None:u.append(elem)
    if not u.findall('{'+VI+'}video'):continue
   if kind=='news':u.append(article)
   root.append(u);accepted+=1
  if not accepted:return
  blob=ET.tostring(root,encoding='utf-8',xml_declaration=True)
  if len(blob)>MAX_BYTES or accepted>(1000 if kind=='news' else MAX_URLS):
   if len(items)<2:raise ValueError('Single entry exceeds XML size limit')
   middle=len(items)//2;leaf(host,family,kind,bucket+'a',items[:middle]);leaf(host,family,kind,bucket+'b',items[middle:]);return
  # Root leaves avoid imposing a subdirectory scope on unrelated page paths.
  save(host,'sitemap-'+kind+'-'+family+'-'+bucket+'.xml',blob,kind,accepted)
 try:
  for (host,family),items in sorted(groups.items()):
   buckets=policy.get('family_buckets',{}).get(family,1)
   if not isinstance(buckets,int) or buckets<1:raise ValueError('Invalid stable bucket count')
   for number in range(buckets):
    selected=[r for r in items if int(r['url_hash'][:8],16)%buckets==number]
    for kind in ('pages','images','videos','news'):leaf(host,family,kind,f'{number+1:03d}',selected)
  for host in sorted(counts):
   index=ET.Element('{'+SM+'}sitemapindex');children=[f for f in files if f['host']==host and f['kind'] in ('pages','images','videos','news')]
   if len(children)>50000:raise ValueError('Index limit exceeded')
   for f in sorted(children,key=lambda x:x['path']):
    s=ET.SubElement(index,'{'+SM+'}sitemap');text_tag(s,SM,'loc',f['public_url'])
    published=policy.get('published_file_modifications',{}).get(f['public_url'])
    if published and published.get('content_sha256')==f['sha256']:
     if published.get('state')!='public_verified' or not published.get('receipt') or not valid_date(published.get('lastmod')):raise ValueError('Index date requires matching verified public-content evidence')
     modified=dt.datetime.fromisoformat(published['lastmod'].replace('Z','+00:00'));modified=modified.replace(tzinfo=UTC) if modified.tzinfo is None else modified
     if modified>dt.datetime.now(UTC):raise ValueError('Future index modification date')
     text_tag(s,SM,'lastmod',published['lastmod'])
   blob=ET.tostring(index,encoding='utf-8',xml_declaration=True)
   if len(blob)>MAX_BYTES:raise ValueError('Oversized index')
   save(host,'sitemap-managed.xml',blob,'index',len(children))
   save(host,'robots-addition.txt','Sitemap: https://'+host+'/sitemap-managed.xml\n','robots_addition')
   host_groups=[(family,items) for (h,family),items in sorted(groups.items()) if h==host]
   links=[];markdown=['# Pinnacle Blooms Network public site map','', 'Canonical navigation: https://'+host+'/site-map/','']
   for family,items in host_groups:
    route='/site-map/'+family+'/index.html';links.append('<li><a href="'+route+'">'+html.escape(family)+'</a> ('+str(len(items))+')</li>');markdown.append('- ['+family+'](https://'+host+route+'): '+str(len(items))+' public page URLs.')
    for number in range(0,len(items),policy.get('html_page_size',500)):
     chunk=items[number:number+policy.get('html_page_size',500)];part=number//policy.get('html_page_size',500)+1
     entries=''.join('<li><a href="'+html.escape(r['url'],quote=True)+'">'+html.escape(r['title'] or urllib.parse.unquote(urllib.parse.urlsplit(r['url']).path))+'</a></li>' for r in chunk)
     pagination=''.join('<a href="'+('index.html' if i==1 else f'page-{i}.html')+'">'+str(i)+'</a> ' for i in range(1,(len(items)+policy.get('html_page_size',500)-1)//policy.get('html_page_size',500)+1))
     name='index.html' if part==1 else f'page-{part}.html'
     save(host,'site-map/'+family+'/'+name,html_page(family,'<a href="/site-map/">Site map</a><ul>'+entries+'</ul><nav aria-label="Pages">'+pagination+'</nav>'),'html')
   save(host,'site-map/index.html',html_page('Pinnacle public site map','<ul>'+''.join(links)+'</ul>'),'html')
   save(host,'site-map/index.md','\n'.join(markdown)+'\n','markdown')
   guide='# Pinnacle Blooms Network\n\n> Navigation to approved public website resources.\n\n## Public sources\n- [Public site map](https://'+host+'/site-map/index.md): Page families and canonical navigation.\n'
   approved=[r for r in rows if r['host']==host and r['llm_approved'] and r['llm_text'] and json.loads(r['metadata_json']).get('curation',{}).get('approved_sha256')==approval_hash(r)]
   if any(r['host']==host and r['llm_approved'] and r not in approved for r in rows):raise ValueError('Stale or missing LLM approval evidence')
   for r in approved:
    path='site-map/llm-pages/'+r['url_hash']+'.md';save(host,path,r['llm_text'],'markdown');guide+='- ['+(r['title'] or r['module_type']).replace('[','').replace(']','')+'](https://'+host+'/'+path+'): Public source reference.\n'
   save(host,'site-map/llms.txt',guide,'llms')
   save(host,'llms-addition.txt','- [Managed public navigation](https://'+host+'/site-map/llms.txt): Canonical page families.\n','llms_addition')
   if policy.get('llms_full') and approved:
    bundle='\n\n'.join(r['llm_text'] for r in approved)
    if len(bundle.encode())>policy.get('llms_full_max_bytes',250000):raise ValueError('LLM bundle exceeds reviewed corpus limit')
    save(host,'site-map/llms-full.txt',bundle,'llms_bundle')
  # Keep the already advertised legacy video endpoint on the same approved
  # source and formatter. URL-only parents are retained; no metadata is guessed.
  legacy_rows=[r for r in rows if r['host']=='www.pinnacleblooms.org' and r['module_type']=='mirracles']
  if legacy_rows:
   legacy=ET.Element('{'+SM+'}urlset')
   for row in legacy_rows:
    u=ET.SubElement(legacy,'{'+SM+'}url');text_tag(u,SM,'loc',row['url'])
    if row['content_modified_at']:text_tag(u,SM,'lastmod',row['content_modified_at'])
    for video in json.loads(row['videos_json']):
     elem=video_element(video,warnings,row['url'])
     if elem is not None:u.append(elem)
   save('www.pinnacleblooms.org','sitemaps/miracles.xml',ET.tostring(legacy,encoding='utf-8',xml_declaration=True),'compatibility_video',len(legacy))
  generator_sha=sha(dump({name:digest_file(Path(__file__).parent/name) for name in ('manager.py','reconcile.py','run.py','asset-handler.mjs','discovery_policy.py','discovery-policy.json')}))
  manifest={'schema_version':1,'created_at':stamp,'release_id':sha(dump([(f['path'],f['sha256']) for f in sorted(files,key=lambda x:x['path'])])),'generator_sha256':generator_sha,'page_urls':len(rows),'hosts':dict(counts),'files':files,'warnings':warnings,'public_status':'built_not_deployed','policy_sha256':sha(dump(policy))}
  if any(f['kind']=='news' for f in files):manifest['news_as_of']=news_as_of
  (stage/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
  validate_release(stage)
  backup=out.with_name(out.name+'.previous')
  if backup.exists():shutil.rmtree(backup)
  if out.exists():out.rename(backup)
  try:stage.rename(out)
  except BaseException:
   if backup.exists() and not out.exists():backup.rename(out)
   raise
  return manifest
 finally:
  if stage.exists():shutil.rmtree(stage)

def html_page(title,body):
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>'+html.escape(title)+' | Pinnacle Blooms Network</title><style>body{font:17px/1.6 system-ui,sans-serif;color:#19354b;background:#f6fafb;margin:0}header,main,footer{max-width:1080px;margin:auto;padding:24px}a{color:#125985;overflow-wrap:anywhere}li{margin:.5em 0}nav a{display:inline-block;padding:6px 12px}header{border-bottom:1px solid #d9e4e9}h1{font-size:clamp(24px,5vw,36px)}</style></head><body><header><a href="https://www.pinnacleblooms.org/">Pinnacle Blooms Network</a> · <a href="https://www.pinnacleblooms.org/centers">Find a centre</a> · <a href="tel:+919100181181">9100 181 181</a></header><main><h1>'+html.escape(title)+'</h1>'+body+'</main><footer><a href="https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india">Ask about an assessment or appointment</a>. The care team confirms service, professional, location and fees.</footer></body></html>'

def validate_release(directory, current_discovery=True):
 p=Path(directory);m=json.loads((p/'manifest.json').read_text());page_set=set();seen_files=set();media_parents=set();referenced=set();host_counts=collections.Counter();alternates={}
 records={f['path']:f for f in m['files']}
 if len(records)!=len(m['files']):raise ValueError('Duplicate file identity')
 if m['release_id']!=sha(dump([(f['path'],f['sha256']) for f in sorted(m['files'],key=lambda x:x['path'])])):raise ValueError('Release identity mismatch')
 for f in m['files']:
  file=p/f['path']
  if not file.resolve().is_relative_to(p.resolve()):raise ValueError('Unsafe release path')
  blob=file.read_bytes()
  if sha(blob)!=f['sha256']:raise ValueError('File hash mismatch')
  if len(blob)!=f['bytes'] or f['host'] not in m['hosts'] or f['public_url']!='https://'+f['host']+'/'+f['path'].split('/',1)[1]:raise ValueError('Manifest identity mismatch')
  seen_files.add(f['path'])
  if f['kind'] not in ('index','pages','images','videos','news','compatibility_video'):continue
  if len(blob)>MAX_BYTES:raise ValueError('Oversized XML')
  if b'<!DOCTYPE' in blob or b'<!ENTITY' in blob:raise ValueError('Unsafe XML declaration')
  root=ET.fromstring(blob)
  expected='{'+SM+'}'+('sitemapindex' if f['kind']=='index' else 'urlset')
  if root.tag!=expected or root.attrib:raise ValueError('Wrong XML root')
  if len(root)>MAX_URLS:raise ValueError('Too many XML entries')
  if f['kind']=='news' and len(root)>1000:raise ValueError('Too many News entries')
  if len(root)!=f['entries']:raise ValueError('XML entry count mismatch')
  for entry in root:
   if entry.tag!='{'+SM+'}'+('sitemap' if f['kind']=='index' else 'url') or entry.attrib:raise ValueError('Wrong entry element')
   loc=entry.find('{'+SM+'}loc')
   if loc is None or not loc.text:raise ValueError('Missing location')
   if len(entry.findall('{'+SM+'}loc'))!=1 or loc.attrib or len(loc) or normal(loc.text)!=loc.text or not loc.text.startswith('https://'):raise ValueError('Invalid canonical location')
   if urllib.parse.urlsplit(loc.text).hostname!=f['host']:raise ValueError('Cross-host location')
   if current_discovery and f['kind'] in ('pages','compatibility_video') and exclusion_reason(loc.text):raise ValueError('Discovery policy excludes URL: '+loc.text)
   dates=entry.findall('{'+SM+'}lastmod')
   if len(dates)>1:raise ValueError('Repeated modification date')
   for date in dates:
    if date.attrib or len(date) or not valid_date(date.text):raise ValueError('Invalid XML modification date')
   allowed={'{'+SM+'}loc','{'+SM+'}lastmod'}
   if f['kind']=='images':allowed.add('{'+IM+'}image')
   elif f['kind'] in ('videos','compatibility_video'):allowed.add('{'+VI+'}video')
   elif f['kind']=='pages':allowed.update(('{'+XH+'}link','{'+SM+'}priority','{'+SM+'}changefreq'))
   elif f['kind']=='news':allowed.add('{'+NW+'}news')
   if any(e.tag not in allowed for e in entry):raise ValueError('Unsupported XML field')
   if f['kind']=='index':
    target=f['host']+'/'+urllib.parse.urlsplit(loc.text).path.lstrip('/')
    if target not in records or records[target]['kind'] not in ('pages','images','videos','news'):raise ValueError('Broken or nested sitemap reference')
    if target in referenced:raise ValueError('Repeated child reference')
    referenced.add(target)
   if f['kind']=='pages':
    profile={}
    for key in ('priority','changefreq'):
     elements=entry.findall('{'+SM+'}'+key)
     if len(elements)>1 or any(e.attrib or len(e) for e in elements):raise ValueError('Repeated or structured optional page field')
     if elements:
      try:profile['priority' if key=='priority' else 'change_frequency']=float(elements[0].text) if key=='priority' else elements[0].text
      except (TypeError,ValueError):raise ValueError('Invalid optional page field')
    if profile:optional_page_profile(dict(profile,source_evidence_id='semantic_validation',source_version_sha256='0'*64))
    if loc.text in page_set:raise ValueError('Duplicate page membership')
    page_set.add(loc.text);host_counts[f['host']]+=1
    alternate_set=set()
    for a in entry.findall('{'+XH+'}link'):
     if set(a.attrib)!=set(('rel','hreflang','href')) or a.attrib['rel']!='alternate' or normal(a.attrib['href'])!=a.attrib['href']:raise ValueError('Invalid alternate element')
     lang=a.attrib['hreflang']
     if lang!='x-default' and not re.fullmatch('[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*',lang):raise ValueError('Invalid hreflang')
     alternate_set.add((lang,a.attrib['href']))
    if alternate_set:alternates[loc.text]=alternate_set
   if f['kind']=='images':
    media=entry.findall('{'+IM+'}image')
    if not 1<=len(media)<=1000:raise ValueError('Invalid image count')
    for image in media:
     if len(image)!=1 or image[0].tag!='{'+IM+'}loc' or not image[0].text or normal(image[0].text)!=image[0].text:raise ValueError('Invalid image reference')
    media_parents.add(loc.text)
   if f['kind'] in ('videos','compatibility_video'):
    media=entry.findall('{'+VI+'}video')
    if not media and f['kind']=='videos':raise ValueError('Empty video parent')
    for video in media:
     if any(v.tag!='{'+VI+'}'+v.tag.split('}')[-1] or v.tag.split('}')[-1] not in VIDEO_FIELDS for v in video):raise ValueError('Unsupported video field')
     values={};counts=collections.Counter(v.tag.split('}')[-1] for v in video)
     if any(n>1 for name,n in counts.items() if name!='tag'):raise ValueError('Repeated video singleton')
     for v in video:
      key=v.tag.split('}')[-1]
      if key=='tag':values.setdefault('tag',[]).append(v.text)
      else:values[key]={'text':v.text or '', 'attributes':dict(v.attrib)} if v.attrib else v.text or ''
     issues=[];rebuilt=video_element({'values':values},issues,loc.text)
     if rebuilt is None or issues or ET.tostring(rebuilt)!=ET.tostring(video):raise ValueError('Invalid video semantics')
    media_parents.add(loc.text)
   if f['kind']=='news':
    news=entry.findall('{'+NW+'}news')
    if len(news)!=1:raise ValueError('News parent needs exactly one article')
    node=news[0];publication=node.find('{'+NW+'}publication')
    if publication is None or node.attrib or publication.attrib or [e.tag for e in node]!=['{'+NW+'}publication','{'+NW+'}publication_date','{'+NW+'}title'] or [e.tag for e in publication]!=['{'+NW+'}name','{'+NW+'}language']:raise ValueError('Invalid News shape')
    if any(e.attrib or len(e) for e in list(publication)+list(node)[1:]):raise ValueError('Invalid News scalar')
    profile={'qualifies_as_news':1,'source_evidence_id':'semantic_validation','source_version_sha256':'0'*64,'publication_name':publication[0].text,'publication_language':publication[1].text,'original_publication_value':node[1].text,'article_title':node[2].text}
    rebuilt=news_element(profile,m.get('news_as_of',''))
    if rebuilt is None or ET.tostring(rebuilt)!=ET.tostring(node):raise ValueError('Invalid News semantics/window')
    media_parents.add(loc.text)
 if len(page_set)!=m['page_urls']:raise ValueError('Catalogue and sitemap coverage differ')
 if dict(host_counts)!=m['hosts'] or not media_parents<=page_set:raise ValueError('Media/host coverage differs')
 if referenced!={f['path'] for f in m['files'] if f['kind'] in ('pages','images','videos','news')}:raise ValueError('Unreferenced sitemap')
 for url,group in alternates.items():
  if url not in {u for _,u in group} or any(alternates.get(u)!=group for _,u in group):raise ValueError('Nonreciprocal hreflang')
 return {'valid':True,'page_urls':len(page_set),'files':len(seen_files),'release_id':m['release_id']}

def export_mysql(db,path,batch=250):
 if batch<1:raise ValueError('Batch size must be positive')
 columns=[c[1] for c in db.execute('PRAGMA table_info(pages)')]
 def literal(x):
  if x is None:return 'NULL'
  if isinstance(x,(int,float)):return str(x)
  return "CONVERT(X'"+str(x).encode().hex()+"' USING utf8mb4)"
 target=Path(path);target.parent.mkdir(parents=True,exist_ok=True);stage=Path(tempfile.mkdtemp(prefix='sitemap-sql-',dir=target.parent));parts=[]
 if target.exists() and not (target/'manifest.json').is_file():raise ValueError('SQL destination is not a prior managed export')
 cursor=db.execute('SELECT * FROM pages ORDER BY url_hash');part=0
 while rows:=cursor.fetchmany(batch):
  query='INSERT INTO website_sitemap_pages_v1 ('+','.join(columns)+') VALUES\n'+',\n'.join('('+','.join(literal(r[c]) for c in columns)+')' for r in rows)+'\nON DUPLICATE KEY UPDATE '+','.join(c+'=VALUES('+c+')' for c in columns if c!='url_hash')+';\n'
  p=stage/f'batch-{part:05d}.sql';p.write_text(query);parts.append({'path':p.name,'rows':len(rows),'sha256':sha(query),'bytes':len(query.encode())});part+=1
 (stage/'manifest.json').write_text(json.dumps({'mode':'upsert_delta_with_explicit_tombstones','table':'website_sitemap_pages_v1','batches':parts},indent=2)+'\n')
 if target.exists():shutil.rmtree(target)
 stage.rename(target);return {'batches':len(parts),'rows':sum(p['rows'] for p in parts)}

def main(argv=None):
 parser=argparse.ArgumentParser();sub=parser.add_subparsers(dest='command',required=True)
 p=sub.add_parser('import');p.add_argument('--db',required=True);p.add_argument('--register',required=True);p.add_argument('--snapshot',action='store_true');p.add_argument('--frog');p.add_argument('--ahrefs');p.add_argument('--media-census');p.add_argument('--curation')
 p=sub.add_parser('build');p.add_argument('--db',required=True);p.add_argument('--output',required=True);p.add_argument('--policy',required=True)
 p=sub.add_parser('validate');p.add_argument('--release',required=True)
 p=sub.add_parser('status');p.add_argument('--db',required=True)
 p=sub.add_parser('export-mysql');p.add_argument('--db',required=True);p.add_argument('--output',required=True);p.add_argument('--batch-size',type=int,default=250)
 args=parser.parse_args(argv)
 if args.command=='validate':result=validate_release(args.release)
 else:
  db=connect(args.db)
  try:
   if args.command=='import':
    result={'decisions':import_register(db,args.register,args.snapshot)}
    if args.frog:result['frog_enriched']=enrich(db,args.frog,'screaming_frog')
    if args.ahrefs:result['ahrefs_enriched']=enrich(db,args.ahrefs,'ahrefs')
    if args.media_census:result.update(media_import(db,args.media_census))
    if args.curation:policy_load(db,args.curation)
   elif args.command=='build':
    manifest=build_release(db,args.output,json.loads(Path(args.policy).read_text()));result={k:manifest[k] for k in ('release_id','page_urls','hosts','public_status')};result['warnings']=len(manifest['warnings']);result['files']=len(manifest['files'])
   elif args.command=='export-mysql':result=export_mysql(db,args.output,args.batch_size)
   else:result={'rows_including_history':db.execute('SELECT COUNT(*) FROM pages').fetchone()[0],'current_decisions':dict(db.execute("SELECT decision,COUNT(*) FROM pages WHERE json_extract(metadata_json,'$.snapshot_tombstone') IS NULL GROUP BY decision")),'historical_tombstones':db.execute("SELECT COUNT(*) FROM pages WHERE json_extract(metadata_json,'$.snapshot_tombstone') IS NOT NULL").fetchone()[0],'rows_with_title':db.execute("SELECT COUNT(*) FROM pages WHERE title IS NOT NULL").fetchone()[0],'approved_llm_rows':db.execute('SELECT COUNT(*) FROM pages WHERE llm_approved=1').fetchone()[0]}
  finally:db.close()
 print(json.dumps(result,ensure_ascii=False,indent=2));return result
if __name__=='__main__':main()
