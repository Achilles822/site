import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { JSON_SCHEMA, load as loadYaml } from "js-yaml"

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
  const parsed = matter(raw, {
    engines: {
      yaml: {
        parse: (input: string) => loadYaml(input, { schema: JSON_SCHEMA }) ?? {},
      },
    },
  })
  const data: Record<string, unknown> = parsed.data
  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new Error(`content/posts/${slug}.md 缺少 title`)
  }
  const date = isoDate(data.date)
  if (!date) {
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
    date,
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

function isoDate(value: unknown): string | undefined {
  if (typeof value === "string" && isIsoDate(value)) return value
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear()
    const month = String(value.getUTCMonth() + 1).padStart(2, "0")
    const day = String(value.getUTCDate()).padStart(2, "0")
    const iso = `${year}-${month}-${day}`
    return isIsoDate(iso) ? iso : undefined
  }
  return undefined
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
