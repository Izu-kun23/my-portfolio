import { lenis } from '@/lib/lenis'

const activeLocks = new Set<string>()

export function lockScroll(reason: string) {
  const wasEmpty = activeLocks.size === 0
  activeLocks.add(reason)
  if (wasEmpty) lenis.stop()
}

export function unlockScroll(reason: string) {
  activeLocks.delete(reason)
  if (activeLocks.size === 0) lenis.start()
}

export function isScrollLocked(): boolean {
  return activeLocks.size > 0
}

export function hasScrollLock(reason: string): boolean {
  return activeLocks.has(reason)
}

export function clearAllScrollLocks() {
  activeLocks.clear()
  lenis.start()
}
