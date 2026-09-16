// =============================================================================
// T3（Checkpoint / Positive）
//   確かめる仕様: 「3. state を done にすると completed_at に完了日時が入る」
//   種別: Positive（Business Rule の条件が成立するケース）
//   ねらい: Business Rule「Set completed_at on Todo Item」が insert 経路で
//           動いていることを確かめる。画面を使わないので数秒で終わります。
//   このテストは「正しいアプリ」でも「欠陥アプリ」でも緑になります。
// =============================================================================
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

// 別スコープ（x_2221398_todo）のテーブルなので as any で型チェックを通す（T1 の説明を参照）
const TODO_TABLE = 'x_2221398_todo_item' as any

export const testDoneSetsCompletedAt = Test(
    {
        $id: Now.ID['atf-t3-done-sets-completed'],
        name: 'Todo: Done にすると completed_at が入る',
        description:
            'state=done で Todo Item を新規作成し、Business Rule「Set completed_at on Todo Item」によって completed_at が自動でセットされること（completed_atISNOTEMPTY）を検証する（Positive）。最後に作成したレコードを削除する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // --- 1. 実行: 最初から done の状態で作る -------------------------------
        // before insert の Business Rule なので、作った瞬間に completed_at が入るはず。
        const inserted = atf.server.recordInsert({
            $id: Now.ID['atf-t3-step-insert'],
            table: TODO_TABLE,
            fieldValues: {
                title: 'ATF T3 完了',
                state: 'done',
            },
            assert: 'record_successfully_inserted',
        })

        // --- 2. 検証: completed_at が空でない ----------------------------------
        // ISNOTEMPTY は「空でないこと」を表すエンコードクエリの演算子。
        // 「いつが入るか」は実行時刻次第なので、値そのものではなく「入っているか」を見る。
        atf.server.recordValidation({
            $id: Now.ID['atf-t3-step-validate'],
            table: TODO_TABLE,
            recordId: inserted.record_id,
            fieldValues: 'state=done^completed_atISNOTEMPTY',
            assert: 'record_validated',
        })

        // --- 3. 後片付け -------------------------------------------------------
        atf.server.recordDelete({
            $id: Now.ID['atf-t3-step-cleanup'],
            table: TODO_TABLE,
            recordId: inserted.record_id,
            assert: 'record_successfully_deleted',
        })
    }
)
