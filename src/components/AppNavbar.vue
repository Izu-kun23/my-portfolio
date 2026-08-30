<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

import { scrollToHash } from '@/composables/useHashScroll'
import { useNavbar } from '@/composables/useNavbar'

const { links, collaborateLink, toggleMenu, isOpen } = useNavbar()
const router = useRouter()

function getHash(to: RouteLocationRaw): string {
  if (typeof to === 'string') {
    const hashIndex = to.indexOf('#')
    return hashIndex >= 0 ? to.slice(hashIndex) : ''
  }
  return to.hash ?? ''
}

function handleNavClick(to: RouteLocationRaw, event: MouseEvent) {
  const hash = getHash(to)
  if (!hash) return

  scrollToHash(hash)
  router.push({ path: '/', hash })
  event.preventDefault()
}
</script>

<template>
  <header
    class="relative z-10 h-[4.5rem] shrink-0 border-b border-transparent bg-[#f4f4f1]/70 pt-[env(safe-area-inset-top)] backdrop-blur-[10px]"
  >
    <div
      class="relative flex h-full w-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 md:px-12 lg:px-20"
    >
      <RouterLink
        to="/"
        class="inline-flex items-center font-bold tracking-wide text-inherit no-underline"
        aria-label="Izuchukwu TM"
      >
        <span class="inline-block leading-none font-bold">
          IZUCHUKWU<span
            class="inline-block ml-[0.04em] -translate-y-[0.15em] align-super text-[0.34em] leading-none font-bold tracking-[-0.08em]"
            aria-hidden="true"
          >TM</span>
        </span>
      </RouterLink>

      <button
        type="button"
          class="mobile-menu-button ml-auto flex size-12 shrink-0 cursor-pointer flex-col items-center justify-center gap-[0.35rem] rounded-full border border-black/15 bg-[#f4f4f1]/90 p-0 shadow-sm backdrop-blur-sm transition-[background,box-shadow,transform] duration-200 hover:scale-[1.02] hover:bg-[#f4f4f1] hover:shadow-md lg:hidden"
        :aria-expanded="isOpen"
        aria-controls="site-menu-sidebar"
        aria-label="Open menu"
        @click="toggleMenu"
      >
        <span
          class="block h-0.5 w-5 bg-black transition-transform duration-300"
          :class="{ 'translate-y-[0.45rem] rotate-45': isOpen }"
        />
        <span
          class="block h-0.5 w-5 bg-black transition-opacity duration-300"
          :class="{ 'opacity-0': isOpen }"
        />
        <span
          class="block h-0.5 w-5 bg-black transition-transform duration-300"
          :class="{ '-translate-y-[0.45rem] -rotate-45': isOpen }"
        />
      </button>

      <nav class="ml-auto hidden items-center justify-end gap-6 lg:flex xl:gap-11">
        <RouterLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="text-[0.875rem] text-black/70 no-underline transition-colors hover:text-black router-link-active:text-black xl:text-[0.95rem]"
          @click="handleNavClick(link.to, $event)"
        >
          {{ link.label }}
        </RouterLink>

        <RouterLink
          :to="collaborateLink.to"
          class="ml-2 inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-4 py-2.5 text-[0.875rem] font-medium text-[#f4f4f1] no-underline transition-colors hover:bg-black/85 xl:px-5 xl:text-[0.95rem]"
          @click="handleNavClick(collaborateLink.to, $event)"
        >
          <span class="hidden xl:inline">{{ collaborateLink.label }}</span>
          <span class="xl:hidden">Collaborate</span>
          <svg
            class="shrink-0"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
