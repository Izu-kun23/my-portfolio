import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

import type { SectionContentRevealController } from '@/composables/useSectionContentReveal'
import { lenis, NAVBAR_OFFSET } from '@/lib/lenis'
import { getViewportSegmentHeight, prefersFreeScrollLayout } from '@/lib/scrollMode'
import {
  clearAllScrollLocks,
  hasScrollLock,
  lockScroll,
  unlockScroll,
} from '@/lib/scrollLock'
import { resetWorkScrollerOnNavigate } from '@/lib/workScroller'
import { registerUnveilScrollTrigger } from '@/lib/unveilScrollState'

export interface UnveilSectionConfig {
  id: string
  panelRef: Ref<HTMLElement | null>
  getReveal?: () => SectionContentRevealController | undefined
}

export interface UseUnveilScrollOptions {
  rootRef: Ref<HTMLElement | null>
  stageRef: Ref<HTMLElement | null>
  sections: UnveilSectionConfig[]
}

const SECTION_IDS = ['hero', 'services', 'work', 'about', 'contact'] as const
const PINNED_PANEL_COUNT = 3
const REVEAL_DELAY_MS = 800
const SEGMENT_COMPLETE_THRESHOLD = 0.98
const SEGMENT_RELEASE_THRESHOLD = 0.92
const SCROLL_CLAMP_TOLERANCE = 2

export interface ScrollToSectionOptions {
  immediate?: boolean
}

let scrollToSectionImpl: ((hashOrId: string, options?: ScrollToSectionOptions) => void) | null =
  null
let rootElement: HTMLElement | null = null
let stageElement: HTMLElement | null = null
let useFreeScrollLayout = false

export const unveilReducedMotion = ref(false)
export const unveilUsesNativeLayout = ref(false)
export const unveilActiveIndex = ref(0)

export function scrollToSection(hashOrId: string, options?: ScrollToSectionOptions) {
  scrollToSectionImpl?.(hashOrId, options)
}

function normalizeSectionId(hashOrId: string): string {
  const id = hashOrId.replace('#', '')
  if (id === 'experience') return 'about'
  return id
}

function getSegmentHeight(): number {
  return getViewportSegmentHeight(stageElement)
}

