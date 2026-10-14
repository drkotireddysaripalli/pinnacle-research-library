import { REPOSITORY } from './controller.mjs';

const bytes = text => new TextEncoder().encode(text);
const base64 = data => btoa(String.fromCharCode(...data)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
function concat(...parts) {
  const out = new Uint8Array(parts.reduce((n, x) => n + x.length, 0));
  let offset = 0;
  for (const part of parts) { out.set(part, offset); offset += part.length; }
  return out;
}
function der(tag, body) {
  let size = body.length, length = [];
  if (size < 128) length = [size];
  else { while (size) { length.unshift(size & 255); size >>= 8; } length.unshift(128 | length.length); }
  return concat(new Uint8Array([tag, ...length]), body);
}
function pkcs8(pem) {
  if (typeof pem !== 'string' || !/-----BEGIN (?:RSA )?PRIVATE KEY-----/.test(pem)) throw Error('GitHub App RSA private key is required');
  const data = Uint8Array.from(atob(pem.replace(/-----[^-]+-----|\s+/g, '')), c => c.charCodeAt(0));
  if (!pem.includes('BEGIN RSA PRIVATE KEY')) return data;
  // GitHub's generated PKCS#1 RSA key wrapped as an unencrypted PKCS#8 key.
  const version = new Uint8Array([2, 1, 0]);
  const rsaAlgorithm = new Uint8Array([48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0]);
  return der(48, concat(version, rsaAlgorithm, der(4, data)));
}

export class GitHubAppCredential {
  constructor({ appId, installationId, privateKey, fetcher = fetch, clock = Date.now }) {
    if (!/^[a-zA-Z0-9_.-]{1,80}$/.test(String(appId)) || !/^\d+$/.test(String(installationId))) throw Error('Invalid GitHub App installation identifiers');
    this.appId = String(appId); this.installationId = String(installationId);
    this.privateKey = privateKey; this.fetcher = fetcher; this.clock = clock;
    this.cached = null;
  }
  async getToken() {
    if (this.cached && this.cached.expiresAt > this.clock() + 60000) return this.cached.token;
    const key = await crypto.subtle.importKey('pkcs8', pkcs8(this.privateKey), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const now = Math.floor(this.clock() / 1000);
    const unsigned = `${base64(bytes(JSON.stringify({ alg: 'RS256', typ: 'JWT' })))}.${base64(bytes(JSON.stringify({ iat: now - 60, exp: now + 540, iss: this.appId })))}`;
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, bytes(unsigned));
    const response = await this.fetcher(`https://api.github.com/app/installations/${this.installationId}/access_tokens`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${unsigned}.${base64(new Uint8Array(signature))}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'PinnacleSitemapCloudScheduler' },
      body: JSON.stringify({ repositories: [REPOSITORY.split('/')[1]], permissions: { actions: 'write' } }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.status !== 201) throw Error(`GitHub App credential renewal failed with HTTP ${response.status}`);
    const value = await response.json(), expiry = Date.parse(value.expires_at);
    if (typeof value.token !== 'string' || !value.token || !Number.isFinite(expiry) || expiry <= this.clock() + 60000 || value.permissions?.actions !== 'write') throw Error('Provider returned an invalid or insufficient installation credential');
    if (value.repositories && (!Array.isArray(value.repositories) || value.repositories.length !== 1 || value.repositories[0].full_name !== REPOSITORY)) throw Error('Installation credential repository scope differs from the requested repository');
    this.cached = { token: value.token, expiresAt: expiry };
    return value.token;
  }
}

export function schedulerCredential(env) {
  if (env.GITHUB_APP_ID && env.GITHUB_APP_INSTALLATION_ID && env.GITHUB_APP_PRIVATE_KEY) {
    const app = new GitHubAppCredential({ appId: env.GITHUB_APP_ID, installationId: env.GITHUB_APP_INSTALLATION_ID, privateKey: env.GITHUB_APP_PRIVATE_KEY });
    return () => app.getToken();
  }
  return env.GITHUB_DISPATCH_TOKEN;
}
