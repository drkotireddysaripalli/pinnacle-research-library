import datetime as dt
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest
import xml.etree.ElementTree as E

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import manager as m
import catalogue_v2 as c
import normalized_profiles as n


class ProfilesTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.db=m.connect(self.root/'v1.db');self.policy={'hosts':['www.example.com'],'news_as_of':'2026-10-13T12:00:00Z'}
        source=self.root/'pages.jsonl';source.write_text(json.dumps({'url':'https://www.example.com/article','family':'News','decision':'INCLUDE'})+'\n');m.import_register(self.db,source)
    def tearDown(self):self.db.close();self.tmp.cleanup()
    def attach(self,key,profile):
        row=dict(self.db.execute('SELECT * FROM pages').fetchone());metadata=json.loads(row['metadata_json']);metadata[key]=profile;row['metadata_json']=m.dump(metadata);m.upsert(self.db,m.refresh_digest(row));self.db.commit()
    def news(self,**kw):
        return dict({'qualifies_as_news':1,'source_evidence_id':'reviewed-source','source_version_sha256':'a'*64,'publication_name':'Example News','publication_language':'en','article_title':'Original article title','original_publication_value':'2026-10-12T14:00:00Z'},**kw)
    def test_optional_core_fields_emit_zero_without_defaulting_unknowns(self):
        self.attach('sitemap_profile',{'priority':0,'change_frequency':'never','source_evidence_id':'reviewed-source','source_version_sha256':'a'*64})
        result=m.build_release(self.db,self.root/'release',self.policy);leaf=next(f for f in result['files'] if f['kind']=='pages');xml=E.parse(self.root/'release'/leaf['path']).getroot()
        self.assertEqual(xml[0].find('{'+m.SM+'}priority').text,'0');self.assertEqual(xml[0].find('{'+m.SM+'}changefreq').text,'never');self.assertTrue(m.validate_release(self.root/'release')['valid'])
    def test_optional_core_fields_reject_invalid_or_unversioned_values(self):
        for changes in ({'priority':float('nan')},{'priority':1.1},{'change_frequency':'sometimes'},{'source_evidence_id':None}):
            with self.assertRaises(ValueError):m.optional_page_profile({**{'priority':0.5,'source_evidence_id':'e','source_version_sha256':'a'*64},**changes})
    def test_index_date_requires_matching_public_bytes_and_receipt(self):
        first=m.build_release(self.db,self.root/'release',self.policy);leaf=next(f for f in first['files'] if f['kind']=='pages')
        policy={**self.policy,'published_file_modifications':{leaf['public_url']:{'content_sha256':leaf['sha256'],'lastmod':'2026-10-12','state':'public_verified','receipt':'verified-public-receipt'}}}
        result=m.build_release(self.db,self.root/'release',policy);index=next(f for f in result['files'] if f['kind']=='index');self.assertEqual(E.parse(self.root/'release'/index['path']).getroot()[0].find('{'+m.SM+'}lastmod').text,'2026-10-12')
        policy['published_file_modifications'][leaf['public_url']]['content_sha256']='b'*64
        result=m.build_release(self.db,self.root/'release',policy);self.assertIsNone(E.parse(self.root/'release'/index['path']).getroot()[0].find('{'+m.SM+'}lastmod'))
    def test_qualified_news_is_connected_and_stale_future_evergreen_are_omitted(self):
        self.attach('news_profile',self.news());r=m.build_release(self.db,self.root/'release',self.policy);self.assertEqual(len([f for f in r['files'] if f['kind']=='news']),1);self.assertTrue(m.validate_release(self.root/'release')['valid'])
        for changes in ({'original_publication_value':'2026-10-10T00:00:00Z'},{'original_publication_value':'2026-10-14T00:00:00Z'},{'qualifies_as_news':0}):
            self.attach('news_profile',self.news(**changes));r=m.build_release(self.db,self.root/'release',self.policy);self.assertFalse(any(f['kind']=='news' for f in r['files']))
    def test_news_requires_supported_language_real_identity_and_original_date(self):
        for changes in ({'publication_language':'english'},{'publication_name':''},{'original_publication_value':'yesterday'},{'source_version_sha256':''}):
            with self.assertRaises(ValueError):m.news_element(self.news(**changes),self.policy['news_as_of'])
    def test_news_shards_never_exceed_1000_articles(self):
        row=dict(self.db.execute('SELECT * FROM pages').fetchone());metadata=json.loads(row['metadata_json']);metadata['news_profile']=self.news()
        for i in range(1001):
            item={**row,'url':'https://www.example.com/article/'+str(i),'url_hash':m.sha('https://www.example.com/article/'+str(i)),'canonical_url':'https://www.example.com/article/'+str(i),'metadata_json':m.dump(metadata)};m.upsert(self.db,m.refresh_digest(item))
        self.db.commit();r=m.build_release(self.db,self.root/'release',self.policy);parts=[f for f in r['files'] if f['kind']=='news'];self.assertEqual(sum(f['entries'] for f in parts),1001);self.assertTrue(all(f['entries']<=1000 for f in parts));self.assertTrue(m.validate_release(self.root/'release')['valid'])
    def normalized(self):
        self.db.commit();dest=self.root/'v2.db';c.import_catalogue(self.root/'v1.db',None,dest,c.model());db=sqlite3.connect(dest);db.row_factory=sqlite3.Row;return dest,db
    def test_candidates_are_rejected_even_if_an_output_profile_is_added(self):
        dest,db=self.normalized();w=c.Writer(db,c.model());pid=db.execute('SELECT page_id FROM pages').fetchone()[0]
        sid=db.execute('SELECT import_id FROM source_imports').fetchone()[0];aid,rid=w.media('https://cdn.example/image.jpg','image','b'*64,sid);obs=w.observation(sid,'asset',aid,'candidate_image',{},'b'*64);uid=w.use(pid,aid,rid,'candidate_image',obs,'b'*64,'candidate_not_approved_for_sitemap')
        w.put('image_sitemap_profiles',{'image_profile_id':c.identity('profile','candidate'),'media_use_id':uid,'rendition_id':rid,'source_evidence_id':obs,'source_version_sha256':'b'*64});db.commit()
        with self.assertRaises(ValueError):n.collect(db)
        db.close()
    def test_profile_version_must_match_its_evidence(self):
        dest,db=self.normalized();pid=db.execute('SELECT page_id FROM pages').fetchone()[0];eid=db.execute('SELECT observation_id FROM observations').fetchone()[0]
        db.execute('INSERT INTO page_sitemap_profiles(page_profile_id,page_id,priority,source_evidence_id,source_version_sha256) VALUES (?,?,?,?,?)',('a'*64,pid,0.5,eid,'b'*64));db.commit()
        with self.assertRaises(ValueError):n.collect(db)
        db.close()
    def test_approved_image_requires_current_page_rights_and_unique_channel_decision(self):
        dest,db=self.normalized();w=c.Writer(db,c.model());pid=db.execute('SELECT page_id FROM pages').fetchone()[0];version='b'*64
        db.execute("UPDATE pages SET publication_status='published',content_version_sha256=? WHERE page_id=?",(version,pid))
        sid=db.execute('SELECT import_id FROM source_imports').fetchone()[0];aid,rid=w.media('https://cdn.example/image.jpg','image',version,sid);db.execute("UPDATE assets SET rights_status='owned' WHERE asset_id=?",(aid,));obs=w.observation(sid,'asset',aid,'approved_page_use',{},version);uid=w.use(pid,aid,rid,'image',obs,version,'approved_public_use');db.execute('UPDATE media_uses SET page_content_version_sha256=? WHERE use_id=?',(version,uid))
        w.put('image_sitemap_profiles',{'image_profile_id':c.identity('profile','approved'),'media_use_id':uid,'rendition_id':rid,'source_evidence_id':obs,'source_version_sha256':version});db.commit()
        with self.assertRaises(ValueError):n.collect(db)
        w.put('eligibility_decisions',{'decision_id':c.identity('decision','approved'),'subject_kind':'media_use','subject_id':uid,'channel':'image_sitemap','decision':'INCLUDE','reason_code':'verified_public_use','policy_version':'test','source_version_sha256':version,'evidence_id':obs,'decided_at':w.now});db.commit()
        self.assertEqual(n.collect(db)['images'][pid],[{'loc':'https://cdn.example/image.jpg'}])
        db.execute("UPDATE assets SET rights_status='unknown' WHERE asset_id=?",(aid,));db.commit()
        with self.assertRaises(ValueError):n.collect(db)
        db.close()
    def test_all_video_optional_values_and_three_attributes_flow_from_normalized_storage(self):
        values={'thumbnail_loc':'https://www.example.com/thumb.jpg','title':'Source title','description':'Source description','content_loc':'https://cdn.example/video.mp4','player_loc':'https://www.example.com/embed/one','duration':'180','expiration_date':'2027-01-01','rating':'4.5','view_count':'12','publication_date':'2026-10-12','family_friendly':'yes','requires_subscription':'no','live':'no','tag':['A','B'],'restriction':{'text':'IN US','attributes':{'relationship':'allow'}},'platform':{'text':'web mobile','attributes':{'relationship':'allow'}},'uploader':{'text':'Publisher','attributes':{'info':'https://www.example.com/about'}}}
        row=dict(self.db.execute('SELECT * FROM pages').fetchone());row['videos_json']=m.dump([{'values':values}]);m.upsert(self.db,m.refresh_digest(row));self.db.commit();dest,db=self.normalized();profiles=n.collect(db);pid=db.execute('SELECT page_id FROM pages').fetchone()[0]
        element=m.video_element(profiles['videos'][pid][0],[],'https://www.example.com/article');self.assertEqual({e.tag.split('}')[-1] for e in element},set(m.VIDEO_FIELDS));self.assertEqual(element.find('{'+m.VI+'}uploader').attrib['info'],values['uploader']['attributes']['info']);self.assertEqual(element.find('{'+m.VI+'}restriction').attrib['relationship'],'allow');self.assertEqual(element.find('{'+m.VI+'}platform').attrib['relationship'],'allow');db.close()
    def test_normalized_pipeline_is_reproducible_and_keeps_private_data_out(self):
        dest,db=self.normalized();db.close();policy=self.root/'policy.json';policy.write_text(json.dumps(self.policy))
        a=c.build_normalized(dest,self.root/'a.db',policy,self.root/'release-a',c.model());b=c.build_normalized(dest,self.root/'b.db',policy,self.root/'release-b',c.model());self.assertEqual(a['release_id'],b['release_id']);self.assertFalse(a['public_deployed']);self.assertFalse(list((self.root/'release-a').rglob('*.db')))
        with self.assertRaises(ValueError):c.build_normalized(dest,self.root/'release-a'/'private.db',policy,self.root/'release-a',c.model())
    def test_approved_hreflang_is_not_lost_in_the_import_projection(self):
        record=self.root/'two.jsonl';record.write_text('\n'.join(json.dumps({'url':url,'family':'News','decision':'INCLUDE'}) for url in ('https://www.example.com/en','https://www.example.com/te')));m.import_register(self.db,record,snapshot=True)
        values=[{'language':'en','url':'https://www.example.com/en'},{'language':'te','url':'https://www.example.com/te'}]
        for item in self.db.execute("SELECT * FROM pages WHERE decision='INCLUDE'").fetchall():
            row=dict(item);metadata=json.loads(row['metadata_json']);metadata['alternates']=values;row['metadata_json']=m.dump(metadata);m.upsert(self.db,m.refresh_digest(row))
        self.db.commit();dest,db=self.normalized();db.close();projection=self.root/'projection.db';c.export_compatible(dest,projection,c.model(),True);target=m.connect(projection)
        try:r=m.build_release(target,self.root/'release',self.policy);self.assertTrue(m.validate_release(self.root/'release')['valid'])
        finally:target.close()
        public=''.join((self.root/'release'/f['path']).read_text() for f in r['files'] if f['kind']=='pages');self.assertEqual(public.count('hreflang="en"'),2);self.assertEqual(public.count('hreflang="te"'),2)


if __name__=='__main__':unittest.main()
