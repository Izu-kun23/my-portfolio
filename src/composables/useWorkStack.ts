import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useWorkStack(stackRef: Ref<HTMLElement | null>) {
  let context: gsap.Context | null = null
  const imageLoaders: Array<{ image: HTMLImageElement; onLoad: () => void }> = []

  onMounted(async () => {
    await nextTick()
    const stack = stackRef.value
    if (!stack) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(stack.querySelectorAll<HTMLElement>('[data-work-card]'))
    if (cards.length < 2) return

    context = gsap.context(() => {
      cards.forEach((card, index) => {
        const next = cards[index + 1]
        const inner = card.querySelector<HTMLElement>('[data-work-card-inner]')
        if (!next || !inner) return

        gsap.fromTo(
          inner,
          { scale: 1 },
          {
            scale: 0.92,
            ease: 'none',
            transformOrigin: '50% 0%',
            immediateRender: false,
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: () => `top ${5.5 + (index + 1) * 0.55}rem`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    }, stack)

    const images = Array.from(stack.querySelectorAll('img'))
    let pending = images.filter((image) => !image.complete).length
    if (pending === 0) {
      ScrollTrigger.refresh()
      return
    }

    images.forEach((image) => {
      if (image.complete) return
      const onLoad = () => {
        pending -= 1
        if (pending <= 0) ScrollTrigger.refresh()
      }
      image.addEventListener('load', onLoad, { once: true })
      imageLoaders.push({ image, onLoad })
    })
  })

  onUnmounted(() => {
    imageLoaders.forEach(({ image, onLoad }) => {
      image.removeEventListener('load', onLoad)
    })
    imageLoaders.length = 0
    context?.revert()
    context = null
  })
}
