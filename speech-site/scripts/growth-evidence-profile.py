"""Join saved evidence to the existing queue. Offline, no crawl, spend or mutation."""
import argparse
import csv
import datetime as dt
import hashlib
import json
from pathlib import Path
from urllib.parse import unquote_plus, urlsplit, urlunsplit

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
TRACKING_PARAMS = {'gclid', 'dclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'}

def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

def url_key(url):
    """Match tracking variants only; retain hosts/paths unless an explicit canonical says otherwise."""
    p = urlsplit(url)
    parts = []
    for part in p.query.split('&'):
        name = unquote_plus(part.partition('=')[0]).lower()
        if not name.startswith('utm_') and name not in TRACKING_PARAMS:
            parts.append(part)
    return urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path or '/', '&'.join(parts), ''))

def payloads(result):
    for block in result.get('content', []):
        try:
            value = json.loads(block.get('text', ''))
            if isinstance(value, dict):
                yield value
        except (ValueError, TypeError):
            continue

def audit_rows(value):
    """Read saved native-tool, raw API or combined receipts without another API call."""
    if isinstance(value, list):
        for part in value:
            yield from audit_rows(part)
    elif isinstance(value, dict):
        for row in value.get('healthscores', []):
            if isinstance(row, dict) and row.get('project_id'):
                yield dict(row)
        for key, part in value.items():
            if key == 'healthscores':
                continue
            if key == 'text' and isinstance(part, str):
                try:
                    yield from audit_rows(json.loads(part))
                except ValueError:
                    pass
            elif isinstance(part, (dict, list)):
                yield from audit_rows(part)

def ahrefs_keyword_payloads(value):
    """Read the selected saved demand sample, not tracked-keyword or unrelated API data."""
    if not isinstance(value, dict) or value.get('isError') is True:
        return
    if isinstance(value.get('keywords'), list):
        yield value
    elif isinstance(value.get('observations'), dict):
        yield from ahrefs_keyword_payloads(value['observations'].get('keywords', {}).get('value'))
    elif isinstance(value.get('structuredContent'), dict):
        yield from ahrefs_keyword_payloads(value['structuredContent'])
    elif value.get('content'):
        for document in payloads(value):
            yield from ahrefs_keyword_payloads(document)
    else:
        for key in ('response', 'data', 'value'):
            if isinstance(value.get(key), dict):
                yield from ahrefs_keyword_payloads(value[key])
                break

def utc_date(value):
    try:
        parsed = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        return parsed.astimezone(dt.timezone.utc) if parsed.tzinfo else None
    except (ValueError, TypeError, AttributeError):
        return None

def gsc_query_page_payloads(value):
    """Unwrap explicit saved query/page inputs without traversing unrelated observations."""
    if not isinstance(value, dict) or value.get('isError') is True:
        return
    if isinstance(value.get('rows'), list):
        yield value
    elif isinstance(value.get('observations'), dict):
        yield from gsc_query_page_payloads(value['observations'].get('gsc_parent_queries', {}).get('value'))
    elif isinstance(value.get('structuredContent'), dict):
        yield from gsc_query_page_payloads(value['structuredContent'])
    elif value.get('content'):
        for document in payloads(value):
            yield from gsc_query_page_payloads(document)
    else:
        for key in ('response', 'data', 'value'):
            if isinstance(value.get(key), dict):
                yield from gsc_query_page_payloads(value[key])
                break

