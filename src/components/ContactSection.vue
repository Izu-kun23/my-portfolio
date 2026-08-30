<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue'

import { useSectionContentReveal } from '@/composables/useSectionContentReveal'
import { contactDetails, type ContactFormStatus } from '@/data/contact'
import { socialLinks } from '@/data/socialLinks'
import { submitContactForm } from '@/lib/submitContactForm'

const contentRef = useTemplateRef<HTMLElement>('contentRef')
const eyebrowRef = useTemplateRef<HTMLElement>('eyebrowRef')

const form = reactive({
  name: '',
  email: '',
  message: '',
  honeypot: '',
})

const status = ref<ContactFormStatus>('idle')
const errorMessage = ref('')

const reveal = useSectionContentReveal({
  contentRef,
  scrambleRef: eyebrowRef,
  scrambleText: '/CONTACT',
})

function resetForm() {
  form.name = ''
  form.email = ''
  form.message = ''
  form.honeypot = ''
}

async function handleSubmit() {
  if (status.value === 'submitting') return
  if (form.honeypot.trim()) return

  errorMessage.value = ''

  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    errorMessage.value = 'Please fill in your name, email, and message.'
    status.value = 'error'
    return
  }

  status.value = 'submitting'

  try {
    await submitContactForm({
      name: form.name,
      email: form.email,
      message: form.message,
    })
    status.value = 'success'
    resetForm()
  } catch (error) {
    status.value = 'error'
    errorMessage.value =
      error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  }
}

defineExpose({ reveal })
</script>

<template>
  <section
    id="contact"
    class="flex min-h-svh w-full flex-col overflow-hidden bg-[#f4f4f1] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pb-20 md:px-12 md:pt-28 lg:px-20 lg:pt-32"
  >
    <div ref="contentRef" class="section-content mx-auto w-full max-w-7xl">
      <p ref="eyebrowRef" class="m-0 text-xs tracking-[0.14em] text-[#737373] uppercase sm:text-sm">
        /Contact
      </p>
      <h2 class="m-0 mt-6 text-[clamp(4rem,13.5vw,12rem)] leading-[0.76] font-semibold tracking-[-0.075em] text-[#000000] uppercase">
        Let’s work<br />together.
      </h2>

      <div class="mt-20 grid gap-14 border-t border-black/20 pt-10 md:grid-cols-12 md:gap-x-12 lg:mt-28 lg:gap-x-16">
        <div class="md:col-span-5">
          <p class="m-0 font-mono text-[0.65rem] tracking-[0.18em] text-black/40 uppercase">
            {{ contactDetails.availability }}
          </p>

          <p class="section-subtext section-subtext--light">
            {{ contactDetails.subtext }}
          </p>

          <p class="m-0 mt-5 text-lg leading-snug font-semibold tracking-tight text-black md:text-xl">
            {{ contactDetails.headline }}
          </p>

          <div class="mt-8 flex flex-col gap-3.5 text-base text-black/60 sm:text-lg">
            <a
              :href="`mailto:${contactDetails.email}`"
              class="inline-flex w-fit items-center gap-2 font-semibold text-black transition-opacity hover:opacity-70"
            >
              {{ contactDetails.email }}
            </a>
            <span class="font-medium">{{ contactDetails.location }}</span>
          </div>

          <nav aria-label="Social profiles" class="mt-10 flex flex-col border-t border-black/15">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between border-b border-black/15 py-4 text-sm font-semibold tracking-[0.08em] text-black uppercase"
            >
              {{ link.label }}
              <svg class="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 12.5l9-9m0 0H6m6.5 0V10" stroke="currentColor" stroke-width="1.4" />
              </svg>
            </a>
          </nav>
        </div>

        <div class="md:col-span-7 md:pt-2">
          <form
            class="flex flex-col gap-6 sm:gap-7"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div class="grid gap-6 sm:grid-cols-2 sm:gap-7">
              <label class="flex flex-col gap-2.5">
                <span class="text-base font-medium text-black/70">Name</span>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  autocomplete="name"
                  required
                  class="min-h-14 rounded-2xl border border-black/15 bg-[#f4f4f1] px-5 text-base text-black outline-none transition-[border-color,box-shadow] focus:border-black focus:ring-2 focus:ring-black/10 sm:min-h-16 sm:px-6"
                  placeholder="Your name"
                />
              </label>

              <label class="flex flex-col gap-2.5">
                <span class="text-base font-medium text-black/70">Email</span>
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  required
                  class="min-h-14 rounded-2xl border border-black/15 bg-[#f4f4f1] px-5 text-base text-black outline-none transition-[border-color,box-shadow] focus:border-black focus:ring-2 focus:ring-black/10 sm:min-h-16 sm:px-6"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label class="flex flex-col gap-2.5">
              <span class="text-base font-medium text-black/70">Message</span>
              <textarea
                v-model="form.message"
                name="message"
                required
                rows="8"
                class="min-h-[12rem] resize-y rounded-2xl border border-black/15 bg-[#f4f4f1] px-5 py-4 text-base leading-relaxed text-black outline-none transition-[border-color,box-shadow] focus:border-black focus:ring-2 focus:ring-black/10 sm:min-h-[14rem] sm:px-6 sm:py-5"
                placeholder="Tell me about your project, timeline, and goals."
              />
            </label>

            <input
              v-model="form.honeypot"
              type="text"
              name="_honey"
              tabindex="-1"
              autocomplete="off"
              class="hidden"
              aria-hidden="true"
            />

            <div class="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                class="inline-flex min-h-14 items-center justify-center rounded-full bg-black px-9 py-3.5 text-base font-medium text-[#f4f4f1] transition-[background-color,opacity] hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-16 sm:px-10"
                :disabled="status === 'submitting'"
              >
                {{ status === 'submitting' ? 'Sending…' : 'Send message' }}
              </button>

              <p
                v-if="status === 'success'"
                class="m-0 text-sm font-medium text-black"
                role="status"
              >
                Message sent. I will get back to you soon.
              </p>

              <p
                v-else-if="status === 'error' && errorMessage"
                class="m-0 text-sm text-black"
                role="alert"
              >
                {{ errorMessage }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
