# テーマB パイロット チェックリスト（木 9/17 13:00、案C）

目的は 2 つ。**(1) 講師以外の PDI でキットが最初から最後まで通ることを確かめる**（会社コードが違う PDI での検証はここが初めて）。**(2) 60 分の台本を時間どおりに回せるかを計る。**

---

## A. 前日（水）までに済ませること

| # | 項目 | 担当 | 状態 |
|---|---|---|---|
| A1 | リポジトリを public にする | 講師 | 済（2026-09-16） |
| A2 | Release `theme-b-kit-v2` に `themeB-kit.zip` を置く | 講師 | 済（新デモタイトル版に差し替え済み） |
| A3 | パイロット参加者を 1 名決め、**自分の PDI を持っている人**にする（和田さん or 金山さん） | 講師 | 未 |
| A4 | 参加者に事前課題メール（案C ガイド 付録 B）を送る。zip は Release の URL を貼る | 講師 | 未 |
| A5 | Zoom 側の設計者役を 1 名決め、`spec.md` を渡す | 講師 | 未 |
| A6 | 講師 PDI を本番状態にする: `x_2221398_todo` が欠陥版、`x_2221398_atf09` に T1〜T5、検証用アプリ（todo2 / atf2 / hands2 / atf00）を Delete | 講師 | 一部済（メニュー非表示・atf2 のテスト削除は済。アプリ本体の Delete は未） |
| A7 | 講師の手元に「キット展開済みフォルダ」と `atf10`（ライブ用の空プロジェクト）を用意 | 講師 | 未 |

## B. 参加者に前日までに返してもらうもの

- `preflight.ps1` が全部 [OK] の画面
- 自分の PDI の Handson Todo board でタスクを 1 つ作った画面
- 会社コード（`setup.ps1` の 1 行目に出る `会社コード = NNNNNNN`）。**講師の 2221398 と違うことを確認する**

## C. パイロット当日に確認・記録すること

**環境（初めて確かめる項目。最重要）**

- [ ] `setup.ps1` の所要時間（工程別の表をスクリーンショット）
- [ ] 接頭辞が `x_<参加者の code>_todo` になっている（`todo-app/now.config.json`）
- [ ] `sn_atf.runner.enabled` / `sn_atf.schedule.enabled` が **false → true** に変わった（`set-atf-props.mjs` の false 側の経路はここが初回）
- [ ] UI テスト T2 / T5 が参加者の PDI で動く（Client Test Runner のタブが開き、画面が自動で動く）
- [ ] 欠陥版で T4 / T5 が赤、`fix.ps1` → build → deploy の後で 5 本すべて緑
- [ ] PDI のリリース版（`System Diagnostics → Stats` の Build name）を記録。講師 PDI と違えば画面テストの差異を確認

**台本（時間）**

- [ ] 0〜10 分の準備コーナーが何分で終わったか
- [ ] プロンプト①の生成時間（Claude Code が build 成功を報告するまで）
- [ ] 22〜30 分の build → deploy → Run Test 3 本
- [ ] 43〜50 分の fix → build → deploy → 再テスト
- [ ] 合計。60 分を超えた場合、案C ガイド 4 章「捨て順」のどこを切るか決める

**参加者の様子**

- [ ] どこで手が止まったか（コマンド、画面、用語）
- [ ] チャットに貼った文のうち、そのままコピーできなかったもの
- [ ] 4 分類（欠陥・テスト・環境・データ）で環境起因の赤があったか

## D. パイロット後（木の午後）

1. `theme-b/handout/backlog.md` に詰まった箇所を記録
2. キットを直したら `theme-b\tools\build-kit.ps1` で zip を作り直し、Release を差し替える
   ```
   gh release upload theme-b-kit-v2 theme-b\dist\kit\themeB-kit.zip --clobber
   ```
3. 本番参加者への事前課題メールを送る（パイロットの所要時間を「目安」として書き足す）
4. 金 11:00 の凍結前に、講師 PDI で `git checkout theme-b-buggy` → `theme-b\todo-app` で build → deploy し、欠陥版が入っていることを確認
