import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
import public_media_snapshot as p


class PublicMediaSnapshot(unittest.TestCase):
    def test_transformed_image_keeps_separate_actual_rendition_and_r2_source(self):
        actual = 'https://images.pinnacleblooms.org/cdn-cgi/image/width=1400,quality=55/Assets/example.png'
        parser = p.MediaHTML('https://materials.pinnacleblooms.org/example')
        parser.feed('<img src="'+actual+'" alt="Published example">')
        row = parser.snapshot()['media_references'][0]
        self.assertEqual(row['media_url'], actual)
        self.assertEqual(row['source_image_url'], 'https://images.pinnacleblooms.org/Assets/example.png')

    def test_video_source_and_foreign_widget_are_not_confused(self):
        parser = p.MediaHTML('https://materials.pinnacleblooms.org/example')
        parser.feed('<video poster="/poster.jpg"><source src="https://images.pinnacleblooms.org/Assets/Materials/video/example.mp4" type="video/mp4"></video><iframe src="https://widget.trustpilot.com/example"></iframe>')
        rows = parser.snapshot()['media_references']
        self.assertEqual([r['media_kind'] for r in rows], ['image', 'video'])
        self.assertFalse(any(r['media_kind'] == 'player' for r in rows))

    def test_canonical_and_noindex_are_explicit_gates(self):
        url = 'https://materials.pinnacleblooms.org/example'
        parser = p.MediaHTML(url)
        parser.feed('<link rel="canonical" href="'+url+'"><meta name="robots" content="noindex, follow">')
        state = parser.snapshot()
        self.assertTrue(state['self_canonical'])
        self.assertTrue(state['noindex'])
        self.assertTrue(parser.snapshot('googlebot: noindex')['noindex'])
        self.assertTrue(parser.snapshot('googlebot: noimageindex')['noimageindex'])
        missing = p.MediaHTML(url).snapshot()
        self.assertFalse(missing['self_canonical'])
        self.assertFalse(missing['canonical_conflict'])
        other = p.MediaHTML(url); other.feed('<link rel="canonical" href="https://example.com/other">')
        self.assertTrue(other.snapshot()['canonical_conflict'])

    def test_scope_uses_only_accepted_public_modules_not_patient_or_auth_routes(self):
        rows = [{'page_url': u} for u in ('https://materials.pinnacleblooms.org/example',
                                         'https://www.pinnacleblooms.org/abs/public-example',
                                         'https://www.pinnacleblooms.org/ask/auth/login',
                                         'https://psapi.pinnacleblooms.org/private-record')]
        self.assertEqual(p.selected_urls(rows), [rows[0]['page_url'], rows[1]['page_url']])

    def test_unicode_canonical_is_the_same_encoded_publisher_address(self):
        parser = p.MediaHTML('https://www.pinnacleblooms.org/abs/example%E2%80%933')
        parser.feed('<link rel="canonical" href="https://www.pinnacleblooms.org/abs/example–3">')
        self.assertTrue(parser.snapshot()['self_canonical'])
        self.assertFalse(parser.snapshot()['canonical_conflict'])


if __name__ == '__main__':
    unittest.main()
