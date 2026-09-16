# テーマB 講師ガイド 案C版（参加者ごとの PDI + リポジトリ配布）

本編 `theme-b-facilitator-guide.md`（案A: 講師 PDI にテスト用スコープを配る）、統一版 `theme-b-facilitator-guide-unified.md`（ブラウザのみ）に対する 3 つ目の形。
**参加者が自分の PDI に欠陥版アプリを入れ、自分の PDI でテストを書き、自分でアプリを直す。** テスターと開発者の両方を体験する、いちばん「濃い」版。

---

## 0. 案C とは・いつ選ぶか

| | 本編（案A） | 統一版 | **案C** |
|---|---|---|---|
| アプリの置き場所 | 講師 PDI に 1 つ | 講師 PDI に 1 つ | **参加者ごとの PDI に 1 つずつ** |
| 参加者が書くもの | ATF テスト | なし（ボタンのみ） | ATF テスト + **アプリの修正を自分で入れる** |
| 参加者に必要な環境 | Node / now-sdk / Claude Code | ブラウザ | Node / now-sdk / Claude Code / **自分の PDI** / **事前課題 30〜40 分** |
| 参加者どうしの干渉 | 同じ PDI（スコープで分離） | 同じ PDI | **なし** |
| 講師の当日負荷 | 中 | 低 | **高**（PDI ごとに状態が違う） |
| 人数の上限 | スコープ数 | 実質なし | **事前課題を終えた人数** |

**選ぶ条件（全部満たすとき）**
1. 参加者が事前に確定していて、2 日前までに事前課題をお願いできる。
2. 参加者全員が自分の PDI を持っている（または当日までに取れる）。
3. 事前課題の完了を前日までに確認できる（スクリーンショット提出）。

満たせない場合は本編か統一版にする。**案C は「濃い体験」と「事前準備の重さ」の交換**で、当日に初めて環境を触る初学者には向かない。事前課題を終えていない人は視聴者（設計者役）に回す。役割は「場所」ではなく **「事前課題を終えたか」で分ける**。

---

## 1. 決定事項

### 1.1 役割

| 役割 | 誰 | 持っている情報 | 当日やること |
|---|---|---|---|
| 講師 | 福田 | 全部 | 台本どおり進める。自分の PDI（`dev192510`）で同じ操作を実演 |
| Zoom 担当 | お世話係 1 名 | 全部 | チャット、投票、設計者役の発言を講師へ |
| 参加者（テスター兼開発者） | **事前課題を完了した人**（会場・オンライン問わず） | アプリの画面だけ。仕様書は 30 分まで渡さない | 自分の PDI でテスト生成 → 実行 → 赤 → **自分で修正を入れて** 再テスト |
| 視聴者（設計者・レビュアー） | 事前課題をしていない人・環境がない人 | 仕様書を事前に持つ | 本編と同じ（見落とし指摘、投票） |

### 1.2 技術面の決定

