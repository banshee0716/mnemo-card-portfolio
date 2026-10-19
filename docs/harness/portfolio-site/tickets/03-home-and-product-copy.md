# 03：首頁與產品摘要頁文案（白名單核對＋owner 定稿）
contract-freezing: yes（網站名稱、首頁 h2 清單、AC11／AC12 指定的搜尋詞；04、05 寫死進測試）
depends-on: []

## 要做什麼

spec R5、R8、§3、§6、S3。本票只寫文案，不動網站程式。

1. 寫 `docs/harness/portfolio-site/copy/home.md` 與 `copy/product.md`。每一句句尾以 HTML 註解標 §3 項目編號
   （例 `<!-- W3 -->`）；只用「已核可」項，以及送 owner 勾選的「待 owner 確認」項（註解另加 `待確認`）。
   首頁依 R5：h1、3–5 個 h2（問題 → 成果 → 分支）、分支三個入口的說明句；成果數字照 §3.3 寫出條件與日期。
   產品摘要頁依 R8：200–500 字、截圖的 `alt` 與「圖：」說明。
2. 文末一節「送 owner 決定」列出 spec §6 D1–D5，每項附 Builder 的建議與理由，不替 owner 決定；
   另指定 AC11 的「首頁獨有一句」與 AC12 的產品摘要頁搜尋詞。
3. 全新工作階段的 opus 子代理做 S3 核對，產出 `verification/whitelist-home.md`、`verification/whitelist-product.md`；
   修 FAIL 後由同一核對者複核。
4. 送 owner：文案＋D1–D5。owner 的答覆寫進 `state.md` § Decisions（逐項，行首 `Owner:`），被拒或未勾的句子刪除；
   owner 改動的句子由 S3 核對者再核。

## 測試接縫

S3。

## 驗收條件

- [ ] 兩份文案每一句都有 §3 項目編號註解（S3 核對者逐句確認）
- [ ] S3 兩份報告沒有未處理的 FAIL；§3.4 F1–F9 逐類 PASS
- [ ] owner 已答覆 D1–D5，紀錄在 `state.md`；「待 owner 提供」的項目若沒有值，文案中沒有對應句子
- [ ] `npm run check:public` 乾淨（若 01 尚未完成，改為 01 完成後補跑；文案與報告也在掃描範圍）
