// セッション Cookie を now-sdk から取得してメモリ上だけで使う（ファイルには書かない）。
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
// リポジトリのルート（このファイルは theme-b/tools/ にある）
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export function getCookies() {
    const out = execFileSync('npx.cmd', ['@servicenow/sdk', 'auth', '--print', 'mypdi', '--format', 'headers'], {
        cwd: repoRoot, encoding: 'utf8', shell: true, stdio: ['ignore', 'pipe', 'ignore'],
    })
    const line = out.split(/\r?\n/).find(l => l.startsWith('Cookie:'))
    if (!line) throw new Error('Cookie header not found in auth --print output')
    return line.slice(7).trim().split(';').map(s => s.trim()).filter(Boolean).map(kv => {
        const i = kv.indexOf('=')
        return { name: kv.slice(0, i), value: kv.slice(i + 1), domain: 'dev192510.service-now.com', path: '/' }
    })
}
