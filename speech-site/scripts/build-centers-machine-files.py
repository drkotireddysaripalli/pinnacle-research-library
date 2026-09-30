from pathlib import Path
from collections import Counter
import json

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'src' / 'data' / 'centre-directory.json').read_text(encoding='utf-8'))
RELEASES = json.loads((ROOT / 'src' / 'data' / 'centre-page-releases.json').read_text(encoding='utf-8'))
PUBLIC = ROOT / 'public' / 'pinnacle-pages-data'
CANONICAL = 'https://www.pinnacleblooms.org/centers'
CHECKED = '2026-09-28'

stats = {
    'locations': len(DATA),
    'regions': len({item['region'] for item in DATA}),
    'profilePages': sum('/centers/' in item['profileUrl'] for item in DATA),
    'mapLinks': sum(bool(item.get('mapsUrl')) for item in DATA),
    'photoBackedListings': sum(bool(item.get('images')) for item in DATA),
    'emblemBackedListings': sum(bool(item.get('emblem')) for item in DATA),
    'enrolmentChoiceMatches': sum(bool(item.get('facilityId')) for item in DATA),
}
claims = [
    {
        'id': 'dated-directory-count',
        'statement': f"The public directory contains {stats['locations']} published location records across {stats['regions']} states or regions.",
        'source': 'https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7',
        'checkedOn': CHECKED,
        'scope': 'Count of location blocks reconciled into the dated directory.',
        'limits': 'A directory count does not establish current operation, ownership model, staffing, registration, opening hours or service availability.'
    },
    {
        'id': 'centre-profile-coverage',
        'statement': f"{stats['profilePages']} directory records link to a centre-specific Pinnacle profile; the remaining records use a dated Pinnacle contact reference.",
        'source': 'https://www.pinnacleblooms.org/verify/evidence/centre-entity-reference.html',
        'checkedOn': CHECKED,
        'scope': 'First-party destination coverage for the directory records.',
        'limits': 'A first-party profile is not independent endorsement and does not by itself establish the present service scope.'
    },
    {
        'id': 'map-link-coverage',
        'statement': f"All {stats['mapLinks']} listed locations have a sourced Google Maps destination in this directory.",
        'source': 'https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7',
        'checkedOn': CHECKED,
        'scope': 'Presence of an external map destination in the reconciled source.',
        'limits': 'Google controls external place information. Ratings, reviews, hours, routes and map availability can change and are not copied or guaranteed here.'
    },
    {
        'id': 'centre-photo-coverage',
        'statement': f"{stats['photoBackedListings']} listings contain at least one selected centre photograph and {stats['emblemBackedListings']} contain a supplied centre emblem.",
        'source': CANONICAL + '#centres',
        'checkedOn': CHECKED,
        'scope': 'Media attached to the dated directory from the owner-supplied centre media set.',
        'limits': 'A photograph helps identify a place; it does not establish current condition, service availability, quality or outcome.'
    },
    {
        'id': 'national-contact',
        'statement': '9100 181 181 (telephone +919100181181) is the Pinnacle / Bharath Healthcare national guidance and appointment-enquiry number used throughout the directory.',
        'source': 'https://www.pinnacleblooms.org/national-autism-helpline',
        'checkedOn': '2026-09-29',
        'scope': 'Pinnacle-operated national contact and continuity route.',
        'limits': 'It is not a distinct branch number, government service, emergency service or diagnostic line.'
    },
    {
        'id': 'enrolment-choice-coverage',
        'statement': f"{stats['enrolmentChoiceMatches']} directory records match a current centre choice in the enrolment journey; other listings route families to the national team.",
        'source': 'https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india',
        'checkedOn': CHECKED,
        'scope': 'Public centre-choice matching for the existing enrolment journey.',
        'limits': 'Choosing a centre is a preference, not an accepted enquiry, confirmed appointment, professional or service.'
    },
    {
        'id': 'software-scope',
        'statement': 'PinnacleAI GPT-OS v1.0.0 is listed as non-diagnostic Class B developmental-support software for children aged 0–12.',
        'source': 'https://www.pinnacleblooms.org/verify/evidence/records/md5.html',
        'checkedOn': '2026-09-29',
        'scope': 'Licensed software identity and functions recorded on the MD-5 evidence page.',
        'limits': 'The software licence does not diagnose a child, register every centre, establish branch service availability or guarantee an outcome.'
    }
]

evidence = {
    'title': 'Find a Pinnacle Centre — claims and sources',
    'canonical': CANONICAL,
    'operator': 'Bharath Healthcare Laboratories Private Limited',
    'brand': 'Pinnacle Blooms Network',
    'directoryCheckedOn': CHECKED,
    'pageReviewedOn': '2026-09-29',
    'statistics': stats,
    'claims': claims,
    'directory': 'https://www.pinnacleblooms.org/pinnacle-pages-data/centre-directory.json',
    'note': 'Publication and source mapping do not prove discovery, indexing, ranking, AI citation, a connected call, an accepted enquiry, a centre visit or an outcome.'
}
(PUBLIC / 'centers-evidence.json').write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

