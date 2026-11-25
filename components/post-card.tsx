import { CoverFrame } from "@/components/cover-frame"
import { formatPostDate, type CoverState, type Post } from "@/lib/posts"
import { withBase } from "@/lib/site"

export function PostCard({ post, cover }: { post: Post; cover: CoverState }) {
  return (
    <a className="card" href={withBase(`/posts/${post.slug}/`)}>
      <CoverFrame state={cover} src={post.cover} />
      <p className="card-meta">
        {post.pinned ? "※ " : ""}
        {formatPostDate(post.date)}
      </p>
      <h2 className="card-title serif">{post.title}</h2>
      {post.description ? <p className="card-description">{post.description}</p> : null}
    </a>
  )
}
