"""Join saved evidence to the existing queue. Offline, no crawl, spend or mutation."""
import argparse
import csv
import datetime as dt
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

EVENTS = {
    'phone_link_click': 'contact_intent',
    'whatsapp_click': 'contact_intent',
    'enquiry_link_click': 'navigation',
    'enquiry_accepted': 'api_accepted_request',
    'enroll': 'navigation', 'contact_us': 'navigation',
    'ads_conversion_Page_view_Page_load_www_1': 'navigation',
    'form_submit': 'unqualified_event', 'allKeyEvents': 'mixed_not_leads',
}
OUTCOMES = ('answered_calls', 'qualified_enquiries', 'walk_ins', 'completed_enrolments')

def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

def url_key(url):
    """Match tracking variants only; retain hosts/paths unless an explicit canonical says otherwise."""
    p = urlsplit(url)
    return urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path or '/', '', ''))

def payloads(result):
    for block in result.get('content', []):
        try:
            value = json.loads(block.get('text', ''))
            if isinstance(value, dict):
                yield value
        except (ValueError, TypeError):
            continue

def aggregates(path):
    """Allow only aggregate rows; reject accidental person/contact-level input."""
    if path is None:
        return {'state': 'unavailable', 'counts': None,
                'reason': 'No receiving-team aggregate source supplied; no page-to-admission attribution.'}
    required = {'period_start', 'period_end', 'timezone', 'complete_through', 'centre_id',
                'intake_channel', 'attribution_basis', 'counting_unit', 'duplicate_handling',
                'test_exclusions', 'source_report_reference', 'extracted_at'} | set(OUTCOMES)
    with path.open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle)
        if set(reader.fieldnames or []) != required:
            raise ValueError('Aggregate input must have the exact documented columns; no personal fields.')
        rows = list(reader)
    seen = set()
    for row in rows:
        if any(not row[k] for k in required-set(OUTCOMES)):
            raise ValueError('Aggregate provenance/coverage fields cannot be blank.')
        if row['attribution_basis'] not in ('recorded', 'self-reported', 'unknown'):
            raise ValueError('Unknown attribution basis.')
        identity = tuple(row[k] for k in ('period_start','period_end','centre_id','intake_channel','source_report_reference'))
        if identity in seen:
            raise ValueError('Duplicate aggregate row; do not double-count outcomes.')
        seen.add(identity)
        if row['period_start'] > row['period_end'] or row['complete_through'] < row['period_end']:
            raise ValueError('Use ordered, complete reporting periods only.')
        for metric in OUTCOMES:
            raw = row[metric].strip()
            row[metric] = None if raw in ('', 'null', 'unavailable') else int(raw)
            if row[metric] is not None and row[metric] < 0:
                raise ValueError('Negative outcome count.')
    return {'state': 'aggregate_observations', 'rows': rows,
            'attribution': 'Parallel complete-period observations only; no causal or person-level join.'}

