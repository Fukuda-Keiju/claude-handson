# ATF（Automated Test Framework）知識まとめ — テーマB「AI駆動で確かめる」向け

対象: ServiceNow SDK（Fluent）× ATF のハンズオンを**説明する側**が押さえておく知識。
社員向け 60 分ハンズオン（2026-09-18）で、参加者からの質問に答えられる範囲を厳選した。
実物は `src/fluent/atf/` の 13 テスト + 1 スイート。すべて PDI `mypdi` で 13/13 合格済み（2026-09-15）。

---

## 1. ATF とは（30 秒で言う版）

- ServiceNow に**標準搭載**されているテスト自動化フレームワーク。追加ライセンス不要。
- 「テスト = ステップの並び」。ステップは *レコードを作る / 画面を開く / 値を確認する* のような部品で、**上から順に実行**される。
- 結果はインスタンスのテーブルに残る（後述）。スクリーンショットも自動で撮る。
- 従来は Studio の GUI でポチポチ作っていた。**Fluent SDK では TypeScript で書ける**ので、Git 管理・AI 生成・レビューができる。ここがテーマ B の核。

### 用語と対応テーブル

| 用語 | 何か | テーブル |
|---|---|---|
| Test | 1 本のテスト。名前・説明・ステップ群 | `sys_atf_test` |
| Step | テストの 1 手順（recordInsert など） | `sys_atf_step` |
| Test Suite | テストの束。実行順あり。入れ子可 | `sys_atf_test_suite` / 所属 `sys_atf_test_suite_test` |
| Test Result | テスト 1 回分の結果（success / failure / error） | `sys_atf_test_result`、ステップ単位 `sys_atf_test_result_step` |
| Suite Result | スイート 1 回分の集計（成功数 / 失敗数 / 実行時間） | `sys_atf_test_suite_result` |
| Client Test Runner | UI ステップを実際に動かす**ブラウザのタブ** | `sys_atf_agent`（ランナー登録） |

---

## 2. テーマ B のストーリー（なぜやるか）

Golden Path: **Positive/Negative のベースライン → 複数カテゴリで検証 → Capability Matrix → 失敗分析 → 再テスト**

- **Positive / Negative**: ルールが「成立するとき」と「成立しないとき」を別テストにする。
  例: Business Rule「done なら completed_at をセット」→ `done で作ると入る` と `open で作ると空のまま` の 2 本。
- **トリガー全網羅**: ルールが insert と update の両方で動くなら、両経路を別テストで踏む。今回の completed_at は 4 本（insert 肯定 / insert 否定 / update 肯定 / update 否定=クリア）。
- **Capability Matrix**: 「アプリの機能 × テストの有無」の表。今回の 13 本を並べたものが §6。
- **UI の成功メッセージを信じない**: 画面で「保存しました」と出ても、`atf.server.recordQuery` / `recordValidation` で **DB を直接確認**する。今回の新規作成テストと Kanban 移動テストがこの型。

---

## 3. Fluent SDK で ATF を書く

### 3.1 ファイル配置

```
src/fluent/atf/
  completed-at-rule.now.ts        # サーバー側 4 テスト（Business Rule）
  navigator-modules.now.ts        # ナビゲーターのモジュール表示
  task-board-*.now.ts             # UI テスト本体（Test 定義）
  task-board-*.script.js          # UI テストのブラウザ側スクリプト（Now.include で読む）
  handson-suite.now.ts            # TestSuite（13 本を束ねる）
```

- `.now.ts` が Fluent のメタデータ定義、`.script.js` はブラウザで動く素の JavaScript。
- `.now.ts` はどの tsconfig にも含まれないので、IDE の型チェックは `node_modules/@servicenow/sdk-core/dist/app/Test.d.ts` を参照する。

### 3.2 Test() の雛形

```ts
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

export const myTest = Test(
    {
        $id: Now.ID['atf-my-test'],        // ← 一度デプロイしたら変えない（sys_id に対応）
        name: 'Handson: ...',
        description: '何を・どう検証するか 1〜2 文',
        active: true,
        failOnServerError: true,           // サーバーエラーが出たら即 fail
    },
    (atf) => {
        const ins = atf.server.recordInsert({ $id: Now.ID['atf-my-test-insert'], table: '...', fieldValues: {...} })
        atf.server.recordValidation({ $id: Now.ID['atf-my-test-check'], table: '...', recordId: ins.record_id, fieldValues: 'state=done', assert: 'record_validated' })
        atf.server.recordDelete({ $id: Now.ID['atf-my-test-cleanup'], table: '...', recordId: ins.record_id })
    }
)
```

