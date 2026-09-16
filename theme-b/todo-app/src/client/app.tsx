// アプリ全体の司令塔。
//  1) URL（?view=...）から「今どの画面か」を決める
//  2) Table API からタスク一覧を読み込み、各画面に配る
//  3) 画面の切り替え（history.pushState）を行う
// 画面は 4 つ: ボード（既定）/ 一覧 / 新規作成 / 詳細。
import React, { useCallback, useEffect, useState } from 'react'
import { fetchTodos, toErrorMessage, updateTodo } from './api'
import type { TodoRecord, TodoState } from './api'
import BoardView from './components/BoardView'
import ListView from './components/ListView'
import TodoForm from './components/TodoForm'

/** 画面の種類 */
type ViewName = 'board' | 'list' | 'create' | 'detail'

/** create / detail をどこから開いたか（戻り先を覚えておくため） */
type FromView = 'board' | 'list'

interface Route {
    view: ViewName
    /** detail のときだけ使う sys_id */
    id: string | null
    from: FromView | null
}

const VIEW_NAMES: readonly string[] = ['board', 'list', 'create', 'detail']
const FROM_VIEWS: readonly string[] = ['board', 'list']

/**
 * 現在の URL から画面の状態を読み取る。
 * 画面の状態を URL に全部書いておくと、リロード・ブックマーク・ATF の直接アクセスで同じ結果になる。
 */
function readRoute(): Route {
    const params = new URLSearchParams(window.location.search)

    const rawView = params.get('view') ?? ''
    // 未知の値や未指定はボード（既定の画面）に寄せる
    const view = (VIEW_NAMES.includes(rawView) ? rawView : 'board') as ViewName

    const rawFrom = params.get('from') ?? ''
    const from = (FROM_VIEWS.includes(rawFrom) ? rawFrom : null) as FromView | null

    return { view, id: params.get('id') || null, from }
}

/** 画面の状態を ?view=...&id=...&from=... の形に組み立てる */
function buildSearch(route: Route): string {
    const params = new URLSearchParams({ view: route.view })
    if (route.id) params.set('id', route.id)
    if (route.from) params.set('from', route.from)
    return `?${params.toString()}`
}

