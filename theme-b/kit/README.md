# テーマB 参加者キット（案C: 自分の PDI で進める版）

このフォルダ 1 つで、当日必要なものがそろっています。**事前課題（30〜40 分）を前日までに**お願いします。

## 中身

| フォルダ / ファイル | 何か |
|---|---|
| `setup.ps1` | 事前課題で 1 回実行。自分の PDI に合わせてスコープ名を書き換え、欠陥版アプリを PDI に入れる |
| `preflight.ps1` | 準備ができているかの自動チェック。全部 OK のスクリーンショットを提出 |
| `fix.ps1` | **予備。** 当日、AI での修正が時間内に終わらなかったときだけ講師の指示で実行。アプリの修正（3 ファイル）を上書きする |
| `reset.ps1` | 修正したアプリを**欠陥版に戻す**（`buggy/` の 3 ファイルを上書き）。ハンズオン PC を次の人に渡す前に使う。続けて `cd todo-app; npm run build; npm run deploy` |
| `setup.mjs` / `preflight.mjs` / `fix.mjs` / `reset.mjs` | 上の 4 つの **Node.js 版（推奨）**。Windows / macOS / Linux 共通で、PowerShell の実行ポリシーや「デジタル署名されていません」のブロックに当たらない。`node setup.mjs`、`node preflight.mjs`、`node fix.mjs`、`node reset.mjs` と打つ。オプションは `.ps1` 版と同じ（`--auth mypdi --scope-suffix 2 --skip-install --skip-npm`） |
| `buggy/` | 欠陥版の 3 ファイル（`reset` が使う） |
| `todo-app/` | テスト対象のアプリ「Handson Todo」（**わざと欠陥が入った版**）。当日の後半、ここで AI（Claude Code）に修正させる |
| `atf-tests/` | 当日、AI（Claude Code）にテストを書かせる場所。最初は空 |
| `fix/` | アプリの修正版ファイル（`fix.ps1` が使う。中を先に読まないでください） |
| `checkpoint/`, `solution/` | 詰まったときに講師の指示でコピーするファイル |

## 事前課題（前日までに）

1. **PDI を用意する。** お持ちでない方は https://developer.servicenow.com で取得（10 分）。
2. **道具を入れる。** Node.js LTS、`npm install -g @servicenow/sdk`、`npm install -g @anthropic-ai/claude-code`。
3. このフォルダを右クリック →「ターミナルで開く」。
4. 接続先を登録する。`devXXXXXX` を自分の PDI に置き換えて打つ（URL を省くと `Missing required argument for --add` で止まる）。聞かれたらユーザー名 `admin`、パスワードの順に答える。
   ```
   now-sdk auth --add https://devXXXXXX.service-now.com --type basic --alias mypdi
   ```
   確認は `now-sdk auth --list`。`[mypdi]` の行に自分の URL が出れば OK。
5. セットアップを実行する（5 分ほど。最後に「準備完了です」と出れば成功）。**推奨は Node 版**（PowerShell の設定に左右されない）:
   ```
   node setup.mjs
   ```
   PowerShell 版 `.\setup.ps1` でも同じことができます。こちらで「スクリプトの実行が無効」と出たら:
   ```
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
   と打って `Y`、もう一度 `.\setup.ps1`。
   「デジタル署名されていません」「UnauthorizedAccess」と出たら（ブラウザでダウンロードした zip を展開したときに付くブロックが原因）:
   ```
   Get-ChildItem -Recurse *.ps1 | Unblock-File
   ```
   と打ってから、もう一度 `.\setup.ps1`。急ぐときは `powershell -ExecutionPolicy Bypass -File .\setup.ps1` でも実行できます。
6. （自動）`setup.ps1` の最後で、ATF の実行設定 `sn_atf.runner.enabled` と `sn_atf.schedule.enabled` が **true** になります。黄色で「自動設定に失敗」と出たときだけ、自分の PDI で **All → sys_properties.list** を開いて 2 つを true にしてください。
7. チェックを実行し、全部 OK のスクリーンショットを講師に送る。
   ```
   node preflight.mjs
   ```
   （PowerShell 版は `.\preflight.ps1`）
8. ブラウザで **All → Handson → Handson Todo board** を開き、タスクを 1 つ作れることを確認する。

うまくいかないときは、赤字の行をそのままコピーして講師に送ってください。

## 当日

- 開始 30 分前に自分の PDI にログインしておく（休止から起こすため）。
- 当日の手順はすべてチャットに貼られます。`atf-tests` フォルダで `claude` を起動するところから始まります。
- 後半は `todo-app` フォルダで `claude` を起動し、チャットに貼られた文を貼ってアプリを直します。`node fix.mjs`（または `fix.ps1`）は講師から指示があったときだけ使います。

## PowerShell スクリプトを使わない進め方（まとめ）

`.ps1` を一切使わなくても、次の 4 コマンドで同じことができます。実行ポリシーの変更や `Unblock-File` は不要です。

| やること | コマンド（キットのフォルダで） |
|---|---|
| セットアップ | `node setup.mjs` |
| 事前チェック | `node preflight.mjs` |
| アプリの修正（予備） | `node fix.mjs` → `cd todo-app` → `npm run build` → `npm run deploy` |
| 欠陥版に戻す | `node reset.mjs` → `cd todo-app` → `npm run build` → `npm run deploy` |
| ATF 設定だけやり直す | `node set-atf-props.mjs mypdi` |

`setup.mjs` は Windows で `.ps1` 版と同じ結果になることを確認済み（2026-09-17）。Mac / Linux ではこの Node 版だけが動きます。
