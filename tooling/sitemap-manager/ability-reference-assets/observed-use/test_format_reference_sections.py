import html
import json
import pathlib
import tempfile
import unittest
from html.parser import HTMLParser

import format_reference_sections as formatter
from test_qualify_observed_ability_uses import Fixture, NOW

ability = formatter.ability
HERE = pathlib.Path(__file__).resolve().parent


class Tags(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.text = []

    def handle_starttag(self, tag, attributes):
        self.tags.append((tag, dict(attributes)))

    def handle_data(self, data):
        self.text.append(data)


class FormatterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='.ability-formatter-', dir=HERE)
        self.root = pathlib.Path(self.temp.name) / 'packet'
        self.root.mkdir()
        self.fixture = Fixture(self.root)
        self.literal = '<script>alert("x")</script> & “source” <img src=x onerror="x">'
        index = json.loads((self.root / 'parent-render-index.json').read_bytes())
        for entry in index['parents']:
            path = self.root / entry['manifest_path']
            document = json.loads(path.read_bytes())
            section = document['section']
            section.update(heading=self.literal, notice=self.literal, child_response_fields=[], scoring_fields=[], form_actions=[], result_generation=False, brand_cta={'brand': 'Pinnacle Blooms Network', 'phone': '9100181181', 'href': 'tel:9100181181', 'instances_per_parent': 1, 'text': 'For assessment enquiries, call 9100181181.'})
            for item in section['reference_items']:
                item.update(source_question=self.literal, source_keyword=self.literal, context_purpose=self.literal, reference_examples=[{'source_field': field, 'text': self.literal + field} for field in ('E1', 'E2', 'E3')])
                for image in item['illustrations']:
                    image.update(purpose_alt_suggestion=self.literal, purpose_caption_suggestion=self.literal)
            raw = ability.pack(document)
            path.write_bytes(raw)
            entry.update(sha256=ability.sha(raw), bytes=len(raw))
        raw = ability.pack(index)
        (self.root / 'parent-render-index.json').write_bytes(raw)
        self.fixture.isha = ability.sha(raw)
        self.fixture.packet = ability.load_packet(self.root, self.fixture.csha, self.fixture.isha)

    def tearDown(self):
        self.temp.cleanup()

    def formatted(self):
        return formatter.format_packet(self.root, self.fixture.csha, self.fixture.isha)

    def test_deterministic_escaped_literal_context_and_exact_qualified_pairs(self):
        fragments, index = self.formatted()
        self.assertEqual((fragments, index), self.formatted())
        self.assertEqual(index['image_relationships'], 3)
        observations = []
        for entry in index['parents']:
            fragment = fragments[entry['fragment_path']]
            parser = Tags()
            parser.feed(fragment.decode('utf-8'))
            self.assertIn(self.literal, parser.text)
            for field in ('E1', 'E2', 'E3'):
                self.assertIn(self.literal + field, parser.text)
            self.assertIn(html.escape(self.literal, quote=True), fragment.decode('utf-8'))
            self.assertFalse({'script', 'style', 'form', 'input', 'details', 'button'} & {tag for tag, _ in parser.tags})
            self.assertEqual(sum(tag == 'a' and a['href'] == 'tel:9100181181' for tag, a in parser.tags), 1)
            self.assertTrue(all(a['loading'] == 'lazy' and a['decoding'] == 'async' and a['alt'] == self.literal for tag, a in parser.tags if tag == 'img'))
            self.assertEqual(ability.sha(fragment), entry['sha256'])
            body = b'<html><body>' + fragment + b'</body></html>'
            observations.append(self.fixture.record(entry['parent_url'], body))
        db = self.fixture.db()
        try:
            result = ability.qualify(self.fixture.packet, self.fixture.observations(observations), self.fixture.heads(), ability.feed_state_from_db(db, self.fixture.packet), NOW)
        finally:
            db.close()
        self.assertEqual(result['status'], 'qualified_complete')
        self.assertEqual(len(result['qualified']), 3)

    def test_changed_hash_unknown_pair_and_input_overwrite_rejected(self):
        fragments, index = self.formatted()
        with self.assertRaisesRegex(ValueError, 'overlaps'):
            formatter.write_output(self.root, self.root / 'fragments', fragments, index)
        destination = pathlib.Path(self.temp.name) / 'output'
        formatter.write_output(self.root, destination, fragments, index)
        with self.assertRaisesRegex(ValueError, 'Fresh'):
            formatter.write_output(self.root, destination, fragments, index)
        parent_index = json.loads((self.root / 'parent-render-index.json').read_bytes())
        entry = parent_index['parents'][0]
        path = self.root / entry['manifest_path']
        original = path.read_bytes()
        path.write_bytes(original + b' ')
        with self.assertRaisesRegex(ValueError, 'binding'):
            self.formatted()
        document = json.loads(original)
        document['section']['reference_items'][0]['illustrations'][0]['image_url'] += '?unknown=1'
        raw = ability.pack(document)
        path.write_bytes(raw)
        entry.update(sha256=ability.sha(raw), bytes=len(raw))
        raw = ability.pack(parent_index)
        (self.root / 'parent-render-index.json').write_bytes(raw)
        with self.assertRaisesRegex(ValueError, 'Illustration'):
            formatter.format_packet(self.root, self.fixture.csha, ability.sha(raw))

    def test_public_alt_fallback_uses_literal_question_not_database_id(self):
        question='Can a child respond to “Where is your nose?”'
        for role,label in [('question_image','Question'),('example_image','Example')]:
            image={'role':role,'purpose_alt_suggestion':label+' illustration accompanying reference question 1484'}
            self.assertEqual(ability.public_purpose_alt({'source_question':question},image),label+' illustration accompanying: '+question)
            with self.assertRaisesRegex(ValueError,'Literal source question'):
                ability.public_purpose_alt({'source_question':''},image)
        self.assertEqual(ability.public_purpose_alt({}, {'role':'question_image','purpose_alt_suggestion':self.literal}),self.literal)
        fragments,_=self.formatted()
        for fragment in fragments.values():
            tags=Tags();tags.feed(fragment.decode())
            visible=' '.join(tags.text)
            self.assertNotIn('Source reference:',visible)
            self.assertNotIn('Reference item ',visible)
            self.assertNotIn('E1 source example',visible)
            self.assertIn('Example 1',visible)


if __name__ == '__main__':
    unittest.main()
