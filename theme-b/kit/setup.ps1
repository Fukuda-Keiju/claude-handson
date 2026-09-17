# setup.ps1 — テーマB 案C 参加者キットのセットアップ
#
# やること（順番に）
#   1. now-sdk に接続先（既定: mypdi）が登録されているか確認
#   2. 自分の PDI から会社コード（glide.appcreator.company.code）を読む
#   3. キット内の全ファイルのスコープ接頭辞 x_2221398_ を自分の会社コードに書き換える
#   4. todo-app / atf-tests それぞれのスコープを PDI に登録して scopeId を now.config.json に書く
#   5. todo-app: npm ci → build → deploy（欠陥版アプリが自分の PDI に入る）
#   6. atf-tests: npm ci → build（deploy は当日）
#
# 使い方:  .\setup.ps1
#   実行が拒否されたら:  powershell -ExecutionPolicy Bypass -File .\setup.ps1
# オプション:
#   -Auth <alias>       now-sdk の接続先の名前（既定 mypdi）
#   -ScopeSuffix <s>    検証用。スコープ名の末尾に付ける（例: 2 → x_<code>_todo2）。参加者は使わない
#   -SkipInstall        todo-app の deploy を飛ばす
#   -SkipNpm            npm ci を飛ばす（2 回目以降の時短）
# 2 回実行しても壊れない（済んだ工程は .setup-state.json を見て飛ばす）。

param(
    [string]$Auth = 'mypdi',
    [string]$ScopeSuffix = '',
    [switch]$SkipInstall,
    [switch]$SkipNpm
)

$ErrorActionPreference = 'Continue'
$KitRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $KitRoot
$StateFile = Join-Path $KitRoot '.setup-state.json'
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$Timings = @()

# ---------- 小道具 ----------
function Say($msg) { Write-Host $msg -ForegroundColor Cyan }
function Ok($msg) { Write-Host ("[OK] " + $msg) -ForegroundColor Green }
function Fail($msg, $hint) {
    Write-Host ("[NG] " + $msg) -ForegroundColor Red
    if ($hint) { Write-Host ("  -> " + $hint) -ForegroundColor Yellow }
    Show-Summary
    exit 1
}
function Show-Summary {
    if ($script:Timings.Count -gt 0) {
        Write-Host ""
        Write-Host "所要時間:" -ForegroundColor Cyan
        $script:Timings | Format-Table -AutoSize | Out-String | Write-Host
    }
}
function Time-Step($name, [scriptblock]$body) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Say ("== " + $name)
    & $body
    $sw.Stop()
    $script:Timings += [pscustomobject]@{ 工程 = $name; 秒 = [math]::Round($sw.Elapsed.TotalSeconds, 1) }
}
function Read-Text($path) { return [System.IO.File]::ReadAllText($path) }
function Write-Text($path, $text) { [System.IO.File]::WriteAllText($path, $text, $Utf8NoBom) }
function Load-State {
    if (Test-Path $StateFile) { return (Get-Content $StateFile -Raw | ConvertFrom-Json) }
    return [pscustomobject]@{ code = ''; todoScope = ''; atfScope = ''; replaced = $false; todoScopeId = ''; atfScopeId = '' }
}
function Save-State($s) { Write-Text $StateFile ($s | ConvertTo-Json) }

# now-sdk を .cmd 経由で呼ぶ（.ps1 シムが実行ポリシーで止まっても動く）
function Invoke-NowSdk {
    param([string[]]$SdkArgs)
    $out = & now-sdk.cmd @SdkArgs
    return @($out | ForEach-Object { "$_" })
}
# now-sdk query の出力から JSON 部分だけを取り出して返す
function Query-Instance($table, $q, $fields) {
    $lines = Invoke-NowSdk @('query', $table, '-q', $q, '-f', $fields, '--auth', $Auth)
    $json = ($lines | Where-Object { $_ -notmatch '^\[now-sdk\]' }) -join "`n"
    if ([string]::IsNullOrWhiteSpace($json)) { return @() }
    try { return @($json | ConvertFrom-Json) } catch { return @() }
}

# ---------- 0. 前提 ----------
$sdk = Get-Command now-sdk.cmd -ErrorAction SilentlyContinue
if ($null -eq $sdk) { Fail "now-sdk が見つかりません" "npm install -g @servicenow/sdk を実行してください" }
$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if ($null -eq $npm) { Fail "npm が見つかりません" "https://nodejs.org から Node.js LTS を入れてください" }
foreach ($d in @('todo-app', 'atf-tests', 'fix')) {
    if (-not (Test-Path (Join-Path $KitRoot $d))) { Fail "フォルダ $d がありません" "themeB-kit.zip を展開し直し、その中で実行してください" }
}

