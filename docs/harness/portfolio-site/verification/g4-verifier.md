# G4 驗證報告：portfolio-site（全新工作階段驗證者）

- 驗證者：全新工作階段的子代理，沒有寫過本切片的程式或文案；作者的證據（`evidence/g4.md`）只當參考，所有指令重新執行。
- 日期：2026-10-19。
- 受測版本：`main` 的 `a5f4cfc`。它與作者的受測提交 `8d6dfca` 之間只差 `evidence/g4.md` 一個檔（`git diff --stat 8d6dfca HEAD` 確認），程式與內容相同。
- 做法：把本機儲存庫 `git clone --branch main` 到暫存目錄（只含已提交的檔案），在 WSL（Node 24.21.0）內執行。
- **結論：VERIFIED。** AC1–AC17、AC19、AC20 全部 PASS；AC18 前半（工作流與設定核對）PASS，後半屬 G7（N/A）。
  沒有阻擋 G5 的 FAIL；下方列出四項不阻擋的建議。

## 1. 重新執行的指令

| 指令 | 結束碼 | 結果 |
| --- | --- | --- |
| `npm ci` | 0 | |
| `npm run build` | 0 | `11 page(s) built`（含 404） |
| `npx playwright install chromium` 後 `npm test` | 0 | **123 passed**（`tests/site.spec.ts`、`tests/learning-science.spec.ts`、`tests/home.spec.ts`、`tests/navigation.spec.ts`、`tests/search.spec.ts`、`tests/product.spec.ts`、`tests/design.spec.ts`；與作者列的 70／25／12／7／4／3／2 合計相同） |
| `node scripts/check-public.mjs main` | 0 | `乾淨，掃描 17 個提交`（作者在 `8d6dfca` 時為 16 個，多出的一個是證據提交） |
| `npm run check:public` | 0 | 同上 |

## 2. 逐條判定

