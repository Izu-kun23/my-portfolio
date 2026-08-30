<script setup lang="ts">
const words = 'I turn complex requirements into digital products that feel clear, useful, and considered. Engineering gives the work structure. Design gives it momentum.'.split(' ')
const facts = [{ value: '05', label: 'Selected products' },{ value: '03', label: 'Core capabilities' },{ value: '01', label: 'Point of contact' }]
</script>

<template>
  <section id="about" class="bg-[var(--ink)] px-4 py-28 text-[var(--paper)] sm:px-7 md:py-44 lg:px-12">
    <div class="mx-auto max-w-[1800px]">
      <p class="mb-10 text-base font-medium uppercase tracking-[.08em]">What drives the work</p>
      <h2 data-word-reveal class="m-0 max-w-[1500px] text-[clamp(2.8rem,7.4vw,8rem)] leading-[.98] font-medium tracking-[-.06em]">
        <span v-for="(word,index) in words" :key="`${word}-${index}`" data-word class="mr-[.22em] inline-block text-white/18">{{ word }}</span>
      </h2>
      <div class="mt-28 grid border-t border-white/25 md:grid-cols-3">
        <div v-for="fact in facts" :key="fact.label" data-reveal class="border-b border-white/25 py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
          <strong class="block text-[clamp(4rem,9vw,9rem)] leading-none font-medium tracking-[-.07em]">{{ fact.value }}</strong>
          <span class="mt-4 block text-base font-medium uppercase tracking-[.07em] text-white/78">{{ fact.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
