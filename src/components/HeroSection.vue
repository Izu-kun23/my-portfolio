<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTemplateRef } from 'vue'

import basePortrait from '@/assets/portfolio.png'
import revealPortrait from '@/assets/portfolio2.png'
import { useHeroAnimation } from '@/composables/useHeroAnimation'
import { useHeroImageReveal } from '@/composables/useHeroImageReveal'
import { useScrambleWordHover } from '@/composables/useScrambleWordHover'
import HeroSocialLinks from '@/components/HeroSocialLinks.vue'

const outlineRef = useTemplateRef<HTMLElement>('outlineRef')
const solidRef = useTemplateRef<HTMLElement>('solidRef')
const roleCopyRef = useTemplateRef<HTMLElement>('roleCopyRef')
const roleTitleRef = useTemplateRef<HTMLElement>('roleTitleRef')
const softwareWordRef = useTemplateRef<HTMLElement>('softwareWordRef')
const engineerWordRef = useTemplateRef<HTMLElement>('engineerWordRef')
const imageContainerRef = useTemplateRef<HTMLElement>('imageContainerRef')
const revealImageRef = useTemplateRef<HTMLImageElement>('revealImageRef')

useHeroAnimation({
  outline: outlineRef,
  solid: solidRef,
  roleCopy: roleCopyRef,
  roleTitle: roleTitleRef,
  softwareWord: softwareWordRef,
  engineerWord: engineerWordRef,
  image: imageContainerRef,
})

useScrambleWordHover([
  { element: softwareWordRef, text: 'Software' },
  { element: engineerWordRef, text: 'Engineer' },
])

useHeroImageReveal(imageContainerRef, revealImageRef)
</script>

<template>
  <section
    class="hero-section relative flex h-full min-h-0 w-full touch-pan-y flex-col overflow-hidden bg-white md:block"
  >
    <div
      class="hero-names relative z-0 flex shrink-0 flex-col items-start px-4 pt-[4%] sm:px-6 sm:pt-[7%] md:absolute md:inset-x-0 md:top-[11%] md:w-full md:flex-row md:items-end md:justify-between md:gap-0 md:px-12 md:pt-0 lg:px-20"
    >
      <span
        ref="outlineRef"
        class="hero-name relative block w-full font-sans font-bold tracking-[-0.02em] uppercase md:inline-block md:w-auto md:tracking-normal"
      >
        <span
          aria-hidden="true"
          class="hero-name-stroke pointer-events-none absolute inset-0 select-none text-transparent"
        >
          IZUCHUKWU
        </span>
        <span class="relative text-white">IZUCHUKWU</span>
      </span>
      <span
        ref="solidRef"
        class="hero-name block w-full font-sans font-bold tracking-[-0.02em] text-gray-900 uppercase md:ml-0 md:inline-block md:w-auto md:tracking-normal"
      >
        TONY
      </span>
    </div>

    <div
      ref="roleCopyRef"
      class="hero-role-copy relative z-30 shrink-0 px-4 pt-10 sm:px-6 sm:pt-12 md:absolute md:right-auto md:bottom-[16%] md:left-12 md:max-w-sm md:px-0 md:pt-0 lg:left-20 lg:max-w-md"
    >
      <p
        ref="roleTitleRef"
        class="hero-role-title m-0 font-semibold tracking-tight text-gray-900"
        aria-label="Software Engineer"
      >
        <span
          ref="softwareWordRef"
          class="inline-block cursor-default transition-opacity duration-200 hover:opacity-[0.88]"
        >Software</span>
        <span aria-hidden="true">&nbsp;</span>
        <span
          ref="engineerWordRef"
          class="inline-block cursor-default transition-opacity duration-200 hover:opacity-[0.88]"
        >Engineer</span>
      </p>
      <p class="hero-role-description section-subtext section-subtext--light mt-3 md:mt-2">
        Creating digital solutions, focused on delivering and tackling real-world problems.
      </p>
      <RouterLink
        :to="{ path: '/', hash: '#services' }"
        class="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-gray-800 md:text-base"
      >
        Learn more
      </RouterLink>
    </div>

    <HeroSocialLinks />

    <div class="relative min-h-0 flex-1 md:absolute md:inset-0 md:flex-none">
      <div
        ref="imageContainerRef"
        class="hero-image pointer-events-none absolute bottom-0 left-1/2 z-20 h-[min(138%,calc(100svh-3.5rem))] w-[min(168vw,56rem)] max-w-none -translate-x-1/2 sm:h-[min(128%,calc(100svh-4.5rem))] sm:w-[min(148vw,56rem)] md:pointer-events-auto md:h-[96%] md:w-full md:max-w-5xl md:cursor-pointer lg:h-[92%]"
      >
        <img
          :src="basePortrait"
          alt="Portrait of Izuchukwu Tony"
          class="pointer-events-none absolute inset-0 h-full w-full origin-bottom scale-[1.08] object-contain object-bottom sm:scale-100"
          width="960"
          height="640"
          fetchpriority="high"
        />
        <img
          ref="revealImageRef"
          :src="revealPortrait"
          alt=""
          aria-hidden="true"
          class="hero-reveal pointer-events-none absolute inset-0 h-full w-full origin-bottom scale-[1.08] object-contain object-bottom opacity-0 sm:scale-100"
          width="960"
          height="640"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-names {
  gap: 0.04em;
}

@media (min-width: 640px) {
  .hero-names {
    gap: 0;
  }
}

.hero-name {
  font-size: clamp(3.5rem, min(19vw, 12.5svh), 6.75rem);
  line-height: 0.84;
}

@media (min-width: 640px) and (max-width: 767px) {
  .hero-name {
    font-size: clamp(3.25rem, 15vw, 7rem);
    line-height: 0.88;
  }
}

@media (min-width: 768px) {
  .hero-name {
    font-size: clamp(3rem, 13vw, 9.5rem);
    line-height: 0.9;
  }
}

.hero-name-stroke {
  -webkit-text-stroke: 2.5px #111827;
}

@media (min-width: 768px) {
  .hero-name-stroke {
    -webkit-text-stroke: 4px #111827;
  }
}

@media (pointer: coarse) {
  .hero-image,
  .hero-reveal {
    will-change: auto;
  }
}

@media (pointer: fine) {
  .hero-image {
    will-change: transform;
  }

  .hero-reveal {
    will-change: mask-image, opacity;
  }
}

@media (max-width: 767px) {
  .hero-role-copy {
    max-width: 24rem;
  }

  .hero-role-title {
    font-size: clamp(1.75rem, 6vw, 2.125rem);
    line-height: 1.15;
  }

  .hero-role-description {
    font-size: clamp(1.0625rem, 4vw, 1.1875rem);
    line-height: 1.55;
  }
}

@media (min-width: 768px) {
  .hero-role-title {
    font-size: clamp(1.5rem, 2vw, 1.875rem);
    line-height: 1.2;
  }
}

@media (min-width: 1024px) {
  .hero-role-title {
    font-size: 1.875rem;
  }
}
</style>
