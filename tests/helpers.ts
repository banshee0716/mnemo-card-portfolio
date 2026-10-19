import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const BASE = '/mnemo-card-portfolio/';

/** 測試涵蓋的頁面（相對於 base）。後續工作票在此加入新頁面；kind 區分自訂首頁與 Starlight 頁。 */
export const PAGES: { path: string; title: string; kind: 'home' | 'starlight' }[] = [
	{ path: '', title: 'Mnemo-Card portfolio', kind: 'home' },
	{ path: 'learning-science/', title: '學習科學導讀', kind: 'starlight' },
	{ path: 'learning-science/retrieval-practice/', title: '檢索練習：為什麼「試著想起來」也是一種學習？', kind: 'starlight' },
	{ path: 'learning-science/spaced-practice/', title: '間隔練習：為什麼不要把複習全部擠在同一天？', kind: 'starlight' },
	{ path: 'learning-science/generative-learning/', title: '生成學習：為什麼整理過，不一定真的理解了？', kind: 'starlight' },
	{ path: 'learning-science/self-explanation/', title: '自我解釋：為什麼要問自己「這一步為什麼成立」？', kind: 'starlight' },
	{ path: 'learning-science/cognitive-load/', title: '認知負荷理論：為什麼有些教材讓人越看越亂？', kind: 'starlight' },
	{ path: 'learning-science/kli-framework/', title: 'KLI 框架：為什麼要先想清楚「學會」是什麼意思？', kind: 'starlight' },
];

export type Theme = 'light' | 'dark';

