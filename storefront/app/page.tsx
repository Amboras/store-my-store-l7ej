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
  BatteryCharging,
  Star,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  Package,
} from 'lucide-react'
import { useProducts } from '@/hooks/use-products'

/* ─── Images (all Unsplash-validated) ─────────────────────────────────────── */
const HERO_IMAGE      = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=85'
const LIFESTYLE_1     = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=85'
const LIFESTYLE_2     = 'https://images.unsplash.com/photo-1527515673510-8aa78ce21f9b?w=1200&q=85'
const PRODUCT_CARD_1  = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85'
const PRODUCT_CARD_2  = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=85'

/* ─── Static data ─────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Zap,
    title: '3,600 RPM Motor',
    desc: 'High-torque power cuts through soap scum and grease in seconds — not minutes.',
  },
  {
    icon: Droplets,
    title: 'IPX7 Waterproof',
    desc: 'Fully submersible. Use it in the shower, rinse under the tap, no hesitation.',
  },
  {
    icon: BatteryCharging,
    title: '4-Hour Battery',
    desc: 'USB-C magnetic charging. One charge covers weeks of regular household use.',
  },
]

const trustBadges = [
  { icon: Truck,     label: 'Free Shipping',   sub: 'On all orders over $75'      },
  { icon: RotateCcw, label: '30-Day Returns',  sub: 'No questions asked'          },
  { icon: Shield,    label: 'Secure Checkout', sub: '256-bit SSL encryption'      },
  { icon: Award,     label: '1-Year Warranty', sub: 'Manufacturer backed'        },
]

const stats = [
  { value: '12K+', label: 'Happy Homes' },
  { value: '4.9',  label: 'Star Rating' },
  { value: '60%',  label: 'Less Time Cleaning' },
  { value: '5',    label: 'Brush Heads Included' },
]

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { data: products } = useProducts({ limit: 2 })
  const [newsletterEmail, setNewsletterEmail]   = useState('')
  const [submitted, setSubmitted]               = useState(false)
  const [stockCount]                            = useState(47)
  const [timeLeft, setTimeLeft]                 = useState({ h: 5, m: 37, s: 22 })

  /* Countdown */
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 59; h -= 1 }
        if (h < 0) return { h: 5, m: 59, s: 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) setSubmitted(true)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[hsl(218,25%,7%)]">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-60 -right-60 h-[700px] w-[700px] rounded-full bg-[hsl(188,95%,38%,0.09)] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-[hsl(188,95%,38%,0.06)] blur-[100px]" />

        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          {/* ── Text ── */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(188,95%,38%,0.35)] bg-[hsl(188,95%,38%,0.08)] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(188,95%,50%)] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(188,95%,60%)]">
                New — ScrubPro Gen 2
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[3rem] lg:text-[4rem] leading-[1.05] font-heading font-bold tracking-tight text-white">
                Clean Smarter.{' '}
                <br className="hidden sm:block" />
                <span
                  style={{
                    background: 'linear-gradient(135deg, hsl(188,95%,55%) 0%, hsl(210,90%,65%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Not Harder.
                </span>
              </h1>
              <p className="text-[1.05rem] text-[hsl(210,15%,62%)] max-w-[460px] leading-[1.7]">
                The ScrubPro powers through grease, tile grout, and soap scum with
                zero effort. 5 brush heads. One professional tool. Every surface,
                every time.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products/scrubpro-electric-cleaning-brush"
                className="inline-flex items-center gap-2.5 bg-[hsl(188,95%,38%)] hover:bg-[hsl(188,95%,33%)] text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide rounded-sm transition-all animate-pulse-glow"
              >
                Shop ScrubPro
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products/scrubpro-power-bundle-2-brushes-10-heads"
                className="inline-flex items-center gap-2.5 border border-[hsl(210,15%,32%)] text-[hsl(210,15%,72%)] hover:border-[hsl(188,95%,38%)] hover:text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide rounded-sm transition-all"
              >
                Bundle — Save 30%
              </Link>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex -space-x-2">
                {[
                  'bg-[hsl(200,50%,55%)]',
                  'bg-[hsl(180,45%,50%)]',
                  'bg-[hsl(210,45%,60%)]',
                  'bg-[hsl(195,60%,45%)]',
                ].map((c, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full border-2 border-[hsl(218,25%,10%)] ${c} flex items-center justify-center`}>
                    <span className="text-white text-[9px] font-bold">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-[hsl(210,15%,55%)]">
                  <span className="font-semibold text-white">4.9</span> from 2,400+ verified buyers
                </p>
              </div>
            </div>
          </div>

          {/* ── Hero Image ── */}
          <div className="relative animate-fade-in-right">
            {/* Glow halo */}
            <div className="absolute inset-8 rounded-3xl bg-[hsl(188,95%,38%,0.18)] blur-3xl" />
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
                <Image
                  src={HERO_IMAGE}
                  alt="ScrubPro Electric Cleaning Brush"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218,25%,7%,0.2)] via-transparent to-transparent" />
              </div>

              {/* Floating stock badge */}
              <div className="absolute bottom-5 left-5 bg-white/97 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl min-w-[175px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    In Stock
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">{stockCount} units remaining</p>
                <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[hsl(188,95%,38%)] transition-all"
                    style={{ width: `${(stockCount / 200) * 100}%` }}
                  />
                </div>
              </div>

              {/* Floating sale timer */}
              <div className="absolute top-5 right-5 bg-[hsl(218,25%,10%,0.92)] backdrop-blur-md rounded-xl px-3.5 py-2.5 border border-white/10 shadow-xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(188,95%,60%)] mb-1">
                  Sale ends
                </p>
                <p className="text-lg font-bold font-mono text-white tabular-nums leading-none">
                  {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[hsl(200,15%,91%)]">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:divide-x divide-[hsl(200,15%,91%)]">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 justify-center px-0 md:px-6">
                <div className="h-9 w-9 rounded-full bg-[hsl(188,95%,38%,0.08)] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[hsl(188,95%,38%)]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[hsl(215,25%,12%)]">{label}</p>
                  <p className="text-xs text-[hsl(215,10%,50%)]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[hsl(188,95%,38%)]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-heading font-bold">{value}</p>
                <p className="text-sm font-medium text-[hsl(188,95%,88%)] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[hsl(188,95%,38%)] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Why ScrubPro
            </div>
            <h2 className="text-4xl font-heading font-bold text-[hsl(215,30%,9%)] text-balance">
              Engineered for Real Cleaning Results
            </h2>
            <p className="mt-4 text-[hsl(215,10%,46%)] leading-relaxed max-w-lg mx-auto">
              Most electric brushes are all marketing and no motor. We went back to zero
              and built every component to actually outperform — or we didn&apos;t ship it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group relative p-8 rounded-2xl border border-[hsl(200,15%,91%)] hover:border-[hsl(188,95%,38%,0.4)] hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[hsl(188,95%,38%,0.04)] -translate-y-20 translate-x-20 group-hover:bg-[hsl(188,95%,38%,0.07)] transition-colors" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-[hsl(188,95%,38%,0.1)] flex items-center justify-center mb-6 group-hover:bg-[hsl(188,95%,38%,0.15)] transition-colors">
                    <Icon className="h-5.5 w-5.5 text-[hsl(188,95%,38%)]" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-2.5 text-[hsl(215,30%,9%)]">{title}</h3>
                  <p className="text-sm text-[hsl(215,10%,46%)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[hsl(200,20%,97%)]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-[hsl(188,95%,38%)] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                <Package className="h-3.5 w-3.5" />
                Our Products
              </div>
              <h2 className="text-4xl font-heading font-bold text-[hsl(215,30%,9%)]">
                Shop the Collection
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(188,95%,38%)] hover:underline underline-offset-2"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'ScrubPro Electric Cleaning Brush',
                desc: '3,600 RPM motor, 5 brush heads, IPX7 waterproof. The complete cleaning system for every surface.',
                price: '$49.99',
                href: '/products/scrubpro-electric-cleaning-brush',
                img: products?.[0]?.thumbnail || PRODUCT_CARD_1,
                badge: { label: 'Bestseller', dark: true },
                features: ['5 brush heads', '4-hour battery', 'IPX7 waterproof'],
              },
              {
                title: 'Power Bundle — 2 Brushes + 10 Heads',
                desc: 'Two full ScrubPro units + 10 heads. Cover every room, share with a partner, or gift one.',
                price: '$79.99',
                href: '/products/scrubpro-power-bundle-2-brushes-10-heads',
                img: products?.[1]?.thumbnail || PRODUCT_CARD_2,
                badge: { label: 'Save 30%', dark: false },
                features: ['2 full units', '10 brush heads total', 'Dual charging cables'],
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-[hsl(200,15%,88%)] bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-[hsl(200,20%,96%)]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  <div
                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${
                      item.badge.dark
                        ? 'bg-[hsl(215,30%,9%)] text-white'
                        : 'bg-[hsl(188,95%,38%)] text-white'
                    }`}
                  >
                    {item.badge.label}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-[hsl(215,30%,9%)] group-hover:text-[hsl(188,95%,38%)] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[hsl(215,10%,46%)] leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.features.map(f => (
                      <span key={f} className="text-xs bg-[hsl(188,95%,38%,0.07)] text-[hsl(188,95%,30%)] px-2.5 py-1 rounded-full font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-heading font-bold text-[hsl(215,30%,9%)]">{item.price}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(188,95%,38%)] bg-[hsl(188,95%,38%,0.08)] px-4 py-2 rounded-full group-hover:bg-[hsl(188,95%,38%)] group-hover:text-white transition-all">
                      Shop Now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BRAND STORY (2-col)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={LIFESTYLE_1}
                  alt="Clean bathroom with ScrubPro"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl px-5 py-4 border border-[hsl(200,15%,91%)] max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-[hsl(188,95%,38%)]" />
                  <span className="text-xs font-semibold text-[hsl(215,25%,20%)]">Time saved</span>
                </div>
                <p className="text-2xl font-heading font-bold text-[hsl(215,30%,9%)]">60%</p>
                <p className="text-xs text-[hsl(215,10%,50%)]">less time per clean session</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[hsl(188,95%,38%)] text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles className="h-3.5 w-3.5" />
                Our Mission
              </div>
              <h2 className="text-4xl font-heading font-bold text-[hsl(215,30%,9%)] text-balance leading-tight">
                A Spotless Home,
                <br />
                Without the Effort.
              </h2>
              <p className="text-[hsl(215,10%,42%)] leading-[1.8] text-base">
                Cleaning is the chore everyone keeps putting off. We built ScrubPro to
                change that — not with a gimmick, but with genuine engineering. A motor
                that delivers. Heads that fit. Waterproofing that holds. Every time.
              </p>
              <ul className="space-y-3.5">
                {[
                  '5 brush heads for tile, corners, flat surfaces, bottles & tubs',
                  'Cuts average cleaning time by up to 60%',
                  'Works on bathroom, kitchen, car, outdoor & more',
                  '1-year full manufacturer warranty included',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[hsl(215,15%,30%)]">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[hsl(188,95%,38%)] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/scrubpro-electric-cleaning-brush"
                className="inline-flex items-center gap-2.5 bg-[hsl(215,30%,9%)] hover:bg-[hsl(215,30%,14%)] text-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide rounded-sm transition-all mt-2"
              >
                Get ScrubPro Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FULL-WIDTH BUNDLE BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-[440px] overflow-hidden">
        <Image
          src={LIFESTYLE_2}
          alt="ScrubPro Bundle — two brushes, zero compromise"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(218,25%,7%,0.92)] via-[hsl(218,25%,7%,0.65)] to-[hsl(218,25%,7%,0.1)]" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(188,95%,38%,0.4)] bg-[hsl(188,95%,38%,0.1)] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(188,95%,50%)] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(188,95%,60%)]">
                Power Bundle
              </span>
            </div>
            <h2 className="text-3xl lg:text-[2.6rem] font-heading font-bold text-white leading-tight">
              Two Brushes.
              <br />
              One Household.
              <br />
              Zero Compromise.
            </h2>
            <p className="text-[hsl(210,15%,70%)] leading-relaxed text-base">
              Get both ScrubPro brushes and save 30%. Keep one in the bathroom,
              one in the kitchen — or give one as a gift.
            </p>
            <Link
              href="/products/scrubpro-power-bundle-2-brushes-10-heads"
              className="inline-flex items-center gap-2.5 bg-[hsl(188,95%,38%)] hover:bg-[hsl(188,95%,33%)] text-white px-8 py-4 text-sm font-bold uppercase tracking-wide rounded-sm transition-all"
            >
              Shop the Bundle — $79.99 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[hsl(218,25%,7%)]">
        <div className="container-custom max-w-xl text-center">
          <div className="inline-flex items-center gap-2 text-[hsl(188,95%,55%)] text-xs font-semibold uppercase tracking-[0.2em] mb-5">
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            Join the Club
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-[hsl(210,15%,55%)] leading-relaxed">
            Cleaning tips, early drops, and exclusive member discounts — straight to your inbox.
          </p>
          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2.5 text-[hsl(188,95%,50%)] font-semibold text-base">
              <CheckCircle2 className="h-5 w-5" />
              You&apos;re in! Check your inbox for your 10% code.
            </div>
          ) : (
            <form className="mt-8 flex gap-2" onSubmit={handleNewsletter}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 border border-[hsl(215,15%,22%)] bg-[hsl(218,20%,12%)] text-white px-4 py-3.5 text-sm placeholder:text-[hsl(215,10%,40%)] focus:border-[hsl(188,95%,38%)] focus:outline-none rounded-sm transition-colors"
              />
              <button
                type="submit"
                className="bg-[hsl(188,95%,38%)] hover:bg-[hsl(188,95%,33%)] text-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors rounded-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-[hsl(215,10%,38%)] mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}
