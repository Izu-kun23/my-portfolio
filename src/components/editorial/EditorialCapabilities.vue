<script setup lang="ts">
import { shallowRef } from 'vue'
import mobilePreview from '@/assets/portfolio2.png'
import webPreview from '@/assets/portfolio.png'
import monitorPreview from '@/assets/work/database-monitor/services.png'
const active = shallowRef(0)
const capabilities = [
  { number:'01', title:'Frontend engineering', description:'Responsive interfaces engineered for clarity, accessibility, speed, and maintainable growth.', items:['Vue and React','TypeScript','Design systems','Motion and interaction','Performance'], image:webPreview, alt:'Responsive product interfaces built by Izuchukwu' },
  { number:'02', title:'Product development', description:'Digital products shaped from early requirements through architecture, implementation, and deployment.', items:['Product architecture','APIs and databases','Authentication','Internal tools','Cloud deployment'], image:mobilePreview, alt:'Mobile and web product work by Izuchukwu' },
  { number:'03', title:'Automation systems', description:'Reliable workflows that connect services, surface operational health, and remove repetitive work.', items:['Service integration','Monitoring','Email automation','Operational tooling','Quality assurance'], image:monitorPreview, alt:'Database monitoring automation interface' },
]
</script>

<template>
  <section id="capabilities" class="bg-[var(--paper)] px-4 py-28 sm:px-7 md:py-44 lg:px-12">
    <div class="mx-auto max-w-[1800px]">
      <header data-reveal class="mb-16 grid gap-6 lg:grid-cols-12">
        <p class="m-0 text-xs uppercase tracking-[.1em] lg:col-span-3">Capabilities</p>
        <h2 class="m-0 text-[clamp(4rem,10vw,11rem)] leading-[.76] font-medium tracking-[-.075em] uppercase lg:col-span-9">Expand the<br />spectrum</h2>
      </header>
      <div class="border-t border-black/25">
        <article v-for="(item,index) in capabilities" :key="item.title" class="group border-b border-black/25" :class="active !== index ? 'lg:hover:bg-black/[.025]' : ''">
          <button type="button" class="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 py-6 text-left lg:grid-cols-[5rem_1fr_auto] lg:py-8" :aria-expanded="active === index" @click="active = index">
            <span class="text-xs">{{ item.number }}</span><span class="text-[clamp(2.2rem,5.4vw,6rem)] leading-none tracking-[-.055em]">{{ item.title }}</span><span class="text-2xl transition-transform duration-500" :class="active === index ? 'rotate-45' : ''">+</span>
          </button>
          <div class="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.76,0,.24,1)]" :class="active === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div class="overflow-hidden"><div class="grid gap-8 pb-10 pl-12 lg:grid-cols-12 lg:pl-20">
              <div class="lg:col-span-4"><p class="m-0 max-w-md text-base leading-relaxed text-black/60">{{ item.description }}</p><ul class="mt-8 list-none space-y-2 p-0 text-sm"><li v-for="(skill,skillIndex) in item.items" :key="skill">/{{ String(skillIndex + 1).padStart(2,'0') }} {{ skill }}</li></ul></div>
              <figure class="m-0 overflow-hidden bg-black/5 lg:col-span-7 lg:col-start-6"><img :src="item.image" :alt="item.alt" loading="lazy" class="aspect-[16/9] h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0" /></figure>
            </div></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
