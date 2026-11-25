import { afterEach, describe, expect, it } from "vitest"
import { siteName, withBase } from "../lib/site"

const original = process.env.NEXT_PUBLIC_BASE_PATH

afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
  else process.env.NEXT_PUBLIC_BASE_PATH = original
})

describe("site", () => {
  it("站名是笔记", () => {
    expect(siteName).toBe("笔记")
  })

  it("给绝对路径加上 Pages 前缀，本地前缀为空", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH
    expect(withBase("/")).toBe("/")
    expect(withBase("/about/")).toBe("/about/")
    process.env.NEXT_PUBLIC_BASE_PATH = "/site"
    expect(withBase("/about/")).toBe("/site/about/")
    expect(withBase("/covers/a.jpg")).toBe("/site/covers/a.jpg")
  })
})
