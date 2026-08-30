<script setup lang="ts">
import { workProjects } from '@/data/work'
</script>

<template>
  <section id="work" class="editorial-section bg-[var(--paper)] px-5 sm:px-8 lg:px-14">
    <div class="mx-auto max-w-[1600px]">
      <header data-reveal class="mb-20 grid gap-6 border-t border-black/20 pt-4 lg:grid-cols-12 lg:items-start">
        <p class="m-0 text-xs uppercase tracking-[0.08em] lg:col-span-3">Selected work</p>
        <h2 class="m-0 max-w-4xl text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.88] font-light tracking-[-0.065em] lg:col-span-8">
          Products built to be used.
        </h2>
      </header>

      <div class="space-y-28 md:space-y-40">
        <article
          v-for="(project, index) in workProjects"
          :key="project.id"
          data-reveal
          class="project-entry grid gap-5 lg:grid-cols-12"
        >
          <div class="flex items-end justify-between border-t border-black/20 pt-3 lg:col-span-12">
            <span class="text-xs">0{{ index + 1 }}</span>
            <span class="text-xs">{{ project.year }}</span>
          </div>

          <div
            class="project-copy lg:col-span-4"
            :class="index % 2 === 0 ? 'lg:order-1' : 'lg:order-2 lg:col-start-9'"
          >
            <p class="m-0 text-xs uppercase tracking-[0.08em] text-black/55">{{ project.category }}</p>
            <h3 class="mt-3 mb-0 text-[clamp(2.6rem,5vw,5.5rem)] leading-[0.9] font-light tracking-[-0.055em]">{{ project.title }}</h3>
            <p class="mt-5 mb-0 max-w-sm text-sm leading-relaxed text-black/58">{{ project.techStack.join(' · ') }}</p>
            <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <RouterLink v-if="project.caseStudyUrl" :to="project.caseStudyUrl" class="editorial-link">View case study</RouterLink>
              <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer" class="editorial-link">View live</a>
            </div>
          </div>

          <RouterLink
            v-if="project.caseStudyUrl"
            :to="project.caseStudyUrl"
            data-image-reveal
            class="project-visual group block overflow-hidden bg-black/5 lg:col-span-8"
            :class="index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'"
          >
            <img
              :src="project.image"
              :alt="project.imageAlt"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025]"
            />
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-visual {
  aspect-ratio: 16 / 10;
}

@media (min-width: 1024px) {
  .project-copy {
    align-self: end;
    padding-bottom: clamp(0rem, 4vw, 4rem);
  }

  .project-entry:nth-child(even) .project-visual {
    aspect-ratio: 4 / 3;
  }
}
</style>
