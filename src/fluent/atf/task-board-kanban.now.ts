// Kanban ボードのカード移動が、画面だけでなく DB（state / completed_at）まで反映されるかを見る ATF テスト。
// 移動ボタン → Table API の PATCH → Business Rule「Set completed_at on Handson Task」という流れを
// 1 本のテストで通しで確認する。
import { Test } from '@servicenow/sdk/core'

// テスト対象のテーブル。sys_id はハードコードせずテーブル名で参照する
const TASK_TABLE = 'x_2221398_handson_task'

export const testTaskBoardKanbanMove = Test(
    {
        $id: Now.ID['atf-kanban-test'],
        name: 'Handson: ボードでカードを移動すると state と completed_at が連動する',
        description:
            'state=open のタスクを 1 件用意し、Handson Task ボードの Kanban でカードの移動ボタンを押して Open → In Progress → Done と動かす。画面上でカードが隣の列へ移ったこと（出る/消える移動ボタン）と「完了 ...」チップが出ることを確認したうえで、サーバー側で state=done かつ completed_at が空でないことを検証する。最後にテストレコードを削除する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // 1. 前準備: 一番左（Open 列）に置きたいので state=open で 1 件作る
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-kanban-insert'],
            table: TASK_TABLE,
            fieldValues: {
                title: 'ATFボード移動テスト',
                state: 'open',
            },
            assert: 'record_successfully_inserted',
        })

        // 2. 本体: ブラウザ上でカードを Open → In Progress → Done へ動かす
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-kanban-ui'],
            script: Now.include('./task-board-kanban.script.js'),
        })

        // 3. UI は PATCH 前に見た目だけ先に動く（楽観的更新）可能性があるので、
        //    最終的な正解は DB に問い合わせて確かめる。
        //    completed_at は Business Rule が入れるものなので、UI からは見えない副作用まで検証できる。
        atf.server.recordValidation({
            $id: Now.ID['atf-kanban-validate'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'state=done^completed_atISNOTEMPTY',
            assert: 'record_validated',
        })

        // 4. 後片付け: テストが作ったレコードを消してインスタンスにゴミを残さない
        atf.server.recordDelete({
            $id: Now.ID['atf-kanban-delete'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)
