'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { TwinTextHandle, TwinTextProps } from './types'

const DEFAULTS = {
  duration: 0.5,
  ease: 'power4.out',
} as const

export const TwinText = forwardRef<TwinTextHandle, TwinTextProps>(
  function TwinText(
    {
      text,
      className = '',
      duration = DEFAULTS.duration,
      ease = DEFAULTS.ease,
      hoverParent = false,
      controlled = false,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLSpanElement>(null)
    const originalRef = useRef<HTMLSpanElement>(null)
    const cloneRef = useRef<HTMLSpanElement>(null)
    const cleanupRef = useRef<(() => void) | null>(null)

    const enterFnRef = useRef<(() => void) | null>(null)
    const leaveFnRef = useRef<(() => void) | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        enter: () => enterFnRef.current?.(),
        leave: () => leaveFnRef.current?.(),
      }),
      [],
    )

    useEffect(() => {
      let cancelled = false

      cleanupRef.current?.()
      cleanupRef.current = null

      async function init() {
        const { loadGsap } = await import('@/lib/gsap')
        const { gsap } = await loadGsap()

        if (cancelled) return

        const container = containerRef.current
        const original = originalRef.current
        const clone = cloneRef.current

        if (!container || !original || !clone) return

        const lineHeight = original.offsetHeight

        gsap.set(original, { y: 0 })
        gsap.set(clone, { y: lineHeight })

        const onEnter = () => {
          gsap.to(original, {
            y: -lineHeight,
            duration,
            ease,
            overwrite: true,
          })
          gsap.to(clone, { y: 0, duration, ease, overwrite: true })
        }

        const onLeave = () => {
          gsap.to(original, { y: 0, duration, ease, overwrite: true })
          gsap.to(clone, { y: lineHeight, duration, ease, overwrite: true })
        }

        enterFnRef.current = onEnter
        leaveFnRef.current = onLeave

        if (!controlled) {
          const trigger = hoverParent
            ? (container.parentElement ?? container)
            : container

          trigger.addEventListener('mouseenter', onEnter)
          trigger.addEventListener('mouseleave', onLeave)

          cleanupRef.current = () => {
            trigger.removeEventListener('mouseenter', onEnter)
            trigger.removeEventListener('mouseleave', onLeave)
          }
        }
      }

      init()

      return () => {
        cancelled = true
        cleanupRef.current?.()
        cleanupRef.current = null
        enterFnRef.current = null
        leaveFnRef.current = null
      }
    }, [duration, ease, hoverParent, controlled])

    return (
      <span
        ref={containerRef}
        className={`relative inline-flex overflow-hidden ${className}`}
        aria-label={text}
      >
        {}
        <span
          ref={originalRef}
          className="inline-block"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        >
          {text}
        </span>

        {}
        <span
          ref={cloneRef}
          className="absolute left-0 top-0 inline-block"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        >
          {text}
        </span>
      </span>
    )
  },
)
