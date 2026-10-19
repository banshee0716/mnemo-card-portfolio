#!/usr/bin/env node
/**
 * check-public.mjs — 公開儲存庫衛生檢查（spec K2、R11、AC16）。
 *
 * 掃描 HEAD 可達的「每一個」提交（不只目前版本），因為推送後任何提交都能以 SHA 公開存取：
 *   1. 檔案內容：主程式內部細節、帳號與寄信設定、憑證樣式、非 noreply 的電子郵件地址。
 *   2. 提交者身分：作者與提交者只能是 GitHub noreply 地址。
 *   3. 提交訊息：不得含非 noreply 的電子郵件地址。
 *
 * 搜尋樣式只定義在本檔；本檔目前版本的每一行視為可信，歷史中曾出現後刪除的行照常判斷。
 * 因此新增樣式只能寫一般字樣，不得寫真實的專案網址、識別碼或金鑰（目前版本不受掃描）。
 * 歷史中已知無害的命中（例如舊版搜尋指令本身）以「檔案＋整行文字」逐行列入 ALLOWED，不整檔排除。
 * 圖片以外的檔案一律當文字掃描；package-lock.json 只查憑證與電子郵件。
 *
 * 用法：node scripts/check-public.mjs [<rev-range>]   （預設 HEAD）
 * 結束碼：0 乾淨；1 有命中；2 git 執行失敗。
 */

import { spawnSync } from 'node:child_process';

const SELF = 'scripts/check-public.mjs';
const NOREPLY = '62146316+banshee0716@users.noreply.github.com';

/** 內容樣式（不分大小寫，ERE）。命中後再由 lineProblem() 判斷是否真的有問題。 */
const STRICT_PATTERNS = [
	// 主程式與後端
	'supabase|service_role|memo-card-system|disable_signup|smtp',
	// 帳號與寄信能力的描述
	'寄不到|專案成員|手動重設',
	// 主程式檔案路徑：lib/、components/、app/(…)、app/api/（前面接 / 或 - 的是套件內路徑，例如 dist/components/）
	'(^|[^a-z/-])(lib|components)/[a-z]',
	'(^|[^a-z/-])app/(\\(|api/)',
	// 環境檔
	'(^|[^a-z.])\\.env([^a-z]|$)',
	// F1 主機位置：雲端區域代碼與常見資料中心城市
	'tokyo|東京|mumbai|孟買|singapore|新加坡|frankfurt|法蘭克福|ap-(northeast|southeast|south)-[0-9]|us-(east|west)-[0-9]|eu-(west|central)-[0-9]',
	// F2 後端與服務名稱：託管、寄信、監控、資料庫與驗證服務
	'vercel|cloudflare|resend|sentry|upstash|postgres|postgrest|gotrue|pgrst|mailpit',
];

/** 憑證樣式：也用於 package-lock.json。 */
const SECRET_PATTERNS = [
	'ghp_[a-z0-9]{20,}|github_pat_[a-z0-9_]{20,}|sk-[a-z0-9_-]{20,}|-----begin [a-z ]*private key-----',
	'eyj[a-z0-9_-]{10,}\\.[a-z0-9_-]{10,}|akia[0-9a-z]{16}|aiza[0-9a-z_-]{35}',
];

/** 需要再判斷的樣式：其他切片的 harness 路徑、帶行號的檔案引用、電子郵件。 */
const HARNESS_RE = 'docs/harness/[a-z0-9-]+/';
const PATH_REF_RE = '[a-z0-9_./-]+\\.(tsx?|jsx?|mjs|md|sql|json):[0-9]';
const EMAIL_RE = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}';

const CONTENT_PATTERNS = [...STRICT_PATTERNS, ...SECRET_PATTERNS, HARNESS_RE, PATH_REF_RE, EMAIL_RE];

/** 圖片是真正的二進位檔，不當文字掃描；其他檔案一律當文字掃描（含被標成二進位的文字檔）。 */
const BINARY_EXCLUDES = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'woff', 'woff2'].map(
	(ext) => `:(exclude,glob)**/*.${ext}`,
);

const HARNESS_PATH = /docs\/harness\/([a-z0-9-]+)\//gi;
const HARNESS_OK = new Set(['portfolio-site', 'design-expansion']);
const PATH_REF = /([a-z0-9_./-]+\.(?:tsx?|jsx?|mjs|md|sql|json)):[0-9]/gi;

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const ALLOWED_EMAIL = [/@users\.noreply\.github\.com$/i, /^noreply@anthropic\.com$/i, /@example\.com$/i];

/** 歷史中已知無害的整行（檔案、去頭尾空白後的整行文字）。本儲存庫從空清單開始（spec R11 第 1 點）。 */
const ALLOWED = [];

