# Handoff G6：final-review（G6A＋G6B 合審）— portfolio-site

- 你是 Reviewer：全程只讀，不得修改本儲存庫任何檔案；發現寫在輸出中，由 Builder 記錄。
- 依 owner 的 LOW 輕量流程（`AGENTS.md` 工作方式 3），**這一輪同時涵蓋兩個關卡**，請分別給出判定：
  - **G6A 任務審查**：反向鏈 證據 → 實作 → 工作票 → spec → intent；對 spec AC1–AC20 逐條給狀態
    （Verified／Partially verified／Not verified／Violated；AC18 後半屬 G7 發布，標 Not verified 即可）。
  - **G6B 程式審查**：正確性、回歸風險、安全與隱私、工作流、測試品質（斷言在合理回歸下會不會變紅）、無障礙、可維護性。
  - 兩個判定各用 APPROVE／APPROVE AFTER FIXES／REJECT；有任何 P0 或 P1 就不得 APPROVE。
- 嚴重度 P0–P3。每個發現要有具體的失敗情境（輸入或狀態 → 錯誤結果），格式：標題、檔案與行號、相關需求、證據、
  失敗情境、影響、需要的修正、建議的回歸測試、信心（high／medium／low）。最多 8 個，只報有把握的反例。

## 審查範圍

- base `f70a7b9`（只含 G1／G2 的 harness 文件），head＝加入本檔的提交（程式與內容的最後一個提交是 `c2c66f2`，
  之後只有 harness 文件）。範圍 `f70a7b9...HEAD`。
- 關注面（請在摘要中說明涵蓋了哪些）：
  1. **建置與設定**：`package.json`、`package-lock.json`（只看是否鎖定精確版本）、`.npmrc`、`astro.config.mjs`、
     `src/content.config.ts`、`src/content/i18n/zh-TW.json`、`src/styles/tokens.css`、`src/styles/custom.css`、`src/styles/home.css`。
  2. **部署工作流**：`.github/workflows/deploy.yml`（spec R10）。
  3. **頁面**：`src/pages/index.astro`（導覽首頁，G5 後改版 `c2c66f2`）、`src/content/docs/design.mdx`、`src/content/docs/product.mdx`、
     `src/content/docs/learning-science/*.mdx`（自文件站搬入，R7）。文案已由 owner 在 G5 定稿、由全新子代理逐句核對
     （`verification/whitelist-*.md`）；只在說法與 spec §3 白名單衝突、或公開儲存庫洩漏內部細節時回報，不評論用字風格。
  4. **測試**：`playwright.config.ts`、`tests/*.ts`（spec S2、AC2–AC20）。
  5. **公開衛生**：`scripts/check-public.mjs`（R11、AC16）與範圍內**每一個提交**的所有檔案與提交訊息（不只 HEAD）。
- 可讀範圍外會被影響的檔案（例如 `node_modules/@astrojs/starlight/` 元件原始碼，用來確認測試依賴的 DOM）。請列出實際打開的檔案。
- 不在範圍：Mnemo-Card 產品本身；文件站儲存庫；GitHub Pages 實際部署（G7）。

## 標準

`intent.md`（owner G1）、`spec.md`（R1–R12、R5a、K1–K3、§3 白名單、S1–S4、AC1–AC20）、`tickets/01`–`06`、`AGENTS.md`、
`state.md` § Decisions by owner／by Builder（Builder 決定都寫了理由；已被取代的行有標註）。

## 驗收條件與證據

