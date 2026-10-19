# AGENTS.md

Mnemo-Card 的公開作品集網站：Astro 靜態建置（自訂首頁＋Starlight 文章頁），GitHub Actions 部署到 GitHub Pages，
網址 `https://banshee0716.github.io/mnemo-card-portfolio/`。
本檔是給 Claude Code 與 Codex 的工作規則；`CLAUDE.md` 匯入本檔，兩者不得分歧。

**這是公開儲存庫。** 內容與全部 Git 歷史任何人都看得到。不得提交：金鑰、環境變數、私人操作手冊、
Mnemo-Card 主程式的內部架構或安全細節（主機位置、後端或服務名稱、資料庫結構）、內部文件或審查原文、
受試者資料或真實帳號。截圖只能用示範資料。網站上能寫的內容只限 `spec.md` 的公開白名單。
提交者身分一律用全域設定的 GitHub noreply 地址，不得以 `-c user.email` 覆寫（個人信箱會隨歷史公開）。

## 現在在哪

- 唯一的即時狀態：`docs/harness/portfolio-site/state.md`（階段、持有者、閘門、下一步）。
  動手前先讀；尊重 `holder:` 與階段。
- 意圖與 owner 裁定：`docs/harness/portfolio-site/intent.md`。規格（含公開白名單）：`spec.md`。工作票：`tickets/`。

## 工作方式

1. **全程繁體中文**回覆 owner，少夾英文術語。
2. **閘門**：owner 只管 G1（意圖）、G5（驗收）、G7（發布）。其餘由 Builder 自決並記在
   `state.md` § Decisions by Builder，行首寫 `Builder:`。新的產品行為（讀者看到的內容、範圍）一律先問 owner。
3. **審查（LOW 輕量流程，owner 裁定）**：規格與工作票由全新工作階段的 opus 一次合審，修完不複審；
   完工後任務審查與程式審查合成**一輪 Codex**，在本儲存庫內執行；Codex 的 P1 修完由全新 opus 確認關閉。
4. **作者不自驗。** 驗證由全新工作階段的子代理，或貼出輸出的指令完成。測試紅燈都是真失敗。
5. **不編造。** 成果數字、功能、學習效果，查不到出處就不寫；白名單標「待 owner 提供」的項目在 owner 給值前不上站。
6. **子代理**：不得派 `fable`。預設實作 `sonnet`，需要判斷的工作用 `opus`。大量閱讀交給子代理。
7. **對外動作**（push、建立或改 GitHub 設定、Pages 設定、DNS）先問 owner，除非 owner 已明確授權該次動作。
8. **開發環境**：WSL2 Ubuntu，`~/code/mnemo-card-portfolio`，Node 24。`.npmrc` 設 `ignore-scripts=true`
   與 `save-exact=true`；依賴一律鎖定精確版本；不用 npm `pre*`／`post*` 生命週期腳本。

## 事實來源（本機，唯讀）

- 文件站（公開）：`~/code/mnemo-card-docs`，網址 `https://banshee0716.github.io/mnemo-card-docs/`。
  學習科學文章的搬入來源；操作文件只在那裡，本站只放摘要並連過去。
- Mnemo-Card 主程式：owner 本機的私有儲存庫（與本儲存庫同在 `~/code/` 之下）。可以讀來核對，
  但它的名稱、路徑與內部細節都不寫進本儲存庫（`check:public` 會擋）。

## 指令（工作票 01 建立後生效）

```bash
npm ci                              # 依 package-lock.json 安裝（ignore-scripts 生效）
npx playwright install chromium     # 第一次跑測試前安裝瀏覽器
npm run dev       # 本機預覽（搜尋只在正式建置可用）
npm run build     # 靜態建置，產生 dist/ 與 Pagefind 索引
npm run preview   # 以 base 路徑預覽建置結果：http://localhost:4321/mnemo-card-portfolio/
npm test          # Playwright：自動建置並啟動 preview，檢查九頁的連結、手機寬度、鍵盤、無障礙、搜尋
npm run check:public  # 掃描每個提交的公開衛生（內部細節、憑證、個人信箱、提交者身分）；推送前必跑
```

測試涵蓋的頁面清單在 `tests/helpers.ts` 的 `PAGES`；新增頁面時加進去。
Astro 偵測到 AI 代理時會把 `astro preview` 自動放到背景；要前景執行請加 `--ignore-lock`。
