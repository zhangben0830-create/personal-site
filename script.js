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
  <span class="c-prop">role</span>: <span class="c-str">'${esc(p.roleEn || "Senior Product Manager")}'</span>,
  <span class="c-prop">focus</span>: [
${(p.focus || []).map(f => `    <span class="c-str">'${esc(f)}'</span>,`).join("\n")}
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
        ${g.items.map(it => {
          const lv = Math.min(10, Math.max(0, Number(it.level) || 0));
          return `
        <div class="skill-row">
          <div class="skill-name">${esc(it.name)}<span class="skill-note">${esc(it.note)}</span></div>
          <div class="skill-bar" data-score="${lv}">
            <div class="cells"></div>
            <span class="skill-tip">${lv} / 10</span>
          </div>
        </div>`;
        }).join("")}
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
      const original = btn.innerHTML;   // 绑定时固化原始内容，避免重复点击时捕获错误状态
      let timer = null;
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
          btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
          clearTimeout(timer);
          timer = setTimeout(() => {
            btn.classList.remove("copied");
            btn.innerHTML = original;
          }, 1600);
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
