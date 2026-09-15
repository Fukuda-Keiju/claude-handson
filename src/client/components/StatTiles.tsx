// 件数サマリのタイル。数字を見せるだけでなく、クリックで絞り込みも切り替える。
// 「今どこを見ているか」を selected で示すことで、ボード/一覧のどちらでも現在地が分かる。
import React, { useCallback, useMemo } from 'react'
import { Card } from '@servicenow/react-components/Card'
import { HighlightedValue } from '@servicenow/react-components/HighlightedValue'
import type { CardClicked } from '@servicenow/react-components/Card'
import { STATE_LABEL, TASK_STATES } from '../types'
import type { StateCounts, StateFilter } from '../types'
import './StatTiles.css'

export interface StatTilesProps {
    counts: StateCounts
    loading: boolean
    /** 現在選択中の絞り込み。一致するタイルを強調する */
    selected: StateFilter
    onSelect: (filter: StateFilter) => void
}

interface Tile {
    filter: StateFilter
    label: string
    count: number
}

export default function StatTiles(props: StatTilesProps): JSX.Element {
    const { counts, loading, selected, onSelect } = props

    // 「すべて」+ 状態ごとのタイル。状態の並びは TASK_STATES（= Kanban の列順）に合わせる。
    const tiles = useMemo<Tile[]>(
        () => [
            { filter: 'all', label: 'すべて', count: counts.total },
            ...TASK_STATES.map(state => ({
                filter: state as StateFilter,
                label: STATE_LABEL[state],
                count: counts[state],
            })),
        ],
        [counts]
    )

    // Card の onClicked はイベントしか受け取らないので、
    // 「どのタイルが押されたか」はクロージャに閉じ込める（ハンドラを生成する関数を返す）。
    const makeClickHandler = useCallback(
        (filter: StateFilter): CardClicked =>
            () =>
                onSelect(filter),
        [onSelect]
    )

    return (
        <div className="stat-tiles">
            <div className="stat-tiles__grid">
                {tiles.map(tile => {
                    const isSelected = tile.filter === selected
                    return (
                        <Card
                            key={tile.filter}
                            size="md"
                            interaction="click"
                            // interaction を付けた Card は内部が <button> になるため aria-label が必須。
                            // 数字ではなく「押すと何が起きるか」を読み上げさせる。
                            configAria={{
                                button: {
                                    'aria-label':
                                        tile.filter === 'all'
                                            ? 'すべてのタスクを一覧で表示'
                                            : `${tile.label} のタスクを一覧で表示`,
                                },
                            }}
                            onClicked={makeClickHandler(tile.filter)}
                        >
                            {/* 選択中は枠線で強調する。Card 本体には class を付けられないので内側で表現する */}
                            <div
                                className={`stat-tiles__body${isSelected ? ' stat-tiles__body--selected' : ''}`}
                            >
                                <span className="stat-tiles__head">
                                    <span
                                        className={`stat-tiles__dot stat-tiles__dot--${tile.filter}`}
                                        aria-hidden="true"
                                    />
                                    <span className="stat-tiles__label">{tile.label}</span>
                                </span>
                                {loading ? (
                                    // 読み込み中も数字の高さを保つ。レイアウトが後から跳ねるのを防ぐ。
                                    <span className="stat-tiles__skeleton" aria-hidden="true" />
                                ) : (
                                    <span className="stat-tiles__count">{tile.count}</span>
                                )}
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* 期限切れは 1 件以上あるときだけ右端に出す。
                常に 0 件を見せると「注意を引く表示」の価値が薄れるため。 */}
            {!loading && counts.overdue > 0 ? (
                <div className="stat-tiles__overdue">
                    <HighlightedValue
                        label={`期限切れ ${counts.overdue}`}
                        color="critical"
                        variant="secondary"
                        size="md"
                        showIcon={true}
                        icon="triangle-exclamation-outline"
                    />
                </div>
            ) : null}
        </div>
    )
}