def build(root, outcome_path=None, windsor_dir=None):
    queue = read(root/'queue.json')
    work = root.parent
    sources = []
    def source(path, kind):
        if not path.exists():
            return None
        data = path.read_bytes()
        record = {'kind': kind, 'file': path.as_posix(), 'sha256': hashlib.sha256(data).hexdigest()}
        sources.append(record)
        return record
    regional_path = root/'regional-baseline-20261004.json'
    regional = read(regional_path); source(regional_path, 'GSC complete-period baseline')
    gsc = {url_key(p['url']): {'region': region, 'start': regional['start'], 'end': regional['end'],
            'clicks': p['clicks'], 'impressions': p['impressions'], 'ctr_percent': p['ctr'],
            'position': p['position'], 'scope': 'Centre destination, not visitor residence or availability'}
           for region, group in regional['groups'].items() for p in group['pages']}
    ahrefs_path = work/'ahrefs-growth-20261004/audit-triage-20261004-raw.json'
    ahrefs = read(ahrefs_path); source(ahrefs_path, 'Ahrefs saved audit')
    audits = [row for obj in payloads(ahrefs['projects']['response']) for row in obj.get('healthscores', [])]
    # Consume the newly available completed Ask crawl, retaining the earlier source.
    latest_ask = root/'ecosystem-closeout-20261005/ahrefs-ask-metadata.json'
    if latest_ask.exists():
        source(latest_ask, 'Ahrefs Ask completed crawl metadata')
        newer = [row for obj in payloads(read(latest_ask)) for row in obj.get('healthscores', [])]
        ids = {r['project_id'] for r in newer}
        audits = [r for r in audits if r['project_id'] not in ids] + newer
    for row in audits:
        row['usable_completed_baseline'] = row.get('status') == 'Completed'
    keyword_path = work/'ahrefs-growth-20261004/india-organic-keywords-20261004.json'
    keyword_source = read(keyword_path); source(keyword_path, 'Ahrefs saved India query demand')
    demand = {}
    for obj in payloads(keyword_source.get('response', {})):
        for row in obj.get('keywords', []):
            if row.get('best_position_url'):
                demand.setdefault(url_key(row['best_position_url']), []).append(row)
    frog = {}
    for receipt in sorted(root.glob('*/screaming-frog/*/receipt.json')):
        source(receipt, 'Screaming Frog bounded run')
        for csv_path in receipt.parent.glob('internal_all.csv'):
            source(csv_path, 'Screaming Frog URL rows')
            with csv_path.open(encoding='utf-8-sig', newline='') as handle:
                for row in csv.DictReader(handle):
                    if row.get('Address'):
                        frog[url_key(row['Address'])] = {k: row.get(k) for k in
                            ('Address','Status Code','Indexability','Canonical Link Element 1','Title 1','H1-1')}
    # Saved initial crawl remains evidence where no newer focused row is available.
    original = work/'ahrefs-growth-20261004/screaming-frog-setup/audits'
    for csv_path in sorted(original.glob('*/internal_all.csv')):
        source(csv_path, 'Screaming Frog earlier sample')
        with csv_path.open(encoding='utf-8-sig', newline='') as handle:
            for row in csv.DictReader(handle):
                if row.get('Address'):
                    frog.setdefault(url_key(row['Address']), {k: row.get(k) for k in
                        ('Address','Status Code','Indexability','Canonical Link Element 1','Title 1','H1-1')})
    results = {}
    for event in queue.get('results', []):
        results[event['item_id']] = event
    rows = []
    for item in queue['items']:
        target = item.get('object', '')
        key = url_key(target) if isinstance(target, str) and target.startswith('https://') and ' ' not in target else None
        event = results.get(item['id'])
        release = None
        urls = {key} if key else set()
        if event and Path(event['receipt']).exists():
            saved = read(Path(event['receipt']))
            release = {k: saved.get(k) for k in ('outcome','at','commit','deployment','public_url')}
            for value in [saved.get('public_url'), *saved.get('public_urls', [])]:
                if isinstance(value, str) and value.startswith('https://'):
                    urls.add(url_key(value))
        rows.append({'id': item['id'], 'priority': item['priority'], 'state': item['status'],
            'url': key, 'root_cause_key': item.get('root_cause_key', item['id']),
            'decision_evidence': item.get('evidence', item.get('source')),
            'gsc': {u:gsc[u] for u in sorted(urls) if u in gsc},
            'screaming_frog': {u:frog[u] for u in sorted(urls) if u in frog}, 'release': release,
            'ahrefs_india_queries': {u:demand[u] for u in sorted(urls) if u in demand},
            'receipt': event['receipt'] if event else None,
            'next_condition': item.get('next_condition'),
            'measurement': item.get('measurement', 'No outcome attributed from delivery alone')})
    windsor = {'state': 'not_supplied'}
    if windsor_dir is not None:
        ga4_path, gbp_path = windsor_dir/'windsor-ga4.json', windsor_dir/'windsor-gbp.json'
        ga4, gbp = read(ga4_path), read(gbp_path)
        source(ga4_path, 'Windsor GA4 consented landing source observations')
        source(gbp_path, 'Windsor Google Business Profile identity read-back')
        for document in (ga4, gbp):
            if document.get('data', {}).get('status') != 'done':
                raise ValueError('Windsor source must be a completed pull, not a pending job.')
        windsor = {'state':'connected_source_observations',
            'ga4': {**ga4['request'],'rows':ga4['data']['data'],
                'meaning':'Observed consented sessions; separate period/provider coverage from GSC. No uplift inferred.'},
            'google_business_profiles':gbp['data']['data'],
            'boundary':'Listing identity/open status is not confirmed clinician or appointment availability. No personal records or causal lead joins.'}
    return {'generated_at': dt.datetime.now(dt.timezone.utc).isoformat(),
        'mode': 'offline_existing_evidence_only', 'queue': (root/'queue.json').as_posix(),
        'rows': sorted(rows, key=lambda r: -r['priority']), 'sources': sources,
        'ahrefs_audits': audits, 'ahrefs_query_source': keyword_path.as_posix(),
        'event_dictionary': EVENTS, 'receiving_team': aggregates(outcome_path), 'windsor':windsor,
        'rules': ['Reuse queue IDs; this report cannot create tasks or send/crawl/submit.',
                  'Do not reopen completed repairs from older crawl findings.',
                  'Only completed Ahrefs audits establish their named scope.',
                  'No GSC match means unavailable, not zero.',
                  'No query/window aggregation across tools; Ahrefs estimates are not GSC actual clicks.',
                  'Compare complete equal reporting windows after the release annotation; no hourly uplift claim.']}

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[3]/'pinnacle-growth-system')
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--outcome-aggregates', type=Path)
    p.add_argument('--windsor-evidence', type=Path)
    a = p.parse_args()
    result = build(a.root, a.outcome_aggregates, a.windsor_evidence)
    a.output.parent.mkdir(parents=True, exist_ok=True)
    a.output.write_text(json.dumps(result, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
    print(json.dumps({'output': str(a.output), 'queue_rows': len(result['rows']),
                      'sources_reused': len(result['sources']), 'downstream': result['receiving_team']['state']}))

if __name__ == '__main__':
    main()
