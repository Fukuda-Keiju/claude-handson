#!/usr/bin/env node
// setup.mjs — テーマB キットのセットアップ（macOS / Linux / Windows 共通版。Windows は setup.ps1 でもよい）
//
// やること（setup.ps1 と同じ）
//   1. now-sdk に接続先（既定: mypdi）が登録されているか確認
//   2. 自分の PDI から会社コード（glide.appcreator.company.code）を読む
//   3. キット内の全ファイルのスコープ接頭辞 x_2221398_ を自分の会社コードに書き換える
//   4. todo-app / atf-tests のスコープを PDI に登録して scopeId を now.config.json に書く
//   5. todo-app: npm ci → build → deploy（欠陥版アプリが自分の PDI に入る）
//   6. atf-tests: npm ci → build
//   7. ATF の実行設定 2 つを true にする（set-atf-props.mjs）
//
// 使い方（キットのフォルダで）:  node setup.mjs [--auth mypdi] [--scope-suffix 2] [--skip-install] [--skip-npm]
// 2 回実行しても壊れない（.setup-state.json を見て済んだ工程は飛ばす）。
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT = dirname(fileURLToPath(import.meta.url))
const STATE = join(KIT, '.setup-state.json')
const IS_WIN = process.platform === 'win32'
const OLD_TODO = 'x_2221398_todo', OLD_ATF = 'x_2221398_atf', OLD_PREFIX = 'x_2221398_'

// ---------- 引数 ----------
const argv = process.argv.slice(2)
const flag = (n) => argv.includes(n)
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d }
const AUTH = opt('--auth', 'mypdi')
const SUFFIX = opt('--scope-suffix', '')
const SKIP_INSTALL = flag('--skip-install'), SKIP_NPM = flag('--skip-npm')

