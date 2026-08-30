<script setup lang="ts">
defineProps<{
  itemClass?: string
}>()

defineSlots<{
  default(): unknown
}>()
</script>

<template>
  <article
    class="scroll-stack-card relative my-8 w-full origin-top overflow-hidden rounded-[2rem] bg-transparent p-0 shadow-[0_18px_60px_rgba(0, 0, 0,0.12)]"
    :class="itemClass"
  >
    <slot />
  </article>
</template>

<style scoped>
.scroll-stack-card {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

@media (prefers-reduced-motion: no-preference) {
  .scroll-stack-card {
    will-change: transform, filter;
  }
}
</style>
