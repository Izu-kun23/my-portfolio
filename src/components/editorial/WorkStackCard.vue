<script setup lang="ts">
import type { WorkProject } from '@/data/work'

defineProps<{
  project: WorkProject
  index: number
  eager?: boolean
}>()
</script>

<template>
  <article
    data-work-card
    class="work-card"
    :style="{ '--stack-index': index }"
  >
    <div
      data-work-card-inner
      class="work-card-inner grid overflow-hidden rounded-[1.25rem] border border-[var(--ink)]/12 bg-[var(--paper)] shadow-[0_18px_50px_oklch(0.12_0.006_80_/_0.12)] md:grid-cols-12"
    >
      <div class="flex min-h-0 flex-col justify-between gap-6 px-6 py-7 sm:px-8 sm:py-8 md:col-span-5 md:px-9 md:py-10 lg:px-10">
        <div class="flex items-end justify-between border-b border-[var(--ink)]/16 pb-3">
          <span class="text-base font-medium">0{{ index + 1 }}</span>
          <span class="text-base font-medium">{{ project.year }}</span>
        </div>

        <div>
          <p class="m-0 text-base font-medium uppercase tracking-[0.08em] text-black/75">
            {{ project.category }}
          </p>
          <h3 class="mt-3 mb-0 text-[clamp(2rem,4.2vw,4.25rem)] leading-[0.9] font-light tracking-[-0.055em]">
            {{ project.title }}
          </h3>
          <p class="mt-5 mb-0 max-w-sm text-lg leading-relaxed text-black/78">
            {{ project.techStack.join(' · ') }}
          </p>
          <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-base font-medium">
            <RouterLink
              v-if="project.caseStudyUrl"
              :to="project.caseStudyUrl"
              class="editorial-link"
            >
              View case study
            </RouterLink>
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noreferrer"
              class="editorial-link"
            >
              View live
            </a>
          </div>
        </div>
      </div>

      <RouterLink
        v-if="project.caseStudyUrl"
        :to="project.caseStudyUrl"
        class="work-card-visual group relative block min-h-0 overflow-hidden bg-black/5 md:col-span-7"
      >
        <img
          :src="project.image"
          :alt="project.imageAlt"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          :fetchpriority="eager ? 'high' : 'auto'"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <span class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-sm uppercase tracking-[0.08em] text-white opacity-0 transition-[opacity,background-color] duration-500 group-hover:bg-black/25 group-hover:opacity-100">
          View project
        </span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.work-card {
  position: sticky;
  top: calc(5.5rem + (var(--stack-index, 0) * 0.55rem));
  z-index: calc(2 + var(--stack-index, 0));
  margin: 0 0 1.25rem;
}

.work-card:last-child {
  margin-bottom: 0;
}

.work-card-inner {
  height: min(40rem, 78svh);
  grid-template-rows: auto minmax(0, 1fr);
  transform: translateZ(0);
}

.work-card-visual {
  min-height: 0;
}

@media (min-width: 768px) {
  .work-card-inner {
    grid-template-rows: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .work-card-inner {
    will-change: transform;
  }
}
</style>
