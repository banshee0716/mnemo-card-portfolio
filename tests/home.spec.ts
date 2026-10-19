import { expect, test } from '@playwright/test';
import { BASE, countChars, gotoWithTheme, searchHrefs } from './helpers';

const DOCS_SITE = 'https://banshee0716.github.io/mnemo-card-docs/';
const GITHUB = 'https://github.com/banshee0716';

/** 工作票 03 定稿（copy/home.md）：入口標題與連結，依序。 */
const ENTRIES: [string, string][] = [
	['專案設計', `${BASE}design/`],
	['學習科學導讀', `${BASE}learning-science/`],
	['產品怎麼用', `${BASE}product/`],
	['操作文件', DOCS_SITE],
];

test('AC10：首頁 h1 恰一個，main 內 h2 恰為四個入口，各含一個連結', async ({ page }) => {
	await page.goto('');
	await expect(page.locator('h1')).toHaveCount(1);
	await expect(page.locator('main h2')).toHaveText(ENTRIES.map(([t]) => t));
	for (const [i, [, href]] of ENTRIES.entries()) {
		const links = page.locator('main h2').nth(i).locator('a');
		await expect(links).toHaveCount(1);
		await expect(links).toHaveAttribute('href', href);
	}
});

test('AC10：首頁沒有指向產品正式站的連結，沒有站外腳本或樣式', async ({ page }) => {
	await page.goto('');
	const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
	const allowed = [DOCS_SITE, GITHUB];
	const external = hrefs.filter((h) => !h.startsWith(new URL(page.url()).origin));
	expect(external.sort()).toEqual([...allowed].sort());
	const resources = await page
		.locator('script[src], link[rel="stylesheet"]')
		.evaluateAll((els) => els.map((e) => (e as HTMLScriptElement).src || (e as HTMLLinkElement).href));
	for (const r of resources) expect(r.startsWith(new URL(page.url()).origin), r).toBe(true);
});

test('AC7：首頁鍵盤順序為跳轉連結、main、四個入口、頁尾 GitHub，焦點都可見', async ({ page }) => {
	await page.goto('');
	await page.keyboard.press('Tab');
	await expect(page.locator(':focus')).toHaveText('跳到主要內容');
	await page.keyboard.press('Enter');
	expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('MAIN');
	const expected = [...ENTRIES.map(([, h]) => h), GITHUB];
	for (const href of expected) {
		await page.keyboard.press('Tab');
		const focused = page.locator(':focus');
		await expect(focused).toHaveAttribute('href', href);
		const style = await focused.evaluate((el) => {
			const s = getComputedStyle(el);
			return { outline: s.outlineStyle, shadow: s.boxShadow };
		});
		expect(style.outline !== 'none' || style.shadow !== 'none').toBe(true);
	}
});

for (const theme of ['light', 'dark'] as const) {
	test(`AC8：${theme} 主題下首頁 --mc-accent 等於 Starlight 頁 --sl-color-accent`, async ({ page }) => {
		await gotoWithTheme(page, '', theme);
		const home = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--mc-accent').trim());
		await gotoWithTheme(page, 'design/', theme);
		const sl = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sl-color-accent').trim());
		expect(home).not.toBe('');
		expect(home).toBe(sl);
	});
}

test.describe('AC9：首頁主題', () => {
	test('localStorage 為 dark', async ({ page }) => {
		await gotoWithTheme(page, '', 'dark');
	});
	test('localStorage 為 light（系統偏好先設為深色，證明讀的是 localStorage）', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await gotoWithTheme(page, '', 'light');
	});
	for (const scheme of ['light', 'dark'] as const) {
		test(`未設定時跟隨系統 ${scheme}`, async ({ page }) => {
			await page.emulateMedia({ colorScheme: scheme });
			await page.goto('');
			await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
		});
	}
});

test('AC11：首頁獨有的一句不在搜尋索引（結果不指向根路徑）', async ({ page }) => {
	const hrefs = await searchHrefs(page, '四個入口');
	expect(hrefs.map((h) => h.split('#')[0])).not.toContain(BASE);
});

test('AC19：首頁 main 字元數 60–180', async ({ page }) => {
	await page.goto('');
	const n = countChars(await page.locator('main').innerText());
	console.log(`AC19 home main chars = ${n}`);
	expect(n).toBeGreaterThanOrEqual(60);
	expect(n).toBeLessThanOrEqual(180);
});

test('AC20：首頁頁尾恰有一個 GitHub 連結，沒有佔位', async ({ page }) => {
	await page.goto('');
	const links = page.locator('footer a');
	await expect(links).toHaveCount(1);
	await expect(links).toHaveAttribute('href', GITHUB);
	await expect(links).toHaveText('GitHub：banshee0716');
	expect(await page.locator('footer').innerText()).not.toContain('待 owner');
});
