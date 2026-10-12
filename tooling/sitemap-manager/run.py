"""Replay verified inputs, assemble into an owner's asset union, verify public bytes.

No command purchases services, creates routes, replaces existing discovery files,
submits a sitemap, or deploys independently of the website release owner.
"""
from __future__ import annotations
import argparse, collections, concurrent.futures, json, os, re, shutil, tempfile, urllib.parse, urllib.request
from pathlib import Path
import manager as m

FRAGMENTS={'robots_addition','llms_addition'}
ASSET_PREFIX='_managed_sitemaps'

def prepare(job_path,db_path,output,policy_path):
 job_path=Path(job_path);job=json.loads(job_path.read_text());inputs={};receipt=[]
 if job.get('schema_version')!=1:raise ValueError('Unknown replay job schema')
 if job.get('scope')!='collected_exports_snapshot':raise ValueError('Replay requires a declared collected-exports snapshot')
 known={'register','frog','ahrefs','semrush_status','semrush_issues','gsc_saved_performance','gsc_inspections','gsc_tracked','sitemap_urls','live_metadata','media_census','curation'}
 # Verify all four tools' evidence, even when metadata enrichment uses two CSVs.
 for entry in job['inputs']:
  if entry['role'] not in known and not re.fullmatch(r'gsc_performance-\d+',entry['role']):raise ValueError('Unknown replay role')
  p=Path(entry['path']);p=p if p.is_absolute() else job_path.parent/p
  if m.digest_file(p)!=entry['sha256']:raise ValueError('Replay input mismatch: '+entry['role'])
  if entry['role'] in inputs:raise ValueError('Duplicate replay input role')
  inputs[entry['role']]=(p,entry);receipt.append({**entry,'path':str(p.resolve())})
 required={'frog','ahrefs','semrush_status','semrush_issues','sitemap_urls','media_census'}
 if not required<=set(inputs) or not any(role.startswith('gsc_performance-') for role in inputs):raise ValueError('Incomplete four-source snapshot')
 for role in inputs:
  if role in required-{'media_census'} or role.startswith('gsc_performance-'):
   if not isinstance(inputs[role][1].get('expected_rows'),int) or inputs[role][1]['expected_rows']<1:raise ValueError('Snapshot source requires declared row count')
 if 'register' not in inputs:
  from reconcile import reconcile
  Path(db_path).parent.mkdir(parents=True,exist_ok=True)
  register_path=Path(db_path).with_suffix('.register.jsonl')
  classification=reconcile(inputs,register_path,job.get('evaluation_date') or m.dt.datetime.now(m.UTC).date().isoformat(),job.get('eligibility_max_age_days',7))
  entry={'role':'register','path':str(register_path),'sha256':classification['register_sha256'],'generated_from_verified_inputs':True}
  inputs['register']=(register_path,entry);receipt.append(entry)
 preflight=collections.Counter();preflight_hosts=collections.Counter()
 with inputs['register'][0].open() as f:
  for line in f:
   x=json.loads(line);preflight[x['decision']]+=1
   if x['decision']=='INCLUDE':preflight_hosts[urllib.parse.urlsplit(m.normal(x['url'])).hostname]+=1
 if sum(preflight.values())!=job.get('expected_register_rows') or dict(preflight)!=job.get('expected_decisions'):raise ValueError('Reconciled snapshot counts require review')
 if not preflight['INCLUDE']:raise ValueError('An empty eligible snapshot cannot be released')
 db=m.connect(db_path)
 try:
  for host,count in db.execute("SELECT host,COUNT(*) FROM pages WHERE decision='INCLUDE' GROUP BY host"):
   if preflight_hosts[host]<count*(1-job.get('maximum_eligible_drop_fraction',0.05)):raise ValueError('Unexpected eligible-URL loss requires source reconciliation: '+host)
  db.execute('BEGIN IMMEDIATE')
  result={'decisions':m.import_register(db,inputs['register'][0],snapshot=True,commit=False)}
  for role,source in (('frog','screaming_frog'),('ahrefs','ahrefs')):
   if role in inputs:result[role+'_enriched']=m.enrich(db,inputs[role][0],source,inputs[role][1].get('date'),commit=False)
  if 'media_census' in inputs:result.update(m.media_import(db,inputs['media_census'][0],commit=False))
  if 'curation' in inputs:m.policy_load(db,inputs['curation'][0],commit=False)
  r=m.build_release(db,output,json.loads(Path(policy_path).read_text()))
  result.update(release_id=r['release_id'],page_urls=r['page_urls'],hosts=r['hosts'],files=len(r['files']),warnings=len(r['warnings']),status='built_not_deployed')
  job_sha=m.sha(m.dump(job));payload={'inputs':receipt,'result':result,'job_sha256':job_sha,'policy_sha256':m.digest_file(policy_path)}
  db.execute('INSERT INTO receipts VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload',(job_sha,'verified_replay',m.dump(payload)));db.commit()
  Path(output).joinpath('replay-receipt.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
  return payload
 except BaseException:
  db.rollback();raise
 finally:db.close()

def tree_digest(root):
 result={}
 for p in sorted(Path(root).rglob('*')):
  if p.is_symlink():raise ValueError('Asset union must contain regular files, not symlinks')
  if p.is_file():result[str(p.relative_to(root)).replace(os.sep,'/')]=m.digest_file(p)
 return result

def assemble(release,asset_union,output,previous=None):
 release=Path(release).resolve();baseline=Path(asset_union).resolve();output=Path(output).resolve()
 m.validate_release(release);manifest=json.loads((release/'manifest.json').read_text())
 if not baseline.is_dir() or not any(baseline.iterdir()):raise ValueError('Fresh full asset union is required')
 if output.exists() or output.is_relative_to(baseline) or baseline.is_relative_to(output) or output.is_relative_to(release):raise ValueError('Assembly requires a new independent output directory')
 before=tree_digest(baseline)
 old_assets={}
 if previous:
  m.validate_release(previous)
  old_assets={ASSET_PREFIX+'/'+f['path']:f['sha256'] for f in json.loads(Path(previous).joinpath('manifest.json').read_text())['files'] if f['kind'] not in FRAGMENTS}
  if any(before.get(path)!=digest for path,digest in old_assets.items()):raise ValueError('Prior managed release does not match the asset baseline')
 if {p for p in before if p.startswith(ASSET_PREFIX+'/')}!=set(old_assets):raise ValueError('Existing managed assets require an exact prior-release manifest')
 output.parent.mkdir(parents=True,exist_ok=True);stage=Path(tempfile.mkdtemp(prefix='sitemap-union-',dir=output.parent));added={}
 try:
  shutil.copytree(baseline,stage,dirs_exist_ok=True)
  for path in old_assets:(stage/path).unlink()
  for f in manifest['files']:
   if f['kind'] in FRAGMENTS:continue
   source=release/f['path'];target=stage/ASSET_PREFIX/f['path'];target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,target)
   added[str(target.relative_to(stage)).replace(os.sep,'/')]=f['sha256']
  after=tree_digest(stage)
  if any(after.get(p)!=digest for p,digest in before.items() if p not in old_assets):raise ValueError('Full asset union preservation failed')
  if set(after)!=(set(before)-set(old_assets))|set(added):raise ValueError('Unexpected public assembly files')
  stage.rename(output)
  return {'status':'assembled_not_deployed','release_id':manifest['release_id'],'baseline_files':len(before),'managed_files':len(added),'removed_managed_files':len(set(old_assets)-set(added)),'final_files':len(after),'baseline_sha256':m.sha(m.dump(before)),'final_sha256':m.sha(m.dump(after)),'private_catalogue_included':False}
 finally:
  if stage.exists():shutil.rmtree(stage)

