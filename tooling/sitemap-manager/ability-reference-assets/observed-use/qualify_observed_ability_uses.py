#!/usr/bin/env python3
"""Offline Ability DOM/delivery qualification; returns one managed-source feed, never writes DBs."""
import argparse,collections,datetime as dt,hashlib,json,pathlib,re,tempfile,os,zipfile
from html.parser import HTMLParser
from urllib.parse import urljoin
SOURCE='ability_reference_illustrations_v1'
CONSENT_SHA256='63be2d9baff41c2ca0fbfe60c8c20d9dfd510ac1a9656e7d1a0916359df2aaa0'
INDEX_SHA256='c0e64be28c26572a55cf3ace3427dc6eb8e6ca2f02f63a9aca6bad5926e62654'
SECTION='ability-reference-illustrations'
MAX_BODY=8*1024*1024
MARKERS=('data-ability-reference-asset','data-reference-question-id','data-reference-role')
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
pack=lambda v:json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()
sha=lambda b:hashlib.sha256(b).hexdigest()
def public_purpose_alt(item,image):
    """Replace the source packet's ID-only fallback with its literal reference topic."""
    planned=image['purpose_alt_suggestion']
    if re.fullmatch(r'(Question|Example) illustration accompanying reference question \d+',planned):
        question=' '.join(item.get('source_question','').split())
        if not question:raise ValueError('Literal source question required for public alt fallback')
        role={'question_image':'Question','example_image':'Example'}[image['role']]
        return role+' illustration accompanying: '+question
    return planned
def canonical_uri(value):
    """IRI spelling only: UTF-8 encode non-ASCII and uppercase existing escapes; never decode."""
    value=''.join(c if c.isascii() else ''.join(f'%{b:02X}' for b in c.encode('utf-8')) for c in value)
    return re.sub(r'%[0-9a-fA-F]{2}',lambda match:match[0].upper(),value)
def stamp(v):
    x=dt.datetime.fromisoformat(v.replace('Z','+00:00'))
    if x.tzinfo is None:raise ValueError('Timezone required')
    return x.astimezone(dt.timezone.utc)
def fresh(v,now):
    try:return -300<=(now-stamp(v)).total_seconds()<=86400
    except (ValueError,TypeError,AttributeError):return False
def safe_path(value):
    if not isinstance(value,str) or not value or '\\' in value or ':' in value or value.startswith('/') or any(p in ('','.','..') for p in value.split('/')):raise ValueError('Unsafe local evidence path')
    return pathlib.PurePosixPath(value)
def local_read(root,name,limit):
    rel=safe_path(name);root=pathlib.Path(root).resolve();f=root.joinpath(*rel.parts)
    if not f.resolve().is_relative_to(root) or any(root.joinpath(*rel.parts[:i]).is_symlink() for i in range(1,len(rel.parts)+1)):raise ValueError('Evidence path escapes root or is a symlink')
    if f.stat().st_size>limit:raise ValueError('Evidence exceeds bound')
    return f.read_bytes()
class PacketReader:
    def __init__(self,path):
        self.path=pathlib.Path(path);self.z=zipfile.ZipFile(self.path) if self.path.is_file() else None
        if self.z:
            names=self.z.namelist()
            if len(names)!=len(set(names)):raise ValueError('Duplicate packet member')
            for i in self.z.infolist():
                safe_path(i.filename.rstrip('/'))
                if (i.external_attr>>16)&0o170000==0o120000:raise ValueError('Packet symlink')
            self.prefix='reference-render-plan/' if 'reference-render-plan/parent-render-index.json' in names else ''
        else:self.prefix='reference-render-plan/' if (self.path/'reference-render-plan/parent-render-index.json').is_file() else ''
    def read(self,name,limit=5*1024*1024):
        name=self.prefix+str(safe_path(name))
        if not self.z:return local_read(self.path,name,limit)
        if self.z.getinfo(name).file_size>limit:raise ValueError('Packet member too large')
        return self.z.read(name)
    def close(self):
        if self.z:self.z.close()
