# 06：九頁總驗收（G4 前）
contract-freezing: no
depends-on: [02, 04, 05]

## 要做什麼

spec AC1–AC17；把 G4 證據整理好交給全新工作階段的驗證者。

1. 確認 `PAGES` 恰為 spec §0 九頁；AC2–AC7 在九頁上都有執行（不是只跑部分頁面）。
2. 乾淨 clone 跑 AC1；跑 AC13 第 1、2 點與 AC16 的指令，把指令與輸出貼到 `docs/harness/portfolio-site/evidence/g4.md`
   （附完整測試檔名清單與測試數）。
3. `README.md`、`AGENTS.md`「指令」段與實際一致。

## 測試接縫

S1、S2、S3（兩份報告已關閉）。

## 驗收條件

- [ ] `rm -rf node_modules dist && npm ci && npm run build && npm test` 全綠，貼出測試數與測試檔名
- [ ] `find dist -name index.html -not -path '*/404/*' | wc -l` 輸出 `9`
- [ ] `npm run check:public` exit 0
- [ ] 全新工作階段的驗證者逐條對照 AC1–AC17 判定 PASS（AC18 後半在 G7）
