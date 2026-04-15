'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold text-[hsl(215,30%,9%)]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description, details }: ProductAccordionProps) {
  return (
    <div className="border-t">
      {description && (
        <AccordionItem title="Product Details" defaultOpen>
          <div
            className="[&_ul]:space-y-1.5 [&_ul]:pl-1 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_p]:mb-3 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AccordionItem>
      )}

      <AccordionItem title="What&apos;s in the Box">
        <ul className="space-y-2 list-none">
          {[
            '1x ScrubPro electric cleaning brush body',
            '5x interchangeable brush heads (tile, flat, corner detail, bottle, bathtub)',
            '1x USB-C magnetic charging cable',
            '1x premium storage case',
            '1x quick-start guide',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[hsl(188,95%,38%)] mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title="Shipping &amp; Returns">
        <ul className="space-y-2 list-none">
          {[
            'Free standard shipping on orders over $75',
            'Express shipping available at checkout',
            '30-day hassle-free returns — no questions asked',
            'Ships within 24 hours on business days',
            'Tracking provided via email upon dispatch',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[hsl(188,95%,38%)] mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title="Care &amp; Maintenance">
        <ul className="space-y-2 list-none">
          {[
            'Rinse brush heads under warm water after each use',
            'IPX7 rated — safe to submerge up to 1 metre in water',
            'Store with the protective case to extend brush head life',
            'Charge fully before first use (approx. 2 hours)',
            'Do not use on polished or delicate surfaces without the flat head',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[hsl(188,95%,38%)] mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>
      </AccordionItem>

      {details && Object.keys(details).length > 0 && (
        <AccordionItem title="Additional Info">
          <div className="space-y-2">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-medium text-foreground capitalize">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </AccordionItem>
      )}
    </div>
  )
}
