"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { withBase } from "@/lib/site"

type NavKey = "products" | "posts" | "about"

function resolveActive(pathname: string | null, hash: string): NavKey {
  if (pathname && pathname.includes("/about")) {
    return "about"
  }
  if (pathname && pathname.includes("/posts/")) {
    return "posts"
  }
  if (hash === "#posts") {
    return "posts"
  }
  return "products"
}

export function SiteNav() {
  const pathname = usePathname()
  const [hash, setHash] = useState("")

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [])

  const active = resolveActive(pathname, hash)

  return (
    <nav className="site-nav" aria-label="主导航">
      <a
        className={active === "products" ? "nav-link nav-link-active" : "nav-link"}
        href={withBase("/#products")}
        onClick={() => setHash("#products")}
      >
        产品
      </a>
      <a
        className={active === "posts" ? "nav-link nav-link-active" : "nav-link"}
        href={withBase("/#posts")}
        onClick={() => setHash("#posts")}
      >
        文章
      </a>
      <a
        className={active === "about" ? "nav-link nav-link-active" : "nav-link"}
        href={withBase("/about/")}
      >
        关于我
      </a>
    </nav>
  )
}