function git(args) {
	const r = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
	if (r.status !== 0 && r.status !== 1) {
		console.error(`check-public: git ${args.join(' ')} failed: ${(r.stderr || '').trim()}`);
		process.exit(2);
	}
	return r.stdout ?? '';
}

function isAllowedEmail(addr) {
	return ALLOWED_EMAIL.some((re) => re.test(addr));
}

/** 本儲存庫 HEAD 的檔名（含路徑與檔名本身），用來判斷「檔案:行號」引用是否指向本儲存庫自己的檔案。 */
function ownFileNames() {
	const names = new Set();
	for (const f of git(['ls-tree', '-r', '--name-only', 'HEAD']).split('\n').filter(Boolean)) {
		names.add(f.toLowerCase());
		names.add(f.split('/').pop().toLowerCase());
	}
	return names;
}

/** 一行文字是否有問題（命中樣式且不是已知無害的形式）。 */
function lineProblem(text, ownNames) {
	if ([...STRICT_PATTERNS, ...SECRET_PATTERNS].some((p) => new RegExp(p, 'i').test(text))) return true;
	if (!(text.match(EMAIL) ?? []).every(isAllowedEmail)) return true;
	if (![...text.matchAll(HARNESS_PATH)].every((m) => HARNESS_OK.has(m[1].toLowerCase()))) return true;
	for (const m of text.matchAll(PATH_REF)) {
		const ref = m[1].toLowerCase().replace(/^\.?\//, '');
		if (!ownNames.has(ref) && !ownNames.has(ref.split('/').pop())) return true;
	}
	return false;
}

const allowed = new Set(ALLOWED.map(([f, t]) => `${f}\u0000${t}`));
const range = process.argv[2] ?? 'HEAD';
const commits = git(['rev-list', range]).split('\n').filter(Boolean);
const problems = new Map();
const used = new Set();

const ownNames = ownFileNames();
// 本腳本自身：只信任目前版本的每一行（樣式與允許清單）；歷史中曾出現、後來刪掉的行照常判斷。
const selfLines = new Set(
	git(['show', `HEAD:${SELF}`]).split('\n').map((l) => l.trim()).filter(Boolean),
);

function scan(sha, patterns, pathspec) {
	const out = git(['grep', '-n', '--text', '-i', '-E', ...patterns.flatMap((p) => ['-e', p]), sha, '--', ...pathspec]);
	for (const line of out.split('\n').filter(Boolean)) {
		// <sha>:<path>:<lineno>:<text>
		const m = line.match(/^[0-9a-f]{40}:(.+?):(\d+):(.*)$/);
		if (!m) continue;
		const [, file, lineNo, text] = m;
		const key = `${file}\u0000${text.trim()}`;
		if (allowed.has(key)) {
			used.add(key);
			continue;
		}
		if (file === SELF && selfLines.has(text.trim())) continue;
		if (!lineProblem(text, ownNames)) continue;
		if (!problems.has(key)) problems.set(key, `${sha.slice(0, 7)} ${file}:${lineNo}: ${text.trim().slice(0, 160)}`);
	}
}

for (const sha of commits) {
	scan(sha, CONTENT_PATTERNS, ['.', ':(exclude)package-lock.json', ...BINARY_EXCLUDES]);
	// lockfile 內容大多是套件路徑，只查憑證與電子郵件。
	scan(sha, [...SECRET_PATTERNS, EMAIL_RE], ['package-lock.json']);
}

for (const sha of commits) {
	const [ae, ce, body] = git(['show', '-s', '--format=%ae%x00%ce%x00%B', sha]).split('\u0000');
	for (const who of [ae, ce]) {
		if (who.trim() !== NOREPLY) problems.set(`id:${sha}:${who}`, `${sha.slice(0, 7)} 提交者身分不是 noreply：${who.trim()}`);
	}
	for (const line of body.split('\n')) {
		if (lineProblem(line, ownNames)) {
			problems.set(`msg:${sha}:${line}`, `${sha.slice(0, 7)} 提交訊息：${line.trim().slice(0, 160)}`);
		}
	}
}

const unused = [...allowed].filter((k) => !used.has(k));
if (range === 'HEAD' && unused.length > 0) {
	console.error(`check-public: 警告：允許清單有 ${unused.length} 項在歷史中沒有出現，請檢查是否過時：`);
	for (const k of unused) console.error(`  ${k.replace('\u0000', ': ').slice(0, 120)}`);
}

if (problems.size > 0) {
	console.log([...problems.values()].join('\n'));
	console.error(`check-public: ${problems.size} 個命中，掃描 ${commits.length} 個提交`);
	process.exit(1);
}
console.error(`check-public: 乾淨，掃描 ${commits.length} 個提交`);