// ---------- 小道具 ----------
const timings = []
const ok = (m) => console.log('\x1b[32m[OK]\x1b[0m ' + m)
const say = (m) => console.log('\x1b[36m== ' + m + '\x1b[0m')
function fail(m, hint) {
    console.error('\x1b[31m[NG]\x1b[0m ' + m)
    if (hint) console.error('  -> ' + hint)
    summary(); process.exit(1)
}
function summary() {
    if (!timings.length) return
    console.log('\n所要時間:')
    for (const [n, s] of timings) console.log('  ' + n.padEnd(28) + s.toFixed(1) + ' 秒')
}
async function step(name, fn) { say(name); const t = Date.now(); await fn(); timings.push([name, (Date.now() - t) / 1000]) }
// コマンド実行。Windows では .cmd シムを cmd.exe 経由で、それ以外は直接
function run(cmd, args, { cwd = KIT, capture = false } = {}) {
    const r = IS_WIN
        ? spawnSync('cmd.exe', ['/d', '/c', cmd, ...args], { cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit' })
        : spawnSync(cmd, args, { cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit' })
    if (r.error) throw r.error
    return { code: r.status, out: (r.stdout || '') + (r.stderr || '') }
}
const has = (cmd) => run(IS_WIN ? 'where' : 'which', [cmd], { capture: true }).code === 0
function query(table, q, fields) {
    const r = run('now-sdk', ['query', table, '-q', q, '-f', fields, '-o', 'json', '--auth', AUTH], { capture: true })
    const i = r.out.indexOf('{"ok"')
    if (i < 0) return []
    try { const j = JSON.parse(r.out.slice(i)); return j.ok ? j.records : [] } catch { return [] }
}
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const writeJson = (p, o) => writeFileSync(p, JSON.stringify(o, null, 4) + '\n')
let state = existsSync(STATE) ? readJson(STATE) : { code: '', todoScope: '', atfScope: '', replaced: false, todoScopeId: '', atfScopeId: '' }
const saveState = () => writeJson(STATE, state)

// ---------- 0. 前提 ----------
if (!has('now-sdk')) fail('now-sdk が見つかりません', 'npm install -g @servicenow/sdk')
if (!has('npm')) fail('npm が見つかりません', 'https://nodejs.org から Node.js LTS を入れてください')
for (const d of ['todo-app', 'atf-tests', 'fix']) if (!existsSync(join(KIT, d))) fail(`フォルダ ${d} がありません`, 'themeB-kit.zip を展開し直し、その中で実行してください')
const authList = run('now-sdk', ['auth', '--list'], { capture: true }).out
if (!authList.includes(`[${AUTH}]`)) fail(`now-sdk に接続先 [${AUTH}] が登録されていません`, `now-sdk auth --add https://devXXXXXX.service-now.com --type basic --alias ${AUTH}`)
ok(`接続先 [${AUTH}] を使います`)

// ---------- 1. 会社コード ----------
let code = ''
await step('会社コードの取得', () => {
    const rows = query('sys_properties', 'name=glide.appcreator.company.code', 'value')
    code = (rows[0]?.value || '').trim()
    if (!/^\d+$/.test(code)) fail('会社コードを読めませんでした', 'PDI が休止中かもしれません。ブラウザでログインしてから、もう一度実行してください')
    ok(`会社コード = ${code}（スコープ接頭辞は x_${code}_）`)
})
const NEW_TODO = `x_${code}_todo${SUFFIX}`, NEW_ATF = `x_${code}_atf${SUFFIX}`
for (const s of [NEW_TODO, NEW_ATF]) if (s.length > 18) fail(`スコープ名 ${s} が 18 文字を超えています`, '--scope-suffix を短くしてください')
if (state.replaced && state.todoScope && state.todoScope !== NEW_TODO) fail(`このキットは既に ${state.todoScope} 用に書き換え済みです`, '別のスコープで使うには zip を展開し直してください')

// ---------- 2. 接頭辞の書き換え ----------
await step('スコープ接頭辞の書き換え', () => {
    if (state.replaced) { ok('済み（飛ばします）'); return }
    const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.html', '.css', '.md'])
    const skip = new Set(['node_modules', 'dist', 'target', '.now', '.git'])
    let files = 0, hits = 0
    const walk = (dir) => {
        for (const name of readdirSync(dir)) {
            if (skip.has(name)) continue
            const p = join(dir, name)
            if (statSync(p).isDirectory()) { walk(p); continue }
            if (!exts.has(extname(name).toLowerCase())) continue
            const text = readFileSync(p, 'utf8')
            if (!text.includes(OLD_PREFIX)) continue
            hits += text.split(OLD_PREFIX).length - 1
            writeFileSync(p, text.split(OLD_TODO).join(NEW_TODO).split(OLD_ATF).join(NEW_ATF).split(OLD_PREFIX).join(`x_${code}_`))
            files++
        }
    }
    for (const t of ['todo-app', 'atf-tests', 'fix', 'buggy', 'checkpoint', 'solution']) if (existsSync(join(KIT, t))) walk(join(KIT, t))
    Object.assign(state, { replaced: true, code, todoScope: NEW_TODO, atfScope: NEW_ATF }); saveState()
    ok(`${files} ファイル / ${hits} か所を書き換えました（${OLD_TODO} → ${NEW_TODO}, ${OLD_ATF} → ${NEW_ATF}）`)
})

// ---------- 3. scopeId ----------
function ensureScope(projectDir, scope, appName, pkgName, key) {
    const cfgPath = join(KIT, projectDir, 'now.config.json')
    const cfg = readJson(cfgPath)
    if (cfg.scope === scope && cfg.scopeId && state[key] === cfg.scopeId) { ok(`${projectDir} : ${scope} (${cfg.scopeId}) 済み`); return }
    let scopeId = query('sys_app', `scope=${scope}`, 'sys_id')[0]?.sys_id || ''
    if (scopeId) ok(`${scope} はインスタンスに既にあります（scopeId=${scopeId}）`)
    else {
        const tmp = mkdtempSync(join(tmpdir(), 'themeB-init-'))
        try {
            run('now-sdk', ['init', '--appName', appName.replace(/\s+/g, ''), '--packageName', pkgName, '--scopeName', scope, '--template', 'typescript.basic', '--auth', AUTH], { cwd: tmp, capture: true })
            const p = join(tmp, 'now.config.json')
            if (!existsSync(p)) fail(`${scope} の登録（now-sdk init）に失敗しました`, 'PDI にログインできるか、スコープ名が 18 文字以内かを確認してください')
            scopeId = readJson(p).scopeId
        } finally { rmSync(tmp, { recursive: true, force: true }) }
        ok(`${scope} を登録しました（scopeId=${scopeId}）`)
    }
    if (!/^[0-9a-f]{32}$/.test(scopeId)) fail(`${scope} の scopeId を取れませんでした`)
    Object.assign(cfg, { scope, scopeId, name: appName }); writeJson(cfgPath, cfg)
    state[key] = scopeId; saveState()
}
const todoName = SUFFIX ? `Handson Todo ${SUFFIX}` : 'Handson Todo', atfName = SUFFIX ? `ATF Handson ${SUFFIX}` : 'ATF Handson'
await step('スコープ登録 (todo-app)', () => ensureScope('todo-app', NEW_TODO, todoName, `handson-todo${SUFFIX}`, 'todoScopeId'))
await step('スコープ登録 (atf-tests)', () => ensureScope('atf-tests', NEW_ATF, atfName, `atf-handson${SUFFIX}`, 'atfScopeId'))

// ---------- 4. npm / build / deploy ----------
function npm(projectDir, args, label) {
    const r = run('npm', args, { cwd: join(KIT, projectDir) })
    if (r.code !== 0) fail(`${projectDir} : ${label} が失敗しました (exit ${r.code})`, '上のエラーの先頭 3 行を講師に送ってください')
    ok(`${projectDir} : ${label}`)
}
if (!SKIP_NPM) await step('npm ci (todo-app)', () => npm('todo-app', ['ci', '--no-audit', '--no-fund'], 'npm ci'))
await step('build (todo-app)', () => npm('todo-app', ['run', 'build'], 'build'))
if (!SKIP_INSTALL) await step('deploy (todo-app)', () => npm('todo-app', ['run', 'deploy', '--', '--auth', AUTH], 'deploy'))
if (!SKIP_NPM) await step('npm ci (atf-tests)', () => npm('atf-tests', ['ci', '--no-audit', '--no-fund'], 'npm ci'))
await step('build (atf-tests)', () => npm('atf-tests', ['run', 'build'], 'build'))

// ---------- 5. ATF 実行設定 ----------
await step('ATF 実行設定を true にする', () => {
    const r = spawnSync(process.execPath, [join(KIT, 'set-atf-props.mjs'), AUTH], { stdio: 'inherit' })
    if (r.status !== 0) console.log('\x1b[33m[!] 自動設定に失敗しました。自分の PDI で sys_properties.list を開き、sn_atf.runner.enabled と sn_atf.schedule.enabled を true にしてください\x1b[0m')
})

// ---------- 6. 確認 ----------
await step('導入確認', () => {
    if (SKIP_INSTALL) { ok('deploy を飛ばしたので確認も飛ばします'); return }
    const rows = query('sys_db_object', `name=${NEW_TODO}_item`, 'name')
    if (!rows.length) fail(`テーブル ${NEW_TODO}_item がインスタンスに見つかりません`, 'deploy のログを確認してください')
    ok(`テーブル ${NEW_TODO}_item を確認しました`)
})

summary()
console.log('\x1b[32m準備完了です。\x1b[0m')
console.log(`  アプリ  : ${NEW_TODO}  → ブラウザで All → Handson → Handson Todo board`)
console.log(`  テスト  : ${NEW_ATF}  → atf-tests フォルダで claude を起動します`)
