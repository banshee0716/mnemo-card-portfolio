# 04：導覽首頁與專案設計頁上站
contract-freezing: no
depends-on: [01, 02, 03]

## 要做什麼

spec R3、R4、R5、R5a、R6（「專案設計」群組）、R9，AC7 第 1 點、AC8–AC11、AC12（專案設計頁詞）、AC14（「專案設計」群組）、AC19、AC20 的首頁部分。
本票建**專案設計頁**（`design/`）與導覽首頁。

1. `src/pages/index.astro` 與 `src/styles/home.css`：依 03 定稿 `copy/home.md` 逐字上站（編號註解不輸出到頁面）；四個入口每個是含一個連結的 `h2`；
   頁尾署名依 R5 第 3 點。只用 `tokens.css` 變數；不載入站外資源；不連產品正式站。
2. `src/content/docs/design.mdx`：依 03 定稿 `copy/design.md` 逐字上站，`title: 專案設計`、`prev: false`、`next: false`；
   「繼續讀」兩個連結用從 `design/` 出發正確的站內路徑。`astro.config.mjs` 側欄最前面加「專案設計」群組（R6）。
3. `PAGES` 加 `design/`。測試：`tests/home.spec.ts` 寫 AC7 第 1 點、AC8（計算值比對）、AC9、AC10 第 1 點、AC11（Playwright 部分）、AC19 第 2 點、
   AC20 的首頁部分（頁尾 GitHub 連結、無佔位）；`tests/design.spec.ts` 寫 AC10 第 2 點、AC19 第 1 點；`tests/search.spec.ts` 補 AC12 的專案設計頁詞；
   AC14 補「專案設計」群組。十頁的 `mailto:` 檢查屬 05。

## 測試接縫

S1、S2、S3（上站後頁面文字與文案逐字比對，由 03 的核對者或另一位全新 opus 做）。

## 驗收條件

- [ ] `npm test` 全綠（首頁與專案設計頁的 AC2–AC11、AC12 專案設計頁詞、AC14、AC19、AC20 首頁部分）
- [ ] AC8 的 `grep` 沒有輸出；`grep -c 'data-pagefind-body' dist/index.html` 輸出 `0`
- [ ] 上站文字與 `copy/home.md`、`copy/design.md` 逐字相同（S3 核對者確認）
- [ ] `npm run check:public` 乾淨
- [ ] 變異：把 `home.css` 的一個變數改成色碼字面值，AC8 grep 有輸出；刪掉首頁第四個入口，AC10 變紅；在首頁 `main` 加一段 100 字，AC19 第 2 點變紅；
      在專案設計頁加一段 100 字，AC19 第 1 點變紅
