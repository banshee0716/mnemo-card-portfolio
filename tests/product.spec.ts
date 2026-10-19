import { expect, test } from '@playwright/test';
import { countChars } from './helpers';

const DOCS = 'https://banshee0716.github.io/mnemo-card-docs/';

/** 工作票 03 定稿（copy/product.md）。 */
const H2 = ['一張卡怎麼學', '牌組與複習排程', '匯入、匯出與 AI 產卡技能', '完整操作說明'];
const DOC_LINKS = [`${DOCS}first-use/`, `${DOCS}review-and-manage/`, `${DOCS}skills/mnemo-study-cards/`];

test('AC15：恰四張圖，alt 非空、webp、figcaption 以「圖：」開頭', async ({ page }) => {
	await page.goto('product/');
	const imgs = page.locator('.sl-markdown-content img');
	await expect(imgs).toHaveCount(4);
	for (let i = 0; i < 4; i++) {
		const img = imgs.nth(i);
		expect((await img.getAttribute('alt'))?.trim().length ?? 0).toBeGreaterThan(0);
		expect(await img.getAttribute('src')).toMatch(/\.webp(\?|$)/);
		const caption = await img.locator('xpath=ancestor::figure[1]/figcaption').innerText();
		expect(caption.startsWith('圖：')).toBe(true);
	}
});

test('AC15：h2 清單、三個文件站連結、無上下篇、無程式碼區塊', async ({ page }) => {
	await page.goto('product/');
	await expect(page.locator('h1#_top')).toHaveText('產品怎麼用');
	await expect(page.locator('.sl-markdown-content h2')).toHaveText(H2);
	const docLinks = await page
		.locator('.sl-markdown-content a[href^="https://banshee0716.github.io/mnemo-card-docs/"]')
		.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
	expect(docLinks).toEqual(DOC_LINKS);
	// 所有站外連結都必須是文件站的絕對網址。
	const external = await page
		.locator('.sl-markdown-content a[href]')
		.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? '').filter((h) => !h.startsWith('#')));
	expect(external).toEqual(DOC_LINKS);
	await expect(page.locator('.pagination-links a')).toHaveCount(0);
	await expect(page.locator('.sl-markdown-content pre, .sl-markdown-content code')).toHaveCount(0);
});

test('R8：正文字元數 200–500（alt 不計、說明計入）', async ({ page }) => {
	await page.goto('product/');
	const h1 = await page.locator('h1#_top').innerText();
	// 標題錨點的螢幕閱讀器文字（.sr-only）不是讀者讀的內容，量測時排除。
	const body = await page.locator('.sl-markdown-content').evaluate((el) => {
		const clone = el.cloneNode(true) as HTMLElement;
		clone.querySelectorAll('.sr-only').forEach((n) => n.remove());
		el.after(clone);
		const text = clone.innerText;
		clone.remove();
		return text;
	});
	const n = countChars(h1 + body);
	console.log(`R8 product chars = ${n}`);
	expect(n).toBeGreaterThanOrEqual(200);
	expect(n).toBeLessThanOrEqual(500);
});