def load_packet(path,expected_consent=CONSENT_SHA256,expected_index=INDEX_SHA256):
    """Pins must come from checked-in owner policy, never from the untrusted packet itself."""
    r=PacketReader(path)
    try:
        cb=r.read('reference-publication-consent.json');ib=r.read('parent-render-index.json')
        if sha(cb)!=expected_consent or sha(ib)!=expected_index:raise ValueError('Trusted consent/index hash mismatch')
        c=json.loads(cb);index=json.loads(ib)
        if c.get('authorization_status')!='AUTHORIZED_FOR_EXACT_PUBLIC_REFERENCE_USE' or index.get('consent_sha256')!=expected_consent or index.get('consent_file')!='reference-publication-consent.json':raise ValueError('Exact public-reference authorization required')
        scope=c['scope'];pb=r.read(scope['pair_file'])
        if sha(pb)!=scope['pair_file_sha256']:raise ValueError('Consent pair-file hash mismatch')
        pairs=[json.loads(l) for l in pb.splitlines() if l];byparent=collections.defaultdict(dict);allpairs=set()
        for p in pairs:
            role=p['role'];qid=p['question_id'];key=f'Ability/{"Questions" if role=="question_image" else "Examples"}/{qid}.jpg';parent=p['parent_url'];identity=(parent,p['image_url'])
            if role not in ('question_image','example_image') or type(qid) is not int or qid<=0 or p['object_key']!=key or p['image_url']!='https://images.pinnacleblooms.org/'+key or not parent.startswith('https://www.pinnacleblooms.org/abs/') or identity in allpairs or p['asset_id'] in byparent[parent]:raise ValueError('Unknown/duplicate consent pair')
            allpairs.add(identity);byparent[parent][p['asset_id']]=p
        if len(pairs)!=scope['exact_parent_image_pairs'] or len({p['asset_id'] for p in pairs})!=scope['distinct_asset_objects'] or set(byparent)!=set(scope['parent_urls']) or len(byparent)!=scope['existing_abs_parents']:raise ValueError('Consent scope accounting mismatch')
        parents={}
        for e in index['parents']:
            parent=e['parent_url'];raw=r.read(e['manifest_path']);d=json.loads(raw)
            if parent in parents or parent not in byparent or sha(raw)!=e['sha256'] or len(raw)!=e['bytes'] or d['parent_url']!=parent or d['authorization_ref']['sha256']!=expected_consent:raise ValueError('Parent render manifest binding mismatch')
            images={}
            for item in d['section']['reference_items']:
                for im in item['illustrations']:
                    a=im['asset_id'];p=byparent[parent].get(a)
                    if not p or a in images or (im['image_url'],im['object_key'],im['role'],item['question_id'],item['assessment_id'])!=(p['image_url'],p['object_key'],p['role'],p['question_id'],p['assessment_id']) or im['authorization']['consent_sha256']!=expected_consent or im['authorization']['scope_pair_file_sha256']!=scope['pair_file_sha256']:raise ValueError('Illustration differs from consent scope')
                    marker=dict(zip(MARKERS,(a,str(item['question_id']),im['role'])))
                    if im['proposed_dom_marker']!=marker:raise ValueError('Unknown planned marker contract')
                    images[a]={**p,'alt':public_purpose_alt(item,im),'manifest_alt':im['purpose_alt_suggestion'],'markers':marker}
            if set(images)!=set(byparent[parent]) or len(images)!=e['image_relationships'] or d['section']['id']!=SECTION:raise ValueError('Render scope differs from authorized pairs')
            parents[parent]={'manifest_sha256':e['sha256'],'images':images}
        if set(parents)!=set(byparent):raise ValueError('Missing/unknown render parent')
        return {'consent_sha256':expected_consent,'index_sha256':expected_index,'asset_metadata_sha256':scope['asset_metadata_sha256'],'parents':parents,'pairs':allpairs}
    finally:r.close()
def strings(v):
    if v is None:return []
    if isinstance(v,str):return [v]
    if isinstance(v,list) and all(isinstance(x,str) for x in v):return v
    raise ValueError('Invalid raw header type')
