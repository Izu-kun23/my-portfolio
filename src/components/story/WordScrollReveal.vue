<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'

import { gsap } from '@/lib/gsap'

const props = defineProps<{
  text: string
}>()

const rootRef = useTemplateRef<HTMLElement>('rootRef')
let context: gsap.Context | undefined

onMounted(async () => {
  await nextTick()
  if (!rootRef.value) return

  context = gsap.context(() => {
    const words = gsap.utils.toArray<HTMLElement>('[data-reveal-word]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(words, { opacity: 1 })
      return
    }

    gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.value,
          start: 'top 72%',
          end: 'bottom 34%',
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      },
    )
  }, rootRef.value)
})

onUnmounted(() => context?.revert())
</script>

<template>
  <p ref="rootRef" class="m-0" :aria-label="text">
    <span
      v-for="(word, index) in text.split(' ')"
      :key="`${word}-${index}`"
      data-reveal-word
      aria-hidden="true"
      class="inline-block opacity-[0.14]"
    >{{ word }}<span>&nbsp;</span></span>
  </p>
</template>