class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):return None

def verify_public(release,workers=4):
 m.validate_release(release);manifest=json.loads(Path(release).joinpath('manifest.json').read_text());files=[f for f in manifest['files'] if f['kind'] not in FRAGMENTS]
 def check(f):
  try:
   request=urllib.request.Request(f['public_url'],headers={'User-Agent':'PinnacleSitemapManager/1.0 (+https://www.pinnacleblooms.org/site-map/)','Accept-Encoding':'identity'})
   with urllib.request.build_opener(NoRedirect).open(request,timeout=30) as response:
    blob=response.read(f['bytes']+1);ct=response.headers.get('Content-Type','');etag=response.headers.get('ETag')
    if response.status!=200 or m.sha(blob)!=f['sha256']:raise ValueError('Public status or bytes mismatch')
    if f['kind'] in ('index','pages','images','videos') and not ('xml' in ct):raise ValueError('Public XML MIME type mismatch')
    if f['kind']=='html' and 'text/html' not in ct:raise ValueError('Public HTML MIME type mismatch')
    return {'url':f['public_url'],'passed':True,'sha256':f['sha256'],'etag':etag}
  except Exception as error:return {'url':f['public_url'],'passed':False,'error':str(error)}
 with concurrent.futures.ThreadPoolExecutor(max_workers=min(max(workers,1),4)) as pool:checks=list(pool.map(check,files))
 return {'status':'public_bytes_verified' if all(c['passed'] for c in checks) else 'public_readback_failed','release_id':manifest['release_id'],'checks':checks,'submitted_to_engines':False,'engine_processing_verified':False}

