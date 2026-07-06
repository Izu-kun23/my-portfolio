import type { Ref } from 'vue'

import {
  getWorkRestingTopOffset,
  isWorkScrollExhausted,
  resetSectionScroller,
  useSectionScrollHandoff,
  type UseSectionScrollHandoffOptions,
} from '@/composables/useSectionScrollHandoff'

export { getWorkRestingTopOffset, isWorkScrollExhausted }

export function useWorkScrollHandoff(
  scrollerRef: Ref<HTMLElement | null>,
  options: Omit<
    UseSectionScrollHandoffOptions,
    'getRestingTopOffset' | 'canForwardDown'
  > = {},
) {
  useSectionScrollHandoff(scrollerRef, {
    ...options,
    getRestingTopOffset: getWorkRestingTopOffset,
    canForwardDown: isWorkScrollExhausted,
  })
}

export function resetWorkScroller(scrollerRef: Ref<HTMLElement | null>) {
  resetSectionScroller(scrollerRef)
}
