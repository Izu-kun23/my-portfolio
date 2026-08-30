const MEASUREMENT_ID = 'G-BJD4VRDT00'

type GtagCommand = 'config' | 'event' | 'js'
type GtagArguments = [GtagCommand, string | Date, Record<string, unknown>?]

declare global {
  interface Window {
    dataLayer: GtagArguments[]
    gtag: (...args: GtagArguments) => void
  }
}

export function initializeGoogleAnalytics() {
  if (!import.meta.env.PROD || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: GtagArguments) => {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackPageView(path: string) {
  if (!import.meta.env.PROD || typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: new URL(path, window.location.origin).href,
    page_path: path,
  })
}