| 項目 | 決定 | 理由 |
|---|---|---|
| 配布物 | **参加者キット**（zip。GitHub の Release にも置く）。中身: `todo-app/`（欠陥版のスナップショット）、`atf-tests/`（空の Fluent プロジェクト + `CLAUDE.md`）、`fix/`（修正版の 3 ファイル）、`setup.ps1`、`fix.ps1`、`preflight.ps1`、`README.md` | git clone を初学者にやらせない。zip なら「展開して 1 コマンド」で済む |
| スコープ接頭辞の書き換え | **`setup.ps1` が自動で行う。** 参加者の PDI から会社コードを読み、`x_2221398_todo` → `x_<code>_todo`、`x_2221398_atf` → `x_<code>_atf` に全ファイル置換し、`now-sdk init` を一時フォルダで走らせて scopeId を採る | 他社の接頭辞のアプリは PDI が「third party application」として **インストールを拒否する**（2026-09-16 に確認）。書き換え自体は 1 秒 |
| 欠陥 | 本編と同じ「タイトル空欄で保存できる」 | 既に検証済み（正しい版 5/5、欠陥版 3/5） |
| アプリの修正 | **参加者自身が `fix.ps1` → build → deploy。** `fix.ps1` は `fix/` の 3 ファイル（`validate-title.ts`、`TodoForm.tsx`、`todo-item.now.ts`）を上書きコピーするだけ | 自分の PDI なので衝突しない。「テストが欠陥を見つけ、直して、再テストで確かめる」を 1 人で完結できる |
| ATF の実行 | 自分の PDI の画面から Run Test。**UI テストも各自で実行できる**（Client Test Runner は PDI ごと） | 待ち行列の問題がない |
| PDI 側の前提 | `sn_atf.runner.enabled` と `sn_atf.schedule.enabled` を true にする。**`setup.ps1` の最後で `set-atf-props.mjs` が Table API 経由で自動設定する**（失敗時だけ手動: `sys_properties.list`） | PDI の初期値は false。手動だと漏れやすい項目なので自動化した（2026-09-16 mypdi で動作確認） |
| PDI の起床 | 開始 30 分前にログインしておく（事前案内で念押し） | PDI は放置で休止し、起こすのに数分かかる |
| 講義・投票・振り返り・最後の 5 分 | 本編と同じ | |

### 1.3 配布キットの中身

```
themeB-kit/
  README.md            # 事前課題の手順
  preflight.ps1        # 事前チェック 12 項目（道具、キット、setup 済み、接続先、アプリ導入済み、ATF 設定）
  setup.ps1            # 会社コード取得 → 接頭辞置換 → scopeId 採取 → npm ci → build → deploy（todo-app）→ npm ci → build（atf-tests）→ ATF 設定
  set-atf-props.mjs    # setup.ps1 から呼ばれ、sn_atf.runner.enabled / schedule.enabled を true にする
  fix.ps1              # fix/ の 3 ファイルを todo-app/src/ に上書きし、直した行を表示
  todo-app/            # 欠陥版（theme-b-buggy のスナップショット。keys.ts と node_modules なし）
  atf-tests/           # 空の Fluent プロジェクト + CLAUDE.md + docs/（spec.md は入れない）
  fix/src/...          # 修正版の 3 ファイル
  checkpoint/, solution/
```

元は `theme-b/kit/`（スクリプト）と `theme-b/tools/build-kit.ps1`（組み立て）。zip を作り直すときは `theme-b\tools` で `.\build-kit.ps1`。
`CLAUDE.md`（`atf09/CLAUDE.md` が元）にはスコープ名とテーブル名が 5 か所入っているので、`setup.ps1` の置換対象に含めている。

---

## 2. 準備スケジュール（本編との差分）

| 日 | やること | 完了の印 |
|---|---|---|
| 配布 3 日前まで | ① `setup.ps1` / `fix.ps1` / `preflight.ps1` **→ 済** ② キット zip **→ 済（`theme-b/dist/kit/themeB-kit.zip`）** ③ 講師 PDI で別スコープ名の擬似検証 **→ 済（サーバー側テストで 欠陥版 2/3 → fix 後 3/3）**。**別の PDI での通しは未**（同僚の PDI を借りて 1 回通す。会社コードの取得と接頭辞書き換えが実際に効くかはここでしか確かめられない） ④ 事前課題メールを送る | 別 PDI で 欠陥版 3/5 → fix 後 5/5 |
| 前日 | ⑤ 参加者から「ボードにタスクを作れた」スクリーンショットを回収。未提出者は視聴者に振り分けて連絡 ⑥ 視聴者に仕様書を送る | 参加者名簿が確定 |
| 当日 30 分前 | ⑦ 参加者に「PDI にログインして起こしておいてください」を送る | |

