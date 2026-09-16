// Handson Todo アプリの中心となるテーブル定義。
// Fluent SDK では「テーブル = Table() の呼び出し」で表現し、build 時に
// sys_db_object / sys_dictionary のレコードへ変換される。
import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    ChoiceColumn,
    DateColumn,
    DateTimeColumn,
    MultiLineTextColumn,
    Record,
} from '@servicenow/sdk/core'

// テーブル名はスコープ接頭辞 x_2221398_todo で始める必要がある。
// display: 'title' にすると、参照フィールドやリストで title 列が
// 「そのレコードの代表的な表示名」として使われる。
// audit: true にすると変更履歴（Activity）が記録される。
export const x_2221398_todo_item = Table({
    name: 'x_2221398_todo_item',
    label: 'Todo Item',
    display: 'title',
    audit: true,
    schema: {
        // タスクのタイトル。フォーム上は必須（mandatory）だが、
        // REST API やスクリプト経由の insert では mandatory は効かないので、
        // サーバー側の守りは Business Rule「Validate Todo title」で行う。
        title: StringColumn({
            label: 'Title',
            maxLength: 100,
            mandatory: true,
        }),
        // 進捗状態。choices のキーがデータベースに入る値、値が画面に出るラベル。
        state: ChoiceColumn({
            label: 'State',
            choices: {
                open: 'Open',
                in_progress: 'In Progress',
                done: 'Done',
            },
            default: 'open',
        }),
        // 期限（日付のみ）
        due_date: DateColumn({ label: 'Due date' }),
        // 完了日時。Business Rule が自動で書き込むので、人が編集できないよう readOnly。
        completed_at: DateTimeColumn({ label: 'Completed at', readOnly: true }),
        // 備考（複数行テキスト）
        notes: MultiLineTextColumn({ label: 'Notes' }),
    },
})

// ここから下はデモ用のサンプルレコード。
// $meta.installMethod: 'demo' を付けると「デモデータ付きでインストール」した
// ときだけ入る。アプリの本体データとは分けて扱われる。
Record({
    $id: Now.ID['todo-item-demo-1'],
    $meta: { installMethod: 'demo' },
    table: 'x_2221398_todo_item',
    data: {
        title: 'Fluent SDK で Table を定義する',
        state: 'done',
        due_date: '2026-09-10',
    },
})

Record({
    $id: Now.ID['todo-item-demo-2'],
    $meta: { installMethod: 'demo' },
    table: 'x_2221398_todo_item',
    data: {
        title: 'React で画面を作る',
        state: 'in_progress',
        due_date: '2026-09-20',
    },
})
