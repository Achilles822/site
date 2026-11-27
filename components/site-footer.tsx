import { siteNameEn } from "@/lib/site"

const copyrightYear = 2026

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-text">
        {siteNameEn} @ {copyrightYear}
      </p>
    </footer>
  )
}