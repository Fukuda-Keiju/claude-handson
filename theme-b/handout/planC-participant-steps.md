# テーマB 案C 参加者の操作一覧（通し試験用）

参加者が「事前課題」と「当日 60 分」で実際に打つ・押す操作だけを、順番に並べたもの。講師が一人で通し試験をするときのチェックリストにも使う。
原稿は `docs/theme-b-script-planC.md`、キットの説明は `theme-b/kit/README.md`。

---

## 0. 通し試験をする前に（講師向けの注意）

- **講師 PDI（`dev192510`、会社コード 2221398）で試すときは、必ず `.\setup.ps1 -ScopeSuffix 3` のように接尾辞を付ける。** 付けずに実行すると、講師用アプリ `x_2221398_todo` と同じスコープに欠陥版を deploy してしまい、ID の違う Business Rule・メニュー・UI Page が重複する。接尾辞 2 は既に使用済み（`x_2221398_todo2` は今は修正版）。
- 別の PDI（会社コードが違う）で試すときは接尾辞なしでよい。それが本番の参加者と同じ条件。
- 必要なもの: PDI の URL と admin パスワード、Node.js LTS、`@servicenow/sdk`、`@anthropic-ai/claude-code`（Anthropic アカウントでログイン済み）、キット `theme-b/dist/kit/themeB-kit.zip`。

---

## 1. 事前課題（前日 17:00 まで。30〜40 分）

### 前提

- 自分の PDI があること。無い人は https://developer.servicenow.com にサインアップし、Request Instance で取得する（10 分ほど）。
- Anthropic アカウント（Claude Code のログインに使う）があること。
- 講師から配布された `themeB-kit.zip` が手元にあること。

### 手順（Windows）

1. **Node.js LTS を入れる。** https://nodejs.org から LTS の Windows インストーラーを落とし、既定のまま進めて Install。
2. **ターミナルを開いて 2 つのツールを入れる。** スタート → 「ターミナル」で開き、1 行ずつ打つ。
   ```
   npm install -g @servicenow/sdk
   npm install -g @anthropic-ai/claude-code
   ```
3. **入ったか確認する。** 3 つともバージョン番号が出れば OK。
   ```
   node -v
   now-sdk --version
   claude --version
   ```
4. **キットを展開する。** `themeB-kit.zip` をデスクトップに置き、右クリック → 「すべて展開」。`Desktop\themeB-kit` の中に `setup.ps1` があることを確認する。二重フォルダ（`themeB-kit\themeB-kit`）になっていたら内側を使う。
5. **キットのフォルダをターミナルで開く。** `themeB-kit` を開き、何もない所で右クリック → 「ターミナルで開く」。プロンプトのパスが `themeB-kit` で終わっていることを確認する。
6. **接続先を登録する。** 次を打ち、質問に順番に答える。
   ```
   now-sdk auth --add --alias mypdi
   ```
   - Instance URL: 自分の PDI の URL（`https://devXXXXXX.service-now.com`）
   - 認証方式: `basic`
   - ユーザー名: `admin`
   - パスワード: PDI の admin パスワード

   確認は `now-sdk auth --list`。`[mypdi]` が出れば OK。
