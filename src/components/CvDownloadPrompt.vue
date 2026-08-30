<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'

import { scrollToHash } from '@/composables/useHashScroll'

const isOpen = shallowRef(false)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const usesTouchInput = window.matchMedia('(pointer: coarse)').matches
let revealTimer: number | undefined

function playChime() {
  if (prefersReducedMotion) return

  try {
    const audioContext = new window.AudioContext()
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

function goToContact(event: MouseEvent) {
  event.preventDefault()
  isOpen.value = false
  scrollToHash('#contact')
}

onMounted(() => {
  const revealDelay = prefersReducedMotion ? 500 : usesTouchInput ? 9000 : 6500
  revealTimer = window.setTimeout(openPrompt, revealDelay)
})

onUnmounted(() => {
  if (revealTimer !== undefined) window.clearTimeout(revealTimer)
})
</script>

<template>
  <aside
    class="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex items-end gap-3 sm:right-6 sm:bottom-6"
    aria-label="Contact prompt"
  >
    <Transition name="contact-prompt">
      <div
        v-if="isOpen"
        id="contact-prompt-panel"
        class="relative mb-2 w-[min(19rem,calc(100vw-6.5rem))] rounded-2xl border border-black/10 bg-[#f4f4f1] p-4 pr-10 text-black shadow-[0_16px_45px_rgba(0,0,0,0.18)] sm:w-80 sm:p-5 sm:pr-11"
      >
        <button
          type="button"
          aria-label="Close contact prompt"
          class="absolute top-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          @click="isOpen = false"
        >
          <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>

        <p class="m-0 text-base font-semibold tracking-tight sm:text-lg">
          Got a million dollar idea.
        </p>
        <a
          href="#contact"
          class="mt-2 inline-flex items-center gap-2 text-sm font-medium text-black/60 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-base"
          @click="goToContact"
        >
          Contact me!
          <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </a>
      </div>
    </Transition>

    <div class="relative shrink-0">
      <span class="absolute -top-0.5 -left-0.5 z-10 size-4 rounded-full border-2 border-[#f4f4f1] bg-[#3a3a3a]" aria-hidden="true" />
      <button
        type="button"
        aria-label="Open contact prompt"
        :aria-expanded="isOpen"
        aria-controls="contact-prompt-panel"
        class="inline-flex size-14 items-center justify-center rounded-full bg-[#3a3a3a] text-[#f4f4f1] shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-[transform,background-color] hover:scale-105 hover:bg-[#2f2f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:size-16"
        @click="togglePrompt"
      >
        <svg class="size-6 sm:size-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5.5h16v11H9l-5 3v-14Z" stroke="currentColor" stroke-width="1.5" />
          <path d="M8 9h8M8 12.5h5" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.contact-prompt-enter-active,
.contact-prompt-leave-active {
  transition:
    opacity 220ms ease,
    transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom right;
}

.contact-prompt-enter-from,
.contact-prompt-leave-to {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
  .contact-prompt-enter-active,
  .contact-prompt-leave-active {
    transition-duration: 0ms;
  }
}
</style>
