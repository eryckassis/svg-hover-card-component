'use client'

import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { Fluid as FluidEffect } from '@whatisjery/react-fluid-distortion'

function FluidCanvas() {
  return (
    <Canvas
      gl={{ alpha: true, autoClear: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        pointerEvents: 'none',
        floodColor: '##cfc0a8',
        backgroundColor: 'fff',
        zIndex: 0,
      }}
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
  )
}

export const Fluid = dynamic(() => Promise.resolve(FluidCanvas), {
  ssr: false,
})
