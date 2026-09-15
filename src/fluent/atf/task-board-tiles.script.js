// 件数タイル（StatTiles）→ 状態で絞り込んだ一覧、という導線を確かめる UI Test Script。
// screen / user / sn_atf / expect / waitFor は自動で注入されるので import は不要。

// 1. ボード（既定表示）を開く
await sn_atf.navigate('/x_2221398_handson_task_board.do')

// 2. アプリのヘッダー（唯一の h1）が描かれるまで待つ
await screen.findByRole('heading', {
    name: 'Handson Task ボード',
    exact: true,
    timeout: 15000,
})

// 3. 事前に作った 2 件のカードが両方出るまで待つ。
//    カードは Table API の取得が終わってから描かれるので、
//    ここで待っておくとタイルの件数も最新になっている（タイルの数字はレース状態になりやすい）。
await screen.findByRole('button', {
    name: '「ATFタイルテスト done」を開く',
    exact: true,
    timeout: 15000,
})
await screen.findByRole('button', {
    name: '「ATFタイルテスト open」を開く',
    exact: true,
    timeout: 15000,
})

// 4. 「Done のタスクを一覧で表示」タイルを押す。
//    タイルは Card だが interaction="click" なので中身は button ロールになる。
const doneTile = await screen.findByRole('button', {
    name: 'Done のタスクを一覧で表示',
    exact: true,
    timeout: 15000,
})
await user.click(doneTile)

// 5. 一覧ビューだけにある「状態で絞り込み」が出れば切り替え完了
await screen.findByRole('combobox', {
    name: '状態で絞り込み',
    exact: true,
    timeout: 15000,
})

// 6. URL には view と state の両方が載る（絞り込みが URL に反映される仕様の確認）
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=list')
        expect(search).toContain('state=done')
    },
    { timeout: 15000 }
)

// 7. 一覧の行タイトルは link ロール。done の 1 件は残る。
await screen.findByRole('link', {
    name: 'ATFタイルテスト done',
    exact: true,
    timeout: 15000,
})

// 8. open の 1 件は絞り込みで消える。
//    「消えたこと」は findBy* では待てないので queryBy*（0 件なら null）を waitFor で繰り返す。
await waitFor(
    async () => {
        const openLink = await screen.queryByRole('link', {
            name: 'ATFタイルテスト open',
            exact: true,
        })
        expect(openLink).toBeNull()
    },
    { timeout: 15000 }
)
