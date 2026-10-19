# portfolio-site — spec

依據：`intent.md`（owner G1 2026-10-19）。先例：文件站儲存庫的 product-docs 規格（R／K／S／AC 編號方式、測試寫法）。
本檔的編號只在本儲存庫有效。**§3 公開白名單是本切片的品質線**：網站上每一句關於 Mnemo-Card 的話都要對到 §3 的一個項目，
對不到就不能上站。

## 0. 頁面與網址

`site: 'https://banshee0716.github.io'`、`base: '/mnemo-card-portfolio'`。下表的路徑都在 `base` 之後。

| # | 頁面 | 路徑 | 版型 | 來源 |
| --- | --- | --- | --- | --- |
| 1 | 作品集首頁（導覽） | `` (根) | 自訂 Astro 頁（`src/pages/index.astro`） | 新寫，文案經 owner 同意（工作票 03） |
| 2 | 學習科學導讀 | `learning-science/` | Starlight | 自文件站搬入 |
| 3 | 檢索練習 | `learning-science/retrieval-practice/` | Starlight | 自文件站搬入 |
| 4 | 間隔練習 | `learning-science/spaced-practice/` | Starlight | 自文件站搬入 |
| 5 | 生成學習 | `learning-science/generative-learning/` | Starlight | 自文件站搬入 |
| 6 | 自我解釋 | `learning-science/self-explanation/` | Starlight | 自文件站搬入 |
| 7 | 認知負荷理論 | `learning-science/cognitive-load/` | Starlight | 自文件站搬入 |
| 8 | KLI 框架 | `learning-science/kli-framework/` | Starlight | 自文件站搬入 |
| 9 | 產品怎麼用 | `product/` | Starlight | 新寫，文案經 owner 同意（工作票 03） |
| 10 | 專案設計 | `design/` | Starlight | 原首頁雙鑽石文案搬入（owner 2026-10-19；工作票 03 文案、04 上站） |

搬入來源固定為文件站儲存庫 commit `b2d1dc9`（slice 5 RELEASED）的 `src/content/docs/learning-science/*.mdx`。

## 1. 需求

- **R1 專案**：Astro＋Starlight 位於本儲存庫根目錄。依賴版本與文件站 `package.json` 相同的精確版本
  （`astro`、`@astrojs/starlight`、兩個 `@fontsource-variable/noto-*-tc`、`sharp`、`@playwright/test`、`@axe-core/playwright`）；
  若要不同版本，先記 `state.md` § Decisions。`.npmrc` 與文件站相同（`ignore-scripts`、`save-exact`、`engine-strict`），
  `engines.node` 為 `24.x`。不用 npm `pre*`／`post*` 生命週期腳本。
- **R2 語系與標題**：單一根語系 `zh-TW`；`src/content/i18n/zh-TW.json` 沿用文件站的覆寫字串。
  Starlight 網站標題（`title`）與首頁 `<title>` 都是「Mnemo-Card portfolio」（owner D1，2026-10-19）。
  關閉 `editLink` 與 `lastUpdated`。不覆寫 Starlight 元件（`components` overrides）。
- **R3 品牌樣式共用**：
  1. 新增 `src/styles/tokens.css`，是品牌顏色、字型、圓角變數的**唯一**定義處：從文件站 `src/styles/custom.css` 搬出
     `--mc-*` 變數與主色（淺色、深色兩組），主色以 `--mc-accent`、`--mc-accent-low`、`--mc-accent-high` 命名。
  2. `src/styles/custom.css`（Starlight 用）匯入 `tokens.css`，並把 `--sl-color-accent*` 設成對應的 `--mc-accent*`；
     其餘文件站樣式照搬。
  3. 首頁只用 `tokens.css` 的變數與自己的版面樣式（`src/styles/home.css`）；`home.css` 與 `src/pages/` 內不得出現色碼字面值。
  4. 字型 Noto Sans TC（內文）、Noto Serif TC（標題）；Logo 用文件站的 `src/assets/logo.svg`。
- **R4 首頁主題**：首頁 `<html>` 的 `data-theme` 依序取：`localStorage` 的 `starlight-theme`（與 Starlight 頁共用）、
  系統 `prefers-color-scheme`；以 `<head>` 內的行內腳本在繪製前設定（讀 `localStorage` 包 try/catch）。首頁不放主題切換鈕。