text_lines = [
    evidence['title'],
    f"Canonical: {CANONICAL}",
    f"Directory checked: {CHECKED}",
    f"Operator: {evidence['operator']}",
    f"Brand: {evidence['brand']}",
    '',
]
for index, claim in enumerate(claims, 1):
    text_lines.extend([
        f"{index}. {claim['statement']}",
        f"   Source: {claim['source']}",
        f"   Scope: {claim['scope']}",
        f"   Limit: {claim['limits']}",
        ''
    ])
text_lines.extend([f"Directory JSON: {evidence['directory']}", evidence['note']])
(PUBLIC / 'centers-evidence.txt').write_text('\n'.join(text_lines).rstrip() + '\n', encoding='utf-8')

region_counts = Counter(item['region'] for item in DATA)
md = [
    '# Find a Pinnacle Blooms centre',
    '',
    f"> Dated public reading surface for {CANONICAL}. It helps families find a published location and does not replace confirmation by the Pinnacle team.",
    '',
    '## Direct answer',
    '',
    f"The directory contains {stats['locations']} published Pinnacle location records across {stats['regions']} states or regions, checked {CHECKED}. Search by centre, city, state or postcode; open the sourced map destination; choose an enrolment preference where available; or call 9100 181 181. Confirm the centre, service, professional, appointment and current fee before travelling.",
    '',
    '## Published location counts',
    '',
]
for region, count in sorted(region_counts.items(), key=lambda item: (-item[1], item[0])):
    md.append(f'- {region}: {count}')
md.extend([
    '',
    '## What the directory establishes',
    '',
    '- Published centre name and sourced address.',
    '- External map destination where recorded.',
    '- Selected owner-supplied photographs where available.',
    '- Centre-profile or contact-source link.',
    '- National Pinnacle contact route: 9100 181 181 / +919100181181.',
    '',
    '## What still needs confirmation',
    '',
    '- Current operation, opening hours, service and professional availability.',
    '- Legal ownership or franchise structure, branch registration and accessibility details.',
    '- Appointment, fee, rating, review, direct branch number and individual outcome.',
    '',
    '## Important boundaries',
    '',
    '- The national number is Pinnacle / Bharath Healthcare operated. It is not a government, emergency or diagnostic service.',
    '- A centre preference is not a confirmed appointment or accepted enquiry.',
    '- External map ratings and reviews can change; this page does not copy or guarantee them.',
    '- PinnacleAI is non-diagnostic Class B developmental-support software. Its licence does not register every centre or guarantee an outcome.',
    '',
    '## Public files',
    '',
    '- [Open the visual directory](https://www.pinnacleblooms.org/centers)',
    '- [Download the dated centre directory (JSON)](https://www.pinnacleblooms.org/pinnacle-pages-data/centre-directory.json)',
    '- [Read the claims and source map](https://www.pinnacleblooms.org/pinnacle-pages-data/centers-evidence.txt)',
    '- [Download the structured source map](https://www.pinnacleblooms.org/pinnacle-pages-data/centers-evidence.json)',
    '- [Inspect centre identity references](https://www.pinnacleblooms.org/verify/evidence/centre-entity-reference.html)',
    '- [Start an enrolment conversation](https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india)',
    '',
    '## Operator and status',
    '',
    'Operator: Bharath Healthcare Laboratories Private Limited. Brand: Pinnacle Blooms Network. Publication does not prove discovery, indexing, ranking, AI citation, a connected call, an accepted enquiry, a centre visit or an outcome.'
])
(PUBLIC / 'centers-machine.md').write_text('\n'.join(md).rstrip() + '\n', encoding='utf-8')

profile_urls = sorted({item['profileUrl'] for item in DATA if '/centers/' in item['profileUrl']})
sitemap_urls = [CANONICAL, *profile_urls]
sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for item in sitemap_urls:
    modified = RELEASES.get(item, {}).get('modifiedOn')
    lastmod = f'<lastmod>{modified}</lastmod>' if modified else ''
    sitemap.append(f'  <url><loc>{item}</loc>{lastmod}</url>')
sitemap.append('</urlset>')
(PUBLIC / 'centres-sitemap.xml').write_text('\n'.join(sitemap) + '\n', encoding='utf-8')
print(json.dumps({'statistics': stats, 'sitemapUrls': len(sitemap_urls), 'files': ['centers-evidence.json', 'centers-evidence.txt', 'centers-machine.md', 'centres-sitemap.xml']}))