7. **セットアップを実行する。** 5 分ほど（2026-09-16 実測 292 秒）。最後に緑で「準備完了です。」と出れば成功。
   ```
   .\setup.ps1
   ```
   「このシステムではスクリプトの実行が無効になっている」と出たら、次を打って `Y` → もう一度 `.\setup.ps1`。
   ```
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
   PDI が休止中で失敗したら、ブラウザで PDI にログインして起こしてから、もう一度実行する。
8. **黄色で「自動設定に失敗」と出たときだけ**、PDI で All → 検索欄に `sys_properties.list` → `sn_atf.runner.enabled` と `sn_atf.schedule.enabled` を開いて Value を `true` にする。
9. **チェックを実行する。** 全部 `[OK]` で「準備完了です。この画面のスクリーンショットを講師に送ってください。」と出れば完了。
   ```
   .\preflight.ps1
   ```
   `[NG]` の行は `->` の後ろに直し方が書いてある。それに従って直し、もう一度実行する（下表も参照）。
10. **アプリが入ったか PDI で確認する。** ブラウザで PDI にログイン → All → 検索欄に `Handson` → **Handson Todo board** → **New** → タイトルを入れて **Save**。一覧にタスクが出れば OK。
11. **Claude Code のログインを済ませる。** `themeB-kit\atf-tests` を「ターミナルで開く」→ `claude` → 指示どおりブラウザでログイン → 入力欄が出たら `/exit`。当日ここで時間を使わないための準備。
12. **提出する。** 手順 9 と 10 のスクリーンショットを講師に送る（前日 17:00 まで）。

### preflight.ps1 が見ている項目

すべて `[OK]` になる必要がある。

| 項目 | NG のとき |
|---|---|
| Node.js が入っている | 手順 1 |
| now-sdk が入っている | `npm install -g @servicenow/sdk` |
| PowerShell 実行ポリシーが RemoteSigned 以上 | 手順 7 の `Set-ExecutionPolicy` |
| Claude Code (claude) が入っている | `npm install -g @anthropic-ai/claude-code` |
| setup.ps1 がある（themeB-kit フォルダで実行している） | `themeB-kit` で「ターミナルで開く」をやり直す |
| setup.ps1 を実行済み（.setup-state.json がある） | `.\setup.ps1` |
| todo-app の scopeId が入っている | `.\setup.ps1` |
| atf-tests の npm install 済み（node_modules がある） | `.\setup.ps1` |
| atf-tests に CLAUDE.md がある | zip を展開し直す |
| now-sdk に接続先 [mypdi] が登録されている | 手順 6 |
| 自分の PDI にアプリが入っている | PDI にログインして起こし、`.\setup.ps1` をもう一度 |
| ATF の実行設定 2 つが true | 手順 8 |

### Mac の参加者

`.ps1` の代わりに Node.js 版を使う。手順 7 は `node setup.mjs`。preflight の Node 版は無いので、`node setup.mjs` の最後に「準備完了です」が出た画面と手順 10 のスクリーンショットを送る。当日の予備 `fix.ps1` は `node fix.mjs`。

---

## 2. 当日 60 分の操作

### 開始前 10 分

1. 自分の PDI にブラウザでログインしておく（休止から起こす）。
2. `themeB-kit` を「ターミナルで開く」→ `.\preflight.ps1`。
3. 全部 `[OK]` ならチャットに「OK」。`[NG]` があればその行をそのまま貼る。

### 0〜5 分　Claude Code を起動

4. `themeB-kit\atf-tests` フォルダを「ターミナルで開く」→ `claude` と打って Enter。
5. 「このフォルダを信頼しますか」→ Yes。入力欄が出たら**まだ何も打たない**。

### 5〜10 分　アプリを触る

6. 自分の PDI で All → 検索欄 `Handson` → **Handson Todo board**。
7. 3 分間自由に触る（作る、列を動かす、開く、消す）。**空タイトルでの保存は試さなくてよい**（試すと後半のネタバレになる）。

### 10〜22 分　プロンプト①（テスト生成）

8. `claude` の入力欄に次をそのまま貼って Enter。聞かれたら Yes。「build が通りました」まで待つ（5〜8 分）。deploy はまだしない。

```
このプロジェクトは ServiceNow Fluent SDK の ATF テスト専用プロジェクトです。
テスト対象は同じインスタンス上の別スコープのアプリ「Handson Todo」です。
スコープ名・テーブル名・画面の URL は CLAUDE.md の「テスト対象アプリ」の節に書いてあります。それを使ってください。
CLAUDE.md のルールに従って、次の 3 本の ATF テストと、それをまとめた TestSuite を src/fluent/atf/ に作ってください。
1. Positive（サーバー）: タイトル付きでレコードを作成でき、state の初期値が open であること
2. Positive（UI）: ボード画面で New を押し、タイトルを入力して Save すると一覧に表示されること
3. 今のアプリの挙動を確認したうえで、もう 1 本、あなたが妥当だと思うテストを追加する
作り終えたら npm run build が通ることを確認してください。deploy はしないでください。
```

9. 投票 1 に答える（何本が緑になるか）。

（予備）22 分になっても終わらない → `claude` を Esc で止め、`atf-tests\src\fluent\atf\` のできかけファイルを全部削除してから、`themeB-kit\checkpoint` の全ファイルをそこにコピー。

### 22〜30 分　送って、自分の PDI で実行

10. `claude` を Esc で抜けるか、別のターミナルを `atf-tests` で開いて:
    ```
    npm run build
    npm run deploy
    ```
    「Installed」や「success」で成功（1〜2 分）。
11. 自分の PDI で All → 検索欄 `Automated Test` → **Tests**。
12. 一覧上部の絞り込みで Application 列に `ATF Handson` と入れる。自分のテストが 3 本出る（出なければ F5）。
13. 1 本目を開く → 右上 **Run Test** → 小さな画面の **Run Test**。
14. 「Client Test Runner」のタブが自動で開く。**閉じない。**
15. 元のタブに戻り、Status が Success（緑）になるのを見る。
16. 残り 2 本も同じように実行。UI テストのときは Runner のタブが勝手に動く。
17. 3 本とも緑になったらチャットに「緑3」。

### 30〜35 分　仕様書を受け取る

18. チャットに貼られた仕様書 5 行をコピーする。
19. メモ帳で新規作成 → 貼る → 名前を付けて保存 → 場所 `themeB-kit\atf-tests\docs`、ファイル名 `spec.md`、種類「すべてのファイル」。`docs` フォルダが無ければ保存ダイアログ内で新規作成する。
20. 自分の 3 本のテストと仕様書を見比べる。「3 本目は仕様の何番を確かめているか」を考える。

### 35〜43 分　プロンプト②（Negative 追加）→ 赤

21. `atf-tests` のターミナルで `claude` を起動し、次を貼って Enter。聞かれたら Yes。「build が通りました」まで待つ。

```
docs/spec.md に仕様書を置きました。仕様と今のテストを照らし合わせ、
仕様で禁止されている操作が拒否されることを確認する Negative Test を 1 本追加してください。
既存テストの期待値が仕様と矛盾している場合は仕様に合わせて直してください。
npm run build が通ることを確認してください。deploy はしないでください。
```

22. 終わったら `npm run build` → `npm run deploy`。
23. Tests 一覧を F5。増えた Negative のテストを開き **Run Test** → **Run Test**。
24. Status が Failure（赤）になる。チャットに「赤」。
25. 投票 2 に答える（赤の原因は 4 分類のどれか）。
26. 結果画面の下 Test Result Items で赤いステップをクリック → Output 欄を読む（「Inserted record ... when insert was expected to fail」）。

（予備）Negative が緑になった、または生成が終わらない → `themeB-kit\solution\t4-empty-title-server.now.ts` **だけ**を `atf-tests\src\fluent\atf\` にコピー（`todo-suites.now.ts` はコピーしない）→ build → deploy → F5 → 「空タイトルはサーバーで拒否される (Negative)」を Run Test。

### 43〜51 分　プロンプト③（アプリを直す）→ 再テスト

27. `themeB-kit\todo-app` フォルダを「ターミナルで開く」（**atf-tests ではない**）→ `claude` → 信頼しますか → Yes。
28. 次を貼って Enter。聞かれたら Yes。「build が通りました」まで待つ（2〜4 分）。

```
このプロジェクトは ServiceNow Fluent SDK で作ったアプリ「Handson Todo」です。
次の仕様が守られていません。
  仕様 1: タスクにはタイトルが必須である。空欄では新規作成も保存もできず、エラーが表示される。
