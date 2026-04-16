# 7dawn 官网 MVP 设计规范

- 日期：2026-04-16
- 作者：副官（协作对象 Tristan）
- 状态：待审阅
- 视觉风格真相源：`DESIGN_XAI.md`
- 视觉 demo：`demo/index.html`（已验证）

---

## 1. 背景与目标

### 1.1 背景

奇点黎明（7dawn）是一家 AI+商业航天创业公司，核心产品 3Studio 是航天器设计 AI 工具。公司处于融资窗口（2026 年 6 月 SpaceX IPO 前），需要一个专业官网，面向三类受众同时传达可信度：

- 早期投资人（中金、经纬、源码、红杉、水木等）
- 潜在客户（轨道晨光、格斯航天、中科宇航、蓝箭等）
- 潜在合作方与雇员

### 1.2 目标

- **可信感**：视觉语言必须呈现"做硬科技的团队"气质，不允许小作坊感
- **最小可用**：3–4 天可上线，供融资接触和客户约见时引用
- **可迭代**：后续增加独立产品页、博客、客户案例时不重构

### 1.3 非目标（v1 明确不做）

- 3D 卫星/火箭 exploded 滚动组装（需要模型资产，留到 v2）
- 独立的 3Studio 产品详情页
- 博客 / 新闻 / 案例列表
- 联系表单（无后端，用 mailto/tel 兜底）
- 埋点和分析（等 v2 决定 Plausible/GA）

---

## 2. 品牌

- **中文名**：奇点黎明
- **英文名**：7dawn
- **Logo**：`7dawn-mark.svg`（已处理，字母为单路径 + `fill-rule="evenodd"`，`fill: currentColor` 支持主题色）
- **核心产品**：3Studio

### 主标语

- 中：`跨越奇点` / `星海铸魂`（两行）
- EN：`Beyond Singularity` / `Awaken the Stars`（无句号，无逗号）

### 副标语

- 中：`AI 原生智研 · 点亮商业航天的每一颗星`
- EN：`AI-native engineering · Lighting every star of New Space`

---

## 3. 视觉设计

### 3.1 设计系统

**全部视觉 token、字体、间距、hover 规则、禁止清单遵循 `DESIGN_XAI.md`**，不在本文档重复。

本项目对 xAI 规范的适配：

| 项 | xAI 标准 | 7dawn 应用 |
|---|---|---|
| 背景 | `#1f2228` | 照用 |
| 文字 | `#ffffff` + opacity 阶 | 照用 |
| Hero 主标尺寸 | 320px GeistMono weight 300 | 中文桌面 120–140px / 英文 72–84px |
| 按钮 | GeistMono 大写 1.4px 字距 | 照用 |
| 圆角 | 0 | 照用 |
| 边框 | white 10% / 20% | 照用 |
| 阴影 | 禁止 | 照用 |
| hover | 变暗到 50% | 照用 |

### 3.2 字体

- **Display / 按钮 / 数字**：Geist Mono（Google Fonts）
- **正文 / 标签 / 文本型数据**：Geist Sans + Noto Sans SC（CJK 回退）

### 3.3 禁止项（来自 xAI 规范）

- ❌ 纯黑 `#000`
- ❌ 渐变（含光雾之外的一切 gradient）
- ❌ 彩色点缀（除 focus ring 蓝）
- ❌ 圆角 ≥ 8px
- ❌ 字重 ≥ 600 做标题
- ❌ Box-shadow
- ❌ Inter / Roboto / 系统无衬线字体

---

## 4. 信息架构

单页面 + 锚点跳转 + 双语路由。

```
/zh (默认)                /en
  ├─ #product            ├─ #product
  ├─ #directions         ├─ #directions
  ├─ #team               ├─ #team
  └─ #contact            └─ #contact
```

### 顶部导航（粘性）

- 左：7dawn logo（点击回页面顶部）
- 中：`产品` · `方向` · `团队` · `联系`（锚点跳转）
- 右：`中 / EN` 切换器（无 CTA 按钮）
- 背景：`rgba(31,34,40,0.75)` + `backdrop-filter: blur(12px)`
- 底边：`1px solid rgba(255,255,255,0.1)`

---

## 5. 区块规范

### 5.1 Hero (`/` 首屏)

- 高度：`min-height: 100vh`
- 居中布局
- 背景：深色 + WebGL 鼠标交互光雾（见 §6.2）
- 结构：
  - 小标签：`// 奇点黎明 · 7dawn`（mono 12px，字距 2px，大写，70% 白）
  - 主标：两行 mono 超大号（第二行 50% 白作对比）
  - 副标：sans 18–20px，70% 白，max-width 640px
  - 单 CTA：`联系我们 →` 指向 `#contact`，mono 大写 14px 字距 1.4px，primary 白底黑字
  - 底部 `SCROLL` 提示（动画线条，32px 高，1.2s 后淡入，2s 循环）
