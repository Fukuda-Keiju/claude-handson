// Business Rule「Set completed_at on Todo Item」の中身（サーバー側スクリプト）。
// .now.ts からこの関数を import して script に渡すと、SDK が本文を
// Business Rule のスクリプトとして書き出してくれる。
import { gs, GlideDateTime, type GlideRecord } from '@servicenow/glide'

// state と completed_at のつじつまを合わせる。
// when: 'before' で動かすので、ここで setValue した値はそのまま保存される
// （保存後にもう一度 update する必要がない ＝ 速いし無限ループも起きない）。
export function setCompletedAt(current: GlideRecord, previous: GlideRecord) {
    const state = current.getValue('state')
    const completedAt = current.getValue('completed_at')

    if (state === 'done' && !completedAt) {
        // スコープアプリでは gs.nowDateTime() が使えないため、GlideDateTime を
        // new して、その内部値（データベース保存用の文字列）を入れる。
        const now = new GlideDateTime()
        current.setValue('completed_at', now.getValue())
        gs.info(`[todo] completed_at set to ${now.getValue()} for "${current.getValue('title')}"`)
    } else if (state !== 'done' && completedAt) {
        // Done から戻したときは完了日時を消す
        current.setValue('completed_at', '')
    }
}
