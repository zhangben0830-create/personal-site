# personal-site 重建实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `d:\Trae空间\projects\personal-site` 的虚构占位个人站整体替换为张犇的真实求职作品集（数据驱动：内容全部收敛到 `data.js`）。

**Architecture:** 保留现有 v0 深色科技风框架（style.css 主题体系 + 粒子背景 + 交互逻辑），删除博客板块与假表单，新增 `data.js` 数据层；`script.js` 重构为「渲染层（读 SITE_DATA 生成 DOM）+ 交互层（保留原有动效）」两部分。

**Tech Stack:** 纯静态 HTML/CSS/JS（零构建、零新依赖），Git 做版本保护，本地 `python -m http.server` 预览，Playwright（webapp-testing 技能）做浏览器验收。

**设计文档:** `docs/superpowers/specs/2026-10-09-personal-site-rebuild-design.md`（内容文案的唯一权威来源，本计划中的代码均与其 §3/§4 一致）

**基线:** git 仓库已初始化，基线 commit `78199a2`（含设计文档）。简历 PDF 源文件位于 `c:\Users\41573\.trae-cn\attachments\6ac772528b812909ac63c88b\2f1d3287-d05c-4f75-b873-50938525cd8e_9cd5502b-0885-4d91-a62a-958fe7cb9015_张犇-高级产品经理-简历.pdf`

**工作目录:** 所有命令均在 `d:\Trae空间\projects\personal-site` 下执行（PowerShell）。

---

### Task 1: 简历资产落位

**Files:**
- Create: `assets/resume.pdf`（从附件目录复制，不改动源文件）

- [ ] **Step 1: 创建 assets 目录并复制简历**

```powershell
New-Item -ItemType Directory -Force -Path 'd:\Trae空间\projects\personal-site\assets' | Out-Null
Copy-Item 'c:\Users\41573\.trae-cn\attachments\6ac772528b812909ac63c88b\2f1d3287-d05c-4f75-b873-50938525cd8e_9cd5502b-0885-4d91-a62a-958fe7cb9015_张犇-高级产品经理-简历.pdf' 'd:\Trae空间\projects\personal-site\assets\resume.pdf'
```

- [ ] **Step 2: 验证文件存在且非空**

Run: `Get-Item 'd:\Trae空间\projects\personal-site\assets\resume.pdf' | Select-Object Name, Length`
Expected: `resume.pdf`，Length 约 100KB+（非 0）

- [ ] **Step 3: 提交**

```powershell
git add assets/resume.pdf
git commit -m "feat: 简历PDF资产落位（assets/resume.pdf）"
```

---

### Task 2: data.js 数据层

**Files:**
- Create: `data.js`（全站唯一内容源）
- Modify: `index.html`（`</body>` 前加 `<script src="data.js"></script>`）

- [ ] **Step 1: 创建 data.js（完整内容如下，逐字使用）**

