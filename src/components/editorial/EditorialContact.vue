<script setup lang="ts">
import { reactive, shallowRef } from 'vue'
import { contactDetails, type ContactFormStatus } from '@/data/contact'
import { submitContactForm } from '@/lib/submitContactForm'
const form = reactive({ name:'', email:'', message:'', honeypot:'' })
const status = shallowRef<ContactFormStatus>('idle')
const error = shallowRef('')
async function handleSubmit() {
  if (status.value === 'submitting' || form.honeypot) return
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { status.value = 'error'; error.value = 'Please complete every field.'; return }
  status.value = 'submitting'; error.value = ''
  try { await submitContactForm(form); status.value = 'success'; form.name=''; form.email=''; form.message='' }
  catch (cause) { status.value = 'error'; error.value = cause instanceof Error ? cause.message : 'Unable to send your message.' }
}
</script>
<template>
  <section id="contact" class="bg-[var(--ink)] px-4 py-28 text-[var(--paper)] sm:px-7 md:py-40 lg:px-12">
    <div class="mx-auto max-w-[1800px]">
      <header class="grid gap-8 lg:grid-cols-12"><div class="lg:col-span-5"><p class="m-0 text-base font-medium uppercase tracking-[.08em]">Start a conversation</p><h2 class="mt-8 mb-0 text-[clamp(4rem,9vw,10rem)] leading-[.78] tracking-[-.075em] uppercase">Tell me<br />about it</h2></div><p class="m-0 max-w-lg self-end text-xl leading-relaxed text-white/82 lg:col-span-4 lg:col-start-8">{{ contactDetails.subtext }}</p></header>
      <form class="mt-20 grid gap-x-8 gap-y-10 border-t border-white/30 pt-10 lg:grid-cols-2" novalidate @submit.prevent="handleSubmit">
        <label class="form-field"><span>Full name</span><input v-model="form.name" name="name" autocomplete="name" placeholder="Your name" /></label>
        <label class="form-field"><span>Email address</span><input v-model="form.email" name="email" type="email" autocomplete="email" placeholder="you@example.com" /></label>
        <label class="form-field lg:col-span-2"><span>Tell me about your project</span><textarea v-model="form.message" name="message" rows="4" placeholder="Goals, scope, timing" /></label>
        <input v-model="form.honeypot" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
        <div class="flex flex-wrap items-center gap-6 lg:col-span-2"><button type="submit" class="min-h-14 border border-white px-8 text-sm uppercase tracking-[.08em] transition-colors hover:bg-white hover:text-[var(--ink)] disabled:opacity-50" :disabled="status === 'submitting'">{{ status === 'submitting' ? 'Sending' : 'Send enquiry ↗' }}</button><p v-if="status === 'success'" class="m-0 text-sm" role="status">Message sent. I will be in touch.</p><p v-else-if="status === 'error'" class="m-0 text-sm" role="alert">{{ error }}</p></div>
      </form>
    </div>
  </section>
</template>
<style scoped>
.form-field{display:flex;flex-direction:column;gap:1rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}.form-field input,.form-field textarea{width:100%;border:0;border-bottom:1px solid rgb(255 255 255/.35);border-radius:0;background:transparent;padding:.3rem 0 1rem;color:var(--paper);font:inherit;font-size:clamp(1.5rem,3vw,2.8rem);text-transform:none;letter-spacing:-.035em;outline:none}.form-field input::placeholder,.form-field textarea::placeholder{color:rgb(255 255 255/.42)}.form-field input:focus,.form-field textarea:focus{border-color:var(--paper)}
</style>
