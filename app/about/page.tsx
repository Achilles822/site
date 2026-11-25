import type { Metadata } from "next"
import { MarkdownBody } from "@/lib/markdown"
import { readAbout } from "@/lib/about"
import { aboutPath } from "@/lib/paths"

export const metadata: Metadata = { title: "关于我" }

export default function AboutPage() {
  const about = readAbout(aboutPath)
  return (
    <article className="page">
      <h1 className="article-title serif">{about.title}</h1>
      <div className="article-body">
        <MarkdownBody source={about.body} />
      </div>
    </article>
  )
}
