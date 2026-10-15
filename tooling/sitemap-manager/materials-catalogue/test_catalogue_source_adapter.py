import argparse
import copy
from datetime import datetime
import json
from pathlib import Path
import tempfile
import unittest
import catalogue_source_adapter as adapter

FIXTURES = Path(__file__).parent / "fixtures"
NOW = "2026-10-15T16:00:00+00:00"


class ContractTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.body = (FIXTURES / "catalogue.html").read_text()
        self.proof = {"page_url": adapter.PARENT, "final_url": adapter.PARENT, "status": 200, "method": "GET", "observed_at": NOW, "credentials_sent": False, "redirects_followed": False, "media_bodies_downloaded": False, "noindex": False, "noimageindex": False, "canonical_conflict": False, "canonical_urls": [adapter.PARENT], "canonical_normalized": [adapter.PARENT], "canonical_basis": "explicit_html", "robots": [], "response_headers": {"Content-Type": "text/html; charset=utf-8"}}
        self.heads = [{"url": f"https://www.pinnacleblooms.org/Assets/Materials/{n}.jpg", "method": "HEAD", "status": 200, "content_type": "image/*", "content_length": "1234", "direct_image_delivery_verified": True, "x_robots": ""} for n in [1, 2, 999]]
        self.receipt = {"checked_at": NOW, "redirects_followed": False, "credentials_sent": False, "media_bodies_downloaded": False}
        self.permit = {"scope": "current_public_sitemap_references", "direct_user_request": "Owner requested public sitemap references", "reference_permission": "Current public references only"}
        self.args = argparse.Namespace(html=self.root / "page.html", page_proof=self.root / "proof.json", heads=self.root / "heads.jsonl", heads_receipt=self.root / "heads-receipt.json", permit=self.root / "permit.json", approved_release=self.root / "release", output=self.root / "out", previous_candidates=None, as_of=NOW, max_age_hours=24)
        self.make_release()

    def make_release(self):
        release = self.args.approved_release; release.mkdir(exist_ok=True)
        page = f'<urlset xmlns="{adapter.NS[1:-1]}"><url><loc>{adapter.PARENT}</loc></url></urlset>'.encode()
        image = f'<urlset xmlns="{adapter.NS[1:-1]}" xmlns:image="{adapter.INS[1:-1]}"><url><loc>{adapter.PARENT}</loc><image:image><image:loc>https://images.pinnacleblooms.org/Assets/Materials/existing.png</image:loc></image:image></url></urlset>'.encode()
        files = []
        for name, raw, kind in [("pages.xml", page, "pages"), ("images.xml", image, "images")]:
            (release / name).write_bytes(raw)
            files.append({"path": name, "kind": kind, "bytes": len(raw), "entries": 1, "sha256": adapter.digest(raw)})
        (release / "manifest.json").write_text(json.dumps({"release_id": "fixture-approved-release", "files": files}))

    def prepare(self):
        raw = self.body.encode(); self.args.html.write_bytes(raw)
        self.proof.update(body_sha256=adapter.digest(raw), body_bytes=len(raw))
        self.args.page_proof.write_text(json.dumps(self.proof))
        self.args.heads.write_text("".join(json.dumps(row) + "\n" for row in self.heads))
        self.args.heads_receipt.write_text(json.dumps(self.receipt))
        self.args.permit.write_text(json.dumps(self.permit))

    def run_export(self):
        self.prepare(); return adapter.export(self.args)

    def read(self, name):
        return [json.loads(line) for line in (self.args.output / name).read_text().splitlines()]

    def reject(self, text):
        self.prepare()
        with self.assertRaisesRegex(ValueError, text): adapter.export(self.args)
        self.assertFalse(self.args.output.exists())

    def test_safe_new_tile_admitted_exact_source_and_existing_limit(self):
        report = self.run_export()
        self.assertEqual((report["catalogue_candidates"], report["combined_exact_image_urls"], report["network_requests"]), (2, 3, 0))
        rows = self.read("catalogue-use-qualified-candidates.jsonl")
        self.assertEqual({r["media_url"] for r in rows}, {self.heads[0]["url"], self.heads[1]["url"]})
        self.assertTrue(all(r["candidate_import_qualified"] and not r["primary_article_use_proven"] and not r["r2_object_identity_verified"] for r in rows))
        self.assertEqual(rows[0]["rights_evidence"]["scope"], "current_public_sitemap_references")
        self.args.previous_candidates = self.args.output / "catalogue-use-qualified-candidates.jsonl"
        self.args.output = self.root / "next-day"
        new_tile = '<div class="pb-card"><img class="pb-img" src="https://www.pinnacleblooms.org/Assets/Materials/3.jpg" alt="New catalogue item three"></div>'
        self.body = self.body.replace('</div></div></div></div></div></div></main>', new_tile + '</div></div></div></div></div></div></main>')
        self.heads.append({**self.heads[0], "url": "https://www.pinnacleblooms.org/Assets/Materials/3.jpg"})
        next_day = self.run_export()
        self.assertEqual((next_day["catalogue_candidates"], next_day["proposed_source_withdrawals"], next_day["combined_exact_image_urls"]), (3, 0, 4))

    def test_absent_previous_tile_proposes_only_its_source_withdrawal(self):
        self.run_export(); previous = self.args.output / "catalogue-use-qualified-candidates.jsonl"
        self.args.previous_candidates = previous; self.args.output = self.root / "second"
        self.body = "\n".join(line for line in self.body.splitlines() if "/2.jpg" not in line)
        report = self.run_export()
        removed = self.read("proposed-source-withdrawals.jsonl")
        self.assertEqual(report["proposed_source_withdrawals"], 1)
        self.assertEqual((removed[0]["media_url"], removed[0]["withdrawal_scope"]), (self.heads[1]["url"], "this_managed_source_only"))
        self.assertEqual(removed[0]["withdrawal_reason"], "absent_from_complete_current_catalogue")

    def test_foreign_previous_parent_or_corrupt_pair_cannot_be_withdrawn(self):
        self.run_export(); old = self.read("catalogue-use-qualified-candidates.jsonl")
        for mutation in [{"page_url": "https://materials.pinnacleblooms.org/related"}, {"pair_key": "wrong"}]:
            rows = copy.deepcopy(old); rows[0].update(mutation)
            previous = self.root / "bad-previous.jsonl"; previous.write_text("".join(json.dumps(row) + "\n" for row in rows))
            self.args.previous_candidates = previous; self.args.output = self.root / "rejected"
            self.reject("Previous")

    def test_page_redirect_rejected_atomically(self):
        self.proof.update(status=302, final_url="https://www.pinnacleblooms.org/")
        self.reject("direct-200")

    def test_body_canonical_and_noimageindex_are_independently_checked(self):
        good = self.body
        self.body = self.body.replace('href="https://materials.pinnacleblooms.org/"', 'href="https://www.pinnacleblooms.org/"', 1)
        self.reject("canonical")
        self.body = good.replace("</head>", '<meta name="robots" content="noimageindex"></head>')
        self.reject("robots")

    def test_wrong_page_parent_is_not_a_catalogue_source(self):
        self.proof.update(page_url="https://materials.pinnacleblooms.org/related", final_url="https://materials.pinnacleblooms.org/related")
        self.reject("direct-200")

    def test_related_card_inside_root_is_held_without_leaking(self):
        self.body = self.body.replace("</main>", (FIXTURES / "related-card.html").read_text() + "</main>")
        report = self.run_export()
        self.assertEqual((report["catalogue_candidates"], report["held_records"]), (2, 1))
        self.assertEqual(self.read("held-relationships.jsonl")[0]["publication_disposition"], "held_unrecognized_or_related_renderer_scope")

    def test_changed_renderer_cannot_mass_withdraw(self):
        self.body = self.body.replace('class="pb-img"', 'class="new-image-class"')
        self.reject("renderer changed")

    def test_partial_image_field_change_cannot_withdraw_one_old_tile(self):
        self.body = self.body.replace('class="pb-img"', 'class="new-image-class"', 1)
        self.reject("image field changed")

    def test_failed_redirected_or_missing_heads_stay_held(self):
        self.heads[0].update(status=404, direct_image_delivery_verified=False)
        self.heads[1].update(status=301, location="https://other.example/image.jpg")
        report = self.run_export()
        self.assertEqual((report["catalogue_candidates"], report["held_records"]), (0, 2))
        self.assertEqual({r["publication_disposition"] for r in self.read("held-relationships.jsonl")}, {"held_image_delivery_failed", "held_head_redirect_or_invalid_method"})

    def test_raw_head_robots_override_true_producer_verdict(self):
        original = copy.deepcopy(self.heads)
        cases = [{"x_robots": "googlebot: noindex"}, {"x_robots": "none"}, {"x_robots": "NoImageIndex"}, {"headers": {"x-RoBoTs-TaG": "noimageindex"}}, {"response_headers": {"X-Robots-Tag": "NOINDEX"}}, {"X-Robots-Tag": "none"}]
        for number, raw in enumerate(cases):
            with self.subTest(raw=raw):
                self.heads = copy.deepcopy(original)
                self.heads[0].update(raw)
                self.assertTrue(self.heads[0]["direct_image_delivery_verified"])
                self.args.output = self.root / f"raw-robots-{number}"
                report = self.run_export()
                self.assertEqual((report["catalogue_candidates"], report["held_records"]), (1, 1))
                held = self.read("held-relationships.jsonl")[0]
                self.assertEqual(held["publication_disposition"], "held_image_header_restriction")
                self.assertFalse(held["candidate_import_qualified"])
                self.assertFalse(held["positive_current_public_use"])

    def test_wrong_host_image_and_missing_head_are_not_admitted(self):
        self.body = self.body.replace("/1.jpg", "/777.jpg").replace("https://www.pinnacleblooms.org/Assets/Materials/2.jpg", "https://other.example/2.jpg")
        report = self.run_export()
        self.assertEqual((report["catalogue_candidates"], report["held_records"]), (0, 2))

    def test_missing_permit_or_stale_evidence_stops_without_output(self):
        self.permit["scope"] = "some-other-scope"; self.reject("permit")
        self.permit["scope"] = "current_public_sitemap_references"; self.receipt["checked_at"] = "2026-10-01T16:00:00+00:00"
        self.reject("stale")

    def test_tampered_release_and_body_evidence_rejected(self):
        (self.args.approved_release / "pages.xml").write_text("tampered")
        self.reject("release content")
        self.make_release(); self.prepare(); self.args.html.write_text(self.body + "changed")
        with self.assertRaisesRegex(ValueError, "body hash"): adapter.export(self.args)
        self.assertFalse(self.args.output.exists())

    def test_per_parent_1000_union_limit_is_not_silently_truncated(self):
        tile = '<div class="pb-card"><img class="pb-img" src="https://www.pinnacleblooms.org/Assets/Materials/{n}.jpg"></div>'
        start = self.body.index('<div class="pb-card">'); end = self.body.index('</div></div></div></div></div></div></main>')
        self.body = self.body[:start] + "".join(tile.format(n=n) for n in range(1, 1001)) + self.body[end:]
        self.heads = [{**self.heads[0], "url": f"https://www.pinnacleblooms.org/Assets/Materials/{n}.jpg"} for n in range(1, 1001)]
        self.reject("1000-image limit")
        self.body = self.body.replace(tile.format(n=1000), "")
        self.heads = self.heads[:-1]
        self.assertEqual(self.run_export()["combined_exact_image_urls"], 1000)


if __name__ == "__main__": unittest.main()
