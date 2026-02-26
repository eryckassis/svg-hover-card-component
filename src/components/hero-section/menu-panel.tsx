'use client'

import { forwardRef, useRef } from 'react'
import { MenuLinks } from './menu-links'
import { MenuNewsletter } from './menu-newsletter'
import { MenuLabs } from './menu-labs'
import { useMenuAnimation } from './use-menu-animations'

type MenuPanelProps = {
  isOpen: boolean
}

export const MenuPanel = forwardRef<HTMLDivElement, MenuPanelProps>(
  function MenuPanel({ isOpen }, ref) {
    const internalRef = useRef<HTMLDivElement>(null)

    const setRef = (node: HTMLDivElement | null) => {
      ;(internalRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node

      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    }

    useMenuAnimation(internalRef, isOpen)

    return (
      <div
        ref={setRef}
        className="absolute right-0 top-full mt-3 flex w-[320px]  flex-col gap-2"
        style={{
          visibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ willChange: 'transform, opacity' }}>
          <MenuLinks />
        </div>

        <div style={{ willChange: 'transform, opacity' }}>
          <MenuNewsletter />
        </div>

        <div style={{ willChange: 'transform, opacity' }}>
          <MenuLabs />
        </div>
      </div>
    )
  },
)
