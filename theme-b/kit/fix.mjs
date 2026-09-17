#!/usr/bin/env node
// fix.mjs — 欠陥版 todo-app に修正（fix/src の 3 ファイル）を上書きする（macOS / Linux / Windows 共通。Windows は fix.ps1 でもよい）
// 使い方:  node fix.mjs   → 続けて  cd todo-app && npm run build && npm run deploy
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT = dirname(fileURLToPath(import.meta.url))
const SRC = join(KIT, process.argv[2] === '--from-buggy' ? 'buggy' : 'fix', 'src')
const DST = join(KIT, 'todo-app', 'src')
if (!existsSync(SRC)) { console.error(`[NG] ${SRC} がありません。zip を展開し直してください`); process.exit(1) }
if (!existsSync(join(KIT, '.setup-state.json'))) { console.error('[NG] setup がまだ実行されていません。先に setup.ps1 か setup.mjs を実行してください'); process.exit(1) }

console.log(`== ${relative(KIT, SRC)} のファイルを todo-app/src に上書きします`)
const walk = (dir) => {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (statSync(p).isDirectory()) { walk(p); continue }
        const rel = relative(SRC, p)
        const target = join(DST, rel)
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(p, target)
        console.log('  上書き: src/' + rel.split('\\').join('/'))
    }
}
walk(SRC)

const show = (title, file, re) => {
    console.log(`\n== ${title}`)
    readFileSync(join(DST, file), 'utf8').split(/\r?\n/).forEach((l, i) => { if (re.test(l)) console.log('  ' + String(i + 1).padStart(3) + ': ' + l.trim()) })
}
show('サーバー側（Business Rule）', 'server/business-rules/validate-title.ts', /trimmed === ''|addErrorMessage|setAbortAction/)
show('画面側（作成フォーム）', 'client/components/TodoForm.tsx', /title\.trim\(\) === ''|タイトルは必須です/)
show('テーブル定義', 'fluent/tables/todo-item.now.ts', /mandatory/)

console.log('\n次に打つもの:')
console.log('  cd todo-app')
console.log('  npm run build')
console.log('  npm run deploy')
console.log('終わったら ServiceNow の Tests 一覧で Negative → Positive の順に Run Test（再テスト）。')
