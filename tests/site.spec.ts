import { expect, test } from '@playwright/test';
import {
	PAGES,
	expectInternalLinksOk,
	expectNoHorizontalScroll,
	expectNoSeriousA11yViolations,
	expectTraditionalUi,
} from './helpers';

for (const { path, title, kind } of PAGES) {
	const name = path || '首頁';

	test.describe(name, () => {
		test('AC2：回 200、lang 為 zh-TW、標題正確', async ({ page }) => {
			const res = await page.goto(path);
			expect(res?.status()).toBe(200);
			await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
			await expect(page).toHaveTitle(new RegExp(title));
			await expect(page).toHaveTitle(/Mnemo-Card portfolio/);
		});

		test('AC3：站內連結與資源都在 base 之下且回 200', async ({ page }) => {
			await expectInternalLinksOk(page, path);
		});

		test('AC4：375px 寬度沒有橫向捲動', async ({ page }) => {
			await expectNoHorizontalScroll(page, path);
		});

		for (const theme of ['light', 'dark'] as const) {
			test(`AC5：${theme === 'light' ? '淺色' : '深色'}主題沒有 serious／critical 無障礙違規`, async ({
				page,
			}) => {
				await expectNoSeriousA11yViolations(page, path, theme);
			});
		}

		test('AC6：介面文字為繁體中文', async ({ page }) => {
			await expectTraditionalUi(page, path, kind);
		});
	});
}
