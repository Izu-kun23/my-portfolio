<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import AboutSection from '@/components/AboutSection.vue'
import AppMenuButton from '@/components/AppMenuButton.vue'
import AppMenuSidebar from '@/components/AppMenuSidebar.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import ContactSection from '@/components/ContactSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import WorkSection from '@/components/WorkSection.vue'
import { useHashScroll } from '@/composables/useHashScroll'
import { unveilActiveIndex, useUnveilScroll } from '@/composables/useUnveilScroll'

const unveilRootRef = useTemplateRef<HTMLElement>('unveilRootRef')
const unveilStageRef = useTemplateRef<HTMLElement>('unveilStageRef')

const heroPanelRef = useTemplateRef<HTMLElement>('heroPanelRef')
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
    {
      id: 'services',
      panelRef: servicesPanelRef,
      getReveal: () => servicesSectionRef.value?.reveal,
    },
    {
      id: 'work',
      panelRef: workPanelRef,
      getReveal: () => workSectionRef.value?.reveal,
    },
    {
      id: 'about',
      panelRef: aboutPanelRef,
      getReveal: () => aboutSectionRef.value?.reveal,
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
      <div ref="unveilStageRef" class="unveil-stage">
        <div ref="heroPanelRef" class="unveil-panel unveil-panel--hero flex flex-col">
          <AppNavbar />
          <HeroSection class="min-h-0 flex-1" />
        </div>

        <div ref="servicesPanelRef" class="unveil-panel unveil-panel--services flex min-h-0 min-w-0 flex-col">
          <ServicesSection ref="servicesSectionRef" class="min-h-0 flex-1" />
        </div>

        <div ref="workPanelRef" class="unveil-panel unveil-panel--work md:flex md:min-h-0 md:flex-col">
          <WorkSection ref="workSectionRef" class="md:min-h-0 md:flex-1" />
        </div>
      </div>

      <div ref="aboutPanelRef" class="unveil-panel unveil-panel--about relative w-full">
        <AboutSection ref="aboutSectionRef" />
      </div>

      <div ref="contactPanelRef" class="unveil-panel unveil-panel--contact relative w-full min-h-[100svh]">
        <ContactSection ref="contactSectionRef" class="min-h-0 flex-1" />
      </div>
    </div>
  </main>
</template>
