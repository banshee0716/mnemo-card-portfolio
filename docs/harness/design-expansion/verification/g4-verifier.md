# G4 驗證報告：design-expansion

- 日期：2026-10-19
- 驗證者：全新工作階段的子代理（作者不自驗）；沒有修改儲存庫內任何既有檔案。
- 環境：WSL2 Ubuntu、Node v24.21.0；在工作階段暫存區做乾淨 clone（`git clone <本儲存庫> <工作階段暫存區>/g4-clone`）。
- clone HEAD：`378c7a466f1a32bd055ddbd3a55f1a676b28de0f`（與預期 378c7a4 相同）。
- 依據：design-expansion `spec.md` §4、§5；portfolio-site `spec.md` §5（被沿用的 AC）；`state.md`；工作票 01–03；
  `verification/whitelist-design-pages.md`。
- 註：本機 shell 的 `grep` 是包裝過的函式（會套用忽略檔規則），所以下列 grep 一律以 `command grep` 執行，結果等同 GNU grep。

## 1. 建置、測試、公開衛生（乾淨 clone）

| 指令 | 結果 |
| --- | --- |
| `npm ci` | exit 0 |
| `npm run build` | exit 0；`14 page(s) built`（含 404）；Pagefind `Found 14 HTML files` |
| `find dist -name index.html -not -path '*/404/*' \| wc -l` | `13` |
| `ls dist/pagefind/pagefind.js` | 存在（45,555 bytes） |
| `npx playwright install chromium` | 已安裝，exit 0 |
| `PLAYWRIGHT_PORT=4397 npm test` | exit 0；**214 passed**（42.5s），0 failed、0 flaky |
| `npm run check:public` | exit 0；`check-public: 乾淨，掃描 29 個提交` |

`dist/` 的十三頁：首頁、`design/`、`design/problem/`、`design/decisions/`、`design/engineering/`、`learning-science/` 與六篇文章、`product/`。
`tests/helpers.ts` 的 `PAGES` 恰列這十三頁；`site.spec.ts` 的 PAGES 迴圈：AC2、AC3、AC4、AC6、AC20 各 13 項，AC5 26 項（淺色＋深色），共 91 項全過。

## 2. 逐條驗收

