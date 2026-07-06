import { animate } from 'motion-v'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export interface MotionScrambleTextOptions {
  holdDuration?: number
  revealDuration?: number
  flickerInterval?: number
}

function randomScrambleChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]!
}

function renderScrambleFrame(element: HTMLElement, finalText: string, revealed: number) {
  const locked = Math.floor(revealed)

  element.textContent = finalText
    .split('')
    .map((char, index) => {
      if (char === ' ') return ' '
      if (index < locked) return char
      return randomScrambleChar()
    })
    .join('')
}

export function runMotionScrambleTextAnimation(
  element: HTMLElement,
  finalText: string,
  options: MotionScrambleTextOptions = {},
): () => void {
  const { holdDuration = 0.35, revealDuration = 1.1, flickerInterval = 0.09 } = options
  const state = { revealed: 0 }
  let lastFlicker = 0
  let flickerRaf = 0
  let revealAnimation: ReturnType<typeof animate> | null = null

  renderScrambleFrame(element, finalText, state.revealed)

  const flickerLoop = (now: number) => {
    if (state.revealed >= finalText.length) return

    if (now - lastFlicker >= flickerInterval * 1000) {
      lastFlicker = now
      renderScrambleFrame(element, finalText, state.revealed)
    }

    flickerRaf = requestAnimationFrame(flickerLoop)
  }

  flickerRaf = requestAnimationFrame(flickerLoop)

  revealAnimation = animate(
    state,
    { revealed: finalText.length },
    {
      delay: holdDuration,
      duration: revealDuration,
      ease: [0.42, 0, 0.58, 1],
      onUpdate: () => renderScrambleFrame(element, finalText, state.revealed),
      onComplete: () => {
        cancelAnimationFrame(flickerRaf)
        element.textContent = finalText
      },
    },
  )

  return () => {
    cancelAnimationFrame(flickerRaf)
    revealAnimation?.stop()
    element.textContent = finalText
  }
}
