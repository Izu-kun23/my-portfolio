export type SocialIcon = 'github' | 'linkedin'

export interface SocialLink {
  label: string
  href: string
  icon: SocialIcon
}

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/', icon: 'linkedin' },
]
