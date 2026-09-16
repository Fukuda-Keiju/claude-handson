// React 製の UI Page と、アプリケーションナビゲーターの入口をまとめて定義する。
import '@servicenow/sdk/global'
import { ApplicationMenu, Record, UiPage } from '@servicenow/sdk/core'
// src/client/ をビルドした結果（1 枚の HTML）が html として埋め込まれる
import page from '../../client/index.html'

// direct: true にすると Jelly（ServiceNow 独自のテンプレート言語）として
// 解釈されず、素の HTML/JS としてそのまま配信される。React アプリには必須。
export const todoBoardPage = UiPage({
    $id: Now.ID['ui-page-todo-board'],
    endpoint: 'x_2221398_todo_board.do',
    description: 'Todo Item を一覧・編集・新規作成する React 製の UI Page',
    html: page,
    direct: true,
})

// ナビゲーター（左サイドバー）に表示される親メニュー
export const todoMenu = ApplicationMenu({
    $id: Now.ID['app-menu-todo'],
    title: 'Handson Todo',
    description: 'Fluent SDK × ATF ハンズオン用のアプリケーションメニュー',
    active: true,
})

// メニュー項目1: UI Page を直接開く（link_type: 'DIRECT' + query に .do のパス）
export const todoBoardModule = Record({
    $id: Now.ID['app-module-todo-board'],
    table: 'sys_app_module',
    data: {
        title: 'Handson Todo board',
        application: todoMenu,
        link_type: 'DIRECT',
        query: 'x_2221398_todo_board.do',
        active: true,
        order: 100,
    },
})

// メニュー項目2: 標準のリストビュー（link_type: 'LIST' + name にテーブル名）
export const todoListModule = Record({
    $id: Now.ID['app-module-todo-list'],
    table: 'sys_app_module',
    data: {
        title: 'Todo Item 一覧',
        application: todoMenu,
        link_type: 'LIST',
        name: 'x_2221398_todo_item',
        active: true,
        order: 200,
    },
})