def gsc_query_page_observations(snapshots):
    """Preserve sampled query rows and maturity; never derive site or page totals."""
    records, inputs = [], []
    for file, document in snapshots:
        for response in gsc_query_page_payloads(document):
            dimensions = response.get('dimensions', ['query', 'page'])
            if not isinstance(dimensions, list) or not {'query', 'page'} <= set(dimensions):
                continue
            maturity = response.get('dataMaturity') or {}
            start, end = response.get('startDate', response.get('start')), response.get('endDate', response.get('end'))
            settled = response.get('settledThrough', maturity.get('settledThrough'))
            incomplete = maturity.get('firstIncompleteDate')
            def date(value):
                try:
                    return dt.date.fromisoformat(value)
                except (ValueError, TypeError):
                    return None
            first, last, through, pending = map(date, (start, end, settled, incomplete))
            if first is None or last is None:
                window = 'window_dates_unavailable'
            elif first > last:
                window = 'invalid_window'
            elif (through is not None and last > through) or (pending is not None and last >= pending):
                window = 'partial_window'
            elif through is not None:
                window = 'settled_window'
            else:
                window = 'maturity_unavailable'
            pagination = {key: response.get('pagination', {}).get(key)
                          for key in ('limit', 'offset', 'returned', 'hasMore', 'nextOffset')}
            if pagination['returned'] is None:
                pagination['returned'] = len(response['rows'])
            context = {'source': str(file), 'siteUrl': response.get('siteUrl'),
                       'start': start, 'end': end, 'settledThrough': settled,
                       'firstIncompleteDate': incomplete, 'dateBasis': maturity.get('dateBasis'),
                       'pagination': pagination, 'window_boundary': window,
                       'row_boundary': 'partial_rows' if pagination['hasMore'] is True else 'sampled_query_rows',
                       'boundary': 'Query/page samples are not site or page totals; keep the regional baseline separate.'}
            samples = []
            for row in response['rows']:
                if not isinstance(row, dict):
                    continue
                keys = row.get('keys', [])
                fields = dict(zip(dimensions, keys)) if isinstance(keys, list) else {}
                query, page = row.get('query', fields.get('query')), row.get('page', fields.get('page'))
                if not isinstance(query, str) or not isinstance(page, str) or not page.startswith(('https://', 'http://')):
                    continue
                samples.append({**context, 'url': url_key(page), 'observed_page': page, 'query': query,
                                **{key: row.get(key) for key in ('clicks', 'impressions', 'ctr', 'position')}})
            inputs.append({**context, 'sample_count': len(samples)})
            records.extend(samples)
    return {'state': 'saved_query_page_samples' if inputs else 'unavailable',
            'snapshots': inputs, 'records': records,
            'boundary': 'No query-row sums, total substitution or growth claim; partial windows remain partial.'}

def testingbot_release_observation(record, release):
    """Time establishes coverage only; a production revision match still requires proof."""
    observed_at = utc_date(record.get('at'))
    release_at = utc_date(release.get('at')) if release else None
    coverage = ('candidate' if record.get('candidate_build') else
                'release_time_unavailable' if release_at is None or observed_at is None else
                'predates_release' if observed_at < release_at else
                'after_release_requires_revision_match')
    return {**record, 'release_coverage': coverage,
            'relevant_release': {key: release.get(key) for key in ('at', 'commit', 'deployment')} if release else None}

def latest_completed_audits(snapshots, releases=None):
    """A newer stopped/running crawl never displaces a completed baseline."""
    projects = {}
    for path, document in snapshots:
        for row in audit_rows(document):
            stamp = utc_date(row.get('date'))
            if stamp is None:
                continue
            row['evidence_file'] = str(path)
            projects.setdefault(str(row['project_id']), []).append((stamp, row))
    result = []
    for project_id, observed in sorted(projects.items()):
        observed.sort(key=lambda item: item[0], reverse=True)
        completed = [item for item in observed if item[1].get('status') == 'Completed']
        if not completed:
            row = dict(observed[0][1])
            row['usable_completed_baseline'] = False
            row['release_coverage'] = 'no_completed_baseline'
        else:
            stamp, selected = completed[0]
            row = dict(selected)
            row['usable_completed_baseline'] = True
            release = (releases or {}).get(project_id)
            release_at = utc_date(release.get('at')) if release else None
            row['relevant_release'] = release
            row['release_coverage'] = ('predates_release' if stamp < release_at else
                'completed_after_release_requires_url_checks') if release_at else 'release_time_unavailable'
        row['latest_observed_attempt'] = {key: observed[0][1].get(key) for key in ('date','status','total','evidence_file')}
        result.append(row)
    return result

