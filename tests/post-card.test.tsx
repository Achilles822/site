// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
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

afterEach(() => {
  cleanup()
})

describe("PostCard", () => {
  it("置顶卡片有星号、中文日期和整卡链接", () => {
    render(<PostCard post={pinned} cover="empty" />)
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe("/posts/morning-light/")
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
