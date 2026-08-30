<script setup lang="ts">
import { useTemplateRef } from 'vue'

import EditorialAbout from '@/components/editorial/EditorialAbout.vue'
import EditorialCapabilities from '@/components/editorial/EditorialCapabilities.vue'
import EditorialContact from '@/components/editorial/EditorialContact.vue'
import EditorialFooter from '@/components/editorial/EditorialFooter.vue'
import EditorialHero from '@/components/editorial/EditorialHero.vue'
import EditorialMarquee from '@/components/editorial/EditorialMarquee.vue'
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
    <EditorialProjects />
    <EditorialMarquee text="ALL WORKS" />
    <EditorialAbout />
    <EditorialCapabilities />
    <EditorialValues />
    <EditorialMarquee text="LET'S TALK" direction="reverse" />
    <EditorialContact />
    <EditorialFooter />
  </main>
</template>