def headers(row,name):
    result=[];lower=name.lower()
    for k,v in row.items():
        if k.lower()==lower:result+=strings(v)
    if lower=='x-robots-tag':
        for k in ('x_robots','x_robots_tags'):result+=strings(row.get(k))
    for key in ('headers','response_headers','raw_headers','raw_header'):
        raw=row.get(key)
        if raw is None:continue
        if isinstance(raw,str):raw=[s.split(':',1) for s in raw.splitlines() if ':' in s]
        pairs=raw.items() if isinstance(raw,dict) else raw
        for k,v in pairs:
            if k.lower()==lower:result+=strings(v)
    return result
def restricted(row,meta=()):
    return bool({'noindex','none','noimageindex'}&set(re.findall(r'[a-z_]+',' '.join(headers(row,'X-Robots-Tag')+list(meta)).lower())))
def raw_robots_present(row):
    return any(k.lower() in ('x-robots-tag','x_robots','x_robots_tags','headers','response_headers','raw_headers','raw_header','robots') and v is not None for k,v in row.items())
def head_decision(row,url,now):
    if not row or row.get('url')!=url or row.get('method')!='HEAD' or not fresh(row.get('observed_at',row.get('checked_at')),now):return 'uncertain','missing_stale_or_unbound_HEAD'
    if not raw_robots_present(row):return 'uncertain','raw_image_robots_evidence_unknown'
    if restricted(row) or row.get('robots_veto') is True:return 'disqualified','current_image_robots_veto'
    s=row.get('status');location=row.get('location') or any(headers(row,'Location'))
    if location or row.get('final_url',url)!=url:return 'disqualified','current_image_redirect'
    if type(s) is int and 200<=s<500 and s not in (200,429):return 'disqualified','current_image_HTTP_disqualified'
    if s!=200:return 'uncertain','current_image_delivery_unavailable'
    kinds=[row.get('content_type')] if row.get('content_type') else []
    kinds+=headers(row,'Content-Type')
    if not kinds:return 'uncertain','image_MIME_unknown'
    if not all(x.lower().startswith('image/') for x in kinds):return 'disqualified','current_image_MIME_disqualified'
    try:length=int(row.get('content_length'))
    except (TypeError,ValueError):return 'uncertain','image_length_unknown'
    if length<=0:return 'disqualified','current_image_empty'
    if any(row.get(k) is True for k in ('credentials_sent','redirects_followed','media_bodies_downloaded')):return 'uncertain','unqualified_HEAD_capture'
    if row.get('delivery_verified',row.get('direct_image_delivery_verified')) is not True:return 'uncertain','HEAD_producer_not_verified'
    return 'qualified','current_direct_image_HEAD'
