<script setup lang="ts">
import { nextTick, onUnmounted, useTemplateRef, watch } from 'vue'

import { useCollaborationModal } from '@/composables/useCollaborationModal'
import { collaborationOffers, contactDetails } from '@/data/contact'

const props = defineProps<{
  enabled: boolean
}>()

const emit = defineEmits<{
  dismissed: []
}>()

const dialogRef = useTemplateRef<HTMLElement>('dialogRef')
const closeButtonRef = useTemplateRef<HTMLButtonElement>('closeButtonRef')
const { isOpen, hasDismissed, close } = useCollaborationModal(() => props.enabled)

let previousFocus: HTMLElement | null = null

function dismiss() {
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    dismiss()
    return
  }

  if (event.key !== 'Tab' || !dialogRef.value) return

  const focusable = [
    ...dialogRef.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  ]
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(isOpen, async (open) => {
  if (open) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    closeButtonRef.value?.focus()
    return
  }

  window.removeEventListener('keydown', onKeydown)
  previousFocus?.focus()
  previousFocus = null
})

watch(hasDismissed, (dismissed) => {
  if (dismissed) emit('dismissed')
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="collaboration">
      <div
        v-if="isOpen"
        class="collaboration-overlay fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 md:p-10"
        data-lenis-prevent
      >
        <div
          class="absolute inset-0 cursor-pointer bg-[var(--ink)]/55"
          @click="dismiss"
        />

        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="collaboration-title"
          aria-describedby="collaboration-offers"
          class="collaboration-dialog relative z-10 grid max-h-[min(92dvh,46rem)] w-full max-w-[72rem] overflow-y-auto overflow-x-hidden rounded-[1.25rem] bg-[var(--paper)] shadow-[0_28px_80px_oklch(0.12_0.006_80_/_0.34)] md:grid-cols-2"
        >
          <button
            ref="closeButtonRef"
            type="button"
            class="absolute top-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full bg-[var(--paper)]/12 text-[var(--paper)] transition-colors hover:bg-[var(--paper)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--paper)] md:bg-[var(--ink)]/5 md:text-[var(--ink)]/55 md:hover:bg-[var(--ink)]/8 md:hover:text-[var(--ink)] md:focus-visible:ring-[var(--ink)] sm:top-5 sm:right-5"
            aria-label="Close collaboration prompt"
            @click="dismiss"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </button>

          <section class="collaboration-ink relative flex min-h-[16rem] flex-col justify-end overflow-hidden px-7 py-8 pr-16 pb-12 text-[var(--paper)] sm:min-h-[20rem] sm:px-10 sm:py-10 sm:pb-14 md:min-h-[36rem] md:px-12 md:py-12 md:pr-12 md:pb-12 lg:px-16 lg:py-14">
            <h2
              id="collaboration-title"
              class="relative z-10 m-0 text-[clamp(2.85rem,8vw,5.75rem)] leading-[0.88] font-bold tracking-[-0.065em]"
            >
              Got an idea?<br />Let’s build it.
            </h2>
            <p class="collaboration-signature collaboration-signature--ink m-0 md:hidden" aria-hidden="true">
              Izuchukwu<sup class="collaboration-signature__mark">TM</sup>
            </p>
          </section>

          <section class="relative flex min-h-[22rem] flex-col bg-[var(--paper)] px-7 py-8 pr-5 pb-12 text-[var(--ink)] sm:px-10 sm:py-10 sm:pr-6 sm:pb-12 md:min-h-[36rem] md:px-12 md:pt-16 md:pr-5 md:pb-8 lg:px-14 lg:pt-16 lg:pr-6 lg:pb-8">
            <ul
              id="collaboration-offers"
              class="mt-2 mb-0 flex list-none flex-1 flex-col justify-center p-0 md:mt-0"
            >
              <li
                v-for="(offer, index) in collaborationOffers"
                :key="offer"
                class="collaboration-offer border-t border-[var(--ink)]/12 py-4 first:border-t-0 sm:py-5"
                :style="{ animationDelay: `${120 + index * 70}ms` }"
              >
                <span class="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--ink)]/35 uppercase">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <p class="m-0 mt-1 text-[clamp(1.15rem,2.4vw,1.65rem)] leading-snug font-medium tracking-[-0.03em]">
                  {{ offer }}
                </p>
              </li>
            </ul>

            <div class="mt-6 sm:mt-8">
              <a
                :href="contactDetails.collaborationCallUrl"
                target="_blank"
                rel="noreferrer"
                class="collaboration-cta inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[var(--ink)] px-6 text-sm font-semibold tracking-[-0.02em] text-[var(--paper)] no-underline transition-[transform,background-color] hover:bg-[#1c1a16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] active:scale-[0.98] sm:min-h-14 sm:w-auto sm:px-8 sm:text-base"
                @click="dismiss"
              >
                Let’s talk
                <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6" />
                </svg>
              </a>
            </div>

            <p class="collaboration-signature collaboration-signature--paper m-0 hidden md:block" aria-hidden="true">
              Izuchukwu<sup class="collaboration-signature__mark">TM</sup>
            </p>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.collaboration-ink {
  isolation: isolate;
  background:
    radial-gradient(120% 90% at 8% -10%, rgb(255 252 245 / 0.2), transparent 46%),
    linear-gradient(
      158deg,
      oklch(0.26 0.01 80) 0%,
      oklch(0.15 0.008 80) 38%,
      oklch(0.08 0.006 80) 100%
    );
  box-shadow:
    inset 0 1px 0 rgb(255 252 245 / 0.22),
    inset 0 -28px 48px rgb(0 0 0 / 0.28);
}

.collaboration-ink::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    118deg,
    rgb(255 252 245 / 0.18) 0%,
    rgb(255 252 245 / 0.05) 26%,
    transparent 54%
  );
}

