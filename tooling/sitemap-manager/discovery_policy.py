"""Shared discovery exclusions; never a change to centre operation or Ads holds."""
import json, urllib.parse
from pathlib import Path

POLICY = json.loads(Path(__file__).with_name('discovery-policy.json').read_text(encoding='utf8'))

def exclusion_reason(url):
    parsed = urllib.parse.urlsplit(url)
    if parsed.hostname != 'www.pinnacleblooms.org':
        return None
    if parsed.path in POLICY['redirect_alias_paths']:
        return 'published_permanent_redirect'
    if parsed.path.startswith('/centers/') and parsed.path not in POLICY['indexable_centre_paths']:
        return 'centre_indexability_hold'
    return None

def apply_discovery_policy(db, manager):
    changes = []
    for record in db.execute("SELECT * FROM pages WHERE decision='INCLUDE'").fetchall():
        row = dict(record)
        reason = exclusion_reason(row['url'])
        if not reason:
            continue
        meta = json.loads(row['metadata_json'])
        decision = 'EXCLUDE' if reason == 'published_permanent_redirect' else 'HOLD'
        meta['eligibility'] = dict(decision=decision, reason=reason,
            source='Git-maintained discovery-policy.json', evidence_date=POLICY['evidence_date'])
        row.update(decision=decision, llm_approved=0, metadata_json=manager.dump(meta))
        manager.upsert(db, manager.refresh_digest(row))
        changes.append(dict(url=row['url'], kind=reason, decision=decision))
    return changes
