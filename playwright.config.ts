import { defineConfig, devices } from '@playwright/test';

// 測試用獨立的埠，不與手動開的 preview（4321）共用，避免測到別的工作樹。
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4398);
const base = '/mnemo-card-portfolio/';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${port}${base}`,
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		// --ignore-lock：Astro 偵測到 AI 代理時會自動把 preview 放到背景，Playwright 需要前景行程。
		command: `npm run build && npm run preview -- --port ${port} --ignore-lock`,
		url: `http://localhost:${port}${base}`,
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
