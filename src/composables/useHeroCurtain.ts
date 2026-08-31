import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

import { gsap } from '@/lib/gsap'

export function useHeroCurtain(
  heroRef: Ref<HTMLElement | null>,
  curtainRef: Ref<HTMLElement | null>,
) {
  let context: gsap.Context | null = null

  onMounted(async () => {
    await nextTick()

    const hero = heroRef.value
    const curtain = curtainRef.value
    if (!hero || !curtain) return

    context = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(curtain, { xPercent: 100 })
        return
      }

      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 1.25,
          defaults: { ease: 'power4.inOut' },
        })
        .set(curtain, { xPercent: 100 })
        .to(curtain, { xPercent: 0, duration: 1.25 })
        .to(curtain, { xPercent: 0, duration: 3, ease: 'none' })
        .to(curtain, { xPercent: -100, duration: 1.25 })
        .to(curtain, { xPercent: -100, duration: 1.25, ease: 'none' })
        .to(curtain, { xPercent: 0, duration: 1.25 })
        .to(curtain, { xPercent: 0, duration: 3, ease: 'none' })
        .to(curtain, { xPercent: 100, duration: 1.25 })
    }, hero)
  })

  onUnmounted(() => {
    context?.revert()
    context = null
  })
}
