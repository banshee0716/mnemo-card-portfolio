# portfolio-site — harness state

```harness
slug: portfolio-site
slice: "1"
stage: BUILDING
holder: builder
tier: LOW
gates_passed: [G1, G2A, G2B]
open_p0p1: 0
gate: G6A
round: 1
```
本區塊是唯一的狀態事實；下方文字都不構成授權。

- tier reason：公開靜態網站，獨立儲存庫；不涉及認證、資料庫、資料刪除、匯入、付款或同步。主要風險是公開內容，
  由 spec 的公開白名單（§3）與 `check:public` 把關。
- branch：`main`（尚未建立 GitHub 遠端；推送與遠端建立由 owner 執行）
- 意圖：`intent.md`（owner G1 2026-10-19）。規格：`spec.md`。工作票：`tickets/01`–`06`。
- what is left：G2 已過（修正已套用，依 owner 輕量流程不複審）→ BUILDING：工作票 01 起；03 可與 01、02 平行。LOW 無 G3；下一個審查閘門 G6A（與 G6B 合一輪 Codex），之前先過 G4、G5。
- blockers：作者姓名（W12）待 owner 提供；不擋 G2，工作票 03 定稿前要有。

## Gates
- [x] G1 intent approved by human（2026-10-19，對話中逐項裁定）
- [x] G2A＋G2B spec 與工作票合審（fresh opus，2026-10-19，一輪合審，APPROVE AFTER FIXES；修正已套用，不複審）
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
- Builder: 首頁閱讀長度預算＝`main` 去掉空白後 250–450 字，`h1` 計入、頁尾不計入（spec R5 第 5 點；上限依 owner 2026-10-19 裁定放寬到約 1.5 分鐘；下限讓五個區段各有約 50 字）。
- Builder: 首頁分支只留學習科學導讀與產品摘要兩個入口（owner 只列這兩個）；文件站由產品摘要頁連過去。
- Builder: 工作票 01 的 `PAGES` 項目多一個 `kind: 'home' | 'starlight'` 欄位（理由：首頁沒有搜尋框，AC6 的「搜尋」檢查只適用 Starlight 頁；後續票沿用）。
- Builder: `tokens.css` 除 spec R3 列的主色外，另定義首頁用的 `--mc-bg`、`--mc-text`、`--mc-text-muted`、`--mc-border`、`--mc-link`、`--mc-on-accent`（理由：首頁不得出現色碼字面值，AC8）。
- Builder: 學習科學網址沿用文件站的 `learning-science/<slug>/`，文內頁間相對連結不必改；摘要頁 slug `product/`。

## G2A＋G2B 合審紀錄（2026-10-19）
- 審查者：全新工作階段的 opus；spec 與工作票一輪合審（owner LOW 輕量流程，修完不複審）。
- 結論：APPROVE AFTER FIXES。P1 一項、P2 三項、P3 六項，全部已處理（下表）；open P0/P1 = 0。

| # | 等級 | 發現 | 處置 |
| --- | --- | --- | --- |
| 1 | P1 | spec §3.3 N2「服務就中斷」與出處不符 | 改為 owner 核可的事實改寫：改版前約 150 名時作答送出回應時間持續惡化到數秒以上；改版後 300 名仍約 350 毫秒；範圍同 N1，限學習作答的送出請求（owner 2026-10-19） |
| 2 | P2 | 閱讀長度上限 350 字裝不下五個區段 | owner 裁定放寬上限到約 450 字（約 1.5 分鐘），不刪內容；AC19 改為 250–450，明寫 `h1` 計入、頁尾不計入 |
| 3 | P2 | W1 的 DOI 連結會打亂 AC7 首頁 Tab 順序 | Builder：首頁 W1 只寫作者與年份、不附連結；DOI 只在學習科學頁 |
| 4 | P2 | h1 定位句、雙鑽石引導句、分支引導句沒有白名單項目 | 新增 W16（owner 核可）；owner 裁定頁面不放事後整理的免責句；W15（無出處的研究活動不寫）保留 |
| 5 | P3 | 閱讀速度出處可能不是 Brysbaert 2019 | S3 核對者加查：默讀或朗讀、單位（漢字或全部字元）、可能出處 IReST（Trauzettel-Klosinski & Dietz, 2012） |
| 6 | P3 | R5 表「W3（只用其目的句）」語意不清 | 改為「只用第 3、4 步的意思」 |
| 7 | P3 | R2、R3 第 1 點、R11 第 2、4 點沒有可執行的 AC | AC8 加 `--mc-*` 只在 `tokens.css` 定義的 grep；AC16 加 `HARNESS_OK` 與 `.gitignore` 檢查；AC18 加 `lastUpdated`／`editLink`／`components` 設定核對 |
| 8 | P3 | AC20 九頁無 `mailto:` 沒有歸屬 | 放進 `tests/site.spec.ts` 的 `PAGES` 迴圈，歸工作票 05；首頁頁尾部分歸 04 |
| 9 | P3 | 工作票 01 變異測試留下暫存分支 | 測試後刪除暫存分支，並確認 `git branch -a` 不再列出 |
| 10 | P3 | 工作票 01 沒有 Starlight 頁時 Pagefind 可能不建索引 | 01 允許一頁暫置 Starlight 頁（學習科學導讀），02 以正式檔取代 |
