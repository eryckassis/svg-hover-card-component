import * as THREE from 'three'
import { useFBO } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { useDoubleFBO } from './use-double-fbo'
import { FLUID_OPTS } from '../constant'

export function useFBOs() {
  const density = useDoubleFBO(FLUID_OPTS.dyeRes, FLUID_OPTS.dyeRes, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    depth: false,
  })

  const velocity = useDoubleFBO(FLUID_OPTS.simRes, FLUID_OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RGFormat,
    minFilter: THREE.LinearFilter,
    depth: false,
  })

  const pressure = useDoubleFBO(FLUID_OPTS.simRes, FLUID_OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  })

  const divergence = useFBO(FLUID_OPTS.simRes, FLUID_OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  })

  const curl = useFBO(FLUID_OPTS.simRes, FLUID_OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  })

  const FBOs = useMemo(
    () => ({ density, velocity, pressure, divergence, curl }),
    [curl, density, divergence, pressure, velocity],
  )

  useEffect(() => {
    return () => {
      for (const fbo of Object.values(FBOs)) {
        fbo.dispose()
      }
    }
  }, [FBOs])

  return FBOs
}