- **R5 首頁結構**（導覽頁；owner 2026-10-19：產品自己的首頁已介紹功能，作品集首頁只負責連結與引導）：
  1. 一個 `h1`（網站名稱）與一句定位（W16）；之後恰四個入口，每個入口是一個 `h2`，`h2` 內只有一個連結，下面接一句說明（W16）。依序：
     專案設計（`design/`）、學習科學導讀（`learning-science/`）、產品怎麼用（`product/`）、
     操作文件（`https://banshee0716.github.io/mnemo-card-docs/`，文件站根目錄，外部連結）。確切文字在工作票 03 定稿後寫死進 AC10。
  2. 首頁不連產品正式站（owner D2，2026-10-19 再確認）。
  3. 頁尾（`<footer>`，在 `<main>` 之外）只有一個 GitHub 個人頁連結 `https://github.com/banshee0716`，連結文字「GitHub：banshee0716」；
     不放作者姓名、不放電子郵件（owner 2026-10-19 裁定）。頁面不得有任何佔位文字（AC20）。
  4. **閱讀長度（約半分鐘內掃完）**：`<main>` 的可見文字去掉所有空白後，字元數 **60–180**（AC19）。`h1` 計入；跳到主要內容連結與
     `<footer>` 不計入。理由：首頁只是導覽，讀者掃過定位句與四個入口就該能選；以中文默讀約每分鐘 390 字（R5a 第 4 點）計，
     180 字約 28 秒。估算：定位句約 40 字＋四個入口各約 5 字標題與 20–30 字說明，約 140–160 字，上限留一點餘裕；
     下限 60 字確保定位句與四個入口標題都在。
  5. 首頁每一句關於 Mnemo-Card 的話對到 §3 的 W 或 N 項；不得出現 §3.4 禁止類別。
  6. 首頁第一個可聚焦元素是「跳到主要內容」連結，目標為 `<main>` 的 `id`。
  7. 頁面不載入外部腳本、字型或追蹤；只有站內資源。
- **R5a 專案設計頁**（`design/`，Starlight 頁；以雙鑽石模型呈現；文案即原首頁 S3 已核對的雙鑽石文案，措辭不變）：
  1. 頁面標題（Starlight `title`，即 h1）「專案設計」；前言 `prev: false`、`next: false`。標題下一段引導句（W16），
     之後的 `h2` 恰為五個，依序：**探索（Discover）**、**定義（Define）**、**發展（Develop）**、**交付（Deliver）**、**繼續讀**。
     前四個 h2 的文字必須以「探索」「定義」「發展」「交付」開頭；確切文字寫死進 AC10。
  2. 各階段只能用下表指定的白名單項目（§3）；表內沒有的事實不得寫。雙鑽石是作者整理專案的呈現方式（W16）：
     頁面上**不放**「這是事後整理」之類的免責句（owner 2026-10-19），但任何階段都不得寫出表外、沒有出處的設計研究活動
     （例如使用者訪談、問卷、可用性測試；§3.1 W15）。引導句、「以雙鑽石整理」的句子與「繼續讀」的說明句屬 W16。

     | 階段 | 講什麼 | 可用項目 |
     | --- | --- | --- |
     | 探索 | 學習時「讀得懂」與「想得起來」的落差；從學習科學研究找方向 | W1、W8 |
     | 定義 | 把問題定義成：讀完要先自己想出來、再用自己的話解釋；一副牌組整理一個主題、四種卡拆開同一主題 | W1、W2、W3（只用第 3、4 步的意思） |
     | 發展 | 最值得談的功能：五步學一張卡、兩種提示、固定複習日程、Markdown 匯入匯出、AI 產卡技能、鍵盤操作；開發方法一段概念文字 | W2–W7、W10 |
     | 交付 | 小規模試用中；一次合成壓力測試的結果 | W9、N1、N2 |

  3. 「繼續讀」恰有兩個連結，依序到學習科學導讀、產品怎麼用。W1 不附連結。
  4. **閱讀長度（約 1 分鐘多）**：h1 加 `.sl-markdown-content` 的 `innerText` 去掉所有空白後，字元數 **250–450**（AC19）。
     不含側欄、頁首、文章目錄與上下篇。預算理由：Brysbaert (2019) 的統合分析估計中文**默讀**約每分鐘 260 詞；以該文常用的
     1.5 字＝1 詞換算，約每分鐘 390 字，所以 450 字約 1.2 分鐘（工作票 03 的 S3 核對者 2026-10-19 查證；原先「每分鐘 250–300 字」
     較可能是朗讀的字數，已刪除）。owner 2026-10-19 裁定上限約 450 字，不刪內容；下限 250 字確保五個 h2 區段平均各有約 50 字的實際內容。
     數字、英文與標點都算一個字元（量法簡單、可重現），研究只計中文字，所以時間只是近似。
