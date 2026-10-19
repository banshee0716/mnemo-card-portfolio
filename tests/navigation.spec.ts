import { expect, test } from '@playwright/test';
import { BASE, PAGES, tabUntil } from './helpers';

const sidebar = '#starlight__sidebar';
const articleLink = `${sidebar} a[href="${BASE}learning-science/retrieval-practice/"]`;

/** R6：側欄「專案設計」「學習科學」群組的順序。「產品」群組。 */
const LEARNING_SCIENCE_LINKS: [string, string][] = [
	['導讀', ''],
	['檢索練習', 'retrieval-practice/'],
	['間隔練習', 'spaced-practice/'],
	['生成學習', 'generative-learning/'],
	['自我解釋', 'self-explanation/'],
	['認知負荷理論', 'cognitive-load/'],
	['KLI 框架', 'kli-framework/'],
];

test.describe('側欄（AC14）', () => {
	test('「學習科學」群組依 R6 順序', async ({ page }) => {
		await page.goto('learning-science/');
		const groups = page.locator(`${sidebar} .top-level > li > details`);
		await expect(groups.locator('> summary')).toHaveText(['專案設計', '學習科學', '產品']);
		// design-expansion AC14′：「專案設計」群組恰四項。
		const designLinks = groups.nth(0).locator('a');
		await expect(designLinks).toHaveText(['專案設計', '問題定義', '設計決策', '工程實作']);
		for (const [i, p] of ['design/', 'design/problem/', 'design/decisions/', 'design/engineering/'].entries()) {
			await expect(designLinks.nth(i)).toHaveAttribute('href', `${BASE}${p}`);
		}
		await expect(groups.nth(2).locator('a')).toHaveText(['產品怎麼用']);
		await expect(groups.nth(2).locator('a')).toHaveAttribute('href', `${BASE}product/`);
		const links = groups.nth(1).locator('a');
		await expect(links).toHaveText(LEARNING_SCIENCE_LINKS.map(([label]) => label));
		for (const [i, [, slug]] of LEARNING_SCIENCE_LINKS.entries()) {
			await expect(links.nth(i)).toHaveAttribute('href', `${BASE}learning-science/${slug}`);
		}
	});

	test('側欄只有站內連結，首頁不在側欄，頁首網站標題連到 base 根', async ({ page }) => {
		await page.goto('learning-science/');
		const hrefs = await page.locator(`${sidebar} a`).evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''));
		expect(hrefs.length).toBeGreaterThan(0);
		expect(hrefs.filter((h) => !h.startsWith(BASE))).toEqual([]);
		await expect(page.locator(`${sidebar} a[href="${BASE}"]`)).toHaveCount(0);
		await expect(page.locator('a.site-title')).toHaveAttribute('href', BASE);
	});
});

/** AC7 第 2 點：九個 Starlight 頁都要跑，不只代表頁。 */
const STARLIGHT_PAGES = PAGES.filter((p) => p.kind === 'starlight');
const anySidebarLink = `${sidebar} a`;

for (const { path } of STARLIGHT_PAGES) {
	test.describe(`Starlight 頁鍵盤操作（AC7 第 2 點）：${path}`, () => {
		test('第一次 Tab 聚焦跳轉連結；Enter 後網址變 #_top，下一次 Tab 停在 main 裡', async ({ page }) => {
			await page.goto(path);
			await page.keyboard.press('Tab');
			await expect(page.locator(':focus')).toHaveText('跳到內容');
			await page.keyboard.press('Enter');
			await expect(page).toHaveURL(/#_top$/);
			await page.keyboard.press('Tab');
			expect(await page.evaluate(() => !!document.activeElement?.closest('main'))).toBe(true);
		});

		test('桌機寬度下 Tab 能走到側欄的文章連結', async ({ page }) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await page.goto(path);
			expect(await tabUntil(page, anySidebarLink)).toBe(true);
		});

		test('手機寬度下 Enter 打開選單、Tab 到側欄的文章連結、Esc 關閉', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 800 });
			await page.goto(path);
			expect(await tabUntil(page, '.sl-menu-button')).toBe(true);
			await page.keyboard.press('Enter');
			await expect(page.locator(`${sidebar}:popover-open`)).toHaveCount(1);
			expect(await tabUntil(page, anySidebarLink, 20)).toBe(true);
			await page.keyboard.press('Escape');
			await expect(page.locator(`${sidebar}:popover-open`)).toHaveCount(0);
		});

		test('能用鍵盤打開搜尋', async ({ page }) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await page.goto(path);
			await page.locator('.pagefind-ui__form').waitFor({ state: 'attached' });
			expect(await tabUntil(page, 'site-search button[data-open-modal]')).toBe(true);
			await page.keyboard.press('Enter');
			await expect(page.locator('site-search dialog[open]')).toHaveCount(1);
			await expect(page.locator('.pagefind-ui__search-input')).toBeFocused();
		});

		test('手機寬度下文章目錄能用鍵盤展開', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 800 });
			await page.goto(path);
			expect(await tabUntil(page, 'mobile-starlight-toc summary')).toBe(true);
			await page.keyboard.press('Enter');
			await expect(page.locator('mobile-starlight-toc details[open]')).toHaveCount(1);
		});
	});
}
