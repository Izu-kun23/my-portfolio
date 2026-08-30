import { nextTick, onMounted, onUnmounted, type ShallowRef } from 'vue'

import { gsap, ScrollTrigger } from '@/lib/gsap'

interface ExperienceHorizontalStackOptions {
  triggerRef: Readonly<ShallowRef<HTMLElement | null>>
  cardRefs: Readonly<ShallowRef<(HTMLElement | null)[] | null>>
  counterRef: Readonly<ShallowRef<HTMLElement | null>>
  progressRef: Readonly<ShallowRef<HTMLElement | null>>
}

export function useExperienceHorizontalStack({ triggerRef, cardRefs, counterRef, progressRef }: ExperienceHorizontalStackOptions) {
  let context: gsap.Context | undefined
  let cancelled = false

  onMounted(async () => {
    await nextTick()
    if (cancelled || !triggerRef.value) return
    const cards = (cardRefs.value ?? []).filter((card): card is HTMLElement => card instanceof HTMLElement)
    if (cards.length < 2) return

    context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(cards[0]!, { xPercent: 0 })
        gsap.set(cards.slice(1), { xPercent: 120 })
        const trigger = ScrollTrigger.create({
          trigger: triggerRef.value,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const scaledProgress = self.progress * (cards.length - 1)
            cards.forEach((card, index) => {
              if (index === 0) return
              const cardProgress = gsap.utils.clamp(0, 1, scaledProgress - (index - 1))
              gsap.set(card, { xPercent: (1 - cardProgress) * 120 })
            })
            if (progressRef.value) gsap.set(progressRef.value, { scaleX: self.progress })
            if (counterRef.value) {
              counterRef.value.textContent = String(Math.min(cards.length - 1, Math.round(scaledProgress)) + 1).padStart(2, '0')
            }
          },
        })
        return () => trigger.kill()
      })
    }, triggerRef.value)
    ScrollTrigger.refresh()
  })

  onUnmounted(() => {
    cancelled = true
    context?.revert()
  })
}
