'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { FluidInner } from './fluid-inner'
import type { FluidProps } from './types'

function FluidCanvas(props: FluidProps) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Suspense fallback={null}>
        <FluidInner {...props} />
      </Suspense>
    </Canvas>
  )
}

// Disable SSR — WebGL is client-only
export const Fluid = dynamic(() => Promise.resolve(FluidCanvas), { ssr: false })
