// 参加者ユーザー handson01〜08 を mypdi に作る（Table API）。既にあればパスワードを再設定。
// 認証は now-sdk のセッション Cookie をメモリ上でだけ使う（auth.mjs）。
import { getCookies } from './auth.mjs'

const BASE = 'https://dev192510.service-now.com'
const ADMIN_ROLE = '2831a114c611228501d4ea6c309d626d'
const PASSWORD = process.argv[2]
if (!PASSWORD) { console.error('usage: node users.mjs <password>'); process.exit(1) }

const cookie = getCookies().map(c => `${c.name}=${c.value}`).join('; ')
const headers = { Cookie: cookie, Accept: 'application/json', 'Content-Type': 'application/json' }

// 書き込みには g_ck（CSRF トークン）が要る。UI ページの HTML から拾う（引用符は ' か "）。
const html = await (await fetch(`${BASE}/x_2221398_todo_board.do`, { headers: { Cookie: cookie } })).text()
const m = html.match(/g_ck\s*=\s*["']([0-9a-f]+)["']/)
if (!m) { console.error('g_ck not found'); process.exit(1) }
headers['X-UserToken'] = m[1]

async function api(method, path, body) {
    const res = await fetch(`${BASE}/api/now/table/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${JSON.stringify(json).slice(0, 300)}`)
    return json.result
}

for (let i = 1; i <= 8; i++) {
    const nn = String(i).padStart(2, '0')
    const userName = `handson${nn}`
    const existing = await api('GET', `sys_user?sysparm_query=user_name=${userName}&sysparm_fields=sys_id`)
    let sysId
    if (existing.length) {
        sysId = existing[0].sys_id
        await api('PATCH', `sys_user/${sysId}`, { user_password: PASSWORD, active: 'true', locked_out: 'false', password_needs_reset: 'false' })
        console.log(`${userName}: exists (${sysId}) -> password reset`)
    } else {
        const u = await api('POST', 'sys_user', {
            user_name: userName, first_name: 'Handson', last_name: nn, email: `${userName}@example.invalid`,
            user_password: PASSWORD, active: 'true', password_needs_reset: 'false', time_zone: 'Asia/Tokyo',
        })
        sysId = u.sys_id
        console.log(`${userName}: created (${sysId})`)
    }
    const roles = await api('GET', `sys_user_has_role?sysparm_query=user=${sysId}^role=${ADMIN_ROLE}&sysparm_fields=sys_id`)
    if (!roles.length) {
        await api('POST', 'sys_user_has_role', { user: sysId, role: ADMIN_ROLE })
        console.log(`  admin role added`)
    } else console.log(`  admin role already present`)
}
// 動作確認: basic 認証でログインできるか（1 人だけ）
const check = await fetch(`${BASE}/api/now/table/sys_user?sysparm_limit=1&sysparm_fields=sys_id`, {
    headers: { Authorization: 'Basic ' + Buffer.from(`handson01:${PASSWORD}`).toString('base64'), Accept: 'application/json' },
})
console.log('basic-auth check handson01:', check.status)
