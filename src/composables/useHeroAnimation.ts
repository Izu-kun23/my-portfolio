import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'

import { runScrambleTextAnimation } from '@/composables/useScrambleTextReveal'

const SOFTWARE_WORD = 'Software'
const ENGINEER_WORD = 'Engineer'

interface HeroAnimationTargets {
  outline: Ref<HTMLElement | null>
  solid: Ref<HTMLElement | null>
  roleCopy: Ref<HTMLElement | null>
  roleTitle: Ref<HTMLElement | null>
  softwareWord: Ref<HTMLElement | null>
  engineerWord: Ref<HTMLElement | null>
  image: Ref<HTMLElement | null>
}

export function useHeroAnimation({
  outline,
  solid,
  roleCopy,
  roleTitle,
  softwareWord,
  engineerWord,
  image,
}: HeroAnimationTargets) {
  let ctx: gsap.Context | null = null
  let stopScrambleReveal: (() => void) | null = null

  onMounted(async () => {
    await nextTick()

    const outlineEl = outline.value
    const solidEl = solid.value
    const roleCopyEl = roleCopy.value
    const roleTitleEl = roleTitle.value
    const softwareWordEl = softwareWord.value
    const engineerWordEl = engineerWord.value
    const imageEl = image.value

    if (!outlineEl || !solidEl || !roleCopyEl || !roleTitleEl || !softwareWordEl || !engineerWordEl || !imageEl) {
      return
    }

    ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        softwareWordEl.textContent = SOFTWARE_WORD
        engineerWordEl.textContent = ENGINEER_WORD
        gsap.set([outlineEl, solidEl, roleCopyEl, imageEl], { autoAlpha: 1, x: 0, y: 0 })
        return
      }

      softwareWordEl.textContent = SOFTWARE_WORD
      engineerWordEl.textContent = ENGINEER_WORD

      gsap.set(outlineEl, { autoAlpha: 0, x: -120, y: -80 })
      gsap.set(solidEl, { autoAlpha: 0, x: 120, y: -80 })
      gsap.set(roleCopyEl, { autoAlpha: 0, y: 24 })
      gsap.set(imageEl, { autoAlpha: 0, y: 160 })

      const isStackedNames = window.matchMedia('(max-width: 767px)').matches
      if (isStackedNames) {
        gsap.set(outlineEl, { autoAlpha: 0, x: -80, y: -40 })
        gsap.set(solidEl, { autoAlpha: 0, x: -40, y: 40 })
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to(outlineEl, { autoAlpha: 1, x: 0, y: 0, duration: 1 })
        .to(solidEl, { autoAlpha: 1, x: 0, y: 0, duration: 1 }, '<')
        .to(
          roleCopyEl,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            onStart: () => {
              stopScrambleReveal?.()

              const stopSoftware = runScrambleTextAnimation(softwareWordEl, SOFTWARE_WORD, {
                holdDuration: 0.55,
                revealDuration: 1.35,
              })
              const stopEngineer = runScrambleTextAnimation(engineerWordEl, ENGINEER_WORD, {
                holdDuration: 0.75,
                revealDuration: 1.35,
              })

              stopScrambleReveal = () => {
                stopSoftware()
                stopEngineer()
              }
            },
          },
          '-=0.5',
        )
        .to(imageEl, { autoAlpha: 1, y: 0, duration: 1.2 }, '-=0.55')
    })
  })

  onUnmounted(() => {
    stopScrambleReveal?.()
    ctx?.revert()
  })
}
