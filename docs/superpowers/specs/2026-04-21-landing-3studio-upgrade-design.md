# 7dawn Landing 升级为 3Studio 叙事 · 设计规范

- 日期：2026-04-21
- 作者：副官（协作对象 Tristan）
- 状态：待审阅
- 前置 spec：`docs/superpowers/specs/2026-04-16-7dawn-website-design.md`（MVP 5 段首版）
- 视觉真相源：`DESIGN_XAI.md`（不动）
- 内容真相源：`docs/prototype/index.html`（此次改造的内容来源）

---

## 1. 背景与目标

### 1.1 背景

2026-04-16 上线的 7dawn 官网是一个 5 段 MVP（Hero / Product / Directions / Team / Contact）。内容以公司层叙事为主，对 3Studio 的产品细节只有一段浅描述。

与此同时，`docs/prototype/` 下已完成一份 "Nexus-style editorial" 视觉 + 3studio 完整叙事的 HTML 原型。prototype 里讲的 3studio（五个工作空间 / Harness 治理 / Core OS 架构 / Scenarios / Evolution / Market）就是 7dawn 实际在做的产品——MVP 当时只是时间不够没展开。

### 1.2 目标

把 landing 升级为"7dawn Hero + 3studio 完整产品叙事"的单页。

- **视觉**：沿用现有 xAI dark monospace 系统（`#1f2228` / 纯白 / Geist Mono / 0 圆角 / `white/10` 边框 / FogCanvas）。prototype 的暖 paper + teal 语言**不引入**
- **内容**：以 `docs/prototype/index.html` 为准（除"定价"段和所有子页链接）
- **形态**：单页 landing，无任何产品子页

### 1.3 受众

- 早期投资人（识别硬科技专业感）
- 潜在客户（轨道晨光、格斯航天、中科宇航、蓝箭等；读完能理解 3studio 是什么）
- 潜在合作方与工程师候选人

### 1.4 非目标（v1 明确不做）

- 任何 `/product/*` 子页
- 任何 workspace 子页（Design / Verify / Flow / Operate / Command 各自 subpage）
- 定价（Pricing）段
- 团队（Team）段——含清华·中科院 / 20-40 亿 / 2700+ Agent 三个数据点（MVP 已移除，不再恢复）
- prototype Nav 里的 `产品首页 →` 入口
- prototype 辅色系统（teal / rust / ochre / grass / violet）
- 3D 卫星 exploded（v2）
- 联系表单后端（沿用 mailto / tel）
- 新字体 / 新第三方依赖（Three.js / GSAP / OGL 等）
- 埋点分析

---

## 2. 整体结构

### 2.1 路由

单页：`/[locale]`（zh / en，next-intl 自动路由），不新增任何子路由。

### 2.2 Nav

顶部锚点导航四项：

| 中文  | EN         | 目标锚点       |
|-------|------------|----------------|
| 工作空间 | Workspaces | `#spaces`      |
| Harness | Harness    | `#harness`     |
| 进化   | Evolution  | `#evolution`   |
| 市场   | Market     | `#market`      |

- prototype 原 Nav 里的 `定价 / 产品首页 →` 两项已砍
- prototype 原 `工作空间` 指向 `#spaces`，本项目沿用
- brand 文案：`7dawn` + monospace 小 sup 标 `复杂工程`
- 语言切换继续用现有 `<LangSwitch>`

### 2.3 Landing 段序

```
§1  Hero                 (现有组件 <Hero>, 保留)
§2  Platform Dossier     (新增, 交互 switcher demo + 4 stats)
§3  Why Now              (新增)
§4  Problem              (新增)
§5  Spaces               (新增)        #spaces
§6  Architecture         (新增)
§7  Harness · dark       (新增)        #harness
§8  Scenarios            (新增)
§9  Evolution            (新增)        #evolution
§10 Market               (新增)        #market
§11 CTA + Contact        (新增)        #contact
Footer                   (现有组件 <Footer>, 保留)
```

---

## 3. 视觉语言映射（prototype → xAI）

Prototype 的视觉是 warm editorial dossier；本项目沿用 xAI dark brutalism。所有 prototype 元素按下表机械映射到 xAI 体系：

