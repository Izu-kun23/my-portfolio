export const contactDetails = {
  availability: 'Available for select projects',
  headline: 'Have an Idea you want to bring to life?',
  subtext:
    'Tell me what you are making and where it should go — I will bring the engineering and the polish.',
  email: 'izuchukwutony18@gmail.com',
  location: 'United Kingdom',
  name: 'Izuchukwu Tony',
  collaborationCallUrl: 'https://cal.com/izuchukwu-tony/collaboration-call',
}

export const collaborationOffers = [
  'Build a new solution.',
  'Automate your business.',
  'Create a custom system.',
  'Bring your idea to life.',
] as const

export const contactPrompts = [
  'Got a million dollar idea?',
  'Want to collaborate?',
  'Have a project in mind?',
  'Let’s make something together.',
  'Tell me what you’re building.',
  'Ready to start a conversation?',
] as const

export interface ContactFormPayload {
  name: string
  email: string
  message: string
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error'
