"""Normalized, source-backed website catalogue. No remote DB or network writes.

SQLite is a private local working store. MySQL DDL is a review artifact; the
connected PlanetScale tool requires separate approval of its exact statements.
"""
from __future__ import annotations
import argparse
import collections
import datetime as dt
import hashlib
import json
import math
import os
from pathlib import Path
import re
import sqlite3
import shutil
import tempfile
import urllib.parse
import manager
import normalized_profiles

HERE = Path(__file__).resolve().parent


def packed(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def digest(value):
    return hashlib.sha256(value.encode() if isinstance(value, str) else value).hexdigest()


def file_hash(path):
    with Path(path).open('rb') as f: return hashlib.file_digest(f, 'sha256').hexdigest()


def identity(kind, *values):
    return digest(packed([kind, *values]))


def utc_now():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def disjoint_paths(*paths):
    paths=[Path(p) for p in paths if p is not None]
    for n,path in enumerate(paths):
        for other in paths[:n]:
            if path.resolve()==other.resolve() or (path.exists() and other.exists() and path.samefile(other)):
                raise ValueError('Input, database and receipt paths must be distinct')


def inactive_destination(path):
    if any(Path(str(path)+suffix).exists() for suffix in ('-wal','-shm','-journal')):
        raise ValueError('Destination has SQLite sidecars; close its active session before replacement')


def frozen_snapshot(source, directory):
    directory=Path(directory);directory.mkdir(parents=True,exist_ok=True)
    handle,temp=tempfile.mkstemp(prefix='.source-',suffix='.sqlite3',dir=directory);os.close(handle)
    original=sqlite3.connect('file:'+str(Path(source).resolve())+'?mode=ro',uri=True)
    backup=sqlite3.connect(temp)
    try:
        original.backup(backup);backup.close();original.close()
        value=file_hash(temp);target=directory/(value+'.sqlite3')
        if target.exists():
            if file_hash(target)!=value:raise ValueError('Frozen snapshot digest mismatch')
            Path(temp).unlink()
        else:os.replace(temp,target)
        return target,value
    except BaseException:
        original.close();backup.close();Path(temp).unlink(missing_ok=True);raise


def address(value):
    parsed = urllib.parse.urlsplit(value)
    if parsed.scheme in ('http','https'): return manager.normal(value)
    if parsed.scheme == 'tel' and re.fullmatch(r'tel:\+?[0-9]+', value): return value
    if parsed.scheme == 'mailto' and '@' in parsed.path and not parsed.query: return value
    raise ValueError('Unsupported or unsafe address')


def model(path=None):
    data=json.loads(Path(path or HERE/'schema/catalogue-v2.contract.json').read_text())
    for name, spec in data['tables'].items():
        if not re.fullmatch(r'[a-z][a-z0-9_]*',name): raise ValueError('Unsafe table')
        columns=[spec['key'], *spec['fields']]
        if len(columns)!=len(set(columns)): raise ValueError('Duplicate column')
        if not all(re.fullmatch(r'[a-z][a-z0-9_]*',c) for c in columns): raise ValueError('Unsafe column')
        for col, target in spec.get('references',{}).items():
            if col not in columns or target not in data['tables']: raise ValueError('Unknown reference')
    return data


INTEGER={'expected_rows','received_rows','ordinal','width_px','height_px','duration_ms','byte_size','uncompressed_size','entry_count','audio_channels','duration_seconds','view_count','qualifies_as_news','is_current'}
REAL={'priority','rating','bitrate_kbps','frame_rate','sampling_rate_khz'}
SHORT={'scheme':16,'host':253,'language':35,'hreflang':35,'language_code':35,'source_system':64,'source_record_key':191,'source_asset_key':191,'representation_key':191,'source_identity_key':191,'publisher_group_key':191,'profile_key':128,'profile_version':64,'property_key':191,'standard_key':64,'role':64,'slot_key':191,'family':128,'shard_key':128,'module_type':128}
REQUIRED={
 'url_registry':['url','normalized_url_sha256','scheme','address_kind','is_current'],
 'pages':['source_system','source_record_key','primary_url_id','module_type','publication_status'],
 'assets':['source_system','source_asset_key','asset_kind','publication_status','rights_status'],
 'asset_renditions':['asset_id','url_id','rendition_kind','representation_key'],
 'media_uses':['page_id','asset_id','slot_key','role','evidence_id','publication_state','placement_identity_sha256','placement_basis'],
 'source_imports':['source_type','source_scope','input_sha256','imported_at','completeness_state','raw_artifact_reference'],
 'observations':['import_id','subject_kind','subject_id','attribute_name','observed_value_json','observed_at','source_version_sha256','value_sha256'],
 'eligibility_decisions':['subject_kind','subject_id','channel','decision','reason_code','policy_version','source_version_sha256','evidence_id','decided_at'],
 'property_definitions':['standard_key','standard_snapshot_sha256','property_key','lifecycle_status'],
 'metadata_values':['subject_kind','subject_id','property_id','ordinal','value_json','source_evidence_id','source_version_sha256','publication_state'],
 'claims':['subject_kind','subject_id','claim_text','claim_type','source_version_sha256','approval_state','public_disclosure_state'],
 'content_reviews':['subject_kind','subject_id','agent_id','review_kind','reviewed_source_sha256','decision','reviewed_at','evidence_id'],
 'subject_contributors':['subject_kind','subject_id','agent_id','role','source_version_sha256','evidence_id'],
}


def sql_type(col, primary, mysql):
    if col==primary or col.endswith('_id') or col.endswith('_sha256'): return 'CHAR(64) CHARACTER SET ascii COLLATE ascii_bin' if mysql else 'TEXT'
    if col.endswith('_json'): return 'JSON' if mysql else 'TEXT'
    if col in INTEGER: return 'BIGINT' if mysql else 'INTEGER'
    if col in REAL: return 'DOUBLE' if mysql else 'REAL'
    if mysql and col in SHORT: return f'VARCHAR({SHORT[col]}) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin'
    if mysql and (col.endswith('_at') or col.endswith('_value') or col.endswith('_date_or_datetime')): return 'VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin' if 'date' in col or col.endswith('_at') or col in ('original_publication_value','publication_value','upload_value','expiration_value') else 'MEDIUMTEXT'
    if mysql and col in ('subject_kind','relationship_kind','claim_type','channel','decision','approval_state','publication_state','publication_status','file_kind','asset_kind','agent_kind','attribute_name','standard_snapshot_sha256','source_version_sha256','placement_basis'):
        return 'VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin'
    return 'MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin' if mysql else 'TEXT'


def ddl(data, mysql=False):
    lines=['-- Reviewed schema. No DROP/ALTER/care-table changes.']
    if mysql: lines.append('-- Existing PlanetScale foreign_keys_enabled=false: importer/readback enforce references; no setting change.')
    prefix='website_sm2_' if mysql else ''
    for name, spec in data['tables'].items():
        primary=spec['key']; columns=[primary,*spec['fields']]
        defs=[f'  `{c}` {sql_type(c,primary,mysql)}'+(' NOT NULL' if c==primary else '') for c in columns]
        defs.append(f'  PRIMARY KEY (`{primary}`)')
        for n, item in enumerate(spec.get('unique',[])):
            cols=[c.strip() for c in item.split('+')]
            if not all(c in columns for c in cols): raise ValueError('Unknown unique field')
            if mysql: defs.append(f'  UNIQUE KEY `u{n}` ('+','.join('`'+c+'`' for c in cols)+')')
            else: defs.append('  UNIQUE ('+','.join('`'+c+'`' for c in cols)+')')
        if name=='asset_renditions' and not mysql: defs.append('  UNIQUE (`rendition_id`,`asset_id`)')
        for n,(col,target) in enumerate(spec.get('references',{}).items()):
            if mysql: defs.append(f'  KEY `r{n}` (`{col}`)')
            else: defs.append(f'  FOREIGN KEY (`{col}`) REFERENCES `{target}` (`{data["tables"][target]["key"]}`) DEFERRABLE INITIALLY DEFERRED')
        if not mysql:
            for c in columns:
                if c.endswith('_json'): defs.append(f'  CHECK (`{c}` IS NULL OR json_valid(`{c}`))')
            if name=='media_uses': defs.append('  FOREIGN KEY (`rendered_rendition_id`,`asset_id`) REFERENCES asset_renditions(rendition_id,asset_id) DEFERRABLE INITIALLY DEFERRED')
            if 'ordinal' in columns: defs.append('  CHECK (ordinal IS NULL OR ordinal>=0)')
            if 'priority' in columns: defs.append('  CHECK (priority IS NULL OR (priority>=0 AND priority<=1))')
            if 'duration_seconds' in columns: defs.append('  CHECK (duration_seconds IS NULL OR (duration_seconds>=1 AND duration_seconds<=28800))')
        ending=' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;' if mysql else ';'
        lines.append(f'CREATE TABLE IF NOT EXISTS `{prefix+name}` (\n'+',\n'.join(defs)+'\n)'+ending)
    # Query indexes are physical; they do not create new semantic properties.
    indexes={'url_registry':['host,is_current'],'pages':['module_type,publication_status'], 'eligibility_decisions':['channel,decision','subject_kind,subject_id'], 'observations':['subject_kind,subject_id','source_version_sha256'], 'metadata_values':['subject_kind,subject_id'], 'media_uses':['asset_id,page_id'], 'links':['target_url_id,source_page_id'], 'page_relations':['target_page_id,source_page_id'], 'asset_relations':['target_asset_id,source_asset_id']}
    if mysql:
        # Fold non-unique indexes into their CREATE statement; no post-create ALTER.
        for name, keys in indexes.items():
            start=f'CREATE TABLE IF NOT EXISTS `{prefix+name}` ('
            pos=lines.index(next(s for s in lines if s.startswith(start)))
            for n, cols in enumerate(keys):
                before='\n) ENGINE'; insertion=',\n  KEY `q'+str(n)+'` ('+','.join('`'+c+'`' for c in cols.split(','))+')'
                lines[pos]=lines[pos].replace(before,insertion+before)
    else:
        for name, keys in indexes.items():
            for n, cols in enumerate(keys): lines.append(f'CREATE INDEX IF NOT EXISTS `{name}_q{n}` ON `{name}` ({cols});')
    return '\n\n'.join(lines)+'\n'


class Writer:
    def __init__(self, db, data):
        self.db=db;self.data=data;self.now=utc_now();self.sql={};self.urls={};self.assets={};self.renditions={};self.page_ids={};self.asset_source='public_url_candidate'
    def put(self, table, row):
        spec=self.data['tables'][table]; key=spec['key']
        if not row.get(key): raise ValueError('Missing key')
        if any(k not in [key,*spec['fields']] for k in row): raise ValueError('Unexpected field')
        if any(row.get(k) is None or row.get(k)=='' for k in REQUIRED.get(table,[])):raise ValueError('Missing required '+table+' identity/provenance')
        if table=='eligibility_decisions' and row['decision'] not in ('INCLUDE','HOLD','EXCLUDE'):raise ValueError('Invalid eligibility decision')
        for col in INTEGER|REAL:
            if col in row and row[col] is not None:
                row[col]=(int if col in INTEGER else float)(row[col])
        prior=self.db.execute('SELECT * FROM '+table+' WHERE '+key+'=?',(row[key],)).fetchone()
        if prior:
            # Replaying the same immutable source fact retains its first import
            # time. A conflicting value is never silently discarded.
            columns=[c[1] for c in self.db.execute('PRAGMA table_info('+table+')')]
            prior=dict(zip(columns,prior)) if not isinstance(prior,sqlite3.Row) else dict(prior)
            for col,value in row.items():
                if col in ('imported_at','first_seen_at','last_seen_at','observed_at','decided_at'):continue
                proposed=packed(value) if isinstance(value,(dict,list)) else value
                if prior[col]!=proposed:raise ValueError('Conflicting immutable record '+table+'.'+col)
            return
        columns=tuple(row)
        cache=(table,columns)
        if cache not in self.sql:
            self.sql[cache]='INSERT INTO '+table+' ('+','.join(columns)+') VALUES ('+','.join('?' for _ in columns)+') ON CONFLICT('+key+') DO NOTHING'
        self.db.execute(self.sql[cache],[packed(v) if isinstance(v,(dict,list)) else v for v in row.values()])
    def url(self, raw, kind='unknown', current=False):
        value=address(raw)
        if value in self.urls:
            key=self.urls[value]
            if current: self.db.execute('UPDATE url_registry SET is_current=1 WHERE url_id=?',(key,))
            return key
        key=identity('url',value);p=urllib.parse.urlsplit(value)
        existing=self.db.execute('SELECT url,url_id FROM url_registry WHERE normalized_url_sha256=?',(digest(value),)).fetchone()
        if existing:
            if existing[0]!=value:raise ValueError('URL digest conflict')
            self.urls[value]=existing[1]
            if current:self.db.execute('UPDATE url_registry SET is_current=1 WHERE url_id=?',(existing[1],))
            return existing[1]
        self.put('url_registry',dict(url_id=key,url=value,normalized_url_sha256=digest(value),scheme=p.scheme,host=p.hostname,address_kind=kind,first_seen_at=self.now,last_seen_at=self.now,is_current=int(current)))
        self.urls[value]=key;return key
    def observation(self, import_id, kind, key, attr, value, source_hash, observed=None):
        value_hash=digest(packed(value)); oid=identity('observation',import_id,kind,key,attr,value_hash)
        self.put('observations',dict(observation_id=oid,import_id=import_id,subject_kind=kind,subject_id=key,attribute_name=attr,observed_value_json=value,observed_at=observed or self.now,source_version_sha256=source_hash,value_sha256=value_hash));return oid
    def media(self, url, kind, source_hash, import_id):
        value=address(url);ak=(kind,value)
        if ak in self.assets: return self.assets[ak], self.renditions[ak]
        uid=self.url(value,kind+'_candidate'); aid=identity('asset-url-observation',kind,value);rid=identity('rendition',aid,uid,'observed-url')
        self.put('assets',dict(asset_id=aid,source_system=self.asset_source,source_asset_key=identity('source-asset',kind,value),asset_kind=kind,publication_status='candidate',rights_status='unknown',descriptive_metadata_json={'identity_basis':'URL observation; no original-artwork or byte-equivalence inference'}))
        self.put('asset_renditions',dict(rendition_id=rid,asset_id=aid,url_id=uid,rendition_kind='observed_public_url',representation_key='observed-url',first_seen_at=self.now,last_seen_at=self.now))
        self.assets[ak]=aid;self.renditions[ak]=rid;return aid,rid
    def use(self,pid,aid,rid,role,eid,source_hash,basis):
        # A candidate relationship has no asserted DOM slot or HTML-content hash.
        placement=identity('observed-media-relation',pid,aid,role,source_hash)
        use_id=identity('media-use',placement)
        self.put('media_uses',dict(use_id=use_id,page_id=pid,asset_id=aid,rendered_rendition_id=rid,slot_key=role+':'+aid,role=role,evidence_id=eid,publication_state=basis,placement_identity_sha256=placement,placement_basis='source relationship; not a proved DOM placement'))
        return use_id


def is_page(row,meta):
    path=urllib.parse.urlsplit(row['url']).path.lower()
    if path.endswith(('.json','.md','.xml','.txt','.png','.jpg','.jpeg','.webp','.avif','.gif','.svg','.pdf','.mp4','.mp3','.woff','.woff2','.css','.js','.mjs')): return False
    reason=meta.get('eligibility',{}).get('reason','')
    return reason not in ('redirect','insecure_or_historical_http_url','asset_or_discovery_document')


def import_catalogue(legacy_path, candidate_path, output, data, expected=None):
    output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
    disjoint_paths(legacy_path,candidate_path,output);inactive_destination(output)
    frozen,source_hash=frozen_snapshot(legacy_path,output.parent/'sitemap-source-snapshots')
    media_hash=file_hash(candidate_path) if candidate_path else None
    handle,temp=tempfile.mkstemp(prefix='.catalogue-v2-',suffix='.sqlite3',dir=output.parent);os.close(handle)
    db=sqlite3.connect(temp);db.row_factory=sqlite3.Row
    try:
        db.execute('PRAGMA foreign_keys=ON');db.executescript(ddl(data));db.execute('BEGIN');w=Writer(db,data)
        import_id=identity('source-import','legacy-v1',source_hash)
        original=sqlite3.connect('file:'+str(frozen.resolve())+'?mode=ro',uri=True);original.row_factory=sqlite3.Row;original.execute('BEGIN')
        total=original.execute('SELECT COUNT(*) FROM pages').fetchone()[0]
        w.put('source_imports',dict(import_id=import_id,source_type='immutable_v1_catalogue_snapshot',source_scope='Collected exports, not complete publisher/media estate',input_sha256=source_hash,imported_at=w.now,expected_rows=total,received_rows=total,completeness_state='collected_snapshot_only',raw_artifact_reference=str(frozen.resolve())))
        decisions=collections.Counter(); historical=0;invalid=[]
        for source_row in original.execute('SELECT * FROM pages ORDER BY url_hash'):
            row=dict(source_row);meta=json.loads(row['metadata_json']);current=not bool(meta.get('snapshot_tombstone'))
            if not current: historical+=1
            uid=w.url(row['url'],'observed_address',current)
            eid=w.observation(import_id,'url',uid,'legacy_record',{'legacy_url_hash':row['url_hash'],'legacy_row_sha256':row['row_sha256'],'eligibility':meta.get('eligibility',{}),'fields':meta.get('fields',{}),'is_current':current},source_hash)
            w.put('eligibility_decisions',dict(decision_id=identity('decision',uid,source_hash),subject_kind='url',subject_id=uid,channel='page_sitemap' if current else 'historical_snapshot',decision=row['decision'],reason_code=meta.get('eligibility',{}).get('reason','snapshot_tombstone'),policy_version='four-source-20261012',source_version_sha256=source_hash,evidence_id=eid,decided_at=w.now))
            if current: decisions[row['decision']]+=1
            if not is_page(row,meta): continue
            pid=identity('page-address-candidate',uid);w.page_ids[row['url']]=pid
            canonical=None
            if row['canonical_url']:
                try:canonical=w.url(row['canonical_url'],'canonical_reference')
                except ValueError:invalid.append({'url':row['url'],'field':'canonical_url'})
            # Existing source text remains draft/catalogue data, not new clinical approval.
            legacy={k:row[k] for k in ('priority_hint','change_frequency_hint','relevance','og_image','llm_text','llm_approved')}
            legacy['curation']=meta.get('curation',{})
            legacy['alternates']=meta.get('alternates',[])
            w.put('pages',dict(page_id=pid,source_system='collected_url_register',source_record_key=uid,primary_url_id=uid,canonical_url_id=canonical,module_type=row['module_type'],language=row['language'],title=row['title'],description=row['description'],topic_keywords_json=json.loads(row['keywords_json'] or '[]'),publication_status='observed_candidate',significant_modified_date_or_datetime=row['content_modified_at'],modified_date_precision=('date' if row['content_modified_at'] and len(row['content_modified_at'])==10 else 'datetime') if row['content_modified_at'] else None,modified_evidence_id=eid if row['content_modified_at'] else None,metadata_json={'legacy':legacy,'source_record_evidence_id':eid,'missing_fields_are_unknown':True}))
            if row['priority_hint'] is not None or row['change_frequency_hint']:
                w.put('page_sitemap_profiles',dict(page_profile_id=identity('page-profile',pid),page_id=pid,priority=row['priority_hint'],change_frequency=row['change_frequency_hint'],source_evidence_id=eid,source_version_sha256=source_hash))
            for image in json.loads(row['images_json']):
                try:aid,rid=w.media(image['loc'],'image',source_hash,import_id)
                except (ValueError,KeyError):invalid.append({'url':row['url'],'field':'image'});continue
                obs=w.observation(import_id,'asset',aid,'existing_sitemap_image',image,source_hash,image.get('observed_at'))
                use=w.use(pid,aid,rid,'existing_sitemap_image',obs,source_hash,'existing_public_sitemap_reference')
                w.put('image_sitemap_profiles',dict(image_profile_id=identity('image-profile',use,rid),media_use_id=use,rendition_id=rid,source_evidence_id=obs,source_version_sha256=source_hash))
            for video in json.loads(row['videos_json']):
                values=video.get('values',{});get=lambda k:values[k].get('text','') if isinstance(values.get(k),dict) else values.get(k)
                media_url=get('content_loc') or get('player_loc')
                try:aid,rid=w.media(media_url,'video',source_hash,import_id)
                except (ValueError,TypeError):invalid.append({'url':row['url'],'field':'video'});continue
                obs=w.observation(import_id,'asset',aid,'existing_sitemap_video',video,source_hash,video.get('observed_at'))
                use=w.use(pid,aid,rid,'existing_sitemap_video',obs,source_hash,'existing_public_sitemap_reference')
                thumbnail=None
                if get('thumbnail_loc'):
                    try:
                        thumb,thumbnail=w.media(get('thumbnail_loc'),'image',source_hash,import_id)
                        w.put('asset_relations',dict(relation_id=identity('thumbnail-for',thumb,aid),source_asset_id=thumb,target_asset_id=aid,relationship_kind='thumbnail_for',evidence_id=obs,publication_state='observed_source_reference'))
                    except ValueError:invalid.append({'url':row['url'],'field':'video_thumbnail'})
                profile=dict(video_profile_id=identity('video-profile',use),media_use_id=use,thumbnail_rendition_id=thumbnail,title=get('title'),description=get('description'),content_rendition_id=rid if get('content_loc') else None,player_url_id=w.url(get('player_loc'),'player_reference') if get('player_loc') else None,source_evidence_id=obs,source_version_sha256=source_hash)
                for src,dest in [('duration','duration_seconds'),('expiration_date','expiration_value'),('rating','rating'),('view_count','view_count'),('publication_date','publication_value'),('family_friendly','family_friendly'),('requires_subscription','requires_subscription'),('live','live')]:
                    if get(src) is not None:profile[dest]=get(src)
                if 'tag' in values:profile['tags_json']=values['tag'] if isinstance(values['tag'],list) else [values['tag']]
                for src,dest in [('restriction','restriction_country_codes_json'),('platform','platform_codes_json')]:
                    if isinstance(values.get(src),dict):
                        profile[dest]=get(src).split();profile[src+'_relationship']=values[src].get('attributes',{}).get('relationship')
                if 'uploader' in values:
                    profile['uploader_name']=get('uploader')
                    if isinstance(values['uploader'],dict) and values['uploader'].get('attributes',{}).get('info'):profile['uploader_info_url_id']=w.url(values['uploader']['attributes']['info'],'uploader_reference')
                w.put('video_sitemap_profiles',profile)
            for n,link in enumerate(json.loads(row['links_json'])):
                raw=link.get('href') or link.get('url') or link.get('target')
                if not raw:continue
                try:target=w.url(raw,'link_target')
                except ValueError:invalid.append({'url':row['url'],'field':'link'});continue
                w.put('links',dict(link_id=identity('link',pid,n,source_hash),source_page_id=pid,target_url_id=target,slot_key='observed-source:'+str(n),raw_href=raw,target_fragment=urllib.parse.urlsplit(raw).fragment or None,anchor_text=link.get('anchor_text') or link.get('text'),rel_tokens_json=link.get('rel',[]),element_kind='a',relationship_kind=link.get('relationship_kind','observed_link'),evidence_id=eid,publication_state='observed_source_reference'))
        original.close()
        if file_hash(frozen)!=source_hash: raise ValueError('Frozen source catalogue changed during import')
        candidate_counts=collections.Counter()
        if candidate_path:
            mid=identity('source-import','candidate-media',media_hash)
            with Path(candidate_path).open() as candidate_file: count=sum(1 for _ in candidate_file)
            w.put('source_imports',dict(import_id=mid,source_type='expanded_media_candidates',source_scope='OG metadata/template/source candidates, not complete asset library or eligibility proof',input_sha256=media_hash,imported_at=w.now,expected_rows=count,received_rows=count,completeness_state='partial_candidate_inventory',raw_artifact_reference=str(Path(candidate_path).resolve())))
            with Path(candidate_path).open() as f:
                for line in f:
                    c=json.loads(line);pid=w.page_ids.get(address(c['page_url']));candidate_counts['received']+=1
                    aid,rid=w.media(c['image_url'],'image',media_hash,mid)
                    obs=w.observation(mid,'asset',aid,'candidate_page_relationship',c,media_hash)
                    if not pid:
                        candidate_counts['unmapped_parent_stored_as_evidence']+=1
                        continue
                    w.use(pid,aid,rid,'candidate_image',obs,media_hash,'candidate_not_approved_for_sitemap')
                    candidate_counts['mapped_parent']+=1
            if file_hash(candidate_path)!=media_hash:raise ValueError('Candidate input changed during import')
            if candidate_counts['received']!=count or candidate_counts['received']!=candidate_counts['mapped_parent']+candidate_counts['unmapped_parent_stored_as_evidence']:raise ValueError('Candidate associations do not reconcile')
        if expected and dict(decisions)!=expected:raise ValueError('Current decision counts do not reconcile: '+packed(dict(decisions)))
        db.commit();receipt=validate(db,data)
        if not receipt['passed']:raise ValueError('Integrity validation failed: '+packed(receipt))
        receipt.update(imported_at=w.now,legacy_source_sha256=source_hash,frozen_source_artifact=str(frozen.resolve()),candidate_source_sha256=media_hash,candidate_associations=dict(candidate_counts),current_decisions=dict(decisions),historical_addresses=historical,rejected_input_values=invalid,scope='Normalized collected snapshot plus partial media candidates; not whole-estate population or public media approval')
        db.close();inactive_destination(output);os.replace(temp,output);receipt['database_sha256']=file_hash(output);receipt['database_bytes']=output.stat().st_size
        return receipt
    except BaseException:
        db.close();Path(temp).unlink(missing_ok=True);raise


def validate(db,data):
    counts={t:db.execute('SELECT COUNT(*) FROM '+t).fetchone()[0] for t in data['tables']}
    checks={'foreign_key_errors':len(db.execute('PRAGMA foreign_key_check').fetchall()),'wrong_asset_renditions':db.execute('SELECT COUNT(*) FROM media_uses m JOIN asset_renditions r ON r.rendition_id=m.rendered_rendition_id WHERE r.asset_id!=m.asset_id').fetchone()[0], 'candidate_images_in_output_profiles':db.execute("SELECT COUNT(*) FROM image_sitemap_profiles p JOIN media_uses m ON p.media_use_id=m.use_id WHERE m.publication_state='candidate_not_approved_for_sitemap'").fetchone()[0], 'unproven_page_content_versions':db.execute("SELECT COUNT(*) FROM pages WHERE content_version_sha256 IS NOT NULL AND publication_status='observed_candidate'").fetchone()[0]}
    maps={'url':'url_registry','page':'pages','asset':'assets','agent':'agents','media_use':'media_uses'}
    checks['required_identity_provenance_errors']=sum(db.execute('SELECT COUNT(*) FROM '+table+' WHERE '+ ' OR '.join('`'+col+'` IS NULL OR `'+col+"`=''" for col in cols)).fetchone()[0] for table,cols in REQUIRED.items())
    checks['invalid_eligibility_decisions']=db.execute("SELECT COUNT(*) FROM eligibility_decisions WHERE decision IS NULL OR decision NOT IN ('INCLUDE','HOLD','EXCLUDE')").fetchone()[0]
    polymorphic_errors=0
    for table in ('observations','eligibility_decisions','metadata_values','claims','content_reviews','subject_contributors'):
        for kind,target in maps.items():
            key=data['tables'][target]['key']
            polymorphic_errors+=db.execute(f'SELECT COUNT(*) FROM {table} s LEFT JOIN {target} t ON s.subject_id=t.{key} WHERE s.subject_kind=? AND t.{key} IS NULL',(kind,)).fetchone()[0]
        polymorphic_errors+=db.execute('SELECT COUNT(*) FROM '+table+' WHERE subject_kind IS NULL OR subject_id IS NULL OR subject_kind NOT IN ('+','.join('?' for _ in maps)+')',tuple(maps)).fetchone()[0]
    checks['polymorphic_subject_errors']=polymorphic_errors
    return {'passed':not any(checks.values()),'checks':checks,'table_counts':counts,'tables':len(counts)}


def seed_registry(path, registry_path, editorial_path, brand_path, data):
    """Sparse dictionary/brand population; no invented per-page clinical copy."""
    disjoint_paths(path,registry_path,editorial_path,brand_path)
    db=sqlite3.connect(path);db.row_factory=sqlite3.Row;db.execute('PRAGMA foreign_keys=ON')
    try:
        db.execute('BEGIN');w=Writer(db,data)
        for source,kind in [(registry_path,'standards_dictionary'),(editorial_path,'editorial_dictionary'),(brand_path,'published_brand_profile')]:
            value=json.loads(Path(source).read_text());snapshot=file_hash(source);sid=identity('source-import',kind,snapshot)
            w.put('source_imports',dict(import_id=sid,source_type=kind,source_scope='Versioned definitions or shared published identity; no clinical sign-off implied',input_sha256=snapshot,imported_at=w.now,completeness_state='specified_document',raw_artifact_reference=str(Path(source).resolve())))
            if kind=='standards_dictionary':
                groups=[('schema_org',value['schema_org']['property_definitions']),('iptc_2025_1',value['iptc']['property_definitions']),('current_sitemap_xml',value['xml']['current_field_contract'])]
                for standard,props in groups:
                    for prop in props:
                        key=prop.get('key') or prop.get('family','xml')+':'+prop['path']
                        pid=identity('property',standard,snapshot,key)
                        w.put('property_definitions',dict(property_id=pid,standard_key=standard,standard_snapshot_sha256=snapshot,property_key=key,domain_types_json=prop.get('domains',[]),range_types_json=prop.get('ranges',[]),datatype=prop.get('datatype'),cardinality=prop.get('cardinality') or prop.get('occurrence'),nested_shape_json=prop if standard.startswith('iptc') else None,constraints_json=prop,lifecycle_status=prop.get('lifecycle','documented_current_profile'),source_url=prop.get('source')))
            elif kind=='editorial_dictionary':
                for rule in value['field_rules']:
                    key=rule['subject']+'.'+rule['field']
                    w.put('property_definitions',dict(property_id=identity('property','pinnacle_editorial',snapshot,key),standard_key='pinnacle_editorial',standard_snapshot_sha256=snapshot,property_key=key,datatype='editorial_contract',constraints_json=rule,lifecycle_status='internal_business_definition'))
            else:
                aid=identity('agent','pinnacle-publisher');uid=w.url(value['source_url'],'publisher_source')
                w.put('agents',dict(agent_id=aid,agent_kind='organisation',name=value['name'],public_profile_url_id=uid,source_identity_key='pinnacle-blooms-network-publisher'))
                eid=w.observation(sid,'agent',aid,'published_brand_profile',value,snapshot)
                prop=identity('property','pinnacle_editorial',snapshot,'agent.brand_profile')
                w.put('property_definitions',dict(property_id=prop,standard_key='pinnacle_editorial',standard_snapshot_sha256=snapshot,property_key='agent.brand_profile',datatype='object',cardinality='1',constraints_json={'scope':'shared organisational identity and purpose; not practitioner authorship'},lifecycle_status='internal_business_definition',source_url=value['source_url']))
                w.put('metadata_values',dict(value_id=identity('brand-profile',aid,snapshot),subject_kind='agent',subject_id=aid,property_id=prop,ordinal=0,language='en',value_json=value,source_evidence_id=eid,source_version_sha256=snapshot,publication_state='previously_published_source_statement'))
                db.execute("UPDATE pages SET metadata_json=json_set(metadata_json,'$.brand_profile_agent_id',?) WHERE primary_url_id IN (SELECT url_id FROM url_registry WHERE host='pinnacleblooms.org' OR host LIKE '%.pinnacleblooms.org')",(aid,))
        receipt=validate(db,data)
        if not receipt['passed']:raise ValueError('Dictionary enrichment failed integrity')
        db.commit();receipt['scope']='Dictionary definitions and shared identity; no new public copy, claim or clinical review';return receipt
    except BaseException:db.rollback();raise
    finally:db.close()


def import_public_media(path, source_path, data):
    """Dedicated public-CMS media fields; never infer publication or consent."""
    disjoint_paths(path,source_path)
    doc=json.loads(Path(source_path).read_text());snapshot=file_hash(source_path)
    if doc.get('row_count')!=len(doc.get('rows',[])):raise ValueError('CMS input count mismatch')
    if any(r.get('source_table') not in ('faq','sunshine','guru') for r in doc['rows']):raise ValueError('Unapproved CMS source scope')
    db=sqlite3.connect(path);db.row_factory=sqlite3.Row;db.execute('PRAGMA foreign_keys=ON');counts=collections.Counter()
    try:
        db.execute('BEGIN');w=Writer(db,data);sid=identity('source-import','public-cms-media',snapshot)
        w.put('source_imports',dict(import_id=sid,source_type='public_cms_dedicated_media_fields',source_scope=doc['scope'],input_sha256=snapshot,source_observed_at=doc['date'],imported_at=w.now,expected_rows=doc['row_count'],received_rows=len(doc['rows']),completeness_state='dedicated_fields_only_not_full_library',raw_artifact_reference=str(Path(source_path).resolve())))
        for r in doc['rows']:
            counts['received']+=1;value=str(r.get('image_field') or '').strip()
            # These singular dedicated fields must contain one actual address.
            # Ambiguous markup/relative paths remain in the retained source.
            if len(re.findall(r'https?://',value))!=1 or value.startswith(('{','[','<')):
                counts['unparsed_field_retained_in_source']+=1;continue
            try:aid,rid=w.media(value,'image',snapshot,sid)
            except ValueError:counts['invalid_address_retained_in_source']+=1;continue
            evidence=w.observation(sid,'asset',aid,'public_cms_media_candidate',r,snapshot,doc['date']);counts['stored_asset_evidence']+=1
            parent=r.get('parent_url');pid=None
            if parent:
                try:
                    normalized=address(str(parent))
                    found=db.execute('SELECT p.page_id FROM pages p JOIN url_registry u ON p.primary_url_id=u.url_id WHERE u.url=?',(normalized,)).fetchone()
                    pid=found[0] if found else None
                except ValueError:pass
            if pid:
                # Distinct source records retain their own evidence even when
                # they refer to the same page and image.
                w.use(pid,aid,rid,'public_cms_candidate:'+str(r['source_id']),evidence,snapshot,'candidate_not_approved_for_sitemap');counts['exact_parent_relationships']+=1
            else:counts['parent_unmapped_evidence_retained']+=1
        if file_hash(source_path)!=snapshot:raise ValueError('CMS input changed during import')
        if counts['received']!=counts['stored_asset_evidence']+counts['unparsed_field_retained_in_source']+counts['invalid_address_retained_in_source']:raise ValueError('CMS field accounting mismatch')
        result=validate(db,data)
        if not result['passed']:raise ValueError('CMS import failed integrity')
        db.commit();result.update(source_sha256=snapshot,accounting=dict(counts),public_promotion=False,scope=doc['scope']);return result
    except BaseException:db.rollback();raise
    finally:db.close()


def resolve_relative_media(source, origin, evidence, output):
    """Retain root-relative CMS values and explicitly document their origin."""
    disjoint_paths(source,evidence,output)
    parsed=urllib.parse.urlsplit(origin);base=address(origin)
    if parsed.scheme!='https' or parsed.path not in ('','/') or parsed.query or parsed.fragment:
        raise ValueError('Resolution needs an explicit HTTPS publication origin')
    raw=json.loads(Path(source).read_text())
    if raw.get('row_count')!=len(raw.get('rows',[])):raise ValueError('CMS input count mismatch')
    if not Path(evidence).is_file():raise ValueError('Origin evidence must exist')
    rows=[]
    for row in raw['rows']:
        value=str(row.get('image_field') or '').strip()
        if not value.startswith('/') or value.startswith('//'):continue
        if any(ch.isspace() for ch in value) or any(ch in value for ch in '<>\\'):
            raise ValueError('Ambiguous relative media field')
        r=dict(row);r['original_image_field']=row['image_field'];r['image_field']=urllib.parse.urljoin(base+'/' if not base.endswith('/') else base,value)
        parent=str(r.get('parent_url') or '')
        if parent.startswith('/') and not parent.startswith('//'):
            r['original_parent_url']=parent;r['parent_url']=urllib.parse.urljoin(base+'/' if not base.endswith('/') else base,parent)
        rows.append(r)
    result={k:v for k,v in raw.items() if k!='rows'}
    result.update(scope=raw['scope']+'; root-relative paths resolved against explicitly evidenced publication origin; candidates only',source_raw_artifact=str(Path(source).resolve()),source_raw_sha256=file_hash(source),relative_base=base,base_evidence_artifact=str(Path(evidence).resolve()),base_evidence_sha256=file_hash(evidence),row_count=len(rows),publishedEligibilityProven=False,rows=rows)
    Path(output).parent.mkdir(parents=True,exist_ok=True);Path(output).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    return {'resolved_rows':len(rows),'source_sha256':result['source_raw_sha256'],'resolution_sha256':file_hash(output),'public_promotion':False}


def export_mysql_v2(path, output, data, batch_size=500, max_bytes=4*1024*1024):
    """Private bounded SQL batches; native synchronization needs separate readback."""
    disjoint_paths(path,output)
    output=Path(output)
    if batch_size<1 or max_bytes<1024:raise ValueError('Invalid batch limits')
    if output.exists():raise ValueError('Use a new private export directory')
    output.parent.mkdir(parents=True,exist_ok=True)
    frozen,source_hash=frozen_snapshot(path,output.parent/(output.name+'-sources'))
    db=sqlite3.connect('file:'+str(frozen.resolve())+'?mode=ro',uri=True)
    stage=Path(tempfile.mkdtemp(prefix='.mysql-v2-',dir=output.parent))
    def literal(value):
        if value is None:return 'NULL'
        if isinstance(value,(int,float)):
            if not math.isfinite(value):raise ValueError('Nonfinite SQL number')
            return str(value)
        return "CONVERT(X'"+str(value).encode('utf-8').hex()+"' USING utf8mb4)"
    try:
        integrity=validate(db,data)
        if not integrity['passed']:raise ValueError('Export source failed integrity')
        manifest={'format':'pinnacle-normalized-mysql-batches-v2','approved_schema_sha256':digest(ddl(data,True)),'source_sha256':source_hash,'frozen_source_artifact':str(frozen.resolve()),'mode':'upsert_delta_with_retained_history_no_implicit_deletion','native_synchronized':False,'tables':[],'batches':[]}
        for table,spec in data['tables'].items():
            columns=[spec['key'],*spec['fields']];cloud='website_sm2_'+table
            prefix='INSERT INTO `'+cloud+'` ('+','.join('`'+c+'`' for c in columns)+') VALUES\n'
            suffix='\nON DUPLICATE KEY UPDATE '+','.join('`'+c+'`=VALUES(`'+c+'`)' for c in columns if c!=spec['key'])+';\n'
            pending=[];size=len(prefix.encode())+len(suffix.encode());part=0;count=0;logical=hashlib.sha256()
            def flush():
                nonlocal pending,size,part
                if not pending:return
                query=prefix+',\n'.join(pending)+suffix;blob=query.encode();name=table+'-'+str(part).zfill(5)+'.sql'
                (stage/name).write_bytes(blob);manifest['batches'].append({'path':name,'table':cloud,'rows':len(pending),'sha256':digest(blob),'bytes':len(blob)})
                pending=[];size=len(prefix.encode())+len(suffix.encode());part+=1
            for row in db.execute('SELECT '+','.join('`'+c+'`' for c in columns)+' FROM `'+table+'` ORDER BY `'+spec['key']+'`'):
                value='('+','.join(literal(v) for v in row)+')';needed=len(value.encode())+2
                if size+needed>max_bytes or len(pending)>=batch_size:flush()
                if size+needed>max_bytes:raise ValueError('One row exceeds the declared batch byte limit')
                pending.append(value);size+=needed;count+=1
                logical_row=[json.loads(v) if c.endswith('_json') and v is not None else v for c,v in zip(columns,row)]
                logical.update((packed(logical_row)+'\n').encode())
            flush()
            if count!=integrity['table_counts'][table]:raise ValueError('Export count mismatch')
            manifest['tables'].append({'table':cloud,'primary_key':spec['key'],'columns':columns,'rows':count,'ordered_row_sha256':logical.hexdigest(),'batches':part})
        if file_hash(frozen)!=source_hash:raise ValueError('Export source changed')
        (stage/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');stage.rename(output)
        return {'tables':len(manifest['tables']),'rows':sum(t['rows'] for t in manifest['tables']),'batches':len(manifest['batches']),'sql_bytes':sum(b['bytes'] for b in manifest['batches']),'source_sha256':source_hash,'manifest_sha256':file_hash(output/'manifest.json'),'native_synchronized':False}
    finally:
        db.close()
        if stage.exists():shutil.rmtree(stage)


def export_compatible(path, output, data, use_profiles=False):
    """Feed the existing validated generator from normalized state.

    Candidates never become images/video/LLM output through this bridge. The
    imported existing-sitemap references remain explicitly source-scoped.
    """
    output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
    disjoint_paths(path,output);inactive_destination(output)
    source=sqlite3.connect('file:'+str(Path(path).resolve())+'?mode=ro',uri=True);source.row_factory=sqlite3.Row
    ambiguous=source.execute("SELECT u.url_id FROM url_registry u LEFT JOIN eligibility_decisions e ON e.subject_id=u.url_id AND e.subject_kind='url' AND e.channel='page_sitemap' WHERE u.is_current=1 GROUP BY u.url_id HAVING COUNT(e.decision_id)!=1 LIMIT 1").fetchone()
    if ambiguous:
        source.close();raise ValueError('Current URL requires one explicitly accepted page-sitemap decision; resolve ambiguity before projection')
    handle,temp=tempfile.mkstemp(prefix='.generator-projection-',suffix='.sqlite3',dir=output.parent);os.close(handle)
    target=manager.connect(temp)
    try:
        evidence={r['observation_id']:json.loads(r['observed_value_json']) for r in source.execute("SELECT observation_id,observed_value_json FROM observations WHERE attribute_name IN ('legacy_record','existing_sitemap_image','existing_sitemap_video')")}
        profiles=normalized_profiles.collect(source) if use_profiles else None
        images=collections.defaultdict(list);videos=collections.defaultdict(list)
        for table,attr,dest in [('image_sitemap_profiles','image','images'),('video_sitemap_profiles','video','videos')]:
            for item in source.execute('SELECT m.page_id,m.publication_state,p.source_evidence_id FROM '+table+' p JOIN media_uses m ON '+('p.media_use_id=m.use_id')):
                if item['publication_state']!='existing_public_sitemap_reference':continue
                (images if dest=='images' else videos)[item['page_id']].append(evidence[item['source_evidence_id']])
        if profiles:images=profiles['images'];videos=profiles['videos']
        rows=source.execute("SELECT u.*,e.decision,e.evidence_id,p.page_id,p.module_type,p.title,p.description,p.canonical_url_id,p.language,p.significant_modified_date_or_datetime,p.topic_keywords_json,p.metadata_json FROM url_registry u JOIN eligibility_decisions e ON e.subject_id=u.url_id AND e.subject_kind='url' AND e.channel='page_sitemap' LEFT JOIN pages p ON p.primary_url_id=u.url_id WHERE u.is_current=1 ORDER BY u.url")
        count=collections.Counter()
        for item in rows:
            x=dict(item);ev=evidence[x['evidence_id']];metadata=json.loads(x['metadata_json']) if x['metadata_json'] else {};legacy=metadata.get('legacy',{})
            canonical=source.execute('SELECT url FROM url_registry WHERE url_id=?',(x['canonical_url_id'],)).fetchone() if x['canonical_url_id'] else None
            row=dict(url_hash=digest(x['url']),url=x['url'],host=x['host'],module_type=x['module_type'] or manager.family_name(ev['eligibility'].get('family','other')),decision=x['decision'],title=x['title'],description=x['description'],keywords_json=x['topic_keywords_json'] or '[]',canonical_url=canonical[0] if canonical else (x['url'] if x['decision']=='INCLUDE' else None),language=x['language'],content_modified_at=x['significant_modified_date_or_datetime'],priority_hint=legacy.get('priority_hint'),change_frequency_hint=legacy.get('change_frequency_hint'),relevance=legacy.get('relevance'),og_image=legacy.get('og_image'),images_json=packed(images[x['page_id']]),videos_json=packed(videos[x['page_id']]),links_json='[]',llm_text=legacy.get('llm_text'),llm_approved=legacy.get('llm_approved',0),metadata_json=packed({'eligibility':ev['eligibility'],'fields':ev['fields'],'curation':legacy.get('curation',{}),'normalized_catalogue_source':True}),row_sha256='')
            meta=json.loads(row['metadata_json']);meta['alternates']=legacy.get('alternates',[])
            if profiles:
                if x['page_id'] in profiles['pages']:meta['sitemap_profile']=profiles['pages'][x['page_id']]
                if x['page_id'] in profiles['news']:meta['news_profile']=profiles['news'][x['page_id']]
                if x['page_id'] in profiles['alternates']:meta['alternates']=profiles['alternates'][x['page_id']]
            row['metadata_json']=packed(meta)
            if not row['llm_text']:row['llm_text']=manager.reference_text(row)
            manager.upsert(target,manager.refresh_digest(row));count[row['decision']]+=1
        target.commit();target.close();source.close();inactive_destination(output);os.replace(temp,output)
        return {'decisions':dict(count),'rows':sum(count.values()),'projection_sha256':file_hash(output),'candidate_promotion':False,'normalized_profiles':use_profiles,'published_file_modifications':profiles['published_file_modifications'] if profiles else {},'scope':'Current collected snapshot; source-versioned output profiles' if profiles else 'Current collected snapshot; imported legacy source references only'}
    except BaseException:target.close();source.close();Path(temp).unlink(missing_ok=True);raise


def build_normalized(path, projection, policy_path, output, data):
    disjoint_paths(path,projection,policy_path,output)
    if any(Path(p).resolve().is_relative_to(Path(output).resolve()) for p in (path,projection,policy_path)):raise ValueError('Private inputs/projection cannot be placed in public release')
    policy=json.loads(Path(policy_path).read_text())
    frozen,source_hash=frozen_snapshot(path,Path(projection).parent/'profile-source-snapshots')
    receipt=export_compatible(frozen,projection,data,True)
    policy['published_file_modifications']=receipt['published_file_modifications']
    db=manager.connect(projection)
    try:release=manager.build_release(db,output,policy)
    finally:db.close()
    receipt.update(frozen_source_sha256=source_hash,frozen_source_artifact=str(frozen.resolve()),release_id=release['release_id'],page_urls=release['page_urls'],public_files=len(release['files']),public_deployed=False)
    return receipt


def main():
    p=argparse.ArgumentParser();s=p.add_subparsers(dest='command',required=True)
    a=s.add_parser('schema');a.add_argument('--output',type=Path,required=True)
    a=s.add_parser('import');a.add_argument('--legacy-db',type=Path,required=True);a.add_argument('--candidate-media',type=Path);a.add_argument('--db',type=Path,required=True);a.add_argument('--receipt',type=Path,required=True);a.add_argument('--expected-decisions',type=Path)
    a=s.add_parser('validate');a.add_argument('--db',type=Path,required=True)
    a=s.add_parser('seed');a.add_argument('--db',type=Path,required=True);a.add_argument('--registry',type=Path,required=True);a.add_argument('--editorial',type=Path,default=HERE/'editorial-policy.json');a.add_argument('--brand',type=Path,default=HERE/'brand-profile.json');a.add_argument('--receipt',type=Path,required=True)
    a=s.add_parser('export-generator');a.add_argument('--db',type=Path,required=True);a.add_argument('--output',type=Path,required=True);a.add_argument('--receipt',type=Path,required=True);a.add_argument('--normalized-profiles',action='store_true')
    a=s.add_parser('import-public-media');a.add_argument('--db',type=Path,required=True);a.add_argument('--source',type=Path,required=True);a.add_argument('--receipt',type=Path,required=True)
    a=s.add_parser('resolve-relative-media');a.add_argument('--source',type=Path,required=True);a.add_argument('--origin',required=True);a.add_argument('--evidence',type=Path,required=True);a.add_argument('--output',type=Path,required=True);a.add_argument('--receipt',type=Path,required=True)
    a=s.add_parser('export-mysql-v2');a.add_argument('--db',type=Path,required=True);a.add_argument('--output',type=Path,required=True);a.add_argument('--batch-size',type=int,default=500);a.add_argument('--max-bytes',type=int,default=4*1024*1024);a.add_argument('--receipt',type=Path,required=True)
    a=s.add_parser('build-normalized');a.add_argument('--db',type=Path,required=True);a.add_argument('--projection',type=Path,required=True);a.add_argument('--policy',type=Path,required=True);a.add_argument('--output',type=Path,required=True);a.add_argument('--receipt',type=Path,required=True)
    a=p.parse_args();data=model()
    if a.command=='build-normalized' and a.receipt.resolve().is_relative_to(a.output.resolve()):raise ValueError('Private receipt cannot be placed in public release')
    if hasattr(a,'receipt'):disjoint_paths(a.receipt,*[getattr(a,k,None) for k in ('db','legacy_db','candidate_media','expected_decisions','output','registry','editorial','brand','source','evidence','projection','policy')])
    if a.command=='schema':
        a.output.mkdir(parents=True,exist_ok=True)
        for mysql,name in [(False,'sqlite-v2.sql'),(True,'planetscale-v2.sql')]: (a.output/name).write_text(ddl(data,mysql))
        print(packed({'tables':len(data['tables']),'cloud_executed':False}));return
    if a.command=='import':
        expected=json.loads(a.expected_decisions.read_text())['expected_decisions'] if a.expected_decisions else None
        receipt=import_catalogue(a.legacy_db,a.candidate_media,a.db,data,expected);a.receipt.parent.mkdir(parents=True,exist_ok=True);a.receipt.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
        print(packed(receipt));return
    if a.command in ('seed','export-generator'):
        receipt=seed_registry(a.db,a.registry,a.editorial,a.brand,data) if a.command=='seed' else export_compatible(a.db,a.output,data,a.normalized_profiles)
        a.receipt.parent.mkdir(parents=True,exist_ok=True);a.receipt.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(packed(receipt));return
    if a.command=='import-public-media':
        receipt=import_public_media(a.db,a.source,data);a.receipt.parent.mkdir(parents=True,exist_ok=True);a.receipt.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(packed(receipt));return
    if a.command in ('resolve-relative-media','export-mysql-v2'):
        receipt=resolve_relative_media(a.source,a.origin,a.evidence,a.output) if a.command=='resolve-relative-media' else export_mysql_v2(a.db,a.output,data,a.batch_size,a.max_bytes)
        a.receipt.parent.mkdir(parents=True,exist_ok=True);a.receipt.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(packed(receipt));return
    if a.command=='build-normalized':
        receipt=build_normalized(a.db,a.projection,a.policy,a.output,data);a.receipt.parent.mkdir(parents=True,exist_ok=True);a.receipt.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(packed(receipt));return
    db=sqlite3.connect('file:'+str(a.db.resolve())+'?mode=ro',uri=True);print(packed(validate(db,data)));db.close()


if __name__=='__main__':main()
