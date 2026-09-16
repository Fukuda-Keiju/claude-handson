// 一覧表示（?view=list）。更新日時の新しい順にテーブルで並べる。
import React from 'react'
import { STATE_LABEL } from '../api'
import type { TodoRecord } from '../api'

interface ListViewProps {
    todos: TodoRecord[]
    /** 行の「開く」ボタンを押したとき（詳細画面へ） */
    onOpen: (todo: TodoRecord) => void
}

export default function ListView({ todos, onOpen }: ListViewProps) {
    if (todos.length === 0) {
        return <p className="list__empty">タスクはまだありません。右上の New から作成してください。</p>
    }

    return (
        <table className="list">
            <caption className="list__caption">更新が新しい順に表示しています</caption>
            <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col">Due date</th>
                    <th scope="col">Completed at</th>
                </tr>
            </thead>
            <tbody>
                {todos.map((todo) => (
                    <tr key={todo.sysId}>
                        <td>
                            {/* 見えている文字はタイトルだが、要素の名前は aria-label の「〇〇」を開く */}
                            <button
                                type="button"
                                className="list__open"
                                aria-label={`「${todo.title}」を開く`}
                                onClick={() => onOpen(todo)}
                            >
                                {todo.title}
                            </button>
                        </td>
                        <td>{STATE_LABEL[todo.state]}</td>
                        <td>{todo.dueDate || '—'}</td>
                        <td>{todo.completedAt || '—'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
