<script setup lang="ts">
import { useTemplateRef } from 'vue'

import type { ExperienceEntry } from '@/data/about'

const props = defineProps<{
  entry: ExperienceEntry
  disabled?: boolean
}>()

const emit = defineEmits<{
  open: [entry: ExperienceEntry, element: HTMLElement]
}>()

const rowRef = useTemplateRef<HTMLElement>('rowRef')

defineExpose({ rowRef })

function handleOpen() {
  if (props.disabled || !rowRef.value) return
  emit('open', props.entry, rowRef.value)
}
</script>

<template>
  <button
    ref="rowRef"
    type="button"
    class="group flex w-full items-center justify-between gap-6 py-9 text-left transition-colors duration-300 hover:bg-white/[0.02] sm:gap-8 sm:py-10 lg:py-12"
    :class="disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'"
    :aria-label="`View ${entry.company} experience details`"
    @click="handleOpen"
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
      :class="
        entry.periodBold
          ? 'font-semibold text-white'
          : 'text-gray-500 transition-colors duration-300 group-hover:text-gray-300'
      "
    >
      {{ entry.period }}
    </span>
  </button>
</template>
