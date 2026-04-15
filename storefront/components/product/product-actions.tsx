'use client'

import { useMemo, useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, Zap, Package, ShieldCheck, Star } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
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

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

// Bundle offer definition — shown as a clickable option
const BUNDLE_PRODUCT_HANDLE = 'scrubpro-power-bundle-2-brushes-10-heads'
const BUNDLE_LABEL = '2-Brush Power Bundle'
const BUNDLE_PRICE_DISPLAY = '$79.99'
const BUNDLE_SAVINGS = 'Save $20 vs. buying 2 separately'

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const isBundlePage = product.handle === BUNDLE_PRODUCT_HANDLE
  // "quantity offer" selection: 'single' or 'bundle'
  const [offerChoice, setOfferChoice] = useState<'single' | 'bundle'>('single')

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
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
  const [stockCount, setStockCount] = useState(47)
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 17 })
  const { addItem, isAddingItem } = useCart()

  // Countdown timer for urgency
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
    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const manageInventory = ext?.manage_inventory ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = manageInventory && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = manageInventory && inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 10

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1
  const pad = (n: number) => String(n).padStart(2, '0')
  const showBundleOffer = !isBundlePage

  return (
    <div className="space-y-5">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Urgency — Sale Countdown */}
      <div className="flex items-center gap-3 bg-[hsl(195,90%,40%,0.08)] border border-[hsl(195,90%,40%,0.25)] rounded-lg px-4 py-3">
        <Zap className="h-4 w-4 text-[hsl(195,90%,40%)] flex-shrink-0" fill="hsl(195,90%,40%)" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[hsl(195,90%,35%)] font-semibold">Flash Sale ends in:</span>
          <span className="font-bold font-mono text-foreground tabular-nums">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Bundle Offer Selection */}
      {showBundleOffer && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
            Choose Your Option
          </p>

          {/* Single unit */}
          <button
            onClick={() => setOfferChoice('single')}
            className={`w-full flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all ${
              offerChoice === 'single'
                ? 'border-[hsl(195,90%,40%)] bg-[hsl(195,90%,40%,0.05)]'
                : 'border-border hover:border-[hsl(195,90%,40%,0.4)]'
            }`}
          >
            <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              offerChoice === 'single' ? 'border-[hsl(195,90%,40%)]' : 'border-muted-foreground'
            }`}>
              {offerChoice === 'single' && (
                <div className="h-2 w-2 rounded-full bg-[hsl(195,90%,40%)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">1x ScrubPro Brush</span>
                <span className="font-bold text-sm">
                  ${currentPriceCents ? (currentPriceCents / 100).toFixed(2) : '49.99'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Single unit + 5 brush heads</p>
            </div>
          </button>

          {/* Bundle */}
          <button
            onClick={() => { setOfferChoice('bundle'); window.location.href = `/products/${BUNDLE_PRODUCT_HANDLE}` }}
            className={`w-full flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all relative ${
              offerChoice === 'bundle'
                ? 'border-[hsl(195,90%,40%)] bg-[hsl(195,90%,40%,0.05)]'
                : 'border-border hover:border-[hsl(195,90%,40%,0.4)]'
            }`}
          >
            {/* Badge */}
            <div className="absolute -top-2.5 right-3 bg-[hsl(195,90%,40%)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              offerChoice === 'bundle' ? 'border-[hsl(195,90%,40%)]' : 'border-muted-foreground'
            }`}>
              {offerChoice === 'bundle' && (
                <div className="h-2 w-2 rounded-full bg-[hsl(195,90%,40%)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{BUNDLE_LABEL}</span>
                <span className="font-bold text-sm">{BUNDLE_PRICE_DISPLAY}</span>
              </div>
              <p className="text-xs text-[hsl(195,90%,35%)] font-medium mt-0.5">{BUNDLE_SAVINGS}</p>
            </div>
          </button>
        </div>
      )}

      {/* Option Selectors */}
      {hasMultipleVariants && (options as ProductOptionWithValues[]).map((option) => {
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) return null

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
                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt?.manage_inventory) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all rounded-sm ${
                      isSelected
                        ? 'border-[hsl(195,90%,40%)] bg-[hsl(195,90%,40%)] text-white'
                        : isAvailable
                        ? 'border-border hover:border-[hsl(195,90%,40%)]'
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

      {/* Low Stock Warning */}
      {isLowStock && (
        <p className="text-sm text-orange-600 font-semibold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse inline-block" />
          Only {inventoryQuantity} left — order soon
        </p>
      )}

      {/* Stock indicator (static for single product) */}
      {!isLowStock && !isOutOfStock && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span>{stockCount} units in stock — ships within 24 hours</span>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3 pt-1">
        {offerChoice === 'single' && (
          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-muted transition-colors"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-muted transition-colors"
              disabled={isOutOfStock || (inventoryQuantity != null && quantity >= inventoryQuantity)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wide transition-all rounded-sm ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[hsl(195,90%,40%)] hover:bg-[hsl(195,90%,35%)] text-white shadow-md hover:shadow-lg'
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
          ) : (
            <>
              <Package className="h-4 w-4" />
              Add to Bag
            </>
          )}
        </button>
      </div>

      {/* Trust micro-signals */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[hsl(195,90%,40%)]" />
          Secure Checkout
        </span>
        <span className="text-muted-foreground/30 text-xs">|</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-[hsl(195,90%,40%)]" />
          Free Shipping over $75
        </span>
        <span className="text-muted-foreground/30 text-xs">|</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-[hsl(195,90%,40%)]" />
          4.9 / 5 Rating
        </span>
      </div>
    </div>
  )
}
