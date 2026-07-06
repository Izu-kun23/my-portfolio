import Lenis from 'lenis'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersTouchInteraction } from '@/lib/scrollMode'

const NAVBAR_OFFSET = 72
const touchPreferred = prefersTouchInteraction()

export const lenis = new Lenis({
  lerp: touchPreferred ? 0.11 : 0.1,
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: touchPreferred ? 1.05 : 1,
  anchors: {
    offset: 0,
  },
  prevent: (node) => {
    if (!(node instanceof Element)) return false
    return Boolean(
      node.closest('[data-lenis-prevent]') || node.closest('.experience-modal-overlay'),
    )
  },
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

export { NAVBAR_OFFSET }
