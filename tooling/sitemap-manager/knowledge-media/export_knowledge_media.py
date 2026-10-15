#!/usr/bin/env python3
"""Export maintained knowledge image metadata; never publish or change sources.

Python 3.10+, standard library only. --approved accepts the sitemap-manager
pages SQLite feed, or a release directory/manifest with hash-pinned page XML.
The output directory must not exist and must be outside the source repository.
"""
import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
import hashlib
from html.parser import HTMLParser
import ipaddress
import json
import os
from pathlib import Path
import re
import sqlite3
import sys
import tempfile
from urllib.parse import parse_qs, urljoin, urlsplit, urlunsplit
import xml.etree.ElementTree as ET

VERSION = "knowledge-media-metadata-v1"
ORIGIN = "https://www.pinnacleblooms.org"
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
LANGUAGES = {"english", "telugu", "hindi", "tamil", "kannada", "malayalam", "marathi"}
SUN_TYPES = {"conditions", "behaviours", "milestones", "skills", "abilities", "techniques", "materials", "assessments", "ability-assessments"}
LEGACY = {"c", "b", "m", "t", "ma", "a", "abs", "abilities", "skills"}
PATHS = {
    "faq_index": "ask-public/knowledge-data/faq-index.json",
    "sun_index": "ask-public/knowledge-data/sunshine-index.json",
    "sun_recovered": "src/data/sunshine-recovered.json",
    "guru_data": "deployment/guru-recovery-20261009/data/articles.json",
    "faq_renderer": "ask-runtime/pages/faq/[...path].astro",
    "sun_renderer": "src/components/knowledge/SunshineTopic.astro",
    "sun_route": "ask-runtime/pages/sunshine/[...path].astro",
    "sun_merge": "src/lib/knowledge/recovery.mjs",
    "layout": "src/layouts/KnowledgeLayout.astro",
    "gate": "src/components/ask/AskGate.astro",
    "guru_renderer": "deployment/guru-recovery.mjs",
    "shell": "deployment/mirracles-library-20261008/data/shell.json",
}


