import { SiteNav } from "@/components/site-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteName, withBase } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-name serif" href={withBase("/")}>
        {siteName}
      </a>
      <div className="header-actions">
        <SiteNav />
        <ThemeToggle />
      </div>
    </header>
  )
}
