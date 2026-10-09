// One focused offline registry, used by hosted CI and either local team.
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

export const focusedSuites = [
  ['scripts/test-ask-priority-editorial.mjs','scripts/test-ask-intent-editorial.mjs','scripts/test-priority-hindi-copy.mjs','scripts/test-priority-legacy-content.mjs','scripts/test-ask-topic-navigation.mjs'],
  ['scripts/test-knowledge-catalogues.mjs'],
  ['deployment/mirracles-library-20261008/library.test.mjs','scripts/test-mirracles-corpus.mjs','deployment/guru-recovery-20261009/handler.test.mjs','scripts/test-server-error-routing.mjs','scripts/test-url-health-repair.mjs'],
  ['scripts/test-book-asset-inventory.mjs','scripts/test-vernacular-typography.mjs','scripts/test-book-cart-links.mjs'],
  ['scripts/test-staff-health.mjs','scripts/test-legacy-social-metadata.mjs','scripts/test-legacy-schema.mjs'],
  ['scripts/test-public-mobile-recovery.mjs','scripts/test-materials-media.mjs'],
  ['scripts/test-merchant-policy.mjs'],
  ['scripts/test-paid-centre-entry.mjs','scripts/test-centre-measurement.mjs'],
  ['scripts/test-centre-google-feed.mjs','scripts/test-enrolment-receipt.mjs'],
  ['scripts/test-enrolment-lead-slack.mjs','scripts/test-enrolment-slack-attachment.mjs'],
];
export const launcherSuites=['build-window/candidate.test.mjs','build-window/frog-settings.test.mjs','build-window/preview-process.test.mjs'];
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  for(const [cwd,suites] of [[root,[launcherSuites]],[path.join(root,'speech-site'),focusedSuites]]){
    for(const files of suites){
      for(const file of files)if(!fs.existsSync(path.join(cwd,file)))throw Error('Required suite missing: '+file);
      const result=spawnSync(process.execPath,['--test',...files],{cwd,stdio:'inherit',env:process.env});
      if(result.error)throw result.error;
      if(result.status!==0)process.exit(result.status??1);
    }
  }
  console.log('Public offline/launcher contracts completed. Private receiver/resource inputs, cloud/device tests and accepted operational intake remain separately required evidence.');
}
