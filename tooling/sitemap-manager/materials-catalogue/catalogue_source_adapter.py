#!/usr/bin/env python3
"""Offline, source-scoped catalogue image candidates from owner-captured proof."""
import argparse
from datetime import datetime, timezone
import gzip
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from urllib.parse import urljoin
from xml.etree import ElementTree as ET

PARENT = "https://materials.pinnacleblooms.org/"
IMAGE = re.compile(r"https://www\.pinnacleblooms\.org/Assets/Materials/[0-9]+\.jpg\Z")
SOURCE = "materials_catalogue_pb_card_v1"
TRACKS = {"pbTrack", *{"pbTrack" + suffix for suffix in "SR CL FM DL GM SS TA TE OM SL ER SA CO VS PC BS SD TT ON".split()}}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
INS = "{http://www.google.com/schemas/sitemap-image/1.1}"
MAX_BODY = 4 * 1024 * 1024


def packed(value): return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
def digest(data): return hashlib.sha256(data).hexdigest()
def require(condition, message):
    if not condition: raise ValueError(message)
def tokens(value): return set(re.findall(r"[a-z_]+", (value or "").lower()))
def raw_head_robots(head):
    """Check raw directives independently of a producer's delivery verdict."""
    values = [head.get("x_robots") or ""]
    values.extend(value for key, value in head.items() if key.lower() == "x-robots-tag")
    for name in ["headers", "response_headers"]:
        headers = head.get(name) or {}
        require(isinstance(headers, dict), "Raw HEAD headers must be an object")
        values.extend(value for key, value in headers.items() if key.lower() == "x-robots-tag")
    require(all(value is None or isinstance(value, str) for value in values), "Raw HEAD robots values must be text")
    return tokens(" ".join(value or "" for value in values))
def stamp(value):
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    require(result.tzinfo is not None, "Evidence timestamp requires timezone")
    return result.astimezone(timezone.utc)