- **R6 Starlight 側欄**：三個群組，依序「專案設計」（專案設計，`design/`）、「學習科學」（導讀＋六篇，順序與文件站相同）、
  「產品」（產品怎麼用），與首頁入口順序一致（文件站是外部連結，不進側欄）。
  Starlight 頁首的網站標題連到首頁（`base` 根）。側欄只有站內頁面，不放外部連結。
- **R7 學習科學搬入**：七個 `.mdx` 檔與文件站 `b2d1dc9` 的版本逐字相同，只允許以下改動：
  1. 三處連到〈第一次使用 Mnemo-Card〉的相對連結 `](../../first-use/)` 改為
     `](https://banshee0716.github.io/mnemo-card-docs/first-use/)`。用
     `grep -n "first-use" src/content/docs/learning-science/*.mdx` 在來源找到恰好三處：
     - `retrieval-practice.mdx` 第 48 行（「Mnemo-Card 怎麼用這個概念？」段末）
     - `self-explanation.mdx` 第 49 行（同上）
     - `spaced-practice.mdx` 第 51 行（同上）
  2. `kli-framework.mdx` 前言加 `next: false`（理由：新站側欄在學習科學之後接「產品」群組，Starlight 會把 KLI 的下一篇
     自動接到產品摘要頁；文件站的 KLI 是最後一頁、沒有下一篇，維持原閱讀終點）。
  其餘頁間相對連結（`../retrieval-practice/` 等）因網址結構相同，不改。上一篇／下一篇：導讀 `prev: false`（原有），
  其餘依側欄順序，KLI 無下一篇。
- **R8 產品摘要頁**（`product/`）：
  1. 標題「產品怎麼用」（側欄文字同；確切標題隨工作票 03 文案定稿）；200–500 字；`prev: false`、`next: false`。
  2. 內容：一張卡怎麼學、牌組與排程、匯入匯出與技能；每段只寫 §3 的 W 項，不寫操作步驟（步驟在文件站）。
  3. 截圖恰為 §3.2 的 S1–S4 四張，從文件站 `src/assets/screenshots/` 複製，以 `astro:assets` 的 `<Image>` 輸出 webp，
     每張有非空 `alt` 與以「圖：」開頭的 `figcaption`。
  4. 文末連到文件站的〈第一次使用 Mnemo-Card〉`first-use/`、〈之後的複習與管理〉`review-and-manage/`、
     〈認識 mnemo-study-cards〉`skills/mnemo-study-cards/`，全部為 `https://banshee0716.github.io/mnemo-card-docs/` 開頭的絕對網址。
- **R9 搜尋**：Starlight 內建 Pagefind，索引九個 Starlight 頁（專案設計、導讀、六篇、產品摘要）。**首頁不進索引**。
  理由：（1）首頁只有導覽，每句都是其他頁的摘要，進索引只會讓搜尋多一筆重複的結果；（2）成果數字在專案設計頁，
  有完整的測試條件上下文；（3）首頁不是 Starlight 頁，沒有 `data-pagefind-body`，不進索引是預設行為，不需額外設定。
  搜尋框只在 Starlight 頁頁首。
- **R10 部署**：`.github/workflows/deploy.yml` 照文件站：觸發 push `main` 與 `workflow_dispatch`；`runs-on: ubuntu-24.04`；
  `npm ci` → `npm run build` → `npx playwright install --with-deps chromium` → `npm test`（`CI: true`）全部通過才
  `actions/upload-pages-artifact`（`path: dist/`）並由 `actions/deploy-pages` 部署；權限只有 `contents: read`、
  `pages: write`、`id-token: write`；`concurrency` 群組 `pages`、不取消進行中；不用任何 secret、不用 `pull_request_target`；
  action 主版本與文件站相同。工作流與 `astro.config.mjs` 的 `base` 都是 `/mnemo-card-portfolio`。
- **R11 公開衛生腳本**：`scripts/check-public.mjs` 沿用文件站的機制：掃描 HEAD 可達的每一個提交的檔案內容、
  提交者身分（只能是本儲存庫的 noreply 地址）、提交訊息；圖片不當文字掃；`package-lock.json` 只查憑證與電子郵件；
  腳本目前版本的每一行視為可信。改動：
  1. `ALLOWED` 為空陣列 `[]`。
  2. 允許的 harness 目錄只有 `portfolio-site`。
  3. 依 §3.3 F1、F2 類別新增樣式（字樣只寫在腳本內；本規格與工作票不寫具體字樣，因為它們會被掃描）。
  4. `.gitignore` 的環境檔規則寫成 `[.]env*`（gitignore 的方括號樣式，比對以點開頭、接 env 的檔名），使允許清單能維持空的。
  `package.json` 腳本 `check:public` 執行它。
