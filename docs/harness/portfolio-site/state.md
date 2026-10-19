# portfolio-site — harness state

```harness
slug: portfolio-site
slice: "1"
stage: VERIFIED
holder: none
tier: LOW
gates_passed: [G1, G2A, G2B, G4]
open_p0p1: 0
gate: G6A
round: 1
```
本區塊是唯一的狀態事實；下方文字都不構成授權。

- tier reason：公開靜態網站，獨立儲存庫；不涉及認證、資料庫、資料刪除、匯入、付款或同步。主要風險是公開內容，
  由 spec 的公開白名單（§3）與 `check:public` 把關。
- branch：`main`（尚未建立 GitHub 遠端；推送與遠端建立由 owner 執行）
- 意圖：`intent.md`（owner G1 2026-10-19）。規格：`spec.md`。工作票：`tickets/01`–`06`（06 檔名 `06-ten-page-closeout.md`）。
- what is left（G4 後）：下一步 G5（owner 驗收，同時確認 copy/ 文案定稿）→ G6A＋G6B 一輪 Codex → G7（owner 建遠端、推送、Pages）。舊紀錄：G2 已過（修正已套用，依 owner 輕量流程不複審）→ BUILDING：工作票 01 起；03 可與 01、02 平行。LOW 無 G3；下一個審查閘門 G6A（與 G6B 合一輪 Codex），之前先過 G4、G5。
- blockers：無（作者姓名已由 owner 裁定不放，見 § Decisions by owner）。

## Gates
- [x] G1 intent approved by human（2026-10-19，對話中逐項裁定）
- [x] G2A＋G2B spec 與工作票合審（fresh opus，2026-10-19，一輪合審，APPROVE AFTER FIXES；修正已套用，不複審）
- [x] G4 verified（2026-10-19；乾淨 clone 證據 `evidence/g4.md`，測試的提交 `8d6dfca`；全新工作階段驗證者 VERIFIED、無 FAIL，`verification/g4-verifier.md`；不阻擋的建議已處理，見 § Decisions by Builder）
- [ ] G5 accepted by human
- [ ] G6A＋G6B 一輪 Codex
- [ ] G7 released（owner 建立遠端、推送 main、Pages 設定）

## Decisions by owner（2026-10-19，經 coordinator 轉達）
- Owner: D1 網站名稱「Mnemo-Card portfolio」。
- Owner: D2 不連產品正式站；`check:public` 允許清單維持空的。
- Owner: N1 措辭「學習作答的送出請求」；核可 N1、N2、截圖 S1–S4。
- Owner: 不核可 N3（測試數量）、W14（儲存庫連結）、W11（點名 AI 工具）；N4 試用規模不寫。
- Owner: W12 署名＝作者姓名＋GitHub 個人頁連結，不放電子郵件；姓名待提供。【已取代：見下方 2026-10-19 頁尾裁定，頁尾不放姓名】
- Owner: 首頁改為「1 分鐘了解專案特色」，以雙鑽石模型（探索 → 定義 → 發展 → 交付）呈現，最後分支到學習科學與產品摘要頁。【已取代：首頁已改為導覽頁，雙鑽石移到專案設計頁，見下方導覽頁裁定】
- Owner: 頁尾不放作者姓名（2026-10-19）：頁尾只有 GitHub 連結 https://github.com/banshee0716，連結文字「GitHub：banshee0716」；不放電子郵件；取代 W12 原「姓名＋連結」，spec W12／D4／R5 第 3 點／AC20 與 copy/home.md 已同步。
- Owner: 首頁改為導覽頁（2026-10-19，看過雙鑽石首頁定稿後）：產品自己的首頁已介紹功能，作品集首頁只負責連結與引導——一句定位＋四個入口（專案設計、學習科學導讀、產品怎麼用、操作文件＝文件站根目錄），頁尾不變，仍不連產品正式站；已核對的雙鑽石文案原文搬到新的專案設計頁；總頁數改為十頁。
- Owner: 2026-10-19 G5 — all pages accepted except home visuals; home restyled, awaiting owner re-check.

