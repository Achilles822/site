# 个人站点 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 做一个中文个人站点：首页用封面卡片列出全部 Markdown 文章，置顶在最前并标 `※`，文章页和关于我直接渲染 Markdown。

**Architecture:** 服务端组件用 `fs` 读取 `content/` 里的 Markdown，`gray-matter` 拆文首，`react-markdown` 加 `remark-gfm` 渲染正文。排序、校验和封面路径判断放在 `lib/posts.ts`，用 Vitest 锁住。Neon 只提供 `lib/db.ts`，没有任何调用方。样式是全局 CSS 变量，字号按规格写死。

**Tech Stack:** Next.js App Router、TypeScript、pnpm、Vitest、gray-matter、react-markdown、remark-gfm、@neondatabase/serverless、next/font。

**Spec:** `docs/superpowers/specs/2026-11-25-personal-site-design.md`

## Global Constraints

- Next.js App Router 与 TypeScript。实现时使用当时的当前稳定版。
- 包管理用 pnpm。
- 样式是全局 CSS 变量，按规格字号写死。不引入组件库，也不用另一套间距刻度去近似这些尺寸。
- 内容在 `content/` 的 Markdown 文件里。
- 安装 `@neondatabase/serverless`，提供 `.env.example` 里的 `DATABASE_URL`，以及 `lib/db.ts`。这一版没有任何查询。
- 不设计、不实现 Google 登录、Neon 用户表、Stripe、购买记录、付费墙。
- 不使用 MDX、Velite，不在正文里嵌入 React 组件。
- 不下载、不内联佳士得的 ABC Arizona 字体文件。
- 推送使用 `git push origin master`。`origin` 是 `https://github.com/Achilles822/site.git`。
- 仓库已有 `docs/`，不要运行 `create-next-app` 覆盖现有文件。按本计划逐个写入。
- 导入放在文件顶部。对 `"empty" | "missing" | "ready"` 做 switch 时，default 用 `never` 检查。

## Review Focus

- 日期不是合法的 `YYYY-MM-DD`（如 `2026-13-40` 或 `2026/11/25`）时，应抛出并指出该文件缺少 `date`，不能排进列表。测试在 Task 3。
- 省略 `description` 时，文章仍能解析，摘要是空字符串，不抛错。测试在 Task 3。
- `cover` 写成 `/covers/../../package.json` 时，判定为缺失文件，不读取 `public/` 之外的路径。测试在 Task 3。
- `content/posts` 里的 `.txt` 和子目录被忽略，不让列表失败。测试在 Task 3。
- `pinned` 写成字符串 `"true"` 时抛出，不能把字符串当成置顶。测试在 Task 3。

## File Structure

| 文件 | 职责 |
| --- | --- |
| `AGENTS.md` | 内容格式、字体尺寸、这一版禁止的登录和查询 |
| `README.md` | 安装、运行、文章放在哪里 |
| `package.json` / `tsconfig.json` / `next.config.ts` / `vitest.config.ts` | 工程配置 |
| `.env.example` | `DATABASE_URL` 占位，不含真实连接 |
| `.gitignore` | 忽略依赖、构建产物和本地 env |
| `lib/db.ts` | 被调用时才创建 Neon 客户端 |
| `lib/paths.ts` | 内容目录和 `public/` 的绝对路径 |
| `lib/site.ts` | 站名常量 |
| `lib/posts.ts` | 解析、校验、排序、读文章、判断封面 |
| `lib/about.ts` | 读取关于我 |
| `lib/markdown.tsx` | 共享 Markdown 渲染 |
| `app/globals.css` | 规格里的字号、颜色、栅格 |
| `app/layout.tsx` | 字体、顶栏、站名 |
| `components/site-header.tsx` | 顶栏 |
| `components/post-card.tsx` | 首页卡片 |
| `app/page.tsx` | 首页列表和空状态 |
| `app/posts/[slug]/page.tsx` | 文章页 |
| `app/about/page.tsx` | 关于我 |
| `app/not-found.tsx` | 404 |
| `content/about.md` | 示例关于我 |
| `content/posts/morning-light.md` | 置顶示例 |
| `content/posts/train-notes.md` | 普通示例 |
| `tests/db.test.ts` | 缺少连接时才抛错 |
| `tests/posts.test.ts` | 排序、文首、封面路径 |
| `tests/about.test.ts` | 关于我缺失时抛错 |
| `tests/markdown.test.tsx` | 原始 HTML 不执行，GFM 删除线生效 |
| `tests/post-card.test.tsx` | 置顶记号只在卡片上 |

