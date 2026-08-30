<script setup lang="ts">
import { contactDetails } from '@/data/contact'
import { socialLinks } from '@/data/socialLinks'
</script>

<template>
  <section id="contact" class="relative min-h-[90svh] bg-[var(--paper)] px-5 py-24 sm:px-8 md:py-36 lg:px-14">
    <div class="mx-auto flex min-h-[65svh] max-w-[1600px] flex-col">
      <div data-reveal class="flex items-center justify-between border-t border-black/20 pt-4 text-xs uppercase tracking-[0.08em]">
        <span>{{ contactDetails.availability }}</span>
        <span>{{ contactDetails.location }}</span>
      </div>

      <div class="my-auto py-20">
        <p data-reveal class="m-0 text-sm text-black/55">Have an idea worth building?</p>
        <a
          data-reveal
          :href="`mailto:${contactDetails.email}`"
          class="contact-link group mt-5 block text-[clamp(4.2rem,13vw,13rem)] leading-[0.8] font-light tracking-[-0.075em]"
        >
          LET'S WORK<br />TOGETHER
          <span class="mt-7 block h-px origin-left scale-x-0 bg-black transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
        </a>
      </div>

      <div data-reveal class="grid gap-8 border-t border-black/20 pt-5 text-sm sm:grid-cols-2">
        <a :href="`mailto:${contactDetails.email}`" class="editorial-link break-all">{{ contactDetails.email }}</a>
        <div class="flex gap-6 sm:justify-end">
          <a v-for="social in socialLinks" :key="social.label" :href="social.href" target="_blank" rel="noreferrer" class="editorial-link">{{ social.label }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
