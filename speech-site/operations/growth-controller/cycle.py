"""Local queue, single-action lease and receipts. Never sends or deploys by itself."""
import argparse
import contextlib
import datetime as dt
import json
import os
from pathlib import Path
import uuid

ROOT = Path(__file__).resolve().parent
DELIVERY_OUTCOMES = {'deployed', 'profile_corrected', 'submitted', 'published'}
SUPPORT_OUTCOMES = {'configured', 'prepared', 'qualified', 'observed'}

def preparation_streak(state):
    """A setup, observation or draft must never reset the no-delivery counter."""
    count = 0
    for event in reversed(state.get('results', [])):
        if event['outcome'] in DELIVERY_OUTCOMES:
            break
        count += 1
    return count

def now():
    return dt.datetime.now(dt.timezone.utc)

def timestamp(value):
    return dt.datetime.fromisoformat(value.replace('Z', '+00:00'))

@contextlib.contextmanager
def locked(root):
    root.mkdir(parents=True, exist_ok=True)
    with (root / '.state.lock').open('a+b') as handle:
        if handle.tell() == 0:
            handle.write(b'0')
            handle.flush()
        handle.seek(0)
        if os.name == 'nt':
            import msvcrt
            msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        try:
            yield
        finally:
            handle.seek(0)
            if os.name == 'nt':
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)

def write_json(path, data):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    os.replace(temporary, path)

def dashboard(root, state):
    text = ['# Pinnacle growth — current delivery board', '',
            'Calls: **9100 181 181**. Search effects, published references and qualified calls are separate from completed work.', '',
            f"Updated: {state.get('updated_at', 'not yet run')}", '',
            '| Priority | Work | State | Next condition |', '|---:|---|---|---|']
    for item in sorted(state['items'], key=lambda x: -x['priority']):
        values = [str(item['priority']), item['title'], item['status'], item.get('next_condition', '')]
        text.append('| ' + ' | '.join(v.replace('|', '/') for v in values) + ' |')
    events = state.get('results', [])
    counts = {outcome: sum(e['outcome'] == outcome for e in events) for outcome in sorted(DELIVERY_OUTCOMES)}
    text += ['', '## Verified delivery ledger', '',
             'These are recorded outputs, not proven ranking, referral or enquiry gains.', '',
             ' | '.join(f'{name}: **{count}**' for name, count in counts.items()), '']
    for event in [e for e in events if e['outcome'] in DELIVERY_OUTCOMES][-12:][::-1]:
        text.append(f"- **{event['outcome']}** — {event['summary']} ([receipt]({event['receipt']})); {event['at']}")
    text += ['', '## Setup and analysis — excluded from delivery totals', '']
    for event in [e for e in events if e['outcome'] not in DELIVERY_OUTCOMES][-4:][::-1]:
        text.append(f"- **{event['outcome']}** — {event['summary']} ([receipt]({event['receipt']})); {event['at']}")
    text += ['', '## Business outcomes', '',
             'Use dated, sourced observations; missing data means unmeasured, never zero or success.', '']
    observations = state.get('business_observations', [])
    for observation in observations:
        text.append(f"- **{observation['metric']}** — {observation['value']}; {observation['period']}. {observation['qualification']} ([source]({observation['source']})).")
    if not observations:
        text.append('No business-outcome observations recorded.')
    if not state.get('results'):
        text.append('No completion recorded yet.')
    text += ['', 'No schedule wake, fresh inventory, draft or HTTP 200 alone establishes a new backlink, ranking gain or lead.', '']
    (root / 'STATUS.md').write_text('\n'.join(text), encoding='utf-8')

