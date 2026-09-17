# 困ったとき早見表（テーマB）

## 参加者向け（会場で自分で直せるもの）

| 症状 | まず見る | 対処 |
|---|---|---|
| `now-sdk` が実行できない | PowerShell の赤いエラーに「スクリプトの実行が無効」 | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` を打ち `Y`。もう一度 `now-sdk auth --add https://dev192510.service-now.com --type basic --alias handson` |
| パスワードが違うと言われる | ホワイトボードの文字、大文字小文字 | 打ち直す。それでも通らなければ挙手 |
| `claude` が「ログインしてください」と言う | claude の画面の指示 | 指示通りブラウザでログイン。1 分以上かかるなら隣の人と画面を共有して先に進む |
| `npm run deploy` で auth エラー | `now-sdk auth --list` に `handson` があるか | 無ければ自分のターミナルで `now-sdk auth --add https://dev192510.service-now.com --type basic --alias handson` |
| Run Test で Runner が開かない | ブラウザのポップアップブロック | 許可して再度 Run Test。または All → ATF → Client Test Runner を手で開く |
| Client Test Runner のタブを閉じた | UI テストが止まっている | もう一度 Run Test。以後はタブを閉じない |
| 他人のレコードでテストが失敗 | 一覧に他番号のタスクが混ざっていないか | テストのタイトルに自分の番号を入れる。ATF はロールバックするので放置でよい |
| 再テストで Negative が赤のまま | deploy 直後かどうか | 30 秒待ってもう一度 Run Test |
| deploy でスコープのエラー | `now.config.json` の scope が `x_2221398_atfNN` か | 自分では直さず挙手。講師が予備の zip（`atf11`）を渡す |
| UI テストが「要素が見つからない」で Fail | 4 分類の②（テストの間違い）の可能性 | 自分では直さず挙手。時間がなければ先に進む |

## 講師向け（Zoom・deploy 失敗・視聴者対応）

| 症状 | まず見る | 対処 |
|---|---|---|
| 22 分になっても生成が終わらない人がいる | その人の claude の画面 | Checkpoint フォルダの場所を案内し、中の全ファイルを `atfNN\src\fluent\atf\` にコピーさせる。claude は `Esc` で止めてよい |
| 講師の `atf10` のライブ生成が遅い | 残り時間 | 実況を切り上げ、Checkpoint のファイル（`theme-b\atf09\src\fluent\atf\t1-insert-open.now.ts` など）をエディタで開いて読み上げに切り替える |
| 参加者の `npm run deploy` が赤字で止まる | エラーの先頭 3 行 | `auth` や `401` → `now-sdk auth --list` を確認し無ければ登録し直す。`scope` → 予備の zip（`atf11`）を渡す |
| UI テストだけ赤 | サーバー側 2 本が緑か | 「テスト側の問題の可能性が高い」と言い先に進む。後半で扱う |
| Negative が緑になる（欠陥版なのに） | そのテストが「保存できる」を期待していないか | Solution の Negative を渡して置き換え、再 deploy。「プロダクト起点の罠」の実例として全員に紹介する |
| 35〜43 分を過ぎている | 4 章の捨て順 2 番 | Solution の Negative を全員に配り、deploy → Run Test だけにする |
| 講師の fix deploy が失敗、3 分以上終わらない | エラー先頭 3 行 | 水曜に撮った緑→赤→緑のスクリーンショットで代替。参加者の再テストは省いて 50 分へ。終了後に原因調査 |
| Zoom の画面共有が止まる、音が届かない | Zoom 担当からの合図 | 共有を一度止めて再開。復旧しない間は Zoom 担当がチャットで「今〇〇をしています」と実況する |
| 視聴者が 30 分前に仕様の中身を会場に言ってしまう | | 気にせず進める。「設計者が先に気づく、というのがまさに今日の話です」と拾って 30 分のブロックを少し早める |
| 視聴者からの質問に答えられない | | 「終了後に文書でお答えします」と言い、Zoom 担当にメモしてもらう |
| 視聴者がほとんどチャットに書かない | 投票の回答数 | 投票の結果だけ読み上げて進める。30 分のブロックでは講師が「仕様の 1 番を見てください」と自分で指摘する |
