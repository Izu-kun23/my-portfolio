<script setup lang="ts">
import mobilePreview from '@/assets/portfolio2.png'
import webPreview from '@/assets/portfolio.png'

const capabilities = [
  {
    number: '01',
    title: 'Frontend engineering',
    description: 'Responsive product interfaces built for clarity, accessibility, speed, and maintainable growth.',
    items: ['Vue and React', 'TypeScript', 'Design systems', 'Motion and interaction', 'Performance'],
    image: webPreview,
    alt: 'A selection of responsive interfaces designed and engineered by Izuchukwu',
  },
  {
    number: '02',
    title: 'Product development',
    description: 'End-to-end web products shaped from early requirements through architecture, implementation, and deployment.',
    items: ['Product architecture', 'APIs and databases', 'Authentication', 'Internal tools', 'Cloud deployment'],
    image: mobilePreview,
    alt: 'Mobile product interface work by Izuchukwu',
  },
  {
    number: '03',
    title: 'Automation and systems',
    description: 'Reliable workflows that connect services, surface operational health, and reduce repetitive work.',
    items: ['Service integration', 'Monitoring', 'Email automation', 'Operational tooling', 'Quality assurance'],
    image: webPreview,
    alt: 'Operational web systems engineered by Izuchukwu',
  },
]
</script>

<template>
  <section id="capabilities" class="editorial-section bg-[var(--ink)] px-5 text-[var(--paper)] sm:px-8 lg:px-14">
    <div class="mx-auto max-w-[1600px]">
      <header data-reveal class="mb-24 grid gap-6 border-t border-white/20 pt-4 lg:grid-cols-12">
        <p class="m-0 text-xs uppercase tracking-[0.08em] lg:col-span-3">Capabilities</p>
        <h2 class="m-0 text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] font-light tracking-[-0.065em] lg:col-span-8">
          From idea to working system.
        </h2>
      </header>

      <article
        v-for="(capability, index) in capabilities"
        :key="capability.title"
        data-reveal
        class="grid gap-8 border-t border-white/20 py-12 lg:grid-cols-12 lg:items-center lg:py-20"
      >
        <div class="lg:col-span-5" :class="index % 2 === 0 ? 'lg:order-1' : 'lg:order-2 lg:col-start-8'">
          <span class="text-xs text-white/55">{{ capability.number }}</span>
          <h3 class="mt-5 mb-0 text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.9] font-light tracking-[-0.055em]">{{ capability.title }}</h3>
          <p class="mt-6 mb-0 max-w-lg text-base leading-relaxed text-white/58">{{ capability.description }}</p>
          <ul class="mt-10 grid list-none grid-cols-2 gap-x-5 gap-y-3 p-0 text-sm text-white/74">
            <li v-for="item in capability.items" :key="item">{{ item }}</li>
          </ul>
        </div>

        <figure
          data-image-reveal
          class="overflow-hidden bg-white/5 lg:col-span-7"
          :class="index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'"
        >
          <img :src="capability.image" :alt="capability.alt" loading="lazy" decoding="async" class="aspect-[4/3] h-full w-full object-cover grayscale" />
        </figure>
      </article>
    </div>
  </section>
</template>
