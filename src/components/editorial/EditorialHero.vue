<script setup lang="ts">
import { workProjects } from '@/data/work'
const tiles = [workProjects[2], workProjects[0], workProjects[1], workProjects[3], workProjects[4]]
</script>

<template>
  <section id="home" class="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
    <div class="mx-auto flex min-h-[100svh] max-w-[1800px] flex-col px-4 pt-24 pb-5 sm:px-7 lg:px-12">
      <div class="relative flex flex-1 items-center justify-center py-20">
        <figure v-for="(project, index) in tiles" :key="project.id" data-hero-tile :class="`hero-shot hero-shot--${index + 1}`">
          <img :src="project.image" alt="" class="h-full w-full object-cover" />
        </figure>
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

<style scoped>
.hero-shot{position:absolute;overflow:hidden;background:#20201f;box-shadow:0 24px 80px rgb(0 0 0/.42)}
.hero-shot--1{width:clamp(7rem,14vw,14rem);aspect-ratio:3/4;left:2%;top:11%;transform:rotate(-7deg)}
.hero-shot--2{width:clamp(8rem,17vw,18rem);aspect-ratio:4/3;right:4%;top:8%;transform:rotate(5deg)}
.hero-shot--3{width:clamp(7rem,13vw,13rem);aspect-ratio:3/4;left:15%;bottom:8%;transform:rotate(4deg)}
.hero-shot--4{width:clamp(8rem,17vw,17rem);aspect-ratio:4/3;right:15%;bottom:5%;transform:rotate(-5deg)}
.hero-shot--5{width:clamp(6rem,10vw,10rem);aspect-ratio:1;left:46%;top:4%;transform:rotate(3deg)}
@media(max-width:639px){.hero-shot--1{left:-12%;top:12%}.hero-shot--2{right:-15%;top:16%}.hero-shot--3{left:-5%;bottom:12%}.hero-shot--4{right:-10%;bottom:10%}.hero-shot--5{left:40%;top:7%}}
</style>
