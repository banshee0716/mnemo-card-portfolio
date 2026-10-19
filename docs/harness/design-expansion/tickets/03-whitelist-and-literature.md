# 03：白名單逐句核對與文獻查證（S3）
contract-freezing: no
depends-on: [02]

## 要做什麼

spec S3、§3、AC17′、AC22。由全新工作階段的 opus 子代理執行，作者不自驗。

1. 逐句核對三篇上站文字與 `copy/design-overview.md` 的新句子：對到原 spec §3 或本切片 spec §3 的項目，只說到「可寫的內容」為止；
   F1–F9 各判一次。核對者可讀本機 `private/drafts-with-sources.md` 與主程式私有儲存庫確認出處，但報告只寫公開句子與項目編號。
2. L1–L3：對照原文（全文或出版社摘要）確認書目欄位與頁面描述；記錄查證來源網址。
3. AC22：三篇 `.mdx` 與 `copy/*.md` 逐字比對。
4. 產出 `verification/whitelist-design-pages.md`。FAIL 由 Builder 改文案（`copy/` 與 `.mdx` 同步）後，只重核改動的句子並附在同一報告。

## 測試接縫

S3。

## 驗收條件

- [ ] 報告沒有未處理的 FAIL；L1–L3 PASS
- [ ] 報告不含私有路徑、檔名、服務名稱（`npm run check:public` 乾淨）
