// set-atf-props.mjs — 自分の PDI で ATF の実行設定 2 つを true にする（setup.ps1 から呼ばれる）
//   sn_atf.runner.enabled    : Client Test Runner（UI テスト）を許可
//   sn_atf.schedule.enabled  : スケジュール実行を許可
// 使い方: node set-atf-props.mjs [alias]   （既定 mypdi）
// 認証は now-sdk に登録済みの接続先を使う。パスワードやトークンはファイルに書かない。
import { execFileSync } from 'node:child_process'

const alias = process.argv[2] || 'mypdi'
const PROPS = ['sn_atf.runner.enabled', 'sn_atf.schedule.enabled']

// Windows では .cmd シムを cmd.exe 経由で呼ぶ（shell:true の警告を出さずに済む）
const env = process.platform === 'win32'
    ? execFileSync('cmd.exe', ['/d', '/c', 'now-sdk', 'auth', '--print', alias, '--format', 'env'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
    : execFileSync('now-sdk', ['auth', '--print', alias, '--format', 'env'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
const pick = (name) => env.match(new RegExp(`${name}='?([^'\\r\\n]*)'?`))?.[1]
const base = pick('SN_SDK_INSTANCE_URL')
const token = pick('SN_SDK_SESSION_TOKEN')
const cookie = pick('SN_SDK_SESSION_COOKIE')
if (!base || !token || !cookie) {
    console.error(`[NG] now-sdk auth --print ${alias} からセッション情報を取れませんでした`)
    process.exit(1)
}
const headers = { Accept: 'application/json', 'Content-Type': 'application/json', 'X-UserToken': token, Cookie: cookie }

const list = await fetch(`${base}/api/now/table/sys_properties?sysparm_query=nameIN${PROPS.join(',')}&sysparm_fields=sys_id,name,value`, { headers })
if (!list.ok) { console.error(`[NG] sys_properties の取得に失敗: HTTP ${list.status}`); process.exit(1) }
const rows = (await list.json()).result
let changed = 0
for (const name of PROPS) {
    const row = rows.find((r) => r.name === name)
    if (!row) { console.error(`[NG] ${name} が見つかりません（ATF プラグインが無効?）`); process.exit(1) }
    if (row.value === 'true') { console.log(`[OK] ${name} は既に true`); continue }
    const res = await fetch(`${base}/api/now/table/sys_properties/${row.sys_id}`, { method: 'PATCH', headers, body: JSON.stringify({ value: 'true' }) })
    if (!res.ok) { console.error(`[NG] ${name} の更新に失敗: HTTP ${res.status} ${await res.text()}`); process.exit(1) }
    console.log(`[OK] ${name} を ${row.value || '(空)'} → true にしました`)
    changed++
}
// 反映確認
const check = await fetch(`${base}/api/now/table/sys_properties?sysparm_query=nameIN${PROPS.join(',')}&sysparm_fields=name,value`, { headers })
const after = (await check.json()).result
const bad = after.filter((r) => r.value !== 'true')
if (bad.length) { console.error('[NG] 反映されていません: ' + bad.map((r) => r.name).join(', ')); process.exit(1) }
console.log(changed ? `[OK] ATF の実行設定 2 つを true にしました` : `[OK] ATF の実行設定 2 つは true です`)