| prototype                       | xAI 映射                                              |
|---------------------------------|-------------------------------------------------------|
| `--paper #F2EEE6`               | `--color-bg #1f2228`                                  |
| `--ink #14110C`                 | `--color-text #ffffff`                                |
| teal `oklch(0.62 0.12 195)`     | **不引入**，全部改用 `white + opacity`                  |
| 衬线 display (Source Serif 4 / Songti) | `Geist Mono` weight 300                                |
| 衬线 italic em                  | `Geist Mono` italic + `rgba(255,255,255,0.5)`          |
| dossier 四角标记                | 省略（xAI brutalism 不需要）                           |
| chip (teal border + teal bg)    | `.chip` = `white/20` border + mono uppercase + `white/70` |
| pulse-dot (teal bloom)          | 小白方块 + `opacity` 1↔0.3 脉冲（1.8s）                |
| 圆角 3–8px                      | 一律 0 radius                                         |
| 多辅色（rust / ochre / grass / violet） | 全砍，用白色 opacity 层次替代                         |
| harness `.section.dark` (paper→ink) | 在 xAI base 上再深一档 `#141619` 作为区段反色           |

### 3.1 Opacity 分级

沿用 `DESIGN_XAI.md` / 现有 `globals.css`：

- `white` 100%：主标题、关键数字、active 状态
- `white/70`：正文、次要标签
- `white/50`：kicker / micro / 弱化内容
- `white/30`：placeholder 数字、辅助 glyph
- `white/10`：borders、dashed dividers
- `white/20`：button ghost border、chip border

### 3.2 新增视觉组件类（写入 `globals.css`）

- `.chip` / `.chip-active`
- `.btn-primary`（白底黑字）/ `.btn-ghost`（透明描边）
- `.section-dark`（`#141619` 背景 + 更深 border）
- `.sec-head`（侧栏 idx italic + 主标题 + lead 的三栏布局）
- `.kicker` / `.micro` / `.idx`（mono uppercase 三级）

---

## 4. 段落详述

每段给出：锚点 / 组件 / 内容来源 / 版式要点 / i18n key。

### §1 Hero · 保留

- 组件：现有 `components/Hero.tsx`
- 锚点：无（页顶）
- 内容：`messages.hero.*`（不动）
  - label: `// 奇点黎明 · 7dawn`
  - title1: `跨越奇点` / title2: `星海铸魂`
  - sub: `AI 原生智研 · 点亮商业航天的每一颗星`
  - cta: `联系我们` → `#contact`
  - scroll: `SCROLL`
- 视觉：FogCanvas 保留；中文 title 用 `hero-title` 大字号（clamp 48–140）；英文自动降级到 `hero-title` 的英文分支尺寸

### §2 Platform Dossier · 新增

- 组件：`components/PlatformDossier.tsx`（`"use client"`，需交互）
- 锚点：无
- 内容来源：prototype `index.html` 行 341-402 的 `hero-meta` + `hero-visual`
- 结构：
  1. 顶部一条 4 栏 stats（`5+ Workspaces / M0→M2 Memory / 99% 审计率 / 4× Industry Pack`）
  2. `ws-head`：左标题 `— 3studio Platform · Workspace Switcher —`，右 chip `LIVE · 像 Notion/Figma 那样切换`
  3. `ws-switcher`：5 个 tab（Design / Verify / Flow / Operate / Command）—— active 反白
  4. `ws-body`：根据 active tab 渲染 steps 列（5 行） + metrics 列（4 行）
  5. `ws-foot`：底部一行文字脚注（`Aerospace Pack · STK/MATLAB/Thermal Desktop/GJB` · `OrbitOps = Operate + Aerospace Pack`）
- 交互：`useState('design')`，点击 tab 切换；`prefers-reduced-motion` 时去掉 pulse-dot 动画
- i18n keys：
  - `messages.platform.stats[0..3].{num, label}`
  - `messages.platform.switcher.{title, live}`
  - `messages.platform.foot.{industry, orbitops}`
  - `messages.platform.tabs.{design, verify, flow, operate, command}.{code, name, sub}`
  - `messages.platform.bodies.{design, verify, flow, operate, command}.{title, steps[], stats[]}`
