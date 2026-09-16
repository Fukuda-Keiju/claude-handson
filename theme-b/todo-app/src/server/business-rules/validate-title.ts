// Business Rule「Validate Todo title」の中身（サーバー側スクリプト）。
// 「仕様 1: タイトルは必須」をサーバー側で守るための唯一の仕組み。
//
// なぜ dictionary の mandatory: true だけでは足りないのか：
// mandatory はフォーム（UI）上の必須チェックなので、REST API や
// スクリプトからの insert では素通りしてしまう。そこで Business Rule で
// 保存直前にもう一度確かめる。
import { gs, type GlideRecord } from '@servicenow/glide'

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

    // ここが仕様 1 の守り: trim 後が空なら保存そのものを中止する。
    // setAbortAction(true) を呼ぶと、この insert/update はデータベースに
    // 書き込まれず、addErrorMessage の文字列が呼び出し元（画面や REST）に返る。
    if (trimmed === '') {
        gs.addErrorMessage('タイトルは必須です')
        current.setAbortAction(true)
    }
}
