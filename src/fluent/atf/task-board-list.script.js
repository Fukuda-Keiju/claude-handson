// Handson Task ボード（React UI Page）の一覧と絞り込みを検証する UI Test Script。
// screen / user / sn_atf / expect / waitFor はテスト実行時に自動で使えるので import は不要。

// 1. まず UI Page の一覧ビューを開く（初期表示は Kanban ボードなので ?view=list を明示する。相対 URL にしておくと、どのインスタンスでも動く）
await sn_atf.navigate('/x_2221398_handson_task_board.do?view=list')

// 2. 画面の見出しが出るまで待つ。React の描画は非同期なので timeout を長めに取る
await screen.findByRole('heading', {
    name: 'Handson Task ボード',
    exact: true,
    timeout: 15000,
})

// 3. 事前に作った 2 件が一覧に並ぶことを確認する（findBy* は見つかるまで自動でリトライする）
await screen.findByRole('link', {
    name: 'ATF一覧テスト done',
    exact: true,
    timeout: 15000,
})
await screen.findByRole('link', {
    name: 'ATF一覧テスト open',
    exact: true,
    timeout: 15000,
})

// 4. 「状態で絞り込み」のプルダウンを開いて Done を選ぶ
const filter = await screen.findByRole('combobox', {
    name: '状態で絞り込み',
    exact: true,
    timeout: 15000,
})
await user.click(filter)

const doneOption = await screen.findByRole('option', {
    name: 'Done',
    exact: true,
    timeout: 15000,
})
await user.click(doneOption)

// 5. 絞り込み後は一覧が作り直される。open の行が消えるまで待つ。
//    「消えたこと」は findBy* では待てないので、queryBy*（0 件なら null）を waitFor で繰り返す。
await waitFor(
    async () => {
        const openLink = await screen.queryByRole('link', {
            name: 'ATF一覧テスト open',
            exact: true,
        })
        expect(openLink).toBeNull()
    },
    { timeout: 15000 }
)

// 6. done の行は絞り込み後も残っていることを確認する
await screen.findByRole('link', {
    name: 'ATF一覧テスト done',
    exact: true,
    timeout: 15000,
})
