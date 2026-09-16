# fix.ps1 — 欠陥版 todo-app に修正（fix\ フォルダの 3 ファイル）を上書きする
# 使い方:  .\fix.ps1   → 続けて  cd todo-app; npm run build; npm run deploy
# 実行が拒否されたら:  powershell -ExecutionPolicy Bypass -File .\fix.ps1

$ErrorActionPreference = 'Stop'
$KitRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Src = Join-Path $KitRoot 'fix\src'
$Dst = Join-Path $KitRoot 'todo-app\src'
$StateFile = Join-Path $KitRoot '.setup-state.json'

if (-not (Test-Path $Src)) { Write-Host "[NG] fix\src がありません。zip を展開し直してください" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $StateFile)) {
    Write-Host "[NG] setup.ps1 がまだ実行されていません。先に .\setup.ps1 を実行してください" -ForegroundColor Red; exit 1
}

Write-Host "== 修正ファイルを上書きします（3 ファイル）" -ForegroundColor Cyan
$files = Get-ChildItem $Src -Recurse -File
foreach ($f in $files) {
    $rel = $f.FullName.Substring($Src.Length + 1)
    $target = Join-Path $Dst $rel
    $dir = Split-Path -Parent $target
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Copy-Item $f.FullName $target -Force
    Write-Host ("  上書き: src\" + $rel) -ForegroundColor Green
}

Write-Host ""
Write-Host "== 直した中身（サーバー側の守り。Business Rule の 3 行）" -ForegroundColor Cyan
Select-String -Path (Join-Path $Dst 'server\business-rules\validate-title.ts') -Pattern "trimmed === ''|addErrorMessage|setAbortAction" |
    ForEach-Object { Write-Host ("  " + $_.LineNumber.ToString().PadLeft(3) + ": " + $_.Line.Trim()) }
Write-Host "== 直した中身（画面側の守り）" -ForegroundColor Cyan
Select-String -Path (Join-Path $Dst 'client\components\TodoForm.tsx') -Pattern "title.trim\(\) === ''|タイトルは必須です" |
    ForEach-Object { Write-Host ("  " + $_.LineNumber.ToString().PadLeft(3) + ": " + $_.Line.Trim()) }
Write-Host "== 直した中身（テーブル定義）" -ForegroundColor Cyan
Select-String -Path (Join-Path $Dst 'fluent\tables\todo-item.now.ts') -Pattern "mandatory" |
    ForEach-Object { Write-Host ("  " + $_.LineNumber.ToString().PadLeft(3) + ": " + $_.Line.Trim()) }

Write-Host ""
Write-Host "次に打つもの:" -ForegroundColor Yellow
Write-Host "  cd todo-app"
Write-Host "  npm run build"
Write-Host "  npm run deploy"
Write-Host "終わったら ServiceNow の Tests 一覧で Negative → Positive の順に Run Test（再テスト）。"