## Decisions by Builder
- Builder: G4 驗證者的不阻擋建議已處理：AC7 的 Starlight 鍵盤測試改為九頁迴圈；AC12 產品頁詞記入 copy/product.md；AC9 的 light 測試先模擬系統深色；過時的決定標註「已取代」。copy/ 檔頭的「Builder 草稿」維持原樣，由 owner 在 G5 一併確認文案定稿。
- Builder: spec §3.1 W16 範圍改為涵蓋導覽首頁的定位句與四個入口說明句、專案設計頁的 description（及原有的專案設計頁引導句、雙鑽石句、「繼續讀」說明句），可概括 W1–W10、N1、N2 與 S1–S4；全是 owner 已核可項目，沒有新的公開說法。依 S3（`verification/whitelist-home-nav.md`）對「用四張畫面摘要主要功能。」的 FAIL 所提修法；文案不改。
- Builder: 專案設計頁路徑 `design/`、標題「專案設計」、Starlight 頁（有側欄與搜尋）、`prev`／`next` 皆 false；側欄三群組依序「專案設計」「學習科學」「產品」，與首頁入口順序一致。由工作票 04 建置（與導覽首頁同票）。
- Builder: 導覽首頁字數 60–180（約 28 秒內掃完，spec R5 第 4 點）；原 250–450 改套用在專案設計頁（R5a 第 4 點）。定稿草稿：首頁 169 字、專案設計頁 434 字（標題由「Mnemo-Card portfolio」改為「專案設計」，少 16 字）。
- Builder: 搜尋：首頁仍不進索引；專案設計頁進索引，AC12 加搜「雙鑽石」對應 `design/`；AC11 的首頁獨有句改為「從下面四個入口認識它。」（搜「四個入口」不得指向根路徑）。AC12 產品摘要頁詞為「匯入」（已記在 copy/product.md 文末）。
- Builder: 已提交的 S3 報告不改；新導覽首頁另寫 `verification/whitelist-home-nav.md`，專案設計頁只核新增的標題與 description，另寫 `verification/whitelist-design.md`。工作票 06 檔名改為 `06-ten-page-closeout.md`。
- Builder: 產品摘要頁「完整操作說明」段是純導覽，依 spec R8 第 4 點可以上站，不另立白名單項目（S3 核對者 2026-10-19 建議 c）。
- Builder: 產品摘要頁字數量法同 AC19：`alt` 不計入、「圖：」說明計入（`figcaption` 看得到；S3 建議 d）；定稿 464 字。首頁定稿 449 字。【已取代：「首頁定稿 449 字」已隨導覽版首頁取代為 169 字；產品頁 464 字仍有效】
- Builder: 閱讀速度出處更正（S3 2026-10-19 查證）：Brysbaert (2019) 中文默讀約 260 詞／分，以 1.5 字＝1 詞換算約 390 字／分，450 字約 1.2 分鐘；刪除原「每分鐘 250–300 字」（較可能是 IReST 的朗讀數字）。字數範圍 250–450 不變；spec R5 第 5 點與 AC19 已改。
- Builder: `CLAUDE.md` 只含 `@AGENTS.md`（比照文件站），兩檔不會分歧。
- Builder: 主程式私有儲存庫的名稱與路徑不寫進本儲存庫；白名單的成果數字出處以「私有來源描述＋日期」標示，
  逐檔路徑對照由 Builder 在 G2 審查 packet 中提供給審查者，不提交（理由：`check:public` 允許清單從空開始）。
- Builder: 首頁不進 Pagefind 索引（理由見 spec R9）。
- Builder: 首頁閱讀長度預算＝`main` 去掉空白後 250–450 字，`h1` 計入、頁尾不計入（spec R5 第 5 點；上限依 owner 2026-10-19 裁定；下限讓五個區段各有約 50 字）。【已取代：首頁為 60–180 字（spec R5 第 4 點）；250–450 改套用於專案設計頁（R5a 第 4 點）】
- Builder: 首頁分支只留學習科學導讀與產品摘要兩個入口（owner 只列這兩個）；文件站由產品摘要頁連過去。【已取代：首頁現為四個入口（spec R5 第 1 點）】
- Builder: 工作票 01 的 `PAGES` 項目多一個 `kind: 'home' | 'starlight'` 欄位（理由：首頁沒有搜尋框，AC6 的「搜尋」檢查只適用 Starlight 頁；後續票沿用）。
- Builder: `tokens.css` 除 spec R3 列的主色外，另定義首頁用的 `--mc-bg`、`--mc-text`、`--mc-text-muted`、`--mc-border`、`--mc-link`、`--mc-on-accent`（理由：首頁不得出現色碼字面值，AC8）。
- Builder: `searchFor` 改從 `learning-science/` 開始搜（理由：首頁沒有搜尋框，R9）；`tests/navigation.spec.ts` 的鍵盤測試也改在 Starlight 頁執行。
- Builder: AC19 第 1 點量測時排除 `.sr-only`（Starlight 標題錨點的「「…」段落」螢幕閱讀器文字，讀者不讀；含它會多算 66 字，434 變 500）；spec AC19.1 已同步。
- Builder: 工作票 05 之前 `product/` 尚不存在，`tests/helpers.ts` 的 `PENDING_PAGES` 暫時讓 AC3 不要求它回 200；工作票 05 建頁時必須清空此清單。【已取代：工作票 05 已移除 PENDING_PAGES，見下一條】
- Builder: 工作票 05 建立 `product/` 後已移除 `PENDING_PAGES` 機制（無其他用途）；AC3 對十頁的站內連結一律要求 200。
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
