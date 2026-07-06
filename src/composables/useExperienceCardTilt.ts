import gsap from 'gsap'
import { onMounted, onUnmounted, type Ref } from 'vue'

const MAX_TILT = 10

export function useExperienceCardTilt(
  cardRef: Ref<HTMLElement | null>,
  innerRef: Ref<HTMLElement | null>,
) {
  let rotateX: gsap.QuickToFunc | null = null
  let rotateY: gsap.QuickToFunc | null = null
  let enabled = false

  function onPointerMove(event: PointerEvent) {
    const card = cardRef.value
    const inner = innerRef.value
    if (!card || !inner || !enabled) return

    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    rotateY?.(x * MAX_TILT * 2)
    rotateX?.(-y * MAX_TILT * 2)
  }

  function onPointerLeave() {
    rotateX?.(0)
    rotateY?.(0)
  }

  onMounted(() => {
    const card = cardRef.value
    const inner = innerRef.value
    if (!card || !inner) return

    enabled = window.matchMedia('(pointer: fine)').matches
    if (!enabled) return

    gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d' })
    gsap.set(inner, { transformStyle: 'preserve-3d' })

    rotateX = gsap.quickTo(inner, 'rotateX', { duration: 0.45, ease: 'power2.out' })
    rotateY = gsap.quickTo(inner, 'rotateY', { duration: 0.45, ease: 'power2.out' })

    card.addEventListener('pointermove', onPointerMove)
    card.addEventListener('pointerleave', onPointerLeave)
  })

  onUnmounted(() => {
    const card = cardRef.value
    card?.removeEventListener('pointermove', onPointerMove)
    card?.removeEventListener('pointerleave', onPointerLeave)
    if (card) gsap.set(card, { clearProps: 'transform,transformPerspective,transformStyle' })
    if (innerRef.value) gsap.set(innerRef.value, { clearProps: 'transform,transformStyle' })
  })
}
