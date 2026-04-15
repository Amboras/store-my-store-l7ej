import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Truck,
  RotateCcw,
  Shield,
  Award,
  Zap,
  CheckCircle2,
  Star,
  Clock,
} from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getBundleProduct() {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) return null

    const response = await medusaServerClient.store.product.list({
      handle: 'scrubpro-power-bundle-2-brushes-10-heads',
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch {
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        manage_inventory: v.manage_inventory ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

const trustItems = [
  { icon: Truck, title: 'Free Shipping', sub: 'Orders over $75' },
  { icon: RotateCcw, title: '30-Day Returns', sub: 'No questions asked' },
  { icon: Shield, title: 'Secure Checkout', sub: '256-bit SSL' },
  { icon: Award, title: '1-Year Warranty', sub: 'Manufacturer backed' },
]

const specs = [
  { label: 'Motor Speed', value: '3,600 RPM' },
  { label: 'Battery Life', value: '4 hours' },
  { label: 'Waterproof Rating', value: 'IPX7 (fully submersible)' },
  { label: 'Charging', value: 'USB-C magnetic' },
  { label: 'Brush Heads', value: '5 interchangeable heads' },
  { label: 'Surfaces', value: 'Tile, grout, glass, stovetop, tub' },
]

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const [product, bundleProduct] = await Promise.all([
    getProduct(handle),
    getBundleProduct(),
  ])

  if (!product) notFound()

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]

  const displayImages =
    allImages.length > 0 ? allImages : [{ url: getProductPlaceholder(product.id) }]

  const isBundlePage = product.handle === 'scrubpro-power-bundle-2-brushes-10-heads'

  return (
    <>
      <ProductViewTracker
        productId={product.id}
        productTitle={product.title}
        variantId={product.variants?.[0]?.id || null}
        currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
        value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
      />

      {/* ── Announcement bar ── */}
      {!isBundlePage && (
        <div className="bg-[hsl(188,95%,38%)] text-white text-center py-2.5 px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">
            <Zap className="inline h-3 w-3 mr-1.5 fill-white" />
            Flash Sale — 15% off today only. Use code{' '}
            <span className="font-bold underline underline-offset-2">CLEAN15</span> at checkout
          </p>
        </div>
      )}

      {/* ── Breadcrumbs ── */}
      <div className="border-b bg-white">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="bg-white">
        <div className="container-custom py-8 lg:py-14">
          <div className="grid lg:grid-cols-[1fr_480px] gap-10 lg:gap-16 items-start">

            {/* ─── LEFT: Image Gallery ─────────────────────────────── */}
            <div className="space-y-3 lg:sticky lg:top-24">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl bg-[hsl(200,20%,96%)] aspect-[4/4.5] group">
                <Image
                  src={displayImages[0].url}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                {/* Sale badge */}
                {!isBundlePage && (
                  <div className="absolute top-4 left-4 bg-[hsl(0,75%,50%)] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    Sale
                  </div>
                )}
                {isBundlePage && (
                  <div className="absolute top-4 left-4 bg-[hsl(188,95%,38%)] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    Save 30%
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {displayImages.slice(0, 4).map((image: { url: string }, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-square overflow-hidden rounded-lg bg-[hsl(200,20%,96%)] ring-1 ring-[hsl(200,15%,88%)]"
                    >
                      <Image
                        src={image.url}
                        alt={`${product.title} view ${idx + 1}`}
                        fill
                        sizes="10vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Guarantee banner */}
              <div className="flex items-center gap-3 bg-[hsl(120,40%,97%)] border border-[hsl(120,30%,85%)] rounded-xl px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(120,45%,38%)] flex-shrink-0" />
                <p className="text-xs text-[hsl(120,25%,28%)] font-medium leading-snug">
                  <span className="font-bold">30-Day Money-Back Guarantee.</span> Not happy? We&apos;ll refund every cent, no hassle.
                </p>
              </div>
            </div>

            {/* ─── RIGHT: Product Info ─────────────────────────────── */}
            <div className="space-y-6">

              {/* Category + Rating row */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[hsl(188,95%,38%)]">
                  Electric Cleaning Brush
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">4.9 (2,400+)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-[2.2rem] font-heading font-bold text-[hsl(215,30%,9%)] leading-tight">
                {product.title}
              </h1>

              {/* Short description */}
              {!isBundlePage ? (
                <p className="text-[hsl(215,10%,42%)] leading-[1.75] text-base">
                  Professional-grade 3,600 RPM cleaning power. 5 interchangeable heads.
                  IPX7 waterproof. Backed by a 1-year warranty.{' '}
                  <span className="font-semibold text-[hsl(215,25%,18%)]">
                    The last cleaning brush you&apos;ll ever buy.
                  </span>
                </p>
              ) : (
                <p className="text-[hsl(215,10%,42%)] leading-[1.75] text-base">
                  Two full ScrubPro units. Ten brush heads. Everything covered.{' '}
                  <span className="font-semibold text-[hsl(215,25%,18%)]">
                    Keep one, give one — or cover every room in your home.
                  </span>
                </p>
              )}

              {/* Quick win pills */}
              <div className="flex flex-wrap gap-2">
                {(!isBundlePage
                  ? ['3,600 RPM motor', '5 brush heads', 'IPX7 waterproof', '4-hr battery']
                  : ['2 full units', '10 brush heads', '2 charging cables', 'Save 30%']
                ).map((f) => (
                  <span
                    key={f}
                    className="text-xs bg-[hsl(188,95%,38%,0.08)] text-[hsl(188,95%,28%)] px-3 py-1.5 rounded-full font-semibold border border-[hsl(188,95%,38%,0.15)]"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* Product Actions — price, bundle selector, add to cart */}
              <ProductActions
                product={product}
                variantExtensions={variantExtensions}
                bundleProduct={bundleProduct}
              />

              {/* Divider */}
              <div className="border-t" />

              {/* Trust grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {trustItems.map(({ icon: Icon, title, sub }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-[hsl(200,20%,98%)] border border-[hsl(200,15%,91%)]"
                  >
                    <Icon className="h-4.5 w-4.5 text-[hsl(188,95%,38%)]" strokeWidth={1.8} />
                    <p className="text-[11px] font-bold text-[hsl(215,25%,12%)] leading-tight">{title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Accordion */}
              <ProductAccordion
                description={product.description}
                details={product.metadata as Record<string, string> | undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Specs table ─────────────────────────────────────────── */}
      {!isBundlePage && (
        <section className="bg-[hsl(200,20%,97%)] border-t border-[hsl(200,15%,90%)]">
          <div className="container-custom py-14">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-[hsl(188,95%,38%)] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                <Zap className="h-3.5 w-3.5" />
                Technical Specs
              </div>
              <h2 className="text-2xl font-heading font-bold text-[hsl(215,30%,9%)] mb-8">
                Built to Outperform
              </h2>
              <div className="divide-y divide-[hsl(200,15%,88%)] border border-[hsl(200,15%,88%)] rounded-xl overflow-hidden bg-white">
                {specs.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-2 gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-[hsl(215,25%,20%)]">{label}</span>
                    <span className="text-sm text-[hsl(215,10%,42%)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Shipping info bar ───────────────────────────────────── */}
      <section className="bg-[hsl(215,30%,9%)] py-5">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[hsl(188,95%,50%)]" />
              Free shipping on orders over $75
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[hsl(188,95%,50%)]" />
              Ships within 24 hours
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-[hsl(188,95%,50%)]" />
              Free 30-day returns
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[hsl(188,95%,50%)]" />
              1-year warranty included
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
