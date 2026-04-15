'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Droplets,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { useProducts } from '@/hooks/use-products'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85'
const LIFESTYLE_IMAGE = 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&q=85'
const LIFESTYLE_IMAGE_2 = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=85'

const features = [
  {
    icon: Zap,
    title: '3,600 RPM Motor',
    desc: 'High-torque power that cuts through grease and grime in seconds.',
  },
  {
    icon: Droplets,
    title: 'IPX7 Waterproof',
    desc: 'Fully submersible. Rinse under the tap, use in the shower — no worries.',
  },
  {
    icon: Clock,
    title: '4-Hour Battery',
    desc: 'USB-C magnetic charging. One charge lasts weeks of regular use.',
  },
]

const trustBadges = [
  { icon: Truck, label: 'Free Shipping', sub: 'On orders over $75' },
  { icon: RotateCcw, label: '30-Day Returns', sub: 'Hassle-free guarantee' },
  { icon: Shield, label: 'Secure Checkout', sub: '256-bit SSL encryption' },
]

export default function HomePage() {
  const { data: products } = useProducts({ limit: 4 })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [stockCount] = useState(47)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    setSubmitted(true)
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[hsl(215,25%,8%)]">
        {/* Decorative gradient orb */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[hsl(195,90%,40%,0.12)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[hsl(195,90%,40%,0.07)] blur-3xl" />

        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-10 items-center py-20 lg:py-28">
          {/* Text */}
          <div className="space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-[hsl(195,90%,40%,0.5)] bg-[hsl(195,90%,40%,0.08)] px-3.5 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-[hsl(195,90%,40%)] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(195,90%,60%)]">
                New — ScrubPro Gen 2
              </span>
            </div>

            <h1 className="text-[3.2rem] leading-[1.08] font-heading font-bold tracking-tight text-white lg:text-[4rem]">
              Clean Smarter.{' '}
              <span className="text-[hsl(195,90%,50%)]">Not Harder.</span>
            </h1>

            <p className="text-lg text-[hsl(210,15%,65%)] max-w-md leading-relaxed">
              The ScrubPro Electric Cleaning Brush powers through grease, soap scum,
              and grime with zero effort. 5 brush heads. One powerful tool.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/products/scrubpro-electric-cleaning-brush"
                className="inline-flex items-center gap-2.5 bg-[hsl(195,90%,40%)] hover:bg-[hsl(195,90%,35%)] text-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-all rounded-sm animate-pulse-glow"
              >
                Shop ScrubPro
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 border border-[hsl(210,15%,35%)] text-[hsl(210,15%,75%)] hover:border-[hsl(195,90%,40%)] hover:text-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide transition-all rounded-sm"
              >
                View All Products
              </Link>
            </div>

            {/* Social proof micro-line */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-[hsl(215,25%,12%)] bg-[hsl(215,20%,25%)]" />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-[hsl(210,15%,60%)] ml-1">
                  <span className="font-semibold text-white">4.9</span> / 5 from 2,400+ buyers
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src={HERO_IMAGE}
                alt="ScrubPro Electric Cleaning Brush in action"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Limited Stock</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{stockCount} units remaining</p>
                <div className="mt-1.5 h-1.5 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(195,90%,40%)] rounded-full"
                    style={{ width: `${(stockCount / 200) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y bg-background py-5">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 justify-center md:justify-start text-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(195,90%,40%,0.1)]">
                  <Icon className="h-4.5 w-4.5 text-[hsl(195,90%,40%)]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[hsl(195,90%,40%)] font-semibold mb-3">
              Why ScrubPro
            </p>
            <h2 className="text-h2 font-heading font-bold text-balance">
              Built for Real Cleaning. Not Just Marketing.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Most electric brushes underdeliver. We engineered every detail from scratch
              — motor, ergonomics, waterproofing — to actually replace elbow grease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative p-7 border border-border rounded-xl hover:border-[hsl(195,90%,40%,0.5)] hover:shadow-md transition-all duration-300 bg-background"
              >
                <div className="h-11 w-11 rounded-lg bg-[hsl(195,90%,40%,0.1)] flex items-center justify-center mb-5 group-hover:bg-[hsl(195,90%,40%,0.15)] transition-colors">
                  <Icon className="h-5 w-5 text-[hsl(195,90%,40%)]" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="py-section bg-muted/40">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[hsl(195,90%,40%)] font-semibold mb-2">
                Our Products
              </p>
              <h2 className="text-h2 font-heading font-bold">Shop the Collection</h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(195,90%,40%)] hover:underline"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {products.slice(0, 2).map((product: any, idx: number) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-background hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
                    )}
                    {idx === 1 && (
                      <div className="absolute top-3 left-3 bg-[hsl(195,90%,40%)] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        Best Value
                      </div>
                    )}
                    {idx === 0 && (
                      <div className="absolute top-3 left-3 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        Bestseller
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg group-hover:text-[hsl(195,90%,40%)] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                      {product.description?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-xl">
                        ${((product.variants?.[0]?.calculated_price?.calculated_amount ?? (idx === 0 ? 4999 : 7999)) / 100).toFixed(2)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(195,90%,40%)]">
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LIFESTYLE / BRAND STORY ── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src={LIFESTYLE_IMAGE}
                alt="ScrubPro — Clean home, clear mind"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.25em] text-[hsl(195,90%,40%)] font-semibold">
                Our Mission
              </p>
              <h2 className="text-h2 font-heading font-bold text-balance">
                A Clean Home. Less Effort. Every Day.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cleaning is a chore everyone avoids. We built ScrubPro to make it something
                you actually get done — fast. No sore wrists. No harsh chemicals. Just power
                where you need it, whenever you need it.
              </p>
              <ul className="space-y-3">
                {[
                  '5 brush heads for any surface',
                  'Cuts cleaning time by up to 60%',
                  'Works in tile, kitchen, bathroom & more',
                  '1-year manufacturer warranty',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[hsl(195,90%,40%)] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(195,90%,40%)] hover:underline mt-2"
              >
                Our Story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE 2 — FULL WIDTH ── */}
      <section className="relative h-[420px] overflow-hidden">
        <Image
          src={LIFESTYLE_IMAGE_2}
          alt="Deep clean every surface"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,25%,8%,0.85)] via-[hsl(215,25%,8%,0.5)] to-transparent" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom space-y-5 max-w-lg">
            <p className="text-xs uppercase tracking-[0.25em] text-[hsl(195,90%,60%)] font-semibold">
              Power Bundle
            </p>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
              Two Brushes. One Household. Zero Compromise.
            </h2>
            <p className="text-[hsl(210,15%,70%)] leading-relaxed">
              Save 30% with our duo bundle — bathroom and kitchen covered in one order.
            </p>
            <Link
              href="/products/scrubpro-power-bundle-2-brushes-10-heads"
              className="inline-flex items-center gap-2.5 bg-[hsl(195,90%,40%)] hover:bg-[hsl(195,90%,35%)] text-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-all rounded-sm"
            >
              Shop the Bundle <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-section bg-muted/40">
        <div className="container-custom max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[hsl(195,90%,40%)] font-semibold mb-3">
            Join the Club
          </p>
          <h2 className="text-h2 font-heading font-bold">Get 10% Off Your First Order</h2>
          <p className="mt-3 text-muted-foreground">
            Subscribe for cleaning tips, exclusive drops, and early access to sales.
          </p>
          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-[hsl(195,90%,40%)] font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              You&apos;re in! Check your inbox for your discount code.
            </div>
          ) : (
            <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-[hsl(195,90%,40%)] focus:outline-none transition-colors rounded-sm"
              />
              <button
                type="submit"
                className="bg-[hsl(195,90%,40%)] hover:bg-[hsl(195,90%,35%)] text-white px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors rounded-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
