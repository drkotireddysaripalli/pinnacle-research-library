import csv
import json
from pathlib import Path
import tempfile
import unittest
import importlib.util
spec = importlib.util.spec_from_file_location("growth_evidence_profile", Path(__file__).with_name("growth-evidence-profile.py"))
profile = importlib.util.module_from_spec(spec)
spec.loader.exec_module(profile)
EVENTS, OUTCOMES, aggregates, url_key, latest_completed_audits = (profile.EVENTS, profile.OUTCOMES, profile.aggregates, profile.url_key, profile.latest_completed_audits)

class ProfileTests(unittest.TestCase):
    def test_frog_freshness_uses_successful_completion_not_folder_order(self):
        page={'Address':'https://www.pinnacleblooms.org/seva','Status Code':'200'}
        runs=[('z-older',{'completedAt':'2026-10-01T00:00:00Z','exitCode':0},[{**page,'Status Code':'404'}]),
              ('a-newer',{'completedAt':'2026-10-06T00:00:00Z','exitCode':0},[page]),
              ('new-failed',{'completedAt':'2026-10-07T00:00:00Z','exitCode':1},[{**page,'Status Code':'500'}])]
        r=profile.latest_frog_rows(runs)[page['Address']]
        self.assertEqual(r['Status Code'],'200');self.assertEqual(r['receipt'],'a-newer')

    def test_testingbot_preserves_browser_suite_and_candidate_boundaries(self):
        def report(suite='p2',matrix='safari',passed=False,build=False,at='2026-10-06T00:00:00Z',closed=True):
            return dict(finishedAt=at,suite=suite,build=build,source='fixture',sessions=[dict(matrix=matrix,
                closed=closed,resultRecorded=True,provider={'success':passed},cases=[dict(id='shop',
                canonical='https://www.pinnacleblooms.org/shop',finishedAt=at,status='passed' if passed else 'failed',
                checks=[{'name':'readability','passed':passed}],visual={'approval':'provisional-first-capture'})])])
        r=profile.testingbot_observations([('failed',report()),('p1-pass',report(suite='p1',passed=True,at='2026-10-07T00:00:00Z')),
            ('chrome-pass',report(matrix='chrome',passed=True)),('build-pass',report(passed=True,build=True))])
        failed=[v for v in r['records'] if v['functional']=='fail']
        self.assertEqual(len(failed),1);self.assertEqual(failed[0]['matrix'],'safari');self.assertEqual(failed[0]['suite'],'p2')
        self.assertEqual(profile.testingbot_observations([('unclosed',report(passed=True,closed=False))])['records'][0]['functional'],'unconfirmed')
        retry=profile.testingbot_observations([('failed',report()),('unclosed-new',report(passed=True,closed=False,at='2026-10-07T00:00:00Z'))])['records'][0]
        self.assertEqual(retry['functional'],'fail');self.assertEqual(retry['latest_attempt']['functional'],'unconfirmed')
        running=report();del running['finishedAt'];self.assertEqual(profile.testingbot_observations([('running',running)])['state'],'unavailable')

    def test_pitchbox_is_aggregate_and_sent_is_not_placement(self):
        r=profile.pitchbox_observations([('saved',dict(checked_at_utc='2026-10-07T00:00:00Z',sent=1,
            new_placements_verified=0,email='private@example.org',message='private',api_key='secret'))])
        self.assertEqual(r['sent'],1);self.assertEqual(r['new_placements_verified'],0)
        for field in ('email','message','api_key'):self.assertNotIn(field,r)
    def test_newest_completed_crawl_wins_independently_of_filename_order(self):
        old={'healthscores':[dict(project_id='1',date='2026-10-04T01:00:00Z',status='Completed',health_score=20)]}
        new={'requests':{'saved':[{'healthscores':[dict(project_id='1',date='2026-10-06T08:02:36Z',status='Completed',health_score=90)]}]}}
        stopped={'healthscores':[dict(project_id='1',date='2026-10-06T12:00:00Z',status='Stopped',health_score=100)]}
        row=latest_completed_audits([('new',new),('old',old),('stopped',stopped)],{'1':{'at':'2026-10-06T09:55:57Z'}})[0]
        self.assertEqual(row['health_score'],90)
        self.assertEqual(row['evidence_file'],'new')
        self.assertEqual(row['latest_observed_attempt']['status'],'Stopped')
        self.assertEqual(row['release_coverage'],'predates_release')

    def test_native_text_receipt_and_no_completed_baseline_are_distinct(self):
        doc={'content':[{'type':'text','text':'{"healthscores":[{"project_id":"2","date":"2026-10-06T12:00:00Z","status":"Running"}]}'}]}
        row=latest_completed_audits([('native',doc)])[0]
        self.assertFalse(row['usable_completed_baseline'])
        self.assertEqual(row['release_coverage'],'no_completed_baseline')

    def test_completion_after_release_does_not_assert_every_url_recrawled(self):
        row=latest_completed_audits([('new',{'healthscores':[dict(project_id='1',date='2026-10-06T12:00:00Z',status='Completed')]})],{'1':{'at':'2026-10-06T09:55:57Z'}})[0]
        self.assertEqual(row['release_coverage'],'completed_after_release_requires_url_checks')

    def test_navigation_cannot_be_labelled_as_accepted_request(self):
        for name in ('enroll','contact_us','enquiry_link_click'):
            self.assertEqual(EVENTS[name], 'navigation')
        self.assertEqual(EVENTS['enquiry_accepted'], 'api_accepted_request')
        self.assertEqual(EVENTS['phone_link_click'], 'contact_intent')

    def test_missing_outcomes_are_not_zero(self):
        self.assertIsNone(aggregates(None)['counts'])

    def test_canonical_matching_keeps_distinct_hosts_and_routes(self):
        self.assertEqual(url_key('https://www.pinnacleblooms.org/enroll?service=ot#form'),
                         'https://www.pinnacleblooms.org/enroll?service=ot')
        self.assertNotEqual(url_key('https://pinnacleblooms.org/ask'),
                            url_key('https://www.pinnacleblooms.org/ask'))

    def test_only_tracking_parameters_are_removed(self):
        page='https://www.pinnacleblooms.org/Ask?page=2&q=ability%20score&service=ot&centre=hyderabad&flag='
        for parameter in ('utm_source', 'UTM_campaign', 'gclid', 'dclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'):
            with self.subTest(parameter=parameter):
                self.assertEqual(url_key(page+'&'+parameter+'=test#results'), page)
        for parameter in ('page', 'q', 'service', 'centre'):
            with self.subTest(functional=parameter):
                self.assertNotEqual(url_key('https://www.pinnacleblooms.org/ask?'+parameter+'=a'),
                                    url_key('https://www.pinnacleblooms.org/ask?'+parameter+'=b'))

    def test_gsc_native_envelope_preserves_partial_window_and_pagination(self):
        raw=dict(startDate='2026-09-08', endDate='2026-10-05', dimensions=['query','page'],
                 settledThrough='2026-10-04', dataMaturity={'firstIncompleteDate':'2026-10-05','dateBasis':'America/Los_Angeles'},
                 pagination={'limit':80,'offset':0,'returned':80,'hasMore':True,'nextOffset':80},
                 rows=[dict(keys=['occupational therapy','https://www.pinnacleblooms.org/enroll?service=ot&utm_source=gmb'],
                            clicks=1,impressions=10,ctr=10,position=3)])
        native={'content':[{'type':'text','text':json.dumps(raw)}], 'structuredContent':raw, 'isError':False}
        envelope={'observations':{'gsc_parent_queries':{'status':'fulfilled','value':native}}}
        result=profile.gsc_query_page_observations([('provider-readbacks.json',envelope)])
        self.assertEqual(len(result['records']),1)
        sample=result['records'][0]
        self.assertEqual(sample['url'],'https://www.pinnacleblooms.org/enroll?service=ot')
        self.assertEqual((sample['start'],sample['end'],sample['settledThrough']),('2026-09-08','2026-10-05','2026-10-04'))
        self.assertEqual(sample['window_boundary'],'partial_window')
        self.assertEqual(sample['row_boundary'],'partial_rows')
        self.assertTrue(sample['pagination']['hasMore'])
        self.assertEqual(sample['dateBasis'],'America/Los_Angeles')
        self.assertNotIn('total_clicks',result)

    def test_gsc_text_receipt_raw_response_and_unknown_maturity(self):
        raw=dict(startDate='2026-10-01',endDate='2026-10-05',
                 rows=[dict(query='speech therapy',page='https://www.pinnacleblooms.org/speech-therapy',clicks=2)])
        text={'content':[{'type':'text','text':json.dumps(raw)}]}
        unknown=profile.gsc_query_page_observations([('text',text)])['records'][0]
        self.assertEqual(unknown['window_boundary'],'maturity_unavailable')
        self.assertIsNone(unknown['settledThrough']);self.assertIsNone(unknown['pagination']['hasMore'])
        partial=profile.gsc_query_page_observations([('raw',{**raw,'dataMaturity':{'firstIncompleteDate':'2026-10-05'}})])['records'][0]
        self.assertEqual(partial['window_boundary'],'partial_window')
        settled=profile.gsc_query_page_observations([('raw',{**raw,'settledThrough':'2026-10-05'})])['records'][0]
        self.assertEqual(settled['window_boundary'],'settled_window')
        missing=profile.gsc_query_page_observations([('raw',{'rows':raw['rows'],'settledThrough':'2026-10-05'})])['records'][0]
        self.assertEqual(missing['window_boundary'],'window_dates_unavailable')

    def test_testingbot_release_coverage_does_not_infer_revision_match(self):
        release={'at':'2026-10-06T09:00:00Z','commit':'released-revision','deployment':'deployed-version'}
        before={'at':'2026-10-06T08:00:00Z','candidate_build':False,'functional':'pass'}
        after={**before,'at':'2026-10-06T10:00:00Z'}
        self.assertEqual(profile.testingbot_release_observation(before,release)['release_coverage'],'predates_release')
        checked=profile.testingbot_release_observation(after,release)
        self.assertEqual(checked['release_coverage'],'after_release_requires_revision_match')
        self.assertEqual(checked['functional'],'pass');self.assertNotIn('revision_match',checked)
        self.assertEqual(profile.testingbot_release_observation({**after,'candidate_build':True},release)['release_coverage'],'candidate')
        self.assertEqual(profile.testingbot_release_observation(after,None)['release_coverage'],'release_time_unavailable')
        self.assertEqual(profile.testingbot_release_observation(after,{'at':'2026-10-06'})['release_coverage'],'release_time_unavailable')
        self.assertNotIn('release_coverage',after)

    def test_manifest_query_samples_join_without_replacing_regional_totals(self):
        with tempfile.TemporaryDirectory() as d:
            work=Path(d);root=work/'controller';root.mkdir()
            ahrefs=work/'ahrefs-growth-20261004';ahrefs.mkdir()
            url='https://www.pinnacleblooms.org/enroll?service=ot'
            receipt=root/'release.json'
            documents={root/'queue.json':{'items':[dict(id='repair',priority=10,status='completed',object=url)],
                        'results':[{'item_id':'repair','receipt':str(receipt)}]},
                receipt:{'at':'2026-10-06T09:00:00Z','commit':'revision','deployment':'version','public_url':url},
                root/'regional-baseline-20261004.json':{'start':'2026-09-01','end':'2026-09-28','groups':{
                    'Hyderabad':{'pages':[dict(url=url,clicks=100,impressions=500,ctr=20,position=2)]}}},
                ahrefs/'audit-triage-20261004-raw.json':{},
                ahrefs/'india-organic-keywords-20261004.json':{'response':{'content':[]}},
                root/'evidence-sources.json':{'gsc_query_page_snapshots':['query.json'],'testingbot_reports':['browser.json'],
                    'testingbot_report_globs':[],'pitchbox_snapshots':[],'ahrefs_snapshots':[],'windsor_evidence':None},
                root/'query.json':{'startDate':'2026-10-01','endDate':'2026-10-05','settledThrough':'2026-10-04',
                    'rows':[dict(query='occupational therapy',page=url+'&utm_source=gmb',clicks=1)]},
                root/'browser.json':{'finishedAt':'2026-10-07T00:00:00Z','suite':'p2','sessions':[{
                    'matrix':'chrome','closed':True,'resultRecorded':True,'cases':[{'id':'enroll','canonical':url,
                    'finishedAt':'2026-10-07T00:00:00Z','status':'passed','checks':[{'name':'route','passed':True}]}]}]}}
            for file,document in documents.items():file.write_text(json.dumps(document),encoding='utf-8')
            result=profile.build(root);row=result['rows'][0]
            self.assertEqual(row['gsc'][url]['clicks'],100)
            self.assertEqual(row['gsc'][url]['end'],'2026-09-28')
            self.assertEqual(row['gsc_query_page_samples'][0]['clicks'],1)
            self.assertEqual(row['gsc_query_page_samples'][0]['window_boundary'],'partial_window')
            self.assertEqual(row['testingbot'][0]['release_coverage'],'after_release_requires_revision_match')
            self.assertEqual(result['gsc_query_page']['state'],'saved_query_page_samples')
            self.assertTrue(any(s['kind'].startswith('GSC saved query/page') for s in result['sources']))

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
