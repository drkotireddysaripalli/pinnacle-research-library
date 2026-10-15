"""Portable contract fixtures; no network, production source or credentials."""
import importlib.util
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
import validate_export

SPEC = importlib.util.spec_from_file_location("knowledge_export", Path(__file__).with_name("export_knowledge_media.py"))
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


class ExportTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.repo = self.base / "repo"
        self.root = self.repo / "speech-site"
        self.root.mkdir(parents=True)
        self.out = self.base / "run"
        self.db = self.base / "approved.sqlite3"
        contracts = {
            "faq_renderer": "'faq-'+route.item.language+'-'+route.item.id src={answer.image} set:html={answer.html} reader={!missing&&!error}",
            "sun_merge": "const replacements=new Map(recovered.map(x=>[x.id,x])); replacements.get(x.id)||x",
            "sun_renderer": "src={topic.image}",
            "sun_route": "topic=sunshineTopic(path); reader={!missing&&!error}",
            "layout": "isAccessibleForFree:false cssSelector:'.ask-registration-content' sourceImage||'https://pinnacleblooms.org/ask/og/default.png'",
            "gate": "Sign in to keep reading.",
            "guru_renderer": 'const images=record.images||[]; ${record.body}; data.records[match[1]]; record.canonicalPath; const existingArticles=[{"canonicalPath":"/guru/8/original"}];',
        }
        for key, content in contracts.items():
            self.write(module.PATHS[key], content, raw=True)
        self.write(module.PATHS["shell"], {"head": "", "header": '<img src="/shared/banner.png">', "footer": ""})
        faq = []
        for ident, image in [(1, "https://images.example.org/faq.jpg?x=1&amp;y=2"), (2, "https://pinnacleblooms.org/ask/og/default.png"), (3, "https://images.example.org/unapproved.jpg")]:
            row = {"id": ident, "language": "english", "lang": "en", "category": "speech-therapy", "url": "/faq/english/speech-therapy/q" + str(ident), "image": image, "html": "<p>Public answer.</p>"}
            self.write("ask-public/knowledge-data/faq-english-" + str(ident) + ".json", row)
            faq.append(row)
        self.write(module.PATHS["faq_index"], faq)
        self.write(module.PATHS["sun_index"], [{"id": 42, "url": "/c/old", "image": "https://images.example.org/stale.jpg"}, {"id": 43, "url": "/skills/legacy", "image": "https://images.example.org/legacy.jpg"}])
        self.write(module.PATHS["sun_recovered"], [{"id": 42, "url": "/sunshine/topic/restored-42", "legacyPath": "/c/old", "image": "https://images.example.org/topic.jpg"}])
        self.write(module.PATHS["guru_data"], {"version": "guru-public-recovery-20261009", "records": {"123": {"id": "123", "canonicalPath": "/guru/123/article", "paths": ["/guru/123/article"], "images": [{"src": "https://images.example.org/gallery.jpg"}], "body": '<p><img src="https://images.example.org/body.jpg"><img src="https://images.example.org/body.jpg"></p>', "bodyMedia": ["https://images.example.org/body.jpg", "https://images.example.org/body.jpg"], "video": "https://www.youtube.com/watch?v=abcdefghijk"}}})
        parents = ["/faq", "/faq/english/speech-therapy/q1", "/faq/english/speech-therapy/q2", "/faq/unknown/topic/question", "/sunshine", "/sunshine/topic/restored-42", "/skills/legacy", "/guru", "/guru/123/article", "/guru/8/original"]
        self.parents = [module.ORIGIN + p for p in parents]
        with sqlite3.connect(self.db) as c:
            c.execute("create table pages(url text primary key, canonical_url text, decision text, module_type text, metadata_json text)")
            c.executemany("insert into pages values(?,?,?,?,?)", [(u, u, "INCLUDE", "test", '{"eligibility":{"source":"approved-fixture"},"public_source_policy":{"owner":"retained"}}') for u in self.parents])
        c.close()

    def write(self, relative, data, raw=False):
        p = self.root / relative
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(data if raw else json.dumps(data), encoding="utf-8")

    def read(self, filename):
        return [json.loads(line) for line in (self.out / filename).read_text().splitlines()]

    def test_exact_join_roles_access_and_dispositions(self):
        report = module.export(self.repo, self.db, self.out)
        ready = self.read("source-backed-relationships.jsonl")
        self.assertEqual(len(ready), 4)
        self.assertEqual({r["role"] for r in ready}, {"hero", "topic_hero", "gallery", "body"})
        self.assertEqual(next(r for r in ready if r["role"] == "body")["source_use_count"], 2)
        self.assertTrue(all(r["actual_rendered_use"] and r["approved_parent"] for r in ready))
        self.assertEqual(next(r for r in ready if r["family"] == "faq")["image_url"], "https://images.example.org/faq.jpg?x=1&amp;y=2")
        self.assertEqual(next(r for r in ready if r["family"] == "faq")["access_class"], "reader_registration_required")
        self.assertTrue(all(r["approved_parent_eligibility"]["public_source_policy"] == {"owner": "retained"} for r in ready))
        candidates = self.read("association-candidates.jsonl")
        legacy = next(r for r in candidates if r["record_id"] == "43")
        self.assertFalse(legacy["actual_rendered_use"])
        self.assertEqual(legacy["canonical_parent"], module.ORIGIN + "/skills/legacy")
        self.assertFalse(any(r["canonical_parent"] == module.ORIGIN + "/sunshine" for r in candidates))
        self.assertEqual(sum(r["disposition"] == "rejected_image" for r in candidates), 1)
        self.assertEqual(sum(r["disposition"] == "unapproved_source_parent" for r in candidates), 1)
        account = self.read("parent-accounting.jsonl")
        self.assertEqual(sum(r["approved_parent"] for r in account), len(self.parents))
        self.assertIn("existing_original_guru_owner_media_outside_recovery_dataset", {r["disposition"] for r in account})
        self.assertEqual(report["acceptance"]["plain_video_links_exported_as_players"], 0)
        verification = validate_export.validate(self.out, self.db)
        self.assertEqual(verification["status"], "passed")
        self.assertGreaterEqual(verification["checks_passed"], 40)

    def test_deterministic_rerun_and_existing_output_guard(self):
        module.export(self.repo, self.db, self.out)
        second = self.base / "run2"
        module.export(self.repo, self.db, second)
        self.assertEqual({p.name: p.read_bytes() for p in self.out.iterdir()}, {p.name: p.read_bytes() for p in second.iterdir()})
        with self.assertRaisesRegex(ValueError, "already exists"):
            module.export(self.repo, self.db, self.out)
        with self.assertRaisesRegex(ValueError, "outside canonical"):
            module.export(self.repo, self.db, self.repo / "bad-output")

    def test_mismatch_and_renderer_change_fail_without_partial_output(self):
        p = self.root / "ask-public/knowledge-data/faq-english-1.json"
        data = json.loads(p.read_text()); data["image"] = "https://images.example.org/wrong.jpg"
        p.write_text(json.dumps(data))
        with self.assertRaisesRegex(ValueError, "detail/index"):
            module.export(self.repo, self.db, self.out)
        self.assertFalse(self.out.exists())
        self.write(module.PATHS["sun_renderer"], "different renderer", raw=True)
        with self.assertRaisesRegex(ValueError, "Renderer contract changed"):
            module.export(self.repo, self.db, self.out)
        self.assertFalse(self.out.exists())

    def test_committed_wal_rows_are_in_approved_snapshot(self):
        writer = sqlite3.connect(self.db)
        self.addCleanup(writer.close)
        writer.execute("pragma journal_mode=wal")
        url = "https://outside.example.org/committed-in-wal"
        writer.execute("insert into pages values(?,?,?,?,?)", (url, url, "INCLUDE", "test", "{}")); writer.commit()
        self.assertTrue(Path(str(self.db) + "-wal").exists())
        report = module.export(self.repo, self.db, self.out)
        self.assertEqual(report["approved_parents_total"], len(self.parents) + 1)
        self.assertEqual(report["approved_parents_outside_scope"], 1)

    def test_sunshine_mixed_identity_types_cannot_change_renderer_matching(self):
        p = self.root / module.PATHS["sun_recovered"]
        data = json.loads(p.read_text()); data[0]["id"] = "42"
        p.write_text(json.dumps(data))
        with self.assertRaisesRegex(ValueError, "Sunshine identities must retain integer types"):
            module.export(self.repo, self.db, self.out)
        self.assertFalse(self.out.exists())

    def test_release_hash_validation_and_xml_parent_namespace(self):
        release = self.base / "release"; release.mkdir()
        content = ('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"><url><loc>' + self.parents[1] + '</loc><image:image><image:loc>https://images.example.org/not-a-parent.jpg</image:loc></image:image></url></urlset>').encode()
        xml = release / "pages.xml"; xml.write_bytes(content)
        manifest = {"release_id": "fixture-release", "page_urls": 1, "files": [{"path": "pages.xml", "kind": "pages", "sha256": module.sha(content), "bytes": len(content), "entries": 1}]}
        (release / "manifest.json").write_text(json.dumps(manifest))
        report = module.export(self.repo, release, self.out)
        self.assertEqual(report["approved_parents_total"], 1)
        self.assertEqual(report["source_backed_approved_parent_relationships"], 1)
        xml.write_bytes(content + b" ")
        with self.assertRaisesRegex(ValueError, "hash mismatch"):
            module.export(self.repo, release, self.base / "bad-release-run")


if __name__ == "__main__":
    unittest.main()
