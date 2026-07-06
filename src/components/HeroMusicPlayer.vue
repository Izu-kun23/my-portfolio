<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'

import {
  extractMp3CoverArt,
  fallbackArtwork,
  revokeArtworkUrl,
} from '@/lib/extractMp3CoverArt'
// import type { Mp3PlayerScene } from '@/lib/mp3Player/createMp3PlayerScene'
import { heroPlaylist, heroTrackSrc } from '@/data/heroPlaylist'

// const containerRef = useTemplateRef<HTMLElement>('containerRef')
const audioRef = useTemplateRef<HTMLAudioElement>('audioRef')

const currentIndex = ref(0)
const isPlaying = ref(false)
const progress = ref(0)
const artworkUrl = ref(fallbackArtwork)

const artworkCache = new Map<string, string>()
// let playerScene: Mp3PlayerScene | null = null

const currentTrack = computed(() => heroPlaylist[currentIndex.value]!)
const currentSrc = computed(() => heroTrackSrc(currentTrack.value.file))
const hasMultipleTracks = heroPlaylist.length > 1
const progressPercent = computed(() => `${Math.round(progress.value * 100)}%`)

async function syncArtwork(src: string) {
  const cached = artworkCache.get(src)
  if (cached) {
    artworkUrl.value = cached
    return
  }

  const explicitArtwork = currentTrack.value.artwork
  const nextUrl = explicitArtwork ?? (await extractMp3CoverArt(src))
  artworkCache.set(src, nextUrl)
  artworkUrl.value = nextUrl
}

watch(currentSrc, (src) => {
  void syncArtwork(src)
})

onMounted(async () => {
  await syncArtwork(currentSrc.value)

  // --- 3D iPod model (disabled) ---
  // await nextTick()
  // if (!containerRef.value) return
  //
  // try {
  //   const { createMp3PlayerScene } = await import('@/lib/mp3Player/createMp3PlayerScene')
  //
  //   playerScene = await createMp3PlayerScene(containerRef.value, {
  //     onToggle: togglePlayback,
  //     onPrev: () => changeTrack(-1),
  //     onNext: () => changeTrack(1),
  //   })
  //
  //   playerScene.updateScreen({ artworkUrl: artworkUrl.value })
  // } catch (error) {
  //   console.error('Failed to initialize iPod player scene:', error)
  // }
})

function updateProgress() {
  const audio = audioRef.value
  if (!audio || !audio.duration) return
  progress.value = audio.currentTime / audio.duration
}

async function playCurrentTrack() {
  const audio = audioRef.value
  if (!audio) return

  try {
    await audio.play()
    isPlaying.value = true
  } catch {
    isPlaying.value = false
  }
}

async function loadTrack(index: number, shouldPlay: boolean) {
  currentIndex.value = index
  progress.value = 0

  await nextTick()

  const audio = audioRef.value
  if (!audio) return

  audio.load()

  if (shouldPlay) {
    await playCurrentTrack()
  } else {
    isPlaying.value = false
  }

  await syncArtwork(currentSrc.value)
}

async function waitForAudioReady(audio: HTMLAudioElement) {
  if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return

  await new Promise<void>((resolve, reject) => {
    const onReady = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(new Error('Audio failed to load'))
    }
    const cleanup = () => {
      audio.removeEventListener('canplay', onReady)
      audio.removeEventListener('error', onError)
    }

    audio.addEventListener('canplay', onReady)
    audio.addEventListener('error', onError)
    audio.load()
  })
}

async function togglePlayback() {
  const audio = audioRef.value
  if (!audio) return

  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
    return
  }

  try {
    await waitForAudioReady(audio)
    await audio.play()
    isPlaying.value = true
  } catch (error) {
    console.error('Playback failed:', error)
    isPlaying.value = false
  }
}

async function changeTrack(delta: number) {
  if (!hasMultipleTracks) return
  const nextIndex = (currentIndex.value + delta + heroPlaylist.length) % heroPlaylist.length
  await loadTrack(nextIndex, isPlaying.value)
}

function onTrackEnded() {
  if (!hasMultipleTracks) {
    isPlaying.value = false
    progress.value = 0
    return
  }

  changeTrack(1)
}

async function onAudioCanPlay() {
  if (!isPlaying.value) return
  await playCurrentTrack()
}

onUnmounted(() => {
  audioRef.value?.pause()
  artworkCache.forEach((url) => revokeArtworkUrl(url))
  // playerScene?.dispose()
  // playerScene = null
})
</script>

