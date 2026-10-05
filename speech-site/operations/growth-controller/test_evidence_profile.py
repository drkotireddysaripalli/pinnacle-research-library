import csv
from pathlib import Path
import tempfile
import unittest
from evidence_profile import EVENTS, OUTCOMES, aggregates, url_key

class ProfileTests(unittest.TestCase):
    def test_navigation_cannot_be_labelled_as_accepted_request(self):
        for name in ('enroll','contact_us','enquiry_link_click'):
            self.assertEqual(EVENTS[name], 'navigation')
        self.assertEqual(EVENTS['enquiry_accepted'], 'api_accepted_request')
        self.assertEqual(EVENTS['phone_link_click'], 'contact_intent')

    def test_missing_outcomes_are_not_zero(self):
        self.assertIsNone(aggregates(None)['counts'])

    def test_canonical_matching_keeps_distinct_hosts_and_routes(self):
        self.assertEqual(url_key('https://www.pinnacleblooms.org/enroll?service=ot#form'),
                         'https://www.pinnacleblooms.org/enroll')
        self.assertNotEqual(url_key('https://pinnacleblooms.org/ask'),
                            url_key('https://www.pinnacleblooms.org/ask'))

    def test_personal_data_columns_are_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'input.csv';p.write_text('email,phone\nparent@example.org,0000000000\n')
            with self.assertRaisesRegex(ValueError,'exact documented columns'):
                aggregates(p)

    def test_valid_aggregate_keeps_null_and_rejects_duplicate(self):
        row=dict(period_start='2026-09-01',period_end='2026-09-30',timezone='Asia/Kolkata',
            complete_through='2026-09-30',centre_id='unknown',intake_channel='unknown',
            attribution_basis='unknown',counting_unit='record',duplicate_handling='source deduplicated',
            test_exclusions='source excludes tests',source_report_reference='synthetic-unit-fixture',
            extracted_at='2026-10-01',answered_calls='2',qualified_enquiries='1',walk_ins='null',completed_enrolments='0')
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'aggregate.csv'
            with p.open('w',newline='') as h:
                w=csv.DictWriter(h,fieldnames=list(row));w.writeheader();w.writerow(row)
            result=aggregates(p)
            self.assertIsNone(result['rows'][0]['walk_ins'])
            self.assertEqual(result['rows'][0]['completed_enrolments'],0)
            with p.open('a',newline='') as h: csv.DictWriter(h,fieldnames=list(row)).writerow(row)
            with self.assertRaisesRegex(ValueError,'Duplicate'): aggregates(p)

if __name__=='__main__': unittest.main()
