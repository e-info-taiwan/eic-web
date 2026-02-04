const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// 這裡管理的是在 runtime 時，可被設定的環境變數 (通常沒有 `NEXT_PUBLIC_` 作為開頭)
const USE_MOCK_SERVER = (process.env.USE_MOCK_SERVER ?? 'false') === 'true'
const MOCK_API_SERVER_PORT = Number(process.env.MOCK_API_SERVER_PORT ?? 4000)
// const MISO_API_KEY = 'IHtn9b9tfPsO1EQpGV74OMf2syhELb6XVZe8u9FT'

// Mailchimp Configuration
// API Key format: <key>-<dc> where dc is the data center (e.g., us21)
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY ?? ''
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID ?? ''
// Server prefix is derived from API key (last part after hyphen) or set explicitly
const MAILCHIMP_SERVER_PREFIX =
  process.env.MAILCHIMP_SERVER_PREFIX ??
  (MAILCHIMP_API_KEY.split('-').pop() || '')

let API_ENDPOINT = ''
let FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

switch (ENV) {
  case 'prod':
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    FIREBASE_CONFIG = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    }
    break
  case 'staging':
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    FIREBASE_CONFIG = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    }
    break
  case 'dev':
  default:
    API_ENDPOINT =
      'https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql'
    FIREBASE_CONFIG = {
      // e-info-dev
      apiKey: 'AIzaSyCEk2WxBeqiuTI6Xjh1QOkK-mpJXJlGWoc',
      authDomain: 'e-info-dev.firebaseapp.com',
      projectId: 'e-info-dev',
      storageBucket: 'e-info-dev.firebasestorage.app',
      messagingSenderId: '503550465964',
      appId: '1:503550465964:web:1f1f075c8165fb88b3cc09',
    }
    break
}

if (USE_MOCK_SERVER) API_ENDPOINT = `http://localhost:${MOCK_API_SERVER_PORT}/`

// 環境變數優先覆蓋 Firebase 設定（各欄位獨立檢查）
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  FIREBASE_CONFIG.apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
}
if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  FIREBASE_CONFIG.authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
}
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  FIREBASE_CONFIG.projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}
if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  FIREBASE_CONFIG.storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
}
if (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
  FIREBASE_CONFIG.messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
}
if (process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  FIREBASE_CONFIG.appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

export {
  API_ENDPOINT,
  FIREBASE_CONFIG,
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID,
  MAILCHIMP_SERVER_PREFIX,
  MOCK_API_SERVER_PORT,
}