def latest_frog_rows(receipts):
    """Only successful completed exports; folder names never determine freshness."""
    selected = {}
    for receipt, metadata, rows in receipts:
        stamp = utc_date(metadata.get('completedAt'))
        if metadata.get('exitCode') != 0 or stamp is None:
            continue
        for raw in rows:
            if not raw.get('Address'):
                continue
            key = url_key(raw['Address'])
            record = {k:raw.get(k) for k in
                ('Address','Status Code','Indexability','Canonical Link Element 1','Title 1','H1-1')}
            record.update(completed_at=stamp.isoformat(), receipt=str(receipt))
            if key not in selected or stamp > selected[key][0]:
                selected[key] = (stamp, record)
    return {key:value[1] for key,value in selected.items()}

def testingbot_observations(reports):
    """Keep the latest completed case per exact URL, browser and suite.

    P1 cannot clear a P2 defect, another browser cannot clear Safari, and a
    candidate-build pass cannot replace deployed production evidence.
    """
    latest, attempts, inputs = {}, {}, []
    for file, report in reports:
        if utc_date(report.get('finishedAt')) is None or not report.get('sessions'):
            continue
        inputs.append(str(file))
        for session in report['sessions']:
            for case in session.get('cases', []):
                stamp = utc_date(case.get('finishedAt'))
                canonical = case.get('canonical')
                if stamp is None or not canonical or case.get('status') not in ('passed','failed'):
                    continue
                scope = 'p1' if report.get('suite')=='daily' else report.get('suite')
                key = (url_key(canonical), session.get('matrix'), scope, bool(report.get('build')))
                checks = case.get('checks', [])
                confirmed = session.get('closed') is True and session.get('resultRecorded') is True
                passed = (confirmed and case['status']=='passed' and bool(checks)
                          and all(c.get('passed') is True for c in checks))
                visual = case.get('visual', {})
                record = dict(url=key[0], case_id=case['id'], matrix=key[1], suite=key[2],
                    candidate_build=key[3], at=stamp.isoformat(), source=report.get('source'),
                    runner_sha256=report.get('runnerSha256'), manifest_sha256=report.get('manifestSha256'),
                    functional='pass' if passed else 'fail' if confirmed else 'unconfirmed',
                    failed_checks=[c.get('name') for c in checks if c.get('passed') is not True],
                    error=case.get('error'), warnings=case.get('warnings', []), skipped=case.get('skipped', []),
                    visual_status=visual.get('approval', 'not-established'),
                    visual_match=visual.get('match'), visual_id=visual.get('visualId'),
                    browser=session.get('provider', {}).get('browser'),
                    os=session.get('provider', {}).get('os'),
                    device=session.get('provider', {}).get('deviceName'),
                    viewport={k:case.get('document', {}).get(k) for k in ('width','height','dpr')},
                    session_closed=session.get('closed'), result_recorded=session.get('resultRecorded'),
                    provider_success=session.get('provider', {}).get('success'),
                    report=str(file))
                if key not in attempts or stamp > attempts[key][0]:
                    attempts[key] = (stamp, record)
                existing = latest.get(key)
                # An interrupted/unclosed retry cannot clear a prior confirmed
                # failure. Preserve the latest attempt separately for freshness.
                if (existing is None or
                    (record['functional']!='unconfirmed' and existing[1]['functional']=='unconfirmed') or
                    ((record['functional']=='unconfirmed')==(existing[1]['functional']=='unconfirmed') and stamp>existing[0])):
                    latest[key] = (stamp, record)
    for key,(stamp,record) in latest.items():
        if attempts[key][0] > stamp:
            attempt = attempts[key][1]
            record['latest_attempt'] = {k:attempt[k] for k in ('at','functional','report','source','session_closed','result_recorded')}
    return {'state':'saved_completed_observations' if inputs else 'unavailable',
            'reports_consumed':sorted(set(inputs)), 'records':[v[1] for _,v in sorted(latest.items())],
            'boundary':'Assertions and visuals remain separate. Saved observations have their own date/source; no ranking, lead or full-site pass is inferred.'}

