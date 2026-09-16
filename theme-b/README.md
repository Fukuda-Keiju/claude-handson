# theme-b — テーマB「AI駆動で確かめる」ハンズオン一式（2026-09-18 14:20）

講師ガイド（進行台本・決定事項・困ったとき）は `../docs/theme-b-facilitator-guide.md`。ここはその成果物置き場。

| フォルダ / ファイル | 中身 | 状態 |
|---|---|---|
| `todo-app/` | 対象アプリ「Handson Todo」（Fluent、scope `x_2221398_todo`、React UI Page）。`main` = 正しい版、`theme-b-buggy` ブランチ = 欠陥版 | 作成済み。PDI には **欠陥版**が入っている（2026-09-16） |
| `atf09/` | 講師用 ATF プロジェクト（scope `x_2221398_atf09`）。T1〜T3 Checkpoint、T4〜T5 Negative、スイート 2 つ。`CLAUDE.md` は参加者 zip の元 | 作成済み。正しい版 5/5、欠陥版 3/5 を確認 |
| `CONTRACT.md` | アプリ・画面・テストの契約書（要素名、テスト一覧）。**ここを変えるとテストが壊れる** | 固定 |
| `dist/zips/atf01..08,10,11.zip` | 参加者配布 zip（空 Fluent プロジェクト + CLAUDE.md + preflight.ps1） | 作成済み（`dist/` は git 管理外） |
| `starter/preflight.ps1` | 参加者の事前チェック 9 項目 | 作成済み |
| `handout/participant-guide.md` | 参加者向け手順書 | 作成済み |
| `handout/spec.md` | 仕様書（30 分時点で配る。視聴者には事前メール添付） | 作成済み |
| `handout/viewer-email.md`, `zoom-staff-memo.md` | 視聴者への事前メール、Zoom 担当メモ + 投票 3 本 | 作成済み。**送付・依頼は未** |
| `handout/faq.md`, `troubleshooting.md`, `backlog.md`, `survey.md` | FAQ、トラブル対応表、改善 Backlog、アンケート質問 | 作成済み。**アンケートのフォーム化は未** |
| `handout/checkpoint/`, `handout/solution/` | 詰まった人に渡すテストファイル | 作成済み |
| `slides/theme-b-slides.pptx` | スライド 5 枚、スピーカーノート付き（`npm run build` で再生成） | 作成済み。**PowerPoint で表示確認は未** |
| `evidence/*.png` | スイート結果（5/5, 3/5）、テスト一覧、画面のスクリーンショット | 作成済み |
| `tools/create-users.mjs` | 参加者ユーザー `handson01`〜`08`・`11`〜`14`（admin）を作る。`node create-users.mjs <password>` | **未実行**（講師が自分のターミナルで実行する） |
| `kit/` + `tools/build-kit.ps1` | **案C**（参加者ごとの PDI）用の参加者キット。`tools` で `.\build-kit.ps1` → `dist/kit/themeB-kit.zip`。台本は `../docs/theme-b-facilitator-guide-planC.md` | 作成済み。講師 PDI で別スコープ名（`x_2221398_todo2` / `atf2`）の擬似検証済み（サーバー側テスト 欠陥版 2/3 → fix 後 3/3）。**別 PDI での通しは未** |

## 当日までの残作業（講師）

1. 木 9/17 午前: `tools/create-users.mjs` を実行してユーザー作成。パスワードはホワイトボード用に控える。
2. 木 9/17 午前: `viewer-email.md` を Zoom 視聴者へ送る（`spec.md` を添付）。Zoom 担当に `zoom-staff-memo.md` を渡し、Zoom 投票 3 本を作る。
3. `slides/theme-b-slides.pptx` を PowerPoint で開いて折り返しを確認。
4. `survey.md` を Google Form などに転記して URL を作る。
5. 一人でフル通し（zip 展開 → preflight → auth → claude → build → deploy → Run Test）。時間を計る。
6. 木 9/17 13:00 パイロット（1 名は Zoom 側）。`backlog.md` に記録。
7. 金 9/18 11:00: `git checkout theme-b-buggy` → `todo-app` で `npm run build && npm run deploy`（欠陥版を入れ直す）。以降触らない。
8. GitHub への push（未。`git push origin main theme-b-fix theme-b-buggy`）。
