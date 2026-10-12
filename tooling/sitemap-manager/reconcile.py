"""Portable, offline four-source eligibility reconciliation. No provider writes."""
from __future__ import annotations
import argparse, collections, csv, datetime as dt, json, re, urllib.parse
from pathlib import Path
import manager as m

ASSET=re.compile(r'\.(?:jpe?g|png|gif|webp|avif|svg|ico|css|js|mjs|json|xml|mp4|mp3|wav|woff2?|ttf|zip|gz)(?:$|/)',re.I)
PRIVATE=re.compile(r'^/(?:api|admin|account|login|logout|auth|dashboard|patient|patients|session|sessions|checkout|orders)(?:/|$)',re.I)
STRONG={'screaming_frog','ahrefs','gsc_wizard_inspection','live_metadata'}

def norm(value):
 try:
  url=m.normal(value);host=urllib.parse.urlsplit(url).hostname
  return url if host=='pinnacleblooms.org' or host.endswith('.pinnacleblooms.org') else None
 except (ValueError,TypeError):return None

def number(value):
 try:return int(float(value))
 except (ValueError,TypeError):return None

def family(url):
 p=urllib.parse.urlsplit(url);part=p.path.strip('/').split('/')[0]
 mapping={'ask':'Ask','mirracles':'Mirracles','faq':'FAQ','ma':'Materials','t':'Therapy techniques','skills':'Skills','abilities':'Abilities','staff':'Staff','sunshine':'Sunshine','books':'Books','centers':'Centres','a':'Assessments','abs':'Assessments','b':'Behaviour','c':'Developmental care','m':'Milestones','verify':'Verify','guru':'Guru','courses':'Courses','allmirracles':'Mirracles listing','pinnacle-pages-data':'Public documents'}
 if p.hostname not in ('pinnacleblooms.org','www.pinnacleblooms.org'):return p.hostname.split('.')[0]+' portal'
 return mapping.get(part,'Core, services and other')

def negative(status,indexable,canonical,url,robots,reason=''):
 if status and status!=200:return 'redirect' if 300<=status<400 else 'http_error'
 if 'noindex' in robots.lower():return 'noindex'
 if canonical and norm(canonical)!=norm(url):return 'canonical_to_other_url'
 if indexable is False:return reason or 'non_indexable'
 return None

def decide(x,evaluation_date=None,max_age_days=7):
 p=urllib.parse.urlsplit(x['url']);ev=x['evidence'];strong=[e for e in ev if e['source'] in STRONG and e.get('date')]
 if p.scheme!='https':return 'EXCLUDE','insecure_or_historical_http_url',None
 if p.hostname=='mirracle.pinnacleblooms.org' or PRIVATE.search(p.path):return 'EXCLUDE','protected_or_account_route',None
 if ASSET.search(p.path):return 'EXCLUDE','asset_or_discovery_document',None
 if any(k.lower().startswith('utm_') or k.lower() in ('gclid','fbclid','search','q','sort','filter','token','session','sessionid') for k,v in urllib.parse.parse_qsl(p.query)):return 'EXCLUDE','tracking_search_filter_or_session_variant',None
 if not strong:return 'HOLD','no_explicit_indexability_evidence',None
 live=sorted((e for e in strong if e['source']=='live_metadata'),key=lambda e:(e['date'],e.get('checked_at','')))[-1:]
 if live and x['family']=='Centres' and live[-1].get('reason')=='noindex':return 'HOLD','centre_noindex_requires_production_owner_confirmation',live[-1]['date']
 if live and live[-1].get('indexable') is None:return 'HOLD',live[-1].get('reason') or 'live_fetch_unverified',live[-1]['date']
 date=max(e['date'] for e in strong);latest=live if live else [e for e in strong if e['date']==date]
 if live:date=latest[0]['date']
 positive=[e for e in latest if e.get('indexable') is True and e.get('status')==200 and not e.get('reason')]
 negative_ev=[e for e in latest if e.get('reason')]
 if positive and negative_ev:return 'HOLD','conflicting_latest_indexability_evidence',date
 if negative_ev:
  if any(e['source']=='semrush' and e['date']>date and e.get('status')==200 and not e.get('reason') for e in ev):return 'HOLD','older_exclusion_needs_current_indexability_check',date
  reason=negative_ev[0]['reason']
  return ('HOLD' if reason in ('not_crawled','google_inspection_requires_review') else 'EXCLUDE'),reason,date
 if not positive:return 'HOLD','incomplete_indexability_evidence',date
 if evaluation_date and (dt.date.fromisoformat(evaluation_date)-dt.date.fromisoformat(date)).days>max_age_days:return 'HOLD','eligibility_evidence_expired',date
 if any(e.get('soft_error') for e in positive):return 'HOLD','possible_soft_error',date
 if any(e['source']=='semrush' and e['date']>=date and e.get('reason') for e in ev) and not live:return 'HOLD','newer_or_same_day_semrush_conflict',date
 if x['family'] in ('Mirracles','Staff') and not x['in_current_sitemap']:return 'HOLD','story_or_profile_publication_status_requires_source_confirmation',date
 if p.query and not x['in_current_sitemap']:return 'HOLD','query_page_requires_publishing_rule',date
 if p.path.lower().endswith(('.pdf','.md','.txt')) and not x['in_current_sitemap']:return 'HOLD','public_document_publication_status_requires_confirmation',date
 return 'INCLUDE','http_200_indexable_canonical_supported_by_export',date

