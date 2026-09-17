# reset.ps1 — todo-app を欠陥版に戻す（buggy\ フォルダの 3 ファイルを上書き）。ハンズオン PC を次の人に渡す前に使う。
# 使い方:  .\reset.ps1   → 続けて  cd todo-app; npm run build; npm run deploy
# 実行が拒否されたら:  powershell -ExecutionPolicy Bypass -File .\reset.ps1

$ErrorActionPreference = 'Stop'
$KitRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Src = Join-Path $KitRoot 'buggy\src'
$Dst = Join-Path $KitRoot 'todo-app\src'
$StateFile = Join-Path $KitRoot '.setup-state.json'

if (-not (Test-Path $Src)) { Write-Host "[NG] buggy\src がありません。zip を展開し直してください" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $StateFile)) { Write-Host "[NG] setup.ps1 がまだ実行されていません" -ForegroundColor Red; exit 1 }

Write-Host "== 欠陥版のファイルを上書きします（3 ファイル）" -ForegroundColor Cyan
Get-ChildItem $Src -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($Src.Length + 1)
    $target = Join-Path $Dst $rel
    $dir = Split-Path -Parent $target
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Copy-Item $_.FullName $target -Force
    Write-Host ("  上書き: src\" + $rel) -ForegroundColor Green
}
Write-Host ""
Write-Host "次に打つもの:" -ForegroundColor Yellow
Write-Host "  cd todo-app"
Write-Host "  npm run build"
Write-Host "  npm run deploy"
Write-Host "終わったら Tests 一覧で Negative を Run Test すると赤に戻ります。"
