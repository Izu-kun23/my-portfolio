<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { motion } from 'motion-v'

import { getWorkCaseStudy } from '@/data/work'

const route = useRoute()
const router = useRouter()
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const caseStudy = computed(() => {
  const id = typeof route.params.id === 'string' ? route.params.id : ''
  return getWorkCaseStudy(id)
})

const enterEase = [0.22, 1, 0.36, 1] as const

const fadeUpTransition = (delay = 0) =>
  prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.58, ease: enterEase, delay }

const fadeUpInitial = prefersReducedMotion ? false : { opacity: 0, y: 28 }
const fadeUpAnimate = { opacity: 1, y: 0 }

const titleInitial = prefersReducedMotion ? false : { opacity: 0, x: 32, y: 12 }
const titleAnimate = { opacity: 1, x: 0, y: 0 }
const titleTransition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.72, ease: enterEase, delay: 0.12 }

const inViewOptions = { once: true }

const inViewInitial = prefersReducedMotion ? false : { opacity: 0, y: 40 }
const inViewAnimate = { opacity: 1, y: 0 }
const inViewTransition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.68, ease: enterEase }

const galleryInitial = prefersReducedMotion ? false : { opacity: 0, y: 48, scale: 0.985 }
const galleryAnimate = { opacity: 1, y: 0, scale: 1 }

function galleryTransition(index: number) {
  return prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.72, ease: enterEase, delay: index * 0.06 }
}

onMounted(() => {
  if (!caseStudy.value) {
    router.replace('/')
    return
  }

  document.querySelector('.case-study-overlay')?.scrollTo({ top: 0, left: 0 })
})
</script>

