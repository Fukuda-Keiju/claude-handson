// 新規作成（?view=create）と詳細・編集（?view=detail）で共通に使うフォーム。
// 2 つの画面はほとんど同じ入力欄なので、1 つの部品にまとめて mode で切り替える。
// こうしておくと「タイトル必須チェック」を 1 か所だけに書けばよい（下の ★ の if 文）。
import React, { useState } from 'react'
import { createTodo, deleteTodo, STATE_LABEL, TODO_STATES, toErrorMessage, updateTodo } from '../api'
import type { TodoRecord, TodoState } from '../api'

interface TodoFormProps {
    /** create = 新規作成フォーム / detail = 詳細・編集フォーム */
    mode: 'create' | 'detail'
    /** detail のときの編集対象。create のときは null */
    todo: TodoRecord | null
    /** 戻るボタンの文言（detail のときだけ使う）。例: ← 一覧へ戻る */
    backLabel: string
    /** 保存に成功したときに呼ぶ。呼び出し側が一覧を取り直して画面を移す */
    onSaved: () => void | Promise<void>
    /** 削除に成功したときに呼ぶ */
    onDeleted: () => void | Promise<void>
    /** Cancel / 戻る を押したとき */
    onCancel: () => void
}

export default function TodoForm({ mode, todo, backLabel, onSaved, onDeleted, onCancel }: TodoFormProps) {
    const isCreate = mode === 'create'

    // 入力中の値は React の state で持つ（いわゆる制御コンポーネント）。
    // 初期値は編集対象のレコードから。新規作成なら空。
    const [title, setTitle] = useState(todo?.title ?? '')
    const [state, setState] = useState<TodoState>(todo?.state ?? 'open')
    const [dueDate, setDueDate] = useState(todo?.dueDate ?? '')
    const [notes, setNotes] = useState(todo?.notes ?? '')

    /** エラーメッセージ（空文字なら何も出さない） */
    const [error, setError] = useState('')
    /** 通信中はボタンを二度押しできないようにする */
    const [busy, setBusy] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // <form> の既定動作（ページ再読み込み）を止める
        event.preventDefault()

        // ★ ここが仕様 1（タイトルは必須）の画面側の守り。欠陥版ではここを外す。
        if (title.trim() === '') {
            setError('タイトルは必須です')
            return
        }

        setBusy(true)
        setError('')
        try {
            if (isCreate) {
                // 新規作成。state はテーブル側の既定値（open）に任せるので送らない。
                await createTodo({ title: title.trim(), due_date: dueDate, notes })
            } else if (todo) {
                // 更新。PATCH なので、ここに書いた列だけが上書きされる。
                await updateTodo(todo.sysId, { title: title.trim(), state, due_date: dueDate, notes })
            }
            await onSaved()
        } catch (err) {
            // Business Rule の abort（サーバー側のタイトル必須チェック）もここに入ってくる
            setError(toErrorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    async function handleDelete() {
        if (!todo) return
        setBusy(true)
        setError('')
        try {
            await deleteTodo(todo.sysId)
            await onDeleted()
        } catch (err) {
            setError(toErrorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    return (
        <form className="todo-form" onSubmit={handleSubmit} noValidate>
            <h2 className="todo-form__heading">{isCreate ? '新しいタスク' : 'タスクの詳細'}</h2>

            {/*
              role="alert" を付けた要素は、表示された瞬間に読み上げソフトが読み上げる。
              aria-label にも同じ文言を入れているのは、role="alert" が
              「中の文字＝要素の名前」とは限らない役割のため。
              こうしておくとテスト（ATF）からも名前で確実に見つけられる。
            */}
            {error && (
                <p className="todo-form__alert" role="alert" aria-label={error}>
                    {error}
                </p>
            )}

            <div className="todo-form__field">
                {/* label の htmlFor と input の id を揃えると、入力欄の「名前」が Title になる */}
                <label htmlFor="todo-title">Title</label>
                <input
                    id="todo-title"
                    type="text"
                    maxLength={100}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            {/* State は既存レコードだけが持つ。新規作成では既定値 Open になるので出さない */}
            {!isCreate && (
                <div className="todo-form__field">
                    <label htmlFor="todo-state">State</label>
                    <select
                        id="todo-state"
                        value={state}
                        onChange={(event) => setState(event.target.value as TodoState)}
                    >
                        {TODO_STATES.map((option) => (
                            <option key={option} value={option}>
                                {STATE_LABEL[option]}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="todo-form__field">
                <label htmlFor="todo-due-date">Due date</label>
                <input
                    id="todo-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                />
            </div>

            <div className="todo-form__field">
                <label htmlFor="todo-notes">Notes</label>
                <textarea
                    id="todo-notes"
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                />
            </div>

            {/* Completed at は Business Rule が入れる列なので、読み取り専用の表示だけにする */}
            {!isCreate && (
                <p className="todo-form__readonly">
                    <span className="todo-form__readonly-label">Completed at</span>
                    <span>{todo?.completedAt || '—'}</span>
                </p>
            )}

            <div className="todo-form__actions">
                <button type="submit" className="todo-form__save" disabled={busy}>
                    Save
                </button>

                {isCreate ? (
                    <button type="button" className="todo-form__secondary" onClick={onCancel} disabled={busy}>
                        Cancel
                    </button>
                ) : (
                    <>
                        <button type="button" className="todo-form__delete" onClick={handleDelete} disabled={busy}>
                            Delete
                        </button>
                        <button type="button" className="todo-form__secondary" onClick={onCancel} disabled={busy}>
                            {backLabel}
                        </button>
                    </>
                )}
            </div>
        </form>
    )
}
