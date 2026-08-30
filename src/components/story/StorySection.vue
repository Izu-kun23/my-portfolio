<script setup lang="ts">
import WordScrollReveal from '@/components/story/WordScrollReveal.vue'
import { aboutIntro } from '@/data/about'

const statement =
  'I am a software engineer who turns early ideas into useful digital products. I build responsive applications, scalable systems and thoughtful interfaces, caring equally about how software works and how it feels to use.'

const interests = [
  'Frontend engineering',
  'Digital product development',
  'Systems architecture',
  'Interaction and motion',
]
</script>

<template>
  <section id="story" class="relative z-[2] bg-[#000000] text-[#f4f4f1]">
    <div class="min-h-[185svh] px-4 sm:px-6 md:px-12 lg:px-20">
      <div class="sticky top-0 flex min-h-svh items-center py-24">
        <div class="mx-auto w-full max-w-7xl">
          <p class="m-0 mb-8 text-xs tracking-[0.14em] text-[#8a8a8a] uppercase sm:text-sm">
            What I am about
          </p>
          <WordScrollReveal
            :text="statement"
            class="max-w-6xl text-[clamp(2.25rem,6.3vw,6.8rem)] leading-[0.98] font-semibold tracking-[-0.055em]"
          />
        </div>
      </div>
    </div>

    <div class="border-t border-[#f4f4f1]/15 px-4 py-24 sm:px-6 sm:py-32 md:px-12 lg:px-20 lg:py-40">
      <div class="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-10">
        <div class="lg:col-span-3">
          <p class="m-0 text-xs tracking-[0.14em] text-[#8a8a8a] uppercase">About me</p>
        </div>

        <div class="lg:col-span-6">
          <h2 class="m-0 text-[clamp(2.4rem,5.2vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.05em]">
            Engineering is the foundation. Craft is the difference.
          </h2>
          <div class="mt-10 space-y-6 text-base leading-relaxed text-[#f4f4f1]/65 sm:text-lg">
            <p v-for="paragraph in aboutIntro.paragraphs" :key="paragraph" class="m-0">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <aside class="lg:col-span-3 lg:pt-2">
          <p class="m-0 text-xs tracking-[0.14em] text-[#8a8a8a] uppercase">Focused on</p>
          <ul class="m-0 mt-5 list-none space-y-3 p-0 text-sm text-[#f4f4f1]/70 sm:text-base">
            <li v-for="interest in interests" :key="interest" class="border-b border-[#f4f4f1]/15 pb-3">
              {{ interest }}
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </section>
</template>
