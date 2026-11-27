"use client"

import { themeStorageKey } from "@/lib/theme"

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(themeStorageKey, theme)
}

export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    applyTheme(next)
  }

  return (
    <button type="button" className="theme-toggle" aria-label="切换明暗" onClick={toggle}>
      <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M15.5 3.8a7.2 7.2 0 1 0 5.2 11.6A6.4 6.4 0 0 1 15.5 3.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
      <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M12 2.8v2.2M12 19v2.2M2.8 12h2.2M19 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    </button>
  )
}
