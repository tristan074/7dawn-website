# 7dawn · 奇点黎明 官网

AI + 商业航天创业公司 7dawn 的官方网站。单页面双语设计。

线上地址：https://7dawn.ai

## 技术栈

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- next-intl（中英双语路由）
- Geist Mono / Geist Sans / Noto Sans SC（next/font 自托管）
- 原生 WebGL（Hero 鼠标光雾效果）
- IntersectionObserver（滚动渐入动画）

## 视觉规范

- xAI 式 monospace brutalist minimalism
- 设计真相源：[`DESIGN_XAI.md`](./DESIGN_XAI.md)

## 开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000

> Tip：Next.js 15.5 的 turbopack 编译 Noto Sans SC 有 bug，本项目 `dev` 和 `build` 均使用 webpack。

## 测试

```bash
pnpm test    # 跑 i18n 字典完整性测试（vitest）
```

## 部署

推送到 main 分支，Vercel 自动构建并部署到 https://7dawn.ai。

## 文档

| 文档 | 内容 |
|---|---|
| [`DESIGN_XAI.md`](./DESIGN_XAI.md) | 视觉系统（颜色、字体、间距、组件） |
| [`DESIGN_NOTES.md`](./DESIGN_NOTES.md) | 设计决策与参考 |
| [`docs/superpowers/specs/2026-04-16-7dawn-website-design.md`](./docs/superpowers/specs/2026-04-16-7dawn-website-design.md) | MVP 设计规范（首版 5 段） |
| [`docs/superpowers/specs/2026-04-21-landing-3studio-upgrade-design.md`](./docs/superpowers/specs/2026-04-21-landing-3studio-upgrade-design.md) | 3Studio landing 升级设计规范 |
| [`docs/superpowers/plans/2026-04-16-7dawn-website.md`](./docs/superpowers/plans/2026-04-16-7dawn-website.md) | MVP 实施计划 |
| [`docs/superpowers/plans/2026-04-21-landing-3studio-upgrade.md`](./docs/superpowers/plans/2026-04-21-landing-3studio-upgrade.md) | 3Studio landing 实施计划 |
| `demo/index.html` | 视觉验证用的原始 demo（不在生产部署） |

## 文件结构

```
app/
  [locale]/
    layout.tsx       # locale-aware：html lang、字体、metadata、i18n provider
    page.tsx         # 单页面 MVP
  layout.tsx         # 根 layout 透传
  globals.css        # Tailwind + xAI tokens
  robots.ts
  sitemap.ts
components/
  Nav.tsx              # 顶部导航 + inline logo SVG
  LangSwitch.tsx       # 中/EN 切换
  Hero.tsx             # 主视觉
  FogCanvas.tsx        # WebGL 鼠标光雾
  SectionHeader.tsx    # 通用段落头（idx / kicker / h2 / lead）
  PlatformDossier.tsx  # 4 stats + 5-tab workspace switcher（唯一 client 组件）
  WhyNow.tsx           # Why Now · 三股力量
  Problem.tsx          # 六格痛点
  Spaces.tsx           # 五工作空间 + Industry Pack + OrbitOps
  Architecture.tsx     # Pack / Core / Industry Packs 三层
  Harness.tsx          # Harness 治理 + audit log（dark section）
  Scenarios.tsx        # 四场景 · IN/AGT/HUM/OUT + ROI
  Evolution.tsx        # 进化曲线 + 4 指标
  Market.tsx           # TAM 同心圆 + 分层表 + 竞争矩阵
  CTAContact.tsx       # CTA 框 + email/phone
  Footer.tsx
  ScrollReveal.tsx     # 通用滚动渐入包装
i18n/
  routing.ts         # locale 配置
  request.ts         # 服务端字典加载
messages/
  zh.json
  en.json
middleware.ts        # next-intl 自动语言路由
public/
  7dawn-mark.svg     # logo（fill-rule="evenodd"，d/a 中空）
tests/
  i18n.test.ts       # 字典完整性 + 非空断言
```

## v2 路线

- 卫星 / 火箭 3D Exploded → 滚动组装（Three.js + GSAP ScrollTrigger）
- 独立 `/product/3studio` 详情页
- 客户案例 + 投资人背书
- 博客 / 新闻
- Plausible / GA 分析