説明で強調する点:

1. **`$id` はテストにもステップにも必要で、全体で一意**。sys_id に写像されるので、デプロイ後に変えると別レコードになる。
2. **前のステップの戻り値を次に渡す**（`ins.record_id`）。これが ATF の「ステップ出力変数」を TypeScript で表現したもの。
3. **後片付け（recordDelete）を必ず書く**。テストがインスタンスにゴミを残さない。
4. `description` は「何を」「どう」検証するかを具体的に。ハンズオン資料でもテスト一覧はこの description をそのまま使える。

### 3.3 TestSuite()

```ts
export const handsonSuite = TestSuite({
    $id: Now.ID['atf-suite-handson'],
    name: 'Handson: Task ボード 一式',
    tests: [testA, testB, { test: testC, abortOnFailure: true }],   // 配列順 = 実行順
})
```

- `TestSuite()` は**定義だけ**。実行はしない（実行は §7）。
- 速いサーバー側テストを先、ブラウザが要る UI テストを後に並べると失敗が早く分かる。
- `parent` で入れ子、`testFilter`（エンコードクエリ）で動的メンバーも可。

### 3.4 削除の注意（説明で必ず触れる）

- `.now.ts` からテスト定義を消しても、**インスタンス側のレコードは消えない**（ビルドが warning を出すだけ）。
- 消すには `Now.del('sys_atf_test', '<sys_id>')` をトップレベルに書いてデプロイする。
- 逆に「ルールが残っていて挙動だけ変わった」なら **テストを直す（削除→再作成しない）**。$id を維持すれば結果履歴が繋がる。

---

## 4. ステップのカテゴリ（どれを使うか）

| やりたいこと | 名前空間 | 今回の使用 |
|---|---|---|
| サーバー側 CRUD・検証・ユーザー作成・任意スクリプト | `atf.server` | ◎ 全テスト |
| 標準フォーム（UI16 / Workspace） | `atf.form` | × React UI Page には使えない |
| **独自 UI（React / UI Page / now-* Web Component）** | `atf.uiTestScript` | ◎ 8 本 |
| 左ナビのメニュー・モジュール表示 | `atf.applicationNavigator` | ◎ 1 本 |
| リスト・関連リスト | `atf.list` | × |
| REST API の応答検証 | `atf.rest` | × |
| Service Catalog（+ Service Portal 版） | `atf.catalog` / `atf.catalog_SP` / `atf.form_SP` | × |
| メール送受信 | `atf.email` | × |
| レポート・ダッシュボードの可視性 | `atf.reporting` / `atf.responsiveDashboard` | × |

判断の目安（質問されたら）:

- ユーザーが普段 UI でやる操作は UI 系カテゴリ、データ準備と DB 検証は `atf.server`。
- **Script Include のテスト**は `atf.server.runServerSideScript`（Jasmine 3.1 も使える）。
- **React で作った画面は `atf.form` では触れない**。`atf.uiTestScript` 一択。

### atf.server でよく使う 5 つ

| メソッド | 戻り値 | assert の値 |
|---|---|---|
| `recordInsert({ table, fieldValues })` | `{ table, record_id }` | `record_successfully_inserted` / `record_not_inserted` |
| `recordUpdate({ table, recordId, fieldValues })` | なし | `record_successfully_updated` / `record_not_updated` |
| `recordValidation({ table, recordId, fieldValues: '<エンコードクエリ>' })` | なし | `record_validated` / `record_not_found` |
| `recordQuery({ table, fieldValues: '<エンコードクエリ>' })` | `{ table, first_record }` | `records_match_query` |
| `recordDelete({ table, recordId })` | なし | `record_successfully_deleted` |

- `recordValidation` の `fieldValues` は**エンコードクエリ文字列**。よく使うのは `completed_atISEMPTY` / `completed_atISNOTEMPTY` / `state=done^completed_atISNOTEMPTY`（`^` が AND）。
- `enforceSecurity` は既定 true。ACL を無視して準備データを作りたいときだけ false。
- 参照フィールド（`impersonate` の `user` など）には **sys_id** を渡す。ユーザー名ではない。
- `moduleVisibility` の `visibleModules` には Fluent の `Record<'sys_app_module'>` を **import してそのまま渡せる**（sys_id ハードコード不要）。

