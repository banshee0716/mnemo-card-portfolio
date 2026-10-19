# 05：產品怎麼用摘要頁上站
contract-freezing: no
depends-on: [01, 03]

## 要做什麼

spec R6（「產品」群組）、R8，AC12 產品摘要頁詞、AC14（「產品」群組）、AC15、AC20 的十頁 `mailto:` 檢查。

1. 從文件站 `src/assets/screenshots/` 複製 spec §3.2 S1–S4 四張截圖到 `src/assets/screenshots/`。
2. `src/content/docs/product.mdx`：依 03 定稿文案逐字上站，`<Image>` 輸出 webp、`figcaption` 以「圖：」開頭，`prev: false`、`next: false`。
3. 側欄最後加「產品」群組；`PAGES` 加本頁；`tests/product.spec.ts` 寫 AC15；`tests/search.spec.ts` 補 AC12 產品摘要頁詞；AC14 補「產品」群組；
   `tests/site.spec.ts` 的 `PAGES` 迴圈加 AC20「沒有 `mailto:` 連結」（04 若尚未完成，`design/` 由 04 加入 `PAGES` 後自動涵蓋）。

## 測試接縫

S1、S2、S3（上站文字逐字比對）。

## 驗收條件

- [ ] `npm test` 全綠（`PAGES` 全部頁面的 AC2–AC6、AC12、AC14、AC15、AC20 `mailto:`）
- [ ] 上站文字與 `copy/product.md` 逐字相同（S3 核對者確認）
- [ ] `npm run check:public` 乾淨
- [ ] 變異：刪掉一張圖的 `alt`，AC15 變紅；把一個文件站連結改成相對路徑，AC15 變紅
