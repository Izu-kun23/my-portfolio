let resetWorkScrollerImpl: (() => void) | null = null

export function registerWorkScrollerReset(fn: () => void) {
  resetWorkScrollerImpl = fn
}

export function unregisterWorkScrollerReset() {
  resetWorkScrollerImpl = null
}

export function resetWorkScrollerOnNavigate() {
  resetWorkScrollerImpl?.()
}
