import { ScrollTrigger } from '@/lib/gsap'
import { lenis } from '@/lib/lenis'
import {
  pauseUnveilScrollTrigger,
  resumeUnveilScrollTrigger,
  restoreUnveilScrollVisual,
  snapshotUnveilScrollVisual,
} from '@/lib/unveilScrollState'

let preservedScrollY = 0
let isPreserving = false

export function beginCaseStudyNavigation() {
  if (isPreserving) return

  isPreserving = true
  preservedScrollY = lenis.scroll
  snapshotUnveilScrollVisual()
  pauseUnveilScrollTrigger()
  restoreUnveilScrollVisual()
  lenis.stop()
}

export function enforceCaseStudyHomeScroll() {
  if (!isPreserving) return

  lenis.scrollTo(preservedScrollY, { immediate: true })
  restoreUnveilScrollVisual()
}

export function restoreHomeScrollPosition() {
  if (!isPreserving) return

  const scrollY = preservedScrollY
  isPreserving = false

  lenis.start()
  lenis.scrollTo(scrollY, { immediate: true })
  restoreUnveilScrollVisual()
  resumeUnveilScrollTrigger()

  requestAnimationFrame(() => {
    lenis.scrollTo(scrollY, { immediate: true })
    ScrollTrigger.refresh()
  })
}

export function isPreservingHomeScroll() {
  return isPreserving
}