def reconcile(inputs,output,evaluation_date,max_age_days=7):
 register={};counts=collections.Counter();sources=collections.Counter();issues={}
 def record(url,source,evidence=None):
  url=norm(url)
  if not url:return None
  x=register.setdefault(url,{'url':url,'sources':set(),'evidence':[],'in_current_sitemap':False,'gsc_clicks':0,'gsc_impressions':0})
  x['sources'].add(source);sources[source]+=1
  if evidence:x['evidence'].append(evidence)
  return x
 def csvrows(path):
  with Path(path).open(encoding='utf-8-sig',newline='') as f:yield from csv.DictReader(f)
 if 'semrush_issues' in inputs:
  count=0
  for r in csvrows(inputs['semrush_issues'][0]):
   count+=1;issues[norm(r['Page URL'])]={k:number(r.get(k)) or 0 for k in ('Blocked from crawling','Blocked by X-Robots-Tag: noindex HTTP header','Multiple canonical URLs','Broken canonical URLs','Pages not crawled','Duplicate content')}
  if inputs['semrush_issues'][1].get('expected_rows') is not None and count!=inputs['semrush_issues'][1]['expected_rows']:raise ValueError('Semrush issue dump is incomplete')
 for role,(path,entry) in inputs.items():
  date=entry.get('date');read_count=0
  if role in ('frog','ahrefs','semrush_status'):
   for r in csvrows(path):
    read_count+=1
    if role in ('frog','ahrefs'):
     sf=role=='frog';url=r['Address' if sf else 'URL'];source='screaming_frog' if sf else 'ahrefs';status=number(r['Status Code' if sf else 'HTTP status code']);idx=r['Indexability']=='Indexable' if sf else r['Is indexable page'].lower()=='true';canon=r['Canonical Link Element 1' if sf else 'Canonical URL'];robots=r.get('Meta Robots 1' if sf else 'Meta robots','')+' '+r.get('X-Robots-Tag 1' if sf else 'Robots information in HTTP headers','');observed=r.get('Crawl Timestamp','')[:10] if sf else date
     if not m.valid_date(observed):raise ValueError('Source requires a dated observation: '+role)
     record(url,source,{'source':source,'date':observed,'status':status,'content_type':r.get('Content Type' if sf else 'Content type',''),'indexable':idx,'canonical':canon,'robots':robots,'reason':negative(status,idx,canon,url,robots,r.get('Indexability Status','')),'soft_error':sf and r.get('Potential soft error','0') not in ('0','')})
     if canon:record(canon,'canonical_reference')
     for key in ('Redirect URL','Final redirect URL'):
      if r.get(key):record(r[key],'redirect_reference')
    else:
     if not m.valid_date(date):raise ValueError('Semrush observation date required')
     url=r['Page URL'];status=number(r['HTTP Status Code']);flags=issues.get(norm(url),{});reason=negative(status,None,None,url,'')
     for key,label in (('Blocked by X-Robots-Tag: noindex HTTP header','noindex'),('Blocked from crawling','blocked_from_crawling'),('Pages not crawled','not_crawled'),('Multiple canonical URLs','canonical_error'),('Broken canonical URLs','canonical_error')):
      if not reason and flags.get(key):reason=label
     if not reason and r.get('Canonicalization')=='Canonical to other page':reason='canonical_to_other_url'
     record(url,'semrush',{'source':'semrush','date':date,'status':status,'canonicalization':r.get('Canonicalization'),'indexable':None,'reason':reason,'duplicate_content_flag':flags.get('Duplicate content',0),'meta_robots_not_in_export':True})
  elif role.startswith('gsc_performance'):
   data=json.loads(Path(path).read_text());read_count=len(data['rows'])
   for r in data['rows']:
    x=record(r['keys'][0],'gsc_wizard_performance')
    if x:x['gsc_clicks']+=r.get('clicks',0);x['gsc_impressions']+=r.get('impressions',0)
  elif role=='gsc_saved_performance':
   for r in csvrows(path):
    read_count+=1;url=r.get('page') or r.get('url') or r.get('Page') or next((v for v in r.values() if v.startswith(('https://','http://'))),None)
    if url:record(url,'gsc_saved_performance')
  elif role=='gsc_inspections':
   data=json.loads(Path(path).read_text());read_count=len(data['inspections'])
   for r in data['inspections']:
    url=r['url'];canon=r.get('google_canonical') or r.get('user_canonical');idx=r.get('indexing_state')=='INDEXING_ALLOWED' and r.get('page_fetch_state')=='SUCCESSFUL' and r.get('robots_txt_state')=='ALLOWED';reason=None if idx else ('noindex' if r.get('indexing_state')=='BLOCKED_BY_META_TAG' else 'google_inspection_requires_review')
    if canon and norm(canon)!=norm(url):reason='google_canonical_to_other_url';idx=False
    record(url,'gsc_wizard_inspection',{'source':'gsc_wizard_inspection','date':(r.get('last_crawl_time') or r.get('requested_at',''))[:10],'status':200 if r.get('page_fetch_state')=='SUCCESSFUL' else None,'indexable':idx,'canonical':canon,'reason':reason,'coverage':r.get('coverage_state'),'requested_at':r.get('requested_at')})
  elif role=='gsc_tracked':
   data=json.loads(Path(path).read_text());read_count=len(data['urls'])
   if data.get('total',read_count)!=read_count:raise ValueError('GSC tracker dump is incomplete')
   for r in data['urls']:
    x=record(r['url'],'gsc_wizard_tracker')
    if x:x['tracker_status']=r.get('currentStatus');x['tracker_last_check']=r.get('lastCheckAt')
  elif role=='sitemap_urls':
   for url in Path(path).read_text().splitlines():
    read_count+=1;x=record(url,'current_sitemap')
    if x:x['in_current_sitemap']=True
  elif role=='live_metadata':
   for line in Path(path).read_text().splitlines():
    if line:read_count+=1;r=json.loads(line);record(r['url'],'live_metadata',r)
  if entry.get('expected_rows') is not None and role!='semrush_issues' and read_count!=entry['expected_rows']:raise ValueError('Source row count mismatch: '+role)
 output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
 with output.open('w') as f:
  for x in sorted(register.values(),key=lambda x:x['url']):
   x['family']=family(x['url']);x['decision'],x['reason'],x['evidence_date']=decide(x,evaluation_date,max_age_days);x['sources']=sorted(x['sources']);counts[x['decision']]+=1;x['action']='retain' if x['decision']=='INCLUDE' and x['in_current_sitemap'] else 'add' if x['decision']=='INCLUDE' else 'review' if x['decision']=='HOLD' else 'remove_if_listed' if x['in_current_sitemap'] else 'keep_excluded';f.write(m.dump(x)+'\n')
 return {'rows':len(register),'decisions':dict(counts),'source_references':dict(sources),'evaluation_date':evaluation_date,'max_age_days':max_age_days,'register_sha256':m.digest_file(output),'scope':'provided exports, not a whole-estate publishing inventory'}

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--job',required=True);parser.add_argument('--output',required=True);parser.add_argument('--evaluation-date',required=True);args=parser.parse_args();job_path=Path(args.job);inputs={}
 for entry in json.loads(job_path.read_text())['inputs']:
  path=Path(entry['path']);path=path if path.is_absolute() else job_path.parent/path
  if m.digest_file(path)!=entry['sha256']:raise ValueError('Input hash mismatch')
  inputs[entry['role']]=(path,entry)
 print(json.dumps(reconcile(inputs,args.output,args.evaluation_date),indent=2))
