export type ProductPreviewKind = "vibepick"

export interface ProductItem {
  id: string
  name: string
  description: string
  ctaLabel: string
  href: string
  preview: ProductPreviewKind
  icon: string
  cover: string
  coverAlt: string
}

export const products: ProductItem[] = [
  {
    id: "vibepick",
    name: "VibePick",
    description:
      "面向 AI 编程的 Chrome 网页元素拾取器。点选或框选任意页面元素，一键复制结构化 AI Prompt（含选择器、React/Vue 组件路径与匹配数）、Markdown、UI 规格及完整元素长截图，全部本地运行。",
    ctaLabel: "访问 VibePick 官网",
    href: "https://vibepick.site",
    preview: "vibepick",
    icon: "/icons/vibepick.png",
    cover: "/covers/vibepick-cover.png",
    coverAlt: "VibePick 网页元素拾取与结构化 AI 上下文演示封面",
  },
]
