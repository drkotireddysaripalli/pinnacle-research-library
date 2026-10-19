import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const evidenceDir = path.resolve(process.env.AUTOMATIC_MEASUREMENT_EVIDENCE_DIR || 'ask-private/automatic-before-choice');
const skipBuild = process.argv.includes('--no-build');
await fs.mkdir(evidenceDir, { recursive: true });

const stages = [
  ...(!skipBuild ? [{ name: 'production-build', command: 'npm', args: ['run', 'build'], env: { PINNACLE_RELEASE: 'production' } }] : []),
  { name: 'measurement-unit', command: process.execPath, args: ['--test', 'scripts/test-measurement.mjs'] },
  { name: 'types', command: 'npm', args: ['run', 'check:types'] },
  { name: 'real-sdk-wire', command: process.execPath, args: ['scripts/check-enquiry-wire.mjs', path.join(evidenceDir, 'wire.json')] },
  { name: 'diff-check', command: 'git', args: ['diff', '--check', '--', '.'] }
];
const receipt = { startedAt: new Date().toISOString(), root, skipBuild, stages: [] };

const run = stage => new Promise(resolve => {
  const startedAt = new Date().toISOString();
  const logPath = path.join(evidenceDir, `${stage.name}.log`);
  const chunks = [];
  const child = spawn(stage.command, stage.args, {
    cwd: root,
    env: { ...process.env, ...stage.env },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const record = chunk => {
    chunks.push(chunk);
    process.stdout.write(chunk);
  };
  child.stdout.on('data', record);
  child.stderr.on('data', record);
  child.on('error', error => record(Buffer.from(`${error.stack || error}\n`)));
  child.on('close', async (exitCode, signal) => {
    await fs.writeFile(logPath, Buffer.concat(chunks));
    resolve({
      name: stage.name,
      command: [stage.command, ...stage.args].join(' '),
      startedAt,
      completedAt: new Date().toISOString(),
      exitCode,
      signal,
      logPath
    });
  });
});

for (const stage of stages) {
  const result = await run(stage);
  receipt.stages.push(result);
  await fs.writeFile(path.join(evidenceDir, 'checkpoint.json'), JSON.stringify(receipt, null, 2) + '\n');
  if (result.exitCode !== 0) {
    receipt.completedAt = new Date().toISOString();
    receipt.passed = false;
    receipt.failedStage = result.name;
    await fs.writeFile(path.join(evidenceDir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    process.exit(result.exitCode || 1);
  }
}

receipt.completedAt = new Date().toISOString();
receipt.passed = true;
await fs.writeFile(path.join(evidenceDir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, evidenceDir, stages: receipt.stages.map(stage => stage.name) }));
