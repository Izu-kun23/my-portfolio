import * as THREE from 'three'

export const IPOD_SCREEN_MATERIAL = 'blinn4SG'
export const IPOD_SCREEN_EMISSIVE_MATERIAL = 'blinn2SG'

export interface IpodScreenState {
  artworkUrl: string
}

interface ScreenTarget {
  material: THREE.Material & {
    map?: THREE.Texture | null
    emissiveMap?: THREE.Texture | null
    emissive?: THREE.Color
    emissiveIntensity?: number
    metalness?: number
    roughness?: number
    color?: THREE.Color
  }
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image()
    if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
      image.crossOrigin = 'anonymous'
    }
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = url
  })
}

async function waitForTextureSource(texture: THREE.Texture): Promise<CanvasImageSource | null> {
  const { image } = texture
  if (!image) return null

  if (image instanceof HTMLImageElement) {
    if (image.complete && image.naturalWidth > 0) return image
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Failed to load screen base texture'))
    })
    return image
  }

  if (image instanceof ImageBitmap) return image
  if (image instanceof HTMLCanvasElement) return image
  if (typeof OffscreenCanvas !== 'undefined' && image instanceof OffscreenCanvas) return image

  return null
}

function drawArtworkOnScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseImage: CanvasImageSource | null,
  artwork: CanvasImageSource | null,
) {
  ctx.clearRect(0, 0, width, height)

  if (baseImage) {
    ctx.drawImage(baseImage, 0, 0, width, height)
  } else {
    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, width, height)
  }

  if (!artwork) return

  const artX = width * 0.11
  const artY = height * 0.19
  const artSize = width * 0.78
  const radius = width * 0.035

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(artX, artY, artSize, artSize, radius)
  ctx.clip()
  ctx.drawImage(artwork, artX, artY, artSize, artSize)
  ctx.restore()
}

export function findScreenTargets(model: THREE.Object3D): ScreenTarget[] {
  const materials = new Map<string, ScreenTarget>()

  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    const meshMaterials = Array.isArray(child.material) ? child.material : [child.material]
    meshMaterials.forEach((material) => {
      if (
        material.name !== IPOD_SCREEN_MATERIAL &&
        material.name !== IPOD_SCREEN_EMISSIVE_MATERIAL
      ) {
        return
      }

      materials.set(material.uuid, { material })
    })
  })

  return [...materials.values()]
}

function applyScreenTexture(material: ScreenTarget['material'], texture: THREE.CanvasTexture) {
  texture.flipY = false

  if (material.name === IPOD_SCREEN_EMISSIVE_MATERIAL) {
    material.emissiveMap = texture
    material.map = texture
    material.emissive?.setRGB(1, 1, 1)
    material.emissiveIntensity = 1.14
  } else {
    const standardMaterial = material as THREE.MeshStandardMaterial
    standardMaterial.map = texture
    standardMaterial.metalnessMap = null
    standardMaterial.roughnessMap = null
    standardMaterial.normalMap = null
    standardMaterial.color.setRGB(1, 1, 1)
    standardMaterial.metalness = 0
    standardMaterial.roughness = 0.85
    if ('specularIntensity' in standardMaterial) {
      ;(standardMaterial as THREE.MeshPhysicalMaterial).specularIntensity = 0
    }
  }

  material.needsUpdate = true
}

export async function createIpodScreenUpdater(targets: ScreenTarget[]) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Unable to create iPod screen canvas')

  let baseImage: CanvasImageSource | null = null

  for (const { material } of targets) {
    const baseTexture = material.map
    if (!baseTexture) continue

    try {
      baseImage = await waitForTextureSource(baseTexture)
      if (baseImage instanceof HTMLImageElement) {
        canvas.width = baseImage.naturalWidth || 1024
        canvas.height = baseImage.naturalHeight || 1024
      } else if (baseImage instanceof ImageBitmap) {
        canvas.width = baseImage.width || 1024
        canvas.height = baseImage.height || 1024
      }
      break
    } catch {
      continue
    }
  }

  if (!canvas.width) {
    canvas.width = 1024
    canvas.height = 1024
  }

  const screenTexture = new THREE.CanvasTexture(canvas)
  screenTexture.colorSpace = THREE.SRGBColorSpace
  screenTexture.flipY = false

  let currentArtwork: HTMLImageElement | null = null
  let pendingArtworkUrl = ''

  const refresh = () => {
    drawArtworkOnScreen(ctx, canvas.width, canvas.height, baseImage, currentArtwork)
    screenTexture.needsUpdate = true
  }

  for (const { material } of targets) {
    applyScreenTexture(material, screenTexture)
  }

  refresh()

  const updateScreen = (state: IpodScreenState) => {
    if (!state.artworkUrl) {
      currentArtwork = null
      refresh()
      return
    }

    if (state.artworkUrl === pendingArtworkUrl && currentArtwork) return

    pendingArtworkUrl = state.artworkUrl
    void loadImage(state.artworkUrl).then((image) => {
      if (pendingArtworkUrl !== state.artworkUrl) return
      currentArtwork = image
      refresh()
    })
  }

  return { updateScreen }
}