- **R12 測試**：Playwright 只用 chromium，`webServer` 為 `npm run build && npm run preview -- --port <port> --ignore-lock`，
  埠預設 4398（`PLAYWRIGHT_PORT` 可改，不與文件站的 4399 相同），`baseURL` 含 `base`。改寫文件站的測試，不照搬：
  頁面清單 `tests/helpers.ts` 的 `PAGES` 恰為 §0 的十頁；輔助函式（爬連結、axe、主題）可從文件站改寫。

## 2. 限制

- **K1**：不修改文件站與主程式儲存庫的任何檔案（讀取核對除外）。文件站刪除學習科學區是第二個切片。
- **K2**：公開儲存庫規則見 `AGENTS.md`；提交者身分只用 noreply；每次提交前跑 `npm run check:public`（工作票 01 之後）。
- **K3**：對外動作需 owner 授權：建立 GitHub 遠端、push、Pages 設定、第一次部署。G7 之前不推。

## 3. 公開白名單（品質線）

規則：

- 網站上（首頁、專案設計頁、產品摘要頁、Starlight 標題與描述）關於 Mnemo-Card 的每一句話都要對到下表一個項目，並只能說到該項
  「可寫的內容」為止；改寫措辭可以，加內容不行。學習科學七頁沿用文件站已過核對的正文，不重審，但不得新增句子。
- 狀態欄：**已核可**＝owner G1 已明示或內容已在文件站／產品首頁公開；**待 owner 確認**＝Builder 提案，工作票 03 送 owner
  時逐項勾選，沒勾的不上站；**待 owner 提供**＝缺數值或資料，owner 給值前不上站。
- 出處欄只寫公開來源或私有來源的描述與日期；私有檔案路徑由 Builder 在 G2 審查 packet 中提供，不提交。

### 3.1 問題、功能與方法（W）

| # | 可寫的內容 | 出處 | 狀態 |
| --- | --- | --- | --- |
| W1 | 問題：「看過，不等於記得」——讀得懂不代表之後想得起來；答案就在眼前時，人容易高估自己之後想得起來的程度（Koriat & Bjork, 2005）。首頁只寫作者與年份、**不附連結**（Builder：避免打亂 AC7 的 Tab 順序）；DOI 只出現在學習科學頁。 | 產品首頁公開文案（hero 標題、「二十秒小實驗」段與其研究依據） | 已核可 |
| W2 | 一副牌組整理一個主題；用四種卡片拆開同一個主題：基礎概念卡、深入解析卡、關聯整合卡、範例應用卡。不把不同牌組的卡混成一次學習。 | 文件站〈第一次使用〉、〈認識 mnemo-study-cards〉 | 已核可 |
| W3 | 學一張卡分五步：讀正面 → 翻面讀概述 → 照「檢索提示」憑記憶說出要點再對照 → 照「自我解釋提示」用自己的話和例子說明 → 依對照前想出多少評熟悉度（1–5，可按數字鍵）。 | 產品首頁「一張卡，分五步學」；文件站〈第一次使用〉 | 已核可 |
| W4 | 學習畫面一次一張卡，可以只用鍵盤操作。 | 文件站〈第一次使用〉快捷鍵段 | 已核可 |
| W5 | 每副牌組可排定固定的複習日程，兩種：「遺忘曲線」依序隔 1、3、7、14、30 天，共 5 次；「每週等間隔」每 7 天一次，共 8 次。日程固定、不依評分調整，不宣稱是最佳或個人化排程。 | 文件站〈間隔練習〉產品段、〈第一次使用〉 | 已核可 |
| W6 | 牌組可以 Markdown 檔匯入（匯入前先預覽哪些卡可匯入、哪些有警告）與匯出。 | 文件站〈之後的複習與管理〉第 5 節 | 已核可 |
| W7 | mnemo-study-cards 是一個 AI 技能，協助把一份來源整理成可匯入 Mnemo-Card 的四種卡片；理解、回想與解釋仍由學習者自己完成。 | 文件站首頁、〈認識 mnemo-study-cards〉 | 已核可 |
| W8 | 設計參考學習科學研究（檢索練習、間隔練習、自我解釋、建構性檢索等），連到本站學習科學分區；研究是設計依據，不是 Mnemo-Card 學習成效的證明。 | 文件站學習科學各篇產品段；產品首頁研究依據 | 已核可 |
| W9 | 介面為繁體中文；目前是小規模試用，帳號由管理者建立，不開放公開註冊。 | 產品首頁「目前為小規模試用」；登入卡「請聯絡管理員」 | 已核可 |
| W10 | 開發方法一段文字（只講概念，不點名任何工具或模型品牌）：每個功能先寫下要解決的問題並由 owner 核可，再寫規格與工作票；規格先經獨立審查；實作以測試驗證，寫程式的人不自己宣告完成，由另一個全新的工作階段或另一個 AI 模型審查；發布前由 owner 親自驗收。 | owner G1 裁定 8（「開發方法只用一段文字講概念」）；做法即本儲存庫 `AGENTS.md` 工作方式 | 已核可 |
| W11 | ~~點名 AI 工具名稱~~ | — | **不核可**（owner D3）：開發方法段不寫工具名稱 |
| W12 | 頁尾署名：只放 GitHub 個人頁連結 `https://github.com/banshee0716`，連結文字「GitHub：banshee0716」；不放作者姓名、不放電子郵件。 | owner D4，2026-10-19 再裁定不放姓名 | 已核可 |
| W13 | ~~連到產品正式站~~ | — | **不核可**（owner D2）：不連產品正式站；`check:public` 允許清單維持空的 |
| W14 | ~~連到本網站的 GitHub 儲存庫~~ | — | **不核可**（owner D5） |
| W16 | 框架與導覽句：導覽首頁的定位句與四個入口說明句、專案設計頁的 description，以及專案設計頁的引導句、「以雙鑽石整理」的句子與「繼續讀」說明句。可概括 W1–W10、N1、N2 與 S1–S4 已核可的內容，不加新事實；不放事後整理的免責句。 | owner 2026-10-19（範圍隨首頁改為導覽頁調整，S3 2026-10-19 建議） | 已核可 |
| W15 | 表外的設計研究活動（使用者訪談、問卷、可用性測試、試用者回饋等），若雙鑽石的探索或交付階段要寫。 | 無出處 | **待 owner 提供**（有出處才寫；沒有就不寫，階段只用 R5 表內項目） |

