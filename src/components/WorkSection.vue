<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { motion } from 'motion-v'

import MotionScrambleText from '@/components/MotionScrambleText.vue'
import WorkProjectCard from '@/components/WorkProjectCard.vue'
import { useWorkMotionScroll } from '@/composables/useWorkMotionScroll'
import { useWorkSectionReveal } from '@/composables/useWorkSectionReveal'
import { resetWorkScroller, useWorkScrollHandoff } from '@/composables/useWorkScrollHandoff'
import { workProjects, workSectionIntro } from '@/data/work'
import { lenis } from '@/lib/lenis'
import { prefersFreeScrollLayout, prefersTouchInteraction } from '@/lib/scrollMode'
import {
  registerWorkScrollerReset,
  unregisterWorkScrollerReset,
} from '@/lib/workScroller'

const isMobileLayout = prefersTouchInteraction()
const usesInternalScroll = !prefersFreeScrollLayout()
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const scrollerRef = useTemplateRef<HTMLElement>('scrollerRef')
const digitTrackRef = useTemplateRef<HTMLElement>('digitTrackRef')
const projectRefs = useTemplateRef<(HTMLElement | null)[]>('projectRefs')

const sectionReveal = useWorkSectionReveal()
const { playIntro } = sectionReveal

const { activeIndex, digitY, refreshMeasurements, resetToFirst } = useWorkMotionScroll(
  scrollerRef,
  projectRefs,
  digitTrackRef,
  { enabled: usesInternalScroll },
)

useWorkScrollHandoff(scrollerRef, {
  sectionRef,
  enabled: usesInternalScroll,
})

const digitTransition = computed(() =>
  prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.85 },
)

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

onMounted(() => {
  registerWorkScrollerReset(resetWorkScrollerState)
  if (isMobileLayout) {
    requestAnimationFrame(() => lenis.resize())
  }
})

onUnmounted(() => {
  unregisterWorkScrollerReset()
})

defineExpose({ reveal: sectionReveal, resetWorkScroller: resetWorkScrollerState })
</script>

<template>
  <section
    id="work"
    ref="sectionRef"
    class="flex w-full flex-col bg-white px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 md:h-full md:min-h-0 md:overflow-hidden md:px-12 md:pb-0 lg:px-20"
  >
    <div
      class="section-content mx-auto grid w-full max-w-7xl md:h-full md:min-h-0 md:grid-cols-[minmax(6.5rem,9rem)_minmax(0,1fr)] md:gap-x-10 lg:grid-cols-[minmax(7.5rem,10rem)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-16"
    >
      <!-- Project index (desktop) -->
      <aside
        class="work-index-aside sticky top-0 hidden items-center justify-start self-start md:flex md:h-full"
      >
        <div
          class="work-index inline-flex items-center font-sans text-[clamp(4.5rem,9vw,8.5rem)] leading-none font-bold tracking-tight text-gray-900"
          aria-live="polite"
          :aria-label="`Project ${activeIndex} of ${workProjects.length}`"
        >
          <span class="shrink-0">0</span>

          <span class="work-index__window inline-block overflow-hidden align-top">
            <motion.span
              class="work-index__motion block will-change-transform"
              :animate="{ y: digitY }"
              :transition="digitTransition"
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
            </motion.span>
          </span>

          <span class="shrink-0">.</span>
        </div>
      </aside>

      <!-- Title + projects scroll together -->
      <div
        ref="scrollerRef"
        :data-lenis-prevent="usesInternalScroll ? '' : undefined"
        class="work-scroller min-w-0 md:h-full md:min-h-0 md:overflow-y-auto md:pb-16"
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

        <div class="flex flex-col gap-12 md:gap-14 md:pl-8 lg:pl-14 xl:pl-20">
          <div
            v-for="project in workProjects"
            :key="project.id"
            ref="projectRefs"
            class="work-project-panel pb-6 last:pb-10"
          >
            <WorkProjectCard :project="project" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work-scroller {
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.work-scroller::-webkit-scrollbar {
  display: none;
}

.work-project-panel {
  flex-shrink: 0;
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
