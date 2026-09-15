// 状態ごとの 3 列ボード。カードをドラッグ&ドロップして state を変更できる。
// データの取得・更新は props 経由（useTasks が持つ）。ここは「描く」ことだけに集中する。
import React, { useCallback, useMemo, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Badge } from '@servicenow/react-components/Badge'
import { Button } from '@servicenow/react-components/Button'
import { ButtonIconic } from '@servicenow/react-components/ButtonIconic'
import { Card } from '@servicenow/react-components/Card'
import { Loader } from '@servicenow/react-components/Loader'
import type { ButtonClicked } from '@servicenow/react-components/Button'
import type { ButtonIconicClicked } from '@servicenow/react-components/ButtonIconic'
import type { CardClicked } from '@servicenow/react-components/Card'
import { STATE_LABEL, TASK_STATES } from '../types'
import type { TaskRecord, TaskState } from '../types'
import { formatDueDate, isOverdue } from '../utils/api'
import './KanbanBoard.css'

export interface KanbanBoardProps {
    tasks: TaskRecord[]
    loading: boolean
    /** 取得・更新に失敗したときのメッセージ。null なら正常 */
    error: string | null
    /** カードを開く（詳細画面へ） */
    onOpenTask: (sysId: string, title: string) => void
    /** state を変更する。楽観的更新はホスト側（useTasks）が行う */
    onMoveTask: (sysId: string, state: TaskState) => Promise<void>
    /** エラー時の「再試行」 */
    onRetry: () => void
}

/**
 * 状態 → Badge / Card サイドバーの色。
 * tokens.css の --tb-state-* と見た目を合わせるため、近い意味の色名を割り当てている。
 */
const STATE_COLOR: Record<TaskState, 'blue' | 'orange' | 'positive'> = {
    open: 'blue',
    in_progress: 'orange',
    done: 'positive',
}

/** ドラッグ中のデータをやり取りするキー。text/plain はどのブラウザでも確実に使える */
const DND_MIME = 'text/plain'

