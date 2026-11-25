import { CoverFrame } from "@/components/cover-frame"
import { MarkdownBody } from "@/lib/markdown"
import { formatPostDate, type CoverState, type Post } from "@/lib/posts"

export function ArticleView({ post, cover }: { post: Post; cover: CoverState }) {
  return (
    <article className="page">
      <h1 className="article-title serif">{post.title}</h1>
      <p className="article-date">{formatPostDate(post.date)}</p>
      {cover === "empty" ? null : (
        <div className="article-cover">
          <CoverFrame state={cover} src={post.cover} />
        </div>
      )}
      <div className="article-body">
        <MarkdownBody source={post.body} />
      </div>
    </article>
  )
}
