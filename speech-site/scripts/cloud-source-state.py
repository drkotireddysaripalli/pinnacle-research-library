"""Private public-source state only; no provider binding/settings snapshots."""
import argparse,gzip,hashlib,json,os,pathlib,tempfile,zipfile,subprocess
ACCOUNT='862998def1cd610fdb86b8e5c1d6ed4d';BUCKET='pinnacle-sitemap-state'
BLOCKED={'bindings.json','before.json','original.json','candidate.json','upload-session.json','settings.json'}
PATH_KEYS={'preservation_proof','feed','policy','baseline_publisher','resource_baseline','aliases','r2_associations','baseline_receipt','baselineReceipt','baselineManifest','baselineDirectory','fullUnion','selectedRelease','previousRelease','snapshot','delta','r2','generated','archive','installedConfig','currentFeed'}
def sha(b):return hashlib.sha256(b).hexdigest()
def io_path(p):
 p=pathlib.Path(p).resolve()
 return pathlib.Path('\\\\?\\'+str(p)) if os.name=='nt' and not str(p).startswith('\\\\?\\') else p
def safe_member(value):
 p=pathlib.PurePosixPath(value)
 if p.is_absolute() or '..' in p.parts or ':' in value or '\\' in value or not p.parts:raise ValueError('Unsafe state member')
 if any(x in BLOCKED or x.endswith('-original.json') or x.endswith('.toml') or x=='.git' for x in p.parts):raise ValueError('Credential/settings snapshot excluded')
 if p.parts[0] not in ('speech-site','tooling'):raise ValueError('State outside approved source directories')
 return p
def relocate(v,old_root,new_root,key=''):
 if isinstance(v,dict):return {k:relocate(x,old_root,new_root,k) for k,x in v.items()}
 if isinstance(v,list):return [relocate(x,old_root,new_root,key) for x in v]
 if isinstance(v,str) and key in PATH_KEYS:
  normal=v.replace('\\','/');prefix=old_root.replace('\\','/').rstrip('/')+'/'
  if normal.startswith(prefix):return str(pathlib.Path(new_root)/pathlib.PurePosixPath(normal[len(prefix):]))
 return v
def client():
 import boto3
 for name in ('SITEMAP_STATE_ACCESS_KEY_ID','SITEMAP_STATE_SECRET_ACCESS_KEY'):
  if not os.environ.get(name):raise RuntimeError('Required private state credential missing: '+name)
 return boto3.client('s3',endpoint_url=f'https://{ACCOUNT}.r2.cloudflarestorage.com',region_name='auto',aws_access_key_id=os.environ['SITEMAP_STATE_ACCESS_KEY_ID'],aws_secret_access_key=os.environ['SITEMAP_STATE_SECRET_ACCESS_KEY'])
def selected_files(repo,config):
 files={};seen=set()
 def add(value,directory=False):
  p=pathlib.Path(value).resolve();p=p if p.is_absolute() else repo/p
  if not p.is_relative_to(repo):raise ValueError('State input outside current repository')
  paths=io_path(p).rglob('*') if directory else [io_path(p)]
  for f in paths:
   if f.is_file():
    if f.is_symlink():raise ValueError('State symlinks excluded')
    normal=pathlib.Path(str(f).removeprefix('\\\\?\\'));rel=normal.relative_to(repo).as_posix();safe_member(rel);files[rel]=f
 for k in ('preservation_proof','feed','policy','baseline_publisher','resource_baseline','aliases','r2_associations','baseline_receipt'):add(config[k])
 receipt=json.loads(pathlib.Path(config['baseline_receipt']).read_text(encoding='utf-8'))
 if receipt['phase']!='verified_complete':raise ValueError('Unverified publication baseline')
 add(pathlib.Path(receipt['selectedRelease'])/'manifest.json')
 for k in ('selectedRelease','fullUnion'):add(receipt[k],True)
 asset_manifest=repo/'speech-site/ask-private'/receipt['id']/'manifest.json';add(asset_manifest)
 assets=json.loads(asset_manifest.read_text(encoding='utf-8'))
 for name,record in assets.items():
  asset=pathlib.Path(receipt['fullUnion'])/name.lstrip('/')
  if not io_path(asset).is_file():raise ValueError('Baseline asset missing from private seed')
  data=io_path(asset).read_bytes()
  if record.get('size')!=len(data):raise ValueError('Baseline asset size mismatch')
 # Reuse the pinned publisher's actual BLAKE3/base64/extension fingerprint.
 subprocess.run([os.environ.get('NODE_EXECUTABLE','node'),'scripts/check-cloud-state-assets.mjs',config['baseline_receipt']],cwd=repo/'speech-site',check=True,stdout=subprocess.DEVNULL)
 for directory in ('speech-site/ask-private/r2-approved-current',):
  p=repo/directory
  if p.exists():add(p,True)
 outbox=repo/'speech-site/ask-private/sitemap-submission-outbox.json'
 if outbox.exists():add(outbox)
 return files
