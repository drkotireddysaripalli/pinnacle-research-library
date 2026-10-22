import assert from 'node:assert/strict';

// Replace only the bundled call helper, retaining every legacy-specific handler.
export function replaceBundledCall(text, generated) {
  const bounds = value => {
    const start = [...value.matchAll(/^\/\/ (?:speech-site\/)?deployment\/public-ad-call\.mjs$/gm)];
    const end = [...value.matchAll(/^\/\/ (?:speech-site\/)?deployment\/legacy-measurement\.mjs$/gm)];
    assert.equal(start.length, 1); assert.equal(end.length, 1);
    assert(end[0].index > start[0].index);
    return [start[0].index, end[0].index];
  };
  const [start, end] = bounds(text), [nextStart, nextEnd] = bounds(generated);
  let replacement = generated.slice(nextStart, nextEnd);
  // The older legacy composition still reads this binding after this block.
  // esbuild omits it from the new composition because its markup is empty.
  if (!/\bvar publicAdCallMarkup\s*=/.test(replacement)) replacement += 'var publicAdCallMarkup = "";\n';
  return text.slice(0, start) + replacement + text.slice(end);
}

export function replaceSelectedReference(text, currentPath) {
  const previous = '/pinnacle-pages-scripts/portal-ad-call-1b357bec67c18321.mjs';
  assert.equal(text.split(previous).length - 1, 1, 'One reviewed embedded path');
  const pattern = /,R='(<details class="measurement-settings portal-measurement" data-ad-call-preferences[^']+<\/details>)';/g;
  const found = [...text.matchAll(pattern)]; assert.equal(found.length, 1, 'One obsolete choice block');
  return text.replace(previous, currentPath).replace(pattern, ",R='';");
}

// The two old compositions also retain the retired preference markup and an
// early-click queue gated on that preference. Change only these known seams.
export function replaceAutomaticLegacyDefaults(text, generated) {
  if (!text.includes('Optional analytics preferences')) return text;
  const early = /^var earlyCapture = (.+);$/m.exec(generated)?.[1];
  assert(early, 'Canonical automatic early capture');
  const once = (pattern, replacement) => {
    assert.equal([...text.matchAll(pattern)].length, 1, 'One reviewed legacy seam: '+pattern);
    text = text.replace(pattern, () => replacement);
  };
  if (text.includes('var panel = ')) {
    once(/^var panel = .+;$/gm, 'var panel = "";');
    once(/^var earlyCapture = .+;$/gm, 'var earlyCapture = '+early+';');
    once(/^  const controls = '<aside aria-label="Optional measurement preferences".+;$/gm, '  const controls = "";');
  } else {
    once(/var O='<details class="measurement-settings" data-speech-measurement[^']+<\/details>',S='[^']+';/g, 'var O="",S='+early+';');
    once(/let d='<aside aria-label="Optional measurement preferences"[^\n]+?"<\/aside>",c=/g, 'let d="",c=');
  }
  assert.equal(text.split('legacy-cohorts-20261011-v3').length-1, 1);
  return text.replace('legacy-cohorts-20261011-v3','measurement-completion-20261020').replace('data-pinnacle-legacy-collector="early-v3"','data-pinnacle-legacy-collector="early-v4"');
}
