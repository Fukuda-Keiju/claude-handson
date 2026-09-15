// タスク一覧の取得・更新をまとめた画面用フック。
// 「サーバーとの通信」と「描画」を分けておくと、ボード/一覧など複数のビューで同じデータを使い回せる。
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { computeCounts, fetchTasks, updateTaskState } from '../utils/api'
import type { StateCounts, TaskRecord, TaskState } from '../types'

export interface UseTasksResult {
    tasks: TaskRecord[]
    counts: StateCounts
    loading: boolean
    /** 直近の失敗メッセージ。成功したら null に戻る */
    error: string | null
    /** サーバーから取り直す */
    refresh: () => Promise<void>
    /** state を変更する（楽観的更新） */
    moveTask: (sysId: string, state: TaskState) => Promise<void>
}

/** Error でない値が throw されたときも画面に出せる文字列にする */
function toMessage(e: unknown): string {
    return e instanceof Error ? e.message : String(e)
}

export function useTasks(): UseTasksResult {
    const [tasks, setTasks] = useState<TaskRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // アンマウント後に setState すると React が警告を出す（結果を捨てるだけで意味もない）。
    // ref に生存フラグを持ち、非同期処理の後で必ず確認する。
    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])

    // tasks の最新値をミラーしておく。moveTask は useCallback で固定したいが、
    // 「失敗したら元に戻す」ために直前の配列が要る。ref なら依存配列に入れずに読める。
    const tasksRef = useRef<TaskRecord[]>([])
    tasksRef.current = tasks

    const refresh = useCallback(async () => {
        setLoading(true)
        try {
            const next = await fetchTasks()
            if (!mounted.current) return
            setTasks(next)
            setError(null)
        } catch (e) {
            if (!mounted.current) return
            setError(toMessage(e))
        } finally {
            if (mounted.current) setLoading(false)
        }
    }, [])

    // 初回マウント時に取得する
    useEffect(() => {
        void refresh()
    }, [refresh])

    const moveTask = useCallback(async (sysId: string, state: TaskState) => {
        // 楽観的更新: 先に画面を変えてから PATCH する。D&D の手応えが軽くなる。
        // 失敗したときに戻せるよう、直前の配列を控えておく。
        const previous = tasksRef.current
        setTasks(current => current.map(task => (task.sysId === sysId ? { ...task, state } : task)))
        setError(null)

        try {
            await updateTaskState(sysId, state)
            // 成功したら静かに取り直す（loading は立てない＝ローダーで画面を消さない）。
            // completed_at はサーバー側の Business Rule が埋めるため、
            // 楽観的更新だけでは「完了 …」チップが出ない。取り直して実態に合わせる。
            const next = await fetchTasks()
            if (!mounted.current) return
            setTasks(next)
        } catch (e) {
            if (!mounted.current) return
            // 失敗したらサーバーの実態に合わせて元に戻す（画面とデータの食い違いを残さない）
            setTasks(previous)
            setError(toMessage(e))
        }
    }, [])

    // tasks が変わったときだけ集計し直す
    const counts = useMemo(() => computeCounts(tasks), [tasks])

    return { tasks, counts, loading, error, refresh, moveTask }
}
