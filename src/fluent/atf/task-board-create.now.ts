// Created as part of the Fable/Opus orchestration hands-on.
// React UI Page（Task ボード）の「新規作成」フローを画面操作＋サーバー検証で確かめるテスト。
import { Test } from '@servicenow/sdk/core'

export const testTaskBoardCreate = Test(
    {
        $id: Now.ID['atf-create-test'],
        name: 'Handson: Task ボードから新規タスクを作成できる',
        description:
            'Task ボードの一覧から New を押して Title に「ATF新規作成テスト」を入力し、More Actions > Save で保存すると詳細画面（view=detail）へ遷移することを画面で確認する。さらに保存されたレコードを検索し、state=open かつ completed_at が空であることをサーバー側で検証してから削除する。',
        active: true,
    },
    (atf) => {
        // 1. 画面操作（新規作成 → 保存 → 詳細画面へ遷移）
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-create-step-ui'],
            script: Now.include('./task-board-create.script.js'),
        })

        // 2. 実際に DB へ入ったかを確認する（UI のメッセージだけを信じない）
        const created = atf.server.recordQuery({
            $id: Now.ID['atf-create-step-query'],
            table: 'x_2221398_handson_task',
            fieldValues: 'title=ATF新規作成テスト',
            assert: 'records_match_query',
        })

        // 3. 既定値 state=open と、Business Rule が動いていない（completed_at が空）ことを検証
        atf.server.recordValidation({
            $id: Now.ID['atf-create-step-validate'],
            table: 'x_2221398_handson_task',
            recordId: created.first_record,
            fieldValues: 'state=open^completed_atISEMPTY',
            assert: 'record_validated',
        })

        // 4. テストが作ったレコードは後片付けする
        atf.server.recordDelete({
            $id: Now.ID['atf-create-step-delete'],
            table: 'x_2221398_handson_task',
            recordId: created.first_record,
        })
    }
)
