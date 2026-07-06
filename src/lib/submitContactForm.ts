import { contactDetails, type ContactFormPayload } from '@/data/contact'

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(contactDetails.email)}`

interface FormSubmitResponse {
  success: string
  message?: string
}

export async function submitContactForm(payload: ContactFormPayload): Promise<void> {
  const response = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
      _subject: `Portfolio contact from ${payload.name.trim()}`,
      _captcha: 'false',
      _template: 'table',
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to send your message right now. Please try again.')
  }

  const data = (await response.json()) as FormSubmitResponse

  if (data.success !== 'true') {
    throw new Error(data.message ?? 'Unable to send your message right now. Please try again.')
  }
}
