// ボードのカードから詳細画面を開き、「← ボードへ戻る」でボードに戻れることを確かめる ATF テスト。
// 「どこから開いたか（from=board / from=list）」を URL に持たせている実装の確認も兼ねる。
import { Test } from '@servicenow/sdk/core'

// テスト対象のテーブル。sys_id はハードコードせずテーブル名で参照する
const TASK_TABLE = 'x_2221398_handson_task'

export const testTaskBoardOpenCard = Test(
    {
        $id: Now.ID['atf-open-card-test'],
        name: 'Handson: ボードのカードから詳細を開きボードへ戻れる',
        description:
            'state=in_progress のタスクを 1 件用意し、Handson Task ボードの Kanban カードをクリックして詳細画面（view=detail&from=board）へ遷移することを確認する。詳細では何も編集せずに「← ボードへ戻る」を押し、確認モーダルが出ずにボード（view=board）へ戻れることを検証する。最後にテストレコードを削除する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // 1. 前準備: In Progress 列に置きたいので state=in_progress で 1 件作る
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-open-card-insert'],
            table: TASK_TABLE,
            fieldValues: {
                title: 'ATFカード詳細テスト',
                state: 'in_progress',
            },
            assert: 'record_successfully_inserted',
        })

        // 2. 本体: ボード → 詳細 → ボード の往復を画面操作で確認する
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-open-card-ui'],
            script: Now.include('./task-board-open-card.script.js'),
        })

        // 3. 後片付け: テストが作ったレコードを消してインスタンスにゴミを残さない
        atf.server.recordDelete({
            $id: Now.ID['atf-open-card-delete'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)
