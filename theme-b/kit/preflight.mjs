#!/usr/bin/env node
// preflight.mjs — テーマB 事前チェック（Node 版。Windows / macOS / Linux 共通。PowerShell を使わない）
// 使い方: キットのフォルダで  node preflight.mjs [alias]   （既定 mypdi）
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT = dirname(fileURLToPath(import.meta.url))
const AUTH = process.argv[2] || 'mypdi'
const IS_WIN = process.platform === 'win32'
let ok = 0, ng = 0
const check = (name, result, hint) => {
    if (result) { console.log('\x1b[32m[OK]\x1b[0m ' + name); ok++ }
    else { console.log('\x1b[31m[NG]\x1b[0m ' + name + '  -> ' + hint); ng++ }
}
const run = (cmd, args) => {
    const r = IS_WIN
        ? spawnSync('cmd.exe', ['/d', '/c', cmd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
        : spawnSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    return { code: r.status, out: (r.stdout || '') + (r.stderr || '') }
}
const has = (cmd) => run(IS_WIN ? 'where' : 'which', [cmd]).code === 0
const readJson = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null } }
const query = (table, q, fields) => {
    const r = run('now-sdk', ['query', table, '-q', q, '-f', fields, '-o', 'json', '--auth', AUTH])
    const i = r.out.indexOf('{"ok"')
    if (i < 0) return []
    try { const j = JSON.parse(r.out.slice(i)); return j.ok ? j.records : [] } catch { return [] }
}

console.log('\x1b[36m=== テーマB Preflight（Node 版）===\x1b[0m')

// 1. 道具
check('Node.js が入っている', true, '')  // ここまで来ていれば入っている
const sdkOk = has('now-sdk')
check('now-sdk が入っている', sdkOk, 'npm install -g @servicenow/sdk')
check('Claude Code (claude) が入っている', has('claude'), 'npm install -g @anthropic-ai/claude-code')

// 2. キット
check('setup.mjs がある（themeB-kit フォルダで実行している）', existsSync(join(KIT, 'setup.mjs')), 'themeB-kit フォルダで実行する')
const state = readJson(join(KIT, '.setup-state.json'))
check('setup を実行済み（.setup-state.json がある）', !!(state && state.replaced), 'node setup.mjs を実行する')
const cfg = readJson(join(KIT, 'todo-app', 'now.config.json'))
check('todo-app の scopeId が入っている', !!(cfg && cfg.scopeId), 'node setup.mjs を実行する')
check('atf-tests の npm install 済み（node_modules がある）', existsSync(join(KIT, 'atf-tests', 'node_modules')), 'node setup.mjs を実行する')
check('atf-tests に CLAUDE.md がある', existsSync(join(KIT, 'atf-tests', 'CLAUDE.md')), 'zip を展開し直す')

// 3. 接続先と PDI
const authList = sdkOk ? run('now-sdk', ['auth', '--list']).out : ''
check(`now-sdk に接続先 [${AUTH}] が登録されている`, authList.includes(`[${AUTH}]`), `now-sdk auth --add https://devXXXXXX.service-now.com --type basic --alias ${AUTH}`)

if (sdkOk && state && state.todoScope) {
    const table = state.todoScope + '_item'
    const rows = query('sys_db_object', `name=${table}`, 'name')
    check(`自分の PDI にアプリが入っている（テーブル ${table}）`, rows.length > 0, 'node setup.mjs をもう一度実行する（PDI が休止中なら先にブラウザでログイン）')
    const props = query('sys_properties', 'nameINsn_atf.runner.enabled,sn_atf.schedule.enabled', 'name,value')
    check('ATF の実行設定 2 つが true（sn_atf.runner.enabled / sn_atf.schedule.enabled）', props.filter((p) => p.value === 'true').length >= 2, `node set-atf-props.mjs ${AUTH}`)
}

console.log(`\n\x1b[36m結果: OK ${ok} / NG ${ng}\x1b[0m`)
if (ng === 0) console.log('\x1b[32m準備完了です。この画面のスクリーンショットを講師に送ってください。\x1b[0m')
else console.log('\x1b[33mNG の行の -> の後を試してから、もう一度実行してください。\x1b[0m')
process.exit(ng === 0 ? 0 : 1)
