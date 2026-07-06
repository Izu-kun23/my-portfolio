import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

import { lenis } from '@/lib/lenis'
import { prefersFreeScrollLayout } from '@/lib/scrollMode'

const SCROLL_EDGE_TOLERANCE = 2

export interface UseSectionScrollHandoffOptions {
  /** Wheel anywhere inside this element scrolls the inner scroller first. */
  sectionRef?: Ref<HTMLElement | null>
  /** When scroll-snap offsets the resting top (work projects). */
  getRestingTopOffset?: (scroller: HTMLElement) => number
  /** When set, page scroll only advances downward once this returns true. */
  canForwardDown?: (scroller: HTMLElement) => boolean
  /** Called when wheel input is handed off to the page scroller. */
  onPageScroll?: () => void
  /** Disable on mobile / free-scroll layouts. Defaults to pinned desktop only. */
  enabled?: boolean
}

function isAtTop(scroller: HTMLElement, restingTop = 0): boolean {
  return scroller.scrollTop <= restingTop + SCROLL_EDGE_TOLERANCE
}

function isAtBottom(scroller: HTMLElement): boolean {
  return scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - SCROLL_EDGE_TOLERANCE
}

function canScrollInternally(scroller: HTMLElement): boolean {
  return scroller.scrollHeight > scroller.clientHeight + SCROLL_EDGE_TOLERANCE
}

function getOffsetTopWithinScroller(element: HTMLElement, scroller: HTMLElement): number {
  return element.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
}

function scrollScroller(scroller: HTMLElement, deltaY: number) {
  scroller.scrollTop += deltaY
}

function tryInternalScroll(
  scroller: HTMLElement,
  event: WheelEvent,
  getRestingTopOffset?: (scroller: HTMLElement) => number,
  canForwardDown?: (scroller: HTMLElement) => boolean,
): boolean {
  if (!canScrollInternally(scroller)) return false

  const restingTop = getRestingTopOffset?.(scroller) ?? 0
  const scrollingUp = event.deltaY < 0
  const scrollingDown = event.deltaY > 0
  const atTop = isAtTop(scroller, restingTop)
  const atBottom = isAtBottom(scroller)

  if (scrollingUp && !atTop) {
    event.preventDefault()
    event.stopPropagation()
    scrollScroller(scroller, event.deltaY)
    return true
  }

  if (scrollingDown) {
    const canExitDown = canForwardDown?.(scroller) ?? atBottom

    if (!canExitDown) {
      // Already at the physical bottom but a custom exit check failed — forward
      // instead of swallowing wheel events (which feels "stuck").
      if (atBottom) return false

      event.preventDefault()
      event.stopPropagation()
      scrollScroller(scroller, event.deltaY)
      return true
    }
  }

  return false
}

/**
 * Lets a section's scrollable region finish scrolling before wheel input
 * advances the page — listens on the whole section, not just the scroller.
 */
export function useSectionScrollHandoff(
  scrollerRef: Ref<HTMLElement | null>,
  options: UseSectionScrollHandoffOptions = {},
) {
  const {
    sectionRef,
    getRestingTopOffset,
    canForwardDown,
    onPageScroll,
    enabled = !prefersFreeScrollLayout(),
  } = options

  let wheelTarget: HTMLElement | null = null

  function forwardToLenis(event: WheelEvent) {
    event.preventDefault()
    event.stopPropagation()
    onPageScroll?.()
    lenis.scrollTo(lenis.targetScroll + event.deltaY, {
      programmatic: false,
      lerp: lenis.options.lerp,
      duration: lenis.options.duration,
      easing: lenis.options.easing,
    })
  }

  function onWheel(event: WheelEvent) {
    const scroller = scrollerRef.value
    if (!scroller) return

    // Prefer the section's own scroller whenever it still has room to move,
    // even during pin-panel transitions — otherwise wheel input skips straight
    // to the page and feels like content snaps back to the start.
    if (tryInternalScroll(scroller, event, getRestingTopOffset, canForwardDown)) {
      return
    }

    forwardToLenis(event)
  }

  onMounted(async () => {
    if (!enabled) return

    await nextTick()

    wheelTarget = sectionRef?.value ?? scrollerRef.value
    wheelTarget?.addEventListener('wheel', onWheel, { passive: false, capture: true })
  })

  onUnmounted(() => {
    wheelTarget?.removeEventListener('wheel', onWheel, { capture: true })
    wheelTarget = null
  })
}

export function resetSectionScroller(scrollerRef: Ref<HTMLElement | null>) {
  const scroller = scrollerRef.value
  if (!scroller) return
  scroller.scrollTo({ top: 0, behavior: 'instant' })
}

/** Title scrolls with content — page handoff only at scroller scrollTop 0. */
export function getWorkRestingTopOffset(_scroller: HTMLElement): number {
  return 0
}

/** True once the last work project has been fully scrolled through. */
export function isWorkScrollExhausted(scroller: HTMLElement): boolean {
  if (isAtBottom(scroller)) return true

  const panels = Array.from(scroller.querySelectorAll('.work-project-panel')).filter(
    (panel): panel is HTMLElement => panel instanceof HTMLElement,
  )

  if (panels.length === 0) return true

  const lastPanel = panels[panels.length - 1]!
  const lastPanelTop = getOffsetTopWithinScroller(lastPanel, scroller)
  const lastPanelBottom = lastPanelTop + lastPanel.offsetHeight
  const viewportBottom = scroller.scrollTop + scroller.clientHeight

  const reachedLastPanel = scroller.scrollTop >= lastPanelTop - SCROLL_EDGE_TOLERANCE
  const seenAllOfLastPanel = viewportBottom >= lastPanelBottom - SCROLL_EDGE_TOLERANCE

  return reachedLastPanel && seenAllOfLastPanel
}
