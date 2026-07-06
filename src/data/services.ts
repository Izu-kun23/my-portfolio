import mobilePreview from '@/assets/portfolio2.png'
import webPreview from '@/assets/portfolio.png'

export interface ServiceItem {
  id: string
  label: string
  description: string
  image: string
  imageAlt: string
}

export const servicesSectionIntro = {
  title: '/SERVICES',
  backgroundTitle: 'SERVICES',
  subtext:
    'Capabilities I bring to every project — from first sketch to shipped product.',
}

export const services: ServiceItem[] = [
  {
    id: 'frontend',
    label: 'FRONTEND ENGINEERING',
    description:
      'Building fast, accessible interfaces with modern frameworks, polished interactions, and performance-first architecture.',
    image: webPreview,
    imageAlt: 'Frontend engineering project preview',
  },
  {
    id: 'fullstack',
    label: 'FULLSTACK DEVELOPMENT',
    description:
      'Designing and shipping end-to-end products — from database and APIs to responsive UI and deployment.',
    image: mobilePreview,
    imageAlt: 'Fullstack development project preview',
  },
  {
    id: 'mobile',
    label: 'MOBILE APP DEVELOPMENT',
    description:
      'Creating native-feeling mobile experiences with smooth navigation, offline-ready flows, and scalable app structure.',
    image: mobilePreview,
    imageAlt: 'Mobile app development project preview',
  },
  {
    id: 'integration',
    label: 'SOFTWARE INTEGRATION',
    description:
      'Connecting platforms, APIs, and internal tools into reliable workflows that automate work and reduce manual overhead.',
    image: webPreview,
    imageAlt: 'Software integration project preview',
  },
]
