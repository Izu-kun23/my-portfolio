import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export const IPOD_MODEL_URL = '/models/ipod/ipod.glb'
export const IPOD_TARGET_HEIGHT = 2.28

export interface PreparedIpod {
  root: THREE.Group
  bounds: THREE.Box3
}

export async function loadIpodModel(): Promise<PreparedIpod> {
  const { scene: model } = await new GLTFLoader().loadAsync(IPOD_MODEL_URL)
  const root = new THREE.Group()
  root.add(model)

  const preBox = new THREE.Box3().setFromObject(model)
  const preCenter = preBox.getCenter(new THREE.Vector3())
  const preSize = preBox.getSize(new THREE.Vector3())
  const scale = IPOD_TARGET_HEIGHT / preSize.y

  model.scale.setScalar(scale)
  model.position.copy(preCenter).multiplyScalar(-scale)

  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    child.castShadow = true
    child.receiveShadow = true
  })

  root.updateMatrixWorld(true)

  return {
    root,
    bounds: new THREE.Box3().setFromObject(root),
  }
}
