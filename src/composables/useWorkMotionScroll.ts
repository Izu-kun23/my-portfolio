import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

import { lenis } from '@/lib/lenis'

interface UseWorkMotionScrollOptions {
  enabled?: boolean
}

export function useWorkMotionScroll(
  scrollerRef: Ref<HTMLElement | null>,
  projectRefs: Ref<(HTMLElement | null)[] | null>,
  digitTrackRef: Ref<HTMLElement | null>,
  options: UseWorkMotionScrollOptions = {},
) {
  const { enabled = true } = options

  const activeIndex = ref(1)
  const digitY = ref(0)

  let rafId = 0
  let resizeObserver: ResizeObserver | null = null
  let digitHeight = 0
  let unbindLenis: (() => void) | null = null

  function getProjects(): HTMLElement[] {
    const raw = projectRefs.value
    if (!raw) return []
    // useTemplateRef + v-for can be a single node briefly; normalize to an array.
    const list = Array.isArray(raw) ? raw : [raw]
    return list.filter((project): project is HTMLElement => project instanceof HTMLElement)
  }

  function updateDigitHeight() {
    const track = digitTrackRef.value
    const firstDigit = track?.children[0] as HTMLElement | undefined
    if (!firstDigit) return
    // Prefer layout height (stable) over getBoundingClientRect during transforms.
    const next = firstDigit.offsetHeight || firstDigit.getBoundingClientRect().height
    if (next > 0) digitHeight = next
  }

  function setActiveIndex(index: number) {
    updateDigitHeight()
    activeIndex.value = index
    digitY.value = digitHeight > 0 ? -(index - 1) * digitHeight : 0
  }

  /**
   * Index = last project whose top has crossed ~55% of the viewport.
   * Higher threshold = advances earlier while scrolling down.
   */
  function resolveActiveIndex(): number {
    const projects = getProjects()
    if (projects.length === 0) return 1

    const threshold = window.innerHeight * 0.55
    let active = 0

    for (let i = 0; i < projects.length; i += 1) {
      if (projects[i]!.getBoundingClientRect().top <= threshold) {
        active = i
      }
    }

    return active + 1
  }

  function updateActiveIndex() {
    const nextIndex = resolveActiveIndex()
    if (nextIndex === activeIndex.value && digitHeight > 0) return
    setActiveIndex(nextIndex)
  }

  function onScroll() {
    // Update on the same frame as Lenis — no extra rAF deferral.
    updateActiveIndex()
  }

  function refreshMeasurements() {
    updateDigitHeight()
    updateActiveIndex()
  }

  function resetToFirst() {
    updateDigitHeight()
    activeIndex.value = 1
    digitY.value = 0
  }

  onMounted(async () => {
    if (!enabled) return

    await nextTick()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    const track = digitTrackRef.value
    if (!track || getProjects().length === 0) return

    refreshMeasurements()

    lenis.on('scroll', onScroll)
    unbindLenis = () => lenis.off('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })

    resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(refreshMeasurements)
    })

    const scroller = scrollerRef.value
    if (scroller) resizeObserver.observe(scroller)
    resizeObserver.observe(track)
    getProjects().forEach((project) => resizeObserver?.observe(project))

    window.addEventListener('resize', refreshMeasurements)
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    unbindLenis?.()
    unbindLenis = null
    window.removeEventListener('scroll', onScroll)
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener('resize', refreshMeasurements)
  })

  return { activeIndex, digitY, refreshMeasurements, resetToFirst }
}
