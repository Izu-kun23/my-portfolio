import type { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ScrollTrigger as ScrollTriggerPlugin } from '@/lib/gsap'

let unveilTrigger: ScrollTrigger | null = null
let savedProgress = 0

export function registerUnveilScrollTrigger(trigger: ScrollTrigger | null) {
  unveilTrigger = trigger
}

export function snapshotUnveilScrollVisual() {
  if (unveilTrigger) {
    savedProgress = unveilTrigger.progress
  }
}

export function pauseUnveilScrollTrigger() {
  if (!unveilTrigger) return
  savedProgress = unveilTrigger.progress
  unveilTrigger.disable(false, true)
}

export function resumeUnveilScrollTrigger() {
  unveilTrigger?.enable(false, true)
}

export function restoreUnveilScrollVisual() {
  if (!unveilTrigger?.animation) return
  unveilTrigger.animation.progress(savedProgress)
  ScrollTriggerPlugin.update()
}
