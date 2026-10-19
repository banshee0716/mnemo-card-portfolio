import { expect, test } from '@playwright/test';
import { BASE, countChars } from './helpers';

/** 工作票 03 定稿（copy/design.md）。 */
const H2 = ['探索：讀得懂，不等於想得起來', '定義：先想出來，再解釋', '發展：五步學一張卡', '交付：小規模試用中', '繼續讀'];

test('AC10：專案設計頁 h1、h2 清單、繼續讀兩個連結、無上下篇、無產品正式站連結', async ({ page }) => {
	await page.goto('design/');
	await expect(page.locator('h1#_top')).toHaveText('專案設計');
	await expect(page.locator('.sl-markdown-content h2')).toHaveText(H2);
	for (const [i, p] of ['探索', '定義', '發展', '交付'].entries()) {
		expect((await page.locator('.sl-markdown-content h2').nth(i).innerText()).startsWith(p)).toBe(true);
	}
	const links = page.locator('.sl-markdown-content ul li a');
	expect(await links.evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname))).toEqual([
		`${BASE}learning-science/`,
		`${BASE}product/`,
	]);
	await expect(page.locator('.pagination-links a')).toHaveCount(0);
	const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
	const external = hrefs.filter((h) => !h.startsWith(new URL(page.url()).origin));
	for (const h of external) expect(h.startsWith('https://banshee0716.github.io/') || h.startsWith('https://github.com/') || h.startsWith('https://pagefind')).toBe(true);
});

test('AC19：專案設計頁 h1 加內文字元數 250–450', async ({ page }) => {
	await page.goto('design/');
	const h1 = await page.locator('h1#_top').innerText();
	// 標題錨點的螢幕閱讀器文字（.sr-only，「…」段落）不是讀者讀的內容，量測時排除。
	const body = await page
		.locator('.sl-markdown-content')
		.evaluate((el) => {
			const clone = el.cloneNode(true) as HTMLElement;
			clone.querySelectorAll('.sr-only').forEach((n) => n.remove());
			el.after(clone);
			const text = clone.innerText;
			clone.remove();
			return text;
		});
	const n = countChars(h1 + body);
	console.log(`AC19 design chars = ${n}`);
	expect(n).toBeGreaterThanOrEqual(250);
	expect(n).toBeLessThanOrEqual(450);
});