def apply(state, args, root, current=None):
    current = current or now()
    lease = state.get('lease')
    if args.command == 'status':
        return {'lease': lease, 'items': state['items'], 'results': state.get('results', [])[-5:]}
    if args.command == 'claim':
        if state.get('execution_hold', {}).get('active'):
            return {'action': 'skip', 'reason': state['execution_hold'].get('reason', 'Owner hold; await explicit resume.')}
        if lease and timestamp(lease['expires_at']) > current:
            return {'action': 'skip', 'reason': 'An unfinished action already holds the lease.', 'lease': lease}
        if lease:
            item = next(x for x in state['items'] if x['id'] == lease['item_id'])
            item['status'] = 'needs_reconciliation'
            item['next_condition'] = 'Inspect previous public/API/Git receipt before retrying; expired lease is not evidence of failure.'
            state['lease'] = None
        eligible = [x for x in state['items'] if x['status'] in ('ready', 'needs_reconciliation')
                    and (not x.get('next_eligible_at') or timestamp(x['next_eligible_at']) <= current)]
        if not eligible:
            return {'action': 'skip', 'reason': 'No eligible action; do not refresh unchanged sources or rewrite checkpoints.'}
        # Recovery and evidenced outages take precedence. A due feedback checkpoint
        # then runs once before normal page work; its recurring due date prevents
        # repeated checks. Numeric page priorities cannot starve this checkpoint.
        recovery = [x for x in eligible if x['status'] == 'needs_reconciliation']
        incidents = [x for x in eligible if x.get('urgent_functional_failure') is True
                     and x.get('execution_class') == 'delivery' and x.get('evidence')]
        feedback = [x for x in eligible if x.get('execution_class') == 'feedback']
        if recovery:
            eligible = recovery
        elif incidents:
            eligible = incidents
        elif feedback:
            eligible = feedback
        # After two support results, stop discretionary inventory work.
        elif preparation_streak(state) >= 2:
            delivery = [x for x in eligible if x.get('execution_class') == 'delivery']
            if delivery:
                eligible = delivery
            else:
                eligible = [x for x in eligible if x.get('execution_class') == 'feedback']
                if not eligible:
                    return {'action': 'skip', 'reason': 'Two support-only results: no evidenced delivery or due feedback item. Do not start another inventory.'}
        item = max(eligible, key=lambda x: (x['status'] == 'needs_reconciliation', x['priority']))
        mode = 'reconcile' if item['status'] == 'needs_reconciliation' else 'execute'
        action_id = str(uuid.uuid4())
        state['lease'] = {'action_id': action_id, 'item_id': item['id'], 'started_at': current.isoformat(),
                          'expires_at': (current + dt.timedelta(minutes=90)).isoformat()}
        item['status'] = 'executing'
        return {'action': mode, 'action_id': action_id, 'item': item, 'lease': state['lease']}
    if not lease or lease['action_id'] != args.action_id:
        raise ValueError('A matching active action ID is required.')
    item = next(x for x in state['items'] if x['id'] == lease['item_id'])
    if args.command == 'reserve':
        units = args.units
        if units <= 0:
            raise ValueError('Reservation must be positive.')
        entries = state.setdefault('budget_reservations', [])
        limits = state['ahrefs_unit_limits']
        filters = {'per_action': lambda x: x['action_id'] == args.action_id,
                   'per_day': lambda x: x['at'][:10] == current.isoformat()[:10],
                   'per_month': lambda x: x['at'][:7] == current.isoformat()[:7]}
        for name, matches in filters.items():
            if sum(x['units'] for x in entries if matches(x)) + units > limits[name]:
                raise ValueError(f'Ahrefs {name} budget reached; reuse saved data or choose an independent task.')
        entries.append({'at': current.isoformat(), 'action_id': args.action_id, 'units': units})
        return {'reserved': units, 'note': 'Conservative reservation; native-linked usage must be counted or discovery held.'}
    if args.command == 'renew':
        lease['expires_at'] = (current + dt.timedelta(minutes=90)).isoformat()
        return {'lease': lease}
    if args.command == 'defer':
        if args.state == 'ready' and (not args.until or timestamp(args.until) <= current):
            raise ValueError('A retryable ready item requires a future --until; use a held state for a real external gate.')
        item.update(status=args.state, next_condition=args.reason, next_eligible_at=args.until)
        state['lease'] = None
        return {'deferred': item['id'], 'state': args.state, 'next_condition': args.reason}
    if args.command == 'complete':
        path = Path(args.receipt).resolve()
        record = json.loads(path.read_text(encoding='utf-8-sig'))
        if record.get('item_id') != item['id'] or record.get('action_id') != args.action_id:
            raise ValueError('Receipt must identify this item and action.')
        outcomes = {'deployed', 'profile_corrected', 'prepared', 'qualified', 'submitted', 'published', 'observed', 'configured'}
        if record.get('verified') is not True or not record.get('proof') or record.get('outcome') not in outcomes or not record.get('summary'):
            raise ValueError('Receipt needs verified=true, a specific proof, summary and a recognised outcome.')
        allowed = item.get('allowed_outcomes')
        if allowed and record['outcome'] not in allowed:
            raise ValueError('Receipt does not meet this task outcome contract; continue the action or defer the exact gate.')
        if item.get('execution_class') == 'delivery' and record['outcome'] not in DELIVERY_OUTCOMES:
            raise ValueError('Delivery work cannot be completed with setup, analysis or a draft.')
        if record['outcome'] == 'deployed' and not all(record.get(k) for k in ('commit', 'deployment', 'public_url')):
            raise ValueError('Deployment completion requires commit, deployment and public URL evidence.')
        if record['outcome'] == 'submitted' and not all(record.get(k) for k in ('external_id', 'destination')):
            raise ValueError('Submitted work requires the actual external receipt ID and destination.')
        if record['outcome'] == 'submitted' and record.get('external_status') not in ('sent', 'accepted', 'submitted'):
            raise ValueError('Queued or prepared work is not a submitted result.')
        if record['outcome'] in ('published', 'profile_corrected') and not record.get('public_url'):
            raise ValueError('A publication or profile correction requires its verified public URL.')
        item.update(status='verified_complete', next_condition='Complete; reopen only for a material change.')
        if item.get('repeat_after_hours'):
            item.update(status='ready', next_eligible_at=(current + dt.timedelta(hours=item['repeat_after_hours'])).isoformat(),
                        next_condition='Wait until due; consume only changed source evidence and deduplicate work.')
        state.setdefault('results', []).append({'at': current.isoformat(), 'item_id': item['id'], 'action_id': args.action_id,
            'outcome': record['outcome'], 'summary': record['summary'], 'receipt': path.as_posix()})
        state['lease'] = None
        return {'completed': item['id'], 'outcome': record['outcome'], 'summary': record['summary']}
    raise ValueError('Unknown operation')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=ROOT)
    sub = parser.add_subparsers(dest='command', required=True)
    for command in ('status', 'claim'):
        sub.add_parser(command)
    for command in ('reserve', 'renew', 'defer', 'complete'):
        p = sub.add_parser(command)
        p.add_argument('--action-id', required=True)
        if command == 'reserve':
            p.add_argument('--units', type=int, required=True)
        elif command == 'defer':
            p.add_argument('--state', choices=['waiting_source', 'waiting_external', 'waiting_access', 'waiting_authorization', 'ready'], required=True)
            p.add_argument('--reason', required=True)
            p.add_argument('--until')
        elif command == 'complete':
            p.add_argument('--receipt', required=True)
    args = parser.parse_args()
    with locked(args.root):
        path = args.root / 'queue.json'
        state = json.loads(path.read_text(encoding='utf-8-sig'))
        result = apply(state, args, args.root)
        if args.command != 'status' and result.get('action') != 'skip':
            state['updated_at'] = now().isoformat()
            write_json(path, state)
            dashboard(args.root, state)
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
