# 01：全站標題改用 Noto Sans TC
contract-freezing: no
depends-on: []

## 要做什麼

spec R4、AC1′（`noto-serif` 計數）、AC21。

1. `src/styles/tokens.css`：`--mc-font-heading: var(--mc-font-body);`（已於 G1 提交 `ff6ec7d` 完成）。
2. `astro.config.mjs` 的 `customCss` 與 `src/pages/index.astro` 不再載入 `@fontsource-variable/noto-serif-tc`（已完成）；
   `npm uninstall @fontsource-variable/noto-serif-tc`（已在工作目錄完成，`package.json` 與 `package-lock.json` 待提交）。
3. `custom.css`、`home.css` 註解中的「明體」字樣移除（已完成）。
4. 新增 `tests/font.spec.ts` 寫 AC21 的 Playwright 部分。

## 測試接縫

S1、S2。

## 驗收條件

- [ ] `npm test` 全綠（含 AC21）
- [ ] `grep -c noto-serif package.json package-lock.json` 兩檔都是 `0`；`grep -rni 'serif tc' src astro.config.mjs` 沒有輸出
- [ ] `npm run check:public` 乾淨
- [ ] 變異：把 `--mc-font-heading` 暫時改回 `'Noto Serif TC', serif`，AC21 變紅
