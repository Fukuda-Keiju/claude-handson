// =============================================================================
// Checkpoint 用の Test Suite（T1〜T3 の 3 本だけ）
//
// 生成が間に合わなかった参加者に渡す「ここまでの正解」です。
// このフォルダの 5 ファイルを atfNN/src/fluent/atf/ にコピーして
//   npm run build → npm run deploy
// すると、ATF の Tests 一覧に 3 本のテストとこのスイートが現れます。
//
// TestSuite() は「どのテストをどの順で走らせるか」を決めるだけで、実行はしません。
// =============================================================================
import { TestSuite } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

import { testInsertDefaultsToOpen } from './t1-insert-open.now'
import { testUiCreateTask } from './t2-ui-create.now'
import { testDoneSetsCompletedAt } from './t3-done-sets-completed.now'

export const todoCheckpointSuite = TestSuite({
    $id: Now.ID['atf-suite-todo-checkpoint'],
    name: 'Todo: Checkpoint (3 本)',
    description:
        'ハンズオンの前半で使う Checkpoint 用スイート。T1〜T3 のみを含み、正しいアプリでも欠陥アプリでもすべて緑になる（＝環境とアプリの基本動作が正しいことの確認用）。',
    active: true,
    // 配列の順番がそのまま実行順。速いサーバー側を先、ブラウザが要る UI を後に。
    tests: [
        testInsertDefaultsToOpen, // T1 server
        testUiCreateTask, // T2 UI + server
        testDoneSetsCompletedAt, // T3 server
    ],
})
