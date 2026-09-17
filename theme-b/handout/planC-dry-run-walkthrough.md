# テーマB 案C 通し試験の手順（Release のダウンロードから最後まで・別環境用）

50 分版 v2 原稿（`docs/theme-b-script-planC-50min-v2.md`）で参加者が打つ操作を、Release の zip 取得から再テストまで順に並べたもの。各手順に「成功の目印」と「詰まったときの対処」を付けた。
講師が **別の PC + 別の PDI** で一人通しをするときのチェックリスト。

---

## 0. 試験環境の前提（本番のグループ PC と同じ状態にしておく）

| 項目 | 状態 | 確認コマンド |
|---|---|---|
| Node.js LTS | 入っている | `node -v` |
| ServiceNow SDK | `npm install -g @servicenow/sdk` 済み | `now-sdk --version` |
| Claude Code | `npm install -g @anthropic-ai/claude-code` 済みで **ログイン済み** | `claude --version`。任意のフォルダで `claude` → 入力欄が出て `/exit` |
| PowerShell 実行ポリシー | RemoteSigned | `Get-ExecutionPolicy -Scope CurrentUser` |
| PDI | 講師と**会社コードが違う** PDI。ブラウザで admin ログイン済み（休止から起こしてある） | ログイン後に画面が出る |
| キット | **展開しない**（本編で展開する）。`now-sdk auth` も**未登録** | `now-sdk auth --list` に `mypdi` が無い |

🆘 `claude` で「ログインしてください」→ ブラウザが開くので Anthropic アカウントでログイン。本番のグループ PC は前日に済ませる。
🆘 実行ポリシーが Restricted → `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` → `Y`。

---

## 1. キットを展開（原稿 3-1）

1. ブラウザで https://github.com/Fukuda-Keiju/claude-handson/releases/tag/theme-b-kit-v2 を開き、Assets の `themeB-kit.zip` をダウンロード。
2. ダウンロードした zip を右クリック → 「すべて展開」→ 展開先を **デスクトップ** にして展開。
3. できた `themeB-kit` フォルダを開く。中に `setup.ps1` が見えることを確認。
4. その場所の何もない所で右クリック → 「ターミナルで開く」。
5. 開いたターミナルで次を打つ（出力は何も出ない）。
   ```
   Get-ChildItem -Recurse *.ps1 | Unblock-File
   ```

**成功の目印**: プロンプトのパスが `\themeB-kit>` で終わり、`dir` で `setup.ps1` `preflight.ps1` `todo-app` `atf-tests` が見える。

🆘
- `themeB-kit\themeB-kit` と二重になった → 内側（`setup.ps1` がある方）で「ターミナルで開く」。
- 「ターミナルで開く」が出ない → スタート → 「ターミナル」→ `cd $HOME\Desktop\themeB-kit`。
- 手順 5 を忘れて次の `setup.ps1` が「デジタル署名されていません / UnauthorizedAccess」→ 手順 5 を打ってからやり直す（2026-09-17 パイロット PC で発生）。急ぐなら `powershell -ExecutionPolicy Bypass -File .\setup.ps1`。

---

## 2. PDI への接続を登録（原稿 3-2）

6. `devXXXXXX` を自分の PDI に置き換えて打ち、質問に答える。
   ```
   now-sdk auth --add https://devXXXXXX.service-now.com --type basic --alias mypdi
   ```
   - Username: `admin`
   - Password: PDI の admin パスワード（打っても表示されない）

   URL を省いて `now-sdk auth --add --alias mypdi` と打つと、ヘルプが流れて最後に `Missing required argument for --add` と出る（2026-09-17 パイロットで発生）。URL は `--add` の直後に必ず付ける。
7. 確認。
   ```
   now-sdk auth --list
   ```

**成功の目印**: `[mypdi]` の行に自分の PDI の URL が出る。

🆘
- 「スクリプトの実行が無効」→ `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` → `Y` → もう一度。
- `now-sdk` が見つからない → `npm install -g @servicenow/sdk`（1〜2 分）→ ターミナルを開き直す。
- パスワードを打ち間違えた → `now-sdk auth --delete mypdi` → もう一度 `--add`。
- 認証エラー（401）→ PDI が休止中の可能性。ブラウザで PDI にログインし直してから再実行。

