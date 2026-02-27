import type { Texture } from 'three'

export type SharedProps = {
  blend?: number
  intensity?: number
  distortion?: number
  rainbow?: boolean
  fluidColor?: string
  backgroundColor?: string
  showBackground?: boolean
}

export type FluidProps = SharedProps & {
  densityDissipation?: number
  pressure?: number
  velocityDissipation?: number
  force?: number
  radius?: number
  curl?: number
  swirl?: number
}

export type FluidEffectProps = SharedProps & {
  tFluid?: Texture
}
