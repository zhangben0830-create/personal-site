/* ============================================================
   个人站交互脚本
   · Hero 打字机动效
   · 滚动 Reveal 动画
   · 导航栏 active 切换（含键盘↑↓快捷键 + 平滑滚动）→ 来自视频1作者的修改指令
   · 技能格子表 hover 高亮打分 → 来自视频2 v0 修改案例
   · 项目分类筛选
   · 博客搜索
   · 背景数据流点阵 canvas
   ============================================================ */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* =========== 1. Nav 滚动样式 & 锚点激活 =========== */
  const navbar = $("#navbar");
  const sections = $$(".section[data-section]");
  const navLinks = $$(".nav-link");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);

    /* active section 判定：顶部 35% 处命中哪个 section */
    const y = window.scrollY + window.innerHeight * 0.35;
    let activeIdx = 0;
    sections.forEach(s => {
      const top = s.offsetTop;
      if (y >= top) activeIdx = Number(s.dataset.section);
    });
    navLinks.forEach(l => l.classList.toggle("active", Number(l.dataset.nav) === activeIdx));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* =========== 2. 键盘 ↑↓ 快捷键导航（视频1作者同款指令） =========== */
  const gotoSection = (idx) => {
    const sec = sections[idx];
    if (!sec) return;
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  window.addEventListener("keydown", (e) => {
    // 输入框内不响应
    if (/input|textarea/i.test(e.target.tagName)) return;
    const cur = navLinks.findIndex(l => l.classList.contains("active"));
    if (e.key === "ArrowDown") { e.preventDefault(); gotoSection(Math.min(cur + 1, sections.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); gotoSection(Math.max(cur - 1, 0)); }
  });

  /* =========== 3. Hero 打字机 =========== */
  const typer = $("#typer");
  if (typer) {
    const phrases = [
      "打造让人上瘾的产品体验",
      "用 AI 重塑产品的可能性",
      "把复杂留给自己，把爽留给用户",
      "Senior Product Manager · 8年经验"
    ];
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

  /* =========== 4. Reveal 入场动画 =========== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* =========== 5. 技能格子表 — 生成 10 格 + hover 高亮分值（视频2同款） =========== */
  $$(".skill-bar").forEach(bar => {
    const score = Number(bar.dataset.score) || 0;
    const cells = bar.querySelector(".cells");
    // 生成 10 个格子
    let html = "";
    for (let i = 1; i <= 10; i++) {
      const filled = i <= score ? "filled" : "";
      html += `<i data-i="${i}" class="${filled}"></i>`;
    }
    cells.innerHTML = html;

    const tip = bar.querySelector(".skill-tip");
    const icons = $$("i", cells);
    const baseScore = score;

    // 鼠标进入格子 → 高亮到对应分数
    icons.forEach(ic => {
      ic.addEventListener("mouseenter", () => {
        const n = Number(ic.dataset.i);
        icons.forEach((x, idx) => {
          x.classList.toggle("filled", idx < baseScore);   // 先恢复原状态
          x.classList.toggle("hover",  idx < n);           // 再叠加 hover 高亮
        });
        tip.textContent = `${n} / 10`;
      });
    });
    bar.addEventListener("mouseleave", () => {
      icons.forEach(x => x.classList.remove("hover"));
      tip.textContent = `${baseScore} / 10`;
    });
  });

  /* =========== 6. 项目分类筛选 =========== */
  const filters = $$(".project-filters .filter");
  const projectCards = $$(".project-card");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      projectCards.forEach(c => {
        const show = f === "all" || c.dataset.cat === f;
        c.classList.toggle("hidden", !show);
      });
    });
  });

  /* =========== 7. 博客搜索（标题 + 标签） =========== */
  const input = $("#blogSearch");
  const cards = $$(".blog-card");
  const empty = $("#blogEmpty");

  const doSearch = () => {
    const q = input.value.trim().toLowerCase();
    let count = 0;
    cards.forEach(c => {
      const title = (c.dataset.title || "").toLowerCase();
      const tags  = (c.dataset.tags  || "").toLowerCase();
      const hit = !q || title.includes(q) || tags.includes(q);
      c.classList.toggle("hidden", !hit);
      if (hit) count++;
    });
    if (empty) empty.hidden = count > 0;
  };
  if (input) {
    input.addEventListener("input", doSearch);
    // 点击标签 chip 直接填入搜索
    $$(".blog-tags .chip").forEach(chip => {
      chip.style.cursor = "pointer";
      chip.addEventListener("click", () => {
        // 去掉 # 号
        input.value = chip.textContent.replace(/^#/, "").trim();
        doSearch();
        input.focus();
      });
    });
  }

  /* =========== 8. 背景数据流点阵 Canvas =========== */
  const canvas = $("#bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dots = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.width  = window.innerWidth  * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(DPR, DPR);

      // 根据屏幕大小生成适量节点
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

    // 鼠标交互
    const mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    const DIST = 130;
    const DIST_M = 170;

    const loop = () => {
      const W = window.innerWidth, H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      // 移动 + 画点
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

      // 连线
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
        // 鼠标连线
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
})();