**作成済み（2026-09-16 夕方）**: `theme-b/kit/`（`setup.ps1`、`fix.ps1`、`preflight.ps1`、`set-atf-props.mjs`、`README.md`）、組み立てスクリプト `theme-b/tools/build-kit.ps1`、生成物 `theme-b/dist/kit/themeB-kit.zip`（約 200 KB、node_modules なし）。

**擬似検証済み（2026-09-16、講師 PDI で `-ScopeSuffix 2` を付けて実行 → `x_2221398_todo2` / `x_2221398_atf2`）**

| 手順 | 結果 |
|---|---|
| zip 展開 → `setup.ps1` | 成功。20 ファイル / 45 か所を書き換え、スコープ登録、npm ci、build、deploy、テーブル確認まで自動 |
| `preflight.ps1` | 12 項目すべて OK |
| Solution の 5 テストを atf-tests に入れて deploy | 成功 |
| 欠陥版に対して T1 / T3 / T4 を実行 | T1 成功、T3 成功、**T4（Negative）失敗** = 期待どおり |
| `fix.ps1` → build → deploy | 成功。build 23 秒、deploy 20 秒 |
| 修正版に対して T4 / T1 / T3 を再実行 | **3 本とも成功** = 期待どおり |
| UI テスト（T2 / T5） | **未実行**（Client Test Runner が必要。木曜のパイロットで画面から Run Test して確認する） |

所要時間（`setup.ps1` の実測。初回）

| 工程 | 秒 |
|---|---|
| 会社コードの取得 | 3.6 |
| 接頭辞の書き換え | 0.2 |
| スコープ登録 × 2 | 8.5 + 6.7 |
| npm ci (todo-app) | 45 |
| build (todo-app) | 70.8 |
| deploy (todo-app) | 21 |
| npm ci (atf-tests) | 18.6 |
| build (atf-tests) | 56.1 |
| 導入確認 | 3.4 |
| **合計** | **約 4 分** |

**検証で見つかり、直したこと**

- **`keys.ts` を同梱してはいけない。** 元アプリと同じ sys_id を持ち込むと、同じインスタンス上では Business Rule・メニュー・UI Page が「既に存在」として黙って飛ばされ、テーブルだけ入る（1 回目の擬似検証で発生。元アプリ側は無傷だった）。`build-kit.ps1` は `keys.ts` を除外し、build に新しい ID を採らせる。参加者の PDI では衝突しないが、同じ対策で安全側に寄せる。
- PowerShell 5.1 は BOM なし UTF-8 の `.ps1` を ANSI として読む。日本語を含むスクリプトは **BOM 付き**で保存し、日本語テキストの読み書きは `[IO.File]::ReadAllText/WriteAllText` に UTF-8 を明示する（`Get-Content` 既定で `CLAUDE.md` が文字化けした）。
- 同じスコープへ ID の違うテストを再 deploy すると、**古いテストは消えず重複する**（atf2 に 5 本 × 2 が残った）。当日 `atf10` を使い回す場合は、前回のテストを手で削除するか Rollback しておく。

---

## 3. 当日の進行台本（本編と同じ骨格。差分を太字で）

> 当日そのまま読む完全版の原稿は `theme-b-script-planC.md` にある（本編を参照せずに 1 冊で完結。セリフ・チャット文・操作をすべて書き切った版）。この章は差分の一覧として残す。

記号は本編 3.0 と同じ。参加者向けチャット文は会場チャットと Zoom チャットの両方に貼る（参加者は両方にいる）。

講師の画面: ブラウザ（自分の PDI のボード、Tests 一覧）、ターミナル 2 つ（`todo-app`、`atf10`）。講師も **キットを展開したフォルダで** 参加者と同じコマンドを打つ。

### 開始前 10 分

👥
```
【開始前にお願い】
1. 自分の PDI にブラウザでログインしておく（休止から起こすため）。
2. キットを展開したフォルダ themeB-kit を「ターミナルで開く」。
3.   .\preflight.ps1   と打つ。全部 [OK] なら「OK」とチャットに。[NG] があれば行をそのまま貼ってください。
```
📺 視聴者へは本編と同じ（仕様書を伏せる依頼）。