---

### Task 1: AGENTS.md 与 README

**Files:**
- Create: `AGENTS.md`
- Create: `README.md`

**Interfaces:**
- Consumes: 规格里的路径、字号和禁止项
- Produces: 后续任务不得违反 `AGENTS.md` 里的边界

- [ ] **Step 1: 写入 `AGENTS.md`**

```markdown
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
- 站名常量是 `笔记`，放在 `lib/site.ts` 的 `siteName`。顶栏和浏览器标题都用它。

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
```

- [ ] **Step 2: 写入 `README.md`**

```markdown
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
```

- [ ] **Step 3: 确认两份文档里有边界**

Run: `rg -n "getSql|ABC Arizona|content/posts" AGENTS.md README.md`

Expected: `AGENTS.md` 同时出现「不要在页面、布局或组件里调用 `getSql()`」和「ABC Arizona」。`README.md` 出现 `content/posts/` 和 `pnpm dev`。

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md README.md
git commit -m "写站点约定和运行说明，把内容格式定在代码之前。"
```

### Task 2: 工程骨架与 Neon 客户端

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `lib/db.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: 无
- Produces: `getSql(): NeonQueryFunction<false, false>`。缺少 `DATABASE_URL` 时抛出 `Error`，消息为 `缺少 DATABASE_URL`。模块被导入时不抛错。

- [ ] **Step 1: 写会失败的测试**

```typescript
import { afterEach, describe, expect, it } from "vitest"
import { getSql } from "../lib/db"

const original = process.env.DATABASE_URL

afterEach(() => {
  if (original === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = original
})

describe("getSql", () => {
  it("缺少 DATABASE_URL 时抛出明确错误", () => {
    delete process.env.DATABASE_URL
    expect(() => getSql()).toThrow("缺少 DATABASE_URL")
  })

  it("导入模块时不连接数据库", async () => {
    delete process.env.DATABASE_URL
    await expect(import("../lib/db")).resolves.toBeTruthy()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm exec vitest run tests/db.test.ts`

Expected: FAIL，因为 `vitest` 或 `../lib/db` 还不存在。

- [ ] **Step 3: 写入工程文件和最小实现**

`package.json`：

```json
{
  "name": "site",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  }
}
```

然后安装：

```bash
pnpm add next@latest react@latest react-dom@latest gray-matter react-markdown remark-gfm @neondatabase/serverless
pnpm add -D typescript @types/react @types/react-dom @types/node vitest
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.ts`：

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {}

export default nextConfig
```

`next-env.d.ts`：

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`vitest.config.ts`：

```typescript
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
  },
})
```

`.gitignore`：

```gitignore
node_modules
.next
.env
.env*.local
```

`.env.example`：

```bash
DATABASE_URL=
```

`lib/db.ts`：

```typescript
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

export function getSql(): NeonQueryFunction<false, false> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("缺少 DATABASE_URL")
  }
  return neon(databaseUrl)
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test`

Expected: PASS，2 tests。

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts next-env.d.ts vitest.config.ts .gitignore .env.example lib/db.ts tests/db.test.ts
git commit -m "接上 Next.js 和 Neon 客户端，没有连接字符串时页面仍可开发。"
```

### Task 3: 文章解析、排序和封面

**Files:**
- Create: `lib/paths.ts`
- Create: `lib/posts.ts`
- Test: `tests/posts.test.ts`

**Interfaces:**
- Consumes: 无
- Produces:
  - `type Post = { slug: string; title: string; date: string; description: string; cover: string | undefined; pinned: boolean; body: string }`
  - `parsePost(slug: string, raw: string): Post`
  - `sortPosts(posts: readonly Post[]): Post[]`
  - `formatPostDate(date: string): string`
  - `resolveCover(cover: string | undefined, publicDir: string): "empty" | "missing" | "ready"`
  - `listPosts(postsDir: string): Post[]`
  - `readPost(postsDir: string, slug: string): Post | null`
  - `postsDir`、`publicDir`、`aboutPath` 从 `lib/paths.ts` 导出，都是绝对路径

- [ ] **Step 1: 写会失败的测试**

