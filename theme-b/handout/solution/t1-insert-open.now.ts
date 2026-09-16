// =============================================================================
// T1（Checkpoint / Positive）
//   確かめる仕様: 「2. 新しいタスクは state=open で始まり、完了日時は空」
//   種別: Positive（条件が成立する正常系）
//   ねらい: テーブルの既定値 state=open が効いていること、そして Business Rule
//           「Set completed_at on Todo Item」が done 以外では completed_at を
//           書かないことを、画面を使わずサーバー側だけで素早く確かめる。
//   このテストは「正しいアプリ」でも「欠陥アプリ」でも緑になります
//   （欠陥はタイトル必須チェックの側にあり、既定値の仕組みは壊れていないため）。
// =============================================================================
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// テスト対象のテーブル名。同じ文字列を何度も書かないよう定数にしておく。
//
// 【重要】このテーブルは *別スコープ* のアプリ x_2221398_todo のものです。
// この ATF プロジェクト（x_2221398_atf09）の型定義には含まれないため、そのまま渡すと
// TypeScript が「そんなテーブルは無い」と型エラーにします。ATF のステップは実行時には
// テーブル名を単なる文字列として扱うので、`as any` で型チェックだけをすり抜けさせています。
const TODO_TABLE = 'x_2221398_todo_item' as any

export const testInsertDefaultsToOpen = Test(
    {
        // $id は sys_id に対応します。一度デプロイしたら変えないこと（変えると別レコードになる）。
        $id: Now.ID['atf-t1-insert-open'],
        name: 'Todo: タイトル付きで作成すると state=open になる',
        description:
            'Todo Item をタイトル付きでサーバー側から新規作成し、state が既定値 open になり completed_at が空のままであることを検証する（Positive）。最後に作成したレコードを削除して後片付けする。',
        active: true,
        // UI ステップ実行中にサーバーエラーが出たらテストを失敗させる設定
        failOnServerError: true,
    },
    (atf) => {
        // --- 1. 準備と実行: タイトルだけ指定してレコードを作る -------------------
        // state はあえて指定しない。テーブル側の既定値（open）が使われるはず。
        // recordInsert は { table, record_id } を返すので、後続ステップへ record_id を渡せる。
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-t1-step-insert'],
            table: TODO_TABLE,
            fieldValues: {
                title: 'ATF T1 タイトルあり',
            },
            assert: 'record_successfully_inserted',
        })

        // --- 2. 検証: state=open かつ completed_at が空 -------------------------
        // fieldValues は「エンコードクエリ」という ServiceNow 独自の条件文字列。
        //   ^ が AND、ISEMPTY は「空であること」を表す。
        atf.server.recordValidation({
            $id: Now.ID['atf-t1-step-validate'],
            table: TODO_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'state=open^completed_atISEMPTY',
            assert: 'record_validated',
        })

        // --- 3. 後片付け: テストが作ったレコードは必ず消す ----------------------
        // これを忘れるとインスタンスにテストデータが溜まっていきます。
        atf.server.recordDelete({
            $id: Now.ID['atf-t1-step-cleanup'],
            table: TODO_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)