.collaboration-ink::after {
  position: absolute;
  top: 12%;
  right: -18%;
  width: 58%;
  height: 70%;
  pointer-events: none;
  content: '';
  border-radius: 100%;
  background: radial-gradient(circle, rgb(255 252 245 / 0.08), transparent 68%);
}

.collaboration-enter-active,
.collaboration-leave-active {
  transition: opacity 280ms var(--ease-editorial);
}

.collaboration-enter-active .collaboration-dialog,
.collaboration-leave-active .collaboration-dialog {
  transition: transform 420ms var(--ease-editorial), opacity 280ms var(--ease-editorial);
}

.collaboration-enter-from,
.collaboration-leave-to {
  opacity: 0;
}

.collaboration-enter-from .collaboration-dialog,
.collaboration-leave-to .collaboration-dialog {
  opacity: 0;
  transform: translateY(1.25rem) scale(0.98);
}

.collaboration-offer {
  animation: offer-in 520ms var(--ease-editorial) both;
}

@keyframes offer-in {
  from {
    opacity: 0;
    transform: translateY(0.6rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.collaboration-signature {
  position: absolute;
  right: 0.7rem;
  bottom: 0.55rem;
  z-index: 10;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.01em;
  pointer-events: none;
  animation: signature-sign 2.8s linear 0.45s both;
}

.collaboration-signature--paper {
  color: oklch(0.12 0.006 80 / 0.34);
  text-shadow:
    0 1px 0 rgb(255 252 245 / 0.95),
    0 -0.6px 0.8px oklch(0.12 0.006 80 / 0.28);
}

.collaboration-signature--ink {
  color: rgb(255 252 245 / 0.34);
  text-shadow:
    0 1px 0 rgb(0 0 0 / 0.62),
    0 -0.55px 0 rgb(255 252 245 / 0.2);
}

.collaboration-signature__mark {
  margin-left: 0.08em;
  font-size: 0.38em;
  letter-spacing: 0.04em;
  vertical-align: super;
}

@keyframes signature-sign {
  from {
    opacity: 0.15;
    clip-path: inset(0 100% 0 0);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .collaboration-enter-active,
  .collaboration-leave-active,
  .collaboration-enter-active .collaboration-dialog,
  .collaboration-leave-active .collaboration-dialog {
    transition-duration: 0ms;
  }

  .collaboration-offer,
  .collaboration-signature {
    animation: none;
  }
}
</style>
