import type { CoverState } from "@/lib/posts"
import { withBase } from "@/lib/site"

export function CoverFrame({ state, src }: { state: CoverState; src: string | undefined }) {
  switch (state) {
    case "empty":
      return <div className="cover" />
    case "missing":
      return <div className="cover cover-missing" />
    case "ready":
      return (
        <div className="cover">
          <img src={src ? withBase(src) : undefined} alt="" />
        </div>
      )
    default: {
      const exhaustive: never = state
      return exhaustive
    }
  }
}
