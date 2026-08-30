<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import typewriterSoundUrl from '@/audio/kave_msri-typewriter-sound-effect-312919.mp3'

const targetText = 'I BUILD\nWHAT MOVES\nPEOPLE.'
const displayedText = shallowRef('')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTyping = computed(() => displayedText.value.length < targetText.length)
let startTimer: number | undefined
let typingTimer: number | undefined
let typewriterAudio: HTMLAudioElement | null = null

function stopSound() {
  if (!typewriterAudio) return
  typewriterAudio.pause()
  typewriterAudio.currentTime = 0
}

async function playSound() {
  if (!typewriterAudio || !isTyping.value) return
  try { await typewriterAudio.play() } catch { /* Browser autoplay policy: first interaction retries it. */ }
}

function unlockSound() {
  if (isTyping.value && typewriterAudio?.paused) void playSound()
}

function stopTyping() {
  if (startTimer !== undefined) window.clearTimeout(startTimer)
  if (typingTimer !== undefined) window.clearInterval(typingTimer)
  stopSound()
  startTimer = undefined
  typingTimer = undefined
}

function startTyping(delay = 0) {
  stopTyping()
  displayedText.value = ''
  startTimer = window.setTimeout(() => {
    void playSound()
    typingTimer = window.setInterval(() => {
      const character = targetText[displayedText.value.length] ?? ''
      displayedText.value += character
      if (!isTyping.value) stopTyping()
    }, 68)
  }, delay)
}

onMounted(() => {
  if (prefersReducedMotion) {
    displayedText.value = targetText
    return
  }
  typewriterAudio = new Audio(typewriterSoundUrl)
  typewriterAudio.preload = 'auto'
  typewriterAudio.volume = 0.42
  typewriterAudio.loop = true
  window.addEventListener('pointerdown', unlockSound, { once: true })
  window.addEventListener('keydown', unlockSound, { once: true })
  startTyping(2300)
})

onUnmounted(() => {
  stopTyping()
  window.removeEventListener('pointerdown', unlockSound)
  window.removeEventListener('keydown', unlockSound)
  typewriterAudio = null
})
</script>

<template>
  <section id="home" class="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
    <div class="mx-auto flex min-h-[100svh] max-w-[1800px] flex-col px-4 pt-24 pb-5 sm:px-7 lg:px-12">
      <div class="relative flex flex-1 items-center justify-center py-20">
        <h1 class="relative z-10 m-0 min-h-[2.28em] text-center text-[clamp(4.6rem,13vw,13.5rem)] leading-[0.76] font-medium tracking-[-0.085em] whitespace-pre-line uppercase" aria-label="I build what moves people.">{{ displayedText }}<span v-if="isTyping && !prefersReducedMotion" class="typing-cursor" aria-hidden="true" /></h1>
      </div>
      <div data-hero-meta class="relative z-20 grid gap-5 border-t border-white/25 pt-4 text-base leading-relaxed uppercase tracking-[0.06em] sm:grid-cols-3">
        <p class="m-0">Software engineer<br />Digital product builder</p>
        <p class="m-0 sm:text-center">Independent practice<br />Selected work 2024–2026</p>
        <div class="flex items-end justify-between gap-5 sm:justify-end"><a href="https://github.com/Izu-kun23" target="_blank" rel="noreferrer" class="editorial-link">Github</a><a href="#work" class="editorial-link">Scroll to work ↓</a></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.typing-cursor{display:inline-block;width:.055em;height:.74em;margin-left:.07em;background:currentColor;animation:typing-blink .62s steps(1,end) infinite}
@keyframes typing-blink{50%{opacity:0}}
@media(prefers-reduced-motion:reduce){.typing-cursor{display:none}}
</style>
