# テーマB ハンズオン 事前チェック（参加者用）
# 使い方: atfNN フォルダを「ターミナルで開く」→  .\preflight.ps1  と打つ
# 実行が拒否されたら:  powershell -ExecutionPolicy Bypass -File .\preflight.ps1

$ok = 0; $ng = 0
function Check($name, $result, $hint) {
    if ($result) { Write-Host ("[OK] " + $name) -ForegroundColor Green; $script:ok++ }
    else { Write-Host ("[NG] " + $name + "  -> " + $hint) -ForegroundColor Red; $script:ng++ }
}

Write-Host "=== テーマB Preflight ===" -ForegroundColor Cyan

# 1. Node.js
$node = (Get-Command node -ErrorAction SilentlyContinue)
Check "Node.js が入っている" ($null -ne $node) "https://nodejs.org から LTS を入れる"

# 2. now-sdk（.cmd 側で確認。.ps1 シムが実行ポリシーでブロックされても動く）
$sdk = (Get-Command now-sdk.cmd -ErrorAction SilentlyContinue)
Check "now-sdk が入っている" ($null -ne $sdk) "npm install -g @servicenow/sdk"

# 3. 実行ポリシー（now-sdk / npm の .ps1 シムが動くか）
$policy = Get-ExecutionPolicy -Scope CurrentUser
Check "PowerShell 実行ポリシーが RemoteSigned 以上" ($policy -in @("RemoteSigned", "Unrestricted", "Bypass")) "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned"

# 4. Claude Code
$claude = (Get-Command claude -ErrorAction SilentlyContinue)
Check "Claude Code (claude) が入っている" ($null -ne $claude) "npm install -g @anthropic-ai/claude-code"

# 5. このフォルダが Fluent プロジェクトか
Check "now.config.json がある（atfNN フォルダで実行している）" (Test-Path .\now.config.json) "atfNN フォルダで実行する"
Check "CLAUDE.md がある" (Test-Path .\CLAUDE.md) "zip を展開し直す"

# 6. npm install 済みか
Check "node_modules がある（npm install 済み）" (Test-Path .\node_modules) "npm install を実行する"

# 7. 接続先 handson が登録されているか
$authList = ""
if ($null -ne $sdk) { $authList = (& now-sdk.cmd auth --list 2>&1 | Out-String) }
Check "now-sdk に接続先 handson が登録されている" ($authList -match "handson") "now-sdk auth --add --alias handson を実行する"

# 8. インスタンスに届くか
try {
    $r = Invoke-WebRequest -Uri "https://dev192510.service-now.com/stats.do" -UseBasicParsing -TimeoutSec 15
    Check "dev192510.service-now.com に届く" ($r.StatusCode -eq 200) "ネットワークを確認する"
} catch { Check "dev192510.service-now.com に届く" $false "ネットワーク／プロキシを確認する" }

Write-Host ""
Write-Host ("結果: OK " + $ok + " / NG " + $ng) -ForegroundColor Cyan
if ($ng -eq 0) { Write-Host "準備完了です。手を挙げてください。" -ForegroundColor Green }
else { Write-Host "NG の行の -> の後を試してから、もう一度実行してください。" -ForegroundColor Yellow }
