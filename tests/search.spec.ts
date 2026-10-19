import { expect, test } from '@playwright/test';
import { BASE, searchFor } from './helpers';

/** AC12 前兩項：搜尋詞 → 結果路徑（去掉 #）必須有一筆完全等於該頁。 */
const SEARCHES: [string, string][] = [
	['檢索練習', 'learning-science/retrieval-practice/'],
	['認知負荷', 'learning-science/cognitive-load/'],
	['雙鑽石', 'design/'],
	['匯入', 'product/'],
];

for (const [query, path] of SEARCHES) {
	test(`AC12：搜「${query}」有一筆結果指向 ${path}`, async ({ page }) => {
		const hrefs = await searchFor(page, query);
		expect(hrefs.map((h) => h.split('#')[0])).toContain(`${BASE}${path}`);
	});
}
