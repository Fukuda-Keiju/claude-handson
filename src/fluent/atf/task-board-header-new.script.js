// ヘッダーの「＋ 新規タスク」から開いた作成画面が、開いた場所（ボード）へ戻ることを確かめる。
// screen / user / sn_atf / expect / waitFor は自動で注入されるので import は不要。

// 1. ボード（既定表示）を開く
await sn_atf.navigate('/x_2221398_handson_task_board.do')

// 2. アプリのヘッダー（唯一の h1）が描かれるまで待つ
await screen.findByRole('heading', {
    name: 'Handson Task ボード',
    exact: true,
    timeout: 15000,
})

// 3. ボードが出ている証拠として Kanban の列見出し「Open」(h2) を待ってから操作する
await screen.findByRole('heading', { name: 'Open', exact: true, timeout: 15000 })

// 4. ヘッダー右上の「＋ 新規タスク」を押す。
//    一覧の「New」ボタンとは別物なので、exact にしてラベル全体で特定する。
const newBtn = await screen.findByRole('button', {
    name: '＋ 新規タスク',
    exact: true,
    timeout: 15000,
})
await user.click(newBtn)

// 5. 作成フォームが開いたことを Title 入力欄で確認する（ラベルは「Title」で始まる）
await screen.findByRole('textbox', { name: /^Title/, timeout: 15000 })

// 6. 戻るボタンのラベルが「← ボードへ戻る」になっている＝ from=board が引き継がれた証拠。
//    一覧から開いたとき（from=list）や from 無しのときは「← 一覧へ戻る」になる。
const backBtn = await screen.findByRole('button', {
    name: '← ボードへ戻る',
    exact: true,
    timeout: 15000,
})

// 7. URL にも view と from の両方が載っている
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=create')
        expect(search).toContain('from=board')
    },
    { timeout: 15000 }
)

// 8. 何も入力していないので未保存の確認モーダルは出ない。そのままボードへ戻る。
await user.click(backBtn)

// 9. 列見出し「Open」が再び出れば、一覧ではなくボードへ戻れている
await screen.findByRole('heading', { name: 'Open', exact: true, timeout: 15000 })

// 10. URL もボードに戻っている（from は落ちる）
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=board')
    },
    { timeout: 15000 }
)
