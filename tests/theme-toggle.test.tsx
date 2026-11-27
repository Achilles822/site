// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ThemeToggle } from "../components/theme-toggle"

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute("data-theme")
  localStorage.clear()
})

describe("ThemeToggle", () => {
  it("在顶栏用按钮切换明暗，并记住选择", () => {
    document.documentElement.dataset.theme = "light"
    render(<ThemeToggle />)
    const button = screen.getByRole("button", { name: "切换明暗" })
    expect(button.querySelector(".theme-icon-moon")).toBeTruthy()
    expect(button.querySelector(".theme-icon-sun")).toBeTruthy()

    fireEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe("dark")
    expect(localStorage.getItem("theme")).toBe("dark")

    fireEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe("light")
    expect(localStorage.getItem("theme")).toBe("light")
  })
})