---

## 5. UI Test Script（TestingLibrary）— React 画面を動かす

### 5.1 仕組み

- `atf.uiTestScript.runTest({ script: Now.include('./x.script.js') })` で、`.script.js` の中身が **Client Test Runner の iframe 内**で実行される。
- `screen` / `user` / `sn_atf` / `expect` / `waitFor` / `within` は**自動注入**。import 不要。
- トップレベル `await` で書く。スクリプトは **8000 文字まで**。
- Shadow DOM（`now-*` 部品）は**自動で貫通**する。特別な記法は要らない。

### 5.2 最低限覚える API

```js
await sn_atf.navigate('/x_2221398_handson_task_board.do?view=list')   // 相対 URL。必ず最初に
const el = await screen.findByRole('button', { name: 'New', exact: true, timeout: 15000 })
await user.click(el)
await user.type(input, 'テキスト'); await user.tab()                  // now-* 入力は blur で確定
await waitFor(async () => expect(await screen.queryByRole('dialog')).toBeNull(), { timeout: 15000 })
const search = await sn_atf.evaluate(() => location.search)           // iframe 内の JS を実行
```

クエリ 3 種の使い分け（質問が出やすい）:

| 接頭辞 | 挙動 | 使いどころ |
|---|---|---|
| `findBy*` | 出るまでポーリング。0 件・2 件以上で throw | **非同期描画を待つ**（React はほぼこれ） |
| `getBy*` | その場で取得。無ければ throw | すでに出ている要素 |
| `queryBy*` | 無ければ `null` | **「消えたこと」の確認**（`waitFor` と組む） |

`findAllBy*` は複数ヒットを許す（同じ文言が 2 箇所に出るアラートなど）。

### 5.3 今回ハマって学んだルール（実体験ベース）

1. **セレクタは JSX からではなく実際の DOM から取る**。`<Button>Save</Button>` は `<button>` にならない。今回の実名: combobox「状態で絞り込み」、textbox の name は `/^Title/`（実際は "Title. This field supports 100 or fewer characters."）、button「More Actions」→ menuitem「Save」。
   探し方: puppeteer の `page.accessibility.snapshot()`、または失敗ログに出る DOM ダンプ。
2. **`now-*` の入力は blur で値が確定**。`user.type` の後に `user.tab()` を入れないと保存ボタンが有効にならない。Enter はモーダルに奪われるので使わない。
3. **モーダルのフッターは `within(dialog)` で見えない**（slot 境界）。`screen` から探す。
4. **「消えた」は `findBy*` で待てない**。`queryBy*` を `waitFor` で回す。
5. **`waitFor` の中に `findBy*` を入れない**（二重ポーリングで timeout が混乱）。
6. **画面が同じ見た目なら URL で確定させる**（create と detail はボタン構成が同じ → `location.search` に `view=detail` を含むか）。
7. **保存ボタンは幅で出方が変わる**。広い画面は「Save」直出し、狭いと「More Actions」に畳まれる。両対応の分岐を書いた（`task-board-create.script.js`）。
8. `sleep()` は存在しない。`sn_atf.delay(ms)` は最後の手段。
9. **UI テストの後にサーバー検証を置く**。楽観的更新で画面だけ先に動くことがあるため。

---

## 6. 今回のスイート（Capability Matrix として使う）

スイート: `Handson: Task ボード 一式`（sys_id `13abb880d135480488bf9b3653db9afa`）