$authList = (Invoke-NowSdk @('auth', '--list')) -join "`n"
if ($authList -notmatch ('\[' + [regex]::Escape($Auth) + '\]')) {
    Fail "now-sdk に接続先 [$Auth] が登録されていません" "now-sdk auth --add https://devXXXXXX.service-now.com --type basic --alias $Auth を実行し、自分の PDI の URL / admin / パスワードを入れてください"
}
Ok "接続先 [$Auth] を使います"

$State = Load-State

# ---------- 1. 会社コード ----------
Time-Step "会社コードの取得" {
    $rows = Query-Instance 'sys_properties' 'name=glide.appcreator.company.code' 'value'
    if ($rows.Count -eq 0 -or [string]::IsNullOrWhiteSpace($rows[0].value)) {
        Fail "会社コードを読めませんでした" "PDI が休止中かもしれません。ブラウザでログインしてから、もう一度実行してください"
    }
    $script:Code = "$($rows[0].value)".Trim()
    if ($script:Code -notmatch '^\d+$') { Fail "会社コードの形が想定外です: $($script:Code)" "" }
    Ok "会社コード = $($script:Code)（スコープ接頭辞は x_$($script:Code)_）"
}

$OldTodo = 'x_2221398_todo'
$OldAtf = 'x_2221398_atf'
$NewTodo = "x_${Code}_todo$ScopeSuffix"
$NewAtf = "x_${Code}_atf$ScopeSuffix"
foreach ($s in @($NewTodo, $NewAtf)) {
    if ($s.Length -gt 18) { Fail "スコープ名 $s が 18 文字を超えています" "-ScopeSuffix を短くしてください" }
}
if ($State.replaced -and $State.todoScope -and $State.todoScope -ne $NewTodo) {
    Fail "このキットは既に $($State.todoScope) 用に書き換え済みです" "別のスコープで使うには zip を展開し直してください"
}

# ---------- 2. 接頭辞の書き換え ----------
Time-Step "スコープ接頭辞の書き換え" {
    if ($State.replaced) { Ok "済み（飛ばします）"; return }
    $targets = @('todo-app', 'atf-tests', 'fix', 'checkpoint', 'solution') | Where-Object { Test-Path (Join-Path $KitRoot $_) }
    $exts = @('.ts', '.tsx', '.js', '.mjs', '.json', '.html', '.css', '.md')
    $files = 0; $hits = 0
    foreach ($t in $targets) {
        Get-ChildItem (Join-Path $KitRoot $t) -Recurse -File | Where-Object {
            $exts -contains $_.Extension.ToLower() -and
            $_.FullName -notmatch '\\(node_modules|dist|target|\.now)\\'
        } | ForEach-Object {
            $text = Read-Text $_.FullName
            if ($text.Contains('x_2221398_')) {
                $n = ([regex]::Matches($text, 'x_2221398_')).Count
                $new = $text.Replace($OldTodo, $NewTodo).Replace($OldAtf, $NewAtf).Replace('x_2221398_', "x_${Code}_")
                if ($new -ne $text) { Write-Text $_.FullName $new; $files++; $hits += $n }
            }
        }
    }
    $State.replaced = $true; $State.code = $Code; $State.todoScope = $NewTodo; $State.atfScope = $NewAtf
    Save-State $State
    Ok "$files ファイル / $hits か所を書き換えました（$OldTodo → $NewTodo, $OldAtf → $NewAtf）"
}