- 数据：steps / stats / titles 直接来自 prototype 行 1044-1125 的 `WS` 对象，翻译成中英两份放进 messages

### §3 Why Now · 新增

- 组件：`components/WhyNow.tsx`
- 锚点：`#why`（不在 Nav，但提供锚点便于外链）
- 内容：prototype 行 405-446
- 结构：`<SectionHeader>`（idx `Why Now` / kicker `01 / 06`）+ 3 栏 grid
  - 每栏：`wc` 标签 + arrow + h3 + bullet 列表（3 条）
- i18n keys：`messages.why.{title, lead, items[0..2].{kicker, h3, bullets[]}}`

### §4 Problem · 新增

- 组件：`components/Problem.tsx`
- 锚点：`#problem`
- 内容：prototype 行 448-468
- 结构：`<SectionHeader>`（idx `Problem` / kicker `02 / 06`）+ 3×2 grid（desktop）/ 2×3 grid（tablet）/ 1×6 grid（mobile）
  - 每格：编号 `01-06` + 分类标签 + h4 + 描述 + dash-border 量化行
- i18n keys：`messages.problem.{title, lead, items[0..5].{no, tag, h4, body, quant}}`

### §5 Spaces · 新增

- 组件：`components/Spaces.tsx`
- 锚点：`#spaces`（Nav 第一项）
- 内容：prototype 行 470-545
- 结构：
  1. `<SectionHeader>`（idx `Product` / kicker `03 / 06`）
  2. 5 卡片横排网格（desktop 5 列 / tablet 2 列 / mobile 1 列）
     - 每卡片：code (S-01..05) + numeral (i..v italic) + SVG glyph + h3 (em "Design" + 中文) + desc + tags + outline `→ 设计包: ...`
  3. Industry Pack 条（dashed border 包裹）：左 kicker + 副标题，右 4 chips（Aerospace active）
  4. OrbitOps 条（白底反色）：`OrbitOps = 运维空间 + 航天配置 — 可独立推广的旗舰品牌`
- 关键：每张卡片**不再是 `<a>` 链接**（prototype 里指向 `workspace.html`，子页已砍）；改为纯展示 `<article>`
- i18n keys：`messages.spaces.{title, lead, items[0..4].{code, numeral, nameEm, nameText, desc, tags[], outlinePrefix, outlineBold}}`, `messages.pack.*`, `messages.orbitOps.*`

### §6 Architecture · 新增

- 组件：`components/Architecture.tsx`
- 锚点：无
- 内容：prototype 行 547-590
- 结构：`<SectionHeader>`（idx `Architecture` / kicker `03b / 06`）+ 三层 grid
  - Tier A Workspaces：5 cell（Design / Verify / Flow / Operate / Command）
  - Tier B Core OS：5 cell（Multi-Agent Runtime / Harness Engine / Memory & Evolution / Adaptation Workbench / Tool Adapter SDK）—— **白底反色**（`.arch-tier.core`）
  - Tier C Industry Packs：4 cell（Aerospace / UAV / Automotive / Energy）
  - 每 cell：b (名字) + small (副描述)
- i18n keys：`messages.architecture.{title, lead, tiers[0..2].{label, name, note, cells[].{name, note}}}`

### §7 Harness · 新增（dark section）

- 组件：`components/Harness.tsx`
- 锚点：`#harness`（Nav 第二项）
- 视觉：区段级反色——`.section-dark`，背景 `#141619`
- 内容：prototype 行 592-642
- 结构：
  1. `<SectionHeader>`（idx `Harness` / kicker `04 / 06`，文字用 `white/70` 在深色底上保持可读）
  2. 2 栏 grid：左"5 原则"列表（i / ii / iii / iv / v italic + h4 + p）；右 audit log demo（mono codeblock 式，6 行伪日志）
- audit log demo 数据按 prototype 原样（`stk.propagate` / `matlab.designATC` / `design_pkg/main.docx hold` / `supplier.notify deny` / `rollback snapshot` / `thermal.run`）
- Audit log 6 行含混合中英（工具调用名保持英文标识符；中文备注 `policy: 需 L2 审批` / `reverted by: 李承泽` 在 en locale 下翻为对应英文）
- i18n keys：`messages.harness.{title, lead, principles[0..4].{n, h4, body}, demo.{head.session, head.anchored, rows[].{ix, content, sig, rc}}}`

