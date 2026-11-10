<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import heroBackgroundUrl from '@/assets/minimalist.jpeg'
import { useHeroCurtain } from '@/composables/useHeroCurtain'

const heroLines = [
  'HI, MY NAME\nIS IZUCHUKWU\nTONY',
  'I AM A\nSOFTWARE\nENGINEER',
  'I BUILD\nWHAT MOVES\nPEOPLE.',
] as const

const fullHeroCopy =
  'Hi, my name is Izuchukwu Tony. I am a software engineer. I build what moves people.'
const displayedText = shallowRef('')
const lineIndex = shallowRef(0)
const isFadingOut = shallowRef(false)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTyping = computed(() => {
  const current = heroLines[lineIndex.value]
  return current !== undefined && displayedText.value.length < current.length
})

let startTimer: number | undefined
let typingTimer: number | undefined
let holdTimer: number | undefined
let fadeTimer: number | undefined
let splashObserver: MutationObserver | undefined

const heroRef = useTemplateRef<HTMLElement>('heroRef')
const curtainRef = useTemplateRef<HTMLElement>('curtainRef')

useHeroCurtain(heroRef, curtainRef)

function clearTimers() {
  if (startTimer !== undefined) window.clearTimeout(startTimer)
  if (typingTimer !== undefined) window.clearInterval(typingTimer)
  if (holdTimer !== undefined) window.clearTimeout(holdTimer)
  if (fadeTimer !== undefined) window.clearTimeout(fadeTimer)
  startTimer = undefined
  typingTimer = undefined
  holdTimer = undefined
  fadeTimer = undefined
}

function findSplashOverlay() {
  return document.querySelector<HTMLElement>('[aria-modal="true"][role="dialog"]')
}

function whenSplashGone(callback: () => void) {
  const splash = findSplashOverlay()
  if (!splash) {
    callback()
    return
  }

  splashObserver = new MutationObserver(() => {
    if (!document.contains(splash)) {
      splashObserver?.disconnect()
      splashObserver = undefined
      callback()
    }
  })
  splashObserver.observe(document.body, { childList: true, subtree: true })
}

function typeCurrentLine() {
  const current = heroLines[lineIndex.value]
  if (!current) return

  displayedText.value = ''
  isFadingOut.value = false

  typingTimer = window.setInterval(() => {
    const nextChar = current[displayedText.value.length] ?? ''
    displayedText.value += nextChar

    if (displayedText.value.length >= current.length) {
      if (typingTimer !== undefined) window.clearInterval(typingTimer)
      typingTimer = undefined

      const isLastLine = lineIndex.value >= heroLines.length - 1
      if (isLastLine) return

      holdTimer = window.setTimeout(() => {
        isFadingOut.value = true
        fadeTimer = window.setTimeout(() => {
          lineIndex.value += 1
          typeCurrentLine()
        }, 420)
      }, 1600)
    }
  }, 58)
}

function startSequence(delay = 0) {
  clearTimers()
  lineIndex.value = 0
  displayedText.value = ''
  isFadingOut.value = false
  startTimer = window.setTimeout(() => {
    typeCurrentLine()
  }, delay)
}

onMounted(() => {
  if (prefersReducedMotion) {
    displayedText.value = heroLines[heroLines.length - 1] ?? ''
    return
  }

  whenSplashGone(() => {
    startSequence(450)
  })
})

onUnmounted(() => {
  clearTimers()
  splashObserver?.disconnect()
  splashObserver = undefined
})
</script>

<template>
  <section ref="heroRef" id="home" class="hero relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
    <img
      :src="heroBackgroundUrl"
      alt=""
      aria-hidden="true"
      class="hero-background absolute inset-0 h-full w-full object-cover"
      fetchpriority="high"
    />
    <div ref="curtainRef" class="hero-curtain pointer-events-none absolute inset-0 z-[1] bg-black" aria-hidden="true" />
    <div class="hero-overlay pointer-events-none absolute inset-0 z-[2] bg-black/45" aria-hidden="true" />
    <div class="hero-grain pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />

    <div class="relative z-10 mx-auto flex min-h-[100svh] max-w-[1800px] flex-col px-4 pt-24 pb-5 sm:px-7 lg:px-12">
      <div class="relative flex flex-1 items-center justify-center py-20">
        <h1
          class="relative z-10 m-0 min-h-[2.28em] w-full text-center text-[clamp(2.85rem,10.5vw,12rem)] leading-[0.76] font-medium tracking-[-0.085em] whitespace-pre-line uppercase"
          :aria-label="fullHeroCopy"
        >
          <span
            class="hero-line inline-block"
            :class="{ 'hero-line--out': isFadingOut }"
            aria-hidden="true"
          >{{ displayedText }}<span v-if="isTyping && !prefersReducedMotion" class="typing-cursor" aria-hidden="true" /></span>
        </h1>
      </div>
      <div data-hero-meta class="relative z-20 grid gap-5 border-t border-white/25 pt-4 text-base leading-relaxed uppercase tracking-[0.06em] sm:grid-cols-3">
        <p class="m-0">Freelancer<br />Digital product builder</p>
        <p class="m-0 sm:text-center">Software Engineer</p>
        <div class="flex items-end justify-between gap-5 sm:justify-end"><a href="https://github.com/Izu-kun23" target="_blank" rel="noreferrer" class="editorial-link">Github</a><a href="#work" class="editorial-link">Scroll to work ↓</a></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-background{filter:grayscale(1);transform:scale(1.01)}
.hero-curtain{will-change:transform;transform:translate3d(100%,0,0)}
.hero-grain{
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.35' numOctaves='5' seed='31' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 .18 .42 .7 1'/%3E%3CfeFuncG type='discrete' tableValues='0 .18 .42 .7 1'/%3E%3CfeFuncB type='discrete' tableValues='0 .18 .42 .7 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat:repeat;
  background-size:48px 48px;
  mix-blend-mode:screen;
  opacity:.23;
}
.hero-line{
  opacity:1;
  transform:translate3d(0,0,0);
  transition:opacity .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1);
}
.hero-line--out{
  opacity:0;
  transform:translate3d(0,-0.18em,0);
}
.typing-cursor{display:inline-block;width:.055em;height:.74em;margin-left:.07em;background:currentColor;animation:typing-blink .62s steps(1,end) infinite;vertical-align:-0.05em}
@keyframes typing-blink{50%{opacity:0}}
@media(prefers-reduced-motion:reduce){
  .hero-curtain{display:none}
  .typing-cursor{display:none}
  .hero-line,.hero-line--out{opacity:1;transform:none;transition:none}
}
</style>
