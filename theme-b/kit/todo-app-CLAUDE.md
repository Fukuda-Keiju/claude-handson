# Handson Todo（テーマB 参加者用アプリ本体）

ServiceNow Fluent SDK（`@servicenow/sdk` 4.12.1、template `typescript.react`）で作った小さなタスク管理アプリ。
ハンズオン当日の後半、参加者がこのフォルダで Claude Code を起動し、ATF テストが見つけた欠陥を直す。

## このアプリの情報

| 項目 | 値 |
|---|---|
| スコープ | `x_2221398_todo`（`now.config.json` の `scope`。書き換え済みなのでそのまま使う） |
| テーブル | `x_2221398_todo_item`（表示名 `Todo Item`） |
| 列 | `title`(String 100) / `state`(Choice: `open` / `in_progress` / `done`、既定 `open`) / `due_date`(Date) / `completed_at`(DateTime、Business Rule が書く) / `notes`(MultiLineText) |
| UI Page（React） | `/x_2221398_todo_board.do`。ナビゲーターでは **Handson Todo → Handson Todo board** |
| 接続先 | `now-sdk auth --list` の `mypdi`（参加者それぞれの PDI） |

## ファイルの場所

| 何 | ファイル |
|---|---|
| テーブル定義（列、必須、選択肢、デモデータ 2 件） | `src/fluent/tables/todo-item.now.ts` |
| Business Rule の登録（名前・タイミング・順序） | `src/fluent/business-rules/*.now.ts` |
| Business Rule の処理本体（サーバー側 TypeScript） | `src/server/business-rules/*.ts`。保存時のタイトル検証は `validate-title.ts`、完了日時の自動設定は `set-completed-at.ts` |
| UI Page の登録 | `src/fluent/ui-pages/todo-board.now.ts` |
| 画面（React 19、素の HTML 要素） | `src/client/`。作成・編集フォームは `components/TodoForm.tsx`、ボードは `BoardView.tsx`、一覧は `ListView.tsx`、サーバー呼び出しは `api.ts` |
| 自動生成の ID 表 | `src/fluent/generated/keys.ts`（**編集しない**。build が管理する） |

## コマンド

- `npm run build` — 型チェックと変換。**修正のあとは必ず通す**
- `npm run deploy` — PDI に反映。**参加者（人）が打つ。Claude Code は実行しない**
- `now-sdk explain <topic>` — 公式ドキュメント。書き方に迷ったら記憶より先にこれを読む（`now-sdk explain` で一覧、例: `now-sdk explain table`、`now-sdk explain business-rule`）

## ルール（必ず守る）

1. `now.config.json` と `src/fluent/generated/keys.ts` は **編集しない**。`$id: Now.ID['...']` のキーも変えない（PDI 上の sys_id と対応している）。
2. `npm run deploy`、`now-sdk install`、`git` は **実行しない**。build まで。
3. 頼まれた修正だけを行う。既存の動き（空白の前後を整える処理、`completed_at` の自動設定、他の列、デモデータ、画面の見た目）は変えない。
4. 変更したファイルはすべて `npm run build` で確認する。エラーが出たら直してから報告する。
5. 報告は短く。「変更したファイル」「何を変えたか（1 行ずつ）」「build の結果」の 3 点。
6. コメントは日本語で、初学者が読んで分かる量にする。

## スコープ付きアプリで気をつける API

- `gs.nowDateTime()` は使えない。日時は `new GlideDateTime().getValue()`。
- Business Rule で保存を止めるときは `current.setAbortAction(true)`。利用者に見せる文言は `gs.addErrorMessage('...')`。
- `current.getValue('col')` は値が無いと `null` を返すことがある。`?? ''` で文字列に寄せてから扱う。
- テーブル定義の `mandatory: true` はフォーム上の必須チェック。REST API やスクリプトからの insert には効かないので、サーバー側の守りは Business Rule に書く。

## 画面側の約束（ATF の UI テストがこの名前で要素を探す。変えない）

- ボタン: `New` / `Save` / `Cancel` / `Delete`
- 入力欄: `Title` / `Notes`（textbox）、`State`（combobox）
- 保存成功のメッセージ: role `status`、テキスト `保存しました`
- エラー表示: role `alert`（テキストは任意。サーバーのエラーメッセージをそのまま出す）
