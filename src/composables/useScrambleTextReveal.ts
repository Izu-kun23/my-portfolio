import gsap from 'gsap'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

interface ScrambleTextAnimationOptions {
  holdDuration?: number
  revealDuration?: number
  flickerInterval?: number
}

function randomScrambleChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]!
}

export function runScrambleTextAnimation(
  element: HTMLElement,
  finalText: string,
  options: ScrambleTextAnimationOptions = {},
): () => void {
  const { holdDuration = 0.85, revealDuration = 1.85, flickerInterval = 0.09 } = options
  const state = { revealed: 0 }
  let lastFlicker = 0

  const render = () => {
    const locked = Math.floor(state.revealed)

    element.textContent = finalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index < locked) return char
        return randomScrambleChar()
      })
      .join('')
  }

  render()

  const flicker = (time: number) => {
    if (state.revealed >= finalText.length) return
    if (time - lastFlicker < flickerInterval) return
    lastFlicker = time
    render()
  }

  gsap.ticker.add(flicker)

  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.ticker.remove(flicker)
      element.textContent = finalText
    },
  })

  timeline.to({}, { duration: holdDuration })
  timeline.to(state, {
    revealed: finalText.length,
    duration: revealDuration,
    ease: 'power1.inOut',
    onUpdate: render,
  })

  return () => {
    gsap.ticker.remove(flicker)
    timeline.kill()
    element.textContent = finalText
  }
}
