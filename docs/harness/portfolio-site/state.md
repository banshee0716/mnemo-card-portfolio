# portfolio-site — harness state

```harness
slug: portfolio-site
slice: "1"
stage: INTENT_APPROVED
holder: none
tier: LOW
gates_passed: [G1]
open_p0p1: 0
gate: G2A
round: 1
```
本區塊是唯一的狀態事實；下方文字都不構成授權。

- tier reason：公開靜態網站，獨立儲存庫；不涉及認證、資料庫、資料刪除、匯入、付款或同步。主要風險是公開內容，
  由 spec 的公開白名單（§3）與 `check:public` 把關。
- branch：`main`（尚未建立 GitHub 遠端；推送與遠端建立由 owner 執行）
- 意圖：`intent.md`（owner G1 2026-10-19）。規格：`spec.md`。工作票：`tickets/01`–`06`。
- what is left：G2A＋G2B 一次合審（全新 opus，spec 與工作票同時審，修完不複審）→ owner 一鍵確認 → BUILDING。
- blockers：作者姓名（W12）待 owner 提供；不擋 G2，工作票 03 定稿前要有。

## Gates
- [x] G1 intent approved by human（2026-10-19，對話中逐項裁定）
- [ ] G2A＋G2B spec 與工作票合審（fresh opus）
- [ ] G4 verified
- [ ] G5 accepted by human
- [ ] G6A＋G6B 一輪 Codex
- [ ] G7 released（owner 建立遠端、推送 main、Pages 設定）

## Decisions by owner（2026-10-19，經 coordinator 轉達）
- Owner: D1 網站名稱「Mnemo-Card portfolio」。
- Owner: D2 不連產品正式站；`check:public` 允許清單維持空的。
- Owner: N1 措辭「學習作答的送出請求」；核可 N1、N2、截圖 S1–S4。
- Owner: 不核可 N3（測試數量）、W14（儲存庫連結）、W11（點名 AI 工具）；N4 試用規模不寫。
- Owner: W12 署名＝作者姓名＋GitHub 個人頁連結，不放電子郵件；姓名待提供。
- Owner: 首頁改為「1 分鐘了解專案特色」，以雙鑽石模型（探索 → 定義 → 發展 → 交付）呈現，最後分支到學習科學與產品摘要頁。

## Decisions by Builder
- Builder: `CLAUDE.md` 只含 `@AGENTS.md`（比照文件站），兩檔不會分歧。
- Builder: 主程式私有儲存庫的名稱與路徑不寫進本儲存庫；白名單的成果數字出處以「私有來源描述＋日期」標示，
  逐檔路徑對照由 Builder 在 G2 審查 packet 中提供給審查者，不提交（理由：`check:public` 允許清單從空開始）。
- Builder: 首頁不進 Pagefind 索引（理由見 spec R9）。
- Builder: 首頁閱讀長度預算＝`main` 去掉空白後 200–350 字（spec R5 第 5 點；以中文默讀約 255 字／分估算，上限容許略讀）。
- Builder: 首頁分支只留學習科學導讀與產品摘要兩個入口（owner 只列這兩個）；文件站由產品摘要頁連過去。
- Builder: 學習科學網址沿用文件站的 `learning-science/<slug>/`，文內頁間相對連結不必改；摘要頁 slug `product/`。
