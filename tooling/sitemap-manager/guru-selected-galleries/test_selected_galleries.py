import copy
import html
from html.parser import HTMLParser
import json
import pathlib
import tempfile
import unittest

import build_selected_galleries as build
import preflight_selected_galleries as preflight


def source_fixture():
    row = {'guru_id': 5847, 'gallery_sequence_candidate': 0, 'object_key': 'Assets/IMAGEGALLERY/5847_0.jpg',
           'configured_public_urls': ['https://images.pinnacleblooms.org/Assets/IMAGEGALLERY/5847_0.jpg'],
           'exact_declared_count_match': True, 'declared_TotalImages': 1, 'candidate_count_for_id': 1,
           'source_parent_url': 'https://www.pinnacleblooms.org/guru/5847/monday-morning-smiles'}
    projection = {'success': True, 'source': 'reference-only fixture', 'retrieved_at': 'not a publication date',
                  'rows': [{'Id': 5847, 'Title': 'A literal public title', 'TotalImages': 1}]}
    return [row], projection, {'source_files': [], 'missing_declared_images': [], 'null_declared_count_ids': []}


class GalleryTests(unittest.TestCase):
    def plan(self, title=None):
        a, p, d = source_fixture()
        if title is not None:
            p['rows'][0]['Title'] = title
        return build.make_plan(a, p, d, {'fixture': 'a' * 64}, exact_scope=False)

    def test_deterministic_escaped_literal_context_and_one_cta(self):
        title = 'A "literal" <script>alert(1)</script> & title\'s '
        first = self.plan(title)
        second = self.plan(title)
        self.assertEqual(first, second)
        _, parents, pairs, _ = first
        _, manifest, digest, fragment = parents[0]
        text = fragment.decode()
        self.assertIn(html.escape(title.strip(), quote=True), text)
        self.assertNotIn('<script>', text)
        self.assertEqual(text.count('<img '), 1)
        self.assertEqual(text.count('tel:+919100181181'), 1)
        self.assertIn('loading="lazy" decoding="async"', text)
        self.assertIn('data-guru-render-manifest-sha256="' + digest + '"', text)
        self.assertEqual(manifest['historical_render_or_upload_provenance'], 'UNKNOWN')
        self.assertEqual(pairs[0]['sitemap_admission'], build.HOLD)
        self.assertEqual(pairs[0]['licence'], 'UNKNOWN')
        self.assertEqual(pairs[0]['image_url'], 'https://images.pinnacleblooms.org/Assets/IMAGEGALLERY/5847_0.jpg')

    def test_scope_rejects_unknown_parent_duplicate_gap_and_null_count(self):
        for mutation in ('id', 'parent', 'key', 'duplicate', 'gap', 'count'):
            a, p, d = source_fixture()
            if mutation == 'id': a[0]['guru_id'] = 999999
            if mutation == 'parent': a[0]['source_parent_url'] = 'https://www.pinnacleblooms.org/guru/999/a'
            if mutation == 'key': a[0]['object_key'] = 'Assets/IMAGEGALLERY/5847_7.jpg'
            if mutation == 'duplicate': a.append(copy.deepcopy(a[0]))
            if mutation == 'gap':
                p['rows'][0]['TotalImages'] = 2
                a[0]['declared_TotalImages'] = a[0]['candidate_count_for_id'] = 2
            if mutation == 'count': p['rows'][0]['TotalImages'] = None
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                build.validate_sources(a, p, d, exact_scope=False)

    def test_changed_input_pin_rejected_before_output_creation(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            inputs = root / 'inputs'
            inputs.mkdir()
            for name in build.PINS:
                (inputs / name).write_text('{}\n')
            with self.assertRaisesRegex(ValueError, 'hash changed'):
                build.build(inputs, root / 'new-plan')
            self.assertFalse((root / 'new-plan').exists())

    def test_actual_html_canonical_iri_equivalence_keeps_reserved_encodings(self):
        encode = preflight.canonical_uri
        self.assertEqual(encode('https://www.pinnacleblooms.org/guru/1/title–😊'),
                         encode('https://www.pinnacleblooms.org/guru/1/title%e2%80%93%f0%9f%98%8a'))
        self.assertNotEqual(encode('https://www.pinnacleblooms.org/guru/1/a%2Fb'), encode('https://www.pinnacleblooms.org/guru/1/a/b'))
        self.assertNotEqual(encode('https://www.pinnacleblooms.org/guru/1/a?x=1'), encode('https://www.pinnacleblooms.org/guru/1/a#x=1'))

    def test_primary_parser_excludes_shell_related_and_body_images(self):
        p = preflight.Page('https://www.pinnacleblooms.org/guru/5847/title')
        p.feed('<meta property="og:image" content="https://images.pinnacleblooms.org/Assets/PUBLISHIMAGE/Image/5847_THUMB.jpeg">'
               '<header><img src="shell.jpg"></header><main class="guru-recovery">'
               '<div class="guru-gallery"><figure><img src="primary.jpg"></figure></div>'
               '<article class="guru-article"><img src="body.jpg"></article>'
               '<aside><img src="related.jpg"></aside></main><footer><img src="footer.jpg"></footer>')
        self.assertEqual([x['url'].rsplit('/', 1)[-1] for x in p.primary_images], ['primary.jpg'])
        self.assertEqual(len(p.og_images), 1)
        p = preflight.Page('https://www.pinnacleblooms.org/guru/6129/title')
        p.feed('<div id="cm-news-page-content"><div class="cm-np-c-data"><div class="image"><img src="exact.jpg"></div>'
               '<p><img src="body.jpg"></p></div></div><div class="image"><img src="shell.jpg"></div>')
        self.assertEqual([x['url'].rsplit('/', 1)[-1] for x in p.primary_images], ['exact.jpg'])

    def test_primary_fallback_requires_confirmed_failure_and_current_qualification(self):
        manifest = self.plan()[1][0][1]
        thumb = 'https://images.pinnacleblooms.org/Assets/PUBLISHIMAGE/Image/5847_THUMB.jpeg'
        parent = {'parent_preflight_qualified': True, 'recognized_renderers': ['known'],
                  'selected_primary_images': [{'url': thumb}], 'og_images': [thumb], 'body_sha256': 'a' * 64}
        for status, permit in ((404, True), (410, True), (200, False), (503, False), (None, False), (302, False)):
            with self.subTest(status=status):
                rec = preflight.replacement_decision(manifest, parent, {thumb: {'status': status}}, True)
                self.assertEqual(rec['visible_primary']['fallback_permitted_for_integration'], permit)
        parent['parent_preflight_qualified'] = False
        self.assertFalse(preflight.replacement_decision(manifest, parent, {thumb: {'status': 404}}, True)['visible_primary']['fallback_permitted_for_integration'])
        parent['parent_preflight_qualified'] = True
        self.assertFalse(preflight.replacement_decision(manifest, parent, {thumb: {'status': 404}}, False)['og_image']['fallback_permitted_for_integration'])
        parent['selected_primary_images'] = [{'url': 'https://images.pinnacleblooms.org/other-valid.jpg'}]
        self.assertFalse(preflight.replacement_decision(manifest, parent, {}, True)['visible_primary']['fallback_permitted_for_integration'])

    def test_absence_only_in_recognized_renderer_no_unknown_rewrite(self):
        manifest = self.plan()[1][0][1]
        parent = {'parent_preflight_qualified': True, 'recognized_renderers': [], 'selected_primary_images': [],
                  'og_images': [], 'body_sha256': 'a' * 64}
        self.assertFalse(preflight.replacement_decision(manifest, parent, {}, True)['visible_primary']['fallback_permitted_for_integration'])
        parent['recognized_renderers'] = ['known']
        self.assertTrue(preflight.replacement_decision(manifest, parent, {}, True)['visible_primary']['fallback_permitted_for_integration'])

    def test_repeated_raw_image_and_parent_robots_veto_independent_of_producer_bool(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            (root / 'robots.txt').write_text('User-agent: *\nAllow: /\n')
            robots = {'status': 200, 'body_complete': True, 'body_file': 'robots.txt'}
            url = 'https://images.pinnacleblooms.org/Assets/IMAGEGALLERY/5847_0.jpg'
            for value in ('noindex', 'googlebot: none', 'noimageindex'):
                rec = {'url': url, 'status': 200, 'response_url': url, 'content_type': 'image/jpeg', 'content_length': '20',
                       'x_robots': ['index, follow', value], 'direct_image_delivery_verified': True}
                result = preflight.image_observation(rec, robots, root)
                self.assertFalse(result['delivery_preflight_qualified'])
                self.assertIn('IMAGE_X_ROBOTS_VETO', result['hold_reasons'])
            manifest = self.plan()[1][0][1]
            parent = manifest['existing_parent_url']
            (root / 'parent.html').write_text(f'<link rel="canonical" href="{parent}"><meta name="robots" content="noindex">')
            rec = {'url': parent, 'response_url': parent, 'status': 200, 'content_type': 'text/html',
                   'body_complete': True, 'body_file': 'parent.html', 'observed_at': 'fixture', 'x_robots': ['index']}
            result = preflight.parent_observation(manifest, rec, robots, root)
            self.assertFalse(result['parent_preflight_qualified'])
            self.assertIn('PARENT_ROBOTS_VETO', result['hold_reasons'])

    def test_cached_raw_header_tampering_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            data = build.encoded({'status': 200, 'header_pairs': [['X-Robots-Tag', 'noimageindex']]})
            (root / 'headers.json').write_bytes(data)
            rec = {'status': 200, 'x_robots': [], 'raw_headers_file': 'headers.json', 'raw_headers_sha256': build.sha(data)}
            with self.assertRaisesRegex(ValueError, 'differs from raw'):
                preflight.validate_raw(rec, root)

    def test_absent_robots_file_is_distinct_from_unavailable_policy(self):
        root = pathlib.Path('.')
        for status, expected in ((404, True), (410, True), (403, None), (429, None), (503, None), (302, None)):
            url = 'https://images.pinnacleblooms.org/robots.txt'
            result = preflight.robot_allow({'url': url, 'response_url': url, 'status': status}, root,
                                           'https://images.pinnacleblooms.org/Assets/IMAGEGALLERY/5847_0.jpg')
            self.assertEqual(set(result.values()), {expected})


if __name__ == '__main__':
    unittest.main()
