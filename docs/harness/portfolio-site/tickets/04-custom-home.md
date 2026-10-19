# 04：自訂首頁上站
contract-freezing: no
depends-on: [01, 03]

## 要做什麼

spec R3、R4、R5、R9，AC7 第 1 點、AC8–AC11、AC19、AC20。

1. `src/pages/index.astro` 與 `src/styles/home.css`：依 03 定稿文案逐字上站（編號註解不輸出到頁面）；頁尾署名依 R5 第 4 點。只用 `tokens.css` 變數；不載入站外資源。
2. `tests/home.spec.ts`：AC7 第 1 點、AC8（計算值比對）、AC9、AC10（h2 清單寫死 03 定稿）、AC11（Playwright 部分）、AC19（字數）、AC20 的首頁部分（頁尾 GitHub 連結、無佔位；九頁 `mailto:` 檢查屬 05）。

## 測試接縫

S1、S2、S3（上站後頁面文字與文案逐字比對，由 03 的核對者或另一位全新 opus 做）。

## 驗收條件

- [ ] `npm test` 全綠（首頁 AC2–AC11 相關項）
- [ ] AC8 的 `grep` 沒有輸出；`grep -c 'data-pagefind-body' dist/index.html` 輸出 `0`
- [ ] 上站文字與 `copy/home.md` 逐字相同（S3 核對者確認）
- [ ] `npm run check:public` 乾淨
- [ ] 變異：把 `home.css` 的一個變數改成色碼字面值，AC8 grep 有輸出；刪掉分支區第二個入口，AC10 變紅；在 `main` 加一段 200 字，AC19 變紅
