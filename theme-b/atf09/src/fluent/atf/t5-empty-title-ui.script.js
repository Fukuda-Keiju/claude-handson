// -----------------------------------------------------------------------------
// T5 のブラウザ側スクリプト（Negative）
//
// わざと Title を空のまま Save を押して、
//   (1) 「タイトルは必須です」というエラーが出る
//   (2) 作成画面から動かない（一覧へ遷移しない）
// ことを確かめます。
// 欠陥アプリではこの入力チェックの if 文が外れているため、
// エラーが出ずに保存されてしまい、このスクリプトは (1) で失敗（赤）になります。
// -----------------------------------------------------------------------------

// 1. 新規作成ビューを URL で直接開く（New ボタンを押す手間を省き、入口を固定する）
await sn_atf.navigate('/x_2221398_todo_board.do?view=create')

// 2. 作成フォームが描画し終わるのを見出しで待つ
await screen.findByRole('heading', { name: '新しいタスク', timeout: 15000 })

// 3. Title は *あえて空のまま* にして、Notes だけ入力する。
//    Notes に印をつけておくと、後のサーバー検証で「この 1 件が入っていないこと」を
//    ピンポイントに確かめられます。
const notesInput = await screen.findByRole('textbox', { name: 'Notes', exact: true, timeout: 15000 })
await user.type(notesInput, 'ATF T5 空タイトル')
await waitFor(() => expect(notesInput).toHaveValue('ATF T5 空タイトル'), { timeout: 15000 })

// 4. Title が空であることを念のため確認してから Save を押す
const titleInput = await screen.findByRole('textbox', { name: 'Title', exact: true, timeout: 15000 })
expect(titleInput).toHaveValue('')

const saveBtn = await screen.findByRole('button', { name: 'Save', exact: true, timeout: 15000 })
await user.click(saveBtn)

// 5. role="alert" の領域に「タイトルは必須です」が出ること
//    （role="alert" も中身からアクセシブルネームを作らないので、
//      role で要素を待ってから文言を toHaveTextContent で確かめる）
const alertEl = await screen.findByRole('alert', { timeout: 15000 })
await waitFor(() => expect(alertEl).toHaveTextContent('タイトルは必須です'), { timeout: 15000 })

// 6. 画面が作成ビューにとどまっていること（一覧へ遷移していないこと）を URL で確定させる
//    作成画面と詳細画面は見た目が似ているので、見た目ではなく URL で判定するのが確実。
await waitFor(
    async () => {
        const search = await sn_atf.evaluate(() => location.search)
        expect(search).toContain('view=create')
    },
    { timeout: 15000 }
)
