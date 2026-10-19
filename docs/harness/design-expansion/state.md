# design-expansion — harness state

```harness
slug: design-expansion
slice: "1"
stage: ACCEPTANCE
holder: owner
tier: LOW
gates_passed: [G1, G2A, G2B, G4]
open_p0p1: 0
gate: G5
round: 0
```
本區塊是唯一的狀態事實；下方文字都不構成授權。

- tier reason：同 portfolio-site——公開靜態網站的內容擴寫與字型調整，不涉及認證、資料或付款。主要風險是公開內容，
  由白名單與 `check:public` 把關。
- branch：`main`。
- 意圖：`intent.md`（owner G1 2026-10-19）。文案：`copy/problem.md`、`copy/decisions.md`、`copy/engineering.md`
  （owner 2026-10-19 在對話中確認內容）。逐段出處保存在本機未追蹤的 `private/`（`.gitignore`），不提交。
- spec：`spec.md`；工作票：`tickets/01`–`03`。
- what is left：G5（owner 驗收三篇新頁、總覽頁「繼續讀」、全站黑體標題，並確認總覽頁上限 500）→ 一輪 Codex（G6A＋G6B）→ G7（推送需 owner 授權） → G5（owner 驗收）→ 一輪 Codex（G6A＋G6B）→ G7（推送需 owner 授權）。
- blockers：無。

## Gates
- [x] G1 intent approved by human（2026-10-19，對話中逐項裁定，含 16 題拷問）
- [x] G2A＋G2B spec 與工作票合審（fresh opus，2026-10-19，一輪合審，APPROVE AFTER FIXES；修正已套用，不複審）
- [x] G4 verified（2026-10-19；全新工作階段驗證者在乾淨 clone `378c7a4` 上 VERIFIED、無 FAIL：214 passed、13 頁、check:public 乾淨；變異抽查四項皆紅；`verification/g4-verifier.md`）
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
- Owner: `@fontsource-variable/noto-serif-tc` 直接從依賴移除（2026-10-19，取代原 spec R1 的同名依賴）；接續跑 G2。
- Owner: 工程篇〈同時送出的請求〉保留，記為 F7 例外（2026-10-19，G2 #5）：已修好的並發正確性問題，不寫機制名稱、函式或利用方式。
- Owner: 2026-10-19 確認 Builder 補寫的 9 處（目標讀者舉例、卡片零碎接四卡型、四卡型替代方案與代價、沿用原型框架、
  KLI「設計上的借用」限定等）都可以上站。

## Decisions by Builder
- Builder: 三篇頁面路徑 `design/problem/`、`design/decisions/`、`design/engineering/`（由 spec 定案）。
- Builder: 字型改動已先在工作目錄完成（`tokens.css` 的 `--mc-font-heading` 指向內文字型；`astro.config.mjs` 與
  `src/pages/index.astro` 不再載入 Noto Serif TC；註解中的「明體」字樣移除）。`@fontsource-variable/noto-serif-tc`
  已依 owner 裁定移除（spec R4）。
- Builder: 逐段出處不提交（理由：出處含私有來源的章節編號與內部紀錄描述，屬 F4 邊界）；改存 `private/` 並加入 `.gitignore`。
- Builder: 總覽頁閱讀長度上限 450 → 500（spec R2；加五個繼續讀連結後約 +50 字）；G5 請 owner 確認。
- Builder: 三篇閱讀長度範圍 1,200–1,700／3,200–4,200／2,800–3,800，不含「參考文獻」區（spec R7）。
- Builder: 三篇引用的文獻在各頁文末加「參考文獻」區；Koriat & Bjork (2005) 書目以 Crossref 2026-10-19 核對。
- Builder: 工作票 01 完成（`tests/font.spec.ts`；變異：字型變數改回明體，AC21 兩項變紅）。
- Builder: 工作票 02 完成：三篇 `.mdx` 由 `copy/*.md` 程式轉出、逐字相同（diff 無差異）；總覽頁「繼續讀」新增句定稿於 `copy/design-overview.md`；
  量測值：總覽 489、問題定義 1,419、設計決策 3,700、工程實作 3,309（皆在範圍內）。五項變異都變紅（刪表格一列、降一個 h2、拿掉 `next: false`、
  側欄改名、`pagefind: false`）。`npm test` 214 passed；`dist/` 13 頁。
- Builder: AC6 的英文落回字串比對改為不比對後面接「.字母」的寫法（`Next` 不比對 `Next.js`）：工程實作頁內文的技術名稱被誤判為介面字串；
  檢查範圍不縮小（Starlight 標題錨點的英文字串也在內文區）。
