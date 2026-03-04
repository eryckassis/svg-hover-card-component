'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { Fluid as FluidEffect } from '@whatisjery/react-fluid-distortion'

function FluidCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const targets = document.querySelectorAll('[data-no-fluid]')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting)
        wrapper.style.opacity = anyVisible ? '0' : '1'
      },
      { threshold: 0.05 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <EffectComposer>
          <FluidEffect
            showBackground={false}
            rainbow={false}
            blend={5}
            intensity={0.4}
            force={1.3}
            radius={0.4}
            curl={3}
            swirl={5}
            densityDissipation={0.89}
            velocityDissipation={1}
            pressure={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export const Fluid = dynamic(() => Promise.resolve(FluidCanvas), {
  ssr: false,
})