| AC | 內容 | 證據 |
| --- | --- | --- |
| AC1 | 乾淨 clone 建置、十頁、Pagefind、精確版本 | `evidence/g4.md` §3、§7 |
| AC2–AC6 | 十頁 200／語系／標題、站內連結與跨頁錨點、375px、axe 淺深色、繁體介面 | `tests/site.spec.ts`（十頁 × 7） |
| AC7 | 鍵盤：首頁順序與焦點可見；九個 Starlight 頁逐頁五個動作 | `tests/home.spec.ts`、`tests/navigation.spec.ts`；見預審 G6-P2-1 |
| AC8 | 首頁 `--mc-accent` 等於 Starlight 主色；無色碼字面值；`--mc-*` 只在 `tokens.css` | `tests/home.spec.ts`；`evidence/g4.md` §5、§7 |
| AC9 | 首頁主題（localStorage 優先、否則跟隨系統） | `tests/home.spec.ts` |
| AC10 | 首頁與專案設計頁結構、無產品正式站連結、無站外資源 | `tests/home.spec.ts`、`tests/design.spec.ts` |
| AC11–AC12 | 首頁不進索引；四個搜尋詞 | `tests/home.spec.ts`、`tests/search.spec.ts`；`evidence/g4.md` §7 |
| AC13 | 學習科學七檔與來源的差異、連結改寫 | `evidence/g4.md` §4；`tests/learning-science.spec.ts` |
| AC14–AC15 | 側欄；產品摘要頁四張圖與文件站連結 | `tests/navigation.spec.ts`、`tests/product.spec.ts` |
| AC16 | 公開衛生 | `evidence/g4.md` §5、§7 |
| AC17 | 白名單核對沒有未處理的 FAIL | `verification/whitelist-*.md`、`verification/g4-verifier.md` AC17 |
| AC18 | 工作流與設定核對（後半屬 G7） | `evidence/g4.md` §5；`verification/g4-verifier.md` |
| AC19 | 首頁 169 字、專案設計頁 434 字 | 測試輸出，`evidence/g4.md` §7 |
| AC20 | 頁尾只有 GitHub 連結、十頁無 `mailto:` | `tests/home.spec.ts`、`tests/site.spec.ts` |

- G4：全新工作階段驗證者在乾淨 clone 的 `a5f4cfc` 判定 VERIFIED（`verification/g4-verifier.md`），123 passed。
- G5（owner，2026-10-19）：全部頁面接受；首頁視覺改版 `c2c66f2` 後 owner 再確認接受。copy/ 三檔已註記 owner 定稿。
- **G5 後重跑**（全新工作階段、乾淨 clone、`c2c66f2`）：`npm ci`、`npm run build` exit 0；`npm test` **163 passed**；
  `node scripts/check-public.mjs main` 乾淨，掃描 20 個提交（等於 `git rev-list main` 的數量）。指令與輸出在 `evidence/g4.md` §7。

## 預審發現（Builder 端全新工作階段預審，不是 Reviewer 回合；請確認判斷）

| # | 等級 | 發現 | 狀態 |
| --- | --- | --- | --- |
| G6-P2-1 | P2 | `tests/home.spec.ts` 的 AC7 焦點檢查對四個入口連結是空斷言：改版後連結本身是 `outline: 2px solid transparent`，`outlineStyle` 為 `solid` 所以必定通過；真正的焦點環畫在入口卡（`.entry:has(a:focus-visible)` 的 `box-shadow`）。變異實驗：刪掉該規則重建，AC7 測試仍綠（`evidence/g4.md` §7）。修法建議：入口連結改斷言所屬 `.entry` 在轉場結束後的 `box-shadow` 含焦點環（或比對聚焦前後不同），其他連結斷言 `outline-color` 不透明。 | 未修（交 Reviewer 判定；修正屬測試，不改畫面） |
| G6-P3-1 | P3 | 焦點環依賴 `:has()`。不支援 `:has()` 的舊瀏覽器上，入口連結只剩透明外框，鍵盤焦點不可見。可加 `@supports not selector(:has(a))` 時退回連結自身的可見外框。 | 未修（Builder 決定是否處理） |
| G6-P3-2 | P3 | 入口卡的序號（`::before` counter「01」）與箭頭（`::after` 的「→」「↗」）是 CSS 產生的內容，部分螢幕閱讀器會朗讀。可改成 `content: '→' / ''` 的替代文字語法。 | 未修（Builder 決定是否處理） |
| G6-P3-3 | P3 | `tickets/01`–`06` 的驗收核取方塊都沒有勾；實際狀態記在 `state.md` 與 `evidence/`。 | 未修（文件整潔；不影響 AC） |

