import { expect, test, type Page } from '@playwright/test';
import { BASE, countChars } from './helpers';

/** portfolio-site 工作票 03 定稿（copy/design.md）。 */
const H2 = ['探索：讀得懂，不等於想得起來', '定義：先想出來，再解釋', '發展：五步學一張卡', '交付：小規模試用中', '繼續讀'];

/** design-expansion 工作票 02：依 copy/*.md 寫死的 h2 清單（AC10′ 第 2 點）。 */
const SUB_PAGES = [
	{
		path: 'design/problem/',
		title: '問題定義：學習者真正卡在哪裡',
		h2: ['研究指出的方向', '現有的工具處理了什麼', '為什麼是卡片', '參考文獻'],
		chars: [1200, 1700],
	},
	{
		path: 'design/decisions/',
		title: '設計決策：從研究建議到產品功能',
		h2: [
			'一張卡怎麼學',
			'先讀懂，再回想',
			'概述只給方向',
			'回想之後才解釋',
			'自我解釋提示要問得具體',
			'想完再評分，而且分數是給自己看的',
			'四種卡型：先拆開，再整合',
			'以整副牌組安排複習',
			'兩種固定的複習日程',
			'把一副牌組看成一個知識組件',
			'AI 放在產品外面',
			'參考文獻',
		],
		chars: [3200, 4200],
	},
	{
		path: 'design/engineering/',
		title: '工程實作：技術選型與工程抉擇',
		h2: [
			'技術選型',
			'把原型搬到伺服器',
			'規則要放在哪一層',
			'同時送出的請求',
			'資料庫變更只往前走',
			'匯入與匯出',
			'「今天」從什麼時候開始',
			'效能：從換頁卡頓到分三期處理',
			'量測上犯過的錯',
			'壓力測試',
			'測試怎麼分層',
			'繼續讀',
		],
		chars: [2800, 3800],
	},
] as const;

/** AC19 量法：h1 加內文的 innerText，排除 .sr-only；去掉「參考文獻」h2 及其後的內容（design-expansion R7）。 */
async function readingChars(page: Page) {
	const h1 = await page.locator('h1#_top').innerText();
	const body = await page.locator('.sl-markdown-content').evaluate((el) => {
		const clone = el.cloneNode(true) as HTMLElement;
		clone.querySelectorAll('.sr-only').forEach((n) => n.remove());
		const refs = [...clone.querySelectorAll('h2')].find((h) => h.textContent?.trim() === '參考文獻');
		if (refs) {
			let node: Element | null = refs.closest('.sl-heading-wrapper') ?? refs;
			while (node) {
				const next: Element | null = node.nextElementSibling;
				node.remove();
				node = next;
			}
		}
		el.after(clone);
		const text = clone.innerText;
		clone.remove();
		return text;
	});
	return countChars(h1 + body);
}

async function contentPaths(page: Page, selector: string) {
	return page.locator(selector).evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
}

async function expectOnlyAllowedExternal(page: Page) {
	const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
	const external = hrefs.filter((h) => !h.startsWith(new URL(page.url()).origin));
	for (const h of external) {
		expect(
			h.startsWith('https://banshee0716.github.io/') ||
				h.startsWith('https://github.com/') ||
				h.startsWith('https://doi.org/') ||
				h.startsWith('https://pagefind'),
		).toBe(true);
	}
}

test('AC10′：專案設計總覽頁 h1、h2 清單、繼續讀五個連結、無上下篇、無產品正式站連結', async ({ page }) => {
	await page.goto('design/');
	await expect(page.locator('h1#_top')).toHaveText('專案設計');
	await expect(page.locator('.sl-markdown-content h2')).toHaveText(H2);
	for (const [i, p] of ['探索', '定義', '發展', '交付'].entries()) {
		expect((await page.locator('.sl-markdown-content h2').nth(i).innerText()).startsWith(p)).toBe(true);
	}
	expect(await contentPaths(page, '.sl-markdown-content ul li a')).toEqual([
		`${BASE}design/problem/`,
		`${BASE}design/decisions/`,
		`${BASE}design/engineering/`,
		`${BASE}learning-science/`,
		`${BASE}product/`,
	]);
	await expect(page.locator('.pagination-links a')).toHaveCount(0);
	await expectOnlyAllowedExternal(page);
});

