"""Exercise overlap, recovery, approval and spend boundaries without external calls."""
import datetime as dt
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace as Args
import unittest

import cycle


class CycleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.time = dt.datetime(2026, 10, 4, tzinfo=dt.timezone.utc)
        self.state = {'lease': None, 'items': [
            {'id': 'work', 'title': 'Work', 'priority': 10, 'status': 'ready'},
            {'id': 'send', 'title': 'Send', 'priority': 100, 'status': 'waiting_authorization'}],
            'ahrefs_unit_limits': {'per_action': 1000, 'per_day': 5000, 'per_month': 50000},
            'budget_reservations': [], 'results': []}

    def run_command(self, command, **values):
        return cycle.apply(self.state, Args(command=command, **values), self.root, self.time)

    def claim(self):
        return self.run_command('claim')['action_id']

    def receipt(self, action_id, **values):
        value = {'item_id': 'work', 'action_id': action_id, 'outcome': 'configured',
                 'summary': 'Local test only', 'verified': True, 'proof': ['test evidence']}
        value.update(values)
        path = self.root / 'receipt.json'
        path.write_text(json.dumps(value), encoding='utf-8')
        return str(path)

    def test_held_message_is_not_claimed(self):
        self.claim()
        self.assertEqual(self.state['lease']['item_id'], 'work')

    def test_owner_hold_prevents_new_or_expired_action_claim(self):
        self.state['execution_hold'] = {'active': True, 'reason': 'Await owner next task'}
        self.assertEqual(self.run_command('claim')['action'], 'skip')
        self.assertIsNone(self.state['lease'])

    def test_active_action_skips_duplicate_run(self):
        action = self.claim()
        result = self.run_command('claim')
        self.assertEqual(result['action'], 'skip')
        self.assertEqual(self.state['lease']['action_id'], action)

    def test_expired_action_reconciles_before_higher_priority_fresh_work(self):
        self.claim()
        self.state['items'].append({'id': 'fresh', 'priority': 999, 'status': 'ready'})
        self.time += dt.timedelta(minutes=91)
        result = self.run_command('claim')
        self.assertEqual((result['action'], result['item']['id']), ('reconcile', 'work'))

    def test_not_yet_due_work_is_skipped(self):
        self.state['items'][0]['next_eligible_at'] = (self.time + dt.timedelta(hours=1)).isoformat()
        self.assertEqual(self.run_command('claim')['action'], 'skip')

    def test_receipt_without_proof_cannot_complete(self):
        action = self.claim()
        with self.assertRaisesRegex(ValueError, 'specific proof'):
            self.run_command('complete', action_id=action, receipt=self.receipt(action, proof=[]))
        self.assertIsNotNone(self.state['lease'])

    def test_deployment_requires_public_and_git_receipts(self):
        action = self.claim()
        with self.assertRaisesRegex(ValueError, 'commit, deployment and public URL'):
            self.run_command('complete', action_id=action, receipt=self.receipt(action, outcome='deployed'))

    def test_action_day_and_month_spend_caps(self):
        action = self.claim()
        self.run_command('reserve', action_id=action, units=1000)
        with self.assertRaisesRegex(ValueError, 'per_action'):
            self.run_command('reserve', action_id=action, units=1)
        self.state['budget_reservations'] = [{'at': self.time.isoformat(), 'action_id': 'other', 'units': 5000}]
        with self.assertRaisesRegex(ValueError, 'per_day'):
            self.run_command('reserve', action_id=action, units=1)
        self.state['budget_reservations'] = [{'at': '2026-10-01T00:00:00+00:00', 'action_id': 'other', 'units': 50000}]
        with self.assertRaisesRegex(ValueError, 'per_month'):
            self.run_command('reserve', action_id=action, units=1)

    def test_complete_clears_lease_and_creates_explicit_result(self):
        action = self.claim()
        result = self.run_command('complete', action_id=action, receipt=self.receipt(action))
        self.assertEqual(result['outcome'], 'configured')
        self.assertIsNone(self.state['lease'])
        self.assertEqual(self.state['items'][0]['status'], 'verified_complete')
        self.assertEqual(len(self.state['results']), 1)

    def test_stale_action_cannot_mutate_current_work(self):
        old = self.claim()
        self.time += dt.timedelta(minutes=91)
        self.claim()
        with self.assertRaisesRegex(ValueError, 'matching active action'):
            self.run_command('reserve', action_id=old, units=10)

    def test_recurring_review_preserves_receipt_and_waits_until_due(self):
        self.state['items'][0]['repeat_after_hours'] = 24
        action = self.claim()
        self.run_command('complete', action_id=action, receipt=self.receipt(action))
        self.assertEqual(len(self.state['results']), 1)
        self.assertEqual(self.run_command('claim')['action'], 'skip')
        self.time += dt.timedelta(hours=24)
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')

    def test_deferred_access_gate_does_not_expire_into_permission(self):
        action = self.claim()
        self.run_command('defer', action_id=action, state='waiting_access', reason='No owner control', until=None)
        self.time += dt.timedelta(days=30)
        self.assertEqual(self.run_command('claim')['action'], 'skip')

    def test_process_lock_prevents_second_writer(self):
        with cycle.locked(self.root):
            with self.assertRaises(OSError):
                with cycle.locked(self.root):
                    self.fail('Second writer unexpectedly acquired the lock')

    def test_two_support_results_prefer_actual_delivery(self):
        self.state['results'] = [{'outcome': 'prepared'}, {'outcome': 'configured'}]
        self.state['items'][0]['execution_class'] = 'delivery'
        self.state['items'].append({'id': 'inventory', 'title': 'Inventory', 'priority': 999, 'status': 'ready', 'execution_class': 'research'})
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')

    def test_support_loop_stops_without_executable_work(self):
        self.state['results'] = [{'outcome': 'qualified'}, {'outcome': 'observed'}]
        self.state['items'][0]['execution_class'] = 'research'
        self.assertEqual(self.run_command('claim')['action'], 'skip')
        self.state['items'][0]['execution_class'] = 'feedback'
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')

    def test_delivery_cannot_complete_as_preparation(self):
        self.state['items'][0]['execution_class'] = 'delivery'
        action = self.claim()
        with self.assertRaisesRegex(ValueError, 'Delivery work'):
            self.run_command('complete', action_id=action, receipt=self.receipt(action, outcome='prepared'))
        self.assertIsNotNone(self.state['lease'])

    def test_queued_email_cannot_be_reported_as_sent(self):
        action = self.claim()
        with self.assertRaisesRegex(ValueError, 'Queued or prepared'):
            self.run_command('complete', action_id=action, receipt=self.receipt(action,
                outcome='submitted', external_id='message123', destination='recipient@example.org', external_status='queued'))
        self.run_command('complete', action_id=action, receipt=self.receipt(action,
            outcome='submitted', external_id='message123', destination='recipient@example.org', external_status='sent'))

    def test_task_contract_and_publication_proof(self):
        self.state['items'][0]['allowed_outcomes'] = ['published']
        action = self.claim()
        with self.assertRaisesRegex(ValueError, 'outcome contract'):
            self.run_command('complete', action_id=action, receipt=self.receipt(action))
        with self.assertRaisesRegex(ValueError, 'public URL'):
            self.run_command('complete', action_id=action, receipt=self.receipt(action, outcome='published'))

    def test_retry_cannot_immediately_reclaim_same_gate(self):
        action = self.claim()
        with self.assertRaisesRegex(ValueError, 'future --until'):
            self.run_command('defer', action_id=action, state='ready', reason='Same pending source', until=None)

    def test_due_feedback_cannot_be_starved_by_page_priority(self):
        self.state['items'][0].update(priority=991, execution_class='delivery')
        self.state['items'].append({'id': 'feedback', 'title': 'Feedback', 'priority': 35,
            'status': 'ready', 'execution_class': 'feedback', 'repeat_after_hours': 24})
        result = self.run_command('claim')
        self.assertEqual(result['item']['id'], 'feedback')
        action = result['action_id']
        self.run_command('complete', action_id=action,
            receipt=self.receipt(action, item_id='feedback', outcome='observed'))
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')

    def test_evidenced_urgent_failure_precedes_feedback(self):
        self.state['items'][0].update(execution_class='delivery', urgent_functional_failure=True,
                                     evidence='Specific public broken-journey receipt')
        self.state['items'].append({'id': 'feedback', 'priority': 999,
            'status': 'ready', 'execution_class': 'feedback'})
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')

    def test_feedback_respects_holds_and_due_date(self):
        self.state['items'].append({'id': 'feedback', 'priority': 999,
            'status': 'waiting_access', 'execution_class': 'feedback'})
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')
        self.state['lease'] = None
        self.state['items'][0]['status'] = 'ready'
        self.state['items'][-1].update(status='ready', next_eligible_at=(self.time+dt.timedelta(days=1)).isoformat())
        self.assertEqual(self.run_command('claim')['item']['id'], 'work')

    def test_recovery_precedes_due_feedback(self):
        self.claim()
        self.time += dt.timedelta(minutes=91)
        self.state['items'].append({'id': 'feedback', 'priority': 999,
            'status': 'ready', 'execution_class': 'feedback'})
        self.assertEqual(self.run_command('claim')['action'], 'reconcile')
        self.assertEqual(self.state['lease']['item_id'], 'work')

    def test_dashboard_does_not_present_preparation_as_delivery(self):
        self.state['results'] = [
            {'outcome': 'prepared', 'summary': 'Draft only', 'receipt': 'draft.json', 'at': '2026-10-04'},
            {'outcome': 'submitted', 'summary': 'Sent message', 'receipt': 'sent.json', 'at': '2026-10-05'}]
        cycle.dashboard(self.root, self.state)
        board = (self.root / 'STATUS.md').read_text(encoding='utf-8')
        delivered, support = board.split('## Setup and analysis')
        self.assertNotIn('Draft only', delivered)
        self.assertIn('Sent message', delivered)
        self.assertIn('Draft only', support)


if __name__ == '__main__':
    unittest.main(verbosity=2)