| AC | 方法 | 指令或測試 | 結果 | 證據摘要 |
| --- | --- | --- | --- | --- |
| AC1′ | 指令 | `npm ci && npm run build`；`find dist -name index.html -not -path '*/404/*' \| wc -l`；`ls dist/pagefind/pagefind.js`；`command grep -nE '"[\^~]' package.json`；`command grep -c noto-serif package.json package-lock.json` | PASS | build exit 0；`13`；pagefind.js 存在；`^`／`~` 無輸出；`package.json:0`、`package-lock.json:0` |
| AC2 | Playwright | `site.spec.ts` › 各頁 › `AC2：回 200、lang 為 zh-TW、標題正確` | PASS | 13／13 |
| AC3 | Playwright | `site.spec.ts` › 各頁 › `AC3：站內連結與資源都在 base 之下且回 200` | PASS | 13／13（含三篇新頁連到學習科學與互連的相對連結） |
| AC4 | Playwright | `site.spec.ts` › `AC4：375px 寬度沒有橫向捲動` | PASS | 13／13 |
| AC5 | Playwright | `site.spec.ts` › `AC5：淺色／深色主題沒有 serious／critical 無障礙違規` | PASS | 26／26 |
| AC6 | Playwright | `site.spec.ts` › `AC6：介面文字為繁體中文` | PASS | 13／13 |
| AC7 | Playwright | `home.spec.ts:38` 首頁鍵盤順序；`navigation.spec.ts:54/64/70/81/91`（跳轉連結、桌機側欄、手機選單、搜尋、手機目錄） | PASS | 首頁 1 項；Starlight 12 頁 × 5 項 = 60 項全過（含三篇新頁） |
| AC8 | Playwright＋grep | `home.spec.ts:58` light／dark；`command grep -rnE '#[0-9a-fA-F]{3,8}\b\|rgba?\(' src/pages src/styles/home.css`；`command grep -rnE -e '--mc-[a-z-]+[[:space:]]*:' src \| command grep -v '^src/styles/tokens.css:'` | PASS | 2 項全過；兩個 grep 都無輸出（exit 1） |
| AC9 | Playwright | `home.spec.ts:69/72/77` › AC9 首頁主題（dark、light、未設跟隨系統 dark／light） | PASS | 4 項全過 |
| AC10′ | Playwright | `design.spec.ts:95` 總覽頁 h1／h2／繼續讀五連結／無上下篇；`:122` 三篇 h1 與 h2 清單、只有允許的外部連結；`:138` 參考文獻每筆 doi.org；`:150` 問題定義表格四欄三列；`:158` 工程實作繼續讀兩連結；`:166` 第 3 點上下篇 | PASS | 8 項全過。另 `git diff 57b9527 HEAD -- src/content/docs/design.mdx` 只在「繼續讀」前加三行，雙鑽石四段與引導句未改（R2） |
| AC11 | grep＋Playwright | `command grep -c 'data-pagefind-body' dist/index.html`；`home.spec.ts:85` | PASS | `0`；搜尋首頁獨有句不指向根路徑 |
| AC12′ | Playwright | `search.spec.ts:17` › 搜「檢索練習」「認知負荷」「匯入」「雙鑽石」「知識組件」「技術選型」「知識管理工具」 | PASS | 7 項全過，各對應 `learning-science/retrieval-practice/`、`cognitive-load/`、`product/`、`design/`、`design/decisions/`、`design/engineering/`、`design/problem/` |
| AC13 | diff＋grep＋Playwright | 對七檔 `diff <(git -C <文件站> show b2d1dc9:src/content/docs/learning-science/<檔>) src/content/docs/learning-science/<檔>`；`command grep -rn '\.\./\.\./first-use' src/content/docs/learning-science/`；`command grep -rc 'https://banshee0716.github.io/mnemo-card-docs/first-use/' …` 加總；`learning-science.spec.ts` 全部 | PASS | retrieval-practice、self-explanation、spaced-practice 各恰一行改（`48c48`／`49c49`／`51c51`，`../../first-use/` → 文件站絕對網址）；kli-framework 恰多 `next: false`；cognitive-load、generative-learning、index 無差異；第一個 grep 無輸出；加總 `3`；Playwright 23 項全過。本切片沒有提交改動學習科學檔（最後一次改動 `8fe84fd` 早於本切片，K2） |
| AC14′ | Playwright | `navigation.spec.ts:19` › 側欄（AC14）›「學習科學」群組依 R6 順序（內含 AC14′ 斷言）；`:38` 只有站內連結、首頁不在側欄、網站標題連到 base | PASS | 群組依序「專案設計」「學習科學」「產品」；「專案設計」恰四連結「專案設計」「問題定義」「設計決策」「工程實作」，`href` 依 R3 |
| AC15 | Playwright | `product.spec.ts:10`、`:23`、`:40` | PASS | 3 項全過 |
| AC16′ | 指令（逐條） | 見下方 §3 | PASS | 全部條目符合 |
| AC17′ | 閱讀報告 | `verification/whitelist-design-pages.md` §8–§10 | PASS | 首輪 5 項 FAIL（L1、L2、L3 說法、E6、E11）已改並在 §9 重核 PASS；§10「沒有未處理的 FAIL」；L1–L3 書目 PASS、說法重核 PASS；F1–F9 全 PASS。原 spec AC17 的既有報告不受本切片影響 |
| AC18（設定核對） | 閱讀＋grep | 閱讀 `.github/workflows/deploy.yml`；`command grep -c 'lastUpdated: false' astro.config.mjs`；`command grep -c 'editLink' astro.config.mjs`；`command grep -cE '^[[:space:]]*components:' astro.config.mjs` | PASS | 觸發 push main＋workflow_dispatch；權限 `contents: read`、`pages: write`、`id-token: write`；無 secret；`npm test` 在 upload 之前、deploy `needs: build`；`base: '/mnemo-card-portfolio'` 與 Playwright 設定一致；grep 輸出 `1`、`0`、`0`；本切片沒改工作流。G7 部署部分不在 G4 範圍 |
| AC19′ | Playwright | `design.spec.ts:113` 總覽頁 250–500；`:129` 問題定義 1200–1700、設計決策 3200–4200、工程實作 2800–3800；`home.spec.ts:90` 首頁 60–180 | PASS | 5 項全過 |
| AC20 | grep＋Playwright | `command grep -rn '待 owner 提供' src/`；`home.spec.ts:98`；`site.spec.ts` › `AC20：沒有 mailto: 連結` | PASS | grep 無輸出；首頁頁尾 1 項過；mailto 13／13 |
| AC21 | Playwright＋grep | `font.spec.ts:10`、`:16`；`command grep -rni 'serif tc' src astro.config.mjs`；`tokens.css` | PASS | 2 項全過；grep 無輸出；`--mc-font-heading: var(--mc-font-body);` |
| AC22 | diff（自行執行） | 見下方 §4 | PASS | 差異只有容許的前言圍欄與 `next: false` |

## 3. AC16′ 逐條

