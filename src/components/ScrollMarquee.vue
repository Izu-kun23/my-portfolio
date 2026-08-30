<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'

import { gsap } from '@/lib/gsap'
import { prefersTouchInteraction } from '@/lib/scrollMode'

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const firstRowRef = useTemplateRef<HTMLElement>('firstRowRef')
const secondRowRef = useTemplateRef<HTMLElement>('secondRowRef')
let context: gsap.Context | undefined

onMounted(async () => {
  await nextTick()
  if (!rootRef.value || !firstRowRef.value || !secondRowRef.value) return

  if (prefersTouchInteraction()) return

  context = gsap.context(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(firstRowRef.value, { xPercent: 5 }, {
      xPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: rootRef.value, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    })
    gsap.fromTo(secondRowRef.value, { xPercent: -18 }, {
      xPercent: 5,
      ease: 'none',
      scrollTrigger: { trigger: rootRef.value, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    })
  }, rootRef.value)
})

onUnmounted(() => context?.revert())
</script>

<template>
  <section ref="rootRef" class="relative z-[2] overflow-hidden bg-[#f4f4f1] py-16 text-[#000000] sm:py-20">
    <div class="flex w-max whitespace-nowrap" ref="firstRowRef" aria-hidden="true">
      <span v-for="index in 4" :key="index" class="pr-[0.35em] text-[clamp(4rem,12vw,10rem)] leading-[0.78] font-semibold tracking-[-0.07em] uppercase">
        Selected work —
      </span>
    </div>
    <div class="mt-5 flex w-max whitespace-nowrap text-[#737373]" ref="secondRowRef" aria-hidden="true">
      <span v-for="index in 4" :key="index" class="pr-[0.35em] text-[clamp(4rem,12vw,10rem)] leading-[0.78] font-semibold tracking-[-0.07em] uppercase">
        Built with purpose —
      </span>
    </div>
    <h2 class="sr-only">Selected work</h2>
  </section>
</template>
