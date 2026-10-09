"""Offline acceptance for source-backed old-ID joins and generated aliases."""
import copy
import hashlib
import json
from pathlib import Path
import unittest

from legacy_identities import legacy_alias_paths

HERE = Path(__file__).resolve().parent
MANIFEST = json.loads((HERE / 'data/legacy-identity-aliases.json').read_text())
RECORDS = {}
for file in (HERE / 'data').glob('details-*.json'):
    RECORDS.update(json.loads(file.read_text()))


class LegacyIdentityEvidence(unittest.TestCase):
    def test_all_evidenced_aliases_are_generated_without_new_directory_records(self):
        aliases = legacy_alias_paths(MANIFEST, RECORDS)
        catalogue = json.loads((HERE / 'data/catalogue.json').read_text())
        for path, target in aliases.items():
            self.assertEqual(catalogue['aliasPaths'][path], target)
        self.assertEqual(len(catalogue['records']), 29759)
        self.assertEqual(len(catalogue['order']), 19292)
        self.assertTrue(set(row['legacyId'] for row in MANIFEST['mappings']).isdisjoint(catalogue['order']))
        provenance = json.loads((HERE / 'data/provenance.json').read_text())['legacyIdentityAliases']
        self.assertEqual(provenance['sha256'], hashlib.sha256((HERE / 'data/legacy-identity-aliases.json').read_bytes()).hexdigest())
        self.assertEqual(provenance['paths'], len(aliases))
        self.assertEqual(provenance['numericIdentities'], len({path.split('/')[2] for path in aliases}))

    def test_original_player_and_thumbnail_must_both_match(self):
        for field, wrong in [('primaryPlayer', 'https://www.youtube.com/embed/abcdefghijk'),
                             ('schemaPlayer', 'https://www.youtube.com/embed/abcdefghijk'),
                             ('schemaThumbnail', 'https://videodelivery.net/' + '0' * 32 + '/thumbnails/thumbnail.jpg')]:
            with self.subTest(field=field):
                source = copy.deepcopy(MANIFEST)
                source['mappings'][0]['source'][field] = wrong
                with self.assertRaises(ValueError):
                    legacy_alias_paths(source, RECORDS)

    def test_ambiguous_duplicate_player_cannot_choose_a_canonical(self):
        records = dict(RECORDS)
        records['999999999999999999'] = {**records[MANIFEST['mappings'][0]['canonicalId']],
                                        'path': '/mirracles/999999999999999999/INVENTED'}
        with self.assertRaisesRegex(ValueError, 'unique canonical'):
            legacy_alias_paths(MANIFEST, records)

    def test_same_player_with_different_thumbnail_keeps_the_proven_media_pair(self):
        records = dict(RECORDS)
        records['999999999999999999'] = {**records[MANIFEST['mappings'][0]['canonicalId']],
                                        'path': '/mirracles/999999999999999999/INVENTED',
                                        'poster': 'https://videodelivery.net/' + '0' * 32 + '/thumbnails/thumbnail.jpg'}
        self.assertEqual(legacy_alias_paths(MANIFEST, records), legacy_alias_paths(MANIFEST, RECORDS))

    def test_existing_legacy_id_or_wrong_target_is_rejected(self):
        records = dict(RECORDS)
        records[MANIFEST['mappings'][0]['legacyId']] = next(iter(RECORDS.values()))
        with self.assertRaisesRegex(ValueError, 'collides'):
            legacy_alias_paths(MANIFEST, records)
        source = copy.deepcopy(MANIFEST)
        source['mappings'][0]['canonicalPath'] = '/mirracles/123/INVENTED'
        with self.assertRaisesRegex(ValueError, 'canonical target'):
            legacy_alias_paths(source, RECORDS)

    def test_unsafe_or_unrelated_source_paths_cannot_be_imported(self):
        for path in ['/mirracles/2652/INVENTED?token=private', '/mirracles/2652/INVENTED%2fother',
                     '/mirracles/2652/%2e%2e', '/mirracles/123/INVENTED',
                     'https://evil.test/mirracles/2652/INVENTED',
                     '/mirracles/2652/%FF', '/mirracles/2652/%', '/mirracles/2652/%xx',
                     '/mirracles/2652/INVENTED\n']:
            with self.subTest(path=path):
                source = copy.deepcopy(MANIFEST)
                source['mappings'][0]['paths'].append(path)
                with self.assertRaises(ValueError):
                    legacy_alias_paths(source, RECORDS)

    def test_missing_or_unsuccessful_original_source_is_rejected(self):
        for field, wrong in [('httpStatus', 404), ('sha256', 'INVENTED'), ('url', 'https://www.pinnacleblooms.org/mirracles/123/INVENTED')]:
            with self.subTest(field=field):
                source = copy.deepcopy(MANIFEST)
                source['mappings'][0]['source'][field] = wrong
                with self.assertRaises(ValueError):
                    legacy_alias_paths(source, RECORDS)


if __name__ == '__main__':
    unittest.main()
