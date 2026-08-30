<script setup lang="ts">
import { shallowRef } from 'vue'
const open = shallowRef(0)
const questions = [
  { q:'What kind of work do you take on?', a:'Product websites, frontend platforms, internal tools, design systems, automation, and focused improvements to existing digital products.' },
  { q:'Can you work with an existing team?', a:'Yes. I can own a defined product area or work alongside designers, engineers, and stakeholders within an established delivery process.' },
  { q:'Do you handle design and development?', a:'Yes. My work combines interface design, interaction thinking, frontend engineering, and the technical systems needed to ship the product.' },
  { q:'Where are you based?', a:'I am based in the United Kingdom and available for remote collaborations.' },
]
</script>
<template>
  <section class="bg-[var(--paper)] px-4 py-28 sm:px-7 md:py-44 lg:px-12"><div class="mx-auto max-w-[1800px]">
    <header class="mb-16 grid gap-6 lg:grid-cols-12"><p class="m-0 text-base font-medium uppercase tracking-[.08em] lg:col-span-3">Your questions</p><h2 class="m-0 text-[clamp(3.8rem,9vw,9rem)] leading-[.82] tracking-[-.07em] uppercase lg:col-span-8">Before we<br />begin</h2></header>
    <div class="border-t border-black/25 lg:ml-[25%]"><article v-for="(item,index) in questions" :key="item.q" class="border-b border-black/25">
      <button type="button" class="grid w-full grid-cols-[1fr_auto] gap-5 py-6 text-left text-[clamp(1.35rem,2.5vw,2.4rem)] tracking-[-.03em]" :aria-expanded="open === index" @click="open = open === index ? -1 : index"><span>{{ item.q }}</span><span class="transition-transform" :class="open === index ? 'rotate-45' : ''">+</span></button>
      <div class="grid transition-[grid-template-rows] duration-500" :class="open === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"><div class="overflow-hidden"><p class="mt-0 mb-7 max-w-2xl text-lg leading-relaxed text-black/78">{{ item.a }}</p></div></div>
    </article></div>
  </div></section>
</template>
