import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {REQUIRED_LOCAL_FLAGS, assertLocalFrogEnvironment, assertLocalFrogSettings, inspectLocalFrogProperties} from './frog-settings.mjs';

const disabled = REQUIRED_LOCAL_FLAGS.map(key => key+'=false').join('\n')+'\n';
test('every installed-build provider is refused when enabled, including native majectic spelling', () => {
  for (const key of REQUIRED_LOCAL_FLAGS) {
    assert.throws(() => inspectLocalFrogProperties(disabled.replace(key+'=false', key+'=true')), /auto-connect/);
  }
});
test('missing, malformed, duplicate and future provider flags fail closed', () => {
  assert.throws(() => inspectLocalFrogProperties(disabled.replace('moz.auto_connect=false\n', '')), /not explicit/);
  assert.throws(() => inspectLocalFrogProperties(disabled.replace('moz.auto_connect=false', 'moz.auto_connect=maybe')), /unrecognised/);
  assert.throws(() => inspectLocalFrogProperties(disabled+'moz.auto_connect=true\n'), /duplicate/);
  assert.throws(() => inspectLocalFrogProperties(disabled+'future.auto_connect=true\n'), /auto-connect/);
  assert.throws(() => inspectLocalFrogProperties(''), /not explicit/);
});
test('ordinary Java property separators, comments and CRLF are interpreted without exposing values', () => {
  const text = '# comment\r\n! comment\r\n'+REQUIRED_LOCAL_FLAGS.map((key, i) =>
    '  '+key+(i%3===0 ? ' : false' : i%3===1 ? ' false' : ' = false')).join('\r\n');
  assert.deepEqual(inspectLocalFrogProperties(text), {providerFlags:5, explicitAutoConnectDisabled:true});
});
test('escaped keys and continued properties cannot conceal auto-connect or credentials', () => {
  assert.throws(() => inspectLocalFrogProperties(disabled+'m\\u006fz.auto_connect=true\n'), /unsupported/);
  assert.throws(() => inspectLocalFrogProperties(disabled+'future.auto_connect=tr\\\nue\n'), /continued/);
});
test('disabled flags still refuse cached credentials without including secret values in errors', () => {
  for (const key of ['OPENAI.secretkey','PSI.secretkey','ahrefs.access_token','majestic.authkey','moz.accesstoken','ANTHROPIC.secretkey']) {
    assert.throws(() => inspectLocalFrogProperties(disabled+key+'=fixture-private-value\n'), error =>
      /cached provider/.test(error.message) && !error.message.includes('fixture-private-value'));
  }
});
test('unreadable native settings and either external OAuth cache prevent startup', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'pinnacle-frog-settings-'));
  t.after(() => fs.rmSync(directory, {recursive:true, force:true}));
  assert.throws(() => assertLocalFrogSettings(directory), /cannot be read/);
  fs.writeFileSync(path.join(directory,'spider.config'), disabled);
  assert.equal(assertLocalFrogSettings(directory).knownProviderCachesAbsent, true);
  for (const name of ['analytics','search_console']) {
    fs.mkdirSync(path.join(directory,name));
    assert.throws(() => assertLocalFrogSettings(directory), /cache exists/);
    fs.rmdirSync(path.join(directory,name));
  }
});
test('inherited JVM options cannot redirect the native settings directory', () => {
  for (const key of ['JAVA_TOOL_OPTIONS','_JAVA_OPTIONS','JDK_JAVA_OPTIONS']) {
    assert.throws(() => assertLocalFrogEnvironment({[key]:'-Duser.home=fixture-private-home'}, '/same', '/same'),
      error => /JVM environment overrides/.test(error.message) && !error.message.includes('fixture-private-home'));
  }
  assert.doesNotThrow(() => assertLocalFrogEnvironment({}, '/same', '/same'));
});
test('a HOME or USERPROFILE mismatch cannot select different inspected settings', () => {
  assert.throws(() => assertLocalFrogEnvironment({}, '/environment-home', '/account-home'), /home directories differ/);
});
