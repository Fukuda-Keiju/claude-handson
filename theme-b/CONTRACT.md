# テーマB 欠陥アプリ「Handson Todo」— ワーカー間の契約書

この文書は 3 人のワーカー（データ層 / React 画面 / ATF）が **同時に** 作業するための唯一の共有情報です。
ここに書かれた名前・文字列は 1 文字も変えないこと。変えたいときはオーケストレーターに報告して止まる。

## 0. 共通ルール（全ワーカー）

- `npm run build` / `npm run deploy` / `now-sdk install` / `git` は **実行しない**（オーケストレーターが 1 回だけ行う）。
- `now.config.json` と `src/fluent/generated/keys.ts` は **編集しない**。
- 先に `now-sdk explain <topic>` で公式ドキュメントを読む（`now-sdk explain` で一覧）。
- 既存アプリ `C:\Users\福田圭樹\Projects\src\` は **参考にしてよいが、編集しない**。
- コメントは日本語で、初学者が読んで分かる量を書く。
- 完了報告には「作ったファイル一覧」「型チェックの結果」「契約から外れた点（あれば）」を書く。

## 1. プロジェクト

| 役割 | フォルダ | scope | 備考 |
|---|---|---|---|
| アプリ本体 | `C:\Users\福田圭樹\Projects\theme-b\todo-app` | `x_2221398_todo` | template typescript.react（React 19、`@servicenow/isomorphic-rollup`）。`@servicenow/react-components` は使わない（素の HTML 要素で作る） |
| 講師用 ATF | `C:\Users\福田圭樹\Projects\theme-b\atf09` | `x_2221398_atf09` | template typescript.basic。テストだけを置く。**アプリと別スコープ** |

## 2. テーブル（ワーカー A が作る。B・C はこの名前を使う）

テーブル名 `x_2221398_todo_item`、ラベル `Todo Item`、display 列 `title`、audit あり。

| 列 | 型 | ラベル | 制約 |
|---|---|---|---|
| `title` | String | `Title` | maxLength 100、**mandatory: true** |
| `state` | Choice | `State` | `open`=`Open` / `in_progress`=`In Progress` / `done`=`Done`、default `open` |
| `due_date` | Date | `Due date` | |
| `completed_at` | DateTime | `Completed at` | readOnly（Business Rule が書く） |
| `notes` | MultiLineText | `Notes` | |

デモレコード（installMethod `demo`）2 件: `9 月分の経費精算を提出する`（done, due 2026-09-10）, `新入社員向け PC セットアップ手順書を更新する`（in_progress, due 2026-09-20）。業務っぽいタイトルにしてある（2026-09-16 変更。テストはタイトル文字列に依存しない）。

## 3. Business Rule（ワーカー A）

### 3.1 `Set completed_at on Todo Item`（before insert/update, order 100）
- `state === 'done'` かつ `completed_at` が空 → `completed_at` に現在時刻（`new GlideDateTime().getValue()`）。
- `state !== 'done'` かつ `completed_at` あり → `completed_at` を空にする。
- 既存実装 `Projects/src/server/business-rules/set-completed-at.ts` と同じロジックでよい。

### 3.2 `Validate Todo title`（before insert/update, order 50）
- `title` の前後空白を trim して `title` に書き戻す。
- **trim 後が空なら** `gs.addErrorMessage('タイトルは必須です')` と `current.setAbortAction(true)`。
- これが「仕様 1: タイトル必須」をサーバー側で守る唯一の仕組み。dictionary の mandatory は REST/Script 経由の insert では効かないため。
- ファイル: `src/fluent/business-rules/validate-title.now.ts` + `src/server/business-rules/validate-title.ts`。
- **欠陥版（後でオーケストレーターが作る）ではこの abort を外す。** そのため abort 部分は独立した if 文 1 つにまとめ、削りやすくしておく。

## 4. UI Page とナビゲーター（ワーカー A）

- `UiPage`: `$id: Now.ID['ui-page-todo-board']`, endpoint **`x_2221398_todo_board.do`**, `html: page`（`../../client/index.html` を import）, `direct: true`。
- `ApplicationMenu`: title **`Handson Todo`**。
- モジュール 1: title **`Handson Todo board`**, link_type DIRECT, query `x_2221398_todo_board.do`, order 100。
- モジュール 2: title **`Todo Item 一覧`**, link_type LIST, name `x_2221398_todo_item`, order 200。
- テンプレートが作った `src/fluent/ui-pages/incident-manager.now.ts` は **ワーカー A が削除**する。

## 5. React 画面（ワーカー B）— ATF が依存する DOM 契約

テンプレートの `src/client/components/Incident*`、`services/IncidentService.ts` は **ワーカー B が削除**し、以下を 0 から作る。
React 19 + 素の HTML 要素。データは Table REST API（`/api/now/table/x_2221398_todo_item`、ヘッダー `X-UserToken: window.g_ck`、`credentials: 'same-origin'`）。
`index.html` には既存アプリと同じ **Array.from 復元スクリプト** を `<sdk:now-ux-globals>` の直後に入れる（`Projects/src/client/index.html` からコピー）。

### 5.1 URL とビュー
| URL | ビュー |
|---|---|
| `x_2221398_todo_board.do` | ボード（既定） |
| `?view=list` | 一覧 |
| `?view=create` | 新規作成フォーム |
| `?view=detail&id=<sys_id>` | 詳細・編集フォーム |

ビューの切替は `history.pushState` + `location.search` の読み取りで行う（ページ再読み込みなし）。

### 5.2 アクセシブルネーム（ATF はこの名前で要素を探す。1 文字も変えない）

**ヘッダー（全ビュー共通）**
- `h1` テキスト: `Handson Todo`
- `button` name `New`（exact）。押すと `?view=create`。

**タブ（ボード・一覧で表示）**
- `tablist` 内に `tab` name `ボード` と `tab` name `一覧`。選択中は `aria-selected="true"`。

**ボード（view=board）**
- 列ごとに `h2` テキスト `Open` / `In Progress` / `Done`（この順）。
- カード = `button` name **`「{title}」を開く`**（押すと `?view=detail&id=...&from=board`）。
- 移動ボタン = `button` name **`「{title}」を {Label} へ移動`**（Label は `Open`/`In Progress`/`Done`）。**隣の列へのボタンだけ**を出す（Open のカードには `In Progress` へ、In Progress のカードには `Open` へと `Done` へ、Done のカードには `In Progress` へ）。押すと PATCH で state 更新 → 再取得。

**一覧（view=list）**
- `table`。各行に `button` name **`「{title}」を開く`**（押すと `?view=detail&id=...&from=list`）と、State / Due date / Completed at のセル。
- 更新日時の新しい順。

**新規作成フォーム（view=create）**
- `h2` テキスト `新しいタスク`
- `<label>` 付き入力: `textbox` name **`Title`**（`<input type="text" maxLength=100>`）、`textbox` name **`Notes`**（textarea）、`Due date`（`<input type="date">`）。
- `button` name **`Save`**（exact）、`button` name **`Cancel`**（exact。押すと元のビューへ）。
- **入力チェック**: Save 押下時に `title.trim() === ''` なら **API を呼ばず**、`role="alert"` の要素にテキスト **`タイトルは必須です`** を表示して create ビューに留まる。これが「仕様 1」の画面側の守り。**欠陥版ではこの if 文を外す**ので独立した if 文 1 つにする。
- 保存成功（POST 201）→ `?view=list` へ遷移し、`role="status"` にテキスト **`保存しました`** を表示。
- API がエラー（Business Rule の abort など）→ `role="alert"` にサーバーのメッセージ（`error.message`）を表示し create に留まる。

**詳細・編集フォーム（view=detail）**
- `h2` テキスト `タスクの詳細`
- 同じ入力 + `combobox`（`<select>`）name **`State`** で `option` `Open` / `In Progress` / `Done`。
- `Completed at` は読み取り専用表示（テキスト）。
- `button` `Save`、`button` **`Delete`**、`button` name **`← 一覧へ戻る`**（from=list または未指定）/ **`← ボードへ戻る`**（from=board）。
- Save で PATCH、Delete で DELETE → 元のビューへ。

### 5.3 見た目
- 既存アプリの `tokens.css` の方針に合わせる: Horizon の CSS 変数は RGB 3 値なので **必ず `rgb(var(--now-color_...))` で包む**。フォントは `var(--now-font-family, Lato, Arial, sans-serif)`。
- 幅 1400px と 800px で崩れないこと。装飾は最小限。ハンズオンの主役はテストなので、画面は「読みやすい」で十分。

### 5.4 型チェック
`npx tsc -p src/client/tsconfig.json --noEmit` が通ること。

## 6. ATF（ワーカー C、atf09 プロジェクト）

ファイル配置 `src/fluent/atf/`。1 テスト = `xxx.now.ts`（UI テストは `xxx.script.js` を `Now.include` で読む）。
書き方は `C:\Users\福田圭樹\Projects\src\fluent\atf\*.now.ts` と `docs/atf-knowledge.md` の 3〜5 章に従う。
型定義は `node_modules/@servicenow/sdk-core/dist/app/Test.d.ts`。テーブル名 `x_2221398_todo_item` はこのプロジェクトの型に無いので **TS の型エラーは無視してよい**（`.now.ts` は tsconfig の外。ビルドはオーケストレーターが確認する）。`fieldValues` は必要なら `as any` でよい。
`sn_atf.navigate` の URL は **`/x_2221398_todo_board.do?...`**。`moduleVisibility` は使わない。

### 6.1 Checkpoint（3 本）— 正しいアプリでも欠陥アプリでも **すべて緑**になること

| # | `$id` | name | 内容 |
|---|---|---|---|
| T1 | `atf-t1-insert-open` | `Todo: タイトル付きで作成すると state=open になる` | server.recordInsert(title=`ATF T1 タイトルあり`) → recordValidation `state=open^completed_atISEMPTY` → recordDelete |
| T2 | `atf-t2-ui-create` | `Todo: 画面の New からタスクを作成すると一覧に出る` | UI: navigate `?view=list` → click `New` → type Title `ATF T2 画面から作成` → click `Save` → findByRole status `保存しました` → findByRole button `「ATF T2 画面から作成」を開く`。その後 server.recordQuery(title=...) → recordValidation `state=open` → recordDelete |
| T3 | `atf-t3-done-sets-completed` | `Todo: Done にすると completed_at が入る` | recordInsert(title=`ATF T3 完了`, state=`done`) → recordValidation `completed_atISNOTEMPTY` → recordDelete |

### 6.2 Solution（Negative 2 本）— 正しいアプリでは **緑**、欠陥アプリでは **赤**になること

| # | `$id` | name | 内容 |
|---|---|---|---|
| T4 | `atf-t4-empty-title-server` | `Todo: 空タイトルはサーバーで拒否される (Negative)` | server.recordInsert(title=`''`, state=`open`, `assert: 'record_not_inserted'`) |
| T5 | `atf-t5-empty-title-ui` | `Todo: 空タイトルで Save するとエラーになり保存されない (Negative)` | UI: navigate `?view=create` → Title は空のまま Notes に `ATF T5 空タイトル` → click `Save` → findByRole alert `タイトルは必須です` → `location.search` に `view=create` が残る。その後 server.recordQuery(`notes=ATF T5 空タイトル`, `assert: 'records_do_not_match_query'`) |

### 6.3 TestSuite
- `$id: atf-suite-todo`, name `Todo: 講師用スイート (Checkpoint + Solution)`, tests は T1..T5 の順。
- 追加で `checkpoint` 用に T1〜T3 だけのスイート `$id: atf-suite-todo-checkpoint`, name `Todo: Checkpoint (3 本)` も作る。

### 6.4 UI スクリプトの書き方（既存 `task-board-create.script.js` に準ずる）
- `await sn_atf.navigate('/x_2221398_todo_board.do?view=list')`
- `screen.findByRole('button', { name: 'New', exact: true, timeout: 15000 })`
- 素の `<input>` なので `user.type` だけで値が入る（`user.tab()` は不要だが害もない）。
- 消える要素を先に `waitFor` で待ってから、現れる要素を探す。
- テンプレートの `src/fluent/example.now.ts` は **削除**する。
