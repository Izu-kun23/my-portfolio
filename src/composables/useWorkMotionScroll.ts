import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

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

  function getProjects(): HTMLElement[] {
    return (projectRefs.value ?? []).filter(
      (project): project is HTMLElement => project !== null,
    )
  }

  function updateDigitHeight() {
    const track = digitTrackRef.value
    const firstDigit = track?.children[0] as HTMLElement | undefined
    digitHeight = firstDigit?.getBoundingClientRect().height ?? 0
  }

  function setActiveIndex(index: number) {
    activeIndex.value = index
    digitY.value = -(index - 1) * digitHeight
  }

  function panelTopWithinScroller(project: HTMLElement, scroller: HTMLElement): number {
    return project.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
  }

  function resolveActiveIndex(): number {
    const scroller = scrollerRef.value
    const projects = getProjects()
    if (!scroller || projects.length === 0) return 1

    const firstPanel = projects[0]
    if (
      firstPanel &&
      scroller.scrollTop + scroller.clientHeight * 0.28 < panelTopWithinScroller(firstPanel, scroller)
    ) {
      return 1
    }

    const anchor = scroller.scrollTop + scroller.clientHeight * 0.42
    let bestIndex = 0
    let bestDistance = Number.POSITIVE_INFINITY

    projects.forEach((project, index) => {
      const top = panelTopWithinScroller(project, scroller)
      const bottom = top + project.offsetHeight
      const midpoint = top + project.offsetHeight * 0.5

      if (anchor >= top && anchor <= bottom) {
        bestIndex = index
        bestDistance = 0
        return
      }

      const distance = Math.abs(anchor - midpoint)
      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    })

    return bestIndex + 1
  }

  function updateActiveIndex() {
    const nextIndex = resolveActiveIndex()
    if (nextIndex === activeIndex.value) return
    setActiveIndex(nextIndex)
  }

  function onScroll() {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(updateActiveIndex)
  }

  function refreshMeasurements() {
    updateDigitHeight()
    setActiveIndex(activeIndex.value)
  }

  function resetToFirst() {
    activeIndex.value = 1
    updateDigitHeight()
    digitY.value = 0
  }

  onMounted(async () => {
    if (!enabled) return

    await nextTick()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    const scroller = scrollerRef.value
    const track = digitTrackRef.value
    const projects = getProjects()

    if (!scroller || !track || projects.length === 0) return

    refreshMeasurements()
    setActiveIndex(1)

    scroller.addEventListener('scroll', onScroll, { passive: true })

    resizeObserver = new ResizeObserver(() => {
      refreshMeasurements()
    })

    resizeObserver.observe(scroller)
    resizeObserver.observe(track)

    window.addEventListener('resize', refreshMeasurements)
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    scrollerRef.value?.removeEventListener('scroll', onScroll)
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener('resize', refreshMeasurements)
  })

  return { activeIndex, digitY, refreshMeasurements, resetToFirst }
}