ATF の Negative Test「空タイトルで insert すると失敗するはず」が赤になりました。Output は次のとおりです。
  Inserted record ... when insert was expected to fail
サーバー側・画面側・テーブル定義の 3 か所で仕様 1 が守られるように直してください。
- サーバー側: Business Rule のスクリプト（src/server/business-rules/validate-title.ts）で、前後の空白を除いたタイトルが空なら
  gs.addErrorMessage('タイトルは必須です') を出し、current.setAbortAction(true) で保存を中止する
- 画面側: 作成フォーム（src/client/components/TodoForm.tsx）で、タイトルが空のまま Save されたら
  'タイトルは必須です' をエラーとして表示し、サーバーに送らない
- テーブル定義: src/fluent/tables/todo-item.now.ts の title を mandatory: true にする
既存の動き（空白の前後を整える処理、他の列、デモデータ）は変えないでください。
終わったら、変更したファイルと変更点を短く一覧にして見せてください。
npm run build が通ることを確認してください。deploy はしないでください。
```

29. 「build が通りました」の報告と、変更ファイル 3 つの一覧を確認。チャットに「修正OK」。
30. `claude` を Esc で抜けるか、別のターミナルを `todo-app` で開いて:
    ```
    npm run build
    npm run deploy
    ```
    「Installed」や「success」で成功（1 分ほど）。
31. Tests 一覧で Negative のテストを開き **Run Test** → **Run Test** → 今度は緑。
32. 続けて最初の Positive 3 本も実行 → 緑のまま。
33. 4 本とも緑になったらチャットに「緑緑」。

（予備）47 分になっても修正が終わらない、build が落ちる → `claude` を Esc で止め、`themeB-kit`（todo-app の 1 つ上）を「ターミナルで開く」→
```
.\fix.ps1
cd todo-app
npm run build
npm run deploy
```

### 51〜55 分　振り返り

34. チャットに 1 行ずつ書く。「プロダクトを見て作ったテストで確かめられなかったものは何か、なぜか」「自分でアプリを直して再テストしたとき何を感じたか」。
35. 投票 3 に答える（AI にテストを書かせるなら最初に渡すものは何か）。

### 55〜60 分

36. 操作なし。講師の話を聞く。

---

## 3. 通し試験のチェック欄（講師用）

| 場面 | 見るもの | 実測メモ |
|---|---|---|
| 事前課題 6 | `setup.ps1` の合計秒数（見立て 5 分。2026-09-16 実測 292 秒） | |
| 当日 8 | プロンプト①の所要時間と Yes を押した回数（見立て 5〜8 分） | |
| 当日 13〜16 | Runner タブが開くか。UI テストが緑になるか（**未確認項目**） | |
| 当日 21 | プロンプト②で Negative が生成され、赤になるか | |
| 当日 28 | プロンプト③の所要時間と Yes の回数（非対話で 116 秒。対話は未計測） | |
| 当日 31〜32 | Negative 緑、Positive 3 本が緑のまま | |
