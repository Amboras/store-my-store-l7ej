'use client'

import { useMemo, useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import {
  Minus,
  Plus,
  Check,
  Loader2,
  Zap,
  Package,
  ShieldCheck,
  Star,
  Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
  bundleProduct?: Product | null
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?:
    | {
        calculated_amount?: number
        currency_code?: string
      }
    | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(
  variant: ProductVariantWithPrice | undefined,
): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : (cp.calculated_amount ?? null)
}

export default function ProductActions({
  product,
  variantExtensions,
  bundleProduct,
}: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(
    () => product.options || [],
    [product.options],
  )

  const isBundlePage =
    product.handle === 'scrubpro-power-bundle-2-brushes-10-heads'
  const showBundleOffer = !isBundlePage && !!bundleProduct

  // 'single' | 'bundle'
  const [offerChoice, setOfferChoice] = useState<'single' | 'bundle'>('single')

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) defaults[optionId] = opt.value
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [stockCount] = useState(47)
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 17 })
  const { addItem, isAddingItem } = useCart()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds -= 1
        if (seconds < 0) { seconds = 59; minutes -= 1 }
        if (minutes < 0) { minutes = 59; hours -= 1 }
        if (hours < 0) return { hours: 3, minutes: 59, seconds: 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return (
      variants.find((v: ProductVariantWithPrice) => {
        if (!v.options) return false
        return v.options.every((opt: VariantOption) => {
          const optionId = opt.option_id || opt.option?.id
          if (!optionId) return false
          return selectedOptions[optionId] === opt.value
        })
      }) || variants[0]
    )
  }, [variants, selectedOptions])

  // Bundle variant (first variant of bundleProduct)
  const bundleVariant = useMemo(() => {
    if (!bundleProduct?.variants?.length) return null
    return bundleProduct.variants[0] as unknown as ProductVariantWithPrice
  }, [bundleProduct])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency =
    (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const bundlePriceCents = getVariantPriceAmount(bundleVariant)
  const bundlePriceDisplay = bundlePriceCents
    ? `$${(bundlePriceCents / 100).toFixed(2)}`
    : '$79.99'

  const manageInventory = ext?.manage_inventory ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock =
    manageInventory &&
    inventoryQuantity != null &&
    inventoryQuantity <= 0
  const isLowStock =
    manageInventory &&
    inventoryQuantity != null &&
    inventoryQuantity > 0 &&
    inventoryQuantity < 10

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    // Determine which variant to add based on offer choice
    const targetVariantId =
      offerChoice === 'bundle' && bundleVariant
        ? bundleVariant.id
        : selectedVariant?.id

    const targetProduct =
      offerChoice === 'bundle' && bundleProduct ? bundleProduct : product

    if (!targetVariantId || isOutOfStock) return

    const priceForTracking =
      offerChoice === 'bundle' ? bundlePriceCents : currentPriceCents

    addItem(
      { variantId: targetVariantId, quantity: 1 },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success(
            offerChoice === 'bundle'
              ? 'Power Bundle added to bag!'
              : 'Added to bag',
          )
          const metaValue = toMetaCurrencyValue(priceForTracking)
          trackAddToCart(
            targetProduct?.id || '',
            targetVariantId,
            1,
            priceForTracking ?? undefined,
          )
          trackMetaEvent('AddToCart', {
            content_ids: [targetVariantId],
            content_type: 'product',
            content_name: targetProduct?.title,
            value: metaValue,
            currency,
            contents: [{ id: targetVariantId, quantity: 1, item_price: metaValue }],
            num_items: 1,
          })
          setTimeout(() => setJustAdded(false), 2200)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      },
    )
  }

  const hasMultipleVariants = variants.length > 1
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="space-y-5">
      {/* ── Price ───────────────────────────────────────────────── */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* ── Urgency — Countdown ─────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-[hsl(0,75%,50%,0.06)] border border-[hsl(0,75%,50%,0.22)] rounded-xl px-4 py-3">
        <Zap
          className="h-4 w-4 text-[hsl(0,75%,50%)] flex-shrink-0"
          fill="hsl(0,75%,50%)"
        />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[hsl(0,65%,40%)] font-semibold">
            Flash Sale ends in:
          </span>
          <span className="font-bold font-mono text-[hsl(215,30%,9%)] tabular-nums bg-white border border-[hsl(0,75%,50%,0.2)] px-2.5 py-0.5 rounded-md text-sm">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* ── Stock indicator ─────────────────────────────────────── */}
      {!isLowStock && !isOutOfStock && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span>
            <span className="font-semibold text-[hsl(215,25%,18%)]">
              {stockCount} units
            </span>{' '}
            in stock — ships within 24 hours
          </span>
        </div>
      )}
      {isLowStock && (
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse inline-block" />
          <span className="text-orange-600 font-semibold">
            Only {inventoryQuantity} left — order soon
          </span>
        </div>
      )}

      {/* ── Bundle Offer Selector ────────────────────────────────── */}
      {showBundleOffer && (
        <div className="space-y-2.5">
          <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
            Choose Your Option
          </p>

          {/* Single */}
          <button
            type="button"
            onClick={() => setOfferChoice('single')}
            className={`w-full flex items-start gap-3.5 p-4 border-2 rounded-xl text-left transition-all duration-150 ${
              offerChoice === 'single'
                ? 'border-[hsl(188,95%,38%)] bg-[hsl(188,95%,38%,0.04)] shadow-sm'
                : 'border-[hsl(200,15%,88%)] hover:border-[hsl(188,95%,38%,0.5)]'
            }`}
          >
            <div
              className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                offerChoice === 'single'
                  ? 'border-[hsl(188,95%,38%)]'
                  : 'border-muted-foreground/40'
              }`}
            >
              {offerChoice === 'single' && (
                <div className="h-2 w-2 rounded-full bg-[hsl(188,95%,38%)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-[hsl(215,30%,9%)]">
                  1x ScrubPro Brush
                </span>
                <span className="font-bold text-sm text-[hsl(215,30%,9%)]">
                  ${currentPriceCents ? (currentPriceCents / 100).toFixed(2) : '49.99'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Single unit + 5 brush heads included
              </p>
            </div>
          </button>

          {/* Bundle */}
          <button
            type="button"
            onClick={() => setOfferChoice('bundle')}
            className={`relative w-full flex items-start gap-3.5 p-4 border-2 rounded-xl text-left transition-all duration-150 ${
              offerChoice === 'bundle'
                ? 'border-[hsl(188,95%,38%)] bg-[hsl(188,95%,38%,0.04)] shadow-sm'
                : 'border-[hsl(200,15%,88%)] hover:border-[hsl(188,95%,38%,0.5)]'
            }`}
          >
            {/* Badge */}
            <div className="absolute -top-2.5 right-4 bg-[hsl(188,95%,38%)] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Most Popular
            </div>
            <div
              className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                offerChoice === 'bundle'
                  ? 'border-[hsl(188,95%,38%)]'
                  : 'border-muted-foreground/40'
              }`}
            >
              {offerChoice === 'bundle' && (
                <div className="h-2 w-2 rounded-full bg-[hsl(188,95%,38%)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-[hsl(215,30%,9%)]">
                  2-Brush Power Bundle
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground line-through">$99.98</span>
                  <span className="font-bold text-sm text-[hsl(215,30%,9%)]">
                    {bundlePriceDisplay}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[hsl(188,95%,28%)] font-semibold mt-0.5 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Save $20 — 2 brushes + 10 heads included
              </p>
            </div>
          </button>
        </div>
      )}

      {/* ── Option Selectors (multi-variant) ─────────────────────── */}
      {hasMultipleVariants &&
        (options as ProductOptionWithValues[]).map((option) => {
          const values = (option.values || [])
            .map((v: string | ProductOptionValue) =>
              typeof v === 'string' ? v : v.value,
            )
            .filter(Boolean) as string[]

          if (
            values.length <= 1 &&
            (values[0] === 'One Size' || values[0] === 'Default')
          )
            return null

          const optionId = option.id
          const selectedValue = selectedOptions[optionId]

          return (
            <div key={optionId}>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
                {option.title}
                {selectedValue && (
                  <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                    — {selectedValue}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const isSelected = selectedValue === value
                  const isAvailable = variants.some(
                    (v: ProductVariantWithPrice) => {
                      const hasValue = v.options?.some(
                        (o: VariantOption) =>
                          (o.option_id === optionId ||
                            o.option?.id === optionId) &&
                          o.value === value,
                      )
                      if (!hasValue) return false
                      const vExt = variantExtensions?.[v.id]
                      if (!vExt?.manage_inventory) return true
                      return (
                        vExt.inventory_quantity == null ||
                        vExt.inventory_quantity > 0
                      )
                    },
                  )

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionId, value)}
                      disabled={!isAvailable}
                      className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all rounded-sm ${
                        isSelected
                          ? 'border-[hsl(188,95%,38%)] bg-[hsl(188,95%,38%)] text-white'
                          : isAvailable
                            ? 'border-border hover:border-[hsl(188,95%,38%)]'
                            : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

      {/* ── Quantity (only for single-unit choice) ───────────────── */}
      {offerChoice === 'single' && (
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground w-16">
            Qty
          </span>
          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-muted transition-colors"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-muted transition-colors"
              disabled={
                isOutOfStock ||
                (inventoryQuantity != null && quantity >= inventoryQuantity)
              }
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Add to Cart CTA ─────────────────────────────────────── */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingItem}
        className={`w-full flex items-center justify-center gap-2.5 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 rounded-sm ${
          isOutOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : justAdded
              ? 'bg-emerald-600 text-white'
              : offerChoice === 'bundle'
                ? 'bg-[hsl(215,30%,9%)] hover:bg-[hsl(215,30%,14%)] text-white shadow-lg hover:shadow-xl'
                : 'bg-[hsl(188,95%,38%)] hover:bg-[hsl(188,95%,33%)] text-white shadow-lg hover:shadow-xl animate-pulse-glow'
        }`}
      >
        {isAddingItem ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Bag
          </>
        ) : isOutOfStock ? (
          'Sold Out'
        ) : offerChoice === 'bundle' ? (
          <>
            <Package className="h-4 w-4" />
            Add Bundle to Bag — {bundlePriceDisplay}
          </>
        ) : (
          <>
            <Package className="h-4 w-4" />
            Add to Bag
          </>
        )}
      </button>

      {/* ── Micro trust row ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-2.5 border-t border-dashed border-[hsl(200,15%,90%)]">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[hsl(188,95%,38%)]" />
          Secure Checkout
        </span>
        <span className="text-muted-foreground/30 text-xs">·</span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-[hsl(188,95%,38%)]" />
          Free Shipping over $75
        </span>
        <span className="text-muted-foreground/30 text-xs">·</span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          4.9 / 5 from 2,400+ buyers
        </span>
      </div>
    </div>
  )
}