```js
/* ============================================================
   个人站数据层 —— 全站唯一内容源
   改内容只动这个文件：项目 / 时间轴 / 技能 / 联系方式
   内容口径：简历级聚合数据，不含具体客户名称与内部文档
   ============================================================ */

const SITE_DATA = {

  profile: {
    name: '张犇',
    title: '高级产品经理',
    kicker: '高级产品经理 · 14年经验',
    intro: '14 年产品生涯，从金融业务一线走到数据风控，再到 B端SaaS 平台操盘。擅长把复杂业务抽象成简单产品——把 100+ 家金融机构的清收难题，做成了细分市场占有率第一的平台。',
    motto: '先懂业务，再做产品',
    email: '415730168@qq.com',
    location: '杭州',
    resumeFile: 'assets/resume.pdf',
    resumeDownloadName: '张犇-高级产品经理-简历.pdf',
    typerPhrases: [
      'B端SaaS 旗舰产品操盘手',
      '不良资产大数据专家',
      'AI 产品化实践者',
    ],
    stats: [
      { num: '100+', label: '金融机构客户' },
      { num: 'No.1', label: '细分市场占有率' },
      { num: '90%+', label: '客户续约率' },
    ],
  },

  about: {
    narrative: '我的职业路径不是跳跃，而是积累：在保险与不动产的业务现场理解「资产与风险」如何真实运行；在风控一线用数据识别风险；在 C 端完成产品从 0 到 1；如今操盘服务 100+ 金融机构的 B端SaaS 旗舰。产品经理最贵的不是画原型，而是对业务本质的理解——这是我 14 年攒下的壁垒。',
    values: [
      { icon: 'fa-lightbulb',   text: '先懂业务：保险、不动产、信贷的一线经历，是产品判断力的来源' },
      { icon: 'fa-database',    text: '数据说话：从反欺诈系统到资产监控平台，用数据解决「找资产难、发现风险晚」' },
      { icon: 'fa-rocket',      text: '从 0 到 1 到 N：C 端信贷从 0 起步，B 端 SaaS 操盘 6 年做到细分市场第一' },
    ],
    timeline: [
      {
        period: '2012 - 2014', title: '业务一线历练',
        org: '新华人寿（管培生）· 合富辉煌（房产营销）',
        desc: '在保险与不动产的业务现场，理解「资产与风险」的真实运行逻辑。',
        stage: '理解业务——也为日后主导不动产估值功能埋下业务直觉',
      },
      {
        period: '2015 - 2018', title: '信贷风控线',
        org: '中新力合（农贷项目审批）· 一骑轻尘（数据风控）',
        desc: '从农贷项目的线下审批（标准制定/项目审批/现场抽检），到反欺诈系统与风险预警体系的数据化风控；风险响应从天级缩短至小时级，累计规避约 1.2 亿贷款额度关联风险。',
        stage: '用数据识别风险——从线下审批进化到数据风控',
      },
      {
        period: '2018 - 2019', title: 'C端产品从0到1',
        org: '凭信科技 · 产品经理',
        desc: '主导信贷 App 全流程（调研→原型→上线→推广），3 个月新增用户 20万+、放款突破 2000 万；同期打造借据管理工具（对接法大大电子合同，保障法律效力）。',
        stage: '转型产品经理——完成首个从 0 到 1',
      },
      {
        period: '2020 - 至今', title: 'B端SaaS旗舰操盘',
        org: '源诚科技 · 资深产品经理',
        desc: '资产监控平台产品负责人：数据类别 7→34 类、AI 估值等智能工具矩阵、SaaS+内嵌+API 三层商业模式，服务 100+ 金融机构，细分市场占有率第 1。',
        stage: '操盘平台型产品——完整产品生命周期',
      },
    ],
    education: { school: '浙江工商大学', major: '信息管理与信息系统', degree: '本科', years: '2008 - 2012' },
    certs: ['PMP 项目管理认证', '英语六级'],
    learning: ['Dify 工作流搭建', 'Trae 独立开发上线 H5', 'OpenClaw 部署'],
  },

  skills: [
    {
      category: '产品能力',
      items: [
        { name: '0→1 产品孵化',    level: 9,  note: '信贷App、借据工具、AI估值，多个从0到1' },
        { name: '1→N 平台迭代',    level: 10, note: '监控平台 6 年 60+ 版本持续进化' },
        { name: '商业化与增长',     level: 8,  note: 'SaaS+内嵌+API，营收 CAGR 50%+' },
        { name: 'B端/G端客户赋能',  level: 9,  note: '100+ 金融机构方案输出与培训' },
      ],
    },
    {
      category: '领域纵深',
      items: [
        { name: '不良资产处置与清收', level: 10, note: '保全清收全场景产品化' },
        { name: '大数据风控',        level: 9,  note: '反欺诈、信用评估、风险定价、预警体系' },
        { name: '普惠金融信贷',      level: 9,  note: '获客到催收全流程系统设计' },
        { name: '不动产估值',        level: 8,  note: 'AI估值、估值地图、押品管理' },
      ],
    },
    {
      category: 'AI 能力',
      items: [
        { name: 'AI 产品化',       level: 8, note: 'AI估值对话流与提示词体系从0到1' },
        { name: 'RAG 知识库应用',  level: 8, note: '双通道检索、五级知识库、可溯源输出' },
        { name: 'AI 工具链',       level: 8, note: 'Dify 工作流、Trae 开发、v0 建站' },
      ],
    },
    {
      category: '方法工具',
      items: [
        { name: '产品设计 Axure',    level: 10, note: '18 页原型级交互精细度' },
        { name: '项目管理 PMP',      level: 9,  note: '认证持有，跨部门团队带领' },
        { name: '数据驱动决策',      level: 9,  note: '指标体系、埋点方案、迭代验证' },
      ],
    },
  ],

  projects: [
    {
      name: '源诚资产监控平台',
      period: '2020.05 - 至今',
      role: '资深产品经理 · 产品负责人',
      status: 'done',
      tags: ['B端SaaS', '大数据', '金融科技', '不良资产处置'],
      background: '银行与资管公司处置不良资产，最大痛点是「找资产难、发现风险晚」：债务人财产线索散落在司法、不动产、工商等数十个数据源，人工排查效率极低。',
      highlights: [
        { title: '数据体系',   desc: '资产数据类别从 7 类扩展至 34 类，覆盖司法、不动产、工商、经营动态等维度，构建精准风险画像的数据底座' },
        { title: '产品理念',   desc: '创新提出「数据分级」理念并系统性重塑产品，按使用场景分级呈现数据，显著降低金融机构的数据使用门槛' },
        { title: '智能工具矩阵', desc: '推出 AI 不动产估值、估值地图、债权查找、查投资人、查案件、利息计算等智能工具，把产品从单一工具做成综合平台' },
        { title: '双端迭代',   desc: '主导 Web 端 + 微信小程序双端 60+ 版本迭代（v2.x → v4.x）' },
        { title: '商业模式',   desc: 'SaaS 订阅之上拓展内嵌服务与 API 服务，打开第二增长曲线，营收年均复合增长 50%+' },
      ],
      results: [
        { num: '100+', label: '银行/资管机构客户' },
        { num: 'No.1', label: '细分市场占有率' },
        { num: '90%+', label: '客户续约率' },
        { num: '95%+', label: '用户满意度' },
      ],
      honors: '多次荣获「季度之星」「优秀团队负责人」',
    },
    {
      name: 'AI合规智能体（国企合规管理平台）',
      period: '2026.04 - 至今',
      role: '产品经理',
      status: 'ongoing',
      tags: ['AI产品', 'RAG', '合规科技', 'G端'],
      background: '国企合规管理要求「事前防控」，但合规依据分散在国家法规、央企意见、省级办法、集团办法、公司办法五级制度体系中，人工审查耗时长、易遗漏。',
      highlights: [
        { title: '五级知识库',   desc: '合规文档自动切片、元数据打标，构建统一知识底座' },
        { title: '双通道检索',   desc: '关键词精准匹配 + 向量语义检索，兼顾查准与查全' },
        { title: '三类合规审查', desc: '材料 / 制度 / 决策审查，输出问题等级、修改建议、依据溯源（可定位到原文条款）' },
        { title: 'AI 智能问答',  desc: '流式输出、结论前置、依据可溯源，支持深度思考与重新生成' },
        { title: '交付物',      desc: '18 页 Axure 原型 + 完整 PRD' },
      ],
      results: [],
      honors: '',
    },
  ],

};
```

