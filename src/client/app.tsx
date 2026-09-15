// 画面の切り替え（ルーティング）とページ全体のレイアウトだけを担当するルートコンポーネント。
// データ取得は useTasks に、見た目は components/ 以下に分けている。
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Tabs, type TabItem, type TabsSelectedItemSet } from '@servicenow/react-components/Tabs'
import AppHeader from './components/AppHeader'
import StatTiles from './components/StatTiles'
import KanbanBoard from './components/KanbanBoard'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import { useTasks } from './hooks/useTasks'
import { getViewFromUrl, pushView, type FromView, type ViewName, type ViewState } from './navigation'
import type { StateFilter } from './types'
// tokens.css は各 CSS が参照する変数の定義元なので、必ず app.css より先に読み込む。
import './tokens.css'
import './app.css'

const PAGE_TITLE = 'Handson Task ボード'
const PAGE_SUBTITLE = 'Fluent SDK × React ハンズオン'

/** board / list を切り替えるタブ。id は ViewName と同じ文字列にして分岐を単純にする */
const TAB_ITEMS: TabItem[] = [
    { id: 'board', label: 'ボード', icon: 'board-flexible-outline' },
    { id: 'list', label: '一覧', icon: 'list-outline' },
]

/** detail / create はフォーム画面。ボード・一覧とはレイアウトが変わる */
const isFormView = (view: ViewName): boolean => view === 'detail' || view === 'create'

export default function App(): JSX.Element {
    // 初期表示は URL から決める（リロードやブックマークでも同じ画面が開く）
    const [current, setCurrent] = useState<ViewState>(getViewFromUrl)

    // データ取得はアプリ全体で 1 回だけ。ボードもタイルも同じ配列を見るのでズレない。
    const { tasks, counts, loading, error, refresh, moveTask } = useTasks()

    // ブラウザの戻る/進むに追従する
    useEffect(() => {
        const onPopState = () => setCurrent(getViewFromUrl())
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    // フォーム（detail / create）からボード・一覧へ戻ってきたら取り直す。
    // 保存結果（state の変更や新規レコード）をボードに反映させるため。
    const previousView = useRef<ViewName>(current.view)
    useEffect(() => {
        const was = previousView.current
        previousView.current = current.view
        if (isFormView(was) && !isFormView(current.view)) void refresh()
    }, [current.view, refresh])

    // 画面遷移はここに一本化し、子コンポーネントには props で渡す
    const navigate = useCallback((next: ViewState, titleSuffix = '') => {
        pushView(next, titleSuffix ? `${PAGE_TITLE} - ${titleSuffix}` : PAGE_TITLE)
        setCurrent(next)
    }, [])

    const { view, recordId, from, stateFilter } = current

    const goBoard = useCallback(() => {
        // ボードは全件表示なので絞り込みはリセットする
        navigate({ view: 'board', recordId: null, from: null, stateFilter: 'all' }, 'ボード')
    }, [navigate])

    const goList = useCallback(
        (filter: StateFilter) => {
            navigate({ view: 'list', recordId: null, from: null, stateFilter: filter }, '一覧')
        },
        [navigate]
    )

    // 「戻る」の遷移先。from が無いときは一覧に戻す（仕様の既定値）
    const backTarget: FromView = from ?? 'list'
    const goBack = useCallback(() => {
        if (backTarget === 'board') goBoard()
        else goList(stateFilter)
    }, [backTarget, goBoard, goList, stateFilter])

    const openDetail = useCallback(
        (sysId: string, title: string, origin: FromView) => {
            navigate({ view: 'detail', recordId: sysId, from: origin, stateFilter }, title || '詳細')
        },
        [navigate, stateFilter]
    )

    const openCreate = useCallback(
        (origin: FromView) => {
            navigate({ view: 'create', recordId: null, from: origin, stateFilter }, '新規作成')
        },
        [navigate, stateFilter]
    )

    // タブの選択値は e.detail.payload.value（e.detail 直下ではない）
    const handleTabSet = useCallback<TabsSelectedItemSet>(
        e => {
            if (String(e.detail.payload.value) === 'list') goList(stateFilter)
            else goBoard()
        },
        [goBoard, goList, stateFilter]
    )

    // タイルを押したら、その状態で絞り込んだ一覧へ移動する
    const handleFilterSelect = useCallback(
        (filter: StateFilter) => {
            goList(filter)
        },
        [goList]
    )

    const handleRefresh = useCallback(() => {
        void refresh()
    }, [refresh])

    // ヘッダーの「＋ 新規タスク」は、今いる画面を from として覚える
    const handleHeaderNewTask = useCallback(() => {
        openCreate(view === 'list' ? 'list' : 'board')
    }, [openCreate, view])

    // 新規作成の保存後は詳細画面へ。from はそのまま引き継いで戻り先を変えない。
    const handleCreateSaved = useCallback(
        (sysId: string) => {
            openDetail(sysId, '詳細', backTarget)
        },
        [openDetail, backTarget]
    )

    const backLabel = backTarget === 'board' ? '← ボードへ戻る' : '← 一覧へ戻る'
    // ボードは全件表示なので、タイルの選択表示も「すべて」に見せる
    const selectedFilter: StateFilter = view === 'list' ? stateFilter : 'all'

    return (
        <div className="task-board">
            <AppHeader
                title={PAGE_TITLE}
                subtitle={PAGE_SUBTITLE}
                onNewTask={handleHeaderNewTask}
                onRefresh={handleRefresh}
                refreshing={loading}
            />
            <main className="task-board__main">
                {isFormView(view) ? (
                    view === 'create' ? (
                        // 新規作成。sysId='-1' が「未保存の新規レコード」を表す
                        <TaskForm
                            key="new"
                            sysId="-1"
                            heading="新しいタスク"
                            backLabel={backLabel}
                            onSaved={handleCreateSaved}
                            onBack={goBack}
                        />
                    ) : (
                        // key にレコード ID を渡すと、別レコードに移ったときフォームが作り直される
                        <TaskForm
                            key={recordId ?? 'detail'}
                            sysId={recordId ?? '-1'}
                            heading="タスクを編集"
                            backLabel={backLabel}
                            onSaved={goBack}
                            onBack={goBack}
                        />
                    )
                ) : (
                    <>
                        <StatTiles
                            counts={counts}
                            loading={loading}
                            selected={selectedFilter}
                            onSelect={handleFilterSelect}
                        />
                        <div className="task-board__tabs">
                            <Tabs
                                items={TAB_ITEMS}
                                selectedItem={view}
                                size="md"
                                onSelectedItemSet={handleTabSet}
                            />
                        </div>
                        {view === 'list' ? (
                            <TaskList
                                stateFilter={stateFilter}
                                onFilterChange={handleFilterSelect}
                                onSelectTask={(sysId, title) => openDetail(sysId, title, 'list')}
                                onNewTask={() => openCreate('list')}
                            />
                        ) : (
                            <KanbanBoard
                                tasks={tasks}
                                loading={loading}
                                error={error}
                                onOpenTask={(sysId, title) => openDetail(sysId, title, 'board')}
                                onMoveTask={moveTask}
                                onRetry={refresh}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