class RenderHTML(HTMLParser):
    """Only the named reference section/markers count; shell and hidden uses never qualify."""
    def __init__(self,parent,plan,consent):
        super().__init__(convert_charrefs=True);self.parent=parent;self.plan=plan;self.consent=consent;self.stack=[];self.errors=[];self.images={};self.canonical=[];self.robots=[];self.sections=0;self.selection_complete=False;self.figures=collections.Counter()
    def handle_startendtag(self,tag,attrs):
        self.handle_starttag(tag,attrs)
        if tag not in VOID:self.handle_endtag(tag)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);inside=any(f['inside'] for f in self.stack);hidden=any(f['hidden'] or f['tag'] in ('template','noscript','script','style') for f in self.stack) or 'hidden' in a or a.get('aria-hidden','').lower()=='true' or bool(re.search(r'display\s*:\s*none|visibility\s*:\s*hidden',a.get('style',''),re.I)) or bool({'hidden','sr-only','visually-hidden','is-hidden'}&set(a.get('class','').split()))
        if tag=='link' and 'canonical' in a.get('rel','').lower().split() and not any(f['tag'] in ('template','noscript','script') for f in self.stack):
            href=a.get('href','');self.canonical.append(href if re.match(r'^[A-Za-z][A-Za-z0-9+.-]*:',href) else urljoin(self.parent,href))
        if tag=='meta' and a.get('name','').lower() in ('robots','googlebot','bingbot'):self.robots.append(a.get('content',''))
        if tag=='section' and a.get('id')==SECTION:
            self.sections+=1;inside=True
            if not any(f['tag']=='body' for f in self.stack) or a.get('data-source')!=SOURCE or a.get('data-render-manifest-sha256')!=self.plan['manifest_sha256'] or a.get('data-reference-consent-sha256')!=self.consent:self.errors.append('section_source_binding_mismatch')
            self.selection_complete=a.get('data-observed-set-complete')=='true'
        mark={k:a[k] for k in MARKERS if k in a};anc=next((f['mark'] for f in reversed(self.stack) if f['mark']),{})
        if inside:
            if len(a)!=len(attrs) or hidden:self.errors.append('duplicate_attribute_or_hidden_section_use')
            if tag in ('script','style','template','noscript','form','input','textarea','select','button','source','picture'):self.errors.append('nonreference_or_unresolved_renderer_content')
            if mark and (len(mark)!=3 or tag not in ('figure','img')):self.errors.append('partial_or_unknown_source_marker')
            if mark and anc and mark!=anc:self.errors.append('nested_source_marker_conflict')
            if tag=='figure' and mark:self.figures.setdefault(mark[MARKERS[0]],0)
            if tag=='img':
                marker=mark or anc;asset=marker.get(MARKERS[0]);expected=self.plan['images'].get(asset)
                if not expected or marker!=expected['markers'] or a.get('src')!=expected['image_url'] or a.get('alt')!=expected['alt'] or any(a.get(k) for k in ('srcset','data-src','data-srcset')):self.errors.append('unknown_or_mismatched_parent_asset_img')
                elif asset in self.images:self.errors.append('duplicate_exact_source_image')
                else:self.images[asset]=expected
                if anc:self.figures[anc[MARKERS[0]]]+=1
        elif mark:self.errors.append('source_marker_outside_reference_section')
        if tag not in VOID:self.stack.append({'tag':tag,'inside':inside,'hidden':hidden,'mark':mark})
    def handle_endtag(self,tag):
        found=next((i for i in range(len(self.stack)-1,-1,-1) if self.stack[i]['tag']==tag),None)
        if found is None:return
        if any(f['inside'] for f in self.stack[found:]) and found!=len(self.stack)-1:self.errors.append('malformed_reference_section')
        del self.stack[found:]
    def finish(self):
        self.close()
        if self.sections!=1 or any(f['inside'] for f in self.stack) or any(n!=1 for n in self.figures.values()):self.errors.append('missing_duplicate_or_unclosed_reference_section')
def parent_observation(row,parent,plan,packet,feed,now,base):
    if not feed or feed.get('decision')!='INCLUDE' or feed.get('canonical_url')!=parent:return None,'parent_not_approved_exact_canonical'
    if not fresh(row.get('observed_at'),now):return None,'current_parent_capture_stale'
    if row.get('page_url')==parent and row.get('method')=='GET' and all(row.get(k) is False for k in ('credentials_sent','redirects_followed','media_bodies_downloaded')):
        if restricted(row) or any(row.get(k) is True for k in ('noindex','noimageindex','canonical_conflict')):return None,'current_parent_robots_or_canonical_veto'
        status=row.get('status')
        if type(status) is int and 200<=status<=499 and status not in (200,429):return None,'current_parent_HTTP_veto'
        if row.get('final_url',parent)!=parent or row.get('location') or any(headers(row,'Location')):return None,'current_parent_redirect_veto'
        if row.get('publication_qualified') is False:return None,'current_parent_publication_gate_veto'
    if row.get('page_url')!=parent or row.get('method')!='GET' or row.get('status')!=200 or row.get('final_url')!=parent or row.get('publication_qualified') is not True or row.get('body_complete') is not True:return None,'current_parent_capture_unqualified'
    if any(row.get(k) is not False for k in ('credentials_sent','redirects_followed','media_bodies_downloaded')):return None,'public_anonymous_capture_flags_required'
    if not row.get('content_type','').lower().startswith('text/html'):return None,'current_parent_MIME_unqualified'
    if isinstance(row.get('body_bytes_value'),bytes):body=row['body_bytes_value']
    elif 'body_hex' in row:body=bytes.fromhex(row['body_hex'])
    elif 'body_path' in row:body=local_read(base,row['body_path'],MAX_BODY)
    else:return None,'actual_parent_HTML_missing'
    if len(body)>MAX_BODY or sha(body)!=row.get('body_sha256') or row.get('body_bytes',len(body))!=len(body):return None,'actual_parent_HTML_hash_or_length_mismatch'
    parser=RenderHTML(parent,plan,packet['consent_sha256']);parser.feed(body.decode('utf-8'));parser.finish()
    if not raw_robots_present(row):return None,'raw_parent_robots_evidence_unknown'
    if restricted(row,parser.robots+strings(row.get('robots'))) or row.get('noindex') is True or row.get('noimageindex') is True or row.get('canonical_conflict') is True:return None,'current_parent_robots_or_canonical_veto'
    if parser.canonical and (len(parser.canonical)!=1 or canonical_uri(parser.canonical[0])!=canonical_uri(parent)):return None,'current_parent_canonical_conflict'
    if parser.errors:return None,';'.join(sorted(set(parser.errors)))
    return {'images':parser.images,'selection_complete':parser.selection_complete,'body_sha256':sha(body),'observed_at':row['observed_at'],'canonical_basis':'explicit_HTML' if parser.canonical else 'approved_feed_preferred_URL_no_HTML_conflict'},None

