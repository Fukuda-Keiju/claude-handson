// =============================================================================
// T2（Checkpoint / Positive）
//   確かめる仕様: 「4. 画面の New からタスクを作成でき、一覧に出る」
//   種別: Positive（画面の正常系フロー）
//   ねらい: 画面操作（New → Title 入力 → Save）が最後まで通り、
//           さらに *本当に DB に入っているか* をサーバー側でも確かめる。
//   このテストは「正しいアプリ」でも「欠陥アプリ」でも緑になります
//   （欠陥はタイトルが空のときの分岐だけで、通常の保存は動くため）。
//
//   構成のポイント:
//     UI ステップの後に必ずサーバー検証を置きます。画面の「保存しました」は
//     アプリが勝手に出しているだけかもしれないので、UI のメッセージは信じず
//     recordQuery / recordValidation で DB を直接確認します。
// =============================================================================
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// 別スコープ（x_2221398_todo）のテーブルなので as any で型チェックを通す（T1 の説明を参照）
const TODO_TABLE = 'x_2221398_todo_item' as any

export const testUiCreateTask = Test(
    {
        $id: Now.ID['atf-t2-ui-create'],
        name: 'Todo: 画面の New からタスクを作成すると一覧に出る',
        description:
            'Todo ボードの一覧ビューから New を押し、Title に「ATF T2 画面から作成」を入力して Save すると、「保存しました」が表示されて一覧に行が増えることを画面で確認する。さらに DB を直接検索して state=open で保存されていることを検証し、作成したレコードを削除する（Positive）。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // --- 1. 画面操作（ブラウザが必要なステップ）---------------------------
        // script の中身は同じフォルダの .script.js に置き、Now.include で読み込む。
        // こうすると .js として構文ハイライトや補完が効きます。
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-t2-step-ui'],
            script: Now.include('./t2-ui-create.script.js'),
        })

        // --- 2. 検証(1): 本当に DB に入ったか ----------------------------------
        // recordQuery は { table, first_record } を返す。first_record が見つかった 1 件の sys_id。
        const created = atf.server.recordQuery({
            $id: Now.ID['atf-t2-step-query'],
            table: TODO_TABLE,
            fieldValues: 'title=ATF T2 画面から作成',
            assert: 'records_match_query',
        })

        // --- 3. 検証(2): 既定値どおり state=open で入っているか -----------------
        atf.server.recordValidation({
            $id: Now.ID['atf-t2-step-validate'],
            table: TODO_TABLE,
            recordId: created.first_record,
            fieldValues: 'state=open',
            assert: 'record_validated',
        })

        // --- 4. 後片付け -------------------------------------------------------
        atf.server.recordDelete({
            $id: Now.ID['atf-t2-step-cleanup'],
            table: TODO_TABLE,
            recordId: created.first_record,
            assert: 'record_successfully_deleted',
        })
    }
)