def change_queue(db,previous,release):
 """Durable eligibility changes for the existing submission/IndexNow owner."""
 m.validate_release(release);current=json.loads(Path(release).joinpath('manifest.json').read_text());old=[];current_urls=set()
 for file in current['files']:
  if file['kind']=='pages':current_urls.update(e.find('{'+m.SM+'}loc').text for e in m.ET.parse(Path(release)/file['path']).getroot())
 if previous:
  m.validate_release(previous)
  # XML changes are not themselves changes to these pages' content.
  for file in json.loads(Path(previous).joinpath('manifest.json').read_text())['files']:
   if file['kind']=='pages':old.extend(e.find('{'+m.SM+'}loc').text for e in m.ET.parse(Path(previous)/file['path']).getroot())
 events=[{'url':u,'event':'eligible_added','page_change_proven':False} for u in sorted(current_urls-set(old))]+[{'url':u,'event':'eligible_removed','page_change_proven':False} for u in sorted(set(old)-current_urls)]
 return {'release_id':current['release_id'],'submission_ready_only_after_public_readback':True,'indexnow_auto_send':False,'reason':'Eligibility change is not proof of creation, update or deletion; validate publishing events before notification.','sitemap_indexes':['https://'+h+'/sitemap-managed.xml' for h in sorted(current['hosts'])],'events':events}

def main():
 parser=argparse.ArgumentParser();sub=parser.add_subparsers(dest='command',required=True)
 p=sub.add_parser('prepare');p.add_argument('--job',required=True);p.add_argument('--db',required=True);p.add_argument('--output',required=True);p.add_argument('--policy',required=True)
 p=sub.add_parser('assemble');p.add_argument('--release',required=True);p.add_argument('--asset-union',required=True);p.add_argument('--output',required=True);p.add_argument('--receipt',required=True);p.add_argument('--previous')
 p=sub.add_parser('verify-public');p.add_argument('--release',required=True);p.add_argument('--receipt',required=True)
 p=sub.add_parser('change-queue');p.add_argument('--db',required=True);p.add_argument('--previous');p.add_argument('--release',required=True);p.add_argument('--receipt',required=True)
 args=parser.parse_args()
 if args.command=='prepare':result=prepare(args.job,args.db,args.output,args.policy)
 elif args.command=='assemble':result=assemble(args.release,args.asset_union,args.output,args.previous)
 elif args.command=='verify-public':result=verify_public(args.release)
 else:
  db=m.connect(args.db)
  try:result=change_queue(db,args.previous,args.release)
  finally:db.close()
 if getattr(args,'receipt',None):Path(args.receipt).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 compact={k:v for k,v in result.get('result',result).items() if k not in ('checks','events','inputs')};print(json.dumps(compact,indent=2))
 if result.get('status')=='public_readback_failed':raise SystemExit(1)
if __name__=='__main__':main()
