#!/usr/bin/env node
// reset.mjs — todo-app を欠陥版に戻す（buggy/src の 3 ファイルを上書き）。ハンズオン PC を次の人に渡す前に使う。
// 使い方:  node reset.mjs   → 続けて  cd todo-app && npm run build && npm run deploy
// （中身は fix.mjs --from-buggy と同じ）
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT = dirname(fileURLToPath(import.meta.url))
const r = spawnSync(process.execPath, [join(KIT, 'fix.mjs'), '--from-buggy'], { stdio: 'inherit' })
if (r.status === 0) console.log('\n欠陥版に戻しました。build → deploy のあと、Tests 一覧で Negative を Run Test すると赤に戻ります。')
process.exit(r.status ?? 1)
