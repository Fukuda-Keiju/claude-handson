// Task ボードの新規作成フロー。globals（screen / user / sn_atf / expect / waitFor）は自動で注入される。

// 一覧画面から開始する（?view=list を明示して常に同じ入口にそろえる）
await sn_atf.navigate('/x_2221398_handson_task_board.do?view=list')

// 一覧の「New」ボタンで新規作成フォームを開く
const newBtn = await screen.findByRole('button', { name: 'New', exact: true, timeout: 15000 })
await user.click(newBtn)

// Title は now-* の入力なので、type しただけでは値が確定しない
const titleInput = await screen.findByRole('textbox', { name: /^Title/, timeout: 15000 })
await user.type(titleInput, 'ATF新規作成テスト')
await user.tab() // blur して値をコミットする

// 値が確定すると未保存アラートが出る。これを入力反映の待ち合わせに使う。
// （同じ文言はモーダルにも出うるので findAllByText で件数だけ見る）
const dirtyAlerts = await screen.findAllByText('未保存の変更があります', { timeout: 15000 })
expect(dirtyAlerts.length).toBeGreaterThanOrEqual(1)

// 保存ボタンはアクションバーの幅で出方が変わる。
// 広いときは「Save」ボタンがそのまま出る。狭いときは「More Actions」メニューの中に畳まれる。
// どちらでも動くよう、まず Save ボタンを探し、無ければメニューを開く。
const directSave = await screen.queryByRole('button', { name: 'Save', exact: true })
if (directSave) {
    await user.click(directSave)
} else {
    const moreActions = await screen.findByRole('button', {
        name: 'More Actions',
        exact: true,
        timeout: 15000,
    })
    await user.click(moreActions)

    const saveItem = await screen.findByRole('menuitem', { name: 'Save', exact: true, timeout: 15000 })
    await user.click(saveItem)
}

// 保存に成功すると詳細画面へ切り替わる（フォーム自体は作成画面と同じ見た目）
await screen.findByRole('button', { name: '← 一覧へ戻る', timeout: 15000 })

// 作成画面と詳細画面はボタン構成が同じなので、URL で遷移を確定させる
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=detail')
    },
    { timeout: 15000 }
)
