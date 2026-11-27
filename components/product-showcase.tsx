import { type ProductItem } from "@/lib/products"
import { withBase } from "@/lib/site"

function resolveHref(href: string): string {
  if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://")) {
    return href
  }
  return withBase(href)
}

export function ProductShowcase({ products }: { products: ProductItem[] }) {
  return (
    <section id="products" className="showcase-section" aria-labelledby="products-heading">
      <div className="section-head">
        <h2 id="products-heading" className="section-title serif">
          <span className="section-title-mark">产品</span>
        </h2>
      </div>

      <div className="product-list">
        {products.map((item, idx) => {
          const isReverse = idx % 2 === 1
          const href = resolveHref(item.href)
          const isExternal = href.startsWith("http://") || href.startsWith("https://")
          const coverSrc = withBase(item.cover)
          const iconSrc = withBase(item.icon)
          return (
            <article
              key={item.id}
              id={`product-${item.id}`}
              className={isReverse ? "product-card product-card-reverse" : "product-card"}
            >
              <div className="product-visual">
                <a
                  className="product-cover-link"
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  aria-label={item.name}
                >
                  <img
                    className="product-cover-img"
                    src={coverSrc}
                    alt={item.coverAlt}
                    width={1200}
                    height={750}
                  />
                </a>
              </div>

              <div className="product-copy">
                <div className="product-title-row">
                  <img
                    className="product-badge-icon"
                    src={iconSrc}
                    alt=""
                    width={36}
                    height={36}
                    aria-hidden="true"
                  />
                  <h3 className="product-title serif">{item.name}</h3>
                </div>
                <p className="product-desc">{item.description}</p>
                <a
                  className="product-cta"
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                >
                  <span>{item.ctaLabel}</span>
                  <span className="product-cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
