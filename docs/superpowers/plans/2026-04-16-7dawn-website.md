# 7dawn 官网 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal：** 基于 spec `docs/superpowers/specs/2026-04-16-7dawn-website-design.md` 和已验证的 `demo/index.html`，产出一个可部署到 Vercel 的 Next.js 15 双语官网 MVP。

**架构：** 单页面 Next.js 15 App Router 应用，按 `/zh` `/en` 路由分语言。服务端渲染 + 静态化。Hero 光雾用原生 WebGL（`<canvas>`）在客户端渲染，其余区块为纯 HTML/CSS。样式通过 Tailwind v4 + CSS variables 承载 xAI 设计系统。

**技术栈：** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + next-intl + Geist Mono/Sans + Noto Sans SC + 原生 WebGL + IntersectionObserver。部署到 Vercel。

**实施注意事项：**

- **复用 demo**：很多实现已在 `demo/index.html` 里验证过，比如 WebGL shader、i18n 字典、scroll reveal 逻辑。这些代码可以直接移植到组件里，不要重写。
- **测试策略**：这是前端视觉/样式项目，不强行 TDD。仅对含逻辑的部分（shader uniform、i18n key 查找）写单元测试。页面级验证通过 `npm run dev` 本地浏览器 + 目标端口 screenshot + 手动翻。
- **git 起点**：项目目录当前不是 git 仓库，在 Task 1 初始化。
- **DESIGN_XAI.md 是视觉真相源**，所有尺寸、颜色、字体疑问查这里。

---

## 文件结构（目标）

```
sin7y/
├── .gitignore                    # [new]
├── next.config.ts                # [new] Next.js 配置，含 next-intl plugin
├── package.json                  # [new]
├── postcss.config.mjs            # [new]
├── tsconfig.json                 # [new]
├── app/
│   ├── globals.css               # [new] Tailwind + xAI design tokens
│   ├── layout.tsx                # [new] 根 layout，lang 动态
│   └── [locale]/
│       ├── layout.tsx            # [new] locale-aware provider
│       └── page.tsx              # [new] MVP 单页面
├── components/
│   ├── Nav.tsx                   # [new]
│   ├── LangSwitch.tsx            # [new]
│   ├── Hero.tsx                  # [new]
│   ├── FogCanvas.tsx             # [new] WebGL 光雾
│   ├── Product.tsx               # [new]
│   ├── Directions.tsx            # [new]
│   ├── Team.tsx                  # [new]
│   ├── Contact.tsx               # [new]
│   ├── Footer.tsx                # [new]
│   └── ScrollReveal.tsx          # [new] IntersectionObserver wrapper
├── i18n/
│   ├── request.ts                # [new] next-intl server config
│   └── routing.ts                # [new] next-intl routing
├── messages/
│   ├── zh.json                   # [new]
│   └── en.json                   # [new]
├── middleware.ts                 # [new] next-intl 中间件
├── public/
│   └── 7dawn-mark.svg            # [copy from /7dawn-mark.svg]
└── tests/
    └── i18n.test.ts              # [new] 字典完整性测试
```

---

## 阶段 0：项目初始化（Task 1–3）

### Task 1: Git 初始化 + `.gitignore`

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: 初始化 git**

```bash
cd /Users/tristan/projects/aeroship/sin7y
git init
git branch -m main
```

预期输出：`Initialized empty Git repository in ...`

- [ ] **Step 2: 创建 `.gitignore`**

写入 `/Users/tristan/projects/aeroship/sin7y/.gitignore`：

```
# deps
node_modules
.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
coverage

# next.js
.next/
out/
build/

# env / secrets
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# misc
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# editor
.vscode/
.idea/
```

- [ ] **Step 3: 首次 commit（只提现有设计资产，不提 demo/）**

```bash
git add DESIGN_NOTES.md DESIGN_XAI.md 7dawn.svg 7dawn-mark.svg 7dawn.png .gitignore docs
git commit -m "chore: initial commit with design spec and assets"
```

---

### Task 2: Next.js 项目脚手架

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: 创建 Next.js 项目（非交互式）**

```bash
cd /Users/tristan/projects/aeroship/sin7y
pnpm dlx create-next-app@latest . --ts --tailwind --app --src-dir false --eslint --turbopack --import-alias "@/*" --use-pnpm --skip-install --yes
```

脚手架工具会在当前目录创建 `package.json`、`tsconfig.json`、`app/`、`next.config.ts` 等。**如果报错说目录非空，删除 create 工具生成的冲突文件即可，我们已有的 `DESIGN_*.md` 等保留**。

- [ ] **Step 2: 安装依赖**

```bash
pnpm install
```

预期：无错误，生成 `node_modules/` 和 `pnpm-lock.yaml`。

- [ ] **Step 3: 安装 next-intl**

```bash
pnpm add next-intl
```

- [ ] **Step 4: 本地启动确认**

```bash
pnpm dev
```

预期：`http://localhost:3000` 显示 Next.js 默认欢迎页。按 Ctrl+C 停止。

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts postcss.config.mjs eslint.config.* app public
git commit -m "chore: bootstrap next.js 15 + typescript + tailwind v4"
```

---

### Task 3: 安装字体 + 全局样式 tokens

**Files:**
- Create: `app/globals.css`（覆盖脚手架默认）
- Modify: `app/layout.tsx`（加字体加载）

- [ ] **Step 1: 覆盖 `app/globals.css` 为 xAI design tokens**

```css
@import "tailwindcss";

@theme {
  --color-bg: #1f2228;
  --color-text: #ffffff;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-sans: var(--font-geist-sans), "Noto Sans SC", system-ui, sans-serif;
}

