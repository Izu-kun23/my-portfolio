<script setup lang="ts">
import { useNavbar } from '@/composables/useNavbar'

const { isOpen, toggleMenu } = useNavbar()
</script>

<template>
  <button
    type="button"
    class="menu-button fixed top-[calc(1rem+env(safe-area-inset-top))] right-[calc(1rem+env(safe-area-inset-right))] z-50 flex size-12 cursor-pointer flex-col items-center justify-center gap-[0.35rem] rounded-full border border-gray-200 bg-white/90 p-0 shadow-sm backdrop-blur-sm transition-[background,box-shadow,transform] duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-md md:right-12 lg:right-20"
    :aria-expanded="isOpen"
    aria-controls="site-menu-sidebar"
    aria-label="Open menu"
    @click="toggleMenu"
  >
    <span
      class="block h-0.5 w-5 bg-gray-900 transition-transform duration-300"
      :class="{ 'translate-y-[0.45rem] rotate-45': isOpen }"
    />
    <span
      class="block h-0.5 w-5 bg-gray-900 transition-opacity duration-300"
      :class="{ 'opacity-0': isOpen }"
    />
    <span
      class="block h-0.5 w-5 bg-gray-900 transition-transform duration-300"
      :class="{ '-translate-y-[0.45rem] -rotate-45': isOpen }"
    />
  </button>
</template>
