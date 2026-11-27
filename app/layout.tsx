import type { Metadata } from "next"
import { Noto_Sans_SC, Noto_Serif_SC, Source_Sans_3, Source_Serif_4 } from "next/font/google"
import Script from "next/script"
import { PageBackdrop } from "@/components/page-backdrop"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { siteName } from "@/lib/site"
import { themeInitScript } from "@/lib/theme"
import "./globals.css"

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
  variable: "--font-noto-serif",
  preload: false,
})

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-noto-sans",
  preload: false,
})

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVariables = [sourceSerif.variable, sourceSans.variable, notoSerif.variable, notoSans.variable].join(" ")
  return (
    <html lang="zh-CN" className={fontVariables} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <PageBackdrop />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