# ---------- 3. scopeId ----------
function Ensure-Scope($projectDir, $scopeName, $appName, $packageName, $stateKey) {
    $cfgPath = Join-Path $KitRoot "$projectDir\now.config.json"
    $cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
    if ($cfg.scope -eq $scopeName -and -not [string]::IsNullOrWhiteSpace($cfg.scopeId) -and $State.$stateKey -eq $cfg.scopeId) {
        Ok "$projectDir : $scopeName ($($cfg.scopeId)) 済み"
        return
    }
    # 既にインスタンスにあれば、その sys_id が scopeId
    $apps = Query-Instance 'sys_app' "scope=$scopeName" 'sys_id,name'
    $scopeId = ''
    if ($apps.Count -gt 0) {
        $scopeId = $apps[0].sys_id
        Ok "$scopeName はインスタンスに既にあります（scopeId=$scopeId）"
    } else {
        $tmp = Join-Path $env:TEMP ("themeB-init-" + $scopeName)
        if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
        New-Item -ItemType Directory -Path $tmp | Out-Null
        Push-Location $tmp
        $null = Invoke-NowSdk @('init', '--appName', $appName, '--packageName', $packageName, '--scopeName', $scopeName, '--template', 'typescript.basic', '--auth', $Auth)
        Pop-Location
        $tmpCfg = Join-Path $tmp 'now.config.json'
        if (-not (Test-Path $tmpCfg)) { Fail "$scopeName の登録（now-sdk init）に失敗しました" "PDI にログインできるか、スコープ名が 18 文字以内かを確認してください" }
        $scopeId = (Get-Content $tmpCfg -Raw | ConvertFrom-Json).scopeId
        Remove-Item $tmp -Recurse -Force
        Ok "$scopeName を登録しました（scopeId=$scopeId）"
    }
    if ([string]::IsNullOrWhiteSpace($scopeId)) { Fail "$scopeName の scopeId を取れませんでした" "" }
    $cfg.scope = $scopeName; $cfg.scopeId = $scopeId; $cfg.name = $appName
    Write-Text $cfgPath (($cfg | ConvertTo-Json) + "`n")
    $State.$stateKey = $scopeId
    Save-State $State
}
$todoAppName = 'Handson Todo'; $atfAppName = 'ATF Handson'
if ($ScopeSuffix) { $todoAppName = "Handson Todo $ScopeSuffix"; $atfAppName = "ATF Handson $ScopeSuffix" }
Time-Step "スコープ登録 (todo-app)" { Ensure-Scope 'todo-app' $NewTodo $todoAppName "handson-todo$ScopeSuffix" 'todoScopeId' }
Time-Step "スコープ登録 (atf-tests)" { Ensure-Scope 'atf-tests' $NewAtf $atfAppName "atf-handson$ScopeSuffix" 'atfScopeId' }

# ---------- 4. npm / build / deploy ----------
function Run-Npm($projectDir, [string[]]$npmArgs, $label) {
    Push-Location (Join-Path $KitRoot $projectDir)
    & npm.cmd @npmArgs
    $code = $LASTEXITCODE
    Pop-Location
    if ($code -ne 0) { Fail "$projectDir : $label が失敗しました (exit $code)" "上のエラーの先頭 3 行を講師に送ってください" }
    Ok "$projectDir : $label"
}
if (-not $SkipNpm) {
    Time-Step "npm ci (todo-app)" { Run-Npm 'todo-app' @('ci', '--no-audit', '--no-fund') 'npm ci' }
}
Time-Step "build (todo-app)" { Run-Npm 'todo-app' @('run', 'build') 'build' }
if (-not $SkipInstall) {
    Time-Step "deploy (todo-app)" { Run-Npm 'todo-app' @('run', 'deploy', '--', '--auth', $Auth) 'deploy' }
}
if (-not $SkipNpm) {
    Time-Step "npm ci (atf-tests)" { Run-Npm 'atf-tests' @('ci', '--no-audit', '--no-fund') 'npm ci' }
}
Time-Step "build (atf-tests)" { Run-Npm 'atf-tests' @('run', 'build') 'build' }

# ---------- 4b. ATF の実行設定（PDI の初期値は false。UI テストに必要） ----------
Time-Step "ATF 実行設定を true にする" {
    & node.exe (Join-Path $KitRoot 'set-atf-props.mjs') $Auth
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] 自動設定に失敗しました。自分の PDI で All → sys_properties.list を開き、sn_atf.runner.enabled と sn_atf.schedule.enabled を true にしてください" -ForegroundColor Yellow
    }
}

# ---------- 5. 確認 ----------
Time-Step "導入確認" {
    if ($SkipInstall) { Ok "deploy を飛ばしたので確認も飛ばします"; return }
    $rows = Query-Instance 'sys_db_object' "name=${NewTodo}_item" 'name,label'
    if ($rows.Count -eq 0) { Fail "テーブル ${NewTodo}_item がインスタンスに見つかりません" "deploy のログを確認してください" }
    Ok "テーブル ${NewTodo}_item を確認しました"
}

Show-Summary
Write-Host "準備完了です。" -ForegroundColor Green
Write-Host ("  アプリ  : " + $NewTodo + "  → ブラウザで All → Handson → Handson Todo board")
Write-Host ("  テスト  : " + $NewAtf + "  → 当日 atf-tests フォルダで claude を起動します")
Write-Host "  次に    : .\preflight.ps1 を実行し、全部 [OK] の画面を講師に送ってください"
