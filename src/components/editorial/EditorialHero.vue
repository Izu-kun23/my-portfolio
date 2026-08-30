<script setup lang="ts">
import { workProjects } from '@/data/work'

const heroProjects = workProjects.slice(0, 5)
const tileTops = [10, 24, 36, 24, 10]
</script>

<template>
  <section id="home" class="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
    <div class="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-5 pt-20 pb-5 sm:px-8 lg:px-14">
      <p data-hero-meta class="mt-4 text-xs tracking-[0.08em] uppercase sm:mt-8">
        Software engineer &amp; digital product builder
      </p>

      <div class="hero-arc pointer-events-none absolute inset-x-0 top-[12%] h-[50%] sm:top-[9%] sm:h-[58%] lg:top-[5%] lg:h-[66%]" aria-hidden="true">
        <figure
          v-for="(project, index) in heroProjects"
          :key="project.id"
          data-hero-tile
          class="hero-tile absolute overflow-hidden bg-[#222] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
          :style="{
            '--desktop-left': `${3 + index * 18}%`,
            '--mobile-left': `${-20 + index * 23}%`,
            '--tile-top': `${tileTops[index]}%`,
            '--tile-rotation': `${(index - 2) * 5}deg`,
          }"
        >
          <img :src="project.image" alt="" class="h-full w-full object-cover" />
        </figure>
      </div>

      <div class="relative z-10 mt-auto">
        <div class="overflow-hidden">
          <h1 data-hero-word class="m-0 text-[clamp(4.4rem,15.1vw,15rem)] leading-[0.72] font-light tracking-[-0.085em] whitespace-nowrap">
            IZUCHUKWU
          </h1>
        </div>

        <div class="mt-7 grid gap-6 border-t border-white/20 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-12">
          <p data-hero-meta class="m-0 max-w-[32rem] leading-relaxed text-white/72 lg:col-span-4 lg:col-start-7">
            I build useful digital products with clean systems, sharp interfaces, and the details that make software feel considered.
          </p>
          <p data-hero-meta class="m-0 sm:text-right lg:col-span-2 lg:col-start-11">
            United Kingdom<br />Available worldwide
          </p>
        </div>
      </div>
    </div>

    <a href="#work" class="absolute right-5 bottom-5 z-20 inline-flex size-11 items-center justify-center rounded-full border border-white/35 text-white sm:right-8 lg:right-14" aria-label="View selected work">
      <svg viewBox="0 0 20 20" fill="none" class="size-4" aria-hidden="true">
        <path d="M10 3v13m0 0 5-5m-5 5-5-5" stroke="currentColor" stroke-width="1.2" />
      </svg>
    </a>
  </section>
</template>

<style scoped>
.hero-tile {
  width: clamp(7.5rem, 16vw, 16rem);
  aspect-ratio: 4 / 3;
  left: var(--desktop-left);
  top: var(--tile-top);
  transform: rotate(var(--tile-rotation));
}

@media (max-width: 639px) {
  .hero-tile {
    width: 38vw;
    left: var(--mobile-left);
  }
}
</style>
