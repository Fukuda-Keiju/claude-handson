// =============================================================================
// Test Suite（テストの束）の定義
//
// TestSuite() は「どのテストをどの順で走らせるか」を決めるだけで、実行はしません。
// 実行は ATF の画面（Test Suites > Run Test Suite）か、CLI の
//   npx @servicenow/sdk cicd testsuite run --test-suite-name "..." --auth mypdi
// で行います。
//
// 並べ方のコツ:
//   速くて確実なサーバー側テストを先に、ブラウザ（Client Test Runner）が要る
//   UI テストを後ろに置くと、壊れているときに早く気づけます。
// =============================================================================
import { TestSuite } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'

import { testInsertDefaultsToOpen } from './t1-insert-open.now'
import { testUiCreateTask } from './t2-ui-create.now'
import { testDoneSetsCompletedAt } from './t3-done-sets-completed.now'
import { testEmptyTitleRejectedOnServer } from './t4-empty-title-server.now'
import { testEmptyTitleRejectedInUi } from './t5-empty-title-ui.now'

// --- 講師用のフルスイート（Checkpoint 3 本 + Solution 2 本）------------------
// 欠陥アプリに対して実行すると T4・T5 が赤くなり、「どこが壊れているか」が見えます。
export const todoSuite = TestSuite({
    $id: Now.ID['atf-suite-todo'],
    name: 'Todo: 講師用スイート (Checkpoint + Solution)',
    description:
        'Handson Todo アプリの 5 テストをまとめたスイート。T1〜T3（Checkpoint）は正しいアプリでも欠陥アプリでも緑になり、T4・T5（Solution / Negative）は「タイトル必須」が壊れている欠陥アプリでのみ赤になる。',
    active: true,
    // 配列の順番がそのまま実行順になります
    tests: [
        testInsertDefaultsToOpen, // T1 server
        testUiCreateTask, // T2 UI + server
        testDoneSetsCompletedAt, // T3 server
        testEmptyTitleRejectedOnServer, // T4 server（Negative）
        testEmptyTitleRejectedInUi, // T5 UI + server（Negative）
    ],
})

// --- 参加者が最初に走らせる Checkpoint 用スイート（3 本だけ）-----------------
// 「まずは全部緑になることを確かめる」ためのスイート。ここが緑なら環境は正常です。
export const todoCheckpointSuite = TestSuite({
    $id: Now.ID['atf-suite-todo-checkpoint'],
    name: 'Todo: Checkpoint (3 本)',
    description:
        'ハンズオンの前半で使う Checkpoint 用スイート。T1〜T3 のみを含み、正しいアプリでも欠陥アプリでもすべて緑になる（＝環境とアプリの基本動作が正しいことの確認用）。',
    active: true,
    tests: [
        testInsertDefaultsToOpen, // T1
        testUiCreateTask, // T2
        testDoneSetsCompletedAt, // T3
    ],
})
