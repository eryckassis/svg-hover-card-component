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
import { MotionBlur } from '@/lib/motion-blur-component'
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
      <BallCollider args={[2]} />
    </RigidBody>
  )
}

function Model({ children, color = 'white', roughness = 0.3 }: ModelProps) {
  const ref = useRef<Mesh>(null)
  const { nodes, materials } = useGLTF('/c-transformed.glb') as unknown as {
    nodes: { connector: { geometry: THREE.BufferGeometry } }
    materials: { base: { map: THREE.Texture } }
  }

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
      scale={20}
      geometry={nodes.connector.geometry}
    >
      <meshStandardMaterial
        metalness={0.2}
        roughness={roughness}
        map={materials.base.map}
        envMapIntensity={0.8}
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
  const pos = useMemo<[number, number, number]>(
    () =>
      position || [
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20),
      ],
    [position],
  )

  useFrame(() => {
    if (api.current) {
      api.current.applyImpulse(
        vec
          .copy(api.current.translation() as unknown as THREE.Vector3)
          .negate()
          .multiplyScalar(0.4),
        true,
      )
    }
  })

  return (
    <RigidBody
      linearDamping={1}
      angularDamping={0.5}
      friction={0.1}
      restitution={1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <CuboidCollider args={[0.76, 2.54, 0.76]} />
      <CuboidCollider args={[2.54, 0.76, 0.76]} />
      <CuboidCollider args={[0.76, 0.76, 2.54]} />
      {children ? children : <Model color={color} roughness={roughness} />}
      {accent && <pointLight intensity={4} distance={19} color={color} />}
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
      style={{ borderRadius: 25 }}
    >
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <ambientLight intensity={1.5} />
      <spotLight
        position={[0, 40, 15]}
        angle={0.4}
        penumbra={1}
        intensity={3}
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
                clearcoat={0}
                thickness={0.2}
                anisotropicBlur={0.2}
                chromaticAberration={0.1}
                samples={2}
                resolution={512}
              />
            </Model>
          </Connector>
          <Connector position={[10, 10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={0}
                thickness={0.2}
                anisotropicBlur={0.2}
                chromaticAberration={0.1}
                samples={2}
                resolution={512}
              />
            </Model>
          </Connector>
          <Connector position={[-10, -10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={0}
                thickness={0.2}
                anisotropicBlur={0.2}
                chromaticAberration={0.1}
                samples={2}
                resolution={512}
              />
            </Model>
          </Connector>
          <Connector position={[10, 10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={0}
                thickness={0.2}
                anisotropicBlur={0.2}
                chromaticAberration={0.1}
                samples={2}
                resolution={512}
              />
            </Model>
          </Connector>
          <Connector position={[-10, -10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={0}
                thickness={0.2}
                anisotropicBlur={0.2}
                chromaticAberration={0.1}
                samples={2}
                resolution={512}
              />
            </Model>
          </Connector>
        </Physics>
      </Suspense>
      <EffectComposer enableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={2} intensity={4} />
        <MotionBlur intensity={0.8} />
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
        width: '90%',
        maxWidth: '100%',
        height: 'clamp(500px, 78vh, 700px)',
        background: BACKGROUND_COLOR,
        borderRadius: 35,
        margin: '0 auto',
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  )
}
