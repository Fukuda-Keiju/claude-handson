// テーマB ハンズオン（2026-09-18 14:20 / 社員向け 60 分）スライド生成スクリプト
//
// 根拠: C:\Users\福田圭樹\Projects\docs\theme-b-facilitator-guide.md
//   - 1 章（役割・技術面の決定事項）
//   - 3 章「10〜22 分」「35〜43 分」「50〜57 分」
// スピーカーノートはガイドの 🗣（読み上げてよいセリフ）をそのまま引用している。
//
// 実行: node build-slides.mjs
// 出力: ./theme-b-slides.pptx（5 枚 / 16:9）

import PptxGenJS from 'pptxgenjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'theme-b-slides.pptx');

// ---- デザイントークン ----------------------------------------------------
const NAVY = '032D42'; // ベースの紺
const NAVY_2 = '0A4460'; // 紺の面（ボックス）
const ACCENT = 'F5A623'; // 強調 1 色（アンバー）
const ACCENT_DK = 'B57711'; // アンバーの濃い版（白地の文字用）
const ACCENT_BG = 'FDF1DC'; // アンバーの薄い面
const WHITE = 'FFFFFF';
const TINT = 'EDF2F5'; // 白地スライドの薄い面
const GREY = '4A6575'; // 白地の補足文字

const FONT = 'Meiryo';
const W = 10; // 16:9 = 10in x 5.625in
const M = 0.6; // 左右マージン

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Keiju Fukuda';
pres.company = 'AORA NOW';
pres.title = 'テーマB ハンズオン';

/** 白地スライドの見出しバー */
function titleBar(slide, text) {
  slide.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: NAVY } });
  slide.addShape('rect', { x: 0, y: 1.0, w: W, h: 0.06, fill: { color: ACCENT } });
  slide.addText(text, {
    x: M, y: 0.1, w: W - M * 2, h: 0.8,
    fontFace: FONT, fontSize: 28, bold: true, color: WHITE, valign: 'middle',
  });
}

// =========================================================================
// 1. ゴールと今日の流れ / 役割
// =========================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText('テーマB ハンズオン｜60 分', {
    x: M, y: 0.38, w: W - M * 2, h: 0.35,
    fontFace: FONT, fontSize: 18, bold: true, color: ACCENT,
  });

  s.addText('AI が書いたテストは、\n品質を守ってくれるか', {
    x: M, y: 0.78, w: W - M * 2, h: 1.5,
    fontFace: FONT, fontSize: 34, bold: true, color: WHITE, lineSpacingMultiple: 1.15,
  });

  s.addShape('rect', { x: M, y: 2.28, w: 1.1, h: 0.06, fill: { color: ACCENT } });

  const flow = [
    ['前半', 'テストは全部「緑」になります'],
    ['30 分', '設計者の出番。仕様書を渡します'],
    ['後半', '赤を出して、直して、再テスト'],
  ];
  const runs = [];
  flow.forEach(([label, body], i) => {
    runs.push({ text: label + '　', options: { color: ACCENT, bold: true } });
    runs.push({ text: body, options: { color: WHITE, breakLine: i < flow.length - 1 } });
  });
  s.addText(runs, {
    x: M, y: 2.5, w: W - M * 2, h: 1.3,
    fontFace: FONT, fontSize: 22, lineSpacingMultiple: 1.35,
  });

  const roles = [
    ['会場', 'テスター役', '（仕様書なし）'],
    ['Zoom', '設計者・', 'レビュアー役'],
    ['Zoom 担当', 'チャットと', '投票の進行'],
  ];
  roles.forEach(([tag, l1, l2], i) => {
    const x = M + i * 3.1;
    s.addShape('roundRect', {
      x, y: 3.86, w: 2.6, h: 1.32, rectRadius: 0.08,
      fill: { color: NAVY_2 }, line: { color: ACCENT, width: 1 },
    });
    s.addText(tag, {
      x, y: 3.94, w: 2.6, h: 0.36,
      fontFace: FONT, fontSize: 20, bold: true, color: ACCENT, align: 'center',
    });
    s.addText(l1 + '\n' + l2, {
      x, y: 4.32, w: 2.6, h: 0.78,
      fontFace: FONT, fontSize: 20, bold: true, color: WHITE, align: 'center',
    });
  });

  s.addNotes(
    '【0〜5 分｜導入と接続確認】\n' +
    '「今日は 60 分で、AI に書かせたテストが本当に品質を守ってくれるのかを確かめます。' +
    '会場の皆さんはテスター役です。アプリの画面を見て、AI にテストを書かせます。' +
    'Zoom の皆さんは設計者役です。皆さんだけが仕様書を持っています。' +
    'テスターの作るテストに見落としがないか、設計者の目で見ていてください。' +
    '前半、テストは全部緑、成功になります。それが本当に安心なのか、30 分で設計者の皆さんに聞きます。」\n\n' +
    '（このあと）ホワイトボードに共通パスワードを書く。Zoom 担当に「共有、見えていますか」と聞く。'
  );
}

