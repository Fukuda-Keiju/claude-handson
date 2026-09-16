# 参加者向け手順書 — テーマB（ServiceNow SDK × ATF）

2026-09-18（金）14:20 / 60 分 / 講師: 福田

---

## 今日やること

1. アプリの画面を触り、AI（Claude Code）に ATF テストを 3 本書かせる。
2. テストを ServiceNow に送り、画面のボタンで実行する。全部緑になる。
3. 30 分に仕様書をもらい、Negative Test を足して赤を出し、修正後に再テストする。

---

## 記号の意味

| 記号 | 意味 |
|---|---|
| `NN` | 自分の 2 桁番号。席札に書いてあります。1 人目は `01`、8 人目は `08` |
| `atfNN` | 自分の作業フォルダ。1 人目は `atf01`、2 人目は `atf02`。中身は「テストだけを書く空の Fluent プロジェクト」 |
| `handsonNN` | ServiceNow のログインユーザー。1 人目は `handson01`。パスワードは全員共通（ホワイトボードにあります） |
| `handson` | `now-sdk` に登録する接続先の「あだ名」。全員同じ名前でよい |
| 講師 PDI | `https://dev192510.service-now.com`。テスト対象のアプリが入っています。全員ここにログインします |

---

## 開始前の準備

### 1. zip を展開する

```
【開始前にお願い】
1. 席札の番号（NN）を確認してください。
2. 配布された atfNN.zip をデスクトップに展開してください（右クリック → すべて展開）。
3. 展開した atfNN フォルダを開き、フォルダ内の何もない所で右クリック → 「ターミナルで開く」。
4. 開いたターミナルで  npm install  と打って Enter。終わるまで 2〜3 分待ちます。
```

「ターミナルで開く」が出ない人: スタートメニューから「ターミナル」または「PowerShell」を開き、`cd Desktop\atfNN` と打って Enter。

### 2. 接続を登録する

```
【接続の登録】自分のターミナル（atfNN フォルダで開いたもの）で次を打ちます。
  now-sdk auth --add --alias handson
質問が順に出ます。次のように答えてください。
  Instance URL      → https://dev192510.service-now.com
  Auth type         → basic を選ぶ（矢印キーで選んで Enter）
  Username          → handsonNN（自分の番号）
  Password          → ホワイトボードのパスワード
終わったら  now-sdk auth --list  と打ち、handson が表示されれば OK。
```

### 3. ブラウザでログインする

```
【ブラウザ】https://dev192510.service-now.com を開き、handsonNN と同じパスワードでログイン。
```

### 4. Claude Code を起動する

```
【Claude Code】同じターミナルで  claude  と打って Enter。
「このフォルダを信頼しますか」と出たら Yes。プロンプト入力欄が出れば OK。まだ何も打たないでください。
```

**終わったらこうなっている**: `now-sdk auth --list` に handson が出て、ブラウザにログインでき、claude の入力欄が出ている。

---

## 手順 1　アプリを触る

```
【アプリを触る】ブラウザ左上 All → 検索欄に Handson → Handson Todo board をクリック。
3 分間自由に触ってください。タスク名の先頭に自分の番号（例: 01 買い物）。
```

**終わったらこうなっている**: 自分の番号が付いたタスクを作り、列を動かせている。

---

## 手順 2　プロンプト①を貼る

```
【プロンプト①】claude の入力欄に、下の文をそのまま貼って Enter。
途中で「ファイルを作成してよいか」「npm run build を実行してよいか」と聞かれたら Yes を選ぶ。
終わったら「build が通りました」のような報告が出ます。それまで待つ。deploy はまだしない。
```

```
このプロジェクトは ServiceNow Fluent SDK の ATF テスト専用プロジェクトです。
テスト対象は同じインスタンス上の別スコープのアプリ「Handson Todo」
（テーブル x_2221398_todo_item、UI ページはナビゲータの Handson Todo board）です。
CLAUDE.md のルールに従って、次の 3 本の ATF テストと、それをまとめた TestSuite を src/fluent/atf/ に作ってください。
1. Positive（サーバー）: タイトル付きでレコードを作成でき、state の初期値が open であること
2. Positive（UI）: ボード画面で New を押し、タイトルを入力して Save すると一覧に表示されること
3. 今のアプリの挙動を確認したうえで、もう 1 本、あなたが妥当だと思うテストを追加する
作り終えたら npm run build が通ることを確認してください。deploy はしないでください。
```

**終わったらこうなっている**: `src/fluent/atf/` にテストのファイルができ、build が通ったと報告が出ている。