- [ ] **Step 2: 语法校验**

Run: `node --check 'd:\Trae空间\projects\personal-site\data.js'`
Expected: 无输出（退出码 0）

- [ ] **Step 3: index.html 引入 data.js**

在 `index.html` 末尾，把：

```html
<script src="script.js"></script>
</body>
```

改为：

```html
<script src="data.js"></script>
<script src="script.js"></script>
</body>
```

- [ ] **Step 4: 确认站点不受影响（data 尚未被使用，页面应无任何变化）**

Run: `(Invoke-WebRequest -Uri 'http://127.0.0.1:8123/index.html' -UseBasicParsing).StatusCode`
Expected: `200`（若服务未启动，先在项目目录后台执行 `python -m http.server 8123`）

- [ ] **Step 5: 提交**

```powershell
git add data.js index.html
git commit -m "feat: 新增data.js数据层（全站唯一内容源）并引入页面"
```

---

### Task 3: 结构与渲染改造（index.html + script.js + style.css 新增样式，配套原子变更）

**Files:**
- Modify: `index.html`（整文件重写为 5 板块钩子结构）
- Modify: `script.js`（整文件重写为渲染层 + 交互层）
- Modify: `style.css`（文件末尾追加新增样式块，不动既有行）

> 注意：本任务三个文件必须**同一次提交**，任何一个单独上线都会造成中间态破损。

- [ ] **Step 1: 重写 index.html（完整内容如下，逐字使用）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>张犇 · 高级产品经理 | Personal Site</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
<link rel="stylesheet" href="style.css" />
</head>
<body>

<!-- ========== 背景数据流点阵 ========== -->
<canvas id="bg-canvas"></canvas>
<div class="bg-glow bg-glow-1"></div>
<div class="bg-glow bg-glow-2"></div>

<!-- ========== 固定顶部导航 ========== -->
<nav class="navbar" id="navbar">
  <div class="nav-inner">
    <a href="#home" class="brand">
      <span class="brand-dot"></span>
      <span>ZHANG · BEN</span>
    </a>
    <ul class="nav-links">
      <li><a href="#home" class="nav-link active" data-nav="0">首页</a></li>
      <li><a href="#about" class="nav-link" data-nav="1">关于我</a></li>
      <li><a href="#skills" class="nav-link" data-nav="2">技能</a></li>
      <li><a href="#projects" class="nav-link" data-nav="3">作品</a></li>
      <li><a href="#contact" class="nav-link" data-nav="4">联系</a></li>
    </ul>
    <a href="#contact" class="nav-cta">
      <i class="fa-solid fa-paper-plane"></i>
      <span>联系我</span>
    </a>
  </div>
</nav>

<!-- ========== 1. Hero ========== -->
<section class="section hero" id="home" data-section="0">
  <div class="container hero-inner">
    <div class="hero-copy reveal">
      <p class="hero-kicker"><span class="kicker-bar"></span> <span id="heroKicker"></span></p>
      <h1 class="hero-title">
        你好，我是<span class="accent" id="heroName"></span><br/>
        <span class="typer" id="typer"></span><span class="caret">|</span>
      </h1>
      <p class="hero-desc" id="heroDesc"></p>
      <div class="hero-actions">
        <a href="#projects" class="btn btn-primary">
          <i class="fa-solid fa-rocket"></i> 查看作品
        </a>
        <a id="resumeBtn" class="btn btn-ghost" href="#">
          <i class="fa-regular fa-file-lines"></i> 下载简历
        </a>
      </div>
      <div class="hero-meta" id="heroStats"></div>
    </div>
    <div class="hero-card reveal reveal-delay">
      <div class="card-glass">
        <div class="card-header">
          <div class="dots"><i></i><i></i><i></i></div>
          <span class="card-title" id="cardTitle">pm-ben · ~/portfolio</span>
        </div>
        <pre class="card-code"><code id="heroCode"></code></pre>
      </div>
    </div>
  </div>
  <a href="#about" class="scroll-hint">
    <span>向下滚动</span>
    <i class="fa-solid fa-chevron-down"></i>
  </a>
</section>

<!-- ========== 2. About 关于我 + 时间轴 ========== -->
<section class="section" id="about" data-section="1">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">01 · ABOUT</p>
      <h2 class="section-title">我是谁 — <span class="accent">先懂业务，再做产品</span></h2>
      <p class="section-sub">14 年，一条从业务现场走到产品操盘的完整路径。</p>
    </header>

    <div class="about-grid">
      <div class="about-left reveal">
        <div class="avatar-wrap">
          <div class="avatar-ring"></div>
          <div class="avatar avatar-mono" id="avatarMono">犇</div>
          <div class="avatar-badge">
            <i class="fa-solid fa-brain"></i> AI × PM
          </div>
        </div>
        <div class="about-text">
          <h3><span id="aboutName"></span> <span class="tag">Senior Product Manager</span></h3>
          <p id="aboutNarrative"></p>
          <ul class="value-list" id="aboutValues"></ul>
        </div>
      </div>

      <div class="about-right reveal reveal-delay">
        <h3 class="timeline-title">
          <i class="fa-solid fa-timeline accent"></i> 职业经历时间轴
        </h3>
        <div class="timeline" id="timeline"></div>
        <div class="about-side-cards" id="aboutSideCards"></div>
      </div>
    </div>
  </div>
</section>

