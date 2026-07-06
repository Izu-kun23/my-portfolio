import { onUnmounted, ref, type Ref } from 'vue'

export interface WorkSectionRevealController {
  playIntro: Ref<boolean>
  reveal: (onComplete?: () => void) => void
  hide: () => void
  reset: () => void
}

const INTRO_DURATION_MS = 1200

/** Work stays visible like a normal section; reveal only triggers the title scramble. */
export function useWorkSectionReveal(): WorkSectionRevealController {
  const playIntro = ref(false)
  let hasRevealed = false
  let completeTimer: ReturnType<typeof setTimeout> | null = null

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
    playIntro.value = true

    clearCompleteTimer()
    completeTimer = setTimeout(() => {
      completeTimer = null
      onComplete?.()
    }, INTRO_DURATION_MS)
  }

  function hide() {
    // Keep content visible — work should read like a normal scrollable section.
  }

  function reset() {
    clearCompleteTimer()
    hasRevealed = false
  }

  onUnmounted(() => {
    reset()
  })

  return { playIntro, reveal, hide, reset }
}