/** 以 Starlight 的佈景主題設定開啟頁面，並確認主題已套用。 */
export async function gotoWithTheme(page: Page, path: string, theme: Theme) {
	await page.addInitScript((t) => {
		localStorage.setItem('starlight-theme', t);
	}, theme);
	await page.goto(path);
	await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

/** 收集頁面上所有 href／src，回傳站內網址（絕對網址）與漏掉 base 的站內網址。 */
export async function collectInternalUrls(page: Page) {
	const raw = await page.evaluate(() =>
		[...document.querySelectorAll('[href], [src]')].map(
			(el) => el.getAttribute('href') ?? el.getAttribute('src') ?? '',
		),
	);
	const origin = new URL(page.url()).origin;
	const internal = new Set<string>();
	/** 跨頁錨點：目標網址（不含 #）→ 需要存在的 id。 */
	const fragments = new Map<string, Set<string>>();
	const missingBase: string[] = [];
	for (const value of raw) {
		if (!value || value.startsWith('#') || /^(mailto|tel|data|javascript):/i.test(value)) continue;
		const url = new URL(value, page.url());
		if (url.origin !== origin) continue;
		if (!url.pathname.startsWith(BASE)) missingBase.push(value);
		const id = decodeURIComponent(url.hash.slice(1));
		url.hash = '';
		internal.add(url.href);
		if (id) {
			if (!fragments.has(url.href)) fragments.set(url.href, new Set());
			fragments.get(url.href)!.add(id);
		}
	}
	return { internal: [...internal], fragments, missingBase };
}

/** AC3：頁面上的站內連結與資源都在 base 之下且回 200。 */
export async function expectInternalLinksOk(page: Page, path: string) {
	await page.goto(path);
	const { internal, fragments, missingBase } = await collectInternalUrls(page);
	expect(missingBase, '站內連結漏掉 base 前綴').toEqual([]);
	expect(internal.length).toBeGreaterThan(0);
	const failures: string[] = [];
	const brokenDeepLinks: string[] = [];
	for (const url of internal) {
		const res = await page.request.get(url);
		if (res.status() !== 200) failures.push(`${res.status()} ${url}`);
		// 跨頁錨點（other-page/#段落）要對應到目標頁上存在的 id。
		const ids = fragments.get(url);
		if (ids && res.status() === 200) {
			const html = await res.text();
			for (const id of ids) {
				if (!html.includes(`id="${id}"`)) brokenDeepLinks.push(`${url}#${id}`);
			}
		}
	}
	expect(failures, '非 200 的站內網址').toEqual([]);
	expect(brokenDeepLinks, '找不到目標段落的跨頁錨點').toEqual([]);

	// 頁內錨點（#…）要對應到頁面上存在的 id。
	const brokenAnchors = await page.evaluate(() =>
		[...document.querySelectorAll('a[href^="#"]')]
			.map((a) => decodeURIComponent(a.getAttribute('href')!.slice(1)))
			.filter((id) => id && !document.getElementById(id)),
	);
	expect(brokenAnchors, '找不到目標的頁內錨點').toEqual([]);
}

/** 用鍵盤打開搜尋、輸入關鍵字，回傳結果連結的 href 清單。 */
export async function searchFor(page: Page, query: string) {
	// 首頁沒有搜尋框（R9），從 Starlight 頁開始搜。
	await page.goto('learning-science/');
	await page.locator('.pagefind-ui__form').waitFor({ state: 'attached' });
	await page.keyboard.press('Control+k');
	const input = page.locator('.pagefind-ui__search-input');
	await expect(input).toBeFocused();
	await input.fill(query);
	const results = page.locator('.pagefind-ui__result-link');
	await expect(results.first()).toBeVisible();
	return results.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
}

/** AC5：axe 沒有 serious 或 critical 違規。 */
export async function expectNoSeriousA11yViolations(page: Page, path: string, theme: Theme) {
	await gotoWithTheme(page, path, theme);
	const results = await new AxeBuilder({ page }).analyze();
	const serious = results.violations
		.filter((v) => v.impact === 'serious' || v.impact === 'critical')
		.map((v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
	expect(serious).toEqual([]);
}

/** AC4：指定寬度下沒有橫向捲動。 */
export async function expectNoHorizontalScroll(page: Page, path: string, width = 375) {
	await page.setViewportSize({ width, height: 800 });
	await page.goto(path);
	const { scrollWidth, clientWidth } = await page.evaluate(() => ({
		scrollWidth: document.documentElement.scrollWidth,
		clientWidth: document.documentElement.clientWidth,
	}));
	expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

/** Starlight 已知的英文預設字串；出現代表該字串落回英文（AC6）。 */
const ENGLISH_FALLBACKS = [
	'Section titled',
	'Skip to content',
	'On this page',
	'Overview',
	'Search',
	'Menu',
	'Select theme',
	'Previous',
	'Next',
	'Built with Starlight',
];

/**
 * AC6：介面文字是繁體，沒有簡體「搜索」。Starlight 頁另要求出現「搜尋」且沒有落回英文的 Starlight 字串；
 * 自訂首頁沒有搜尋框與 Starlight 介面，只檢查沒有「搜索」。
 */
export async function expectTraditionalUi(page: Page, path: string, kind: 'home' | 'starlight' = 'starlight') {
	await page.goto(path);
	if (kind === 'home') {
		expect(await page.content()).not.toContain('搜索');
		return;
	}
	// Pagefind 的搜尋表單在頁面載入後才插入，等它出現再檢查字串。
	await page.locator('.pagefind-ui__form').waitFor({ state: 'attached' });
	const html = await page.content();
	expect(html).toContain('搜尋');
	expect(html).not.toContain('搜索');
	const uiText = await page.evaluate(() => {
		const parts: string[] = [document.body.innerText];
		for (const el of document.querySelectorAll('[aria-label], [title], [placeholder]')) {
			for (const attr of ['aria-label', 'title', 'placeholder']) {
				const v = el.getAttribute(attr);
				if (v) parts.push(v);
			}
		}
		return parts.join('\n');
	});
	const found = ENGLISH_FALLBACKS.filter((s) => new RegExp(`\\b${s}\\b`).test(uiText));
	expect(found, '落回英文的介面字串').toEqual([]);
}

/** 反覆按 Tab，直到目前焦點元素符合 selector；回傳是否找到。 */
export async function tabUntil(page: Page, selector: string, maxTabs = 60) {
	for (let i = 0; i < maxTabs; i++) {
		await page.keyboard.press('Tab');
		if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return true;
	}
	return false;
}