<!-- ========== 3. Skills 技能矩阵 ========== -->
<section class="section" id="skills" data-section="2">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">02 · SKILLS</p>
      <h2 class="section-title">技能矩阵 — <span class="accent">能力跟着业务长出来</span></h2>
      <p class="section-sub">Hover 格子查看分值，0-10 分自我评估。</p>
    </header>

    <div class="skills-wrap reveal" id="skillsWrap"></div>
  </div>
</section>

<!-- ========== 4. Projects 作品 ========== -->
<section class="section" id="projects" data-section="3">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">03 · PROJECTS</p>
      <h2 class="section-title">代表作品 — <span class="accent">两个深度项目</span></h2>
      <p class="section-sub">一个证明平台深耕，一个证明 AI 前沿。</p>
    </header>

    <div id="projectsGrid"></div>
  </div>
</section>

<!-- ========== 5. Contact 联系 ========== -->
<section class="section" id="contact" data-section="4">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">04 · CONTACT</p>
      <h2 class="section-title">让我们聊聊 — <span class="accent">岗位机会 · 交流</span></h2>
      <p class="section-sub">期待与您聊聊岗位机会或产品交流，邮件是最快的方式。</p>
    </header>

    <div class="contact-wrap">
      <div class="contact-left reveal">
        <div class="contact-big-card">
          <div class="cbc-head">
            <div class="cbc-avatar" id="cbcAvatar">犇</div>
            <div>
              <h3 id="cbcName"></h3>
              <p id="cbcRole"></p>
            </div>
          </div>
          <ul class="cbc-list">
            <li>
              <i class="fa-solid fa-envelope accent"></i>
              <div>
                <span class="cbc-label">邮箱</span>
                <a id="cbcMail" href="#"></a>
                <button class="copy-btn" id="copyEmail" data-copy="" title="复制邮箱"><i class="fa-regular fa-copy"></i></button>
              </div>
            </li>
            <li>
              <i class="fa-solid fa-location-dot accent"></i>
              <div>
                <span class="cbc-label">期望城市</span>
                <span id="cbcLocation"></span>
              </div>
            </li>
            <li>
              <i class="fa-regular fa-file-lines accent"></i>
              <div>
                <span class="cbc-label">简历</span>
                <a id="cbcResume" href="#">下载 PDF（含完整履历与联系方式）</a>
              </div>
            </li>
          </ul>
          <div class="cbc-cta">
            <a id="mailCta" href="#" class="btn btn-primary">
              <i class="fa-solid fa-paper-plane"></i> 立即发邮件
            </a>
            <span class="cbc-hint">工作日 24 小时内回复</span>
          </div>
        </div>
      </div>

      <div class="contact-right reveal reveal-delay">
        <div class="resume-card">
          <i class="fa-regular fa-file-lines"></i>
          <h3>下载简历</h3>
          <p>完整履历（含项目细节与联系方式），PDF 格式</p>
          <a id="resumeBtn2" class="btn btn-primary" href="#">下载 PDF</a>
          <span class="rc-hint">文件将保存为「张犇-高级产品经理-简历.pdf」</span>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container footer-inner">
    <span>© <span id="footerYear">2026</span> 张犇 · Built with ❤ + AI · 参考 v0.dev 风格搭建</span>
    <span class="footer-right">
      <a href="#home"><i class="fa-solid fa-arrow-up"></i> 回到顶部</a>
    </span>
  </div>
</footer>

<script src="data.js"></script>
<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: 重写 script.js（完整内容如下，逐字使用）**