```typescript
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  formatPostDate,
  listPosts,
  parsePost,
  readPost,
  resolveCover,
  sortPosts,
  type Post,
} from "../lib/posts"

function post(partial: Partial<Post> & Pick<Post, "slug" | "date">): Post {
  return {
    title: partial.slug,
    description: "",
    cover: undefined,
    pinned: false,
    body: "",
    ...partial,
  }
}

describe("parsePost", () => {
  it("读取文首和正文", () => {
    const parsed = parsePost(
      "morning-light",
      "---\ntitle: 窗台上的光\ndate: 2026-11-20\ndescription: 光先落到杯子上\ncover: /covers/a.jpg\npinned: true\n---\n正文\n",
    )
    expect(parsed).toMatchObject({
      slug: "morning-light",
      title: "窗台上的光",
      date: "2026-11-20",
      description: "光先落到杯子上",
      cover: "/covers/a.jpg",
      pinned: true,
      body: "正文\n",
    })
  })

  it("省略 description、cover 和 pinned 时不抛错", () => {
    const parsed = parsePost("note", "---\ntitle: 一篇\ndate: 2026-11-01\n---\n")
    expect(parsed.description).toBe("")
    expect(parsed.cover).toBeUndefined()
    expect(parsed.pinned).toBe(false)
  })

  it("缺少 title 时指出文件", () => {
    expect(() => parsePost("note", "---\ndate: 2026-11-01\n---\n")).toThrow(
      "content/posts/note.md 缺少 title",
    )
  })

  it("非法日期算作缺少 date", () => {
    expect(() => parsePost("note", "---\ntitle: 一篇\ndate: 2026-13-40\n---\n")).toThrow(
      "content/posts/note.md 缺少 date",
    )
    expect(() => parsePost("note", "---\ntitle: 一篇\ndate: 2026/11/25\n---\n")).toThrow(
      "content/posts/note.md 缺少 date",
    )
  })

  it("pinned 是字符串时抛出", () => {
    expect(() =>
      parsePost("note", "---\ntitle: 一篇\ndate: 2026-11-01\npinned: \"true\"\n---\n"),
    ).toThrow("content/posts/note.md 的 pinned 必须是布尔值")
  })
})

describe("sortPosts", () => {
  it("置顶在前，各组内部日期从新到旧，同日按 slug 升序", () => {
    const sorted = sortPosts([
      post({ slug: "b", date: "2026-01-02", pinned: false }),
      post({ slug: "a", date: "2026-01-02", pinned: true }),
      post({ slug: "c", date: "2026-03-01", pinned: false }),
      post({ slug: "d", date: "2026-02-01", pinned: true }),
    ])
    expect(sorted.map((item) => item.slug)).toEqual(["d", "a", "c", "b"])
  })
})

describe("formatPostDate", () => {
  it("格式化为不补零的中文日期", () => {
    expect(formatPostDate("2026-11-25")).toBe("2026年11月25日")
  })
})

describe("resolveCover", () => {
  it("没有 cover 时是 empty", () => {
    expect(resolveCover(undefined, tmpdir())).toBe("empty")
  })

  it("文件存在时是 ready，路径逃出 public 时是 missing", () => {
    const publicDir = mkdtempSync(path.join(tmpdir(), "public-"))
    mkdirSync(path.join(publicDir, "covers"))
    writeFileSync(path.join(publicDir, "covers", "a.jpg"), "img")
    writeFileSync(path.join(publicDir, "..", "outside.txt"), "secret")
    expect(resolveCover("/covers/a.jpg", publicDir)).toBe("ready")
    expect(resolveCover("/covers/missing.jpg", publicDir)).toBe("missing")
    expect(resolveCover("/covers/../../outside.txt", publicDir)).toBe("missing")
  })
})

describe("listPosts 与 readPost", () => {
  it("忽略非 md 文件，并按规则排序", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "posts-"))
    mkdirSync(path.join(dir, "nested"))
    writeFileSync(path.join(dir, "notes.txt"), "ignore")
    writeFileSync(path.join(dir, "b.md"), "---\ntitle: 乙\ndate: 2026-01-02\n---\n")
    writeFileSync(
      path.join(dir, "a.md"),
      "---\ntitle: 甲\ndate: 2026-01-01\npinned: true\n---\n",
    )
    expect(listPosts(dir).map((item) => item.slug)).toEqual(["a", "b"])
    expect(readPost(dir, "b")?.title).toBe("乙")
    expect(readPost(dir, "../package")).toBeNull()
    expect(readPost(dir, "missing")).toBeNull()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm exec vitest run tests/posts.test.ts`

Expected: FAIL，`../lib/posts` 不存在。

- [ ] **Step 3: 写入 `lib/paths.ts` 和 `lib/posts.ts`**

`lib/paths.ts`：

