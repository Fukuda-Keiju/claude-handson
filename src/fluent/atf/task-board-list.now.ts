// React UI Page「Handson Task ボード」の一覧表示と状態の絞り込みを検証する ATF テスト。
import { Test } from '@servicenow/sdk/core'

export const testTaskBoardListFilter = Test(
    {
        $id: Now.ID['atf-list-filter-test'],
        name: 'Handson: Task ボードの一覧と状態絞り込み',
        description:
            'Handson Task ボード (/x_2221398_handson_task_board.do) に done と open のテストレコードを 1 件ずつ用意し、一覧に両方のリンクが出ることを確認する。その後「状態で絞り込み」で Done を選び、open のリンクが消えて done のリンクだけが残ることを検証する（絞り込みありの分岐）。',
        active: true,
    },
    (atf) => {
        // 前準備: 絞り込みで残る側（done）と消える側（open）のレコードを 1 件ずつ作る
        const insertDone = atf.server.recordInsert({
            $id: Now.ID['atf-list-insert-done'],
            table: 'x_2221398_handson_task',
            fieldValues: {
                title: 'ATF一覧テスト done',
                state: 'done',
            },
        })

        const insertOpen = atf.server.recordInsert({
            $id: Now.ID['atf-list-insert-open'],
            table: 'x_2221398_handson_task',
            fieldValues: {
                title: 'ATF一覧テスト open',
                state: 'open',
            },
        })

        // 本体: ブラウザ上で UI Page を操作して一覧と絞り込みを確認する
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-list-run-script'],
            script: Now.include('./task-board-list.script.js'),
        })

        // 後片付け: テストで作ったレコードを消す（インスタンスにゴミを残さない）
        atf.server.recordDelete({
            $id: Now.ID['atf-list-delete-done'],
            table: 'x_2221398_handson_task',
            recordId: insertDone.record_id,
        })

        atf.server.recordDelete({
            $id: Now.ID['atf-list-delete-open'],
            table: 'x_2221398_handson_task',
            recordId: insertOpen.record_id,
        })
    }
)
