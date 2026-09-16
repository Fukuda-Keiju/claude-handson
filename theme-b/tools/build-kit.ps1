# build-kit.ps1 — 案C 参加者キット themeB-kit を組み立てて zip にする
# 使い方: theme-b\tools で  .\build-kit.ps1   → theme-b\dist\kit\themeB-kit\ と themeB-kit.zip ができる
#
# 材料
#   todo-app   : git の theme-b-buggy ブランチにある theme-b/todo-app（欠陥版）
#   atf-tests  : theme-b/atf09 からテスト本体（src/fluent/atf/*）と keys.ts を除いたもの
#   fix        : theme-b-fix ブランチの 3 ファイル
#   checkpoint / solution : theme-b/handout/
#   scripts    : theme-b/kit/*.ps1, README.md

$ErrorActionPreference = 'Stop'
$ThemeB = Resolve-Path (Join-Path $PSScriptRoot '..')
$Repo = Resolve-Path (Join-Path $ThemeB '..')
$Out = Join-Path $ThemeB 'dist\kit'
$Kit = Join-Path $Out 'themeB-kit'
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

if (Test-Path $Kit) { Remove-Item $Kit -Recurse -Force }
New-Item -ItemType Directory -Path $Kit -Force | Out-Null

# --- todo-app（欠陥版）: git archive で theme-b-buggy から取り出す ---
$tmpZip = Join-Path $env:TEMP 'themeB-todo-buggy.zip'
$tmpDir = Join-Path $env:TEMP 'themeB-todo-buggy'
if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
& git -C $Repo archive --format=zip -o $tmpZip theme-b-buggy theme-b/todo-app
if ($LASTEXITCODE -ne 0) { throw "git archive に失敗" }
Expand-Archive $tmpZip -DestinationPath $tmpDir -Force
Move-Item (Join-Path $tmpDir 'theme-b\todo-app') (Join-Path $Kit 'todo-app')
Remove-Item $tmpZip -Force; Remove-Item $tmpDir -Recurse -Force
# keys.ts は入れない。元アプリと同じ sys_id を持ち込むと、同じインスタンスに入れたときに
# Business Rule / メニュー / UI Page が「既に存在する」として黙って飛ばされる（2026-09-16 に確認）。
# 無ければ build が新しい ID を採る。
$keys = Join-Path $Kit 'todo-app\src\fluent\generated\keys.ts'
if (Test-Path $keys) { Remove-Item $keys -Force }
# 参加者が 43 分に Claude Code で修正するときの説明書（ルール・ファイル配置・API の注意）
Copy-Item (Join-Path $ThemeB 'kit\todo-app-CLAUDE.md') (Join-Path $Kit 'todo-app\CLAUDE.md')
# scopeId は setup.ps1 が採り直すので空にしておく
$cfgPath = Join-Path $Kit 'todo-app\now.config.json'
$cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
$cfg.scopeId = ''
[System.IO.File]::WriteAllText($cfgPath, (($cfg | ConvertTo-Json) + "`n"), $Utf8NoBom)
Write-Host "[OK] todo-app（theme-b-buggy）"