export function useUnveilScroll({ rootRef, stageRef, sections }: UseUnveilScrollOptions) {
  let ctx: gsap.Context | null = null
  let resizeHandler: (() => void) | null = null
  let scrollClampHandler: (() => void) | null = null
  let freeScrollActiveHandler: (() => void) | null = null
  let postStageScrollHandler: (() => void) | null = null
  let revealSectionObserver: IntersectionObserver | null = null

  const gatedSections = new Set<number>()
  const unlockedSections = new Set<number>()
  const contentRevealed = new Set<number>()
  const revealTimers = new Map<number, ReturnType<typeof setTimeout>>()
  let gatedSectionIndex: number | null = null

  function getSectionBoundary(sectionIndex: number): number {
    if (sectionIndex >= PINNED_PANEL_COUNT) {
      const panel = sections[sectionIndex]?.panelRef.value
      return panel?.offsetTop ?? 0
    }
    return (rootElement?.offsetTop ?? 0) + sectionIndex * getSegmentHeight()
  }

  function clearRevealTimer(index: number) {
    const timer = revealTimers.get(index)
    if (timer) {
      clearTimeout(timer)
      revealTimers.delete(index)
    }
  }

  function clearAllRevealTimers() {
    revealTimers.forEach((timer) => clearTimeout(timer))
    revealTimers.clear()
  }

  function getSectionIndex(id: string): number {
    const normalized = normalizeSectionId(id)
    return sections.findIndex((section) => section.id === normalized)
  }

  function releaseGate(sectionIndex: number) {
    const wasRevealed = contentRevealed.has(sectionIndex)

    clearRevealTimer(sectionIndex)
    gatedSections.delete(sectionIndex)
    unlockedSections.delete(sectionIndex)

    if (gatedSectionIndex === sectionIndex) {
      gatedSectionIndex = null
      unlockScroll('sectionGate')
    }

    if (!wasRevealed) {
      sections[sectionIndex]?.getReveal?.()?.reset()
    }
  }

  function engageGate(sectionIndex: number) {
    if (contentRevealed.has(sectionIndex)) return
    if (gatedSections.has(sectionIndex) || unlockedSections.has(sectionIndex)) return

    const boundary = getSectionBoundary(sectionIndex)
    lenis.scrollTo(boundary, { immediate: true })

    gatedSections.add(sectionIndex)
    gatedSectionIndex = sectionIndex
    lockScroll('sectionGate')

    revealTimers.set(
      sectionIndex,
      setTimeout(() => {
        revealTimers.delete(sectionIndex)
        const incomingReveal = sections[sectionIndex]?.getReveal?.()

        incomingReveal?.reveal(() => {
          unlockedSections.add(sectionIndex)
          contentRevealed.add(sectionIndex)
          gatedSectionIndex = null
          unlockScroll('sectionGate')
        })
      }, REVEAL_DELAY_MS),
    )
  }

  function updateSectionGates(progress: number) {
    const segmentCount = PINNED_PANEL_COUNT - 1
    if (segmentCount <= 0) return

    const segmentProgress = progress * segmentCount

    for (let i = 1; i < PINNED_PANEL_COUNT; i += 1) {
      const localProgress = segmentProgress - (i - 1)

      if (localProgress >= SEGMENT_COMPLETE_THRESHOLD) {
        if (!gatedSections.has(i) && !unlockedSections.has(i) && !revealTimers.has(i)) {
          engageGate(i)
        }
      } else if (localProgress < SEGMENT_RELEASE_THRESHOLD) {
        if (gatedSections.has(i) || unlockedSections.has(i) || revealTimers.has(i)) {
          releaseGate(i)
        }
      }
    }
  }

  function updatePointerEvents(progress: number) {
    const segmentCount = PINNED_PANEL_COUNT - 1
    if (segmentCount <= 0) return

    const segmentProgress = progress * segmentCount

    let activeIndex = 0
    for (let i = 0; i < segmentCount; i += 1) {
      const localProgress = segmentProgress - i
      if (localProgress >= SEGMENT_COMPLETE_THRESHOLD) {
        activeIndex = i + 1
      }
    }

    unveilActiveIndex.value = activeIndex

    sections.forEach((section, index) => {
      const panel = section.panelRef.value
      if (!panel) return

      if (index >= PINNED_PANEL_COUNT) {
        gsap.set(panel, { pointerEvents: 'auto' })
        return
      }

      if (index < activeIndex) {
        gsap.set(panel, { pointerEvents: 'none' })
      } else if (index === activeIndex) {
        gsap.set(panel, { pointerEvents: 'auto' })
      } else {
        gsap.set(panel, { pointerEvents: 'none' })
      }
    })
  }

  function updatePostStageActiveIndex() {
    if (useFreeScrollLayout || !rootElement) return

    const anchor = lenis.scroll + window.innerHeight * 0.35
    let nextIndex = PINNED_PANEL_COUNT - 1

    for (let i = PINNED_PANEL_COUNT; i < sections.length; i += 1) {
      const panel = sections[i]?.panelRef.value
      if (panel && anchor >= panel.offsetTop) {
        nextIndex = i
      }
    }

    unveilActiveIndex.value = nextIndex
  }

  function setupPostStageObservers(startIndex: number) {
    revealSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const index = sections.findIndex((section) => section.panelRef.value === entry.target)
          if (index < startIndex || contentRevealed.has(index)) return

          sections[index]?.getReveal?.()?.reveal()
          contentRevealed.add(index)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    for (let i = startIndex; i < sections.length; i += 1) {
      const panel = sections[i]?.panelRef.value
      if (panel) revealSectionObserver?.observe(panel)
    }
  }

  function clampScrollPosition() {
    if (gatedSectionIndex === null) return
    if (!hasScrollLock('sectionGate')) return
    if (unlockedSections.has(gatedSectionIndex)) return

    const boundary = getSectionBoundary(gatedSectionIndex)
    if (lenis.scroll > boundary + SCROLL_CLAMP_TOLERANCE) {
      lenis.scrollTo(boundary, { immediate: true })
    }
  }

  function revealSectionsUpTo(index: number) {
    for (let i = 1; i <= index; i += 1) {
      if (!contentRevealed.has(i)) {
        sections[i]?.getReveal?.()?.reveal()
        contentRevealed.add(i)
      }
    }
  }

  function setupFreeScrollObservers(panelEls: HTMLElement[]) {
    freeScrollActiveHandler = () => {
      const anchor = lenis.scroll + window.innerHeight * 0.4
      let nextIndex = 0

      panelEls.forEach((panel, index) => {
        if (anchor >= panel.offsetTop) {
          nextIndex = index
        }
      })

      unveilActiveIndex.value = nextIndex
    }

    lenis.on('scroll', freeScrollActiveHandler)
    freeScrollActiveHandler()

    revealSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const index = panelEls.indexOf(entry.target as HTMLElement)
          if (index <= 0 || contentRevealed.has(index)) return

          sections[index]?.getReveal?.()?.reveal()
          contentRevealed.add(index)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    panelEls.forEach((panel, index) => {
      if (index > 0) revealSectionObserver?.observe(panel)
    })
  }

  function scrollToSectionById(hashOrId: string, options: ScrollToSectionOptions = {}) {
    const index = getSectionIndex(hashOrId)
    if (index < 0) return

    clearAllRevealTimers()
    gatedSections.clear()
    unlockedSections.clear()
    gatedSectionIndex = null
    unlockScroll('sectionGate')

    if (useFreeScrollLayout) {
      const panel = sections[index]?.panelRef.value
      if (!panel) return

      revealSectionsUpTo(index)

      if (sections[index]?.id === 'work') {
        resetWorkScrollerOnNavigate()
      }

      unveilActiveIndex.value = index
      lenis.scrollTo(panel, {
        offset: index === 0 ? 0 : -NAVBAR_OFFSET,
        duration: 1,
        immediate: options.immediate,
      })
      return
    }

    if (!rootElement) return

    revealSectionsUpTo(index)

    if (sections[index]?.id === 'work') {
      resetWorkScrollerOnNavigate()
    }

    if (index >= PINNED_PANEL_COUNT) {
      const panel = sections[index]?.panelRef.value
      if (!panel) return

      unveilActiveIndex.value = index
      lenis.scrollTo(panel, {
        offset: -NAVBAR_OFFSET,
        duration: 1.1,
        immediate: options.immediate,
      })
      return
    }

    const targetScroll = getSectionBoundary(index)
    lenis.scrollTo(targetScroll, { duration: 1.1, offset: 0, immediate: options.immediate })
  }

  scrollToSectionImpl = scrollToSectionById

  onMounted(async () => {
    await nextTick()

    const root = rootRef.value
    const stage = stageRef.value
    if (!root || !stage) return

    rootElement = root
    stageElement = stage
    useFreeScrollLayout = prefersFreeScrollLayout()
    unveilReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    unveilUsesNativeLayout.value = useFreeScrollLayout

    const panelEls = sections
      .map((section) => section.panelRef.value)
      .filter((panel): panel is HTMLElement => panel !== null)

    if (panelEls.length !== sections.length) return

    if (useFreeScrollLayout) {
      stage.classList.remove('unveil-stage')
      stage.classList.add('unveil-stage--free')

      const growableSectionIds = new Set(['services', 'work'])

      panelEls.forEach((panel, index) => {
        gsap.set(panel, { clearProps: 'transform' })

        // Home.vue's panel wrapper carries a `min-h-0` utility class for the
        // pinned desktop layout, which — being in Tailwind's utilities layer —
        // always wins over any @layer components height override regardless
        // of selector specificity. Setting it inline is the only thing that
        // reliably beats it, letting an expanded accordion or a longer list
        // grow the panel past one screen instead of being clipped to 0.
        if (growableSectionIds.has(sections[index]?.id ?? '')) {
          panel.style.height = 'auto'
          panel.style.minHeight = '100svh'
        }
      })

      if (unveilReducedMotion.value) {
        sections.forEach((section) => {
          section.getReveal?.()?.reveal()
        })
      } else {
        setupFreeScrollObservers(panelEls)
      }

      resizeHandler = () => {
        freeScrollActiveHandler?.()
        ScrollTrigger.refresh()
        lenis.resize()
      }
      window.addEventListener('resize', resizeHandler)
      window.visualViewport?.addEventListener('resize', resizeHandler)
      return
    }

    const segmentHeight = getSegmentHeight()
    const segmentCount = PINNED_PANEL_COUNT - 1
    const pinnedPanels = panelEls.slice(0, PINNED_PANEL_COUNT)

    scrollClampHandler = clampScrollPosition
    lenis.on('scroll', scrollClampHandler)

    postStageScrollHandler = updatePostStageActiveIndex
    lenis.on('scroll', postStageScrollHandler)

    ctx = gsap.context(() => {
      pinnedPanels.forEach((panel) => {
        gsap.set(panel, { yPercent: 0, force3D: true })
      })

      sections.forEach((section, index) => {
        if (index > 0) {
          section.getReveal?.()?.hide()
        }
      })

      const timeline = gsap.timeline({ defaults: { ease: 'none' } })

      for (let i = 0; i < segmentCount; i += 1) {
        timeline.to(pinnedPanels[i]!, { yPercent: -100, duration: 1 })
      }

      const unveilScrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: `+=${segmentCount * segmentHeight}`,
        pin: stage,
        scrub: true,
        anticipatePin: 1,
        animation: timeline,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateSectionGates(self.progress)
          updatePointerEvents(self.progress)
        },
      })

      registerUnveilScrollTrigger(unveilScrollTrigger)
    }, root)

    setupPostStageObservers(PINNED_PANEL_COUNT)

    resizeHandler = () => {
      ScrollTrigger.refresh()
      lenis.resize()
    }

    window.addEventListener('resize', resizeHandler)
    window.visualViewport?.addEventListener('resize', resizeHandler)
    ScrollTrigger.refresh()
  })

  onUnmounted(() => {
    registerUnveilScrollTrigger(null)
    scrollToSectionImpl = null
    rootElement = null
    stageElement = null
    useFreeScrollLayout = false
    clearAllRevealTimers()
    gatedSections.clear()
    unlockedSections.clear()
    contentRevealed.clear()
    gatedSectionIndex = null
    unlockScroll('sectionGate')
    clearAllScrollLocks()

    if (scrollClampHandler) {
      lenis.off('scroll', scrollClampHandler)
      scrollClampHandler = null
    }

    if (postStageScrollHandler) {
      lenis.off('scroll', postStageScrollHandler)
      postStageScrollHandler = null
    }

    if (freeScrollActiveHandler) {
      lenis.off('scroll', freeScrollActiveHandler)
      freeScrollActiveHandler = null
    }

    revealSectionObserver?.disconnect()
    revealSectionObserver = null

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      window.visualViewport?.removeEventListener('resize', resizeHandler)
    }
    unveilUsesNativeLayout.value = false
    ctx?.revert()
    ctx = null
    unveilActiveIndex.value = 0
  })

  return { scrollToSection: scrollToSectionById }
}

export { SECTION_IDS }
