import { PostCard } from "@/components/post-card"
import { postsDir, publicDir } from "@/lib/paths"
import { listPosts, resolveCover } from "@/lib/posts"

export default function HomePage() {
  const posts = listPosts(postsDir)
  return (
    <main className="page">
      {posts.length === 0 ? (
        <p className="empty-posts">还没有文章。</p>
      ) : (
        <ul className="list">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} cover={resolveCover(post.cover, publicDir)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
