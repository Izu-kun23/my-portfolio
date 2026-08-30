<script setup lang="ts">
import { onUnmounted, shallowRef } from 'vue'

import { scrollToHash } from '@/composables/useHashScroll'
import { socialLinks } from '@/data/socialLinks'
import { lenis } from '@/lib/lenis'

const isOpen = shallowRef(false)

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: "Let's talk", href: '#contact' },
]

function setMenu(open: boolean) {
  isOpen.value = open
  document.documentElement.classList.toggle('menu-open', open)
  if (open) lenis.stop()
  else lenis.start()
}

function navigate(event: MouseEvent, href: string) {
  event.preventDefault()
  setMenu(false)
  scrollToHash(href)
}

onUnmounted(() => setMenu(false))
</script>

<template>
  <header data-hero-nav class="fixed inset-x-0 top-0 z-40 text-[var(--paper)] mix-blend-difference">
    <nav class="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-14" aria-label="Primary navigation">
      <a href="#home" class="text-sm font-medium tracking-[-0.02em]" @click="navigate($event, '#home')">
        Izuchukwu Tony
      </a>

      <div class="hidden items-center gap-8 text-xs md:flex">
        <a
          v-for="link in links.slice(1)"
          :key="link.href"
          :href="link.href"
          class="editorial-link"
          @click="navigate($event, link.href)"
        >
          {{ link.label }}
        </a>
      </div>

      <button
        type="button"
        class="inline-flex min-h-11 min-w-11 items-center justify-end text-xs md:hidden"
        :aria-expanded="isOpen"
        aria-controls="mobile-menu"
        @click="setMenu(!isOpen)"
      >
        {{ isOpen ? 'Close' : 'Menu' }}
      </button>
    </nav>
  </header>

  <Transition name="editorial-menu">
    <div
      v-if="isOpen"
      id="mobile-menu"
      class="fixed inset-0 z-30 flex min-h-dvh flex-col bg-[var(--ink)] px-5 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] text-[var(--paper)] md:hidden"
    >
      <nav class="mt-auto" aria-label="Mobile navigation">
        <a
          v-for="(link, index) in links"
          :key="link.href"
          :href="link.href"
          class="mobile-menu-link block overflow-hidden border-t border-white/20 py-3 text-[clamp(3.25rem,16vw,5.5rem)] leading-none tracking-[-0.06em]"
          :style="{ '--menu-index': index }"
          @click="navigate($event, link.href)"
        >
          <span class="block">{{ link.label }}</span>
        </a>
      </nav>

      <div class="mt-12 flex gap-6 border-t border-white/20 pt-5 text-sm">
        <a v-for="social in socialLinks" :key="social.label" :href="social.href" target="_blank" rel="noreferrer" class="editorial-link">
          {{ social.label }}
        </a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.editorial-menu-enter-active,
.editorial-menu-leave-active {
  transition: opacity 420ms cubic-bezier(.22, 1, .36, 1);
}

.editorial-menu-enter-active .mobile-menu-link span {
  animation: menu-link-in 600ms cubic-bezier(.22, 1, .36, 1) both;
  animation-delay: calc(var(--menu-index) * 70ms + 80ms);
}

.editorial-menu-enter-from,
.editorial-menu-leave-to {
  opacity: 0;
}

@keyframes menu-link-in {
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
}
</style>
