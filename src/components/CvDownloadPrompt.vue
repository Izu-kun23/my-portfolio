<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'

const isOpen = shallowRef(false)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let revealTimer: number | undefined

function playChime() {
  if (prefersReducedMotion) return

  try {
    const AudioContextClass = window.AudioContext
    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const now = audioContext.currentTime

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(620, now)
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.16)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.25)
    oscillator.addEventListener('ended', () => void audioContext.close(), { once: true })
  } catch {
    // Browsers may block sound until the visitor interacts with the page.
  }
}

function openPrompt() {
  isOpen.value = true
  playChime()
}

function togglePrompt() {
  if (!isOpen.value) playChime()
  isOpen.value = !isOpen.value
}

onMounted(() => {
  revealTimer = window.setTimeout(openPrompt, prefersReducedMotion ? 300 : 1400)
})

onUnmounted(() => {
  if (revealTimer !== undefined) window.clearTimeout(revealTimer)
})
</script>

<template>
  <aside
    class="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex items-end gap-3 sm:right-6 sm:bottom-6"
    aria-label="CV download"
  >
    <Transition name="cv-prompt">
      <div
        v-if="isOpen"
        id="cv-download-panel"
        class="relative mb-2 w-[min(18rem,calc(100vw-6.5rem))] rounded-2xl border border-black/10 bg-[#f4f4f1] p-4 pr-10 text-black shadow-[0_16px_45px_rgba(0,0,0,0.18)] sm:w-72 sm:p-5 sm:pr-11"
      >
        <button
          type="button"
          aria-label="Close CV prompt"
          class="absolute top-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          @click="isOpen = false"
        >
          <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>

        <p class="m-0 text-base font-semibold tracking-tight sm:text-lg">Want the full picture?</p>
        <a
          href="/Izuchukwu-CV.pdf"
          download
          class="mt-2 inline-flex items-center gap-2 text-sm font-medium text-black/60 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-base"
        >
          Download my CV
          <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v8m0 0 3-3m-3 3L5 7M3 13h10" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </a>
      </div>
    </Transition>

    <div class="relative shrink-0">
      <span class="absolute -top-0.5 -left-0.5 z-10 size-4 rounded-full border-2 border-[#f4f4f1] bg-black" aria-hidden="true" />
      <button
        type="button"
        aria-label="Open CV download"
        :aria-expanded="isOpen"
        aria-controls="cv-download-panel"
        class="inline-flex size-14 items-center justify-center rounded-full bg-black text-[#f4f4f1] shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:size-16"
        @click="togglePrompt"
      >
        <svg class="size-6 sm:size-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3.75h7l3 3V20.25H7V3.75Z" stroke="currentColor" stroke-width="1.5" />
          <path d="M14 3.75v3h3M9.5 11h5M9.5 14.5h5" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.cv-prompt-enter-active,
.cv-prompt-leave-active {
  transition:
    opacity 220ms ease,
    transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom right;
}

.cv-prompt-enter-from,
.cv-prompt-leave-to {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
  .cv-prompt-enter-active,
  .cv-prompt-leave-active {
    transition-duration: 0ms;
  }
}
</style>