| # | テスト名 | 種別 | 検証している機能 |
|---|---|---|---|
| 1 | done で作成すると completed_at が入る | server | BR insert・肯定 |
| 2 | open で作成すると completed_at は空のまま | server | BR insert・否定 |
| 3 | open から done に更新すると completed_at が入る | server | BR update・肯定 |
| 4 | done から open に戻すと completed_at がクリアされる | server | BR update・否定（クリア分岐） |
| 5 | ナビゲーターに Handson のモジュールが表示される | navigator | アプリメニュー / モジュール（polaris） |
| 6 | Task ボードの一覧と状態絞り込み | UI + server | 一覧表示、状態フィルタ |
| 7 | Task ボードから新規タスクを作成できる | UI + server | 新規作成 → 保存 → detail 遷移、DB に state=open |
| 8 | 未保存のまま戻ると確認モーダルが出る | UI | isDirty 検知、モーダルのキャンセル分岐 |
| 9 | ボードでカードを移動すると state と completed_at が連動する | UI + server | Kanban 移動 → PATCH → BR まで通し |
| 10 | ボードのカードから詳細を開きボードへ戻れる | UI + server | from=board の引き継ぎ、未編集なら確認なし |
| 11 | タブでボードと一覧を切り替えられる | UI | view=board / view=list の切替と URL |
| 12 | 件数タイルから状態で絞り込んだ一覧へ移動できる | UI + server | タイル → view=list&state=done |
| 13 | ヘッダーの新規タスクから開いた作成画面はボードへ戻る | UI | from=board の引き継ぎ（作成側） |

server 系 4 本は各 0〜2 秒、UI 系は 5〜21 秒。全 13 本で約 1 分 30 秒。

---

## 7. 実行方法（3 つの手段）

### 7.0 前提: インスタンス側のプロパティ

PDI は既定で ATF 実行が **無効**（本番で誤って動かないため）。以下を true にする。

| プロパティ | 意味 | mypdi の現在値 |
|---|---|---|
| `sn_atf.runner.enabled` | テスト / スイートの実行を許可 | true（2026-09-15 に変更） |
| `sn_atf.schedule.enabled` | スケジュール実行を許可（CI/CD 経由の実行にも必要） | true（同上） |
| `sn_atf.screenshots.mode` | スクリーンショット取得 | `enabledAll`（全ステップ） |
| `sn_atf.headless.enabled` | 公式の Docker ヘッドレスランナー | false（未使用） |

これらは *private プロパティ* なので Update Set では移動しない。インスタンスごとに設定する。

### 7.1 GUI から（参加者向けの最短ルート）

1. 左ナビ「Automated Test Framework > Tests」または「Test Suites」を開く。
2. 対象を開いて **Run Test / Run Test Suite**。
3. UI ステップがある場合、**Client Test Runner を開くか聞かれる**ので開く（新しいブラウザタブ）。このタブを閉じると UI テストは動かない。
4. 結果画面でステップごとの成否とスクリーンショットを見る。

### 7.2 CLI から（今回の主ルート）

```powershell
# UI テストを受け取るランナーを開いておく（別プロセス。ブラウザタブでも良い）
#   ブラウザ手動: https://dev192510.service-now.com/atf_test_runner.do?sysparm_nostack=true&sysparm_scheduled_tests_only=true
# スイートを起動して完了までポーリング
npx @servicenow/sdk cicd testsuite run --test-suite-sys-id 13abb880d135480488bf9b3653db9afa --auth mypdi --poll-timeout 540000 -o json
```

- `--test-suite-name` でも指定できる。`--wait` は既定 true。
- `--run-in-cloud` は ATF Cloud Runner 用（PDI では未検証）。
- 内部では `sn_cicd` REST API を叩いている。GitHub Actions などからも同じコマンドで実行できる。

### 7.3 ヘッドレスランナー（デモを安定させたいとき）

「ランナータブを開いたまま忘れる」事故を避けるため、puppeteer-core + ローカル Chrome で `sysparm_scheduled_tests_only=true` のランナーを開き続けるスクリプトを使った。

- 認証: `npx @servicenow/sdk auth --print mypdi --format headers` の `Cookie:` 行を puppeteer に渡す（ファイルに保存しない）。
- 起動後に `cicd testsuite run` を投げると、このランナーに UI テストが配られる。
- 場所: 過去セッションの scratchpad `headless/runner.mjs` + `auth.mjs`（リポジトリ外。必要ならリポジトリの `tools/` に移す）。

### 7.4 結果の読み方

```powershell
# スイート結果の履歴
npx @servicenow/sdk query sys_atf_test_suite_result -q "test_suite=13abb880d135480488bf9b3653db9afa^ORDERBYDESCsys_created_on" -f sys_created_on,status,success_count,failure_count,run_time -o json
# 個別テストの結果と失敗メッセージ
npx @servicenow/sdk query sys_atf_test_result -q "test.nameSTARTSWITHHandson^status=failure" -f test.name,output,sys_created_on -o json
```

