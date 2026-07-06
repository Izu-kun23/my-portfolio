<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'

import ExperienceDetailModal from '@/components/ExperienceDetailModal.vue'
import ExperienceListItem from '@/components/ExperienceListItem.vue'
import { useExperienceCardModal } from '@/composables/useExperienceCardModal'
import { useSectionContentReveal } from '@/composables/useSectionContentReveal'
import { aboutIntro, aboutStats, experienceEntries, type ExperienceEntry } from '@/data/about'

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const eyebrowRef = useTemplateRef<HTMLElement>('eyebrowRef')
const listItemRefs = useTemplateRef<(HTMLElement | null)[]>('listItemRefs')
const overlayRef = useTemplateRef<HTMLElement>('overlayRef')
const shellRef = useTemplateRef<HTMLElement>('shellRef')
const flipRef = useTemplateRef<HTMLElement>('flipRef')

const isModalOpen = ref(false)

const experienceStat = computed(
  () => `${aboutStats[0]?.value ?? ''} ${aboutStats[0]?.label?.toLowerCase() ?? 'years of experience'}`,
)

const { selectedEntry, showBackFace, openFromCard, closeModal } = useExperienceCardModal(
  isModalOpen,
  { overlayRef, shellRef, flipRef },
)

function handleOpenEntry(entry: ExperienceEntry, element: HTMLElement) {
  openFromCard(entry, element)
}

const reveal = useSectionContentReveal({
  contentRef: sectionRef,
  scrambleRef: eyebrowRef,
  scrambleText: '/EXPERIENCE',
  itemRefs: listItemRefs,
})

defineExpose({ reveal })
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="experience-section relative w-full bg-gray-900"
  >
    <div
      class="section-content px-4 pt-[calc(3.5rem+env(safe-area-inset-top))] pb-14 sm:px-6 sm:pb-16 md:px-12 md:pb-20 lg:px-20 lg:pb-24"
    >
      <div class="mx-auto w-full max-w-6xl">
        <div class="relative overflow-hidden">
          <p
            class="pointer-events-none absolute top-1/2 left-0 m-0 -translate-y-[42%] select-none text-[clamp(3.75rem,16vw,10.5rem)] leading-none font-bold tracking-tight text-gray-800 uppercase"
            aria-hidden="true"
          >
            EXPERIENCE
          </p>

          <div
            class="relative flex flex-col gap-4 border-b border-gray-800 pt-12 pb-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pt-16 sm:pb-9 lg:pt-20 lg:pb-10"
          >
            <div class="relative z-10 min-w-0">
              <h2
                ref="eyebrowRef"
                class="m-0 text-[clamp(2.25rem,8vw,2.75rem)] leading-[1.05] font-bold tracking-tight text-white uppercase md:text-[clamp(2rem,3.5vw,2.75rem)]"
              >
                /EXPERIENCE
              </h2>
              <p class="section-subtext section-subtext--dark">
                {{ aboutIntro.experienceSubtext }}
              </p>
            </div>

            <p
              class="relative z-10 m-0 shrink-0 text-sm tracking-tight text-gray-400 sm:pt-1 sm:text-[0.9375rem]"
            >
              {{ experienceStat }}
            </p>
          </div>
        </div>

        <ol class="m-0 flex list-none flex-col p-0">
          <li
            v-for="entry in experienceEntries"
            :key="entry.id"
            ref="listItemRefs"
            class="experience-list-item border-b border-gray-800"
          >
            <ExperienceListItem
              :entry="entry"
              :disabled="isModalOpen"
              @open="handleOpenEntry"
            />
          </li>
        </ol>
      </div>
    </div>

    <Teleport to="body">
      <div
        ref="overlayRef"
        class="experience-modal-overlay invisible fixed inset-0 z-[100] bg-black/70 opacity-0 backdrop-blur-sm"
        :class="isModalOpen ? 'pointer-events-auto' : 'pointer-events-none'"
        data-lenis-prevent
        aria-hidden="true"
        @click="closeModal"
      />

      <div
        ref="shellRef"
        class="experience-modal-shell invisible fixed z-[101] rounded-[1.75rem] opacity-0 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.65)] will-change-transform"
        :class="isModalOpen ? 'pointer-events-auto' : 'pointer-events-none'"
        data-lenis-prevent
        style="perspective: 1200px"
        role="dialog"
        aria-modal="true"
        :aria-hidden="!isModalOpen"
        :aria-label="selectedEntry ? `${selectedEntry.company} experience details` : undefined"
        @click.stop
      >
        <div ref="flipRef" class="w-full" style="transform-style: preserve-3d">
          <ExperienceDetailModal
            v-if="selectedEntry"
            :entry="selectedEntry"
            :show-back-face="showBackFace"
            @close="closeModal"
          />
        </div>
      </div>
    </Teleport>
  </section>
</template>
