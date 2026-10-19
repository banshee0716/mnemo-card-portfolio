import { expect, test, type Locator } from '@playwright/test';

/** design-expansion spec R4：全站標題都用內文字型 Noto Sans TC。 */
const SANS = '"Noto Sans TC Variable"';

async function fontFamily(locator: Locator) {
	return locator.evaluate((el) => getComputedStyle(el).fontFamily);
}

test('AC21：首頁 h1 與入口 h2 用 Noto Sans TC', async ({ page }) => {
	await page.goto('');
	expect(await fontFamily(page.locator('h1'))).toMatch(new RegExp(`^${SANS}`));
	expect(await fontFamily(page.locator('main h2').first())).toMatch(new RegExp(`^${SANS}`));
});

test('AC21：Starlight 頁 h1 與段落 h2 用 Noto Sans TC', async ({ page }) => {
	await page.goto('learning-science/retrieval-practice/');
	expect(await fontFamily(page.locator('h1#_top'))).toMatch(new RegExp(`^${SANS}`));
	expect(await fontFamily(page.locator('.sl-markdown-content h2').first())).toMatch(new RegExp(`^${SANS}`));
});
