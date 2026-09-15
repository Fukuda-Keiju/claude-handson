// URL(?view=...&id=...&from=...&state=...) と画面状態の変換をまとめたモジュール。
// hash ルーティングは使わず URLSearchParams だけで表現する。
// 「画面状態を URL に全部書く」ことで、リロード・ブックマーク・ATF の直接 navigate が同じ結果になる。

import type { StateFilter, TaskState, ViewName } from './types'

// ViewName は types.ts（ワーカー共通の契約）が正。ここでは再輸出するだけにして定義を二重に持たない。
export type { ViewName }

/** 「戻る」の遷移先。フォームをどこから開いたかを覚えておくために使う */
export type FromView = 'board' | 'list'

export interface ViewState {
    view: ViewName
    /** detail のときだけ使うレコードの sys_id */
    recordId: string | null
    /** detail / create をどこから開いたか。未指定なら戻り先は list 扱い */
    from: FromView | null
    /** list ビューの絞り込み。'all' は絞り込みなし */
    stateFilter: StateFilter
}

const VIEW_NAMES: readonly string[] = ['board', 'list', 'detail', 'create']
const FROM_VIEWS: readonly string[] = ['board', 'list']
const STATE_FILTERS: readonly string[] = ['open', 'in_progress', 'done']

/** 現在の URL から表示すべき画面を読み取る。未知の値や未指定はボード（初期表示）にフォールバックする。 */
export function getViewFromUrl(): ViewState {
    const params = new URLSearchParams(window.location.search)

    const rawView = params.get('view') ?? ''
    const view = (VIEW_NAMES.includes(rawView) ? rawView : 'board') as ViewName

    const rawFrom = params.get('from') ?? ''
    const from = (FROM_VIEWS.includes(rawFrom) ? rawFrom : null) as FromView | null

    const rawState = params.get('state') ?? ''
    const stateFilter: StateFilter = STATE_FILTERS.includes(rawState) ? (rawState as TaskState) : 'all'

    return { view, recordId: params.get('id') || null, from, stateFilter }
}

/** URL とページタイトルを更新する。Polaris の iframe 内では親フレームにも通知する。 */
export function pushView(state: ViewState, title: string): void {
    // 既定値（id 無し・from 無し・state=all）はパラメータに載せない。
    // URL を短く保つと、ATF の location.search 検査も読みやすくなる。
    const params = new URLSearchParams({ view: state.view })
    if (state.recordId) params.set('id', state.recordId)
    if (state.from) params.set('from', state.from)
    if (state.stateFilter !== 'all') params.set('state', state.stateFilter)

    const relativePath = `${window.location.pathname}?${params.toString()}`

    // window.self !== window.top なら Next Experience の iframe 内で動いている
    if (window.self !== window.top) {
        window.CustomEvent.fireTop('magellanNavigator.permalink.set', { relativePath, title })
    }

    window.history.pushState({ ...state }, '', relativePath)
    document.title = title
}
