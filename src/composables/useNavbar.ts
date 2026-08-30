import { computed, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { unveilActiveIndex } from '@/composables/useUnveilScroll'
import { lockScroll, unlockScroll } from '@/lib/scrollLock'

export interface NavLink {
  label: string
  to: RouteLocationRaw
}

const isOpen = ref(false)
let listenersBound = false

const links: NavLink[] = [
  { label: 'About', to: { path: '/', hash: '#story' } },
  { label: 'Work', to: { path: '/', hash: '#work' } },
  { label: 'Experience', to: { path: '/', hash: '#experience' } },
  { label: 'Capabilities', to: { path: '/', hash: '#services' } },
  { label: 'Contact', to: { path: '/', hash: '#contact' } },
]

const collaborateLink: NavLink = {
  label: "Let's collaborate",
  to: { path: '/', hash: '#contact' },
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') isOpen.value = false
}

function bindListeners() {
  if (listenersBound) return
  listenersBound = true

  watch(isOpen, (open) => {
    if (open) {
      lockScroll('menu')
      window.addEventListener('keydown', onEscape)
    } else {
      unlockScroll('menu')
      window.removeEventListener('keydown', onEscape)
    }
  })

  watch(
    () => unveilActiveIndex.value === 0,
    (heroMode) => {
      if (heroMode) isOpen.value = false
    },
  )
}

export function useNavbar() {
  bindListeners()

  const isHeroMode = computed(() => unveilActiveIndex.value === 0)

  function closeMenu() {
    isOpen.value = false
  }

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, isHeroMode, links, collaborateLink, closeMenu, toggleMenu }
}
