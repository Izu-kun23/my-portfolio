<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

import { scrollToHash } from '@/composables/useHashScroll'
import { useNavbar } from '@/composables/useNavbar'

const { isOpen, links, collaborateLink, closeMenu } = useNavbar()
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

  closeMenu()
  scrollToHash(hash)
  router.push({ path: '/', hash })
  event.preventDefault()
}
</script>

<template>
  <Teleport to="body">
    <div
      id="site-menu-sidebar"
      class="fixed inset-0 z-[80] transition-opacity duration-300"
      :class="isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
      :aria-hidden="!isOpen"
    >
      <div
        class="absolute inset-0 bg-[#f4f4f1]"
        @click="closeMenu"
      />

      <div
        class="relative flex h-full w-full flex-col px-6 py-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-16 md:py-12 lg:px-24"
        @click.stop
      >
        <div class="flex items-center justify-between">
          <RouterLink
            to="/"
            class="inline-flex items-center font-bold tracking-wide text-inherit no-underline"
            aria-label="Izuchukwu TM"
            @click="closeMenu"
          >
            <span class="inline-block text-lg leading-none font-bold md:text-xl">
              IZUCHUKWU<span
                class="inline-block ml-[0.04em] -translate-y-[0.15em] align-super text-[0.34em] leading-none font-bold tracking-[-0.08em]"
                aria-hidden="true"
              >TM</span>
            </span>
          </RouterLink>

          <button
            type="button"
            class="flex size-12 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-transparent text-black transition-colors hover:bg-black/5"
            aria-label="Close menu"
            @click="closeMenu"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <nav class="flex flex-1 flex-col justify-center gap-2 md:gap-4">
          <RouterLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] font-semibold tracking-tight text-black no-underline transition-opacity hover:opacity-60 router-link-active:opacity-60"
            @click="handleNavClick(link.to, $event)"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <RouterLink
          :to="collaborateLink.to"
          class="inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3.5 text-base font-medium text-[#f4f4f1] no-underline transition-colors hover:bg-black/85 md:text-lg"
          @click="handleNavClick(collaborateLink.to, $event)"
        >
          <span>{{ collaborateLink.label }}</span>
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
      </div>
    </div>
  </Teleport>
</template>
