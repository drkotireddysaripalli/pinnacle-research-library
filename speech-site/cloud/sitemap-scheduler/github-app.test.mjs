import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { GitHubAppCredential, schedulerCredential } from './github-app.mjs';

const T = Date.parse('2026-10-14T04:40:00Z');
const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const pkcs8 = pair.privateKey.export({ type: 'pkcs8', format: 'pem' });
const pkcs1 = pair.privateKey.export({ type: 'pkcs1', format: 'pem' });
const credentials = { appId: 'Iv1.unit_test', installationId: '1234', privateKey: pkcs8 };
function issued(token = 'unit-minted-token', expiry = T + 3600000) {
  return { token, expires_at: new Date(expiry).toISOString(), permissions: { actions: 'write', metadata: 'read' }, repositories: [{ full_name: 'drkotireddysaripalli/pinnacle-research-library' }] };
}

test('App JWT is cryptographically valid and limits the credential to this repository Actions', async () => {
  let request;
  const app = new GitHubAppCredential({ ...credentials, clock: () => T, fetcher: async (url, init) => { request = { url, init }; return Response.json(issued(), { status: 201 }); } });
  assert.equal(await app.getToken(), 'unit-minted-token');
  assert.equal(request.url, 'https://api.github.com/app/installations/1234/access_tokens');
  assert.deepEqual(JSON.parse(request.init.body), { repositories: ['pinnacle-research-library'], permissions: { actions: 'write' } });
  const [head, payload, signature] = request.init.headers.Authorization.slice(7).split('.');
  assert.equal(JSON.parse(Buffer.from(head, 'base64url')).alg, 'RS256');
  assert(verify('RSA-SHA256', Buffer.from(`${head}.${payload}`), pair.publicKey, Buffer.from(signature, 'base64url')));
  assert.deepEqual(JSON.parse(Buffer.from(payload, 'base64url')), { iat: T / 1000 - 60, exp: T / 1000 + 540, iss: 'Iv1.unit_test' });
});

test('GitHub generated PKCS1 keys are wrapped correctly for Workers WebCrypto', async () => {
  const app = new GitHubAppCredential({ ...credentials, privateKey: pkcs1, clock: () => T, fetcher: async (_, init) => {
    const [head, body, sig] = init.headers.Authorization.slice(7).split('.');
    assert(verify('RSA-SHA256', Buffer.from(`${head}.${body}`), pair.publicKey, Buffer.from(sig, 'base64url')));
    return Response.json(issued(), { status: 201 });
  } });
  assert.equal(await app.getToken(), 'unit-minted-token');
});

test('installation credentials are reused then renewed before provider expiry', async () => {
  let now = T, requests = 0;
  const app = new GitHubAppCredential({ ...credentials, clock: () => now, fetcher: async () => Response.json(issued(`unit-token-${++requests}`, now + 3600000), { status: 201 }) });
  assert.equal(await app.getToken(), 'unit-token-1');
  assert.equal(await app.getToken(), 'unit-token-1');
  assert.equal(requests, 1);
  now += 3590000;
  assert.equal(await app.getToken(), 'unit-token-2');
  assert.equal(requests, 2);
});

test('insufficient or expanded repository credentials fail closed', async () => {
  for (const value of [
    { ...issued(), permissions: { actions: 'read' } },
    { ...issued(), repositories: [{ full_name: 'another/repository' }] },
    { ...issued(), expires_at: new Date(T).toISOString() },
  ]) {
    const app = new GitHubAppCredential({ ...credentials, clock: () => T, fetcher: async () => Response.json(value, { status: 201 }) });
    await assert.rejects(app.getToken());
    assert.equal(app.cached, null);
  }
});

test('provider rejection does not cache a credential or include a key in the error', async () => {
  const app = new GitHubAppCredential({ ...credentials, clock: () => T, fetcher: async () => new Response(null, { status: 403 }) });
  await assert.rejects(app.getToken(), /HTTP 403/);
  assert.equal(app.cached, null);
});

test('invalid installation identifiers are rejected before external requests', () => {
  assert.throws(() => new GitHubAppCredential({ ...credentials, installationId: '../invalid' }));
});

test('an existing specifically authorized token remains supported without a new App', () => {
  assert.equal(schedulerCredential({ GITHUB_DISPATCH_TOKEN: 'unit-existing-token' }), 'unit-existing-token');
  assert.equal(schedulerCredential({}), undefined);
});
