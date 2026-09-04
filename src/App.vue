<script setup lang="ts">
import { computed, nextTick, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AnimatePresence, motion } from 'motion-v'

import Home from '@/pages/Home.vue'
import CollaborationModal from '@/components/CollaborationModal.vue'
import CvDownloadPrompt from '@/components/CvDownloadPrompt.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import WorkCaseStudy from '@/pages/WorkCaseStudy.vue'
import {
  enforceCaseStudyHomeScroll,
  restoreHomeScrollPosition,
} from '@/lib/homeScrollPreserve'

const route = useRoute()
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isSplashVisible = shallowRef(true)
const hasEnteredSite = shallowRef(false)
const isCollaborationDismissed = shallowRef(false)

const isCaseStudy = computed(() => route.name === 'work-case-study')
const isCollaborationEnabled = computed(() => hasEnteredSite.value && !isCaseStudy.value)

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
        class="case-study-overlay fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-[#f4f4f1] shadow-[-12px_0_40px_rgba(0,0,0,0.08)] will-change-transform"
        data-lenis-prevent
        :initial="prefersReducedMotion ? false : { x: '100%' }"
        :animate="{ x: 0 }"
        :exit="{ x: '100%' }"
        :transition="caseStudyTransition"
      >
        <WorkCaseStudy />
      </motion.div>
    </AnimatePresence>

    <Transition name="splash" @after-leave="hasEnteredSite = true">
      <SplashScreen v-if="isSplashVisible" @complete="isSplashVisible = false" />
    </Transition>

    <CollaborationModal
      :enabled="isCollaborationEnabled"
      @dismissed="isCollaborationDismissed = true"
    />

    <CvDownloadPrompt v-if="hasEnteredSite && !isCaseStudy && isCollaborationDismissed" />
  </div>
</template>

<style>
.case-study-overlay {
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.splash-leave-active {
  transition: transform 700ms cubic-bezier(0.76, 0, 0.24, 1);
}

.splash-leave-to {
  transform: translateY(-100%);
}

@media (prefers-reduced-motion: reduce) {
  .splash-leave-active {
    transition-duration: 0ms;
  }
}
</style>
