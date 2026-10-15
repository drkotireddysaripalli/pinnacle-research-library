#!/usr/bin/env python3
"""Independently reconcile a completed local knowledge export, without fetching."""
import argparse
from collections import Counter
import json
from pathlib import Path
import export_knowledge_media as exporter


def validate(data, approved_path, approved_release=None):
    data = Path(data)
    report = json.loads((data / "report.json").read_text(encoding="utf-8"))
    checks = []

    def check(test, name):
        exporter.require(test, "Verification failed: " + name)
        checks.append(name)

    for name, evidence in report["output_files"].items():
        raw = (data / name).read_bytes()
        check(len(raw) == evidence["bytes"] and exporter.sha(raw) == evidence["sha256"], "output_hash:" + name)
    approved, provenance = exporter.approved_input(Path(approved_path))
    check(provenance == report["approved_input"], "exact_approved_input_snapshot")
    check(report["approved_parents_total"] == len(approved), "approved_parent_total")
    if approved_release:
        _, release = exporter.approved_input(Path(approved_release))
        check(release["parent_set_sha256"] == provenance["parent_set_sha256"], "approved_feed_release_parent_set_agreement")
    inputs = json.loads((data / "source-inputs.json").read_text(encoding="utf-8"))
    source_files = {r["path"]: r for r in inputs["files"]}
    check(inputs["exporter_sha256"] == exporter.sha(Path(exporter.__file__).read_bytes()), "exporter_code_hash")

    def rows(name):
        return [json.loads(line) for line in (data / name).read_text(encoding="utf-8").splitlines()]

    candidates = rows("association-candidates.jsonl")
    ready = rows("source-backed-relationships.jsonl")
    parents = rows("parent-accounting.jsonl")
    check(len({r["canonical_parent"] for r in parents}) == len(parents), "one_accounting_row_per_parent")
    expected_scope = {u for u in approved if exporter.family(u)}
    scoped = [p for p in parents if p["approved_parent"]]
    check({p["canonical_parent"] for p in scoped} == expected_scope, "exact_scoped_approved_parent_coverage")
    check(len(scoped) == report["approved_parents_in_scope"], "scoped_parent_total")
    check(len(approved) - len(scoped) == report["approved_parents_outside_scope"], "outside_scope_total")
    check(len({r["relationship_key"] for r in candidates}) == len(candidates), "unique_candidate_relationship_keys")
    check(len(candidates) == report["candidate_associations"], "candidate_total")
    expected_ready = [r for r in candidates if r["disposition"] == "source_backed_approved_parent_requires_owner_decision"]
    check(ready == expected_ready, "ready_rows_are_exact_candidate_subset")
    check(len(ready) == report["source_backed_approved_parent_relationships"], "relationship_total")
    check(all(r["actual_rendered_use"] and r["image_url"] and r["canonical_parent"] in approved and r["approved_parent"] for r in ready), "ready_rows_require_exact_approved_rendered_image")
    check(all(p["approved_parent_eligibility"] == approved.get(p["canonical_parent"]) for p in parents), "parent_eligibility_preserved")
    check(all(r["approved_parent_eligibility"] == approved.get(r["canonical_parent"]) for r in candidates), "candidate_eligibility_and_owner_policies_preserved")
    check(all(r["source_use_count"] == len(r["selected_use_ordinals"]) >= 1 for r in candidates), "repeat_use_accounting")
    check(all(r["source"][k] == source_files[r["source"]["path"]][k] for r in candidates for k in ("path", "sha256", "bytes")), "candidate_source_hashes_present")
    check(all(r["renderer"].split(":")[0] in source_files for r in ready), "selected_renderer_hashes_present")
    for fam, summary in report["families"].items():
        fp = [p for p in scoped if p["family"] == fam]
        fr = [r for r in ready if r["family"] == fam]
        fc = [r for r in candidates if r["family"] == fam]
        check(len(fp) == summary["approved_parents"] and dict(Counter(p["disposition"] for p in fp)) == summary["parent_dispositions"], fam + ":parent_dispositions")
        check(sum(p["rendered_image_uses"] > 0 for p in fp) == summary["approved_parents_with_rendered_images"], fam + ":image_parent_count")
        check(len(fr) == summary["source_backed_relationships"], fam + ":relationships")
        uses = sum(r["source_use_count"] for r in fr)
        check(uses == summary["rendered_image_uses_in_relationships"] == sum(p["rendered_image_uses"] for p in fp), fam + ":rendered_uses")
        check(len({(r["canonical_parent"], r["image_url"]) for r in fr}) == summary["distinct_parent_image_pairs"], fam + ":parent_image_pairs")
        check(len({r["image_url"] for r in fr}) == summary["distinct_image_urls_in_relationships"], fam + ":distinct_images")
        check(dict(Counter(r["disposition"] for r in fc)) == summary["candidate_dispositions"], fam + ":candidate_dispositions")
    return {"status": "passed", "checks_passed": len(checks), "checks": checks, "approved_parent_set_sha256": provenance["parent_set_sha256"], "report_sha256": exporter.sha((data / "report.json").read_bytes()), "families": report["families"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--approved", type=Path, required=True)
    parser.add_argument("--approved-release", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    exporter.require(not args.output.exists(), "Verification output already exists")
    result = validate(args.data, args.approved, args.approved_release)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(exporter.encoded({"status": result["status"], "checks_passed": result["checks_passed"]}))


if __name__ == "__main__":
    main()