def store(repo,config_path,s3,bucket=BUCKET):
 repo=pathlib.Path(repo).resolve();config=json.loads(pathlib.Path(config_path).read_text(encoding='utf-8'));config['python']='python3';config['global_lock']='ask-private/cloud-local-checkpoint.lock';config['cloud']={'enabled':True,'repository':'drkotireddysaripalli/pinnacle-research-library','workflow':'public-sitemap-upkeep.yml','ref':'main'}
 config['gsc_site']='sc-domain:pinnacleblooms.org';config['bing_site_url']='https://pinnacleblooms.org/'
 if not config.get('preservation_proof'):
  proof=pathlib.Path('../../public-500-recovery-20261013/speech-site/outputs/public-500-recovery-20261013/public-proof.json').resolve()
  if not proof.is_file():raise ValueError('Accepted receiving/public-recovery proof is required')
  config['preservation_proof']=str(proof)
 # Only explicitly configured public-source inputs may be copied from another
 # owner worktree. They become self-contained; desktop secrets are never read.
 for k in ('preservation_proof','feed','policy','baseline_publisher','resource_baseline','aliases','r2_associations','baseline_receipt'):
  source=pathlib.Path(config[k]).resolve()
  if not source.is_relative_to(repo):
   target=repo/'speech-site/ask-private/cloud-seed'/f'{k}-{source.name}'
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(io_path(source).read_bytes());config[k]=str(target)
 receipt=json.loads(pathlib.Path(config['baseline_receipt']).read_text(encoding='utf-8'));keys=list(pathlib.Path(receipt['fullUnion']).glob('*.txt'))
 for f in keys:
  if len(f.stem)==32 and all(c in '0123456789abcdef' for c in f.stem.lower()):
   value=f.read_text(encoding='utf-8').strip()
   if value!=f.stem:raise ValueError('Existing public IndexNow key differs from file name')
   for host in ('www.pinnacleblooms.org','pinnacleblooms.org','materials.pinnacleblooms.org','interventions.pinnacleblooms.org','pediatricians.pinnacleblooms.org'):
    config.setdefault('indexnow_keys',{})[host]={'key':value,'keyLocation':'https://'+host+'/'+f.name}
 files=selected_files(repo,config);members=[]
 with tempfile.TemporaryDirectory() as td:
  archive=pathlib.Path(td)/'source-state.zip'
  with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
   for rel,p in sorted(files.items()):
    data=p.read_bytes();members.append({'path':rel,'bytes':len(data),'sha256':sha(data)});info=zipfile.ZipInfo(rel);info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,data)
   data=(json.dumps(config,indent=2)+'\n').encode();rel='speech-site/ask-private/public-publisher-config.json';members.append({'path':rel,'bytes':len(data),'sha256':sha(data)});info=zipfile.ZipInfo(rel);info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,data)
  blob=archive.read_bytes();key='blobs/'+sha(blob)+'.zip';s3.put_object(Bucket=bucket,Key=key,Body=blob,ContentType='application/zip')
  manifest={'schema':1,'source_root':str(repo),'archive_key':key,'archive_sha256':sha(blob),'archive_bytes':len(blob),'files':members,'relocate_json':['speech-site/ask-private/public-publisher-config.json',pathlib.Path(config['baseline_receipt']).resolve().relative_to(repo).as_posix()],'publication_version':json.loads(pathlib.Path(config['baseline_receipt']).read_text())['candidateVersion']}
  s3.put_object(Bucket=bucket,Key='bootstrap.json',Body=json.dumps(manifest).encode(),ContentType='application/json')
  return {'archive_sha256':manifest['archive_sha256'],'files':len(members),'bytes':len(blob),'private_bucket':bucket}
