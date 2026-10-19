import fs from 'node:fs/promises';

const sourceUrl = new URL('../../verify-site/dist/evidence/privacy.html', import.meta.url);
const outputUrl = new URL('../deployment/verify-measurement-repair.mjs', import.meta.url);

function publicVerifyBody(body) {
  return body
    .replaceAll('https://pinnacle-verify.saripalli.chatgpt.site', 'https://www.pinnacleblooms.org/verify')
    .replaceAll('href="../index.html', 'href="/verify/')
    .replaceAll('href="/', 'href="/verify/')
    .replaceAll('src="/', 'src="/verify/')
    .replaceAll('action="/', 'action="/verify/')
    .replaceAll('url(/', 'url(/verify/')
    .replaceAll('/verify/verify/', '/verify/')
    .replace(/\bsrcset="([^"]*)"/g, (_, values) => `srcset="${values.split(',').map(value => value.replace(/^(\s*)\/(?!\/|verify(?:\/|$))/, '$1/verify/')).join(',')}"`);
}

const privacyHtml = publicVerifyBody(await fs.readFile(sourceUrl, 'utf8'));
const moduleSource = `// Generated from verify-site/dist/evidence/privacy.html.\nexport const verifyMeasurementPrivacyHtml=${JSON.stringify(privacyHtml)};\n`;
await fs.writeFile(outputUrl, moduleSource);
console.log('Built Verify measurement repair asset.');
