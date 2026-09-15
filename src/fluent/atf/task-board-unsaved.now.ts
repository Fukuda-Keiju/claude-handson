// Created as part of the Fable/Opus orchestration hands-on.
// 未保存の変更があるときの確認モーダル（UnsavedChangesModal）の挙動を確かめるテスト。
import { Test } from '@servicenow/sdk/core'

export const testTaskBoardUnsavedModal = Test(
    {
        $id: Now.ID['atf-unsaved-test'],
        name: 'Handson: 未保存のまま戻ると確認モーダルが出る',
        description:
            'Task ボードの新規作成画面で Title を入力して未保存状態にし、「← 一覧へ戻る」を押すと確認モーダルが開くことを確認する。モーダルの「キャンセル」を押すとモーダルだけが閉じて作成画面（view=create）に留まる、という取り消し側の分岐を検証する。',
        active: true,
    },
    (atf) => {
        // 保存しないのでレコードは作られない＝後片付けは不要
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-unsaved-step-ui'],
            script: Now.include('./task-board-unsaved.script.js'),
        })
    }
)