def feed_state_from_db(db,packet):
    """SELECT only from the existing public feed's pages table; caller retains transaction ownership."""
    parents=list(packet['parents']);q=','.join('?' for x in parents);cur=db.execute(f'SELECT url,canonical_url,decision,metadata_json FROM pages WHERE url IN ({q}) OR instr(metadata_json,?)>0',parents+[SOURCE]);names=[x[0] for x in cur.description];result={'schema_version':1,'source':SOURCE,'render_index_sha256':packet['index_sha256'],'ownership_projection_complete':True,'parents':[],'prior_owned':[]}
    for raw in cur:
        r=dict(zip(names,raw));result['parents'].append({k:r[k] for k in ('url','canonical_url','decision')});meta=json.loads(r['metadata_json'])
        for image,owner in meta.get('managed_image_ownership',{}).items():
            if SOURCE in owner.get('owners',[]):result['prior_owned'].append({'page_url':r['url'],'image_url':image,'source_sha256':owner.get('source_sha256',{}).get(SOURCE)})
    result['parents'].sort(key=lambda r:r['url']);result['prior_owned'].sort(key=lambda r:(r['page_url'],r['image_url']))
    return result

def feed_fingerprint(state):
    value={k:state[k] for k in ('schema_version','source','render_index_sha256','ownership_projection_complete')}
    value['parents']=sorted(state['parents'],key=lambda r:r['url']);value['prior_owned']=sorted(state['prior_owned'],key=lambda r:(r['page_url'],r['image_url']))
    return sha(pack(value))

def assert_feed_state_unchanged(db,packet,result):
    """Caller invokes immediately before existing reconciliation, in the same feed transaction."""
    if feed_fingerprint(feed_state_from_db(db,packet))!=result['feed_state_sha256']:raise ValueError('Public feed/source ownership changed; requalify before reconciliation')

