import { withBase } from "@/lib/site"

export default function NotFound() {
  return (
    <main className="page">
      <h1 className="article-title serif">找不到这篇文章</h1>
      <p>
        <a className="not-found-link" href={withBase("/")}>
          返回首页
        </a>
      </p>
    </main>
  )
}
