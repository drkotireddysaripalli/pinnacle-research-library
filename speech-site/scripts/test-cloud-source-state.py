import importlib.util,io,json,pathlib,tempfile,unittest,zipfile,hashlib,os,subprocess
spec=importlib.util.spec_from_file_location('state',pathlib.Path(__file__).with_name('cloud-source-state.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
scope_module=pathlib.Path(__file__).with_name('r2-coverage-chain.mjs').resolve().as_uri()
scope_contract=json.loads(subprocess.check_output([os.environ.get('NODE_EXECUTABLE','node'),'--input-type=module','-e',f"import{{R2_SCOPES,R2_SCOPE_SHA256}}from {json.dumps(scope_module)};console.log(JSON.stringify({{scopeSetSHA256:R2_SCOPE_SHA256,scopeCount:R2_SCOPES.length}}));"],text=True))
class Missing(Exception):response={'ResponseMetadata':{'HTTPStatusCode':404}}
class FakeS3:
 def __init__(self,objects):self.objects=objects
 def get_object(self,**kw):
  if kw['Key'] not in self.objects:raise Missing()
  return {'Body':io.BytesIO(self.objects[kw['Key']])}
 def put_object(self,**kw):self.objects[kw['Key']]=kw['Body']
def rotation_fixture(source):
 root=pathlib.Path(source)/'speech-site/ask-private/r2-approved-current';root.mkdir(parents=True)
 page={'pass':0,'scope':0,'page':0,'bucket':'pbn-test','prefix':'Assets/InterventionTechniques/','scopeSetSHA256':scope_contract['scopeSetSHA256'],'registrySHA256':'a'*64,'inputCursor':None,'nextCursor':'opaque-list-position','truncated':True,'paginationEvidence':'explicit-truncation-flag','rowsExamined':1000,'known':[],'observedAt':'2026-10-16T00:01:00Z'};data=json.dumps(page).encode();name='pass-0-scope-0-page-0.json';(root/name).write_bytes(data)
 state={'schemaVersion':2,**scope_contract,'registrySHA256':'a'*64,'startedAt':'2026-10-16T00:00:00Z','complete':False,'completedPages':1,'pass':0,'scope':0,'page':1,'cursor':'opaque-list-position','pageHashes':{name:m.sha(data)}};(root/'state.json').write_text(json.dumps(state));return root,state
class StateTests(unittest.TestCase):
 def test_traversal_and_secret_snapshots_rejected(self):
  for s in ('../outside','/etc/password','speech-site/ask-private/bindings.json','speech-site/.git/config','speech-site/private/settings.json','other/data.json'):
   with self.assertRaises(ValueError):m.safe_member(s)
 def test_only_path_fields_are_relocated(self):
  r=m.relocate({'feed':'C:/old/speech-site/private/feed.sqlite3','title':'C:/old/title','url':'https://www.pinnacleblooms.org/page'},'C:/old','/new')
  self.assertEqual(r['feed'],str(pathlib.Path('/new/speech-site/private/feed.sqlite3')));self.assertEqual(r['title'],'C:/old/title')
 def test_rotation_progress_survives_without_advancing_publication_baseline(self):
  with tempfile.TemporaryDirectory() as source,tempfile.TemporaryDirectory() as target:
   root,state=rotation_fixture(source);s3=FakeS3({});m.rotation_store(source,s3);self.assertNotIn('bootstrap.json',s3.objects);result=m.rotation_hydrate(target,s3);self.assertEqual(result['pages'],1);self.assertEqual(json.loads((pathlib.Path(target)/'speech-site/ask-private/r2-approved-current/state.json').read_text()),state)
 def test_rotation_corruption_does_not_extract(self):
  with tempfile.TemporaryDirectory() as source,tempfile.TemporaryDirectory() as target:
   rotation_fixture(source);s3=FakeS3({});m.rotation_store(source,s3);p=json.loads(s3.objects['rotation/current.json']);s3.objects[p['key']]=b'tampered'
   with self.assertRaises(ValueError):m.rotation_hydrate(target,s3)
   self.assertFalse((pathlib.Path(target)/'speech-site').exists())
 def test_valid_hashes_with_missing_scope_terminals_cannot_restore_or_imply_deletion(self):
  files={};state={'schemaVersion':2,**scope_contract,'registrySHA256':'a'*64,'startedAt':'2026-10-16T00:00:00Z','complete':True,'completedPages':2,'pass':2,'scope':0,'page':0,'cursor':None,'pageHashes':{}}
  for p in range(2):
   name=f'pass-{p}-scope-0-page-0.json';data=json.dumps({'pass':p,'scope':0,'page':0,'bucket':'pbn-test','prefix':'Assets/InterventionTechniques/','scopeSetSHA256':scope_contract['scopeSetSHA256'],'registrySHA256':'a'*64,'inputCursor':None,'nextCursor':None,'truncated':False,'paginationEvidence':'short-terminal-page-without-cursor','rowsExamined':0,'known':[],'observedAt':'2026-10-16T00:01:00Z'}).encode();files[name]=data;state['pageHashes'][name]=m.sha(data)
  files['state.json']=json.dumps(state).encode();stream=io.BytesIO()
  with zipfile.ZipFile(stream,'w') as z:
   for name,data in files.items():z.writestr(name,data)
  blob=stream.getvalue();key='rotation/'+m.sha(blob)+'.zip';pointer={'schema':1,**scope_contract,'key':key,'sha256':m.sha(blob),'bytes':len(blob),'registrySHA256':state['registrySHA256'],'startedAt':state['startedAt'],'files':[{'name':n,'bytes':len(b),'sha256':m.sha(b)} for n,b in files.items()]};s3=FakeS3({'rotation/current.json':json.dumps(pointer).encode(),key:blob})
  with tempfile.TemporaryDirectory() as target:
   with self.assertRaisesRegex(ValueError,'chain'):m.rotation_hydrate(target,s3)
   self.assertFalse((pathlib.Path(target)/'speech-site').exists())
 def fixture(self,public=b'{"exact":1}\n',tampered=False):
  config=json.dumps({'schema_version':1,'python':'C:/Python314/python.exe','feed':'C:/old/speech-site/ask-private/feed.sqlite3'}).encode();files={'speech-site/ask-private/public-publisher-config.json':config,'speech-site/public/pinnacle-pages-data/fixture.json':public};b=io.BytesIO()
  with zipfile.ZipFile(b,'w') as z:
   for p,d in files.items():z.writestr(p,d)
  blob=b.getvalue();manifest={'schema':1,'source_root':'C:/old','archive_key':'blobs/fixture.zip','archive_sha256':hashlib.sha256(blob).hexdigest(),'archive_bytes':len(blob),'publication_version':'fixture-version','relocate_json':['speech-site/ask-private/public-publisher-config.json'],'files':[{'path':p,'bytes':len(d),'sha256':hashlib.sha256(d).hexdigest()} for p,d in files.items()]}
  if tampered:manifest['archive_sha256']='0'*64
  return FakeS3({'bootstrap.json':json.dumps(manifest).encode(),'blobs/fixture.zip':blob})
 def test_hydration_keeps_public_asset_bytes(self):
  with tempfile.TemporaryDirectory() as td:
   m.hydrate(td,self.fixture());self.assertEqual((pathlib.Path(td)/'speech-site/public/pinnacle-pages-data/fixture.json').read_bytes(),b'{"exact":1}\n');c=json.loads((pathlib.Path(td)/'speech-site/ask-private/public-publisher-config.json').read_text());self.assertEqual(c['python'],'python3');self.assertTrue(pathlib.Path(c['feed']).resolve().is_relative_to(pathlib.Path(td).resolve()))
 def test_corrupt_state_fails_before_extracting(self):
  with tempfile.TemporaryDirectory() as td:
   with self.assertRaises(ValueError):m.hydrate(td,self.fixture(tampered=True))
   self.assertFalse((pathlib.Path(td)/'speech-site').exists())
 def test_later_member_corruption_does_not_partially_extract(self):
  s3=self.fixture();manifest=json.loads(s3.objects['bootstrap.json']);manifest['files'][-1]['sha256']='0'*64;s3.objects['bootstrap.json']=json.dumps(manifest).encode()
  with tempfile.TemporaryDirectory() as td:
   with self.assertRaises(ValueError):m.hydrate(td,s3)
   self.assertFalse((pathlib.Path(td)/'speech-site').exists())
 def chunk_fixture(self):
  s3=self.fixture();manifest=json.loads(s3.objects['bootstrap.json']);blob=s3.objects.pop(manifest['archive_key']);cut=len(blob)//2;manifest['archive_parts']=[]
  for i,data in enumerate((blob[:cut],blob[cut:])):
   key=f"chunks/{manifest['archive_sha256']}/{i:03d}";s3.objects[key]=data;manifest['archive_parts'].append({'key':key,'bytes':len(data),'sha256':m.sha(data)})
  s3.objects['bootstrap.json']=json.dumps(manifest).encode();return s3
 def test_chunked_bootstrap_preserves_exact_archive_and_public_bytes(self):
  with tempfile.TemporaryDirectory() as td:
   result=m.hydrate(td,self.chunk_fixture());self.assertTrue(result['hydrated']);self.assertEqual((pathlib.Path(td)/'speech-site/public/pinnacle-pages-data/fixture.json').read_bytes(),b'{"exact":1}\n')
 def test_corrupt_bootstrap_part_fails_before_extracting(self):
  s3=self.chunk_fixture();manifest=json.loads(s3.objects['bootstrap.json']);s3.objects[manifest['archive_parts'][1]['key']]=b'corrupt'
  with tempfile.TemporaryDirectory() as td:
   with self.assertRaises(ValueError):m.hydrate(td,s3)
   self.assertFalse((pathlib.Path(td)/'speech-site').exists())
 def test_unapproved_bootstrap_part_key_is_rejected(self):
  s3=self.chunk_fixture();manifest=json.loads(s3.objects['bootstrap.json']);manifest['archive_parts'][0]['key']='other-bucket-source';s3.objects['bootstrap.json']=json.dumps(manifest).encode()
  with tempfile.TemporaryDirectory() as td:
   with self.assertRaises(ValueError):m.hydrate(td,s3)
   self.assertFalse((pathlib.Path(td)/'speech-site').exists())
if __name__=='__main__':unittest.main()
