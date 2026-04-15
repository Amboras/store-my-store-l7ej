'use client'

import { useState } from 'react'
import { X, Zap } from 'lucide-react'
import Link from 'next/link'

const messages = [
  'Free shipping on orders over $75',
  'Flash Sale — 20% off everything today',
  'Over 12,000 homes scrubbed clean with ScrubPro',
]

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [msgIndex] = useState(0)

  if (!isVisible) return null

  return (
    <div className="relative bg-[hsl(218,25%,8%)] text-white overflow-hidden">
      <div className="container-custom flex items-center justify-center gap-2.5 py-2.5">
        <Zap className="h-3.5 w-3.5 text-[hsl(188,95%,50%)] flex-shrink-0" fill="hsl(188,95%,50%)" />
        <p className="text-xs tracking-wide font-medium text-center">
          <span className="text-[hsl(188,95%,60%)] font-semibold">SALE ON NOW —&nbsp;</span>
          {messages[msgIndex]}&nbsp;
          <Link href="/products" className="underline underline-offset-2 hover:text-[hsl(188,95%,60%)] transition-colors">
            Shop now
          </Link>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-60 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
