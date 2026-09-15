// React 製の UI Page と、アプリケーションナビゲーターの入口をまとめて定義する。
import { ApplicationMenu, Record, UiPage } from '@servicenow/sdk/core'
// src/client/ のビルド結果が html として埋め込まれる
import page from '../../client/index.html'

// direct: true にすると Jelly ではなく素の HTML/JS として配信される
export const taskBoardPage = UiPage({
    $id: Now.ID['ui-page-task-board'],
    endpoint: 'x_2221398_handson_task_board.do',
    description: 'Handson Task を一覧・編集・新規作成する React 製の UI Page',
    html: page,
    direct: true,
})

// ナビゲーターに表示される親メニュー
export const handsonMenu = ApplicationMenu({
    $id: Now.ID['app-menu-handson'],
    title: 'Claude Handson',
    description: 'Fluent SDK ハンズオン用のアプリケーションメニュー',
    active: true,
})

// メニュー項目1: UI Page を直接開く（link_type: DIRECT + query に .do のパス）
export const taskBoardModule = Record({
    $id: Now.ID['app-module-task-board'],
    table: 'sys_app_module',
    data: {
        title: 'Task ボード (React)',
        application: handsonMenu,
        link_type: 'DIRECT',
        query: 'x_2221398_handson_task_board.do',
        active: true,
        order: 100,
    },
})

// メニュー項目2: 標準のリストビュー（link_type: LIST + name にテーブル名）
export const taskListModule = Record({
    $id: Now.ID['app-module-task-list'],
    table: 'sys_app_module',
    data: {
        title: 'Handson Task 一覧',
        application: handsonMenu,
        link_type: 'LIST',
        name: 'x_2221398_handson_task',
        active: true,
        order: 200,
    },
})
