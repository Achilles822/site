import { existsSync, readFileSync } from "node:fs"
import matter from "gray-matter"

export type About = {
  title: string
  body: string
}

export function parseAbout(raw: string): About {
  const parsed = matter(raw)
  const title = parsed.data.title
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("content/about.md 缺少 title")
  }
  return { title, body: parsed.content.trim() }
}

export function readAbout(filePath: string): About {
  if (!existsSync(filePath)) throw new Error("缺少 content/about.md")
  return parseAbout(readFileSync(filePath, "utf8"))
}
