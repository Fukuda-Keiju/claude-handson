// URL(?view=...&id=...) と画面状態の変換をまとめたモジュール。
// hash ルーティングは使わず URLSearchParams だけで表現する。

export type ViewName = 'list' | 'detail' | 'create'

export interface ViewState {
    view: ViewName
    recordId: string | null
}

const VIEW_NAMES: readonly string[] = ['list', 'detail', 'create']

/** 現在の URL から表示すべき画面を読み取る。未知の値や未指定は一覧にフォールバックする。 */
export function getViewFromUrl(): ViewState {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('view') ?? ''
    const view = (VIEW_NAMES.includes(raw) ? raw : 'list') as ViewName
    return { view, recordId: params.get('id') || null }
}

/** URL とページタイトルを更新する。Polaris の iframe 内では親フレームにも通知する。 */
export function pushView(state: ViewState, title: string): void {
    const params = new URLSearchParams({ view: state.view })
    if (state.recordId) params.set('id', state.recordId)
    const relativePath = `${window.location.pathname}?${params.toString()}`

    // window.self !== window.top なら Next Experience の iframe 内で動いている
    if (window.self !== window.top) {
        window.CustomEvent.fireTop('magellanNavigator.permalink.set', { relativePath, title })
    }

    window.history.pushState({ view: state.view, recordId: state.recordId }, '', relativePath)
    document.title = title
}
