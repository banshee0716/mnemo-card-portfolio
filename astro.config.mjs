// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// 換自訂網域時只改 site 與 base 兩處（spec R2）。
export default defineConfig({
	site: 'https://banshee0716.github.io',
	base: '/mnemo-card-portfolio',
	integrations: [
		starlight({
			title: 'Mnemo-Card portfolio',
			logo: { src: './src/assets/logo.svg', replacesTitle: false },
			locales: {
				root: { label: '繁體中文', lang: 'zh-TW' },
			},
			customCss: [
				'@fontsource-variable/noto-sans-tc',
				'@fontsource-variable/noto-serif-tc',
				'./src/styles/custom.css',
			],
			lastUpdated: false,
			sidebar: [
				{
					label: '學習科學',
					items: [{ label: '導讀', slug: 'learning-science' }],
				},
			],
		}),
	],
});
