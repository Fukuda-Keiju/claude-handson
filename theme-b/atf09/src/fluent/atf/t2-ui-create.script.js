// -----------------------------------------------------------------------------
// T2 のブラウザ側スクリプト（Client Test Runner の iframe の中で動きます）
//
// screen / user / sn_atf / expect / waitFor などは ATF が自動で注入するので
// import は書きません。トップレベルで await が使えます（上から順に実行）。
// 画面は React ですが素の HTML 要素で作られているので、role と
// アクセシブルネーム（label や文字列）で要素を探せます。
// -----------------------------------------------------------------------------

// 1. いつも同じ入口から始めるため、一覧ビューを URL で直接指定して開く
//    （相対 URL にしておくと、どのインスタンスでもそのまま動きます）
await sn_atf.navigate('/x_2221398_todo_board.do?view=list')

// 2. ヘッダーの「New」ボタンを押して新規作成フォームへ移動する
//    React の描画は非同期なので、findBy*（見つかるまで待つ）を使う。
//    exact: true にしないと「New」を含む別のボタンに当たることがある。
const newBtn = await screen.findByRole('button', { name: 'New', exact: true, timeout: 15000 })
await user.click(newBtn)

// 3. 作成フォームが描画し終わるのを見出しで待ってから入力に進む
await screen.findByRole('heading', { name: '新しいタスク', timeout: 15000 })

// 4. Title に入力する。素の <input type="text"> なので user.type だけで値が確定する
//    （now-* の Web Component だと user.tab() で blur させる必要がありますが、今回は不要）
const titleInput = await screen.findByRole('textbox', { name: 'Title', exact: true, timeout: 15000 })
await user.type(titleInput, 'ATF T2 画面から作成')
await waitFor(() => expect(titleInput).toHaveValue('ATF T2 画面から作成'), { timeout: 15000 })

// 5. Save を押して保存する
const saveBtn = await screen.findByRole('button', { name: 'Save', exact: true, timeout: 15000 })
await user.click(saveBtn)

// 6. 保存に成功すると role="status" の領域に「保存しました」が表示される
//    role だけで要素を待ち、文言は toHaveTextContent で確かめる
//    （role="status" はアクセシブルネームを中身から作らないため、name では探さない）
const statusEl = await screen.findByRole('status', { timeout: 15000 })
await waitFor(() => expect(statusEl).toHaveTextContent('保存しました'), { timeout: 15000 })

// 7. 一覧に戻って、作ったタスクの行が出ていることを確認する
//    ボタン名は「「{タイトル}」を開く」という形。画面側と 1 文字でもずれると落ちます。
await screen.findByRole('button', {
    name: '「ATF T2 画面から作成」を開く',
    exact: true,
    timeout: 15000,
})

// 8. 念のため URL でも一覧ビュー（view=list）に戻ったことを確定させる
//    sn_atf.evaluate は iframe の中で JavaScript を実行して結果を返す
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=list')
    },
    { timeout: 15000 }
)
