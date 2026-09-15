// アプリケーションナビゲーター（左メニュー）に、ハンズオンで作った 2 つのモジュールが
// 表示されることを検証する ATF テスト。
import { Test } from '@servicenow/sdk/core'
import '@servicenow/sdk/global'
// sys_id をハードコードしないため、Fluent 定義の Record オブジェクトをそのまま import して渡す
import { taskBoardModule, taskListModule } from '../ui-pages/task-board.now'

export const testNavigatorModules = Test(
    {
        $id: Now.ID['atf-navigator-modules'],
        name: 'Handson: ナビゲーターに Handson のモジュールが表示される',
        description:
            'アプリケーションメニュー「Claude Handson」配下のモジュール「Task ボード (React)」と「Handson Task 一覧」が、Next Experience (polaris) のナビゲーターに表示されることを moduleVisibility で検証する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // navigator: 'polaris' は Next Experience のナビゲーター。
        // assertVisible: 'at_least_modules_visible' は「少なくともこれらが見えていれば合格」
        //（他のモジュールが並んでいても失敗しない）という意味。
        atf.applicationNavigator.moduleVisibility({
            $id: Now.ID['atf-navigator-modules-visible'],
            navigator: 'polaris',
            visibleModules: [taskBoardModule, taskListModule],
            assertVisible: 'at_least_modules_visible',
        })
    }
)
