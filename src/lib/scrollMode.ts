/** Free stacked scroll — touch devices and reduced-motion accessibility. */
export function prefersFreeScrollLayout(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  return window.matchMedia('(pointer: coarse)').matches
}

/** @deprecated Use prefersFreeScrollLayout */
export function prefersNativeScrollLayout(): boolean {
  return prefersFreeScrollLayout()
}

/** Touch-first phones/tablets — used for Lenis tuning. */
export function prefersTouchInteraction(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

export function getViewportSegmentHeight(stage?: HTMLElement | null): number {
  return stage?.clientHeight ?? window.visualViewport?.height ?? window.innerHeight
}
