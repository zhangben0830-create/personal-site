# personal-site · 张犇个人站（求职作品集）

> v0 风格深色单页站，2026-10 重建：内容全部来自真实履历，数据驱动架构。
> 定位：面向 HR / 面试官的高级产品经理求职作品集。

## 结构
- `index.html` — 5 板块骨架（首页 / 关于我 / 技能 / 作品 / 联系），正文为渲染钩子
- `favicon.svg` — 站点图标（渐变圆点，与品牌视觉一致）
- `data.js` — **全站唯一内容源**：改项目、改时间轴、改技能、改联系方式只动这个文件
- `script.js` — 渲染层（读 SITE_DATA 生成 DOM）+ 交互层（导航跟随/打字机/快捷键/粒子背景）
- `style.css` — 深色主题样式系统（v0 风格，分节注释导航）
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
2026-08-29 初版（v0 风格虚构占位内容），见 git 基线 commit `78199a2`；初版截图 PNG 与 debug.log 保留作历史归档。
