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
    const { container } = render(<MarkdownBody source={"<script>alert(1)</script>"} />)
    expect(container.querySelector("script")).toBeNull()
    expect(screen.getByText("<script>alert(1)</script>")).toBeTruthy()
  })
})
