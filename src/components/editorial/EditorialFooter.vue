<script setup lang="ts">
import { socialLinks } from '@/data/socialLinks'
import { scrollToHash } from '@/composables/useHashScroll'

function backToTop(event: MouseEvent) {
  event.preventDefault()
  scrollToHash('#home')
}
</script>

<template>
  <footer class="overflow-hidden bg-[var(--ink)] px-5 pt-14 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[var(--paper)] sm:px-8 lg:px-14">
    <div class="mx-auto max-w-[1600px]">
      <div class="grid gap-10 border-t border-white/20 pt-5 text-sm md:grid-cols-3">
        <p class="m-0">© 2026 Izuchukwu Tony</p>
        <div class="flex gap-6 md:justify-center">
          <a v-for="social in socialLinks" :key="social.label" :href="social.href" target="_blank" rel="noreferrer" class="editorial-link">{{ social.label }}</a>
        </div>
        <a href="#home" class="editorial-link md:text-right" @click="backToTop">Back to top</a>
      </div>

      <p aria-hidden="true" class="mt-24 mb-[-0.07em] text-[clamp(4.3rem,15vw,15rem)] leading-[0.72] font-light tracking-[-0.085em] whitespace-nowrap">
        IZUCHUKWU
      </p>
    </div>
  </footer>
</template>
