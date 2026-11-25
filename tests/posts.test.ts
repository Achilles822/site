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
      parsePost("note", '---\ntitle: 一篇\ndate: 2026-11-01\npinned: "true"\n---\n'),
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