### 3.2 產品畫面（S）

只用文件站已公開、以示範帳號拍攝的截圖（文件站 slice 5，2026-10-19）；不新拍、不用其他圖。

| # | 檔案（文件站 `src/assets/screenshots/`） | 畫面 | 狀態 |
| --- | --- | --- | --- |
| S1 | `first-use-02-home.png` | 第一次登入後的首頁 | 已核可（owner D5） |
| S2 | `first-use-06-study-back.png` | 學習畫面背面：概述、檢索提示、自我解釋提示 | 已核可（owner D5） |
| S3 | `first-use-08-scheduled-deck.png` | 建立排程後的牌組（遺忘曲線、已完成 0/5） | 已核可（owner D5） |
| S4 | `review-04-import.png` | 匯入頁四個步驟 | 已核可（owner D5） |

### 3.3 成果數字（N）

數字一律寫出測試條件（合成負載、日期、單次），並註明「不是容量保證」。

| # | 可寫的內容 | 出處 | 狀態 |
| --- | --- | --- | --- |
| N1 | 2026 年 9 月的一次合成壓力測試：模擬 300 名同時使用者，學習作答的送出請求有 95% 在約 350 毫秒內完成，零錯誤。這是單次測試的結果，不是容量保證。 | 主程式私有儲存庫：壓力測試實驗報告（2026-09-19）結論第 1 點；同日 300 人一輪的門檻表「作答送出 p95 = 350 ms、5xx = 0、4xx = 0」 | 已核可，措辭限「學習作答的送出請求」（owner D1′；證據只涵蓋作答送出請求，同一輪第一分鐘的頁面載入未達門檻，不得寫成「所有請求」） |
| N2 | 同一測試環境、同樣只看學習作答的送出請求：「改版前約 150 名同時使用者時，作答送出的回應時間就持續惡化到數秒以上；改版後在 300 名時仍維持約 350 毫秒」。 | 同上報告結論第 1 點 | 已核可（owner 2026-10-19 核可此事實改寫）；不寫改了什麼內部機制 |
| N3 | ~~自動化測試數量~~ | — | **不核可**（owner D5）：不上站 |
| N4 | ~~試用規模~~ | — | **不寫**（owner D5） |