<template>
  <main
    v-if="caseStudy"
    :key="caseStudy.id"
    class="min-h-dvh bg-white px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] sm:px-6 md:px-12 lg:px-20"
  >
    <div class="mx-auto w-full max-w-5xl">
      <motion.div
        :initial="fadeUpInitial"
        :animate="fadeUpAnimate"
        :transition="fadeUpTransition(0.04)"
      >
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Back to work
        </RouterLink>
      </motion.div>

      <motion.p
        class="m-0 mt-8 font-mono text-[0.65rem] tracking-[0.18em] text-gray-400 uppercase"
        :initial="fadeUpInitial"
        :animate="fadeUpAnimate"
        :transition="fadeUpTransition(0.08)"
      >
        Case Study
      </motion.p>

      <div class="mt-3 flex flex-wrap items-start justify-between gap-4 sm:gap-6">
        <motion.h1
          class="m-0 min-w-0 flex-1 text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-bold tracking-tight text-gray-900 uppercase"
          :initial="titleInitial"
          :animate="titleAnimate"
          :transition="titleTransition"
        >
          {{ caseStudy.title }}
        </motion.h1>

        <motion.a
          v-if="caseStudy.liveUrl"
          :href="caseStudy.liveUrl"
          class="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-900 sm:ml-auto"
          :target="caseStudy.liveUrl === '#' ? undefined : '_blank'"
          :rel="caseStudy.liveUrl === '#' ? undefined : 'noopener noreferrer'"
          :initial="fadeUpInitial"
          :animate="fadeUpAnimate"
          :transition="fadeUpTransition(0.18)"
        >
          View Live
          <svg viewBox="0 0 24 24" class="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M7 17L17 7" stroke-linecap="round" />
            <path d="M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </motion.a>
      </div>

      <motion.ul
        class="m-0 mt-5 flex list-none flex-wrap items-center gap-2 p-0"
        :initial="prefersReducedMotion ? false : { opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="fadeUpTransition(0.22)"
      >
        <motion.li
          v-for="(tag, index) in caseStudy.tags"
          :key="tag.label"
          :initial="prefersReducedMotion ? false : { opacity: 0, scale: 0.88, y: 10 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.42, ease: enterEase, delay: 0.24 + index * 0.05 }
          "
        >
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase"
            :class="
              tag.filled
                ? 'bg-gray-900 text-white'
                : 'border border-gray-300 text-gray-700'
            "
          >
            {{ tag.label }}
          </span>
        </motion.li>
      </motion.ul>

      <motion.dl
        class="mt-10 grid gap-6 border-y border-gray-200 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
        :initial="prefersReducedMotion ? false : { opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="fadeUpTransition(0.28)"
      >
        <motion.div
          v-for="(item, index) in [
            { label: 'Client', value: caseStudy.client },
            { label: 'Role', value: caseStudy.role },
            { label: 'Year', value: caseStudy.year },
            { label: 'Tech stack', value: caseStudy.techStack.join(', ') },
          ]"
          :key="item.label"
          :initial="prefersReducedMotion ? false : { opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.48, ease: enterEase, delay: 0.32 + index * 0.06 }
          "
        >
          <dt class="m-0 text-xs tracking-wide text-gray-400 uppercase">{{ item.label }}</dt>
          <dd class="m-0 mt-1 font-medium text-gray-900">{{ item.value }}</dd>
        </motion.div>
      </motion.dl>

      <motion.p
        class="m-0 mt-10 max-w-3xl text-lg leading-relaxed text-gray-700"
        :initial="fadeUpInitial"
        :animate="fadeUpAnimate"
        :transition="fadeUpTransition(0.38)"
      >
        {{ caseStudy.overview }}
      </motion.p>

      <section class="mt-12 grid gap-10 md:grid-cols-2">
        <motion.div
          :initial="inViewInitial"
          :while-in-view="inViewAnimate"
          :in-view-options="inViewOptions"
          :transition="inViewTransition"
        >
          <h2 class="m-0 text-sm font-semibold tracking-wide text-gray-900 uppercase">
            The challenge
          </h2>
          <p class="m-0 mt-3 text-base leading-relaxed text-gray-600">
            {{ caseStudy.challenge }}
          </p>
        </motion.div>

        <motion.div
          :initial="inViewInitial"
          :while-in-view="inViewAnimate"
          :in-view-options="inViewOptions"
          :transition="
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.68, ease: enterEase, delay: 0.08 }
          "
        >
          <h2 class="m-0 text-sm font-semibold tracking-wide text-gray-900 uppercase">
            The solution
          </h2>
          <p class="m-0 mt-3 text-base leading-relaxed text-gray-600">
            {{ caseStudy.solution }}
          </p>
        </motion.div>
      </section>

      <section class="mt-12">
        <motion.h2
          class="m-0 text-sm font-semibold tracking-wide text-gray-900 uppercase"
          :initial="inViewInitial"
          :while-in-view="inViewAnimate"
          :in-view-options="inViewOptions"
          :transition="inViewTransition"
        >
          Product screens
        </motion.h2>

        <div class="mt-6 flex flex-col gap-10">
          <motion.figure
            v-for="(item, index) in caseStudy.gallery"
            :key="item.caption"
            class="m-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            :initial="galleryInitial"
            :while-in-view="galleryAnimate"
            :in-view-options="inViewOptions"
            :transition="galleryTransition(index)"
          >
            <img
              :src="item.image"
              :alt="item.alt"
              class="block w-full object-cover"
              loading="lazy"
            />
            <figcaption class="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 sm:px-5">
              {{ item.caption }}
            </figcaption>
          </motion.figure>
        </div>
      </section>

      <motion.section
        class="mt-12 rounded-2xl bg-gray-50 px-5 py-8 sm:px-8"
        :initial="inViewInitial"
        :while-in-view="inViewAnimate"
        :in-view-options="inViewOptions"
        :transition="inViewTransition"
      >
        <h2 class="m-0 text-sm font-semibold tracking-wide text-gray-900 uppercase">
          Outcome
        </h2>
        <p class="m-0 mt-3 max-w-3xl text-base leading-relaxed text-gray-700">
          {{ caseStudy.outcome }}
        </p>
      </motion.section>

      <motion.div
        class="mt-12 flex flex-wrap items-center gap-3"
        :initial="prefersReducedMotion ? false : { opacity: 0, y: 20 }"
        :while-in-view="prefersReducedMotion ? undefined : { opacity: 1, y: 0 }"
        :in-view-options="inViewOptions"
        :transition="prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: enterEase }"
      >
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-900"
        >
          Back to work
        </RouterLink>
        <RouterLink
          to="/#contact"
          class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
        >
          Start a project
        </RouterLink>
      </motion.div>
    </div>
  </main>
</template>