// =========================================================================
// 2. ATF のテストとは
// =========================================================================
{
  const s = pres.addSlide();
  titleBar(s, 'ATF のテストとは');

  s.addText(
    [
      { text: '1 つのテスト ＝ ', options: { color: NAVY } },
      { text: 'ステップの並び', options: { color: ACCENT_DK } },
    ],
    { x: M, y: 1.25, w: W - M * 2, h: 0.5, fontFace: FONT, fontSize: 26, bold: true }
  );

  // ステップ列の図（四角を横に並べる）
  const steps = ['レコードを作る', '値を確かめる', 'New を押す', 'Title に入力'];
  const bw = 2.2, gap = 0.22, bx0 = 0.27, by = 1.88, bh = 0.85;
  steps.forEach((label, i) => {
    const x = bx0 + i * (bw + gap);
    s.addShape('roundRect', {
      x, y: by, w: bw, h: bh, rectRadius: 0.1,
      fill: { color: i < 2 ? TINT : ACCENT_BG },
      line: { color: i < 2 ? NAVY : ACCENT, width: 1.5 },
    });
    s.addText(label, {
      x, y: by, w: bw, h: bh,
      fontFace: FONT, fontSize: 20, bold: true, color: NAVY, align: 'center', valign: 'middle',
    });
    if (i < steps.length - 1) {
      s.addText('▶', {
        x: x + bw, y: by, w: gap, h: bh,
        fontFace: FONT, fontSize: 16, color: ACCENT, align: 'center', valign: 'middle',
      });
    }
  });

  s.addText('サーバー系', {
    x: bx0, y: 2.78, w: bw * 2 + gap, h: 0.36,
    fontFace: FONT, fontSize: 20, bold: true, color: NAVY, align: 'center',
  });
  s.addText('UI 系', {
    x: bx0 + 2 * (bw + gap), y: 2.78, w: bw * 2 + gap, h: 0.36,
    fontFace: FONT, fontSize: 20, bold: true, color: ACCENT_DK, align: 'center',
  });

  s.addShape('roundRect', {
    x: M, y: 3.35, w: W - M * 2, h: 1.55, rectRadius: 0.08,
    fill: { color: TINT }, line: { color: NAVY, width: 1 },
  });
  s.addText(
    [
      { text: '.now.ts', options: { color: ACCENT_DK, bold: true } },
      { text: ' 1 ファイル ＝ 画面のテスト 1 つ', options: { color: NAVY, breakLine: true } },
      { text: 'deploy すると ServiceNow の画面にテストが現れる', options: { color: NAVY } },
    ],
    {
      x: M + 0.3, y: 3.45, w: W - M * 2 - 0.6, h: 1.35,
      fontFace: FONT, fontSize: 22, bold: true, valign: 'middle', lineSpacingMultiple: 1.4,
    }
  );

  s.addNotes(
    '【10〜22 分｜Claude Code がファイルを作り始めたとき】\n' +
    '「ファイルができ始めました。ATF のテストは『ステップ』の並びです。' +
    'レコードを 1 件作る、値が open か確かめる、画面で New を押す、タイトルを入力する。それぞれが 1 ステップです。' +
    '今できている `.now.ts` というファイル 1 つが、ServiceNow 画面のテスト 1 つになります。」\n\n' +
    '（UI テストのファイルができたとき）\n' +
    '「これは画面を操作するテストです。『New というボタンを探して押す』『Title という入力欄に文字を入れる』と書いてあります。' +
    '人間が手でやることを、そのまま文にした形です。」'
  );
}

