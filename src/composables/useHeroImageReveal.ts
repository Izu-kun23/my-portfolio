import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'

import { prefersTouchInteraction } from '@/lib/scrollMode'

interface PointerState {
  x: number
  y: number
  active: boolean
}

function applyAlphaMaskStyles(reveal: HTMLElement, maskUrl: string) {
  reveal.style.maskImage = `url(${maskUrl})`
  reveal.style.maskSize = '100% 100%'
  reveal.style.maskRepeat = 'no-repeat'
  reveal.style.maskMode = 'alpha'
  reveal.style.webkitMaskImage = reveal.style.maskImage
  reveal.style.webkitMaskSize = reveal.style.maskSize
  reveal.style.webkitMaskRepeat = reveal.style.maskRepeat
}

export function useHeroImageReveal(
  containerRef: Ref<HTMLElement | null>,
  revealRef: Ref<HTMLElement | null>,
) {
  let removeListeners: (() => void) | null = null
  let resizeObserver: ResizeObserver | null = null
  let ticker: (() => void) | null = null

  onMounted(async () => {
    await nextTick()

    const container = containerRef.value
    const reveal = revealRef.value
    if (!container || !reveal) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || prefersTouchInteraction()) {
      gsap.set(reveal, { autoAlpha: 0 })
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let brushSize = 120
    let maskUrl = ''

    const pointer: PointerState = { x: 0, y: 0, active: false }

    const applyMask = () => {
      const nextUrl = canvas.toDataURL('image/png')
      if (nextUrl === maskUrl) return
      maskUrl = nextUrl
      applyAlphaMaskStyles(reveal, maskUrl)
    }

    const clearMask = () => {
      ctx.clearRect(0, 0, width, height)
    }

    const drawWisp = (x: number, y: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize)
      gradient.addColorStop(0, 'rgba(255,255,255,0.92)')
      gradient.addColorStop(0.25, 'rgba(255,255,255,0.55)')
      gradient.addColorStop(0.55, 'rgba(255,255,255,0.18)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, brushSize, 0, Math.PI * 2)
      ctx.fill()
    }

    const fadeTrail = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = pointer.active ? 'rgba(0,0,0,0.028)' : 'rgba(0,0,0,0.045)'
      ctx.fillRect(0, 0, width, height)

      if (pointer.active) {
        drawWisp(pointer.x, pointer.y)
      }

      applyMask()
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      brushSize = Math.min(width, height) * 0.16

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      clearMask()
      maskUrl = ''
      applyMask()
    }

    const xTo = gsap.quickTo(pointer, 'x', { duration: 0.42, ease: 'power3.out' })
    const yTo = gsap.quickTo(pointer, 'y', { duration: 0.42, ease: 'power3.out' })

    const setPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      xTo(clientX - rect.left)
      yTo(clientY - rect.top)
    }

    const onPointerEnter = (event: PointerEvent) => {
      pointer.active = true
      setPointer(event.clientX, event.clientY)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.active = true
      setPointer(event.clientX, event.clientY)
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    gsap.set(reveal, { opacity: 1 })

    ticker = fadeTrail
    gsap.ticker.add(fadeTrail)

    container.addEventListener('pointerenter', onPointerEnter)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)

    removeListeners = () => {
      container.removeEventListener('pointerenter', onPointerEnter)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      if (ticker) gsap.ticker.remove(ticker)
      resizeObserver?.disconnect()
    }
  })

  onUnmounted(() => {
    removeListeners?.()
  })
}
