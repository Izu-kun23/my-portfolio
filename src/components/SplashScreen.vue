<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const progress = shallowRef(0)
const fullName = 'IZUCHUKWU'
const displayedName = shallowRef('')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTyping = computed(() => displayedName.value.length < fullName.length)

let progressTimer: number | undefined
let typingTimer: number | undefined
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
    displayedName.value = fullName
    finish()
    return
  }

  typingTimer = window.setInterval(() => {
    displayedName.value = fullName.slice(0, displayedName.value.length + 1)

    if (!isTyping.value) {
      window.clearInterval(typingTimer)
      typingTimer = undefined
    }
  }, 95)

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
  if (typingTimer !== undefined) window.clearInterval(typingTimer)
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
      <p
        class="splash-name m-0 text-[clamp(3rem,12vw,11rem)] leading-none font-bold tracking-[-0.065em] uppercase"
        aria-hidden="true"
      >
        <span class="splash-name__text">{{ displayedName }}</span><span
          v-if="isTyping"
          class="splash-name__cursor"
        />
        <sup
          v-if="!isTyping"
          class="ml-1 align-top text-[0.13em] leading-none tracking-normal text-white"
        >TM</sup>
      </p>
      <span class="sr-only">Izuchukwu trademark</span>
    </div>

    <div class="w-full" aria-hidden="true">
      <div class="mb-3 flex justify-between font-mono text-[0.6rem] tracking-[0.14em] text-white/45 uppercase sm:text-[0.68rem]">
        <span>Loading</span>
        <span>United Kingdom</span>
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

<style scoped>
.splash-name {
  min-width: min(91vw, 11ch);
  text-align: center;
}

.splash-name__text {
  color: transparent;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2.4' intercept='-.65'/%3E%3CfeFuncG type='linear' slope='2.4' intercept='-.65'/%3E%3CfeFuncB type='linear' slope='2.4' intercept='-.65'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
    linear-gradient(#fff, #fff);
  background-size: 90px 90px, auto;
  background-blend-mode: screen;
  background-clip: text;
  -webkit-background-clip: text;
}

.splash-name__cursor {
  display: inline-block;
  width: 0.055em;
  height: 0.78em;
  margin-left: 0.08em;
  background: #fff;
  animation: cursor-blink 600ms steps(1, end) infinite;
}

@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .splash-name__cursor {
    animation: none;
  }
}
</style>
