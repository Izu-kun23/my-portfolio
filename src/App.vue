<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AnimatePresence, motion } from 'motion-v'

import Home from '@/pages/Home.vue'
import WorkCaseStudy from '@/pages/WorkCaseStudy.vue'
import {
  enforceCaseStudyHomeScroll,
  restoreHomeScrollPosition,
} from '@/lib/homeScrollPreserve'

const route = useRoute()
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isCaseStudy = computed(() => route.name === 'work-case-study')

const caseStudyTransition = prefersReducedMotion
  ? { duration: 0 }
  : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.9 }

watch(
  isCaseStudy,
  (open) => {
    if (open) {
      nextTick(() => {
        enforceCaseStudyHomeScroll()
        requestAnimationFrame(() => enforceCaseStudyHomeScroll())
      })
      return
    }

    restoreHomeScrollPosition()
  },
  { flush: 'sync' },
)
</script>

<template>
  <div class="min-h-dvh overflow-x-clip">
    <div
      class="min-h-dvh"
      :class="isCaseStudy ? 'pointer-events-none' : ''"
      :aria-hidden="isCaseStudy ? true : undefined"
      :inert="isCaseStudy ? true : undefined"
    >
      <Home />
    </div>

    <AnimatePresence>
      <motion.div
        v-if="isCaseStudy"
        key="case-study-overlay"
        class="case-study-overlay fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.08)] will-change-transform"
        data-lenis-prevent
        :initial="prefersReducedMotion ? false : { x: '100%' }"
        :animate="{ x: 0 }"
        :exit="{ x: '100%' }"
        :transition="caseStudyTransition"
      >
        <WorkCaseStudy />
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style>
.case-study-overlay {
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}
</style>
