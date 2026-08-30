<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { isInternalWorkPath, type WorkProject } from '@/data/work'
import { beginCaseStudyNavigation } from '@/lib/homeScrollPreserve'

defineProps<{
  project: WorkProject
}>()
</script>

<template>
  <article
    class="work-project-card group relative w-full overflow-hidden rounded-[2rem] bg-gray-100 shadow-[0_18px_55px_rgba(15,23,42,0.16)] focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-4"
    :class="project.id === 'kentoks-kitchen' ? 'bg-[#f8ebe4]' : 'bg-gray-100'"
  >
    <img
      :src="project.image"
      :alt="project.imageAlt"
      class="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035] group-focus-within:scale-[1.035] motion-reduce:transition-none"
      :class="project.id === 'kentoks-kitchen' ? 'object-contain p-3 sm:p-4' : 'object-cover'"
      loading="eager"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 motion-reduce:transition-none"
    />

    <div
      class="absolute inset-x-0 bottom-0 z-10 translate-y-0 p-4 text-white opacity-100 transition-[transform,opacity] duration-500 ease-out sm:p-6 md:translate-y-8 md:p-7 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 motion-reduce:transition-none"
    >
      <p class="m-0 text-[0.65rem] font-medium tracking-[0.12em] text-white/65 uppercase sm:text-xs">
        {{ project.category }} · {{ project.year }}
      </p>

      <h3 class="m-0 mt-2 max-w-2xl text-[clamp(1.25rem,4vw,2.25rem)] leading-[1.02] font-bold tracking-[-0.035em] uppercase">
        {{ project.title }}
      </h3>

      <ul class="m-0 mt-3 hidden list-none flex-wrap gap-1.5 p-0 sm:flex">
        <li v-for="tag in project.tags" :key="tag.label">
          <span class="inline-flex rounded-full border border-white/35 bg-black/15 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white backdrop-blur-sm uppercase">
            {{ tag.label }}
          </span>
        </li>
      </ul>

      <div class="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
      <RouterLink
        v-if="isInternalWorkPath(project.caseStudyUrl)"
        :to="project.caseStudyUrl!"
        class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-950 transition-colors hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:py-2.5 sm:text-sm"
        @click="beginCaseStudyNavigation"
      >
        View Case Study
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-none stroke-current stroke-2 sm:h-4 sm:w-4">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
      <a
        v-else-if="project.caseStudyUrl && project.caseStudyUrl !== '#'"
        :href="project.caseStudyUrl"
        class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-950 transition-colors hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:py-2.5 sm:text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Case Study
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-none stroke-current stroke-2 sm:h-4 sm:w-4">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>

      <a
        v-if="project.liveUrl && project.liveUrl !== '#'"
        :href="project.liveUrl"
        class="inline-flex items-center gap-2 rounded-full border border-white/45 bg-black/15 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:py-2.5 sm:text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Live
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-none stroke-current stroke-2 sm:h-4 sm:w-4">
          <path d="M7 17L17 7" stroke-linecap="round" />
          <path d="M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.work-project-card {
  aspect-ratio: 751.62 / 469.76;
}
</style>
