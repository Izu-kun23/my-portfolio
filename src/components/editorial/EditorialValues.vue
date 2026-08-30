<script setup lang="ts">
import profileImage from '@/assets/portfolio.png'
import { aboutIntro, experienceEntries } from '@/data/about'
</script>
<template>
  <section id="experience" class="bg-[var(--ink)] px-4 py-28 text-[var(--paper)] sm:px-7 md:py-44 lg:px-12">
    <div class="mx-auto max-w-[1800px]">
      <header data-reveal class="grid gap-6 lg:grid-cols-12"><p class="m-0 text-base font-medium uppercase tracking-[.08em] lg:col-span-3">Built through real teams</p><h2 class="m-0 text-[clamp(3.8rem,9vw,10rem)] leading-[.8] font-medium tracking-[-.075em] uppercase lg:col-span-9">Experience<br />that ships</h2></header>
      <div class="mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-28">
        <article v-for="entry in experienceEntries" :key="entry.id" class="flex min-h-[30rem] w-[88vw] shrink-0 snap-center flex-col border border-white/22 p-6 sm:w-[32rem] md:p-8">
          <div class="flex items-start justify-between gap-4"><img v-if="entry.logo" :src="entry.logo" :alt="entry.logoAlt" class="max-h-9 max-w-28 object-contain" :class="entry.logoInvert ? 'invert' : ''" /><span class="text-base font-medium text-white/78">{{ entry.period }}</span></div>
          <blockquote class="my-auto text-[clamp(1.8rem,3vw,3rem)] leading-[1.04] tracking-[-.04em]">“{{ entry.summary }}”</blockquote>
          <div class="border-t border-white/20 pt-5"><strong class="block text-xl font-medium">{{ entry.company }}</strong><span class="mt-1 block text-base text-white/78">{{ entry.role }}</span></div>
        </article>
      </div>
      <div class="mt-32 grid gap-12 border-t border-white/25 pt-8 lg:grid-cols-12 lg:items-end">
        <figure data-image-reveal class="m-0 overflow-hidden lg:col-span-5"><img :src="profileImage" alt="Profile portrait of Izuchukwu Tony" loading="lazy" class="aspect-[4/5] h-full w-full object-cover object-[72%_center] grayscale" /></figure>
        <div class="lg:col-span-6 lg:col-start-7"><p class="text-base font-medium uppercase tracking-[.08em] text-white/78">Behind the work</p><h3 class="mt-8 mb-0 text-[clamp(3rem,7vw,7rem)] leading-[.88] tracking-[-.06em]">{{ aboutIntro.headline }}</h3><p v-for="paragraph in aboutIntro.paragraphs" :key="paragraph" class="mt-6 mb-0 max-w-xl text-lg leading-relaxed text-white/78">{{ paragraph }}</p></div>
      </div>
    </div>
  </section>
</template>
