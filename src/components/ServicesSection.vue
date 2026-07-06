<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { LayoutGroup, motion } from 'motion-v'

import ServiceAccordionItem from '@/components/ServiceAccordionItem.vue'
import MotionScrambleText from '@/components/MotionScrambleText.vue'
import {
  servicesRevealVariants,
  useMotionSectionReveal,
} from '@/composables/useMotionSectionReveal'
import { useSectionScrollHandoff } from '@/composables/useSectionScrollHandoff'
import { services, servicesSectionIntro } from '@/data/services'
import { prefersFreeScrollLayout } from '@/lib/scrollMode'

const usesInternalScroll = !prefersFreeScrollLayout()

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const scrollerRef = useTemplateRef<HTMLElement>('scrollerRef')

const activeId = ref<string | null>(null)

function toggleService(id: string) {
  activeId.value = activeId.value === id ? null : id
}

useSectionScrollHandoff(scrollerRef, {
  sectionRef,
  enabled: usesInternalScroll,
})

const scrollerClass = computed(() =>
  usesInternalScroll
    ? 'services-scroller min-h-0 flex-1 overflow-y-auto'
    : 'flex min-h-0 flex-1 flex-col',
)

const sectionReveal = useMotionSectionReveal()
const { phase } = sectionReveal

const initialPhase = computed(() => (phase.value === 'visible' ? 'visible' : 'hidden'))

defineExpose({ reveal: sectionReveal })
</script>

<template>
  <section
    id="services"
    ref="sectionRef"
    class="relative flex w-full min-w-0 touch-pan-y flex-col pt-[calc(4rem+env(safe-area-inset-top))] pb-8 sm:pt-16 sm:pb-10 md:h-full md:min-h-0 md:overflow-hidden md:px-12 md:pt-20 lg:px-20"
    :data-lenis-prevent="usesInternalScroll ? '' : undefined"
  >
    <div
      aria-hidden="true"
      class="services-cloud-bg pointer-events-none absolute inset-0"
    />

    <motion.div
      class="section-content relative z-10 flex w-full min-w-0 flex-col md:mx-auto md:h-full md:min-h-0 md:max-w-6xl md:flex-1"
      :initial="initialPhase"
      :animate="phase"
      :variants="servicesRevealVariants.section"
    >
      <div
        ref="scrollerRef"
        :class="scrollerClass"
      >
        <motion.div
          class="relative shrink-0 overflow-hidden px-4 sm:px-6 md:px-0"
          :variants="servicesRevealVariants.headerGroup"
        >
          <div class="relative z-10 border-b border-gray-300/70 pt-12 pb-8 sm:pt-14 sm:pb-8 md:pt-16 md:pb-10">
            <motion.p
              class="pointer-events-none absolute top-1/2 left-4 m-0 -translate-y-[42%] select-none text-[clamp(3.5rem,12vw,8rem)] leading-none font-bold tracking-tight text-gray-200 uppercase sm:left-6 md:left-0"
              aria-hidden="true"
              :variants="servicesRevealVariants.watermark"
            >
              {{ servicesSectionIntro.backgroundTitle }}
            </motion.p>

            <motion.h2
              class="relative z-10 m-0 text-[clamp(2rem,5.5vw,2.75rem)] leading-[1.05] font-bold tracking-tight text-gray-900 uppercase"
              :variants="servicesRevealVariants.fadeUp"
            >
              <MotionScrambleText
                :text="servicesSectionIntro.title"
                :play="phase === 'visible'"
              />
            </motion.h2>

            <motion.p
              class="section-subtext section-subtext--light relative z-10"
              :variants="servicesRevealVariants.fadeUp"
            >
              {{ servicesSectionIntro.subtext }}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          class="min-h-0 flex-1"
          :variants="servicesRevealVariants.fadeUp"
        >
          <LayoutGroup id="services-accordion" class="w-full min-w-0">
            <motion.ul
              class="m-0 flex w-full min-w-0 list-none flex-col px-4 p-0 pb-8 sm:px-6 md:px-0"
              :variants="servicesRevealVariants.list"
            >
              <motion.li
                v-for="service in services"
                :key="service.id"
                class="w-full min-w-0 border-b border-gray-300/70 last:border-b-0"
                :variants="servicesRevealVariants.listItem"
              >
                <ServiceAccordionItem
                  :service="service"
                  :is-active="activeId === service.id"
                  @toggle="toggleService(service.id)"
                />
              </motion.li>
            </motion.ul>
          </LayoutGroup>
        </motion.div>
      </div>
    </motion.div>
  </section>
</template>

<style scoped>
.services-scroller {
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.services-scroller::-webkit-scrollbar {
  display: none;
}

.services-cloud-bg {
  background-color: #f3f4f6;
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 30%, rgba(255, 255, 255, 0.95) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 75% 20%, rgba(255, 255, 255, 0.9) 0%, transparent 65%),
    radial-gradient(ellipse 70% 45% at 50% 70%, rgba(229, 231, 235, 0.8) 0%, transparent 70%),
    radial-gradient(ellipse 55% 35% at 85% 65%, rgba(255, 255, 255, 0.85) 0%, transparent 60%),
    linear-gradient(180deg, #f9fafb 0%, #e5e7eb 55%, #f3f4f6 100%);
}
</style>
