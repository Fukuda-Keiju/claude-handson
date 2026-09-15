// Created as part of the Fable/Opus orchestration hands-on.
// ヘッダーの「＋ 新規タスク」から開いた作成画面が、開いた場所（ボード）へ戻ることを検証するテスト。
import { Test } from '@servicenow/sdk/core'

export const testTaskBoardHeaderNew = Test(
    {
        $id: Now.ID['atf-header-new-test'],
        name: 'Handson: ヘッダーの新規タスクから開いた作成画面はボードへ戻る',
        description:
            'ボード表示中にヘッダーの「＋ 新規タスク」を押すと、URL が view=create&from=board になり、戻るボタンのラベルが「← ボードへ戻る」になることを確認する（一覧から開いた場合は「← 一覧へ戻る」になる）。何も入力せずに戻ると Kanban ボードへ戻り URL が view=board になることを検証する。Title を入力せず保存もしないのでレコードは作られない＝後片付けは不要。',
        active: true,
    },
    (atf) => {
        // 画面遷移（from の引き継ぎ）だけを見るテスト。保存しないのでレコードは作られない。
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-header-new-step-ui'],
            script: Now.include('./task-board-header-new.script.js'),
        })
    }
)