export default function App() {
    // 現在の画面。初回は URL から読む
    const [route, setRoute] = useState<Route>(() => readRoute())
    const [todos, setTodos] = useState<TodoRecord[]>([])
    const [loading, setLoading] = useState(true)
    /** 通信の失敗など、画面全体に出すエラー */
    const [error, setError] = useState('')
    /** 「保存しました」のような完了メッセージ */
    const [status, setStatus] = useState('')

    /** サーバーから一覧を取り直す。作成・更新・削除のあとに毎回呼ぶ */
    const reload = useCallback(async () => {
        setLoading(true)
        try {
            setTodos(await fetchTodos())
            setError('')
        } catch (err) {
            setError('タスクの取得に失敗しました: ' + toErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }, [])

    // 初回表示のときに一度だけ読み込む
    useEffect(() => {
        void reload()
    }, [reload])

    // ブラウザの「戻る / 進む」でも画面が切り替わるようにする。
    // pushState だけでは戻るボタンで React の状態が変わらないため、popstate を拾って読み直す。
    useEffect(() => {
        const handlePopState = () => {
            setRoute(readRoute())
            setStatus('')
        }
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    /** 画面を切り替える。ページは再読み込みせず、URL だけ書き換える */
    const navigate = useCallback((next: Route, message = '') => {
        window.history.pushState(next, '', window.location.pathname + buildSearch(next))
        setRoute(next)
        setStatus(message)
        setError('')
    }, [])

    /** detail / create から戻る先。from が board のときだけボード、それ以外は一覧 */
    const backView: FromView = route.from === 'board' ? 'board' : 'list'
    const backLabel = backView === 'board' ? '← ボードへ戻る' : '← 一覧へ戻る'

    /** カード・行の「開く」を押したとき。どこから来たかを from に残す */
    const openDetail = (todo: TodoRecord, from: FromView) => {
        navigate({ view: 'detail', id: todo.sysId, from })
    }

    /** ボードの移動ボタン。PATCH してから一覧を取り直す（画面の値はサーバーの結果に合わせる） */
    const moveTodo = async (todo: TodoRecord, next: TodoState) => {
        setLoading(true)
        try {
            await updateTodo(todo.sysId, { state: next })
            await reload()
        } catch (err) {
            setError('状態の更新に失敗しました: ' + toErrorMessage(err))
            setLoading(false)
        }
    }

    /** 今の画面の中身を組み立てる */
    const renderView = () => {
        if (route.view === 'create') {
            return (
                <TodoForm
                    mode="create"
                    todo={null}
                    backLabel={backLabel}
                    onSaved={async () => {
                        // 保存できたら一覧を取り直してから一覧画面へ移る
                        await reload()
                        navigate({ view: 'list', id: null, from: null }, '保存しました')
                    }}
                    onDeleted={() => undefined}
                    onCancel={() => navigate({ view: backView, id: null, from: null })}
                />
            )
        }

        if (route.view === 'detail') {
            // まだ 1 件も読めていないときだけ「読み込み中」を出す。
            // 2 回目以降（更新のあとの取り直しなど）は前のデータを出したままにしてチラつきを防ぐ。
            if (loading && todos.length === 0) return <p className="app__hint">読み込み中...</p>

            const todo = todos.find((item) => item.sysId === route.id) ?? null
            if (!todo) {
                return <p className="app__hint">タスクが見つかりません。前の画面に戻ってください。</p>
            }

            return (
                // key を付けると、別のレコードを開いたときにフォームが作り直されて入力欄が初期化される
                <TodoForm
                    key={todo.sysId}
                    mode="detail"
                    todo={todo}
                    backLabel={backLabel}
                    onSaved={async () => {
                        await reload()
                        navigate({ view: backView, id: null, from: null }, '保存しました')
                    }}
                    onDeleted={async () => {
                        await reload()
                        navigate({ view: backView, id: null, from: null }, '削除しました')
                    }}
                    onCancel={() => navigate({ view: backView, id: null, from: null })}
                />
            )
        }

        if (loading && todos.length === 0) return <p className="app__hint">読み込み中...</p>

        if (route.view === 'list') {
            return <ListView todos={todos} onOpen={(todo) => openDetail(todo, 'list')} />
        }

        return <BoardView todos={todos} onOpen={(todo) => openDetail(todo, 'board')} onMove={moveTodo} busy={loading} />
    }

    // タブはボードと一覧のときだけ出す（フォーム編集中は出さない）
    const showTabs = route.view === 'board' || route.view === 'list'

    return (
        <div className="app">
            <header className="app__header">
                <h1 className="app__title">Handson Todo</h1>
                <button
                    type="button"
                    className="app__new"
                    onClick={() => navigate({ view: 'create', id: null, from: null })}
                >
                    New
                </button>
            </header>

            {showTabs && (
                // role="tablist" / role="tab" と aria-selected で「タブ」だと伝える
                <div className="app__tabs" role="tablist" aria-label="表示の切り替え">
                    <button
                        type="button"
                        role="tab"
                        className="app__tab"
                        aria-selected={route.view === 'board'}
                        onClick={() => navigate({ view: 'board', id: null, from: null })}
                    >
                        ボード
                    </button>
                    <button
                        type="button"
                        role="tab"
                        className="app__tab"
                        aria-selected={route.view === 'list'}
                        onClick={() => navigate({ view: 'list', id: null, from: null })}
                    >
                        一覧
                    </button>
                </div>
            )}

            {/*
              role="status" は「完了のお知らせ」用。控えめに読み上げられる。
              aria-label に同じ文言を入れておくと、要素の名前が中の文字と必ず一致するので
              テスト（ATF）から名前で探せる。
            */}
            {status && (
                <p className="app__status" role="status" aria-label={status}>
                    {status}
                </p>
            )}

            {/* 画面全体のエラー（読み込み失敗など）。フォームの入力エラーは TodoForm 側に出る */}
            {error && (
                <p className="app__error" role="alert" aria-label={error}>
                    {error}
                </p>
            )}

            <main className="app__main">{renderView()}</main>
        </div>
    )
}