```js
/* ============================================================
   个人站交互脚本（数据驱动版）
   · 渲染层：从 data.js 的 SITE_DATA 渲染五大板块内容
   · 交互层：导航跟随 / 键盘快捷键 / 打字机 / Reveal 入场 /
             技能格子 hover / 邮箱复制 / 背景数据流点阵
   ============================================================ */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SITE_DATA || {};

  /* 文本转义：内容里的特殊字符不破坏 HTML 结构 */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  /* =========== 渲染层 =========== */

  /* 1. Hero */
  function renderHero() {
    const p = D.profile || {};
    if ($("#heroKicker")) $("#heroKicker").textContent = p.kicker || "";
    if ($("#heroName")) $("#heroName").textContent = p.name || "";
    if ($("#heroDesc")) $("#heroDesc").textContent = p.intro || "";

    const stats = $("#heroStats");
    if (stats && p.stats) {
      stats.innerHTML = p.stats.map((s, i) => `
        <div class="meta-item">
          <span class="meta-num accent">${esc(s.num)}</span>
          <span class="meta-label">${esc(s.label)}</span>
        </div>${i < p.stats.length - 1 ? '<div class="meta-divider"></div>' : ""}`
      ).join("");
    }

    const code = $("#heroCode");
    if (code) {
      code.innerHTML =
`<span class="c-key">const</span> <span class="c-var">productManager</span> = {
  <span class="c-prop">name</span>: <span class="c-str">'${esc(p.name)}'</span>,
  <span class="c-prop">role</span>: <span class="c-str">'Senior Product Manager'</span>,
  <span class="c-prop">focus</span>: [
    <span class="c-str">'B端SaaS'</span>,
    <span class="c-str">'大数据风控'</span>,
    <span class="c-str">'AI产品化'</span>,
  ],
  <span class="c-prop">motto</span>: <span class="c-str">"${esc(p.motto)}"</span>,
  <span class="c-prop">status</span>: <span class="c-num">open_to_opportunity</span> ✨
};`;
    }

    const btn = $("#resumeBtn");
    if (btn) {
      btn.href = p.resumeFile || "#";
      btn.setAttribute("download", p.resumeDownloadName || "resume.pdf");
    }
  }

  /* 2. About + 时间轴 + 副线卡片 */
  function renderAbout() {
    const a = D.about || {}, p = D.profile || {};
    if ($("#aboutName")) $("#aboutName").textContent = p.name || "";
    if ($("#aboutNarrative")) $("#aboutNarrative").textContent = a.narrative || "";

    const values = $("#aboutValues");
    if (values && a.values) {
      values.innerHTML = a.values.map(v => `
        <li><i class="fa-solid ${esc(v.icon)} accent"></i> <span>${esc(v.text)}</span></li>`).join("");
    }

    const tl = $("#timeline");
    if (tl && a.timeline) {
      tl.innerHTML = a.timeline.map(t => `
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-card">
            <div class="tl-top">
              <span class="tl-date">${esc(t.period)}</span>
              <span class="tl-company"><i class="fa-solid fa-building"></i> ${esc(t.org)}</span>
            </div>
            <h4>${esc(t.title)}</h4>
            <p>${esc(t.desc)}</p>
            <div class="tl-stage"><i class="fa-solid fa-flag-checkered"></i> ${esc(t.stage)}</div>
          </div>
        </div>`).join("");
    }

    const side = $("#aboutSideCards");
    if (side) {
      const e = a.education || {};
      side.innerHTML = `
        <div class="side-card">
          <h4><i class="fa-solid fa-graduation-cap"></i> 教育背景</h4>
          <p>${esc(e.school)} · ${esc(e.major)} · ${esc(e.degree)}（${esc(e.years)}）</p>
        </div>
        <div class="side-card">
          <h4><i class="fa-solid fa-certificate"></i> 资格认证</h4>
          <ul>${(a.certs || []).map(x => `<li>· ${esc(x)}</li>`).join("")}</ul>
        </div>
        <div class="side-card">
          <h4><i class="fa-solid fa-robot"></i> 持续学习（AI 工具实践）</h4>
          <ul>${(a.learning || []).map(x => `<li>· ${esc(x)}</li>`).join("")}</ul>
        </div>`;
    }
  }

  /* 3. Skills 技能矩阵（level 为 0-10） */
  function renderSkills() {
    const wrap = $("#skillsWrap");
    if (!wrap || !D.skills) return;
    wrap.innerHTML = D.skills.map(g => `
      <div class="skill-group">
        <h4 class="skill-group-title">${esc(g.category)}</h4>
        ${g.items.map(it => `
        <div class="skill-row">
          <div class="skill-name">${esc(it.name)}<span class="skill-note">${esc(it.note)}</span></div>
          <div class="skill-bar" data-score="${it.level}">
            <div class="cells"></div>
            <span class="skill-tip">${it.level} / 10</span>
          </div>
        </div>`).join("")}
      </div>`).join("");
  }

  /* 4. Projects 作品卡 */
  function renderProjects() {
    const grid = $("#projectsGrid");
    if (!grid || !D.projects) return;
    grid.innerHTML = D.projects.map((p, i) => `
      <article class="project-detail reveal ${i % 2 ? "reveal-delay" : ""}">
        <div class="pd-head">
          <div>
            <h3>${esc(p.name)}</h3>
            <span class="pd-period"><i class="fa-regular fa-calendar"></i> ${esc(p.period)}</span>
            <span class="pd-role">${esc(p.role)}</span>
          </div>
          <span class="pd-badge ${p.status === "ongoing" ? "ongoing" : ""}">${p.status === "ongoing" ? "进行中" : "已上线运营"}</span>
        </div>
        <div class="pd-tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <p class="pd-background"><b>背景</b> · ${esc(p.background)}</p>
        <div class="pd-highlights">
          ${(p.highlights || []).map(h => `
          <div class="pd-h"><b>${esc(h.title)}</b><p>${esc(h.desc)}</p></div>`).join("")}
        </div>
        ${(p.results && p.results.length) ? `
        <div class="pd-results">
          ${p.results.map(r => `
          <div class="pd-result"><span class="num">${esc(r.num)}</span><span class="label">${esc(r.label)}</span></div>`).join("")}
        </div>` : ""}
        ${p.honors ? `<p class="pd-honors"><i class="fa-solid fa-award accent"></i> ${esc(p.honors)}</p>` : ""}
      </article>`).join("");
  }

  /* 5. Contact */
  function renderContact() {
    const p = D.profile || {};
    if ($("#cbcName")) $("#cbcName").textContent = p.name || "";
    if ($("#cbcRole")) $("#cbcRole").textContent = `${p.title || ""} · 开放机会中`;
    if ($("#cbcMail")) { $("#cbcMail").href = `mailto:${p.email}`; $("#cbcMail").textContent = p.email || ""; }
    if ($("#cbcLocation")) $("#cbcLocation").textContent = p.location || "";
    if ($("#mailCta")) $("#mailCta").href = `mailto:${p.email}`;
    const copy = $("#copyEmail");
    if (copy) copy.dataset.copy = p.email || "";
    [$("#cbcResume"), $("#resumeBtn2")].forEach(a => {
      if (a) { a.href = p.resumeFile || "#"; a.setAttribute("download", p.resumeDownloadName || "resume.pdf"); }
    });
    if ($("#footerYear")) $("#footerYear").textContent = String(new Date().getFullYear());
  }

  /* =========== 交互层 =========== */

  /* 6. Nav 滚动样式 & 锚点激活 */
  function initNav() {
    const navbar = $("#navbar");
    const sections = $$(".section[data-section]");
    const navLinks = $$(".nav-link");
    if (!navbar || !sections.length) return;

    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
      const y = window.scrollY + window.innerHeight * 0.35;
      let activeIdx = 0;
      sections.forEach(s => {
        if (y >= s.offsetTop) activeIdx = Number(s.dataset.section);
      });
      navLinks.forEach(l => l.classList.toggle("active", Number(l.dataset.nav) === activeIdx));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* 键盘 ↑↓ 快捷键导航 */
    const gotoSection = (idx) => {
      const sec = sections[idx];
      if (!sec) return;
      sec.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", (e) => {
      if (/input|textarea/i.test(e.target.tagName)) return;
      const cur = navLinks.findIndex(l => l.classList.contains("active"));
      if (e.key === "ArrowDown") { e.preventDefault(); gotoSection(Math.min(cur + 1, sections.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); gotoSection(Math.max(cur - 1, 0)); }
    });
  }

  /* 7. Hero 打字机（短语来自数据层） */
  function initTyper() {
    const typer = $("#typer");
    if (!typer) return;
    const phrases = (D.profile && D.profile.typerPhrases) || [];
    if (!phrases.length) return;
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = phrases[pi];
      if (!deleting) {
        typer.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; return setTimeout(tick, 1600); }
      } else {
        typer.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 35 : 80);
    };
    tick();
  }

  /* 8. Reveal 入场动画（必须在渲染层之后执行） */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    $$(".reveal").forEach(el => io.observe(el));
  }

  /* 9. 技能格子表 — 生成 10 格 + hover 高亮分值（必须在渲染层之后执行） */
  function initSkillBars() {
    $$(".skill-bar").forEach(bar => {
      const score = Number(bar.dataset.score) || 0;
      const cells = bar.querySelector(".cells");
      let html = "";
      for (let i = 1; i <= 10; i++) {
        const filled = i <= score ? "filled" : "";
        html += `<i data-i="${i}" class="${filled}"></i>`;
      }
      cells.innerHTML = html;

      const tip = bar.querySelector(".skill-tip");
      const icons = $$("i", cells);
      icons.forEach(ic => {
        ic.addEventListener("mouseenter", () => {
          const n = Number(ic.dataset.i);
          icons.forEach((x, idx) => {
            x.classList.toggle("filled", idx < score);
            x.classList.toggle("hover", idx < n);
          });
          tip.textContent = `${n} / 10`;
        });
      });
      bar.addEventListener("mouseleave", () => {
        icons.forEach(x => x.classList.remove("hover"));
        tip.textContent = `${score} / 10`;
      });
    });
  }

  /* 10. 邮箱一键复制（clipboard API + 降级方案） */
  function initCopy() {
    $$(".copy-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const text = btn.dataset.copy || "";
        if (!text) return;
        let ok = false;
        try { await navigator.clipboard.writeText(text); ok = true; }
        catch (e) {
          const ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { ok = document.execCommand("copy"); } catch (_) { /* 降级也失败则放弃 */ }
          ta.remove();
        }
        if (ok) {
          btn.classList.add("copied");
          const old = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
          setTimeout(() => { btn.classList.remove("copied"); btn.innerHTML = old; }, 1600);
        }
      });
    });
  }

  /* 11. 背景数据流点阵 Canvas */
  function initCanvas() {
    const canvas = $("#bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dots = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(DPR, DPR);
      const density = Math.max(60, Math.floor((window.innerWidth * window.innerHeight) / 16000));
      dots = Array.from({ length: density }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - .5) * 0.25,
        vy: (Math.random() - .5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      }));
    };
    window.addEventListener("resize", resize);
    resize();

    const mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    const DIST = 130, DIST_M = 170;
    const loop = () => {
      const W = window.innerWidth, H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(142, 160, 196, 0.45)";
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < DIST * DIST) {
            const alpha = 1 - Math.sqrt(dist2) / DIST;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.28})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < DIST_M * DIST_M) {
          const alpha = 1 - Math.sqrt(md2) / DIST_M;
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.55})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* =========== 启动（顺序敏感：先渲染，后交互） =========== */
  renderHero();
  renderAbout();
  renderSkills();
  renderProjects();
  renderContact();

  initNav();
  initTyper();
  initReveal();
  initSkillBars();
  initCopy();
  initCanvas();
})();
```

