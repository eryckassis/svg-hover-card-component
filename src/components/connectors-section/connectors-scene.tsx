'use client'

import * as THREE from 'three'
import { useRef, useReducer, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  Lightformer,
} from '@react-three/drei'
import {
  CuboidCollider,
  BallCollider,
  Physics,
  RigidBody,
} from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import type { RapierRigidBody } from '@react-three/rapier'
import type { Mesh } from 'three'
import type { ModelProps, ConnectorProps } from './types'
import { ACCENTS, BACKGROUND_COLOR, shuffle } from './constants'

function Pointer() {
  const ref = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0,
      ),
    )
  })

  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function Model({ children, color = 'white', roughness = 0 }: ModelProps) {
  const ref = useRef<Mesh>(null)

  const { nodes, materials } = useGLTF('/c-transformed.glb') as any

  useFrame((_state, delta) => {
    if (ref.current) {
      easing.dampC(
        (ref.current.material as THREE.MeshStandardMaterial).color,
        color,
        0.2,
        delta,
      )
    }
  })

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      scale={10}
      geometry={nodes.connector.geometry}
    >
      <meshStandardMaterial
        metalness={0.2}
        roughness={roughness}
        map={materials.base.map}
      />
      {children}
    </mesh>
  )
}

function Connector({
  position,
  children,
  accent,
  color,
  roughness,
}: ConnectorProps) {
  const api = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo<[number, number, number]>(
    () => position || [r(20), r(20), r(20)],

    [],
  )

  useFrame(() => {
    if (api.current) {
      api.current.applyImpulse(
        vec
          .copy(api.current.translation() as unknown as THREE.Vector3)
          .negate()
          .multiplyScalar(0.1),
        true,
      )
    }
  })

  return (
    <RigidBody
      linearDamping={2}
      angularDamping={1}
      friction={0.1}
      restitution={1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model color={color} roughness={roughness} />}
      {accent && <pointLight intensity={4} distance={9.5} color={color} />}
    </RigidBody>
  )
}

function Scene() {
  const [accent, click] = useReducer(
    (state: number) => ++state % ACCENTS.length,
    0,
  )
  const connectors = useMemo(() => shuffle(accent), [accent])

  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      style={{ borderRadius: 10 }}
    >
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Suspense fallback={null}>
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {connectors.map((props, i) => (
            <Connector key={i} {...props} />
          ))}
          <Connector position={[10, 10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={1}
                thickness={0.1}
                anisotropicBlur={0.1}
                chromaticAberration={0.1}
                samples={8}
                resolution={512}
              />
            </Model>
          </Connector>
        </Physics>
      </Suspense>
      <EffectComposer enableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
        </group>
      </Environment>
    </Canvas>
  )
}

export function ConnectorsScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '80vh',
        background: BACKGROUND_COLOR,
        borderRadius: 20,
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  )
}
