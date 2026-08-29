<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const progress = shallowRef(0)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let progressTimer: number | undefined
let completionTimer: number | undefined
let previousOverflow = ''

function finish() {
  progress.value = 100
  completionTimer = window.setTimeout(() => emit('complete'), prefersReducedMotion ? 100 : 350)
}

onMounted(() => {
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'

  if (prefersReducedMotion) {
    finish()
    return
  }

  progressTimer = window.setInterval(() => {
    const remaining = 100 - progress.value
    const increment = Math.max(1, Math.ceil(remaining * 0.12))
    progress.value = Math.min(94, progress.value + increment)

    if (progress.value >= 94) {
      window.clearInterval(progressTimer)
      progressTimer = undefined
      completionTimer = window.setTimeout(finish, 320)
    }
  }, 85)
})

onUnmounted(() => {
  if (progressTimer !== undefined) window.clearInterval(progressTimer)
  if (completionTimer !== undefined) window.clearTimeout(completionTimer)
  document.documentElement.style.overflow = previousOverflow
})
</script>

<template>
  <div
    class="fixed inset-0 z-[60] flex min-h-dvh flex-col overflow-hidden bg-black px-4 py-5 text-white sm:px-6 sm:py-7 md:px-12 lg:px-20"
    role="status"
    aria-live="polite"
    aria-label="Loading portfolio"
  >
    <div class="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.16em] text-white/50 uppercase sm:text-xs">
      <span>Portfolio</span>
      <span>{{ progress.toString().padStart(3, '0') }}%</span>
    </div>

    <div class="flex flex-1 items-center justify-center">
      <p class="m-0 text-[clamp(3rem,12vw,11rem)] leading-none font-bold tracking-[-0.065em] uppercase">
        Izuchukwu<sup class="ml-1 align-top text-[0.13em] leading-none tracking-normal">TM</sup>
      </p>
    </div>

    <div class="w-full" aria-hidden="true">
      <div class="mb-3 flex justify-between font-mono text-[0.6rem] tracking-[0.14em] text-white/45 uppercase sm:text-[0.68rem]">
        <span>Loading</span>
        <span>Manchester, UK</span>
      </div>
      <div class="h-px w-full bg-white/20">
        <div
          class="h-full bg-white transition-[width] duration-150 ease-out motion-reduce:transition-none"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>