- `status` は success / failure / error / skipped。`output` に失敗理由（UI テストは **行番号 + 見つからなかった要素 + その時点の DOM ダンプ**）が入る。
- 2026-09-15 の履歴: 6 回実行、うち 2 回は Kanban 改修中の失敗、最終 13/13 成功。

---

## 8. 失敗分析（Fail analysis）の実例

Kanban 化のリデザイン後、既存の 8 本のうち 2 本が落ちた。

```
Line 9: Unable to find element with role "button"
<body><div id="root"> ... <now-heading> ... <now-select> ... <now-record-list-connected> ...
```

読み方:

1. **行番号** → `.script.js` の 9 行目 = `findByRole('button', { name: 'New' })`。ここで 15 秒待っても見つからなかった。
2. **DOM ダンプ** → その時点の `<body>` が丸ごと入る。一覧側の部品（`now-select`、`now-record-list-connected`）はあるが、その中身（New ボタン）がまだ描かれていない。`now-*` は Shadow DOM なので外側のタグしか見えない点に注意。
3. **原因分類**: 改修中の UI 構造変更 + 描画待ちの不足。テストのバグでも環境の問題でもない。
4. **対処**: 「Changed」バケツ → テストを**更新**（入口を `?view=list` で固定し、見出し `findByRole('heading')` で描画完了を待ってから操作）。削除→再作成はしない。

説明するときの原因分類の 3 択:

| 分類 | 兆候 | 直す場所 |
|---|---|---|
| アプリの変更 | 要素が見つからない、名前が変わった、URL が変わった | テスト（Added / Changed / Removed で仕分け） |
| アプリのバグ | 要素はあるが値が期待と違う、DB 検証で落ちる | アプリ本体（テストは正しい） |
| 環境 | ランナー未起動で timeout、`sn_atf.runner.enabled` が false、権限不足で保存が通らない | インスタンス設定 / ランナー |

---

## 9. ハンズオンで想定される質問と答え

- **Q. ATF は有料？** → 標準機能。Now Platform に含まれる。
- **Q. なぜ最初は実行できない？** → `sn_atf.runner.enabled` が既定 false。本番で勝手にテストデータが作られないための安全装置。
- **Q. UI テストだけ遅い / 動かない** → ブラウザ（Client Test Runner）が必要。タブを開いたままにする。サーバー側テストはランナー不要。
- **Q. React 画面なのに `atf.form` が使えないのは？** → `atf.form` は標準フォーム（g_form）専用。独自 UI は `atf.uiTestScript` で TestingLibrary を使う。
- **Q. sys_id をハードコードしてはいけない理由は？** → インスタンスごとに違う。Fluent なら `Now.ID` や `Record` 参照で解決できる。
- **Q. テストを消したのに残っている** → ソース削除だけでは消えない。`Now.del()` を書いてデプロイ。
- **Q. テストデータは溜まらない？** → 各テストが最後に `recordDelete` する。失敗して途中で止まると残るので、`titleSTARTSWITHATF` で掃除する。
- **Q. 別ユーザーで動かしたい** → `atf.server.createUser` / `impersonate`（sys_id）、スクリプト内なら `sn_atf.impersonate('user_name')`。ロールが無いと ACL で静かに拒否されるので注意。
- **Q. Claude / AI に書かせて大丈夫？** → セレクタは AI も JSX から推測して外す。**実 DOM を取ってから書かせる**、そして必ず実行して結果で確かめる（テーマ B の主張そのもの）。
- **Q. CI に組み込める？** → `now-sdk cicd testsuite run` を GitHub Actions から実行できる。UI テストにはランナーが必要なので、まずサーバー側テストだけをゲートにするのが現実的。

---

## 10. 参照

- 公式ドキュメント（SDK 同梱、バージョン一致）: `npx @servicenow/sdk explain atf-guide` / `atf-ui-test-script-guide` / `test-api` / `testsuite-api` / `ci-integration`
- CLI: `npx @servicenow/sdk cicd testsuite run --help`
- 型定義: `node_modules/@servicenow/sdk-core/dist/app/Test.d.ts`
- 実装コミット: `5549a43 Add ATF test suite for Handson Task board`、`c9488dd Redesign ...`（Kanban 対応で 5 本追加・既存更新）
- インスタンス: https://dev192510.service-now.com （alias `mypdi`）
