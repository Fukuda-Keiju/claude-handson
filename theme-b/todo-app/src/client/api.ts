// ─────────────────────────────────────────────────────────────
// データ層: ServiceNow の Table REST API とのやり取りだけをここに集める。
// 画面（app.tsx や components/*.tsx）は TodoRecord という「きれいな型」だけを扱えばよくなり、
// 「display_value と value のどちらを見るのか」といった API の事情を知らずに済む。
// ─────────────────────────────────────────────────────────────

/** 対象テーブル。ワーカー A が Fluent SDK で作る x_2221398_todo_item と同じ名前 */
export const TODO_TABLE = 'x_2221398_todo_item'

/** UI Page は同じインスタンス上で動くので、URL は相対パスで書ける */
const TABLE_API = `/api/now/table/${TODO_TABLE}`

/** 一覧で欲しい列だけを指定する。* を避けると通信量が減り、レスポンスも速くなる */
const FIELDS = 'sys_id,title,state,due_date,completed_at,notes,sys_updated_on'

/** state 列の内部値。テーブル定義の choice と 1 対 1 で対応する */
export type TodoState = 'open' | 'in_progress' | 'done'

/** ボードの列の並び順にもなる */
export const TODO_STATES: readonly TodoState[] = ['open', 'in_progress', 'done']

/** state の表示ラベル。ボードの見出しや移動ボタンの文言に使う */
export const STATE_LABEL: Record<TodoState, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    done: 'Done',
}

/** 画面が扱う 1 レコード。すべて文字列に正規化済み（未設定は空文字） */
export interface TodoRecord {
    sysId: string
    title: string
    state: TodoState
    /** YYYY-MM-DD 形式。<input type="date"> にそのまま入れられる */
    dueDate: string
    /** 表示用の日時文字列（Business Rule が入れる） */
    completedAt: string
    notes: string
    /** 更新日時の表示値 */
    updatedOn: string
}

/** 作成・更新でサーバーに送る内容。送りたい項目だけ書けばよい */
export interface TodoInput {
    title?: string
    state?: TodoState
    due_date?: string
    notes?: string
}

// sysparm_display_value=all で呼ぶと、各列は {display_value, value} のオブジェクトになる。
// React はオブジェクトをそのまま描画できないので、下の display()/value() で文字列に落とす。
type RawField = string | { display_value?: string; value?: string } | null | undefined
type RawTodoRow = Record<string, RawField>

/** 人に見せたい値（選択肢なら "In Progress" のようなラベル） */
function display(field: RawField): string {
    if (typeof field === 'string') return field
    return field?.display_value ?? ''
}

/** プログラムで使う値（選択肢なら "in_progress"、参照なら sys_id） */
function value(field: RawField): string {
    if (typeof field === 'string') return field
    return field?.value ?? ''
}

/**
 * 共通ヘッダー。X-UserToken には ServiceNow がページに埋め込む CSRF トークン（window.g_ck）を入れる。
 * これが無いと POST/PATCH/DELETE が 401 で弾かれる。
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
 * 失敗レスポンスから人が読めるメッセージを取り出す。
 * ServiceNow は {"error": {"message": "...", "detail": "..."}, "status": "failure"} を返す。
 * Business Rule が setAbortAction したときのメッセージもここに入ってくる。
 */
async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body = (await res.json()) as { error?: { message?: string; detail?: string } }
        const message = body?.error?.message
        if (message) return message
    } catch {
        // JSON ではない（ログイン画面の HTML が返ったときなど）。ステータスだけで案内する。
    }
    return `${res.status} ${res.statusText}`
}

/** 未知の値が来ても画面が壊れないよう、想定外の state は 'open' に寄せる */
function toTodoState(raw: string): TodoState {
    return (TODO_STATES as readonly string[]).includes(raw) ? (raw as TodoState) : 'open'
}

/** API の 1 行を画面用の TodoRecord に変換する */
function toTodoRecord(row: RawTodoRow): TodoRecord {
    return {
        sysId: value(row.sys_id),
        title: display(row.title),
        // state は比較や更新に使うので、ラベルではなく内部値で持つ
        state: toTodoState(value(row.state)),
        // 日付は value 側が YYYY-MM-DD 固定。display_value はユーザーの日付書式に左右されるので使わない
        dueDate: value(row.due_date),
        // 日時は人に見せるだけなので、ユーザーのタイムゾーンで整形済みの display_value を使う
        completedAt: display(row.completed_at),
        notes: display(row.notes),
        updatedOn: display(row.sys_updated_on),
    }
}

/** 一覧取得（GET）。更新日時の新しい順に並べる */
export async function fetchTodos(): Promise<TodoRecord[]> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_fields: FIELDS,
        sysparm_query: 'ORDERBYDESCsys_updated_on',
    })

    const res = await fetch(`${TABLE_API}?${params.toString()}`, {
        method: 'GET',
        headers: headers(),
        // 同一オリジンのセッション Cookie を送る。無いと未ログイン扱いになる
        credentials: 'same-origin',
    })

    if (!res.ok) throw new Error(await readErrorMessage(res))

    const body = (await res.json()) as { result?: RawTodoRow[] }
    return (body.result ?? []).map(toTodoRecord)
}

/** 新規作成（POST）。成功すると 201 が返る */
export async function createTodo(input: TodoInput): Promise<void> {
    const res = await fetch(TABLE_API, {
        method: 'POST',
        headers: headers(true),
        credentials: 'same-origin',
        body: JSON.stringify(input),
    })

    if (!res.ok) throw new Error(await readErrorMessage(res))
}

/** 更新（PATCH）。body に書いた列だけが更新され、他の列は触られない */
export async function updateTodo(sysId: string, input: TodoInput): Promise<void> {
    const res = await fetch(`${TABLE_API}/${encodeURIComponent(sysId)}`, {
        method: 'PATCH',
        headers: headers(true),
        credentials: 'same-origin',
        body: JSON.stringify(input),
    })

    if (!res.ok) throw new Error(await readErrorMessage(res))
}

/** 削除（DELETE）。成功すると 204（本文なし）が返る */
export async function deleteTodo(sysId: string): Promise<void> {
    const res = await fetch(`${TABLE_API}/${encodeURIComponent(sysId)}`, {
        method: 'DELETE',
        headers: headers(),
        credentials: 'same-origin',
    })

    if (!res.ok) throw new Error(await readErrorMessage(res))
}

/** エラーの中身は unknown で来るので、画面に出せる文字列に直す小道具 */
export function toErrorMessage(err: unknown): string {
    if (err instanceof Error && err.message) return err.message
    return '予期しないエラーが発生しました'
}
