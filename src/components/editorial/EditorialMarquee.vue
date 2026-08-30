<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  direction?: 'normal' | 'reverse'
}>(), {
  direction: 'normal',
})
</script>

<template>
  <section class="marquee-shell overflow-hidden border-y border-black/15 bg-[var(--paper)] py-5 md:py-8" aria-label="Decorative marquee">
    <div class="marquee-track flex w-max items-center" :class="direction === 'reverse' ? 'marquee-track--reverse' : ''" aria-hidden="true">
      <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <template v-for="index in 4" :key="index">
          <span class="px-5 text-[clamp(4rem,10vw,10rem)] leading-none font-light tracking-[-0.065em] whitespace-nowrap md:px-10">{{ text }}</span>
          <span class="size-2 shrink-0 rounded-full bg-black md:size-3" />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  animation: editorial-marquee 34s linear infinite;
}

.marquee-track--reverse {
  animation-direction: reverse;
}

.marquee-shell:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes editorial-marquee {
  to { transform: translate3d(-50%, 0, 0); }
}

@media (max-width: 767px) {
  .marquee-track { animation-duration: 24s; }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation-play-state: paused; }
}
</style>
