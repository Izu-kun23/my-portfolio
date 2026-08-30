<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'

import { lenis } from '@/lib/lenis'

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

let cards: HTMLElement[] = []
let frameId = 0
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
  const endTop = layoutOffset(endRef.value)

  let topCardIndex = 0
  if (props.blurAmount > 0) {
    cards.forEach((card, index) => {
      const trigger = layoutOffset(card) - stackPosition - props.itemStackDistance * index
      if (scrollTop >= trigger) topCardIndex = index
    })
  }

  cards.forEach((card, index) => {
    const cardTop = layoutOffset(card)
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

onMounted(async () => {
  await nextTick()
  if (!rootRef.value) return

  cards = Array.from(rootRef.value.querySelectorAll<HTMLElement>('.scroll-stack-card'))
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  cards.forEach((card, index) => {
    const distance = prefersReducedMotion ? 24 : props.itemDistance
    card.style.marginBottom = index < cards.length - 1 ? `${distance}px` : '0px'
  })

  if (prefersReducedMotion) return

  lenis.on('scroll', scheduleUpdate)
  removeLenisListener = () => lenis.off('scroll', scheduleUpdate)
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)

  resizeObserver = new ResizeObserver(scheduleUpdate)
  resizeObserver.observe(rootRef.value)
  cards.forEach((card) => resizeObserver?.observe(card))
  scheduleUpdate()
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  removeLenisListener?.()
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  resizeObserver?.disconnect()
  cards.forEach((card) => {
    card.style.removeProperty('transform')
    card.style.removeProperty('filter')
    card.style.removeProperty('margin-bottom')
  })
  cards = []
})
</script>

<template>
  <div ref="rootRef" class="scroll-stack relative w-full overscroll-contain">
    <div class="scroll-stack-inner min-h-screen pt-[12vh] pb-[50rem] sm:pt-[16vh] motion-reduce:pt-8 motion-reduce:pb-12">
      <slot />
      <div ref="endRef" class="scroll-stack-end h-px w-full" aria-hidden="true" />
    </div>
  </div>
</template>