def hydrate(repo,s3,bucket=BUCKET):
 repo=pathlib.Path(repo).resolve();m=json.loads(s3.get_object(Bucket=bucket,Key='bootstrap.json')['Body'].read())
 if m.get('schema')!=1 or not m['archive_key'].startswith('blobs/'):raise ValueError('Invalid private state manifest')
 blob=s3.get_object(Bucket=bucket,Key=m['archive_key'])['Body'].read()
 if len(blob)!=m['archive_bytes'] or sha(blob)!=m['archive_sha256']:raise ValueError('Private state archive checksum mismatch')
 import io
 with zipfile.ZipFile(io.BytesIO(blob)) as z:
  expected={x['path']:x for x in m['files']}
  if len(z.namelist())!=len(expected) or set(z.namelist())!=set(expected):raise ValueError('Private state members mismatch')
  for rel,f in expected.items():
   safe_member(rel);data=z.read(rel)
   if len(data)!=f['bytes'] or sha(data)!=f['sha256']:raise ValueError('Private state member checksum mismatch')
  for rel,f in expected.items():
   safe_member(rel);data=z.read(rel)
   if len(data)!=f['bytes'] or sha(data)!=f['sha256']:raise ValueError('Private state member checksum mismatch')
   target=repo/pathlib.PurePosixPath(rel);target.parent.mkdir(parents=True,exist_ok=True)
   if rel in m.get('relocate_json',[]):
    parsed=json.loads(data);parsed=relocate(parsed,m['source_root'],repo);data=(json.dumps(parsed,indent=2)+'\n').encode()
   target.write_bytes(data)
 cfg=repo/'speech-site/ask-private/public-publisher-config.json';c=json.loads(cfg.read_text());c['python']='python3';c['global_lock']='ask-private/cloud-local-checkpoint.lock';cfg.write_text(json.dumps(c,indent=2)+'\n',encoding='utf-8')
 try:outbox=s3.get_object(Bucket=bucket,Key='outbox/current.json')['Body'].read()
 except Exception as e:
  if getattr(e,'response',{}).get('ResponseMetadata',{}).get('HTTPStatusCode')!=404:raise
 else:
  json.loads(outbox);(repo/'speech-site/ask-private/sitemap-submission-outbox.json').write_bytes(outbox)
 try:job=s3.get_object(Bucket=bucket,Key='jobs/current.json')['Body'].read()
 except Exception as e:
  if getattr(e,'response',{}).get('ResponseMetadata',{}).get('HTTPStatusCode')!=404:raise
 else:
  json.loads(job);(repo/'speech-site/ask-private/cloud-prior-job.json').write_bytes(job)
 return {'hydrated':True,'archive_sha256':m['archive_sha256'],'files':len(expected),'baseline_version':m['publication_version']}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('action',choices=('hydrate','store','outbox-store','job-store'));p.add_argument('--repo',default='..');p.add_argument('--config',default='ask-private/public-publisher-config.json');p.add_argument('--job-file');args=p.parse_args()
 try:
  s3=client()
  if args.action=='job-store':
   data=pathlib.Path(args.job_file).read_bytes();record=json.loads(data)
   if set(record)-{'dispatchId','scheduledTime','runId','attempt','status','startedAt','finishedAt','version','publicFilesVerified','steps','sourcePhase','readOnlyRecoveries'}:raise ValueError('Unexpected job checkpoint fields')
   s3.put_object(Bucket=BUCKET,Key='jobs/current.json',Body=data,ContentType='application/json');print(json.dumps({'jobCheckpointPersisted':True}))
  elif args.action=='outbox-store':
   data=pathlib.Path('ask-private/sitemap-submission-outbox.json').read_bytes();json.loads(data);s3.put_object(Bucket=BUCKET,Key='outbox/current.json',Body=data,ContentType='application/json');print(json.dumps({'outboxPersisted':True,'sha256':sha(data)}))
  else:print(json.dumps(hydrate(args.repo,s3) if args.action=='hydrate' else store(args.repo,args.config,s3)))
 except Exception as error:
  # Provider exception bodies and credential identifiers do not enter CI output.
  print(json.dumps({'status':'private-state-failed','errorType':type(error).__name__}));raise SystemExit(1)
