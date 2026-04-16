# 7dawn 官网设计笔记

## 品牌

- **公司名**：奇点黎明
- **英文名**：7dawn
- **Logo**：`7dawn.svg` / `7dawn.png`（几何锐利字母 + 月食/破晓意象，纯白）
- **产品**：3Studio（航天器设计 AI 工具）

## 美学方向：xAI 式 Monospace Brutalist Minimalism

**定调文档**：`DESIGN_XAI.md`（完整设计系统）

### 核心原则
- 深色底 `#1f2228`（不是纯黑），纯白 `#ffffff` 文字
- **GeistMono 做 display + 按钮**（monospace 即品牌）
- **universalSans 做正文**（干净几何）
- 零装饰：无阴影、无渐变、无彩色点缀
- 锐利直角（0px radius 为默认）
- 巨量留白，单调白黑色阶
- Hover 变暗（opacity 降到 0.5）而非变亮

### 与 Logo 的一致性
7dawn logo 本身就是这个语言——几何、锐利、单色、技术感，不需要适配。

---

## 核心创意（基于 xAI 基调重新评估）

### ✅ 1. Hero 鼠标交互光效（类 Grok）
- 深黑底上的白雾跟随鼠标
- **与 xAI 一致**（Grok 本身就这么做）
- WebGL/Canvas 实现
- **保留**

### ✅ 2. 卫星/火箭 Exploded → 滚动组装（Three.js）
- **关键调整**：模型做成**白色线框（wireframe）或单色金属** 风格，不用写实贴图
- 匹配 xAI 单色美学
- 滚动零件从散开状态组装
- **保留，但视觉调整为单色工程风**

### ❌ 3. 蓝图背景线稿（苏联火箭图）
- **砍掉** — 保持 xAI 零装饰纯粹性
- 靠 monospace + 留白 + 3D 零件撑场面

### ✅ 4. 产品截图透视展示（类 Jamie AI）
- 3Studio 截图用 CSS perspective tilt 展示
- **调整**：边框锐利（0 radius），无阴影，白色 10% 透明度边框
- **保留**

---

## 页面结构（初版）

1. **Hero**
   - 背景：`#1f2228` + 鼠标交互光雾
   - 主标：GeistMono 超大（200-320px），标语分两行
   - 副标：universalSans 16-20px，白色 70%
   - CTA：两个按钮（白底黑字 primary + 透明描边 ghost）
   - 右上角 7dawn logo

2. **核心产品区：3Studio**
   - Monospace 章节标题
   - 产品截图 perspective tilt 展示
   - 功能点用 monospace tag 列举

3. **技术/方向区：卫星 Exploded 滚动组装**
   - 全屏沉浸式 3D
   - 滚动零件合拢
   - 配合文字逐段揭示（三大方向叙事）

4. **团队/背书**
   - 清华 + 中科院背景
   - 隐性顾问（可后续加）

5. **Footer + CTA**
   - 预约演示
   - 联系方式

---

## 字体

- **Display/按钮**：GeistMono（Vercel 字体，免费）
- **正文**：universalSans（xAI 自用） → 替代方案 **Geist Sans**（同家族，同样免费）
- 中文正文需搭配一款 CJK 字体：候选 **Noto Sans SC** 或 **HarmonyOS Sans SC**

## 配色

完全沿用 xAI 设计系统（`DESIGN_XAI.md`）：
- 背景 `#1f2228`
- 文字白 `#ffffff` / 70% / 50% / 30%
- 边框白 10% / 20%
- Focus 环 `rgb(59, 130, 246) / 0.5`
- **不引入任何品牌色**，维持单色

## 技术栈

- Next.js 15 + Tailwind CSS v4
- Three.js + GSAP ScrollTrigger（3D 爆炸组装）
- WebGL/Canvas（鼠标光雾）
- Geist 字体族（`@vercel/font` 或 Google Fonts）

---

## 内容叙事（来自 0411 会议纪要）

公司三大方向：
1. **3Studio** — 航天器设计 AI 工具（主赛道，含数字孪生）
2. **星座运维** — 第二曲线
3. **工程协作平台** — 远景

关键叙事素材：
- 对标 Blue Origin 2700+ AI Agent
- 中国航天器设计市场 20-40 亿/年
- 清华 + 中科院团队背景
- 目标客户：轨道晨光、格斯航天、中科宇航等
- 融资窗口：6 月 SpaceX IPO 前

---

## 决定

- [x] 蓝图背景：**砍掉**
- [x] 语言：**中英双语 + 切换器**
- [x] 范围：**最小可用版（MVP）先上线**
- [x] 主标语：
  - 主：`跨越奇点，星海铸魂` / `Beyond Singularity · Awaken the Stars`
  - 副：`AI 原生智研 · 点亮商业航天的每一颗星` / `AI-native engineering · Lighting every star of New Space`
- [x] 顶部导航：`[logo]   产品  方向  团队  联系        [中/EN]` — 无 CTA 按钮
- [x] 联系方式独立成章节
- [x] Hero CTA：**单按钮「联系我们」**，指向 #contact
- [x] 联系区：**极简展示型** — 邮箱 / 微信二维码 / 地点，无表单
- [x] 域名：**7dawn.ai**（已注册）
- [x] 部署：**Vercel**
- [x] 文案生产：AI 先起草，Tristan 迭代
- [ ] 3D 模型来源（MVP 阶段可延后）
- [ ] 3Studio 产品截图（Tristan 提供）
- [ ] 中文字体选择
- [ ] 域名/部署方案

---

## MVP 范围

**目标**：3-5 天可上线，给投资人/客户看有"这家公司真实存在"的第一印象

### 必做
1. **Hero 区**
   - 鼠标交互光雾背景
   - 主标语（中英双语切换）
   - 两个 CTA：预约演示 + 了解更多
   - 顶部 nav：logo + 语言切换 + CTA

2. **产品简介（3Studio）**
   - Monospace 章节标题
   - 产品截图 perspective tilt（截图到位后）
   - 2-3 句话核心价值
   - 3 个功能点用 monospace tag

3. **三大方向叙事**
   - 纯排版，大 monospace 数字 + 简短描述
   - 航天器设计 / 星座运维 / 工程协作平台

4. **团队背景**
   - 一行话：清华 + 中科院 背景
   - 避免夸大（融资阶段尚早）

5. **Footer / 联系**
   - 邮箱 / 微信二维码（待 Tristan 提供）
   - 预约演示表单（或直接 mailto）

### 暂不做（留给 v2）
- 3D 卫星 exploded 滚动组装（需要模型资产）
- 独立产品详情页
- 博客 / 资讯
- 客户案例（等真实背书到位再上）

---

## 实施计划

### Step 1：搭骨架（半天）
- `pnpm create next-app@latest` + Tailwind v4
- 装 Geist 字体
- 配色变量（直接用 `DESIGN_XAI.md` 的 token）
- i18n：next-intl 或轻量方案

### Step 2：Hero + Nav（1 天）
- WebGL 鼠标光雾（用现成库 OGL 或自己写 shader）
- 排版：GeistMono 超大主标 + universalSans 副标
- 两个按钮（xAI 规范）
- 语言切换器

### Step 3：主要内容区（1 天）
- 产品简介块
- 三大方向块
- 团队背景一句话
- Footer

### Step 4：打磨 + 上线（半天-1 天）
- 响应式（xAI 断点）
- prefers-reduced-motion
- 部署（Vercel 最快）
