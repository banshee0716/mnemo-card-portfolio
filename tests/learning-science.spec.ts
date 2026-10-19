import { expect, test, type Page } from '@playwright/test';
import { BASE, searchFor } from './helpers';

/**
 * spec-slice3：學習科學分區。只列已上線的頁面，依側欄順序（R19）。
 * h2 是 owner 同意的文案定稿標題（AC20）；product 表示有產品段（R25），值為產品段 h2。
 */
export const LEARNING_SCIENCE: {
	slug: string;
	label: string;
	h2: string[];
	isIndex?: boolean;
	product?: string;
	noMnemoCard?: boolean;
	noCardTypes?: boolean;
}[] = [
	{ slug: '', label: '導讀', h2: ['從哪一篇開始？'], isIndex: true },
	{
		slug: 'retrieval-practice/',
		label: '檢索練習',
		h2: ['它和重新閱讀有什麼不同？', '研究支持什麼？', '是不是只要一直考自己就好？', '可以怎麼開始？', 'Mnemo-Card 怎麼用這個概念？', '參考文獻', '延伸閱讀'],
		product: 'Mnemo-Card 怎麼用這個概念？',
	},
	{
		slug: 'spaced-practice/',
		label: '間隔練習',
		h2: ['一次讀完和分幾次讀，差在哪裡？', '研究支持什麼？', '間隔要多長才好？', '為什麼分散練習感覺比較沒效？', '可以怎麼開始？', 'Mnemo-Card 怎麼用這個概念？', '參考文獻', '延伸閱讀'],
		product: 'Mnemo-Card 怎麼用這個概念？',
	},
	{
		slug: 'generative-learning/',
		label: '生成學習',
		h2: ['整理過和理解了，差在哪裡？', '研究支持什麼？', '是不是做越多種活動越好？', '可以怎麼開始？', '參考文獻', '延伸閱讀'],
	},
	{
		slug: 'self-explanation/',
		label: '自我解釋',
		h2: ['重述和自我解釋，差在哪裡？', '研究支持什麼？', '什麼時候自我解釋幫助不大？', '可以怎麼開始？', 'Mnemo-Card 怎麼用這個概念？', '參考文獻', '延伸閱讀'],
		product: 'Mnemo-Card 怎麼用這個概念？',
	},
	{
		slug: 'cognitive-load/',
		label: '認知負荷理論',
		h2: ['負荷從哪裡來？', '研究支持什麼？', '是不是越輕鬆越好？', '可以怎麼開始？', '參考文獻', '延伸閱讀'],
		noMnemoCard: true,
	},	{
		slug: 'kli-framework/',
		label: 'KLI 框架',
		h2: ['K、L、I 各指什麼？', '學習有哪幾種過程？', 'KLI 怎麼把不同的學習研究連在一起？', '是不是只要找到最好的教學方法就好？', '可以怎麼開始？', '參考文獻', '延伸閱讀'],
		noMnemoCard: true,
		noCardTypes: true,
	},
];

const REFERENCES = '參考文獻';
const FURTHER_READING = '延伸閱讀';

