import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

export type SplatStack = {
  mouseX: number
  mouseY: number
  velocityX: number
  velocityY: number
}

export function usePointer({ force }: { force: number }) {
  const size = useThree((three) => three.size)

  const splatStackRef = useRef<SplatStack[]>([])
  const lastMouse = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  // Keep a ref to current size & force so the listener always uses fresh values
  const stateRef = useRef({ size, force })
  useEffect(() => {
    stateRef.current = { size, force }
  }, [size, force])

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const { size: s, force: f } = stateRef.current

      if (!hasMoved.current) {
        hasMoved.current = true
        lastMouse.current = { x: e.clientX, y: e.clientY }
        return
      }

      const deltaX = e.clientX - lastMouse.current.x
      const deltaY = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }

      splatStackRef.current.push({
        mouseX: e.clientX / s.width,
        mouseY: 1.0 - e.clientY / s.height,
        velocityX: deltaX * f,
        velocityY: -deltaY * f,
      })
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return { splatStackRef }
}