```typescript
import path from "node:path"

export const postsDir = path.join(process.cwd(), "content", "posts")
export const publicDir = path.join(process.cwd(), "public")
export const aboutPath = path.join(process.cwd(), "content", "about.md")
```

`lib/posts.ts`：

```typescript
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export type Post = {
  slug: string
  title: string
  date: string
  description: string
  cover: string | undefined
  pinned: boolean
  body: string
}

export type CoverState = "empty" | "missing" | "ready"

export function parsePost(slug: string, raw: string): Post {
  const parsed = matter(raw)
  const data: Record<string, unknown> = parsed.data
  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new Error(`content/posts/${slug}.md 缺少 title`)
  }
  if (typeof data.date !== "string" || !isIsoDate(data.date)) {
    throw new Error(`content/posts/${slug}.md 缺少 date`)
  }
  if (data.pinned !== undefined && typeof data.pinned !== "boolean") {
    throw new Error(`content/posts/${slug}.md 的 pinned 必须是布尔值`)
  }
  if (data.cover !== undefined && typeof data.cover !== "string") {
    throw new Error(`content/posts/${slug}.md 的 cover 必须是字符串`)
  }
  if (data.description !== undefined && typeof data.description !== "string") {
    throw new Error(`content/posts/${slug}.md 的 description 必须是字符串`)
  }
  return {
    slug,
    title: data.title,
    date: data.date,
    description: typeof data.description === "string" ? data.description : "",
    cover: typeof data.cover === "string" ? data.cover : undefined,
    pinned: data.pinned === true,
    body: parsed.content.trimStart(),
  }
}

export function sortPosts(posts: readonly Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    if (a.slug < b.slug) return -1
    if (a.slug > b.slug) return 1
    return 0
  })
}

export function formatPostDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match || !isIsoDate(date)) throw new Error(`日期无效：${date}`)
  return `${match[1]}年${Number(match[2])}月${Number(match[3])}日`
}

export function resolveCover(cover: string | undefined, publicDir: string): CoverState {
  if (!cover) return "empty"
  if (!cover.startsWith("/") || cover.includes("\\")) return "missing"
  const publicRoot = path.resolve(publicDir)
  const target = path.resolve(publicRoot, cover.slice(1))
  const staysInside = target === publicRoot || target.startsWith(publicRoot + path.sep)
  if (!staysInside || !existsSync(target) || !statSync(target).isFile()) return "missing"
  return "ready"
}

export function listPosts(dir: string): Post[] {
  if (!existsSync(dir)) return []
  const slugs = readdirSync(dir).flatMap((name) => {
    const fullPath = path.join(dir, name)
    if (!name.endsWith(".md") || !statSync(fullPath).isFile()) return []
    return [name.slice(0, -".md".length)]
  })
  return sortPosts(slugs.map((slug) => parsePost(slug, readFileSync(path.join(dir, `${slug}.md`), "utf8"))))
}

export function readPost(dir: string, slug: string): Post | null {
  if (!/^[A-Za-z0-9-]+$/.test(slug)) return null
  const fullPath = path.join(dir, `${slug}.md`)
  if (!existsSync(fullPath) || !statSync(fullPath).isFile()) return null
  return parsePost(slug, readFileSync(fullPath, "utf8"))
}

function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const utc = new Date(Date.UTC(year, month - 1, day))
  return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
}
```

`gray-matter` 会在正文前留一个换行。`trimStart()` 去掉开头空白后，上面那则测试的 `body` 就是 `"正文\n"`。

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm exec vitest run tests/posts.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add lib/paths.ts lib/posts.ts tests/posts.test.ts
git commit -m "用测试锁住文章排序、文首校验和封面路径。"
```

### Task 4: 关于我

**Files:**
- Create: `lib/about.ts`
- Test: `tests/about.test.ts`

**Interfaces:**
- Consumes: 无
- Produces:
  - `type About = { title: string; body: string }`
  - `parseAbout(raw: string): About`
  - `readAbout(filePath: string): About`
  - 文件不存在时抛出 `缺少 content/about.md`
  - 缺少 title 时抛出 `content/about.md 缺少 title`

- [ ] **Step 1: 写会失败的测试**

```typescript
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { parseAbout, readAbout } from "../lib/about"

