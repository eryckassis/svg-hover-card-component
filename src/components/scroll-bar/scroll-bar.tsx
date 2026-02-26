'use client'

import { useEffect, useRef, useState } from 'react'
import type { ScrollBarProps } from './types'

export function ScrollBar({ trackHeight = 160, width = 2 }: ScrollBarProps) {
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)

  const updateThumbRef = useRef(() => {})
  const updateColorRef = useRef(() => {})

  useEffect(() => {
    const thumb = thumbRef.current
    if (!thumb) return

    updateThumbRef.current = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) {
        thumb.style.opacity = '0'
        return
      }

      const scrollRatio = scrollTop / docHeight
      const thumbHeight = Math.max(
        trackHeight * 0.25,
        (window.innerHeight / document.documentElement.scrollHeight) *
          trackHeight,
      )
      const maxTravel = trackHeight - thumbHeight

      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translateY(${maxTravel * scrollRatio}px)`
      thumb.style.opacity = '1'
    }

    updateColorRef.current = () => {
      const x = window.innerWidth - 16
      const y = window.innerHeight / 2

      const el = document.elementFromPoint(x, y)
      const section = el?.closest('[data-theme]')
      const theme = section?.getAttribute('data-theme')

      setIsDark(theme === 'dark')
    }

    updateThumbRef.current()
    updateColorRef.current()

    const listener = () => {
      requestAnimationFrame(() => {
        updateThumbRef.current()
        updateColorRef.current()
      })
    }

    window.addEventListener('scroll', listener, { passive: true })
    window.addEventListener('resize', listener, { passive: true })

    return () => {
      window.removeEventListener('scroll', listener)
      window.removeEventListener('resize', listener)
    }
  }, [trackHeight])

  return (
    <div
      className="fixed right-6 top-1/2 z-50 -translate-y-1/2"
      style={{ height: trackHeight, width }}
    >
      {}
      <div
        className={`h-full w-full rounded-full transition-colors duration-300 ${
          isDark ? 'bg-white/20' : 'bg-black/10'
        }`}
      />
      {}
      <div
        ref={thumbRef}
        className={`absolute left-0 top-0 w-full rounded-full transition-colors duration-300 ${
          isDark ? 'bg-white/90' : 'bg-black/80'
        }`}
        style={{ height: trackHeight * 0.25 }}
      />
    </div>
  )
}
