import gsap from 'gsap'
import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

import { runScrambleTextAnimation } from '@/composables/useScrambleTextReveal'

export interface SectionContentRevealOptions {
  contentRef: Ref<HTMLElement | null>
  scrambleRef?: Ref<HTMLElement | null>
  scrambleText?: string
  itemRefs?: Ref<(HTMLElement | null)[] | null>
}

export interface SectionContentRevealController {
  reveal: (onComplete?: () => void) => void
  hide: () => void
  reset: () => void
}

export function useSectionContentReveal(
  options: SectionContentRevealOptions,
): SectionContentRevealController {
  let revealed = false
  let stopScramble: (() => void) | null = null
  let prefersReducedMotion = false

  function hide() {
    const contentEl = options.contentRef.value
    if (!contentEl) return

    const itemEls = (options.itemRefs?.value ?? []).filter(
      (item): item is HTMLElement => item !== null,
    )

    gsap.killTweensOf([contentEl, ...itemEls])
    gsap.set(contentEl, { autoAlpha: 0 })

    if (itemEls.length > 0) {
      gsap.set(itemEls, { autoAlpha: 0 })
    }
  }

  function reveal(onComplete?: () => void) {
    if (revealed) {
      onComplete?.()
      return
    }

    const contentEl = options.contentRef.value
    if (!contentEl) {
      onComplete?.()
      return
    }

    revealed = true

    if (prefersReducedMotion) {
      const scrambleEl = options.scrambleRef?.value
      if (scrambleEl && options.scrambleText) {
        scrambleEl.textContent = options.scrambleText
      }
      gsap.set(contentEl, { autoAlpha: 1 })
      const itemEls = (options.itemRefs?.value ?? []).filter(
        (item): item is HTMLElement => item !== null,
      )
      if (itemEls.length > 0) gsap.set(itemEls, { autoAlpha: 1 })
      onComplete?.()
      return
    }

    const itemEls = (options.itemRefs?.value ?? []).filter(
      (item): item is HTMLElement => item !== null,
    )
    const scrambleEl = options.scrambleRef?.value
    const scrambleText = options.scrambleText

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete,
    })

    timeline.to(contentEl, {
      autoAlpha: 1,
      duration: 0.75,
      onStart: () => {
        if (scrambleEl && scrambleText) {
          stopScramble?.()
          stopScramble = runScrambleTextAnimation(scrambleEl, scrambleText, {
            holdDuration: 0.35,
            revealDuration: 1.1,
          })
        }
      },
    })

    if (itemEls.length > 0) {
      gsap.set(itemEls, { autoAlpha: 0 })
      timeline.to(
        itemEls,
        {
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
        },
        scrambleEl ? '-=0.35' : 0,
      )
    }
  }

  function reset() {
    stopScramble?.()
    stopScramble = null
    revealed = false
    hide()
  }

  onMounted(async () => {
    await nextTick()
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      reveal()
      return
    }

    hide()
  })

  onUnmounted(() => {
    reset()
  })

  return { reveal, hide, reset }
}
