// Business Rule「Validate Todo title」の中身（サーバー側スクリプト）。
// 保存直前にタイトルの前後の空白を整える。
import { type GlideRecord } from '@servicenow/glide'

export function validateTitle(current: GlideRecord, previous: GlideRecord) {
    // getValue は値が無いとき null を返すことがあるので、?? '' で文字列に寄せる
    const rawTitle = current.getValue('title') ?? ''
    // 前後の空白（全角スペースを含まない通常の空白・タブ・改行）を取り除く
    const trimmed = rawTitle.trim()

    // 整形した値は必ず書き戻す。こうすると " 買い物 " のような入力が
    // "買い物" として保存され、データがきれいに保たれる。
    if (trimmed !== rawTitle) {
        current.setValue('title', trimmed)
    }

}
