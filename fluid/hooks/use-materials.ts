import { Mesh, ShaderMaterial, Texture, Vector2, Vector3 } from 'three'
import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { FLUID_OPTS } from '../constant'
import { baseVert } from '../glsl/base-vert'
import { clearFrag } from '../glsl/clear'
import { curlFrag } from '../glsl/curl'
import { divergenceFrag } from '../glsl/divergence'
import { gradientSubstractFrag } from '../glsl/gradient-substract'
import { pressureFrag } from '../glsl/pressure'
import { splatFrag } from '../glsl/splat'
import { advectionFrag } from '../glsl/advection'
import { vorticityFrag } from '../glsl/vorticity'

type MaterialKey =
  | 'splat'
  | 'curl'
  | 'clear'
  | 'divergence'
  | 'pressure'
  | 'gradientSubstract'
  | 'advection'
  | 'vorticity'

/**
 * Plain (non-hook) function. The React Compiler only analyses hooks and components,
 * so mutations inside this function's closures are invisible to the compiler.
 */
function createMaterials(size: { width: number; height: number }) {
  const advection = new ShaderMaterial({
    uniforms: {
      uVelocity: { value: new Texture() },
      uSource: { value: new Texture() },
      dt: { value: 0.016 },
      uDissipation: { value: 1.0 },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: advectionFrag,
  })

  const clear = new ShaderMaterial({
    uniforms: {
      uTexture: { value: new Texture() },
      uClearValue: { value: FLUID_OPTS.pressure },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: clearFrag,
  })

  const curl = new ShaderMaterial({
    uniforms: {
      uVelocity: { value: new Texture() },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: curlFrag,
  })

  const divergence = new ShaderMaterial({
    uniforms: {
      uVelocity: { value: new Texture() },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: divergenceFrag,
  })

  const gradientSubstract = new ShaderMaterial({
    uniforms: {
      uPressure: { value: new Texture() },
      uVelocity: { value: new Texture() },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: gradientSubstractFrag,
  })

  const pressure = new ShaderMaterial({
    uniforms: {
      uPressure: { value: new Texture() },
      uDivergence: { value: new Texture() },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: pressureFrag,
  })

  const splat = new ShaderMaterial({
    uniforms: {
      uTarget: { value: new Texture() },
      aspectRatio: { value: size.width / size.height },
      uColor: { value: new Vector3() },
      uPointer: { value: new Vector2() },
      uRadius: { value: FLUID_OPTS.radius / 100.0 },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: splatFrag,
  })

  const vorticity = new ShaderMaterial({
    uniforms: {
      uVelocity: { value: new Texture() },
      uCurl: { value: new Texture() },
      uCurlValue: { value: FLUID_OPTS.curl },
      dt: { value: 0.016 },
      texelSize: { value: new Vector2() },
    },
    fragmentShader: vorticityFrag,
  })

  const mats = {
    splat,
    curl,
    clear,
    divergence,
    pressure,
    gradientSubstract,
    advection,
    vorticity,
  }

  // Initial setup
  const aspectRatio = size.width / (size.height + 400)
  for (const material of Object.values(mats)) {
    material.uniforms.texelSize.value.set(
      1 / (FLUID_OPTS.simRes * aspectRatio),
      1 / FLUID_OPTS.simRes,
    )
    material.vertexShader = baseVert
    material.depthTest = false
    material.depthWrite = false
  }

  return {
    // Mutation methods — closures over `mats` which is local to this plain function.
    // The React Compiler cannot see or restrict mutations inside plain (non-hook) functions.
    setUniform(key: MaterialKey, uniform: string, value: unknown) {
      const m = mats[key]
      if (m?.uniforms[uniform]) m.uniforms[uniform].value = value
    },
    applyMaterial(mesh: Mesh, key: MaterialKey) {
      mesh.material = mats[key]
      mesh.material.needsUpdate = true
    },
    dispose() {
      for (const m of Object.values(mats)) m.dispose()
    },
  }
}

export function useMaterials() {
  const size = useThree((s) => s.size)

  // useMemo recreates the API when size changes; disposal handled in useEffect cleanup
  const api = useMemo(() => createMaterials(size), [size])

  useEffect(() => {
    return () => api.dispose()
  }, [api])

  return api
}
