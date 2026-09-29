import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const release = process.argv[2] || 'release-enrolment-live-20260929';
const file = `${release}/pinnacle-pages-html/enrolment.html`;
const html = await fs.readFile(file, 'utf8');
const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(match => JSON.parse(match[1]));
const schemaTypes = scripts.flatMap(item => (item['@graph'] || [item]).map(node => node['@type']));
const missingAltAttributes = [...html.matchAll(/<img(?![^>]*\balt(?:\s|=|>))[^>]*>/gi)].length;
const report = {
  file,
  description,
  descriptionLength: description.length,
  jsonLdScripts: scripts.length,
  schemaTypes,
  hasJobPosting: html.includes('"@type":"JobPosting"'),
  hasReviewSchema: /"@type":"(?:Review|AggregateRating)"/.test(html),
  missingAltAttributes
};

assert(description.length >= 120 && description.length <= 160, 'Description must be 120–160 characters.');
assert(scripts.length > 0, 'Expected at least one JSON-LD graph.');
assert(!report.hasJobPosting, 'Unexpected JobPosting schema.');
assert(!report.hasReviewSchema, 'Unexpected Review or AggregateRating schema.');
assert.equal(missingAltAttributes, 0, 'Every image must have an alt attribute.');

console.log(JSON.stringify(report, null, 2));
