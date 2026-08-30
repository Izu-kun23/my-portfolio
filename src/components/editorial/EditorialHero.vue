<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'

const targetText = 'I BUILD\nWHAT MOST\nPEOPLE.'
const displayedText = shallowRef('')
const soundEnabled = shallowRef(false)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTyping = computed(() => displayedText.value.length < targetText.length)
let startTimer: number | undefined
let typingTimer: number | undefined
let audioContext: AudioContext | null = null

function playKeyClick(character: string) {
  if (!soundEnabled.value || !character.trim() || !audioContext || audioContext.state !== 'running') return
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  oscillator.type = 'square'
  oscillator.frequency.value = 130 + Math.random() * 55
  gain.gain.setValueAtTime(0.025, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.025)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.03)
}

function stopTyping() {
  if (startTimer !== undefined) window.clearTimeout(startTimer)
  if (typingTimer !== undefined) window.clearInterval(typingTimer)
  startTimer = undefined
  typingTimer = undefined
}

function startTyping(delay = 0) {
  stopTyping()
  displayedText.value = ''
  startTimer = window.setTimeout(() => {
    typingTimer = window.setInterval(() => {
      const character = targetText[displayedText.value.length] ?? ''
      displayedText.value += character
      playKeyClick(character)
      if (!isTyping.value) stopTyping()
    }, 68)
  }, delay)
}

async function replayWithSound() {
  audioContext ??= new AudioContext()
  await audioContext.resume()
  soundEnabled.value = true
  startTyping(120)
}

onMounted(() => {
  if (prefersReducedMotion) displayedText.value = targetText
  else startTyping(2300)
})

onUnmounted(() => {
  stopTyping()
  void audioContext?.close()
})
</script>

<template>
  <section id="home" class="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
    <div class="mx-auto flex min-h-[100svh] max-w-[1800px] flex-col px-4 pt-24 pb-5 sm:px-7 lg:px-12">
      <div class="relative flex flex-1 items-center justify-center py-20">
        <h1 class="relative z-10 m-0 min-h-[2.28em] text-center text-[clamp(4.6rem,13vw,13.5rem)] leading-[0.76] font-medium tracking-[-0.085em] whitespace-pre-line uppercase" aria-label="I build what most people.">{{ displayedText }}<span v-if="isTyping && !prefersReducedMotion" class="typing-cursor" aria-hidden="true" /></h1>
      </div>
      <div data-hero-meta class="relative z-20 grid gap-5 border-t border-white/25 pt-4 text-base leading-relaxed uppercase tracking-[0.06em] sm:grid-cols-3">
        <p class="m-0">Software engineer<br />Digital product builder</p>
        <div class="sm:text-center"><button type="button" class="editorial-link min-h-11 uppercase" @click="replayWithSound">{{ soundEnabled ? 'Replay typing + sound' : 'Enable sound + replay' }}</button></div>
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
