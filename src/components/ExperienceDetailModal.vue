<script setup lang="ts">
import { computed } from 'vue'

import { getCompanyInitials, type ExperienceEntry } from '@/data/about'

const props = defineProps<{
  entry: ExperienceEntry
  showBackFace: boolean
}>()

defineEmits<{
  close: []
}>()

const initials = computed(() => getCompanyInitials(props.entry.company))
</script>

<template>
  <div
    class="experience-modal-flip w-full"
    :class="showBackFace ? '' : 'h-full'"
    style="transform-style: preserve-3d"
  >
    <!-- Front face (list-row preview while flipping) -->
    <div
      class="experience-modal-flip__face experience-modal-flip__face--front absolute inset-0 flex items-center justify-between gap-8 overflow-hidden rounded-[1.75rem] border border-gray-800 bg-gray-900 px-6 lg:gap-12 lg:px-8"
      :style="{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }"
    >
      <div class="min-w-0">
        <span
          class="block text-[clamp(1.75rem,7vw,2.75rem)] leading-[1.1] font-semibold tracking-tight text-white"
        >
          {{ entry.company }}
        </span>
        <span class="mt-2 block text-[clamp(0.9375rem,3.2vw,1.125rem)] text-gray-500">
          {{ entry.role }}
        </span>
      </div>

      <span
        class="shrink-0 text-sm tracking-tight sm:text-base lg:text-lg"
        :class="entry.periodBold ? 'font-semibold text-white' : 'text-gray-500'"
      >
        {{ entry.period }}
      </span>
    </div>

    <!-- Back face (modal detail) — relative when active so content drives shell height -->
    <div
      class="experience-modal-flip__face experience-modal-flip__face--back overflow-hidden rounded-[1.75rem] border border-gray-700 bg-gray-900"
      :class="showBackFace ? 'relative w-full' : 'absolute inset-0'"
      :style="{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }"
    >
      <div
        v-if="showBackFace"
        class="flex min-h-[20rem] flex-col md:min-h-[22rem] md:flex-row"
      >
        <div
          class="flex shrink-0 items-center justify-center border-b border-gray-800 bg-gray-800/60 px-8 py-10 md:w-[min(36%,14rem)] md:border-r md:border-b-0 md:py-12"
        >
          <img
            v-if="entry.logo"
            :src="entry.logo"
            :alt="entry.logoAlt ?? `${entry.company} logo`"
            class="max-h-24 w-full max-w-[9rem] object-contain lg:max-h-28 lg:max-w-[10rem]"
            :class="entry.logoInvert ? 'brightness-0 invert' : ''"
          />
          <span v-else class="text-5xl font-bold tracking-tight text-gray-500 lg:text-6xl">
            {{ initials }}
          </span>
        </div>

        <div class="flex min-w-0 flex-1 flex-col px-6 py-7 md:px-9 md:py-10">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="m-0 font-mono text-[0.65rem] tracking-[0.18em] text-gray-500 uppercase"
                :class="entry.periodBold ? 'font-semibold text-gray-300' : ''"
              >
                {{ entry.period }} · {{ entry.role }}
              </p>
              <h3 class="m-0 mt-2 text-[clamp(1.5rem,5vw,2.25rem)] leading-[1.1] font-bold tracking-tight text-white uppercase">
                {{ entry.company }}
              </h3>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-700 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              aria-label="Close experience details"
              @click="$emit('close')"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-none stroke-current stroke-2">
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <p class="mt-4 mb-0 text-base leading-relaxed text-gray-400">
            {{ entry.summary }}
          </p>

          <ul class="mt-6 mb-0 flex list-none flex-col gap-3 p-0">
            <li
              v-for="highlight in entry.highlights"
              :key="highlight"
              class="flex items-start gap-3 text-base leading-relaxed text-gray-300"
            >
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden="true" />
              <span>{{ highlight }}</span>
            </li>
          </ul>

          <ul class="mt-6 flex list-none flex-wrap gap-2 p-0">
            <li
              v-for="tag in entry.tags"
              :key="tag"
              class="rounded-full border border-gray-700 px-3 py-1.5 text-sm text-gray-300"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experience-modal-flip {
  position: relative;
  transform-style: preserve-3d;
}

.experience-modal-flip__face {
  inset: 0;
}
</style>
