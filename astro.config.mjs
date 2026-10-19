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
				'./src/styles/custom.css',
			],
			lastUpdated: false,
			sidebar: [
				{
					label: '專案設計',
					items: [
						{ label: '專案設計', slug: 'design' },
						{ label: '問題定義', slug: 'design/problem' },
						{ label: '設計決策', slug: 'design/decisions' },
						{ label: '工程實作', slug: 'design/engineering' },
					],
				},
				{
					label: '學習科學',
					items: [
						{ label: '導讀', slug: 'learning-science' },
						{ label: '檢索練習', slug: 'learning-science/retrieval-practice' },
						{ label: '間隔練習', slug: 'learning-science/spaced-practice' },
						{ label: '生成學習', slug: 'learning-science/generative-learning' },
						{ label: '自我解釋', slug: 'learning-science/self-explanation' },
						{ label: '認知負荷理論', slug: 'learning-science/cognitive-load' },
						{ label: 'KLI 框架', slug: 'learning-science/kli-framework' },
					],
				},
				{
					label: '產品',
					items: [{ label: '產品怎麼用', slug: 'product' }],
				},
			],
		}),
	],
});
