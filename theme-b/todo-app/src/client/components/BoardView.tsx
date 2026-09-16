// ボード表示（既定の画面）。Open / In Progress / Done の 3 列にカードを並べる。
import React from 'react'
import { STATE_LABEL, TODO_STATES } from '../api'
import type { TodoRecord, TodoState } from '../api'

interface BoardViewProps {
    todos: TodoRecord[]
    /** カードを押したとき（詳細画面へ） */
    onOpen: (todo: TodoRecord) => void
    /** 移動ボタンを押したとき（PATCH して一覧を取り直す） */
    onMove: (todo: TodoRecord, next: TodoState) => void
    /** 移動の通信中はボタンを押せなくする */
    busy: boolean
}

/**
 * その state の「隣の列」を返す。
 * Open → [In Progress] / In Progress → [Open, Done] / Done → [In Progress]
 * 隣だけに絞るのは、1 回のクリックで状態が飛びすぎないようにするため。
 */
function neighborStates(state: TodoState): TodoState[] {
    const index = TODO_STATES.indexOf(state)
    const neighbors: TodoState[] = []
    if (index > 0) neighbors.push(TODO_STATES[index - 1])
    if (index < TODO_STATES.length - 1) neighbors.push(TODO_STATES[index + 1])
    return neighbors
}

export default function BoardView({ todos, onOpen, onMove, busy }: BoardViewProps) {
    return (
        <div className="board">
            {TODO_STATES.map((state) => {
                const cards = todos.filter((todo) => todo.state === state)
                return (
                    <section className="board__column" key={state}>
                        <h2 className="board__heading">{STATE_LABEL[state]}</h2>
                        <p className="board__count">{cards.length} 件</p>

                        <ul className="board__cards">
                            {cards.map((todo) => (
                                <li className="board__card" key={todo.sysId}>
                                    {/*
                                      カード全体を押せるボタンにする。
                                      見た目はタイトルだが、読み上げソフト（と ATF）が使う名前は
                                      aria-label の「〇〇」を開く になる。
                                    */}
                                    <button
                                        type="button"
                                        className="board__card-open"
                                        aria-label={`「${todo.title}」を開く`}
                                        onClick={() => onOpen(todo)}
                                    >
                                        <span className="board__card-title">{todo.title}</span>
                                        {todo.dueDate && <span className="board__card-due">期限 {todo.dueDate}</span>}
                                    </button>

                                    <div className="board__card-actions">
                                        {neighborStates(state).map((next) => (
                                            <button
                                                type="button"
                                                key={next}
                                                className="board__move"
                                                aria-label={`「${todo.title}」を ${STATE_LABEL[next]} へ移動`}
                                                disabled={busy}
                                                onClick={() => onMove(todo, next)}
                                            >
                                                {STATE_LABEL[next]} へ
                                            </button>
                                        ))}
                                    </div>
                                </li>
                            ))}

                            {cards.length === 0 && <li className="board__empty">タスクはありません</li>}
                        </ul>
                    </section>
                )
            })}
        </div>
    )
}
