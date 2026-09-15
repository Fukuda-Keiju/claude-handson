// ボードのカード → 詳細画面 → ボード、という往復を確認する UI Test Script。
// screen / user / sn_atf / expect / waitFor はテスト実行時に注入されるので import は不要。

// 1. view を付けずに開くとボード（Kanban）が初期表示になる
await sn_atf.navigate('/x_2221398_handson_task_board.do')

// 2. 画面が描画されたことを h1 で確認する
await screen.findByRole('heading', {
    name: 'Handson Task ボード',
    exact: true,
    timeout: 15000,
})

// 3. カードはタスク一覧の fetch 後に描かれる。カード本体のボタンは
//    aria-label「「{title}」を開く」で特定できる（移動ボタンとは別の要素）。
const card = await screen.findByRole('button', {
    name: '「ATFカード詳細テスト」を開く',
    exact: true,
    timeout: 15000,
})
await user.click(card)

// 4. 戻るボタンのラベルは「どこから開いたか」で変わる。
//    ボードから開いたときだけ「← ボードへ戻る」になるので、
//    このラベルが出ること自体が from=board で遷移できた証拠になる。
await screen.findByRole('button', {
    name: '← ボードへ戻る',
    exact: true,
    timeout: 15000,
})

// 5. フォーム本体（Title 入力）が描かれるまで待つ。レコードの読み込みも非同期なため。
await screen.findByRole('textbox', { name: /^Title/, timeout: 15000 })

// 6. 画面の見た目は create とほぼ同じなので、URL でも遷移内容を確定させる
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=detail')
        expect(search).toContain('from=board')
    },
    { timeout: 15000 }
)

// 7. 何も編集していない＝未保存（isDirty）ではないので、
//    戻るボタンを押しても確認モーダルは出ず、そのままボードへ戻るはず。
const backBtn = await screen.findByRole('button', {
    name: '← ボードへ戻る',
    exact: true,
    timeout: 15000,
})
await user.click(backBtn)

// 8. ボードに戻ったことを列見出し（h2）とカードの再描画の両方で確認する
await screen.findByRole('heading', {
    name: 'In Progress',
    exact: true,
    timeout: 15000,
})
await screen.findByRole('button', {
    name: '「ATFカード詳細テスト」を開く',
    exact: true,
    timeout: 15000,
})

// 9. URL も board に戻っていることを確認する（画面だけでなく履歴も戻っている）
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=board')
    },
    { timeout: 15000 }
)
