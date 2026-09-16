// =============================================================================
// T5（Solution / Negative）
//   確かめる仕様: 「1. タイトルは必須。空のまま保存できない」の画面側
//   種別: Negative（不正な入力を与え、拒否されることを確かめる）
//   ねらい: 作成フォームで Title を空のまま Save したとき、
//           (1) 画面に「タイトルは必須です」が出て作成画面にとどまること
//           (2) DB にレコードが 1 件も作られていないこと
//           の 2 つを確かめる。
//   期待結果:
//     - 正しいアプリ  → 緑
//     - 欠陥アプリ    → 入力チェックの if 文が外れているため、エラーが出ずに
//                       保存されてしまい、UI ステップとサーバー検証の両方が赤
//   ポイント: 画面の見た目だけでは「保存されていない」ことを証明できません。
//             最後に recordQuery で DB 側からも確かめるのが ATF らしい書き方です。
// =============================================================================
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// 別スコープ（x_2221398_todo）のテーブルなので as any で型チェックを通す（T1 の説明を参照）
const TODO_TABLE = 'x_2221398_todo_item' as any

export const testEmptyTitleRejectedInUi = Test(
    {
        $id: Now.ID['atf-t5-empty-title-ui'],
        name: 'Todo: 空タイトルで Save するとエラーになり保存されない (Negative)',
        description:
            'Todo ボードの新規作成ビューで Title を空のまま Notes だけ入力して Save し、role="alert" に「タイトルは必須です」が表示されて作成ビュー（view=create）にとどまることを画面で確認する。さらに notes=ATF T5 空タイトル のレコードが 1 件も作られていないことを DB 側でも検証する（Negative）。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // --- 1. 画面操作（空タイトルで Save → エラー表示を確認）----------------
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-t5-step-ui'],
            script: Now.include('./t5-empty-title-ui.script.js'),
        })

        // --- 2. 検証: DB にレコードが作られていないこと ------------------------
        // assert に 'no_records_match_query' を指定すると
        //   「1 件も見つからなければ成功（緑）／見つかったら失敗（赤）」
        // という判定になります。ここが欠陥アプリで赤くなる場所です。
        //
        // enforceSecurity は recordQuery では既定 false なので、ACL に関係なく
        // 「本当に 1 件も無いか」を素直に確かめられます。
        atf.server.recordQuery({
            $id: Now.ID['atf-t5-step-query'],
            table: TODO_TABLE,
            fieldValues: 'notes=ATF T5 空タイトル',
            assert: 'no_records_match_query',
        })

        // 後片付け（recordDelete）は不要です。
        // 「レコードが作られていないこと」を確かめるテストなので、消す対象がありません。
    }
)