---

## 3. アプリを自分の PDI に入れる（原稿 3-3）

8. 同じターミナルで実行。4〜5 分。
   ```
   .\setup.ps1
   ```
   走っている間に出る行と意味:
   - `会社コード = NNNNNNN` → 講師の `2221398` と**違う数字**であることを確認（メモしておく）
   - `21 ファイル / 48 か所を書き換えました（x_2221398_todo → x_NNNNNNN_todo, ...）`
   - `x_NNNNNNN_todo を登録しました（scopeId=...）` / `x_NNNNNNN_atf を登録しました`
   - `npm ci` → `build` → `deploy`（todo-app）→ `npm ci` → `build`（atf-tests）
   - `sn_atf.runner.enabled を false → true にしました`（初回はここで false → true になるはず）
   - `テーブル x_NNNNNNN_todo_item を確認しました`
   - 工程別の秒数の表 → **スクリーンショット**

**成功の目印**: 緑で「準備完了です。」。所要時間を記録（講師 PDI では 292 秒）。

🆘
- 「会社コードを読めませんでした」→ PDI 休止か接続先違い。ブラウザで PDI にログイン → `.\setup.ps1`（済んだ工程は飛ぶ）。
- `Unable to install application as application was null` → 接続先が別の PDI を指している。`now-sdk auth --list` の URL を確認 → 直して `.\setup.ps1 -SkipNpm`。
- `npm ci` でネットワークエラー → Wi-Fi 確認 → `.\setup.ps1`（npm ci からやり直す）。
- build が型エラーで止まる → エラー先頭 3 行を記録。キット側の問題なので講師が調べる。
- 黄色で「自動設定に失敗」→ PDI で All → `sys_properties.list` → `sn_atf.runner.enabled` と `sn_atf.schedule.enabled` を `true` に。

---

## 4. 確認（原稿 3-4）

9. 続けて実行。
   ```
   .\preflight.ps1
   ```

**成功の目印**: 12 項目すべて `[OK]`、「準備完了です。この画面のスクリーンショットを講師に送ってください。」

🆘 `[NG]` の行は `->` の後ろに直し方がある。多いのは「接続先が未登録」（手順 6）と「アプリが入っていない」（PDI が休止 → ログインして `.\setup.ps1`）。

---

## 5. アプリを触る（原稿 4 章）

10. PDI のブラウザで、左上 **All** → 検索欄に `Handson` → **Handson Todo board**。
11. **New** → タイトルを入れて **Save** → 一覧に出る。ボードでカードを隣の列に動かす。開く、消す。**空タイトルの保存は試さない**（試すと後半のネタバレ。試験では 1 回だけ試して「保存できてしまう」ことを確認してもよい）。

🆘 メニューに Handson が出ない → F5。それでも出なければ deploy が入っていない → `.\setup.ps1 -SkipNpm`。

---

## 6. Claude Code でテスト生成（原稿 5 章。プロンプト①）

12. `themeB-kit\atf-tests` フォルダを開き、何もない所で右クリック → 「ターミナルで開く」。
13. `claude` → 「このフォルダを信頼しますか」→ Yes。
14. 入力欄に次をそのまま貼って Enter。聞かれたら Yes。「build が通りました」まで待つ（5〜8 分）。**Yes を押した回数と所要時間を記録。**

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