| 條目 | 指令 | 輸出 | 結果 |
| --- | --- | --- | --- |
| check:public | `npm run check:public` | exit 0，`乾淨，掃描 29 個提交` | PASS |
| ALLOWED | `command grep -n "const ALLOWED = \[\];" scripts/check-public.mjs` | `67:const ALLOWED = [];` | PASS |
| 提交者信箱 | `git log --format='%ae%n%ce' \| sort -u` | 只有一行，為本儲存庫的 GitHub noreply 地址 | PASS |
| pdf／env | `git log --all --name-only --format= \| command grep -iE '\.(pdf\|env)$'` | 無輸出（exit 1） | PASS |
| HARNESS_OK | `command grep -n "HARNESS_OK = new Set(\['portfolio-site', 'design-expansion'\])" scripts/check-public.mjs` | `60:const HARNESS_OK = new Set(['portfolio-site', 'design-expansion']);`（恰一行） | PASS |
| 舊 HARNESS_OK 不存在 | `command grep -c "HARNESS_OK = new Set(\['portfolio-site'\])" scripts/check-public.mjs` | `0` | PASS |
| 環境檔規則恰一行 | `command grep -nxF '[.]env*' .gitignore` | `6:[.]env*`（恰一行） | PASS |
| 本機環境檔被忽略 | `git check-ignore -q "$(printf '.%s' env.local)"` | exit 0 | PASS |
| private 被忽略 | `git check-ignore -q docs/harness/design-expansion/private/x.md` | exit 0（`.gitignore` 第 8 行 `docs/harness/*/private/`） | PASS |
| private 未提交 | `git log --all --name-only --format= \| command grep -c '/private/'` | `0` | PASS |

另確認：clone 內 `ls -d docs/harness/*/private` → 不存在；本機工作目錄的 `private/` 在 `git status --ignored` 顯示為 `!!`（已忽略），`git ls-files` 沒有任何 private 路徑。

## 4. AC22 逐字 diff（自行執行）

指令（三檔各一次）：

```bash
diff <(sed -n '/^## 頁面文案$/,$p' docs/harness/design-expansion/copy/<頁>.md | tail -n +3) src/content/docs/design/<頁>.mdx
```

輸出：

```
===== problem
1c1
< ```yaml
---
> ---
4c4
< ```
---
> ---
===== decisions
（同 problem：只有第 1、4 行圍欄）
===== engineering
1c1
< ```yaml
---
> ---
4c4,5
< ```
---
> next: false
> ---
```

正文、連結與參考文獻區逐字相同。另核對總覽頁：`design.mdx`「繼續讀」五行與 `copy/design-overview.md`「頁面文案」逐字相同。

## 5. 變異抽查（在 clone 內實際執行；每項改完跑對應 spec 檔，再以備份檔還原，`git status --short` 確認無殘留）

| # | 工作票 | 變異 | 指令 | 結果 |
| --- | --- | --- | --- | --- |
| 1 | 01 | `tokens.css` 的 `--mc-font-heading` 改為 `'Noto Serif TC', serif` | `npx playwright test tests/font.spec.ts` | 紅：AC21 兩項都 ✘（2 failed） |
| 2 | 02 | 刪除 `engineering.mdx` 前言的 `next: false` | `npx playwright test tests/design.spec.ts` | 紅：`AC10′ 第 3 點：三篇的上一篇／下一篇…工程實作沒有下一篇` ✘（1 failed、11 passed） |
| 3 | 02 | `astro.config.mjs` 側欄「問題定義」改為「問題」 | `npx playwright test tests/navigation.spec.ts -g 側欄` | 紅：`側欄（AC14）›「學習科學」群組依 R6 順序`（內含 AC14′）✘ |
| 4 | 02 | `decisions.mdx` 前言加 `pagefind: false` | `npx playwright test tests/search.spec.ts` | 紅：`AC12：搜「知識組件」有一筆結果指向 design/decisions/` ✘（1 failed、6 passed） |

說明：委派指示中的 `git checkout .` 被本機的 git 防護規則擋下，改以「改前 `cp` 備份、改後 `cp` 還原」達到同樣效果；四項還原後 `git status --short` 皆無輸出。

## 6. 結論

**VERIFIED**。所有列出的 AC（AC1′、AC2–AC9、AC10′、AC11、AC12′、AC13、AC14′、AC15、AC16′、AC17′、AC18 設定核對、AC19′、AC20、AC21、AC22）都 PASS，沒有 FAIL；
抽查的四項變異都讓對應測試變紅；`private/` 沒有進入任何提交。

## 7. 不阻擋的建議

1. `tests/navigation.spec.ts:19` 的測試名稱「「學習科學」群組依 R6 順序」實際也承載 AC14′（專案設計群組四項）與產品群組斷言；
   建議拆成獨立測試或改名（例如「側欄三群組與各群組連結（AC14′、R6）」），失敗時較容易判讀。
2. `tests/navigation.spec.ts:48` 註解「九個 Starlight 頁都要跑」已過時（現為十二個 Starlight 頁），建議更新。
3. spec 的 grep 類 AC 若在有 grep 別名或包裝的 shell 執行，可能套用忽略檔規則；建議在 AGENTS.md 或 spec 註明以 `command grep`（或 GNU grep）執行。
4. G7 時仍需完成 AC18 的部署部分與 S4 線上冒煙（十三頁與 `pagefind/pagefind.js` 回 200）。
