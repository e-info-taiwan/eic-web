// Cloudflare Turnstile type declarations
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

interface TurnstileOptions {
  sitekey: string
  callback: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
}

interface Turnstile {
  render: (container: string | HTMLElement, options: TurnstileOptions) => string
  remove: (widgetId: string) => void
  reset: (widgetId: string) => void
  getResponse: (widgetId: string) => string | undefined
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

export {}