### §8 Scenarios · 新增

- 组件：`components/Scenarios.tsx`
- 锚点：无
- 内容：prototype 行 645-706
- 结构：`<SectionHeader>`（idx `Scenarios` / kicker `04b / 06`）+ 4 卡片 grid（desktop 4 列 / tablet 2 列 / mobile 1 列）
  - 每卡片：top（SCN code + category）+ h4（em + 中文）+ flow (IN/AGT/HUM/OUT 四行) + ROI 行（big number + em → + small label）
- 4 场景：A Design 卫星姿轨控 / D Verify 热控 / G Flow 设计变更 / J OrbitOps 星座运维
- i18n keys：`messages.scenarios.{title, lead, items[0..3].{scn, cat, h4em, h4text, flow.{in, agt, hum, out}, roi.{big, small}}}`

### §9 Evolution · 新增

- 组件：`components/Evolution.tsx`
- 锚点：`#evolution`（Nav 第三项）
- 内容：prototype 行 708-794
- 结构：`<SectionHeader>`（idx `Evolution` / kicker `05 / 06`）+ 2 栏 grid
  - 左：`evo-chart` 面板（头部 "进化仪表盘 · 过去 12 个月" + "NOW 95%"；主体 SVG 曲线：3 条线——Agent 自主率（白实线带面积）、首次通过率（白 75% 实线）、人工干预（白 55% 虚线）；底部 legend 3 条）
  - 右：`evo-stats` 4 项（Agent 自主率 / 人工干预频率 / 首次通过率 / 知识库覆盖率），每项 h5 + p + 右侧 val + delta
- SVG 曲线：全部白色不同 opacity，无 teal / rust / violet
- i18n keys：`messages.evolution.{title, lead, chart.{head, now, legend[]}, stats[0..3].{h5, body, val, delta}}`

### §10 Market · 新增

- 组件：`components/Market.tsx`
- 锚点：`#market`（Nav 第四项）
- 内容：prototype 行 796-907
- 结构：
  1. `<SectionHeader>`（idx `Market` / kicker `06 / 06`）
  2. 上部：TAM 同心圆 SVG（L3 / L2 / L1 / SOM 四环，全白 opacity）+ 右侧 5 行表格（L3 / L2 / L1 / SAM / SOM），SOM 行 `s5` 背景微亮
  3. 下部：竞争矩阵 `h3` + 6 行 × 6 列表格（header: 维度 / 3studio / Epsilon3 / Synera / 通用 LLM / 自建；5 行维度：多人多 Agent / 深度工具调用 / Harness 治理 / 进化可量化 / 行业深度）
     - 图标：`●` = y（满足）；`◐` = p（部分）；`○` = p（基础）；`—` = n（无）
- i18n keys：`messages.market.{title, lead, tam.{layers[0..4].{ix, h5, body, value}}, compete.{h3, header[], rows[].{rh, cells[]}}}`

### §11 CTA + Contact · 新增（整合）

- 组件：`components/CTAContact.tsx`
- 锚点：`#contact`（Hero CTA 目标）
- 内容：prototype CTA 行 975-991 + 现有 `messages.contact.*` 邮箱电话
- 结构：
  1. 大 CTA 框（1 层 border 围框，`s3` 背景，2 栏 1.4fr+1fr）
     - 左：kicker `— Start your first workspace —` + h1 `从最难的 <em>一颗卫星</em> 开始。` + lead（`Cursor 做了软件工程的 AI 原生平台。3studio 要做硬件 / 系统工程的。`）
     - 右：单按钮 `预约企业版演示 →`，`href="mailto:contact@7dawn.ai?subject=预约企业版演示"`，白底反色 `btn-primary`
  2. 下方 2 栏 contact 信息（保留现状）：EMAIL / PHONE 各一块
- prototype 原 CTA 里 `进入工作台 →` 和 `查看 Design 空间演示` 两个按钮**已砍**（指向的子页不存在）
- i18n keys：`messages.cta.{kicker, titleBefore, titleEm, titleAfter, lead, button}` + 复用 `messages.contact.{email, phone}`

### Footer · 保留

