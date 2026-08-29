export const contactDetails = {
  availability: 'Available for select projects',
  headline: 'Have an Idea you want to bring to life?',
  subtext:
    'Tell me what you are making and where it should go — I will bring the engineering and the polish.',
  email: 'Izuchukwuonuoha6@gmail.com',
  location: 'United Kingdom',
  name: 'Izuchukwu Tony',
}

export interface ContactFormPayload {
  name: string
  email: string
  message: string
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error'
