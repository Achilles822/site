# 笔记

中文个人站点。文章和关于我是仓库里的 Markdown。

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 。

```bash
pnpm test
```

## 写文章

在 `content/posts/` 新增一个 `.md` 文件。文件名是网址 slug。

```yaml
---
title: 窗台上的光
date: 2026-11-20
description: 十一月的早晨，光先落到杯子上。
cover: /covers/morning-light.jpg
pinned: true
---
```

`title` 和 `date` 必填。`pinned` 省略表示不置顶。封面图片放在 `public/covers/`。关于我写在 `content/about.md`。

## 数据库

复制 `.env.example` 为 `.env.local` 后可以填写 `DATABASE_URL`。这一版页面不查询数据库，不填也能运行。

## GitHub Pages

`pnpm build` 把站点导出到 `out/`。推送到 `master` 后，GitHub Actions 会发布到 `https://achilles822.github.io/site/`。第一次使用时，在仓库 Settings → Pages 把 Source 选成 GitHub Actions。

## Vercel

仓库根目录有 `vercel.json`，默认用 `pnpm install` 与 `pnpm build` 构建 Next.js 项目。

| 平台 | `BASE_PATH` / `NEXT_PUBLIC_BASE_PATH` |
| --- | --- |
| GitHub Pages（Actions） | 设为 `/site` |
| Vercel | **不要设置**（站点在域名根路径） |

在 Vercel 上导入 GitHub 仓库 `Achilles822/site`，生产分支选 `master`。本地若已安装全局 CLI，可用项目目录下的 `vercel link` 关联；凭证勿提交（`.vercel` 已在 `.gitignore`）。

```bash
vercel login
vercel link
```

CLI 建议使用 Node.js 20+。若全局 `vercel` 在 Windows 上无法下载原生二进制，可安装 `vercel@65.16.0`，或由 Cursor 已配置的 Vercel MCP 管理项目与部署。