describe("about", () => {
  it("读取标题和正文", () => {
    expect(parseAbout("---\ntitle: 关于我\n---\n一段介绍。\n")).toEqual({
      title: "关于我",
      body: "一段介绍。",
    })
  })

  it("缺少 title 时抛出", () => {
    expect(() => parseAbout("---\n---\n正文")).toThrow("content/about.md 缺少 title")
  })

  it("文件不存在时抛出", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "about-"))
    expect(() => readAbout(path.join(dir, "about.md"))).toThrow("缺少 content/about.md")
  })

  it("读到磁盘上的文件", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "about-"))
    const filePath = path.join(dir, "about.md")
    writeFileSync(filePath, "---\ntitle: 关于我\n---\n你好。\n")
    expect(readAbout(filePath)).toEqual({ title: "关于我", body: "你好。" })
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm exec vitest run tests/about.test.ts`

Expected: FAIL，`../lib/about` 不存在。

- [ ] **Step 3: 写入 `lib/about.ts`**

```typescript
import { existsSync, readFileSync } from "node:fs"
import matter from "gray-matter"

export type About = {
  title: string
  body: string
}

export function parseAbout(raw: string): About {
  const parsed = matter(raw)
  const title = parsed.data.title
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("content/about.md 缺少 title")
  }
  return { title, body: parsed.content.trim() }
}

