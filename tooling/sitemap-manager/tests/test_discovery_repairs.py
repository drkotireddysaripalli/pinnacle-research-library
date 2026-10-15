import json, sys, tempfile, threading, unittest, urllib.request, urllib.error
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from unittest.mock import patch
import xml.etree.ElementTree as E
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import manager as m
import source_refresh as source
from discovery_policy import POLICY, exclusion_reason

class DiscoveryRepairs(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.db=m.connect(self.root/'feed.sqlite3')
 def tearDown(self):self.db.close();self.tmp.cleanup()
 def seed(self,rows):
  p=self.root/'register.jsonl';p.write_text('\n'.join(json.dumps(x) for x in rows),encoding='utf8');m.import_register(self.db,p);self.db.commit()
 def test_native_refresh_removes_aliases_without_changing_source_feed(self):
  self.seed([dict(url='https://www.pinnacleblooms.org'+p,family='core',decision='INCLUDE') for p in POLICY['redirect_alias_paths']]+[dict(url='https://www.pinnacleblooms.org/autism-therapy',family='core',decision='INCLUDE')])
  snap=dict(complete=True,stable=True,rows=[],eligibleTotal=0,sourceSHA256='a'*64,completedAt='2026-10-15T00:00:00Z')
  result=source.refresh(self.root/'feed.sqlite3',snap,[],[],self.root/'refresh')
  candidate=m.connect(result['candidate_feed'])
  try:self.assertEqual(candidate.execute("SELECT count(*) FROM pages WHERE decision='EXCLUDE'").fetchone()[0],7)
  finally:candidate.close()
  self.assertEqual(self.db.execute("SELECT count(*) FROM pages WHERE decision='INCLUDE'").fetchone()[0],8)
  self.assertEqual(len(result['changes']),7)
 def test_generator_excludes_redirect_and_unknown_centre_even_with_old_include_flag(self):
  self.seed([dict(url='https://www.pinnacleblooms.org/abatherapy',family='core',decision='INCLUDE'),dict(url='https://www.pinnacleblooms.org/autism-therapy',family='core',decision='INCLUDE'),dict(url='https://www.pinnacleblooms.org/centers/unqualified-new-centre',family='centres',decision='INCLUDE')])
  release=m.build_release(self.db,self.root/'release',dict(hosts=['www.pinnacleblooms.org']))
  self.assertEqual(release['page_urls'],1)
  self.assertIsNone(exclusion_reason('https://www.pinnacleblooms.org'+POLICY['indexable_centre_paths'][0]))
 def test_only_historical_baseline_validation_can_accept_a_retired_alias(self):
  self.seed([dict(url='https://www.pinnacleblooms.org/autism-therapy',family='core',decision='INCLUDE')])
  output=self.root/'release';doc=m.build_release(self.db,output,dict(hosts=['www.pinnacleblooms.org']))
  f=next(f for f in doc['files'] if f['kind']=='pages');file=output/f['path']
  blob=file.read_bytes().replace(b'/autism-therapy',b'/abatherapy');file.write_bytes(blob);f.update(bytes=len(blob),sha256=m.sha(blob))
  doc['release_id']=m.sha(m.dump([(f['path'],f['sha256']) for f in sorted(doc['files'],key=lambda x:x['path'])]));(output/'manifest.json').write_text(json.dumps(doc))
  with self.assertRaisesRegex(ValueError,'Discovery policy excludes'):m.validate_release(output)
  self.assertEqual(m.validate_release(output,current_discovery=False)['page_urls'],1)
 def test_legacy_mirracles_keeps_url_only_parent_and_uses_approved_video_formatter(self):
  urls=['https://www.pinnacleblooms.org/mirracles/example-one','https://www.pinnacleblooms.org/mirracles/example-two']
  self.seed([dict(url=u,family='mirracles',decision='INCLUDE') for u in urls])
  video={'values':dict(title='Actual source title',description='Actual source description',thumbnail_loc='https://images.pinnacleblooms.org/thumb.jpg',content_loc='https://images.pinnacleblooms.org/video.mp4',tag=['source-tag',''])}
  self.db.execute('UPDATE pages SET videos_json=? WHERE url=?',(json.dumps([video]),urls[0]));self.db.commit()
  manifest=m.build_release(self.db,self.root/'release',dict(hosts=['www.pinnacleblooms.org']))
  entry=next(f for f in manifest['files'] if f['kind']=='compatibility_video')
  doc=E.parse(self.root/'release'/entry['path']).getroot();self.assertEqual(len(doc),2)
  videos=doc.findall('.//{'+m.VI+'}video');self.assertEqual(len(videos),1)
  self.assertEqual([e.tag.split('}')[-1] for e in videos[0]][:3],['thumbnail_loc','title','description'])
  self.assertEqual([e.text for e in videos[0].findall('{'+m.VI+'}tag')],['source-tag'])
  self.assertEqual(m.validate_release(self.root/'release')['page_urls'],2)
 def test_resource_qualification_observes_first_redirect_without_following(self):
  calls=[]
  class Handler(BaseHTTPRequestHandler):
   def do_GET(self):
    calls.append(self.path);self.send_response(301 if self.path=='/old' else 200);self.send_header('Location','/final');self.end_headers()
   def log_message(self,*args):pass
  server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
  try:
   with self.assertRaises(urllib.error.HTTPError) as e:source.open_public_source(urllib.request.Request(f'http://127.0.0.1:{server.server_port}/old'))
   self.assertEqual(e.exception.code,301);self.assertEqual(calls,['/old'])
  finally:server.shutdown();server.server_close();thread.join()
 def test_noindex_and_conflicting_canonical_cannot_qualify_public_resource(self):
  for head in ['<meta name="robots" content="noindex,follow">','<link rel="canonical" href="https://www.pinnacleblooms.org/other">']:
   class Response:
    status=200;url='https://www.pinnacleblooms.org/page';headers={'Content-Type':'text/html'}
    def __enter__(self):return self
    def __exit__(self,*args):pass
    def read(self,*args):return ('<html><head><title>Actual title</title>'+head+'</head><body><h1>Page</h1></body></html>').encode()
   with patch.object(source,'open_public_source',return_value=Response()):self.assertFalse(source.public_resource(Response.url)['publication_qualified'])

if __name__=='__main__':unittest.main()