| AC | 判定 | 證明 |
| --- | --- | --- |
| AC1 | PASS | 乾淨 clone 上 `npm ci`、`npm run build` exit 0；`find dist -name index.html -not -path '*/404/*' \| wc -l` = `10`；`dist/pagefind/pagefind.js` 存在；`package.json` 沒有 `^`／`~`（grep exit 1）；依賴版本與 `.npmrc` 和文件站逐項相同。 |
| AC2 | PASS | `tests/site.spec.ts` 對 `PAGES` 十頁：狀態 200、`lang="zh-TW"`、標題。`PAGES` 恰為 spec §0 十頁。 |
| AC3 | PASS | 同檔十頁；輔助函式會檢查漏掉 `base`、非 200、跨頁錨點與頁內錨點，並要求站內連結數大於 0（不是空集合也能過）。 |
| AC4 | PASS | 同檔十頁，375px 比對 `scrollWidth <= clientWidth`。 |
| AC5 | PASS | 同檔十頁 × 淺色／深色，`gotoWithTheme` 先斷言 `data-theme` 已套用再跑 axe。 |
| AC6 | PASS | 同檔十頁；Starlight 頁要求「搜尋」、無「搜索」、無英文落回字串；首頁只查無「搜索」（首頁沒有搜尋框，符合 R9）。 |
| AC7 | PASS | 首頁：`tests/home.spec.ts` 依序斷言跳轉連結 → `MAIN` → 四個入口 → 頁尾 GitHub，並檢查焦點樣式。Starlight 頁：`tests/navigation.spec.ts` 以導讀頁與檢索練習頁為代表。見第 4 節。 |
| AC8 | PASS | 兩個主題各比一次計算值（`tests/home.spec.ts`，並斷言非空字串）；色碼字面值 grep 與 `--mc-*` 只在 `tokens.css` 的 grep 都沒有輸出。 |
| AC9 | PASS | `localStorage` 設 dark／light，以及未設時模擬系統 light／dark 共四個測試。 |
| AC10 | PASS | 首頁：h1 一個、`main h2` 文字依序完全相等、各一個連結且 `href` 正確；站外連結集合恰為文件站與 GitHub，沒有站外腳本或樣式。專案設計頁：`tests/design.spec.ts` 鎖定 h1、h2 清單、「繼續讀」兩個連結、無上下篇。 |
| AC11 | PASS | `grep -c 'data-pagefind-body' dist/index.html` = `0`；搜「四個入口」結果不指向根路徑。 |
| AC12 | PASS | `tests/search.spec.ts`：檢索練習、認知負荷、雙鑽石、匯入，各有一筆結果完全對應目標路徑。 |
| AC13 | PASS | 七檔 `diff`：retrieval-practice 48c48、self-explanation 49c49、spaced-practice 51c51（都只是連結）、kli-framework 3a4（`next: false`），其餘三檔無差異；相對連結 grep 無輸出；絕對網址計數 1+1+1=3。Playwright 25 個學習科學測試通過。 |
| AC14 | PASS | `tests/navigation.spec.ts`：群組順序、各群組連結與 `href`、只有站內連結、首頁不在側欄、頁首網站標題連到 `base` 根。 |
| AC15 | PASS | `tests/product.spec.ts`：恰四張圖、`alt` 非空、webp、`figcaption` 以「圖：」開頭；內容區站外連結恰為三個文件站網址；無上下篇（同一選擇器在學習科學測試中有正向斷言，不是空選擇器）；無程式碼區塊。 |
| AC16 | PASS | `ALLOWED = []` 一行（第 67 行）；提交者與作者只有本儲存庫的 noreply 地址；歷史中沒有 PDF 或環境檔（AC16 的檔名 grep 無輸出）；`HARNESS_OK` 一行（第 60 行）；`.gitignore` 第 6 行 `[.]env*`，`git check-ignore` exit 0。 |
| AC17 | PASS | 四份 S3 報告的 FAIL 都已處理。`whitelist-home-nav.md` 第 8 句的 FAIL 沒有複核紀錄，但修法（甲案）已落在 spec §3.1 W16（提交 `93ccd75`），W16 現在明文涵蓋導覽首頁四個入口說明句與 S1–S4；本驗證者逐句重核首頁五句與兩個 description，都在 W16 範圍內，判定已關閉。所有上站句子對到的項目都是「已核可」。 |
| AC18 | 前半 PASS／後半 N/A | 工作流與文件站的工作流逐字相同；觸發 push `main` 與 `workflow_dispatch`、權限三項、無 secret、測試通過才上傳與部署。`lastUpdated: false` 計數 1、`editLink` 計數 0、`components:` 計數 0。部署與 S4 冒煙屬 G7。 |
| AC19 | PASS | 首頁 `main` 169 字（60–180）；專案設計頁 434 字（250–450）。量法在測試中排除 `.sr-only`，與 spec AC19 第 1 點一致。 |
| AC20 | PASS | `grep -rn '待 owner 提供' src/` 無輸出；首頁頁尾恰一個連結、`href`、文字正確、無「待 owner」；十頁各有一個「沒有 `mailto:`」測試。 |

## 3. S3 逐字核對（上站文字對文案）

以無頭瀏覽器開啟 `dist/index.html`、`dist/design/index.html`、`dist/product/index.html`，取首頁 `main`、另兩頁 h1 加 `.sl-markdown-content` 的
可見文字（移除 `.sr-only`），與 `copy/*.md` 的頁面文案區塊（去掉 `<!-- -->` 註解、標題與清單記號、連結網址）去空白後整串比對：

| 頁面 | 文案字數 | 上站字數 | 逐字相同 | 其他 |
| --- | --- | --- | --- | --- |
| 首頁 | 169 | 169 | 是 | `<title>`「Mnemo-Card portfolio」；頁尾「GitHub：banshee0716」 |
| 專案設計 | 434 | 434 | 是 | `description` 與文案逐字相同 |
| 產品怎麼用 | 464 | 464 | 是 | 四張圖的 `alt` 與「圖：」說明依序逐字相同；`description` 逐字相同 |