# --- atf-tests: atf09 の骨組みだけ ---
$atfSrc = Join-Path $ThemeB 'atf09'
$atfDst = Join-Path $Kit 'atf-tests'
New-Item -ItemType Directory -Path $atfDst | Out-Null
foreach ($f in @('.gitignore', 'CLAUDE.md', 'package.json', 'package-lock.json')) {
    Copy-Item (Join-Path $atfSrc $f) (Join-Path $atfDst $f)
}
Copy-Item (Join-Path $atfSrc '.vscode') (Join-Path $atfDst '.vscode') -Recurse
New-Item -ItemType Directory -Path (Join-Path $atfDst 'src\fluent\atf') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $atfDst 'src\server') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $atfDst 'docs') -Force | Out-Null
foreach ($f in @('src\tsconfig.client.json', 'src\tsconfig.json', 'src\tsconfig.server.json', 'src\server\tsconfig.json')) {
    Copy-Item (Join-Path $atfSrc $f) (Join-Path $atfDst $f)
}
# 日本語を含むテキストは必ず UTF-8 として読む（PS 5.1 の Get-Content 既定は ANSI で文字化けする）
function Read-Utf8($path) { return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) }
# server/index.ts は空モジュール（コメントの atf09 表記だけ一般化）
$idx = Read-Utf8 (Join-Path $atfSrc 'src\server\index.ts')
$idx = $idx.Replace('（x_2221398_atf09）', '').Replace('「講師用テストアプリ」', '「テスト専用アプリ」')
[System.IO.File]::WriteAllText((Join-Path $atfDst 'src\server\index.ts'), $idx, $Utf8NoBom)
# keys.ts は入れない（build が生成する）。空フォルダが zip で消えないように .gitkeep
'' | Out-File (Join-Path $atfDst 'src\fluent\atf\.gitkeep') -Encoding ascii
'' | Out-File (Join-Path $atfDst 'docs\.gitkeep') -Encoding ascii
# now.config.json / package.json をキット用の名前に
$acfg = Get-Content (Join-Path $atfSrc 'now.config.json') -Raw | ConvertFrom-Json
$acfg.scope = 'x_2221398_atf'; $acfg.scopeId = ''; $acfg.name = 'ATF Handson'
[System.IO.File]::WriteAllText((Join-Path $atfDst 'now.config.json'), (($acfg | ConvertTo-Json) + "`n"), $Utf8NoBom)
$apkg = Get-Content (Join-Path $atfDst 'package.json') -Raw | ConvertFrom-Json
$apkg.name = 'atf-handson'
[System.IO.File]::WriteAllText((Join-Path $atfDst 'package.json'), (($apkg | ConvertTo-Json -Depth 5) + "`n"), $Utf8NoBom)
# CLAUDE.md: 接続先の行を自分の PDI 向けに。atf09 固有の表記も一般化
$cl = Read-Utf8 (Join-Path $atfDst 'CLAUDE.md')
$cl = [regex]::Replace($cl, '(?m)^- 接続先:.*$', '- 接続先: alias `mypdi`（参加者それぞれの PDI。`now-sdk auth --list` で確認）')
$cl = $cl.Replace('x_2221398_atf09', 'x_2221398_atf')
[System.IO.File]::WriteAllText((Join-Path $atfDst 'CLAUDE.md'), $cl, $Utf8NoBom)
Write-Host "[OK] atf-tests（atf09 の骨組み）"

# --- fix: theme-b-fix の 3 ファイル ---
$fixFiles = @(
    'src/server/business-rules/validate-title.ts',
    'src/client/components/TodoForm.tsx',
    'src/fluent/tables/todo-item.now.ts'
)
foreach ($rel in $fixFiles) {
    $dst = Join-Path $Kit ('fix\' + $rel.Replace('/', '\'))
    New-Item -ItemType Directory -Path (Split-Path -Parent $dst) -Force | Out-Null
    $content = & git -C $Repo show ("theme-b-fix:theme-b/todo-app/" + $rel)
    if ($LASTEXITCODE -ne 0) { throw "git show に失敗: $rel" }
    [System.IO.File]::WriteAllText($dst, (($content -join "`n") + "`n"), $Utf8NoBom)
}
Write-Host "[OK] fix（theme-b-fix の 3 ファイル）"

# --- checkpoint / solution ---
Copy-Item (Join-Path $ThemeB 'handout\checkpoint') (Join-Path $Kit 'checkpoint') -Recurse
Copy-Item (Join-Path $ThemeB 'handout\solution') (Join-Path $Kit 'solution') -Recurse
# コメント中の講師用スコープ名 x_2221398_atf09 を x_2221398_atf に寄せる（setup.ps1 の置換が atf209 のような形にならないように）
Get-ChildItem (Join-Path $Kit 'checkpoint'), (Join-Path $Kit 'solution') -Recurse -File | ForEach-Object {
    $t = Read-Utf8 $_.FullName
    if ($t.Contains('x_2221398_atf09')) { [System.IO.File]::WriteAllText($_.FullName, $t.Replace('x_2221398_atf09', 'x_2221398_atf'), $Utf8NoBom) }
}
Write-Host "[OK] checkpoint / solution"

# --- scripts ---
foreach ($f in @('setup.ps1', 'fix.ps1', 'preflight.ps1', 'set-atf-props.mjs', 'README.md')) {
    Copy-Item (Join-Path $ThemeB ('kit\' + $f)) (Join-Path $Kit $f)
}
Write-Host "[OK] scripts"

# --- zip ---
$zip = Join-Path $Out 'themeB-kit.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path $Kit -DestinationPath $zip
$size = [math]::Round((Get-Item $zip).Length / 1KB)
Write-Host ("[OK] " + $zip + " (" + $size + " KB)") -ForegroundColor Green