- 组件：现有 `components/Footer.tsx`
- 内容：`© 2026 7DAWN · 奇点黎明` / `BEIJING · 北京`
- 不添加 prototype 那套 4 列 heavy footer

---

## 5. i18n 策略

### 5.1 中文（zh.json）

全部新增 key 以 prototype 中文原文为准，必要时做语义微调（`3studio` 一律写作 `3Studio`，与 7dawn 品牌体例一致）。

### 5.2 英文（en.json）

AI 起草初稿，Tristan 后续审校。航天 / AI / 工程术语译法按下表统一：

| 中文 | English |
|------|---------|
| 工作空间 | Workspace |
| 设计空间 | Design Space |
| 验证空间 | Verify Space |
| 流程空间 | Flow Space |
| 运维空间 | Operate Space |
| 指挥空间 | Command Space |
| 行业包 | Industry Pack |
| 可审计 | Auditable |
| 可回滚 | Rollback-safe |
| 一次通过率 | First-pass rate |
| 自主完成率 | Autonomous rate |
| 人机共进化 | Human-AI co-evolution |

### 5.3 验收

- `tests/i18n.test.ts` 通过（所有新 key 在 zh/en 都存在且非空）
- `pnpm build` 通过

---

## 6. 技术实现

### 6.1 组件增删

**保留**：`Nav.tsx` / `Hero.tsx` / `FogCanvas.tsx` / `LangSwitch.tsx` / `ScrollReveal.tsx` / `Footer.tsx`

**删除**：`Product.tsx` / `Directions.tsx` / `Team.tsx` / `Contact.tsx`

**新增**：`PlatformDossier.tsx`（"use client"）/ `WhyNow.tsx` / `Problem.tsx` / `Spaces.tsx` / `Architecture.tsx` / `Harness.tsx` / `Scenarios.tsx` / `Evolution.tsx` / `Market.tsx` / `CTAContact.tsx`

新增一个共用 `<SectionHeader>` 组件，封装 `idx + kicker + h2 + lead` 三栏布局（减少重复）。组件接收 `idx` / `kicker` / `title` / `lead` 四个字符串 props（父组件调用 `t()` 后传入，避免每个 section 的 i18n key 结构被锁死）；`title` 支持 ReactNode 以容纳 `<em>` 斜体分段。

### 6.2 `page.tsx`

```tsx
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
```

### 6.3 `Nav.tsx` 改动

- `<ul>` 4 个 `<li><a>`：`#spaces` / `#harness` / `#evolution` / `#market`
- `t("product" | "directions" | "team" | "contact")` → `t("spaces" | "harness" | "evolution" | "market")`
- `messages.nav.*` 对应更新

### 6.4 `globals.css` 扩展

在现有 xAI token 之上补这些：

- `--color-bg-dark: #141619;`（Harness 段）
- `--surface-5: rgba(255,255,255,0.05);`（Spaces hover 等）
- 类：`.chip` / `.chip-active` / `.btn` / `.btn-primary` / `.btn-ghost` / `.btn-sm`
- 类：`.section-dark`（background + 边框颜色重置）
- 类：`.sec-head`（响应式 grid 180px/1fr → 1fr）

保留现有：`.hero-title` / `.tag` / `.product-mock`（虽然不再使用 `.product-mock`，但保留避免现有组件破坏；未来真没用可清理）

### 6.5 交互与动画

- `PlatformDossier`：`useState`、map render、`prefers-reduced-motion` 时关闭 pulse-dot
- 其它 section：SSR + `<ScrollReveal>` 包裹（enter 渐入）
- Hover：保留 xAI 的"变暗 hover"（opacity 0.5 或 0.82）
- 不引入 GSAP / Three.js / framer-motion

### 6.6 响应式断点

沿用现有：`640 / 720 / 820 / 920 / 960 / 1100 / 1200`（section 各自选取合适档位）

### 6.7 SEO / 元数据

- `messages.meta.title` 更新：`7dawn · 3Studio — 面向复杂工程行业的 AI 原生平台`
- `messages.meta.description` 更新：`3Studio 由五个工作空间组成，让工程专家带着 Agent 团队工作。在 Harness 治理下，把组织隐性知识内化为可量化的工程智能资产。`
- `app/sitemap.ts` / `app/robots.ts`：无需改动（仍只一页）

