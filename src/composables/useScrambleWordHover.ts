import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

import { runScrambleTextAnimation } from '@/composables/useScrambleTextReveal'

export interface ScrambleWordTarget {
  element: Ref<HTMLElement | null>
  text: string
}

export function useScrambleWordHover(
  words: ScrambleWordTarget[],
  options: { holdDuration?: number; revealDuration?: number; flickerInterval?: number } = {},
) {
  const {
    holdDuration = 0.06,
    revealDuration = 0.72,
    flickerInterval = 0.06,
  } = options

  const cleanups = new Map<HTMLElement, () => void>()
  const listeners = new Map<HTMLElement, () => void>()

  onMounted(async () => {
    await nextTick()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    words.forEach(({ element, text }) => {
      const el = element.value
      if (!el) return

      const onEnter = () => {
        cleanups.get(el)?.()

        const stop = runScrambleTextAnimation(el, text, {
          holdDuration,
          revealDuration,
          flickerInterval,
        })

        cleanups.set(el, stop)
      }

      el.addEventListener('mouseenter', onEnter)
      listeners.set(el, onEnter)
    })
  })

  onUnmounted(() => {
    cleanups.forEach((stop) => stop())
    cleanups.clear()

    listeners.forEach((onEnter, el) => {
      el.removeEventListener('mouseenter', onEnter)
    })
    listeners.clear()
  })
}
