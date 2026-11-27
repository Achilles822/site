# AGENTS.md

这个仓库是中文个人站点。改代码前先读 `docs/superpowers/specs/2026-11-25-personal-site-design.md`。

## 内容

- 文章：`content/posts/<slug>.md`。slug 是文件名，用英文或拼音。
- 关于我：`content/about.md`。
- 封面文件放在 `public/covers/`。文首写 `cover: /covers/<file>`。
- 文章文首字段：`title`（必填字符串）、`date`（必填，`YYYY-MM-DD`）、`description`（可省略，省略后摘要为空）、`cover`（可省略）、`pinned`（可省略，只有布尔 `true` 才置顶）。
- 关于我文首只有必填的 `title`。
- 正文用 Markdown 直接渲染。不要引入 MDX，不要在正文里嵌 React 组件。

## 排序与页面

- 置顶在最前。置顶之间、未置顶之间都按日期从新到旧。日期相同按 slug 升序。
- `※` 只出现在首页卡片的日期前面。
- 日期显示为 `2026年11月25日` 这种不补零的中文格式。
- 站名常量是 `EmptySet Software`，放在 `lib/site.ts` 的 `siteName`。顶栏和浏览器标题都用它。页脚英文名为 `siteNameEn`（EmptySet Software）。

## 字体

不要下载或内联佳士得网站上的 ABC Arizona 文件。那是授权给佳士得的商业字体。

- 标题：Source Serif 4 + Noto Serif SC，字重 300，行高 1.2。顶栏站名 24px，卡片标题 24px，文章和关于我标题 40px。
- 日期、顶栏链接、置顶记号：Source Sans 3 + Noto Sans SC，14px，字重 300，行高 1.2。
- 卡片摘要：16px，字重 400，行高 1.5。
- 正文：18px，字重 400，行高 1.7，行宽 38em。
- 纸色 `#ffffff`，字色 `#222222`。

## 这一版不要做

- 不要接 Google 登录，不要建用户表，不要接 Stripe，不要做付费墙。
- 不要在页面、布局或组件里调用 `getSql()` 或查询 Neon。
- 没有 `DATABASE_URL` 时，首页、文章和关于我必须仍能打开。

## 托管

`pnpm build` 静态导出到 `out/`，由 GitHub Actions 发布到 GitHub Pages。项目页前缀是 `/site`，写在构建环境变量 `BASE_PATH` 和 `NEXT_PUBLIC_BASE_PATH`。本地开发留空。
