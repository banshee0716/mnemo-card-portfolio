# 01：專案骨架、共用樣式、測試框架、部署工作流與公開衛生腳本（端到端打通）
contract-freezing: yes（`site`／`base`、`tokens.css` 變數名、`PAGES` 與測試輔助函式形狀、工作流形狀；後續票沿用）
depends-on: []

## 要做什麼

spec R1、R2、R3、R4、R10、R11、R12、K2、K3。本票不推送。

1. 依 R1 建立 Astro＋Starlight 專案（版本照文件站 `package.json` 精確版本），寫 `.npmrc`、`engines`、
   `dev`／`build`／`preview`／`test`／`check:public` 腳本、`.gitignore`（環境檔規則依 R11 第 4 點）、`README.md`（兩三句：這是什麼）。
2. `astro.config.mjs`：`site`、`base: '/mnemo-card-portfolio'`、根語系 `zh-TW`、Logo、`customCss`、關閉 `editLink`／`lastUpdated`。
   網站名稱「Mnemo-Card portfolio」（owner D1）。
3. 依 R3 建 `src/styles/tokens.css`、`src/styles/custom.css`；複製 `src/assets/logo.svg`、`src/content/i18n/zh-TW.json`。
4. 首頁暫置：`src/pages/index.astro` 只有 `h1`「Mnemo-Card portfolio」、一句「網站建置中」、跳到主要內容連結、R4 主題腳本，
   只用 `tokens.css`。不放任何 §3 以外的內容。
   另放一頁暫置 Starlight 頁 `src/content/docs/learning-science/index.mdx`（標題「學習科學導讀」、一句「建置中」），
   讓 Starlight 與 Pagefind 在本票就能建置；02 以搬入的正式檔取代。側欄「學習科學」群組暫時只列這一頁。
5. `playwright.config.ts`（R12，埠 4398）、`tests/helpers.ts`（`BASE`、`PAGES`、爬連結、axe、主題輔助）、`tests/site.spec.ts`
   對 `PAGES` 跑 AC2、AC3、AC4、AC5、AC6；先只有首頁一項。
6. `.github/workflows/deploy.yml` 依 R10。
7. `scripts/check-public.mjs` 依 R11（`ALLOWED = []`、harness 目錄只允許 `portfolio-site`、新增 F1／F2 樣式）。
   新樣式寫好後跑一次，確認歷史中的每個提交都乾淨。
8. `AGENTS.md`「指令」段與實際腳本一致。

## 測試接縫

S1、S2（首頁暫置頁）。

## 驗收條件

- [ ] AC1 前半：`rm -rf node_modules dist && npm ci && npm run build` exit 0，`dist/pagefind/` 存在（由暫置 Starlight 頁產生索引）
- [ ] `npm test` 全綠（首頁與暫置頁的 AC2–AC6）
- [ ] AC16：`npm run check:public` exit 0；`grep -n "const ALLOWED = \[\];" scripts/check-public.mjs` 有一行；`git log --format='%ae%n%ce' | sort -u` 只有 noreply
- [ ] 變異：在本機暫存分支提交一個含 F2 樣式字樣的檔案（永不推送），`node scripts/check-public.mjs <該分支>` exit 1；切回 `main` 後 `npm run check:public` exit 0；之後刪除該暫存分支，並確認 `git branch -a` 不再列出它
- [ ] AC18 前半：工作流閱讀核對（觸發、三項權限、無 secret、測試通過才部署、`base` 一致）

示範：`npm run preview` 後開 `http://localhost:4321/mnemo-card-portfolio/`，看到暫置首頁。
