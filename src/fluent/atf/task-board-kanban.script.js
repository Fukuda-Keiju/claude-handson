// Kanban ボードでカードを Open → In Progress → Done へ動かす UI Test Script。
// screen / user / sn_atf / expect / waitFor はテスト実行時に注入されるので import は不要。

// 1. view を付けずに開くとボード（Kanban）が初期表示になる
await sn_atf.navigate('/x_2221398_handson_task_board.do')

// 2. まず画面が描画されたことを h1 で確認する（React の初期描画待ち）
await screen.findByRole('heading', {
    name: 'Handson Task ボード',
    exact: true,
    timeout: 15000,
})

// 3. カードはタスク一覧の fetch が返ってから描かれる。
//    移動ボタンの aria-label は「「{title}」を {移動先の列} へ移動」なので、
//    このボタンが見つかる＝目的のカードが Open 列に並んだ、ということになる。
const toInProgress = await screen.findByRole('button', {
    name: '「ATFボード移動テスト」を In Progress へ移動',
    exact: true,
    timeout: 15000,
})
await user.click(toInProgress)

// 4. In Progress 列へ移ったかどうかは「その列でしか出ないボタン」で判定する。
//    Done へ移動できるのは In Progress 列のカードだけなので、これが出れば移動成功。
//    （PATCH → 一覧の再取得 → 再描画、と非同期なので findBy* で待つ）
const toDone = await screen.findByRole('button', {
    name: '「ATFボード移動テスト」を Done へ移動',
    exact: true,
    timeout: 15000,
})
await user.click(toDone)

// 5. Done 列は一番右なので、これ以上右へ動かすボタン（Done へ移動）は消える。
//    「消えたこと」は findBy* では待てないため queryBy*（0 件なら null）を waitFor で繰り返す。
await waitFor(
    async () => {
        const stillToDone = await screen.queryByRole('button', {
            name: '「ATFボード移動テスト」を Done へ移動',
            exact: true,
        })
        expect(stillToDone).toBeNull()
    },
    { timeout: 15000 }
)

// 6. 代わりに Done 列のカードには「左（In Progress）へ戻す」ボタンだけが残る
await screen.findByRole('button', {
    name: '「ATFボード移動テスト」を In Progress へ移動',
    exact: true,
    timeout: 15000,
})

// 7. state=done で保存されると Business Rule が completed_at を入れる。
//    ボードは PATCH 後に一覧を取り直すので、その結果として「完了 {日時}」チップが描かれる。
//    他にも done のタスクがあればチップは複数出るため、件数は 1 件以上で判定する。
const doneChips = await screen.findAllByText(/^完了 /, { timeout: 15000 })
expect(doneChips.length).toBeGreaterThanOrEqual(1)
