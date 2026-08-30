<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'

import { lenis } from '@/lib/lenis'
import { prefersTouchInteraction } from '@/lib/scrollMode'

interface ScrollStackProps {
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string | number
  scaleEndPosition?: string | number
  baseScale?: number
  rotationAmount?: number
  blurAmount?: number
}

const props = withDefaults(defineProps<ScrollStackProps>(), {
  itemDistance: 100,
  itemScale: 0.03,
  itemStackDistance: 30,
  stackPosition: '20%',
  scaleEndPosition: '10%',
  baseScale: 0.85,
  rotationAmount: 0,
  blurAmount: 0,
})

defineSlots<{
  default(): unknown
}>()

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const endRef = useTemplateRef<HTMLElement>('endRef')
const useNativeFlow = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const useCssStack = prefersTouchInteraction() && !useNativeFlow

let cards: HTMLElement[] = []
let cardTops: number[] = []
let endTop = 0
let frameId = 0
let measurementFrameId = 0
let resizeObserver: ResizeObserver | null = null
let removeLenisListener: (() => void) | null = null

function parsePosition(value: string | number, viewportHeight: number): number {
  if (typeof value === 'string' && value.includes('%')) {
    return (Number.parseFloat(value) / 100) * viewportHeight
  }
  return Number.parseFloat(String(value))
}

function clampProgress(scrollTop: number, start: number, end: number): number {
  if (scrollTop <= start) return 0
  if (scrollTop >= end) return 1
  return (scrollTop - start) / Math.max(1, end - start)
}

function layoutOffset(element: HTMLElement): number {
  let offset = 0
  let current: HTMLElement | null = element
  while (current) {
    offset += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return offset
}

function updateCardTransforms() {
  frameId = 0
  if (cards.length === 0 || !endRef.value) return

  const scrollTop = window.scrollY
  const viewportHeight = window.innerHeight
  const stackPosition = parsePosition(props.stackPosition, viewportHeight)
  const scaleEndPosition = parsePosition(props.scaleEndPosition, viewportHeight)

  let topCardIndex = 0
  if (props.blurAmount > 0) {
    cards.forEach((card, index) => {
      const trigger = cardTops[index]! - stackPosition - props.itemStackDistance * index
      if (scrollTop >= trigger) topCardIndex = index
    })
  }

  cards.forEach((card, index) => {
    const cardTop = cardTops[index]!
    const pinStart = cardTop - stackPosition - props.itemStackDistance * index
    const scaleEnd = cardTop - scaleEndPosition
    const pinEnd = endTop - viewportHeight / 2
    const progress = clampProgress(scrollTop, pinStart, scaleEnd)
    const targetScale = props.baseScale + index * props.itemScale
    const scale = 1 - progress * (1 - targetScale)
    const rotation = props.rotationAmount * index * progress

    let translateY = 0
    if (scrollTop >= pinStart && scrollTop <= pinEnd) {
      translateY = scrollTop - cardTop + stackPosition + props.itemStackDistance * index
    } else if (scrollTop > pinEnd) {
      translateY = pinEnd - cardTop + stackPosition + props.itemStackDistance * index
    }

    const depth = Math.max(0, topCardIndex - index)
    const blur = props.blurAmount > 0 ? depth * props.blurAmount : 0

    card.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotation.toFixed(2)}deg)`
    card.style.filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : ''
  })
}

function scheduleUpdate() {
  if (frameId) return
  frameId = requestAnimationFrame(updateCardTransforms)
}

function refreshMeasurements() {
  measurementFrameId = 0
  if (!endRef.value) return

  // Read all layout values together, then update transforms on the next pass.
  // This avoids alternating layout reads and writes for every card while scrolling.
  cardTops = cards.map(layoutOffset)
  endTop = layoutOffset(endRef.value)
  scheduleUpdate()
}

function scheduleMeasurements() {
  cancelAnimationFrame(measurementFrameId)
  measurementFrameId = requestAnimationFrame(refreshMeasurements)
}

onMounted(async () => {
  await nextTick()
  if (!rootRef.value) return

  cards = Array.from(rootRef.value.querySelectorAll<HTMLElement>('.scroll-stack-card'))
  cards.forEach((card, index) => {
    const distance = useNativeFlow ? 24 : useCssStack ? 72 : props.itemDistance
    card.style.marginBottom = index < cards.length - 1 ? `${distance}px` : '0px'
    if (useCssStack) card.style.setProperty('--stack-index', String(index))
  })

  if (useNativeFlow || useCssStack) return

  lenis.on('scroll', scheduleUpdate)
  removeLenisListener = () => lenis.off('scroll', scheduleUpdate)
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleMeasurements)

  resizeObserver = new ResizeObserver(scheduleMeasurements)
  resizeObserver.observe(rootRef.value)
  cards.forEach((card) => resizeObserver?.observe(card))
  refreshMeasurements()
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  cancelAnimationFrame(measurementFrameId)
  removeLenisListener?.()
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleMeasurements)
  resizeObserver?.disconnect()
  cards.forEach((card) => {
    card.style.removeProperty('transform')
    card.style.removeProperty('filter')
    card.style.removeProperty('margin-bottom')
    card.style.removeProperty('--stack-index')
  })
  cards = []
  cardTops = []
})
</script>

<template>
  <div ref="rootRef" class="scroll-stack relative w-full overscroll-contain">
    <div
      class="scroll-stack-inner min-h-screen"
      :class="
        useNativeFlow
          ? 'pt-4 pb-24'
          : useCssStack
            ? 'pt-[8svh] pb-[28svh]'
            : 'pt-[12vh] pb-[40rem] md:pt-[16vh] md:pb-[50rem]'
      "
    >
      <slot />
      <div ref="endRef" class="scroll-stack-end h-px w-full" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
@media (pointer: coarse) and (prefers-reduced-motion: no-preference) {
  .scroll-stack :deep(.scroll-stack-card) {
    position: sticky;
    top: calc(10svh + var(--stack-index, 0) * 0.75rem);
  }
}
</style>
