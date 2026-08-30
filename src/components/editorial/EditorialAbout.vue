<script setup lang="ts">
import { aboutIntro, experienceEntries } from '@/data/about'
</script>

<template>
  <section id="about" class="editorial-section px-5 sm:px-8 lg:px-14">
    <div class="mx-auto max-w-[1600px]">
      <div class="grid gap-10 lg:grid-cols-12">
        <p data-reveal class="m-0 text-xs uppercase tracking-[0.08em] lg:col-span-2">About</p>
        <div class="lg:col-span-9 lg:col-start-4">
          <h2 data-reveal class="m-0 text-[clamp(2.9rem,7vw,7.5rem)] leading-[0.98] font-light tracking-[-0.055em]">
            {{ aboutIntro.headline }}
          </h2>
          <div class="mt-12 grid gap-6 text-[clamp(1rem,1.6vw,1.35rem)] leading-relaxed text-black/62 md:grid-cols-2">
            <p v-for="paragraph in aboutIntro.paragraphs" :key="paragraph" data-reveal class="m-0 max-w-[34rem]">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>

      <div id="experience" class="mt-36 md:mt-52">
        <div data-reveal class="grid grid-cols-2 border-b border-black/20 pb-3 text-xs uppercase tracking-[0.08em] md:grid-cols-12">
          <span class="md:col-span-5">Company</span>
          <span class="md:col-span-5">Role</span>
          <span class="hidden text-right md:col-span-2 md:block">Year</span>
        </div>

        <article
          v-for="entry in experienceEntries"
          :key="entry.id"
          data-reveal
          class="experience-row grid gap-3 border-b border-black/20 py-7 transition-colors duration-300 hover:bg-black/[0.025] md:grid-cols-12 md:items-start md:py-10"
        >
          <h3 class="m-0 text-[clamp(1.8rem,3.2vw,3.5rem)] leading-none font-light tracking-[-0.04em] md:col-span-5">{{ entry.company }}</h3>
          <div class="md:col-span-5">
            <p class="m-0 text-base md:text-lg">{{ entry.role }}</p>
            <p class="mt-3 mb-0 max-w-xl text-sm leading-relaxed text-black/55">{{ entry.summary }}</p>
          </div>
          <p class="m-0 text-sm text-black/55 md:col-span-2 md:text-right">{{ entry.period }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
