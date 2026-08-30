<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'

const technologies = [
  { name: 'Vue.js', icon: 'vuedotjs' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextdotjs' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Python', icon: 'python' },
]

function getIconUrl(icon: string) {
  return `https://cdn.simpleicons.org/${icon}/000000`
}

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const isVisible = shallowRef(false)
let visibilityObserver: IntersectionObserver | null = null

onMounted(() => {
  if (!sectionRef.value) return

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = Boolean(entry?.isIntersecting)
    },
    { rootMargin: '160px 0px' },
  )
  visibilityObserver.observe(sectionRef.value)
})

onUnmounted(() => {
  visibilityObserver?.disconnect()
  visibilityObserver = null
})
</script>

<template>
  <section ref="sectionRef" class="relative z-[2] overflow-hidden border-y border-black/15 bg-[#f4f4f1] py-8 text-[#000000] sm:py-10">
    <h2 class="sr-only">Selected technologies</h2>
    <div
      class="technology-track flex w-max items-center motion-reduce:transform-none"
      :class="isVisible ? 'technology-track--running' : ''"
    >
      <template v-for="copy in 2" :key="copy">
        <span
          v-for="technology in technologies"
          :key="`${copy}-${technology.name}`"
          class="flex items-center whitespace-nowrap text-[clamp(1.65rem,4vw,4rem)] leading-none font-semibold tracking-[-0.04em]"
        >
          <span
            class="group relative inline-block cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f4f1]"
            tabindex="0"
          >
            <span class="block transition-[opacity,transform] duration-300 group-hover:scale-95 group-hover:opacity-10 group-focus:scale-95 group-focus:opacity-10 motion-reduce:transition-none">
              {{ technology.name }}
            </span>
            <img
              :src="getIconUrl(technology.icon)"
              alt=""
              aria-hidden="true"
              class="pointer-events-none absolute top-1/2 left-1/2 h-[0.78em] w-[1.2em] -translate-x-1/2 -translate-y-1/2 scale-50 object-contain opacity-0 transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100 motion-reduce:transition-none"
              loading="lazy"
              decoding="async"
            />
          </span>
          <span class="mx-5 size-2 rounded-full bg-[#737373] sm:mx-8" aria-hidden="true" />
        </span>
      </template>
    </div>
  </section>
</template>

<style scoped>
.technology-track {
  animation: technology-marquee 32s linear infinite;
  animation-play-state: paused;
}

.technology-track--running {
  animation-play-state: running;
}

.technology-track:hover {
  animation-play-state: paused;
}

@keyframes technology-marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .technology-track {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    row-gap: 1rem;
    padding-inline: 1rem;
  }
}
</style>
