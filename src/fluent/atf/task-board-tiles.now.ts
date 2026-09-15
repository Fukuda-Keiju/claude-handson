// Created as part of the Fable/Opus orchestration hands-on.
// 件数タイル（StatTiles）を押すと、その状態で絞り込んだ一覧へ移動することを検証するテスト。
import { Test } from '@servicenow/sdk/core'

export const testTaskBoardStatTiles = Test(
    {
        $id: Now.ID['atf-tiles-test'],
        name: 'Handson: 件数タイルから状態で絞り込んだ一覧へ移動できる',
        description:
            'done と open のテストレコードを 1 件ずつ用意してボードを開き、「Done のタスクを一覧で表示」タイルを押すと URL が view=list&state=done になり、一覧に done のタスクだけが残って open のタスクが消えることを検証する。作ったレコードは最後に削除する。',
        active: true,
    },
    (atf) => {
        // 前準備: 絞り込みで残る側（done）と消える側（open）を 1 件ずつ作る
        const insertDone = atf.server.recordInsert({
            $id: Now.ID['atf-tiles-insert-done'],
            table: 'x_2221398_handson_task',
            fieldValues: {
                title: 'ATFタイルテスト done',
                state: 'done',
            },
            assert: 'record_successfully_inserted',
        })

        const insertOpen = atf.server.recordInsert({
            $id: Now.ID['atf-tiles-insert-open'],
            table: 'x_2221398_handson_task',
            fieldValues: {
                title: 'ATFタイルテスト open',
                state: 'open',
            },
            assert: 'record_successfully_inserted',
        })

        // 本体: ボードのタイルを押して一覧へ移動する流れをブラウザで確認する
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-tiles-step-ui'],
            script: Now.include('./task-board-tiles.script.js'),
        })

        // 後片付け: テストで作ったレコードを消す（インスタンスにゴミを残さない）
        atf.server.recordDelete({
            $id: Now.ID['atf-tiles-delete-done'],
            table: 'x_2221398_handson_task',
            recordId: insertDone.record_id,
        })

        atf.server.recordDelete({
            $id: Now.ID['atf-tiles-delete-open'],
            table: 'x_2221398_handson_task',
            recordId: insertOpen.record_id,
        })
    }
)
