'use client'

import { forwardRef, useMemo, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { MotionBlurEffect } from './motion-blur'

type MotionBlurProps = {
  intensity?: number
}

export const MotionBlur = forwardRef<MotionBlurEffect, MotionBlurProps>(
  function MotionBlur({ intensity = 0.4 }, ref) {
    const { scene, camera } = useThree()

    const effect = useMemo(
      () => new MotionBlurEffect(scene, camera, { intensity }),
      [scene, camera, intensity],
    )

    useEffect(() => {
      return () => effect.dispose()
    }, [effect])

    return <primitive ref={ref} object={effect} dispose={null} />
  },
)
