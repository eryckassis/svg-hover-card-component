'use client'

import { forwardRef, useEffect, useRef } from 'react'
import type { TwinArrowProps } from './type'

const DEFAULTS = {
  duration: 0.5,
  ease: 'power3.out',
  distance: 16,
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
} as const

function ArrowSvg({
  path,
  width,
  height,
  viewBox,
  stroke,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
}: {
  path: string
  width: number
  height: number
  viewBox: string
  stroke: string
  strokeWidth: number
  strokeLinecap: 'round' | 'butt' | 'square'
  strokeLinejoin: 'round' | 'miter' | 'bevel'
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox={viewBox}
    >
      <path
        stroke={stroke}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        strokeWidth={strokeWidth}
        d={path}
      />
    </svg>
  )
}

export const TwinArrow = forwardRef<HTMLSpanElement, TwinArrowProps>(
  function TwinArrow(
    {
      path,
      className = '',
      duration = DEFAULTS.duration,
      ease = DEFAULTS.ease,
      hoverParent = false,
      distance = DEFAULTS.distance,
      width = DEFAULTS.width,
      height = DEFAULTS.height,
      viewBox = DEFAULTS.viewBox,
      stroke = DEFAULTS.stroke,
      strokeWidth = DEFAULTS.strokeWidth,
      strokeLinecap = DEFAULTS.strokeLinecap,
      strokeLinejoin = DEFAULTS.strokeLinejoin,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLSpanElement>(null)
    const originalRef = useRef<HTMLSpanElement>(null)
    const cloneRef = useRef<HTMLSpanElement>(null)
    const cleanupRef = useRef<(() => void) | null>(null)

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

        const trigger = hoverParent
          ? (container.parentElement ?? container)
          : container

        const d = distance
        const stagger = 0

        gsap.set(original, { x: 0, y: 0, opacity: 1 })
        gsap.set(clone, { x: -d, y: d, opacity: 0 })

        const onEnter = () => {
          gsap.to(original, {
            x: d,
            y: -d,
            opacity: 0,
            duration,
            ease,
            overwrite: true,
          })

          gsap.to(clone, {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay: stagger,
            ease,
            overwrite: true,
          })
        }

        const onLeave = () => {
          gsap.to(clone, {
            x: -d,
            y: d,
            opacity: 0,
            duration,
            ease,
            overwrite: true,
          })

          gsap.to(original, {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay: stagger,
            ease,
            overwrite: true,
          })
        }

        trigger.addEventListener('mouseenter', onEnter)
        trigger.addEventListener('mouseleave', onLeave)

        cleanupRef.current = () => {
          trigger.removeEventListener('mouseenter', onEnter)
          trigger.removeEventListener('mouseleave', onLeave)
        }
      }

      init()

      return () => {
        cancelled = true
        cleanupRef.current?.()
        cleanupRef.current = null
      }
    }, [duration, ease, hoverParent, distance])

    const svgProps = {
      path,
      width,
      height,
      viewBox,
      stroke,
      strokeWidth,
      strokeLinecap,
      strokeLinejoin,
    }

    return (
      <span
        ref={(node) => {
          ;(
            containerRef as React.MutableRefObject<HTMLSpanElement | null>
          ).current = node

          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ;(ref as React.MutableRefObject<HTMLSpanElement | null>).current =
              node
          }
        }}
        className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
        style={{ width, height }}
      >
        {}
        <span
          ref={originalRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <ArrowSvg {...svgProps} />
        </span>

        {}
        <span
          ref={cloneRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ willChange: 'transform, opacity' }}
          aria-hidden="true"
        >
          <ArrowSvg {...svgProps} />
        </span>
      </span>
    )
  },
)
