<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useExperienceHorizontalStack } from '@/composables/useExperienceHorizontalStack'
import { useSectionContentReveal } from '@/composables/useSectionContentReveal'
import { aboutIntro, aboutStats, experienceEntries } from '@/data/about'

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const eyebrowRef = useTemplateRef<HTMLElement>('eyebrowRef')
const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const desktopCardRefs = useTemplateRef<(HTMLElement | null)[]>('desktopCardRefs')
const counterRef = useTemplateRef<HTMLElement>('counterRef')
const progressRef = useTemplateRef<HTMLElement>('progressRef')

const experienceStat = computed(() => `${aboutStats[0]?.value ?? ''} ${aboutStats[0]?.label?.toLowerCase() ?? 'years of experience'}`)
const scrollRunway = computed(() => ({ height: `${experienceEntries.length * 85}vh` }))

useExperienceHorizontalStack({ triggerRef, cardRefs: desktopCardRefs, counterRef, progressRef })

const reveal = useSectionContentReveal({
  contentRef: sectionRef,
  scrambleRef: eyebrowRef,
  scrambleText: 'EXPERIENCE /',
})

defineExpose({ reveal })
</script>

<template>
  <section id="about" ref="sectionRef" class="relative w-full overflow-x-clip bg-[#000000] text-[#f4f4f1]">
    <div class="px-4 pt-24 sm:px-6 sm:pt-28 md:px-12 md:pt-32 lg:px-20 lg:pt-40">
      <div class="mx-auto w-full max-w-7xl">
        <h2 ref="eyebrowRef" class="m-0 text-[clamp(3.5rem,11vw,10rem)] leading-[0.82] font-extrabold tracking-[-0.07em] uppercase">
          EXPERIENCE /
        </h2>

        <div class="mt-12 grid gap-5 border-t border-[#333333] pt-7 md:grid-cols-12 md:gap-8 lg:mt-20">
          <p class="m-0 text-xs tracking-[0.14em] text-[#8a8a8a] uppercase md:col-span-4 md:text-center">Work history</p>
          <p class="m-0 max-w-2xl text-[clamp(1.4rem,3vw,2.5rem)] leading-tight font-medium tracking-[-0.035em] text-[#d4d4d4] md:col-span-6">
            {{ aboutIntro.experienceSubtext }}.
          </p>
          <p class="m-0 text-sm text-[#737373] md:col-span-2 md:text-right">{{ experienceStat }}</p>
        </div>

        <div class="experience-mobile mt-14 md:hidden">
          <article v-for="(entry, index) in experienceEntries" :key="entry.id" class="border-t border-[#333333] py-7">
            <div class="flex items-start justify-between gap-6">
              <img v-if="entry.logo" :src="entry.logo" :alt="entry.logoAlt ?? `${entry.company} logo`" class="h-6 max-w-28 object-contain object-left grayscale" :class="entry.logoInvert ? 'invert' : ''" />
              <span class="ml-auto font-mono text-xs text-[#737373]">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <h3 class="m-0 mt-8 text-[clamp(1.65rem,7vw,2.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">{{ entry.role }}</h3>
            <p class="m-0 mt-2 text-sm text-[#8a8a8a]">{{ entry.company }} · {{ entry.period }}</p>
            <ul class="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
              <li v-for="tag in entry.tags" :key="tag" class="rounded-full border border-[#444444] px-3 py-1 text-xs text-[#8a8a8a]">{{ tag }}</li>
            </ul>
          </article>
          <div class="border-t border-[#333333]" />
        </div>
      </div>
    </div>

    <div ref="triggerRef" :style="scrollRunway" class="experience-runway mt-10 hidden md:block">
      <div class="sticky top-0 flex h-screen items-center overflow-hidden">
        <div class="absolute top-6 right-[5%] z-20 font-mono text-xs tracking-[0.18em] text-[#737373]">
          <span ref="counterRef">01</span><span class="text-[#444444]"> / {{ String(experienceEntries.length).padStart(2, '0') }}</span>
        </div>
        <div class="absolute right-[5%] bottom-6 left-[5%] z-20 h-px bg-[#333333]">
          <div ref="progressRef" class="h-full origin-left scale-x-0 bg-[#8a8a8a]" />
        </div>

        <div class="relative flex h-full w-full items-center overflow-hidden">
          <article
            v-for="(entry, index) in experienceEntries"
            :key="entry.id"
            ref="desktopCardRefs"
            class="absolute right-[5%] left-[5%] h-[68vh] overflow-hidden rounded-2xl border border-[#d4d4d4] bg-[#f4f4f1] text-[#000000]"
          >
            <div class="grid h-full grid-cols-[minmax(15rem,1fr)_2fr]">
              <div class="flex flex-col justify-between border-r border-[#d4d4d4] p-8 lg:p-10">
                <span class="font-mono text-[11px] tracking-[0.35em] text-[#737373] uppercase">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="flex items-center justify-center py-4">
                  <img v-if="entry.logo" :src="entry.logo" :alt="entry.logoAlt ?? `${entry.company} logo`" class="max-h-20 max-w-52 object-contain object-center grayscale" />
                  <span v-else class="text-4xl font-bold">{{ entry.company }}</span>
                </div>
                <div class="space-y-3">
                  <p class="m-0 text-[11px] tracking-[0.24em] text-[#5c5c5c] uppercase">{{ entry.period }}</p>
                  <span class="inline-block rounded-full border border-[#b5b5b5] px-3 py-1 text-[11px] tracking-wide text-[#5c5c5c]">Professional experience</span>
                </div>
              </div>

              <div class="flex flex-col justify-between p-8 lg:p-10 xl:p-12">
                <div class="flex flex-col gap-4">
                  <p class="m-0 text-[11px] tracking-[0.25em] text-[#737373] uppercase">{{ entry.company }}</p>
                  <h3 class="m-0 text-[clamp(1.5rem,2.8vw,2.4rem)] leading-[1.05] font-bold tracking-[-0.04em]">{{ entry.role }}</h3>
                  <ul class="m-0 mt-2 space-y-2 p-0">
                    <li v-for="highlight in entry.highlights" :key="highlight" class="flex gap-2 text-[clamp(0.78rem,1vw,0.88rem)] leading-[1.6] text-[#5c5c5c]">
                      <span class="mt-[3px] shrink-0 text-[#8a8a8a]">—</span><span>{{ highlight }}</span>
                    </li>
                  </ul>
                </div>
                <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
                  <li v-for="tag in entry.tags" :key="tag" class="rounded-full border border-[#d4d4d4] bg-[#f4f4f1] px-3 py-1.5 text-[11px] tracking-wide text-[#5c5c5c]">{{ tag }}</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (min-width: 768px) and (prefers-reduced-motion: reduce) {
  .experience-mobile {
    display: block;
    padding-bottom: 5rem;
  }

  .experience-runway {
    display: none;
  }
}
</style>