- [ ] **Step 3: style.css 末尾追加新增样式（完整内容如下；只追加，不改动既有任何行）**

```css

/* ============================================================
   7. 数据驱动新增样式（2026-10 重建）
   ============================================================ */

/* —— About：头像字模 / 时间轴阶段 / 副线卡片 —— */
.avatar-mono{
  display: flex; align-items: center; justify-content: center;
  font-size: 60px; font-weight: 800;
  background: linear-gradient(135deg, rgba(34,211,238,.15), rgba(168,85,247,.15));
  color: var(--accent);
}
.tl-stage{
  margin-top: 10px; font-size: 12.5px; color: var(--accent);
  display: flex; align-items: center; gap: 6px;
}
.tl-stage i{ font-size: 11px; }
.about-side-cards{ margin-top: 26px; display: grid; gap: 14px; }
.side-card{
  padding: 16px 18px; border: 1px solid var(--border); border-radius: 16px;
  background: var(--surface);
}
.side-card h4{
  font-size: 13px; color: var(--accent); margin-bottom: 8px;
  display: flex; gap: 8px; align-items: center;
}
.side-card p, .side-card li{ font-size: 13.5px; color: var(--text-dim); }
.side-card ul{ list-style: none; display: grid; gap: 4px; }

/* —— Skills：分组标题 / 注解 —— */
.skill-group{ margin-bottom: 28px; }
.skill-group-title{
  font-size: 15px; color: var(--text); margin-bottom: 14px;
  display: flex; align-items: center; gap: 12px;
}
.skill-group-title::after{ content: ""; flex: 1; height: 1px; background: var(--border); }
.skill-note{ display: block; font-size: 12px; color: var(--text-dim); margin-top: 3px; }

/* —— Projects：深度项目卡 —— */
.project-detail{
  border: 1px solid var(--border); border-radius: 24px;
  background: var(--surface); backdrop-filter: blur(10px);
  padding: 30px 32px; margin: 0 auto 28px; max-width: 920px;
  transition: all .4s cubic-bezier(.2,.8,.2,1);
}
.project-detail:hover{
  border-color: rgba(34,211,238,.5);
  box-shadow: var(--shadow), 0 0 60px rgba(34,211,238,.12);
}
.pd-head{
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 16px; flex-wrap: wrap; margin-bottom: 14px;
}
.pd-head h3{ font-size: 22px; }
.pd-period{
  display: flex; align-items: center; gap: 6px;
  color: var(--text-dim); font-size: 13px; margin-top: 6px;
}
.pd-role{ display: block; color: var(--accent); font-size: 13px; margin-top: 4px; }
.pd-badge{
  padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
  border: 1px solid rgba(52,211,153,.4); color: #34d399;
  background: rgba(52,211,153,.08); white-space: nowrap;
}
.pd-badge.ongoing{
  border-color: rgba(251,191,36,.4); color: #fbbf24; background: rgba(251,191,36,.08);
}
.pd-tags{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.pd-tags span{
  padding: 5px 12px; border-radius: 8px; font-size: 12px;
  color: var(--text-dim); background: rgba(255,255,255,.04);
  border: 1px solid var(--border);
}
.pd-background{ color: var(--text-dim); font-size: 14.5px; margin-bottom: 18px; line-height: 1.7; }
.pd-background b{ color: var(--text); }
.pd-highlights{ display: grid; gap: 12px; margin-bottom: 20px; }
.pd-h{
  padding: 14px 16px; border-radius: 14px;
  background: rgba(255,255,255,.03); border: 1px solid var(--border);
}
.pd-h b{ font-size: 14px; color: var(--text); display: block; margin-bottom: 4px; }
.pd-h p{ font-size: 13.5px; color: var(--text-dim); line-height: 1.65; }
.pd-results{ display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
.pd-result{
  flex: 1; min-width: 130px; text-align: center; padding: 14px 10px;
  border-radius: 14px; border: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(34,211,238,.08), rgba(168,85,247,.08));
}
.pd-result .num{ display: block; font-size: 22px; font-weight: 800; color: var(--accent); }
.pd-result .label{ font-size: 12px; color: var(--text-dim); }
.pd-honors{ font-size: 13px; color: var(--text-dim); }

/* —— Contact：简历卡 / 复制按钮 —— */
.resume-card{
  padding: 36px; border: 1px solid var(--border); border-radius: 28px;
  background: var(--surface); backdrop-filter: blur(14px);
  text-align: center; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px; height: 100%;
}
.resume-card > i{ font-size: 44px; color: var(--accent); }
.resume-card h3{ font-size: 20px; }
.resume-card p{ color: var(--text-dim); font-size: 14px; }
.rc-hint{ font-size: 12px; color: var(--text-dim); }
.copy-btn{
  margin-left: 10px; padding: 4px 10px; border-radius: 8px;
  border: 1px solid var(--border); background: rgba(255,255,255,.04);
  color: var(--text-dim); font-size: 12px; cursor: pointer; transition: all .2s;
}
.copy-btn:hover{ color: var(--accent); border-color: rgba(34,211,238,.4); }
.copy-btn.copied{ color: #34d399; border-color: rgba(52,211,153,.4); }

/* —— 响应式补充 —— */
@media (max-width: 768px){
  .project-detail{ padding: 22px 18px; }
  .pd-result{ min-width: 100px; }
  .pd-head h3{ font-size: 19px; }
}
```