不在白名單、也不得上站的數字：正式資料庫的任何計數（卡片數、帳號數等）、內部規模目標、費用與方案等級、
請求量或流量統計、任何學習成效數字。

### 3.4 禁止類別（F）

網站內容、提交訊息與本儲存庫所有檔案都不得出現（F1、F2 的具體字樣由 `check:public` 檢查，R11）：

- **F1 主機位置**：任何雲端區域、城市、國家、資料中心名稱。
- **F2 後端與服務名稱**：託管平台、資料庫、身分驗證、寄信、監控等服務的產品名稱、方案等級、專案識別碼與內部網址
  （本站網址與文件站網址除外）。
- **F3 資料庫結構**：資料表、欄位、函式、權限規則、遷移編號、查詢內容。
- **F4 內部文件**：主程式的檔名、路徑、切片名稱、審查原文、finding 編號、commit SHA、CI 執行編號、交接或規劃文件內容。
  （本儲存庫自己的治理文件不受此限，但同樣不得引用主程式的上述項目。）
- **F5 憑證與設定**：金鑰、權杖、環境變數名稱與值。
- **F6 受試者與使用者資料**：真實帳號、電子郵件、姓名、學習紀錄、任何個別使用者的資料；截圖只用 §3.2。
- **F7 安全細節**：安全機制的實作方式、已知弱點、殘留風險、事故經過。
- **F8 成效宣稱**：「Mnemo-Card 能提升／證實／保證……」等學習成效說法。
- **F9 未公開規劃**：路線圖、待辦、之後要做的功能（另開切片決定）。

## 4. 測試接縫

- **S1 建置**：`npm run build` exit 0；`dist/` 恰有十個頁面的 `index.html`（不含 404）與 `dist/pagefind/`。
- **S2 Playwright**：`tests/` 內，對 `npm run preview`（含 `base`）執行，只用 chromium。
- **S3 白名單核對**：首頁、專案設計頁與產品摘要頁的文案（工作票 03 的 `copy/*.md`）以及上站後的頁面文字，由全新工作階段的 opus 子代理
  逐句核對，作者不自驗。產出公開報告 `docs/harness/portfolio-site/verification/whitelist-<page>.md`：逐句表格
  「句子 → W／S／N 項編號 → PASS／FAIL」，另列 §3.4 每一類 PASS／FAIL；專案設計頁另判 R5a 第 2 點（每個雙鑽石階段只用表內項目、沒有寫出無出處的研究活動）並查證 R5a 第 4 點的閱讀速度出處（作者、年份、數值、默讀或朗讀、單位是漢字還是全部字元；可能是 IReST，Trauzettel-Klosinski & Dietz, 2012，而非 Brysbaert, 2019）。報告只寫網站上的公開句子與項目編號。專案設計頁的句子已在原首頁報告（`verification/whitelist-home.md`，2026-10-19）核對過；搬頁後只核新增或改動的句子，另寫 `verification/whitelist-design.md`；新的導覽首頁全部重核，另寫 `verification/whitelist-home-nav.md`（不改已提交的報告）。
- **S4 線上冒煙**（G7 時，由 owner 授權）：`curl -s -o /dev/null -w '%{http_code}'` 對十頁、`pagefind/pagefind.js`、
  以及頁面上每個文件站網址都回 200。

## 5. 驗收條件

- **AC1**（S1）：乾淨 clone 上 `npm ci && npm run build` exit 0；`find dist -name index.html -not -path '*/404/*' | wc -l` 輸出 `10`；
  `dist/pagefind/pagefind.js` 存在；依賴版本符合 R1（`package.json` 無 `^`／`~`）。
- **AC2**：十頁在 `base` 之下回 200、`<html lang="zh-TW">`、`<title>` 非空且符合工作票 03 定稿。（Playwright，全部 `PAGES`）
- **AC3**：從十頁出發爬所有站內 `href`／`src`，全部回 200、都在 `base` 之下；跨頁錨點對應到存在的 `id`。（Playwright）
- **AC4**：375px 寬度下十頁都沒有橫向捲動（`scrollWidth <= clientWidth`）。（Playwright）
- **AC5**：十頁在淺色與深色主題下，axe 沒有 serious 或 critical 違規。（Playwright；首頁以 `localStorage` 的 `starlight-theme` 切換）
- **AC6**：介面文字是繁體：Starlight 頁出現「搜尋」且沒有「搜索」；沿用文件站的英文落回字串檢查。（Playwright）
- **AC7 鍵盤**（Playwright）：
  1. 首頁：第一次 Tab 聚焦「跳到主要內容」，Enter 後焦點移入 `<main>`；之後連續 Tab 依序走到四個入口連結，再到頁尾的 GitHub 連結；
     每個聚焦中的連結 `outline-style` 不是 `none`（或有可見的 `box-shadow`）。
  2. Starlight 頁：第一次 Tab 聚焦跳轉連結；桌機寬度 Tab 能走到側欄文章連結；手機寬度 Enter 打開選單、Tab 到側欄連結、Esc 關閉；
     能用鍵盤打開搜尋；手機寬度文章目錄能用鍵盤展開。
