<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { isInternalWorkPath, type WorkProject } from '@/data/work'
import { beginCaseStudyNavigation } from '@/lib/homeScrollPreserve'

defineProps<{
  project: WorkProject
}>()
</script>

<template>
  <article class="work-project-card flex w-full max-w-[751.62px] flex-col">
    <div
      class="work-project-card__media group relative overflow-hidden rounded-2xl"
      :class="project.id === 'kentoks-kitchen' ? 'bg-[#f8ebe4]' : 'bg-gray-100'"
    >
      <img
        :src="project.image"
        :alt="project.imageAlt"
        class="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        :class="project.id === 'kentoks-kitchen' ? 'object-contain p-3 sm:p-4' : 'object-cover'"
        loading="lazy"
      />

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"
      />

      <div class="absolute bottom-3 left-3 flex items-center gap-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-white" />
        <span class="h-1.5 w-1.5 rounded-full bg-white/35" />
        <span class="h-1.5 w-1.5 rounded-full bg-white/35" />
      </div>
    </div>

    <p class="m-0 mt-4 text-xs text-gray-500 sm:text-sm">
      {{ project.category }}
    </p>

    <div class="mt-3 flex flex-col gap-2.5 sm:mt-4 md:flex-row md:items-center md:justify-between md:gap-6">
      <h3
        class="m-0 min-w-0 font-sans text-[clamp(1.35rem,3.5vw,2.25rem)] leading-[1.05] font-bold tracking-tight text-gray-900 uppercase"
      >
        {{ project.title }}
      </h3>

      <ul class="m-0 flex shrink-0 list-none flex-wrap items-center gap-1.5 p-0 md:justify-end">
        <li v-for="tag in project.tags" :key="tag.label">
          <span
            class="inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase sm:px-3 sm:py-1 sm:text-xs"
            :class="
              tag.filled
                ? 'bg-gray-900 text-white'
                : 'border border-gray-300 text-gray-700'
            "
          >
            {{ tag.label }}
          </span>
        </li>
      </ul>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2.5 pb-2 sm:mt-5 sm:gap-3 sm:pb-4">
      <RouterLink
        v-if="isInternalWorkPath(project.caseStudyUrl)"
        :to="project.caseStudyUrl!"
        class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-85 sm:px-5 sm:py-2.5 sm:text-sm"
        @click="beginCaseStudyNavigation"
      >
        Case Study
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-none stroke-current stroke-2 sm:h-4 sm:w-4">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
      <a
        v-else-if="project.caseStudyUrl && project.caseStudyUrl !== '#'"
        :href="project.caseStudyUrl"
        class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-85 sm:px-5 sm:py-2.5 sm:text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        Case Study
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-none stroke-current stroke-2 sm:h-4 sm:w-4">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>

      <a
        v-if="project.liveUrl && project.liveUrl !== '#'"
        :href="project.liveUrl"
        class="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-900 transition-colors hover:border-gray-900 sm:px-5 sm:py-2.5 sm:text-sm"
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
  </article>
</template>

<style scoped>
.work-project-card__media {
  width: 100%;
  max-width: 751.62px;
  aspect-ratio: 751.62 / 469.76;
}
</style>
