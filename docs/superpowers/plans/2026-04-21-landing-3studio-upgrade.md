# Landing 3Studio Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 7dawn landing's middle 4 sections (Product / Directions / Team / Contact) with the prototype/index.html 3Studio narrative (Platform Dossier switcher + 9 new content sections), while keeping the existing Hero, FogCanvas, Footer, and xAI dark visual system.

**Architecture:** Single-page Next.js 15 App Router + Tailwind v4 + next-intl. Server components for all new content sections (they use `useTranslations` but no client state); one client component (`PlatformDossier`) for the workspace switcher. Visual tokens and shared utility classes live in `app/globals.css`; section layout uses Tailwind utilities + a few named classes. A new shared `<SectionHeader>` component reduces duplication. i18n dictionaries (`messages/zh.json` + `messages/en.json`) grow substantially; `tests/i18n.test.ts` enforces key-set parity between locales.

**Tech Stack:** Next.js 15.5, TypeScript 5, Tailwind CSS v4, next-intl 4.9, Geist + Geist Mono + Noto Sans SC (next/font). No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-21-landing-3studio-upgrade-design.md`

**File Structure — what changes:**

```
app/
  globals.css                 [modify]  + tokens + .chip / .btn / .section-dark / .sec-head / .hd-row etc.
  [locale]/
    page.tsx                  [modify]  replace imports + main contents
    layout.tsx                [unchanged]
components/
  Nav.tsx                     [modify]  4 anchor hrefs + t() keys
  Hero.tsx                    [unchanged]
  FogCanvas.tsx               [unchanged]
  LangSwitch.tsx              [unchanged]
  ScrollReveal.tsx            [unchanged]
  Footer.tsx                  [unchanged]
  Product.tsx                 [delete]
  Directions.tsx              [delete]
  Team.tsx                    [delete]
  Contact.tsx                 [delete]
  SectionHeader.tsx           [create]  shared idx + kicker + h2 + lead layout
  PlatformDossier.tsx         [create]  client; workspace switcher + 4 meta stats
  WhyNow.tsx                  [create]  3-column "why now" grid
  Problem.tsx                 [create]  6-card pain grid
  Spaces.tsx                  [create]  5 workspace cards + 2 footer strips
  Architecture.tsx            [create]  3-tier arch (core inverted)
  Harness.tsx                 [create]  dark section; 5 principles + audit log demo
  Scenarios.tsx               [create]  4 scenario cards with flow rows
  Evolution.tsx               [create]  SVG chart + 4 stat rows
  Market.tsx                  [create]  TAM rings SVG + layer table + compete matrix
  CTAContact.tsx              [create]  CTA box + email/phone contact cells
messages/
  zh.json                     [modify]  rm product/directions/team/contact; + nav keys + 10 new namespaces + meta update
  en.json                     [modify]  mirror of zh.json
tests/
  i18n.test.ts                [unchanged]  dictionary parity enforcer (runs after every task)
```

---

## Task 1: Extend globals.css with new tokens and utility classes

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new color token and surface variable**

Edit `app/globals.css`. In the `:root` block (inside `@layer base`), append below `--surface-8`:

```css
    --color-bg-dark: #141619;
    --surface-5: rgba(255, 255, 255, 0.05);
```

- [ ] **Step 2: Add shared component utility classes**

Append a new `@layer base` block at the bottom of `app/globals.css`:

```css
@layer base {
  /* ============ Chip ============ */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid var(--border-20);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-70);
    font-weight: 400;
  }
  .chip .dot {
    width: 5px;
    height: 5px;
    background: #ffffff;
  }
  .chip.is-active {
    border-color: #ffffff;
    color: #ffffff;
  }

  /* ============ Button ============ */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    border: 1px solid var(--border-20);
    background: transparent;
    color: #ffffff;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    transition: opacity 0.2s, border-color 0.2s, background 0.2s, color 0.2s;
  }
  .btn:hover { border-color: #ffffff; }
  .btn-primary {
    background: #ffffff;
    color: var(--color-bg);
    border-color: #ffffff;
  }
  .btn-primary:hover { opacity: 0.82; }
  .btn-ghost {
    border-color: var(--border-20);
    color: var(--text-70);
  }

  /* ============ Section head (idx | content) ============ */
  .sec-head {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 56px;
    margin-bottom: 64px;
    align-items: start;
  }
  .sec-head .meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 6px;
  }
  .sec-head .meta .idx {
    font-family: var(--font-mono);
    font-weight: 300;
    font-style: italic;
    font-size: 40px;
    color: var(--text-30);
    line-height: 1;
  }
  .sec-head .meta .kicker {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-50);
    font-weight: 400;
  }
  .sec-head h2 {
    font-family: var(--font-mono);
    font-weight: 300;
    font-size: clamp(30px, 4vw, 52px);
    line-height: 1.1;
    letter-spacing: -0.008em;
  }
  .sec-head h2 em {
    font-style: italic;
    color: var(--text-50);
    font-weight: 300;
  }
  .sec-head .lead {
    color: var(--text-70);
    font-size: 17px;
    line-height: 1.65;
    max-width: 60ch;
    margin-top: 20px;
  }
  @media (max-width: 820px) {
    .sec-head {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 44px;
    }
  }

  /* ============ Dark section ============ */
  .section-dark {
    background: var(--color-bg-dark);
  }

  /* ============ Pulse dot (for live demo) ============ */
  .pulse-dot {
    width: 6px;
    height: 6px;
    background: #ffffff;
    display: inline-block;
    animation: pulse-white 1.8s infinite;
  }
  @keyframes pulse-white {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pulse-dot { animation: none; }
  }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `pnpm build`
Expected: Completes without errors. (Tailwind v4 picks up the new CSS; no explicit theme changes needed.)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(css): add tokens and utility classes for 3Studio sections"
```

---

## Task 2: Create the shared SectionHeader component

**Files:**
- Create: `components/SectionHeader.tsx`

- [ ] **Step 1: Create the component**

Create `components/SectionHeader.tsx`:

```tsx
import { ReactNode } from "react";