class CatalogueHTML(HTMLParser):
    """Bounded port of the reviewed CardHTML parser with the observed root scope."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.cards, self.canonicals, self.robots = [], [], [], []
        self.anchor, self.root_count, self.html_closed = None, 0, False

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        classes = (attrs.get("class") or "").split()
        if attrs.get("id") == "pb-ho": self.root_count += 1
        if tag == "link" and "canonical" in (attrs.get("rel") or "").lower().split(): self.canonicals.append(urljoin(PARENT, attrs["href"]) if attrs.get("href") else "")
        if tag == "meta" and (attrs.get("name") or "").lower() in {"robots", "googlebot", "bingbot"}: self.robots.append(attrs.get("content") or "")
        card = self.stack[-1][1] if self.stack else None
        if tag == "div" and "pb-card" in classes:
            ancestors = [frame[0] for frame in self.stack]
            sequence = [set((ancestor.get("class") or "").split()) for ancestor in ancestors]
            required = ["document-content", "pb-wrap", "pb-track", "pb-cols", "pb-col"]
            index = 0
            for class_set in sequence:
                if index < len(required) and required[index] in class_set: index += 1
            excluded = any(ancestor["tag"] in {"header", "footer", "nav", "aside"} or any(word in (ancestor.get("class") or "").lower() for word in {"related", "recommend", "sidebar"}) for ancestor in ancestors)
            scope = index == len(required) and not excluded and any(ancestor.get("id") == "pb-ho" for ancestor in ancestors) and any(ancestor.get("id") in TRACKS and "pb-track" in (ancestor.get("class") or "").split() for ancestor in ancestors)
            card = {"card_ordinal": len(self.cards), "start_line": self.getpos()[0], "ancestors": ancestors[-12:], "images": [], "links": [], "renderer_scope_recognized": scope}
            self.cards.append(card)
        if card is not None and tag == "img":
            card["images"].append({"rendered_url": urljoin(PARENT, attrs.get("src") or ""), "source_url": urljoin(PARENT, attrs.get("src") or ""), "attribute": "src", "line": self.getpos()[0], "alt": attrs.get("alt"), "class": attrs.get("class"), "width": attrs.get("width"), "height": attrs.get("height"), "is_pb_image": "pb-img" in classes})
        if card is not None and tag == "a" and attrs.get("href"):
            self.anchor = {"href": attrs["href"], "normalized_target": urljoin(PARENT, attrs["href"]), "class": attrs.get("class"), "text": ""}
            card["links"].append(self.anchor)
        if tag not in VOID: self.stack.append(({"tag": tag, **{key: value for key, value in attrs.items() if key in {"class", "id", "role", "href", "hidden", "aria-hidden"}}}, card))

    def handle_data(self, value):
        if self.anchor is not None: self.anchor["text"] += value

    def handle_endtag(self, tag):
        if tag == "html": self.html_closed = True
        if tag == "a": self.anchor = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0]["tag"] == tag:
                self.stack = self.stack[:index]
                break


def release_evidence(path):
    manifest_path = path / "manifest.json" if path.is_dir() else path
    root = manifest_path.resolve().parent
    raw = manifest_path.read_bytes(); data = json.loads(raw)
    require(data.get("release_id") and isinstance(data.get("files"), list), "Approved release manifest required; database inputs are unsupported")
    approved, retained, verified = False, set(), []
    for item in data["files"]:
        if item.get("kind") not in {"pages", "images"}: continue
        relative = Path(item["path"]); source = (root / relative).resolve()
        require(not relative.is_absolute() and source.is_relative_to(root), "Release file escapes root")
        content = source.read_bytes()
        require(digest(content) == item["sha256"] and len(content) == item["bytes"], "Approved release content hash/size mismatch")
        tree = ET.fromstring(content)
        require(tree.tag == NS + "urlset" and len(tree.findall(NS + "url")) == item["entries"], "Approved release XML/count mismatch")
        for entry in tree.findall(NS + "url"):
            if entry.findtext(NS + "loc") != PARENT: continue
            if item["kind"] == "pages": approved = True
            else: retained.update(image.findtext(INS + "loc") for image in entry.findall(INS + "image"))
        verified.append({"path": item["path"], "sha256": digest(content)})
    require(approved and None not in retained, "Exact catalogue parent missing from approved release")
    evidence = {"decision": "INCLUDE", "canonical_url": PARENT, "eligibility": {"basis": "supplied_approved_release_page_membership", "release_id": data["release_id"], "manifest_sha256": digest(raw)}, "public_source_policy": None, "publication_policy": None}
    return evidence, retained, {"path": str(manifest_path.resolve()), "sha256": digest(raw), "release_id": data["release_id"], "verified_files": verified}


def export(args):
    output = Path(args.output).resolve()
    require(not output.exists() and not Path(args.output).is_symlink(), "Output must be a new directory")
    inputs = [Path(getattr(args, field)).resolve() for field in ["html", "page_proof", "heads", "heads_receipt", "permit"]]
    if args.previous_candidates: inputs.append(Path(args.previous_candidates).resolve())
    require(all(not path.is_relative_to(output) for path in inputs), "Input/output paths overlap")
    manifest_path = Path(args.approved_release).resolve()
    require(not manifest_path.is_relative_to(output), "Release/output paths overlap")
    hashes = {str(path): digest(path.read_bytes()) for path in inputs}
    proof_bytes = Path(args.page_proof).read_bytes()
    if Path(args.page_proof).suffix == ".jsonl":
        selected = [json.loads(line) for line in proof_bytes.decode().splitlines() if line.strip()]
        selected = [row for row in selected if row.get("page_url") == PARENT]
        require(len(selected) == 1, "Exactly one catalogue proof required")
        proof = selected[0]
    else: proof = json.loads(proof_bytes)
    require(proof.get("page_url") == proof.get("final_url") == PARENT and proof.get("status") == 200 and proof.get("method") == "GET" and not proof.get("error"), "Exact direct-200 catalogue GET required")
    require(all(proof.get(key) is False for key in ["credentials_sent", "redirects_followed", "media_bodies_downloaded", "noindex", "noimageindex", "canonical_conflict"]), "Page access/redirect/indexing proof missing or restricted")
    headers = proof.get("response_headers", {})
    require((headers.get("Content-Type") or "").lower().startswith("text/html") and not headers.get("Location"), "Expected direct HTML response")
    html_path = Path(args.html)
    compressed = html_path.read_bytes()
    if html_path.suffix == ".gz":
        require(digest(compressed) == proof.get("body_gzip_sha256"), "HTML gzip hash mismatch")
        with gzip.open(html_path, "rb") as stream: body = stream.read(MAX_BODY + 1)
    else: body = compressed
    require(len(body) <= MAX_BODY and digest(body) == proof.get("body_sha256") and len(body) == proof.get("body_bytes"), "HTML body hash/size mismatch")
    parser = CatalogueHTML(); parser.feed(body.decode("utf-8", "strict")); parser.close()
    require(parser.canonicals == [PARENT] and proof.get("canonical_normalized") == [PARENT], "Explicit exact catalogue canonical required")
    require(not {"noindex", "none", "noimageindex"} & tokens(" ".join(parser.robots + [headers.get("X-Robots-Tag") or ""])), "Current HTML/header robots restrict images")
    require(parser.root_count >= 1 and parser.html_closed and any(card["renderer_scope_recognized"] and any(image["is_pb_image"] for image in card["images"]) for card in parser.cards), "Catalogue renderer changed/incomplete; retain prior source and stop")
    require(not any(card["renderer_scope_recognized"] and IMAGE.fullmatch(image["source_url"]) and not image["is_pb_image"] for card in parser.cards for image in card["images"]), "Catalogue image field changed; retain prior source and stop")
    permit_path = Path(args.permit); permit = json.loads(permit_path.read_bytes())
    require(permit.get("scope") == "current_public_sitemap_references" and permit.get("direct_user_request") and permit.get("reference_permission"), "Supplied current public-reference permit required")
    as_of = stamp(args.as_of) if args.as_of else datetime.now(timezone.utc)
    require(0 < args.max_age_hours <= 48, "Freshness bound must be 0..48 hours")
    receipt = json.loads(Path(args.heads_receipt).read_bytes())
    for observed in [proof.get("observed_at"), receipt.get("checked_at")]:
        age = (as_of - stamp(observed)).total_seconds()
        require(-300 <= age <= args.max_age_hours * 3600, "HTML/HEAD proof stale or future-dated")
    explicit_head_scope = all(receipt.get(key) is False for key in ["redirects_followed", "credentials_sent", "media_bodies_downloaded"])
    legacy_head_scope = receipt.get("scope") == "One exact candidate HEAD batch; no redirects, credentials or image bodies"
    require(explicit_head_scope or legacy_head_scope, "HEAD receipt must attest no redirects, credentials or image bodies")
    heads = {}
    for line in Path(args.heads).read_text().splitlines():
        row = json.loads(line)
        require(row["url"] not in heads, "Duplicate HEAD identity")
        heads[row["url"]] = row
    eligibility, retained, release = release_evidence(manifest_path)
    previous = {}
    if args.previous_candidates:
        for line in Path(args.previous_candidates).read_text().splitlines():
            row = json.loads(line); image = row["media_url"]
            require(row.get("page_url") == PARENT and IMAGE.fullmatch(image) and row.get("source_role") == "material_catalogue_listing_tile" and row.get("candidate_import_qualified") is True and row.get("managed_source_id", SOURCE) == SOURCE, "Previous record outside exact managed source; no withdrawal permitted")
            require(row.get("pair_key") == digest(packed([PARENT, image]).encode()), "Previous pair key mismatch; no withdrawal permitted")
            require(image not in previous, "Duplicate previous identity")
            previous[image] = row
    grouped, held = {}, []
    for card in parser.cards:
        for image in card["images"]:
            url = image["source_url"]
            reason = None
            if not card["renderer_scope_recognized"]: reason = "held_unrecognized_or_related_renderer_scope"
            elif not image["is_pb_image"]: reason = "held_changed_image_selection_field"
            elif not IMAGE.fullmatch(url): reason = "held_image_url_outside_numeric_jpg_contract"
            if reason:
                held.append({"page_url": PARENT, "media_url": url, "managed_source_id": SOURCE, "source_role": "unqualified_card", "publication_disposition": reason, "candidate_import_qualified": False, "source_line": image["line"]})
                continue
            grouped.setdefault(url, []).append((image, card))
    candidates = []
    for url, placements in sorted(grouped.items()):
        head = heads.get(url)
        reason = None
        if head is None: reason = "held_missing_exact_head"
        elif head.get("method") != "HEAD" or head.get("location") or head.get("final_url", url) != url or head.get("redirects_followed", False): reason = "held_head_redirect_or_invalid_method"
        elif head.get("status") != 200 or head.get("direct_image_delivery_verified") is not True or not (head.get("content_type") or "").lower().startswith("image/"): reason = "held_image_delivery_failed"
        elif {"noindex", "none", "noimageindex"} & raw_head_robots(head): reason = "held_image_header_restriction"
        unique_cards = list({card["card_ordinal"]: card for image, card in placements}.values())
        row = {"pair_key": digest(packed([PARENT, url]).encode()), "page_url": PARENT, "media_url": url, "selected_rendition_url": url, "media_kind": "image", "asset_source_system": "public_portal_asset", "asset_source_key": url, "managed_source_id": SOURCE, "source_role": "material_catalogue_listing_tile", "actual_rendered_use": "material_catalogue_listing_tile", "dom_scope": "document_content_material_carousel", "access_class": "public_anonymous_approved_parent", "primary_article_use_proven": False, "shared_shell": False, "r2_object_identity_verified": False, "image_body_downloaded": False, "nearest_ancestor_link_targets": [], "card_detail_targets": sorted({link["normalized_target"] for card in unique_cards for link in card["links"]}), "cards": unique_cards, "current_placements": [{"tag": "img", "attribute": "src", "media_url": url, "source_image_url": url, "normalized_rendered_url": url, "normalized_source_url": url, "source_line": image["line"], "alt": image["alt"], "rendered_width": image["width"], "rendered_height": image["height"], "nearest_link_target": None, "image_attributes": {"class": image["class"]}, "ancestors": card["ancestors"] + [{"tag": "div", "class": "pb-card"}]} for image, card in placements], "approved_parent_eligibility": eligibility, "publisher_policy_evidence": eligibility["public_source_policy"], "current_page_evidence": {key: proof[key] for key in ["page_url", "observed_at", "status", "final_url", "canonical_urls", "canonical_normalized", "canonical_basis", "robots", "noindex", "noimageindex", "body_sha256", "body_bytes"]}, "head_delivery_evidence": {"checked_at": receipt["checked_at"], **(head or {})}, "rights_status": "permission_recorded", "rights_evidence": {"scope": permit["scope"], "reference_permission": permit["reference_permission"], "authorization_file_sha256": digest(permit_path.read_bytes()), "scope_relevance_decision_separate": True}, "recorded_approved_aliases": [], "alias_resolution": "not_inferred_owner_pipeline_exact_registry_join_required", "source_evidence": {"html_file": str(html_path.resolve()), "html_file_sha256": digest(compressed), "parser_contract": SOURCE}, "positive_current_public_use": reason is None, "candidate_import_qualified": reason is None, "publication_disposition": reason or "catalogue_use_qualified_candidate", "publication_action": "none_analysis_candidate_only"}
        (held if reason else candidates).append(row)
    new_urls = {row["media_url"] for row in candidates}
    # A release has no per-source ownership ledger. Keep its complete set when
    # checking the cap so a URL shared with another source is never subtracted.
    retained_baseline = retained
    require(len(retained_baseline | new_urls) <= 1000, "Per-parent 1000-image limit exceeded; no output or truncation")
    held_by_url = {row["media_url"]: row for row in held}
    withdrawn = [{"page_url": PARENT, "media_url": url, "managed_source_id": SOURCE, "pair_key": previous[url]["pair_key"], "publication_disposition": "proposed_source_withdrawal", "withdrawal_reason": held_by_url.get(url, {}).get("publication_disposition", "absent_from_complete_current_catalogue"), "withdrawal_scope": "this_managed_source_only", "publication_action": "none_analysis_candidate_only"} for url in sorted(set(previous) - new_urls)]
    # Fail closed before touching output if any supplied proof changed mid-read.
    require(all(digest(Path(path).read_bytes()) == value for path, value in hashes.items()), "Input changed while reading")
    require(digest(Path(release["path"]).read_bytes()) == release["sha256"], "Approved release manifest changed")
    output.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix=".catalogue-adapter-", dir=output.parent))
    try:
        for name, records in [("catalogue-use-qualified-candidates.jsonl", candidates), ("held-relationships.jsonl", held), ("proposed-source-withdrawals.jsonl", withdrawn)]:
            (stage / name).write_text("".join(packed(row) + "\n" for row in sorted(records, key=lambda row: row["media_url"])), encoding="utf-8")
        report = {"status": "offline_source_candidates_complete_no_publication", "managed_source_id": SOURCE, "parent_url": PARENT, "as_of": as_of.isoformat(), "max_age_hours": args.max_age_hours, "catalogue_candidates": len(candidates), "held_records": len(held), "proposed_source_withdrawals": len(withdrawn), "previous_managed_candidates": len(previous), "approved_baseline_image_urls": len(retained_baseline), "combined_exact_image_urls": len(retained_baseline | new_urls), "limit_basis": "conservative union with complete approved baseline; no source ownership inferred", "source_catalogue_images": len(grouped), "inputs": hashes, "approved_release": release, "adapter_sha256": digest(Path(__file__).read_bytes()), "network_requests": 0, "database_writes": 0, "publication_actions": 0, "outputs": {path.name: {"sha256": digest(path.read_bytes()), "bytes": path.stat().st_size} for path in sorted(stage.iterdir())}}
        (stage / "report.json").write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
        os.rename(stage, output)
    except BaseException:
        shutil.rmtree(stage, ignore_errors=True)
        raise
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ["html", "page-proof", "heads", "heads-receipt", "permit", "approved-release", "output"]: parser.add_argument("--" + name, type=Path, required=True)
    parser.add_argument("--previous-candidates", type=Path)
    parser.add_argument("--as-of", help="Timezone-aware run time; defaults to current UTC")
    parser.add_argument("--max-age-hours", type=float, default=24)
    args = parser.parse_args()
    try:
        report = export(args)
    except (OSError, ValueError, KeyError, TypeError, ET.ParseError) as error:
        parser.exit(2, "Catalogue adapter rejected input: " + str(error) + "\n")
    print(packed({key: report[key] for key in ["status", "catalogue_candidates", "held_records", "proposed_source_withdrawals", "combined_exact_image_urls", "network_requests"]}))


if __name__ == "__main__": main()
