// =============================================================================
// T4（Solution / Negative）
//   確かめる仕様: 「1. タイトルは必須。空のまま保存できない」のサーバー側
//   種別: Negative（ルールが *成立しない* 入力を与え、拒否されることを確かめる）
//   ねらい: Business Rule「Validate Todo title」が空タイトルの insert を
//           setAbortAction(true) で止めていることを確かめる。
//   期待結果:
//     - 正しいアプリ  → レコードが作られない（record_not_inserted）ので緑
//     - 欠陥アプリ    → abort が外れていてレコードが作られてしまうので赤
//   ポイント: 「作られないこと」を確かめるテストなので、後片付け（recordDelete）は
//             不要です。そもそも消すレコードが存在しないためです。
//             ※ 欠陥アプリではレコードが 1 件残ります。それこそがバグの証拠なので、
//               掃除は後で titleISEMPTY などで手動で行います。
// =============================================================================
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// 別スコープ（x_2221398_todo）のテーブルなので as any で型チェックを通す（T1 の説明を参照）
const TODO_TABLE = 'x_2221398_todo_item' as any

export const testEmptyTitleRejectedOnServer = Test(
    {
        $id: Now.ID['atf-t4-empty-title-server'],
        name: 'Todo: 空タイトルはサーバーで拒否される (Negative)',
        description:
            'title が空の Todo Item をサーバー側から挿入しようとし、Business Rule「Validate Todo title」の setAbortAction によってレコードが作成されないこと（record_not_inserted）を検証する（Negative）。画面を経由しない REST / スクリプト経由の保存でも仕様 1「タイトル必須」が守られていることを確かめるテスト。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // --- 実行と検証を 1 ステップで ----------------------------------------
        // assert に 'record_not_inserted' を指定すると、
        //   「挿入が失敗したら成功（緑）／挿入できてしまったら失敗（赤）」
        // という判定に反転します。Negative テストの中心はこの 1 行です。
        //
        // なお dictionary の mandatory:true だけでは、この経路（スクリプト insert）は
        // 止められません。フォームの必須チェックはブラウザ側の仕組みだからです。
        // サーバーで確実に止めているのは Business Rule の setAbortAction(true) です。
        atf.server.recordInsert({
            $id: Now.ID['atf-t4-step-insert'],
            table: TODO_TABLE,
            fieldValues: {
                title: '',
                state: 'open',
            },
            assert: 'record_not_inserted',
        })
    }
)