### 0〜5 分　導入と確認

🗣 本編の導入 + 用語 4 つ。追加で:
「今日は皆さん一人ひとりの PDI に、同じアプリが入っています。**他の人と一切干渉しません。** 壊しても大丈夫です。後半では皆さん自身がアプリを直します。」

✅「preflight が全部 OK の人、挙手（またはチャット OK）。」8 割で進む。NG の人は Zoom 担当が個別対応し、22 分までに合流できなければ視聴者役へ。

🆘 PDI が起きない（ログイン画面が数分出ない）→ 待つしかない。「起きるまで視聴者として見ていてください。22 分の Checkpoint で合流します」。

### 5〜10 分　アプリを触る

👥
```
【アプリを触る】自分の PDI で All → Handson → Handson Todo board。3 分間自由に。
```
差分: 全員が自分の PDI なので、タスク名に番号を付けなくてよい。

### 10〜22 分　Claude Code でテスト生成

👥
```
【プロンプト①】themeB-kit\atf-tests を「ターミナルで開く」→ claude と打って Enter → 下の文を貼る。
```
続けてプロンプト①（本編 2.3。**アプリ名・テーブル名は setup.ps1 が CLAUDE.md を書き換えているので、プロンプト①の文中の `x_2221398_todo_item` は「CLAUDE.md に書いてあるテーブル」と言い換えた版を使う**。付録 A）。

🖱 講師も `atf10` で同じことを実演。実況は本編と同文。

🖱 投票 1（22 分）。

🆘 生成が終わらない → Checkpoint フォルダ（キットに同梱、**接頭辞は setup.ps1 が置換済み**）を `atf-tests\src\fluent\atf\` にコピー。

### 22〜30 分　build → deploy → Run Test（全部緑）

👥
```
【送る】atf-tests のターミナルで
  npm run build
  npm run deploy
【実行する】自分の PDI で All → Automated Test → Tests。Application 列を「ATF Handson」で絞る。
1 本目を開き Run Test → Run Test。Client Test Runner のタブが開く。閉じない。
3 本とも実行。全部緑になったら「緑3」とチャットに。
```
差分: **UI テストも各自で実行できる。** 画面が勝手に動く様子を全員が自分の画面で見る。

### 30〜35 分　設計者の出番 → 仕様書配布

本編と同じ。

### 35〜43 分　プロンプト② → 赤

👥
```
【仕様書を置く】配られた仕様書の 5 行を atf-tests\docs\spec.md に保存（メモ帳で新規作成）。
【プロンプト②】claude で本文を貼る。build が通ったら npm run build → npm run deploy。
Tests 一覧を F5。増えた Negative を Run Test。赤になったら「赤」とチャットに。
```
投票 2、4 分類、Output の読み方は本編と同文。

### 43〜50 分　**参加者自身がアプリを直す → 再テスト**（案C の見せ場）

🗣「テストが欠陥を見つけました。今日は皆さん自身が開発者として直します。修正は 3 ファイルで、キットの fix フォルダに入っています。スクリプトで上書きして、アプリを送り直します。」

👥
```
【直す】themeB-kit を「ターミナルで開く」→
  .\fix.ps1                （fix\ の 3 ファイルを todo-app に上書き。何が変わったか画面に出ます）
  cd todo-app
  npm run build
  npm run deploy           （1 分半ほど）
