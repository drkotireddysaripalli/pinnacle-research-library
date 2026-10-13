"""Apply reviewed current public media to the existing normalized catalogue.

The input is a reviewed, hash-pinned publication projection prepared under the
site owner's explicit authorization. Storage inventory alone cannot create it.
"""
from __future__ import annotations

import argparse
import collections
import json
from pathlib import Path
import re
import sqlite3
import urllib.parse
import csv

import catalogue_v2 as c
from r2_reconcile import package


def review_snapshot(job_path, output):
    """Prepare explicit metadata selections from pinned public-use evidence."""
    job_path, output = Path(job_path), Path(output)
    job = json.loads(job_path.read_text()); refs = job['inputs']; paths = {}
    required = {'candidates','publisher_manifest','html_snapshot','eligible_pages','frontend_references','frontend_heads','curated_heads','authorization'}
    if set(refs) != required: raise ValueError('Incomplete publication review job')
    for role, ref in refs.items():
        path = Path(ref['path']); c.disjoint_paths(job_path, output, path)
        if c.file_hash(path) != ref['sha256']: raise ValueError('Publication review source hash mismatch: '+role)
        paths[role] = path
    files = package(paths['publisher_manifest'],refs['publisher_manifest']['sha256'])
    publisher_observed = json.loads(files['SUMMARY.json'].read_text())['observed_to']
    curated_observed = json.loads(files['curation-and-render-contract.json'].read_text())['observedAt']
    with files['public-answer-publisher-metadata.csv'].open(newline='',encoding='utf-8-sig') as f:
        publisher = {c.address(r['canonical']):r for r in csv.DictReader(f)}
    with paths['eligible_pages'].open(newline='',encoding='utf-8-sig') as f:
        eligible = {c.address(r['page_url']) for r in csv.DictReader(f)}
    authorization = json.loads(paths['authorization'].read_text())
    if authorization.get('scope') != 'current_public_sitemap_references' or not authorization.get('direct_user_request'):
        raise ValueError('Publication authorization scope absent')
    def readlines(path):
        with path.open(encoding='utf-8') as f:
            for line in f: yield json.loads(line)
    html = {r['page_url']:r for r in readlines(paths['html_snapshot'])}
    heads = {c.address(r['source_image_url']):r for r in readlines(paths['frontend_heads'])}
    frontend = json.loads(paths['frontend_references'].read_text())
    curated = {c.address(r['url']):r for r in json.loads(paths['curated_heads'].read_text())}
    rows = []; seen = set(); counters = collections.Counter(); topic_images = collections.defaultdict(list)
    permission = 'Direct site-owner authorization for sitemap references to currently published public media; no redistribution licence or storage-only rights inference.'

    def add_image(parent, rendered, selected, version, system, key, kind, observed, evidence, alt=None):
        pair = (parent,c.address(selected))
        if parent not in eligible or pair in seen: return
        row = {'page_url':parent,'media_url':c.address(rendered),'selected_rendition_url':c.address(selected),
               'page_content_version_sha256':version,'media_kind':'image','asset_source_system':system,
               'asset_source_key':key,'public_use_basis':kind,'observed_at':observed,
               'rights_status':'owned' if kind=='audited_current_public_answer_renderer' else 'permission_recorded',
               'rights_evidence':'Founder explicitly states he created every Ask question image; current renderer and public state verified.' if kind=='audited_current_public_answer_renderer' else permission,
               'asset_evidence':evidence,'alt_text':alt}
        rows.append(row);seen.add(pair);topic_images[parent].append(row)
    candidates = list(readlines(paths['candidates']))
    answer_seen = set()
    for row in candidates:
        parent = c.address(row['page_url'])
        if row['media_role']=='ask_renderer_png_candidate':
            p = publisher.get(parent)
            if not p or p['indexable'].lower()!='true' or p['public_state']!='published-public':
                counters['ask_publication_holds']+=1;continue
            address = c.address(p['rendered_image_url']); runtime = p['image_delivery']=='runtime-generated-editorial-card'
            if runtime and not (curated.get(address,{}).get('status')==200 and curated[address]['content_type'].startswith('image/')):
                counters['curated_image_unverified']+=1;continue
            if address != c.address(row['media_url']):
                counters['ask_renderer_override_requires_selection']+=1;continue
            add_image(parent,address,address,p['effective_source_fingerprint'],
                      'public_answer_runtime' if runtime else 'cloudflare_r2',
                      address if runtime else row['bucket']+'/'+row['object_key'],
                      'audited_current_public_answer_renderer',publisher_observed,
                      {'publisher':p,'r2':None if runtime else row,'input_source':'audited public renderer + exact publisher content fingerprint'})
            answer_seen.add(parent)
        elif row.get('media_kind')=='image':
            add_image(parent,row['media_url'],row['source_image_url'],row['page_content_version_sha256'],
                      'cloudflare_r2',row['bucket']+'/'+row['object_key'],'current_public_dom',row['observed_at'],row,
                      (row.get('placements') or [{}])[0].get('alt'))
    # Maintained editorial answers are separate from database answer shards.
    for parent,p in publisher.items():
        if parent in answer_seen or parent not in eligible or p['indexable'].lower()!='true':continue
        if p['image_delivery'] not in ('shared-default','runtime-generated-editorial-card'):continue
        address=c.address(p['rendered_image_url']);head=curated.get(address,{})
        if head.get('status')!=200 or not head.get('content_type','').startswith('image/'):continue
        add_image(parent,address,address,p['effective_source_fingerprint'],'public_answer_runtime',address,
                  'audited_current_public_answer_renderer',curated_observed,{'publisher':p,'head':head})
    for origin, uses in frontend.items():
        head = heads.get(c.address(origin),{})
        if not head.get('image_served'):counters['frontend_unavailable_sources']+=1;continue
        for use in uses:
            parent=c.address(use['page_url']);page=html[parent]
            if not page['publication_qualified'] or page.get('noimageindex'):continue
            add_image(parent,use['rendered_url'],origin,use['page_content_version_sha256'],
                      'public_portal_asset',c.address(origin),'current_public_dom',page['observed_at'],
                      {'head':head,'placement':use['placement'],'page_body_sha256':page['body_sha256']},use['placement'].get('alt'))
    for row in candidates:
        if row.get('media_kind')!='video':continue
        parent=c.address(row['page_url']);choices=topic_images[parent]
        if not choices:raise ValueError('Real video has no verified relevant thumbnail: '+parent)
        choices=sorted(choices,key=lambda r: (not r['selected_rendition_url'].lower().endswith('-001.jpg'),r['selected_rendition_url']))
        title = re.split(r'\s*\|\s*Pinnacle Blooms',row['page_title'],maxsplit=1)[0].strip()
        if len(title)>100:title=title[:100].rsplit(' ',1)[0]
        description=row['page_description'].strip()
        basis='current_public_page_meta_description'
        if not description:
            description='Educational video associated with '+title+'. Read the linked Pinnacle Blooms Network resource page for context.'
            basis='publisher_authored_factual_association_description';counters['video_descriptions_authored']+=1
        if len(description)>2048:description=description[:2048].rsplit(' ',1)[0]
        rows.append({'page_url':parent,'media_url':row['media_url'],'selected_rendition_url':row['media_url'],
                     'page_content_version_sha256':row['page_content_version_sha256'],'media_kind':'video',
                     'asset_source_system':'cloudflare_r2','asset_source_key':row['bucket']+'/'+row['object_key'],
                     'rights_status':'permission_recorded','rights_evidence':permission,
                     'public_use_basis':'current_public_dom','observed_at':row['observed_at'],'asset_evidence':row,
                     'video':{'title':title,'description':description,'thumbnail_loc':choices[0]['selected_rendition_url']},
                     'metadata_selection':{'title':'current_public_resource_page_title','description':basis,
                                           'thumbnail':'publisher_selected_relevant_image_already_on_same_public_page',
                                           'thumbnail_is_claimed_video_frame':False,
                                           'unverified_generated_dates_durations_views_omitted':True}})
    for role,path in paths.items():
        if c.file_hash(path)!=refs[role]['sha256']:raise ValueError('Publication review source changed: '+role)
    package(paths['publisher_manifest'],refs['publisher_manifest']['sha256'])
    rows.sort(key=lambda r: (r['media_kind']=='video',r['page_url'],r['selected_rendition_url']))
    result={'format':'pinnacle-reviewed-public-media-v1','scope':'Current indexable baseline pages; real rendered media and legitimate source/owner-authorized reference permissions only.',
            'observed_at':publisher_observed,'authorization_evidence_sha256':refs['authorization']['sha256'],
            'source_hashes':{k:r['sha256'] for k,r in refs.items()},'row_count':len(rows),'rows':rows}
    output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
    return {'reviewed_source_sha256':c.file_hash(output),'rows':len(rows),'images':sum(r['media_kind']=='image' for r in rows),
            'videos':sum(r['media_kind']=='video' for r in rows),'pages':len({r['page_url'] for r in rows}),
            'selection_accounting':dict(counters),'public_deployment_verified':False}


