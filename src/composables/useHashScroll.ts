import { nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useNavbar } from '@/composables/useNavbar'
import { scrollToSection, type ScrollToSectionOptions } from '@/composables/useUnveilScroll'
import { lenis } from '@/lib/lenis'

export function scrollToHash(hash: string, options?: ScrollToSectionOptions) {
  const { closeMenu } = useNavbar()
  closeMenu()
  scrollToSection(hash, options)
}

export function useHashScroll() {
  const route = useRoute()
  const router = useRouter()

  onMounted(async () => {
    if (!route.hash) return
    // useUnveilScroll finishes its own mount work after this same nextTick
    // (its hook is registered first); deep links must wait for it or
    // scrollToSection is a no-op.
    await nextTick()
    // The pin spacer has just resized the page; without this, Lenis still has
    // limit 0 and clamps the deep-link scroll target back to the top. The jump
    // must be immediate — a tweened scroll gets cancelled when late image
    // loads trigger a ScrollTrigger refresh mid-animation.
    lenis.resize()
    scrollToHash(route.hash, { immediate: true })
  })

  watch(() => route.hash, (hash) => {
    if (hash) scrollToHash(hash)
  })

  return { scrollToHash, router }
}
