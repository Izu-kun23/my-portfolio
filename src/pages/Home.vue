<script setup lang="ts">
import { useTemplateRef } from 'vue'

import EditorialCapabilities from '@/components/editorial/EditorialCapabilities.vue'
import EditorialContact from '@/components/editorial/EditorialContact.vue'
import EditorialFooter from '@/components/editorial/EditorialFooter.vue'
import EditorialFaq from '@/components/editorial/EditorialFaq.vue'
import EditorialHero from '@/components/editorial/EditorialHero.vue'
import EditorialMarquee from '@/components/editorial/EditorialMarquee.vue'
import EditorialMission from '@/components/editorial/EditorialMission.vue'
import EditorialNavbar from '@/components/editorial/EditorialNavbar.vue'
import EditorialProjects from '@/components/editorial/EditorialProjects.vue'
import EditorialValues from '@/components/editorial/EditorialValues.vue'
import { useEditorialMotion } from '@/composables/useEditorialMotion'
import { useHashScroll } from '@/composables/useHashScroll'

const pageRef = useTemplateRef<HTMLElement>('pageRef')

useEditorialMotion(pageRef)
useHashScroll()
</script>

<template>
  <main ref="pageRef" class="editorial-page overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
    <EditorialNavbar />
    <EditorialHero />
    <EditorialMarquee text="BUILD WITH PURPOSE" />
    <EditorialProjects />
    <EditorialMission />
    <EditorialCapabilities />
    <EditorialValues />
    <EditorialContact />
    <EditorialFaq />
    <EditorialMarquee text="LET'S BUILD TOGETHER" direction="reverse" />
    <EditorialFooter />
  </main>
</template>
