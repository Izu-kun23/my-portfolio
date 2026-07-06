import calayaLogo from '@/assets/logos/calaya.png'
import heedLogo from '@/assets/logos/heed.svg'
import klarnowLogo from '@/assets/logos/klarnow.svg'

export interface AboutStat {
  value: string
  label: string
}

export interface ExperienceEntry {
  id: string
  period: string
  periodBold?: boolean
  role: string
  company: string
  summary: string
  highlights: string[]
  tags: string[]
  logo?: string
  logoAlt?: string
  /** Dark logo artwork that must be inverted to stay visible on dark surfaces. */
  logoInvert?: boolean
}

export const aboutIntro = {
  headline: 'Engineer first, but the craft is the point.',
  experienceSubtext:
    'Skills I have learned and gained over the years in different environments',
  paragraphs: [
    'I am Izuchukwu Tony, a software engineer who builds interfaces that feel as considered as they look — fast, accessible, and deliberate down to the easing curve.',
    'My work sits where product thinking meets motion design: shipping real features, then refining the details most teams never get to.',
  ],
}

export const aboutStats: AboutStat[] = [
  { value: '04+', label: 'Years of experience' },
  { value: '18', label: 'Projects shipped' },
  { value: '03', label: 'Teams embedded with' },
]

export const experienceEntries: ExperienceEntry[] = [
  {
    id: 'heed',
    period: '2026',
    periodBold: true,
    role: 'Chief Technology Officer',
    company: 'Heed Technologies',
    summary:
      'Founding CTO responsible for building Heed’s technical infrastructure from the ground up, leading development of the company’s web application and the internal tools it runs on.',
    highlights: [
      'Led the design and development of the company’s web application.',
      'Established the cloud and web service architecture from the ground up.',
      'Built the internal tools required to run and scale the business.',
      'Owned all technical decisions end to end, from systems architecture to deployment.',
    ],
    tags: ['Infrastructure', 'Cloud', 'Web App'],
    logo: heedLogo,
    logoAlt: 'Heed Technologies logo',
    logoInvert: true,
  },
  {
    id: 'klarnow',
    period: '2025 — Present',
    periodBold: true,
    role: 'Software Engineer (Front-End Development)',
    company: 'Klarnow',
    summary:
      'Front-end developer and software engineer responsible for building Klarnow’s internal systems and client-facing solutions, from agency workflows to client project delivery.',
    highlights: [
      'Designed and delivered the majority of internal tools used to run agency operations.',
      'Built infrastructure supporting company-wide workflows.',
      'Executed client projects from concept through delivery.',
      'Led front-end development across internal and client-facing products.',
    ],
    tags: ['Frontend', 'Internal Tools', 'Infrastructure'],
    logo: klarnowLogo,
    logoAlt: 'Klarnow logo',
    logoInvert: true,
  },
  {
    id: 'calaya',
    period: '2025',
    periodBold: true,
    role: 'Software Engineer',
    company: 'Calaya',
    summary:
      'Software engineer overseeing the technical operations of the company, responsible for the internal management system and the ongoing health of Calaya’s live systems and websites.',
    highlights: [
      'Built and maintained the internal management system.',
      'Ran ongoing inspection and QA on live systems to ensure consistent uptime and performance.',
      'Managed the maintenance and updates of the company’s websites.',
      'Oversaw the technical operations of the company.',
    ],
    tags: ['Systems', 'Management', 'Web'],
    logo: calayaLogo,
    logoAlt: 'Calaya logo',
  },
]

export function getCompanyInitials(company: string): string {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