test('AC19′：專案設計總覽頁 h1 加內文字元數 250–500', async ({ page }) => {
	await page.goto('design/');
	const n = await readingChars(page);
	console.log(`AC19 design chars = ${n}`);
	expect(n).toBeGreaterThanOrEqual(250);
	expect(n).toBeLessThanOrEqual(500);
});

for (const sub of SUB_PAGES) {
	test(`AC10′：${sub.path} h1 與 h2 清單、只有允許的外部連結`, async ({ page }) => {
		await page.goto(sub.path);
		await expect(page.locator('h1#_top')).toHaveText(sub.title);
		await expect(page.locator('.sl-markdown-content h2')).toHaveText([...sub.h2]);
		await expectOnlyAllowedExternal(page);
	});

	test(`AC19′：${sub.path} 閱讀字元數 ${sub.chars[0]}–${sub.chars[1]}`, async ({ page }) => {
		await page.goto(sub.path);
		const n = await readingChars(page);
		console.log(`AC19 ${sub.path} chars = ${n}`);
		expect(n).toBeGreaterThanOrEqual(sub.chars[0]);
		expect(n).toBeLessThanOrEqual(sub.chars[1]);
	});
}

test('AC10′：參考文獻每筆都有 doi.org 連結', async ({ page }) => {
	for (const path of ['design/problem/', 'design/decisions/']) {
		await page.goto(path);
		const items = page.locator('.sl-markdown-content h2:text-is("參考文獻")').locator('xpath=ancestor::div[contains(@class,"sl-heading-wrapper")][1]/following-sibling::ul[1]/li');
		const n = await items.count();
		expect(n).toBeGreaterThan(0);
		for (let i = 0; i < n; i++) {
			await expect(items.nth(i).locator('a[href^="https://doi.org/"]')).toHaveCount(1);
		}
	}
});

test('AC10′：問題定義頁恰一個人物設定表格，表頭四欄、三列', async ({ page }) => {
	await page.goto('design/problem/');
	const tables = page.locator('.sl-markdown-content table');
	await expect(tables).toHaveCount(1);
	await expect(tables.locator('thead th')).toHaveText(['使用者', '情境', '卡在哪裡', '需要什麼']);
	await expect(tables.locator('tbody tr')).toHaveCount(3);
});

test('AC10′：工程實作頁「繼續讀」恰兩個連結，依序到設計決策與產品怎麼用', async ({ page }) => {
	await page.goto('design/engineering/');
	expect(await contentPaths(page, '.sl-markdown-content ul:last-of-type li a')).toEqual([
		`${BASE}design/decisions/`,
		`${BASE}product/`,
	]);
});

test('AC10′ 第 3 點：三篇的上一篇／下一篇依側欄順序，工程實作沒有下一篇', async ({ page }) => {
	const expected: [string, string | null, string | null][] = [
		['design/problem/', 'design/', 'design/decisions/'],
		['design/decisions/', 'design/problem/', 'design/engineering/'],
		['design/engineering/', 'design/decisions/', null],
	];
	for (const [path, prev, next] of expected) {
		await page.goto(path);
		const prevLink = page.locator('.pagination-links a[rel="prev"]');
		const nextLink = page.locator('.pagination-links a[rel="next"]');
		if (prev) await expect(prevLink).toHaveAttribute('href', `${BASE}${prev}`);
		else await expect(prevLink).toHaveCount(0);
		if (next) await expect(nextLink).toHaveAttribute('href', `${BASE}${next}`);
		else await expect(nextLink).toHaveCount(0);
	}
});
