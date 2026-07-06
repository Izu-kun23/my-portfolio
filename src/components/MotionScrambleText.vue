<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

import { runMotionScrambleTextAnimation } from '@/composables/useMotionScrambleText'

const props = withDefaults(
  defineProps<{
    text: string
    play?: boolean
    holdDuration?: number
    revealDuration?: number
  }>(),
  {
    play: false,
    holdDuration: 0.35,
    revealDuration: 1.1,
  },
)

const textRef = useTemplateRef<HTMLElement>('textRef')
let stopScramble: (() => void) | null = null
let hasPlayed = false
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function reset() {
  stopScramble?.()
  stopScramble = null
  hasPlayed = false

  if (textRef.value) {
    textRef.value.textContent = props.text
  }
}

function startScramble() {
  const element = textRef.value
  if (!element || hasPlayed) return

  hasPlayed = true
  stopScramble?.()

  if (prefersReducedMotion) {
    element.textContent = props.text
    return
  }

  stopScramble = runMotionScrambleTextAnimation(element, props.text, {
    holdDuration: props.holdDuration,
    revealDuration: props.revealDuration,
  })
}

watch(
  () => props.play,
  (play) => {
    if (!play) {
      reset()
      return
    }

    startScramble()
  },
)

watch(
  () => props.text,
  (text) => {
    if (textRef.value) {
      textRef.value.textContent = text
    }
  },
)

onMounted(async () => {
  await nextTick()
  if (!props.play) {
    reset()
  } else {
    startScramble()
  }
})

onUnmounted(() => {
  stopScramble?.()
})
</script>

<template>
  <span ref="textRef" />
</template>
