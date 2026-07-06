import * as THREE from 'three'

import { loadIpodModel } from '@/lib/mp3Player/loadIpodModel'
import {
  createIpodScreenUpdater,
  findScreenTargets,
  IPOD_SCREEN_MATERIAL,
} from '@/lib/mp3Player/ipodScreenTexture'

export interface Mp3PlayerScreenState {
  artworkUrl: string
}

export interface Mp3PlayerSceneCallbacks {
  onToggle: () => void
  onPrev: () => void
  onNext: () => void
}

export interface Mp3PlayerScene {
  updateScreen: (state: Mp3PlayerScreenState) => void
  dispose: () => void
}

const FLOAT_PADDING = 1.1
const STAGE_SCALE = 1.62

const PLAY_MATERIALS = new Set(['lambert3SG', 'blinn2SG', IPOD_SCREEN_MATERIAL])

function getMaterialName(mesh: THREE.Mesh): string {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
  return material?.name ?? ''
}

function collectMeshes(root: THREE.Object3D): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = []
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) meshes.push(child)
  })
  return meshes
}

function resolveWheelSector(
  hit: THREE.Intersection,
  mesh: THREE.Mesh,
): 'toggle' | 'prev' | 'next' {
  const localPoint = mesh.worldToLocal(hit.point.clone())
  mesh.geometry.computeBoundingBox()
  const bounds = mesh.geometry.boundingBox
  if (!bounds) return 'toggle'

  const center = bounds.getCenter(new THREE.Vector3())
  const dx = localPoint.x - center.x
  const dy = localPoint.y - center.y
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI

  if (angle >= -135 && angle <= -45) return 'toggle'
  if (angle > 45 && angle < 135) return 'prev'
  if (angle >= -45 && angle <= 45) return 'next'

  return 'toggle'
}

function resolveClickAction(
  hit: THREE.Intersection,
  wheelBounds: THREE.Box3,
  device: THREE.Object3D,
): 'toggle' | 'prev' | 'next' | null {
  const mesh = hit.object as THREE.Mesh
  const materialName = getMaterialName(mesh)

  if (PLAY_MATERIALS.has(materialName)) return 'toggle'
  if (materialName === 'blinn3SG') return resolveWheelSector(hit, mesh)

  const localPoint = device.worldToLocal(hit.point.clone())
  if (!wheelBounds.containsPoint(localPoint)) return null

  const center = new THREE.Vector3()
  wheelBounds.getCenter(center)
  const dx = localPoint.x - center.x
  const dy = localPoint.y - center.y
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI

  if (angle >= -135 && angle <= -45) return 'toggle'
  if (angle > 45 && angle < 135) return 'prev'
  if (angle >= -45 && angle <= 45) return 'next'

  return 'toggle'
}

function fitCameraToStage(
  camera: THREE.PerspectiveCamera,
  stage: THREE.Object3D,
  aspect: number,
  padding = FLOAT_PADDING,
) {
  const box = new THREE.Box3().setFromObject(stage)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const fovRadians = (camera.fov * Math.PI) / 180
  const distanceForHeight = (size.y * padding) / (2 * Math.tan(fovRadians / 2))
  const distanceForWidth = (size.x * padding) / (2 * Math.tan(fovRadians / 2) * aspect)
  const distance = Math.max(distanceForHeight, distanceForWidth) + size.z * 0.35

  camera.position.set(center.x + 0.35, center.y + 0.05, center.z + distance)
  camera.lookAt(center.x, center.y, center.z)
  camera.updateProjectionMatrix()
}

export async function createMp3PlayerScene(
  container: HTMLElement,
  callbacks: Mp3PlayerSceneCallbacks,
): Promise<Mp3PlayerScene> {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.className = 'mp3-player__canvas'
  renderer.domElement.style.touchAction = 'none'
  container.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.58)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
  keyLight.position.set(2.2, 4.5, 3.8)
  const fillLight = new THREE.DirectionalLight(0xcbd5e1, 0.35)
  fillLight.position.set(-2.5, 0.5, 2)
  const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.38)
  rimLight.position.set(-3, 2, -2)
  scene.add(ambient, keyLight, fillLight, rimLight)

  const stage = new THREE.Group()
  stage.scale.setScalar(STAGE_SCALE)
  scene.add(stage)

  const device = new THREE.Group()
  stage.add(device)

  const { root: ipodModel, bounds: ipodBounds } = await loadIpodModel()
  device.add(ipodModel)

  const screenTargets = findScreenTargets(ipodModel)
  const screenUpdater =
    screenTargets.length > 0 ? await createIpodScreenUpdater(screenTargets) : null

  const modelMeshes = collectMeshes(ipodModel)
  const ipodSize = ipodBounds.getSize(new THREE.Vector3())
  const wheelBounds = new THREE.Box3(
    new THREE.Vector3(ipodBounds.min.x, ipodBounds.min.y, ipodBounds.min.z - 0.05),
    new THREE.Vector3(
      ipodBounds.max.x,
      ipodBounds.min.y + ipodSize.y * 0.38,
      ipodBounds.max.z + 0.05,
    ),
  )

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(ipodSize.x * 0.72, 48),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.set(0, ipodBounds.min.y - ipodSize.y * 0.06, 0)
  stage.add(shadow)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const resize = () => {
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) return
    camera.aspect = clientWidth / clientHeight
    renderer.setSize(clientWidth, clientHeight, false)
    fitCameraToStage(camera, stage, camera.aspect)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  const handlePointerDown = (event: PointerEvent) => {
    event.preventDefault()
    event.stopPropagation()

    device.updateMatrixWorld(true)
    ipodModel.updateMatrixWorld(true)

    const rect = renderer.domElement.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(modelMeshes, false)
    const action = hits[0] ? resolveClickAction(hits[0], wheelBounds, device) : null

    if (action === 'toggle') callbacks.onToggle()
    if (action === 'prev') callbacks.onPrev()
    if (action === 'next') callbacks.onNext()
  }

  renderer.domElement.addEventListener('pointerdown', handlePointerDown)

  const clock = new THREE.Clock()
  const baseDeviceRotationY = -0.28

  renderer.setAnimationLoop(() => {
    const elapsed = clock.getElapsedTime()

    if (!prefersReducedMotion) {
      stage.position.y = Math.sin(elapsed * 1.05) * 0.045
      device.rotation.y = baseDeviceRotationY + Math.sin(elapsed * 0.7) * 0.08
      device.rotation.x = 0.06 + Math.sin(elapsed * 0.85) * 0.03
    }

    renderer.render(scene, camera)
  })

  const dispose = () => {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
    container.removeChild(renderer.domElement)

    scene.traverse((object: THREE.Object3D) => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material: THREE.Material) => {
        material.dispose()
        Object.values(material).forEach((value: unknown) => {
          if (value instanceof THREE.Texture) value.dispose()
        })
      })
    })

    renderer.dispose()
  }

  return {
    updateScreen: (state) => {
      screenUpdater?.updateScreen(state)
    },
    dispose,
  }
}
