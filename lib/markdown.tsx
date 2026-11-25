import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownBody({ source }: { source: string }) {
  return <Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>
}