- [ ] **Step 4: JS 语法校验**

Run: `node --check 'd:\Trae空间\projects\personal-site\script.js'`
Expected: 无输出（退出码 0）

- [ ] **Step 5: 启动本地服务并做渲染验证**

Run（若 8123 服务未在运行）: 项目目录下后台执行 `python -m http.server 8123`
然后: `(Invoke-WebRequest -Uri 'http://127.0.0.1:8123/index.html' -UseBasicParsing).StatusCode`
Expected: `200`

- [ ] **Step 6: 浏览器渲染验证（加载 webapp-testing 技能用 Playwright）**

打开 `http://127.0.0.1:8123/index.html`，验证：
1. Hero 显示「你好，我是张犇」、3 个数据卡（100+ / No.1 / 90%+）、打字机轮播动效
2. 关于我：头像显示「犇」字模、时间轴 4 节点（业务一线历练/信贷风控线/C端产品从0到1/B端SaaS旗舰操盘）、教育/认证/持续学习 3 张副卡
3. 技能：4 个分组、每项带注解、hover 格子有高亮
4. 作品：2 张深度项目卡，第二张带黄色「进行中」徽标
5. 联系：邮箱 415730168@qq.com、复制按钮点击后变「已复制」、下载简历按钮存在
6. console 无报错；截图存档（1440px 桌面 + 375px 移动各一张，存到 `c:\Users\41573\.trae-cn\work\6ac772528b812909ac63c88b\verify-task3-*.png`）

- [ ] **Step 7: 提交（三个文件必须同一次提交）**

```powershell
git add index.html script.js style.css
git commit -m "feat: 五板块数据驱动改造——真实履历替换虚构内容，删除博客与假表单"
```

---

### Task 4: style.css 死样式清理

