import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

import type { SectionContentRevealController } from '@/composables/useSectionContentReveal'
import { lenis, NAVBAR_OFFSET } from '@/lib/lenis'
import { prefersFreeScrollLayout } from '@/lib/scrollMode'
import { clearAllScrollLocks, unlockScroll } from '@/lib/scrollLock'
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

const SECTION_IDS = ['hero', 'story', 'about', 'work', 'services', 'contact'] as const
/** Only the hero panel is pinned / stacked. Everything after scrolls normally. */
const PINNED_PANEL_COUNT = 1

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

export function useUnveilScroll({ rootRef, stageRef, sections }: UseUnveilScrollOptions) {
  let ctx: gsap.Context | null = null
  let resizeHandler: (() => void) | null = null
  let resizeFrame = 0
  let viewportWidth = 0
  let freeScrollActiveHandler: (() => void) | null = null
  let postStageScrollHandler: (() => void) | null = null
  let revealSectionObserver: IntersectionObserver | null = null

  const contentRevealed = new Set<number>()

  function getSectionIndex(id: string): number {
    const normalized = normalizeSectionId(id)
    return sections.findIndex((section) => section.id === normalized)
  }

  function revealSection(index: number) {
    if (index <= 0 || contentRevealed.has(index)) return
    sections[index]?.getReveal?.()?.reveal()
    contentRevealed.add(index)
  }

  function revealSectionsUpTo(index: number) {
    for (let i = 1; i <= index; i += 1) {
      revealSection(i)
    }
  }

  function updatePostStageActiveIndex() {
    if (useFreeScrollLayout || !rootElement) return

    const anchor = lenis.scroll + window.innerHeight * 0.35
    let nextIndex = 0

    for (let i = PINNED_PANEL_COUNT; i < sections.length; i += 1) {
      const panel = sections[i]?.panelRef.value
      if (panel && anchor >= panel.offsetTop) {
        nextIndex = i
      }
    }

    unveilActiveIndex.value = nextIndex
  }

  function setupRevealObservers(startIndex: number) {
    revealSectionObserver?.disconnect()
    revealSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const index = sections.findIndex((section) => section.panelRef.value === entry.target)
          if (index < startIndex) return
          revealSection(index)
        })
      },
      // Fire as soon as the section enters the viewport.
      { threshold: 0.05, rootMargin: '0px 0px -4% 0px' },
    )

    for (let i = startIndex; i < sections.length; i += 1) {
      const panel = sections[i]?.panelRef.value
      if (panel) revealSectionObserver?.observe(panel)
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
    setupRevealObservers(1)
  }

  function scrollToSectionById(hashOrId: string, options: ScrollToSectionOptions = {}) {
    const index = getSectionIndex(hashOrId)
    if (index < 0) return

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

    // Hero
    unveilActiveIndex.value = 0
    lenis.scrollTo(rootElement.offsetTop, {
      duration: 1.1,
      offset: 0,
      immediate: options.immediate,
    })
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
    viewportWidth = window.innerWidth
    unveilReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    unveilUsesNativeLayout.value = useFreeScrollLayout

    const panelEls = sections
      .map((section) => section.panelRef.value)
      .filter((panel): panel is HTMLElement => panel !== null)

    if (panelEls.length !== sections.length) return

    if (useFreeScrollLayout) {
      stage.classList.remove('unveil-stage')
      stage.classList.add('unveil-stage--free')

      panelEls.forEach((panel, index) => {
        gsap.set(panel, { clearProps: 'transform' })

        if (sections[index]?.id === 'services' || sections[index]?.id === 'work') {
          panel.style.height = 'auto'
          panel.style.minHeight = '100svh'
        }
      })

      if (unveilReducedMotion.value) {
        sections.forEach((_, index) => {
          if (index > 0) revealSection(index)
        })
      } else {
        setupFreeScrollObservers(panelEls)
      }

      resizeHandler = () => {
        const nextWidth = window.innerWidth

        // Mobile browser chrome expands while scrolling upward and emits a
        // burst of height-only resize events. Refreshing ScrollTrigger and
        // Lenis for each event forces layout during the gesture and causes
        // visible scroll stutter. Only a width change affects this layout.
        if (Math.abs(nextWidth - viewportWidth) < 2) return
        viewportWidth = nextWidth

        cancelAnimationFrame(resizeFrame)
        resizeFrame = requestAnimationFrame(() => {
          freeScrollActiveHandler?.()
          ScrollTrigger.refresh()
          lenis.resize()
        })
      }
      window.addEventListener('resize', resizeHandler)
      return
    }

    const heroPanel = panelEls[0]
    const servicesPanel = panelEls[1]

    if (!heroPanel || !servicesPanel) return

    postStageScrollHandler = updatePostStageActiveIndex
    lenis.on('scroll', postStageScrollHandler)

    ctx = gsap.context(() => {
      gsap.set(heroPanel, { clearProps: 'transform' })

      // Hide non-hero content until each section is entered.
      sections.forEach((section, index) => {
        if (index > 0) {
          section.getReveal?.()?.hide()
        }
      })

      // Pin hero in place with no spacer; the next section scrolls over it
      // (cover stack) so there is no empty white gap between sections.
      const unveilScrollTrigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        endTrigger: servicesPanel,
        end: 'top top',
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress < 1) {
            unveilActiveIndex.value = 0
          } else {
            updatePostStageActiveIndex()
          }
        },
        onLeave: () => {
          updatePostStageActiveIndex()
        },
        onEnterBack: () => {
          unveilActiveIndex.value = 0
        },
      })

      registerUnveilScrollTrigger(unveilScrollTrigger)
    }, root)

    setupRevealObservers(PINNED_PANEL_COUNT)

    resizeHandler = () => {
      ScrollTrigger.refresh()
      lenis.resize()
    }

    window.addEventListener('resize', resizeHandler)
    window.visualViewport?.addEventListener('resize', resizeHandler)
    ScrollTrigger.refresh()
    updatePostStageActiveIndex()
  })

  onUnmounted(() => {
    registerUnveilScrollTrigger(null)
    scrollToSectionImpl = null
    rootElement = null
    stageElement = null
    useFreeScrollLayout = false
    contentRevealed.clear()
    unlockScroll('sectionGate')
    clearAllScrollLocks()

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
    cancelAnimationFrame(resizeFrame)
    unveilUsesNativeLayout.value = false
    ctx?.revert()
    ctx = null
    unveilActiveIndex.value = 0
  })

  return { scrollToSection: scrollToSectionById }
}

export { SECTION_IDS }
