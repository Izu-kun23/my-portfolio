import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const servicesRevealVariants = {
  section: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.05 },
    },
  },
  headerGroup: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE_OUT },
    },
  },
  watermark: {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.95, ease: EASE_OUT },
    },
  },
  list: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  },
  listItem: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE_OUT },
    },
  },
} as const

export interface MotionSectionRevealController {
  phase: Ref<'hidden' | 'visible'>
  reveal: (onComplete?: () => void) => void
  hide: () => void
  reset: () => void
}

const REVEAL_DURATION_MS = 1500

export function useMotionSectionReveal(): MotionSectionRevealController {
  const phase = ref<'hidden' | 'visible'>('hidden')
  let hasRevealed = false
  let completeTimer: ReturnType<typeof setTimeout> | null = null
  let pendingComplete: (() => void) | undefined
  let prefersReducedMotion = false

  function clearCompleteTimer() {
    if (completeTimer) {
      clearTimeout(completeTimer)
      completeTimer = null
    }
  }

  function reveal(onComplete?: () => void) {
    if (hasRevealed) {
      onComplete?.()
      return
    }

    hasRevealed = true
    phase.value = 'visible'

    if (prefersReducedMotion) {
      onComplete?.()
      return
    }

    clearCompleteTimer()
    pendingComplete = onComplete
    completeTimer = setTimeout(() => {
      completeTimer = null
      pendingComplete?.()
      pendingComplete = undefined
    }, REVEAL_DURATION_MS)
  }

  function hide() {
    clearCompleteTimer()
    pendingComplete = undefined
    phase.value = 'hidden'
  }

  function reset() {
    clearCompleteTimer()
    pendingComplete = undefined
    hasRevealed = false
    hide()
  }

  onMounted(async () => {
    await nextTick()
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      hasRevealed = true
      phase.value = 'visible'
    }
  })

  onUnmounted(() => {
    reset()
  })

  return { phase, reveal, hide, reset }
}
