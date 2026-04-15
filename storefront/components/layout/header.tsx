'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogIn, Zap } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import CartDrawer from '@/components/cart/cart-drawer'

export default function Header() {
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) mobileMenuCloseRef.current?.focus()
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false) }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !mobileMenuRef.current) return
    const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable.length) return
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-[0_1px_0_0_hsl(200,15%,88%)]'
            : 'bg-white border-b border-[hsl(200,15%,91%)]'
        }`}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 lg:hidden hover:opacity-60 transition-opacity"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(188,95%,38%)]">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="font-heading text-[1.2rem] font-bold tracking-tight text-[hsl(215,30%,9%)]">
                Scrub<span className="text-[hsl(188,95%,38%)]">Pro</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/products" className="text-sm font-medium tracking-wide text-[hsl(215,20%,30%)] hover:text-[hsl(188,95%,38%)] transition-colors">
                Shop All
              </Link>
              <Link href="/products/scrubpro-electric-cleaning-brush" className="text-sm font-medium tracking-wide text-[hsl(215,20%,30%)] hover:text-[hsl(188,95%,38%)] transition-colors">
                ScrubPro Brush
              </Link>
              <Link
                href="/products/scrubpro-power-bundle-2-brushes-10-heads"
                className="text-sm font-semibold tracking-wide text-[hsl(188,95%,38%)] border border-[hsl(188,95%,38%,0.3)] px-4 py-1.5 rounded-full hover:bg-[hsl(188,95%,38%,0.06)] transition-colors"
              >
                Bundle — Save 30%
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <Link href="/search" className="p-2.5 hover:opacity-60 transition-opacity" aria-label="Search">
                <Search className="h-5 w-5" />
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/auth/login'}
                className="p-2.5 hover:opacity-60 transition-opacity hidden sm:block"
                aria-label={isLoggedIn ? 'Account' : 'Sign in'}
              >
                {isLoggedIn ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 hover:opacity-60 transition-opacity"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(188,95%,38%)] text-[10px] font-bold text-white leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleMobileMenuKeyDown}
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white animate-slide-in-right shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(188,95%,38%)]">
                  <Zap className="h-3.5 w-3.5 text-white" fill="white" />
                </div>
                <span className="font-heading text-lg font-bold">
                  Scrub<span className="text-[hsl(188,95%,38%)]">Pro</span>
                </span>
              </div>
              <button ref={mobileMenuCloseRef} onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:opacity-60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-5 py-4 space-y-0">
              {[
                { href: '/products', label: 'Shop All Products' },
                { href: '/products/scrubpro-electric-cleaning-brush', label: 'ScrubPro Brush' },
              ].map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center py-3.5 text-base font-medium border-b border-[hsl(200,15%,92%)] text-[hsl(215,25%,20%)]"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/products/scrubpro-power-bundle-2-brushes-10-heads" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center py-3.5 text-base font-semibold border-b border-[hsl(200,15%,92%)] text-[hsl(188,95%,38%)]"
              >
                Bundle Deal — Save 30%
              </Link>
              <div className="pt-4 space-y-0">
                <Link href={isLoggedIn ? '/account' : '/auth/login'} onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center py-3 text-sm text-[hsl(215,15%,45%)]"
                >
                  {isLoggedIn ? 'My Account' : 'Sign In'}
                </Link>
                <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3 text-sm text-[hsl(215,15%,45%)]">
                  Search
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