**Files:**
- Modify: `style.css`（删除 4 段不再被引用的样式块）

> 行号基于当前文件（Task 3 只在末尾追加，未改动既有行号）。删除前先 Read 确认边界内容一致。

- [ ] **Step 1: 删除旧项目筛选器样式（原 398-412 行：`.project-filters`、`.filter`、`.filter:hover`、`.filter.active`）**

- [ ] **Step 2: 删除旧项目小卡样式（原 414-469 行：`.projects-grid`、`.project-card`、`.project-cover`、`.project-tag`、`.cover-1`~`.cover-4`、`.project-body`、`.project-meta`、`.project-card.hidden`）**

- [ ] **Step 3: 删除博客样式（原 471-545 行：`5. BLOG + SEARCH` 注释块及 `.blog-controls` 到 `.blog-empty i` 全部规则）**

- [ ] **Step 4: 删除联系表单样式（原 595-616 行：`.contact-form` 及其全部子规则）**

- [ ] **Step 5: 验证无残留引用**

Run: `Select-String -Path 'd:\Trae空间\projects\personal-site\index.html','d:\Trae空间\projects\personal-site\script.js' -Pattern 'project-card|blog-|blogSearch|contact-form|cover-1|\.filter'`
Expected: 无匹配

Run: `(Invoke-WebRequest -Uri 'http://127.0.0.1:8123/index.html' -UseBasicParsing).StatusCode`
Expected: `200`（浏览器复查页面样式无破损）

- [ ] **Step 6: 提交**

```powershell
git add style.css
git commit -m "chore: 清理博客/表单/旧项目卡的死样式"
```

---

### Task 5: 全站验收 + README 更新

**Files:**
- Modify: `README.md`（重写为重建后的项目说明）

- [ ] **Step 1: 虚构清零扫描（验收标准 #2）**

Run: `Select-String -Path 'd:\Trae空间\projects\personal-site\index.html','d:\Trae空间\projects\personal-site\script.js','d:\Trae空间\projects\personal-site\data.js' -Pattern '陈思远|字节|美团|DAU|siyuan|阿黛'`
Expected: 无匹配

- [ ] **Step 2: 脱敏红线扫描（验收标准 #3，设计文档 §6）**

Run: `Select-String -Path 'd:\Trae空间\projects\personal-site\index.html','d:\Trae空间\projects\personal-site\script.js','d:\Trae空间\projects\personal-site\data.js' -Pattern '信达|北京银行|河北资产|长城资管|光大银行|粤财|浙商资产|农行|工猫'`
Expected: 无匹配

- [ ] **Step 3: 交互回归（验收标准 #4，用 webapp-testing 技能 Playwright）**

逐项验证并记录：导航跟随滚动高亮 / 打字机动效 / 键盘 ↑↓ 板块跳转 / 技能格子 hover / 复制按钮 / 回到顶部 / 粒子背景渲染。全部通过才算完成。

- [ ] **Step 4: 响应式与下载验证（验收标准 #5/#7）**

Playwright 设 375px 视口截图检查布局；点击「下载简历」验证 `assets/resume.pdf` 可下载（或直接验证 `Invoke-WebRequest http://127.0.0.1:8123/assets/resume.pdf` 返回 200）。

- [ ] **Step 5: 数据驱动生效验证（验收标准 #8）**

1. 把 `data.js` 中 `name: '源诚资产监控平台'` 临时改为 `name: '测试改名'`
2. 刷新页面确认作品卡标题变为「测试改名」
3. `git checkout -- data.js` 还原，刷新确认恢复

- [ ] **Step 6: 重写 README.md（完整内容如下）**

````markdown
# personal-site · 张犇个人站（求职作品集）

> v0 风格深色单页站，2026-10 重建：内容全部来自真实履历，数据驱动架构。
> 定位：面向 HR / 面试官的高级产品经理求职作品集。

## 结构
- `index.html` — 5 板块骨架（首页 / 关于我 / 技能 / 作品 / 联系），正文为渲染钩子
- `data.js` — **全站唯一内容源**：改项目、改时间轴、改技能、改联系方式只动这个文件
- `script.js` — 渲染层（读 SITE_DATA 生成 DOM）+ 交互层（导航跟随/打字机/快捷键/粒子背景）
- `style.css` — 深色主题样式系统（v0 风格）
- `assets/resume.pdf` — 简历 PDF（下载按钮指向此文件）

## 本地预览
```powershell
python -m http.server 8123   # 项目目录下执行，访问 http://127.0.0.1:8123
```

## 内容红线（改内容时必须遵守）
- 不出现具体客户名称，只用聚合数据（100+ / No.1 / 90%+）
- 不挂任何公司内部 PRD / 产品文档原文
- 联系方式只放邮箱

## 设计与实施文档
- 设计文档：`docs/superpowers/specs/2026-10-09-personal-site-rebuild-design.md`
- 实施计划：`docs/superpowers/plans/2026-10-09-personal-site-rebuild.md`

## 历史版本
2026-08-29 初版（v0 风格虚构占位内容），见 git 基线 commit `78199a2`。
````

- [ ] **Step 7: 最终提交**

```powershell
git add README.md data.js
git commit -m "docs: 重建后README + 验收通过（虚构清零/脱敏/交互回归/响应式/数据驱动）"
git log --oneline
```

Expected: 日志含全部任务提交，工作区干净（`git status` 无未提交变更）

---

## 附注

- 头脑风暴可视化服务（端口 64546）30 分钟无活动自动退出，无需手动清理
- 部署上线（GitHub Pages / 域名 / HTTPS）为后续独立任务，不在本计划范围