- 加载动画：staggered reveal，延迟 0.2 / 0.4 / 0.6 / 0.8s 依次淡入

### 5.2 产品区 (`#product`)

- 内容主题：3Studio 产品简介
- 布局：桌面两列，`1fr 1fr`，gap 96px；移动堆叠
- 左列：
  - 小标签 `// 核心产品`
  - H2 `3Studio`（mono 36–64px weight 300）
  - Lede（sans 16–18px，70% 白）
  - Body（sans，第二段）
  - 3 个 tag：`AI AGENT 协同` / `数字孪生` / `工程级输出`（mono 12px 大写 1px 字距，边框 20%）
- 右列：产品 mock
  - `aspect-ratio: 16 / 10`
  - 背景 `surface-3`，边框 `border-10`
  - `transform: perspective(1200px) rotateX(4deg) rotateY(-6deg)`
  - Hover 收平到 `rotateX(2deg) rotateY(-3deg)`，过渡 0.6s
  - 内部：左上角 "3Studio · UI" 小 mono 标签，中间几条 `border-10` 线模拟 UI
- **v1 用占位 mock；后续截图就位后替换为真实图**

### 5.3 方向区 (`#directions`)

- 主题：三条曲线，一个奇点
- 结构：
  - 小标签 `// 战略方向`
  - H2 双行 `三条曲线, / 一个奇点。`（第二行 50% 白）
  - Lede
  - 3 列 directions：`01` / `02` / `03`（大号 mono 96px，30% 白），每列有 title + desc
- 布局：桌面 3 列，移动单列堆叠
- 每个方向有 1px 顶边框（`border-20`）做分隔

### 5.4 团队区 (`#team`)

- 主题：清华 · 中科院背景 + 市场数据 + 对标
- 结构：
  - 小标签 `// 团队`
  - H2 双行 `一支懂航天、/ 更懂 AI 的团队。`（第二行 50% 白）
  - Lede
  - 3 列 stats：
    1. `清华 · 中科院`（**sans 24–32px**，因为是文字不是数字）
    2. `20–40 亿￥/年`（mono 32–44px，单位用 55% 尺寸 50% 白）/ EN: `¥2–4B / YR`
    3. `2700+`（mono 32–44px，对标 Blue Origin）
- 注意：团队措辞保守，不出现"顶级"/"最强"等空话，也不提具体姓名

### 5.5 联系区 (`#contact`)

- 结构：
  - 小标签 `// 联系`
  - H2 `欢迎和我们聊聊。`
  - Lede
  - 2 列（非 3 列）：`EMAIL` / `PHONE`
    - EMAIL: `hello@7dawn.ai` → `mailto:`
    - PHONE: 占位 `+86 000 0000 0000` → `tel:`（**Tristan 后补真实号码**）
- 移除：地点、微信 QR
- 布局：桌面 2 列，max-width 720px 左对齐（不撑满屏）

### 5.6 Footer

- 左：`© 2026 7DAWN · 奇点黎明`（mono 12px 30% 白，1px 字距）
- 右：`BEIJING · 北京`（EN 版只 `BEIJING`）
- 顶边框 `border-10`

---

## 6. 技术架构

### 6.1 技术栈

| 模块 | 选择 | 理由 |
|---|---|---|
| 框架 | **Next.js 15（App Router）+ TypeScript** | 官方推荐；SSG+ISR 适合官网；Vercel 原生 |
| 样式 | **Tailwind CSS v4** | 最新版本；xAI token 用 CSS variables 贴合 |
| 字体 | **Geist Mono / Geist Sans / Noto Sans SC** via `next/font` | 零配置优化；免费；CJK 覆盖 |
| i18n | **next-intl** | App Router 官方推荐；路由级分语言（/zh, /en）；SEO 友好 |
| 3D / WebGL | **原生 WebGL** (Hero 光雾) | 不依赖 Three.js（体积 150KB 太重）；demo 中的 shader 可直接移植 |
| 滚动动画 | **IntersectionObserver** + CSS transition | 零依赖；v2 需要复杂时机时再引入 GSAP |
| 部署 | **Vercel** | Next.js 最佳适配；CDN；免费层够 MVP |
| 域名 | **7dawn.ai** | 已注册 |

### 6.2 Hero 光雾实现

- 位置：`<canvas id="fog-canvas">` 绝对定位铺满 hero section
- 原理：
  - 全屏三角形 vertex shader
  - Fragment shader 渲染鼠标位置附近的光晕 + 3 层拖尾 + 动画 fbm 噪声
  - 光晕半径小、强度低、明显延迟（主体 2.5% / trail 5% 4% 3% 依次延迟）
  - `#1f2228` 背景上 mix 白光
