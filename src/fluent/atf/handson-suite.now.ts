// ハンズオンで作ったテストをまとめて実行するための Test Suite。
// 実行順は tests 配列の順番。速いサーバー側テストを先に、ブラウザが必要な UI テストを後に並べる。
import { TestSuite } from '@servicenow/sdk/core'
import {
    testCompletedAtOnInsertDone,
    testCompletedAtOnInsertOpen,
    testCompletedAtOnUpdateToDone,
    testCompletedAtClearedOnReopen,
} from './completed-at-rule.now'
import { testNavigatorModules } from './navigator-modules.now'
import { testTaskBoardListFilter } from './task-board-list.now'
import { testTaskBoardCreate } from './task-board-create.now'
import { testTaskBoardUnsavedModal } from './task-board-unsaved.now'
// 新 UI（Kanban ボード・タイル・タブ・ヘッダー）向けのテスト
import { testTaskBoardKanbanMove } from './task-board-kanban.now'
import { testTaskBoardOpenCard } from './task-board-open-card.now'
import { testTaskBoardTabs } from './task-board-tabs.now'
import { testTaskBoardStatTiles } from './task-board-tiles.now'
import { testTaskBoardHeaderNew } from './task-board-header-new.now'

export const handsonSuite = TestSuite({
    $id: Now.ID['atf-suite-handson'],
    name: 'Handson: Task ボード 一式',
    description:
        'Handson Task テーブルの Business Rule（completed_at）、ナビゲーターのモジュール表示、React UI Page（一覧・絞り込み・新規作成・未保存モーダル、Kanban ボードの移動・カード詳細・タブ・件数タイル・ヘッダー新規）を検証するスイート。',
    active: true,
    tests: [
        testCompletedAtOnInsertDone,
        testCompletedAtOnInsertOpen,
        testCompletedAtOnUpdateToDone,
        testCompletedAtClearedOnReopen,
        testNavigatorModules,
        testTaskBoardListFilter,
        testTaskBoardCreate,
        testTaskBoardUnsavedModal,
        testTaskBoardKanbanMove,
        testTaskBoardOpenCard,
        testTaskBoardTabs,
        testTaskBoardStatTiles,
        testTaskBoardHeaderNew,
    ],
})
