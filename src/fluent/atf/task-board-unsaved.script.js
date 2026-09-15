// 未保存の変更がある状態で「一覧へ戻る」を押したときの確認モーダルを確かめる。

// 新規作成画面を直接開く
await sn_atf.navigate('/x_2221398_handson_task_board.do?view=create')

// Title を入力して未保存（isDirty）状態を作る
const titleInput = await screen.findByRole('textbox', { name: /^Title/, timeout: 15000 })
await user.type(titleInput, 'ATF未保存テスト')
await user.tab() // now-* 入力は blur で値が確定する

// 未保存になると画面上部に警告アラートが出る
// 同じ文言はこのあとモーダル側にも出るため、件数だけを確認する
const dirtyAlerts = await screen.findAllByText('未保存の変更があります', { timeout: 15000 })
expect(dirtyAlerts.length).toBeGreaterThanOrEqual(1)

// 未保存のまま「← 一覧へ戻る」を押すと確認モーダルが開く
const backBtn = await screen.findByRole('button', { name: '← 一覧へ戻る', timeout: 15000 })
await user.click(backBtn)

// モーダル本体は dialog ロールで特定する（文言はアラートと重複するため）
await screen.findByRole('dialog', { timeout: 15000 })
// モーダル固有の本文でも、開いたのが未保存確認モーダルであることを確かめる
await screen.findByText('保存していない変更は失われます。一覧へ戻りますか？', { timeout: 15000 })

// フッターのボタンはスロット越しなので within(dialog) ではなく screen から探す
const cancelBtn = await screen.findByRole('button', {
    name: 'キャンセル',
    exact: true,
    timeout: 15000,
})
await user.click(cancelBtn)

// モーダルが閉じる（dialog が取得できなくなる）まで待つ
await waitFor(
    async () => {
        expect(await screen.queryByRole('dialog')).toBeNull()
    },
    { timeout: 15000 }
)

// 画面遷移はしていない＝入力欄が残っていて、URL も create のまま
await screen.findByRole('textbox', { name: /^Title/, timeout: 15000 })
const search = await sn_atf.evaluate(() => location.search)
expect(search).toContain('view=create')