def qualify(packet,observations,heads,feed_state,now,body_base='.'):
    if isinstance(now,str):now=stamp(now)
    if now.tzinfo is None:raise ValueError('Aware qualification clock required')
    if feed_state.get('schema_version')!=1 or feed_state.get('source')!=SOURCE or feed_state.get('render_index_sha256')!=packet['index_sha256'] or feed_state.get('ownership_projection_complete') is not True or not isinstance(feed_state.get('prior_owned'),list):raise ValueError('Explicit complete source-ownership projection required')
    if observations.get('source')!=SOURCE or observations.get('consent_sha256')!=packet['consent_sha256'] or observations.get('render_index_sha256')!=packet['index_sha256'] or type(observations.get('complete_observed_parent_set')) is not bool:raise ValueError('Observed set must bind exact source/consent/render index and completeness')
    obs={}
    for r in observations['parents']:
        p=r['page_url']
        if p not in packet['parents'] or p in obs:raise ValueError('Unknown/duplicate observed parent')
        obs[p]=r
    declared=observations['complete_observed_parent_set']
    if declared and set(obs)!=set(packet['parents']):raise ValueError('Declared complete parent set is incomplete')
    feeds={}
    for r in feed_state['parents']:
        if r['url'] in feeds:raise ValueError('Duplicate feed parent')
        feeds[r['url']]=r
    prior={}
    for r in feed_state.get('prior_owned',[]):
        pair=(r['page_url'],r['image_url'])
        if pair not in packet['pairs'] or pair in prior or not re.fullmatch('[a-f0-9]{64}',r.get('source_sha256') or ''):raise ValueError('Prior Ability ownership outside exact scope or without provenance')
        prior[pair]={k:r[k] for k in ('page_url','image_url','source_sha256')}
    observed={};parent_holds={}
    for parent,plan in packet['parents'].items():
        if parent not in obs:parent_holds[parent]='parent_not_observed';continue
        try:value,reason=parent_observation(obs[parent],parent,plan,packet,feeds.get(parent),now,body_base)
        except (ValueError,TypeError,KeyError,OSError,UnicodeError) as e:value,reason=None,'invalid_local_parent_evidence:'+type(e).__name__
        if reason:parent_holds[parent]=reason
        else:observed[parent]=value
    parent_vetoes={p:r for p,r in parent_holds.items() if r in ('current_parent_robots_or_canonical_veto','current_parent_canonical_conflict','current_parent_HTTP_veto','current_parent_redirect_veto','current_parent_publication_gate_veto')}
    complete=declared and not parent_holds and all(p['selection_complete'] for p in observed.values());qualified={};held=[];withdraw=[]
    for parent,plan in packet['parents'].items():
        capture=observed.get(parent)
        for asset,p in plan['images'].items():
            pair=(parent,p['image_url']);decision='uncertain';reason=parent_holds.get(parent)
            if capture:
                if asset not in capture['images']:reason='not_in_current_complete_reference_section' if capture['selection_complete'] else 'partial_reference_section_selection'
                else:
                    try:decision,reason=head_decision(heads.get(p['image_url']),p['image_url'],now)
                    except (ValueError,TypeError,KeyError):reason='invalid_raw_HEAD_evidence'
                    if decision=='qualified':qualified[pair]={'page_url':parent,'image_url':p['image_url'],'source_sha256':capture['body_sha256'],'asset_id':asset,'question_id':p['question_id'],'role':p['role'],'observed_at':capture['observed_at'],'render_manifest_sha256':plan['manifest_sha256'],'consent_sha256':packet['consent_sha256'],'parent_canonical_basis':capture['canonical_basis']};continue
            held.append({'page_url':parent,'image_url':p['image_url'],'condition':reason or 'qualification_unknown'})
            if complete and pair in prior and capture and (asset not in capture['images'] or decision=='disqualified'):withdraw.append({'source':SOURCE,'page_url':parent,'image_url':p['image_url'],'operation':'withdraw_source_ownership','condition':reason})
    removed={(r['page_url'],r['image_url']) for r in withdraw};desired={k:v for k,v in prior.items() if k not in removed};desired.update(qualified);carry=[v for k,v in desired.items() if k not in qualified]
    reconciliation_parent_vetoes={p:parent_vetoes[p] for p in sorted({p for p,i in desired}) if p in parent_vetoes}
    can_reconcile=not reconciliation_parent_vetoes and all(feeds.get(p,{}).get('decision')=='INCLUDE' and feeds[p].get('canonical_url')==p for p,i in desired)
    key=lambda r:(r['page_url'],r['image_url'])
    return {'schema_version':1,'source':SOURCE,'as_of':now.astimezone(dt.timezone.utc).isoformat(),'status':'qualified_complete' if complete and not held else 'source_qualification_held','complete_observed_parent_set_requested':declared,'complete_safe_observed_parent_set':bool(complete),'can_reconcile':can_reconcile,'qualified':sorted(qualified.values(),key=key),'desired':sorted(desired.values(),key=key),'carried_forward':sorted(carry,key=key),'withdrawals':sorted(withdraw,key=key),'held':sorted(held,key=key),'parent_holds':parent_holds,'parent_vetoes':parent_vetoes,'reconciliation_parent_vetoes':reconciliation_parent_vetoes,'consent_sha256':packet['consent_sha256'],'render_index_sha256':packet['index_sha256'],'feed_state_sha256':feed_fingerprint(feed_state),'counts':{'authorized_pairs':len(packet['pairs']),'observed_parents':len(obs),'qualified_pairs':len(qualified),'held_pairs':len(held),'prior_owned_pairs':len(prior),'carried_forward_pairs':len(carry),'source_local_withdrawals':len(withdraw)},'database_writes':0,'network_requests':0}

