<script setup lang="ts">
import { experienceEntries } from '@/data/about'

const values = ['Keep learning', 'Communicate clearly', 'Enjoy the process']
</script>

<template>
  <section class="editorial-section px-5 sm:px-8 lg:px-14">
    <div class="mx-auto max-w-[1600px]">
      <div class="grid gap-10 lg:grid-cols-12">
        <p data-reveal class="m-0 text-xs uppercase tracking-[0.08em] lg:col-span-3">Selected teams</p>
        <div class="grid gap-px bg-black/15 lg:col-span-9 lg:grid-cols-3">
          <div v-for="entry in experienceEntries" :key="entry.id" data-reveal class="flex min-h-44 items-center justify-center bg-[var(--paper)] p-8">
            <img v-if="entry.logo" :src="entry.logo" :alt="entry.logoAlt" loading="lazy" class="max-h-12 max-w-36 object-contain grayscale" />
            <span v-else class="text-2xl">{{ entry.company }}</span>
          </div>
        </div>
      </div>

      <div class="mt-36 md:mt-52">
        <p data-reveal class="mb-8 text-xs uppercase tracking-[0.08em]">Values</p>
        <p
          v-for="(value, index) in values"
          :key="value"
          data-reveal
          class="value-line m-0 flex items-baseline justify-between border-t border-black/20 py-5 text-[clamp(3.4rem,9vw,10rem)] leading-[0.88] font-light tracking-[-0.065em] transition-[letter-spacing,color] duration-500 hover:tracking-[-0.045em] hover:text-black/55"
        >
          <span>{{ value }}</span>
          <span class="text-xs tracking-normal">0{{ index + 1 }}</span>
        </p>
      </div>
    </div>
  </section>
</template>