- **AC8 樣式共用**（Playwright＋grep）：首頁 `--mc-accent` 的計算值等於任一 Starlight 頁 `--sl-color-accent` 的計算值，
  淺色與深色各比一次；`grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(' src/pages src/styles/home.css` 沒有輸出；
  R3 第 1 點：`grep -rnE -e '--mc-[a-z-]+[[:space:]]*:' src | grep -v '^src/styles/tokens.css:'` 沒有輸出（`--mc-*` 只在 `tokens.css` 定義）。
- **AC9 首頁主題**（Playwright）：`localStorage` 設 `starlight-theme=dark` 時首頁 `data-theme="dark"`；設 `light` 時為 `light`；
  未設時跟隨模擬的 `prefers-color-scheme`。
- **AC10 首頁與專案設計頁結構**（Playwright）：
  1. 首頁：`h1` 恰一個；`main` 內 `h2` 恰四個，文字依序等於工作票 03 定稿（專案設計、學習科學導讀、產品怎麼用、操作文件），
     每個 `h2` 內恰一個連結，依序指向 `design/`、`learning-science/`、`product/`、`https://banshee0716.github.io/mnemo-card-docs/`；
     頁面沒有任何指向產品正式站的連結（owner D2）；沒有 `<script src>` 指向站外、沒有站外 `<link rel="stylesheet">`。
  2. 專案設計頁：h1 為「專案設計」；`.sl-markdown-content` 內 `h2` 清單**完全等於**工作票 03 定稿、依序，前四個依序以「探索」「定義」「發展」「交付」開頭；
     「繼續讀」恰兩個連結，依序到 `learning-science/`、`product/`；沒有上一篇／下一篇；沒有指向產品正式站的連結。
- **AC11 首頁不進搜尋**：`grep -c 'data-pagefind-body' dist/index.html` 輸出 `0`；Playwright 在 Starlight 頁搜尋首頁獨有的一句
  （工作票 03 定稿時指定）沒有任何結果指向根路徑。
- **AC12 搜尋**（Playwright）：搜「檢索練習」有一筆結果路徑（去掉 `#`）完全等於 `learning-science/retrieval-practice/`；
  搜「認知負荷」對應認知負荷頁；搜工作票 03 指定的一個產品摘要頁詞，有一筆對應 `product/`；搜工作票 03 指定的專案設計頁詞，有一筆對應 `design/`。
- **AC13 學習科學搬入**：
  1. 對七檔逐一 `diff <(git -C ~/code/mnemo-card-docs show b2d1dc9:src/content/docs/learning-science/<檔>) src/content/docs/learning-science/<檔>`：
     `retrieval-practice`、`self-explanation`、`spaced-practice` 各恰一行不同（R7 第 1 點的連結）；`kli-framework` 恰多一行 `next: false`；
     其餘三檔無差異。
  2. `grep -rn '\.\./\.\./first-use' src/content/docs/learning-science/` 沒有輸出；
     `grep -rc 'https://banshee0716.github.io/mnemo-card-docs/first-use/' src/content/docs/learning-science/` 加總為 `3`。
  3. Playwright：沿用文件站 AC19–AC24 的學習科學斷言並改寫到新站：側欄「學習科學」群組依 R6 順序；各頁 h2 清單鎖定
     （與文件站相同）；參考文獻 3–7 筆且都有外部連結、延伸閱讀 1–2 筆；上一篇／下一篇依 R7（KLI 無下一篇）；
     三篇產品段的〈第一次使用〉連結 `href` 等於文件站絕對網址。
- **AC14 側欄**（Playwright）：群組依序「專案設計」「學習科學」「產品」；只有站內連結；首頁不在側欄；頁首網站標題連結指向 `base` 根。
- **AC15 產品摘要頁**（Playwright）：恰四張 `<img>`，每張 `alt` 非空、`src` 為 webp、有以「圖：」開頭的 `figcaption`；
  頁內連到文件站的三個連結 `href` 依 R8 第 4 點；沒有上一篇／下一篇；內容區沒有程式碼區塊。
