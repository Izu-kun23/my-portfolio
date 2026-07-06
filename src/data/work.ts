import calayaPreview from '@/assets/work/calaya/preview.png'
import calayaServices from '@/assets/work/calaya/services.png'
import calayaServicesMenu from '@/assets/work/calaya/services-menu.png'
import calayaStrengths from '@/assets/work/calaya/strengths.png'
import kentoksCart from '@/assets/work/kentoks-kitchen/cart.png'
import kentoksCategories from '@/assets/work/kentoks-kitchen/categories.png'
import kentoksHero from '@/assets/work/kentoks-kitchen/hero.png'
import kentoksMenu from '@/assets/work/kentoks-kitchen/menu.png'
import kentoksPreview from '@/assets/work/kentoks-kitchen/preview.png'
import rootsGallery from '@/assets/work/roots-restaurants/gallery.png'
import rootsMenu from '@/assets/work/roots-restaurants/menu.png'
import rootsPreview from '@/assets/work/roots-restaurants/preview.png'
import rootsReservations from '@/assets/work/roots-restaurants/reservations.png'
import tcnCentres from '@/assets/work/tcn/centres.png'
import tcnPreview from '@/assets/work/tcn/preview.png'
import tcnSermons from '@/assets/work/tcn/sermons.png'
import tcnWelcome from '@/assets/work/tcn/welcome.png'

export interface WorkTag {
  label: string
  filled?: boolean
}

export interface WorkProject {
  id: string
  category: string
  title: string
  year: string
  techStack: string[]
  tags: WorkTag[]
  image: string
  imageAlt: string
  liveUrl?: string
  caseStudyUrl?: string
}

export interface WorkCaseStudyGalleryItem {
  image: string
  alt: string
  caption: string
}

export interface WorkCaseStudy {
  id: string
  title: string
  client: string
  role: string
  year: string
  techStack: string[]
  tags: WorkTag[]
  overview: string
  challenge: string
  solution: string
  outcome: string
  liveUrl?: string
  gallery: WorkCaseStudyGalleryItem[]
}

export const workSectionIntro = {
  title: '/MY WORK',
  subtext:
    "Solutions I've passionately worked on — meticulously crafted with purpose over the years.",
}

/** Newest projects first. */
export const workProjects: WorkProject[] = [
  {
    id: 'roots-restaurants',
    category: 'Food & Hospitality',
    title: 'ROOTS RESTAURANTS',
    year: '2026',
    techStack: ['Next.js', 'TypeScript', 'Postgres'],
    tags: [
      { label: 'Next.js' },
      { label: 'TypeScript' },
      { label: 'Postgres' },
      { label: '2026', filled: true },
    ],
    image: rootsPreview,
    imageAlt: 'Roots Restaurant homepage preview',
    liveUrl: 'https://www.rootsrestaurants.co.uk/',
    caseStudyUrl: '/work/roots-restaurants',
  },
  {
    id: 'the-covenant-nation',
    category: 'Faith & Community',
    title: 'THE COVENANT NATION (TCN)',
    year: '2026',
    techStack: ['Next.js', 'TypeScript', 'Postgres'],
    tags: [
      { label: 'Next.js' },
      { label: 'TypeScript' },
      { label: 'Postgres' },
      { label: '2026', filled: true },
    ],
    image: tcnPreview,
    imageAlt: 'The Covenant Nation UK homepage preview',
    liveUrl: 'https://tcn.ojsolutions.co.uk/',
    caseStudyUrl: '/work/the-covenant-nation',
  },
  {
    id: 'calaya-engineering',
    category: 'Engineering & Operations',
    title: 'CALAYA ENGINEERING SERVICES',
    year: '2025',
    techStack: ['Next.js', 'TypeScript', 'SQL'],
    tags: [
      { label: 'Next.js' },
      { label: 'TypeScript' },
      { label: 'SQL' },
      { label: '2025', filled: true },
    ],
    image: calayaPreview,
    imageAlt: 'Calaya Engineering Services homepage preview',
    liveUrl: 'https://www.calayaengineering.com',
    caseStudyUrl: '/work/calaya-engineering',
  },
  {
    id: 'kentoks-kitchen',
    category: 'Food & Hospitality',
    title: "KENTOK'S KITCHEN",
    year: '2024',
    techStack: ['React', 'Firebase', 'Tailwind CSS'],
    tags: [
      { label: 'React' },
      { label: 'Firebase' },
      { label: 'Tailwind CSS' },
      { label: '2024', filled: true },
    ],
    image: kentoksPreview,
    imageAlt: "Kentok's Kitchen device mockup preview",
    liveUrl: 'https://kentokskitchen.com/',
    caseStudyUrl: '/work/kentoks-kitchen',
  },
]

