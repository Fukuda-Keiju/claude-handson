// 画面の切り替え（ルーティング）だけを担当するルートコンポーネント。
// 一覧・フォームの中身は components/ 以下に分けている。
import React, { useCallback, useEffect, useState } from 'react'
import { Heading } from '@servicenow/react-components/Heading'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import { getViewFromUrl, pushView, ViewName, ViewState } from './navigation'
import './app.css'

const PAGE_TITLE = 'Handson Task ボード'

export default function App(): JSX.Element {
    // 初期表示は URL から決める（リロードやブックマークでも同じ画面が開く）
    const [current, setCurrent] = useState<ViewState>(getViewFromUrl)

    // ブラウザの戻る/進むに追従する
    useEffect(() => {
        const onPopState = () => setCurrent(getViewFromUrl())
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    // 画面遷移はここに一本化し、子コンポーネントには props で渡す
    const navigateToView = useCallback((view: ViewName, recordId: string | null = null, title = '') => {
        const next: ViewState = { view, recordId }
        pushView(next, title ? `${PAGE_TITLE} - ${title}` : PAGE_TITLE)
        setCurrent(next)
    }, [])

    const backToList = useCallback(() => navigateToView('list', null, '一覧'), [navigateToView])

    const { view, recordId } = current

    return (
        <div className="task-board">
            <Heading label={PAGE_TITLE} level={1} variant="header-primary" />
            <div className="task-board__content">
                {view === 'create' ? (
                    // 新規作成。sysId='-1' が「未保存の新規レコード」を表す
                    <TaskForm
                        key="new"
                        sysId="-1"
                        onSaved={(sysId) => navigateToView('detail', sysId, '詳細')}
                        onBack={backToList}
                    />
                ) : view === 'detail' && recordId ? (
                    // key にレコード ID を渡すと、別レコードに移ったときフォームが作り直される
                    <TaskForm key={recordId} sysId={recordId} onSaved={backToList} onBack={backToList} />
                ) : (
                    <TaskList
                        onSelectTask={(sysId, title) => navigateToView('detail', sysId, title || '詳細')}
                        onNewTask={() => navigateToView('create', null, '新規作成')}
                    />
                )}
            </div>
        </div>
    )
}