- **AC16 公開衛生**：`npm run check:public` exit 0、沒有命中；`grep -n "const ALLOWED = \[\];" scripts/check-public.mjs` 有一行；
  `git log --format='%ae%n%ce' | sort -u` 只輸出本儲存庫的 noreply 地址；`git log --all --name-only --format= | grep -iE '\.(pdf|env)$'` 沒有輸出；
  R11 第 2 點：`grep -n "HARNESS_OK = new Set(\['portfolio-site'\])" scripts/check-public.mjs` 恰一行；
  R11 第 4 點：`grep -nxF '[.]env*' .gitignore` 恰一行，且 `git check-ignore -q "$(printf '.%s' env.local)"` exit 0。
- **AC17 白名單**：S3 報告（導覽首頁、專案設計頁的新增句、產品摘要頁，以及原首頁報告涵蓋的搬移句）沒有未處理的 FAIL；所有上站句子對到的項目狀態都是「已核可」或 owner 已勾選。
- **AC18 部署與設定**：工作流符合 R10（閱讀核對：觸發、權限三項、無 secret、測試通過才部署、`base` 一致）；G7 時 push 後部署成功、S4 全部 200。
  R2 設定核對：`grep -c 'lastUpdated: false' astro.config.mjs` 輸出 `1`；`grep -c 'editLink' astro.config.mjs` 輸出 `0`（未設定即不顯示編輯連結）；
  `grep -cE '^[[:space:]]*components:' astro.config.mjs` 輸出 `0`（沒有覆寫元件）。
- **AC19 閱讀長度**（Playwright；字元數都是 `innerText` 去掉所有空白 `/\s/g` 後計）：
  1. 專案設計頁：h1 加 `.sl-markdown-content` 的字元數在 250–450 之間（R5a 第 4 點：中文默讀約每分鐘 390 字，Brysbaert, 2019，450 字約 1.2 分鐘；不含側欄、頁首、文章目錄、上下篇）。
  2. 首頁：`main` 的字元數在 60–180 之間（R5 第 4 點；`h1` 計入，`footer` 與跳到主要內容連結不計入）。
- **AC20 頁尾與佔位**：`grep -rn '待 owner 提供' src/` 沒有輸出；Playwright：首頁 `footer` 內恰有一個連結，`href` 為 `https://github.com/banshee0716`、
  文字為「GitHub：banshee0716」，`footer` 文字不含「待 owner」（首頁部分屬工作票 04）。十頁都沒有 `mailto:` 連結：寫在 `tests/site.spec.ts` 的 `PAGES` 迴圈內，屬工作票 05（十頁到齊時）。

## 6. owner 裁定（2026-10-19，取代原待決清單）

- **首頁改為導覽頁**（owner 2026-10-19，看過雙鑽石首頁定稿後）：產品自己的首頁已介紹功能，作品集首頁只負責連結與引導；
  一句定位＋四個入口（專案設計、學習科學導讀、產品怎麼用、操作文件）；頁尾不變；仍不連產品正式站。雙鑽石文案原文搬到
  `design/`（R5a）。頁面總數改為十頁。本條取代下方「首頁方向」一條中關於首頁的部分。

- **D1 網站名稱**：「Mnemo-Card portfolio」（Starlight `title` 與首頁 `<title>`）。
- **D1′ N1 措辭**：「學習作答的送出請求」。
- **D2 產品連結**：不連產品正式站；`check:public` 允許清單維持空的。
- **D3 工具名稱**：不點名 AI 工具；開發方法段不提工具。
- **D4 署名**：只放 GitHub 個人頁連結（連結文字「GitHub：banshee0716」），不放作者姓名、不放電子郵件（2026-10-19 取代原「作者姓名＋連結」）。
- **D5**：核可 N1、N2、S1–S4；不核可 N3、W14；N4 不寫。
- **首頁方向**：改為「1 分鐘了解專案特色」，以雙鑽石模型（探索 → 定義 → 發展 → 交付）呈現，最後分支到學習科學與產品摘要頁（R5）。

仍待 owner 提供：若要在雙鑽石寫任何設計研究活動，需提供出處（W15），否則不寫。

## 7. 之後的事（不在本切片）

- 第二個切片（文件站儲存庫）：刪除學習科學區、側欄與測試同步（intent 裁定 9）。
- 開發規劃頁、主程式首頁加本站連結、兩個儲存庫定期封存。