<template>
  <div
    class="mp3-player pointer-events-auto absolute right-4 bottom-[10%] z-50 w-[min(18rem,78vw)] md:right-8 lg:right-12"
  >
    <div class="mp3-player__card rounded-2xl p-4">
      <div class="mp3-player__art overflow-hidden rounded-xl">
        <img
          :src="artworkUrl"
          :alt="`${currentTrack.title} cover art`"
          class="aspect-square w-full object-cover"
          width="288"
          height="288"
        />
      </div>

      <div class="mt-4 min-w-0">
        <p class="truncate text-sm font-semibold tracking-tight text-slate-700">
          {{ currentTrack.title }}
        </p>
        <p class="mt-0.5 truncate text-xs text-slate-500">
          {{ currentTrack.artist }}
        </p>
      </div>

      <div class="mt-4">
        <div class="mp3-player__progress h-1.5 overflow-hidden rounded-full">
          <div
            class="mp3-player__progress-fill h-full rounded-full transition-[width] duration-150 ease-linear"
            :style="{ width: progressPercent }"
          />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          class="mp3-player__btn"
          :disabled="!hasMultipleTracks"
          aria-label="Previous track"
          @click="changeTrack(-1)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-4 w-4 fill-current">
            <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
          </svg>
        </button>

        <button
          type="button"
          class="mp3-player__btn mp3-player__btn--primary"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
          @click="togglePlayback"
        >
          <svg
            v-if="isPlaying"
            viewBox="0 0 24 24"
            aria-hidden="true"
            class="h-5 w-5 fill-current"
          >
            <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 fill-current">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </button>

        <button
          type="button"
          class="mp3-player__btn"
          :disabled="!hasMultipleTracks"
          aria-label="Next track"
          @click="changeTrack(1)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-4 w-4 fill-current">
            <path d="M16 18h2V6h-2v12zm-11-7.5L13.5 6v12l-8.5-6z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 3D model viewport (disabled) -->
    <!-- <div ref="containerRef" class="mp3-player__viewport" /> -->

    <audio
      ref="audioRef"
      :src="currentSrc"
      preload="metadata"
      @timeupdate="updateProgress"
      @ended="onTrackEnded"
      @canplay="onAudioCanPlay"
    />
  </div>
</template>

<style scoped>
.mp3-player__card {
  background: linear-gradient(
    155deg,
    rgb(255 255 255 / 0.34) 0%,
    rgb(226 232 240 / 0.14) 42%,
    rgb(203 213 225 / 0.1) 100%
  );
  backdrop-filter: blur(36px) saturate(115%) brightness(1.06);
  -webkit-backdrop-filter: blur(36px) saturate(115%) brightness(1.06);
  border: 1px solid rgb(148 163 184 / 0.45);
  box-shadow:
    0 18px 50px rgb(15 23 42 / 0.1),
    inset 0 0 0 1px rgb(255 255 255 / 0.55),
    inset 0 1px 1px rgb(255 255 255 / 0.82),
    inset 0 -1px 1px rgb(148 163 184 / 0.22);
}

.mp3-player__art {
  border: 1px solid rgb(148 163 184 / 0.4);
  box-shadow:
    0 6px 20px rgb(15 23 42 / 0.08),
    inset 0 0 0 1px rgb(255 255 255 / 0.45);
}

.mp3-player__progress {
  background: linear-gradient(
    180deg,
    rgb(255 255 255 / 0.22) 0%,
    rgb(226 232 240 / 0.12) 100%
  );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgb(148 163 184 / 0.38);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.35);
}

.mp3-player__progress-fill {
  background: linear-gradient(90deg, rgb(100 116 139 / 0.85), rgb(148 163 184 / 0.95));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.35);
}

.mp3-player__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid rgb(148 163 184 / 0.42);
  border-radius: 9999px;
  background: linear-gradient(
    165deg,
    rgb(255 255 255 / 0.34) 0%,
    rgb(226 232 240 / 0.16) 100%
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #475569;
  box-shadow:
    0 2px 12px rgb(15 23 42 / 0.07),
    inset 0 0 0 1px rgb(255 255 255 / 0.5),
    inset 0 1px 0 rgb(255 255 255 / 0.72);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.mp3-player__btn:hover:not(:disabled) {
  background: linear-gradient(
    165deg,
    rgb(255 255 255 / 0.48) 0%,
    rgb(241 245 249 / 0.28) 100%
  );
  color: #334155;
  border-color: rgb(100 116 139 / 0.5);
  box-shadow:
    0 4px 16px rgb(15 23 42 / 0.1),
    inset 0 0 0 1px rgb(255 255 255 / 0.62),
    inset 0 1px 0 rgb(255 255 255 / 0.85);
  transform: translateY(-1px);
}

.mp3-player__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mp3-player__btn--primary {
  width: 3rem;
  height: 3rem;
}
</style>
