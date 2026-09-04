import { onUnmounted, shallowRef, watch, type MaybeRefOrGetter, toValue } from 'vue'

import { lockScroll, unlockScroll } from '@/lib/scrollLock'

const REVEAL_DELAY_MS = 3000
const LOCK_REASON = 'collaboration'

export function useCollaborationModal(enabled: MaybeRefOrGetter<boolean>) {
  const isOpen = shallowRef(false)
  const hasDismissed = shallowRef(false)

  let revealTimer: number | undefined
  let previousOverflow = ''
  let previousHtmlOverflow = ''

  function clearRevealTimer() {
    if (revealTimer === undefined) return
    window.clearTimeout(revealTimer)
    revealTimer = undefined
  }

  function applyScrollLock() {
    previousOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.getElementById('app')?.setAttribute('inert', '')
    lockScroll(LOCK_REASON)
  }

  function releaseScrollLock() {
    document.body.style.overflow = previousOverflow
    document.documentElement.style.overflow = previousHtmlOverflow
    document.getElementById('app')?.removeAttribute('inert')
    unlockScroll(LOCK_REASON)
  }

  function open() {
    if (hasDismissed.value || isOpen.value || !toValue(enabled)) return
    isOpen.value = true
    applyScrollLock()
  }

  function close() {
    clearRevealTimer()
    hasDismissed.value = true
    if (!isOpen.value) return
    isOpen.value = false
    releaseScrollLock()
  }

  watch(
    () => toValue(enabled),
    (isEnabled) => {
      if (hasDismissed.value) return

      if (!isEnabled) {
        clearRevealTimer()
        if (isOpen.value) {
          isOpen.value = false
          releaseScrollLock()
        }
        return
      }

      if (isOpen.value || revealTimer !== undefined) return
      revealTimer = window.setTimeout(open, REVEAL_DELAY_MS)
    },
    { immediate: true },
  )

  onUnmounted(() => {
    clearRevealTimer()
    if (isOpen.value) releaseScrollLock()
  })

  return { isOpen, hasDismissed, close }
}