- Builder: 工作票 03 完成：S3 核對（全新 opus，`verification/whitelist-design-pages.md`）首輪 PASS 153／FAIL 5，F1–F9 全 PASS，七筆書目與 Crossref 相符；
  5 項 FAIL（L2「建構性檢索」標籤、L3「影響都不大」措辭、L1 缺「初學者」條件、E6 缺測試條件、E11 的 1.57 倍是讀取量不是時間）已改 copy、`.mdx` 與 spec §3；
  重核 5 句全 PASS、AC22 PASS、AC17′ 滿足。修正後量測：設計決策 3,712、工程實作 3,344。
- Builder: G4 不阻擋的建議：側欄測試改名涵蓋三個群組、AC7 註解改為不寫死頁數（已處理）；「本機 shell 的 grep 是包裝函式，驗證時用 `command grep`」只記在此，不改 spec；AC18 部署與 S4 留待 G7。
- Builder: 本切片的白名單沿用 portfolio-site spec §3 的規則與編號（W、N、S、F），新項目在本切片 spec 以新編號列出。

## G2A＋G2B 合審紀錄（2026-10-19）
- 審查者：全新工作階段的 opus；spec 與工作票一輪合審（owner LOW 輕量流程，修完不複審）。
- 結論：APPROVE AFTER FIXES。P1 四項、P2 八項、P3 三項，全部已處理；open P0/P1 = 0。

| # | 等級 | 發現 | 處置 |
| --- | --- | --- | --- |
| 1 | P1 | 工程篇「樣本 20 筆時 p95 等於最大值」與出處不符（19 筆以下才相等；當時 12 對） | 改為「不到 20 筆時……當時只量了 12 對」；E11 同步 |
| 2 | P1 | 「慢 1.57 倍是混到上一輪資料」出處只說最可能、未查證 | 改為「最可能是混用兩代測試資料，但無法確認，結論撤回」；E11 同步 |
| 3 | P1 | 卡數上限「一開始只在應用程式裡檢查」不實（原本沒有上限）；否決逐條檢查的理由寫錯 | 依出處重寫該節與 E5 |
| 4 | P1 | AC21 量測 h3，但頁面沒有 h3 | AC21 改為 h1 與 h2 |
| 5 | P2 | E6 碰到 F7，與快取一節標準不一致；「測試時發現」不實 | owner 裁定保留為 F7 例外；開頭改為「盤點程式時發現，先寫測試重現」 |
| 6 | P2 | 13→1、6.7–8.3 倍缺測試條件；壓力測試缺日期 | 補「在大量測試資料下」「2026 年 9 月」 |
| 7 | P2 | 「照時間順序寫」不實 | 改為「照主題分段」 |
| 8 | P2 | E4 出處欄「只寫資料一致性」暗示有未寫的原因 | 刪「只」 |
| 9 | P2 | 「馬上對答案」超出本站〈檢索練習〉 | 改為「有回饋可以對照」 |
| 10 | P2 | KLI 例子與本站原文不符 | 照〈KLI 框架〉原文改 |
| 11 | P2 | AC10′ h2 結尾與工程篇矛盾、工程篇連結未斷言 | 逐頁寫明結尾；補工程篇兩個連結與參考文獻 DOI 斷言 |
| 12 | P2 | R1 與 AC22 對逐字與連結的說法不一致 | 統一為含連結與參考文獻逐字相同、不得新增連結 |
| 13 | P3 | 出處欄的文件描述接近主程式切片名稱 | 全部改為泛稱（規格、實作計畫、實驗報告等） |
| 14 | P3 | 「先不拆」「先固定」暗示未來計畫（F9） | 改為「以現在的規模不需要拆」「固定使用」 |
| 15 | P3 | 變異未涵蓋 AC12′、AC14′；工作票 03 未要求核對數字 | 工作票 02 加兩項變異；工作票 03 要求逐一核對數字 |

另依審查者「AI 腔」清單改寫 8 處句子（頁一 4 處、頁二 2 處與「代價是」句型變化、頁三 2 處）。spec 另明寫原 AC1、AC10、AC12、AC14、AC16、AC19 由新條文取代。
`private/drafts-with-sources.md` 是 G2 前的版本，出處仍有效；文案以 `copy/` 為準。

## 後續（不屬本切片）
- owner 考慮把產品與文件站的標題字型也統一為黑體（兩者目前用明體）；在各自的儲存庫另開切片。
- portfolio-site 的後續（G6-P2-1、P3-1..3；文件站刪除學習科學區）不變。
