import * as THREE from 'three'
import { Effect } from 'postprocessing'

const velocityVertexShader = `
  uniform mat4 uPrevModelViewMatrix;

  varying vec4 vClipPos;
  varying vec4 vPrevClipPos;

  void main() {
    vec4 pos = vec4(position, 1.0);
    vClipPos = projectionMatrix * modelViewMatrix * pos;
    vPrevClipPos = projectionMatrix * uPrevModelViewMatrix * pos;
    gl_Position = vClipPos;
  }
`

const velocityFragmentShader = `
  varying vec4 vClipPos;
  varying vec4 vPrevClipPos;

  void main() {
    vec2 current = vClipPos.xy / vClipPos.w * 0.5 + 0.5;
    vec2 prev = vPrevClipPos.xy / vPrevClipPos.w * 0.5 + 0.5;
    vec2 velocity = current - prev;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

const motionBlurFragment = `
  uniform sampler2D uVelocityMap;
  uniform float uIntensity;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 velocity = texture2D(uVelocityMap, uv).rg * uIntensity;

    vec4 color = inputColor;

    const int SAMPLES = 12;

    for (int i = 1; i < SAMPLES; i++) {
      float t = float(i) / float(SAMPLES - 1) - 0.5;
      vec2 sampleUV = clamp(uv + velocity * t, 0.0, 1.0);
      color += texture2D(inputBuffer, sampleUV);
    }

    outputColor = color / float(SAMPLES);
  }
`

const prevMatrices = new WeakMap<THREE.Object3D, THREE.Matrix4>()
const velocityMaterials = new WeakMap<THREE.Mesh, THREE.ShaderMaterial>()

function getVelocityMaterial(mesh: THREE.Mesh): THREE.ShaderMaterial {
  let mat = velocityMaterials.get(mesh)
  if (!mat) {
    mat = new THREE.ShaderMaterial({
      vertexShader: velocityVertexShader,
      fragmentShader: velocityFragmentShader,
      uniforms: {
        uPrevModelViewMatrix: { value: new THREE.Matrix4() },
      },
    })
    velocityMaterials.set(mesh, mat)
  }
  return mat
}

export class MotionBlurEffect extends Effect {
  private velocityTarget: THREE.WebGLRenderTarget
  private scene: THREE.Scene
  private camera: THREE.Camera
  private materialCache: Map<THREE.Mesh, THREE.Material | THREE.Material[]>

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    { intensity = 0.8 } = {},
  ) {
    const velocityTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
    })

    super('MotionBlurEffect', motionBlurFragment, {
      uniforms: new Map<string, THREE.Uniform>([
        ['uVelocityMap', new THREE.Uniform(velocityTarget.texture)],
        ['uIntensity', new THREE.Uniform(intensity)],
      ]),
    })

    this.velocityTarget = velocityTarget
    this.scene = scene
    this.camera = camera
    this.materialCache = new Map()
  }

  set intensity(value: number) {
    const uniform = this.uniforms.get('uIntensity')
    if (uniform) uniform.value = value
  }

  get intensity(): number {
    return this.uniforms.get('uIntensity')?.value ?? 0
  }

  update(renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget) {
    const { width, height } = inputBuffer
    if (
      this.velocityTarget.width !== width ||
      this.velocityTarget.height !== height
    ) {
      this.velocityTarget.setSize(width, height)
    }

    this.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || !obj.visible) return

      this.materialCache.set(obj, obj.material)

      const velMat = getVelocityMaterial(obj)
      const prevMatrix = prevMatrices.get(obj)

      if (prevMatrix) {
        velMat.uniforms.uPrevModelViewMatrix.value.copy(prevMatrix)
      } else {
        velMat.uniforms.uPrevModelViewMatrix.value.copy(obj.modelViewMatrix)
      }

      obj.material = velMat
    })

    const prevTarget = renderer.getRenderTarget()
    const prevAutoClear = renderer.autoClear
    renderer.autoClear = true
    renderer.setRenderTarget(this.velocityTarget)
    renderer.render(this.scene, this.camera)
    renderer.setRenderTarget(prevTarget)
    renderer.autoClear = prevAutoClear

    this.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return

      const originalMat = this.materialCache.get(obj)
      if (originalMat) {
        obj.material = originalMat
      }

      let prev = prevMatrices.get(obj)
      if (!prev) {
        prev = new THREE.Matrix4()
        prevMatrices.set(obj, prev)
      }
      prev.copy(obj.modelViewMatrix)
    })

    this.materialCache.clear()
  }

  dispose() {
    this.velocityTarget.dispose()
    super.dispose()
  }
}
