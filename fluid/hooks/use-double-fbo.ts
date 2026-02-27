import * as THREE from 'three'
import { useFBO } from '@react-three/drei'
import { useMemo, useRef } from 'react'

export type DoubleFBO = {
  read: THREE.WebGLRenderTarget
  write: THREE.WebGLRenderTarget
  swap: () => void
  dispose: () => void
}

type Options = {
  minFilter?: THREE.TextureFilter
  format?: THREE.PixelFormat
  type?: THREE.TextureDataType
  depth: boolean
}

export function useDoubleFBO(
  width: number,
  height: number,
  options: Options,
): DoubleFBO {
  const read = useFBO(width, height, options)
  const write = useFBO(width, height, options)

  const readRef = useRef(read)
  const writeRef = useRef(write)

  return useMemo<DoubleFBO>(
    () => ({
      get read() {
        return readRef.current
      },
      get write() {
        return writeRef.current
      },
      swap() {
        const temp = readRef.current
        readRef.current = writeRef.current
        writeRef.current = temp
      },
      dispose() {
        readRef.current.dispose()
        writeRef.current.dispose()
      },
    }),

    [],
  )
}