export default function SectionHeader({
  idx,
  kicker,
  title,
  lead,
}: {
  idx: string;
  kicker: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <div className="sec-head">
      <div className="meta">
        <span className="kicker">{kicker}</span>
        <span className="idx">{idx}</span>
      </div>
      <div>
        <h2>{title}</h2>
        <p className="lead">{lead}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Completes. The component is unused so far but compiles.

- [ ] **Step 3: Commit**

```bash
git add components/SectionHeader.tsx
git commit -m "feat(components): add SectionHeader shared layout"
```

---

## Task 3: Update Nav with new anchor keys

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Update `Nav.tsx` anchor list**

Replace the `<ul>` block in `components/Nav.tsx` (the one with `#product / #directions / #team / #contact`) with:

```tsx
      <ul className="hidden md:flex gap-8 list-none">
        <li><a href="#spaces" className="text-white text-sm transition-colors hover:text-white/50">{t("spaces")}</a></li>
        <li><a href="#harness" className="text-white text-sm transition-colors hover:text-white/50">{t("harness")}</a></li>
        <li><a href="#evolution" className="text-white text-sm transition-colors hover:text-white/50">{t("evolution")}</a></li>
        <li><a href="#market" className="text-white text-sm transition-colors hover:text-white/50">{t("market")}</a></li>
      </ul>
```

- [ ] **Step 2: Update `messages/zh.json` nav namespace**

In `messages/zh.json`, replace the entire `"nav": { ... }` block with:

```json
  "nav": {
    "spaces": "工作空间",
    "harness": "Harness",
    "evolution": "进化",
    "market": "市场"
  },
```

- [ ] **Step 3: Update `messages/en.json` nav namespace**

In `messages/en.json`, replace the entire `"nav": { ... }` block with:

```json
  "nav": {
    "spaces": "Workspaces",
    "harness": "Harness",
    "evolution": "Evolution",
    "market": "Market"
  },
```

- [ ] **Step 4: Run i18n tests**

Run: `pnpm test`
Expected: All 3 tests pass (zh/en identical key sets, no empty values). Note — the old `product / directions / team / contact` namespaces are still present in both locales and still mirror each other, so parity holds.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx messages/zh.json messages/en.json
git commit -m "feat(nav): switch anchors to spaces/harness/evolution/market"
```

---

## Task 4: Create WhyNow component + i18n

**Files:**
- Create: `components/WhyNow.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/WhyNow.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function WhyNow() {
  const t = useTranslations("why");
  const items = [0, 1, 2] as const;

  return (
    <section id="why" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Why Now"
            kicker="01 / 06"
            title={
              <>
                {t("titleBefore")}
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 border-t border-white/20 md:grid-cols-3">
          {items.map((i) => (
            <ScrollReveal key={i}>
              <div className="flex min-h-[280px] flex-col gap-4 border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-7 md:pr-7 md:[&:last-child]:border-r-0 md:[&:last-child]:pr-0 md:[&:first-child]:pl-0">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[1.8px] text-white/50">
                  <span>{t(`items.${i}.kicker`)}</span>
                  <span className="text-2xl text-white/30">→</span>
                </div>
                <h3 className="font-mono text-xl leading-[1.3]">{t(`items.${i}.h3`)}</h3>
                <ul className="mt-1 flex flex-col gap-[10px]">
                  {[0, 1, 2].map((b) => (
                    <li
                      key={b}
                      className="relative pl-4 text-[13.5px] leading-[1.55] text-white/70 before:absolute before:left-0 before:top-[10px] before:h-px before:w-2 before:bg-white/30"
                    >
                      {t(`items.${i}.bullets.${b}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `why` namespace to `messages/zh.json`**

Insert this block after the existing `"contact": { ... }` block (before `"footer"`):

```json
  "why": {
    "titleBefore": "三股力量叠加，",
    "titleEm": "平台级窗口出现",
    "titleAfter": "。",
    "lead": "软件工程已经有了 Cursor。硬件 / 系统工程的 AI 原生平台，还是空白。",
    "items": {
      "0": {
        "kicker": "01 · MODEL",
        "h3": "AI Agent 从问答走向执行",
        "bullets": {
          "0": "从“回答问题” → “调 STK 跑仿真、写验证报告”",
          "1": "Cursor 33 月 ARR 达 $20B",
          "2": "Agent 能做真实工程任务了"
        }
      },
      "1": {
        "kicker": "02 · SOFTWARE",
        "h3": "工业软件走向 AI 原生层",
        "bullets": {
          "0": "IDC：AI+工业软件 2029 年渗透率 22.4%",
          "1": "中国核心工业软件 2029 年 765 亿",
          "2": "CAD / CAE 之上需要 AI 执行层"
        }
      },
      "2": {
        "kicker": "03 · POLICY",
        "h3": "政策窗口明确",
        "bullets": {
          "0": "2026 政府工作报告：“智能体推广”",
          "1": "“重点行业 AI 商业化规模化应用”",
          "2": "“加快发展卫星互联网”"
        }
      }
    }
  },
```

- [ ] **Step 3: Append `why` namespace to `messages/en.json`**

Insert mirrored block at the same position in `messages/en.json`:

```json
  "why": {
    "titleBefore": "Three forces converging — ",
    "titleEm": "a platform-level window opens",
    "titleAfter": ".",
    "lead": "Software engineering has Cursor. Hardware and systems engineering still don't have an AI-native platform.",
    "items": {
      "0": {
        "kicker": "01 · MODEL",
        "h3": "Agents move from Q&A to execution",
        "bullets": {
          "0": "From \"answering questions\" to \"running STK simulations and drafting verification reports\"",
          "1": "Cursor hit $20B ARR at month 33",
          "2": "Agents can now perform real engineering tasks"
        }
      },
      "1": {
        "kicker": "02 · SOFTWARE",
        "h3": "Industrial software enters the AI-native layer",
        "bullets": {
          "0": "IDC: 22.4% penetration of AI-augmented industrial software by 2029",
          "1": "China core industrial software TAM ¥76.5B in 2029",
          "2": "CAD / CAE need an AI execution layer on top"
        }
      },
      "2": {
        "kicker": "03 · POLICY",
        "h3": "The policy window is explicit",
        "bullets": {
          "0": "2026 government work report: \"promote AI agents\"",
          "1": "\"Scale commercial AI adoption in priority industries\"",
          "2": "\"Accelerate satellite internet development\""
        }
      }
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test`
Expected: 3 passes.

Run: `pnpm build`
Expected: Builds without errors.

- [ ] **Step 5: Commit**

```bash
git add components/WhyNow.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add WhyNow"
```

---

## Task 5: Create Problem component + i18n

**Files:**
- Create: `components/Problem.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Problem.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function Problem() {
  const t = useTranslations("problem");
  const items = [0, 1, 2, 3, 4, 5] as const;

  return (
    <section id="problem" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Problem"
            kicker="02 / 06"
            title={
              <>
                {t("titleLine1")}
                <br />
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 md:grid-cols-3">
          {items.map((i) => (
            <div
              key={i}
              className="flex min-h-[200px] flex-col gap-3 bg-[#1f2228] px-6 py-7"
            >
              <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[1.8px] text-white/50">
                <span>{t(`items.${i}.no`)}</span>
                <span>{t(`items.${i}.tag`)}</span>
              </div>
              <h4 className="font-mono text-[17px] leading-[1.3]">{t(`items.${i}.h4`)}</h4>
              <p className="text-[13.5px] leading-[1.55] text-white/70">{t(`items.${i}.body`)}</p>
              <div className="mt-auto border-t border-dashed border-white/10 pt-3 font-mono text-[11px] tracking-[0.4px] text-white/50">
                {t(`items.${i}.quant`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `problem` namespace to `messages/zh.json`** (after `why`)

```json
  "problem": {
    "titleLine1": "复杂工程组织仍在用",
    "titleEm": "人肉 + 工具碎片",
    "titleAfter": "工作。",
    "lead": "不是缺某个 AI 功能，而是缺一个可信赖的 AI 原生工程执行层。一颗卫星要过 10+ 种工具，验证周期 2-4 周，返工占设计周期 30-40%。",
    "items": {
      "0": { "no": "01", "tag": "孤岛", "h4": "工具孤岛", "body": "STK / MATLAB / Thermal Desktop / CATIA / DOORS — 工程师在 10+ 窗口间手动搬数据。", "quant": "占工作时间 20-30%" },
      "1": { "no": "02", "tag": "知识", "h4": "知识锁在脑里", "body": "“太阳翼改 5° 会影响热控边界” — 只在资深总师脑子里，人走知识散。", "quant": "新人 ramp-up 6-12 月" },
      "2": { "no": "03", "tag": "协作", "h4": "多学科协作断裂", "body": "结构改参数、热控改边界，跨学科影响靠“开会”传递，返工率居高不下。", "quant": "返工占设计周期 30-40%" },
      "3": { "no": "04", "tag": "流程", "h4": "流程靠人盯", "body": "评审、变更、BOM、AIT 全靠邮件微信催，缺自动流转和审计追溯。", "quant": "管理人员占团队 15-25%" },
      "4": { "no": "05", "tag": "验证", "h4": "验证大量手工", "body": "单颗卫星 200+ 测试项，每项配置、跑、对比、写报告——极大重复劳动。", "quant": "单次验证 2-4 周" },
      "5": { "no": "06", "tag": "信任", "h4": "黑箱 AI 不可用", "body": "航天 / 航空 / 核能 — 错误代价极高，需要可审计、可解释、可回滚的 AI。", "quant": "通用 LLM 合规率 < 40%" }
    }
  },
```

- [ ] **Step 3: Append `problem` namespace to `messages/en.json`** (after `why`)

```json
  "problem": {
    "titleLine1": "Complex engineering still runs on",
    "titleEm": "manual labor + tool fragmentation",
    "titleAfter": ".",
    "lead": "The gap is not a missing AI feature — it's the absence of a trustworthy AI-native engineering execution layer. A single satellite passes through 10+ tools; a validation cycle takes 2-4 weeks; rework consumes 30-40% of the design schedule.",
    "items": {
      "0": { "no": "01", "tag": "SILO", "h4": "Tool silos", "body": "STK / MATLAB / Thermal Desktop / CATIA / DOORS — engineers shuffle data by hand across 10+ windows.", "quant": "20-30% of working hours" },
      "1": { "no": "02", "tag": "KNOWLEDGE", "h4": "Knowledge trapped in heads", "body": "“A 5° solar-array tilt shifts thermal boundaries” — lives only in the lead engineer's head; when they leave, so does the knowledge.", "quant": "New hire ramp: 6-12 months" },
      "2": { "no": "03", "tag": "COLLAB", "h4": "Cross-discipline breakdown", "body": "Structural changes ripple to thermal and power, but communication happens in meetings — rework rates stay stubbornly high.", "quant": "Rework: 30-40% of design cycle" },
      "3": { "no": "04", "tag": "PROCESS", "h4": "Process runs on nagging", "body": "Reviews, changes, BOM, AIT — chased over email and WeChat. No automated flow, no audit trail.", "quant": "Admin headcount: 15-25% of team" },
      "4": { "no": "05", "tag": "VERIFY", "h4": "Verification is mostly manual", "body": "200+ tests per satellite — each configured, executed, compared, and written up by hand. Massive duplicated effort.", "quant": "A single verification cycle: 2-4 weeks" },
      "5": { "no": "06", "tag": "TRUST", "h4": "Black-box AI is unusable", "body": "Aerospace / aviation / nuclear — failure costs are extreme. You need auditable, explainable, rollback-safe AI.", "quant": "Generic-LLM compliance rate < 40%" }
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Problem.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Problem"
```

---

## Task 6: Create Spaces component + i18n

**Files:**
- Create: `components/Spaces.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Spaces.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const GLYPHS: ReactNode[] = [
  <svg key="d" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 38 L22 6 L38 38" /><path d="M14 28 L30 28" /><circle cx="22" cy="22" r="2" fill="currentColor" /></svg>,
  <svg key="v" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="6" y="6" width="32" height="32" /><path d="M14 22 L20 28 L32 16" /></svg>,
  <svg key="f" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="22" cy="22" r="14" /><path d="M22 8 L28 14 L22 20 M22 36 L16 30 L22 24" /></svg>,
  <svg key="o" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 32 L16 16 L24 24 L40 8" /><circle cx="40" cy="8" r="2.4" fill="currentColor" /><path d="M4 40 L40 40" strokeDasharray="2 3" /></svg>,
  <svg key="c" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 38 L6 22 L14 22 L14 38" /><path d="M18 38 L18 10 L26 10 L26 38" /><path d="M30 38 L30 26 L38 26 L38 38" /><path d="M4 40 L40 40" /></svg>,
];

export default function Spaces() {
  const t = useTranslations("spaces");
  const items = [0, 1, 2, 3, 4] as const;

  return (
    <section id="spaces" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Product"
            kicker="03 / 06"
            title={
              <>
                {t("titleBefore")}
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 border border-white/10 sm:grid-cols-2 xl:grid-cols-5">
          {items.map((i) => {
            const tags = t.raw(`items.${i}.tags`) as string[];
            return (
              <article
                key={i}
                className="flex min-h-[420px] flex-col gap-4 border-b border-r border-white/10 bg-white/[0.03] px-6 py-8 transition-colors last:border-r-0 hover:bg-white/[0.05] sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(n)]:border-r xl:[&:last-child]:border-r-0"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/50">{t(`items.${i}.code`)}</span>
                  <span className="font-mono text-xl italic font-light text-white/30">{t(`items.${i}.numeral`)}</span>
                </div>
                <div className="mt-2 h-10 w-10 text-white [&_svg]:h-full [&_svg]:w-full">{GLYPHS[i]}</div>
                <h3 className="font-mono text-[22px] font-normal leading-none tracking-[-0.01em]">
                  <em className="mr-1.5 font-light italic text-white/50">{t(`items.${i}.nameEm`)}</em>
                  {t(`items.${i}.nameText`)}
                </h3>
                <p className="flex-1 text-[13px] leading-[1.55] text-white/70">{t(`items.${i}.desc`)}</p>
                <div className="flex flex-wrap gap-1.5 border-t border-dashed border-white/10 pt-3.5">
                  {tags.map((tag) => (
                    <span key={tag} className="border border-white/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[1.4px] text-white/50">{tag}</span>
                  ))}
                </div>
                <div className="pt-1 font-mono text-[10px] tracking-[0.8px] text-white/50">
                  {t(`items.${i}.outlinePrefix`)}
                  <b className="font-normal text-white">{t(`items.${i}.outlineBold`)}</b>
                  {t(`items.${i}.outlineSuffix`)}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pack strip */}
        <ScrollReveal>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border border-dashed border-white/20 px-6 py-5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-white/70">{t("pack.kicker")}</span>
              <strong className="font-mono text-[18px] font-normal tracking-[-0.005em] text-white">{t("pack.title")}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="chip is-active"><span className="dot" />{t("pack.chip0")}</span>
              <span className="chip">{t("pack.chip1")}</span>
              <span className="chip">{t("pack.chip2")}</span>
              <span className="chip">{t("pack.chip3")}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* OrbitOps strip */}
        <ScrollReveal>
          <div className="mt-5 flex flex-wrap items-center gap-5 border border-white bg-white px-6 py-5 text-[#1f2228]">
            <span className="chip border-[rgba(31,34,40,0.3)] text-[#1f2228]">
              <span className="dot" style={{ background: "#1f2228" }} />
              OrbitOps
            </span>
            <span className="ml-1 font-mono text-sm">{t("orbitOps.body")}</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `spaces` namespace to `messages/zh.json`**

```json
  "spaces": {
    "titleBefore": "一个产品，",
    "titleEm": "五个工作空间",
    "titleAfter": "。",
    "lead": "像 Notion / Figma 那样切换 — 底层共享同一个 Core OS，入口因场景而不同。Agent 团队各司其职，人始终在环审核。",
    "items": {
      "0": { "code": "S-01", "numeral": "i", "nameEm": "Design", "nameText": "设计空间", "desc": "方案设计 / 仿真建模 / 参数探索 / 技术文档。Agent 调 STK + MATLAB 做参数扫描，人审核方案合理性。", "tags": ["Multi-Agent", "Simulation", "DOE"], "outlinePrefix": "→ ", "outlineBold": "设计包", "outlineSuffix": "：方案 + 仿真 + 文档" },
      "1": { "code": "S-02", "numeral": "ii", "nameEm": "Verify", "nameText": "验证空间", "desc": "测试矩阵 / 仿真验证 / 指标检查 / 问题归因。解析 GJB 标准自动生成测试矩阵，漏测率降 70%。", "tags": ["Test Matrix", "GJB", "Evidence"], "outlinePrefix": "→ ", "outlineBold": "验证报告", "outlineSuffix": " + 证据包" },
      "2": { "code": "S-03", "numeral": "iii", "nameEm": "Flow", "nameText": "流程空间", "desc": "BOM / 变更 / 评审 / AIT / 供应链 / 质量追溯。变更影响链自动追溯，避免下游返工。", "tags": ["BOM", "Change", "Supply"], "outlinePrefix": "→ ", "outlineBold": "变更闭环", "outlineSuffix": " + 交付证据" },
      "3": { "code": "S-04", "numeral": "iv", "nameEm": "Operate", "nameText": "运维空间", "desc": "监控 / 异常 / RCA / Runbook / 发布回滚。运维从每颗星 0.5 人 → 每 10-20 颗星 1 人。", "tags": ["Telemetry", "RCA", "OrbitOps"], "outlinePrefix": "→ ", "outlineBold": "运行报告", "outlineSuffix": " + 处置记录" },
      "4": { "code": "S-05", "numeral": "v", "nameEm": "Command", "nameText": "指挥空间", "desc": "项目统筹 + 进化仪表盘。让管理者看到 Agent 自主完成率、干预频率、首次通过率的变化曲线。", "tags": ["PMO", "Evolution", "KPI"], "outlinePrefix": "→ ", "outlineBold": "项目仪表盘", "outlineSuffix": " + 进化指标" }
    },
    "pack": {
      "kicker": "Industry Pack · 行业配置",
      "title": "选择行业模板 = 自动加载工具链 + 标准 + 知识库",
      "chip0": "Aerospace",
      "chip1": "UAV / 低空",
      "chip2": "高端装备",
      "chip3": "能源装备"
    },
    "orbitOps": { "body": "= 运维空间 + 航天配置 — 可独立推广的旗舰品牌" }
  },
```

- [ ] **Step 3: Append `spaces` namespace to `messages/en.json`**

```json
  "spaces": {
    "titleBefore": "One product — ",
    "titleEm": "five workspaces",
    "titleAfter": ".",
    "lead": "Switch between them like Notion or Figma — all five share the same Core OS underneath; each surface is shaped to its scenario. Agent crews specialize, humans stay in the loop on review.",
    "items": {
      "0": { "code": "S-01", "numeral": "i", "nameEm": "Design", "nameText": "Design Space", "desc": "Concept design / simulation modeling / parameter exploration / technical documentation. Agents orchestrate STK and MATLAB for parameter sweeps; humans vet the rationale.", "tags": ["Multi-Agent", "Simulation", "DOE"], "outlinePrefix": "→ ", "outlineBold": "Design package", "outlineSuffix": ": plan + simulation + docs" },
      "1": { "code": "S-02", "numeral": "ii", "nameEm": "Verify", "nameText": "Verify Space", "desc": "Test matrices / simulation-based validation / metric checks / failure attribution. Parses GJB standards to auto-generate matrices — miss rate down 70%.", "tags": ["Test Matrix", "GJB", "Evidence"], "outlinePrefix": "→ ", "outlineBold": "Verification report", "outlineSuffix": " + evidence bundle" },
      "2": { "code": "S-03", "numeral": "iii", "nameEm": "Flow", "nameText": "Flow Space", "desc": "BOM / change / review / AIT / supply chain / quality trace. Change impact chains propagate automatically, preventing downstream rework.", "tags": ["BOM", "Change", "Supply"], "outlinePrefix": "→ ", "outlineBold": "Closed-loop change", "outlineSuffix": " + delivery evidence" },
      "3": { "code": "S-04", "numeral": "iv", "nameEm": "Operate", "nameText": "Operate Space", "desc": "Telemetry / anomalies / RCA / runbooks / release rollback. Operations staffing goes from 0.5 person per satellite to 1 per 10-20 satellites.", "tags": ["Telemetry", "RCA", "OrbitOps"], "outlinePrefix": "→ ", "outlineBold": "Ops report", "outlineSuffix": " + response log" },
      "4": { "code": "S-05", "numeral": "v", "nameEm": "Command", "nameText": "Command Space", "desc": "Program oversight + evolution dashboard. Leaders watch autonomous rate, intervention frequency, and first-pass rate trend in real time.", "tags": ["PMO", "Evolution", "KPI"], "outlinePrefix": "→ ", "outlineBold": "Program dashboard", "outlineSuffix": " + evolution metrics" }
    },
    "pack": {
      "kicker": "Industry Pack · domain config",
      "title": "Pick an industry template = load toolchain + standards + knowledge base",
      "chip0": "Aerospace",
      "chip1": "UAV",
      "chip2": "Heavy Equipment",
      "chip3": "Energy"
    },
    "orbitOps": { "body": "= Operate Space + Aerospace config — a flagship brand that can ship standalone" }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Spaces.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Spaces"
```

---

## Task 7: Create Architecture component + i18n

**Files:**
- Create: `components/Architecture.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Architecture.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

type Cell = { name: string; note: string };

export default function Architecture() {
  const t = useTranslations("architecture");
  const tiers = [0, 1, 2].map((i) => ({
    label: t(`tiers.${i}.label`),
    name: t(`tiers.${i}.name`),
    note: t(`tiers.${i}.note`),
    cells: t.raw(`tiers.${i}.cells`) as Cell[],
  }));

  return (
    <section className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Architecture"
            kicker="03b / 06"
            title={
              <>
                {t("titleBefore")}
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="border border-white/10">
          {tiers.map((tier, i) => {
            const isCore = i === 1;
            return (
              <div
                key={i}
                className={`grid grid-cols-1 items-center gap-3 border-b border-white/10 px-7 py-6 last:border-b-0 md:grid-cols-[160px_1fr] md:gap-7 ${
                  isCore ? "bg-white text-[#1f2228]" : ""
                }`}
              >
                <div className={`flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[1.8px] ${isCore ? "text-[rgba(31,34,40,0.5)]" : "text-white/50"}`}>
                  <span>{tier.label}</span>
                  <b className={`font-normal tracking-[1px] ${isCore ? "text-[#1f2228]" : "text-white"} text-[13px]`}>{tier.name}</b>
                  <span>{tier.note}</span>
                </div>
                <div
                  className={`grid gap-2 ${tier.cells.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-5"}`}
                >
                  {tier.cells.map((cell) => (
                    <div
                      key={cell.name}
                      className={`flex min-h-[72px] flex-col gap-1 border px-4 py-3.5 text-[13px] ${
                        isCore
                          ? "border-[rgba(31,34,40,0.12)] bg-[rgba(31,34,40,0.06)] text-[#1f2228]"
                          : "border-white/10 bg-white/[0.03] text-white"
                      }`}
                    >
                      <b className="font-mono text-sm font-normal tracking-[-0.002em]">{cell.name}</b>
                      <small className={`font-mono text-[10px] tracking-[0.4px] ${isCore ? "text-[rgba(31,34,40,0.55)]" : "text-white/50"}`}>{cell.note}</small>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `architecture` namespace to `messages/zh.json`**

```json
  "architecture": {
    "titleBefore": "一个 ",
    "titleEm": "Core OS 底座",
    "titleAfter": "，五个工作空间共用。",
    "lead": "对外 = 工作空间的体系感；对内 = 统一产品的一致体验。研发只维护一套底座，行业只换一个 Industry Pack。",
    "tiers": {
      "0": {
        "label": "Tier A",
        "name": "Workspaces",
        "note": "五个工作空间",
        "cells": [
          { "name": "Design", "note": "设计 Agent" },
          { "name": "Verify", "note": "验证 Agent" },
          { "name": "Flow", "note": "流程 Agent" },
          { "name": "Operate", "note": "运维 Agent" },
          { "name": "Command", "note": "统筹 + 进化" }
        ]
      },
      "1": {
        "label": "Tier B",
        "name": "Core OS",
        "note": "平台底座",
        "cells": [
          { "name": "Multi-Agent Runtime", "note": "多 Agent 协作引擎" },
          { "name": "Harness Engine", "note": "治理 / 审计 / 回滚" },
          { "name": "Memory & Evolution", "note": "M0 / M1 / M2 + 进化" },
          { "name": "Adaptation Workbench", "note": "领域适配工作台" },
          { "name": "Tool Adapter SDK", "note": "工具链接口" }
        ]
      },
      "2": {
        "label": "Tier C",
        "name": "Industry Packs",
        "note": "行业适配",
        "cells": [
          { "name": "Aerospace", "note": "STK / GMAT / MATLAB · GJB" },
          { "name": "UAV / 低空", "note": "飞控 / 地面站 · 适航" },
          { "name": "Automotive", "note": "CATIA / NASTRAN · 车标" },
          { "name": "Energy", "note": "能源行业标准 · 工具链" }
        ]
      }
    }
  },
```

- [ ] **Step 3: Append `architecture` namespace to `messages/en.json`**

```json
  "architecture": {
    "titleBefore": "One ",
    "titleEm": "Core OS",
    "titleAfter": " — shared across all five workspaces.",
    "lead": "From outside, workspaces; from inside, one product with a coherent experience. Engineering maintains one OS; each industry just swaps the Pack.",
    "tiers": {
      "0": {
        "label": "Tier A",
        "name": "Workspaces",
        "note": "Five workspaces",
        "cells": [
          { "name": "Design", "note": "Design agents" },
          { "name": "Verify", "note": "Verification agents" },
          { "name": "Flow", "note": "Process agents" },
          { "name": "Operate", "note": "Ops agents" },
          { "name": "Command", "note": "Oversight + evolution" }
        ]
      },
      "1": {
        "label": "Tier B",
        "name": "Core OS",
        "note": "Platform foundation",
        "cells": [
          { "name": "Multi-Agent Runtime", "note": "Multi-agent orchestration" },
          { "name": "Harness Engine", "note": "Governance / audit / rollback" },
          { "name": "Memory & Evolution", "note": "M0 / M1 / M2 + evolution" },
          { "name": "Adaptation Workbench", "note": "Domain adaptation bench" },
          { "name": "Tool Adapter SDK", "note": "Toolchain interface" }
        ]
      },
      "2": {
        "label": "Tier C",
        "name": "Industry Packs",
        "note": "Domain kits",
        "cells": [
          { "name": "Aerospace", "note": "STK / GMAT / MATLAB · GJB" },
          { "name": "UAV", "note": "Flight control / ground · airworthiness" },
          { "name": "Automotive", "note": "CATIA / NASTRAN · auto standards" },
          { "name": "Energy", "note": "Energy standards · toolchain" }
        ]
      }
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Architecture.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Architecture"
```

---

## Task 8: Create Harness component + i18n (dark section)

**Files:**
- Create: `components/Harness.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Harness.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

type Row = { ix: string; content: string; sig: string; rc: "ok" | "hold" | "deny" };

export default function Harness() {
  const t = useTranslations("harness");
  const principles = [0, 1, 2, 3, 4] as const;
  const rows = t.raw("demo.rows") as Row[];
  const numerals = ["i", "ii", "iii", "iv", "v"] as const;

  return (
    <section id="harness" className="section-dark relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Harness"
            kicker="04 / 06"
            title={
              <>
                {t("titleBefore")}
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col">
            {principles.map((i) => (
              <div
                key={i}
                className="grid grid-cols-[40px_150px_1fr] items-baseline gap-5 border-b border-white/10 py-5.5 py-6 first:border-t first:border-white/10"
              >
                <div className="font-mono text-xl italic font-light text-white/50">{numerals[i]}</div>
                <h4 className="font-mono text-[17px] font-normal text-white">{t(`principles.${i}.h4`)}</h4>
                <p className="text-[13.5px] leading-[1.55] text-white/70">{t(`principles.${i}.body`)}</p>
              </div>
            ))}
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5.5 p-6 font-mono text-xs leading-[1.7] text-white/70">
            <div className="flex justify-between border-b border-dashed border-white/10 pb-3 text-[10px] uppercase tracking-[1.8px] text-white/50">
              <span>{t("demo.head.session")}</span>
              <span>{t("demo.head.anchored")}</span>
            </div>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[22px_1fr_auto] gap-2.5 border-b border-dashed border-white/10 py-2 last:border-b-0">
                <span className="text-white/30">{row.ix}</span>
                <span>
                  <span dangerouslySetInnerHTML={{ __html: row.content }} />
                  <span className="mt-0.5 block text-[11px] text-white/50">{row.sig}</span>
                </span>
                <span
                  className={`self-start border px-[7px] py-0.5 text-[9px] uppercase tracking-[1.4px] ${
                    row.rc === "ok"
                      ? "border-white/20 text-white"
                      : row.rc === "hold"
                        ? "border-dashed border-white/20 text-white/70"
                        : "border-white bg-white text-[#1f2228]"
                  }`}
                >
                  {row.rc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note on `dangerouslySetInnerHTML`: rows contain `<b>…</b>` markup for monospace identifiers. The i18n values are static literals authored by us, not user input — safe.

- [ ] **Step 2: Append `harness` namespace to `messages/zh.json`**

```json
  "harness": {
    "titleBefore": "在缰绳下工作的 AI — ",
    "titleEm": "可审计、可回滚、可量化",
    "titleAfter": "。",
    "lead": "在“错误代价极高”的行业，Agent 不能自由执行。Harness Engine 把白名单、分级审批、完整审计、一键回滚做在平台从第一天的设计里——这是范式，不是功能。",
    "principles": {
      "0": { "h4": "工具白名单", "body": "Agent 只能调用被批准的工具与参数范围，跨组织策略统一下发。" },
      "1": { "h4": "分级审批", "body": "自动 / 半自动 / 人工三档。高风险操作—进入队列等人签字；低风险操作—自动放行。" },
      "2": { "h4": "完整审计日志", "body": "每一次工具调用、每一个决策、每一条提示词—全链路 hash 化归档，支持合规审查。" },
      "3": { "h4": "一键回滚", "body": "任何步骤都可回退到之前状态。设计快照 / 仿真种子 / 文档版本—均可时间旅行。" },
      "4": { "h4": "进化可量化", "body": "自主完成率、干预频率、首次通过率、知识覆盖率—管理者看曲线做决策。" }
    },
    "demo": {
      "head": { "session": "audit-log · session #A7F-2041", "anchored": "2026-04 · anchored" },
      "rows": [
        { "ix": "01", "content": "call <b>stk.propagate</b>(orbit=500km-SSO)", "sig": "sig: sha256:7b2c…e1", "rc": "ok" },
        { "ix": "02", "content": "call <b>matlab.designATC</b>(gain_mtx)", "sig": "sig: sha256:11af…4c", "rc": "ok" },
        { "ix": "03", "content": "write <b>design_pkg/main.docx</b>(draft)", "sig": "— 等待评审 —", "rc": "hold" },
        { "ix": "04", "content": "attempt <b>supplier.notify</b>(BOM change)", "sig": "policy: 需 L2 审批", "rc": "deny" },
        { "ix": "05", "content": "rollback to snapshot <b>#20260411-1704</b>", "sig": "reverted by: 李承泽", "rc": "ok" },
        { "ix": "06", "content": "call <b>thermal.run</b>(case=hot-soak)", "sig": "2.4 GB 证据包已归档", "rc": "ok" }
      ]
    }
  },
```

- [ ] **Step 3: Append `harness` namespace to `messages/en.json`**

```json
  "harness": {
    "titleBefore": "AI in a harness — ",
    "titleEm": "auditable, rollback-safe, quantifiable",
    "titleAfter": ".",
    "lead": "In industries where mistakes are expensive, agents can't execute freely. Harness Engine builds whitelisting, tiered approval, full audit, and one-click rollback into the platform from day one — a paradigm, not a feature.",
    "principles": {
      "0": { "h4": "Tool whitelist", "body": "Agents can only call approved tools within approved parameter ranges; cross-org policy ships from one place." },
      "1": { "h4": "Tiered approval", "body": "Auto / semi-auto / manual. High-risk actions queue for a human signature; low-risk actions pass through." },
      "2": { "h4": "Full audit log", "body": "Every tool call, every decision, every prompt — hash-chained, archived, and ready for compliance review." },
      "3": { "h4": "One-click rollback", "body": "Any step can revert. Design snapshots, simulation seeds, document versions — all time-travelable." },
      "4": { "h4": "Evolution is quantifiable", "body": "Autonomous rate, intervention frequency, first-pass rate, knowledge coverage — leaders steer by the curves." }
    },
    "demo": {
      "head": { "session": "audit-log · session #A7F-2041", "anchored": "2026-04 · anchored" },
      "rows": [
        { "ix": "01", "content": "call <b>stk.propagate</b>(orbit=500km-SSO)", "sig": "sig: sha256:7b2c…e1", "rc": "ok" },
        { "ix": "02", "content": "call <b>matlab.designATC</b>(gain_mtx)", "sig": "sig: sha256:11af…4c", "rc": "ok" },
        { "ix": "03", "content": "write <b>design_pkg/main.docx</b>(draft)", "sig": "— awaiting review —", "rc": "hold" },
        { "ix": "04", "content": "attempt <b>supplier.notify</b>(BOM change)", "sig": "policy: L2 approval required", "rc": "deny" },
        { "ix": "05", "content": "rollback to snapshot <b>#20260411-1704</b>", "sig": "reverted by: Li Chengze", "rc": "ok" },
        { "ix": "06", "content": "call <b>thermal.run</b>(case=hot-soak)", "sig": "2.4 GB evidence archived", "rc": "ok" }
      ]
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Harness.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Harness (dark)"
```

---

## Task 9: Create Scenarios component + i18n

**Files:**
- Create: `components/Scenarios.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Scenarios.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function Scenarios() {
  const t = useTranslations("scenarios");
  const items = [0, 1, 2, 3] as const;

  return (
    <section className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Scenarios"
            kicker="04b / 06"
            title={
              <>
                {t("titleLine1")}
                <br />
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 border border-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((i) => (
            <article
              key={i}
              className="flex min-h-[360px] flex-col gap-3 border-b border-r border-white/10 bg-white/[0.03] px-6 py-7 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(n)]:border-r xl:[&:last-child]:border-r-0"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[1.6px] text-white/50">
                <span>{t(`items.${i}.scn`)}</span>
                <span>{t(`items.${i}.cat`)}</span>
              </div>
              <h4 className="font-mono text-xl font-normal leading-[1.2] tracking-[-0.005em]">
                <em className="italic font-light text-white/50">{t(`items.${i}.h4em`)}</em>
                {" "}
                {t(`items.${i}.h4text`)}
              </h4>
              <div className="flex flex-col gap-2 border-y border-dashed border-white/10 py-3">
                {(["in", "agt", "hum", "out"] as const).map((k) => (
                  <div key={k} className="grid grid-cols-[40px_1fr] items-baseline gap-2.5">
                    <b className="font-mono text-[9px] font-normal uppercase tracking-[1.4px] text-white">{k.toUpperCase()}</b>
                    <span className="text-[12.5px] text-white/70 leading-[1.55]">{t(`items.${i}.flow.${k}`)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-baseline justify-between border-t border-white/10 pt-3.5">
                <div className="font-mono text-[22px] font-light tracking-[-0.005em]">
                  {t(`items.${i}.roi.bigBefore`)}
                  <em className="italic font-light text-white/50 mx-1">{t(`items.${i}.roi.bigEm`)}</em>
                  {t(`items.${i}.roi.bigAfter`)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[1px] text-white/50">{t(`items.${i}.roi.small`)}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `scenarios` namespace to `messages/zh.json`**

```json
  "scenarios": {
    "titleLine1": "从设计到交付到运行 —",
    "titleEm": "已在航天场景验证",
    "titleAfter": "。",
    "lead": "每个场景都有明确的输入 / Agent 执行 / 人审核 / 输出 / ROI。Phase 1 先打穿 Design + Verify，Phase 2 扩展到 Flow + Operate。",
    "items": {
      "0": {
        "scn": "SCN · A", "cat": "Design",
        "h4em": "卫星姿轨控", "h4text": "设计",
        "flow": { "in": "轨道 500km SSO · 指向 0.1°", "agt": "STK 轨道仿真 · MATLAB 控制律 · 50+ 组参数扫描", "hum": "审核方案合理性 · 选定最优", "out": "设计包 + 对比报告 + 变更记录" },
        "roi": { "bigBefore": "3w ", "bigEm": "→", "bigAfter": " 5d", "small": "ROI 37×" }
      },
      "1": {
        "scn": "SCN · D", "cat": "Verify",
        "h4em": "热控", "h4text": "验证",
        "flow": { "in": "热控设计方案 · GJB 标准清单", "agt": "解析标准 → 测试矩阵 200+ · Thermal Desktop 跑仿真", "hum": "审核矩阵完备性 · 确认未通过项", "out": "验证报告 + 测试证据包 + 合规矩阵" },
        "roi": { "bigBefore": "2w ", "bigEm": "→", "bigAfter": " 2d", "small": "漏测率 ↓ 70%" }
      },
      "2": {
        "scn": "SCN · G", "cat": "Flow",
        "h4em": "设计变更", "h4text": "全链路",
        "flow": { "in": "变更请求 “太阳翼 X → Y”", "agt": "追溯影响链（结构 / 热控 / 电源 / 姿态 / BOM）", "hum": "审批变更 · 确认范围完整", "out": "变更闭环记录 · 下游文档自动更新" },
        "roi": { "bigBefore": "4w ", "bigEm": "→", "bigAfter": " 3d", "small": "避免返工 50-200w" }
      },
      "3": {
        "scn": "SCN · J", "cat": "OrbitOps",
        "h4em": "星座", "h4text": "在轨运维",
        "flow": { "in": "100 颗星实时遥测流 · 星座构型", "agt": "遥测语义化 · 异常检测 · 关联历史 RCA", "hum": "确认异常等级 · 审批处置方案", "out": "处置记录 · RCA 报告 · 健康仪表盘" },
        "roi": { "bigBefore": "50 ", "bigEm": "→", "bigAfter": " 10", "small": "年省 1200w" }
      }
    }
  },
```

- [ ] **Step 3: Append `scenarios` namespace to `messages/en.json`**

```json
  "scenarios": {
    "titleLine1": "From design to delivery to orbit —",
    "titleEm": "validated in real aerospace programs",
    "titleAfter": ".",
    "lead": "Every scenario has a defined input, agent execution, human review, output, and ROI. Phase 1 punches through Design + Verify; Phase 2 extends to Flow + Operate.",
    "items": {
      "0": {
        "scn": "SCN · A", "cat": "Design",
        "h4em": "Satellite GNC", "h4text": "design",
        "flow": { "in": "Orbit 500km SSO · pointing 0.1°", "agt": "STK orbit sim · MATLAB control law · 50+ parameter sweep", "hum": "Vet the rationale · pick the optimum", "out": "Design package + comparison report + change log" },
        "roi": { "bigBefore": "3w ", "bigEm": "→", "bigAfter": " 5d", "small": "ROI 37×" }
      },
      "1": {
        "scn": "SCN · D", "cat": "Verify",
        "h4em": "Thermal", "h4text": "verification",
        "flow": { "in": "Thermal design · GJB standards list", "agt": "Parse standards → 200+ test matrix · Thermal Desktop runs", "hum": "Vet matrix completeness · confirm failures", "out": "Verification report + evidence bundle + compliance matrix" },
        "roi": { "bigBefore": "2w ", "bigEm": "→", "bigAfter": " 2d", "small": "Miss rate ↓ 70%" }
      },
      "2": {
        "scn": "SCN · G", "cat": "Flow",
        "h4em": "Design change", "h4text": "end-to-end",
        "flow": { "in": "Change request \"solar array X → Y\"", "agt": "Trace impact chain (structure / thermal / power / attitude / BOM)", "hum": "Approve change · confirm scope completeness", "out": "Closed-loop change log · downstream docs auto-updated" },
        "roi": { "bigBefore": "4w ", "bigEm": "→", "bigAfter": " 3d", "small": "Rework avoided ¥0.5-2M" }
      },
      "3": {
        "scn": "SCN · J", "cat": "OrbitOps",
        "h4em": "Constellation", "h4text": "in-orbit ops",
        "flow": { "in": "Real-time telemetry from 100 satellites · constellation config", "agt": "Telemetry semantics · anomaly detection · correlate historical RCA", "hum": "Confirm severity · approve response plan", "out": "Response log · RCA report · health dashboard" },
        "roi": { "bigBefore": "50 ", "bigEm": "→", "bigAfter": " 10", "small": "¥12M saved per year" }
      }
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Scenarios.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Scenarios"
```

---

## Task 10: Create Evolution component + i18n

**Files:**
- Create: `components/Evolution.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Evolution.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function Evolution() {
  const t = useTranslations("evolution");
  const stats = [0, 1, 2, 3] as const;

  return (
    <section id="evolution" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Evolution"
            kicker="05 / 06"
            title={
              <>
                {t("titleBefore")}
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Chart panel */}
          <div className="flex flex-col gap-3.5 border border-white/10 bg-white/[0.03] px-6 py-6">
            <div className="flex items-baseline justify-between">
              <h4 className="font-mono text-[11px] uppercase tracking-[2px] text-white/50">{t("chart.head")}</h4>
              <div className="font-mono text-3xl font-light tracking-[-0.01em] text-white">
                {t("chart.now")}
                <span className="ml-0.5 font-mono text-sm text-white/50">%</span>
              </div>
            </div>
            <svg className="block h-[260px] w-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
                <line x1="0" y1="40" x2="800" y2="40" />
                <line x1="0" y1="110" x2="800" y2="110" />
                <line x1="0" y1="180" x2="800" y2="180" />
                <line x1="0" y1="250" x2="800" y2="250" />
              </g>
              <g fontFamily="Geist Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.35)">
                <text x="4" y="44">100%</text>
                <text x="4" y="114">75%</text>
                <text x="4" y="184">50%</text>
                <text x="4" y="254">25%</text>
              </g>
              <g fontFamily="Geist Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.35)">
                <text x="60" y="292">M1</text>
                <text x="180" y="292">M3</text>
                <text x="300" y="292">M5</text>
                <text x="420" y="292">M7</text>
                <text x="540" y="292">M9</text>
                <text x="660" y="292">M11</text>
                <text x="760" y="292">NOW</text>
              </g>
              <path d="M40 240 C 120 230, 180 210, 240 180 S 380 140, 460 100 S 620 60, 780 50" stroke="#ffffff" strokeWidth="2.2" fill="none" />
              <path d="M40 240 C 120 230, 180 210, 240 180 S 380 140, 460 100 S 620 60, 780 50 L 780 280 L 40 280 Z" fill="rgba(255,255,255,0.05)" />
              <path d="M40 80 C 140 90, 220 130, 320 180 S 500 240, 620 265 S 720 275, 780 278" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" fill="none" strokeDasharray="4 3" />
              <path d="M40 190 C 140 170, 240 140, 360 115 S 540 80, 780 70" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" fill="none" />
              <circle cx="780" cy="50" r="4" fill="#ffffff" />
              <circle cx="780" cy="278" r="3" fill="rgba(255,255,255,0.55)" />
              <circle cx="780" cy="70" r="3" fill="rgba(255,255,255,0.75)" />
            </svg>
            <div className="flex flex-wrap gap-5 border-t border-dashed border-white/10 pt-2 font-mono text-[11px] tracking-[0.4px] text-white/70">
              <div className="flex items-center gap-2"><span className="block h-0.5 w-3.5 bg-white" />{t("chart.legend.0")}</div>
              <div className="flex items-center gap-2"><span className="block h-0.5 w-3.5 bg-white/75" />{t("chart.legend.1")}</div>
              <div className="flex items-center gap-2"><span className="block h-0 w-3.5 border-t border-dashed border-white/55" />{t("chart.legend.2")}</div>
            </div>
          </div>

          {/* Stats list */}
          <div className="flex flex-col border border-white/10">
            {stats.map((i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 px-6 py-5 last:border-b-0">
                <div>
                  <h5 className="mb-1 font-mono text-xs font-normal tracking-[0.4px] text-white">{t(`stats.${i}.h5`)}</h5>
                  <p className="text-[12.5px] leading-[1.5] text-white/70">{t(`stats.${i}.body`)}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[30px] font-light tracking-[-0.01em]">
                    <span dangerouslySetInnerHTML={{ __html: t(`stats.${i}.val`) }} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[1px] text-white/50">{t(`stats.${i}.delta`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `evolution` namespace to `messages/zh.json`**

```json
  "evolution": {
    "titleBefore": "人机共进化 — ",
    "titleEm": "用得越多越聪明",
    "titleAfter": "。",
    "lead": "每一次人工审核、每一次 Agent 执行、每一次问题归因都在喂养知识引擎。M0 即时记忆 → M1 项目记忆 → M2 组织记忆 — 用一年的客户，Agent 比新客户聪明 10 倍。",
    "chart": {
      "head": "— 进化仪表盘 · 过去 12 个月 —",
      "now": "95",
      "legend": { "0": "Agent 自主完成率", "1": "首次通过率", "2": "人工干预频率" }
    },
    "stats": {
      "0": { "h5": "Agent 自主完成率", "body": "从 60% → 95%，临界转折在 M6。", "val": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">95</em>%", "delta": "↑ 35pp · 12m" },
      "1": { "h5": "人工干预频率", "body": "每个任务从 5 次 → 0.4 次。专家时间释放 >80%。", "val": "0.4<span style=\"font-size:15px;color:rgba(255,255,255,0.5)\">/任务</span>", "delta": "↓ 92% · 12m" },
      "2": { "h5": "首次通过率", "body": "Design → Verify 一次闭环通过比例。", "val": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">92</em>%", "delta": "↑ 22pp · 12m" },
      "3": { "h5": "知识库覆盖率", "body": "组织隐性知识结构化落库比例（M2）。", "val": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">87</em>%", "delta": "↑ 47pp · 12m" }
    }
  },
```

- [ ] **Step 3: Append `evolution` namespace to `messages/en.json`**

```json
  "evolution": {
    "titleBefore": "Human-AI co-evolution — ",
    "titleEm": "smarter the more you use it",
    "titleAfter": ".",
    "lead": "Every human review, every agent execution, every failure attribution feeds the knowledge engine. M0 session memory → M1 project memory → M2 organizational memory — after one year, a customer's agent is 10× smarter than a new one.",
    "chart": {
      "head": "— Evolution dashboard · last 12 months —",
      "now": "95",
      "legend": { "0": "Autonomous rate", "1": "First-pass rate", "2": "Intervention frequency" }
    },
    "stats": {
      "0": { "h5": "Autonomous rate", "body": "60% → 95%; the tipping point hit at M6.", "val": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">95</em>%", "delta": "↑ 35pp · 12m" },
      "1": { "h5": "Intervention frequency", "body": "From 5/task → 0.4/task. Expert time freed > 80%.", "val": "0.4<span style=\"font-size:15px;color:rgba(255,255,255,0.5)\">/task</span>", "delta": "↓ 92% · 12m" },
      "2": { "h5": "First-pass rate", "body": "Design → Verify pass rate on the first loop.", "val": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">92</em>%", "delta": "↑ 22pp · 12m" },
      "3": { "h5": "Knowledge coverage", "body": "Share of tacit organizational knowledge now structured in M2.", "val": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">87</em>%", "delta": "↑ 47pp · 12m" }
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Evolution.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Evolution"
```

---

## Task 11: Create Market component + i18n

**Files:**
- Create: `components/Market.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/Market.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

type Layer = { ix: string; h5: string; body: string; value: string };
type CompeteRow = { rh: string; cells: { text: string; level: "y" | "p" | "n" }[] };

export default function Market() {
  const t = useTranslations("market");
  const layers = t.raw("tam.layers") as Layer[];
  const header = t.raw("compete.header") as string[];
  const rows = t.raw("compete.rows") as CompeteRow[];

  return (
    <section id="market" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Market"
            kicker="06 / 06"
            title={
              <>
                {t("titleLine1")}
                <br />
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        {/* TAM */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="border border-white/10 bg-white/[0.03] p-7.5 p-8">
            <svg viewBox="0 0 520 520" className="mx-auto block h-auto w-full max-w-[480px]">
              <circle cx="260" cy="260" r="240" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.22)" strokeDasharray="2 4" />
              <circle cx="260" cy="260" r="170" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)" />
              <circle cx="260" cy="260" r="100" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.5)" />
              <circle cx="260" cy="260" r="44" fill="#ffffff" stroke="#ffffff" />
              <g fontFamily="Geist Mono, monospace" fill="rgba(255,255,255,0.72)">
                <text x="260" y="50" textAnchor="middle" fontSize="13" fontStyle="italic">{t("tam.ringLabels.0")}</text>
                <text x="260" y="130" textAnchor="middle" fontSize="13" fontStyle="italic">{t("tam.ringLabels.1")}</text>
                <text x="260" y="210" textAnchor="middle" fontSize="13" fontStyle="italic" fill="#ffffff">{t("tam.ringLabels.2")}</text>
                <text x="260" y="258" textAnchor="middle" fontSize="15" fill="#1f2228" fontWeight="500">SOM</text>
                <text x="260" y="276" textAnchor="middle" fontSize="10" fill="#1f2228" letterSpacing="1">{t("tam.ringLabels.som")}</text>
              </g>
              <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none">
                <path d="M8 20 L8 8 L20 8" /><path d="M500 8 L512 8 L512 20" />
                <path d="M8 500 L8 512 L20 512" /><path d="M500 512 L512 512 L512 500" />
              </g>
              <g fontFamily="Geist Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)" letterSpacing="2">
                <text x="24" y="18">TAM · CHINA</text>
                <text x="496" y="18" textAnchor="end">2026-2031</text>
              </g>
            </svg>
          </div>

          <div className="flex flex-col">
            {layers.map((layer, i) => (
              <div
                key={layer.ix}
                className={`grid grid-cols-[56px_1fr_auto] items-center gap-5 border-b border-white/10 py-5 first:border-t first:border-white/20 ${
                  layer.ix === "SOM" ? "-mx-2.5 bg-white/[0.05] px-2.5" : ""
                }`}
              >
                <span className={`font-mono text-[11px] uppercase tracking-[1.6px] ${layer.ix === "SOM" ? "text-white" : "text-white/50"}`}>{layer.ix}</span>
                <div>
                  <h5 className="mb-0.5 font-mono text-sm font-normal text-white">{layer.h5}</h5>
                  <p className="text-[12.5px] leading-[1.5] text-white/70">{layer.body}</p>
                </div>
                <span className="whitespace-nowrap text-right font-mono text-lg font-light tracking-[-0.005em] text-white" dangerouslySetInnerHTML={{ __html: layer.value }} />
              </div>
            ))}
          </div>
        </div>

        {/* Compete */}
        <div className="mt-18 mt-20">
          <h3 className="mb-7 font-mono text-[22px] font-normal tracking-[-0.01em]">{t("compete.h3")}</h3>
          <div className="border border-white/10">
            <div className="hidden grid-cols-[170px_repeat(5,1fr)] border-b border-white/10 bg-white/[0.05] font-mono text-[11px] uppercase tracking-[1.4px] text-white/50 md:grid">
              {header.map((h, i) => (
                <div key={i} className="flex items-center border-r border-white/10 px-4 py-3.5 last:border-r-0">{h}</div>
              ))}
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 border-b border-white/10 text-[13px] last:border-b-0 md:grid-cols-[170px_repeat(5,1fr)] ${
                  i === 0 ? "md:bg-white/[0.03]" : ""
                }`}
              >
                <div className="flex items-center border-b border-dashed border-white/10 px-4 py-2.5 font-mono font-normal text-white md:border-b-0 md:border-r">{row.rh}</div>
                {row.cells.map((cell, j) => (
                  <div
                    key={j}
                    className={`flex items-center border-b border-dashed border-white/10 px-4 py-2.5 font-mono md:border-b-0 md:border-r md:last:border-r-0 ${
                      cell.level === "y" ? "text-white" : cell.level === "p" ? "text-white/70" : "text-white/30"
                    }`}
                  >
                    {cell.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `market` namespace to `messages/zh.json`**

```json
  "market": {
    "titleLine1": "商业航天是切入口，",
    "titleEm": "万亿级工程服务",
    "titleAfter": "才是市场。",
    "lead": "同一个 Core OS，换一套 Industry Pack —— 从航天复制到低空、装备、能源。Layer 1 核心平台 200-400 亿确定性强，Layer 2 产能化 500-1200 亿是成长空间。",
    "tam": {
      "ringLabels": {
        "0": "Layer 3 · 2000-5000 亿",
        "1": "Layer 2 · 500-1200 亿",
        "2": "Layer 1 · 200-400 亿",
        "som": "Y5 · 8-15 亿"
      },
      "layers": [
        { "ix": "L3", "h5": "长期价值池", "body": "AI 重构知识密集型工程劳动", "value": "2000-5000<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\"> 亿</em>" },
        { "ix": "L2", "h5": "工程产能可捕获", "body": "验证 / 变更 / 交付 / 运维的产能化", "value": "500-1200<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\"> 亿</em>" },
        { "ix": "L1", "h5": "核心平台软件", "body": "AI 原生工程协作与执行层", "value": "200-400<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\"> 亿</em>" },
        { "ix": "SAM", "h5": "优先 5 行业", "body": "航天 / 航空配套 / 低空 / 装备 / 能源", "value": "100-250<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\"> 亿</em>" },
        { "ix": "SOM", "h5": "Y5 现实可获", "body": "Pro + Team + Enterprise + OrbitOps", "value": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">8-15</em> 亿" }
      ]
    },
    "compete": {
      "h3": "竞争 × 壁垒",
      "header": ["维度", "3studio", "Epsilon3", "Synera", "通用 LLM", "自建"],
      "rows": [
        { "rh": "多人多 Agent", "cells": [ { "text": "● 原生", "level": "y" }, { "text": "— 无", "level": "n" }, { "text": "— 无", "level": "n" }, { "text": "○ 单轮", "level": "p" }, { "text": "◐ 单 Agent", "level": "p" } ] },
        { "rh": "深度工具调用", "cells": [ { "text": "● MATLAB/STK/CAE", "level": "y" }, { "text": "— 无", "level": "n" }, { "text": "◐ 浅层参数", "level": "p" }, { "text": "— 无", "level": "n" }, { "text": "◐ 需自建", "level": "p" } ] },
        { "rh": "Harness 治理", "cells": [ { "text": "● 完整", "level": "y" }, { "text": "— 无", "level": "n" }, { "text": "— 无", "level": "n" }, { "text": "— 无", "level": "n" }, { "text": "— 需自建", "level": "n" } ] },
        { "rh": "进化可量化", "cells": [ { "text": "● M0/M1/M2 + RL", "level": "y" }, { "text": "— 无", "level": "n" }, { "text": "— 无", "level": "n" }, { "text": "◐ 浅", "level": "p" }, { "text": "— 需自建", "level": "n" } ] },
        { "rh": "行业深度", "cells": [ { "text": "● 航天 → 跨行业", "level": "y" }, { "text": "◐ 航天流程", "level": "p" }, { "text": "— 浅", "level": "n" }, { "text": "— 浅", "level": "n" }, { "text": "◐ 取决于投入", "level": "p" } ] }
      ]
    }
  },
```

- [ ] **Step 3: Append `market` namespace to `messages/en.json`**

```json
  "market": {
    "titleLine1": "Commercial aerospace is the wedge —",
    "titleEm": "a trillion-yuan engineering-services market",
    "titleAfter": " is the prize.",
    "lead": "One Core OS, many Industry Packs — replicate from aerospace into UAV, heavy equipment, and energy. Layer 1 (¥20-40B core platform) is well-defined; Layer 2 (¥50-120B productized capacity) is the growth surface.",
    "tam": {
      "ringLabels": {
        "0": "Layer 3 · ¥200-500B",
        "1": "Layer 2 · ¥50-120B",
        "2": "Layer 1 · ¥20-40B",
        "som": "Y5 · ¥0.8-1.5B"
      },
      "layers": [
        { "ix": "L3", "h5": "Long-term value pool", "body": "AI reshaping knowledge-intensive engineering labor", "value": "¥200-500<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">B</em>" },
        { "ix": "L2", "h5": "Engineering capacity, productized", "body": "Validation / change / delivery / ops at production scale", "value": "¥50-120<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">B</em>" },
        { "ix": "L1", "h5": "Core platform software", "body": "AI-native engineering collaboration & execution layer", "value": "¥20-40<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">B</em>" },
        { "ix": "SAM", "h5": "Top 5 industries", "body": "Aerospace / aero-supply / UAV / heavy equipment / energy", "value": "¥10-25<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">B</em>" },
        { "ix": "SOM", "h5": "Y5 realistic capture", "body": "Pro + Team + Enterprise + OrbitOps", "value": "¥<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">0.8-1.5</em>B" }
      ]
    },
    "compete": {
      "h3": "Competition × moat",
      "header": ["Dimension", "3studio", "Epsilon3", "Synera", "Generic LLM", "Build in-house"],
      "rows": [
        { "rh": "Multi-human, multi-agent", "cells": [ { "text": "● native", "level": "y" }, { "text": "— none", "level": "n" }, { "text": "— none", "level": "n" }, { "text": "○ single-turn", "level": "p" }, { "text": "◐ single agent", "level": "p" } ] },
        { "rh": "Deep tool calls", "cells": [ { "text": "● MATLAB/STK/CAE", "level": "y" }, { "text": "— none", "level": "n" }, { "text": "◐ shallow params", "level": "p" }, { "text": "— none", "level": "n" }, { "text": "◐ DIY", "level": "p" } ] },
        { "rh": "Harness governance", "cells": [ { "text": "● full", "level": "y" }, { "text": "— none", "level": "n" }, { "text": "— none", "level": "n" }, { "text": "— none", "level": "n" }, { "text": "— DIY", "level": "n" } ] },
        { "rh": "Quantified evolution", "cells": [ { "text": "● M0/M1/M2 + RL", "level": "y" }, { "text": "— none", "level": "n" }, { "text": "— none", "level": "n" }, { "text": "◐ shallow", "level": "p" }, { "text": "— DIY", "level": "n" } ] },
        { "rh": "Industry depth", "cells": [ { "text": "● aerospace → cross-sector", "level": "y" }, { "text": "◐ aerospace ops", "level": "p" }, { "text": "— shallow", "level": "n" }, { "text": "— shallow", "level": "n" }, { "text": "◐ depends on spend", "level": "p" } ] }
      ]
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Market.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add Market"
```

---

## Task 12: Create CTAContact component + i18n

**Files:**
- Create: `components/CTAContact.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/CTAContact.tsx`**

```tsx
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function CTAContact() {
  const t = useTranslations("cta");
  const tc = useTranslations("contact");

  return (
    <section id="contact" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <div className="grid grid-cols-1 items-center gap-10 border border-white/10 bg-white/[0.03] px-8 py-14 md:grid-cols-[1.4fr_1fr] md:px-12 md:py-16">
            <div>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-white">{t("kicker")}</div>
              <h2 className="mb-4 font-mono text-4xl font-light leading-[1.05] tracking-[-0.012em] md:text-5xl lg:text-6xl">
                {t("titleBefore")}
                <br />
                <em className="italic font-light text-white/50">{t("titleEm")}</em>
                {t("titleAfter")}
              </h2>
              <p className="text-[17px] leading-[1.65] text-white/70">{t("lead")}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:contact@7dawn.ai?subject=Book%20a%20demo"
                className="btn btn-primary justify-center px-6 py-3.5"
              >
                {t("button")} →
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid max-w-[720px] grid-cols-1 gap-10 sm:grid-cols-2">
          <ScrollReveal>
            <div className="border-t border-white/20 pt-5">
              <div className="mb-2.5 font-mono text-xs uppercase tracking-[2px] text-white/50">{tc("email")}</div>
              <a href="mailto:contact@7dawn.ai" className="font-mono text-base text-white transition-colors hover:text-white/50">
                contact@7dawn.ai
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="border-t border-white/20 pt-5">
              <div className="mb-2.5 font-mono text-xs uppercase tracking-[2px] text-white/50">{tc("phone")}</div>
              <a href="tel:+8618810308915" className="font-mono text-base text-white transition-colors hover:text-white/50">
                +86 188 1030 8915
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `cta` namespace to `messages/zh.json`** (note: reuses existing `contact.email` / `contact.phone`)

```json
  "cta": {
    "kicker": "— Start your first workspace —",
    "titleBefore": "从最难的",
    "titleEm": "一颗卫星",
    "titleAfter": "开始。",
    "lead": "Cursor 做了软件工程的 AI 原生平台。3Studio 要做硬件 / 系统工程的。",
    "button": "预约企业版演示"
  },
```

- [ ] **Step 3: Append `cta` namespace to `messages/en.json`**

```json
  "cta": {
    "kicker": "— Start your first workspace —",
    "titleBefore": "Start from the hardest",
    "titleEm": "single satellite",
    "titleAfter": ".",
    "lead": "Cursor built the AI-native platform for software engineering. 3Studio is building it for hardware and systems engineering.",
    "button": "Book an enterprise demo"
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/CTAContact.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add CTAContact"
```

---

## Task 13: Create PlatformDossier (client) + i18n

**Files:**
- Create: `components/PlatformDossier.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Create `components/PlatformDossier.tsx`**

```tsx
"use client";

import { useState, ReactNode } from "react";
import { useTranslations } from "next-intl";

type WsKey = "design" | "verify" | "flow" | "operate" | "command";
const WS_ORDER: WsKey[] = ["design", "verify", "flow", "operate", "command"];

type Step = { ix: string; name: string; st: "pass" | "run" | "wait" };
type Stat = { k: string; v: string };

const GLYPHS: Record<WsKey, ReactNode> = {
  design: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 15 L9 3 L15 15" /><path d="M6 11 L12 11" /></svg>,
  verify: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="12" height="12" /><path d="M6 9 L8.5 11.5 L13 7" /></svg>,
  flow: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="9" cy="9" r="5" /><path d="M9 4 L11 6 L9 8" /><path d="M9 14 L7 12 L9 10" /></svg>,
  operate: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 14 L7 7 L10 11 L16 4" /><circle cx="16" cy="4" r="1.2" fill="currentColor" /></svg>,
  command: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 15 L3 9 L6 9 L6 15" /><path d="M8 15 L8 5 L11 5 L11 15" /><path d="M13 15 L13 11 L16 11 L16 15" /></svg>,
};

export default function PlatformDossier() {
  const t = useTranslations("platform");
  const [active, setActive] = useState<WsKey>("design");

  const stats = [0, 1, 2, 3] as const;
  const steps = t.raw(`bodies.${active}.steps`) as Step[];
  const bodyStats = t.raw(`bodies.${active}.stats`) as Stat[];

  return (
    <section className="relative border-t border-white/10 px-6 pt-20 pb-24 md:px-12 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-[1280px]">
        {/* 4 stat cells */}
        <div className="grid grid-cols-2 border-t border-white/20 md:grid-cols-4">
          {stats.map((i) => (
            <div
              key={i}
              className="border-b border-r border-white/10 px-5 py-5.5 pr-6 last:border-r-0 md:border-b-0 md:pr-7 md:[&:last-child]:pr-0"
            >
              <div
                className="font-mono text-[40px] font-light leading-none tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: t(`stats.${i}.num`) }}
              />
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[1.6px] text-white/50">{t(`stats.${i}.lbl`)}</div>
            </div>
          ))}
        </div>

        {/* Switcher head */}
        <div className="mb-5 mt-14 flex flex-wrap items-baseline justify-between gap-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[2px] text-white/50">{t("switcher.title")}</h4>
          <span className="chip"><span className="pulse-dot" />{t("switcher.live")}</span>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-5 overflow-x-auto border border-white/10 bg-white/[0.03]">
          {WS_ORDER.map((key) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex min-w-[140px] flex-col gap-2.5 border-r border-white/10 px-5.5 py-5.5 px-6 py-6 text-left transition-colors last:border-r-0 ${
                  isActive ? "bg-white text-[#1f2228]" : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[1.8px] ${isActive ? "border-[rgba(31,34,40,0.28)] text-[rgba(31,34,40,0.6)]" : "border-white/20 text-white/50"}`}>
                    {t(`tabs.${key}.code`)}
                  </span>
                  <span className={`h-[18px] w-[18px] ${isActive ? "text-[#1f2228]" : ""}`}>{GLYPHS[key]}</span>
                </div>
                <div className="font-mono text-[17px] font-normal leading-none tracking-[-0.005em]">
                  {key === "design" ? <em className="italic font-light opacity-70">{t(`tabs.${key}.nameEm`)}</em> : t(`tabs.${key}.nameEm`)}
                  {key === "design" ? <> · {t(`tabs.${key}.nameText`)}</> : <> · {t(`tabs.${key}.nameText`)}</>}
                </div>
                <div className={`font-mono text-[11px] tracking-[0.3px] ${isActive ? "text-[rgba(31,34,40,0.58)]" : "text-white/50"}`}>{t(`tabs.${key}.sub`)}</div>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="mt-5 grid grid-cols-1 gap-6 border border-white/10 bg-white/[0.03] px-6 py-5.5 py-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h5 className="mb-3.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[2px] text-white/50">
              <span className="pulse-dot" />
              {t(`bodies.${active}.title`)}
            </h5>
            {steps.map((s) => (
              <div key={s.ix} className="grid grid-cols-[36px_1fr_auto] items-center gap-2.5 border-b border-dashed border-white/10 py-2.5 text-[13px] last:border-b-0">
                <span className="font-mono text-[10px] text-white/50">{s.ix}</span>
                <span>{s.name}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[1.2px] ${s.st === "run" ? "text-white" : s.st === "wait" ? "text-white/30" : "text-white/70"}`}>{s.st}</span>
              </div>
            ))}
          </div>
          <div>
            <h5 className="mb-3.5 font-mono text-[10px] uppercase tracking-[2px] text-white/50">{t("switcher.metricsLabel")}</h5>
            {bodyStats.map((st) => (
              <div key={st.k} className="flex items-center justify-between border-b border-dashed border-white/10 py-2.5 text-[13px] last:border-b-0">
                <span>{st.k}</span>
                <span className="font-mono font-normal" dangerouslySetInnerHTML={{ __html: st.v }} />
              </div>
            ))}
          </div>
        </div>

        {/* Foot */}
        <div className="mt-4 flex flex-wrap justify-between gap-2 font-mono text-[11px] uppercase tracking-[1px] text-white/50">
          <span>{t("foot.industry")}</span>
          <span>{t("foot.orbitops")}</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append `platform` namespace to `messages/zh.json`**

```json
  "platform": {
    "stats": {
      "0": { "num": "5<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">+</em>", "lbl": "工作空间 Workspaces" },
      "1": { "num": "M0<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">→</em>M2", "lbl": "三层记忆架构" },
      "2": { "num": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">99</em>%", "lbl": "可审计执行率" },
      "3": { "num": "4<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">×</em>", "lbl": "行业适配包" }
    },
    "switcher": {
      "title": "— 3Studio Platform · Workspace Switcher —",
      "live": "LIVE · 像 Notion/Figma 那样切换",
      "metricsLabel": "Metrics"
    },
    "foot": {
      "industry": "行业配置：Aerospace Pack · STK / MATLAB / Thermal Desktop / GJB",
      "orbitops": "OrbitOps = Operate + Aerospace Pack"
    },
    "tabs": {
      "design":  { "code": "S-01", "nameEm": "Design",  "nameText": "设计", "sub": "Agent 团队做设计" },
      "verify":  { "code": "S-02", "nameEm": "Verify",  "nameText": "验证", "sub": "Agent 团队做验证" },
      "flow":    { "code": "S-03", "nameEm": "Flow",    "nameText": "流程", "sub": "多人多 Agent 流转" },
      "operate": { "code": "S-04", "nameEm": "Operate", "nameText": "运维", "sub": "监控 + 异常处置" },
      "command": { "code": "S-05", "nameEm": "Command", "nameText": "指挥", "sub": "项目统筹 + 进化" }
    },
    "bodies": {
      "design": {
        "title": "运行中 · Design Session #DS-204",
        "steps": [
          { "ix": "T-01", "name": "STK 轨道仿真 · 500km SSO", "st": "pass" },
          { "ix": "T-02", "name": "MATLAB 控制律设计", "st": "pass" },
          { "ix": "T-03", "name": "参数扫描 52 组 · DOE", "st": "run" },
          { "ix": "T-04", "name": "多学科接口检查", "st": "wait" },
          { "ix": "T-05", "name": "生成设计包 · Draft", "st": "wait" }
        ],
        "stats": [
          { "k": "活跃 Agent", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">4</em> · Orbit / ATC / DOE / Doc" },
          { "k": "参数探索", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">52</em> / 100 组" },
          { "k": "设计周期", "v": "3w → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">5d</em>" },
          { "k": "首次通过率", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">92</em>%" }
        ]
      },
      "verify": {
        "title": "运行中 · Verify Session #VR-081",
        "steps": [
          { "ix": "V-01", "name": "解析 GJB 标准 → 测试矩阵", "st": "pass" },
          { "ix": "V-02", "name": "Thermal Desktop · hot-soak", "st": "pass" },
          { "ix": "V-03", "name": "Thermal Desktop · cold-survival", "st": "pass" },
          { "ix": "V-04", "name": "振动仿真 · 正弦/随机", "st": "run" },
          { "ix": "V-05", "name": "未通过项归因", "st": "wait" }
        ],
        "stats": [
          { "k": "测试项", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">216</em> 条" },
          { "k": "已完成", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">168</em> / 216" },
          { "k": "覆盖率", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">99.2</em>%" },
          { "k": "漏测率", "v": "↓ <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">70</em>%" }
        ]
      },
      "flow": {
        "title": "运行中 · Change Request #CR-0417",
        "steps": [
          { "ix": "F-01", "name": "解析变更 · 太阳翼 60° → 62°", "st": "pass" },
          { "ix": "F-02", "name": "影响链追溯 · 6 模块", "st": "pass" },
          { "ix": "F-03", "name": "生成影响评估报告", "st": "pass" },
          { "ix": "F-04", "name": "分级审批 · 等待总师签字", "st": "wait" },
          { "ix": "F-05", "name": "下游文档 / BOM 更新", "st": "wait" }
        ],
        "stats": [
          { "k": "受影响模块", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">6</em> · 结构/热/电/姿/BOM/文档" },
          { "k": "审批层级", "v": "L2 总师 → L1 质量" },
          { "k": "变更处理", "v": "4w → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">3d</em>" },
          { "k": "遗漏率", "v": "↓ <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">80</em>%" }
        ]
      },
      "operate": {
        "title": "LIVE · OrbitOps · 104 satellites",
        "steps": [
          { "ix": "O-01", "name": "遥测摄入 · 104 颗在轨星", "st": "pass" },
          { "ix": "O-02", "name": "异常检测 · 星 #37 电源", "st": "pass" },
          { "ix": "O-03", "name": "RCA · 关联历史 #2024-ST-19", "st": "run" },
          { "ix": "O-04", "name": "推荐 Runbook · 电源切换", "st": "wait" },
          { "ix": "O-05", "name": "人工确认处置方案", "st": "wait" }
        ],
        "stats": [
          { "k": "在轨卫星", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">104</em> · 健康 98%" },
          { "k": "异常响应", "v": "小时级 → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">分钟级</em>" },
          { "k": "运维人力", "v": "50 → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">10</em> 人" },
          { "k": "年省成本", "v": "¥ <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">1200</em>w" }
        ]
      },
      "command": {
        "title": "指挥空间 · 项目仪表盘",
        "steps": [
          { "ix": "P-01", "name": "XX-3 号卫星总体进度 · 82%", "st": "pass" },
          { "ix": "P-02", "name": "风险 · 热控裕度收紧", "st": "run" },
          { "ix": "P-03", "name": "里程碑 · AIT 启动 D-14", "st": "run" },
          { "ix": "P-04", "name": "进化指标 · 自主完成率上升", "st": "pass" },
          { "ix": "P-05", "name": "资源 · GPU / 仿真集群 68%", "st": "wait" }
        ],
        "stats": [
          { "k": "活跃项目", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">7</em> · 3 重点型号" },
          { "k": "Agent 自主率", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">95</em>%" },
          { "k": "干预频率", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">0.4</em> / 任务" },
          { "k": "知识覆盖", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">87</em>%" }
        ]
      }
    }
  },
```

- [ ] **Step 3: Append `platform` namespace to `messages/en.json`**

```json
  "platform": {
    "stats": {
      "0": { "num": "5<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">+</em>", "lbl": "Workspaces" },
      "1": { "num": "M0<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">→</em>M2", "lbl": "Three-tier memory" },
      "2": { "num": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">99</em>%", "lbl": "Auditable execution" },
      "3": { "num": "4<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">×</em>", "lbl": "Industry Packs" }
    },
    "switcher": {
      "title": "— 3Studio Platform · Workspace Switcher —",
      "live": "LIVE · switch like Notion / Figma",
      "metricsLabel": "Metrics"
    },
    "foot": {
      "industry": "Industry config: Aerospace Pack · STK / MATLAB / Thermal Desktop / GJB",
      "orbitops": "OrbitOps = Operate + Aerospace Pack"
    },
    "tabs": {
      "design":  { "code": "S-01", "nameEm": "Design",  "nameText": "Design Space",  "sub": "Agents do design" },
      "verify":  { "code": "S-02", "nameEm": "Verify",  "nameText": "Verify Space",  "sub": "Agents run verification" },
      "flow":    { "code": "S-03", "nameEm": "Flow",    "nameText": "Flow Space",    "sub": "Multi-human, multi-agent flow" },
      "operate": { "code": "S-04", "nameEm": "Operate", "nameText": "Operate Space", "sub": "Monitor + anomaly response" },
      "command": { "code": "S-05", "nameEm": "Command", "nameText": "Command Space", "sub": "Oversight + evolution" }
    },
    "bodies": {
      "design": {
        "title": "Running · Design Session #DS-204",
        "steps": [
          { "ix": "T-01", "name": "STK orbit sim · 500km SSO", "st": "pass" },
          { "ix": "T-02", "name": "MATLAB control law design", "st": "pass" },
          { "ix": "T-03", "name": "Parameter sweep 52/100 · DOE", "st": "run" },
          { "ix": "T-04", "name": "Multi-discipline interface check", "st": "wait" },
          { "ix": "T-05", "name": "Generate design package · Draft", "st": "wait" }
        ],
        "stats": [
          { "k": "Active agents", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">4</em> · Orbit / ATC / DOE / Doc" },
          { "k": "Param exploration", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">52</em> / 100" },
          { "k": "Design cycle", "v": "3w → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">5d</em>" },
          { "k": "First-pass rate", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">92</em>%" }
        ]
      },
      "verify": {
        "title": "Running · Verify Session #VR-081",
        "steps": [
          { "ix": "V-01", "name": "Parse GJB standards → test matrix", "st": "pass" },
          { "ix": "V-02", "name": "Thermal Desktop · hot-soak", "st": "pass" },
          { "ix": "V-03", "name": "Thermal Desktop · cold-survival", "st": "pass" },
          { "ix": "V-04", "name": "Vibration sim · sine / random", "st": "run" },
          { "ix": "V-05", "name": "Failure attribution", "st": "wait" }
        ],
        "stats": [
          { "k": "Test items", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">216</em>" },
          { "k": "Completed", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">168</em> / 216" },
          { "k": "Coverage", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">99.2</em>%" },
          { "k": "Miss rate", "v": "↓ <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">70</em>%" }
        ]
      },
      "flow": {
        "title": "Running · Change Request #CR-0417",
        "steps": [
          { "ix": "F-01", "name": "Parse change · solar array 60° → 62°", "st": "pass" },
          { "ix": "F-02", "name": "Impact-chain trace · 6 modules", "st": "pass" },
          { "ix": "F-03", "name": "Generate impact report", "st": "pass" },
          { "ix": "F-04", "name": "Tiered approval · chief engineer signature", "st": "wait" },
          { "ix": "F-05", "name": "Downstream docs / BOM update", "st": "wait" }
        ],
        "stats": [
          { "k": "Affected modules", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">6</em> · structure / thermal / power / attitude / BOM / doc" },
          { "k": "Approval tier", "v": "L2 chief → L1 quality" },
          { "k": "Change cycle", "v": "4w → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">3d</em>" },
          { "k": "Miss rate", "v": "↓ <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">80</em>%" }
        ]
      },
      "operate": {
        "title": "LIVE · OrbitOps · 104 satellites",
        "steps": [
          { "ix": "O-01", "name": "Telemetry ingest · 104 in-orbit", "st": "pass" },
          { "ix": "O-02", "name": "Anomaly detection · sat #37 power", "st": "pass" },
          { "ix": "O-03", "name": "RCA · correlate history #2024-ST-19", "st": "run" },
          { "ix": "O-04", "name": "Runbook recommend · power switch", "st": "wait" },
          { "ix": "O-05", "name": "Human confirm response plan", "st": "wait" }
        ],
        "stats": [
          { "k": "In-orbit sats", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">104</em> · 98% healthy" },
          { "k": "Anomaly response", "v": "hours → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">minutes</em>" },
          { "k": "Ops headcount", "v": "50 → <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">10</em>" },
          { "k": "Yearly savings", "v": "¥ <em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">12</em>M" }
        ]
      },
      "command": {
        "title": "Command · Program dashboard",
        "steps": [
          { "ix": "P-01", "name": "Satellite XX-3 progress · 82%", "st": "pass" },
          { "ix": "P-02", "name": "Risk · thermal margin tightening", "st": "run" },
          { "ix": "P-03", "name": "Milestone · AIT kickoff D-14", "st": "run" },
          { "ix": "P-04", "name": "Evolution · autonomous rate rising", "st": "pass" },
          { "ix": "P-05", "name": "Resource · GPU / sim cluster 68%", "st": "wait" }
        ],
        "stats": [
          { "k": "Active programs", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">7</em> · 3 priority" },
          { "k": "Autonomous rate", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">95</em>%" },
          { "k": "Intervention", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">0.4</em> / task" },
          { "k": "Knowledge coverage", "v": "<em style=\"font-style:italic;color:rgba(255,255,255,0.5)\">87</em>%" }
        ]
      }
    }
  },
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm test` — Expected: passes.
Run: `pnpm build` — Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/PlatformDossier.tsx messages/zh.json messages/en.json
git commit -m "feat(section): add PlatformDossier (client-side workspace switcher)"
```

---

## Task 14: Wire up page.tsx, delete obsolete components, update meta

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `messages/zh.json` (remove old namespaces + update meta)
- Modify: `messages/en.json` (same)
- Delete: `components/Product.tsx`
- Delete: `components/Directions.tsx`
- Delete: `components/Team.tsx`
- Delete: `components/Contact.tsx`

- [ ] **Step 1: Rewrite `app/[locale]/page.tsx`**

Replace the entire file with:

```tsx
import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import PlatformDossier from "@/components/PlatformDossier";
import WhyNow from "@/components/WhyNow";
import Problem from "@/components/Problem";
import Spaces from "@/components/Spaces";
import Architecture from "@/components/Architecture";
import Harness from "@/components/Harness";
import Scenarios from "@/components/Scenarios";
import Evolution from "@/components/Evolution";
import Market from "@/components/Market";
import CTAContact from "@/components/CTAContact";
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
        <PlatformDossier />
        <WhyNow />
        <Problem />
        <Spaces />
        <Architecture />
        <Harness />
        <Scenarios />
        <Evolution />
        <Market />
        <CTAContact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Delete obsolete components**

Run:

```bash
rm components/Product.tsx components/Directions.tsx components/Team.tsx components/Contact.tsx
```

Expected: 4 files removed.

- [ ] **Step 3: Remove old namespaces + update meta in `messages/zh.json`**

Delete the entire `"product": { ... }` block.
Delete the entire `"directions": { ... }` block.
Delete the entire `"team": { ... }` block.
Keep the `"contact": { ... }` block (still used by CTAContact for `email` / `phone` labels).

Replace the `"meta": { ... }` block at the top with:

```json
  "meta": {
    "title": "7dawn · 3Studio — 面向复杂工程行业的 AI 原生平台",
    "description": "3Studio 由五个工作空间组成，让工程专家带着 Agent 团队工作。在 Harness 治理下，把组织隐性知识内化为可量化的工程智能资产。"
  },
```

- [ ] **Step 4: Remove old namespaces + update meta in `messages/en.json`**

Delete the entire `"product": { ... }` block.
Delete the entire `"directions": { ... }` block.
Delete the entire `"team": { ... }` block.
Keep `"contact": { ... }`.

Replace the `"meta": { ... }` block with:

```json
  "meta": {
    "title": "7dawn · 3Studio — AI-native platform for complex engineering",
    "description": "3Studio is five workspaces where engineering experts work alongside agent crews. Under the Harness governance layer, tacit organizational knowledge crystallizes into quantifiable engineering intelligence."
  },
```

- [ ] **Step 5: Run tests + build**

Run: `pnpm test`
Expected: all 3 tests pass. Key sets are still identical between zh and en (each removed 3 namespaces in lockstep).

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/page.tsx components/ messages/zh.json messages/en.json
git commit -m "feat(landing): wire up 3Studio sections, drop legacy product/directions/team, update meta"
```

---

## Task 15: Final verification

**Files:** none modified — sanity checks only.

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: all tests pass.

- [ ] **Step 2: Production build**

Run: `pnpm build`
Expected: build completes; no TypeScript errors; all routes statically generated for both `/zh` and `/en`.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 4: Start dev server and browser-check**

Run: `pnpm dev`
Open: `http://localhost:3000/zh`

Verify in browser:
- Hero displays as before (跨越奇点·星海铸魂 + light orb top-left + CTA).
- Scrolling down reveals (in order): Platform Dossier (4 stats + workspace switcher) → Why Now → Problem → Spaces → Architecture → Harness (slightly darker bg) → Scenarios → Evolution → Market → CTA+Contact → Footer.
- Clicking the 5 workspace tabs in Platform Dossier swaps the steps and metrics list.
- Nav anchors (`工作空间 / Harness / 进化 / 市场`) scroll to the correct sections.
- Language switch to `EN` renders the English copy across all sections.
- `/en` route loads the same layout in English.
- Resize browser narrower than 720px — no horizontal scroll; grids collapse to 1 or 2 columns as appropriate.
- With "Reduce motion" enabled in the OS, FogCanvas stays static and ScrollReveal enters instantly.

- [ ] **Step 5: Commit any residual fixes**

If browser checks surfaced issues, fix them in focused commits. Otherwise no commit.

- [ ] **Step 6: Final housekeeping commit (if `.gitignore` change not yet committed)**

Check that `.superpowers/` is ignored:

```bash
git status
```

If `.gitignore` still shows as modified, commit it:

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorming artifacts"
```

---

## Self-Review Summary

**Spec coverage:**
- §1 Hero preserved: untouched in Task 14 (still imported)
- §2 Platform Dossier: Task 13
- §3 Why Now: Task 4
- §4 Problem: Task 5
- §5 Spaces: Task 6
- §6 Architecture: Task 7
- §7 Harness (dark): Task 8
- §8 Scenarios: Task 9
- §9 Evolution: Task 10
- §10 Market: Task 11
- §11 CTA + Contact: Task 12
- Footer preserved: Task 14 assembly
- Nav 4-anchor change: Task 3
- Visual tokens + utility classes: Task 1
- SectionHeader shared: Task 2
- Meta title/description: Task 14
- Obsolete component/namespace removal: Task 14
- Final verification gate: Task 15

No spec requirement is unmapped.

**Placeholder scan:** No `TBD` / `TODO` / "handle edge cases" / "similar to" references. Every step has complete code or exact command.

**Type consistency:** `useTranslations(namespace)` pattern is consistent across all section components. `t.raw()` is used uniformly for arrays/nested objects (principles rows, audit rows, TAM layers, compete rows, workspace bodies). Glyph arrays in `Spaces` and `PlatformDossier` are typed statically.

**Known caveat on `dangerouslySetInnerHTML`:** Used in Harness demo rows, Evolution stats, Market TAM values/cells, and PlatformDossier stats to inline the `<em>` italic markup already embedded in the i18n strings. All inserted HTML is static, authored-in-repo content — not user input — so XSS risk is nil. If the project later adds a linter rule against `dangerouslySetInnerHTML`, refactor to `t.rich()` with React element placeholders.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-21-landing-3studio-upgrade.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
