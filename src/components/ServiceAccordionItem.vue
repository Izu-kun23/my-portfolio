<script setup lang="ts">
import { computed } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

import type { ServiceItem } from '@/data/services'

const props = defineProps<{
  service: ServiceItem
  isActive: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const panelTransition = computed(() =>
  prefersReducedMotion
    ? { duration: 0 }
    : {
        height: { type: 'spring' as const, stiffness: 280, damping: 34, mass: 0.9 },
        opacity: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const },
      },
)

const cardTransition = computed(() =>
  prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.85 },
)

const contentTransition = computed(() =>
  prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const, delay: 0.06 },
)

const triggerTransition = computed(() =>
  prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.4, 0, 0.2, 1] as const },
)

const layoutTransition = computed(() =>
  prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 42, mass: 0.8 },
)
</script>

<template>
  <motion.div layout :transition="layoutTransition" class="relative w-full min-w-0">
    <AnimatePresence mode="wait" :initial="false">
      <motion.button
        v-if="!isActive"
        key="trigger"
        layout
        type="button"
        class="group flex w-full min-w-0 touch-pan-y items-center justify-between gap-3 px-4 py-5 text-left sm:px-6 md:gap-5 md:px-0 md:py-6"
        :exit="{ opacity: 0, y: -8 }"
        :transition="triggerTransition"
        @click="emit('toggle')"
      >
        <span
          class="min-w-0 flex-1 font-sans text-[clamp(1.125rem,2.8vw,2rem)] leading-[1.1] font-bold tracking-tight text-gray-900 uppercase"
        >
          {{ service.label }}
        </span>
        <span
          aria-hidden="true"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center text-gray-900 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M7 17L17 7" stroke-linecap="round" />
            <path d="M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </motion.button>

      <motion.div
        v-else
        key="panel"
        layout
        class="overflow-hidden"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
        :transition="panelTransition"
      >
        <motion.div
          class="relative mx-4 touch-pan-y rounded-2xl bg-[#1c1c1c] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:mx-6 md:mx-0 md:px-10 md:py-9"
          :initial="{ scale: 0.97, y: 12 }"
          :animate="{ scale: 1, y: 0 }"
          :exit="{ scale: 0.98, y: 8 }"
          :transition="cardTransition"
        >
          <motion.img
            :src="service.image"
            :alt="service.imageAlt"
            class="pointer-events-none absolute -top-10 right-4 z-10 hidden h-36 w-auto max-w-[42%] rounded-lg border border-white/20 bg-white object-cover shadow-[0_20px_40px_rgba(0,0,0,0.35)] md:block md:-top-14 md:right-10 md:h-44 lg:h-52"
            :initial="{ opacity: 0, y: 28, rotate: -4 }"
            :animate="{ opacity: 1, y: 0, rotate: -8 }"
            :exit="{ opacity: 0, y: -10, rotate: -4 }"
            :transition="contentTransition"
          />

          <div class="relative z-20 flex items-start justify-between gap-6">
            <span
              class="font-sans text-[clamp(1.25rem,3.2vw,2.25rem)] leading-[1.08] font-bold tracking-tight text-white uppercase"
            >
              {{ service.label }}
            </span>
            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white transition-opacity hover:opacity-70"
              aria-label="Close service details"
              @click="emit('toggle')"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <motion.div
            class="relative z-20 mt-4 max-w-xl md:mt-5 md:max-w-lg"
            :initial="{ opacity: 0, y: 16 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -8 }"
            :transition="contentTransition"
          >
            <p class="m-0 text-sm leading-relaxed text-white/75 md:text-base">
              {{ service.description }}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </motion.div>
</template>