export function readAbout(filePath: string): About {
  if (!existsSync(filePath)) throw new Error("缺少 content/about.md")
  return parseAbout(readFileSync(filePath, "utf8"))
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm exec vitest run tests/about.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add lib/about.ts tests/about.test.ts
git commit -m "读取关于我的 Markdown，缺文件或标题时直接失败。"
```

### Task 5: Markdown 渲染

**Files:**
- Create: `lib/markdown.tsx`
- Test: `tests/markdown.test.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: 无
- Produces: `function MarkdownBody({ source }: { source: string }): JSX.Element`。使用 `react-markdown` 的同步组件和 `remark-gfm`。不安装、不传入 `rehype-raw`。

- [ ] **Step 1: 安装渲染测试依赖**

Run:

```bash
pnpm add -D jsdom @testing-library/react
```

`vitest.config.ts` 保持 `environment: "node"`。每个 `*.test.tsx` 文件第一行写 `// @vitest-environment jsdom`。

- [ ] **Step 2: 写会失败的测试**

```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MarkdownBody } from "../lib/markdown"

describe("MarkdownBody", () => {
  it("把删除线渲染成 del", () => {
    render(<MarkdownBody source={"~~划掉~~"} />)
    expect(document.querySelector("del")?.textContent).toBe("划掉")
  })

  it("不把原始 HTML 当成脚本执行", () => {
    const { container } = render(<MarkdownBody source={'<script>alert(1)</script>'} />)
    expect(container.querySelector("script")).toBeNull()
    expect(screen.getByText("<script>alert(1)</script>")).toBeTruthy()
  })
})
```

如果 `react-markdown` 把原始 HTML 放进文本节点但拆开了标签名，断言改成 `container.innerHTML` 不包含 `"<script>"`，并且可见文本里仍能看到 `alert(1)`。不要为了通过测试去安装 `rehype-raw`。

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm exec vitest run tests/markdown.test.tsx`

Expected: FAIL，`../lib/markdown` 不存在。

- [ ] **Step 4: 写入 `lib/markdown.tsx`**

```tsx
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownBody({ source }: { source: string }) {
  return <Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>
}
```

如果当前 `react-markdown` 没有默认导出，改成文档中的具名同步组件 `Markdown`，仍然不使用 `MarkdownAsync` 或 `MarkdownHooks`。

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm exec vitest run tests/markdown.test.tsx tests/posts.test.ts tests/db.test.ts`

Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add lib/markdown.tsx tests/markdown.test.tsx package.json pnpm-lock.yaml
git commit -m "用 Markdown 直接渲染正文，原始 HTML 不进入页面。"
```

### Task 6: 字体、顶栏和全局样式

**Files:**
- Create: `lib/site.ts`
- Create: `components/site-header.tsx`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`（先放站名，Task 7 换成列表）

**Interfaces:**
- Consumes: `siteName`
- Produces: `export const siteName = "笔记"`。顶栏类名 `site-header`、`site-name`、`nav-link`。布局把四个字体变量挂在 `html` 上。

- [ ] **Step 1: 写入 `lib/site.ts` 和顶栏**

`lib/site.ts`：

```typescript
export const siteName = "笔记"
```

`components/site-header.tsx`：

```tsx
import { siteName } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-name serif" href="/">
        {siteName}
      </a>
      <a className="nav-link" href="/about">
        关于我
      </a>
    </header>
  )
}
```

- [ ] **Step 2: 写入 `app/globals.css`**

```css
:root {
  --ink: #222222;
  --paper: #ffffff;
  --cover-empty: #e8e8e8;
  --cover-missing: #222222;
}

* { box-sizing: border-box; }

html {
  background: var(--paper);
  color: var(--ink);
}

body {
  margin: 0;
  font-family: var(--font-source-sans), var(--font-noto-sans), sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.7;
}

a { color: inherit; }

.serif {
  font-family: var(--font-source-serif), var(--font-noto-serif), serif;
  font-weight: 300;
  line-height: 1.2;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 48px;
  border-bottom: 1px solid var(--ink);
}

.site-name {
  font-size: 24px;
  text-decoration: none;
}

.nav-link {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.2;
  text-decoration: none;
}

.page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 48px 80px;
}

.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 1100px) {
  .list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.card {
  display: block;
  color: inherit;
  text-decoration: none;
}

.cover {
  aspect-ratio: 3 / 2;
  width: 100%;
  overflow: hidden;
  background: var(--cover-empty);
}

.cover-missing { background: var(--cover-missing); }

.cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 150ms linear;
}

.card:hover img { opacity: 0.92; }

.card-meta {
  margin: 16px 0 0;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.2;
}

.card-title {
  margin: 8px 0 0;
  font-size: 24px;
}

.card-description {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.empty-posts {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.article-title {
  margin: 0;
  font-size: 40px;
}

.article-date {
  margin: 16px 0 0;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.2;
}

.article-cover {
  margin-top: 24px;
}

.article-body {
  max-width: 38em;
  margin-top: 24px;
}

.article-body :is(h1, h2, h3) {
  font-family: var(--font-source-serif), var(--font-noto-serif), serif;
  font-weight: 300;
  line-height: 1.2;
  font-size: 24px;
}

.article-body img {
  max-width: 100%;
  height: auto;
}

.not-found-link {
  font-size: 16px;
}
```

- [ ] **Step 3: 写入布局和临时首页**

`app/layout.tsx`：

```tsx
import type { Metadata } from "next"
import { Noto_Sans_SC, Noto_Serif_SC, Source_Sans_3, Source_Serif_4 } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { siteName } from "@/lib/site"
import "./globals.css"

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
  variable: "--font-noto-serif",
  preload: false,
})

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-noto-sans",
  preload: false,
})

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVariables = [sourceSerif.variable, sourceSans.variable, notoSerif.variable, notoSans.variable].join(" ")
  return (
    <html lang="zh-CN" className={fontVariables}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
```

如果 `next/font` 报某个字体是可变字体、不能传 `weight`，删掉该字体的 `weight`，保留 CSS 里的 `font-weight`。如果报某个字体不是可变字体、必须传 `weight`，给 Source 两套补上规格里的字重：衬线 `"300"`，无衬线 `["300", "400"]`。

`app/page.tsx`：

```tsx
import { siteName } from "@/lib/site"

export default function HomePage() {
  return <main className="page">{siteName}</main>
}
```

- [ ] **Step 4: 确认可以编译**

Run: `pnpm exec tsc --noEmit`

Expected: 退出码 0。若字体类型报错，只按 Step 3 的规则改 `weight`，不要改字号。

- [ ] **Step 5: Commit**

```bash
git add lib/site.ts components/site-header.tsx app/globals.css app/layout.tsx app/page.tsx
git commit -m "定下站名、顶栏和按规格写死的字号。"
```

### Task 7: 首页卡片

**Files:**
- Create: `components/post-card.tsx`
- Create: `components/cover-frame.tsx`
- Modify: `app/page.tsx`
- Test: `tests/post-card.test.tsx`

**Interfaces:**
- Consumes: `Post`、`CoverState`、`formatPostDate`、`listPosts`、`resolveCover`、`postsDir`、`publicDir`
- Produces:
  - `CoverFrame({ state, src }: { state: CoverState; src: string | undefined })`
  - `PostCard({ post, cover }: { post: Post; cover: CoverState })`
  - 首页在没有文章时渲染文本 `还没有文章。`

- [ ] **Step 1: 写会失败的测试**

```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PostCard } from "../components/post-card"
import type { Post } from "../lib/posts"

const pinned: Post = {
  slug: "morning-light",
  title: "窗台上的光",
  date: "2026-11-20",
  description: "光先落到杯子上",
  cover: undefined,
  pinned: true,
  body: "",
}

describe("PostCard", () => {
  it("置顶卡片有星号、中文日期和整卡链接", () => {
    render(<PostCard post={pinned} cover="empty" />)
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe("/posts/morning-light")
    expect(link.textContent).toContain("※")
    expect(link.textContent).toContain("2026年11月20日")
    expect(link.textContent).toContain("窗台上的光")
    expect(link.textContent).toContain("光先落到杯子上")
  })

  it("未置顶卡片没有星号", () => {
    render(<PostCard post={{ ...pinned, pinned: false }} cover="missing" />)
    expect(screen.getByRole("link").textContent).not.toContain("※")
    expect(document.querySelector(".cover-missing")).toBeTruthy()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm exec vitest run tests/post-card.test.tsx`

Expected: FAIL，卡片组件不存在。

- [ ] **Step 3: 写入封面、卡片和首页**

`components/cover-frame.tsx`：

```tsx
import type { CoverState } from "@/lib/posts"

export function CoverFrame({ state, src }: { state: CoverState; src: string | undefined }) {
  switch (state) {
    case "empty":
      return <div className="cover" />
    case "missing":
      return <div className="cover cover-missing" />
    case "ready":
      return (
        <div className="cover">
          <img src={src} alt="" />
        </div>
      )
    default: {
      const exhaustive: never = state
      return exhaustive
    }
  }
}
```

`components/post-card.tsx`：

```tsx
import { CoverFrame } from "@/components/cover-frame"
import { formatPostDate, type CoverState, type Post } from "@/lib/posts"

export function PostCard({ post, cover }: { post: Post; cover: CoverState }) {
  return (
    <a className="card" href={`/posts/${post.slug}`}>
      <CoverFrame state={cover} src={post.cover} />
      <p className="card-meta">
        {post.pinned ? "※ " : ""}
        {formatPostDate(post.date)}
      </p>
      <h2 className="card-title serif">{post.title}</h2>
      {post.description ? <p className="card-description">{post.description}</p> : null}
    </a>
  )
}
```

`app/page.tsx`：

```tsx
import { PostCard } from "@/components/post-card"
import { postsDir, publicDir } from "@/lib/paths"
import { listPosts, resolveCover } from "@/lib/posts"

export default function HomePage() {
  const posts = listPosts(postsDir)
  return (
    <main className="page">
      {posts.length === 0 ? (
        <p className="empty-posts">还没有文章。</p>
      ) : (
        <ul className="list">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} cover={resolveCover(post.cover, publicDir)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add components/cover-frame.tsx components/post-card.tsx app/page.tsx tests/post-card.test.tsx
git commit -m "首页用封面卡片列出文章，置顶显示在日期前。"
```

### Task 8: 文章页、关于我、404 和示例内容

**Files:**
- Create: `app/posts/[slug]/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/not-found.tsx`
- Create: `content/about.md`
- Create: `content/posts/morning-light.md`
- Create: `content/posts/train-notes.md`
- Test: `tests/article-page.test.tsx`

**Interfaces:**
- Consumes: `readPost`、`readAbout`、`resolveCover`、`formatPostDate`、`MarkdownBody`、`CoverFrame`、`postsDir`、`publicDir`、`aboutPath`
- Produces: `/posts/[slug]`、`/about`、404 文案 `找不到这篇文章` 与 `返回首页`

- [ ] **Step 1: 写会失败的测试**

文章页组件需要能在测试里直接渲染，所以把页面主体抽成 `components/article-view.tsx`，页面文件只负责读文件和 `notFound()`。

```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleView } from "../components/article-view"
import type { Post } from "../lib/posts"

const post: Post = {
  slug: "morning-light",
  title: "窗台上的光",
  date: "2026-11-20",
  description: "这句摘要不该出现在文章页",
  cover: undefined,
  pinned: true,
  body: "正文第一段。",
}

describe("ArticleView", () => {
  it("显示标题、日期和正文，不显示置顶记号和摘要", () => {
    render(<ArticleView post={post} cover="empty" />)
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("窗台上的光")
    expect(screen.getByText("2026年11月20日")).toBeTruthy()
    expect(screen.getByText("正文第一段。")).toBeTruthy()
    expect(document.body.textContent).not.toContain("※")
    expect(document.body.textContent).not.toContain("这句摘要不该出现在文章页")
    expect(document.querySelector(".cover")).toBeNull()
  })

  it("封面文件缺失时显示深色画框", () => {
    render(<ArticleView post={{ ...post, cover: "/covers/missing.jpg" }} cover="missing" />)
    expect(document.querySelector(".cover-missing")).toBeTruthy()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm exec vitest run tests/article-page.test.tsx`

Expected: FAIL，`ArticleView` 不存在。

- [ ] **Step 3: 写入文章视图、三个页面和示例稿**

`components/article-view.tsx`：

```tsx
import { CoverFrame } from "@/components/cover-frame"
import { MarkdownBody } from "@/lib/markdown"
import { formatPostDate, type CoverState, type Post } from "@/lib/posts"

export function ArticleView({ post, cover }: { post: Post; cover: CoverState }) {
  return (
    <article className="page">
      <h1 className="article-title serif">{post.title}</h1>
      <p className="article-date">{formatPostDate(post.date)}</p>
      {cover === "empty" ? null : (
        <div className="article-cover">
          <CoverFrame state={cover} src={post.cover} />
        </div>
      )}
      <div className="article-body">
        <MarkdownBody source={post.body} />
      </div>
    </article>
  )
}
```

`app/posts/[slug]/page.tsx`：

```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleView } from "@/components/article-view"
import { postsDir, publicDir } from "@/lib/paths"
import { readPost, resolveCover } from "@/lib/posts"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = readPost(postsDir, slug)
  if (!post) return {}
  return { title: post.title }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = readPost(postsDir, slug)
  if (!post) notFound()
  return <ArticleView post={post} cover={resolveCover(post.cover, publicDir)} />
}
```

如果安装到的 Next.js 类型把 `params` 定为同步对象，改成直接解构 `{ slug }`，读取逻辑不变。

`app/about/page.tsx`：

```tsx
import type { Metadata } from "next"
import { MarkdownBody } from "@/lib/markdown"
import { readAbout } from "@/lib/about"
import { aboutPath } from "@/lib/paths"

export const metadata: Metadata = { title: "关于我" }

export default function AboutPage() {
  const about = readAbout(aboutPath)
  return (
    <article className="page">
      <h1 className="article-title serif">{about.title}</h1>
      <div className="article-body">
        <MarkdownBody source={about.body} />
      </div>
    </article>
  )
}
```

`app/not-found.tsx`：

```tsx
export default function NotFound() {
  return (
    <main className="page">
      <h1 className="article-title serif">找不到这篇文章</h1>
      <p>
        <a className="not-found-link" href="/">
          返回首页
        </a>
      </p>
    </main>
  )
}
```

`content/posts/morning-light.md`：

```markdown
---
title: 窗台上的光
date: 2026-11-20
description: 十一月的早晨，光先落到杯子上，再慢慢移到稿纸边缘。
pinned: true
---

杯子还是昨晚留下的。光移过来的时候，纸上的铅笔印比夜里看得清楚。

我把这一页留在这里，等换成自己的文章。
```

`content/posts/train-notes.md`：

```markdown
---
title: 夜车记下的三行
date: 2026-11-02
description: 车厢里的灯很稳，窗外的站名一闪就过去了。
---

第一行是到站的时间。第二行写错了，划掉以后没有补。第三行只剩一个地名。
```

`content/about.md`：

```markdown
---
title: 关于我
---

我在这里记下读过的东西，和还没想完的句子。这一页会换成我自己的介绍。
```

- [ ] **Step 4: 运行测试并确认页面没有查询数据库**

Run: `pnpm test`

Expected: PASS。

Run: `rg -n "getSql|@/lib/db" app components lib/markdown.tsx lib/posts.ts lib/about.ts lib/site.ts`

Expected: 无匹配。`lib/db.ts` 自己不在这次搜索范围里。

- [ ] **Step 5: 启动站点并在浏览器里走四条路径**

Run: `pnpm dev`

在浏览器里确认：

- `/` 第一张卡片是「窗台上的光」，日期前有 `※`，第二张是「夜车记下的三行」且没有 `※`。两张封面都是浅灰画框。卡片标题约 24px，纸色白，字色接近 `#222`。
- 点进 `/posts/morning-light`，能看见正文，看不见摘要，也没有 `※`。
- `/about` 能看见「关于我」和介绍段落。
- `/posts/does-not-exist` 显示「找不到这篇文章」和「返回首页」。点链接回到 `/`。
- 把窗口缩到窄于 1100px，卡片变成一列；拉回宽屏，变成三列。

- [ ] **Step 6: Commit**

```bash
git add app/posts app/about app/not-found.tsx components/article-view.tsx content tests/article-page.test.tsx
git commit -m "补上文章页、关于我和示例稿，未知地址回到首页。"
```

- [ ] **Step 7: 用 HTTPS 推送**

```bash
git push origin master
```

Expected: `origin` 是 `https://github.com/Achilles822/site.git`，`master` 更新。
