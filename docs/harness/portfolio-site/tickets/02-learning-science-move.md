# 02：搬入學習科學七頁、側欄與搜尋
contract-freezing: no
depends-on: [01]

## 要做什麼

spec R6、R7、R9，AC7 第 2 點、AC12 前兩項、AC13、AC14（「產品」群組除外）。

1. 從文件站 commit `b2d1dc9` 取七個 `.mdx`（`git -C ~/code/mnemo-card-docs show b2d1dc9:src/content/docs/learning-science/<檔>`），
   放到 `src/content/docs/learning-science/`，只做 R7 允許的四處改動（三處連結、KLI `next: false`）。
2. `astro.config.mjs` 側欄「學習科學」群組（R6；「產品」群組在 05 加）。
3. `PAGES` 加七頁；`tests/learning-science.spec.ts` 依 AC13 第 3 點改寫文件站的學習科學斷言；`tests/search.spec.ts` 寫 AC12 前兩項；
   `tests/navigation.spec.ts` 寫 AC7 第 2 點與 AC14（「產品」群組的斷言在 05 補）。

## 測試接縫

S1、S2。

## 驗收條件

- [ ] AC13 第 1、2 點的 `diff` 與 `grep` 指令輸出符合預期（貼出輸出）
- [ ] `npm test` 全綠（八頁的 AC2–AC6、AC7 第 2 點、AC12 前兩項、AC13 第 3 點）
- [ ] `npm run check:public` 乾淨
- [ ] 變異：把一處絕對網址改回相對路徑時 AC13 測試變紅；調換側欄兩篇時側欄測試變紅
