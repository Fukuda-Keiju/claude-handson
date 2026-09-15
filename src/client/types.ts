// 画面全体で共有する型と定数（ワーカー間の契約）。
// ここを変えるときは KanbanBoard / StatTiles / TaskList / app.tsx の呼び出し側も合わせて直す。

/** 対象テーブル */
export const TASK_TABLE = 'x_2221398_handson_task'

/** state 列の値。テーブル定義（src/fluent/tables/handson-task.now.ts）の choices と一致させる */
export type TaskState = 'open' | 'in_progress' | 'done'

/** Kanban の列順にもなる */
export const TASK_STATES: readonly TaskState[] = ['open', 'in_progress', 'done']

/** state の表示ラベル（テーブルの choice ラベルと同じ） */
export const STATE_LABEL: Record<TaskState, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    done: 'Done',
}

/** 絞り込み用。'all' は絞り込みなし */
export type StateFilter = TaskState | 'all'

/** Table API から取り込んだ 1 レコード。すべて文字列に正規化済み（'' は未設定） */
export interface TaskRecord {
    sysId: string
    title: string
    state: TaskState
    /** YYYY-MM-DD（未設定は ''） */
    dueDate: string
    /** 表示値（例: 2026-09-15 10:23:45）。未設定は '' */
    completedAt: string
    notes: string
    /** sys_updated_on の表示値 */
    updatedOn: string
}

/** 集計値。StatTiles が表示する */
export interface StateCounts {
    total: number
    open: number
    in_progress: number
    done: number
    /** 期限切れ = due_date が今日より前で state !== 'done' */
    overdue: number
}

/** 画面の種類。board が初期表示、list は従来の一覧 */
export type ViewName = 'board' | 'list' | 'detail' | 'create'