def encoded(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha(data):
    return hashlib.sha256(data).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def pairs(items):
    result = {}
    for key, value in items:
        require(key not in result, "Duplicate JSON key: " + key)
        result[key] = value
    return result


def loads(data):
    return json.loads(data, object_pairs_hook=pairs)


def public_url(raw, base=None):
    """Resolve browser URL syntax, without decoding JSON field entity text."""
    require(isinstance(raw, str) and raw and not re.search(r"[\x00-\x20\x7f\\]", raw), "Empty/unsafe URL")
    u = urlsplit(urljoin(base, raw) if base else raw)
    require(u.scheme == "https" and u.hostname and not u.username and not u.password, "HTTPS public URL required")
    require(u.port in (None, 443), "Nonstandard HTTPS port")
    host = u.hostname.lower()
    require(host not in {"localhost", "localhost.localdomain"} and not host.endswith((".localhost", ".local", ".internal")), "Local host")
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        require("." in host, "Public DNS host required")
    else:
        require(address.is_global, "Nonpublic IP address")
    return urlunsplit((u.scheme, u.netloc, u.path or "/", u.query, ""))


def canonical(path):
    require(isinstance(path, str) and path.startswith("/") and not path.startswith("//"), "Invalid source canonical path")
    result = public_url(path, ORIGIN)
    require(urlsplit(result).netloc == "www.pinnacleblooms.org" and not urlsplit(result).query, "Unexpected source canonical")
    require("#" not in path, "Source canonical has fragment")
    return result


def family(url):
    u = urlsplit(url)
    if u.hostname not in {"www.pinnacleblooms.org", "pinnacleblooms.org"}:
        return None
    first = u.path.strip("/").split("/")[0]
    if first in {"faq", "guru"}:
        return first
    return "sunshine" if first == "sunshine" or first in LEGACY else None


class ImageTags(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.images = []

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            self.images.append(dict(attrs).get("src"))


class Sources:
    def __init__(self, root):
        self.root, self.entries, self.cache = root, {}, {}

    def raw(self, relative):
        if relative not in self.cache:
            p = (self.root / relative).resolve()
            require(p.is_relative_to(self.root), "Source path escapes root")
            data = p.read_bytes()
            self.cache[relative] = data
            self.entries[relative] = {"path": relative, "sha256": sha(data), "bytes": len(data)}
        return self.cache[relative]

    def json(self, relative):
        return loads(self.raw(relative))

    def evidence(self, relative, selector):
        self.raw(relative)
        return {**self.entries[relative], "selector": selector}

    def contract(self, key, tokens):
        content = self.raw(PATHS[key]).decode("utf-8")
        for token in tokens:
            require(token in content, "Renderer contract changed; review before export: " + PATHS[key] + " / " + token)
        return content

    def verify_unchanged(self):
        for relative, entry in self.entries.items():
            require(sha((self.root / relative).read_bytes()) == entry["sha256"], "Source changed during export: " + relative)


def approved_input(path):
    """Read an internally consistent SQLite backup, or hash-verified release."""
    path = path.resolve()
    approved = {}
    if path.suffix.lower() in {".db", ".sqlite", ".sqlite3"}:
        source = sqlite3.connect(path.as_uri() + "?mode=ro", uri=True)
        snapshot = sqlite3.connect(":memory:")
        try:
            source.backup(snapshot)
            snapshot.row_factory = sqlite3.Row
            rows = snapshot.execute("SELECT url,canonical_url,decision,module_type,metadata_json FROM pages ORDER BY url").fetchall()
        finally:
            source.close()
            snapshot.close()
        controls = Counter()
        selected = []
        for r in rows:
            controls[r["decision"]] += 1
            if r["decision"] != "INCLUDE":
                continue
            url = public_url(r["url"])
            require(url == r["url"] and r["canonical_url"] == url, "Included feed row is not exact canonical: " + r["url"])
            require(url not in approved, "Duplicate approved parent")
            metadata = loads(r["metadata_json"])
            evidence = {"decision": r["decision"], "canonical_url": r["canonical_url"], "module_type": r["module_type"], "eligibility": metadata.get("eligibility"), "curation": metadata.get("curation", {}), "public_source_policy": metadata.get("public_source_policy"), "publication_policy": metadata.get("publication_policy")}
            approved[url] = evidence
            selected.append([url, evidence])
        provenance = {"kind": "sitemap_manager_pages_sqlite_backup", "path": str(path), "selection": "decision=INCLUDE AND canonical_url=url", "decision_counts": dict(controls), "snapshot_method": "sqlite3.backup to memory, includes committed WAL", "logical_approved_rows_sha256": sha(encoded(selected).encode())}
    else:
        manifest = path / "manifest.json" if path.is_dir() else path
        root = manifest.parent.resolve()
        raw = manifest.read_bytes()
        data = loads(raw)
        require(isinstance(data.get("files"), list) and data.get("release_id"), "Expected sitemap-manager release manifest")
        verified = []
        for item in data["files"]:
            if item.get("kind") != "pages":
                continue
            p = (root / item["path"]).resolve()
            require(p.is_relative_to(root), "Release file escapes root")
            content = p.read_bytes()
            require(sha(content) == item["sha256"], "Release page hash mismatch: " + item["path"])
            require(len(content) == item["bytes"], "Release byte count mismatch")
            tree = ET.fromstring(content)
            require(tree.tag == NS + "urlset", "Unexpected page XML root")
            urls = [el.findtext(NS + "loc") for el in tree.findall(NS + "url")]
            require(len(urls) == item["entries"], "Release page entry mismatch")
            for url in urls:
                require(url and public_url(url) == url and url not in approved, "Invalid/duplicate approved release URL")
                approved[url] = {"decision": "INCLUDE", "canonical_url": url, "eligibility": {"basis": "supplied_approved_release_page_membership", "release_id": data["release_id"], "manifest_file": item["path"], "manifest_sha256": sha(raw)}}
            verified.append({"path": item["path"], "sha256": sha(content), "entries": len(urls)})
        require(len(approved) == data.get("page_urls"), "Release total page count mismatch")
        provenance = {"kind": "hash_verified_release_pages", "path": str(manifest), "manifest_sha256": sha(raw), "release_id": data["release_id"], "created_at": data.get("created_at"), "verified_page_files": verified}
    require(approved, "Approved parent set is empty")
    provenance["parent_set_sha256"] = sha(("\n".join(sorted(approved)) + "\n").encode())
    provenance["parent_count"] = len(approved)
    return approved, provenance


def export(source_root, approved_path, output):
    source_root, output = Path(source_root).resolve(), Path(output).resolve()
    require(not output.exists(), "Output already exists; use a new run directory")
    repo = source_root if (source_root / "speech-site").is_dir() else source_root.parent
    root = source_root / "speech-site" if (source_root / "speech-site").is_dir() else source_root
    require((root / PATHS["faq_index"]).is_file(), "--source-root must be repo or speech-site root")
    require(not output.is_relative_to(repo), "Output must be outside canonical source repo")
    require(not Path(approved_path).resolve().is_relative_to(output), "Approved input overlaps output")
    approved, input_receipt = approved_input(Path(approved_path))
    sources = Sources(root)
    sources.contract("faq_renderer", ["'faq-'+route.item.language+'-'+route.item.id", "src={answer.image}", "set:html={answer.html}", "reader={!missing&&!error}"])
    sources.contract("sun_merge", ["const replacements=new Map(recovered.map(x=>[x.id,x]))", "replacements.get(x.id)||x"])
    sources.contract("sun_renderer", ["src={topic.image}"])
    sources.contract("sun_route", ["topic=sunshineTopic(path)", "reader={!missing&&!error}"])
    sources.contract("layout", ["isAccessibleForFree:false", "cssSelector:'.ask-registration-content'", "sourceImage||'https://pinnacleblooms.org/ask/og/default.png'"])
    sources.contract("gate", ["Sign in to keep reading."])
    guru_code = sources.contract("guru_renderer", ["const images=record.images||[]", "${record.body}", "data.records[match[1]]", "record.canonicalPath"])
    shell = sources.json(PATHS["shell"])
    shell_images = {"https://pinnacleblooms.org/ask/og/default.png", "https://www.pinnacleblooms.org/ask/og/default.png"}
    for value in shell.values():
        if isinstance(value, str):
            parser = ImageTags(); parser.feed(value)
            for raw in parser.images:
                try:
                    shell_images.add(public_url(raw, ORIGIN))
                except (ValueError, TypeError):
                    pass
    candidates, records, record_keys, by_parent = [], [], set(), {}

    def add_record(fam, record_id, parent, language, source_path, selector, renderer, access, mode, selected, **extra):
        rec = {"family": fam, "record_id": str(record_id), "canonical_parent": parent, "language": language, "source": sources.evidence(source_path, selector), "renderer": renderer, "access_class": access, "source_mode": mode, **extra}
        rec["record_key"] = sha(encoded([fam, str(record_id), language, parent]).encode())
        require(rec["record_key"] not in record_keys, "Conflicting duplicate source record")
        record_keys.add(rec["record_key"])
        records.append(rec)
        by_parent.setdefault(parent, []).append(rec)
        for ordinal, (role, raw, rendered) in enumerate(selected):
            item = {**rec, "role": role, "selected_use_ordinals": [ordinal], "source_use_count": 1, "raw_image_url": raw, "actual_rendered_use": rendered, "use_evidence": "maintained_renderer_contract; no live fetch", "approved_parent": parent in approved, "approved_parent_eligibility": approved.get(parent), "public_source_policy": {"basis": mode, "maintained_source_projection": True, "approval_effect": "export_does_not_change_existing_owner_policy"}, "owner_media_publication_decision": "not_evaluated_by_export"}
            try:
                image = public_url(raw, parent)
                name = urlsplit(image).path.rsplit("/", 1)[-1].lower()
                require(image not in shell_images and not re.search(r"(?:^|[-_.])(?:logo|favicon|lockup)(?:[-_.]|$)", name), "Common shell/fallback/logo image")
                item["image_url"] = image
                item["disposition"] = "source_backed_approved_parent_requires_owner_decision" if rendered and parent in approved else "unapproved_source_parent" if parent not in approved else "metadata_only_requires_detail_renderer_proof"
            except (ValueError, TypeError) as exc:
                item["image_url"] = None
                item["disposition"] = "rejected_image"
                item["reason"] = str(exc)
            item["relationship_key"] = sha(encoded([parent, item["image_url"] or raw, role, rec["record_key"]]).encode())
            candidates.append(item)

    faq = sources.json(PATHS["faq_index"])
    require(isinstance(faq, list), "FAQ index must be a list")
    categories = {(r["language"], r["category"]) for r in faq}
    detail_paths = []
    for item in faq:
        ident, lang = str(item["id"]), item["language"]
        require(re.fullmatch(r"\d+", ident) and lang in LANGUAGES, "Unsafe FAQ detail identity")
        detail_paths.append("ask-public/knowledge-data/faq-" + lang + "-" + ident + ".json")
    require(len(set(detail_paths)) == len(detail_paths), "Duplicate FAQ detail identity")
    if len(detail_paths) >= 100:
        print(encoded({"stage": "read_local_faq_details", "files": len(detail_paths), "workers": 8}), file=sys.stderr, flush=True)
    # Only local file reads run concurrently. All selection and output ordering
    # stay sequential; no application, browser or network operation is invoked.
    with ThreadPoolExecutor(max_workers=8) as executor:
        for count, _ in enumerate(executor.map(sources.raw, detail_paths), 1):
            if len(detail_paths) >= 100 and count % 500 == 0:
                print(encoded({"stage": "read_local_faq_details", "completed": count}), file=sys.stderr, flush=True)
    for item in faq:
        ident, lang = str(item["id"]), item["language"]
        require(re.fullmatch(r"\d+", ident) and lang in LANGUAGES, "Unsafe FAQ detail identity")
        detail_path = "ask-public/knowledge-data/faq-" + lang + "-" + ident + ".json"
        detail = sources.json(detail_path)
        require(all(detail.get(k) == item.get(k) for k in ("id", "language", "url", "image")), "FAQ detail/index identity or image mismatch: " + detail_path)
        parser = ImageTags(); parser.feed(detail.get("html", ""))
        require(not parser.images, "FAQ inline image contract changed; review exporter")
        selected = [("hero", detail["image"], True)] if detail.get("image") else []
        add_record("faq", ident, canonical(detail["url"]), detail.get("lang", lang), detail_path, "image", PATHS["faq_renderer"] + ":47", "reader_registration_required", "maintained_faq_answer_catalogue", selected, published_source_date=detail.get("published"), video_hyperlink_present=bool(detail.get("video")))
    sunshine = sources.json(PATHS["sun_index"])
    recovered = sources.json(PATHS["sun_recovered"])
    require(isinstance(sunshine, list) and isinstance(recovered, list), "Sunshine sources must be lists")
    require(all(type(r.get("id")) is int and r["id"] > 0 for r in sunshine + recovered), "Sunshine identities must retain integer types for exact JavaScript Map matching")
    replacements = {str(x["id"]): x for x in recovered}
    require(len(replacements) == len(recovered), "Duplicate Sunshine recovered identity")
    seen = set()
    merged = []
    for item in sunshine:
        ident = str(item["id"])
        require(ident not in seen, "Duplicate Sunshine source identity")
        seen.add(ident); merged.append((replacements.get(ident, item), ident in replacements))
    merged.extend((item, True) for ident, item in replacements.items() if ident not in seen)
    for item, restored in merged:
        parent = canonical(item["url"])
        if restored:
            require(item["url"].startswith("/sunshine/topic/"), "Unknown recovered Sunshine route")
        selected = [("topic_hero" if restored else "legacy_detail_image_metadata", item["image"], restored)] if item.get("image") else []
        add_record("sunshine", item["id"], parent, "en", PATHS["sun_recovered"] if restored else PATHS["sun_index"], "id=" + str(item["id"]) + ".image", PATHS["sun_renderer"] + ":16" if restored else "legacy_detail_owner_not_this_collection_renderer", "reader_registration_required" if restored else "legacy_detail_access_unverified", "maintained_recovered_sunshine_topic" if restored else "archive_link_selected_sunshine_metadata_only", selected, legacy_path=item.get("legacyPath"), reviewed_source_date=item.get("reviewed"), source_record=item.get("sourceRecord"), sunshine_type=item.get("type"))
    guru = sources.json(PATHS["guru_data"])
    require(guru.get("version") == "guru-public-recovery-20261009" and isinstance(guru.get("records"), dict), "Unexpected Guru public corpus")
    for ident, item in guru["records"].items():
        require(str(item["id"]) == ident and re.fullmatch(r"\d+", ident), "Guru record key mismatch")
        parent = canonical(item["canonicalPath"])
        require(item["canonicalPath"] in item["paths"], "Guru canonical absent from recorded paths")
        require(isinstance(item.get("images"), list) and isinstance(item.get("bodyMedia"), list), "Guru image projection missing")
        parser = ImageTags(); parser.feed(item["body"])
        require(parser.images == item["bodyMedia"], "Guru bodyMedia/rendered img mismatch: " + ident)
        selected = [("gallery", image["src"], True) for image in item["images"]]
        selected += [("body", image, True) for image in item["bodyMedia"]]
        add_record("guru", ident, parent, item.get("language", "en"), PATHS["guru_data"], "records." + ident, PATHS["guru_renderer"] + ":24-34", "public_passive_article_no_reader_gate", "maintained_published_guru_recovery_corpus", selected, published_source_date=item.get("published"), publisher_source=item.get("source"), publisher_media_source=item.get("mediaSource"), source_text_sha256=item.get("sourceTextSha256"), video_hyperlink_present=bool(item.get("video")))
    old = re.search(r"const existingArticles=(\[.*?\]);", guru_code)
    require(old, "Guru existing-owner allowlist missing")
    external_guru = {canonical(r["canonicalPath"]) for r in loads(old.group(1))}
    candidate_by_record = {}
    for row in candidates:
        candidate_by_record.setdefault(row["record_key"], []).append(row)

    def collection(url, fam):
        u = urlsplit(url)
        if u.hostname != "www.pinnacleblooms.org":
            return False
        query = parse_qs(u.query, keep_blank_values=True)
        if set(query) - {"page"} or ("page" in query and (len(query["page"]) != 1 or not re.fullmatch(r"[1-9]\d*", query["page"][0]))):
            return False
        path = u.path.rstrip("/")
        parts = path.strip("/").split("/")
        if fam == "faq":
            return path == "/faq" or (len(parts) == 2 and parts[1] in LANGUAGES) or (len(parts) == 3 and (parts[1], parts[2]) in categories)
        if fam == "sunshine":
            return path == "/sunshine" or (len(parts) == 2 and parts[0] == "sunshine" and parts[1] in SUN_TYPES)
        return fam == "guru" and path == "/guru"

    accounting = []
    for parent in sorted(set(by_parent) | {url for url in approved if family(url)}):
        source_records = by_parent.get(parent, [])
        fam = source_records[0]["family"] if source_records else family(parent)
        rows = [row for r in source_records for row in candidate_by_record.get(r["record_key"], [])]
        rendered = [r for r in rows if r["actual_rendered_use"] and r["image_url"]]
        metadata = [r for r in rows if not r["actual_rendered_use"] and r["image_url"]]
        if parent not in approved:
            disposition = "source_parent_not_in_approved_canonical_set"
        elif rendered:
            disposition = "rendered_source_image_associations_require_owner_decision"
        elif metadata:
            disposition = "legacy_sunshine_metadata_only_detail_renderer_proof_required"
        elif rows:
            disposition = "all_selected_images_rejected"
        elif source_records and source_records[0]["source_mode"] == "archive_link_selected_sunshine_metadata_only":
            disposition = "legacy_sunshine_no_image_metadata_actual_detail_use_unknown"
        elif source_records:
            disposition = "matched_renderer_record_without_content_image"
        elif collection(parent, fam):
            disposition = "text_link_collection_no_record_content_image_rendered"
        elif parent in external_guru:
            disposition = "existing_original_guru_owner_media_outside_recovery_dataset"
        else:
            disposition = "approved_parent_unmatched_in_maintained_source_unknown_media"
        access = sorted({r["access_class"] for r in source_records})
        if not access:
            access = ["reader_registration_required" if collection(parent, fam) and fam in {"faq", "sunshine"} else "public_passive_article_no_reader_gate" if collection(parent, fam) else "unverified_existing_detail_owner"]
        accounting.append({"family": fam, "canonical_parent": parent, "approved_parent": parent in approved, "approved_parent_eligibility": approved.get(parent), "disposition": disposition, "source_record_keys": [r["record_key"] for r in source_records], "sources": [r["source"] for r in source_records], "access_classes": access, "rendered_image_uses": len(rendered), "metadata_only_image_candidates": len(metadata), "rejected_image_candidates": sum(r["image_url"] is None for r in rows)})
    # Aggregate duplicate parent+URL+role+record selections while retaining their
    # use counts and ordinals; never collapse images across different parents.
    unique = {}
    for row in candidates:
        if row["relationship_key"] in unique:
            prior = unique[row["relationship_key"]]
            prior["source_use_count"] += 1
            prior["selected_use_ordinals"].extend(row["selected_use_ordinals"])
        else:
            unique[row["relationship_key"]] = row
    candidates = sorted(unique.values(), key=lambda x: (x["family"], x["canonical_parent"], x["relationship_key"]))
    ready = [r for r in candidates if r["disposition"] == "source_backed_approved_parent_requires_owner_decision"]
    scoped = [a for a in accounting if a["approved_parent"]]
    require(len(scoped) == sum(bool(family(u)) for u in approved), "Approved scope accounting mismatch")
    require(all(r["approved_parent"] and r["actual_rendered_use"] and r["image_url"] for r in ready), "Relationship acceptance mismatch")
    sources.verify_unchanged()
    report = {"version": VERSION, "status": "analysis_export_only_not_publication_approval", "approved_input": input_receipt, "approved_parents_total": len(approved), "approved_parents_in_scope": len(scoped), "approved_parents_outside_scope": len(approved) - len(scoped), "candidate_associations": len(candidates), "source_backed_approved_parent_relationships": len(ready), "families": {}}
    for fam in ("faq", "sunshine", "guru"):
        parents = [a for a in scoped if a["family"] == fam]
        rs = [r for r in ready if r["family"] == fam]
        cs = [r for r in candidates if r["family"] == fam]
        report["families"][fam] = {"approved_parents": len(parents), "approved_parents_with_rendered_images": sum(a["rendered_image_uses"] > 0 for a in parents), "parent_dispositions": dict(sorted(Counter(a["disposition"] for a in parents).items())), "source_backed_relationships": len(rs), "rendered_image_uses_in_relationships": sum(r["source_use_count"] for r in rs), "distinct_parent_image_pairs": len({(r["canonical_parent"], r["image_url"]) for r in rs}), "distinct_image_urls_in_relationships": len({r["image_url"] for r in rs}), "candidate_dispositions": dict(sorted(Counter(r["disposition"] for r in cs).items())), "access_classes_in_relationships": dict(sorted(Counter(r["access_class"] for r in rs).items())), "source_parents_not_approved": sum(a["family"] == fam and not a["approved_parent"] for a in accounting)}
    report["acceptance"] = {"all_scoped_approved_parents_accounted": True, "all_relationships_have_exact_approved_parent": True, "all_relationships_have_renderer_selected_image": True, "source_files_unchanged_during_export": True, "plain_video_links_exported_as_players": 0, "public_media_publication_approval_granted": False, "registration_is_not_interpreted_as_noindex_or_private": True}
    report["notes"] = ["actual_rendered_use means the maintained template directly renders this field, not a fresh public fetch", "Registration classification is separate from retained approved-parent eligibility", "Legacy Sunshine metadata is not attached to collection pages and requires detail-owner proof", "Page/source dates are provenance only, never invented sitemap lastmod", "Unmatched parents and no-image metadata do not prove absence of eligible public media", "This export performs no network, production, DDL, authentication or submission action"]
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".knowledge-export-", dir=output.parent) as temp:
        staging = Path(temp) / "result"; staging.mkdir()
        for name, rows in [("association-candidates.jsonl", candidates), ("source-backed-relationships.jsonl", ready), ("parent-accounting.jsonl", accounting)]:
            (staging / name).write_text("".join(encoded(r) + "\n" for r in rows), encoding="utf-8")
        (staging / "source-inputs.json").write_text(json.dumps({"source_root": str(root), "files": sorted(sources.entries.values(), key=lambda x: x["path"]), "exporter_sha256": sha(Path(__file__).read_bytes())}, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        report["output_files"] = {p.name: {"sha256": sha(p.read_bytes()), "bytes": p.stat().st_size} for p in sorted(staging.iterdir())}
        (staging / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        require(not output.exists(), "Output appeared during export")
        os.rename(staging, output)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, required=True)
    parser.add_argument("--approved", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True, help="New directory outside source repo")
    args = parser.parse_args()
    try:
        report = export(args.source_root, args.approved, args.output)
    except (ValueError, OSError, sqlite3.Error, ET.ParseError, KeyError, TypeError) as exc:
        parser.exit(1, "Export failed without publishing: " + str(exc) + "\n")
    print(encoded({"output": str(args.output.resolve()), "approved_parents": report["approved_parents_in_scope"], "relationships": report["source_backed_approved_parent_relationships"], "families": report["families"]}))


if __name__ == "__main__":
    main()
