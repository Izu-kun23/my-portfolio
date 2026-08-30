import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useEditorialMotion(rootRef: Ref<HTMLElement | null>) {
  let context: gsap.Context | null = null

  onMounted(async () => {
    await nextTick()
    const root = rootRef.value
    if (!root) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    context = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
      heroTimeline
        .from('[data-hero-nav]', { y: -18, autoAlpha: 0, duration: 0.7 })
        .from('[data-hero-tile]', {
          y: 90,
          rotate: (index) => (index - 2) * 3,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.07,
        }, 0.08)
        .from('[data-hero-word]', { yPercent: 112, duration: 1.05 }, 0.18)
        .from('[data-hero-meta]', { y: 24, autoAlpha: 0, duration: 0.75, stagger: 0.08 }, 0.62)

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 38,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach((element) => {
        const image = element.querySelector('img')
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 84%',
            once: true,
          },
        })

        timeline.fromTo(
          element,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' },
        )

        if (image) {
          timeline.fromTo(image, { scale: 1.1 }, { scale: 1, duration: 1.25, ease: 'power4.out' }, 0)
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-word-reveal]').forEach((element) => {
        const words = gsap.utils.toArray<HTMLElement>('[data-word]', element)
        gsap.to(words, {
          color: 'var(--paper)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            end: 'bottom 48%',
            scrub: true,
          },
        })
      })
    }, root)

    ScrollTrigger.refresh()
  })

  onUnmounted(() => {
    context?.revert()
    context = null
  })
}