焦點可見性的判斷（WCAG 2.2）：**2.4.7 Focus Visible（AA）符合**——鍵盤聚焦入口時，整張卡的邊框變主色並出現 2px 焦點環
（淺色 `#0071e3` 對白底約 4.7:1；深色 `#66b0ff` 對 `#17181c` 約 7.8:1，都高於 3:1）；頁尾連結有 2px 實線外框。
**2.4.11 Focus Not Obscured（Minimum，AA）符合**——首頁沒有固定頁首或浮層，撐滿卡片的連結 `::after` 在卡片內，不遮住焦點。
連結本身保留透明外框是刻意的：強制色彩（高對比）模式會把它畫成可見外框。問題只在測試沒有證明這件事（G6-P2-1）。

## 上一次同類審查的重點（文件站前一個切片的 G6 合審曾指出；請確認本切片是否已避免）

1. **公開衛生只掃 HEAD**：本站 `check-public.mjs` 以 `git rev-list` 走訪每個可達提交、逐一掃整棵樹與提交訊息；不整檔排除
   spec（只信任腳本自身目前版本的行）。請確認足夠。
2. **最後一次獨立驗證之後又改了介面與測試**：`a54cfe4`（測試）與 `c2c66f2`（首頁改版）晚於 G4 的 `a5f4cfc`；已由全新工作階段在
   乾淨 clone 的 `c2c66f2` 重跑（上方）。之後的提交只有 harness 文件。
3. **即時狀態留有過時的 blocker**：`state.md` blockers 為「無」；what is left 只列 G6、G7。
4. **斷言太弱、合理回歸仍綠**：見 G6-P2-1；其他測試請一併判斷。
5. **跨頁錨點被丟掉**：`tests/helpers.ts` 的 `collectInternalUrls` 保留 fragment，`expectInternalLinksOk` 取得目標頁後檢查對應 `id`。

## 已接受的限制（不要重報）

- `npm ci` 回報的 moderate 等級 audit 項目屬建置期工具鏈，與文件站相同。
- `copy/` 文案與上站頁面重複保存；`copy/` 是 owner 定稿與核對的紀錄。
- 建置時 Starlight 自動產生 404 頁（建置輸出 11 頁）。
- 工作流權限設在工作流層級（與 Astro 官方範例、文件站相同）。
- spec 的白名單出處欄只寫私有來源的描述與日期，逐檔路徑不提交（spec §3 規則）。

## 需要你回答的問題

1. 有沒有任何 AC 實際上沒被證據支持，或測試在合理回歸下仍是綠燈（除 G6-P2-1 外）？
2. 首頁改版後，鍵盤焦點、對比、手機版面與 AC19 字數是否仍符合 spec R5、AC4、AC5、AC7、AC19？
3. 工作流第一次推送 `main` 時，有沒有會部署失敗或部署未測試內容的情況？
4. 範圍內每一個提交的公開檔案是否還有內部細節、secret 或個人信箱（spec §3.4 F1–F9）？
5. 有沒有實作超出或不足 spec 的地方（首頁入口、側欄、搜尋、上下篇、樣式變數）？

## 可直接貼上的 focus 文字

```text
Read docs/harness/portfolio-site/handoff-g6.md first. This is one combined round for G6A (task review) and G6B (code review) of the portfolio-site slice, owner LOW light flow; give a separate APPROVE, APPROVE AFTER FIXES or REJECT verdict for each. Review range is base f70a7b9 to HEAD; the last code commit is c2c66f2 (home restyle accepted by the owner at G5) and later commits only touch harness docs. For G6A, walk the reverse chain evidence to implementation to tickets to spec to intent and give every acceptance criterion AC1 to AC20 a status (AC18 second half belongs to G7). For G6B, review correctness, public-repository hygiene across every reachable commit (not only HEAD), test strength (would each assertion turn red under a plausible regression), keyboard focus visibility on the restyled home against WCAG 2.2 2.4.7 and 2.4.11, mobile layout and maintainability. Confirm or reject the four pre-review findings listed in the handoff, including G6-P2-1 (the home AC7 focus assertion passes even when the card focus ring is removed). Reply in Traditional Chinese, at most 8 findings, each with file and line, failure scenario, fix, regression test and confidence. You are read-only; do not modify any file.
```