def apply(database, source, expected):
    source = Path(source)
    c.disjoint_paths(database, source)
    if c.file_hash(source) != expected:
        raise ValueError('Reviewed public-media input hash mismatch')
    doc = json.loads(source.read_text())
    if doc.get('format') != 'pinnacle-reviewed-public-media-v1' or doc.get('row_count') != len(doc.get('rows', [])):
        raise ValueError('Incomplete reviewed public-media input')
    if not doc.get('authorization_evidence_sha256') or not doc.get('source_hashes'):
        raise ValueError('Missing publication authority/source evidence')
    rows = doc['rows']; pages = {}
    for row in rows:
        parent = c.address(row['page_url']); version = row['page_content_version_sha256']
        if not re.fullmatch('[a-f0-9]{64}', version): raise ValueError('Unproved page content version')
        prior = pages.get(parent)
        if prior and prior != version: raise ValueError('Conflicting current page content versions')
        pages[parent] = version
        if row['rights_status'] not in ('owned', 'licensed', 'permission_recorded', 'public_domain') or not row.get('rights_evidence'):
            raise ValueError('Unproved public media rights/reference permission')
        if row['media_kind'] not in ('image', 'video') or row.get('public_use_basis') not in ('current_public_dom', 'audited_current_public_answer_renderer'):
            raise ValueError('Unproved current rendered media use')
        if row['media_kind'] == 'video':
            profile = row['video']
            if not profile.get('thumbnail_loc') or not profile.get('title') or not profile.get('description'):
                raise ValueError('Video lacks required real metadata')
            if len(profile['title']) > 100 or len(profile['description']) > 2048:
                raise ValueError('Video metadata exceeds supported limits')
        for value in (row['media_url'], row['selected_rendition_url']):
            parsed = urllib.parse.urlsplit(value)
            if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
                raise ValueError('Invalid stable public media address')
        if row['media_kind'] == 'video':
            parsed = urllib.parse.urlsplit(row['video']['thumbnail_loc'])
            if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
                raise ValueError('Invalid selected public video thumbnail')
    db = sqlite3.connect(database); db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON'); counts = collections.Counter()
    try:
        db.execute('BEGIN IMMEDIATE')
        eligible = {r[0] for r in db.execute("SELECT u.url FROM url_registry u JOIN eligibility_decisions e ON e.subject_id=u.url_id WHERE u.is_current=1 AND e.subject_kind='url' AND e.channel='page_sitemap' AND e.decision='INCLUDE'")}
        if not set(pages) <= eligible: raise ValueError('Reviewed media includes a held or unknown page')
        parent_ids = {r['url']: r['page_id'] for r in db.execute('SELECT u.url,p.page_id FROM pages p JOIN url_registry u ON u.url_id=p.primary_url_id')}
        if not set(pages) <= set(parent_ids): raise ValueError('Reviewed media parent missing from catalogue')
        writer = c.Writer(db, c.model()); sid = c.identity('source-import', 'reviewed-public-media', expected)
        writer.put('source_imports', dict(import_id=sid, source_type='reviewed_current_public_media',
                   source_scope=doc['scope'], input_sha256=expected, source_observed_at=doc['observed_at'],
                   imported_at=writer.now, expected_rows=len(rows), received_rows=len(rows),
                   completeness_state='explicit_reviewed_current_public_uses', raw_artifact_reference=str(source.resolve())))
        for parent, version in pages.items():
            pid = parent_ids[parent]
            # Retain prior uses/evidence. Only this adapter's superseded active
            # publication projections are removed; raw inventory is untouched.
            for table in ('image_sitemap_profiles', 'video_sitemap_profiles'):
                db.execute('DELETE FROM '+table+" WHERE media_use_id IN (SELECT use_id FROM media_uses WHERE page_id=? AND role LIKE 'reviewed_public:%')", (pid,))
            db.execute("UPDATE media_uses SET publication_state='superseded_public_use' WHERE page_id=? AND role LIKE 'reviewed_public:%'", (pid,))
            db.execute("UPDATE pages SET content_version_sha256=?,publication_status='published_public' WHERE page_id=?", (version,pid))
        profiled_images = set()

        def rendition(aid, address, kind, evidence, original=False):
            uid = writer.url(address, kind+'_public_reference')
            rid = c.identity('rendition', aid, uid, 'reviewed-public-reference')
            writer.put('asset_renditions', dict(rendition_id=rid, asset_id=aid, url_id=uid,
                       rendition_kind='documented_transform_reference' if '/cdn-cgi/image/' in urllib.parse.urlsplit(address).path else 'verified_public_reference',
                       representation_key='reviewed-public-reference', first_seen_at=writer.now, last_seen_at=writer.now))
            return rid

        for row in rows:
            parent = c.address(row['page_url']); pid = parent_ids[parent]
            version = row['page_content_version_sha256']; kind = row['media_kind']
            system = row['asset_source_system']; key = row['asset_source_key']
            aid = c.identity('reviewed-asset', system, key, kind)
            if db.execute('SELECT 1 FROM assets WHERE asset_id=?',(aid,)).fetchone():
                db.execute("UPDATE assets SET publication_status='approved_public_reference',rights_status=? WHERE asset_id=?",(row['rights_status'],aid))
            else:
                writer.put('assets',dict(asset_id=aid,source_system=system,source_asset_key=key,
                           asset_kind=kind,publication_status='approved_public_reference',rights_status=row['rights_status'],
                           descriptive_metadata_json={'rights_evidence':row['rights_evidence'],'source':row.get('asset_evidence',{})}))
            evidence = writer.observation(sid,'asset',aid,'reviewed_public_media_use',row,version,row['observed_at'])
            selected = rendition(aid,row['selected_rendition_url'],kind,evidence,True)
            rendered = selected if c.address(row['media_url']) == c.address(row['selected_rendition_url']) else rendition(aid,row['media_url'],kind,evidence)
            use = c.identity('reviewed-media-use',pid,aid,rendered,version)
            placement = c.identity('reviewed-placement',pid,aid,rendered,version)
            use_row = dict(use_id=use,page_id=pid,asset_id=aid,rendered_rendition_id=rendered,
                           slot_key='reviewed_public:'+rendered,role='reviewed_public:'+kind,
                           alt_text=row.get('alt_text'),page_content_version_sha256=version,evidence_id=evidence,
                           publication_state='approved_public_use',placement_identity_sha256=placement,
                           placement_basis=row['public_use_basis'])
            if db.execute('SELECT 1 FROM media_uses WHERE use_id=?',(use,)).fetchone():
                db.execute("UPDATE media_uses SET publication_state='approved_public_use',evidence_id=? WHERE use_id=?",(evidence,use))
            else: writer.put('media_uses',use_row)
            channel = kind+'_sitemap'
            decision = c.identity('reviewed-decision',use,channel,version)
            prior_decision = db.execute('SELECT decision,subject_id,source_version_sha256 FROM eligibility_decisions WHERE decision_id=?',(decision,)).fetchone()
            if prior_decision:
                if tuple(prior_decision) != ('INCLUDE',use,version): raise ValueError('Conflicting publication decision')
            else:
                writer.put('eligibility_decisions',dict(decision_id=decision,subject_kind='media_use',subject_id=use,
                           channel=channel,decision='INCLUDE',reason_code='explicit_current_public_use_authorized',
                           policy_version='reviewed-public-media-v1',source_version_sha256=version,evidence_id=evidence,decided_at=writer.now))
            if kind == 'image':
                pair = (pid,c.address(row['selected_rendition_url']))
                if pair not in profiled_images:
                    writer.put('image_sitemap_profiles',dict(image_profile_id=c.identity('reviewed-image-profile',use,selected),
                               media_use_id=use,rendition_id=selected,source_evidence_id=evidence,source_version_sha256=version))
                    profiled_images.add(pair);counts['image_profiles']+=1
            else:
                profile = row['video']; thumb_uri = c.address(profile['thumbnail_loc'])
                known_thumb = db.execute('SELECT r.asset_id,r.rendition_id FROM image_sitemap_profiles p JOIN media_uses m ON m.use_id=p.media_use_id JOIN asset_renditions r ON r.rendition_id=p.rendition_id JOIN url_registry u ON u.url_id=r.url_id WHERE u.url=? AND m.page_id=?',(thumb_uri,pid)).fetchone()
                thumb_aid, thumb_rid = tuple(known_thumb) if known_thumb else writer.media(thumb_uri,'image',version,sid)
                writer.put('asset_relations',dict(relation_id=c.identity('selected-video-thumbnail',thumb_aid,aid,use,version,sid),
                           source_asset_id=thumb_aid,target_asset_id=aid,relationship_kind='thumbnail_of',
                           evidence_id=evidence,publication_state='publisher_selected_public_thumbnail'))
                values = dict(video_profile_id=c.identity('reviewed-video-profile',use),media_use_id=use,
                              thumbnail_rendition_id=thumb_rid,title=profile['title'],description=profile['description'],
                              content_rendition_id=selected,source_evidence_id=evidence,source_version_sha256=version)
                # Only explicitly reviewed optional values are projected.
                for field in ('duration_seconds','expiration_value','rating','view_count','publication_value','family_friendly',
                              'restriction_relationship','restriction_country_codes_json','platform_relationship','platform_codes_json',
                              'requires_subscription','uploader_name','live','tags_json'):
                    if field in profile: values[field]=profile[field]
                if profile.get('uploader_info'):values['uploader_info_url_id']=writer.url(profile['uploader_info'],'publisher_reference')
                writer.put('video_sitemap_profiles',values);counts['video_profiles']+=1
            counts['received_rows']+=1
        if c.file_hash(source) != expected: raise ValueError('Reviewed media source changed during import')
        integrity = c.validate(db, writer.data)
        if not integrity['passed']: raise ValueError('Reviewed public media failed catalogue integrity')
        import normalized_profiles
        normalized_profiles.collect(db)
        db.commit()
        return {'input_sha256':expected,'accounting':dict(counts),'current_page_versions':len(pages),
                'integrity':integrity,'publication_profiles_accepted':True,
                'public_deployment_verified':False,'page_dates_inferred_from_inventory':False}
    except BaseException:
        db.rollback();raise
    finally:db.close()


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--db',type=Path);parser.add_argument('--source',type=Path)
    parser.add_argument('--source-sha256');parser.add_argument('--receipt',type=Path,required=True)
    parser.add_argument('--review-job',type=Path);parser.add_argument('--output',type=Path)
    args=parser.parse_args()
    if args.review_job:
        if not args.output or args.db or args.source or args.source_sha256:parser.error('Review mode needs --review-job and --output only')
        c.disjoint_paths(args.review_job,args.output,args.receipt)
        result=review_snapshot(args.review_job,args.output)
    else:
        if not args.db or not args.source or not args.source_sha256:parser.error('Apply mode needs --db, --source and --source-sha256')
        c.disjoint_paths(args.db,args.source,args.receipt)
        result=apply(args.db,args.source,args.source_sha256)
    args.receipt.parent.mkdir(parents=True,exist_ok=True);args.receipt.write_text(json.dumps(result,indent=2)+'\n')
    print(c.packed(result))


if __name__=='__main__':main()
