"""Project versioned catalogue profiles; candidates never acquire approval here."""
import collections
import json


def collect(db):
    urls={r['url_id']:r['url'] for r in db.execute('SELECT url_id,url FROM url_registry')}
    renditions={r['rendition_id']:dict(r) for r in db.execute('SELECT rendition_id,asset_id,url_id FROM asset_renditions')}
    assets={r['asset_id']:dict(r) for r in db.execute('SELECT asset_id,asset_kind,rights_status FROM assets')}
    pages={r['page_id']:dict(r) for r in db.execute('SELECT page_id,primary_url_id,content_version_sha256,publication_status FROM pages')}
    uses={r['use_id']:dict(r) for r in db.execute('SELECT * FROM media_uses')}
    evidence={r['observation_id']:r['source_version_sha256'] for r in db.execute('SELECT observation_id,source_version_sha256 FROM observations')}
    decisions=collections.defaultdict(list)
    for r in db.execute("SELECT subject_kind,subject_id,channel,decision,source_version_sha256 FROM eligibility_decisions WHERE channel IN ('image_sitemap','video_sitemap','news_sitemap')"):
        decisions[(r['subject_kind'],r['subject_id'],r['channel'],r['source_version_sha256'])].append(r['decision'])
    images=collections.defaultdict(list);videos=collections.defaultdict(list);page_profiles={};news_profiles={}
    def proven(profile):
        version=profile['source_version_sha256']
        if not version or evidence.get(profile['source_evidence_id'])!=version:raise ValueError('Profile evidence/version mismatch')
        return version
    def decision(kind,subject,channel,version):
        if decisions[(kind,subject,channel,version)]!=['INCLUDE']:raise ValueError('Profile requires exactly one current channel INCLUDE')
    def use_allowed(profile,channel):
        version=proven(profile);use=uses[profile['media_use_id']];state=use['publication_state']
        if state=='existing_public_sitemap_reference':return use
        if state!='approved_public_use':raise ValueError('Candidate use cannot be projected into a public profile')
        page=pages[use['page_id']]
        if page['content_version_sha256']!=version or use['page_content_version_sha256']!=version or page['publication_status']=='observed_candidate':raise ValueError('Approved media use no longer matches published page version')
        decision('media_use',use['use_id'],channel,version)
        if assets[use['asset_id']]['rights_status'] not in ('owned','licensed','permission_recorded','public_domain'):raise ValueError('Approved media requires rights evidence')
        return use
    def location(rid,owner=None,kind=None):
        r=renditions[rid]
        if owner and r['asset_id']!=owner:raise ValueError('Profile rendition belongs to another asset')
        if kind and assets[r['asset_id']]['asset_kind']!=kind:raise ValueError('Profile has wrong rendition type')
        return urls[r['url_id']]
    for row in db.execute('SELECT * FROM image_sitemap_profiles ORDER BY rowid'):
        p=dict(row);use=use_allowed(p,'image_sitemap')
        images[use['page_id']].append({'loc':location(p['rendition_id'],use['asset_id'],'image')})
    for row in db.execute('SELECT * FROM video_sitemap_profiles ORDER BY rowid'):
        p=dict(row);use=use_allowed(p,'video_sitemap');values={}
        if assets[use['asset_id']]['asset_kind']!='video':raise ValueError('Video profile has wrong asset kind')
        if p['thumbnail_rendition_id']:values['thumbnail_loc']=location(p['thumbnail_rendition_id'],kind='image')
        if p['content_rendition_id']:values['content_loc']=location(p['content_rendition_id'],use['asset_id'],'video')
        if p['player_url_id']:values['player_loc']=urls[p['player_url_id']]
        mapping={'title':'title','description':'description','duration_seconds':'duration','expiration_value':'expiration_date','rating':'rating','view_count':'view_count','publication_value':'publication_date','family_friendly':'family_friendly','requires_subscription':'requires_subscription','live':'live'}
        for src,key in mapping.items():
            if p[src] is not None:values[key]=p[src]
        if p['tags_json'] is not None:values['tag']=json.loads(p['tags_json'])
        for key,column in [('restriction','restriction_country_codes_json'),('platform','platform_codes_json')]:
            if p[column] is not None:values[key]={'text':' '.join(json.loads(p[column])),'attributes':{'relationship':p[key+'_relationship']}}
        if p['uploader_name'] is not None:
            values['uploader']={'text':p['uploader_name'],'attributes':{'info':urls[p['uploader_info_url_id']]}} if p['uploader_info_url_id'] else p['uploader_name']
        videos[use['page_id']].append({'values':values})
    for row in db.execute('SELECT * FROM page_sitemap_profiles'):
        p=dict(row);proven(p);page_profiles[p['page_id']]=p
    publications={r['news_publication_id']:dict(r) for r in db.execute('SELECT * FROM news_publications')}
    for row in db.execute('SELECT * FROM news_sitemap_profiles WHERE qualifies_as_news=1'):
        p=dict(row);version=proven(p);page=pages[p['page_id']]
        if page['content_version_sha256']!=version or page['publication_status']=='observed_candidate':raise ValueError('News does not match a published page version')
        decision('page',p['page_id'],'news_sitemap',version);pub=publications[p['news_publication_id']]
        if not pub['source_evidence_id'] or pub['source_evidence_id'] not in evidence:raise ValueError('Unverified News publication identity')
        p.update(publication_name=pub['name'],publication_language=pub['language']);news_profiles[p['page_id']]=p
    alternates={}
    for group in db.execute("SELECT * FROM translation_groups WHERE approval_state='approved'"):
        if group['source_evidence_id'] not in evidence:raise ValueError('Unverified translation-group approval')
        members=[dict(r) for r in db.execute('SELECT * FROM translation_members WHERE translation_group_id=? ORDER BY hreflang',(group['translation_group_id'],))]
        if not members:raise ValueError('Approved translation group is empty')
        values=[{'language':r['hreflang'],'url':urls[pages[r['page_id']]['primary_url_id']]} for r in members]
        for member in members:
            page=pages[member['page_id']];version=evidence.get(member['source_evidence_id'])
            if not version or page['content_version_sha256']!=version or page['publication_status']=='observed_candidate':raise ValueError('Translation member no longer matches published version')
            pid=member['page_id']
            if pid in alternates and alternates[pid]!=values:raise ValueError('Conflicting approved translation groups')
            alternates[pid]=values
    published={}
    for row in db.execute("SELECT f.*,p.coverage_receipt_reference FROM sitemap_files f JOIN publication_runs p ON f.publication_id=p.publication_id WHERE p.state='public_verified' ORDER BY p.published_at,f.file_id"):
        if row['actual_file_modified_at'] and row['content_sha256'] and row['coverage_receipt_reference']:
            published[urls[row['public_url_id']]]={'lastmod':row['actual_file_modified_at'],'content_sha256':row['content_sha256'],'receipt':row['coverage_receipt_reference'],'state':'public_verified'}
    return {'images':images,'videos':videos,'pages':page_profiles,'news':news_profiles,'alternates':alternates,'published_file_modifications':published}