// =========================================================================
// 3. Positive と Negative
// =========================================================================
{
  const s = pres.addSlide();
  titleBar(s, 'Positive と Negative');

  const cols = [
    {
      x: M, head: 'Positive', headFill: NAVY, headColor: WHITE, lineColor: NAVY,
      l1: '正しく使えば、正しく動く',
      l2: 'タイトルを入れて保存\n→ 保存される',
    },
    {
      x: 5.1, head: 'Negative', headFill: ACCENT, headColor: NAVY, lineColor: ACCENT,
      l1: '間違った使い方は、拒否される',
      l2: 'タイトル空欄で保存\n→ エラー',
    },
  ];
  const cw = 4.3;
  cols.forEach((c) => {
    s.addShape('roundRect', {
      x: c.x, y: 1.3, w: cw, h: 2.6, rectRadius: 0.08,
      fill: { color: TINT }, line: { color: c.lineColor, width: 1.5 },
    });
    s.addShape('rect', { x: c.x, y: 1.3, w: cw, h: 0.68, fill: { color: c.headFill } });
    s.addText(c.head, {
      x: c.x, y: 1.3, w: cw, h: 0.68,
      fontFace: FONT, fontSize: 24, bold: true, color: c.headColor, align: 'center', valign: 'middle',
    });
    s.addText(c.l1, {
      x: c.x + 0.15, y: 2.08, w: cw - 0.3, h: 0.5,
      fontFace: FONT, fontSize: 21, bold: true, color: NAVY, align: 'center',
    });
    s.addText(c.l2, {
      x: c.x + 0.15, y: 2.7, w: cw - 0.3, h: 1.05,
      fontFace: FONT, fontSize: 21, color: GREY, align: 'center', lineSpacingMultiple: 1.2,
    });
  });

  s.addShape('roundRect', {
    x: M, y: 4.15, w: W - M * 2, h: 1.0, rectRadius: 0.08, fill: { color: NAVY },
  });
  s.addText(
    [
      { text: 'AI は ', options: { color: WHITE } },
      { text: 'Positive が得意', options: { color: ACCENT, bold: true } },
      { text: '。Negative は「何が間違いか」を知らないと書けない', options: { color: WHITE } },
    ],
    {
      x: M + 0.25, y: 4.15, w: W - M * 2 - 0.5, h: 1.0,
      fontFace: FONT, fontSize: 21, bold: true, align: 'center', valign: 'middle',
    }
  );

  s.addNotes(
    '【10〜22 分｜npm run build が走っているとき】\n' +
    '「テストには 2 種類あります。正しく使ったら正しく動く、を確かめるのが Positive。' +
    'タイトルを入れて保存したら保存される。間違った使い方が拒否される、を確かめるのが Negative。' +
    'タイトル空欄で保存したらエラーになる。AI は Positive を得意とします。' +
    '今の動きを見て、その通りに動くことを確かめるテストは上手です。' +
    'Negative は、何が間違いなのかを知らないと書けません。この違いを後半で見ます。」'
  );
}

