import { siteName, withBase } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-name serif" href={withBase("/")}>
        {siteName}
      </a>
      <a className="nav-link" href={withBase("/about/")}>
        关于我
      </a>
    </header>
  )
}
