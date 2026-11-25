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
