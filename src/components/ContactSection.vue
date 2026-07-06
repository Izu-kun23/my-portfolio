<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue'

import { useSectionContentReveal } from '@/composables/useSectionContentReveal'
import { contactDetails, type ContactFormStatus } from '@/data/contact'
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
    class="flex h-full min-h-0 w-full flex-col justify-center overflow-hidden bg-white px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6.5rem+env(safe-area-inset-top))] md:px-12 md:pt-28 lg:px-20 lg:pt-32"
  >
    <div ref="contentRef" class="section-content mx-auto w-full max-w-6xl pt-6 sm:pt-8 md:pt-10">
      <div class="grid gap-12 md:grid-cols-12 md:gap-x-12 lg:gap-x-16">
        <div class="md:col-span-5">
          <p class="m-0 font-mono text-[0.65rem] tracking-[0.18em] text-gray-400 uppercase">
            {{ contactDetails.availability }}
          </p>

          <h2
            ref="eyebrowRef"
            class="m-0 mt-4 text-[clamp(2rem,5.5vw,3rem)] leading-[1.05] font-bold tracking-tight text-gray-900 uppercase"
          >
            /CONTACT
          </h2>

          <p class="section-subtext section-subtext--light">
            {{ contactDetails.subtext }}
          </p>

          <p class="m-0 mt-5 text-lg leading-snug font-semibold tracking-tight text-gray-900 md:text-xl">
            {{ contactDetails.headline }}
          </p>

          <div class="mt-8 flex flex-col gap-3.5 text-base text-gray-600 sm:text-lg">
            <a
              :href="`mailto:${contactDetails.email}`"
              class="inline-flex w-fit items-center gap-2 font-semibold text-gray-900 transition-opacity hover:opacity-70"
            >
              {{ contactDetails.email }}
            </a>
            <span class="font-medium">{{ contactDetails.location }}</span>
          </div>
        </div>

        <div class="md:col-span-7 md:pt-2">
          <form
            class="flex flex-col gap-6 sm:gap-7"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div class="grid gap-6 sm:grid-cols-2 sm:gap-7">
              <label class="flex flex-col gap-2.5">
                <span class="text-base font-medium text-gray-700">Name</span>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  autocomplete="name"
                  required
                  class="min-h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 sm:min-h-16 sm:px-6"
                  placeholder="Your name"
                />
              </label>

              <label class="flex flex-col gap-2.5">
                <span class="text-base font-medium text-gray-700">Email</span>
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  required
                  class="min-h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 sm:min-h-16 sm:px-6"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label class="flex flex-col gap-2.5">
              <span class="text-base font-medium text-gray-700">Message</span>
              <textarea
                v-model="form.message"
                name="message"
                required
                rows="8"
                class="min-h-[12rem] resize-y rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base leading-relaxed text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 sm:min-h-[14rem] sm:px-6 sm:py-5"
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
                class="inline-flex min-h-14 items-center justify-center rounded-full bg-gray-900 px-9 py-3.5 text-base font-medium text-white transition-[background-color,opacity] hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-16 sm:px-10"
                :disabled="status === 'submitting'"
              >
                {{ status === 'submitting' ? 'Sending…' : 'Send message' }}
              </button>

              <p
                v-if="status === 'success'"
                class="m-0 text-sm font-medium text-gray-900"
                role="status"
              >
                Message sent. I will get back to you soon.
              </p>

              <p
                v-else-if="status === 'error' && errorMessage"
                class="m-0 text-sm text-red-600"
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
