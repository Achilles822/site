import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleView } from "@/components/article-view"
import { postsDir, publicDir } from "@/lib/paths"
import { listPosts, readPost, resolveCover } from "@/lib/posts"

export function generateStaticParams() {
  return listPosts(postsDir).map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = readPost(postsDir, slug)
  if (!post) return {}
  return { title: post.title }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = readPost(postsDir, slug)
  if (!post) notFound()
  return <ArticleView post={post} cover={resolveCover(post.cover, publicDir)} />
}