---

## 手順 3　送って実行する（全部緑になる予定）

```
【送る】claude を Esc で一度抜けるか、別のターミナルを atfNN で開いて、次を順に打つ。
  npm run build
  npm run deploy
「Installed」や「success」の文字が出れば成功。1〜2 分かかります。
```

```
【実行する】ブラウザで左上 All → 検索欄に Automated Test → 「Tests」をクリック。
一覧の上の検索欄で Application 列に「ATF Handson NN」（自分の番号）と入れて絞る。
自分のテストが 3 本出ます。1 本目の名前をクリックして開く。
右上の「Run Test」ボタンを押す。
小さな画面が出て、「Run Test」ボタンをもう一度押す。
「Client Test Runner」という新しいタブが自動で開きます。閉じないでください。
元のタブに戻ると、結果画面に切り替わり、しばらくすると Status が Success（緑）になります。
残り 2 本も同じように実行してください。
```

**終わったらこうなっている**: 3 本とも Status が Success（緑）になっている。

---

## 手順 4　仕様書を保存する

30 分ごろに仕様書を配ります。

```
【仕様書を保存】atfNN\docs フォルダに spec.md という名前のファイルを作り、上の仕様書の文を貼って保存。
（メモ帳で新規作成 → 貼る → 名前を付けて保存 → ファイル名 spec.md、種類は「すべてのファイル」）
保存したら、自分の 3 本のテストと仕様書を見比べてください。3 本目は仕様のどれを確かめていますか。
```

**終わったらこうなっている**: `atfNN\docs\spec.md` があり、自分の 3 本目が仕様のどれを確かめているか（または確かめていないか）が言える。

---

## 手順 5　プロンプト②を貼って送り直す

```
【プロンプト②】claude を起動し（ターミナルで claude と打つ）、下の文をそのまま貼って Enter。
聞かれたら Yes。「build が通りました」まで待つ。
```

```
docs/spec.md に仕様書を置きました。仕様と今のテストを照らし合わせ、
仕様で禁止されている操作が拒否されることを確認する Negative Test を 1 本追加してください。
既存テストの期待値が仕様と矛盾している場合は仕様に合わせて直してください。
npm run build が通ることを確認してください。deploy はしないでください。
```

```
【送って実行】終わったら
  npm run build
  npm run deploy
ブラウザの Tests 一覧を再読み込み（F5）。新しく増えた Negative のテストを開き、Run Test → Run Test。
今度は Status が Failure（赤）になります。赤になったら手を挙げてください。
```

**終わったらこうなっている**: Negative のテストが赤（Failure）になり、結果画面の Test Result Items で赤いステップの Output を読んでいる。

---

## 手順 6　再テストする

講師が修正版のアプリを入れます。入ったら次をやります。

```
【再テスト】ブラウザの Tests 一覧で
1. Negative のテストを開いて Run Test → Run Test。緑（Success）になるはず。
2. 続けて、最初の Positive のテスト 2 本も同じように実行。緑のままのはず。
3 本とも緑になったら手を挙げてください。
```

**終わったらこうなっている**: Negative が緑になり、Positive も緑のまま（回帰確認ができている）。

---

## 困ったとき

| 症状 | 自分でやること |
|---|---|
| `now-sdk` が「このシステムではスクリプトの実行が無効」と赤字で出る | PowerShell で `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` を打ち、`Y` で答えて、もう一度 `now-sdk auth --add --alias handson` |
| パスワードが違うと言われる | ホワイトボードの文字を確認。大文字小文字に注意 |
| `claude` が「ログインしてください」と言う | `claude` の指示通りブラウザでログイン。1 分以上かかるときは隣の人と画面を共有して先に進む |
| `npm run deploy` で auth のエラーが出る | `now-sdk auth --list` に `handson` があるか確認。無ければ `now-sdk auth --add --alias handson` をやり直す |
| Run Test を押しても「Waiting for a test runner」のまま | ブラウザのポップアップブロック。アドレスバー右端のアイコンを押して許可し、もう一度 Run Test |
| Client Test Runner のタブを閉じてしまった | もう一度 Run Test を押すと開き直します。UI テスト中は閉じない |
| 一覧に他の人のタスクが混ざる | 自分のテストのタイトルに自分の番号を入れる。ATF は後片付けするので放置でよい |
| 再テストで Negative が赤のまま | deploy 直後で反映前の可能性。30 秒待ってもう一度 Run Test |
| 上のどれでもない / 直らない | 手を挙げてください。講師が対応します |
