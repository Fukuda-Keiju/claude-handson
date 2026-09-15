// Business Rule「Set completed_at on Handson Task」を検証する ATF テスト。
// ルールの中身は src/server/business-rules/set-completed-at.ts を参照:
//   state === 'done' かつ completed_at が空 → 現在時刻をセット
//   state !== 'done' かつ completed_at が入っている → 空にクリア
// before insert / before update の両方で動くので、insert 側と update 側を別々に検証する。
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// テスト対象のテーブル。テスト内で何度も使うので定数にしておく（sys_id はハードコードしない）
const TASK_TABLE = 'x_2221398_handson_task'

// --- 1. insert 時の肯定側 -------------------------------------------------
// state=done で新規作成すると、その場で completed_at が入るはず。
export const testCompletedAtOnInsertDone = Test(
    {
        $id: Now.ID['atf-completed-at-insert-done'],
        name: 'Handson: done で作成すると completed_at が入る',
        description:
            'Business Rule「Set completed_at on Handson Task」の insert 側・条件成立ケース。state=done で Handson Task を新規作成し、completed_atISNOTEMPTY で completed_at が自動セットされたことを検証する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // recordInsert は { table, record_id } を返すので、後続ステップにその record_id を渡す
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-completed-at-insert-done-insert'],
            table: TASK_TABLE,
            fieldValues: {
                title: 'ATF completed_at テスト（done で作成）',
                state: 'done',
            },
            assert: 'record_successfully_inserted',
        })

        // completed_atISNOTEMPTY = 「completed_at が空でない」ことを表すエンコードクエリ
        atf.server.recordValidation({
            $id: Now.ID['atf-completed-at-insert-done-check'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'completed_atISNOTEMPTY',
            assert: 'record_validated',
        })

        // テストが作ったレコードは必ず後片付けする
        atf.server.recordDelete({
            $id: Now.ID['atf-completed-at-insert-done-cleanup'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)

// --- 2. insert 時の否定側 -------------------------------------------------
// state=open で作成した場合は条件が成立しないので、completed_at は空のままのはず。
export const testCompletedAtOnInsertOpen = Test(
    {
        $id: Now.ID['atf-completed-at-insert-open'],
        name: 'Handson: open で作成すると completed_at は空のまま',
        description:
            'Business Rule「Set completed_at on Handson Task」の insert 側・条件不成立ケース（否定側）。state=open で Handson Task を新規作成し、completed_atISEMPTY で completed_at がセットされないことを検証する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-completed-at-insert-open-insert'],
            table: TASK_TABLE,
            fieldValues: {
                title: 'ATF completed_at テスト（open で作成）',
                state: 'open',
            },
            assert: 'record_successfully_inserted',
        })

        // completed_atISEMPTY = 「completed_at が空」であること
        atf.server.recordValidation({
            $id: Now.ID['atf-completed-at-insert-open-check'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'completed_atISEMPTY',
            assert: 'record_validated',
        })

        atf.server.recordDelete({
            $id: Now.ID['atf-completed-at-insert-open-cleanup'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)

// --- 3. update 時の肯定側 -------------------------------------------------
// ルールは insert だけでなく update でも動くので、更新経路も別テストで確認する。
export const testCompletedAtOnUpdateToDone = Test(
    {
        $id: Now.ID['atf-completed-at-update-done'],
        name: 'Handson: open から done に更新すると completed_at が入る',
        description:
            'Business Rule「Set completed_at on Handson Task」の update 側・条件成立ケース。state=open で作成したタスクを recordUpdate で state=done に更新し、completed_atISNOTEMPTY で completed_at が自動セットされたことを検証する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // まず completed_at が空の状態のレコードを用意する
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-completed-at-update-done-insert'],
            table: TASK_TABLE,
            fieldValues: {
                title: 'ATF completed_at テスト（open → done に更新）',
                state: 'open',
            },
            assert: 'record_successfully_inserted',
        })

        // insert で作ったレコードの record_id を recordId に渡して更新する
        atf.server.recordUpdate({
            $id: Now.ID['atf-completed-at-update-done-update'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: {
                state: 'done',
            },
            assert: 'record_successfully_updated',
        })

        atf.server.recordValidation({
            $id: Now.ID['atf-completed-at-update-done-check'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'state=done^completed_atISNOTEMPTY',
            assert: 'record_validated',
        })

        atf.server.recordDelete({
            $id: Now.ID['atf-completed-at-update-done-cleanup'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)

// --- 4. update 時の否定側 -------------------------------------------------
// ルールには「done 以外に戻したら completed_at をクリアする」分岐もあるので、そちらも検証する。
export const testCompletedAtClearedOnReopen = Test(
    {
        $id: Now.ID['atf-completed-at-reopen'],
        name: 'Handson: done から open に戻すと completed_at がクリアされる',
        description:
            'Business Rule「Set completed_at on Handson Task」の update 側・条件不成立ケース（否定側）。state=done で作成して completed_at が入った状態から state=open に戻し、completed_atISEMPTY で completed_at がクリアされることを検証する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // done で作成するので、この時点で completed_at が入る
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-completed-at-reopen-insert'],
            table: TASK_TABLE,
            fieldValues: {
                title: 'ATF completed_at テスト（done → open に戻す）',
                state: 'done',
            },
            assert: 'record_successfully_inserted',
        })

        atf.server.recordUpdate({
            $id: Now.ID['atf-completed-at-reopen-update'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: {
                state: 'open',
            },
            assert: 'record_successfully_updated',
        })

        atf.server.recordValidation({
            $id: Now.ID['atf-completed-at-reopen-check'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'state=open^completed_atISEMPTY',
            assert: 'record_validated',
        })

        atf.server.recordDelete({
            $id: Now.ID['atf-completed-at-reopen-cleanup'],
            table: TASK_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)