**成功の目印**: `src\fluent\atf\` に `.now.ts` が 4 本前後（テスト 3 + スイート 1、UI テストは `.script.js` も）でき、build 成功の報告。3 本目が何を確かめているかをメモ。

🆘
- `claude` が「ログインしてください」→ 指示どおりログイン（前提の漏れ）。
- 10 分たっても終わらない → Esc で止め、`atf-tests\src\fluent\atf\` のできかけファイルを全部削除 → `themeB-kit\checkpoint` の全ファイルをそこにコピー → 手順 15 へ。
- build が落ちたまま Claude が直せない → 同じく Checkpoint に切り替える。

---

## 7. 送って実行（原稿 6 章）

15. `claude` を Esc で抜ける（または別ターミナルを `atf-tests` で開く）。
    ```
    npm run build
    npm run deploy
    ```
16. PDI のブラウザで **All** → 検索欄に `Automated Test` → **Tests**。
17. 一覧上部の絞り込みで Application 列に `ATF Handson` と入れる。3 本出る（出なければ F5）。
18. 1 本目を開く → 右上 **Run Test** → 小さな画面の **Run Test**。
19. 「Client Test Runner」タブが自動で開く。**閉じない。** 元のタブに戻る。
20. Status が Success（緑）になるのを見る。残り 2 本も同じく。UI テストのときは Runner タブで画面が勝手に動く。

**成功の目印**: 3 本とも緑。**UI テストが緑になったか**を記録（未確認項目）。

🆘
- deploy が赤字 → 先頭 3 行を読む。`401`/`auth` → 手順 6 をやり直す。`scopeId` → `.\setup.ps1 -SkipNpm -SkipInstall`（atf-tests 側の scopeId を採り直す。1 分）。
- Run Test の後「Waiting for a test runner」のまま → ポップアップがブロックされている。アドレスバー右端のアイコンで許可 → もう一度 Run Test。または All → Automated Test Framework → **Client Test Runner** を手で開く。
- UI テストが Pending のまま → ATF 設定が false。キットのフォルダで `node set-atf-props.mjs mypdi`、または `sys_properties.list` で 2 つを true。
- UI テストだけ赤（要素が見つからない）→ PDI のバージョン差の可能性。赤いステップの Output とスクリーンショットを記録。サーバー側 2 本が緑なら先へ進む。
- Application 列に出ない → Tests 一覧の絞り込みを消して名前で探す。それでも無ければ deploy が入っていない。

---

## 8. 仕様書を保存（原稿 7 章）

21. 次の 5 行をメモ帳に貼り、`themeB-kit\atf-tests\docs\spec.md` として保存（種類「すべてのファイル」）。
    ```
    Handson Todo 仕様（抜粋）
    1. タスクにはタイトルが必須である。空欄では新規作成も保存もできず、エラーが表示される。
    2. タイトルは 100 文字以内である。
    3. 状態は Open / In Progress / Done の 3 つである。
    4. 状態を Done にすると completed_at に日時が自動で入る。
    5. ボード画面ではカードを隣の列にだけ移動できる。
    ```

🆘 `spec.md.txt` になった → エクスプローラーで拡張子を表示して直す。`docs` フォルダが無い → 作る。

---

## 9. Negative を追加して赤を出す（原稿 8 章。プロンプト②）

22. `atf-tests` のターミナルで `claude` → 次を貼って Enter。聞かれたら Yes。「build が通りました」まで待つ。

```
docs/spec.md に仕様書を置きました。仕様と今のテストを照らし合わせ、
仕様で禁止されている操作が拒否されることを確認する Negative Test を 1 本追加してください。
既存テストの期待値が仕様と矛盾している場合は仕様に合わせて直してください。
npm run build が通ることを確認してください。deploy はしないでください。
```

23. Esc → `npm run build` → `npm run deploy`。
24. Tests 一覧を F5 → 増えた Negative を開く → **Run Test** → **Run Test**。
25. Status が **Failure（赤）**。結果画面下の Test Result Items で赤いステップをクリック → Output に「Inserted record ... when insert was expected to fail」。

**成功の目印**: Negative が赤、Output のメッセージが上記。

🆘
- Negative が緑になる → テストが「保存できる」を期待して書かれている（AI が今の動きを正解にした例）。`themeB-kit\solution\t4-empty-title-server.now.ts` **だけ**を `atf-tests\src\fluent\atf\` にコピー（`todo-suites.now.ts` はコピーしない。ファイル名が合わず build が落ちる）→ build → deploy → F5 → 「空タイトルはサーバーで拒否される (Negative)」を Run Test。
- 生成が終わらない → 同じく Solution の T4 をコピー。

---

## 10. Claude Code でアプリを直す（原稿 9 章。プロンプト③）

26. `themeB-kit\todo-app` フォルダを開き、何もない所で右クリック → 「ターミナルで開く」（**atf-tests ではない**）。
27. `claude` → 信頼確認 Yes → 次を貼って Enter。聞かれたら Yes。「build が通りました」まで待つ（非対話で 116 秒。対話では Yes の分だけ長い。**回数と時間を記録**）。

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

28. 報告に「変更したファイル 3 つ」と「build 成功」があることを確認。
29. Esc → `npm run build` → `npm run deploy`（合わせて 1 分ほど）。

**成功の目印**: 変更が `validate-title.ts` / `TodoForm.tsx` / `todo-item.now.ts` の 3 つだけ。deploy に「Installation completed」。

🆘
- 4 分たっても終わらない、build が落ち続ける → Esc → `themeB-kit`（todo-app の 1 つ上）で
  ```
  .\fix.ps1
  cd todo-app
  npm run build
  npm run deploy
  ```
- `fix.ps1` が「setup.ps1 がまだ実行されていません」→ 別のフォルダで打っている。デスクトップの `themeB-kit` を開き直す。
- deploy が `scopeId` で失敗 → `.\setup.ps1 -SkipNpm`（todo-app 側を採り直す。1 分半）。
- Claude が `keys.ts` や `now.config.json` を触った → `CLAUDE.md` のルール違反。記録して `fix.ps1` で上書き。

---

## 11. 再テスト（原稿 9 章）

30. Tests 一覧で Negative を開く → **Run Test** → **Run Test** → 今度は **Success（緑）**。
31. 続けて Positive のサーバー側 1 本（タイトル付きで作成 → open）→ 緑のまま。時間があれば残りの Positive 2 本も。
32. （任意）ボードで New → タイトル空欄で Save → 赤いエラー「タイトルは必須です」が出て保存されないことを目で確認。

**成功の目印**: Negative 緑、Positive 緑のまま。これで「緑 → 赤 → 直して緑」が一巡。

🆘
- Negative が赤のまま → deploy 完了前に押している。30 秒待って再実行。それでも赤なら Output を見る。「Inserted record」なら `todo-app\src\server\business-rules\validate-title.ts` に `setAbortAction` があるか確認 → 無ければ `fix.ps1`。
- Positive が赤になった → AI が既存の動きを壊した。差分を記録し、`fix.ps1` で上書き → build → deploy → 再テスト。

---

## 12. 試験後の後始末（本番で同じ PC・PDI を使う場合は必須）

33. 欠陥版に戻して本番の初期状態にする場合: `themeB-kit` で `.\reset.ps1` → `cd todo-app` → `npm run build` → `npm run deploy`。Tests 一覧で Negative を Run Test すると赤に戻る。
34. PC を「キット未展開・接続未登録」に戻す場合: デスクトップの `themeB-kit` と zip を削除 → `now-sdk auth --delete mypdi`。
35. PDI を「アプリなし」に戻す場合: PDI で All → `sys_app.list` → **Handson Todo** と **ATF Handson** を開いて Delete（Delete で関連テーブル・テスト・レコードも消える）。本番で同じ PDI を使うなら必ず行う。残っていると `setup.ps1` が「既にあります」で通り抜け、欠陥版が入らない。

---

## 13. 記録してほしい数字

| 場面 | 記録 |
|---|---|
| 手順 8 | `setup.ps1` の合計秒数、会社コード、ATF 設定が false → true になったか |
| 手順 14 | プロンプト①の所要時間、Yes の回数、3 本目の内容 |
| 手順 20 | UI テストが緑になったか、Runner タブの挙動 |
| 手順 25 | Negative が赤になったか、Output の文言 |
| 手順 27 | プロンプト③の所要時間、Yes の回数、変更ファイルが 3 つだけか |
| 手順 30〜31 | 再テストの結果 |
| 全体 | 手順 1 から 31 までの合計時間（本番の 3〜48 分に収まるか） |
