import gsap from 'gsap'

const MID_TRANSITION_THRESHOLD = 0.3

/**
 * True while the nearest `.unveil-panel` ancestor is mid-slide (pin-scroll
 * segment transition). The threshold sits above 0 to absorb sub-pixel scrub
 * rounding noise on rapid direction reversals, which otherwise reads as
 * "still transitioning" and steals wheel input from the panel's own scroller.
 */
export function isPanelMidTransition(node: Element): boolean {
  const panel = node.closest<HTMLElement>('.unveil-panel')
  if (!panel) return false
  return Math.abs(Number(gsap.getProperty(panel, 'yPercent'))) > MID_TRANSITION_THRESHOLD
}
