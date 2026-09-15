// タブ（ボード / 一覧）で表示が入れ替わることを確かめる UI Test Script。
// screen / user / sn_atf / expect / waitFor はテスト実行時に自動で注入されるので import は不要。

// 1. view を付けずに開く。既定表示は Kanban ボード。
await sn_atf.navigate('/x_2221398_handson_task_board.do')

// 2. まずアプリのヘッダー（唯一の h1）が描かれるのを待つ。React の初期描画は非同期。
await screen.findByRole('heading', {
    name: 'Handson Task ボード',
    exact: true,
    timeout: 15000,
})

// 3. Kanban の列見出し「Open」(h2) が出ていれば、ボードが表示されている証拠。
//    一覧ビューにはこの見出しが無いので、ボード／一覧を見分ける目印として使える。
await screen.findByRole('heading', { name: 'Open', exact: true, timeout: 15000 })

// 4. タブ「一覧」を押す。tab ロールで取り、exact にして「一覧へ戻る」等と混ざらないようにする。
const listTab = await screen.findByRole('tab', { name: '一覧', exact: true, timeout: 15000 })
await user.click(listTab)

// 5. 一覧ビューだけにある「状態で絞り込み」のプルダウンが出るまで待つ（切り替え完了の合図）。
await screen.findByRole('combobox', {
    name: '状態で絞り込み',
    exact: true,
    timeout: 15000,
})

// 6. 画面状態は URL にも書かれる。pushState は描画と同時ではないので waitFor で待つ。
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=list')
    },
    { timeout: 15000 }
)

// 7. ボードは消えている。「消えたこと」は findBy* では待てないので、
//    queryBy*（0 件なら null）を waitFor で繰り返して確認する。
await waitFor(
    async () => {
        const openColumn = await screen.queryByRole('heading', { name: 'Open', exact: true })
        expect(openColumn).toBeNull()
    },
    { timeout: 15000 }
)

// 8. タブ「ボード」で元に戻す。
const boardTab = await screen.findByRole('tab', { name: 'ボード', exact: true, timeout: 15000 })
await user.click(boardTab)

// 9. 列見出し「Open」が戻ってくる＝ボードが再表示された。
await screen.findByRole('heading', { name: 'Open', exact: true, timeout: 15000 })

// 10. 逆に一覧の絞り込みプルダウンは消えている。
await waitFor(
    async () => {
        const filter = await screen.queryByRole('combobox', {
            name: '状態で絞り込み',
            exact: true,
        })
        expect(filter).toBeNull()
    },
    { timeout: 15000 }
)

// 11. URL もボードに戻っている。
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=board')
    },
    { timeout: 15000 }
)
