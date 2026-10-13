$ErrorActionPreference = 'Stop'
$sourceSite = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $sourceSite
$sourceNode = 'C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$sourceLog = Join-Path $sourceSite 'ask-private/native-source-maintenance-task.log'
& $sourceNode (Join-Path $PSScriptRoot 'publisher-source-maintenance.mjs') *> $sourceLog
exit $LASTEXITCODE
