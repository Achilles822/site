// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
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

afterEach(() => {
  cleanup()
})

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
