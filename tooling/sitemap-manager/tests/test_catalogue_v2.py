import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import subprocess
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import catalogue_v2 as c
import manager


class CatalogueV2Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.data=c.model()
    def tearDown(self):self.tmp.cleanup()
    def database(self):
        db=sqlite3.connect(':memory:');db.execute('PRAGMA foreign_keys=ON');db.executescript(c.ddl(self.data));return db
    def source(self):
        path=self.root/'v1.db';db=manager.connect(path)
        register=self.root/'register.jsonl'
        records=[{'url':'https://www.pinnacleblooms.org/example','family':'Sunshine','decision':'INCLUDE','reason':'http_200_indexable_canonical_supported_by_export','evidence':[]}, {'url':'https://www.pinnacleblooms.org/preview','family':'Centres','decision':'HOLD','reason':'preview','evidence':[]}, {'url':'https://images.pinnacleblooms.org/one.png','family':'Images','decision':'EXCLUDE','reason':'asset_or_discovery_document','evidence':[]}]
        register.write_text(''.join(json.dumps(x)+'\n' for x in records));manager.import_register(db,register)
        row=dict(db.execute("SELECT * FROM pages WHERE decision='INCLUDE'").fetchone());row['title']='An actual source title';row['description']='Actual source description';manager.upsert(db,manager.refresh_digest(row));db.commit();db.close();return path
    def test_schema_has_the_reviewed_tables_and_named_extensions(self):
        self.assertEqual(len(self.data['tables']),31)
        db=self.database();self.assertEqual(db.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'").fetchone()[0],31)
    def test_mysql_does_not_alter_existing_tables_or_database_settings(self):
        ddl=c.ddl(self.data,True)
        self.assertEqual(ddl.count('CREATE TABLE IF NOT EXISTS'),31)
        self.assertNotIn('ALTER TABLE',ddl);self.assertNotIn('DROP TABLE',ddl);self.assertNotIn('FOREIGN KEY (',ddl)
    def test_import_counts_and_pages_are_not_all_address_types(self):
        source=self.source();receipt=c.import_catalogue(source,None,self.root/'v2.db',self.data,{'INCLUDE':1,'HOLD':1,'EXCLUDE':1})
        self.assertTrue(receipt['passed']);self.assertEqual(receipt['table_counts']['pages'],2)
        db=sqlite3.connect(self.root/'v2.db');self.assertEqual(db.execute('SELECT title FROM pages WHERE title IS NOT NULL').fetchone()[0],'An actual source title')
        self.assertEqual(db.execute('SELECT COUNT(*) FROM content_reviews').fetchone()[0],0)
        db.close()
    def test_candidate_image_is_stored_but_not_promoted(self):
        source=self.source();candidate=self.root/'candidate.jsonl'
        candidate.write_text(json.dumps({'page_url':'https://www.pinnacleblooms.org/example','image_url':'https://images.pinnacleblooms.org/new.png','uses':['og_metadata_candidate'],'state':'candidate'})+'\n')
        r=c.import_catalogue(source,candidate,self.root/'v2.db',self.data)
        self.assertEqual(r['table_counts']['assets'],1);self.assertEqual(r['table_counts']['media_uses'],1);self.assertEqual(r['table_counts']['image_sitemap_profiles'],0)
        db=sqlite3.connect(self.root/'v2.db');self.assertIsNone(db.execute('SELECT alt_text FROM media_uses').fetchone()[0])
        db.close()
    def test_count_mismatch_preserves_previous_catalogue(self):
        source=self.source();target=self.root/'v2.db';target.write_bytes(b'previous accepted store')
        with self.assertRaises(ValueError):c.import_catalogue(source,None,target,self.data,{'INCLUDE':100})
        self.assertEqual(target.read_bytes(),b'previous accepted store')
    def test_source_cannot_be_overwritten(self):
        source=self.source()
        with self.assertRaises(ValueError):c.import_catalogue(source,None,source,self.data)
    def test_media_use_cannot_reference_another_assets_rendition(self):
        db=self.database();w=c.Writer(db,self.data)
        p=c.identity('page','one');u=w.url('https://www.pinnacleblooms.org/one')
        w.put('pages',{'page_id':p,'primary_url_id':u,'source_system':'test','source_record_key':'one','module_type':'example','publication_status':'candidate'})
        a,r=w.media('https://images.pinnacleblooms.org/a.png','image','0'*64,'unused')
        b,r2=w.media('https://images.pinnacleblooms.org/b.png','image','0'*64,'unused')
        db.execute('INSERT INTO media_uses(use_id,page_id,asset_id,rendered_rendition_id) VALUES (?,?,?,?)',(c.identity('use','wrong'),p,b,r))
        with self.assertRaises(sqlite3.IntegrityError):db.commit()
    def test_json_and_priority_constraints(self):
        db=self.database()
        with self.assertRaises(sqlite3.IntegrityError):db.execute('INSERT INTO assets(asset_id,descriptive_metadata_json) VALUES (?,?)',('a','broken json'))
        with self.assertRaises(sqlite3.IntegrityError):db.execute('INSERT INTO page_sitemap_profiles(page_profile_id,priority) VALUES (?,?)',('a',1.1))
    def test_polymorphic_unknown_subject_is_rejected_by_validation(self):
        db=self.database();db.execute("INSERT INTO claims(claim_id,subject_kind,subject_id) VALUES ('a','invented','b')")
        self.assertFalse(c.validate(db,self.data)['passed'])
    def test_null_provenance_and_invalid_decision_are_detected(self):
        db=self.database();db.execute("INSERT INTO observations(observation_id) VALUES ('missing')")
        db.execute("INSERT INTO eligibility_decisions(decision_id,decision) VALUES ('bad','APPROVED')")
        r=c.validate(db,self.data);self.assertFalse(r['passed']);self.assertEqual(r['checks']['invalid_eligibility_decisions'],1);self.assertGreater(r['checks']['required_identity_provenance_errors'],0)
    def test_writer_rejects_conflicting_replay(self):
        db=self.database();w=c.Writer(db,self.data)
        row={'asset_id':c.identity('asset','one'),'source_system':'test','source_asset_key':'one','asset_kind':'image','publication_status':'candidate','rights_status':'unknown','name':'One'}
        w.put('assets',row);w.put('assets',row)
        with self.assertRaises(ValueError):w.put('assets',{**row,'name':'Different'})
    def test_candidate_input_cannot_be_the_database_output(self):
        source=self.source();candidate=self.root/'candidates.jsonl';candidate.write_text('{}\n');before=candidate.read_bytes()
        with self.assertRaises(ValueError):c.import_catalogue(source,candidate,candidate,self.data)
        self.assertEqual(candidate.read_bytes(),before)
    def test_cli_receipt_cannot_overwrite_input(self):
        source=self.source();before=c.file_hash(source);target=self.root/'v2.db'
        r=subprocess.run([sys.executable,str(Path(c.__file__)),'import','--legacy-db',str(source),'--db',str(target),'--receipt',str(source)],capture_output=True)
        self.assertNotEqual(r.returncode,0);self.assertEqual(c.file_hash(source),before);self.assertFalse(target.exists())
    def test_active_destination_sidecars_prevent_replacement(self):
        source=self.source();target=self.root/'v2.db';target.write_bytes(b'previous');Path(str(target)+'-wal').write_bytes(b'active')
        with self.assertRaises(ValueError):c.import_catalogue(source,None,target,self.data)
        self.assertEqual(target.read_bytes(),b'previous')
    def test_unmapped_candidate_relationships_are_accounted_and_retained(self):
        source=self.source();candidate=self.root/'candidates.jsonl';candidate.write_text(json.dumps({'page_url':'https://www.pinnacleblooms.org/unmapped','image_url':'https://images.pinnacleblooms.org/unmapped.png'})+'\n')
        r=c.import_catalogue(source,candidate,self.root/'v2.db',self.data)
        self.assertEqual(r['candidate_associations'],{'received':1,'unmapped_parent_stored_as_evidence':1})
        self.assertEqual(r['table_counts']['assets'],1);self.assertEqual(r['table_counts']['media_uses'],0)
    def test_frozen_snapshot_contains_uncheckpointed_committed_wal_data(self):
        source=self.source();live=sqlite3.connect(source);live.execute('PRAGMA journal_mode=WAL')
        live.execute("UPDATE pages SET title='WAL source value' WHERE decision='INCLUDE'");live.commit()
        snap,value=c.frozen_snapshot(source,self.root/'snapshots');readonly=sqlite3.connect('file:'+str(snap)+'?mode=ro',uri=True)
        self.assertEqual(readonly.execute("SELECT title FROM pages WHERE decision='INCLUDE'").fetchone()[0],'WAL source value')
        self.assertEqual(c.file_hash(snap),value);readonly.close();live.close()
    def test_normalized_projection_preserves_eligible_values(self):
        source=self.source();target=self.root/'v2.db';c.import_catalogue(source,None,target,self.data)
        r=c.export_compatible(target,self.root/'projection.db',self.data);self.assertEqual(r['decisions'],{'EXCLUDE':1,'HOLD':1,'INCLUDE':1})
        projected=manager.connect(self.root/'projection.db')
        self.assertEqual(projected.execute("SELECT title FROM pages WHERE decision='INCLUDE'").fetchone()[0],'An actual source title');projected.close()
    def test_acceptance_manifest_cannot_be_output_or_receipt(self):
        source=self.source();manifest=self.root/'job.json';manifest.write_text(json.dumps({'expected_decisions':{'INCLUDE':1,'HOLD':1,'EXCLUDE':1}}));before=manifest.read_bytes()
        for output,receipt in [(manifest,self.root/'receipt.json'),(self.root/'v2.db',manifest)]:
            r=subprocess.run([sys.executable,str(Path(c.__file__)),'import','--legacy-db',str(source),'--db',str(output),'--receipt',str(receipt),'--expected-decisions',str(manifest)],capture_output=True)
            self.assertNotEqual(r.returncode,0);self.assertEqual(manifest.read_bytes(),before)
    def test_ambiguous_projection_cannot_restore_old_eligibility(self):
        source=self.source();target=self.root/'v2.db';c.import_catalogue(source,None,target,self.data)
        db=sqlite3.connect(target);cols=[x[1] for x in db.execute('PRAGMA table_info(eligibility_decisions)')]
        row=dict(zip(cols,db.execute("SELECT * FROM eligibility_decisions WHERE decision='INCLUDE'").fetchone()));row.update(decision_id=c.identity('decision','another'),decision='EXCLUDE')
        db.execute('INSERT INTO eligibility_decisions ('+','.join(cols)+') VALUES ('+','.join('?' for _ in cols)+')',[row[k] for k in cols]);db.commit();db.close()
        projection=self.root/'projection.db';projection.write_bytes(b'accepted prior projection')
        with self.assertRaises(ValueError):c.export_compatible(target,projection,self.data)
        self.assertEqual(projection.read_bytes(),b'accepted prior projection')
    def test_public_cms_media_stays_candidate_and_accounts_for_unmapped_parent(self):
        source=self.source();target=self.root/'v2.db';c.import_catalogue(source,None,target,self.data)
        cms=self.root/'cms.json';cms.write_text(json.dumps({'date':'2026-10-13','scope':'Public module metadata','row_count':2,'rows':[{'source_table':'sunshine','source_id':1,'image_field':'https://images.pinnacleblooms.org/new.png','parent_url':'https://www.pinnacleblooms.org/example'},{'source_table':'faq','source_id':2,'image_field':'relative-or-unparsed'}]}))
        r=c.import_public_media(target,cms,self.data)
        self.assertEqual(r['accounting']['received'],2);self.assertEqual(r['accounting']['exact_parent_relationships'],1);self.assertEqual(r['accounting']['unparsed_field_retained_in_source'],1);self.assertEqual(r['table_counts']['image_sitemap_profiles'],0)
    def test_public_cms_scope_rejects_care_tables(self):
        source=self.source();target=self.root/'v2.db';c.import_catalogue(source,None,target,self.data)
        cms=self.root/'cms.json';cms.write_text(json.dumps({'date':'2026-10-13','scope':'Wrong source','row_count':1,'rows':[{'source_table':'private_assessment_responses','image_field':'https://example.org/one.png'}]}))
        with self.assertRaises(ValueError):c.import_public_media(target,cms,self.data)
    def test_address_safety_preserves_case_and_distinguishes_call_links(self):
        self.assertEqual(c.address('https://EXAMPLE.org/A?B=1'),'https://example.org/A?B=1')
        self.assertEqual(c.address('tel:+919100181181'),'tel:+919100181181')
        for value in ['javascript:alert(1)','https://user:secret@example.org/','tel:not-a-number']:
            with self.assertRaises(ValueError):c.address(value)


    def test_relative_resolution_preserves_original_and_internal_slashes(self):
        source=self.root/'cms.json';evidence=self.root/'evidence.json';evidence.write_text('{"origin":"https://www.pinnacleblooms.org"}')
        source.write_text(json.dumps({'date':'2026-10-13','scope':'dedicated public media only','row_count':2,'rows':[{'source_table':'guru','source_id':1,'image_field':'/Assets/PUBLISHIMAGE//a.jpg','parent_url':'/guru/one'},{'source_table':'faq','source_id':2,'image_field':'https://cdn.example/b.jpg'}]}))
        out=self.root/'resolved.json';r=c.resolve_relative_media(source,'https://www.pinnacleblooms.org/',evidence,out);d=json.loads(out.read_text())
        self.assertEqual(r['resolved_rows'],1);self.assertEqual(d['rows'][0]['image_field'],'https://www.pinnacleblooms.org/Assets/PUBLISHIMAGE//a.jpg')
        self.assertEqual(d['rows'][0]['original_image_field'],'/Assets/PUBLISHIMAGE//a.jpg');self.assertFalse(d['publishedEligibilityProven']);self.assertEqual(d['source_raw_sha256'],c.file_hash(source))
    def test_relative_resolution_rejects_ambiguous_origin_and_alias(self):
        source=self.root/'cms.json';source.write_text(json.dumps({'date':'2026-10-13','scope':'public','row_count':0,'rows':[]}));evidence=self.root/'evidence.json';evidence.write_text('{}')
        for origin in ('http://www.pinnacleblooms.org/','https://www.pinnacleblooms.org/assets/','https://www.pinnacleblooms.org/#guess'):
            with self.assertRaises(ValueError):c.resolve_relative_media(source,origin,evidence,self.root/'output.json')
        before=source.read_bytes()
        with self.assertRaises(ValueError):c.resolve_relative_media(source,'https://www.pinnacleblooms.org/',evidence,source)
        self.assertEqual(source.read_bytes(),before)
    def test_normalized_sql_export_is_bounded_and_hashed(self):
        source=self.source();db=self.root/'v2.db';c.import_catalogue(source,None,db,self.data)
        out=self.root/'sql';r=c.export_mysql_v2(db,out,self.data,batch_size=1,max_bytes=32768);manifest=json.loads((out/'manifest.json').read_text())
        self.assertEqual(r['tables'],31);self.assertFalse(r['native_synchronized']);self.assertEqual(len(manifest['tables']),31)
        self.assertEqual(sum(t['rows'] for t in manifest['tables']),r['rows'])
        self.assertEqual(manifest['approved_schema_sha256'],c.digest(c.ddl(self.data,True)))
        for batch in manifest['batches']:
            body=(out/batch['path']).read_bytes();self.assertEqual(c.digest(body),batch['sha256']);self.assertLessEqual(len(body),32768);self.assertEqual(batch['rows'],1)
            self.assertTrue(body.startswith(b'INSERT INTO `website_sm2_'));self.assertNotIn(b'DROP ',body)
        with self.assertRaises(ValueError):c.export_mysql_v2(db,out,self.data)
    def test_invalid_source_cannot_make_an_export(self):
        source=self.source();db=self.root/'v2.db';c.import_catalogue(source,None,db,self.data)
        con=sqlite3.connect(db);con.execute("UPDATE eligibility_decisions SET decision='INVENTED' WHERE channel='page_sitemap'");con.commit();con.close()
        out=self.root/'sql'
        with self.assertRaises(ValueError):c.export_mysql_v2(db,out,self.data)
        self.assertFalse(out.exists())


if __name__=='__main__':unittest.main()
