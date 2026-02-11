// 這裡管理的是在 Build 階段就會寫死數值的環境變數 (通常為 `NEXT_PUBLCI_` 開頭)
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
let SITE_URL: string
let GA_TRACKING_ID: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: string
let GOOGLE_CSE_ID: string
switch (ENV) {
  case 'prod':
    SITE_URL = 'e-info.org.tw'
    GA_TRACKING_ID = 'G-3G2CB5BM24'
    GTM_ID = 'GTM-5K476LW'
    GLOBAL_CACHE_SETTING = 'public, max-age=300'
    GOOGLE_CSE_ID = 'e7af92d93bc65444d'
    break

  case 'dev':
    SITE_URL = 'eic-web-dev-1090198686704.asia-east1.run.app'
    GA_TRACKING_ID = 'G-9FMKSK8LLR'
    GTM_ID = ''
    GLOBAL_CACHE_SETTING = 'no-store'
    GOOGLE_CSE_ID = 'e7af92d93bc65444d'
    break

  default:
    SITE_URL = 'localhost'
    GA_TRACKING_ID = 'G-9FMKSK8LLR'
    GTM_ID = ''
    GLOBAL_CACHE_SETTING = 'no-store'
    GOOGLE_CSE_ID = 'e7af92d93bc65444d'
    break
}

// Preview mode: 強制不快取，確保草稿內容即時反映
if (process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true') {
  GLOBAL_CACHE_SETTING = 'no-store'
}

// Cloudflare Turnstile (public site key for frontend widget)
// Must use NEXT_PUBLIC_ prefix to be available in client-side code
// If not set, Turnstile protection is disabled (graceful degradation)
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export {
  ENV,
  GA_TRACKING_ID,
  GLOBAL_CACHE_SETTING,
  GOOGLE_CSE_ID,
  GTM_ID,
  SITE_URL,
  TURNSTILE_SITE_KEY,
}
