import { nextTick, onUnmounted, ref, type Ref } from 'vue'

import type { ExperienceEntry } from '@/data/about'
import { gsap } from '@/lib/gsap'
import { lenis } from '@/lib/lenis'

interface SourceRect {
  top: number
  left: number
  width: number
  height: number
}

interface ExperienceCardModalRefs {
  overlayRef: Ref<HTMLElement | null>
  shellRef: Ref<HTMLElement | null>
  flipRef: Ref<HTMLElement | null>
}

const MODAL_MAX_WIDTH = 896

async function waitForRefs(refs: ExperienceCardModalRefs, attempts = 12): Promise<boolean> {
  for (let i = 0; i < attempts; i += 1) {
    if (refs.overlayRef.value && refs.shellRef.value && refs.flipRef.value) {
      return true
    }
    await nextTick()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  }
  return Boolean(refs.overlayRef.value && refs.shellRef.value && refs.flipRef.value)
}

export function useExperienceCardModal(isOpen: Ref<boolean>, refs: ExperienceCardModalRefs) {
  const selectedEntry = ref<ExperienceEntry | null>(null)
  const sourceRect = ref<SourceRect | null>(null)
  const isAnimating = ref(false)
  const showBackFace = ref(false)

  let ctx: gsap.Context | null = null
  let escapeHandler: ((event: KeyboardEvent) => void) | null = null

  function killAnimation() {
    ctx?.revert()
    ctx = null
  }

  function resetModalState() {
    selectedEntry.value = null
    sourceRect.value = null
    showBackFace.value = false
    isAnimating.value = false
  }

  function lockScroll() {
    lenis.stop()
    isOpen.value = true
  }

  function unlockScroll() {
    lenis.start()
    isOpen.value = false
  }

  function hideModalElements() {
    const { overlayRef, shellRef, flipRef } = refs
    if (overlayRef.value) gsap.set(overlayRef.value, { autoAlpha: 0 })
    if (shellRef.value) gsap.set(shellRef.value, { autoAlpha: 0, clearProps: 'top,left,width,height,xPercent,yPercent,rotateY' })
    if (flipRef.value) gsap.set(flipRef.value, { rotateY: 0, clearProps: 'transform' })
  }

  function getModalWidth(): number {
    return Math.min(window.innerWidth * 0.92, MODAL_MAX_WIDTH)
  }

  async function openFromCard(entry: ExperienceEntry, cardElement: HTMLElement) {
    if (isAnimating.value || isOpen.value) return

    const rect = cardElement.getBoundingClientRect()
    selectedEntry.value = entry
    sourceRect.value = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
    showBackFace.value = false
    isAnimating.value = true
    lockScroll()

    const refsReady = await waitForRefs(refs)
    const shell = refs.shellRef.value
    const flip = refs.flipRef.value
    const overlay = refs.overlayRef.value

    if (!refsReady || !shell || !flip || !overlay || !sourceRect.value) {
      resetModalState()
      unlockScroll()
      return
    }

    killAnimation()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = sourceRect.value
    const modalWidth = getModalWidth()

    ctx = gsap.context(() => {
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: 'auto' })
      gsap.set(shell, {
        autoAlpha: 1,
        position: 'fixed',
        top: start.top + start.height / 2,
        left: start.left + start.width / 2,
        xPercent: -50,
        yPercent: -50,
        width: start.width,
        height: start.height,
        margin: 0,
        rotateY: 0,
        transformOrigin: 'center center',
        force3D: true,
        pointerEvents: 'auto',
      })
      gsap.set(flip, { rotateY: 0, transformStyle: 'preserve-3d', force3D: true })

      if (prefersReducedMotion) {
        gsap.set(overlay, { autoAlpha: 1 })
        gsap.set(shell, {
          top: '50%',
          left: '50%',
          xPercent: -50,
          yPercent: -50,
          width: modalWidth,
          height: 'auto',
        })
        showBackFace.value = true
        isAnimating.value = false
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          isAnimating.value = false
        },
      })

      tl.addLabel('overlay', 0)
        .to(overlay, { autoAlpha: 1, duration: 0.28 }, 'overlay')
        .addLabel('flipOut', 0.06)
        .to(flip, { rotateY: 90, duration: 0.36, ease: 'power2.in' }, 'flipOut')
        .addLabel('swapFace')
        .call(() => {
          showBackFace.value = true
          tl.pause()
          void nextTick().then(() => {
            gsap.set(shell, { height: 'auto' })
            tl.resume()
          })
        })
        .addLabel('flipIn')
        .to(flip, { rotateY: 180, duration: 0.36, ease: 'power2.out' }, 'flipIn')
        .addLabel('expand', '-=0.22')
        .to(
          shell,
          {
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            width: modalWidth,
            duration: 0.58,
            ease: 'power3.out',
          },
          'expand',
        )
    }, shell)
  }

  async function closeModal() {
    if (!selectedEntry.value || !sourceRect.value) {
      killAnimation()
      hideModalElements()
      resetModalState()
      unlockScroll()
      return
    }

    if (isAnimating.value) return

    const shell = refs.shellRef.value
    const flip = refs.flipRef.value
    const overlay = refs.overlayRef.value
    if (!shell || !flip || !overlay) {
      killAnimation()
      hideModalElements()
      resetModalState()
      unlockScroll()
      return
    }

    isAnimating.value = true
    killAnimation()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = sourceRect.value

    if (prefersReducedMotion) {
      hideModalElements()
      resetModalState()
      unlockScroll()
      return
    }

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          hideModalElements()
          resetModalState()
          unlockScroll()
        },
      })

      tl.to(
        shell,
        {
          top: start.top + start.height / 2,
          left: start.left + start.width / 2,
          xPercent: -50,
          yPercent: -50,
          width: start.width,
          height: start.height,
          duration: 0.42,
          ease: 'power3.inOut',
        },
        0,
      )
        .to(flip, { rotateY: 90, duration: 0.3, ease: 'power2.in' }, 0.08)
        .call(() => {
          showBackFace.value = false
        })
        .to(flip, { rotateY: 0, duration: 0.3, ease: 'power2.out' })
        .to(overlay, { autoAlpha: 0, duration: 0.22, ease: 'power2.in' }, '-=0.1')
    }, shell)
  }

  escapeHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) closeModal()
  }
  window.addEventListener('keydown', escapeHandler)

  onUnmounted(() => {
    killAnimation()
    if (escapeHandler) window.removeEventListener('keydown', escapeHandler)
    if (isOpen.value) {
      hideModalElements()
      resetModalState()
      unlockScroll()
    }
  })

  return {
    selectedEntry,
    showBackFace,
    isAnimating,
    openFromCard,
    closeModal,
  }
}
