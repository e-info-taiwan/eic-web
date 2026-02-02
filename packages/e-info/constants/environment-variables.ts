// 這裡管理的是在 Build 階段就會寫死數值的環境變數 (通常為 `NEXT_PUBLCI_` 開頭)
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
let SITE_URL: string
let GA_TRACKING_ID: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: string
let GOOGLE_ADSENSE_AD_CLIENT: string
switch (ENV) {
  case 'prod':
    SITE_URL = 'e-info.org.tw'
    GA_TRACKING_ID = 'G-3G2CB5BM24'
    GTM_ID = 'GTM-5K476LW'
    GLOBAL_CACHE_SETTING = 'public, max-age=300'
    GOOGLE_ADSENSE_AD_CLIENT = 'ca-pub-9990785780499264'
    break

  case 'staging':
    SITE_URL = 'staging.e-info.org.tw'
    GA_TRACKING_ID = 'G-3G2CB5BM24'
    GTM_ID = 'GTM-5K476LW'
    GLOBAL_CACHE_SETTING = 'public, max-age=300'
    GOOGLE_ADSENSE_AD_CLIENT = 'ca-pub-9990785780499264'
    break

  case 'dev':
    SITE_URL = 'eic-web-dev-1090198686704.asia-east1.run.app'
    GA_TRACKING_ID = 'G-3G2CB5BM24'
    GTM_ID = 'GTM-5K476LW'
    GLOBAL_CACHE_SETTING = 'no-store'
    GOOGLE_ADSENSE_AD_CLIENT = 'ca-pub-9990785780499264'
    break

  default:
    SITE_URL = 'localhost'
    GA_TRACKING_ID = 'G-3G2CB5BM24'
    GTM_ID = 'GTM-5K476LW'
    GLOBAL_CACHE_SETTING = 'no-store'
    GOOGLE_ADSENSE_AD_CLIENT = 'ca-pub-9990785780499264'
    break
}

export {
  ENV,
  GA_TRACKING_ID,
  GLOBAL_CACHE_SETTING,
  GOOGLE_ADSENSE_AD_CLIENT,
  GTM_ID,
  SITE_URL,
}