【再テスト】Tests 一覧で Negative → 緑。Positive 3 本 → 緑のまま。全部緑で「緑緑」とチャットに。
```

🖱 講師は `fix.ps1` の出力（差分 3 ファイル）を画面共有し、`validate-title.ts` を開いて **Business Rule の 3 行**（空タイトルなら `setAbortAction(true)` で保存を止める）を読み上げる。「直したのはこれだけです。テストがなければ誰も気づきませんでした。」

⏱ build 22 秒 + deploy 20 秒 + 再テスト 4 本で **3〜4 分**。50 分に間に合う。

🆘
- deploy が失敗 → エラー先頭 3 行をチャットに貼らせる。多いのは「scopeId がない」（`now.config.json` を setup が書き換えていない）。時間がなければ講師の画面で結果を見せる。
- 再テストしても Negative が赤 → deploy 完了前に押している。30 秒待って再度。

### 50〜54 / 54〜55 / 55〜60

本編と同文（振り返り、アンケート、講師の学びと反省）。振り返りの問いに 1 つ足す:
```
自分でアプリを直して再テストしたとき、何を感じましたか。1 行。
```

---

## 4. 時間が押したときの捨て順

1. 振り返りを 2 分に。
2. 55〜60 を 3 分に（ゼロにしない）。
3. **43〜50 の参加者による修正をやめ、講師の実演だけにする**（案C の見せ場だが、build+deploy の 2 分が惜しいときはここ）。
4. 35〜43 のプロンプト②をやめ、Solution の Negative をコピーして deploy。
5. 投票 1 を省く。

---

## 5. 案C 特有の困ったとき

| 症状 | 原因 | 対処 |
|---|---|---|
| install で `Unable to install application as application was null` | 接頭辞が PDI の会社コードと合っていない（third party として拒否） | `setup.ps1` をやり直す。手で直すなら `now-sdk query sys_properties -q "name=glide.appcreator.company.code" -f value` で会社コードを確認 |
| build で `scopeId` がないと言われる | `now.config.json` の scopeId が空 | `setup.ps1` の init 工程が失敗している。一時フォルダで `now-sdk init --scopeName x_<code>_todo ...` を打ち、出てきた `scopeId` を貼る |
| PDI にログインできない・遅い | PDI が休止中 | 起きるまで待つ。5 分以上なら視聴者役へ |
| Run Test で UI テストが動かない | `sn_atf.runner.enabled` が false | 自分の PDI で `sys_properties.list` → 2 つを true。事前課題の項目だが漏れやすい |
| 画面のテストだけ失敗（要素が見つからない） | PDI のバージョン差で画面部品の名前が違う | 4 分類の②。時間内は無視し、サーバー側 3 本で進める。終了後に調べる |
| 他人と結果が違う | 各自の PDI なので当然。欠陥版が入っていない可能性 | ボードで空タイトル保存を試させて確認（**35 分以降だけ**） |
| 事前課題をしていない人が当日来た | | 視聴者役へ。統一版のように講師 PDI へログインさせる手もあるが、混ぜると進行が割れるので **しない** |

---

## 6. 未確認事項（別 PDI での通しで確かめる）

- `setup.ps1` を **講師以外の PDI** で通したことがない。講師 PDI では会社コードが同じなので、接頭辞の書き換えは「末尾に 2 を付ける」形でしか確かめていない。会社コードが違う PDI で 1 回通す（最重要）。
- UI テスト T2 / T5 を書き換え後のアプリ（`x_<code>_todo_board.do`）に対して実行していない。
- PDI のリリース差（Yokohama / Zurich 等）で React UI Page と UI テストが同じに動くか。
- 参加者側の Claude Code のアカウント有無（本編と同じ論点）。
- `fix.ps1` 後の 2 回目 deploy で、既存の Todo Item レコードや ATF 結果が残るか（Fluent の差分 install なので残るはずだが未確認）。
- `set-atf-props.mjs` の **false → true の更新経路**。講師 PDI は既に true なので「既に true」の分岐しか通していない。初期値 false の PDI で 1 回通す（別 PDI 通しのときに一緒に確認）。

---

## 付録 A. 案C 用プロンプト①（アプリ名を CLAUDE.md 参照に変えた版）

```
このプロジェクトは ServiceNow Fluent SDK の ATF テスト専用プロジェクトです。
テスト対象は同じインスタンス上の別スコープのアプリ「Handson Todo」です。
スコープ名・テーブル名・画面の URL は CLAUDE.md の「テスト対象アプリの情報」に書いてあります。それを使ってください。
CLAUDE.md のルールに従って、次の 3 本の ATF テストと、それをまとめた TestSuite を src/fluent/atf/ に作ってください。
1. Positive（サーバー）: タイトル付きでレコードを作成でき、state の初期値が open であること
2. Positive（UI）: ボード画面で New を押し、タイトルを入力して Save すると一覧に表示されること
3. 今のアプリの挙動を確認したうえで、もう 1 本、あなたが妥当だと思うテストを追加する
作り終えたら npm run build が通ることを確認してください。deploy はしないでください。
```
プロンプト②は本編 2.3 と同文。

## 付録 B. 事前課題メール（参加者へ。配布 3 日前）

```
件名: 【9/18 14:20 テーマB】事前課題のお願い（30〜40 分。前日までに）

