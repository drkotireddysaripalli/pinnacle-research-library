import copy,html,importlib.util,json,pathlib,sqlite3,tempfile,unittest
HERE=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('ability',HERE/'qualify_observed_ability_uses.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
NOW='2026-10-16T05:10:00+00:00';AT='2026-10-16T05:00:00+00:00'
class Fixture:
    def __init__(self,root,parents=None):
        self.root=pathlib.Path(root);self.parents=parents or ['https://www.pinnacleblooms.org/abs/one','https://www.pinnacleblooms.org/abs/two'];self.pairs=[]
        for n,(parent,q,role) in enumerate([(self.parents[0],1,'question_image'),(self.parents[0],1,'example_image'),(self.parents[1],2,'question_image')]):
            key=f'Ability/{"Questions" if role=="question_image" else "Examples"}/{q}.jpg';self.pairs.append(dict(parent_url=parent,asset_id=m.sha(str(n).encode()),object_key=key,image_url='https://images.pinnacleblooms.org/'+key,question_id=q,assessment_id=100+self.parents.index(parent),role=role))
        raw=b''.join(m.pack(p)+b'\n' for p in self.pairs);(self.root/'pairs.jsonl').write_bytes(raw)
        c={'authorization_status':'AUTHORIZED_FOR_EXACT_PUBLIC_REFERENCE_USE','scope':{'pair_file':'pairs.jsonl','pair_file_sha256':m.sha(raw),'exact_parent_image_pairs':3,'distinct_asset_objects':3,'parent_urls':self.parents,'existing_abs_parents':2,'asset_metadata_sha256':'f'*64}};cb=m.pack(c);(self.root/'reference-publication-consent.json').write_bytes(cb);self.csha=m.sha(cb);index={'consent_file':'reference-publication-consent.json','consent_sha256':self.csha,'parents':[]}
        for n,parent in enumerate(self.parents):
            illustrations=[]
            for p in self.pairs:
                if p['parent_url']!=parent:continue
                illustrations.append({k:p[k] for k in ('asset_id','image_url','object_key','role')}|{'proposed_dom_marker':dict(zip(m.MARKERS,(p['asset_id'],str(p['question_id']),p['role']))),'purpose_alt_suggestion':'Purpose '+p['role'],'authorization':{'consent_sha256':self.csha,'scope_pair_file_sha256':m.sha(raw)}})
            doc={'parent_url':parent,'authorization_ref':{'sha256':self.csha},'section':{'id':m.SECTION,'reference_items':[{'question_id':n+1,'assessment_id':100+n,'illustrations':illustrations}]}};b=m.pack(doc);name=f'parent-{n}.json';(self.root/name).write_bytes(b);index['parents'].append({'parent_url':parent,'manifest_path':name,'sha256':m.sha(b),'bytes':len(b),'image_relationships':len(illustrations)})
        ib=m.pack(index);(self.root/'parent-render-index.json').write_bytes(ib);self.isha=m.sha(ib);self.packet=m.load_packet(self.root,self.csha,self.isha)
    def db(self,owned=()):
        db=sqlite3.connect(':memory:');db.execute('CREATE TABLE pages(url TEXT,canonical_url TEXT,decision TEXT,metadata_json TEXT)')
        for parent in self.parents:
            owners={p['image_url']:{'owners':[m.SOURCE,'unrelated_family_v1'],'source_sha256':{m.SOURCE:'1'*64,'unrelated_family_v1':'2'*64},'retain_unmanaged':True} for i,p in enumerate(self.pairs) if p['parent_url']==parent and i in owned}
            db.execute('INSERT INTO pages VALUES(?,?,?,?)',(parent,parent,'INCLUDE',json.dumps({'managed_image_ownership':owners})))
        return db
    def body(self,parent,include=None,selection=True):
        plan=self.packet['parents'][parent];images=plan['images'];parts=[]
        for asset,p in images.items():
            if include is not None and asset not in include:continue
            attrs=' '.join(k+'="'+html.escape(v,quote=True)+'"' for k,v in p['markers'].items());parts.append(f'<figure {attrs}><img src="{p["image_url"]}" alt="{p["alt"]}"></figure>')
        return (f'<html><head><link rel="canonical" href="{parent}"></head><body><section id="{m.SECTION}" data-source="{m.SOURCE}" data-render-manifest-sha256="{plan["manifest_sha256"]}" data-reference-consent-sha256="{self.csha}" data-observed-set-complete="{str(selection).lower()}">'+''.join(parts)+'</section></body></html>').encode()
    def record(self,parent,body=None):
        b=body if body is not None else self.body(parent)
        return {'page_url':parent,'method':'GET','status':200,'final_url':parent,'content_type':'text/html','publication_qualified':True,'body_complete':True,'observed_at':AT,'credentials_sent':False,'redirects_followed':False,'media_bodies_downloaded':False,'response_headers':{'X-Robots-Tag':[]},'body_hex':b.hex(),'body_sha256':m.sha(b),'body_bytes':len(b)}
    def observations(self,rows=None,complete=True):return {'source':m.SOURCE,'consent_sha256':self.csha,'render_index_sha256':self.isha,'complete_observed_parent_set':complete,'parents':rows if rows is not None else [self.record(p) for p in self.parents]}
    def heads(self):return {p['image_url']:{'url':p['image_url'],'method':'HEAD','status':200,'content_type':'image/jpeg','content_length':'123','delivery_verified':True,'observed_at':AT,'x_robots_tags':[]} for p in self.pairs}
    def run(self,obs=None,heads=None,owned=()):
        db=self.db(owned)
        try:return m.qualify(self.packet,obs or self.observations(),heads if heads is not None else self.heads(),m.feed_state_from_db(db,self.packet),NOW)
        finally:db.close()
class AdapterTests(unittest.TestCase):
    def setUp(self):self.temp=tempfile.TemporaryDirectory(prefix='.ability-fixture-',dir=HERE);self.f=Fixture(self.temp.name)
    def tearDown(self):self.temp.cleanup()
    def test_exact_figure_markers_src_and_feed_shape(self):
        r=self.f.run();self.assertEqual(r['status'],'qualified_complete');self.assertTrue(r['complete_safe_observed_parent_set']);self.assertEqual(len(r['qualified']),3);self.assertEqual(len(r['desired']),3);self.assertEqual(r['withdrawals'],[]);self.assertTrue(all({'page_url','image_url','source_sha256'}<=set(x) for x in r['qualified']))
    def test_packet_hash_and_valid_hash_semantic_tamper_reject(self):
        p=self.f.root/'reference-publication-consent.json';p.write_bytes(p.read_bytes()+b' ')
        with self.assertRaisesRegex(ValueError,'Trusted'):m.load_packet(self.f.root,self.f.csha,self.f.isha)
        self.f=Fixture(self.temp.name);p=self.f.root/'parent-0.json';d=json.loads(p.read_bytes());d['section']['reference_items'][0]['illustrations'][0]['image_url']='https://images.pinnacleblooms.org/Ability/Questions/999.jpg';b=m.pack(d);p.write_bytes(b);index=json.loads((self.f.root/'parent-render-index.json').read_bytes());index['parents'][0].update(sha256=m.sha(b),bytes=len(b));raw=m.pack(index);(self.f.root/'parent-render-index.json').write_bytes(raw)
        with self.assertRaisesRegex(ValueError,'Illustration'):m.load_packet(self.f.root,self.f.csha,m.sha(raw))
    def test_wrong_unknown_duplicate_hidden_and_srcset_use_fail_closed(self):
        parent=self.f.parents[0];base=self.f.body(parent).decode();first=self.f.pairs[0]
        variants=[base.replace(first['image_url'],first['image_url']+'?unknown=1'),base.replace(first['asset_id'],'0'*64),base.replace('<img ','<img srcset="https://other.test/x.jpg 2x" ',1),base.replace('<section ','<section hidden ',1),base.replace('<body>','<body><template>').replace('</body>','</template></body>'),base.replace('</section>',base[base.index('<figure'):base.index('</figure>')+9]+'</section>')]
        for body in variants:
            with self.subTest(body=variants.index(body)):
                obs=self.f.observations([self.f.record(parent,body.encode()),self.f.record(self.f.parents[1])]);r=self.f.run(obs,owned=(0,1,2));self.assertFalse(r['complete_safe_observed_parent_set']);self.assertEqual(r['withdrawals'],[]);self.assertEqual(len(r['desired']),3);self.assertEqual(len(r['qualified']),1)
    def test_complete_set_required_for_source_local_withdrawals(self):
        p=self.f.parents[0];one={self.f.pairs[0]['asset_id']};row=self.f.record(p,self.f.body(p,one));partial=self.f.observations([row],False);r=self.f.run(partial,owned=(0,1,2));self.assertEqual(r['withdrawals'],[]);self.assertEqual(len(r['desired']),3)
        complete=self.f.observations([row,self.f.record(self.f.parents[1])]);r=self.f.run(complete,owned=(0,1,2));self.assertEqual(len(r['withdrawals']),1);self.assertEqual(r['withdrawals'][0]['source'],m.SOURCE);self.assertEqual(r['withdrawals'][0]['operation'],'withdraw_source_ownership');self.assertEqual(len(r['desired']),2);self.assertEqual(r['status'],'source_qualification_held')
        with self.assertRaisesRegex(ValueError,'complete parent'):self.f.run(self.f.observations([row],True))
        r=self.f.run(self.f.observations([self.f.record(p,self.f.body(p,one,False)),self.f.record(self.f.parents[1])]),owned=(0,1,2));self.assertFalse(r['complete_safe_observed_parent_set']);self.assertEqual(r['withdrawals'],[])
    def test_stale_missing_or_bad_hash_evidence_never_removes_prior_use(self):
        for mutate in ('old_parent','old_HEAD','missing_HEAD','bad_body'):
            with self.subTest(mutate=mutate):
                obs=self.f.observations();heads=self.f.heads()
                if mutate=='old_parent':obs['parents'][0]['observed_at']='2026-10-12T00:00:00Z'
                if mutate=='old_HEAD':heads[self.f.pairs[0]['image_url']]['observed_at']='2026-10-12T00:00:00Z'
                if mutate=='missing_HEAD':heads.pop(self.f.pairs[0]['image_url'])
                if mutate=='bad_body':obs['parents'][0]['body_sha256']='0'*64
                r=self.f.run(obs,heads,owned=(0,1,2));self.assertEqual(r['withdrawals'],[]);self.assertEqual(len(r['desired']),3);self.assertGreater(r['counts']['held_pairs'],0)
    def test_raw_robots_aliases_override_positive_delivery_and_parent_flags(self):
        for alias,value in [('x_robots','noindex'),('raw_headers',[['X-Robots-Tag','index'],['x-robots-tag','googlebot: none']]),('raw_header','X-Robots-Tag: noimageindex\n')]:
            with self.subTest(alias=alias):
                heads=self.f.heads();heads[self.f.pairs[0]['image_url']][alias]=value;r=self.f.run(heads=heads,owned=(0,));self.assertEqual(len(r['withdrawals']),1);self.assertEqual(len(r['qualified']),2)
        obs=self.f.observations();obs['parents'][0]['response_headers']={'X-Robots-Tag':['index','none']};r=self.f.run(obs,owned=(0,1,2));self.assertFalse(r['complete_safe_observed_parent_set']);self.assertEqual(r['withdrawals'],[]);self.assertEqual(len(r['qualified']),1)
    def test_unknown_scope_and_incomplete_prior_projection_reject(self):
        obs=self.f.observations();obs['parents'][0]['page_url']='https://www.pinnacleblooms.org/abs/unknown'
        with self.assertRaisesRegex(ValueError,'Unknown'):self.f.run(obs)
        db=self.f.db();state=m.feed_state_from_db(db,self.f.packet);state.pop('prior_owned')
        with self.assertRaisesRegex(ValueError,'projection'):m.qualify(self.f.packet,self.f.observations(),self.f.heads(),state,NOW)
        state=m.feed_state_from_db(db,self.f.packet);state['prior_owned']=[{'page_url':self.f.parents[0],'image_url':'https://images.pinnacleblooms.org/Ability/Questions/999.jpg','source_sha256':'1'*64}]
        with self.assertRaisesRegex(ValueError,'outside'):m.qualify(self.f.packet,self.f.observations(),self.f.heads(),state,NOW)
        db.close()
    def test_fresh_parent_veto_blocks_stale_positive_feed_reconciliation(self):
        parent=self.f.parents[0];body=self.f.body(parent).replace(b'</head>',b'<meta name="robots" content="noindex"></head>');obs=self.f.observations([self.f.record(parent,body),self.f.record(self.f.parents[1])]);r=self.f.run(obs,owned=(0,1,2))
        self.assertFalse(r['can_reconcile']);self.assertEqual(r['parent_vetoes'][parent],'current_parent_robots_or_canonical_veto');self.assertIn(parent,r['reconciliation_parent_vetoes']);self.assertEqual(r['withdrawals'],[]);self.assertEqual(len(r['desired']),3)
        obs['parents'][0]['observed_at']='2026-10-12T00:00:00Z';r=self.f.run(obs,owned=(0,1,2));self.assertTrue(r['can_reconcile']);self.assertEqual(r['parent_vetoes'],{});self.assertEqual(r['withdrawals'],[])
    def test_HTML_canonical_IRI_equivalence_preserves_reserved_and_other_URL_parts(self):
        parent='https://www.pinnacleblooms.org/abs/child%E2%80%99s-balance%E2%80%93guide/step';iri='https://www.pinnacleblooms.org/abs/child’s-balance–guide/step';self.f=Fixture(self.temp.name,[parent,self.f.parents[1]]);base=self.f.body(parent).decode()
        def run(href):
            body=base.replace('href="'+parent+'"','href="'+href+'"');return self.f.run(self.f.observations([self.f.record(parent,body.encode()),self.f.record(self.f.parents[1])]),owned=(0,1,2))
        for href in (iri,parent.replace('%E2','%e2')):
            with self.subTest(accepted=href):
                r=run(href);self.assertEqual(r['status'],'qualified_complete');self.assertTrue(r['can_reconcile']);self.assertEqual(len(r['qualified']),3)
        for href in (iri.replace('guide','changed'),iri.replace('/step','%2Fstep'),iri+'?version=2',iri+'#section',iri.replace('https:','http:'),iri.replace('www.pinnacleblooms.org','WWW.pinnacleblooms.org')):
            with self.subTest(rejected=href):
                r=run(href);self.assertEqual(r['parent_vetoes'][parent],'current_parent_canonical_conflict');self.assertFalse(r['can_reconcile']);self.assertEqual(r['withdrawals'],[])
    def test_current_DB_state_guard_and_other_owner_untouched(self):
        db=self.f.db((0,));before=list(db.execute('SELECT * FROM pages'));state=m.feed_state_from_db(db,self.f.packet);r=m.qualify(self.f.packet,self.f.observations(),self.f.heads(),state,NOW);m.assert_feed_state_unchanged(db,self.f.packet,r);self.assertEqual(before,list(db.execute('SELECT * FROM pages')))
        meta=json.loads(before[0][3]);meta['managed_image_ownership'][self.f.pairs[1]['image_url']]={'owners':[m.SOURCE],'source_sha256':{m.SOURCE:'3'*64}};db.execute('UPDATE pages SET metadata_json=? WHERE url=?',(json.dumps(meta),self.f.parents[0]))
        with self.assertRaisesRegex(ValueError,'changed'):m.assert_feed_state_unchanged(db,self.f.packet,r)
        db.close()
    def test_HEAD_receipt_binding_and_unknown_raw_robots_reject(self):
        p=self.f.root/'heads.jsonl';raw=b''.join(m.pack(r)+b'\n' for r in self.f.heads().values());p.write_bytes(raw);receipt=self.f.root/'head-receipt.json';receipt.write_text(json.dumps({'delivery_receipt_sha256':m.sha(raw),'source_asset_sha256':'f'*64,'media_bodies_downloaded':0}));self.assertEqual(len(m.load_heads(p,receipt,self.f.packet)),3);p.write_bytes(raw+b' ')
        with self.assertRaisesRegex(ValueError,'binding'):m.load_heads(p,receipt,self.f.packet)
        heads=self.f.heads();heads[self.f.pairs[0]['image_url']].pop('x_robots_tags');r=self.f.run(heads=heads,owned=(0,));self.assertEqual(r['withdrawals'],[]);self.assertEqual(len(r['qualified']),2);self.assertEqual(len(r['desired']),3)
if __name__=='__main__':unittest.main()