// =========================================================================
// 4. 赤が出たときの 4 分類
// =========================================================================
{
  const s = pres.addSlide();
  titleBar(s, '赤が出たときの 4 分類');

  const items = [
    ['①', 'アプリの欠陥', '本来これが見つけたいもの'],
    ['②', 'テストの間違い', 'ボタン名違い、期待値が逆'],
    ['③', '環境', 'Runner タブを閉じた、ログイン切れ'],
    ['④', 'データ', '他人のレコードと混ざった'],
  ];
  const bw = 4.3, bh = 1.32;
  items.forEach(([no, head, detail], i) => {
    const x = M + (i % 2) * (bw + 0.5);
    const y = 1.25 + Math.floor(i / 2) * (bh + 0.16);
    s.addShape('roundRect', {
      x, y, w: bw, h: bh, rectRadius: 0.08,
      fill: { color: i === 0 ? ACCENT_BG : TINT },
      line: { color: i === 0 ? ACCENT : NAVY, width: i === 0 ? 2 : 1 },
    });
    s.addText(no, {
      x: x + 0.15, y: y + 0.12, w: 0.6, h: 0.5,
      fontFace: FONT, fontSize: 24, bold: true, color: ACCENT_DK, align: 'center', valign: 'middle',
    });
    s.addText(head, {
      x: x + 0.75, y: y + 0.12, w: bw - 0.9, h: 0.5,
      fontFace: FONT, fontSize: 23, bold: true, color: NAVY, valign: 'middle',
    });
    s.addText(detail, {
      x: x + 0.2, y: y + 0.64, w: bw - 0.4, h: 0.62,
      fontFace: FONT, fontSize: 20, color: GREY,
    });
  });

  s.addShape('roundRect', {
    x: M, y: 4.32, w: W - M * 2, h: 0.82, rectRadius: 0.08, fill: { color: NAVY },
  });
  s.addText('赤を見たら、まずこの 4 つのどれか考える', {
    x: M, y: 4.32, w: W - M * 2, h: 0.82,
    fontFace: FONT, fontSize: 24, bold: true, color: WHITE, align: 'center', valign: 'middle',
  });

  s.addNotes(
    '【35〜43 分｜赤が出たら】\n' +
    '「赤が出ました。ここで 4 分類です。テストが赤になる原因は 4 つのどれかです。' +
    '1 つ目、アプリの欠陥。これが本来見つけたいもの。' +
    '2 つ目、テストの間違い。ボタンの名前が違う、期待値が逆。' +
    '3 つ目、環境。テスト用のタブを閉じた、ログインが切れた。' +
    '4 つ目、データ。他の人のレコードと混ざった。」\n\n' +
    '（投票 2 — Zoom 担当に合図）\n' +
    '「投票です。この赤の原因は 4 つのどれだと思いますか。会場はチャットに番号を、Zoom は投票に。」30 秒。'
  );
}

// =========================================================================
// 5. 持ち帰る 3 つ
// =========================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText('まとめ', {
    x: M, y: 0.45, w: W - M * 2, h: 0.35,
    fontFace: FONT, fontSize: 18, bold: true, color: ACCENT,
  });
  s.addText('持ち帰る 3 つ', {
    x: M, y: 0.8, w: W - M * 2, h: 0.75,
    fontFace: FONT, fontSize: 34, bold: true, color: WHITE,
  });
  s.addShape('rect', { x: M, y: 1.62, w: 1.1, h: 0.06, fill: { color: ACCENT } });

  const takeaways = ['仕様を先に渡す', 'Negative を必ず頼む', '赤が出たら 4 分類で考える'];
  takeaways.forEach((t, i) => {
    const y = 1.98 + i * 0.83;
    s.addShape('ellipse', { x: M + 0.05, y, w: 0.6, h: 0.6, fill: { color: ACCENT } });
    s.addText(String(i + 1), {
      x: M + 0.05, y, w: 0.6, h: 0.6,
      fontFace: FONT, fontSize: 24, bold: true, color: NAVY, align: 'center', valign: 'middle',
    });
    s.addText(t, {
      x: M + 0.85, y, w: W - M * 2 - 0.85, h: 0.6,
      fontFace: FONT, fontSize: 26, bold: true, color: WHITE, valign: 'middle',
    });
  });

  s.addText('何が正しいかを決めるのは仕様。AI はそれを知らない。', {
    x: M, y: 4.65, w: W - M * 2, h: 0.5,
    fontFace: FONT, fontSize: 20, color: ACCENT,
  });

  s.addNotes(
    '【50〜57 分｜締めのセリフ（そのまま読む）】\n' +
    '「まとめます。AI はテストを速く書けます。今日 3 本を 8 分で書きました。' +
    'でも、何が正しいかを決めるのは仕様です。AI はそれを知りません。' +
    '今日、設計者役の皆さんは最初から答えが見えていて、テスター役の皆さんには 30 分見えませんでした。' +
    'その差を作ったのは紙 1 枚です。持ち帰ってほしいのは 3 つ。1 つ、仕様を先に渡す。2 つ、Negative を必ず頼む。' +
    '3 つ、赤が出たら 4 分類で考える。この 3 つで、AI に書かせたテストが品質を守るものになります。」'
  );
}

await pres.writeFile({ fileName: OUT });
console.log(`generated: ${OUT}`);
console.log(`slides: ${pres.slides.length}`);
