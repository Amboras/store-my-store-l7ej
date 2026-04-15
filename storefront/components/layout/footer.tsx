'use client'

import Link from 'next/link'
import { Zap, Shield, Truck, RotateCcw } from 'lucide-react'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'ScrubPro Brush', href: '/products/scrubpro-electric-cleaning-brush' },
    { label: 'Power Bundle', href: '/products/scrubpro-power-bundle-2-brushes-10-heads' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [
    { label: 'About', href: '/about' },
  ]
  if (policies?.privacy_policy) companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  if (policies?.terms_of_service) companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  if (policies?.refund_policy) companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  if (policies?.cookie_policy) companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })

  return (
    <footer className="border-t bg-[hsl(215,25%,6%)] text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10 py-4">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8 text-xs text-[hsl(210,15%,60%)]">
            <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Secure Checkout</span>
            <span className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" /> Free Shipping Over $75</span>
            <span className="flex items-center gap-2"><RotateCcw className="h-3.5 w-3.5" /> 30-Day Returns</span>
            <span className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-[hsl(195,90%,50%)]" /> 1-Year Warranty</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(195,90%,40%)]">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                Scrub<span className="text-[hsl(195,90%,50%)]">Pro</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-[hsl(210,15%,55%)] leading-relaxed max-w-xs">
              Professional-grade electric cleaning brushes for the modern home. Clean smarter, not harder.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/50">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[hsl(210,15%,55%)] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/50">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[hsl(210,15%,55%)] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/50">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[hsl(210,15%,55%)] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(210,15%,40%)]">
            &copy; {new Date().getFullYear()} ScrubPro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs text-[hsl(210,15%,40%)] hover:text-white transition-colors"
            >
              Manage Cookies
            </button>
            <span className="text-xs text-[hsl(210,15%,30%)]">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
