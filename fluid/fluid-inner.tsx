'use client'

import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { useMemo, useRef } from 'react'
import { Camera, Mesh, Scene, Vector2, Vector3 } from 'three'
import { FluidEffectComponent, FluidEffectImpl } from './fluid-effect'
import { useFBOs } from './hooks/use-fbos'
import { useMaterials } from './hooks/use-materials'
import { usePointer } from './hooks/use-pointer'
import type { FluidProps } from './types'
import { FLUID_OPTS } from './constant'

export function FluidInner({
  blend = FLUID_OPTS.blend,
  force = FLUID_OPTS.force,
  radius = FLUID_OPTS.radius,
  curl = FLUID_OPTS.curl,
  swirl = FLUID_OPTS.swirl,
  intensity = FLUID_OPTS.intensity,
  distortion = FLUID_OPTS.distortion,
  fluidColor = FLUID_OPTS.fluidColor,
  backgroundColor = FLUID_OPTS.backgroundColor,
  showBackground = FLUID_OPTS.showBackground,
  rainbow = FLUID_OPTS.rainbow,
  pressure = FLUID_OPTS.pressure,
  densityDissipation = FLUID_OPTS.densityDissipation,
  velocityDissipation = FLUID_OPTS.velocityDissipation,
}: FluidProps) {
  const size = useThree((three) => three.size)
  const gl = useThree((three) => three.gl)

  const bufferScene = useMemo(() => new Scene(), [])
  const bufferCamera = useMemo(() => new Camera(), [])

  const meshRef = useRef<Mesh>(null)
  const postRef = useRef<FluidEffectImpl>(null)

  const FBOs = useFBOs()
  const { setUniform, applyMaterial } = useMaterials()
  const { splatStackRef } = usePointer({ force })

  useFrame(({ gl: frameGl }) => {
    if (!meshRef.current || !postRef.current) return

    const mesh = meshRef.current
    const splatStack = splatStackRef.current

    const renderTo = (targetKey: keyof typeof FBOs) => {
      const target = FBOs[targetKey]
      if ('write' in target) {
        gl.setRenderTarget(target.write)
        gl.clear()
        gl.render(bufferScene, bufferCamera)
        target.swap()
      } else {
        gl.setRenderTarget(target)
        gl.clear()
        gl.render(bufferScene, bufferCamera)
      }
    }

    for (let i = splatStack.length - 1; i >= 0; i--) {
      const { mouseX, mouseY, velocityX, velocityY } = splatStack[i]
      applyMaterial(mesh, 'splat')
      setUniform('splat', 'uTarget', FBOs.velocity.read.texture)
      setUniform('splat', 'uPointer', new Vector2(mouseX, mouseY))
      setUniform('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0))
      setUniform('splat', 'uRadius', radius / 100.0)
      renderTo('velocity')
      setUniform('splat', 'uTarget', FBOs.density.read.texture)
      renderTo('density')
      splatStack.pop()
    }

    applyMaterial(mesh, 'curl')
    setUniform('curl', 'uVelocity', FBOs.velocity.read.texture)
    renderTo('curl')

    applyMaterial(mesh, 'vorticity')
    setUniform('vorticity', 'uVelocity', FBOs.velocity.read.texture)
    setUniform('vorticity', 'uCurl', FBOs.curl.texture)
    setUniform('vorticity', 'uCurlValue', curl)
    renderTo('velocity')

    applyMaterial(mesh, 'divergence')
    setUniform('divergence', 'uVelocity', FBOs.velocity.read.texture)
    renderTo('divergence')

    applyMaterial(mesh, 'clear')
    setUniform('clear', 'uTexture', FBOs.pressure.read.texture)
    setUniform('clear', 'uClearValue', pressure)
    renderTo('pressure')

    applyMaterial(mesh, 'pressure')
    setUniform('pressure', 'uDivergence', FBOs.divergence.texture)
    for (let i = 0; i < swirl; i++) {
      setUniform('pressure', 'uPressure', FBOs.pressure.read.texture)
      renderTo('pressure')
    }

    applyMaterial(mesh, 'gradientSubstract')
    setUniform('gradientSubstract', 'uPressure', FBOs.pressure.read.texture)
    setUniform('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture)
    renderTo('velocity')

    applyMaterial(mesh, 'advection')
    setUniform('advection', 'uVelocity', FBOs.velocity.read.texture)
    setUniform('advection', 'uSource', FBOs.velocity.read.texture)
    setUniform('advection', 'uDissipation', velocityDissipation)
    renderTo('velocity')

    setUniform('advection', 'uVelocity', FBOs.velocity.read.texture)
    setUniform('advection', 'uSource', FBOs.density.read.texture)
    setUniform('advection', 'uDissipation', densityDissipation)
    renderTo('density')

    const tFluidUniform = postRef.current.uniforms.get('tFluid')
    if (tFluidUniform) tFluidUniform.value = FBOs.density.read.texture

    frameGl.setRenderTarget(null)
    frameGl.clear()
  })

  return (
    <>
      {createPortal(
        <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
          <planeGeometry args={[2, 2, 10, 10]} />
        </mesh>,
        bufferScene,
      )}

      <EffectComposer>
        <FluidEffectComponent
          ref={postRef}
          intensity={intensity * 0.0001}
          rainbow={rainbow}
          distortion={distortion * 0.001}
          backgroundColor={backgroundColor}
          blend={blend * 0.01}
          fluidColor={fluidColor}
          showBackground={showBackground}
        />
      </EffectComposer>
    </>
  )
}
