'use client'

import { Effect } from 'postprocessing'
import { forwardRef, useEffect, useMemo } from 'react'
import { Texture, Uniform, Vector3 } from 'three'
import type { FluidEffectProps } from './types'
import { hexToRgb } from './utils'
import { postFrag } from './glsl/post'
import { FLUID_OPTS } from './constant'

type FluidUniforms = {
  tFluid: Texture | null
  uColor: Vector3
  uBackgroundColor: Vector3
  uRainbow: boolean
  uShowBackground: boolean
  uDistort: number
  uBlend: number
  uIntensity: number
}

export class FluidEffectImpl extends Effect {
  state: Partial<FluidEffectProps>

  constructor(props: FluidEffectProps = {}) {
    const uniforms: Record<keyof FluidUniforms, Uniform> = {
      tFluid: new Uniform(props.tFluid ?? null),
      uDistort: new Uniform(props.distortion ?? FLUID_OPTS.distortion),
      uRainbow: new Uniform(props.rainbow ?? FLUID_OPTS.rainbow),
      uIntensity: new Uniform(props.intensity ?? FLUID_OPTS.intensity),
      uBlend: new Uniform(props.blend ?? FLUID_OPTS.blend),
      uShowBackground: new Uniform(
        props.showBackground ?? FLUID_OPTS.showBackground,
      ),
      uColor: new Uniform(hexToRgb(props.fluidColor ?? FLUID_OPTS.fluidColor)),
      uBackgroundColor: new Uniform(
        hexToRgb(props.backgroundColor ?? FLUID_OPTS.backgroundColor),
      ),
    }

    super('FluidEffect', postFrag, {
      uniforms: new Map(Object.entries(uniforms)),
    })
    this.state = { ...props }
  }

  private updateUniform<K extends keyof FluidUniforms>(
    key: K,
    value: FluidUniforms[K],
  ) {
    const uniform = this.uniforms.get(key)
    if (uniform) uniform.value = value
  }

  update() {
    this.updateUniform(
      'uIntensity',
      this.state.intensity ?? FLUID_OPTS.intensity,
    )
    this.updateUniform(
      'uDistort',
      this.state.distortion ?? FLUID_OPTS.distortion,
    )
    this.updateUniform('uRainbow', this.state.rainbow ?? FLUID_OPTS.rainbow)
    this.updateUniform('uBlend', this.state.blend ?? FLUID_OPTS.blend)
    this.updateUniform(
      'uShowBackground',
      this.state.showBackground ?? FLUID_OPTS.showBackground,
    )
    this.updateUniform(
      'uColor',
      hexToRgb(this.state.fluidColor ?? FLUID_OPTS.fluidColor),
    )
    this.updateUniform(
      'uBackgroundColor',
      hexToRgb(this.state.backgroundColor ?? FLUID_OPTS.backgroundColor),
    )
  }
}

export const FluidEffectComponent = forwardRef<
  FluidEffectImpl,
  FluidEffectProps
>(function FluidEffectComponent(props, ref) {
  const effect = useMemo(() => new FluidEffectImpl(props), [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  }, [effect])

  return <primitive ref={ref} object={effect} />
})