def pitchbox_observations(snapshots):
    """Allowlisted aggregate fields only; no messages, recipient or mailbox data."""
    valid = [(utc_date(doc.get('checked_at_utc')), file, doc) for file,doc in snapshots]
    valid = [row for row in valid if row[0] is not None]
    if not valid:
        return {'state':'unavailable'}
    _, file, doc = max(valid, key=lambda row:row[0])
    keys = ('checked_at_utc','active_campaigns','opportunities','excluded_no_fit','sent',
            'inbound_records','wins_reported','eligible_messages_now','new_placements_verified',
            'attributable_qualified_enquiries')
    return {'state':'saved_aggregate_observation','source':str(file),
            **{k:doc.get(k) for k in keys},
            'public_destinations':[doc['existing_reference_repair']['destination']]
                if doc.get('existing_reference_repair', {}).get('destination') else [],
            'boundary':'Outreach and placement are separate. Browser health cannot authorise sending or prove a placement/lead.'}

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
    audit_paths = [ahrefs_path]
    latest_ask = root/'ecosystem-closeout-20261005/ahrefs-ask-metadata.json'
    if latest_ask.exists():
        audit_paths.append(latest_ask)
    manifest_path = root/'evidence-sources.json'
    defaults_path = Path(__file__).resolve().parents[1]/'tests/testingbot/evidence-inputs.json'
    defaults = read(defaults_path) if defaults_path.exists() else {}
    manifest = {**defaults, **(read(manifest_path) if manifest_path.exists() else {})}
    source(defaults_path, 'Versioned offline TestingBot and aggregate Pitchbox input paths')
    source(manifest_path, 'Explicit saved evidence inputs and release boundaries')
    gsc_snapshots = []
    for file in dict.fromkeys((root/Path(path)).resolve() for path in manifest.get('gsc_query_page_snapshots', [])):
        if file.exists():
            source(file, 'GSC saved query/page samples; pagination and maturity remain explicit')
            gsc_snapshots.append((file.as_posix(), read(file)))
    gsc_samples = gsc_query_page_observations(gsc_snapshots)
    audit_paths.extend(root/Path(path) for path in manifest.get('ahrefs_snapshots', []))
    snapshots = []
    for path in dict.fromkeys(path.resolve() for path in audit_paths):
        source(path, 'Ahrefs dated audit snapshot')
        snapshots.append((path.as_posix(), read(path)))
    audits = latest_completed_audits(snapshots, manifest.get('relevant_releases'))
    keyword_path = work/'ahrefs-growth-20261004/india-organic-keywords-20261004.json'
    keyword_paths = [root/Path(path) for path in manifest.get('ahrefs_keyword_snapshots', [])] or [keyword_path]
    demand = {}
    query_sources = []
    for path in dict.fromkeys(path.resolve() for path in keyword_paths):
        if not path.exists():
            continue
        source(path, 'Ahrefs explicitly selected saved India query demand; bounded sample')
        for obj in ahrefs_keyword_payloads(read(path)):
            for row in obj.get('keywords', []):
                if row.get('best_position_url'):
                    demand.setdefault(url_key(row['best_position_url']), []).append(row)
                    if path.as_posix() not in query_sources:
                        query_sources.append(path.as_posix())
    frog_inputs = []
    frog_paths = list(root.glob('*/screaming-frog/*/receipt.json')) + list(root.glob('*/crawl/*/receipt.json'))
    frog_paths.extend(root/Path(p) for p in manifest.get('screaming_frog_receipts', []))
    for receipt in dict.fromkeys(p.resolve() for p in frog_paths):
        source(receipt, 'Screaming Frog bounded run')
        metadata = read(receipt)
        for csv_path in receipt.parent.glob('internal_all.csv'):
            source(csv_path, 'Screaming Frog URL rows')
            with csv_path.open(encoding='utf-8-sig', newline='') as handle:
                frog_inputs.append((receipt.as_posix(), metadata, list(csv.DictReader(handle))))
    frog = latest_frog_rows(frog_inputs)
    # Saved initial crawl remains evidence where no newer focused row is available.
    original = work/'ahrefs-growth-20261004/screaming-frog-setup/audits'
    for csv_path in sorted(original.glob('*/internal_all.csv')):
        receipt = csv_path.parent/'receipt.json'
        if not receipt.exists():
            continue
        metadata = read(receipt)
        if metadata.get('exitCode') != 0 or utc_date(metadata.get('completedAt')) is None:
            continue
        source(csv_path, 'Screaming Frog earlier sample')
        with csv_path.open(encoding='utf-8-sig', newline='') as handle:
            for row in csv.DictReader(handle):
                if row.get('Address'):
                    frog_inputs.append((receipt.as_posix(), metadata, [row]))
    frog = latest_frog_rows(frog_inputs)
    tb_paths = [root/Path(p) for p in manifest.get('testingbot_reports', [])]
    for pattern in manifest.get('testingbot_report_globs', []):
        # Explicit local report roots only. This never fetches a provider or scans credentials.
        tb_paths.extend(root.glob(pattern))
    tb_inputs = []
    for file in dict.fromkeys(p.resolve() for p in tb_paths):
        if file.exists():
            source(file, 'TestingBot saved execution; browser/visual scope remains explicit')
            tb_inputs.append((file.as_posix(), read(file)))
    testingbot = testingbot_observations(tb_inputs)
    pb_inputs = []
    for file in [root/Path(p) for p in manifest.get('pitchbox_snapshots', [])]:
        if file.exists():
            source(file, 'Pitchbox saved aggregate observation; no outreach mutation')
            pb_inputs.append((file.as_posix(), read(file)))
    pitchbox = pitchbox_observations(pb_inputs)
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
            'gsc_query_page_samples': [r for r in gsc_samples['records'] if r['url'] in urls],
            'screaming_frog': {u:frog[u] for u in sorted(urls) if u in frog}, 'release': release,
            'ahrefs_india_queries': {u:demand[u] for u in sorted(urls) if u in demand},
            'testingbot': [testingbot_release_observation(r, release) for r in testingbot['records'] if r['url'] in urls],
            'receipt': event['receipt'] if event else None,
            'next_condition': item.get('next_condition'),
            'measurement': item.get('measurement', 'No outcome attributed from delivery alone')})
    windsor = {'state': 'not_supplied'}
    if windsor_dir is None and manifest.get('windsor_evidence'):
        saved_windsor = root/manifest['windsor_evidence']
        if (saved_windsor/'windsor-ga4.json').exists() and (saved_windsor/'windsor-gbp.json').exists():
            windsor_dir = saved_windsor
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
        'ahrefs_audits': audits, 'ahrefs_query_source': query_sources[0] if query_sources else None,
        'ahrefs_query_sources': query_sources,
        'event_dictionary': EVENTS, 'receiving_team': aggregates(outcome_path), 'windsor':windsor,
        'testingbot':testingbot, 'pitchbox':pitchbox, 'gsc_query_page':gsc_samples,
        'url_observations':{u:{'gsc':gsc.get(u), 'ahrefs_india_queries':demand.get(u),
                              'screaming_frog':frog.get(u)} for u in sorted(set(gsc)|set(frog)|set(demand))},
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
