import { PostCard } from "@/components/post-card"
import { ProductShowcase } from "@/components/product-showcase"
import { postsDir, publicDir } from "@/lib/paths"
import { listPosts, resolveCover } from "@/lib/posts"
import { products } from "@/lib/products"

export default function HomePage() {
  const posts = listPosts(postsDir)
  return (
    <main className="page">
      <ProductShowcase products={products} />

      <section id="posts" className="posts-section" aria-labelledby="posts-heading">
        <div className="section-head">
          <h2 id="posts-heading" className="section-title serif">
            <span className="section-title-mark">文章</span>
          </h2>
        </div>

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
      </section>
    </main>
  )
}
