// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ProductShowcase } from "../components/product-showcase"
import { SiteHeader } from "../components/site-header"
import { products } from "../lib/products"

afterEach(() => {
  cleanup()
})

describe("ProductShowcase", () => {
  it("渲染 VibePick 产品卡片、封面图及外链跳转", () => {
    const { container } = render(<ProductShowcase products={products} />)

    const cards = container.querySelectorAll(".product-card")
    expect(cards.length).toBe(1)
    expect(products[0].id).toBe("vibepick")
    expect(products[0].href).toBe("https://vibepick.site")

    expect(screen.getByRole("heading", { name: "VibePick" })).toBeTruthy()
    expect(screen.getByText(products[0].description)).toBeTruthy()

    const ctaLink = screen.getByRole("link", { name: new RegExp(products[0].ctaLabel) })
    expect(ctaLink.getAttribute("href")).toBe("https://vibepick.site")
    expect(ctaLink.getAttribute("target")).toBe("_blank")

    const coverImg = screen.getByAltText(products[0].coverAlt)
    expect(coverImg.getAttribute("src")).toBe("/covers/vibepick-cover.png")

    expect(cards[0].classList.contains("product-card-reverse")).toBe(false)
    expect(container.querySelector(".product-index")).toBeNull()
  })

  it("在顶栏右上角提供产品、文章、关于我导航", () => {
    render(<SiteHeader />)
    expect(screen.getByRole("link", { name: "产品" }).getAttribute("href")).toBe("/#products")
    expect(screen.getByRole("link", { name: "文章" }).getAttribute("href")).toBe("/#posts")
    expect(screen.getByRole("link", { name: "关于我" }).getAttribute("href")).toBe("/about/")
  })
})