@layer base {
  :root {
    --text-70: rgba(255, 255, 255, 0.7);
    --text-50: rgba(255, 255, 255, 0.5);
    --text-30: rgba(255, 255, 255, 0.3);
    --border-10: rgba(255, 255, 255, 0.1);
    --border-20: rgba(255, 255, 255, 0.2);
    --surface-3: rgba(255, 255, 255, 0.03);
    --surface-8: rgba(255, 255, 255, 0.08);
  }

  html, body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 2: 改写 `app/layout.tsx` 加载 Geist Mono + Geist Sans + Noto Sans SC**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "7dawn · 奇点黎明",
  description: "AI 原生智研 · 点亮商业航天的每一颗星",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSC.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 启动 dev server 验证字体加载**

```bash
pnpm dev
```

访问 `http://localhost:3000`，打开 DevTools → Network，确认 `Geist-xxx.woff2` / `GeistMono-xxx.woff2` / `NotoSansSC-xxx.woff2` 均 200 加载。背景应为深色 `#1f2228`。按 Ctrl+C 停止。

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx package.json pnpm-lock.yaml
git commit -m "feat: xAI design tokens + geist/noto sans sc fonts"
```

---

## 阶段 1：i18n 与路由（Task 4–6）

### Task 4: next-intl 路由与中间件

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: 创建 `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 2: 创建 `i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: 创建 `middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
```

- [ ] **Step 4: 改写 `next.config.ts` 接入 next-intl plugin**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Commit**

```bash
git add i18n middleware.ts next.config.ts
git commit -m "feat: next-intl routing + middleware"
```

---

### Task 5: 消息字典（zh.json, en.json）

**Files:**
- Create: `messages/zh.json`, `messages/en.json`

- [ ] **Step 1: 创建 `messages/zh.json`**

```json
{
  "meta": {
    "title": "7dawn · 奇点黎明 — AI 原生航天器设计",
    "description": "AI 原生智研 · 点亮商业航天的每一颗星"
  },
  "nav": {
    "product": "产品",
    "directions": "方向",
    "team": "团队",
    "contact": "联系"
  },
  "hero": {
    "label": "// 奇点黎明 · 7dawn",
    "title1": "跨越奇点",
    "title2": "星海铸魂",
    "sub": "AI 原生智研 · 点亮商业航天的每一颗星",
    "cta": "联系我们",
    "scroll": "SCROLL"
  },
  "product": {
    "label": "// 核心产品",
    "title": "3Studio",
    "lede": "面向航天器的 AI 原生设计引擎。从任务输入到工程级方案,让一名工程师配合智能体完成过去团队数周的设计工作。",
    "body": "3Studio 将航天器设计全流程拆解为可编排的 Agent 节点:轨道、构型、热控、动力学——每一环都能自主推理、交叉验证、沉淀为可审计的数字档案。",
    "tag1": "AI AGENT 协同",
    "tag2": "数字孪生",
    "tag3": "工程级输出",
    "mockLabel": "3Studio · UI"
  },
  "directions": {
    "label": "// 战略方向",
    "title1": "三条曲线,",
    "title2": "一个奇点。",
    "lede": "从设计到在轨,再到协同——我们沿着商业航天的全生命周期铺设 AI 基础设施。",
    "d1Title": "航天器设计",
    "d1Desc": "主赛道。3Studio 覆盖从总体设计到分系统验证,并向数字孪生延伸,贯穿设计—发射—在轨全周期。",
    "d2Title": "星座运维",
    "d2Desc": "第二曲线。面向万颗星规模的智能运维:碰撞预警、任务规划、故障预测,AI 提议、人做决策。",
    "d3Title": "工程协作平台",
    "d3Desc": "远景。航天垂直领域的 AI 原生工程协作——将工具链、知识库、流程管理内化为智能体网络。"
  },
  "team": {
    "label": "// 团队",
    "title1": "一支懂航天、",
    "title2": "更懂 AI 的团队。",
    "lede": "源自清华与中国科学院,横跨航天工程、机器学习与系统软件。我们在型号研制一线和大模型产业化一线都留下过足迹。",
    "stat1Value": "清华 · 中科院",
    "stat1Label": "核心团队背景",
    "stat2ValuePrefix": "20–40",
    "stat2ValueUnit": "亿￥ / 年",
    "stat2Label": "中国航天器设计软件市场",
    "stat3Value": "2700+",
    "stat3Label": "对标 Blue Origin 全员部署的 AI Agent 数"
  },
  "contact": {
    "label": "// 联系",
    "title": "欢迎和我们聊聊。",
    "lede": "无论你是航天链主、早期投资人,还是志同道合的工程师——先发一封邮件,我们很快回复。",
    "email": "EMAIL",
    "phone": "PHONE"
  },
  "footer": {
    "copy": "© 2026 7DAWN · 奇点黎明",
    "city": "BEIJING · 北京"
  }
}
```

- [ ] **Step 2: 创建 `messages/en.json`**

```json
{
  "meta": {
    "title": "7dawn — AI-native spacecraft design",
    "description": "AI-native engineering · Lighting every star of New Space"
  },
  "nav": {
    "product": "Product",
    "directions": "Directions",
    "team": "Team",
    "contact": "Contact"
  },
  "hero": {
    "label": "// 7DAWN · SINGULARITY DAWN",
    "title1": "Beyond Singularity",
    "title2": "Awaken the Stars",
    "sub": "AI-native engineering · Lighting every star of New Space",
    "cta": "Contact Us",
    "scroll": "SCROLL"
  },
  "product": {
    "label": "// CORE PRODUCT",
    "title": "3Studio",
    "lede": "The AI-native design engine for spacecraft. From mission brief to engineering-grade blueprint — one engineer, a crew of agents, the work of a team.",
    "body": "3Studio decomposes the spacecraft design pipeline into orchestrated agent nodes: orbit, configuration, thermal, dynamics — each reasoning autonomously, cross-checking each other, and leaving an auditable digital trail.",
    "tag1": "AGENT ORCHESTRATION",
    "tag2": "DIGITAL TWIN",
    "tag3": "ENGINEERING-GRADE",
    "mockLabel": "3Studio · UI"
  },
  "directions": {
    "label": "// DIRECTIONS",
    "title1": "Three curves,",
    "title2": "one singularity.",
    "lede": "From design to orbit to collaboration — we are building AI infrastructure for the full lifecycle of commercial aerospace.",
    "d1Title": "Spacecraft Design",
    "d1Desc": "The main track. 3Studio covers system-level design through subsystem validation, extending into digital twin across the design–launch–orbit lifecycle.",
    "d2Title": "Constellation Ops",
    "d2Desc": "The second curve. Intelligent operations at the scale of 10,000+ satellites: collision avoidance, mission planning, fault prediction — AI proposes, humans decide.",
    "d3Title": "Engineering Platform",
    "d3Desc": "The horizon. An AI-native engineering collaboration platform for aerospace — toolchains, knowledge bases, and workflows absorbed into an agent mesh."
  },
  "team": {
    "label": "// TEAM",
    "title1": "Aerospace fluent.",
    "title2": "AI native.",
    "lede": "From Tsinghua and the Chinese Academy of Sciences — spanning spacecraft engineering, machine learning, and systems software. We have shipped at both the program-development frontline and the large-model industrialization frontline.",
    "stat1Value": "Tsinghua · CAS",
    "stat1Label": "Core team background",
    "stat2ValuePrefix": "¥2–4B",
    "stat2ValueUnit": "/ YR",
    "stat2Label": "China spacecraft design software market",
    "stat3Value": "2700+",
    "stat3Label": "Company-wide AI agents at Blue Origin — our benchmark"
  },
  "contact": {
    "label": "// CONTACT",
    "title": "Let's talk.",
    "lede": "Aerospace prime, early-stage investor, or fellow engineer — send us an email. We reply fast.",
    "email": "EMAIL",
    "phone": "PHONE"
  },
  "footer": {
    "copy": "© 2026 7DAWN",
    "city": "BEIJING"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add messages
git commit -m "feat: zh/en message dictionaries"
```

---

### Task 6: 字典完整性单元测试

**Files:**
- Create: `tests/i18n.test.ts`
- Modify: `package.json`（加 vitest 脚本）

- [ ] **Step 1: 装 vitest**

```bash
pnpm add -D vitest
```

- [ ] **Step 2: 写测试 `tests/i18n.test.ts`**

```ts
import { describe, test, expect } from "vitest";
import zh from "../messages/zh.json";
import en from "../messages/en.json";

function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      keys.push(...collectKeys(v as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

describe("i18n dictionaries", () => {
  test("zh and en have identical key sets", () => {
    const zhKeys = collectKeys(zh);
    const enKeys = collectKeys(en);
    expect(enKeys).toEqual(zhKeys);
  });

  test("no empty string values in zh", () => {
    const keys = collectKeys(zh);
    for (const key of keys) {
      const value = key.split(".").reduce<unknown>(
        (acc, k) => (acc as Record<string, unknown>)[k],
        zh,
      );
      expect(value, `zh.${key} is empty`).not.toBe("");
    }
  });

  test("no empty string values in en", () => {
    const keys = collectKeys(en);
    for (const key of keys) {
      const value = key.split(".").reduce<unknown>(
        (acc, k) => (acc as Record<string, unknown>)[k],
        en,
      );
      expect(value, `en.${key} is empty`).not.toBe("");
    }
  });
});
```

- [ ] **Step 3: 在 `package.json` 里加 test 脚本**

找到 `"scripts"` 字段，加入 `"test": "vitest run"`。

- [ ] **Step 4: 跑测试确认通过**

```bash
pnpm test
```

预期：3 tests passed。如果 key set 不等，修 `messages/*.json` 补齐缺失的 key（相同键但可以留中文不翻译作临时）。

- [ ] **Step 5: Commit**

```bash
git add tests package.json pnpm-lock.yaml
git commit -m "test: i18n dictionary parity and non-empty assertions"
```

---

## 阶段 2：骨架（Task 7–8）

### Task 7: `[locale]/layout.tsx` + 根 layout `lang` 动态

**Files:**
- Create: `app/[locale]/layout.tsx`
- Modify: `app/layout.tsx` 把 `<html>` 挪到 `[locale]/layout.tsx`

**方案：** Next.js 15 不能在根 layout 动态设 `<html lang>`，必须用 locale layout 作为 `<html>` 容器。所以把 `<html><body>` 挪到 `[locale]/layout.tsx`，根 layout 变成透传。

- [ ] **Step 1: 改写根 `app/layout.tsx` 为透传**

```tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

注意：移除根 layout 里的 `<html>`、`<body>`、字体、metadata（都挪到 locale layout）。

- [ ] **Step 2: 创建 `app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSC.variable}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 删除/覆盖默认 `app/page.tsx`（脚手架生成的）**

```bash
rm app/page.tsx
```

- [ ] **Step 4: 创建 `app/[locale]/page.tsx`（占位，后续填充）**

```tsx
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <h1 className="text-white p-8">7dawn · placeholder</h1>
    </main>
  );
}
```

- [ ] **Step 5: 启动并确认路由工作**

```bash
pnpm dev
```

访问：
- `http://localhost:3000/` → 应自动重定向到 `/zh`
- `http://localhost:3000/zh` → 显示 "7dawn · placeholder"，`<html lang="zh">`
- `http://localhost:3000/en` → 显示 placeholder，`<html lang="en">`

用 DevTools 检查 `<html>` 的 `lang` 属性。

- [ ] **Step 6: Commit**

```bash
git add app
git commit -m "feat: locale-aware layout with next-intl provider"
```

---

### Task 8: 复制 logo 到 public

**Files:**
- Copy: `7dawn-mark.svg` → `public/7dawn-mark.svg`

- [ ] **Step 1: 复制**

```bash
cp 7dawn-mark.svg public/7dawn-mark.svg
```

- [ ] **Step 2: 确认可访问**

浏览器访问 `http://localhost:3000/7dawn-mark.svg`，应显示 7dawn 字母 logo。

- [ ] **Step 3: Commit**

```bash
git add public/7dawn-mark.svg
git commit -m "chore: add 7dawn logo to public"
```

---

## 阶段 3：Nav + LangSwitch（Task 9–10）

### Task 9: `LangSwitch` 组件

**Files:**
- Create: `components/LangSwitch.tsx`

- [ ] **Step 1: 写组件**

```tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

export default function LangSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // pathname is like /zh/... — replace first segment
    const rest = pathname.replace(/^\/(zh|en)(\/|$)/, "/");
    const target = `/${next}${rest === "/" ? "" : rest}`;
    router.replace(target);
  }

  return (
    <div className="flex gap-2 font-mono text-xs uppercase tracking-[1px]">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-2 py-1 transition-colors ${
            l === locale
              ? "text-white border border-white/20"
              : "text-white/50 hover:text-white"
          }`}
        >
          {l === "zh" ? "中" : "EN"}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/LangSwitch.tsx
git commit -m "feat: LangSwitch component"
```

---

### Task 10: `Nav` 组件

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: 写组件**

```tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
import LangSwitch from "./LangSwitch";

export default function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[#1f2228]/75">
      <Link href="#" className="block text-white transition-colors hover:text-white/50" aria-label="7dawn">
        <svg viewBox="380 560 1730 490" className="h-6 w-auto fill-current" aria-hidden="true">
          <use href="/7dawn-mark.svg#logo" />
        </svg>
      </Link>
      <ul className="hidden md:flex gap-8 list-none">
        <li><a href="#product" className="text-white text-sm transition-colors hover:text-white/50">{t("product")}</a></li>
        <li><a href="#directions" className="text-white text-sm transition-colors hover:text-white/50">{t("directions")}</a></li>
        <li><a href="#team" className="text-white text-sm transition-colors hover:text-white/50">{t("team")}</a></li>
        <li><a href="#contact" className="text-white text-sm transition-colors hover:text-white/50">{t("contact")}</a></li>
      </ul>
      <LangSwitch />
    </nav>
  );
}
```

**注意：** `<use href>` 引用外部 SVG 的 fragment 可能不工作（需要 SVG 里有 `id="logo"`）。更稳妥的做法是内联完整 SVG。改用下面版本：

```tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
import LangSwitch from "./LangSwitch";

function Logo() {
  return (
    <svg viewBox="380 560 1730 490" className="h-6 w-auto" aria-hidden="true">
      <g transform="translate(0, 1664) scale(0.1, -0.1)" fill="currentColor" fillRule="evenodd">
        <path d="M14059 10847 c25 -9 49 -14 53 -11 5 3 16 0 24 -7 8 -6 28 -12 44 -11 17 0 30 -4 30 -9 0 -5 9 -9 19 -9 11 0 22 -4 26 -10 3 -5 12 -7 19 -4 7 3 19 -2 26 -10 7 -9 17 -13 22 -10 5 3 17 0 26 -8 9 -8 31 -20 47 -28 91 -44 355 -279 355 -316 0 -8 4 -14 8 -14 7 0 17 -16 59 -95 32 -60 68 -176 83 -268 12 -76 5 -306 -11 -321 -5 -6 -9 0 -9 16 0 37 -57 186 -80 208 -3 3 -29 34 -57 70 -53 67 -177 185 -219 208 -13 7 -24 17 -24 22 0 6 -4 10 -9 10 -5 0 -33 16 -62 35 -30 19 -59 35 -66 35 -7 0 -13 4 -13 10 0 5 -6 7 -13 4 -8 -3 -20 2 -27 11 -7 8 -16 15 -21 15 -4 0 -20 5 -36 12 -15 6 -32 10 -37 9 -4 -1 -13 2 -20 7 -12 10 -89 31 -146 40 -113 19 -385 -2 -420 -32 -8 -7 -37 -19 -65 -26 -45 -12 -89 -31 -207 -91 -37 -19 -146 -105 -183 -145 -80 -87 -95 -104 -95 -113 0 -5 -3 -11 -7 -13 -10 -4 -73 -106 -73 -117 0 -5 -10 -20 -21 -35 -29 -37 -68 -152 -69 -201 0 -30 -3 -36 -10 -24 -16 27 -13 316 4 389 28 121 37 154 45 165 4 5 13 30 20 55 7 25 16 47 20 50 3 3 16 25 28 50 12 25 30 54 40 65 10 11 24 32 32 47 33 65 245 236 351 284 98 45 136 60 170 69 3 1 17 7 32 13 15 6 64 18 109 27 45 8 84 17 86 19 10 10 184 -3 222 -17z m-4259 -1429 l0 -1002 -72 80 c-40 43 -141 149 -225 235 l-153 155 0 544 0 544 222 223 c123 123 224 223 225 223 2 0 3 -451 3 -1002z m-2996 75 l-7 -268 -97 -125 c-100 -129 -315 -418 -669 -900 -537 -732 -1121 -1517 -1234 -1657 -52 -66 -62 -74 -120 -91 -34 -11 -181 -58 -326 -106 -145 -47 -266 -84 -269 -82 -2 3 33 53 79 113 129 168 103 134 491 658 53 72 183 248 290 391 106 144 256 346 333 450 288 390 965 1292 1029 1372 36 45 66 83 66 85 0 1 -522 2 -1160 2 -1061 0 -1158 1 -1142 16 9 9 86 73 170 143 84 71 185 159 225 197 l72 68 1138 1 1139 0 -8 -267z m11050 -450 c-120 -182 -441 -741 -924 -1611 -135 -243 -248 -441 -251 -442 -3 0 -13 17 -23 38 -21 45 -90 166 -162 284 l-53 87 68 118 c38 65 139 244 224 398 159 288 271 489 444 795 98 174 98 175 143 189 144 43 376 116 445 141 106 37 112 37 89 3z m-3708 -675 c-3 -381 -5 -807 -6 -945 l0 -253 -205 0 -205 0 0 945 0 945 211 0 211 0 -6 -692z m1463 276 c1 -6 -38 -81 -85 -165 -48 -85 -131 -239 -186 -344 -55 -104 -155 -287 -221 -405 -66 -118 -143 -258 -172 -310 -28 -52 -151 -275 -272 -495 -121 -220 -234 -426 -249 -457 l-28 -58 -338 0 -338 0 0 215 0 215 220 0 220 0 12 28 c7 15 30 56 52 92 21 36 123 216 226 400 103 184 235 418 292 520 298 528 424 752 461 820 22 41 54 100 72 130 18 30 54 95 80 144 l48 89 103 -204 c57 -112 103 -209 103 -215z m-3134 349 c3 -10 161 -175 350 -368 l345 -350 -3 -928 -2 -928 -57 68 c-31 37 -126 142 -212 233 l-156 165 2 383 3 382 -925 0 -925 0 -187 -187 -186 -186 166 -163 167 -163 668 -1 669 0 224 -217 c123 -120 224 -220 224 -223 0 -3 -438 -4 -973 -4 l-972 2 -302 293 -302 294 0 155 -1 155 327 328 328 327 1003 0 1003 0 -3 34 c-3 29 -32 64 -216 250 l-213 216 -827 0 -826 0 -226 225 -226 225 1127 0 c1065 0 1128 -1 1134 -17z m7933 -198 c92 -94 242 -248 335 -342 l167 -172 0 -938 -1 -938 -20 25 c-12 13 -111 118 -220 231 l-200 207 0 638 1 639 -204 207 -205 208 -701 0 -701 1 -204 -213 -204 -213 -1 -635 0 -635 -222 -222 c-122 -123 -223 -223 -224 -223 -1 0 0 417 3 926 l5 927 117 116 c172 172 556 581 559 597 3 12 138 14 860 16 846 3 857 3 875 -17 10 -11 94 -97 185 -190z m-11306 149 c73 -78 665 -666 679 -674 7 -5 10 -181 9 -576 l0 -569 -313 -312 -312 -313 -922 0 c-754 0 -923 2 -930 13 -4 8 -51 53 -103 102 -52 49 -184 175 -292 281 l-198 192 0 593 0 593 143 146 c207 211 486 505 516 545 l26 34 822 1 822 0 53 -56z m6748 -714 c296 -547 640 -1167 723 -1300 l40 -64 -18 -31 c-42 -70 -159 -284 -191 -347 -19 -37 -38 -68 -42 -68 -4 0 -25 35 -47 78 -23 42 -95 174 -162 292 -133 237 -362 654 -483 880 -43 80 -112 208 -153 284 -76 140 -76 140 -58 165 20 28 147 241 200 334 18 32 37 55 41 50 4 -4 71 -127 150 -273z M7361 8351 l-201 -209 0 -439 0 -440 178 -167 177 -166 740 0 740 0 177 178 177 177 1 427 1 427 -213 211 -212 210 -682 0 -682 0 -201 -209z"/>
      </g>
    </svg>
  );
}

export default function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[#1f2228]/75">
      <Link href="#" className="block text-white transition-colors hover:text-white/50" aria-label="7dawn">
        <Logo />
      </Link>
      <ul className="hidden md:flex gap-8 list-none">
        <li><a href="#product" className="text-white text-sm transition-colors hover:text-white/50">{t("product")}</a></li>
        <li><a href="#directions" className="text-white text-sm transition-colors hover:text-white/50">{t("directions")}</a></li>
        <li><a href="#team" className="text-white text-sm transition-colors hover:text-white/50">{t("team")}</a></li>
        <li><a href="#contact" className="text-white text-sm transition-colors hover:text-white/50">{t("contact")}</a></li>
      </ul>
      <LangSwitch />
    </nav>
  );
}
```

- [ ] **Step 2: 在 `page.tsx` 引入并确认可见**

修改 `app/[locale]/page.tsx`：

```tsx
import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main className="pt-24">
        <h1 className="text-white p-8">7dawn · placeholder</h1>
      </main>
    </>
  );
}
```

- [ ] **Step 3: `pnpm dev` 肉眼验证**

访问 `/zh` 和 `/en`，Nav 应出现在顶部，logo 清晰可见（"d" 和 "a" 有空心），中间链接随语言变化，右侧语言切换器可切换。

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx app/[locale]/page.tsx
git commit -m "feat: Nav component with inline logo + lang switch"
```

---

## 阶段 4：Hero（Task 11–12）

### Task 11: `FogCanvas` 组件（WebGL 光雾）

**Files:**
- Create: `components/FogCanvas.tsx`

**移植自 `demo/index.html` 的 shader + JS 逻辑。**

- [ ] **Step 1: 写组件**

```tsx
"use client";

import { useEffect, useRef } from "react";

const vertexSrc = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSrc = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec2 u_trail0;
  uniform vec2 u_trail1;
  uniform vec2 u_trail2;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 p = uv * aspect;
    vec2 m = u_mouse * aspect;

    vec2 flow = vec2(u_time * 0.03, u_time * 0.015);
    float n = fbm(p * 3.0 + flow);
    float n2 = fbm(p * 6.0 - flow * 2.0);

    float d = length(p - m);
    float core = exp(-d * 9.0) * 0.55;
    float glow = exp(-d * 4.0) * 0.12;

    float t0 = exp(-length(p - u_trail0 * aspect) * 6.0) * 0.18;
    float t1 = exp(-length(p - u_trail1 * aspect) * 5.0) * 0.10;
    float t2 = exp(-length(p - u_trail2 * aspect) * 4.0) * 0.05;

    float plume = smoothstep(0.28, 0.0, d - n * 0.12 - n2 * 0.05) * 0.12;
    float ambient = fbm(p * 2.0 + flow * 0.5) * 0.03;

    float total = clamp(core + glow + t0 + t1 + t2 + plume + ambient, 0.0, 1.0);
    vec3 bg = vec3(0.122, 0.133, 0.157);
    gl_FragColor = vec4(mix(bg, vec3(1.0), total), 1.0);
  }
`;

export default function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true });
    if (!gl) return;

    function createShader(type: number, src: string) {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return sh;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uT0 = gl.getUniformLocation(program, "u_trail0");
    const uT1 = gl.getUniformLocation(program, "u_trail1");
    const uT2 = gl.getUniformLocation(program, "u_trail2");

    let target = [0.5, 0.5];
    const mouse = [0.5, 0.5];
    const trail0 = [0.5, 0.5];
    const trail1 = [0.5, 0.5];
    const trail2 = [0.5, 0.5];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resize);
    resize();

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      target = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      ];
    }
    window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    const start = performance.now();
    function render() {
      mouse[0] += (target[0] - mouse[0]) * 0.025;
      mouse[1] += (target[1] - mouse[1]) * 0.025;
      trail0[0] += (mouse[0] - trail0[0]) * 0.05;
      trail0[1] += (mouse[1] - trail0[1]) * 0.05;
      trail1[0] += (trail0[0] - trail1[0]) * 0.04;
      trail1[1] += (trail0[1] - trail1[1]) * 0.04;
      trail2[0] += (trail1[0] - trail2[0]) * 0.03;
      trail2[1] += (trail1[1] - trail2[1]) * 0.03;

      const t = (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse, mouse[0], mouse[1]);
      gl!.uniform2f(uT0, trail0[0], trail0[1]);
      gl!.uniform2f(uT1, trail1[0], trail1[1]);
      gl!.uniform2f(uT2, trail2[0], trail2[1]);
      gl!.uniform1f(uTime, t);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FogCanvas.tsx
git commit -m "feat: FogCanvas WebGL fog effect (ported from demo)"
```

---

### Task 12: `Hero` 组件

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: 写组件**

```tsx
import { useTranslations } from "next-intl";
import FogCanvas from "./FogCanvas";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-12 md:px-12">
      <FogCanvas />
      <div className="relative z-10 w-full max-w-[1200px] text-center">
        <div className="mb-8 inline-block border border-white/20 px-3 py-1 font-mono text-xs uppercase tracking-[2px] text-white/50">
          {t("label")}
        </div>
        <h1 className="hero-title mb-6 font-mono font-light leading-[1.05] tracking-[-0.01em]">
          {t("title1")}<br />
          <span className="text-white/50">{t("title2")}</span>
        </h1>
        <p className="mx-auto mb-14 max-w-[640px] text-base leading-[1.5] text-white/70 md:text-lg lg:text-xl">
          {t("sub")}
        </p>
        <a
          href="#contact"
          className="inline-block bg-white px-7 py-3.5 font-mono text-sm uppercase tracking-[1.4px] text-[#1f2228] transition-colors hover:bg-white/90"
        >
          {t("cta")} →
        </a>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[2px] text-white/30">
        {t("scroll")}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 在 `globals.css` 加 Hero 标题响应式字号**

在 `@layer base` 块内追加：

```css
.hero-title {
  font-size: clamp(48px, 10vw, 140px);
}
html[lang="en"] .hero-title {
  font-size: clamp(36px, 5.5vw, 84px);
  letter-spacing: -0.02em;
  line-height: 1.1;
}
```

- [ ] **Step 3: 插入到 `page.tsx`**

修改 `app/[locale]/page.tsx`：

```tsx
import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: `pnpm dev` 验证**

- 鼠标移动时光雾跟随（有拖尾延迟）
- 中文版主标「跨越奇点 / 星海铸魂」显示正确
- 切到 EN，主标变「Beyond Singularity / Awaken the Stars」，字号明显变小
- CTA 按钮为白底黑字 mono 大写
- 底部 SCROLL 提示可见

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx app/globals.css app/[locale]/page.tsx
git commit -m "feat: Hero with WebGL fog and bilingual tagline"
```

---

## 阶段 5：内容区块（Task 13–17）

### Task 13: `ScrollReveal` 工具组件

**Files:**
- Create: `components/ScrollReveal.tsx`

- [ ] **Step 1: 写组件**

```tsx
"use client";

import { useEffect, useRef, ReactNode } from "react";

export default function ScrollReveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("is-visible"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      className={`scroll-reveal ${className}`}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 2: 在 `globals.css` 加 reveal 样式**

在 `@layer base` 块内追加：

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ScrollReveal.tsx app/globals.css
git commit -m "feat: ScrollReveal with IntersectionObserver"
```

---

### Task 14: `Product` 组件

**Files:**
- Create: `components/Product.tsx`

- [ ] **Step 1: 写组件**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Product() {
  const t = useTranslations("product");

  return (
    <section id="product" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[2px] text-white/50">
            {t("label")}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="mb-6 font-mono text-4xl font-light leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mb-12 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <ScrollReveal>
            <p className="mb-6 text-base leading-[1.6] text-white/70 md:text-lg">
              {t("body")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="tag">{t("tag1")}</span>
              <span className="tag">{t("tag2")}</span>
              <span className="tag">{t("tag3")}</span>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="product-mock" data-label={t("mockLabel")} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 在 `globals.css` 加 tag 和 product-mock 样式**

```css
.tag {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.product-mock {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  aspect-ratio: 16 / 10;
  transform: perspective(1200px) rotateX(4deg) rotateY(-6deg);
  transition: transform 0.6s;
  overflow: hidden;
}
.product-mock:hover {
  transform: perspective(1200px) rotateX(2deg) rotateY(-3deg);
}
.product-mock::before {
  content: attr(data-label);
  position: absolute;
  top: 16px;
  left: 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}
.product-mock::after {
  content: '';
  position: absolute;
  inset: 40px 24px 24px;
  background:
    linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)) no-repeat 0 0 / 30% 1px,
    linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)) no-repeat 0 20px / 100% 1px,
    linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)) no-repeat 0 40px / 60% 1px,
    linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)) no-repeat 0 60px / 80% 1px,
    linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)) no-repeat 0 100px / 45% 1px;
  opacity: 0.6;
}
```

- [ ] **Step 3: 在 `page.tsx` 引入**

```tsx
import Product from "@/components/Product";
// ...
<Hero />
<Product />
```

- [ ] **Step 4: 验证**：`pnpm dev`，滚到产品区，应看到 3Studio + 3 个 tag + 透视 mock。hover mock 时倾斜角变化。

- [ ] **Step 5: Commit**

```bash
git add components/Product.tsx app/globals.css app/[locale]/page.tsx
git commit -m "feat: Product section with 3Studio and mock"
```

---

### Task 15: `Directions` 组件

**Files:**
- Create: `components/Directions.tsx`

- [ ] **Step 1: 写组件**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Directions() {
  const t = useTranslations("directions");

  const items = [
    { n: "01", title: t("d1Title"), desc: t("d1Desc") },
    { n: "02", title: t("d2Title"), desc: t("d2Desc") },
    { n: "03", title: t("d3Title"), desc: t("d3Desc") },
  ];

  return (
    <section id="directions" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[2px] text-white/50">
            {t("label")}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="mb-6 font-mono text-4xl font-light leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-6xl">
            {t("title1")}<br />
            <span className="text-white/50">{t("title2")}</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mb-16 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {items.map(({ n, title, desc }) => (
            <ScrollReveal key={n}>
              <div className="border-t border-white/20 pt-6">
                <span className="mb-6 block font-mono text-6xl font-light leading-none text-white/30 md:text-7xl lg:text-[96px]">
                  {n}
                </span>
                <div className="mb-4 font-mono text-xl">{title}</div>
                <p className="text-[15px] leading-[1.6] text-white/70">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 引入并验证**

同样在 `page.tsx` 加 `<Directions />` 在 `<Product />` 之后，`pnpm dev` 验证：三列 01/02/03 大号灰数字 + 标题 + 描述。

- [ ] **Step 3: Commit**

```bash
git add components/Directions.tsx app/[locale]/page.tsx
git commit -m "feat: Directions section with 01/02/03"
```

---

### Task 16: `Team` 组件

**Files:**
- Create: `components/Team.tsx`

- [ ] **Step 1: 写组件**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Team() {
  const t = useTranslations("team");

  return (
    <section id="team" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[2px] text-white/50">
            {t("label")}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="mb-6 font-mono text-4xl font-light leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-6xl">
            {t("title1")}<br />
            <span className="text-white/50">{t("title2")}</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mb-16 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-3 md:gap-16">
          <ScrollReveal>
            <div className="stat-value-text">{t("stat1Value")}</div>
            <div className="stat-label">{t("stat1Label")}</div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="stat-value">
              {t("stat2ValuePrefix")}
              <span className="ml-[6px] text-[0.55em] tracking-[0.5px] text-white/50">
                {t("stat2ValueUnit")}
              </span>
            </div>
            <div className="stat-label">{t("stat2Label")}</div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="stat-value">{t("stat3Value")}</div>
            <div className="stat-label">{t("stat3Label")}</div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 在 `globals.css` 加 stat 样式**

```css
.stat-value {
  font-family: var(--font-mono);
  font-size: clamp(32px, 3.2vw, 44px);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 12px;
}
.stat-value-text {
  font-family: var(--font-sans);
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.2;
  margin-bottom: 12px;
}
.stat-label {
  font-family: var(--font-sans);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}
```

- [ ] **Step 3: 插入 page，验证**。三个数据块应在一行，第一块「清华 · 中科院」不换行，第二块数字大单位小。

- [ ] **Step 4: Commit**

```bash
git add components/Team.tsx app/globals.css app/[locale]/page.tsx
git commit -m "feat: Team section with 3 stats"
```

---

### Task 17: `Contact` 组件 + `Footer`

**Files:**
- Create: `components/Contact.tsx`, `components/Footer.tsx`

- [ ] **Step 1: 写 `Contact.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[2px] text-white/50">
            {t("label")}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="mb-6 font-mono text-4xl font-light leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mb-16 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-12 md:max-w-[720px] md:grid-cols-2">
          <ScrollReveal>
            <div className="border-t border-white/20 pt-6">
              <div className="mb-3 font-mono text-xs uppercase tracking-[2px] text-white/50">
                {t("email")}
              </div>
              <div className="font-mono text-base">
                <a href="mailto:hello@7dawn.ai" className="text-white transition-colors hover:text-white/50">
                  hello@7dawn.ai
                </a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="border-t border-white/20 pt-6">
              <div className="mb-3 font-mono text-xs uppercase tracking-[2px] text-white/50">
                {t("phone")}
              </div>
              <div className="font-mono text-base">
                <a href="tel:+8600000000000" className="text-white transition-colors hover:text-white/50">
                  +86 000 0000 0000
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 写 `Footer.tsx`**

```tsx
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 px-6 py-12 md:px-12">
      <div className="font-mono text-xs tracking-[1px] text-white/30">
        {t("copy")}
      </div>
      <div className="font-mono text-xs tracking-[1px] text-white/30">
        {t("city")}
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: 在 `page.tsx` 引入完整页面**

```tsx
import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Product from "@/components/Product";
import Directions from "@/components/Directions";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Product />
        <Directions />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: 全页验证**：`pnpm dev`，整个页面从 Hero 到 Footer 滚一遍，确认每个区块视觉与 demo 一致；切换中英再滚一遍。

- [ ] **Step 5: Commit**

```bash
git add components/Contact.tsx components/Footer.tsx app/[locale]/page.tsx
git commit -m "feat: Contact + Footer, complete MVP page"
```

---

## 阶段 6：SEO 与收尾（Task 18–20）

### Task 18: `robots.txt` + `sitemap.xml`

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`

- [ ] **Step 1: 写 `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://7dawn.ai/sitemap.xml",
    host: "https://7dawn.ai",
  };
}
```

- [ ] **Step 2: 写 `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://7dawn.ai";
  return [
    { url: `${base}/zh`, lastModified: new Date(), alternates: { languages: { en: `${base}/en`, zh: `${base}/zh` } } },
    { url: `${base}/en`, lastModified: new Date(), alternates: { languages: { en: `${base}/en`, zh: `${base}/zh` } } },
  ];
}
```

- [ ] **Step 3: 验证**：`pnpm dev`，访问 `/robots.txt` 和 `/sitemap.xml`，应返回正确内容。

- [ ] **Step 4: Commit**

```bash
git add app/robots.ts app/sitemap.ts
git commit -m "feat: robots.txt and sitemap.xml with hreflang"
```

---

### Task 19: Lighthouse + 响应式手动检查

**Files:**
- 无新增，仅验证修正

- [ ] **Step 1: 生产构建**

```bash
pnpm build
pnpm start
```

- [ ] **Step 2: Lighthouse 测试**

Chrome DevTools → Lighthouse → 选 Desktop + Performance/Accessibility/Best Practices/SEO → 跑。

目标：
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

如有低分：
- Perf 低：检查 WebGL canvas 是否在首屏阻塞、字体 preload
- A11y 低：补 `aria-label`、对比度、`alt`
- SEO 低：查 `<meta description>` 是否在两个 locale 都有

- [ ] **Step 3: 响应式手动**

DevTools 设备模式，依次测：
- iPhone 12 (390×844)
- iPad (768×1024)
- Desktop (1440×900)
- 4K (2560×1440)

每个尺寸：完整滚动一遍，确认无横向滚动条、文字不溢出、Hero 主标不换行或能优雅换行。

- [ ] **Step 4: 修复发现的问题**（内容与具体问题相关，每项单独 commit）

- [ ] **Step 5: 最终 commit**（若有修复）

```bash
git add -p
git commit -m "fix: <具体问题>"
```

---

### Task 20: 部署到 Vercel

**Files:**
- 无文件变更，仅部署

- [ ] **Step 1: 推送到远程**

如果还没创建 GitHub 仓库，先创建（私有仓库推荐）：

```bash
gh repo create 7dawn-website --private --source=. --remote=origin --push
```

若使用 SSH：

```bash
git remote add origin git@github.com:<user>/7dawn-website.git
git push -u origin main
```

- [ ] **Step 2: Vercel 导入**

打开 `https://vercel.com/new`，导入 GitHub 仓库。

配置：
- Framework: Next.js（自动识别）
- Build Command: `pnpm build`（默认）
- Install Command: `pnpm install`（默认）
- 环境变量：无

点击 Deploy。首次部署约 1-2 分钟。

- [ ] **Step 3: 绑定 7dawn.ai**

Vercel Dashboard → 项目 → Settings → Domains → 添加 `7dawn.ai` 和 `www.7dawn.ai`。

Vercel 会给出 DNS 记录（A 记录 `76.76.21.21` 或 CNAME `cname.vercel-dns.com`），到 7dawn.ai 的 DNS 服务商那边配置。

等待 DNS 生效（通常 5 分钟到 1 小时），HTTPS 证书 Vercel 自动配置。

- [ ] **Step 4: 线上冒烟测试**

访问 `https://7dawn.ai`：
- 自动跳转 `/zh`
- Hero 光雾正常
- 中英切换生效（URL 变 `/en`）
- 所有锚点跳转正常
- `mailto:` 和 `tel:` 可点击
- 移动设备实机测一次

- [ ] **Step 5: 最终 commit**（如部署中发现并修复了任何问题）

---

## 阶段 7：文档收尾

### Task 21: 更新 README

**Files:**
- Create/Modify: `README.md`

- [ ] **Step 1: 写 `README.md`**

```markdown
# 7dawn · 奇点黎明 官网

AI+商业航天创业公司 7dawn 的官方网站。单页面双语设计。

## 技术栈

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- next-intl (i18n)
- Geist Mono / Geist Sans / Noto Sans SC
- 原生 WebGL (Hero 光雾)

## 开发

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

访问 http://localhost:3000

## 部署

推送到 main 分支，Vercel 自动部署到 https://7dawn.ai。

## 文档

- 设计规范：`docs/superpowers/specs/2026-04-16-7dawn-website-design.md`
- xAI 视觉体系：`DESIGN_XAI.md`
- 实施计划：`docs/superpowers/plans/2026-04-16-7dawn-website.md`
- 原始 demo：`demo/index.html`（视觉验证用）
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README"
```

---

## 自审清单

### Spec 覆盖

| Spec 章节 | 对应任务 |
|---|---|
| §1 背景与目标 | N/A (context) |
| §2 品牌（logo/tagline） | Task 8, 10, 12 |
| §3 视觉设计（xAI tokens/字体/禁止项） | Task 3, 贯穿所有组件 |
| §4 信息架构（路由/nav/锚点） | Task 4, 5, 7, 10 |
| §5.1 Hero | Task 11, 12 |
| §5.2 产品区 | Task 14 |
| §5.3 方向区 | Task 15 |
| §5.4 团队区 | Task 16 |
| §5.5 联系区 | Task 17 |
| §5.6 Footer | Task 17 |
| §6.1 技术栈 | Task 2 |
| §6.2 WebGL 光雾 | Task 11 |
| §6.3 i18n | Task 4, 5, 6, 9 |
| §6.4 响应式 | Task 19 |
| §6.5 可访问性 | Task 11 (reduced-motion), 19 |
| §6.6 SEO | Task 7 (metadata), 18 |
| §6.7 文件结构 | 所有 task 遵循 |
| §7 内容策略 | Task 5 (字典) |
| §8 验收标准 | Task 19, 20 |

### Placeholder 扫描

- ✅ 没有「TBD」「TODO」「implement later」
- ✅ 没有「处理边界情况」这类模糊指令
- ✅ 所有代码块完整可粘贴
- 注：`+86 000 0000 0000` 是 **真实占位电话**，等 Tristan 提供真号后换（在 spec §10 有记录，不是计划缺陷）

### 类型 / 命名一致性

- `routing` 导出自 `i18n/routing.ts`，在 Task 4 / 9 / 7 都用 `import { routing } from "@/i18n/routing"` ✓
- `Locale` 类型从 `routing.ts` 导出 ✓
- `setRequestLocale` 在每个使用 `useTranslations` 的 server component（page、layout）里调用 ✓
- `scroll-reveal` / `is-visible` class name 在 CSS 和 ScrollReveal 组件里一致 ✓
- `stat-value` / `stat-value-text` / `stat-label` 在 Team.tsx 和 globals.css 里一致 ✓
- `hero-title` class 在 Hero.tsx 和 globals.css 里一致 ✓

---

## 预期产出

完成后：
- `https://7dawn.ai` 线上可访问，中英双语，xAI 风格，通过 Lighthouse ≥ 90
- 代码可持续迭代（内容在字典里，视觉在 globals.css + xAI tokens）
- v2 路线图明确（3D 爆炸组装、产品详情页、案例、博客）
