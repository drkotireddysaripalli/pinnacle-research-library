import test from 'node:test';
import assert from 'node:assert/strict';
import {serveSpeech, SPEECH_CANONICAL} from '../deployment/speech-handler.mjs';

const origin = 'https://www.pinnacleblooms.org';
const env = {ASSETS: {fetch: async () => new Response('<!doctype html><title>Fixture</title>')}};
const inventory = {'/pinnacle-pages-html/speech.html': 'fixture', '/pinnacle-pages-data/speech-sitemap.xml': 'fixture'};

test('public HTML permits the existing Cloudflare script and same-origin beacon only', async () => {
  const response = await serveSpeech(new Request(origin + SPEECH_CANONICAL), env, inventory);
  assert.equal(response.status, 200);
  const csp = response.headers.get('content-security-policy');
  const script = csp.split(';').find(part => part.trim().startsWith('script-src'));
  const connect = csp.split(';').find(part => part.trim().startsWith('connect-src'));
  assert(script.includes('https://static.cloudflareinsights.com'));
  assert(connect.includes("'self'"));
  assert(!connect.includes('cloudflareinsights.com'), 'Automatic injection needs no external collector permission');
  assert(csp.includes("form-action 'self'"));
});

test('non-HTML discovery output acquires no script permissions', async () => {
  const response = await serveSpeech(new Request(origin + '/speech-therapy/sitemap.xml'), env, inventory);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-security-policy'), null);
  assert.equal(response.headers.get('content-type'), 'application/xml; charset=utf-8');
});