結論：**沒有差異，PASS。** 四張截圖、Logo 與 `zh-TW.json` 的雜湊與文件站來源提交相同。

## 4. AC7 只在兩個代表頁跑，是否足夠

- spec AC7 第 2 點寫的是「Starlight 頁：……」，沒有要求逐頁；本站沒有覆寫 Starlight 元件（AC18 `components:` 計數 0），九個 Starlight 頁共用同一套頁首、側欄、搜尋與文章目錄。依字面，兩個代表頁**滿足 AC7**。
- 但工作票 06 第 1 步寫「AC2–AC7 在十頁上都有執行（不是只跑部分頁面）」，目前提交的測試沒有做到這一點。
- 為了不只靠推論，本驗證者在暫存 clone 裡另寫一個不提交的測試，對九個 Starlight 頁逐頁跑 AC7 第 2 點的五個動作（第一次 Tab 聚焦跳轉連結、桌機 Tab 到側欄、手機 Enter 開選單／Tab 到側欄／Esc 關閉、鍵盤開搜尋、手機文章目錄鍵盤展開）：**9 passed**，九頁都有手機文章目錄。
- 判定：AC7 PASS。建議（不阻擋）：把這組檢查移進 `PAGES` 迴圈，或在 `state.md` 記一行 Builder 決定說明為何以代表頁為準，讓工作票 06 第 1 步與實作一致。

## 5. 公開衛生（逐檔閱讀所有提交的檔案，對照 spec §3.4 F1–F9）

| 類別 | 判定 | 說明 |
| --- | --- | --- |
| F1 主機位置 | PASS | 網站與文件都沒有。`check-public.mjs` 內有通用的城市與區域代碼清單，屬 R11 規定的掃描樣式。 |
| F2 後端與服務名稱 | PASS | 同上，只出現在掃描樣式內（R11 第 3 點允許）。 |
| F3 資料庫結構 | PASS | |
| F4 內部文件 | PASS（附註） | 沒有主程式的檔名、路徑、切片名稱或 SHA。附註：掃描樣式含主程式私有儲存庫的名稱；這是 R11 允許的寫法，而且同一行早已在公開的文件站腳本中，沒有新的暴露。spec N1 出處欄描述私有報告的門檻表內容，沒有路徑或檔名。 |
| F5 憑證與設定 | PASS | 沒有金鑰或環境變數名稱；工作流不用 secret。 |
| F6 使用者資料 | PASS | 截圖只有 S1–S4 示範畫面，與文件站逐位元相同。 |
| F7 安全細節 | PASS | |
| F8 成效宣稱 | PASS | 上站文字與學習科學頁都明寫「不是學習成效的證明」。 |
| F9 未公開規劃 | PASS（附註） | spec §7 與 intent 只寫本網站與文件站的後續整理，不是產品功能路線圖。 |

## 6. 不阻擋的建議

1. **AC7 與工作票 06 第 1 步不一致**：見第 4 節。
2. **AC12 的產品摘要頁搜尋詞「匯入」沒有在 `copy/product.md` 指定**（工作票 03 第 2 步要求文案檔指定）。建議在 `copy/product.md` 文末補一行指定，或記一行 Builder 決定。
3. **文案定稿沒有 owner 同意的紀錄**：`copy/home.md`、`copy/product.md` 檔頭仍寫「Builder 草稿……待 owner 定稿」，`state.md` 沒有對應的 `Owner:` 行（工作票 03 第 4 步）。白名單項目都已核可，所以不影響 AC17；建議在 G5 由 owner 一併確認並記錄。
4. **AC9 的「localStorage 為 light」測試**在預設系統主題也是淺色時，分不出是讀到 `localStorage` 還是跟隨系統；可在該測試先模擬系統深色。目前「設 dark」那一個測試已證明 `localStorage` 優先，所以不影響判定。

另：`state.md` § Decisions by Builder 仍留有改版前「首頁 250–450 字」「首頁定稿 449 字」等舊行，與現行 spec 不一致；建議標註為已被取代，避免後續讀者誤解。
