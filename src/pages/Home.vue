<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import AboutSection from '@/components/AboutSection.vue'
import AppMenuButton from '@/components/AppMenuButton.vue'
import AppMenuSidebar from '@/components/AppMenuSidebar.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import ContactSection from '@/components/ContactSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import ScrollMarquee from '@/components/ScrollMarquee.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import StorySection from '@/components/story/StorySection.vue'
import TechnologyMarquee from '@/components/TechnologyMarquee.vue'
import WorkSection from '@/components/WorkSection.vue'
import { useHashScroll } from '@/composables/useHashScroll'
import { unveilActiveIndex, useUnveilScroll } from '@/composables/useUnveilScroll'

const unveilRootRef = useTemplateRef<HTMLElement>('unveilRootRef')
const unveilStageRef = useTemplateRef<HTMLElement>('unveilStageRef')

const heroPanelRef = useTemplateRef<HTMLElement>('heroPanelRef')
const storyPanelRef = useTemplateRef<HTMLElement>('storyPanelRef')
const servicesPanelRef = useTemplateRef<HTMLElement>('servicesPanelRef')
const workPanelRef = useTemplateRef<HTMLElement>('workPanelRef')
const aboutPanelRef = useTemplateRef<HTMLElement>('aboutPanelRef')
const contactPanelRef = useTemplateRef<HTMLElement>('contactPanelRef')

const servicesSectionRef = useTemplateRef<InstanceType<typeof ServicesSection>>('servicesSectionRef')
const workSectionRef = useTemplateRef<InstanceType<typeof WorkSection>>('workSectionRef')
const aboutSectionRef = useTemplateRef<InstanceType<typeof AboutSection>>('aboutSectionRef')
const contactSectionRef = useTemplateRef<InstanceType<typeof ContactSection>>('contactSectionRef')

const isHeroMode = computed(() => unveilActiveIndex.value === 0)

useUnveilScroll({
  rootRef: unveilRootRef,
  stageRef: unveilStageRef,
  sections: [
    { id: 'hero', panelRef: heroPanelRef },
    { id: 'story', panelRef: storyPanelRef },
    {
      id: 'about',
      panelRef: aboutPanelRef,
      getReveal: () => aboutSectionRef.value?.reveal,
    },
    {
      id: 'work',
      panelRef: workPanelRef,
      getReveal: () => workSectionRef.value?.reveal,
    },
    {
      id: 'services',
      panelRef: servicesPanelRef,
      getReveal: () => servicesSectionRef.value?.reveal,
    },
    {
      id: 'contact',
      panelRef: contactPanelRef,
      getReveal: () => contactSectionRef.value?.reveal,
    },
  ],
})

useHashScroll()
</script>

<template>
  <main>
    <AppMenuButton v-if="!isHeroMode" />
    <AppMenuSidebar />

    <div ref="unveilRootRef" class="unveil-root">
      <!-- Only the hero participates in the stack / pin scroll -->
      <div ref="unveilStageRef" class="unveil-stage">
        <div ref="heroPanelRef" class="unveil-panel unveil-panel--hero flex flex-col">
          <AppNavbar />
          <HeroSection class="min-h-0 flex-1" />
        </div>
      </div>

      <div ref="storyPanelRef" class="unveil-panel unveil-panel--flow relative w-full">
        <StorySection />
      </div>

      <!-- Remaining sections use normal document flow -->
      <div
        ref="aboutPanelRef"
        class="unveil-panel unveil-panel--about unveil-panel--flow relative w-full"
      >
        <AboutSection ref="aboutSectionRef" />
      </div>

      <ScrollMarquee />

      <div
        ref="workPanelRef"
        class="unveil-panel unveil-panel--work unveil-panel--flow relative flex w-full flex-col"
      >
        <WorkSection ref="workSectionRef" class="flex-1" />
      </div>

      <div
        ref="servicesPanelRef"
        class="unveil-panel unveil-panel--services unveil-panel--flow relative flex min-h-[100svh] w-full flex-col"
      >
        <ServicesSection ref="servicesSectionRef" class="min-h-0 flex-1" />
      </div>

      <TechnologyMarquee />

      <div
        ref="contactPanelRef"
        class="unveil-panel unveil-panel--contact unveil-panel--flow relative w-full min-h-[100svh]"
      >
        <ContactSection ref="contactSectionRef" class="min-h-0 flex-1" />
      </div>

      <SiteFooter />
    </div>
  </main>
</template>
