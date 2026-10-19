# 02：三篇專案設計子頁上站
contract-freezing: no
depends-on: [01]

## 要做什麼

spec R1–R3、R5、R7，AC1′、AC10′、AC12′、AC14′、AC19′。

1. `src/content/docs/design/problem.mdx`、`decisions.mdx`、`engineering.mdx`：依 `copy/*.md`「頁面文案」逐字上站
   （前言 `title`、`description`；`engineering.mdx` 加 `next: false`）。
2. `design.mdx` 的「繼續讀」改為五個連結（R2）；新增三項的說明句由本票定稿，屬原 spec W16，寫回 `copy/` 下的新檔 `copy/design-overview.md`
   並交給工作票 03 核對。
3. `astro.config.mjs` 側欄「專案設計」群組加三項（R3）。
4. `tests/helpers.ts` 的 `PAGES` 加三頁（`kind: 'starlight'`）。
5. 測試：`tests/design.spec.ts` 改寫 AC10′、AC19′（總覽頁上限 500、三篇範圍、排除參考文獻區）；`tests/navigation.spec.ts` 改 AC14′；
   `tests/search.spec.ts` 加 AC12′ 三個詞。h2 清單依 `copy/*.md` 寫死。

## 測試接縫

S1、S2；S3（逐字與白名單由工作票 03 核對）。

## 驗收條件

- [ ] `npm test` 全綠（`PAGES` 十三頁的 AC2–AC6、AC20，以及 AC10′、AC12′、AC14′、AC19′）
- [ ] `find dist -name index.html -not -path '*/404/*' | wc -l` 輸出 `13`
- [ ] `npm run check:public` 乾淨
- [ ] 變異：刪掉問題定義頁表格的一列，AC10′ 變紅；把設計決策頁刪掉一節，AC10′ 或 AC19′ 變紅；把工程實作的 `next: false` 拿掉，AC10′ 第 3 點變紅
