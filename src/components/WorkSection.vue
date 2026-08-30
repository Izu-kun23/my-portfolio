<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

import MotionScrambleText from '@/components/MotionScrambleText.vue'
import WorkProjectCard from '@/components/WorkProjectCard.vue'
import ScrollStack from '@/components/scroll-stack/ScrollStack.vue'
import ScrollStackItem from '@/components/scroll-stack/ScrollStackItem.vue'
import { useWorkMotionScroll } from '@/composables/useWorkMotionScroll'
import { useWorkSectionReveal } from '@/composables/useWorkSectionReveal'
import { resetWorkScroller, useWorkScrollHandoff } from '@/composables/useWorkScrollHandoff'
import { workProjects, workSectionIntro } from '@/data/work'
import { gsap } from '@/lib/gsap'
import { lenis } from '@/lib/lenis'
import { prefersTouchInteraction } from '@/lib/scrollMode'
import {
  registerWorkScrollerReset,
  unregisterWorkScrollerReset,
} from '@/lib/workScroller'

const isMobileLayout = prefersTouchInteraction()
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const scrollerRef = useTemplateRef<HTMLElement>('scrollerRef')
const digitTrackRef = useTemplateRef<HTMLElement>('digitTrackRef')
const digitMotionRef = useTemplateRef<HTMLElement>('digitMotionRef')
const projectRefs = useTemplateRef<(HTMLElement | null)[]>('projectRefs')

const sectionReveal = useWorkSectionReveal()
const { playIntro } = sectionReveal

const { activeIndex, digitY, refreshMeasurements, resetToFirst } = useWorkMotionScroll(
  scrollerRef,
  projectRefs,
  digitTrackRef,
  { enabled: true },
)

useWorkScrollHandoff(scrollerRef, {
  sectionRef,
  enabled: false,
})

function resetWorkScrollerState() {
  resetWorkScroller(scrollerRef)
  resetToFirst()
}

const originalReveal = sectionReveal.reveal
sectionReveal.reveal = (onComplete?: () => void) => {
  originalReveal(() => {
    requestAnimationFrame(() => {
      refreshMeasurements()
      if (isMobileLayout) lenis.resize()
      onComplete?.()
    })
  })
}

// Scroll-reveal reel for the digit beside "0"
watch(digitY, (y) => {
  const el = digitMotionRef.value
  if (!el) return

  gsap.killTweensOf(el)

  if (prefersReducedMotion) {
    gsap.set(el, { y })
    return
  }

  gsap.to(el, {
    y,
    duration: 0.45,
    ease: 'power3.out',
    overwrite: true,
  })
})

onMounted(() => {
  registerWorkScrollerReset(resetWorkScrollerState)
  if (digitMotionRef.value) {
    gsap.set(digitMotionRef.value, { y: digitY.value })
  }
  if (isMobileLayout) {
    requestAnimationFrame(() => lenis.resize())
  }
})

onUnmounted(() => {
  if (digitMotionRef.value) gsap.killTweensOf(digitMotionRef.value)
  unregisterWorkScrollerReset()
})

defineExpose({ reveal: sectionReveal, resetWorkScroller: resetWorkScrollerState })
</script>

<template>
  <section
    id="work"
    ref="sectionRef"
    class="flex w-full flex-col bg-white px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 md:min-h-[100svh] md:px-12 md:pb-10 lg:px-20"
  >
    <div
      class="section-content mx-auto grid w-full max-w-7xl md:grid-cols-[minmax(6.5rem,9rem)_minmax(0,1fr)] md:gap-x-10 lg:grid-cols-[minmax(7.5rem,10rem)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-16"
    >
      <!-- Project index (desktop) -->
      <aside
        class="work-index-aside sticky top-[calc(4rem+env(safe-area-inset-top))] hidden items-center justify-start self-start md:flex md:h-[min(70vh,32rem)]"
      >
        <div
          class="work-index inline-flex items-center font-sans text-[clamp(4.5rem,9vw,8.5rem)] leading-none font-bold tracking-tight text-gray-900"
          aria-live="polite"
          :aria-label="`Project ${activeIndex} of ${workProjects.length}`"
        >
          <span class="shrink-0">0</span>

          <span class="work-index__window inline-block overflow-hidden align-top">
            <span
              ref="digitMotionRef"
              class="work-index__motion block will-change-transform"
            >
              <span ref="digitTrackRef" class="work-index__track block">
                <span
                  v-for="projectIndex in workProjects.length"
                  :key="projectIndex"
                  class="work-index__digit block text-center"
                >
                  {{ projectIndex }}
                </span>
              </span>
            </span>
          </span>

          <span class="shrink-0">.</span>
        </div>
      </aside>

      <!-- Title + projects scroll together -->
      <div
        ref="scrollerRef"
        class="work-scroller min-w-0"
      >
        <header
          class="work-section-header pt-[calc(2.75rem+env(safe-area-inset-top))] pb-8 text-left md:pt-20 md:pb-10"
        >
          <h2
            class="m-0 text-[clamp(2rem,5.5vw,2.75rem)] leading-[1.05] font-bold tracking-tight text-gray-900 uppercase"
          >
            <MotionScrambleText
              :text="workSectionIntro.title"
              :play="playIntro"
            />
          </h2>

          <p class="section-subtext section-subtext--light">
            {{ workSectionIntro.subtext }}
          </p>
        </header>

        <ScrollStack class="md:pl-8 lg:pl-14 xl:pl-20">
          <ScrollStackItem
            v-for="project in workProjects"
            :key="project.id"
            item-class="work-project-panel"
          >
            <div ref="projectRefs">
              <WorkProjectCard :project="project" />
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work-scroller {
  -webkit-overflow-scrolling: touch;
}

.work-index__window {
  height: 1em;
  min-width: 0.72em;
}

.work-index__track {
  display: flex;
  flex-direction: column;
}

.work-index__digit {
  height: 1em;
  line-height: 1;
}

@media (pointer: fine) {
  .work-index__motion {
    will-change: transform;
  }
}
</style>
