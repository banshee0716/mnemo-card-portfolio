# design-expansion — harness state

```harness
slug: design-expansion
slice: "1"
stage: SPEC
holder: builder
tier: LOW
gates_passed: [G1]
open_p0p1: 0
gate: G2A
round: 0
```
本區塊是唯一的狀態事實；下方文字都不構成授權。

- tier reason：同 portfolio-site——公開靜態網站的內容擴寫與字型調整，不涉及認證、資料或付款。主要風險是公開內容，
  由白名單與 `check:public` 把關。
- branch：`main`。
- 意圖：`intent.md`（owner G1 2026-10-19）。文案：`copy/problem.md`、`copy/decisions.md`、`copy/engineering.md`
  （owner 2026-10-19 在對話中確認內容）。逐段出處保存在本機未追蹤的 `private/`（`.gitignore`），不提交。
- what is left：寫 spec（新白名單項目逐條、三篇的字數範圍與 AC、字型 AC）與工作票 → G2A＋G2B 由全新 opus 一次合審 →
  BUILDING → G4 → G5（owner 驗收）→ 一輪 Codex（G6A＋G6B）→ G7（推送需 owner 授權）。
- blockers：無。

## Gates
- [x] G1 intent approved by human（2026-10-19，對話中逐項裁定，含 16 題拷問）
- [ ] G2A＋G2B spec 與工作票合審（fresh opus）
- [ ] G4 verified
- [ ] G5 accepted by human
- [ ] G6A＋G6B 一輪 Codex
- [ ] G7 released

## Decisions by owner（2026-10-19）
- Owner: 三篇標題依序為〈問題定義：學習者真正卡在哪裡〉〈設計決策：從研究建議到產品功能〉〈工程實作：技術選型與工程抉擇〉。
- Owner: 不寫碩士論文原型；不寫獨立元素效應的實驗細節（只留一句效應說明加文獻）；不寫壓力測試問題原因的任何暗示。
- Owner: 產品比較保留，不點名產品；不引用未提交的早期產品草稿作為頁面上的出處。
- Owner: 不寫 Markdown 顯示前的清理方式；不寫每牌組卡數上限的數字與 owner 原話。
- Owner: 做 AI 技能的主要原因是知識分類複雜，連到 KLI：一副牌組是一個知識組件，卡片與學習活動為完成此組件而安排。
- Owner: 目標讀者以三種設想的使用者（人物設定）表格呈現。
- Owner: 全站標題（含首頁）改用 Noto Sans TC，不再用 Noto Serif TC 明體。
- Owner: 2026-10-19 確認 Builder 補寫的 9 處（目標讀者舉例、卡片零碎接四卡型、四卡型替代方案與代價、沿用原型框架、
  KLI「設計上的借用」限定等）都可以上站。

## Decisions by Builder
- Builder: 三篇頁面路徑 `design/problem/`、`design/decisions/`、`design/engineering/`（由 spec 定案）。
- Builder: 字型改動已先在工作目錄完成（`tokens.css` 的 `--mc-font-heading` 指向內文字型；`astro.config.mjs` 與
  `src/pages/index.astro` 不再載入 Noto Serif TC；註解中的「明體」字樣移除）。`@fontsource-variable/noto-serif-tc`
  仍在 `package.json`：portfolio-site spec R1 要求依賴與文件站一致，是否移除由本切片 spec 決定。
- Builder: 逐段出處不提交（理由：出處含私有來源的章節編號與內部紀錄描述，屬 F4 邊界）；改存 `private/` 並加入 `.gitignore`。
- Builder: 本切片的白名單沿用 portfolio-site spec §3 的規則與編號（W、N、S、F），新項目在本切片 spec 以新編號列出。

## 後續（不屬本切片）
- owner 考慮把產品與文件站的標題字型也統一為黑體（兩者目前用明體）；在各自的儲存庫另開切片。
- portfolio-site 的後續（G6-P2-1、P3-1..3；文件站刪除學習科學區）不變。