export const workCaseStudies: Record<string, WorkCaseStudy> = {
  'roots-restaurants': {
    id: 'roots-restaurants',
    title: 'Roots Restaurant',
    client: 'Roots Restaurant, Bar & Events',
    role: 'Product design & engineering',
    year: '2026',
    techStack: ['Next.js', 'TypeScript', 'Postgres'],
    tags: [
      { label: 'Next.js' },
      { label: 'TypeScript' },
      { label: 'Postgres' },
      { label: '2026', filled: true },
    ],
    overview:
      'The client needed to re-optimise an existing restaurant platform. The brief was a full visual and structural revamp, paired with a working automated system to manage bookings, keep customers informed, and track operational activity internally with far less friction.',
    challenge:
      'The existing site no longer reflected the Roots brand, and booking workflows were fragmented. Staff lacked a reliable way to track reservation activity end to end, while guests needed clearer, more dependable communication around their tables.',
    solution:
      'I delivered a premium brand-led redesign across home, menu, gallery, and reservations, and implemented an automated booking setup that confirms weekday and early-weekend reservations instantly, routes later weekend requests for review, and gives the team a clearer internal trail of every booking that comes in.',
    outcome:
      'Roots now runs on a cohesive digital experience at rootsrestaurants.co.uk — position, presentation, and operations aligned. Guests can browse, reserve, and stay informed, while the team tracks bookings and venue activity through one streamlined system.',
    liveUrl: 'https://www.rootsrestaurants.co.uk/',
    gallery: [
      {
        image: rootsMenu,
        alt: "Roots Restaurant chef's specials menu",
        caption: 'Menu sections rebuilt for clarity, from chef specials to drinks and swallow.',
      },
      {
        image: rootsReservations,
        alt: 'Roots Restaurant reservations and booking form',
        caption: 'Automated reservations flow with confirmation rules, opening hours, and venue details.',
      },
      {
        image: rootsGallery,
        alt: 'Roots Restaurant gallery and events',
        caption: 'Gallery and events presentation for food, venue, and nightlife atmosphere.',
      },
    ],
  },
  'the-covenant-nation': {
    id: 'the-covenant-nation',
    title: 'The Covenant Nation (TCN)',
    client: 'The Covenant Nation UK',
    role: 'Product design & engineering',
    year: '2026',
    techStack: ['Next.js', 'TypeScript', 'Postgres'],
    tags: [
      { label: 'Next.js' },
      { label: 'TypeScript' },
      { label: 'Postgres' },
      { label: '2026', filled: true },
    ],
    overview:
      'The client required a full revamp and restructure of their digital presence, alongside an internal system to manage members, prayer requests, and day-to-day church operations. The goal was a public-facing experience that reflects the organisation at scale, and a backend that supports smooth, coordinated ministry across multiple centres.',
    challenge:
      'With five centres across the UK, the existing setup could not keep pace with growth. Information was scattered, internal workflows lacked consistency, and the public website no longer represented the clarity and warmth the church needed to offer first-time visitors and long-standing members alike.',
    solution:
      'I redesigned and restructured the public website around centres, events, sermons, and welcome journeys, and built an internal management layer for members, prayer requests, and core church activity — giving leadership and teams one place to coordinate operations with greater visibility and control.',
    outcome:
      'TCN now operates through a unified digital platform at tcn.ojsolutions.co.uk: a refined public experience for discovery and engagement, supported by internal tooling that streamlines member care, prayer follow-up, and church administration across the organisation.',
    liveUrl: 'https://tcn.ojsolutions.co.uk/',
    gallery: [
      {
        image: tcnCentres,
        alt: 'The Covenant Nation UK centres overview',
        caption: 'Centre discovery rebuilt so visitors can find their local congregation quickly.',
      },
      {
        image: tcnSermons,
        alt: 'The Covenant Nation UK centres and recent sermons',
        caption: 'Structured content across centres, events, and sermon media for ongoing engagement.',
      },
      {
        image: tcnWelcome,
        alt: 'The Covenant Nation UK welcome section',
        caption: 'Welcome and about experience shaped around covenant, community, and first-time visitors.',
      },
    ],
  },
  'calaya-engineering': {
    id: 'calaya-engineering',
    title: 'Calaya Engineering Services',
    client: 'Calaya Engineering Services Ltd.',
    role: 'Product design & engineering',
    year: '2025',
    techStack: ['Next.js', 'TypeScript', 'SQL'],
    tags: [
      { label: 'Next.js' },
      { label: 'TypeScript' },
      { label: 'SQL' },
      { label: '2025', filled: true },
    ],
    overview:
      'The client needed a full website that clearly communicated what Calaya does across the oil and gas sector, supported by an internal dashboard to manage operations among employees and staff. The goal was a credible public presence and a practical system for day-to-day coordination behind the scenes.',
    challenge:
      'The existing digital presence did not reflect the breadth of Calaya’s services or the scale of the organisation. Internally, teams lacked a centralised dashboard to manage workflows, track activity, and keep staff aligned across engineering and operational functions.',
    solution:
      'I designed and built a structured public website covering services, strengths, and company positioning, and delivered an internal operations dashboard for staff — giving Calaya a clearer external story and a more controlled environment for managing internal activity.',
    outcome:
      'Calaya now presents its services with clarity and authority, while staff operate through an internal dashboard built to support smoother coordination, visibility, and day-to-day management across the organisation.',
    liveUrl: 'https://www.calayaengineering.com',
    gallery: [
      {
        image: calayaServices,
        alt: 'Calaya Engineering Services overview',
        caption: 'Service categories presented with clarity across well services, corrosion, inspection, and pipeline work.',
      },
      {
        image: calayaServicesMenu,
        alt: 'Calaya Engineering Services what we do menu',
        caption: 'Structured navigation for the full scope of engineering and operational services.',
      },
      {
        image: calayaStrengths,
        alt: 'Calaya Engineering key strengths',
        caption: 'Key strengths and credibility signals supporting the company’s market positioning.',
      },
    ],
  },
  'kentoks-kitchen': {
    id: 'kentoks-kitchen',
    title: "Kentok's Kitchen",
    client: "Kentok's Kitchen",
    role: 'Product design & engineering',
    year: '2024',
    techStack: ['React', 'Firebase', 'Tailwind CSS'],
    tags: [
      { label: 'React' },
      { label: 'Firebase' },
      { label: 'Tailwind CSS' },
      { label: '2024', filled: true },
    ],
    overview:
      'The vendor needed a system to manage orders from the large customer base she had acquired, and to keep a clearer track of every order that came in. That is why this platform was created for the client — a simple, branded channel for browsing dishes, placing orders, and following the flow from menu to checkout.',
    challenge:
      'As demand grew, informal order tracking was no longer enough. The kitchen needed one place customers could order from, while the vendor kept a reliable record of what came in, what was in the cart, and what was ready for fulfilment.',
    solution:
      "I built a food ordering experience tailored to Kentok's Kitchen: a clear home and menu for discovery, an organised cart for quantities and totals, and a structure designed around managing a high volume of incoming orders without losing the brand feel.",
    outcome:
      'The client now has a dedicated system to manage the order stream from her growing customer base, with screens that support discovering dishes, reviewing the cart, and processing orders in a calmer, more trackable way.',
    liveUrl: 'https://kentokskitchen.com/',
    gallery: [
      {
        image: kentoksHero,
        alt: "Kentok's Kitchen homepage and welcome hero",
        caption: 'Home experience built around welcoming returning customers and driving orders.',
      },
      {
        image: kentoksMenu,
        alt: "Kentok's Kitchen main dishes menu",
        caption: 'Menu grid for browsing dishes and pricing at a glance.',
      },
      {
        image: kentoksCategories,
        alt: "Kentok's Kitchen categories and value proposition",
        caption: 'Popular categories and ordering journey touchpoints, from browse to delivery confirmation.',
      },
      {
        image: kentoksCart,
        alt: "Kentok's Kitchen cart and checkout",
        caption: 'Cart management for quantities, removals, totals, and checkout — better order tracking for the vendor.',
      },
    ],
  },
}

export function getWorkCaseStudy(id: string): WorkCaseStudy | undefined {
  return workCaseStudies[id]
}

export function isInternalWorkPath(url?: string): boolean {
  return Boolean(url && url.startsWith('/'))
}
