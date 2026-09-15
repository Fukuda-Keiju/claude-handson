// Created as part of the Fable/Opus orchestration hands-on.
// React UI Page（Task ボード）のタブ切り替え（ボード <-> 一覧）を検証するテスト。
import { Test } from '@servicenow/sdk/core'

export const testTaskBoardTabs = Test(
    {
        $id: Now.ID['atf-tabs-test'],
        name: 'Handson: タブでボードと一覧を切り替えられる',
        description:
            'Handson Task ボード (/x_2221398_handson_task_board.do) を view 無しで開くと Kanban ボードが表示されることを列見出し「Open」で確認し、タブ「一覧」を押すと一覧（状態で絞り込みのプルダウン）に切り替わって URL が view=list になること、さらにタブ「ボード」で元に戻って URL が view=board になることを検証する。レコードは作らないので後片付けは不要。',
        active: true,
    },
    (atf) => {
        // 画面の切り替えだけを見るテスト。データを作らないので recordDelete も要らない。
        atf.uiTestScript.runTest({
            $id: Now.ID['atf-tabs-step-ui'],
            script: Now.include('./task-board-tabs.script.js'),
        })
    }
)
