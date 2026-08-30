<script setup lang="ts">
import { contactDetails } from '@/data/contact'
import { socialLinks } from '@/data/socialLinks'
import { scrollToHash } from '@/composables/useHashScroll'
function backToTop(event: MouseEvent){event.preventDefault();scrollToHash('#home')}
</script>
<template>
  <footer class="overflow-hidden bg-[var(--ink)] px-4 pt-28 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[var(--paper)] sm:px-7 md:pt-40 lg:px-12">
    <div class="mx-auto max-w-[1800px]">
      <div class="grid gap-8 text-base font-medium uppercase tracking-[.07em] md:grid-cols-3"><p class="m-0">United Kingdom<br />Building worldwide</p><p class="m-0 md:text-center">Available for select projects</p><a :href="`mailto:${contactDetails.email}`" class="editorial-link md:ml-auto">Email me ↗</a></div>
      <a :href="`mailto:${contactDetails.email}`" class="group mt-28 block border-y border-white/25 py-8"><span class="block text-[clamp(4.1rem,12.7vw,13rem)] leading-[.73] tracking-[-.08em] uppercase transition-transform duration-700 group-hover:translate-x-[2vw]">Let's dream<br />together</span></a>
      <div class="grid gap-8 pt-6 text-base md:grid-cols-3"><p class="m-0">© 2026 Izuchukwu Tony</p><div class="flex gap-6 md:justify-center"><a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noreferrer" class="editorial-link">{{ link.label }}</a></div><a href="#home" class="editorial-link md:ml-auto" @click="backToTop">Back to top ↑</a></div>
      <p aria-hidden="true" class="mt-28 mb-[-.08em] text-[clamp(4rem,15vw,15rem)] leading-[.7] tracking-[-.085em] whitespace-nowrap">IZUCHUKWU</p>
    </div>
  </footer>
</template>
