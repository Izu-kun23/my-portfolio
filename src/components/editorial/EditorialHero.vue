<template>
  <section id="home" class="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
    <div class="mx-auto flex min-h-[100svh] max-w-[1800px] flex-col px-4 pt-24 pb-5 sm:px-7 lg:px-12">
      <div class="relative flex flex-1 items-center justify-center py-20">
        <h1 class="relative z-10 m-0 text-center text-[clamp(4.6rem,13vw,13.5rem)] leading-[0.76] font-medium tracking-[-0.085em] uppercase">
          <span class="block overflow-hidden"><span data-hero-word class="block">Build what</span></span>
          <span class="block overflow-hidden"><span data-hero-word class="block">moves</span></span>
          <span class="block overflow-hidden"><span data-hero-word class="block">people</span></span>
        </h1>
      </div>
      <div data-hero-meta class="relative z-20 grid gap-5 border-t border-white/25 pt-4 text-xs uppercase tracking-[0.08em] sm:grid-cols-3">
        <p class="m-0">Software engineer<br />Digital product builder</p>
        <p class="m-0 sm:text-center">Independent practice<br />Selected work 2024–2026</p>
        <div class="flex items-end justify-between gap-5 sm:justify-end">
          <a href="https://github.com/Izu-kun23" target="_blank" rel="noreferrer" class="editorial-link">Github</a>
          <a href="#work" class="editorial-link">Scroll to work ↓</a>
        </div>
      </div>
    </div>
  </section>
</template>
