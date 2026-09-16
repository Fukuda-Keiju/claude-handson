# ATF Handson プロジェクト（テーマB 参加者用）

このプロジェクトは **ATF（Automated Test Framework）のテストだけ**を置く ServiceNow Fluent SDK アプリです。
テスト対象のアプリは同じインスタンス上の **別スコープ**にあり、このプロジェクトからは触りません。

- SDK: `@servicenow/sdk` 4.12.1（Fluent）
- 接続先: alias `handson`（https://dev192510.service-now.com）
- `npm run build` でコンパイル、`npm run deploy` でインスタンスへ送る。**deploy は参加者本人が手で打つ。Claude Code は build まで。**
- `now.config.json` の `scope` / `scopeId` は変更しない。`src/fluent/generated/keys.ts` も手で編集しない。
- 公式ドキュメント: `now-sdk explain atf-guide`（PowerShell で .ps1 がブロックされるときは `now-sdk.cmd explain atf-guide`）。

## テスト対象アプリ「Handson Todo」

| 項目 | 値 |
|---|---|
| スコープ | `x_2221398_todo` |
| テーブル | `x_2221398_todo_item`（表示名 `Todo Item`） |
| 列 | `title`(String 100) / `state`(Choice: `open`=Open, `in_progress`=In Progress, `done`=Done, 既定 `open`) / `due_date`(Date) / `completed_at`(DateTime, Business Rule が書く) / `notes` |
| Business Rule | `Set completed_at on Todo Item`: state が done になると completed_at に日時が入り、done 以外に戻すと空になる |
| UI Page（React） | `/x_2221398_todo_board.do`。ナビゲーターでは **Handson Todo → Handson Todo board** |
| 画面のビュー | `?view=board`（既定）/ `?view=list` / `?view=create` / `?view=detail&id=<sys_id>&from=board|list` |

## 画面の要素名（UI テストはこの名前で探す。JSX から推測しない）

| 場所 | role | name |
|---|---|---|
| ヘッダー | heading | `Handson Todo` |
| ヘッダー | button | `New`（→ `?view=create`） |
| タブ | tab | `ボード` / `一覧` |
| ボード列見出し | heading(h2) | `Open` / `In Progress` / `Done` |
| ボードのカード | button | `「{title}」を開く` |
| ボードの移動 | button | `「{title}」を {Label} へ移動`（隣の列だけ。Open→In Progress、In Progress→Open/Done、Done→In Progress） |
| 一覧の行 | button | `「{title}」を開く`（`table` の中） |
| 作成フォーム | heading(h2) | `新しいタスク` |
| 作成/詳細フォーム | textbox | `Title` / `Notes`（Due date は `input type=date`） |
| 詳細フォーム | combobox | `State`（option `Open` / `In Progress` / `Done`） |
| フォームのボタン | button | `Save` / `Cancel`（作成）/ `Delete`・`← 一覧へ戻る`・`← ボードへ戻る`（詳細） |
| 保存成功 | status | テキスト `保存しました`（保存後は `?view=list` に遷移） |
| エラー | alert | テキスト（例: サーバーのエラーメッセージ） |

素の HTML 要素なので `user.type(input, '文字')` だけで値が入る。`user.tab()` は不要。

## Fluent で ATF を書くときのルール

### ファイル配置
```
src/fluent/atf/
  xxx.now.ts        # Test 定義（サーバーステップはここに直接書く）
  xxx.script.js     # UI テストのブラウザ側スクリプト（Now.include で読む）
  suite.now.ts      # TestSuite（tests 配列の順に実行）
```

### Test() の雛形（サーバー側）
```ts
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// このプロジェクトの型にはテスト対象テーブルが無いので、名前は any で通す
const TODO_TABLE = 'x_2221398_todo_item' as any

export const testInsertOpen = Test(
    {
        $id: Now.ID['atf-insert-open'],   // 一度 deploy したら変えない
        name: 'Todo: タイトル付きで作成すると state=open になる',
        description: '何を・どう確かめるか 1〜2 文',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        const ins = atf.server.recordInsert({
            $id: Now.ID['atf-insert-open-step1'],
            table: TODO_TABLE,
            fieldValues: { title: 'ATF タイトルあり' } as any,
            assert: 'record_successfully_inserted',
        })
        atf.server.recordValidation({
            $id: Now.ID['atf-insert-open-step2'],
            table: TODO_TABLE,
            recordId: ins.record_id,
            fieldValues: 'state=open^completed_atISEMPTY',   // エンコードクエリ
            assert: 'record_validated',
        })
        atf.server.recordDelete({ $id: Now.ID['atf-insert-open-step3'], table: TODO_TABLE, recordId: ins.record_id })
    }
)
```

- `$id` はテストにもステップにも必要で、プロジェクト内で一意。
- 前のステップの戻り値（`ins.record_id`）を次のステップに渡す。
- テストが作ったレコードは `recordDelete` で片付ける（ATF のロールバックもあるが、明示する）。
- Negative Test の assert: `recordInsert` は `'record_not_inserted'`、`recordQuery` は `'no_records_match_query'`。

### UI テスト（TestingLibrary）
```ts
atf.uiTestScript.runTest({ $id: Now.ID['atf-xxx-ui'], script: Now.include('./xxx.script.js') })
```
`.script.js` はトップレベル await の素の JavaScript。`screen` / `user` / `sn_atf` / `expect` / `waitFor` は自動で使える。8000 文字まで。

```js
await sn_atf.navigate('/x_2221398_todo_board.do?view=list')
const newBtn = await screen.findByRole('button', { name: 'New', exact: true, timeout: 15000 })
await user.click(newBtn)
await screen.findByRole('heading', { name: '新しいタスク', timeout: 15000 })
const title = await screen.findByRole('textbox', { name: 'Title', exact: true, timeout: 15000 })
await user.type(title, 'ATF 画面から作成')
await user.click(await screen.findByRole('button', { name: 'Save', exact: true }))
const status = await screen.findByRole('status', { timeout: 15000 })
expect(status).toHaveTextContent('保存しました')
await screen.findByRole('button', { name: '「ATF 画面から作成」を開く', exact: true, timeout: 15000 })
```

- `findBy*` = 出るまで待つ / `queryBy*` = 無ければ null（「消えた」の確認は `waitFor` + `queryBy*`）。
- `waitFor` の中に `findBy*` を入れない。
- 画面が同じ見た目のときは `sn_atf.evaluate(() => location.search)` で URL を確認する。
- UI ステップの後に `atf.server.recordQuery` / `recordValidation` で DB を確かめる（画面だけを信じない）。

### TestSuite()
```ts
import { TestSuite } from '@servicenow/sdk/core'
export const suite = TestSuite({
    $id: Now.ID['atf-suite'],
    name: 'Todo: ハンズオン',
    tests: [testA, testB],   // 速いサーバー側を先、UI を後
})
```

## Claude Code への頼み方のコツ（参加者向け）

- 「Positive を 2 本、Negative を 1 本」など本数と種類を指定する。
- 仕様書（`docs/spec.md`）があるなら「仕様の何番を確かめるテストか」を書かせる。
- テストが赤になったら、原因を 4 つに分けて考える: ①アプリの欠陥 ②テストの間違い ③環境 ④データ。
