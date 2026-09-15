// Table REST API との通信をここに閉じ込める。
// 画面側（フック・コンポーネント）は TaskRecord / StateCounts だけを扱えばよくなり、
// 「display_value と value のどちらを使うか」といった API 都合の知識が UI に漏れない。
import { display, value } from './fields'
import { STATE_LABEL, TASK_STATES, TASK_TABLE } from '../types'
import type { StateCounts, TaskRecord, TaskState } from '../types'

/** Table API のベース URL。UI Page は同一インスタンス上で動くので相対パスでよい */
const TABLE_API = `/api/now/table/${TASK_TABLE}`

/** 一覧取得で欲しい列。* を避けて必要な列だけ取ると転送量とレスポンス時間が減る */
const FIELDS = 'sys_id,title,state,due_date,completed_at,notes,sys_updated_on'

/** 1 画面に出す上限。ハンズオン用途なので 200 件あれば十分 */
const LIMIT = 200

// sysparm_display_value=all のとき、各フィールドは {display_value, value} 形式になる。
// fields.ts の display()/value() がそのまま受け取れる形。
type RawField = string | { display_value?: string; value?: string } | null | undefined
type RawTaskRow = Record<string, RawField>

/**
 * 共通ヘッダー。X-UserToken には ServiceNow がページに埋め込む CSRF トークン（g_ck）を入れる。
 * これが無いと書き込み系リクエストが 401 で弾かれる。
 */
function headers(withBody = false): Record<string, string> {
    const base: Record<string, string> = {
        Accept: 'application/json',
        'X-UserToken': window.g_ck,
    }
    if (withBody) base['Content-Type'] = 'application/json'
    return base
}

/**
 * エラーレスポンスの本文から人が読めるメッセージを取り出す。
 * ServiceNow は {error: {message, detail}, status} 形式を返す。
 */
async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body = (await res.json()) as { error?: { message?: string; detail?: string } }
        const message = body?.error?.message
        if (message) return message
    } catch {
        // JSON でない（HTML のログイン画面など）場合はステータスだけで案内する
    }
    return `${res.status} ${res.statusText}`
}

/** state の値をアプリの型に落とす。未知の値が来ても画面が壊れないよう 'open' に寄せる */
function toTaskState(raw: string): TaskState {
    return (TASK_STATES as readonly string[]).includes(raw) ? (raw as TaskState) : 'open'
}

/** API の 1 行を画面用の TaskRecord に正規化する */
function toTaskRecord(row: RawTaskRow): TaskRecord {
    return {
        sysId: value(row.sys_id),
        title: display(row.title),
        // state は表示ラベル（Open 等）ではなく内部値（open 等）で持つ。比較・更新に使うため。
        state: toTaskState(value(row.state)),
        // 日付は value 側が YYYY-MM-DD 固定。display_value はユーザーの日付書式に左右されるので使わない。
        dueDate: value(row.due_date),
        // 日時はユーザーのタイムゾーン・書式で見せたいので display_value を使う。
        completedAt: display(row.completed_at),
        notes: display(row.notes),
        updatedOn: display(row.sys_updated_on),
    }
}

/** タスクを更新の新しい順に取得する */
export async function fetchTasks(): Promise<TaskRecord[]> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_fields: FIELDS,
        sysparm_limit: String(LIMIT),
        sysparm_query: 'ORDERBYDESCsys_updated_on',
    })

    const res = await fetch(`${TABLE_API}?${params.toString()}`, {
        method: 'GET',
        headers: headers(),
        // 同一オリジンのセッション Cookie を送る。これが無いと未ログイン扱いになる。
        credentials: 'same-origin',
    })

    if (!res.ok) throw new Error(`タスクの取得に失敗しました: ${await readErrorMessage(res)}`)

    const body = (await res.json()) as { result?: RawTaskRow[] }
    return (body.result ?? []).map(toTaskRecord)
}

/** 1 件の state だけを更新する（PATCH なので他の列は触らない） */
export async function updateTaskState(sysId: string, state: TaskState): Promise<void> {
    const res = await fetch(`${TABLE_API}/${encodeURIComponent(sysId)}`, {
        method: 'PATCH',
        headers: headers(true),
        credentials: 'same-origin',
        body: JSON.stringify({ state }),
    })

    if (!res.ok) {
        throw new Error(`「${STATE_LABEL[state]}」への更新に失敗しました: ${await readErrorMessage(res)}`)
    }
}

/** Date をローカルタイムゾーンの YYYY-MM-DD にする（toISOString は UTC になるので使わない） */
function toLocalDateString(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

/**
 * 期限切れ判定。YYYY-MM-DD は桁揃えされているので文字列比較で日付比較になる
 * （Date に変換するとタイムゾーンで 1 日ずれる事故が起きやすい）。
 */
export function isOverdue(task: TaskRecord, today: Date = new Date()): boolean {
    if (!task.dueDate) return false
    if (task.state === 'done') return false
    return task.dueDate < toLocalDateString(today)
}

/** StatTiles 用の集計。1 回のループで全部数える */
export function computeCounts(tasks: TaskRecord[]): StateCounts {
    const counts: StateCounts = { total: tasks.length, open: 0, in_progress: 0, done: 0, overdue: 0 }
    const today = new Date()
    for (const task of tasks) {
        counts[task.state] += 1
        if (isOverdue(task, today)) counts.overdue += 1
    }
    return counts
}

/** 曜日の日本語 1 文字表記。Date.getDay() の 0=日曜に対応 */
const WEEKDAY = ['日', '月', '火', '水', '木', '金', '土']

/** 期限日を `9/20 (日)` のような短い表記にする。カード内の狭い場所に置くため年は省く */
export function formatDueDate(dueDate: string): string {
    if (!dueDate) return ''
    const [y, m, d] = dueDate.split('-').map(Number)
    if (!y || !m || !d) return dueDate
    // new Date('2026-09-20') は UTC 解釈になるため、数値指定でローカル日付として作る
    const date = new Date(y, m - 1, d)
    return `${m}/${d} (${WEEKDAY[date.getDay()]})`
}
