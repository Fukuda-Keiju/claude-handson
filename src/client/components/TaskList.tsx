// 従来の一覧ビュー。プラットフォーム標準の一覧部品（NowRecordListConnected）を
// 白いパネルの中に置き、上部に状態の絞り込み Select を並べる。
// 絞り込みの値は親（app.tsx）が URL と一緒に持つので、ここは受け取って表示するだけ。
import React, { useCallback } from 'react'
import { NowRecordListConnected } from '@servicenow/react-components/NowRecordListConnected'
import { Select } from '@servicenow/react-components/Select'
import type { SelectItem, SelectSelectedItemSet } from '@servicenow/react-components/Select'
import type { NowRecordListConnectedRowClicked } from '@servicenow/react-components/NowRecordListConnected'
import type { StateFilter } from '../types'
import './TaskList.css'

/** 対象テーブルと一覧に出す列（契約書の定数） */
const TABLE = 'x_2221398_handson_task'
const LIST_COLUMNS = 'title,state,due_date,completed_at'

/** 絞り込み Select の選択肢。id は state フィールドの値（all のときだけ絞り込みなし） */
const FILTER_ITEMS: SelectItem[] = [
    { id: 'all', label: 'すべて' },
    { id: 'open', label: 'Open' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
]

export interface TaskListProps {
    /** 選択中の絞り込み条件。URL の state パラメータと同じ値 */
    stateFilter: StateFilter
    /** 絞り込みが変わったときに呼ぶ（親が URL を更新する） */
    onFilterChange: (filter: StateFilter) => void
    /** 行クリック時に呼ぶ。title は行の表示値（取れなければ ''） */
    onSelectTask: (sysId: string, title: string) => void
    /** 一覧ヘッダーの「New」ボタンが押されたときに呼ぶ */
    onNewTask: () => void
}

export default function TaskList(props: TaskListProps): JSX.Element {
    const { stateFilter, onFilterChange, onSelectTask, onNewTask } = props

    // Select の選択イベント。値は e.detail.payload.value に入っている（e.detail 直下ではない）
    const handleFilterSet = useCallback<SelectSelectedItemSet>(
        e => {
            onFilterChange(String(e.detail.payload.value) as StateFilter)
        },
        [onFilterChange]
    )

    // 行クリック。payload.sys_id がレコードの sys_id、
    // payload.row.displayValue.value が一覧に出ている表示値（= title）。
    const handleRowClicked = useCallback<NowRecordListConnectedRowClicked>(
        e => {
            const payload = e.detail.payload
            onSelectTask(payload.sys_id, payload.row?.displayValue?.value ?? '')
        },
        [onSelectTask]
    )

    // 「新規」ボタン。空関数は禁止で、必ず作成画面へ遷移させる。
    const handleNewClicked = useCallback(() => {
        onNewTask()
    }, [onNewTask])

    // 絞り込み条件（ServiceNow の encoded query 形式）。「すべて」のときは空文字 = 条件なし。
    const fixedQuery = stateFilter === 'all' ? '' : `state=${stateFilter}`

    // ラッパー(NowRecordListConnected)は query 系の props を型として持たないが、
    // 余った camelCase の props は kebab-case の属性(fixed-query)として下位の Web Component に渡され、
    // Web Component 側では fixedQuery プロパティとして解釈される。
    // さらに key に同じ値を渡して、条件が変わるたびに部品を作り直し（再マウント）確実に取り直させる。
    // ※ SDK ガイドにある「key だけで絞り込める」という説明は誤りで、key は再マウントの合図にしかならない。
    // 条件が無いときは属性自体を付けない（空文字の属性は真偽値 true と解釈されてしまうため）
    const listAttrs = (fixedQuery ? { fixedQuery } : {}) as Record<string, string>

    return (
        <section className="task-list">
            <div className="task-list__toolbar">
                <div className="task-list__filter">
                    <Select
                        label="状態で絞り込み"
                        items={FILTER_ITEMS}
                        selectedItem={stateFilter}
                        onSelectedItemSet={handleFilterSet}
                    />
                </div>
            </div>
            {/* 一覧本体。overflow: hidden で角を丸めると、一覧内のドロップダウンが
                切れてしまうので、角丸ではなく余白と区切り線だけで整える。 */}
            <div className="task-list__body">
                <NowRecordListConnected
                    key={fixedQuery || 'all'}
                    {...listAttrs}
                    table={TABLE}
                    listTitle="Handson Task"
                    columns={LIST_COLUMNS}
                    limit={20}
                    onRowClicked={handleRowClicked}
                    onNewActionClicked={handleNewClicked}
                />
            </div>
        </section>
    )
}