export default function KanbanBoard(props: KanbanBoardProps): JSX.Element {
    const { tasks, loading, error, onOpenTask, onMoveTask, onRetry } = props

    // ドラッグ中のタスク。ドロップ先の判定（同じ列なら無視）と見た目に使う
    const [dragging, setDragging] = useState<{ sysId: string; state: TaskState } | null>(null)
    // ドロップ可能なハイライトを出している列
    const [dropTarget, setDropTarget] = useState<TaskState | null>(null)

    // 列ごとにタスクを振り分ける。tasks が変わったときだけ計算し直す。
    const columns = useMemo(
        () =>
            TASK_STATES.map(state => ({
                state,
                items: tasks.filter(task => task.state === state),
            })),
        [tasks]
    )

    // Card / ButtonIconic のイベントには「どのカードか」が入らないので、
    // ハンドラを作る関数でクロージャに閉じ込める。
    const makeOpenHandler = useCallback(
        (task: TaskRecord): CardClicked =>
            () =>
                onOpenTask(task.sysId, task.title),
        [onOpenTask]
    )

    const makeMoveHandler = useCallback(
        (task: TaskRecord, to: TaskState): ButtonIconicClicked =>
            () => {
                void onMoveTask(task.sysId, to)
            },
        [onMoveTask]
    )

    const handleRetry = useCallback<ButtonClicked>(() => onRetry(), [onRetry])

    // --- HTML5 ドラッグ&ドロップ ---------------------------------------------
    // ライブラリを足さずに済むよう標準 API を使う。
    // dataTransfer に sys_id を載せておくと、ドロップ側は React の状態に頼らず対象を特定できる。
    const handleDragStart = useCallback(
        (task: TaskRecord) => (e: React.DragEvent<HTMLLIElement>) => {
            e.dataTransfer.setData(DND_MIME, task.sysId)
            e.dataTransfer.effectAllowed = 'move'
            setDragging({ sysId: task.sysId, state: task.state })
        },
        []
    )

    const handleDragEnd = useCallback(() => {
        setDragging(null)
        setDropTarget(null)
    }, [])

    const handleDragOver = useCallback(
        (state: TaskState) => (e: React.DragEvent<HTMLDivElement>) => {
            // preventDefault を呼ばないとブラウザは「ここには落とせない」と判断する
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
            // 元と同じ列はハイライトしない（落としても何も起きないため）
            setDropTarget(dragging && dragging.state === state ? null : state)
        },
        [dragging]
    )

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        // 列の内側の要素へ移っただけのときは解除しない
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
        setDropTarget(null)
    }, [])

    const handleDrop = useCallback(
        (state: TaskState) => (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            setDropTarget(null)
            setDragging(null)
            const sysId = e.dataTransfer.getData(DND_MIME)
            if (!sysId) return
            const task = tasks.find(t => t.sysId === sysId)
            // 同じ列に落としただけなら無駄な PATCH を投げない
            if (!task || task.state === state) return
            void onMoveTask(sysId, state)
        },
        [tasks, onMoveTask]
    )

    // 初回ロード中（まだ何も出せない）だけローダーに置き換える。
    // 2 回目以降は前のカードを残したまま更新したほうがちらつかない。
    if (loading && tasks.length === 0) {
        return (
            <div className="kanban__status">
                <Loader label="タスクを読み込み中" size="md" announceLabel />
            </div>
        )
    }

    return (
        <div className="kanban">
            {error ? (
                <div className="kanban__error">
                    <Alert status="critical" content={error} icon="triangle-exclamation-outline" />
                    <Button label="再試行" variant="secondary" onClicked={handleRetry} />
                </div>
            ) : null}

            <div className="kanban__columns">
                {columns.map(({ state, items }, index) => {
                    // 端の列には外向きの移動ボタンを出さない（移動先が無いため）
                    const prev = index > 0 ? TASK_STATES[index - 1] : null
                    const next = index < TASK_STATES.length - 1 ? TASK_STATES[index + 1] : null
                    return (
                        <div
                            key={state}
                            className={`kanban__column${dropTarget === state ? ' kanban__column--drop' : ''}`}
                            onDragOver={handleDragOver(state)}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop(state)}
                        >
                            <div className="kanban__column-head">
                                <span className={`kanban__dot kanban__dot--${state}`} aria-hidden="true" />
                                {/* h1 は画面タイトルが使っているので、列見出しは h2 にする */}
                                <h2 className="kanban__column-title">{STATE_LABEL[state]}</h2>
                                <Badge value={items.length} color={STATE_COLOR[state]} size="sm" />
                            </div>

                            {items.length === 0 ? (
                                <p className="kanban__empty">タスクはありません</p>
                            ) : (
                                <ul className="kanban__list">
                                    {items.map(task => {
                                        const overdue = isOverdue(task)
                                        const due = formatDueDate(task.dueDate)
                                        const isDragging = dragging?.sysId === task.sysId
                                        return (
                                            <li
                                                key={task.sysId}
                                                className={`kanban__card${isDragging ? ' kanban__card--dragging' : ''}`}
                                                draggable
                                                onDragStart={handleDragStart(task)}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <Card
                                                    size="sm"
                                                    interaction="click"
                                                    sidebar={{ color: STATE_COLOR[state], variant: 'primary' }}
                                                    configAria={{
                                                        button: { 'aria-label': `「${task.title}」を開く` },
                                                    }}
                                                    onClicked={makeOpenHandler(task)}
                                                >
                                                    <span className="kanban__card-title">{task.title}</span>
                                                    <span className="kanban__chips">
                                                        {due ? (
                                                            <span
                                                                className={`kanban__chip${overdue ? ' kanban__chip--overdue' : ''}`}
                                                            >
                                                                {overdue ? '⚠ ' : ''}
                                                                {due}
                                                            </span>
                                                        ) : null}
                                                        {task.state === 'done' && task.completedAt ? (
                                                            <span className="kanban__chip kanban__chip--done">
                                                                完了 {task.completedAt}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                </Card>

                                                {/* 移動ボタンは Card の「外」に置く。
                                                    Card の内側に入れるとクリックがカード本体にも伝わり
                                                    （Shadow DOM 越しなので stopPropagation も効きにくい）、
                                                    詳細画面が意図せず開いてしまうため。
                                                    ドラッグ&ドロップが使えない環境の代替操作も兼ねる。 */}
                                                <div className="kanban__card-actions">
                                                    {prev ? (
                                                        <ButtonIconic
                                                            icon="arrow-left-outline"
                                                            bare
                                                            size="sm"
                                                            tooltipContent={`${STATE_LABEL[prev]} へ移動`}
                                                            configAria={{
                                                                'aria-label': `「${task.title}」を ${STATE_LABEL[prev]} へ移動`,
                                                            }}
                                                            onClicked={makeMoveHandler(task, prev)}
                                                        />
                                                    ) : null}
                                                    {next ? (
                                                        <ButtonIconic
                                                            icon="arrow-right-outline"
                                                            bare
                                                            size="sm"
                                                            tooltipContent={`${STATE_LABEL[next]} へ移動`}
                                                            configAria={{
                                                                'aria-label': `「${task.title}」を ${STATE_LABEL[next]} へ移動`,
                                                            }}
                                                            onClicked={makeMoveHandler(task, next)}
                                                        />
                                                    ) : null}
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
