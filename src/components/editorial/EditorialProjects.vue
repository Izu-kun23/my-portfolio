<script setup lang="ts">
import { useTemplateRef } from 'vue'

import WorkStackCard from '@/components/editorial/WorkStackCard.vue'
import { useWorkStack } from '@/composables/useWorkStack'
import { workProjects } from '@/data/work'

const stackRef = useTemplateRef<HTMLElement>('stackRef')

useWorkStack(stackRef)
</script>

<template>
  <section id="work" class="editorial-section bg-[var(--paper)] px-5 sm:px-8 lg:px-14">
    <div class="mx-auto max-w-[1600px]">
      <header data-reveal class="mb-16 grid gap-6 border-t border-black/20 pt-4 lg:mb-20 lg:grid-cols-12 lg:items-start">
        <p class="m-0 text-base font-medium uppercase tracking-[0.08em] lg:col-span-3">Selected work</p>
        <h2 class="m-0 max-w-4xl text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.88] font-light tracking-[-0.065em] lg:col-span-8">
          Work that earns attention.
        </h2>
      </header>

      <div ref="stackRef" class="work-stack relative">
        <WorkStackCard
          v-for="(project, index) in workProjects"
          :key="project.id"
          :project="project"
          :index="index"
          :eager="index === 0"
        />
      </div>
    </div>
  </section>
</template>
