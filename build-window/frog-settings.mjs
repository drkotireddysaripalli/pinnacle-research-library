// Refuse shared native settings that could inherit connected providers.
// This is a preflight, not the manager's isolated crawl/runtime acceptance.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const REQUIRED_LOCAL_FLAGS = Object.freeze([
  'OPENAI.auto_connect', 'PSI.auto_connect', 'ahrefs.auto_connect',
  'majectic.auto_connect', 'moz.auto_connect', // Native vendor spelling.
]);
const credentialKey = /(?:^|\.)(?:secretkey|access_token|accesstoken|authkey|accesslevelkey)$/i;
const failure = reason => new Error('Screaming Frog local preflight refused: '+reason+
  '. Preserve shared connections; use the manager\'s reserved, isolated crawl. No native crawl started.');

export function assertLocalFrogEnvironment(environment = process.env,
  nodeHome = os.homedir(), accountHome = os.userInfo().homedir) {
  if (['JAVA_TOOL_OPTIONS', '_JAVA_OPTIONS', 'JDK_JAVA_OPTIONS'].some(key => environment[key])) {
    throw failure('JVM environment overrides could select different native settings');
  }
  if (path.resolve(nodeHome) !== path.resolve(accountHome)) {
    throw failure('environment and operating-system home directories differ');
  }
}

export function inspectLocalFrogProperties(text) {
  const properties = new Map();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) continue;
    // Java properties support continuations/escaped keys. Refuse those forms
    // rather than risk misreading an enabled provider or credential key.
    const trailingBackslashes = line.match(/\\+$/)?.[0].length || 0;
    if (trailingBackslashes % 2) throw failure('continued properties require isolated runtime validation');
    const match = /^([^\s=:]+)(?:\s*[=:]\s*|\s+)(.*)$/.exec(line);
    if (!match || match[1].includes('\\')) throw failure('unsupported property syntax');
    const [, key, value] = match;
    if (properties.has(key)) throw failure('duplicate properties make settings ambiguous');
    properties.set(key, value.trim());
  }
  if (REQUIRED_LOCAL_FLAGS.some(key => !properties.has(key))) throw failure('required provider flags are not explicit');
  const flags = [...properties].filter(([key]) => /\.auto_connect$/i.test(key));
  if (flags.some(([, value]) => value !== 'false')) throw failure('provider auto-connect is enabled or unrecognised');
  if ([...properties].some(([key, value]) => credentialKey.test(key) && value !== '')) {
    throw failure('cached provider credentials are present');
  }
  return {providerFlags: flags.length, explicitAutoConnectDisabled: true};
}

export function assertLocalFrogSettings(directory = path.join(os.userInfo().homedir, '.ScreamingFrogSEOSpider')) {
  assertLocalFrogEnvironment();
  let text;
  try { text = fs.readFileSync(path.join(directory, 'spider.config'), 'utf8'); }
  catch { throw failure('native settings cannot be read'); }
  const receipt = inspectLocalFrogProperties(text);
  // GA4/GSC can persist OAuth state outside spider.config. Do not inherit it.
  if (['analytics', 'search_console'].some(name => fs.existsSync(path.join(directory, name)))) {
    throw failure('analytics or Search Console cache exists');
  }
  return {...receipt, knownProviderCachesAbsent: true};
}