当日は、ご自身の PDI（Personal Developer Instance）に小さなアプリを入れ、AI にテストを書かせ、見つかった欠陥をご自身で直します。
そのために、前日までに次をお願いします。

1. PDI を用意する（お持ちでない方は developer.servicenow.com で取得。10 分）
2. 添付の themeB-kit.zip をデスクトップに展開する
3. 展開したフォルダを右クリック →「ターミナルで開く」→ 次を順に打つ
     .\preflight.ps1                     ← 足りないものが赤で出ます。指示に従って入れてください
     now-sdk auth --add --alias mypdi    ← ご自身の PDI の URL / admin / パスワード
     .\setup.ps1                         ← 5 分ほど。最後に「準備完了」と出れば成功（ATF の実行設定も自動で入ります）
     .\preflight.ps1                     ← もう一度。全部 [OK] になることを確認
4. ブラウザで All → Handson → Handson Todo board を開き、タスクを 1 つ作る
5. preflight の画面とボードの画面のスクリーンショット 2 枚を、前日 17:00 までに返信で送ってください

うまくいかない箇所は、赤字の行をそのまま返信してください。
事前課題が終わらなかった方も、当日は「設計者役」として参加できます。
当日は開始 30 分前にご自身の PDI にログインしておいてください（休止から起こすため）。
```

## 付録 C. `setup.ps1` の動き（実装済み。`theme-b/kit/setup.ps1`）

1. `now-sdk auth --list` に接続先（既定 `mypdi`）があることを確認。無ければ手順を表示して終了。
2. `now-sdk query sys_properties -q "name=glide.appcreator.company.code"` で会社コードを取得。
3. `todo-app/`、`atf-tests/`、`fix/`、`checkpoint/`、`solution/` の全テキストファイルで `x_2221398_todo` → `x_<code>_todo`、`x_2221398_atf` → `x_<code>_atf`、残りの `x_2221398_` → `x_<code>_` に置換。結果は `.setup-state.json` に記録。
4. スコープごとに、まず `sys_app` を scope 名で検索。あればその sys_id を scopeId に使う（再実行時）。無ければ一時フォルダで `now-sdk init --template typescript.basic` を実行し、生成された `now.config.json` の `scopeId` を写す（`init` は sys_app を作らない。install で初めてできる）。
5. `todo-app` で `npm ci` → `npm run build` → `npm run deploy -- --auth <alias>`。`atf-tests` で `npm ci` → `npm run build`（deploy はしない。テストは当日に入れる）。
6. `set-atf-props.mjs` で ATF の実行設定 2 つを true にする（失敗時は手動手順を黄色で表示）。
7. `sys_db_object` にテーブル `x_<code>_todo_item` があることを確認。
8. 各工程の所要秒数を表で表示。失敗した工程では対処を 1 行で出して止まる。
9. 2 回実行しても壊れない（置換済みなら置換を飛ばす、scopeId があれば登録を飛ばす）。オプション `-ScopeSuffix`（検証用）、`-SkipInstall`、`-SkipNpm`。