def load_heads(path,receipt,packet):
    raw=pathlib.Path(path).read_bytes();proof=json.loads(pathlib.Path(receipt).read_bytes())
    if proof.get('delivery_receipt_sha256')!=sha(raw) or proof.get('source_asset_sha256')!=packet['asset_metadata_sha256'] or type(proof.get('media_bodies_downloaded')) is not int or proof['media_bodies_downloaded']!=0:raise ValueError('Delivery receipt/source binding mismatch')
    heads={}
    for line in raw.splitlines():
        if not line:continue
        r=json.loads(line)
        if r['url'] in heads:raise ValueError('Duplicate delivery URL')
        heads[r['url']]=r
    return heads

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--packet',required=True,type=pathlib.Path);p.add_argument('--observations',required=True,type=pathlib.Path);p.add_argument('--heads',required=True,type=pathlib.Path);p.add_argument('--head-receipt',required=True,type=pathlib.Path);p.add_argument('--feed-state',required=True,type=pathlib.Path);p.add_argument('--out',required=True,type=pathlib.Path);p.add_argument('--as-of',required=True);p.add_argument('--expected-consent-sha256',default=CONSENT_SHA256);p.add_argument('--expected-index-sha256',default=INDEX_SHA256);a=p.parse_args()
    packet=load_packet(a.packet,a.expected_consent_sha256,a.expected_index_sha256);heads=load_heads(a.heads,a.head_receipt,packet);result=qualify(packet,json.loads(a.observations.read_bytes()),heads,json.loads(a.feed_state.read_bytes()),stamp(a.as_of),a.observations.parent)
    inputs=[x.resolve() for x in (a.packet,a.observations,a.heads,a.head_receipt,a.feed_state)];out=a.out.resolve()
    if any(out==x or x.is_dir() and out.is_relative_to(x) for x in inputs):raise ValueError('Output overlaps source evidence')
    blobs={name:b''.join(pack(r)+b'\n' for r in result[field]) for name,field in [('qualified-relationships.jsonl','qualified'),('desired-source-relationships.jsonl','desired'),('source-local-withdrawals.jsonl','withdrawals'),('held-dispositions.jsonl','held')]};receipt={k:v for k,v in result.items() if k not in ('qualified','desired','carried_forward','withdrawals','held')};receipt['output_sha256']={n:sha(b) for n,b in blobs.items()};blobs['observed-use-receipt.json']=json.dumps(receipt,sort_keys=True,indent=2).encode()+b'\n';out.mkdir(parents=True,exist_ok=True)
    for name in blobs:
        dest=out/name
        if any(dest==x or dest.exists() and x.is_file() and dest.samefile(x) for x in inputs):raise ValueError('Output file overlaps input evidence')
    with tempfile.TemporaryDirectory(prefix='.ability-observed-',dir=out) as td:
        for n,b in blobs.items():(pathlib.Path(td)/n).write_bytes(b)
        for n in blobs:os.replace(pathlib.Path(td)/n,out/n)
    print(json.dumps({k:receipt[k] for k in ('source','status','complete_safe_observed_parent_set','can_reconcile','counts')},indent=2));return 0 if result['status']=='qualified_complete' and result['can_reconcile'] else 2
if __name__=='__main__':raise SystemExit(main())