- 可访问性：
  - `prefers-reduced-motion: reduce` 时停止动画循环
  - WebGL 不可用时 canvas `display: none`，不影响 Hero 文字显示
- **shader 源码**：参考 `demo/index.html` Lines 320–420，可直接复用

### 6.3 i18n 策略

- 路由：`/zh/*` 与 `/en/*`，中文为默认
- 静态消息字典：`messages/zh.json` `messages/en.json`
- 所有用户可见文案通过字典键引用，**无硬编码**
- 语言切换：persistence 用 URL（无 cookie），SEO 和分享友好
- HTML `lang` 属性随路由动态更新
- 英文版 Hero 主标专用 CSS class（`.en`）调小字号

### 6.4 响应式

沿用 xAI 断点：2000 / 1536 / 1280 / 1024 / 1000 / 768 / 640

关键表现：

- 桌面 ≥ 1024：两列或三列布局
- 平板 768–1024：两列或单列
- 手机 < 768：全部堆叠，nav 中间链接隐藏（未做汉堡菜单 — v2）
- Hero 主标 clamp 自适应，移动端最小 48px

### 6.5 可访问性

- 语义化标签：`<nav>` `<section>` `<h1>/h2>` `<a>` 等
- Focus ring：`rgb(59, 130, 246) / 0.5`
- 链接 hover 变暗（xAI 约定）
- WebGL 光雾尊重 `prefers-reduced-motion`
- 所有图形用 alt / aria-label
- 中英双语用 `hreflang` 告诉搜索引擎

### 6.6 SEO 与元信息

- `<title>`：中 `7dawn · 奇点黎明 — AI 原生航天器设计` / EN `7dawn — AI-native spacecraft design`
- `<meta description>`：副标语
- Open Graph / Twitter Card：主标 + logo
- `robots.txt` 允许全站
- `sitemap.xml` 两个语言分别列出
- 结构化数据：`Organization` schema

### 6.7 文件结构

```
sin7y/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx          # 单页面 MVP
│   │   └── layout.tsx        # locale-aware layout
│   ├── layout.tsx            # 根 layout
│   └── globals.css           # Tailwind + xAI tokens
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx              # 含 FogCanvas
│   ├── FogCanvas.tsx         # WebGL 光雾组件
│   ├── Product.tsx
│   ├── Directions.tsx
│   ├── Team.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── LangSwitch.tsx
├── messages/
│   ├── zh.json
│   └── en.json
├── public/
│   ├── 7dawn-mark.svg
│   └── 3studio-ui.png        # 真实产品截图（后补）
├── DESIGN_XAI.md
├── DESIGN_NOTES.md
└── docs/superpowers/specs/2026-04-16-7dawn-website-design.md
```

---

## 7. 内容策略

### 7.1 文案生产方式

- 中文版：Claude 起草（依据 0411 会议纪要），Tristan 审改
- 英文版：Claude 直接写英文原生表达（非机译），Tristan 审改
- 口吻：克制、专业、不空话；避免"领先" "最强" "顶级"

### 7.2 v1 文案锁定（见本 spec §2 / §5.x）

v1 上线后可在内容层迭代，不影响视觉和技术架构。

---

## 8. 验收标准

### 功能

- [ ] 中英切换正常，不刷页（SPA-like 体验）
- [ ] 所有锚点跳转平滑
- [ ] 鼠标光雾在 Hero 内跟随，离开 Hero 不再响应
- [ ] 滚动触发 reveal 动画
- [ ] mailto / tel 链接可用
- [ ] 移动端可滚动浏览，文字不溢出

### 视觉

- [ ] 全站与 `DESIGN_XAI.md` 规范一致
- [ ] Logo 在 nav 中清晰可见（字母 "d" "a" 空心正确）
- [ ] Hero 主标中英文均不撑爆布局
- [ ] 无任何 AI slop 元素（紫渐变、Inter 字体、圆角卡片、阴影）

### 性能

- [ ] Lighthouse Performance ≥ 90（桌面）
- [ ] LCP < 2.5s
- [ ] WebGL 在低端设备 fallback 静态深色

### 部署

- [ ] Vercel 生产部署
- [ ] `7dawn.ai` DNS 指向
- [ ] HTTPS

---

## 9. 后续（v2 候选）

- 3D 卫星/火箭 exploded 滚动组装（Three.js + GSAP ScrollTrigger）
- 独立 `/product/3studio` 详情页
- 博客 / 新闻区
- 客户案例和背书
- Plausible / GA 分析
- 表单（需要后端或 SaaS 如 Formspree）

---

## 10. 开放问题

- [ ] 电话号码（Tristan 后补）
- [ ] 3Studio 真实产品截图（Tristan 后补）
- [ ] `hello@7dawn.ai` 邮箱是否已开通？若未开通 v1 上线前必须设置
- [ ] 团队背书人选是否要公开（纪要里提到"隐性顾问"模式，默认不列名）
