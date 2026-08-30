<script setup lang="ts">
import { onUnmounted, shallowRef } from 'vue'
import { scrollToHash } from '@/composables/useHashScroll'
import { socialLinks } from '@/data/socialLinks'
import { lenis } from '@/lib/lenis'

const isOpen = shallowRef(false)
const links = [{ label: 'Projects', href: '#work' },{ label: 'About', href: '#about' },{ label: 'Capabilities', href: '#capabilities' },{ label: 'Contact', href: '#contact' }]
function setMenu(open: boolean) { isOpen.value = open; document.documentElement.classList.toggle('menu-open', open); open ? lenis.stop() : lenis.start() }
function navigate(event: MouseEvent, href: string) { event.preventDefault(); setMenu(false); scrollToHash(href) }
onUnmounted(() => setMenu(false))
</script>

<template>
  <header data-hero-nav class="fixed inset-x-0 top-0 z-50 text-[var(--paper)] mix-blend-difference">
    <nav class="mx-auto grid h-20 max-w-[1800px] grid-cols-2 items-center px-4 text-sm font-medium uppercase tracking-[0.08em] sm:px-7 md:grid-cols-3 lg:px-12" aria-label="Primary navigation">
      <a href="#home" @click="navigate($event, '#home')">United Kingdom<br />Based</a>
      <a href="#home" class="hidden text-center md:block" @click="navigate($event, '#home')">Izuchukwu Tony ©2026</a>
      <button type="button" class="ml-auto flex min-h-11 items-center gap-3" :aria-expanded="isOpen" aria-controls="site-menu" @click="setMenu(!isOpen)">
        <span>{{ isOpen ? 'Close' : 'Menu' }}</span><span class="text-lg leading-none transition-transform duration-500" :class="isOpen ? 'rotate-45' : ''">+</span>
      </button>
    </nav>
  </header>
  <Transition name="menu-panel">
    <div v-if="isOpen" id="site-menu" class="fixed inset-0 z-40 flex min-h-dvh flex-col bg-[var(--ink)] px-4 pt-28 pb-8 text-[var(--paper)] sm:px-7 lg:px-12">
      <nav class="my-auto" aria-label="Menu navigation">
        <a v-for="(link,index) in links" :key="link.href" :href="link.href" class="menu-link group flex items-center justify-between overflow-hidden border-t border-white/25 py-2 text-[clamp(3.6rem,10vw,9rem)] leading-none tracking-[-0.065em]" :style="{ '--i': index }" @click="navigate($event, link.href)">
          <span>{{ link.label }}</span><span class="translate-x-8 text-[.45em] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">↗</span>
        </a>
      </nav>
      <div class="flex flex-wrap gap-6 border-t border-white/25 pt-4 text-base uppercase">
        <a v-for="social in socialLinks" :key="social.label" :href="social.href" target="_blank" rel="noreferrer">{{ social.label }}</a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.menu-panel-enter-active,.menu-panel-leave-active{transition:clip-path .7s cubic-bezier(.76,0,.24,1)}
.menu-panel-enter-from,.menu-panel-leave-to{clip-path:inset(0 0 100% 0)}
.menu-panel-enter-to,.menu-panel-leave-from{clip-path:inset(0)}
.menu-panel-enter-active .menu-link{animation:menu-in .75s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--i)*70ms + 180ms)}
@keyframes menu-in{from{transform:translateY(70px);opacity:0}to{transform:none;opacity:1}}
</style>
