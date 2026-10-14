export function reuseAcceptedSeed(source, delta, maintenance) {
  return maintenance.status === 'verified' &&
    source.phase === 'verified_unchanged_publication' &&
    Array.isArray(delta.changes) && delta.changes.length === 0 &&
    !maintenance.metadataInitializations && !maintenance.r2StableChangesDrained;
}
export function servedPublicationFiles(manifest) {
  return manifest.files.filter(f => !['robots_addition', 'llms_addition'].includes(f.kind));
}
