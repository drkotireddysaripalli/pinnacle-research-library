"""Validate exact public legacy-player evidence before adding identity aliases."""
import re
from urllib.parse import urlsplit, unquote

ORIGIN = 'https://www.pinnacleblooms.org'


def public_path(value):
    if not isinstance(value, str):
        raise ValueError('Missing public alias path')
    if re.search(r'[\x00-\x1f\x7f]|%(?![0-9a-fA-F]{2})', value):
        raise ValueError('Malformed public alias encoding')
    url = urlsplit(value)
    if url.scheme or url.netloc or url.query or url.fragment:
        raise ValueError('Alias must be a public relative path without a query')
    decoded = unquote(url.path, errors='strict')
    if not re.fullmatch(r'/mirracles/[0-9]+/[^/\\?#\x00-\x1f\x7f]+', decoded):
        raise ValueError('Invalid public alias path')
    if decoded.split('/')[-1] in ('.', '..'):
        raise ValueError('Invalid public alias slug')
    return value


def video_id(value):
    if not isinstance(value, str):
        return None
    url = urlsplit(value)
    if url.scheme != 'https' or url.netloc not in ('www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'):
        return None
    match = re.fullmatch(r'/embed/([\w-]{11})', url.path)
    return match[1] if match else None


def stream_id(value):
    if not isinstance(value, str):
        return None
    url = urlsplit(value)
    if url.scheme != 'https' or url.netloc != 'videodelivery.net':
        return None
    match = re.fullmatch(r'/([0-9a-f]{32})/thumbnails/thumbnail.jpg', url.path)
    return match[1] if match else None


def legacy_alias_paths(manifest, records):
    """Return path -> existing ID; never invent a record or alter listing order.

    Evidence is a dated public-page observation. The private source HTML stays
    outside Git; its hash and primary/schema player identities record the join.
    """
    if manifest.get('version') != 'mirracles-legacy-identities-20261009':
        raise ValueError('Unknown legacy identity evidence format')
    canonical_paths = {row['path']: key for key, row in records.items()}
    result, old_targets = {}, {}
    for item in manifest['mappings']:
        old_id, target_id = item['legacyId'], item['canonicalId']
        if not re.fullmatch(r'[0-9]+', old_id) or old_id == target_id:
            raise ValueError('Invalid legacy identity')
        target = records.get(target_id)
        if not target or not target.get('inSitemap') or target['path'] != item['canonicalPath']:
            raise ValueError('Missing current public canonical target')
        if old_id in records or (old_id in old_targets and old_targets[old_id] != target_id):
            raise ValueError('Legacy identity collides with another record')
        evidence = item['source']
        player = video_id(evidence['primaryPlayer'])
        poster = stream_id(evidence['schemaThumbnail'])
        if not player or not poster or video_id(evidence['schemaPlayer']) != player:
            raise ValueError('Primary player and schema evidence disagree')
        if video_id(target.get('player')) != player or stream_id(target.get('poster')) != poster:
            raise ValueError('Canonical player or thumbnail differs from original')
        if sum(video_id(row.get('player')) == player and stream_id(row.get('poster')) == poster
               for row in records.values()) != 1:
            raise ValueError('Original media identities do not identify a unique canonical record')
        if evidence['httpStatus'] != 200 or not re.fullmatch(r'[0-9a-f]{64}', evidence['sha256']):
            raise ValueError('Missing successful public source receipt')
        paths = item['paths']
        if not paths or evidence['url'] not in [ORIGIN + path for path in paths]:
            raise ValueError('Original source URL must be a recorded alias')
        for path in paths:
            public_path(path)
            if path.split('/')[2] != old_id:
                raise ValueError('Alias path belongs to another legacy identity')
            if path in canonical_paths or (path in result and result[path] != target_id):
                raise ValueError('Alias shadows another canonical identity')
            result[path] = target_id
        old_targets[old_id] = target_id
    return result
