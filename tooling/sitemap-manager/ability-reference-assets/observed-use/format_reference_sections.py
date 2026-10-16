#!/usr/bin/env python3
"""Format the pinned Ability reference packet into offline semantic HTML fragments."""
import argparse
import html
import json
import pathlib

import qualify_observed_ability_uses as ability


def escaped(value):
    return html.escape(str(value), quote=True)


def _fragment(document, plan, consent_sha256):
    section = document['section']
    if any(section.get(k) for k in ('child_response_fields', 'scoring_fields', 'form_actions')) or section.get('result_generation') is not False:
        raise ValueError('Reference-only section without responses, scoring or forms required')
    cta = section['brand_cta']
    if (cta['brand'], cta['phone'], cta['href'], cta['instances_per_parent']) != ('Pinnacle Blooms Network', '9100181181', 'tel:9100181181', 1):
        raise ValueError('Exact single reference-section brand/enquiry CTA required')
    attrs = {
        'id': ability.SECTION,
        'data-source': ability.SOURCE,
        'data-render-manifest-sha256': plan['manifest_sha256'],
        'data-reference-consent-sha256': consent_sha256,
        'data-observed-set-complete': 'true',
        'aria-labelledby': ability.SECTION + '-title',
    }
    lines = ['<section ' + ' '.join(k + '="' + escaped(v) + '"' for k, v in attrs.items()) + '>']
    lines += ['<h2 id="' + escaped(ability.SECTION + '-title') + '">' + escaped(section['heading']) + '</h2>', '<p>' + escaped(section['notice']) + '</p>']
    for item in section['reference_items']:
        lines += ['<article>', '<h3>Reference item ' + escaped(item['question_id']) + '</h3>', '<p>' + escaped(item['source_question']) + '</p>']
        if item['source_keyword']:
            lines.append('<p><strong>Source topic:</strong> ' + escaped(item['source_keyword']) + '</p>')
        examples = item['reference_examples']
        if examples:
            lines.append('<dl>')
            fields = set()
            for example in examples:
                field = example['source_field']
                if field not in ('E1', 'E2', 'E3') or field in fields:
                    raise ValueError('Only distinct source E1/E2/E3 reference examples allowed')
                fields.add(field)
                lines += ['<dt>' + escaped(field) + ' source example</dt>', '<dd>' + escaped(example['text']) + '</dd>']
            lines.append('</dl>')
        lines.append('<p>Source reference: question ' + escaped(item['question_id']) + '; assessment ' + escaped(item['assessment_id']) + '. ' + escaped(item['context_purpose']) + '</p>')
        for image in item['illustrations']:
            expected = plan['images'].get(image['asset_id'])
            if not expected or image['image_url'] != expected['image_url'] or image['proposed_dom_marker'] != expected['markers'] or image['purpose_alt_suggestion'] != expected['alt']:
                raise ValueError('Unknown or changed authorized image pair')
            markers = ' '.join(k + '="' + escaped(v) + '"' for k, v in image['proposed_dom_marker'].items())
            lines += ['<figure ' + markers + '>', '<img src="' + escaped(image['image_url']) + '" alt="' + escaped(image['purpose_alt_suggestion']) + '" loading="lazy" decoding="async">', '<figcaption>' + escaped(image['purpose_caption_suggestion']) + '</figcaption>', '</figure>']
        lines.append('</article>')
    lines += ['<p class="ability-reference-cta"><strong>' + escaped(cta['brand']) + '</strong> <a href="' + escaped(cta['href']) + '">' + escaped(cta['text']) + '</a></p>', '</section>']
    return ('\n'.join(lines) + '\n').encode('utf-8')


def format_packet(path, expected_consent=ability.CONSENT_SHA256, expected_index=ability.INDEX_SHA256):
    """Pure output: validate the accepted packet, return fragment bytes and deterministic index."""
    packet = ability.load_packet(path, expected_consent, expected_index)
    reader = ability.PacketReader(path)
    fragments = {}
    entries = []
    try:
        index_bytes = reader.read('parent-render-index.json')
        if ability.sha(index_bytes) != packet['index_sha256']:
            raise ValueError('Render index changed after validation')
        for entry in sorted(json.loads(index_bytes)['parents'], key=lambda r: r['parent_url']):
            parent = entry['parent_url']
            raw = reader.read(entry['manifest_path'])
            if ability.sha(raw) != packet['parents'][parent]['manifest_sha256'] or len(raw) != entry['bytes']:
                raise ValueError('Parent manifest changed after validation')
            document = json.loads(raw)
            fragment = _fragment(document, packet['parents'][parent], packet['consent_sha256'])
            name = 'parents/' + ability.sha(parent.encode('utf-8')) + '.html'
            fragments[name] = fragment
            entries.append({'parent_url': parent, 'fragment_path': name, 'sha256': ability.sha(fragment), 'bytes': len(fragment), 'reference_items': len(document['section']['reference_items']), 'image_relationships': len(packet['parents'][parent]['images']), 'render_manifest_sha256': entry['sha256']})
    finally:
        reader.close()
    index = {'schema_version': 1, 'source': ability.SOURCE, 'consent_sha256': packet['consent_sha256'], 'render_index_sha256': packet['index_sha256'], 'status': 'LOCAL_FRAGMENTS_PENDING_INTEGRATION_AND_LIVE_READBACK', 'parent_count': len(entries), 'image_relationships': sum(e['image_relationships'] for e in entries), 'reference_items': sum(e['reference_items'] for e in entries), 'parents': entries, 'network_requests': 0, 'database_writes': 0}
    return fragments, index


def write_output(packet_path, output, fragments, index):
    """Require a fresh destination outside the input; index is the final completeness marker."""
    source = pathlib.Path(packet_path).resolve()
    output = pathlib.Path(output).resolve()
    if output == source or source.is_dir() and output.is_relative_to(source):
        raise ValueError('Output overlaps input packet')
    if output.exists():
        raise ValueError('Fresh output directory required; no files overwritten')
    output.mkdir(parents=True, exist_ok=False)
    for name, body in fragments.items():
        destination = output.joinpath(*ability.safe_path(name).parts)
        destination.parent.mkdir(exist_ok=True)
        destination.write_bytes(body)
    (output / 'fragments-index.json').write_bytes(json.dumps(index, sort_keys=True, ensure_ascii=False, indent=2).encode('utf-8') + b'\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--packet', required=True, type=pathlib.Path)
    parser.add_argument('--out', required=True, type=pathlib.Path)
    parser.add_argument('--expected-consent-sha256', default=ability.CONSENT_SHA256)
    parser.add_argument('--expected-index-sha256', default=ability.INDEX_SHA256)
    args = parser.parse_args()
    fragments, index = format_packet(args.packet, args.expected_consent_sha256, args.expected_index_sha256)
    write_output(args.packet, args.out, fragments, index)
    print(json.dumps({k: index[k] for k in ('status', 'parent_count', 'reference_items', 'image_relationships')}, indent=2))


if __name__ == '__main__':
    main()