---

## 7. 验收标准

- 所有 11 段在 desktop（≥1200）/ tablet（720–1200）/ mobile（<720）三档断点布局正常，无横向滚动
- Nav 4 个锚点点击 smooth scroll 到目标段
- `PlatformDossier` 的 switcher 点击 5 个 tab 能切换 body 内容（steps + stats）
- `zh ↔ en` 语言切换后所有内容同步
- `prefers-reduced-motion: reduce` 时：FogCanvas 动画停止、ScrollReveal transition 关闭、pulse-dot 不动
- `pnpm test` 通过（i18n 完整性）
- `pnpm build` 通过
- Lighthouse：Performance ≥ 90、Accessibility ≥ 95、SEO ≥ 95、Best Practices ≥ 95

---

## 8. 风险

- **信息密度与视觉克制的矛盾**：prototype 内容原本靠多辅色（teal 做焦点、rust 做警示、ochre 做量化）做层次；xAI 纯白 opacity 可能显得单调。缓解：靠版式粗细对比（h1 300 weight / kicker 400 mono / tag border）+ `em italic` + 深色反色段（Harness）拉节奏。若验证后发现疲劳，预留 option：引入极克制的蓝色 focus/accent（不在本次范围）
- **英文译稿质量**：航天 + 工程术语译法易偏，AI 初稿交付时需 Tristan 审一轮
- **workspace switcher demo 的数据真实性**：投资人可能追问 "这是 real data 吗"。缓解：`ws-head` 右侧 chip 写 `LIVE · Demo`（已在 prototype 里有 `LIVE` 字样；落地时副官 + Tristan 再看是否加 `Example` 后缀）
- **单页长度**：11 段 + footer，首屏到底约 15 屏。Nav 四锚点让跳转不痛，但移动端体验要盯紧
- **Harness 段反色**：区段 `#141619` 与 base `#1f2228` 对比度较弱，移动端不明显可能导致节奏丢失。缓解：额外给 Harness 段顶 / 底做 1px `white/20` 边框强化过渡

---

## 9. 开发顺序建议

1. `globals.css` 扩展 + `<SectionHeader>` 抽象
2. `Nav.tsx` 更新 + `messages.nav.*`
3. 中段依次：`WhyNow` → `Problem` → `Spaces` → `Architecture` → `Harness` → `Scenarios` → `Evolution` → `Market` → `CTAContact`（每段连同 messages.zh + messages.en 一起提交）
4. `PlatformDossier`（client component，放到最后做，交互和数据最多）
5. `page.tsx` 串起来，删除 `Product / Directions / Team / Contact` 4 个组件
6. `messages.meta.*` 更新
7. `pnpm test` + `pnpm build` + 人工在浏览器过一遍
8. 准备 PR

每一段组件完成后 `pnpm test` 一次，确保 i18n 字典完整性不破。

---

## 10. 文件与组件清单

### 新增
- `components/SectionHeader.tsx`
- `components/PlatformDossier.tsx`
- `components/WhyNow.tsx`
- `components/Problem.tsx`
- `components/Spaces.tsx`
- `components/Architecture.tsx`
- `components/Harness.tsx`
- `components/Scenarios.tsx`
- `components/Evolution.tsx`
- `components/Market.tsx`
- `components/CTAContact.tsx`

### 删除
- `components/Product.tsx`
- `components/Directions.tsx`
- `components/Team.tsx`
- `components/Contact.tsx`

### 修改
- `app/[locale]/page.tsx`（组件装配变更）
- `components/Nav.tsx`（4 锚点更名）
- `app/globals.css`（新增 `--color-bg-dark` / `--surface-5` / `.chip / .btn / .section-dark / .sec-head` 类）
- `messages/zh.json`（大幅扩充）
- `messages/en.json`（大幅扩充，AI 初稿）

### 不动
- `components/Hero.tsx` / `FogCanvas.tsx` / `LangSwitch.tsx` / `ScrollReveal.tsx` / `Footer.tsx`
- `app/[locale]/layout.tsx`
- `app/sitemap.ts` / `app/robots.ts`
- `i18n/*`
- `middleware.ts`
- `package.json`（无新依赖）
