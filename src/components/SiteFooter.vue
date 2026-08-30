<script setup lang="ts">
import { contactDetails } from '@/data/contact'
import { socialLinks } from '@/data/socialLinks'

const footerNavigation = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#story' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#about' },
  { label: 'Capabilities', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer overflow-hidden bg-[#000000] text-[#f4f4f1]">
    <div class="px-4 pt-12 sm:px-6 sm:pt-16 md:px-12 lg:px-20 lg:pt-20">
      <div class="grid gap-12 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
        <div class="min-w-0 md:col-span-5 lg:col-span-6">
          <nav aria-label="Social links" class="flex gap-2.5">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
              class="group inline-flex size-12 items-center justify-center rounded-full border border-[#f4f4f1]/50 text-[#f4f4f1] transition-colors hover:bg-[#f4f4f1] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] sm:size-14"
            >
              <svg v-if="link.icon === 'github'" class="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
              <svg v-else class="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 0 1 2.063-2.063 2.062 2.062 0 0 1 2.064 2.063 2.062 2.062 0 0 1-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
          </nav>

          <address class="mt-8 flex min-w-0 flex-col gap-3 text-sm leading-relaxed not-italic text-[#f4f4f1]/75 sm:mt-10 sm:text-base">
            <span>{{ contactDetails.location }}</span>
            <a
              :href="`mailto:${contactDetails.email}`"
              class="w-fit max-w-full break-all text-[#f4f4f1]/75 transition-colors hover:text-[#f4f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f1]"
            >
              {{ contactDetails.email }}
            </a>
          </address>
        </div>

        <div class="grid grid-cols-2 gap-8 md:col-span-7 lg:col-span-6">
          <nav aria-label="Footer navigation">
            <p class="m-0 text-xs font-medium tracking-[0.12em] text-[#f4f4f1]/45 uppercase">Menu</p>
            <ul class="mt-4 space-y-3 text-base sm:text-lg">
              <li v-for="item in footerNavigation" :key="item.label">
                <a
                  :href="item.href"
                  class="text-[#f4f4f1]/75 transition-colors hover:text-[#f4f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f1]"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p class="m-0 text-xs font-medium tracking-[0.12em] text-[#f4f4f1]/45 uppercase">Connect</p>
            <ul class="mt-4 space-y-3 text-base sm:text-lg">
              <li v-for="link in socialLinks" :key="link.label">
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#f4f4f1]/75 transition-colors hover:text-[#f4f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f1]"
                >
                  {{ link.label }}
                </a>
              </li>
              <li>
                <a
                  :href="`mailto:${contactDetails.email}`"
                  class="text-[#f4f4f1]/75 transition-colors hover:text-[#f4f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f1]"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="relative mt-14 border-t border-[#f4f4f1]/35 sm:mt-20">
        <a
          :href="`mailto:${contactDetails.email}`"
          class="absolute top-0 right-0 inline-flex min-h-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#f4f4f1] px-6 text-sm font-medium text-black transition-colors hover:bg-[#f4f4f1]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] sm:px-8 sm:text-base"
        >
          Start a project
        </a>
      </div>

      <div class="grid gap-6 pt-12 text-sm text-[#f4f4f1]/45 sm:grid-cols-2 sm:items-end sm:pt-14 md:grid-cols-12 md:text-base">
        <p class="m-0 max-w-md leading-relaxed sm:col-span-1 md:col-span-6">
          Designed and built with care.
        </p>
        <a href="#hero" class="w-fit text-[#f4f4f1]/65 transition-colors hover:text-[#f4f4f1] sm:justify-self-end md:col-span-3">
          Back to top ↑
        </a>
        <p class="m-0 sm:text-right md:col-span-3">© {{ currentYear }} {{ contactDetails.name }}</p>
      </div>
    </div>

    <div class="mt-10 overflow-hidden px-1 sm:mt-12 sm:px-2 md:mt-14">
      <p
        class="site-footer__name m-0 translate-y-[0.08em] text-center text-[clamp(3.15rem,14.6vw,14rem)] leading-[0.72] font-bold tracking-[-0.075em] whitespace-nowrap text-[#666666] uppercase"
      >
        Izuchukwu
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: 2;
  padding-bottom: env(safe-area-inset-bottom);
}

.site-footer__name {
  text-rendering: geometricPrecision;
}
</style>
