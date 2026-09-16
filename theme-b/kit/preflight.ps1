# preflight.ps1 — テーマB 案C 事前チェック（参加者用）
# 使い方: themeB-kit フォルダを「ターミナルで開く」→  .\preflight.ps1
# 実行が拒否されたら:  powershell -ExecutionPolicy Bypass -File .\preflight.ps1
param([string]$Auth = 'mypdi')

$ok = 0; $ng = 0
function Check($name, $result, $hint) {
    if ($result) { Write-Host ("[OK] " + $name) -ForegroundColor Green; $script:ok++ }
    else { Write-Host ("[NG] " + $name + "  -> " + $hint) -ForegroundColor Red; $script:ng++ }
}
$KitRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== テーマB Preflight（案C: 自分の PDI）===" -ForegroundColor Cyan

# 1. 道具
$node = Get-Command node -ErrorAction SilentlyContinue
Check "Node.js が入っている" ($null -ne $node) "https://nodejs.org から LTS を入れる"
$sdk = Get-Command now-sdk.cmd -ErrorAction SilentlyContinue
Check "now-sdk が入っている" ($null -ne $sdk) "npm install -g @servicenow/sdk"
$policy = Get-ExecutionPolicy -Scope CurrentUser
Check "PowerShell 実行ポリシーが RemoteSigned 以上" ($policy -in @("RemoteSigned", "Unrestricted", "Bypass")) "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned"
$claude = Get-Command claude -ErrorAction SilentlyContinue
Check "Claude Code (claude) が入っている" ($null -ne $claude) "npm install -g @anthropic-ai/claude-code"

# 2. キット
Check "setup.ps1 がある（themeB-kit フォルダで実行している）" (Test-Path (Join-Path $KitRoot 'setup.ps1')) "themeB-kit フォルダで実行する"
$stateFile = Join-Path $KitRoot '.setup-state.json'
$state = $null
if (Test-Path $stateFile) { $state = Get-Content $stateFile -Raw | ConvertFrom-Json }
Check "setup.ps1 を実行済み（.setup-state.json がある）" ($null -ne $state -and $state.replaced) ".\setup.ps1 を実行する"
$cfgPath = Join-Path $KitRoot 'todo-app\now.config.json'
$cfg = $null
if (Test-Path $cfgPath) { $cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json }
Check "todo-app の scopeId が入っている" ($null -ne $cfg -and -not [string]::IsNullOrWhiteSpace($cfg.scopeId)) ".\setup.ps1 を実行する"
Check "atf-tests の npm install 済み（node_modules がある）" (Test-Path (Join-Path $KitRoot 'atf-tests\node_modules')) ".\setup.ps1 を実行する"
Check "atf-tests に CLAUDE.md がある" (Test-Path (Join-Path $KitRoot 'atf-tests\CLAUDE.md')) "zip を展開し直す"

# 3. 接続先と PDI
$authList = ""
if ($null -ne $sdk) { $authList = (& now-sdk.cmd auth --list | Out-String) }
Check "now-sdk に接続先 [$Auth] が登録されている" ($authList -match ('\[' + [regex]::Escape($Auth) + '\]')) "now-sdk auth --add --alias $Auth"

if ($null -ne $sdk -and $null -ne $state -and $state.todoScope) {
    $table = $state.todoScope + '_item'
    $out = (& now-sdk.cmd query sys_db_object -q ("name=" + $table) -f name --auth $Auth | Out-String)
    Check ("自分の PDI にアプリが入っている（テーブル " + $table + "）") ($out -match $table) ".\setup.ps1 をもう一度実行する（PDI が休止中なら先にブラウザでログイン）"
    $props = (& now-sdk.cmd query sys_properties -q "nameINsn_atf.runner.enabled,sn_atf.schedule.enabled" -f name,value --auth $Auth | Out-String)
    $trueCount = ([regex]::Matches($props, '"value":\s*"true"')).Count
    Check "ATF の実行設定 2 つが true（sn_atf.runner.enabled / sn_atf.schedule.enabled）" ($trueCount -ge 2) "自分の PDI で All → sys_properties.list → 2 つを true にする"
}

Write-Host ""
Write-Host ("結果: OK " + $ok + " / NG " + $ng) -ForegroundColor Cyan
if ($ng -eq 0) { Write-Host "準備完了です。この画面のスクリーンショットを講師に送ってください。" -ForegroundColor Green }
else { Write-Host "NG の行の -> の後を試してから、もう一度実行してください。" -ForegroundColor Yellow }