/** h2「from」之後、下一個 h2 之前的兄弟元素（h2 順序由 AC20 鎖定）。Starlight 把 h2 包在 .sl-heading-wrapper 裡。 */
async function section(page: Page, from: string) {
	return page.evaluate(
		(from) => {
			const headings = [...document.querySelectorAll('.sl-markdown-content h2')];
			const start = headings.find((h) => h.textContent?.trim() === from);
			if (!start) return null;
			const parts: Element[] = [];
			for (let el = (start.closest('.sl-heading-wrapper') ?? start).nextElementSibling; el; el = el.nextElementSibling) {
				if (el.tagName === 'H2' || el.querySelector('h2')) break;
				parts.push(el);
			}
			const items = parts.flatMap((p) => [...p.querySelectorAll('li')]);
			return {
				text: parts.map((p) => p.textContent ?? '').join('\n'),
				items: items.map((li) => ({
					links: [...li.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
				})),
			};
		},
		from,
	);
}

for (const page of LEARNING_SCIENCE) {
	const path = `learning-science/${page.slug}`;

	test(`AC13：h2 ${path} 的 h2 恰為定稿標題`, async ({ page: p }) => {
		await p.goto(path);
		const h2 = (await p.locator('.sl-markdown-content h2').allInnerTexts()).map((t) => t.trim());
		expect(h2).toEqual(page.h2);
		if (!page.isIndex) expect(h2.slice(-2)).toEqual([REFERENCES, FURTHER_READING]);
	});

	if (!page.isIndex) {
		test(`AC13：參考文獻 ${path} 的參考文獻 3–7 筆且都有連結，延伸閱讀 1–2 筆`, async ({ page: p }) => {
			await p.goto(path);
			const refs = await section(p, REFERENCES);
			expect(refs).not.toBeNull();
			expect(refs!.items.length).toBeGreaterThanOrEqual(3);
			expect(refs!.items.length).toBeLessThanOrEqual(7);
			for (const item of refs!.items) expect(item.links.some((h) => h.startsWith('https://'))).toBe(true);
			const further = await section(p, FURTHER_READING);
			expect(further!.items.length).toBeGreaterThanOrEqual(1);
			expect(further!.items.length).toBeLessThanOrEqual(2);
		});
	}

	test(`AC13：${path} 沒有成效宣稱、程式碼，且守住產品段與跨篇界線`, async ({ page: p }) => {
		await p.goto(path);
		const content = p.locator('.sl-markdown-content');
		const text = await content.innerText();
		for (const banned of ['證實 Mnemo-Card', 'Mnemo-Card 能提升']) expect(text, banned).not.toContain(banned);
		if (page.noMnemoCard) expect(text).not.toContain('Mnemo-Card');
		if (page.noCardTypes) {
			for (const type of ['基礎概念卡', '深入解析卡', '關聯整合卡', '範例應用卡']) expect(text, type).not.toContain(type);
		}
		if (page.product) {
			const product = await section(p, page.product);
			expect(product, '找不到產品段').not.toBeNull();
			for (const banned of ['保證', '最佳', '個人化', '演算法', '證實', '有效提升']) {
				expect(product!.text, banned).not.toContain(banned);
			}
		}
		await expect(content.locator('pre, code')).toHaveCount(0);
		// spec-slice3 R22 第 4 點：引用採 APA 第 7 版，不得殘留中文式「（作者 等人，年份）」。
		expect(text).not.toMatch(/（[A-Z][^）]*，\d{4}）|等人，\d{4}/);
	});
}

test('AC13：學習科學各頁的上一篇／下一篇依 R7（KLI 無下一篇）', async ({ page }) => {
	for (const [i, p] of LEARNING_SCIENCE.entries()) {
		await page.goto(`learning-science/${p.slug}`);
		const prev = i === 0 ? null : LEARNING_SCIENCE[i - 1];
		const next = LEARNING_SCIENCE[i + 1] ?? null;
		for (const [rel, expected] of [
			['prev', prev],
			['next', next],
		] as const) {
			const link = page.locator(`.pagination-links a[rel="${rel}"]`);
			if (expected === null) {
				await expect(link, `${p.slug} ${rel}`).toHaveCount(0);
			} else {
				await expect(link.locator('.link-title')).toHaveText(expected.label);
				await expect(link).toHaveAttribute('href', `${BASE}learning-science/${expected.slug}`);
			}
		}
	}
});

test('R26：導讀頁清單恰為六篇文章，依側欄順序', async ({ page }) => {
	await page.goto('learning-science/');
	const paths = await page
		.locator('.sl-markdown-content li a[href]')
		.evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
	expect(paths).toEqual(LEARNING_SCIENCE.filter((p) => !p.isIndex).map((p) => `${BASE}learning-science/${p.slug}`));
});

/** R7 第 1 點：三篇產品段連到文件站〈第一次使用〉的絕對網址。 */
const FIRST_USE_URL = 'https://banshee0716.github.io/mnemo-card-docs/first-use/';

for (const slug of ['retrieval-practice/', 'spaced-practice/', 'self-explanation/']) {
	test(`AC13：${slug} 的〈第一次使用〉連結為文件站絕對網址`, async ({ page }) => {
		await page.goto(`learning-science/${slug}`);
		const hrefs = await page
			.locator('.sl-markdown-content a[href*="first-use"]')
			.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
		expect(hrefs).toEqual([FIRST_USE_URL]);
	});
}
